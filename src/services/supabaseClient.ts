/**
 * Supabase Cloud Database Client
 * Handles real-time sync for Leads, Bookings, and VIP Client Dossiers.
 */
import { createClient } from '@supabase/supabase-js';
import type { AdminBooking, ClientProfile } from './adminService';
import type { ManagedPackage } from './pricingService';
import type { ManagedHotel } from './hotelService';
import type { StaffMember } from './staffService';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://yzvpcxgempjpgihlviec.supabase.co';

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_f17V7oTBhN552PfvjcdFLA_Va8j43L7';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

/**
 * Saves or updates a booking in Supabase.
 * Falls back silently if table is not yet created.
 */
export async function syncBookingToSupabase(booking: AdminBooking): Promise<boolean> {
  try {
    const { error } = await supabase.from('bookings').upsert(
      {
        id: booking.id,
        created_at: booking.createdAt,
        name: booking.name,
        phone: booking.phone,
        email: booking.email || null,
        trip_type: booking.tripType || 'umrah',
        destination: booking.destination || 'مكة المكرمة',
        service_or_package: booking.serviceOrPackage,
        guests_count: booking.guestsCount || 1,
        travel_date: booking.travelDate || null,
        return_date: booking.returnDate || null,
        flight_details: booking.flightDetails || null,
        hotel_name: booking.hotelName || null,
        status: booking.status,
        is_archived: booking.isArchived,
        notes: booking.notes || null,
        source: booking.source || null,
      },
      { onConflict: 'id' }
    );

    if (error) {
      console.warn('Supabase sync notice (bookings table):', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase connection warning:', err);
    return false;
  }
}

/**
 * Fetches all active bookings from Supabase, filtering out demo/deleted items.
 */
export async function fetchBookingsFromSupabase(): Promise<AdminBooking[] | null> {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      return null;
    }

    const mockIds = ['TEST-1791274332273', 'BK-2026-001', 'BK-2026-002', 'BK-2026-003', 'BK-2026-004', 'BK-2026-5766'];

    return data
      .filter((row: any) => {
        if (!row.id || row.id.startsWith('SYS_') || row.status === 'system') return false;
        if (row.status === 'deleted' || row.notes === '__DELETED__') return false;
        if (mockIds.includes(row.id) || (typeof row.id === 'string' && row.id.startsWith('TEST-'))) return false;
        if (row.name === '[Deleted Demo]' || row.name === '[Deleted]') return false;
        return true;
      })
      .map((row: any) => ({
        id: row.id,
        createdAt: row.created_at,
        name: row.name,
        phone: row.phone,
        email: row.email || undefined,
        tripType: row.trip_type || 'umrah',
        destination: row.destination || 'مكة المكرمة',
        serviceOrPackage: row.service_or_package,
        guestsCount: row.guests_count || 1,
        travelDate: row.travel_date || undefined,
        returnDate: row.return_date || undefined,
        flightDetails: row.flight_details || undefined,
        hotelName: row.hotel_name || undefined,
        status: row.status || 'new',
        isArchived: !!row.is_archived,
        notes: row.notes || undefined,
        source: row.source || undefined,
      }));
  } catch {
    return null;
  }
}

/**
 * Permanently deletes or marks a booking as deleted in Supabase.
 */
export async function deleteBookingFromSupabase(id: string): Promise<boolean> {
  try {
    // 1. Attempt hard delete
    await supabase.from('bookings').delete().eq('id', id);
    // 2. Soft-delete guarantee to prevent reappearing
    await supabase.from('bookings').update({
      status: 'deleted',
      notes: '__DELETED__',
      name: '[Deleted]',
      travel_date: null,
      return_date: null,
      is_archived: false
    }).eq('id', id);
    return true;
  } catch (err) {
    console.warn('Error deleting booking from Supabase:', err);
    return false;
  }
}

/**
 * Clears all existing bookings in Supabase for production handover.
 */
export async function clearAllBookingsFromSupabase(): Promise<boolean> {
  try {
    const { data } = await supabase.from('bookings').select('id');
    if (data && data.length > 0) {
      for (const item of data) {
        await deleteBookingFromSupabase(item.id);
      }
    }
    return true;
  } catch (err) {
    console.warn('Error clearing all bookings from Supabase:', err);
    return false;
  }
}

