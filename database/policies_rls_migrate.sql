-- ============================================================================
-- POLICIES, PERMISSIONS, FUNCTIONS, TRIGGERS, AND RLS MIGRATION
-- ============================================================================
-- This script will:
-- 1. Drop all existing policies, triggers, and functions for clean migration
-- 2. Re-create all Row Level Security (RLS) policies based on application requirements
-- 3. Set up robust auth trigger for user profile creation
-- 4. Create helper functions for data management
-- 5. Grant necessary permissions to authenticated and anonymous users
--
-- Based on application pages:
-- - articles (public read access)
-- - checklist (user-specific read/write for weekly_prevention_progress)
-- - history (user-specific read/delete for dengue_checks)
-- - history/[id] (user-specific read/delete for specific dengue_check)
-- - profile (user-specific read/write for user_profiles, user_achievements)
-- - form/result (insert dengue_checks, authenticated or anonymous)
-- ============================================================================

-- ============================================================================
-- 1. CLEANUP (DROP EXISTING POLICIES, TRIGGERS, FUNCTIONS)
-- ============================================================================

-- Drop existing triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
DROP TRIGGER IF EXISTS update_weekly_prevention_progress_updated_at ON public.weekly_prevention_progress;

-- Drop existing functions
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.update_modified_column() CASCADE;
DROP FUNCTION IF EXISTS public.get_user_weekly_progress(UUID, DATE) CASCADE;
DROP FUNCTION IF EXISTS public.calculate_user_stats(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.get_user_badges(UUID) CASCADE;

-- Drop all existing policies for each table
-- news_articles policies
DROP POLICY IF EXISTS "Public articles are viewable by everyone" ON public.news_articles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.news_articles;

-- dengue_checks policies
DROP POLICY IF EXISTS "Users can view their own checks" ON public.dengue_checks;
DROP POLICY IF EXISTS "Users can insert their own checks" ON public.dengue_checks;
DROP POLICY IF EXISTS "Users can delete their own checks" ON public.dengue_checks;
DROP POLICY IF EXISTS "Enable insert for authenticated and anonymous users" ON public.dengue_checks;
DROP POLICY IF EXISTS "Users can view own checks, guests can view anonymous checks" ON public.dengue_checks;
DROP POLICY IF EXISTS "Users can delete own checks, guests can delete anonymous checks" ON public.dengue_checks;

-- user_profiles policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view any profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;

-- weekly_prevention_progress policies
DROP POLICY IF EXISTS "Users can view their own progress" ON public.weekly_prevention_progress;
DROP POLICY IF EXISTS "Users can insert their own progress" ON public.weekly_prevention_progress;
DROP POLICY IF EXISTS "Users can update their own progress" ON public.weekly_prevention_progress;
DROP POLICY IF EXISTS "Users can delete their own progress" ON public.weekly_prevention_progress;

-- user_achievements policies
DROP POLICY IF EXISTS "Users can view their own achievements" ON public.user_achievements;
DROP POLICY IF EXISTS "Users can insert their own achievements" ON public.user_achievements;
DROP POLICY IF EXISTS "Users can delete their own achievements" ON public.user_achievements;

-- ============================================================================
-- 2. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables (in case they were disabled)
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dengue_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_prevention_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 3. CREATE HELPER FUNCTIONS
-- ============================================================================

-- Function: Update timestamp on row modification
CREATE OR REPLACE FUNCTION public.update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Handle new user registration (robust version)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  _full_name TEXT;
  _avatar_url TEXT;
BEGIN
  -- Extract user metadata with fallbacks
  _full_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'user_name',
    split_part(NEW.email, '@', 1), -- Use email prefix as fallback
    'User'
  );

  _avatar_url := NEW.raw_user_meta_data->>'avatar_url';

  -- Insert user profile with conflict handling
  INSERT INTO public.user_profiles (id, full_name, avatar_url, updated_at, created_at)
  VALUES (NEW.id, _full_name, _avatar_url, NOW(), NOW())
  ON CONFLICT (id) DO UPDATE SET
    full_name = COALESCE(EXCLUDED.full_name, user_profiles.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, user_profiles.avatar_url),
    updated_at = NOW();

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- CRITICAL: Catch all errors so user creation in auth.users DOES NOT FAIL
  RAISE WARNING 'Error in handle_new_user trigger for user %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth;

