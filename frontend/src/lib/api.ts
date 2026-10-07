import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://127.0.0.1:4201';
const SUBSYSTEM_ID = process.env.SUBSYSTEM_ID ?? 'csmju-project-idea-hub';

/**
 * Session cookie set by backend at /auth/callback: `<name>_access_token`
 * where `-` is replaced with `_` (auth-contract 5.1, 6).
 */
export const SSO_COOKIE = `${SUBSYSTEM_ID.replace(/-/g, '_')}_access_token`;

type Envelope<T> =
  | { success: true; data: T; meta?: Record<string, unknown> }
  | { success: false; error: { code: string; message: string } };

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; message: string };

export type SubsystemRole = 'STUDENT' | 'ALUMNI' | 'STAFF' | 'ADMIN' | 'ADVISOR';

export type Me = {
  id: string;
  email: string;
  coreRole: string;
  subsystemRole: SubsystemRole;
  session: { expiresAt: string | null };
};

export const isUnauthorized = (...results: ApiResult<unknown>[]) =>
  results.some((result) => !result.ok && result.status === 401);

export async function hasSession(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.has(SSO_COOKIE);
}

/**
 * Server-side API client forwarding the HttpOnly SSO session cookie to the NestJS backend.
 */
export async function call<T>(
  path: string,
  init: { method?: string; body?: unknown } = {},
): Promise<ApiResult<T>> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SSO_COOKIE)?.value;

  if (!token) {
    return { ok: false, status: 401, message: 'ยังไม่ได้เข้าสู่ระบบ' };
  }

  let res: Response;
  try {
    res = await fetch(`${BACKEND_URL}${path}`, {
      method: init.method ?? 'GET',
      headers: {
        Cookie: `${SSO_COOKIE}=${encodeURIComponent(token)}`,
        ...(init.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      },
      body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
      cache: 'no-store',
    });
  } catch {
    return { ok: false, status: 503, message: 'เชื่อมต่อ backend ของระบบย่อยไม่ได้' };
  }

  const body = (await res.json().catch(() => null)) as Envelope<T> | null;
  if (res.ok && body?.success) return { ok: true, data: body.data };
  return {
    ok: false,
    status: res.status,
    message: body && !body.success ? body.error.message : `HTTP ${res.status}`,
  };
}

/** GET /api/v1/me — identity verified by the NestJS backend via Core Hub JWKS */
export const getMe = () => call<Me>('/api/v1/me');
