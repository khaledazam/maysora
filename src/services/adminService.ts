/**
 * Admin CRM & VIP Client Dossier Service
 * Handles state persistence, multi-trip historical archive (Hajj, Umrah, Luxury Tourism, Business),
 * permanent preferences, and Excel/CSV export.
 */

export type BookingStatus = 'new' | 'contacted' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export type TripType = 'hajj' | 'umrah' | 'luxury_tourism' | 'business_travel' | 'financial_advisory';

export interface TripRecord {
  id: string;
  tripType: TripType;
  title: string;
  destination: string;       // e.g. "مكة المكرمة", "سويسرا - جنيف وإنترلاكن", "جزر المالديف", "لندن"
  travelDate?: string;       // YYYY-MM-DD
  returnDate?: string;       // YYYY-MM-DD
  guestsCount?: number;
  flightDetails?: string;    // e.g. "طيران خاص Gulfstream" or "طيران الإمارات درجة أولى"
  hotelName?: string;        // e.g. "فندق الفيرمونت برج الساعة" or "منتجع شيفال بلانك المالديف"
  status: BookingStatus;
  budgetOrPrice?: string;
  notes?: string;
  createdAt: string;
}

export interface ClientProfile {
  id: string;                // e.g. "VIP-901"
  name: string;
  phone: string;
  email?: string;
  nationality?: string;
  passportOrNationalId?: string;
  tier: 'royal_vip' | 'diamond' | 'executive' | 'corporate';
  tags: string[];            // e.g. ['عميل متكرر', 'عائلي', 'سياحة شتوية', 'طيران خاص']
  permanentPreferences: {
    airlinePreference?: string;
    hotelPreference?: string;
    carType?: string;
    dietaryNeeds?: string;
    specialRequests?: string;
  };
  trips: TripRecord[];
  totalTripsCount: number;
  totalSpendEstimate?: string;
  firstContactDate: string;
  lastContactDate: string;
  generalNotes?: string;
}

export interface AdminBooking {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email?: string;
  tripType?: TripType;
  destination?: string;
  serviceOrPackage: string;
  guestsCount?: number;
  travelDate?: string;      // YYYY-MM-DD
  returnDate?: string;      // YYYY-MM-DD
  flightDetails?: string;    // e.g. "طيران أديل FZ-204" or "طيران خاص صالة البيرق"
  hotelName?: string;        // e.g. "فيرمونت مكة - جناح رئاسي كعبة فيو"
  status: BookingStatus;
  isArchived: boolean;
  notes?: string;
  source?: string;
  campaign?: string;
}

const STORAGE_KEY_BOOKINGS = 'maysora_admin_bookings_v3';
const STORAGE_KEY_PROFILES = 'maysora_client_profiles_v3';

// Initial realistic seed profiles with rich historical travel archive (Hajj/Umrah + Global Tourism)
const INITIAL_SEED_PROFILES: ClientProfile[] = [];

// Initial bookings matching initial profiles
const INITIAL_SEED_BOOKINGS: AdminBooking[] = [];

/* =========================================================================
   CLIENT PROFILES API
   ========================================================================= */

export function getClientProfiles(): ClientProfile[] {
  try {
    localStorage.removeItem("maysora_client_profiles_v2");
  } catch {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROFILES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(INITIAL_SEED_PROFILES));
      return INITIAL_SEED_PROFILES;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading client profiles:', err);
    return INITIAL_SEED_PROFILES;
  }
}

export function saveClientProfiles(profiles: ClientProfile[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(profiles));
  } catch (err) {
    console.error('Error saving client profiles:', err);
  }
}

export function getClientProfileByPhone(phone: string): ClientProfile | undefined {
  const profiles = getClientProfiles();
  const cleanTarget = phone.replace(/[^0-9]/g, '');
  return profiles.find((p) => p.phone.replace(/[^0-9]/g, '') === cleanTarget);
}

export function updateOrCreateClientProfile(profile: Partial<ClientProfile> & { name: string; phone: string }): ClientProfile[] {
  const profiles = getClientProfiles();
  const cleanTarget = profile.phone.replace(/[^0-9]/g, '');
  const existingIndex = profiles.findIndex((p) => p.phone.replace(/[^0-9]/g, '') === cleanTarget);

  if (existingIndex >= 0) {
    // Update existing
    profiles[existingIndex] = {
      ...profiles[existingIndex],
      ...profile,
      lastContactDate: new Date().toISOString().split('T')[0],
      totalTripsCount: profiles[existingIndex].trips.length,
    };
  } else {
    // Create new
    const newProfile: ClientProfile = {
      id: `VIP-CLIENT-${Math.floor(100 + Math.random() * 900)}`,
      name: profile.name,
      phone: profile.phone,
      email: profile.email,
      tier: profile.tier || 'executive',
      tags: profile.tags || ['عميل جديد'],
      permanentPreferences: profile.permanentPreferences || {},
      trips: profile.trips || [],
      totalTripsCount: (profile.trips || []).length,
      firstContactDate: new Date().toISOString().split('T')[0],
      lastContactDate: new Date().toISOString().split('T')[0],
      generalNotes: profile.generalNotes || '',
    };
    profiles.unshift(newProfile);
  }

  saveClientProfiles(profiles);
  return profiles;
}