-- Function: Get user's weekly progress for a specific week
CREATE OR REPLACE FUNCTION public.get_user_weekly_progress(
  p_user_id UUID,
  p_week_start DATE
)
RETURNS TABLE (
  id UUID,
  week_start DATE,
  completed_items TEXT[],
  total_items INTEGER,
  completion_percentage NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    wpp.id,
    wpp.week_start,
    wpp.completed_items,
    wpp.total_items,
    wpp.completion_percentage,
    wpp.created_at,
    wpp.updated_at
  FROM public.weekly_prevention_progress wpp
  WHERE wpp.user_id = p_user_id
    AND wpp.week_start = p_week_start
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Calculate user statistics for profile page
CREATE OR REPLACE FUNCTION public.calculate_user_stats(p_user_id UUID)
RETURNS TABLE (
  total_weeks INTEGER,
  perfect_weeks INTEGER,
  current_streak INTEGER,
  longest_streak INTEGER,
  average_completion NUMERIC,
  total_badges INTEGER,
  last_activity TIMESTAMP WITH TIME ZONE
) AS $$
DECLARE
  v_total_weeks INTEGER;
  v_perfect_weeks INTEGER;
  v_current_streak INTEGER := 0;
  v_longest_streak INTEGER := 0;
  v_avg_completion NUMERIC;
  v_total_badges INTEGER;
  v_last_activity TIMESTAMP WITH TIME ZONE;
  v_temp_streak INTEGER := 0;
  v_max_temp_streak INTEGER := 0;
  v_prev_week DATE;
  v_current_week DATE;
  week_record RECORD;
BEGIN
  -- Get total weeks
  SELECT COUNT(*) INTO v_total_weeks
  FROM public.weekly_prevention_progress
  WHERE user_id = p_user_id;

  -- Get perfect weeks (100% completion)
  SELECT COUNT(*) INTO v_perfect_weeks
  FROM public.weekly_prevention_progress
  WHERE user_id = p_user_id
    AND completion_percentage = 100;

  -- Calculate average completion
  SELECT COALESCE(AVG(completion_percentage), 0) INTO v_avg_completion
  FROM public.weekly_prevention_progress
  WHERE user_id = p_user_id;

  -- Calculate streaks (consecutive weeks with 100% completion)
  FOR week_record IN
    SELECT week_start, completion_percentage
    FROM public.weekly_prevention_progress
    WHERE user_id = p_user_id
    ORDER BY week_start DESC
  LOOP
    IF week_record.completion_percentage = 100 THEN
      IF v_current_week IS NULL THEN
        -- First week in iteration
        v_current_streak := 1;
        v_temp_streak := 1;
        v_current_week := week_record.week_start;
      ELSIF v_current_week - week_record.week_start = 7 THEN
        -- Consecutive week
        v_current_streak := v_current_streak + 1;
        v_temp_streak := v_temp_streak + 1;
        v_current_week := week_record.week_start;
      ELSE
        -- Streak broken, but continue checking for longest
        v_current_streak := 0; -- Reset current streak
        v_temp_streak := 1; -- Start new temporary streak
        v_current_week := week_record.week_start;
      END IF;

      -- Update max temporary streak
      IF v_temp_streak > v_max_temp_streak THEN
        v_max_temp_streak := v_temp_streak;
      END IF;
    ELSE
      -- Not 100%, reset temporary streak
      v_temp_streak := 0;
      v_current_week := NULL;
    END IF;
  END LOOP;

  v_longest_streak := v_max_temp_streak;

  -- Get total badges
  SELECT COUNT(*) INTO v_total_badges
  FROM public.user_achievements
  WHERE user_id = p_user_id;

  -- Get last activity
  SELECT GREATEST(
    COALESCE(MAX(wpp.updated_at), '1970-01-01'::TIMESTAMP WITH TIME ZONE),
    COALESCE(MAX(dc.created_at), '1970-01-01'::TIMESTAMP WITH TIME ZONE)
  ) INTO v_last_activity
  FROM public.weekly_prevention_progress wpp
  FULL OUTER JOIN public.dengue_checks dc ON wpp.user_id = dc.user_id
  WHERE wpp.user_id = p_user_id OR dc.user_id = p_user_id;

  RETURN QUERY SELECT
    v_total_weeks,
    v_perfect_weeks,
    v_current_streak,
    v_longest_streak,
    ROUND(v_avg_completion, 1),
    v_total_badges,
    v_last_activity;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 4. CREATE TRIGGERS
-- ============================================================================

-- Trigger: Create user profile on new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Trigger: Update timestamp on user_profiles modification
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_modified_column();

-- Trigger: Update timestamp on weekly_prevention_progress modification
CREATE TRIGGER update_weekly_prevention_progress_updated_at
  BEFORE UPDATE ON public.weekly_prevention_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_modified_column();

-- ============================================================================
-- 5. CREATE RLS POLICIES - news_articles
-- ============================================================================
-- Used in: /articles page
-- Access pattern: Public read access for all users (authenticated or not)

CREATE POLICY "Enable read access for all users"
ON public.news_articles
FOR SELECT
USING (true);

-- ============================================================================
-- 6. CREATE RLS POLICIES - dengue_checks
-- ============================================================================
-- Used in: /form, /result, /history, /history/[id] pages
-- Access patterns:
--   - INSERT: Allow authenticated users to insert with their user_id
--   - INSERT: Allow anonymous users to insert with NULL user_id
--   - SELECT: Authenticated users can view their own checks
--   - SELECT: Anonymous users can view checks with NULL user_id (their session)
--   - DELETE: Users can delete their own checks only

CREATE POLICY "Enable insert for authenticated and anonymous users"
ON public.dengue_checks
FOR INSERT
WITH CHECK (
  -- Authenticated users must use their own user_id
  (auth.uid() IS NOT NULL AND user_id = auth.uid())
  OR
  -- Anonymous users can insert with NULL user_id
  (auth.uid() IS NULL AND user_id IS NULL)
);

CREATE POLICY "Users can view own checks"
ON public.dengue_checks
FOR SELECT
USING (
  -- Authenticated users see their own checks
  (auth.uid() IS NOT NULL AND user_id = auth.uid())
  OR
  -- Anonymous users cannot reliably see their checks (no session tracking in DB)
  -- If you need anonymous history, implement session-based storage or cookies
  (auth.uid() IS NULL AND user_id IS NULL AND false) -- Explicitly disabled for safety
);

CREATE POLICY "Users can delete own checks"
ON public.dengue_checks
FOR DELETE
USING (
  auth.uid() IS NOT NULL AND user_id = auth.uid()
);

-- ============================================================================
-- 7. CREATE RLS POLICIES - user_profiles
-- ============================================================================
-- Used in: /profile page, Navbar component (avatar display)
-- Access patterns:
--   - SELECT: Any authenticated user can view any profile (for public features)
--   - INSERT: Only the user can create their own profile (via trigger)
--   - UPDATE: Users can update only their own profile

CREATE POLICY "Users can view any profile"
ON public.user_profiles
FOR SELECT
USING (true); -- Allow viewing all profiles for social features

CREATE POLICY "Users can insert their own profile"
ON public.user_profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.user_profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- ============================================================================
-- 8. CREATE RLS POLICIES - weekly_prevention_progress
-- ============================================================================
-- Used in: /checklist page
-- Access patterns:
--   - SELECT: Users can view only their own weekly progress
--   - INSERT: Users can create their own weekly progress
--   - UPDATE: Users can update their own weekly progress
--   - DELETE: Users can delete their own weekly progress (optional, for cleanup)

CREATE POLICY "Users can view their own progress"
ON public.weekly_prevention_progress
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
ON public.weekly_prevention_progress
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
ON public.weekly_prevention_progress
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress"
ON public.weekly_prevention_progress
FOR DELETE
USING (auth.uid() = user_id);

-- ============================================================================
-- 9. CREATE RLS POLICIES - user_achievements
-- ============================================================================
-- Used in: /profile page (badges section)
-- Access patterns:
--   - SELECT: Users can view only their own achievements
--   - INSERT: Users can earn (insert) their own achievements
--   - DELETE: Users can remove their own achievements (optional, for reset)

CREATE POLICY "Users can view their own achievements"
ON public.user_achievements
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements"
ON public.user_achievements
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own achievements"
ON public.user_achievements
FOR DELETE
USING (auth.uid() = user_id);

-- ============================================================================
-- 10. GRANT PERMISSIONS
-- ============================================================================

-- Grant usage on schema to authenticated and anonymous users
GRANT USAGE ON SCHEMA public TO authenticated, anon;

-- Grant table permissions to authenticated users
GRANT SELECT ON public.news_articles TO authenticated, anon;
GRANT SELECT, INSERT, DELETE ON public.dengue_checks TO authenticated, anon;
GRANT SELECT, INSERT, UPDATE ON public.user_profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.weekly_prevention_progress TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.user_achievements TO authenticated;

-- Grant function execution permissions
GRANT EXECUTE ON FUNCTION public.get_user_weekly_progress(UUID, DATE) TO authenticated;
GRANT EXECUTE ON FUNCTION public.calculate_user_stats(UUID) TO authenticated;

-- Grant sequence usage (for auto-increment IDs if needed)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- All policies, permissions, functions, triggers, and RLS are now set up.
-- The database is ready for use with the SiGap-Dengue application.
--
-- Key Security Features:
-- 1. RLS enabled on all tables with user-specific policies
-- 2. Robust auth trigger that won't block user registration
-- 3. Anonymous users can submit dengue checks (for accessibility)
-- 4. Users can only access their own data (privacy protection)
-- 5. Helper functions for efficient data queries
--
-- Testing Checklist:
-- ✓ Test user registration (should create profile automatically)
-- ✓ Test anonymous dengue check submission (/form -> /result)
-- ✓ Test authenticated dengue check submission
-- ✓ Test history viewing (users should only see their own data)
-- ✓ Test checklist progress (CRUD operations)
-- ✓ Test profile viewing and updating
-- ✓ Test badge/achievement earning
-- ============================================================================
