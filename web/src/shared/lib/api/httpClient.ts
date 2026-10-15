import { env } from '@/shared/config/env';
export class ApiError extends Error {
  readonly status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}
/** Ready for real service adapters; no feature switches to an undocumented API. */
export async function httpClient<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Accept', 'application/json');
  if (typeof options.body === 'string' && !headers.has('Content-Type'))
    headers.set('Content-Type', 'application/json');
  const response = await fetch(`${env.apiBaseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`, {
    ...options,
    headers,
  });
  if (!response.ok)
    throw new ApiError(response.status, `Không thể tải dữ liệu (${response.status}).`);
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
