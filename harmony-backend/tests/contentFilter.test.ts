/**
 * Unit tests for ContentFilter (§12 Security and Privacy, AC-8)
 *
 * Covers:
 *  - PII redaction: emails, phone numbers, @mentions
 *  - Profanity filtering: word list, case-insensitive
 *  - XSS / HTML attribute injection escaping via sanitizeForHead
 *  - Snapshot test: crafted XSS fixture produces safe <head> output
 *  - Integration with metaTagService: generated tags exclude flagged content
 */

import { ContentFilter } from '../src/services/metaTag/contentFilter';
import { metaTagService } from '../src/services/metaTag/metaTagService';
import type { ChannelContext, MessageContext } from '../src/services/metaTag/types';

jest.mock('../src/services/cache.service', () => ({
  cacheService: {
    get: jest.fn(),
    set: jest.fn(),
    invalidate: jest.fn(),
    getOrRevalidate: jest.fn(),
  },
  CacheKeys: {
    metaChannel: (id: string) => `meta:channel:${id}`,
    channelVisibility: (id: string) => `channel:${id}:visibility`,
    channelMessages: (id: string, page: number) => `channel:msgs:${id}:page:${page}`,
    serverInfo: (id: string) => `server:${id}:info`,
    analysisChannel: (id: string) => `analysis:channel:${id}`,
  },
  sanitizeKeySegment: (s: string) => s.replace(/[*?\[\]]/g, ''),
}));

// ─── PII fixture corpus ───────────────────────────────────────────────────────

describe('ContentFilter.filterPII — PII fixture corpus (AC-8)', () => {
  it('redacts email addresses', () => {
    expect(ContentFilter.filterPII('Contact alice@example.com for details'))
      .toBe('Contact [email] for details');
  });

  it('redacts multiple emails in one string', () => {
    const result = ContentFilter.filterPII('From bob@foo.org to carol@bar.net');
    expect(result).not.toContain('@');
    expect(result).toContain('[email]');
  });

  it('redacts US phone numbers (dashes)', () => {
    const result = ContentFilter.filterPII('Call 555-867-5309 now');
    expect(result).not.toContain('555-867-5309');
    expect(result).toContain('[phone]');
  });

  it('redacts US phone numbers with parens', () => {
    const result = ContentFilter.filterPII('(555) 123-4567 is the number');
    expect(result).not.toContain('(555) 123-4567');
    expect(result).toContain('[phone]');
  });

  it('redacts @mentions', () => {
    expect(ContentFilter.filterPII('Thanks @alice and @bob.smith!'))
      .toBe('Thanks [user] and [user]!');
  });

  it('passes clean text unchanged', () => {
    const clean = 'The channel discusses game development and coding tips.';
    expect(ContentFilter.filterPII(clean)).toBe(clean);
  });
});

// ─── Profanity fixture corpus ──────────────────────────────────────────────────

describe('ContentFilter.filterProfanity — profanity fixture corpus (AC-8)', () => {
  it('replaces profanity with asterisks of matching length', () => {
    const result = ContentFilter.filterProfanity('This is damn annoying');
    expect(result).toBe('This is **** annoying');
  });

  it('is case-insensitive', () => {
    expect(ContentFilter.filterProfanity('What the HELL is this?'))
      .toBe('What the **** is this?');
  });

  it('filters multiple profanity words', () => {
    const result = ContentFilter.filterProfanity('holy shit that was ass');
    expect(result).not.toMatch(/shit|ass/i);
    expect(result).toContain('***');
  });

  it('does not alter clean text', () => {
    const clean = 'Welcome to the design and architecture discussion.';
    expect(ContentFilter.filterProfanity(clean)).toBe(clean);
  });
});

// ─── filterContent (pipeline) ─────────────────────────────────────────────────

describe('ContentFilter.filterContent — combined pipeline (AC-8)', () => {
  it('applies PII then profanity filter', () => {
    const input = 'Contact damn@example.com or call @baduser';
    const result = ContentFilter.filterContent(input);
    expect(result).not.toContain('@example.com');
    expect(result).toContain('[email]');
    expect(result).toContain('[user]');
  });
});