/**
 * Adds a new trip (Hajj, Umrah, Luxury Tourism, or Business) directly to an existing client profile
 */
export function addTripToClientProfile(
  phone: string,
  trip: Omit<TripRecord, 'id' | 'createdAt'>
): { updatedProfiles: ClientProfile[]; updatedBookings: AdminBooking[] } {
  const profiles = getClientProfiles();
  const cleanTarget = phone.replace(/[^0-9]/g, '');
  const profileIndex = profiles.findIndex((p) => p.phone.replace(/[^0-9]/g, '') === cleanTarget);

  const newTrip: TripRecord = {
    ...trip,
    id: `TRIP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString(),
  };

  if (profileIndex >= 0) {
    profiles[profileIndex].trips.unshift(newTrip);
    profiles[profileIndex].totalTripsCount = profiles[profileIndex].trips.length;
    profiles[profileIndex].lastContactDate = new Date().toISOString().split('T')[0];
    saveClientProfiles(profiles);

    // Also insert into bookings table so it appears in active schedule/CRM
    const bookings = getAdminBookings();
    const newBooking: AdminBooking = {
      id: `BK-${newTrip.id}`,
      createdAt: newTrip.createdAt,
      name: profiles[profileIndex].name,
      phone: profiles[profileIndex].phone,
      email: profiles[profileIndex].email,
      tripType: newTrip.tripType,
      destination: newTrip.destination,
      serviceOrPackage: newTrip.title,
      guestsCount: newTrip.guestsCount,
      travelDate: newTrip.travelDate,
      returnDate: newTrip.returnDate,
      flightDetails: newTrip.flightDetails,
      hotelName: newTrip.hotelName,
      status: newTrip.status,
      isArchived: false,
      notes: newTrip.notes,
      source: 'حجز مباشر من الملف الدائم للعميل',
    };
    bookings.unshift(newBooking);
    saveAdminBookings(bookings);

    return { updatedProfiles: profiles, updatedBookings: bookings };
  }

  return { updatedProfiles: profiles, updatedBookings: getAdminBookings() };
}

/* =========================================================================
   BOOKINGS API
   ========================================================================= */

export function getAdminBookings(): AdminBooking[] {
  try {
    localStorage.removeItem("maysora_admin_bookings_v2");
    localStorage.removeItem("maysora_leads_backup");
  } catch {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BOOKINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(INITIAL_SEED_BOOKINGS));
      return INITIAL_SEED_BOOKINGS;
    }
    const parsed: AdminBooking[] = JSON.parse(raw);

    // Sync any new submissions from localStorage backup
    const leadsBackupRaw = localStorage.getItem('maysora_leads_backup');
    if (leadsBackupRaw) {
      try {
        const leads: any[] = JSON.parse(leadsBackupRaw);
        let updated = false;
        leads.forEach((lead) => {
          const leadId = lead.id || `LEAD-${lead.phone.replace(/[^0-9]/g, '').slice(-6)}`;
          const exists = parsed.some((b) => b.id === leadId || (b.phone === lead.phone && b.createdAt === lead.isoDate));
          if (!exists) {
            parsed.unshift({
              id: leadId,
              createdAt: lead.isoDate || new Date().toISOString(),
              name: lead.name || 'عميل محتمل',
              phone: lead.phone || '',
              email: lead.email !== 'غير محدد' ? lead.email : undefined,
              tripType: lead.serviceOrPackage?.includes('حج')
                ? 'hajj'
                : lead.serviceOrPackage?.includes('عمرة')
                ? 'umrah'
                : lead.serviceOrPackage?.includes('سياحة')
                ? 'luxury_tourism'
                : 'financial_advisory',
              destination: lead.serviceOrPackage?.includes('سياحة') ? 'وجهة سياحية فاخرة' : 'مكة المكرمة',
              serviceOrPackage: lead.serviceOrPackage || 'حجز عام',
              status: 'new',
              isArchived: false,
              notes: lead.messageOrNotes !== 'لا توجد ملاحظات' ? lead.messageOrNotes : undefined,
              source: lead.utm_source ? `${lead.utm_source} / ${lead.source || 'Form'}` : (lead.source || 'Landing Page'),
              campaign: lead.utm_campaign,
            });
            updated = true;
          }
        });
        if (updated) {
          localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(parsed));
        }
      } catch {
        // ignore
      }
    }

    return parsed;
  } catch (err) {
    console.error('Error reading admin bookings:', err);
    return INITIAL_SEED_BOOKINGS;
  }
}

export function saveAdminBookings(bookings: AdminBooking[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(bookings));
  } catch (err) {
    console.error('Error saving admin bookings:', err);
  }
}

export function updateBookingStatus(id: string, newStatus: BookingStatus): AdminBooking[] {
  const current = getAdminBookings();
  const updated = current.map((b) => (b.id === id ? { ...b, status: newStatus } : b));
  saveAdminBookings(updated);
  return updated;
}

export function updateBookingDetails(id: string, updates: Partial<AdminBooking>): AdminBooking[] {
  const current = getAdminBookings();
  const updated = current.map((b) => (b.id === id ? { ...b, ...updates } : b));
  saveAdminBookings(updated);
  return updated;
}

export function toggleArchiveBooking(id: string): AdminBooking[] {
  const current = getAdminBookings();
  const updated = current.map((b) => (b.id === id ? { ...b, isArchived: !b.isArchived } : b));
  saveAdminBookings(updated);
  return updated;
}

export function deleteBooking(id: string): AdminBooking[] {
  const current = getAdminBookings();
  const updated = current.filter((b) => b.id !== id);
  saveAdminBookings(updated);
  return updated;
}

export function addNewAdminBooking(booking: Omit<AdminBooking, 'id' | 'createdAt' | 'isArchived'>): AdminBooking[] {
  const current = getAdminBookings();
  const newBooking: AdminBooking = {
    ...booking,
    id: `BK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString(),
    isArchived: false,
  };
  const updated = [newBooking, ...current];
  saveAdminBookings(updated);

  // Also ensure client profile exists or is updated
  updateOrCreateClientProfile({
    name: newBooking.name,
    phone: newBooking.phone,
    email: newBooking.email,
  });

  return updated;
}

