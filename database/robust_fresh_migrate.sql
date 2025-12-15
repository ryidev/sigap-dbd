-- ============================================================================
-- ROBUST FRESH MIGRATION SCRIPT
-- ============================================================================
-- This script will:
-- 1. Drop all existing tables and triggers to ensure a clean slate.
-- 2. Re-create all tables with the correct schema.
-- 3. Set up RLS policies.
-- 4. Create a ROBUST auth trigger that won't block user registration on error.
-- 5. Seed initial data.

-- ============================================================================
-- 1. CLEANUP (DROP EVERYTHING)
-- ============================================================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

DROP TABLE IF EXISTS public.user_achievements CASCADE;
DROP TABLE IF EXISTS public.weekly_prevention_progress CASCADE;
DROP TABLE IF EXISTS public.user_profiles CASCADE;
DROP TABLE IF EXISTS public.dengue_checks CASCADE;
DROP TABLE IF EXISTS public.news_articles CASCADE;

-- ============================================================================
-- 2. CREATE TABLES
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: news_articles
CREATE TABLE public.news_articles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    url TEXT UNIQUE,
    image_url TEXT,
    source_name TEXT,
    category TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public articles are viewable by everyone"
ON public.news_articles FOR SELECT
USING (true);

-- Table: dengue_checks
CREATE TABLE public.dengue_checks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    kdema TEXT,
    ddema NUMERIC,
    suhun NUMERIC,
    ulabo TEXT,
    jwbcs NUMERIC,
    hemog NUMERIC,
    hemat NUMERIC,
    jplat NUMERIC,
    skpla TEXT,
    nymat TEXT,
    nysen TEXT,
    rsmul TEXT,
    hinfm TEXT,
    nyper TEXT,
    mumun TEXT,
    mdiar TEXT,
    prediction INTEGER,
    probability NUMERIC,
    model_used TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.dengue_checks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own checks"
ON public.dengue_checks FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own checks"
ON public.dengue_checks FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can delete their own checks"
ON public.dengue_checks FOR DELETE
USING (auth.uid() = user_id);

-- Table: user_profiles
CREATE TABLE public.user_profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
    full_name TEXT,
    avatar_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone." ON public.user_profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Table: weekly_prevention_progress
CREATE TABLE public.weekly_prevention_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    week_start DATE NOT NULL,
    completed_items TEXT[] DEFAULT '{}',
    total_items INTEGER DEFAULT 0,
    completion_percentage NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.weekly_prevention_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own progress" ON public.weekly_prevention_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" ON public.weekly_prevention_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON public.weekly_prevention_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- Table: user_achievements
CREATE TABLE public.user_achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    badge_id TEXT NOT NULL,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own achievements" ON public.user_achievements
    FOR SELECT USING (auth.uid() = user_id);

-- ============================================================================
-- 3. ROBUST AUTH TRIGGER
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  _full_name TEXT;
  _avatar_url TEXT;
BEGIN
  -- Try to get name from various metadata fields
  _full_name := COALESCE(
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'user_name',
    'User'
  );

  _avatar_url := new.raw_user_meta_data->>'avatar_url';

  -- Insert profile with conflict handling
  INSERT INTO public.user_profiles (id, full_name, avatar_url)
  VALUES (new.id, _full_name, _avatar_url)
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url,
    updated_at = now();

  RETURN new;
EXCEPTION WHEN OTHERS THEN
  -- CRITICAL: Catch all errors so the user creation in auth.users DOES NOT FAIL.
  RAISE WARNING 'Error in handle_new_user trigger: %', SQLERRM;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============================================================================
-- 4. SEED DATA
-- ============================================================================

INSERT INTO public.news_articles (
    title, description, url, image_url, published_at, source_name, category
) VALUES
(
    'Waspada! Kasus DBD Meningkat 40% di Musim Hujan 2025',
    'Kementerian Kesehatan melaporkan lonjakan kasus demam berdarah dengue (DBD) hingga 40% dibandingkan periode yang sama tahun lalu.',
    'https://sehatnegeriku.kemkes.go.id/artikel/waspada-kasus-dbd-meningkat-2025',
    'https://images.unsplash.com/photo-1584515933487-779824d29309?w=800',
    NOW() - INTERVAL '2 hours',
    'Kementerian Kesehatan RI',
    'Berita DBD Terbaru'
),
(
    'Panduan Lengkap Pencegahan DBD dengan Metode 3M Plus',
    'Metode 3M Plus terbukti efektif menurunkan kasus DBD hingga 70%.',
    'https://dinkes.jakarta.go.id/berita/panduan-3m-plus-pencegahan-dbd',
    'https://images.unsplash.com/photo-1628595351029-c2bf17511435?w=800',
    NOW() - INTERVAL '1 day',
    'Dinas Kesehatan DKI Jakarta',
    'Pencegahan DBD'
),
(
    'Vaksin Dengue Qdenga Resmi Tersedia di Indonesia',
    'Takeda Pharmaceutical meluncurkan vaksin dengue Qdenga (TAK-003) di Indonesia.',
    'https://www.takeda.com/id-id/newsroom/qdenga-vaksin-dengue-indonesia',
    'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800',
    NOW() - INTERVAL '3 days',
    'Takeda Pharmaceuticals',
    'Vaksin Dengue'
),
(
    'AI dan Machine Learning Percepat Diagnosis DBD',
    'Peneliti Indonesia mengembangkan sistem deteksi dini DBD berbasis AI yang mampu memprediksi dengan akurasi 92%.',
    'https://www.itb.ac.id/news/ai-machine-learning-diagnosis-dbd',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
    NOW() - INTERVAL '5 days',
    'Institut Teknologi Bandung',
    'Teknologi Deteksi'
),
(
    'Fogging Bukan Solusi Utama, Ini Cara Tepat Basmi Nyamuk DBD',
    'Pakar kesehatan mengingatkan bahwa fogging hanya bersifat sementara dan tidak membunuh jentik nyamuk.',
    'https://fkm.ui.ac.id/fogging-bukan-solusi-utama-basmi-dbd',
    'https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=800',
    NOW() - INTERVAL '1 week',
    'Fakultas Kesehatan Masyarakat UI',
    'Pencegahan DBD'
),
(
    'Gejala DBD yang Sering Diabaikan, Waspadai Tanda Bahayanya',
    'Tidak semua demam adalah DBD, namun ada tanda-tanda khusus yang perlu diwaspadai.',
    'https://rscm.co.id/artikel/gejala-dbd-tanda-bahaya',
    'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800',
    NOW() - INTERVAL '10 days',
    'RSUPN Dr. Cipto Mangunkusumo',
    'Berita DBD Terbaru'
)
ON CONFLICT (url) DO NOTHING;
