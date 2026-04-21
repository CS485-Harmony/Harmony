/**
 * CL-C3.4 TopicClassifier (dev spec §9.2.4).
 *
 * Deterministic keyword-bag classifier. Each topic has a seed vocabulary
 * used to score raw content; topics with at least one matching keyword
 * are considered, the rest fall back to the "general" bucket.
 *
 * The vocabulary is intentionally short — it biases recall for common
 * developer/community channel themes, and the production NLP path (future
 * work) is expected to replace this with a learned classifier.
 */

import { STOP_WORDS } from './stopWords';

const WORD_REGEX = /[a-z0-9][a-z0-9'-]*/gi;

const TOPIC_VOCAB: Readonly<Record<string, readonly string[]>> = {
  technology: [
    'code', 'coding', 'software', 'developer', 'programming', 'api', 'bug',
    'deploy', 'server', 'frontend', 'backend', 'database', 'typescript',
    'javascript', 'python', 'framework', 'library', 'github', 'commit',
  ],
  gaming: [
    'game', 'gaming', 'player', 'match', 'stream', 'quest', 'raid', 'boss',
    'server', 'multiplayer', 'guild', 'loot', 'level', 'speedrun',
  ],
  music: [
    'music', 'song', 'album', 'band', 'guitar', 'piano', 'drum', 'vocal',
    'concert', 'playlist', 'remix', 'genre', 'artist',
  ],
  art: [
    'art', 'drawing', 'painting', 'sketch', 'color', 'palette', 'illustration',
    'canvas', 'design', 'portfolio',
  ],
  education: [
    'study', 'learn', 'course', 'lesson', 'homework', 'exam', 'teacher',
    'student', 'textbook', 'lecture', 'assignment', 'class',
  ],
  sports: [
    'team', 'match', 'game', 'player', 'coach', 'score', 'goal', 'league',
    'tournament', 'practice', 'fitness',
  ],
  business: [
    'business', 'startup', 'customer', 'market', 'sales', 'revenue',
    'product', 'strategy', 'meeting', 'client', 'launch',
  ],
  community: [
    'welcome', 'hello', 'introduce', 'rules', 'announcement', 'event',
    'meetup', 'chat', 'friends', 'community',
  ],
};

const GENERAL_TOPIC = 'general';

export interface TopicScore {
  topic: string;
  score: number;
}

function tokenize(content: string): string[] {
  const matches = content.toLowerCase().match(WORD_REGEX);
  if (!matches) return [];
  return matches.filter((t) => !STOP_WORDS.has(t));
}

function scoreTopics(content: string): TopicScore[] {
  const tokens = tokenize(content);
  if (tokens.length === 0) return [];

  const tokenSet = new Set(tokens);
  const tokenCount = new Map<string, number>();
  for (const tok of tokens) {
    tokenCount.set(tok, (tokenCount.get(tok) ?? 0) + 1);
  }

  const scores: TopicScore[] = [];
  for (const [topic, vocab] of Object.entries(TOPIC_VOCAB)) {
    let score = 0;
    for (const term of vocab) {
      if (tokenSet.has(term)) {
        score += tokenCount.get(term) ?? 0;
      }
    }
    if (score > 0) {
      scores.push({ topic, score });
    }
  }

  return scores.sort((a, b) => (b.score - a.score) || a.topic.localeCompare(b.topic));
}

export const topicClassifier = {
  classify(content: string): string[] {
    if (!content) return [GENERAL_TOPIC];
    const scored = scoreTopics(content);
    if (scored.length === 0) return [GENERAL_TOPIC];
    return scored.map((s) => s.topic);
  },

  getTop(content: string, count: number): string[] {
    if (count <= 0) return [];
    const topics = this.classify(content);
    return topics.slice(0, count);
  },

  getKeywords(content: string): string[] {
    if (!content) return [];
    const scored = scoreTopics(content);
    if (scored.length === 0) return [];

    const tokenSet = new Set(tokenize(content));
    const matched = new Set<string>();
    for (const { topic } of scored) {
      for (const term of TOPIC_VOCAB[topic] ?? []) {
        if (tokenSet.has(term)) matched.add(term);
      }
    }
    return [...matched].sort();
  },
};
