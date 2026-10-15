import { useCallback, useEffect, useRef, useState } from 'react';

/** Pass a stable service method or a memoized fetcher. Latest request wins. */
export function useAsyncData<T>(fetcher: (signal: AbortSignal) => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const active = useRef<AbortController | null>(null);
  const reload = useCallback(async () => {
    active.current?.abort();
    const request = new AbortController();
    active.current = request;
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const result = await fetcher(request.signal);
      if (!request.signal.aborted) setData(result);
    } catch (err) {
      if (!request.signal.aborted)
        setError(err instanceof Error ? err.message : 'Không thể tải dữ liệu.');
    } finally {
      if (!request.signal.aborted) setLoading(false);
    }
  }, [fetcher]);
  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect -- Synchronizes loading/error state with an external request, including fetcher changes.
    void reload();
    return () => active.current?.abort();
  }, [reload]);
  return { data, loading, error, reload };
}
