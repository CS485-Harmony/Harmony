/**
 * English stop-word list used by KeywordExtractor and TopicClassifier.
 * Kept intentionally small and deterministic — full NLP stop-word lists
 * are delegated to the future NLP adapter. These are the high-frequency
 * tokens whose presence would otherwise dominate frequency scoring.
 */
export const STOP_WORDS: ReadonlySet<string> = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'if', 'then', 'else', 'of', 'for',
  'to', 'in', 'on', 'at', 'by', 'with', 'from', 'as', 'is', 'are', 'was',
  'were', 'be', 'been', 'being', 'am', 'do', 'does', 'did', 'have', 'has',
  'had', 'having', 'it', 'its', 'this', 'that', 'these', 'those', 'i',
  'you', 'he', 'she', 'we', 'they', 'them', 'me', 'us', 'my', 'your',
  'our', 'their', 'his', 'her', 'so', 'not', 'no', 'yes', 'can', 'will',
  'would', 'should', 'could', 'may', 'might', 'must', 'shall', 'just',
  'about', 'into', 'than', 'too', 'very', 'also', 'there', 'here', 'what',
  'which', 'who', 'whom', 'when', 'where', 'why', 'how', 'all', 'any',
  'some', 'each', 'every', 'other', 'more', 'most', 'such', 'only', 'own',
  'same', 'over', 'under', 'again', 'up', 'down', 'out', 'off',
]);

export function isStopWord(token: string): boolean {
  return STOP_WORDS.has(token.toLowerCase());
}
