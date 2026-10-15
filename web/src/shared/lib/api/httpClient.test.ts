import { afterEach, expect, test, vi } from 'vitest';
import { ApiError, httpClient } from './httpClient';
afterEach(() => vi.unstubAllGlobals());

test('preserves custom headers and abort signal for authenticated requests', async () => {
  const fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ id: 'student' })));
  vi.stubGlobal('fetch', fetch);
  const controller = new AbortController();
  expect(
    await httpClient('/students/me', {
      headers: { Authorization: 'Bearer demo' },
      signal: controller.signal,
    }),
  ).toEqual({ id: 'student' });
  const options = fetch.mock.calls[0][1];
  expect(options.headers.get('Authorization')).toBe('Bearer demo');
  expect(options.headers.get('Accept')).toBe('application/json');
  expect(options.signal).toBe(controller.signal);
});

test('exposes HTTP failures instead of treating an error payload as data', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('Forbidden', { status: 403 })));
  await expect(httpClient('/admin')).rejects.toBeInstanceOf(ApiError);
});

test('handles no-content mutation responses', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 204 })));
  await expect(httpClient('/registration/c1', { method: 'DELETE' })).resolves.toBeUndefined();
});
