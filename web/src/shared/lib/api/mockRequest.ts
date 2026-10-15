/** Local mock transport. Features own their fixtures and service contracts. */
export function mockRequest<T>(data: T, signal?: AbortSignal): Promise<T> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Request aborted', 'AbortError'));
      return;
    }
    const onAbort = () => {
      clearTimeout(timer);
      reject(new DOMException('Request aborted', 'AbortError'));
    };
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve(structuredClone(data));
    }, 250);
    signal?.addEventListener('abort', onAbort, { once: true });
  });
}
