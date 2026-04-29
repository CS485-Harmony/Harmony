/**
 * Module M3 — Content Analysis DTOs (dev spec §9.5.5, §9.2).
 *
 * Kept local to the module so M3 can evolve independently from the
 * MetaTag (M2) and background-processing (M4) modules that consume it.
 */

export interface ContentAnalysis {
  keywords: string[];
  topics: string[];
  summary: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  readingLevel: 'basic' | 'intermediate' | 'advanced';
  /**
   * True when the NLP path threw or timed out and the deterministic
   * fallback was used instead. Per dev spec §9.2.1 / AC-9, MetaTagService
   * (M-B5) must call MetaTagRepository.markForRegeneration() so the
   * background worker can re-queue the meta tag once NLP is healthy.
   */
  usedFallback: boolean;
}

export interface ScoredKeyword {
  keyword: string;
  score: number;
}

/**
 * Narrow subset of the Message entity (CL-E2) that M3 needs.
 * Content analysis only reads `content`; keeping this loose avoids a
 * hard coupling to Prisma types for a service that may be reused
 * across background jobs, tests, and future adapters.
 */
export interface AnalyzableMessage {
  id?: string;
  content: string;
  createdAt?: Date | string;
}
