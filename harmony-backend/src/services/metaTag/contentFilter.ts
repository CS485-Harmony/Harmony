// CL-C2.6 ContentFilter — PII redaction, profanity filtering, and XSS-safe output for meta tags (§12)

// PII patterns
const EMAIL_RE = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;
// Covers common formats: (555) 123-4567, 555-123-4567, +1-555-123-4567, 5551234567
// TODO: tighten this pattern — currently matches digit sequences that are not phone numbers
// (e.g., long numeric IDs, dates like "2026-04-21"). Consider requiring 10+ digits after
// stripping separators or using a phone-parsing library. Track as a follow-up issue.
const PHONE_RE = /(\+?\d[\d\s\-().]{6,}\d)/g;
const MENTION_RE = /@[\w.]+/g;

// Profanity word list (representative; extend as needed)
// TODO: this list is bypassable via leetspeak, unicode homoglyphs, or internal spaces.
// Add a follow-up issue to integrate a more robust profanity detection approach before
// treating this as complete coverage.
const PROFANITY_LIST = [
  'fuck', 'shit', 'ass', 'bitch', 'bastard', 'crap', 'damn', 'hell',
  'cunt', 'dick', 'piss', 'cock', 'pussy', 'asshole', 'bullshit',
];
const PROFANITY_RE = new RegExp(`\\b(${PROFANITY_LIST.join('|')})\\b`, 'gi');

// HTML entities for XSS-safe output in <head> attributes/text
const HTML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
};

export const ContentFilter = {
  /**
   * Escape HTML special characters so text is safe to embed in <meta> tag
   * attributes or the document <head>. Does NOT strip tags — call stripHtml first
   * if the input may contain markup.
   */
  escapeHtml(text: string): string {
    return text.replace(/[&<>"'/]/g, (ch) => HTML_ESCAPE_MAP[ch] ?? ch);
  },

  /**
   * Replace emails, phone numbers, and @mentions with neutral placeholders
   * so PII cannot appear in search-engine-indexed meta tags.
   */
  filterPII(text: string): string {
    return text
      .replace(EMAIL_RE, '[email]')
      .replace(PHONE_RE, '[phone]')
      .replace(MENTION_RE, '[user]');
  },

  /**
   * Replace profanity with asterisks of matching length.
   */
  filterProfanity(text: string): string {
    return text.replace(PROFANITY_RE, (match) => '*'.repeat(match.length));
  },

  /**
   * Run the full content filter pipeline: PII → profanity.
   * Input is assumed to be plain text (HTML already stripped by generators).
   */
  filterContent(text: string): string {
    return ContentFilter.filterProfanity(ContentFilter.filterPII(text));
  },

  /**
   * Prepare a string for safe embedding inside an HTML <head> context.
   * Strips residual HTML tags then HTML-entity-encodes the result.
   * Use for customTitle / customDescription before storing or serving.
   */
  sanitizeForHead(text: string): string {
    const stripped = text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    return ContentFilter.escapeHtml(stripped);
  },
};
