import { cookies } from 'next/headers';
import { UserContext } from '../types/domain';
import { verifyCoreHubToken } from './jwt-verifier';

const CORE_ROLE_MAP: Record<string, UserContext['role']> = {
  admin: 'ADMIN',
  staff: 'TEACHER',
  student: 'STUDENT',
  alumni: 'ALUMNI',
};

/**
 * Adapter สำหรับรับ Current User จากระบบ Core Hub ผ่าน SSO Session Cookie
 * ตามสัญญา auth-contract.md §5, 6
 * ห้ามทำระบบ Login/Register หรือออก JWT เองในโมดูลนี้
 */
export async function getCurrentUser(): Promise<UserContext | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('core_hub_access_token')?.value;

    if (token) {
      const verification = await verifyCoreHubToken(token);
      if (verification.isValid && verification.payload) {
        return {
          id: verification.payload.sub,
          name: verification.payload.email.split('@')[0],
          email: verification.payload.email,
          role: CORE_ROLE_MAP[verification.payload.role] || 'STUDENT',
        };
      }
    }
  } catch {
    // request context not available
  }

  return null;
}