// ─── XSS / HTML injection ────────────────────────────────────────────────────

describe('ContentFilter.escapeHtml — XSS prevention', () => {
  it('escapes < and > and /', () => {
    expect(ContentFilter.escapeHtml('<script>alert(1)</script>'))
      .toBe('&lt;script&gt;alert(1)&lt;&#x2F;script&gt;');
  });

  it('escapes double quotes', () => {
    expect(ContentFilter.escapeHtml('say "hello"')).toBe('say &quot;hello&quot;');
  });

  it('escapes single quotes', () => {
    expect(ContentFilter.escapeHtml("it's fine")).toBe('it&#x27;s fine');
  });

  it('escapes ampersand', () => {
    expect(ContentFilter.escapeHtml('cats & dogs')).toBe('cats &amp; dogs');
  });

  it('escapes forward slash (closes script context)', () => {
    expect(ContentFilter.escapeHtml('</script>')).toBe('&lt;&#x2F;script&gt;');
  });

  it('passes plain text through unchanged', () => {
    const clean = 'TypeScript channel on Game Dev Hub';
    expect(ContentFilter.escapeHtml(clean)).toBe(clean);
  });
});

describe('ContentFilter.sanitizeForHead — attribute injection prevention', () => {
  it('strips HTML tags then HTML-encodes', () => {
    const malicious = '<b onmouseover="alert(1)">bold</b>';
    const result = ContentFilter.sanitizeForHead(malicious);
    expect(result).not.toContain('<');
    expect(result).not.toContain('>');
    expect(result).not.toContain('onmouseover');
    expect(result).toContain('bold');
  });

  it('rejects attribute injection via crafted customTitle', () => {
    // Attempt to break out of a meta content attribute: content=" onload="alert(1)"
    // HTML-encoding the quotes prevents breaking out of the attribute value.
    const injection = '" onload="alert(1)';
    const result = ContentFilter.sanitizeForHead(injection);
    // Unencoded quotes must not be present (they are the escape vector)
    expect(result).not.toContain('"');
    // Encoded form must be present (proving encoding happened)
    expect(result).toContain('&quot;');
  });

  it('rejects script tag injection via crafted customDescription', () => {
    // Tags are stripped; remaining text content is harmless plain text.
    const injection = '</meta><script>document.cookie</script>';
    const result = ContentFilter.sanitizeForHead(injection);
    // Unencoded angle brackets must not be present
    expect(result).not.toContain('<script>');
    expect(result).not.toContain('</script>');
    expect(result).not.toContain('<');
    expect(result).not.toContain('>');
  });

  it('collapses extra whitespace after stripping tags', () => {
    const input = '  hello   <b>world</b>  ';
    expect(ContentFilter.sanitizeForHead(input)).toBe('hello world');
  });
});

// ─── <head> output snapshot — XSS fixture (AC-8) ─────────────────────────────

describe('<head> output snapshot — crafted XSS fixture', () => {
  const XSS_FIXTURES = [
    {
      label: 'script tag injection',
      input: '<script>alert("xss")</script>Best channel ever',
      // After strip + escape: no script, text content escaped
    },
    {
      label: 'attribute breakout via double quote',
      input: '" onload="evil()',
    },
    {
      label: 'attribute breakout via single quote',
      input: "' onclick='evil()",
    },
    {
      label: 'SVG with event handler',
      input: '<svg onload=alert(1)>harmless text</svg>',
    },
    {
      label: 'iframe injection',
      input: '<iframe src="javascript:alert(1)">fallback</iframe>',
    },
  ];

  it.each(XSS_FIXTURES)('sanitizeForHead blocks $label', ({ input }) => {
    const output = ContentFilter.sanitizeForHead(input);
    // No unencoded angle brackets (these are the tag injection vector)
    expect(output).not.toContain('<');
    expect(output).not.toContain('>');
    // No unencoded quotes (these are the attribute breakout vector)
    expect(output).not.toContain('"');
    expect(output).not.toContain("'");
    // No unencoded javascript: URI (attribute breakout required for this to fire, already blocked above)
    expect(output).not.toMatch(/^javascript:/i);
  });

  it('snapshot: XSS customTitle renders as safe escaped string for <head>', () => {
    const maliciousTitle = '<script>alert("xss")</script>Best Channel & Community';
    const safe = ContentFilter.sanitizeForHead(maliciousTitle);
    // Simulate embedding in a <meta> content attribute value
    const metaTag = `<meta name="title" content="${safe}" />`;
    expect(metaTag).toMatchSnapshot();
  });

  it('snapshot: XSS customDescription with attribute breakout is safe', () => {
    const maliciousDesc = 'Great channel" onload="stealCookies() & more';
    const safe = ContentFilter.sanitizeForHead(maliciousDesc);
    const metaTag = `<meta name="description" content="${safe}" />`;
    expect(metaTag).toMatchSnapshot();
  });
});

