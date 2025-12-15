-- ==========================================
-- QUICK FIX: Disable RLS untuk Development
-- ==========================================
-- Copy dan paste script ini ke Supabase SQL Editor
-- Klik "Run" untuk execute

-- 1. Disable RLS
ALTER TABLE otp_verifications DISABLE ROW LEVEL SECURITY;

-- 2. Grant ALL permissions
GRANT ALL ON otp_verifications TO authenticated;
GRANT ALL ON otp_verifications TO service_role;
GRANT ALL ON otp_verifications TO anon;

-- 3. Verify (should return true)
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'otp_verifications';

-- ==========================================
-- Expected result:
-- tablename           | rowsecurity
-- --------------------|------------
-- otp_verifications   | f (false = disabled)
-- ==========================================

-- 4. Test insert (should work)
INSERT INTO otp_verifications (
  email, 
  otp_code, 
  expires_at, 
  is_verified, 
  attempts
) VALUES (
  'test@example.com',
  '123456',
  NOW() + INTERVAL '10 minutes',
  false,
  0
);

-- 5. Verify insert worked
SELECT * FROM otp_verifications WHERE email = 'test@example.com';

-- 6. Clean up test data
DELETE FROM otp_verifications WHERE email = 'test@example.com';

-- ==========================================
-- ✅ DONE! Now restart your dev server:
-- bun run dev
-- ==========================================
