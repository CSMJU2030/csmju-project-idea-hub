import { getMe } from './api';
import { UserContext } from '../modules/showcase/types/domain';

/**
 * Retrieves the current authenticated user by delegating token verification
 * entirely to the NestJS backend GET /api/v1/me with the HttpOnly SSO cookie.
 * No local JWT verification or secret keys exist in the frontend.
 */
export async function getCurrentUser(): Promise<UserContext | null> {
  try {
    const res = await getMe();
    if (!res.ok) {
      return null;
    }

    const me = res.data;
    const role: UserContext['role'] =
      me.subsystemRole === 'ADVISOR' ? 'TEACHER' : (me.subsystemRole as UserContext['role']);

    return {
      id: me.id,
      name: me.email.split('@')[0],
      email: me.email,
      role,
    };
  } catch {
    return null;
  }
}
