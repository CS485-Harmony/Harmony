import type { AxiosError } from 'axios';
import {
  cn,
  formatDate,
  formatMessageTimestamp,
  formatRelativeTime,
  formatTimeOnly,
  getChannelUrl,
  getUserErrorMessage,
  sanitizeDisplayLabel,
  truncate,
} from '../lib/utils';

describe('utils', () => {
  describe('cn', () => {
    it('merges conditional and conflicting Tailwind classes', () => {
      expect(cn('px-2 py-1', false && 'hidden', 'px-4')).toBe('py-1 px-4');
    });
  });

  describe('formatDate', () => {
    it('formats string and Date inputs consistently', () => {
      const date = new Date(2026, 2, 30, 12, 0, 0);

      expect(formatDate(date)).toBe('March 30, 2026');
      expect(formatDate(date.toISOString())).toBe('March 30, 2026');
    });
  });

  describe('formatRelativeTime', () => {
    beforeEach(() => {
      jest.useFakeTimers().setSystemTime(new Date(2026, 2, 30, 12, 0, 0));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('returns just now for timestamps under one minute old', () => {
      expect(formatRelativeTime(new Date(2026, 2, 30, 11, 59, 30))).toBe('just now');
    });

    it('returns minutes for timestamps under one hour old', () => {
      expect(formatRelativeTime(new Date(2026, 2, 30, 11, 15, 0))).toBe('45m ago');
    });

    it('returns hours for timestamps under one day old', () => {
      expect(formatRelativeTime(new Date(2026, 2, 30, 9, 0, 0))).toBe('3h ago');
    });

    it('returns days for timestamps under one week old', () => {
      expect(formatRelativeTime(new Date(2026, 2, 27, 12, 0, 0))).toBe('3d ago');
    });

    it('falls back to a formatted date for older timestamps', () => {
      expect(formatRelativeTime(new Date(2026, 2, 20, 12, 0, 0))).toBe('March 20, 2026');
    });
  });

  describe('formatMessageTimestamp', () => {
    beforeEach(() => {
      jest.useFakeTimers().setSystemTime(new Date(2026, 2, 30, 12, 0, 0));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('returns an empty string for invalid dates', () => {
      expect(formatMessageTimestamp('not-a-date')).toBe('');
    });

    it('formats same-day timestamps as Today', () => {
      expect(formatMessageTimestamp(new Date(2026, 2, 30, 9, 5, 0))).toMatch(/^Today at /);
    });

    it('formats previous-day timestamps as Yesterday', () => {
      expect(formatMessageTimestamp(new Date(2026, 2, 29, 9, 5, 0))).toMatch(/^Yesterday at /);
    });

    it('formats older timestamps as a date', () => {
      expect(formatMessageTimestamp(new Date(2026, 2, 20, 9, 5, 0))).toBe('3/20/2026');
    });
  });

  describe('formatTimeOnly', () => {
    it('returns an empty string for invalid dates', () => {
      expect(formatTimeOnly('not-a-date')).toBe('');
    });

    it('formats valid timestamps as time-only output', () => {
      expect(formatTimeOnly(new Date(2026, 2, 30, 15, 42, 0))).toBe('3:42 PM');
    });
  });

  describe('getUserErrorMessage', () => {
    it('joins validation detail messages from Axios errors', () => {
      const err = {
        isAxiosError: true,
        response: {
          data: {
            details: [{ message: 'Name is required' }, { message: 'Topic is too long' }],
          },
        },
      } as AxiosError;

      expect(getUserErrorMessage(err)).toBe('Name is required. Topic is too long');
    });

    it('returns string API errors when they are not generic validation failures', () => {
      const err = {
        isAxiosError: true,
        response: { data: { error: 'Forbidden' } },
      } as AxiosError;

      expect(getUserErrorMessage(err)).toBe('Forbidden');
    });

    it('prefers nested API error messages for structured errors', () => {
      const err = {
        isAxiosError: true,
        response: { data: { error: { message: 'Nested problem' } } },
      } as AxiosError;

      expect(getUserErrorMessage(err)).toBe('Nested problem');
    });

    it('falls back to response.message when error is the generic validation marker', () => {
      const err = {
        isAxiosError: true,
        response: { data: { error: 'Validation failed', message: 'Email is invalid' } },
      } as AxiosError;

      expect(getUserErrorMessage(err)).toBe('Email is invalid');
    });

    it('returns the provided fallback for generic HTTP status errors', () => {
      expect(
        getUserErrorMessage(new Error('Request failed with status code 403'), 'Try again'),
      ).toBe('Try again');
    });

    it('returns ordinary Error messages directly', () => {
      expect(getUserErrorMessage(new Error('Channel not found'))).toBe('Channel not found');
    });

    it('returns the fallback for unknown error shapes', () => {
      expect(getUserErrorMessage({ nope: true }, 'Fallback message')).toBe('Fallback message');
    });
  });

  describe('truncate', () => {
    it('returns the original text when it already fits', () => {
      expect(truncate('hello', 5)).toBe('hello');
    });

    it('adds an ellipsis when the text exceeds the limit', () => {
      expect(truncate('hello world', 5)).toBe('hello...');
    });
  });

  describe('sanitizeDisplayLabel', () => {
    it('removes dot-segment path prefixes', () => {
      expect(sanitizeDisplayLabel('../../../admin')).toBe('admin');
    });

    it('normalizes slash-separated names without preserving traversal segments', () => {
      expect(sanitizeDisplayLabel(' ../ community // general ')).toBe('community / general');
    });

    it('strips HTML and collapses whitespace', () => {
      expect(sanitizeDisplayLabel('<b>Game</b>   Dev\nHub')).toBe('Game Dev Hub');
    });
  });

  describe('getChannelUrl', () => {
    const originalBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    afterEach(() => {
      process.env.NEXT_PUBLIC_BASE_URL = originalBaseUrl;
    });

    it('uses the configured base URL when present', () => {
      process.env.NEXT_PUBLIC_BASE_URL = 'https://harmony.example';

      expect(getChannelUrl('server', 'general')).toBe('https://harmony.example/c/server/general');
    });

    it('falls back to localhost when no base URL is configured', () => {
      delete process.env.NEXT_PUBLIC_BASE_URL;

      expect(getChannelUrl('server', 'general')).toBe('http://localhost:3000/c/server/general');
    });
  });
});
