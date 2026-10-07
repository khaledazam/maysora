/**
 * Staff & Role-Based Access Control (RBAC) Service
 * Manages company employees, credentials, and granular permission sets.
 */

export type StaffRole =
  | 'super_admin'
  | 'bookings_officer'
  | 'concierge_sales'
  | 'pricing_manager'
  | 'financial_consultant'
  | 'custom';

export interface StaffPermissions {
  canViewBookings: boolean;
  canEditBookings: boolean;
  canDeleteBookings: boolean;
  canViewClients: boolean;
  canEditClients: boolean;
  canUseWhatsApp: boolean;
  canManagePrices: boolean;
  canManageHotels?: boolean;
  canExportData: boolean;
  canManageStaff: boolean;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  title: string;
  department: string;
  role: StaffRole;
  permissions: StaffPermissions;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export const ROLE_PRESETS: Record<StaffRole, { label: string; description: string; permissions: StaffPermissions }> = {
  super_admin: {
    label: 'مدير عام (Super Admin)',
    description: 'كامل الصلاحيات الإدارية والتشغيلية وإدارة الموظفين والربط السحابي',
    permissions: {
      canViewBookings: true,
      canEditBookings: true,
      canDeleteBookings: true,
      canViewClients: true,
      canEditClients: true,
      canUseWhatsApp: true,
      canManagePrices: true,
      canManageHotels: true,
      canExportData: true,
      canManageStaff: true,
    },
  },
  bookings_officer: {
    label: 'مسؤول حجوزات وسفر',
    description: 'إدارة وتأكيد حجوزات الحج والعمرة والرحلات ومواعيد الطيران والفنادق',
    permissions: {
      canViewBookings: true,
      canEditBookings: true,
      canDeleteBookings: false,
      canViewClients: true,
      canEditClients: true,
      canUseWhatsApp: true,
      canManagePrices: false,
      canManageHotels: true,
      canExportData: true,
      canManageStaff: false,
    },
  },
  concierge_sales: {
    label: 'خدمة عملاء ومبيعات VIP',
    description: 'التواصل المباشر مع العملاء ومتابعة الحجوزات وإرسال رسائل الواتساب',
    permissions: {
      canViewBookings: true,
      canEditBookings: true,
      canDeleteBookings: false,
      canViewClients: true,
      canEditClients: false,
      canUseWhatsApp: true,
      canManagePrices: false,
      canManageHotels: false,
      canExportData: false,
      canManageStaff: false,
    },
  },
  pricing_manager: {
    label: 'مسؤول باقات وأسعار',
    description: 'التحكم في أسعار باقات الحج والعمرة وإضافة الباقات الموسمية والعروض',
    permissions: {
      canViewBookings: true,
      canEditBookings: false,
      canDeleteBookings: false,
      canViewClients: false,
      canEditClients: false,
      canUseWhatsApp: false,
      canManagePrices: true,
      canManageHotels: true,
      canExportData: false,
      canManageStaff: false,
    },
  },
  financial_consultant: {
    label: 'مشرف كونسيرج وضيافة VIP',
    description: 'متابعة حجوزات كبار الشخصيات وترتيب الخدمات الخاصة وتصدير التقارير',
    permissions: {
      canViewBookings: true,
      canEditBookings: false,
      canDeleteBookings: false,
      canViewClients: true,
      canEditClients: true,
      canUseWhatsApp: false,
      canManagePrices: false,
      canManageHotels: false,
      canExportData: true,
      canManageStaff: false,
    },
  },
  custom: {
    label: 'صلاحيات مخصصة',
    description: 'تحديد كل صلاحية بشكل يدوي ومخصص لهذا الموظف',
    permissions: {
      canViewBookings: true,
      canEditBookings: false,
      canDeleteBookings: false,
      canViewClients: true,
      canEditClients: false,
      canUseWhatsApp: false,
      canManagePrices: false,
      canManageHotels: false,
      canExportData: false,
      canManageStaff: false,
    },
  },
};

export const DEFAULT_STAFF: StaffMember[] = [
  {
    id: 'staff-khaled',
    name: 'خالد (المدير التنفيذي)',
    email: 'khaled@admin.com',
    phone: '01011860173',
    password: '102003000@',
    title: 'الرئيس التنفيذي والشريك الإداري',
    department: 'الإدارة العليا',
    role: 'super_admin',
    permissions: ROLE_PRESETS.super_admin.permissions,
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    lastLogin: '2026-10-06T12:00:00.000Z',
  },
  {
    id: 'staff-ahmed-ramadan',
    name: 'بشمهندس أحمد رمضان',
    email: 'ahmed.ramadan@maysoragroup.com',
    phone: '01011860173',
    password: 'Maysora@2026',
    title: 'المستشار التنفيذي العام ومسؤول كبار الشخصيات',
    department: 'إدارة العمليات وVIP Concierge',
    role: 'super_admin',
    permissions: ROLE_PRESETS.super_admin.permissions,
    isActive: true,
    createdAt: '2026-02-15T00:00:00.000Z',
    lastLogin: '2026-10-06T11:30:00.000Z',
  },
  {
    id: 'staff-souma-shaaban',
    name: 'أستاذة سومة شعبان',
    email: 'souma.shaaban@maysoragroup.com',
    phone: '01017776863',
    password: 'Maysora@2026',
    title: 'مسؤولة خدمة العملاء والتنسيق',
    department: 'قسم الحجوزات والعمليات',
    role: 'bookings_officer',
    permissions: ROLE_PRESETS.bookings_officer.permissions,
    isActive: true,
    createdAt: '2026-03-01T00:00:00.000Z',
    lastLogin: '2026-10-07T12:00:00.000Z',
  }
];

const STAFF_STORAGE_KEY = 'maysora_staff_members_v1';

export function getStaffMembers(): StaffMember[] {
  try {
    const raw = localStorage.getItem(STAFF_STORAGE_KEY);
    if (!raw) {
      saveStaffMembers(DEFAULT_STAFF);
      return DEFAULT_STAFF;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (e) {
    console.error('Error loading staff members:', e);
  }
  return DEFAULT_STAFF;
}

export function saveStaffMembers(staff: StaffMember[]): void {
  try {
    localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(staff));
  } catch (e) {
    console.error('Error saving staff members:', e);
  }
}

export function addStaffMember(member: Omit<StaffMember, 'id' | 'createdAt'>): StaffMember[] {
  const current = getStaffMembers();
  const newMember: StaffMember = {
    ...member,
    id: `staff-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  const updated = [newMember, ...current];
  saveStaffMembers(updated);
  return updated;
}

export function updateStaffMember(member: StaffMember): StaffMember[] {
  const current = getStaffMembers();
  const updated = current.map((s) => (s.id === member.id ? member : s));
  saveStaffMembers(updated);
  return updated;
}

export function deleteStaffMember(id: string): StaffMember[] {
  const current = getStaffMembers();
  const updated = current.filter((s) => s.id !== id);
  saveStaffMembers(updated);
  return updated;
}

export function toggleStaffStatus(id: string): StaffMember[] {
  const current = getStaffMembers();
  const updated = current.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s));
  saveStaffMembers(updated);
  return updated;
}

export function findStaffByCredentials(emailOrUsername: string, pass: string): StaffMember | null {
  const cleanInput = emailOrUsername.trim().toLowerCase();
  const cleanPass = pass.trim();
  const allStaff = getStaffMembers();

  return (
    allStaff.find(
      (s) =>
        s.isActive &&
        (s.email.toLowerCase() === cleanInput || s.name.toLowerCase() === cleanInput) &&
        s.password === cleanPass
    ) || null
  );
}
