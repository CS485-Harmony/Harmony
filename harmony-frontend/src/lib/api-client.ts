import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';
import { API_CONFIG } from './constants';
import { createFrontendLogger } from './frontend-logger';
import { setSessionCookie } from '@/app/actions/session';

// ─── Token storage ────────────────────────────────────────────────────────────
// Access token is kept only in module-level memory (never persisted) so it is
// cleared on page refresh and cannot be read by injected scripts via localStorage.
// Refresh token is stored in localStorage so users stay logged-in across reloads.

const REFRESH_TOKEN_KEY = 'harmony_refresh_token';
const logger = createFrontendLogger({ component: 'api-client' });

let _accessToken: string | null = null;
let _isRefreshing = false;
let _refreshQueue: Array<(token: string | null) => void> = [];

function notifyRefreshQueue(token: string | null) {
  _refreshQueue.forEach(resolve => resolve(token));
  _refreshQueue = [];
}

export function setTokens(accessToken: string, refreshToken: string): void {
  _accessToken = accessToken;
  if (typeof window !== 'undefined') {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
}

export function clearTokens(): void {
  _accessToken = null;
  if (typeof window !== 'undefined') {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}

export function getAccessToken(): string | null {
  return _accessToken;
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

// ─── tRPC HTTP helpers ────────────────────────────────────────────────────────
// tRPC v11 HTTP wire format (no transformer):
//   Query  : GET  /trpc/<procedure>            (no input = omit query param)
//   Mutation: POST /trpc/<procedure>   body: <input as JSON>
//   Response: {"result": {"data": <output>}}

export interface TrpcResponse<T> {
  result: { data: T };
}

// ─── API Client ───────────────────────────────────────────────────────────────

/**
 * API Client for Harmony backend.
 * Handles JWT bearer auth, automatic token refresh on 401, and tRPC calls.
 */
class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: { 'Content-Type': 'application/json' },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request: attach Bearer token if present
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = getAccessToken();
        if (token) {
          config.headers = config.headers ?? {};
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => Promise.reject(error),
    );

    // Response: on 401, attempt a silent token refresh then retry once
    this.client.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
        const statusCode =
          typeof error.response?.status === 'number' ? error.response.status : undefined;
        const method =
          typeof originalRequest?.method === 'string'
            ? originalRequest.method.toUpperCase()
            : undefined;
        const route = typeof originalRequest?.url === 'string' ? originalRequest.url : undefined;

        if (statusCode === 401 && !originalRequest._retry) {
          const refreshToken = getRefreshToken();
          if (!refreshToken) {
            logger.warn('Auth session refresh skipped because no refresh token is stored', {
              feature: 'auth',
              event: 'refresh_skipped',
              method,
              route,
              statusCode,
              reason: 'missing_refresh_token',
            });
            clearTokens();
            return Promise.reject(error);
          }

          if (_isRefreshing) {
            // Queue concurrent requests until the refresh completes
            return new Promise(resolve => {
              _refreshQueue.push((newToken: string | null) => {
                if (newToken) {
                  originalRequest.headers = originalRequest.headers ?? {};
                  originalRequest.headers.Authorization = `Bearer ${newToken}`;
                  resolve(this.client(originalRequest));
                } else {
                  resolve(Promise.reject(error));
                }
              });
            });
          }

          originalRequest._retry = true;
          _isRefreshing = true;

          try {
            const res = await axios.post<{ accessToken: string; refreshToken: string }>(
              `${API_CONFIG.BASE_URL}/api/auth/refresh`,
              { refreshToken },
            );
            const { accessToken: newAt, refreshToken: newRt } = res.data;
            setTokens(newAt, newRt);
            // Sync the httpOnly cookie so server-side code (Server Components, Server Actions,
            // tRPC routes) reads the fresh token. Without this, the cookie stays stale after
            // the in-memory token is refreshed and all server-side calls return 401.
            try {
              await setSessionCookie(newAt);
            } catch (sessionError) {
              // Best-effort — if the Server Action fails, keep going. The in-memory token
              // is still valid for client-side calls; the user may see a 401 on the next
              // server-side render but a page refresh will recover.
              logger.warn('Server session cookie sync failed after token refresh', {
                feature: 'auth',
                event: 'cookie_sync_failed',
                method: 'POST',
                route: '/api/auth/refresh',
                retryCount: 1,
                error: sessionError,
              });
            }
            notifyRefreshQueue(newAt);

            originalRequest.headers = originalRequest.headers ?? {};
            originalRequest.headers.Authorization = `Bearer ${newAt}`;
            return this.client(originalRequest);
          } catch (refreshError) {
            logger.error('Auth session refresh failed', {
              feature: 'auth',
              event: 'refresh_failed',
              method: 'POST',
              route: '/api/auth/refresh',
              retryCount: 1,
              error: refreshError,
            });
            clearTokens();
            notifyRefreshQueue(null);
            if (typeof window !== 'undefined') {
              window.location.href = '/auth/login';
            }
            return Promise.reject(error);
          } finally {
            _isRefreshing = false;
          }
        }

        if (statusCode === undefined || statusCode >= 500) {
          logger.error('Browser API request failed', {
            feature: 'browser-api',
            event: 'request_failed',
            method,
            route,
            statusCode,
            error,
          });
        }

        return Promise.reject(error);
      },
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  /** Call a tRPC query procedure (GET). Returns the unwrapped data. */
  async trpcQuery<T>(procedure: string, input?: unknown): Promise<T> {
    const url =
      input !== undefined
        ? `/trpc/${procedure}?input=${encodeURIComponent(JSON.stringify(input))}`
        : `/trpc/${procedure}`;
    const res = await this.client.get<TrpcResponse<T>>(url);
    return res.data.result.data;
  }

  /** Call a tRPC mutation procedure (POST). Returns the unwrapped data. */
  async trpcMutation<T>(procedure: string, input?: unknown): Promise<T> {
    const res = await this.client.post<TrpcResponse<T>>(`/trpc/${procedure}`, input ?? null);
    return res.data.result.data;
  }
}

export const apiClient = new ApiClient();

/**
 * Proactively refreshes the access token using the stored refresh token.
 * Safe to call from SSE hooks before reconnecting after a dropped connection.
 *
 * Reuses the module-level _isRefreshing/_refreshQueue so concurrent calls
 * (e.g. an interceptor refresh already in flight) are coalesced rather than
 * issuing a second /refresh request.
 *
 * On failure the function returns silently — it does NOT redirect or clear
 * tokens. The caller (SSE reconnect logic) should proceed with whatever token
 * is currently in memory; if that token is also expired the EventSource will
 * fail cleanly on its next connection attempt.
 */
export async function refreshAccessToken(): Promise<void> {
  if (typeof window === 'undefined') return;

  const refreshToken = getRefreshToken();
  if (!refreshToken) return;

  // Piggyback on an in-flight interceptor refresh rather than racing it.
  if (_isRefreshing) {
    await new Promise<void>(resolve => {
      _refreshQueue.push(() => resolve());
    });
    return;
  }

  _isRefreshing = true;
  try {
    const res = await axios.post<{ accessToken: string; refreshToken: string }>(
      `${API_CONFIG.BASE_URL}/api/auth/refresh`,
      { refreshToken },
    );
    const { accessToken: newAt, refreshToken: newRt } = res.data;
    setTokens(newAt, newRt);
    try {
      await setSessionCookie(newAt);
    } catch {
      // Best-effort — same rationale as the interceptor refresh path
    }
    notifyRefreshQueue(newAt);
  } catch {
    // Silent failure: do not redirect or clear tokens.
    // The SSE reconnect path will attempt the connection with the stale token
    // and fail cleanly (everOpened=false → es.close()) rather than logging the
    // user out just because they were idle in another tab.
    notifyRefreshQueue(null);
  } finally {
    _isRefreshing = false;
  }
}
