import { ApiResponse } from '../types/api';

export function unwrapApiResponse<T>(response: ApiResponse<T>): T {
  return response.data as T;
}

export function unwrapNestedData<T, K extends keyof T>(
  response: ApiResponse<T>,
  key: K
): T[K] {
  const data = response.data;
  if (!data) {
    throw new Error('API response data is undefined');
  }
  return data[key];
}
