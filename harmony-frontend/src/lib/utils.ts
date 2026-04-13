import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { isAxiosError } from 'axios';
import { getChannelUrl as getCanonicalChannelUrl } from './runtime-config';

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx and tailwind-merge for optimal class handling
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date to a human-readable string
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format a timestamp to relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return formatDate(d);
}

/**
 * Format a message timestamp in Discord style:
 *   - Same day   → "Today at 3:42 PM"
 *   - Yesterday  → "Yesterday at 3:42 PM"
 *   - Older      → "2/20/2026"
 *
 * Note: "Today" / "Yesterday" comparisons use toDateString(), which operates
 * in the viewer's local browser timezone. A message sent just before midnight
 * UTC may appear as "Today" or "Yesterday" differently across timezones —
 * this is expected behaviour (same as Discord) and is intentional.
 */
export function formatMessageTimestamp(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';
  const now = new Date();
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  if (d.toDateString() === now.toDateString()) return `Today at ${time}`;

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return `Yesterday at ${time}`;

  return d.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
}

/**
 * Format a timestamp as time-only (e.g. "3:42 PM").
 * Returns "" for invalid dates rather than throwing a RangeError.
 * Used in the compact message variant where only the time is shown on hover.
 */
export function formatTimeOnly(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

/**
 * Extracts a user-friendly error message from an unknown caught value.
 *
 * Handles:
 *   - Axios errors: reads `response.data.error` (string or object with `.message`)
 *   - tRPC HTTP errors embedded in axios: `response.data.error.message`
 *   - Plain Error instances with a message
 *   - Falls back to the provided `fallback` string
 */
export function getUserErrorMessage(
  err: unknown,
  fallback = 'Something went wrong. Please try again.',
): string {
  if (isAxiosError(err)) {
    const data = err.response?.data;
    if (data) {
      // Validation errors: { error: "Validation failed", details: [{ message: "..." }] }
      if (Array.isArray(data.details) && data.details.length > 0) {
        const messages = data.details.map((d: { message?: string }) => d.message).filter(Boolean);
        if (messages.length > 0) return messages.join('. ');
      }
      // REST endpoints: { error: "Invalid credentials" }
      if (typeof data.error === 'string' && data.error !== 'Validation failed') return data.error;
      // tRPC endpoints: { error: { message: "..." } }
      if (typeof data.error?.message === 'string') return data.error.message;
      // Some endpoints: { message: "..." }
      if (typeof data.message === 'string') return data.message;
    }
  }
  if (err instanceof Error && err.message) {
    // Filter out raw axios status messages like "Request failed with status code 401"
    if (/^Request failed with status code \d+$/.test(err.message)) return fallback;
    return err.message;
  }
  return fallback;
}

/**
 * Truncate text to a specified length
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Generate a canonical URL for a public channel
 */
export function getChannelUrl(serverSlug: string, channelSlug: string): string {
  return getCanonicalChannelUrl(serverSlug, channelSlug);
}
