-- Enable RLS
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;

-- Drop dan recreate policies dengan TO public
DROP POLICY IF EXISTS "Public articles are viewable by everyone" ON public.news_articles;
DROP POLICY IF EXISTS "Service role can insert news articles" ON public.news_articles;
DROP POLICY IF EXISTS "Service role can update news articles" ON public.news_articles;
DROP POLICY IF EXISTS "Service role can delete news articles" ON public.news_articles;

CREATE POLICY "Public articles are viewable by everyone"
ON public.news_articles AS PERMISSIVE FOR SELECT TO public USING (true);

CREATE POLICY "Service role can insert news articles"
ON public.news_articles AS PERMISSIVE FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Service role can update news articles"
ON public.news_articles AS PERMISSIVE FOR UPDATE TO public USING (true);

CREATE POLICY "Service role can delete news articles"
ON public.news_articles AS PERMISSIVE FOR DELETE TO public USING (true);

-- CRITICAL: Grant explicit permissions to roles
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.news_articles TO anon, authenticated;
GRANT ALL ON public.news_articles TO service_role;

-- Verify
SELECT COUNT(*) FROM public.news_articles;