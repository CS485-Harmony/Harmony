/**
 * CL-C3.1 ContentAnalyzer (dev spec §9.2.1).
 *
 * Orchestrates keyword extraction, summarization, and topic classification
 * for the MetaTag service (M2). Per §9.2.1 error handling: on NLP path
 * exception/timeout (>5s), return a deterministic fallback analysis so
 * the MetaTagService can still emit a template-only result.
 *
 * The "NLP path" is currently the deterministic implementation itself —
 * the spec calls for language-aware NLP later, at which point this
 * module becomes the race gate between NLP and fallback.
 */

import { keywordExtractor } from './keywordExtractor';
import { textSummarizer } from './textSummarizer';
import { topicClassifier } from './topicClassifier';
import type { AnalyzableMessage, ContentAnalysis } from './types';

const DEFAULT_TIMEOUT_MS = 5000;
const DEFAULT_MAX_KEYWORDS = 10;
const DEFAULT_SUMMARY_LENGTH = 160;
const DEFAULT_TOP_TOPICS = 3;

const POSITIVE_WORDS = new Set([
  'good', 'great', 'love', 'awesome', 'nice', 'happy', 'excellent',
  'amazing', 'fantastic', 'cool', 'wonderful', 'best', 'perfect',
  'thanks', 'welcome',
]);

const NEGATIVE_WORDS = new Set([
  'bad', 'hate', 'terrible', 'awful', 'broken', 'worst', 'angry',
  'sad', 'frustrated', 'bug', 'error', 'fail', 'failed', 'issue',
  'problem',
]);

export interface ContentAnalyzerOptions {
  timeoutMs?: number;
  maxKeywords?: number;
  summaryLength?: number;
  topTopics?: number;
  /**
   * Injectable NLP path for tests and the future language-aware analyzer.
   * When it rejects or exceeds `timeoutMs`, `analyzeThread` returns the
   * deterministic fallback instead — see dev spec §9.2.1.
   */
  nlpPath?: (content: string) => Promise<Partial<ContentAnalysis>>;
}

function joinMessages(messages: readonly AnalyzableMessage[]): string {
  return messages
    .map((m) => (m?.content ?? '').trim())
    .filter((content) => content.length > 0)
    .join('\n');
}

function countWords(content: string): number {
  return (content.match(/[a-z0-9][a-z0-9'-]*/gi) ?? []).length;
}

function averageWordLength(content: string): number {
  const words = content.match(/[a-z0-9][a-z0-9'-]*/gi) ?? [];
  if (words.length === 0) return 0;
  const total = words.reduce((sum, w) => sum + w.length, 0);
  return total / words.length;
}

function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const handle = setTimeout(
      () => reject(new Error(`content analysis timed out after ${timeoutMs}ms`)),
      timeoutMs,
    );
    promise.then(
      (value) => {
        clearTimeout(handle);
        resolve(value);
      },
      (err) => {
        clearTimeout(handle);
        reject(err);
      },
    );
  });
}

export function createContentAnalyzer(options: ContentAnalyzerOptions = {}) {
  const {
    timeoutMs = DEFAULT_TIMEOUT_MS,
    maxKeywords = DEFAULT_MAX_KEYWORDS,
    summaryLength = DEFAULT_SUMMARY_LENGTH,
    topTopics = DEFAULT_TOP_TOPICS,
    nlpPath,
  } = options;

  function deterministicAnalysis(content: string, usedFallback: boolean): ContentAnalysis {
    const keywords = keywordExtractor.extractKeywords(content, maxKeywords);
    const summary = textSummarizer.summarize(content, summaryLength)
      || textSummarizer.extractFirstSentence(content);
    const topics = topicClassifier.getTop(content, topTopics);

    return {
      keywords,
      topics,
      summary,
      sentiment: analyzer.getSentiment(content),
      readingLevel: analyzer.getReadingLevel(content),
      usedFallback,
    };
  }

  function emptyFallback(): ContentAnalysis {
    return {
      keywords: [],
      topics: ['general'],
      summary: '',
      sentiment: 'neutral',
      readingLevel: 'basic',
      usedFallback: false,
    };
  }

  const analyzer = {
    async analyzeThread(messages: readonly AnalyzableMessage[]): Promise<ContentAnalysis> {
      const content = joinMessages(messages);
      if (!content) return emptyFallback();

      if (!nlpPath) {
        return deterministicAnalysis(content, false);
      }

      try {
        const partial = await withTimeout(nlpPath(content), timeoutMs);
        const fallback = deterministicAnalysis(content, false);
        return {
          keywords: partial.keywords ?? fallback.keywords,
          topics: partial.topics ?? fallback.topics,
          summary: partial.summary ?? fallback.summary,
          sentiment: partial.sentiment ?? fallback.sentiment,
          readingLevel: partial.readingLevel ?? fallback.readingLevel,
          usedFallback: false,
        };
      } catch (err) {
        console.error('[contentAnalyzer] NLP path failed, using fallback:', err);
        return deterministicAnalysis(content, true);
      }
    },

    getTopicCategory(content: string): string[] {
      return topicClassifier.classify(content);
    },

    getSentiment(content: string): 'positive' | 'negative' | 'neutral' {
      if (!content) return 'neutral';
      const tokens = content.toLowerCase().match(/[a-z][a-z'-]*/g) ?? [];
      let score = 0;
      for (const tok of tokens) {
        if (POSITIVE_WORDS.has(tok)) score += 1;
        else if (NEGATIVE_WORDS.has(tok)) score -= 1;
      }
      if (score > 0) return 'positive';
      if (score < 0) return 'negative';
      return 'neutral';
    },

    getReadingLevel(content: string): 'basic' | 'intermediate' | 'advanced' {
      const wordCount = countWords(content);
      if (wordCount === 0) return 'basic';
      const avgLen = averageWordLength(content);
      // Simple heuristic; true Flesch-Kincaid is future NLP work.
      if (avgLen >= 6 || wordCount >= 400) return 'advanced';
      if (avgLen >= 4.5 || wordCount >= 120) return 'intermediate';
      return 'basic';
    },
  };

  return analyzer;
}

export const contentAnalyzer = createContentAnalyzer();
export type ContentAnalyzer = ReturnType<typeof createContentAnalyzer>;
