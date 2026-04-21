/**
 * CL-C3.3 TextSummarizer (dev spec §9.2.3).
 *
 * Extractive, deterministic summarizer. Ranks sentences by the frequency
 * of their non-stop-word tokens, which gives stable output for the
 * fallback path while being good enough for short-channel descriptions.
 */

import { STOP_WORDS } from './stopWords';

const SENTENCE_SPLIT = /(?<=[.!?])\s+(?=[A-Z0-9"'(])/;
const WORD_REGEX = /[a-z0-9][a-z0-9'-]*/gi;

function splitSentences(content: string): string[] {
  const trimmed = content.trim();
  if (!trimmed) return [];
  return trimmed
    .split(SENTENCE_SPLIT)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function scoreSentence(sentence: string, wordFreq: Map<string, number>): number {
  const words = sentence.toLowerCase().match(WORD_REGEX) ?? [];
  let score = 0;
  for (const word of words) {
    if (STOP_WORDS.has(word)) continue;
    score += wordFreq.get(word) ?? 0;
  }
  // Normalize by length so we don't bias toward long sentences.
  return words.length > 0 ? score / words.length : 0;
}

function buildWordFrequency(content: string): Map<string, number> {
  const freq = new Map<string, number>();
  const words = content.toLowerCase().match(WORD_REGEX) ?? [];
  for (const word of words) {
    if (STOP_WORDS.has(word)) continue;
    freq.set(word, (freq.get(word) ?? 0) + 1);
  }
  return freq;
}

function truncateAtBoundary(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  // Reserve one character for the appended ellipsis so the final string
  // never exceeds maxLength — the summarize() contract promises this bound.
  const budget = Math.max(1, maxLength - 1);
  const slice = text.slice(0, budget);
  const lastSpace = slice.lastIndexOf(' ');
  const boundary = lastSpace > budget * 0.6 ? lastSpace : slice.length;
  return `${slice.slice(0, boundary).trimEnd()}…`;
}

export const textSummarizer = {
  summarize(content: string, targetLength: number): string {
    if (!content) return '';
    if (targetLength <= 0) return '';

    const sentences = splitSentences(content);
    if (sentences.length === 0) return truncateAtBoundary(content.trim(), targetLength);
    if (sentences.length === 1) return truncateAtBoundary(sentences[0], targetLength);

    const wordFreq = buildWordFrequency(content);
    const ranked = sentences
      .map((sentence, index) => ({
        sentence,
        index,
        score: scoreSentence(sentence, wordFreq),
      }))
      // Highest scoring first; ties broken by original order for determinism.
      .sort((a, b) => (b.score - a.score) || (a.index - b.index));

    const picked: { sentence: string; index: number }[] = [];
    let length = 0;
    for (const candidate of ranked) {
      const projected = length + (picked.length ? 1 : 0) + candidate.sentence.length;
      if (projected > targetLength && picked.length > 0) continue;
      picked.push(candidate);
      length = projected;
      if (length >= targetLength) break;
    }

    if (picked.length === 0) {
      return truncateAtBoundary(sentences[0], targetLength);
    }

    // Restore original order in final summary.
    const ordered = [...picked].sort((a, b) => a.index - b.index);
    const joined = ordered.map((p) => p.sentence).join(' ');
    return truncateAtBoundary(joined, targetLength);
  },

  extractFirstSentence(content: string): string {
    const sentences = splitSentences(content);
    return sentences[0] ?? '';
  },

  extractKeySentences(content: string, maxSentences: number): string[] {
    if (!content || maxSentences <= 0) return [];
    const sentences = splitSentences(content);
    if (sentences.length === 0) return [];

    const wordFreq = buildWordFrequency(content);
    return sentences
      .map((sentence, index) => ({
        sentence,
        index,
        score: scoreSentence(sentence, wordFreq),
      }))
      .sort((a, b) => (b.score - a.score) || (a.index - b.index))
      .slice(0, maxSentences)
      .sort((a, b) => a.index - b.index)
      .map((entry) => entry.sentence);
  },
};
