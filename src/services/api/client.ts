// Placeholder HTTP client — wire to axios in Phase 3
const BASE_URL = __DEV__ ? 'http://localhost:3000/api/v1' : 'https://api.cobuddy.com/v1';

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

async function request<T>(method: string, endpoint: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? {Authorization: `Bearer ${authToken}`} : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const apiClient = {
  get: <T>(endpoint: string) => request<T>('GET', endpoint),
  post: <T>(endpoint: string, body: unknown) => request<T>('POST', endpoint, body),
  put: <T>(endpoint: string, body: unknown) => request<T>('PUT', endpoint, body),
  patch: <T>(endpoint: string, body: unknown) => request<T>('PATCH', endpoint, body),
  delete: <T>(endpoint: string) => request<T>('DELETE', endpoint),
};
