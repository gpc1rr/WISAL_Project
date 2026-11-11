import type { User, ProviderProfile } from '@/types';

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
interface SessionData { user: User; provider: ProviderProfile | null }
interface ApiResponse<T> { success: boolean; data?: T; error?: { message: string } }
let csrfToken = '';
async function request<T>(path: string, method: 'GET' | 'POST' = 'GET', body?: unknown): Promise<T> {
  if (method === 'POST') await loadCsrf();
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    credentials: 'include',
    headers: {
      ...(method === 'POST' ? { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken } : {}),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  let payload: ApiResponse<T>;
  try { payload = await response.json(); }
  catch { throw new Error('تعذر قراءة استجابة الخادم'); }
  if (!response.ok || !payload.success || payload.data === undefined) {
    throw new Error(payload.error?.message || 'تعذر الاتصال بالخادم');
  }
  return payload.data;
}
async function loadCsrf() {
  const r = await request<{ csrfToken: string }>('/api/auth/csrf');
  csrfToken = r.csrfToken;
}
export const realAuthRepository = {
  me: () => request<SessionData>('/api/auth/me'),
  login: (phone: string, password: string) => request<SessionData>('/api/auth/login', 'POST', { phone, password }),
  registerBeneficiary: (data: Record<string, unknown>) => request<SessionData>('/api/auth/register/beneficiary', 'POST', data),
  registerProvider: (data: Record<string, unknown>) => request<SessionData>('/api/auth/register/provider', 'POST', data),
  logout: async () => { await request<{ loggedOut: boolean }>('/api/auth/logout', 'POST'); csrfToken = ''; },
};
