import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import { useAsyncData } from './useAsyncData';
afterEach(cleanup);

test('ignores an old response even if its transport does not support abort', async () => {
  let resolveOld!: (value: string) => void;
  let oldSignal!: AbortSignal;
  const oldFetcher = (signal: AbortSignal) => {
    oldSignal = signal;
    return new Promise<string>((resolve) => {
      resolveOld = resolve;
    });
  };
  const newFetcher = async () => 'new course';
  const { result, rerender } = renderHook(({ fetcher }) => useAsyncData(fetcher), {
    initialProps: { fetcher: oldFetcher },
  });
  rerender({ fetcher: newFetcher });
  await waitFor(() => expect(result.current.data).toBe('new course'));
  expect(oldSignal.aborted).toBe(true);
  await act(async () => resolveOld('stale course'));
  expect(result.current.data).toBe('new course');
  expect(result.current.loading).toBe(false);
});

test('clears errors after a successful retry', async () => {
  const fetcher = vi
    .fn()
    .mockRejectedValueOnce(new Error('Network offline'))
    .mockResolvedValueOnce(['course']);
  const { result } = renderHook(() => useAsyncData<string[]>(fetcher));
  await waitFor(() => expect(result.current.error).toBe('Network offline'));
  await act(async () => result.current.reload());
  expect(result.current.data).toEqual(['course']);
  expect(result.current.error).toBeNull();
});

test('aborts requests on unmount', () => {
  let signal!: AbortSignal;
  const fetcher = (next: AbortSignal) => {
    signal = next;
    return new Promise<string>(() => {});
  };
  const { unmount } = renderHook(() => useAsyncData(fetcher));
  unmount();
  expect(signal.aborted).toBe(true);
});