/**
 * Exports client records to a clean UTF-8 CSV with BOM for full Excel Arabic support.
 */
export function exportBookingsToCSV(bookings: AdminBooking[]): void {
  const headers = [
    'رقم الحجز',
    'تاريخ الطلب',
    'اسم العميل',
    'رقم الهاتف',
    'البريد الإلكتروني',
    'نوع الرحلة',
    'الوجهة',
    'الخدمة / الباقة',
    'تاريخ الوصول',
    'تاريخ المغادرة',
    'عدد الضيوف',
    'بيانات الطيران',
    'الفندق والأجنحة',
    'الحالة',
    'المصدر التسويقي',
    'ملاحظات إضافية',
  ];

  const statusMap: Record<BookingStatus, string> = {
    new: 'جديد',
    contacted: 'تم التواصل',
    confirmed: 'مؤكد',
    in_progress: 'جاري التنسيق',
    completed: 'مكتمل',
    cancelled: 'ملغي',
  };

  const tripTypeMap: Record<TripType, string> = {
    hajj: 'حج ملكي فاخر',
    umrah: 'عمرة VIP',
    luxury_tourism: 'سياحة وترفيه فاخر',
    business_travel: 'رحلة عمل واستثمار',
    financial_advisory: 'خدمات كونسيرج ورعاية خاصة',
  };

  const rows = bookings.map((b) => [
    `"${b.id}"`,
    `"${b.createdAt.split('T')[0]}"`,
    `"${(b.name || '').replace(/"/g, '""')}"`,
    `"${(b.phone || '').replace(/"/g, '""')}"`,
    `"${(b.email || '').replace(/"/g, '""')}"`,
    `"${tripTypeMap[b.tripType || 'umrah'] || 'عمرة VIP'}"`,
    `"${(b.destination || 'مكة المكرمة').replace(/"/g, '""')}"`,
    `"${(b.serviceOrPackage || '').replace(/"/g, '""')}"`,
    `"${b.travelDate || 'غير محدد'}"`,
    `"${b.returnDate || 'غير محدد'}"`,
    `"${b.guestsCount || 1}"`,
    `"${(b.flightDetails || '').replace(/"/g, '""')}"`,
    `"${(b.hotelName || '').replace(/"/g, '""')}"`,
    `"${statusMap[b.status] || b.status}"`,
    `"${(b.source || '').replace(/"/g, '""')}"`,
    `"${(b.notes || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `كشف_حجوزات_وعملاء_ميسورة_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
