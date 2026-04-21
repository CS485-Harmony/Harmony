/**
 * Module M3 (Content Analysis) unit tests — Issue #351.
 *
 * Covers acceptance criteria:
 *   - Classes C3.1–C3.4 exist with spec'd method signatures.
 *   - ContentAnalyzer.analyzeThread returns keywords, summary, topic for a fixture thread.
 *   - Deterministic fallback returns a valid result when the NLP path is stubbed to fail.
 *   - Stop-word filtering, frequency scoring, summarization, classification, timeout/fallback paths.
 */

import {
  contentAnalyzer,
  createContentAnalyzer,
  keywordExtractor,
  textSummarizer,
  topicClassifier,
} from '../src/services/contentAnalysis';
import type { AnalyzableMessage, ContentAnalysis } from '../src/services/contentAnalysis';

const FIXTURE_THREAD: AnalyzableMessage[] = [
  { id: 'm1', content: 'Welcome to the TypeScript channel! We discuss TypeScript, JavaScript, and Node.js.' },
  { id: 'm2', content: 'Today the team shipped a new backend API and fixed a tricky bug in the server.' },
  { id: 'm3', content: 'The backend team loves TypeScript because the type system catches bugs early.' },
  { id: 'm4', content: 'Thanks everyone for the great feedback on the new deploy pipeline.' },
];

describe('KeywordExtractor (C3.2)', () => {
  it('filters stop words and returns frequency-ranked keywords', () => {
    const content = 'The the the typescript typescript typescript backend backend server';
    const keywords = keywordExtractor.extractKeywords(content, 5);
    expect(keywords).not.toContain('the');
    expect(keywords[0]).toBe('typescript');
    expect(keywords).toContain('backend');
    expect(keywords).toContain('server');
  });

  it('respects maxKeywords cap', () => {
    const content = 'alpha beta gamma delta epsilon zeta eta theta iota kappa';
    expect(keywordExtractor.extractKeywords(content, 3)).toHaveLength(3);
  });

  it('returns [] for empty input or non-positive max', () => {
    expect(keywordExtractor.extractKeywords('', 5)).toEqual([]);
    expect(keywordExtractor.extractKeywords('hello world', 0)).toEqual([]);
  });

  it('extractPhrases returns bigrams skipping stop-words', () => {
    const content = 'backend team backend team frontend team frontend team the quick fox';
    const phrases = keywordExtractor.extractPhrases(content, 5);
    expect(phrases).toContain('backend team');
    expect(phrases).toContain('frontend team');
    expect(phrases.some((p) => p.includes('the'))).toBe(false);
  });

  it('scoreByFrequency returns normalized frequency per keyword', () => {
    const content = 'typescript typescript typescript backend';
    const scored = keywordExtractor.scoreByFrequency(['typescript', 'backend', 'missing'], content);
    const ts = scored.find((s) => s.keyword === 'typescript')!;
    const be = scored.find((s) => s.keyword === 'backend')!;
    const missing = scored.find((s) => s.keyword === 'missing')!;
    expect(ts.score).toBeGreaterThan(be.score);
    expect(missing.score).toBe(0);
    expect(ts.score).toBeLessThanOrEqual(1);
  });
});

describe('TextSummarizer (C3.3)', () => {
  const content =
    'TypeScript adds types to JavaScript. The backend uses TypeScript everywhere. ' +
    'We deploy the backend with Docker. Docker makes deploys repeatable.';

  it('summarize respects target length and is non-empty', () => {
    const summary = textSummarizer.summarize(content, 80);
    expect(summary.length).toBeLessThanOrEqual(80);
    expect(summary.length).toBeGreaterThan(0);
  });

  it('summarize returns empty string for empty/zero input', () => {
    expect(textSummarizer.summarize('', 50)).toBe('');
    expect(textSummarizer.summarize(content, 0)).toBe('');
  });

  it('extractFirstSentence returns the first sentence verbatim', () => {
    expect(textSummarizer.extractFirstSentence(content)).toBe('TypeScript adds types to JavaScript.');
    expect(textSummarizer.extractFirstSentence('')).toBe('');
  });

  it('extractKeySentences returns at most maxSentences in original order', () => {
    const keys = textSummarizer.extractKeySentences(content, 2);
    expect(keys).toHaveLength(2);
    const sentences = content.split(/(?<=[.!?])\s+/);
    const orderedIndexes = keys.map((k) => sentences.indexOf(k));
    expect(orderedIndexes).toEqual([...orderedIndexes].sort((a, b) => a - b));
  });
});

