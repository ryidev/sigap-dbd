-- ===================================================
-- SQL Script untuk Maintenance OTP Verifications
-- ===================================================

-- 1. CLEANUP: Hapus OTP yang sudah expired (lebih dari 24 jam)
-- Jalankan secara berkala untuk menjaga performa database
DELETE FROM otp_verifications
WHERE expires_at < NOW() - INTERVAL '24 hours';

-- 2. CLEANUP: Hapus OTP yang sudah verified dan lebih dari 30 hari
-- Data historis yang sudah tidak diperlukan
DELETE FROM otp_verifications
WHERE is_verified = true
  AND verified_at < NOW() - INTERVAL '30 days';

-- 3. VIEW: Statistik OTP per hari
-- Untuk monitoring usage
CREATE OR REPLACE VIEW otp_daily_stats AS
SELECT 
  DATE(created_at) as date,
  COUNT(*) as total_otp_sent,
  COUNT(CASE WHEN is_verified THEN 1 END) as total_verified,
  COUNT(CASE WHEN attempts >= 3 THEN 1 END) as total_max_attempts,
  ROUND(
    COUNT(CASE WHEN is_verified THEN 1 END)::numeric / 
    NULLIF(COUNT(*)::numeric, 0) * 100, 
    2
  ) as verification_rate_percent
FROM otp_verifications
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- 4. VIEW: User yang belum verifikasi OTP
-- Untuk follow-up atau reminder
CREATE OR REPLACE VIEW users_pending_verification AS
SELECT 
  ov.email,
  ov.user_id,
  ov.created_at as otp_sent_at,
  ov.attempts,
  ov.expires_at,
  CASE 
    WHEN ov.expires_at < NOW() THEN 'expired'
    WHEN ov.attempts >= 3 THEN 'max_attempts'
    ELSE 'pending'
  END as status
FROM otp_verifications ov
WHERE ov.is_verified = false
  AND ov.created_at = (
    SELECT MAX(created_at)
    FROM otp_verifications
    WHERE email = ov.email
  )
ORDER BY ov.created_at DESC;

-- 5. FUNCTION: Auto cleanup expired OTP
-- Bisa dijadwalkan dengan pg_cron atau external scheduler
CREATE OR REPLACE FUNCTION cleanup_expired_otp()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM otp_verifications
  WHERE expires_at < NOW() - INTERVAL '24 hours';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. INDEX: Untuk query performa yang lebih baik
-- Jika belum ada, buat index tambahan
CREATE INDEX IF NOT EXISTS idx_otp_is_verified ON otp_verifications(is_verified);
CREATE INDEX IF NOT EXISTS idx_otp_created_at ON otp_verifications(created_at);

-- 7. QUERY: Cek OTP untuk email tertentu
-- Ganti 'user@example.com' dengan email yang ingin dicek
/*
SELECT 
  id,
  email,
  otp_code,
  is_verified,
  attempts,
  expires_at,
  created_at,
  CASE 
    WHEN expires_at < NOW() THEN 'EXPIRED'
    WHEN is_verified THEN 'VERIFIED'
    WHEN attempts >= 3 THEN 'MAX_ATTEMPTS'
    ELSE 'ACTIVE'
  END as status
FROM otp_verifications
WHERE email = 'user@example.com'
ORDER BY created_at DESC
LIMIT 10;
*/

-- 8. QUERY: Top 10 users dengan OTP terbanyak (possible abuse)
-- Untuk monitoring spam/abuse
/*
SELECT 
  email,
  COUNT(*) as total_otp_requests,
  COUNT(CASE WHEN is_verified THEN 1 END) as verified_count,
  MAX(created_at) as last_request
FROM otp_verifications
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY email
HAVING COUNT(*) > 5
ORDER BY total_otp_requests DESC
LIMIT 10;
*/

-- 9. TRIGGER: Log OTP verification attempts (Optional)
-- Untuk audit trail yang lebih detail
/*
CREATE TABLE IF NOT EXISTS otp_audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  otp_id UUID REFERENCES otp_verifications(id),
  email VARCHAR(255),
  action VARCHAR(50),
  ip_address INET,
  user_agent TEXT,
  success BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_audit_email ON otp_audit_log(email);
CREATE INDEX idx_audit_created ON otp_audit_log(created_at);
*/

-- 10. Scheduled cleanup (jika menggunakan pg_cron extension)
-- Uncomment jika pg_cron tersedia di Supabase project Anda
/*
-- Install pg_cron extension (one time)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule cleanup setiap hari jam 2 pagi
SELECT cron.schedule(
  'cleanup-expired-otp',
  '0 2 * * *',
  'SELECT cleanup_expired_otp();'
);
*/

-- ===================================================
-- USAGE EXAMPLES
-- ===================================================

-- Lihat statistik OTP hari ini
-- SELECT * FROM otp_daily_stats WHERE date = CURRENT_DATE;

-- Lihat semua user yang pending verification
-- SELECT * FROM users_pending_verification LIMIT 20;

-- Manual cleanup expired OTP
-- SELECT cleanup_expired_otp();

-- Count total OTP di database
-- SELECT COUNT(*) FROM otp_verifications;

-- Count OTP yang verified
-- SELECT COUNT(*) FROM otp_verifications WHERE is_verified = true;

-- Average verification time
-- SELECT AVG(EXTRACT(EPOCH FROM (verified_at - created_at))) as avg_seconds
-- FROM otp_verifications 
-- WHERE is_verified = true AND verified_at IS NOT NULL;
