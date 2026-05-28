import type { z } from 'zod';

import { ApiError } from './errors.js';

export interface TokenManager {
  getToken(): Promise<string | null>;
  refreshToken(): Promise<string | null>;
}

export interface ApiClientConfig {
  baseUrl: string;
  tokenManager: TokenManager;
}

export interface RequestOptions<T = unknown> {
  body?: unknown | undefined;
  schema?: z.ZodType<T> | undefined;
  signal?: AbortSignal | undefined;
}

export class ApiClient {
  private readonly baseUrl: string;
  private readonly tokenManager: TokenManager;

  constructor(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl;
    this.tokenManager = config.tokenManager;
  }

  async request<T>(method: string, path: string, options?: RequestOptions<T>): Promise<T> {
    const token = await this.tokenManager.getToken();
    const response = await this.doFetch(method, path, token, options);

    if (response.status === 401) {
      const newToken = await this.tokenManager.refreshToken();
      if (!newToken) {
        throw new ApiError('AUTH_SESSION_EXPIRED', 'Session expired', 401);
      }
      const retry = await this.doFetch(method, path, newToken, options);
      return this.handleResponse<T>(retry, options?.schema);
    }

    return this.handleResponse<T>(response, options?.schema);
  }

  async get<T>(path: string, options?: Omit<RequestOptions<T>, 'body'>): Promise<T> {
    return this.request<T>('GET', path, options);
  }

  async post<T>(path: string, body?: unknown, options?: Omit<RequestOptions<T>, 'body'>): Promise<T> {
    return this.request<T>('POST', path, { ...options, body });
  }

  async put<T>(path: string, body?: unknown, options?: Omit<RequestOptions<T>, 'body'>): Promise<T> {
    return this.request<T>('PUT', path, { ...options, body });
  }

  async patch<T>(path: string, body?: unknown, options?: Omit<RequestOptions<T>, 'body'>): Promise<T> {
    return this.request<T>('PATCH', path, { ...options, body });
  }

  async delete<T>(path: string, options?: Omit<RequestOptions<T>, 'body'>): Promise<T> {
    return this.request<T>('DELETE', path, options);
  }

  private async doFetch(method: string, path: string, token: string | null, options?: RequestOptions): Promise<Response> {
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    if (options?.body !== undefined) {
      headers['Content-Type'] = 'application/json';
    }

    const init: RequestInit = { method, headers };
    if (options?.signal) init.signal = options.signal;
    if (options?.body !== undefined) init.body = JSON.stringify(options.body);

    return fetch(`${this.baseUrl}${path}`, init);
  }

  private async handleResponse<T>(response: Response, schema?: z.ZodType<T>): Promise<T> {
    if (!response.ok) {
      const errorBody = (await response.json().catch(() => ({}))) as {
        error?: string;
        message?: string;
      };
      throw new ApiError(errorBody.error ?? 'UNKNOWN', errorBody.message ?? 'Request failed', response.status);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }

    const data = await response.json();
    if (schema) {
      return schema.parse(data) as T;
    }
    return data as T;
  }
}
