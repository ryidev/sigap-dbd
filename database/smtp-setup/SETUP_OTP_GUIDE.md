# Panduan Setup OTP Service dengan Brevo dan Supabase

## 1️⃣ Konfigurasi Brevo (SMTP Service)

### Langkah-langkah Setup Brevo:

1. **Daftar/Login ke Brevo**
   - Kunjungi https://www.brevo.com/
   - Sign up untuk akun baru atau login jika sudah punya akun
   - Verifikasi email Anda

2. **Dapatkan SMTP Credentials**
   - Login ke dashboard Brevo
   - Klik menu **"Settings"** di kanan atas
   - Pilih **"SMTP & API"** 
   - Di bagian SMTP, klik **"Create a new SMTP key"**
   - Beri nama key Anda (misal: "SiGap-Dengue-OTP")
   - Copy **SMTP Key** yang dihasilkan (hanya ditampilkan sekali!)

3. **Catat Informasi SMTP**
   ```
   SMTP Server: smtp-relay.brevo.com
   SMTP Port: 587
   SMTP Username: [email Anda yang terdaftar di Brevo]
   SMTP Password: [SMTP Key yang baru dibuat]
   ```

4. **Verifikasi Domain/Email (Opsional tapi Direkomendasikan)**
   - Di dashboard Brevo, masuk ke **"Senders & IP"**
   - Klik **"Domains"** atau **"Senders"**
   - Tambahkan domain atau email pengirim Anda
   - Ikuti instruksi verifikasi (tambah DNS record jika verifikasi domain)

5. **Setup Email Template (Opsional)**
   - Masuk ke menu **"Campaigns"** > **"Templates"**
   - Bisa buat template email OTP untuk tampilan lebih professional

---

## 2️⃣ Konfigurasi Supabase

### Langkah-langkah Setup Supabase:

1. **Buat Tabel untuk OTP**
   - Login ke Supabase Dashboard (https://supabase.com)
   - Pilih project Anda
   - Masuk ke **"SQL Editor"**
   - Jalankan script SQL berikut:

```sql
-- Tabel untuk menyimpan OTP
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
```

2. **Update Auth Settings**
   - Di Supabase Dashboard, masuk ke **"Authentication"** > **"Providers"**
   - Pastikan **Email provider** sudah enabled
   - Di **"Email Auth"** settings:
     - Enable **"Confirm email"** jika ingin double verification
     - Atau disable jika OTP sudah cukup

3. **Dapatkan Service Role Key**
   - Masuk ke **"Settings"** > **"API"**
   - Copy **"service_role"** key (JANGAN share atau commit ke git!)
   - Key ini digunakan untuk bypass RLS saat insert/update OTP

---

## 3️⃣ Environment Variables

Tambahkan environment variables berikut ke file `.env.local` Anda:

```env
# Supabase (yang sudah ada)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Brevo SMTP
BREVO_SMTP_HOST=smtp-relay.brevo.com
BREVO_SMTP_PORT=587
BREVO_SMTP_USER=your_brevo_email@domain.com
BREVO_SMTP_PASSWORD=your_smtp_key_from_brevo
BREVO_SENDER_EMAIL=noreply@yourdomain.com
BREVO_SENDER_NAME="SiGap Dengue"
```

**⚠️ PENTING**: Jangan lupa tambahkan `.env.local` ke `.gitignore`!

---

## 4️⃣ Testing

Setelah semua setup:

1. **Test SMTP Connection**
   - Bisa test di https://app.brevo.com/settings/keys/smtp
   - Atau gunakan API route `/api/auth/otp/send` yang akan dibuat

2. **Test OTP Flow**
   - Register user baru
   - Check email untuk OTP
   - Input OTP di halaman verifikasi
   - Pastikan user bisa login setelah verifikasi

3. **Monitor di Dashboard**
   - Brevo: Check **"Statistics"** untuk melihat email terkirim
   - Supabase: Check tabel `otp_verifications` untuk data OTP

---

## 5️⃣ Keamanan

✅ **Best Practices:**
- OTP expire dalam 5-10 menit
- Limit maksimal attempts (misal: 3x)
- Rate limiting untuk prevent spam
- OTP hanya 6 digit angka
- Hash OTP di database (opsional untuk extra security)
- Implementasi CAPTCHA jika perlu

---

## 6️⃣ Troubleshooting

**Email tidak terkirim?**
- Check SMTP credentials di Brevo
- Pastikan sender email sudah diverifikasi
- Check logs di Brevo dashboard
- Pastikan tidak ada firewall blocking port 587

**OTP tidak valid?**
- Check timezone server vs database
- Pastikan OTP belum expired
- Verify di tabel `otp_verifications`

**Rate limiting issues?**
- Sesuaikan limit di Brevo dashboard
- Implement queue jika banyak users

---

## 📞 Support

- Brevo Documentation: https://developers.brevo.com/
- Supabase Documentation: https://supabase.com/docs