describe('TopicClassifier (C3.4)', () => {
  it('classifies technology content', () => {
    const topics = topicClassifier.classify(
      'The backend team deployed a new TypeScript API and fixed a bug in the server.',
    );
    expect(topics[0]).toBe('technology');
  });

  it('falls back to "general" when no vocabulary hits', () => {
    expect(topicClassifier.classify('xx yy zz qq')).toEqual(['general']);
  });

  it('getTop respects count and ordering', () => {
    const topics = topicClassifier.getTop(
      'The gaming guild raided the boss and streamed the match on the server for the community.',
      2,
    );
    expect(topics).toHaveLength(2);
    expect(topics).toContain('gaming');
  });

  it('getTop with count <= 0 returns []', () => {
    expect(topicClassifier.getTop('code', 0)).toEqual([]);
  });

  it('getKeywords returns matched vocabulary tokens only', () => {
    const kw = topicClassifier.getKeywords(
      'We deploy the backend API with TypeScript — a great framework.',
    );
    expect(kw).toEqual(expect.arrayContaining(['deploy', 'backend', 'api', 'typescript', 'framework']));
    expect(kw).not.toContain('great');
  });
});

describe('ContentAnalyzer (C3.1)', () => {
  let errorSpy: jest.SpyInstance;
  beforeEach(() => {
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    errorSpy.mockRestore();
  });

  it('analyzeThread returns keywords, summary, topics, sentiment, reading level for fixture thread', async () => {
    const result = await contentAnalyzer.analyzeThread(FIXTURE_THREAD);
    expect(result.keywords.length).toBeGreaterThan(0);
    expect(result.keywords).toContain('typescript');
    expect(result.summary.length).toBeGreaterThan(0);
    expect(result.topics[0]).toBe('technology');
    expect(['positive', 'negative', 'neutral']).toContain(result.sentiment);
    expect(['basic', 'intermediate', 'advanced']).toContain(result.readingLevel);
  });

  it('returns empty fallback analysis for an empty thread', async () => {
    const result = await contentAnalyzer.analyzeThread([]);
    expect(result).toEqual<ContentAnalysis>({
      keywords: [],
      topics: ['general'],
      summary: '',
      sentiment: 'neutral',
      readingLevel: 'basic',
      usedFallback: false,
    });
  });

  it('getSentiment detects positive, negative, neutral', () => {
    expect(contentAnalyzer.getSentiment('This is great and I love it, thanks!')).toBe('positive');
    expect(contentAnalyzer.getSentiment('This is terrible, broken, and full of bugs.')).toBe('negative');
    expect(contentAnalyzer.getSentiment('The meeting is at three on Thursday.')).toBe('neutral');
    expect(contentAnalyzer.getSentiment('')).toBe('neutral');
  });

  it('getReadingLevel scales with word length / count', () => {
    expect(contentAnalyzer.getReadingLevel('cat dog run')).toBe('basic');
    expect(contentAnalyzer.getReadingLevel('extraordinarily complicated phenomenological consideration'))
      .toBe('advanced');
  });

  it('getTopicCategory delegates to classifier', () => {
    expect(contentAnalyzer.getTopicCategory('code and api and developer')).toContain('technology');
  });

  it('falls back deterministically when the injected NLP path throws', async () => {
    const analyzer = createContentAnalyzer({
      nlpPath: async () => {
        throw new Error('nlp exploded');
      },
    });
    const result = await analyzer.analyzeThread(FIXTURE_THREAD);
    expect(result.keywords.length).toBeGreaterThan(0);
    expect(result.topics[0]).toBe('technology');
    expect(result.summary.length).toBeGreaterThan(0);
    // AC-9: surface the fallback signal so MetaTagService can mark the
    // meta tag for regeneration (dev spec §9.2.1).
    expect(result.usedFallback).toBe(true);
  });

  it('falls back deterministically when the NLP path exceeds the timeout budget', async () => {
    const analyzer = createContentAnalyzer({
      timeoutMs: 50,
      nlpPath: () => new Promise<Partial<ContentAnalysis>>(() => {
        // never resolves — simulates hung NLP backend
      }),
    });
    const start = Date.now();
    const result = await analyzer.analyzeThread(FIXTURE_THREAD);
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(1000);
    expect(result.keywords).toContain('typescript');
    expect(result.topics[0]).toBe('technology');
    expect(result.usedFallback).toBe(true);
  });

  it('merges partial NLP output with deterministic fallback fields', async () => {
    const analyzer = createContentAnalyzer({
      nlpPath: async () => ({ keywords: ['nlp-only'], sentiment: 'positive' }),
    });
    const result = await analyzer.analyzeThread(FIXTURE_THREAD);
    expect(result.keywords).toEqual(['nlp-only']);
    expect(result.sentiment).toBe('positive');
    // fields NLP didn't return still come from the deterministic fallback
    expect(result.summary.length).toBeGreaterThan(0);
    expect(result.topics[0]).toBe('technology');
    // NLP succeeded (partial output is still success), so no regeneration needed.
    expect(result.usedFallback).toBe(false);
  });
});
