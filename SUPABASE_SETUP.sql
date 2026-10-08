-- =========================================================================
-- MAYSORA LUXURY CONCIERGE & FINANCIAL ADVISORY
-- Production Cloud Database Schema (Supabase)
-- Run this in your Supabase Dashboard: SQL Editor -> New Query -> Run
-- =========================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Bookings Table (الحجوزات والطلبات)
CREATE TABLE IF NOT EXISTS public.bookings (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    trip_type TEXT DEFAULT 'umrah',
    destination TEXT DEFAULT 'مكة المكرمة',
    service_or_package TEXT,
    guests_count INT DEFAULT 1,
    travel_date DATE,
    return_date DATE,
    flight_details TEXT,
    hotel_name TEXT,
    status TEXT DEFAULT 'new',
    is_archived BOOLEAN DEFAULT FALSE,
    notes TEXT,
    source TEXT
);

-- 3. Create VIP Client Profiles Table (الملفات الدائمة للعملاء وتاريخ الرحلات)
CREATE TABLE IF NOT EXISTS public.client_profiles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    email TEXT,
    nationality TEXT DEFAULT 'سعودي',
    passport_or_national_id TEXT,
    tier TEXT DEFAULT 'executive',
    tags JSONB DEFAULT '[]'::jsonb,
    permanent_preferences JSONB DEFAULT '{}'::jsonb,
    trips JSONB DEFAULT '[]'::jsonb,
    total_trips_count INT DEFAULT 0,
    total_spend_estimate TEXT,
    first_contact_date DATE DEFAULT CURRENT_DATE,
    last_contact_date DATE DEFAULT CURRENT_DATE,
    general_notes TEXT
);

-- 4. Create Packages Table (باقات الحج والعمرة والأسعار)
CREATE TABLE IF NOT EXISTS public.packages (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT,
    price TEXT,
    currency TEXT DEFAULT 'ر.س',
    duration TEXT,
    hotel TEXT,
    flight TEXT,
    financial_perk TEXT,
    badge TEXT,
    is_available BOOLEAN DEFAULT TRUE,
    features JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create Hotels Table (قائمة الفنادق والأسعار والصور)
CREATE TABLE IF NOT EXISTS public.hotels (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    name_en TEXT,
    city TEXT DEFAULT 'makkah',
    location TEXT,
    distance_to_haram TEXT,
    stars INT DEFAULT 5,
    rating_score TEXT DEFAULT '4.9',
    description TEXT,
    cover_image TEXT,
    gallery JSONB DEFAULT '[]'::jsonb,
    amenities JSONB DEFAULT '[]'::jsonb,
    room_types JSONB DEFAULT '[]'::jsonb,
    is_featured BOOLEAN DEFAULT FALSE,
    order_num INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create Staff Table (فريق العمل والموظفين)
CREATE TABLE IF NOT EXISTS public.staff (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'bookings_officer',
    title TEXT,
    phone TEXT,
    email TEXT,
    department TEXT,
    avatar TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_login TIMESTAMPTZ
);

-- 7. Create Site Settings Table (إعدادات الموقع وخطوط التواصل)
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Row Level Security (RLS) Policies
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Allow full public / anon access for website & admin operations
DO $$
BEGIN
    -- bookings
    DROP POLICY IF EXISTS "Allow all on bookings" ON public.bookings;
    CREATE POLICY "Allow all on bookings" ON public.bookings FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

    -- client_profiles
    DROP POLICY IF EXISTS "Allow all on client_profiles" ON public.client_profiles;
    CREATE POLICY "Allow all on client_profiles" ON public.client_profiles FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

    -- packages
    DROP POLICY IF EXISTS "Allow all on packages" ON public.packages;
    CREATE POLICY "Allow all on packages" ON public.packages FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

    -- hotels
    DROP POLICY IF EXISTS "Allow all on hotels" ON public.hotels;
    CREATE POLICY "Allow all on hotels" ON public.hotels FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

    -- staff
    DROP POLICY IF EXISTS "Allow all on staff" ON public.staff;
    CREATE POLICY "Allow all on staff" ON public.staff FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

    -- site_settings
    DROP POLICY IF EXISTS "Allow all on site_settings" ON public.site_settings;
    CREATE POLICY "Allow all on site_settings" ON public.site_settings FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
END $$;

-- 9. Enable Realtime Publications
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.client_profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.packages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.hotels;
ALTER PUBLICATION supabase_realtime ADD TABLE public.staff;
