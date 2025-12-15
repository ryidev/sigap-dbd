CREATE TABLE IF NOT EXISTS otp_verifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  otp_code VARCHAR(6) NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  attempts INT DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified_at TIMESTAMP WITH TIME ZONE
);

-- Index untuk performa
CREATE INDEX idx_otp_email ON otp_verifications(email);
CREATE INDEX idx_otp_user_id ON otp_verifications(user_id);
CREATE INDEX idx_otp_expires ON otp_verifications(expires_at);

-- RLS Policies
ALTER TABLE otp_verifications ENABLE ROW LEVEL SECURITY;

-- Policy: User hanya bisa melihat OTP mereka sendiri
CREATE POLICY "Users can view their own OTP"
  ON otp_verifications
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Service role bisa insert
CREATE POLICY "Service role can insert OTP"
  ON otp_verifications
  FOR INSERT
  WITH CHECK (true);

-- Policy: Service role bisa update
CREATE POLICY "Service role can update OTP"
  ON otp_verifications
  FOR UPDATE
  USING (true);