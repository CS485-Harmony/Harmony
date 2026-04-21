/**
 * CL-C3.2 KeywordExtractor (dev spec §9.2.2).
 *
 * Deterministic, pure-function implementation: no external NLP calls so it
 * satisfies the "fallback returns a valid result within the timeout budget"
 * acceptance criterion on its own. The future NLP-backed extractor will
 * wrap this as a fast path degradation.
 */

import { STOP_WORDS } from './stopWords';
import type { ScoredKeyword } from './types';

const TOKEN_REGEX = /[a-z0-9][a-z0-9'-]*/gi;
const MIN_TOKEN_LENGTH = 3;

function tokenize(content: string): string[] {
  const matches = content.toLowerCase().match(TOKEN_REGEX);
  if (!matches) return [];
  return matches.filter(
    (token) => token.length >= MIN_TOKEN_LENGTH && !STOP_WORDS.has(token),
  );
}

function frequencyMap(tokens: readonly string[]): Map<string, number> {
  const freq = new Map<string, number>();
  for (const token of tokens) {
    freq.set(token, (freq.get(token) ?? 0) + 1);
  }
  return freq;
}

export const keywordExtractor = {
  extractKeywords(content: string, maxKeywords: number): string[] {
    if (!content || maxKeywords <= 0) return [];
    const tokens = tokenize(content);
    const freq = frequencyMap(tokens);

    // Sort by frequency desc, then alphabetical for determinism.
    return [...freq.entries()]
      .sort((a, b) => (b[1] - a[1]) || a[0].localeCompare(b[0]))
      .slice(0, maxKeywords)
      .map(([word]) => word);
  },

  extractPhrases(content: string, maxPhrases: number): string[] {
    if (!content || maxPhrases <= 0) return [];
    const lowered = content.toLowerCase();
    const rawTokens = lowered.match(TOKEN_REGEX) ?? [];

    // Build bigrams where neither token is a stop-word, preserving order.
    const bigramFreq = new Map<string, number>();
    for (let i = 0; i < rawTokens.length - 1; i++) {
      const a = rawTokens[i];
      const b = rawTokens[i + 1];
      if (a.length < MIN_TOKEN_LENGTH || b.length < MIN_TOKEN_LENGTH) continue;
      if (STOP_WORDS.has(a) || STOP_WORDS.has(b)) continue;
      const phrase = `${a} ${b}`;
      bigramFreq.set(phrase, (bigramFreq.get(phrase) ?? 0) + 1);
    }

    return [...bigramFreq.entries()]
      .sort((a, b) => (b[1] - a[1]) || a[0].localeCompare(b[0]))
      .slice(0, maxPhrases)
      .map(([phrase]) => phrase);
  },

  scoreByFrequency(keywords: string[], content: string): ScoredKeyword[] {
    if (!keywords.length || !content) return [];
    const tokens = tokenize(content);
    const freq = frequencyMap(tokens);
    const total = tokens.length || 1;

    return keywords.map((keyword) => {
      const count = freq.get(keyword.toLowerCase()) ?? 0;
      return { keyword, score: count / total };
    });
  },
};
