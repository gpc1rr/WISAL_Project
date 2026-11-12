/**
 * WISAL API client
 *
 * دالة موحّدة للتواصل مع خادم وصال (PHP API).
 * - ترسل كوكي الجلسة تلقائياً (credentials: 'include').
 * - تضيف رمز الحماية CSRF لأي طلب يغيّر البيانات.
 */

export const API_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:8000'
).replace(/\/$/, '');

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code?: string;
    message?: string;
  };
}

async function getCsrfToken(): Promise<string> {
  const response = await fetch(`${API_URL}/api/auth/csrf`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('تعذر تهيئة جلسة الحماية');
  }

  const payload = (await response.json()) as ApiResponse<{ csrfToken: string }>;

  if (!payload.success || !payload.data?.csrfToken) {
    throw new Error('تعذر الحصول على رمز الحماية');
  }

  return payload.data.csrfToken;
}

export async function apiRequest<T>(
  path: string,
  method: HttpMethod = 'GET',
  body?: unknown
): Promise<T> {
  const headers: Record<string, string> = {};

  if (method !== 'GET') {
    headers['X-CSRF-Token'] = await getCsrfToken();
  }

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      credentials: 'include',
      headers,
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
  } catch {
    throw new Error('تعذر الاتصال بخادم وصال. تحقق من اتصالك بالإنترنت.');
  }

  let payload: ApiResponse<T>;

  try {
    payload = (await response.json()) as ApiResponse<T>;
  } catch {
    throw new Error('تعذر قراءة استجابة خادم وصال');
  }

  if (!response.ok || !payload.success || payload.data === undefined) {
    throw new Error(
      payload.error?.message || 'تعذر تنفيذ الطلب. يرجى المحاولة مجدداً.'
    );
  }

  return payload.data;
}