// ─── Integration: generated tags exclude PII / profanity (AC-8) ───────────────

describe('metaTagService — generated tags exclude flagged content (AC-8)', () => {
  const channel: ChannelContext = {
    id: 'chan-pii',
    name: 'support',
    slug: 'support',
    serverName: 'Tech Help',
    serverSlug: 'tech-help',
    canonicalUrl: 'https://harmony.chat/c/tech-help/support',
  };

  it('PII in message content is not present in generated title or description', async () => {
    const messages: MessageContext[] = [
      { content: 'Email me at private@user.com or call 555-123-4567', createdAt: new Date() },
    ];
    const tags = await metaTagService.generateMetaTagsFromContext(channel, messages);
    expect(tags.title).not.toContain('@');
    expect(tags.title).not.toContain('private@user.com');
    expect(tags.description).not.toContain('private@user.com');
    expect(tags.description).not.toContain('555-123-4567');
  });

  it('profanity in message content is replaced in generated description', async () => {
    const messages: MessageContext[] = [
      { content: 'This is absolute bullshit and damn annoying', createdAt: new Date() },
    ];
    const tags = await metaTagService.generateMetaTagsFromContext(channel, messages);
    expect(tags.description).not.toMatch(/bullshit|damn/i);
  });

  it('sanitizeCustomOverride strips HTML and escapes for <head>', () => {
    const result = metaTagService.sanitizeCustomOverride('<b>Hello</b> & "world"');
    expect(result).toBe('Hello &amp; &quot;world&quot;');
  });

  it('sanitizeCustomOverride returns null for null input', () => {
    expect(metaTagService.sanitizeCustomOverride(null)).toBeNull();
    expect(metaTagService.sanitizeCustomOverride(undefined)).toBeNull();
  });

  it('sanitizeCustomOverride filters PII before encoding', () => {
    const result = metaTagService.sanitizeCustomOverride('Contact admin@corp.com for help');
    expect(result).not.toContain('@');
    expect(result).toContain('[email]');
  });

  it('sanitizeCustomOverride blocks tag-splitting profanity bypass', () => {
    // "f<b>u</b>ck" splits the word across HTML tags — must be caught after stripping tags
    const result = metaTagService.sanitizeCustomOverride('f<b>u</b>ck this');
    expect(result).not.toMatch(/fuck/i);
    expect(result).not.toContain('<');
    expect(result).not.toContain('>');
  });

  it('sanitizeCustomOverride blocks tag-splitting email bypass', () => {
    const result = metaTagService.sanitizeCustomOverride('alice@<b>example</b>.com');
    expect(result).not.toContain('@');
    expect(result).not.toContain('<');
  });

  it('generated keywords do not contain PII fragments', async () => {
    const messages: MessageContext[] = [
      { content: 'Email me at secret@corp.com or call 555-123-4567 for support', createdAt: new Date() },
    ];
    const tags = await metaTagService.generateMetaTagsFromContext(channel, messages);
    const keywordStr = tags.keywords.join(' ');
    expect(keywordStr).not.toContain('secret');
    expect(keywordStr).not.toContain('corp');
    expect(keywordStr).not.toContain('555');
  });
});
