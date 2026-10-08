/**
 * Admin & Staff Authentication Service
 * Manages admin session, credentials verification, permissions, and security tokens.
 */
import {
  type StaffPermissions,
  findStaffByCredentials,
  updateStaffMember,
  ROLE_PRESETS
} from './staffService';

const AUTH_STORAGE_KEY = 'maysora_admin_session';

export interface AdminUser {
  id?: string;
  username: string;
  name: string;
  role: string;
  title?: string;
  department?: string;
  permissions: StaffPermissions;
  lastLogin: string;
}

export function isAuthenticated(): boolean {
  try {
    const session = sessionStorage.getItem(AUTH_STORAGE_KEY) || localStorage.getItem(AUTH_STORAGE_KEY);
    return !!session;
  } catch {
    return false;
  }
}

export function getCurrentAdmin(): AdminUser | null {
  try {
    const raw = sessionStorage.getItem(AUTH_STORAGE_KEY) || localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const user = JSON.parse(raw);
    // Ensure permissions object exists
    if (!user.permissions) {
      user.permissions = ROLE_PRESETS.super_admin.permissions;
    }
    return user;
  } catch {
    return null;
  }
}

export function loginAdmin(
  username: string,
  password: string,
  rememberMe = false
): { success: boolean; message?: string } {
  const cleanUser = username.trim().toLowerCase();
  const cleanPass = password.trim();

  // 1. Check Staff Database First
  const staffMember = findStaffByCredentials(cleanUser, cleanPass);
  if (staffMember) {
    // Update lastLogin
    const updatedStaff = {
      ...staffMember,
      lastLogin: new Date().toISOString()
    };
    updateStaffMember(updatedStaff);

    const user: AdminUser = {
      id: staffMember.id,
      username: staffMember.email,
      name: staffMember.name,
      role: staffMember.role,
      title: staffMember.title,
      department: staffMember.department,
      permissions: staffMember.permissions,
      lastLogin: updatedStaff.lastLogin
    };

    const serialized = JSON.stringify(user);
    if (rememberMe) {
      localStorage.setItem(AUTH_STORAGE_KEY, serialized);
    } else {
      sessionStorage.setItem(AUTH_STORAGE_KEY, serialized);
    }

    return { success: true };
  }

  // 2. Allowed official super admin master accounts
  const isKhaledAdmin = cleanUser === 'khaled@admin.com' && cleanPass === '102003000@';
  const isDefaultAdmin =
    (cleanUser === 'admin' || cleanUser === 'vip@maysoragroup.com' || cleanUser === 'manager') &&
    (cleanPass === 'maysora2026' || cleanPass === 'Maysora@2026' || cleanPass === '102003000@');

  if (isKhaledAdmin || isDefaultAdmin) {
    const user: AdminUser = {
      id: 'super-admin-master',
      username: cleanUser,
      name: cleanUser.includes('khaled')
        ? 'المدير التنفيذي • خالد'
        : cleanUser.includes('vip')
        ? 'مدير كونسيرج كبار الشخصيات'
        : 'المشرف العام - ميسورا',
      role: 'super_admin',
      title: 'الرئيس التنفيذي',
      department: 'الإدارة العليا',
      permissions: ROLE_PRESETS.super_admin.permissions,
      lastLogin: new Date().toISOString()
    };

    const serialized = JSON.stringify(user);
    if (rememberMe) {
      localStorage.setItem(AUTH_STORAGE_KEY, serialized);
    } else {
      sessionStorage.setItem(AUTH_STORAGE_KEY, serialized);
    }

    return { success: true };
  }

  return {
    success: false,
    message: 'بيانات الدخول غير صحيحة أو تم تعطيل حساب الموظف. يرجى التواصل مع المدير العام.'
  };
}

export function logoutAdmin(): void {
  try {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {
    // ignore
  }
}
