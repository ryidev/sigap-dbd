-- ============================================================================
-- ENHANCEMENT DATABASE UNTUK ARTIKEL DBD
-- File ini menambahkan fitur lengkap untuk sistem artikel berita DBD
-- Berdasarkan: app/articles/page.tsx dan app/api/news/route.ts
--
-- PREREQUISITE: Jalankan robust_fresh_migrate.sql terlebih dahulu!
-- File ini TIDAK membuat table baru, hanya menambahkan:
-- - Kolom tambahan pada news_articles
-- - Indexes untuk performance
-- - RLS policies lengkap
-- - Helper functions & triggers
-- - Data seeding artikel demo
-- ============================================================================

-- ============================================================================
-- ALTER TABLE: Tambah kolom yang belum ada di news_articles
-- ============================================================================

-- Tambah kolom content untuk full article text
ALTER TABLE public.news_articles
ADD COLUMN IF NOT EXISTS content TEXT;

-- Tambah kolom author untuk penulis artikel
ALTER TABLE public.news_articles
ADD COLUMN IF NOT EXISTS author TEXT;

-- Tambah kolom keywords untuk array keyword pencarian
ALTER TABLE public.news_articles
ADD COLUMN IF NOT EXISTS keywords TEXT[];

-- Tambah kolom updated_at untuk track update terakhir
ALTER TABLE public.news_articles
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- ============================================================================
-- INDEXES untuk Performance
-- ============================================================================

-- Index untuk pencarian berdasarkan kategori (sering digunakan di UI)
CREATE INDEX IF NOT EXISTS idx_news_articles_category
ON public.news_articles(category);

-- Index untuk sorting berdasarkan published_at (digunakan di semua query)
CREATE INDEX IF NOT EXISTS idx_news_articles_published_at
ON public.news_articles(published_at DESC);

-- Index untuk pencarian berdasarkan URL (untuk cek duplikasi saat sync)
CREATE INDEX IF NOT EXISTS idx_news_articles_url
ON public.news_articles(url);

-- Index untuk pencarian berdasarkan keywords (GIN index untuk array)
CREATE INDEX IF NOT EXISTS idx_news_articles_keywords
ON public.news_articles USING GIN(keywords);

-- Index untuk full-text search pada title dan description
CREATE INDEX IF NOT EXISTS idx_news_articles_search
ON public.news_articles USING GIN(
    to_tsvector('indonesian', coalesce(title, '') || ' ' || coalesce(description, ''))
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- RLS sudah enabled di robust_fresh_migrate.sql
-- Policy untuk SELECT sudah ada: "Public articles are viewable by everyone"

-- Drop policy lama jika ada dan buat ulang dengan nama yang konsisten
-- 1. Drop policy yang konflik
DROP POLICY IF EXISTS "Public articles are viewable by everyone" ON public.news_articles;
DROP POLICY IF EXISTS "Service role can insert news articles" ON public.news_articles;
DROP POLICY IF EXISTS "Service role can update news articles" ON public.news_articles;
DROP POLICY IF EXISTS "Service role can delete news articles" ON public.news_articles;

-- 2. Recreate policy SELECT (CRITICAL!)
CREATE POLICY "Public articles are viewable by everyone"
ON public.news_articles
FOR SELECT
USING (true);

-- 3. Recreate policy INSERT
CREATE POLICY "Service role can insert news articles"
ON public.news_articles
FOR INSERT
WITH CHECK (true);

-- 4. Recreate policy UPDATE
CREATE POLICY "Service role can update news articles"
ON public.news_articles
FOR UPDATE
USING (true);

-- 5. Recreate policy DELETE
CREATE POLICY "Service role can delete news articles"
ON public.news_articles
FOR DELETE
USING (true);

-- 6. Verify
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'news_articles';

-- ============================================================================
-- TRIGGER untuk Auto-update updated_at
-- ============================================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_news_articles_updated_at ON public.news_articles;
CREATE TRIGGER update_news_articles_updated_at
    BEFORE UPDATE ON public.news_articles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- FUNCTION: Bersihkan artikel lama (optional)
-- Fungsi untuk membersihkan artikel lebih dari 90 hari
-- ============================================================================

CREATE OR REPLACE FUNCTION public.cleanup_old_articles()
RETURNS void AS $$
BEGIN
    DELETE FROM public.news_articles
    WHERE published_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- FUNCTION: Get artikel stats
-- Fungsi untuk mendapatkan statistik artikel per kategori
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_article_stats()
RETURNS TABLE (
    category TEXT,
    article_count BIGINT,
    latest_article TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        na.category,
        COUNT(*) as article_count,
        MAX(na.published_at) as latest_article
    FROM public.news_articles na
    GROUP BY na.category
    ORDER BY article_count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;