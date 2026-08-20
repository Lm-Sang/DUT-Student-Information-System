const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

export interface ApiResult<T> {
  data: T;
}

const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

export async function mockRequest<T>(data: T): Promise<ApiResult<T>> {
  await delay();
  return { data };
}

export { API_BASE_URL };
