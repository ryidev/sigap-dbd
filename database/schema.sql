-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: news_articles
-- Used in: app/api/news/route.ts
CREATE TABLE IF NOT EXISTS public.news_articles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    url TEXT,
    image_url TEXT,
    source_name TEXT,
    category TEXT, -- 'Berita DBD Terbaru', 'Pencegahan DBD', etc.
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for news_articles (Optional, adjust policies as needed)
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to news
CREATE POLICY "Public articles are viewable by everyone"
ON public.news_articles FOR SELECT
USING (true);

-- Policy: Allow authenticated users and service role to insert news articles
CREATE POLICY "Authenticated users can insert news articles"
ON public.news_articles FOR INSERT
WITH CHECK (true);


-- Table: dengue_checks
-- Used in: lib/dengue-service.ts
CREATE TABLE IF NOT EXISTS public.dengue_checks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Nullable if anonymous

    -- Symptoms (Gejala)
    kdema TEXT, -- 'Iya' | 'Tidak'
    ddema NUMERIC,
    suhun NUMERIC,

    -- Lab Results
    ulabo TEXT, -- 'Sudah' | 'Belum'
    jwbcs NUMERIC,
    hemog NUMERIC,
    hemat NUMERIC,
    jplat NUMERIC,

    -- Additional Symptoms
    skpla TEXT,
    nymat TEXT,
    nysen TEXT,
    rsmul TEXT,
    hinfm TEXT,
    nyper TEXT,
    mumun TEXT,
    mdiar TEXT,

    -- Prediction Result
    prediction INTEGER, -- 0 | 1
    probability NUMERIC,
    model_used TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for dengue_checks
ALTER TABLE public.dengue_checks ENABLE ROW LEVEL SECURITY;

-- Policy: Users can see their own checks
CREATE POLICY "Users can view their own checks"
ON public.dengue_checks FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can insert their own checks (or anonymous)
CREATE POLICY "Users can insert their own checks"
ON public.dengue_checks FOR INSERT
WITH CHECK (true); -- Modified to allow anonymous inserts implies simpler public insert, or auth.uid() check if strictly enforced. Code allows user_id to be null.

-- Policy: Users can delete their own checks
CREATE POLICY "Users can delete their own checks"
ON public.dengue_checks FOR DELETE
USING (auth.uid() = user_id);

-- ============================================================================
-- SEEDING DATA: 6 Artikel Berita DBD untuk Testing & Demo
-- ============================================================================

INSERT INTO public.news_articles (
    title,
    description,
    url,
    image_url,
    published_at,
    source_name,
    category
) VALUES
(
    'Waspada! Kasus DBD Meningkat 40% di Musim Hujan 2025',
    'Kementerian Kesehatan melaporkan lonjakan kasus demam berdarah dengue (DBD) hingga 40% dibandingkan periode yang sama tahun lalu. Masyarakat diminta waspada dan menerapkan 3M Plus untuk mencegah penyebaran DBD.',
    'https://sehatnegeriku.kemkes.go.id/artikel/waspada-kasus-dbd-meningkat-2025',
    'https://images.unsplash.com/photo-1584515933487-779824d29309?w=800',
    NOW() - INTERVAL '2 hours',
    'Kementerian Kesehatan RI',
    'Berita DBD Terbaru'
),
(
    'Panduan Lengkap Pencegahan DBD dengan Metode 3M Plus',
    'Metode 3M Plus terbukti efektif menurunkan kasus DBD hingga 70%. Simak panduan lengkap penerapannya untuk melindungi keluarga dari ancaman demam berdarah dengue.',
    'https://dinkes.jakarta.go.id/berita/panduan-3m-plus-pencegahan-dbd',
    'https://images.unsplash.com/photo-1628595351029-c2bf17511435?w=800',
    NOW() - INTERVAL '1 day',
    'Dinas Kesehatan DKI Jakarta',
    'Pencegahan DBD'
),
(
    'Vaksin Dengue Qdenga Resmi Tersedia di Indonesia',
    'Takeda Pharmaceutical meluncurkan vaksin dengue Qdenga (TAK-003) di Indonesia. Vaksin ini telah mendapat izin edar BPOM dan dapat diberikan untuk usia 6-45 tahun dengan efikasi mencapai 84% dalam mencegah rawat inap.',
    'https://www.takeda.com/id-id/newsroom/qdenga-vaksin-dengue-indonesia',
    'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800',
    NOW() - INTERVAL '3 days',
    'Takeda Pharmaceuticals',
    'Vaksin Dengue'
),
(
    'AI dan Machine Learning Percepat Diagnosis DBD',
    'Peneliti Indonesia mengembangkan sistem deteksi dini DBD berbasis AI yang mampu memprediksi dengan akurasi 92%. Teknologi ini diharapkan dapat mengurangi tingkat kematian akibat DBD melalui penanganan yang lebih cepat.',
    'https://www.itb.ac.id/news/ai-machine-learning-diagnosis-dbd',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
    NOW() - INTERVAL '5 days',
    'Institut Teknologi Bandung',
    'Teknologi Deteksi'
),
(
    'Fogging Bukan Solusi Utama, Ini Cara Tepat Basmi Nyamuk DBD',
    'Pakar kesehatan mengingatkan bahwa fogging hanya bersifat sementara dan tidak membunuh jentik nyamuk. Pemberantasan sarang nyamuk (PSN) lebih efektif untuk pencegahan jangka panjang dengan tingkat keberhasilan 70% lebih tinggi.',
    'https://fkm.ui.ac.id/fogging-bukan-solusi-utama-basmi-dbd',
    'https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=800',
    NOW() - INTERVAL '1 week',
    'Fakultas Kesehatan Masyarakat UI',
    'Pencegahan DBD'
),
(
    'Gejala DBD yang Sering Diabaikan, Waspadai Tanda Bahayanya',
    'Tidak semua demam adalah DBD, namun ada tanda-tanda khusus yang perlu diwaspadai. Kenali gejala awal dan fase kritis DBD untuk penanganan yang tepat waktu dan hindari komplikasi serius.',
    'https://rscm.co.id/artikel/gejala-dbd-tanda-bahaya',
    'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800',
    NOW() - INTERVAL '10 days',
    'RSUPN Dr. Cipto Mangunkusumo',
    'Berita DBD Terbaru'
)
ON CONFLICT (url) DO NOTHING;

-- ============================================================================
-- USER PROFILES & AUTH TRIGGERS
-- ============================================================================

-- Create a table for public profiles
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
    full_name TEXT,
    avatar_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS for user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone." ON public.user_profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, full_name, avatar_url)
    VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============================================================================
-- ADDITIONAL TABLES FOR PROFILE PAGE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.weekly_prevention_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    week_start DATE NOT NULL,
    completed_items TEXT[] DEFAULT ARRAY[]::TEXT[],
    total_items INTEGER DEFAULT 0,
    completion_percentage NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.weekly_prevention_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own progress" ON public.weekly_prevention_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" ON public.weekly_prevention_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON public.weekly_prevention_progress
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.user_achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    badge_id TEXT NOT NULL,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own achievements" ON public.user_achievements
    FOR SELECT USING (auth.uid() = user_id);

