import { API_BASE_URL } from '../constants/config';
import { ApiEnvelope } from '../types/competition';

export class ApiRequestError extends Error {
  code: string;
  status: number;

  constructor(message: string, code: string, status: number) {
    super(message);
    this.name = 'ApiRequestError';
    this.code = code;
    this.status = status;
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  token?: string | null;
  signal?: AbortSignal;
}

const DEFAULT_TIMEOUT_MS = 15000;

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, token, signal } = options;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  if (signal) {
    signal.addEventListener('abort', () => controller.abort());
  }

  const headers: Record<string, string> = {
    Accept: 'application/json',
  };
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timeout);
    if (err instanceof Error && err.name === 'AbortError') {
      throw new ApiRequestError('The request timed out. Please try again.', 'TIMEOUT', 0);
    }
    throw new ApiRequestError(
      'Could not reach the Feedants server. Check your connection and the API URL.',
      'NETWORK_ERROR',
      0
    );
  }
  clearTimeout(timeout);

  let json: ApiEnvelope<T> | undefined;
  try {
    json = (await response.json()) as ApiEnvelope<T>;
  } catch {
    throw new ApiRequestError(
      `The server returned an unexpected response (HTTP ${response.status}).`,
      'INVALID_RESPONSE',
      response.status
    );
  }

  if (!response.ok || !json.success) {
    const errorBody = !json.success ? json.error : undefined;
    throw new ApiRequestError(
      errorBody?.message ?? `Request failed with status ${response.status}.`,
      errorBody?.code ?? 'UNKNOWN_ERROR',
      response.status
    );
  }

  return json.data;
}