/**
 * Supabase Cloud Database Client
 * Handles real-time sync for Leads, Bookings, and VIP Client Dossiers.
 */
import { createClient } from '@supabase/supabase-js';
import type { AdminBooking, ClientProfile } from './adminService';

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
 * Fetches all bookings from Supabase.
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

    return data.map((row: any) => ({
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
