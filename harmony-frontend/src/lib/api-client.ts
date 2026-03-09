import axios, { type AxiosInstance, type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG } from './constants';

// ─── Token storage ────────────────────────────────────────────────────────────
// Access token is kept only in module-level memory (never persisted) so it is
// cleared on page refresh and cannot be read by injected scripts via localStorage.
// Refresh token is stored in localStorage so users stay logged-in across reloads.

const REFRESH_TOKEN_KEY = 'harmony_refresh_token';

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

        if (error.response?.status === 401 && !originalRequest._retry) {
          const refreshToken = getRefreshToken();
          if (!refreshToken) {
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
            notifyRefreshQueue(newAt);

            originalRequest.headers = originalRequest.headers ?? {};
            originalRequest.headers.Authorization = `Bearer ${newAt}`;
            return this.client(originalRequest);
          } catch {
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
  async trpcQuery<T>(procedure: string): Promise<T> {
    const res = await this.client.get<TrpcResponse<T>>(`/trpc/${procedure}`);
    return res.data.result.data;
  }

  /** Call a tRPC mutation procedure (POST). Returns the unwrapped data. */
  async trpcMutation<T>(procedure: string, input?: unknown): Promise<T> {
    const res = await this.client.post<TrpcResponse<T>>(
      `/trpc/${procedure}`,
      input ?? null,
    );
    return res.data.result.data;
  }
}

export const apiClient = new ApiClient();