/**
 * Syncs a client profile (dossier) to Supabase.
 */
export async function syncClientProfileToSupabase(profile: ClientProfile): Promise<boolean> {
  try {
    const { error } = await supabase.from('client_profiles').upsert(
      {
        id: profile.id,
        name: profile.name,
        phone: profile.phone,
        email: profile.email || null,
        nationality: profile.nationality || 'سعودي',
        passport_or_national_id: profile.passportOrNationalId || null,
        tier: profile.tier,
        tags: profile.tags || [],
        permanent_preferences: profile.permanentPreferences || {},
        trips: profile.trips || [],
        total_trips_count: profile.totalTripsCount || profile.trips.length,
        total_spend_estimate: profile.totalSpendEstimate || null,
        first_contact_date: profile.firstContactDate,
        last_contact_date: profile.lastContactDate,
        general_notes: profile.generalNotes || null,
      },
      { onConflict: 'phone' }
    );

    if (error) {
      console.warn('Supabase sync notice (client_profiles table):', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase connection warning:', err);
    return false;
  }
}

/**
 * Fetches all client profiles from Supabase.
 */
export async function fetchClientProfilesFromSupabase(): Promise<ClientProfile[] | null> {
  try {
    const { data, error } = await supabase
      .from('client_profiles')
      .select('*')
      .order('last_contact_date', { ascending: false });

    if (error || !data) {
      return null;
    }

    return data.map((row: any) => ({
      id: row.id,
      name: row.name,
      phone: row.phone,
      email: row.email || undefined,
      nationality: row.nationality || 'سعودي',
      passportOrNationalId: row.passport_or_national_id || undefined,
      tier: row.tier || 'executive',
      tags: row.tags || [],
      permanentPreferences: row.permanent_preferences || {},
      trips: row.trips || [],
      totalTripsCount: row.total_trips_count || (row.trips || []).length,
      totalSpendEstimate: row.total_spend_estimate || undefined,
      firstContactDate: row.first_contact_date || new Date().toISOString().split('T')[0],
      lastContactDate: row.last_contact_date || new Date().toISOString().split('T')[0],
      generalNotes: row.general_notes || undefined,
    }));
  } catch {
    return null;
  }
}

/* =========================================================================
   PACKAGES CLOUD DATABASE SYNC
   ========================================================================= */

/**
 * Saves managed packages to Supabase cloud database.
 * Dual-layer: saves to dedicated 'packages' table AND resilient system config backup.
 */
export async function syncPackagesToSupabase(packages: ManagedPackage[]): Promise<boolean> {
  let tableSuccess = false;
  try {
    const rows = packages.map((pkg) => ({
      id: pkg.id,
      name: pkg.name,
      category: pkg.category,
      price: pkg.price,
      currency: pkg.currency,
      duration: pkg.duration,
      hotel: pkg.hotel,
      flight: pkg.flight,
      financial_perk: pkg.financialPerk,
      badge: pkg.badge || null,
      is_available: pkg.isAvailable,
      features: pkg.features || []
    }));

    const { error } = await supabase.from('packages').upsert(rows, { onConflict: 'id' });
    if (!error) {
      tableSuccess = true;
      // Clean up packages that were removed
      const { data: allRows } = await supabase.from('packages').select('id');
      if (allRows) {
        const currentIds = new Set(packages.map((p) => p.id));
        for (const r of allRows) {
          if (!currentIds.has(r.id)) {
            await supabase.from('packages').delete().eq('id', r.id);
          }
        }
      }
    }
  } catch {}

  // Always persist into system config record so it works immediately across all devices
  try {
    const { error: confError } = await supabase.from('bookings').upsert({
      id: 'SYS_PACKAGES_CONFIG',
      name: '[SYSTEM_PACKAGES]',
      phone: '0000000000',
      service_or_package: 'SYSTEM_CONFIG',
      notes: JSON.stringify(packages),
      status: 'system'
    });
    return !confError || tableSuccess;
  } catch (err) {
    console.warn('Supabase packages sync notice:', err);
    return tableSuccess;
  }
}

/**
 * Fetches managed packages from Supabase cloud database.
 */
export async function fetchPackagesFromSupabase(): Promise<ManagedPackage[] | null> {
  // 1. Try dedicated table first
  try {
    const { data, error } = await supabase.from('packages').select('*');
    if (!error && data && data.length > 0) {
      return data.map((row: any) => ({
        id: row.id,
        name: row.name,
        category: row.category,
        price: row.price,
        currency: row.currency,
        duration: row.duration,
        hotel: row.hotel,
        flight: row.flight,
        financialPerk: row.financial_perk || '',
        badge: row.badge || undefined,
        isAvailable: row.is_available ?? true,
        features: Array.isArray(row.features) ? row.features : []
      }));
    }
  } catch {}

  // 2. Fallback to system config record
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('notes')
      .eq('id', 'SYS_PACKAGES_CONFIG')
      .maybeSingle();

    if (!error && data?.notes) {
      const parsed = JSON.parse(data.notes);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Supabase packages fetch notice:', err);
  }
  return null;
}

/* =========================================================================
   HOTELS CLOUD DATABASE SYNC
   ========================================================================= */

/**
 * Saves managed hotels to Supabase cloud database.
 */
export async function syncHotelsToSupabase(hotels: ManagedHotel[]): Promise<boolean> {
  let tableSuccess = false;
  try {
    const rows = hotels.map((h) => ({
      id: h.id,
      name: h.name,
      name_en: h.nameEn,
      city: h.city,
      location: h.location,
      distance_to_haram: h.distanceToHaram,
      stars: h.stars,
      rating_score: h.ratingScore,
      description: h.description,
      cover_image: h.coverImage,
      gallery: h.gallery || [],
      amenities: h.amenities || [],
      room_types: h.roomTypes || [],
      is_featured: h.isFeatured,
      order_num: h.order
    }));

    const { error } = await supabase.from('hotels').upsert(rows, { onConflict: 'id' });
    if (!error) {
      tableSuccess = true;
      const { data: allRows } = await supabase.from('hotels').select('id');
      if (allRows) {
        const currentIds = new Set(hotels.map((h) => h.id));
        for (const r of allRows) {
          if (!currentIds.has(r.id)) {
            await supabase.from('hotels').delete().eq('id', r.id);
          }
        }
      }
    }
  } catch {}

  try {
    const { error: confError } = await supabase.from('bookings').upsert({
      id: 'SYS_HOTELS_CONFIG',
      name: '[SYSTEM_HOTELS]',
      phone: '0000000000',
      service_or_package: 'SYSTEM_CONFIG',
      notes: JSON.stringify(hotels),
      status: 'system'
    });
    return !confError || tableSuccess;
  } catch (err) {
    console.warn('Supabase hotels sync notice:', err);
    return tableSuccess;
  }
}

/**
 * Fetches managed hotels from Supabase cloud database.
 */
export async function fetchHotelsFromSupabase(): Promise<ManagedHotel[] | null> {
  // 1. Try dedicated table first
  try {
    const { data, error } = await supabase.from('hotels').select('*').order('order_num', { ascending: true });
    if (!error && data && data.length > 0) {
      return data.map((row: any) => ({
        id: row.id,
        name: row.name,
        nameEn: row.name_en || row.nameEn || '',
        city: row.city || 'makkah',
        location: row.location,
        distanceToHaram: row.distance_to_haram || row.distanceToHaram || '',
        stars: row.stars ?? 5,
        ratingScore: row.rating_score || row.ratingScore || '4.9',
        description: row.description || '',
        coverImage: row.cover_image || row.coverImage || '',
        gallery: Array.isArray(row.gallery) ? row.gallery : [],
        amenities: Array.isArray(row.amenities) ? row.amenities : [],
        roomTypes: Array.isArray(row.room_types) ? row.room_types : (row.roomTypes || []),
        isFeatured: !!(row.is_featured ?? row.isFeatured),
        order: row.order_num ?? row.order ?? 1
      }));
    }
  } catch {}

  // 2. Fallback to system config record
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('notes')
      .eq('id', 'SYS_HOTELS_CONFIG')
      .maybeSingle();

    if (!error && data?.notes) {
      const parsed = JSON.parse(data.notes);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Supabase hotels fetch notice:', err);
  }
  return null;
}

/* =========================================================================
   STAFF MEMBERS CLOUD DATABASE SYNC
   ========================================================================= */

/**
 * Saves staff members to Supabase cloud database.
 */
export async function syncStaffToSupabase(staff: StaffMember[]): Promise<boolean> {
  let tableSuccess = false;
  try {
    const rows = staff.map((s) => ({
      id: s.id,
      name: s.name,
      email: s.email,
      phone: s.phone,
      password: s.password,
      title: s.title,
      department: s.department,
      role: s.role,
      permissions: s.permissions,
      is_active: s.isActive,
      created_at: s.createdAt,
      last_login: s.lastLogin
    }));

    const { error } = await supabase.from('staff').upsert(rows, { onConflict: 'id' });
    if (!error) {
      tableSuccess = true;
      const { data: allRows } = await supabase.from('staff').select('id');
      if (allRows) {
        const currentIds = new Set(staff.map((s) => s.id));
        for (const r of allRows) {
          if (!currentIds.has(r.id)) {
            await supabase.from('staff').delete().eq('id', r.id);
          }
        }
      }
    }
  } catch {}

  try {
    const { error: confError } = await supabase.from('bookings').upsert({
      id: 'SYS_STAFF_CONFIG',
      name: '[SYSTEM_STAFF]',
      phone: '0000000000',
      service_or_package: 'SYSTEM_CONFIG',
      notes: JSON.stringify(staff),
      status: 'system'
    });
    return !confError || tableSuccess;
  } catch (err) {
    console.warn('Supabase staff sync notice:', err);
    return tableSuccess;
  }
}

/**
 * Fetches staff members from Supabase cloud database.
 */
export async function fetchStaffFromSupabase(): Promise<StaffMember[] | null> {
  try {
    const { data, error } = await supabase.from('staff').select('*');
    if (!error && data && data.length > 0) {
      return data.map((row: any) => ({
        id: row.id,
        name: row.name,
        email: row.email,
        phone: row.phone,
        password: row.password || '',
        title: row.title,
        department: row.department,
        role: row.role || 'bookings_officer',
        permissions: row.permissions || {},
        isActive: !!row.is_active,
        createdAt: row.created_at,
        lastLogin: row.last_login
      }));
    }
  } catch {}

  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('notes')
      .eq('id', 'SYS_STAFF_CONFIG')
      .maybeSingle();

    if (!error && data?.notes) {
      const parsed = JSON.parse(data.notes);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Supabase staff fetch notice:', err);
  }
  return null;
}

/* =========================================================================
   SITE / ADMIN SETTINGS CLOUD DATABASE SYNC
   ========================================================================= */

export interface CloudSiteSettings {
  contactName?: string;
  contactPhone?: string;
}

/**
 * Saves site settings to Supabase cloud database.
 */
export async function syncSettingsToSupabase(settings: CloudSiteSettings): Promise<boolean> {
  try {
    const { error } = await supabase.from('bookings').upsert({
      id: 'SYS_SETTINGS_CONFIG',
      name: '[SYSTEM_SETTINGS]',
      phone: '0000000000',
      service_or_package: 'SYSTEM_CONFIG',
      notes: JSON.stringify(settings),
      status: 'system'
    });
    return !error;
  } catch (err) {
    console.warn('Supabase settings sync notice:', err);
    return false;
  }
}

/**
 * Fetches site settings from Supabase cloud database.
 */
export async function fetchSettingsFromSupabase(): Promise<CloudSiteSettings | null> {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('notes')
      .eq('id', 'SYS_SETTINGS_CONFIG')
      .maybeSingle();

    if (!error && data?.notes) {
      return JSON.parse(data.notes);
    }
  } catch (err) {
    console.warn('Supabase settings fetch notice:', err);
  }
  return null;
}
