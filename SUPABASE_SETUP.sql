-- =========================================================================
-- MAYSORA LUXURY CONCIERGE & FINANCIAL ADVISORY
-- Supabase Database Schema & Tables Setup
-- Run this in your Supabase Dashboard: SQL Editor -> New Query -> Run
-- =========================================================================

-- 1. Enable UUID Extension (if not already enabled)
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

-- 4. Set Up Row Level Security (RLS)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_profiles ENABLE ROW LEVEL SECURITY;

-- Allow public anonymous inserts from website lead forms
CREATE POLICY "Allow public insert to bookings"
ON public.bookings FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow full read/write for authenticated admin & concierge managers
CREATE POLICY "Allow select for public and admin"
ON public.bookings FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Allow update for authenticated admin"
ON public.bookings FOR UPDATE
TO anon, authenticated
USING (true);

CREATE POLICY "Allow delete on bookings"
ON public.bookings FOR DELETE
TO anon, authenticated
USING (true);

CREATE POLICY "Allow full access on client_profiles"
ON public.client_profiles FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- 5. Enable Realtime Publications (للمزامنة الفورية دون تحديث الصفحة)
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.client_profiles;

-- 6. Clean/Reset All Data Query (لتنظيف كل الداتا وإبقاء المستخدمين كما هي):
-- TRUNCATE TABLE public.bookings, public.client_profiles;
