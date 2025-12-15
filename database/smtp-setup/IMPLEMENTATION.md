# 🔐 Implementasi OTP Service - SiGap Dengue

## 📁 Struktur File yang Telah Dibuat

```
SiGap-Dengue/
├── lib/
│   └── email-service.ts          # Service untuk mengirim email OTP via Brevo
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── otp/
│   │           ├── send/
│   │           │   └── route.ts  # API untuk generate & send OTP
│   │           └── verify/
│   │               └── route.ts  # API untuk verify OTP
│   ├── verify-otp/
│   │   └── page.tsx              # Halaman verifikasi OTP
│   └── components/
│       ├── SignUpForm.tsx        # Updated: Kirim OTP saat registrasi
│       └── LoginForm.tsx         # Updated: Check verifikasi OTP
├── .env.example                  # Template environment variables
├── SETUP_OTP_GUIDE.md           # Panduan setup lengkap
└── IMPLEMENTATION.md            # File ini
```

## 🚀 Cara Menggunakan

### 1. Install Dependencies

```bash
npm install
# atau
bun install
```

Dependencies yang ditambahkan:
- `nodemailer` - Untuk mengirim email
- `@types/nodemailer` - TypeScript types

### 2. Setup Environment Variables

Copy file `.env.example` menjadi `.env.local`:

```bash
cp .env.example .env.local
```

Lalu isi dengan kredensial yang sesuai (lihat SETUP_OTP_GUIDE.md untuk detail).

### 3. Setup Database Supabase

Jalankan SQL script berikut di Supabase SQL Editor:

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

CREATE POLICY "Users can view their own OTP"
  ON otp_verifications
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert OTP"
  ON otp_verifications
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can update OTP"
  ON otp_verifications
  FOR UPDATE
  USING (true);
```

### 4. Jalankan Development Server

```bash
npm run dev
# atau
bun dev
```

## 🔄 Alur Kerja (Flow)

### Alur Registrasi dengan OTP:

1. **User Register** (`/register`)
   - User mengisi form registrasi
   - SignUpForm mengirim data ke Supabase Auth
   - User berhasil dibuat di Supabase

2. **Generate & Send OTP**
   - Setelah registrasi sukses, otomatis call API `/api/auth/otp/send`
   - API generate OTP 6 digit random
   - OTP disimpan di database dengan expire 10 menit
   - Email OTP dikirim via Brevo SMTP
   - User di-redirect ke `/verify-otp?email=xxx`

3. **Verify OTP** (`/verify-otp`)
   - User memasukkan kode OTP 6 digit
   - Auto-submit saat 6 digit terisi
   - Support paste dari clipboard
   - Maksimal 3 kali percobaan
   - Setelah berhasil, redirect ke `/login?verified=true`

4. **Login**
   - User login dengan email & password
   - System check apakah user sudah verify OTP
   - Jika belum, kirim OTP baru dan redirect ke verify page
   - Jika sudah, login berhasil

### Alur Login Existing User:

1. User yang sudah pernah verify OTP → langsung login
2. User yang belum verify → diarahkan ke halaman verify OTP

## 📧 Template Email

Email OTP yang dikirim menggunakan HTML template dengan:
- Desain responsive dan modern
- Gradient header (purple theme)
- Kode OTP dalam box dengan styling khusus
- Warning untuk keamanan
- Auto-generated dari `lib/email-service.ts`

Preview:
```
┌─────────────────────────────┐
│  🦟 SiGap Dengue           │
│  Verifikasi Akun Anda       │
├─────────────────────────────┤
│                             │
│  Halo [User]! 👋           │
│                             │
│  ┌───────────────────┐     │
│  │  Kode OTP:        │     │
│  │   1 2 3 4 5 6     │     │
│  └───────────────────┘     │
│                             │
│  ⚠️ Perhatian:             │
│  - Jangan bagikan kode     │
│  - 1x penggunaan           │
│  - Expire dalam 10 menit   │
│                             │
└─────────────────────────────┘
```

## 🛡️ Fitur Keamanan

### Rate Limiting
- Cooldown 60 detik antar request OTP ke email yang sama
- Prevent spam dan abuse

### Attempts Limiting
- Maksimal 3 kali percobaan verify OTP
- Setelah 3x gagal, harus request OTP baru

### OTP Expiration
- OTP expire dalam 10 menit
- Otomatis invalid setelah expire

### Database Security
- Row Level Security (RLS) enabled
- User hanya bisa lihat OTP mereka sendiri
- Insert/Update hanya via service role

## 🧪 Testing

### 1. Test Send OTP

```bash
curl -X POST http://localhost:3000/api/auth/otp/send \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

Expected Response:
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "expiresIn": 600
}
```

### 2. Test Verify OTP

```bash
curl -X POST http://localhost:3000/api/auth/otp/verify \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","otpCode":"123456"}'
```

Expected Response (Success):
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "userId": "uuid-here"
}
```

### 3. Test Check Verification Status

```bash
curl http://localhost:3000/api/auth/otp/verify?email=test@example.com
```

Expected Response:
```json
{
  "verified": true,
  "verifiedAt": "2024-12-14T10:30:00.000Z"
}
```

## 📊 Monitoring & Logs

### Check di Brevo Dashboard:
- Masuk ke https://app.brevo.com
- Menu **Statistics** → **Email**
- Lihat email yang terkirim, opened, clicked, dll

### Check di Supabase:
- Table Editor → `otp_verifications`
- Lihat OTP yang di-generate
- Monitor attempts, verification status

### Application Logs:
```javascript
// Console logs tersedia di:
console.log('OTP Email sent successfully:', info.messageId)
console.error('Error sending OTP email:', error)
```

## 🐛 Troubleshooting

### Email tidak terkirim?

**Check:**
1. SMTP credentials di `.env.local`
2. Sender email sudah verified di Brevo
3. Tidak ada firewall blocking port 587
4. Check logs di Brevo dashboard

**Solution:**
```bash
# Test SMTP connection
node -e "const nodemailer = require('nodemailer'); /* test code */"
```

### OTP tidak valid?

**Check:**
1. OTP belum expired (10 menit)
2. Tidak lebih dari 3 attempts
3. Email yang digunakan sama dengan saat request OTP
4. Timezone server

**Solution:**
```sql
-- Check OTP di database
SELECT * FROM otp_verifications 
WHERE email = 'test@example.com' 
ORDER BY created_at DESC 
LIMIT 5;
```

### Rate limit error (429)?

**Check:**
1. Cooldown 60 detik antar request
2. Tunggu sesuai `retryAfter` di response

**Solution:**
- Tunggu 60 detik sebelum request lagi
- Atau adjust cooldown di `app/api/auth/otp/send/route.ts`

## 🔧 Customization

### Ubah Expire Time OTP:

File: `app/api/auth/otp/send/route.ts`

```typescript
// Default: 10 menit
const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

// Ubah menjadi 5 menit:
const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
```

### Ubah Maksimal Attempts:

File: `app/api/auth/otp/verify/route.ts`

```typescript
// Default: 3 attempts
const MAX_ATTEMPTS = 3;

// Ubah menjadi 5 attempts:
const MAX_ATTEMPTS = 5;
```

### Ubah Cooldown Resend:

File: `app/api/auth/otp/send/route.ts`

```typescript
// Default: 60 detik
const oneMinuteAgo = new Date(Date.now() - 60 * 1000).toISOString();

// Ubah menjadi 120 detik:
const twoMinutesAgo = new Date(Date.now() - 120 * 1000).toISOString();
```

### Custom Email Template:

File: `lib/email-service.ts`

Edit function `getOTPEmailTemplate()` untuk mengubah design email.

## 📝 API Endpoints

### POST `/api/auth/otp/send`

**Request Body:**
```json
{
  "email": "user@example.com",
  "userId": "optional-user-uuid"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "expiresIn": 600
}
```

**Response (Rate Limited):**
```json
{
  "error": "Please wait 1 minute before requesting a new OTP",
  "retryAfter": 60
}
```

### POST `/api/auth/otp/verify`

**Request Body:**
```json
{
  "email": "user@example.com",
  "otpCode": "123456"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "userId": "user-uuid"
}
```

**Response (Invalid):**
```json
{
  "error": "Invalid OTP code",
  "attemptsRemaining": 2
}
```

### GET `/api/auth/otp/verify?email=xxx`

**Query Parameters:**
- `email` (required)

**Response:**
```json
{
  "verified": true,
  "verifiedAt": "2024-12-14T10:30:00.000Z"
}
```

## 🎯 Best Practices

1. **Jangan commit `.env.local`** ke git
2. **Gunakan HTTPS** di production
3. **Monitor rate limiting** untuk detect abuse
4. **Implement CAPTCHA** jika banyak spam
5. **Log semua attempts** untuk audit trail
6. **Regular cleanup** expired OTP dari database
7. **Test email delivery** sebelum production

## 🚀 Deploy to Production

### Checklist:
- [ ] Setup environment variables di hosting
- [ ] Verify Brevo sender domain/email
- [ ] Test email delivery dari production server
- [ ] Setup monitoring dan alerts
- [ ] Enable HTTPS
- [ ] Update `NEXT_PUBLIC_APP_URL` di env
- [ ] Test full flow di production
- [ ] Setup database backup
- [ ] Configure rate limiting di API Gateway (optional)
- [ ] Setup error tracking (Sentry, etc)

## 📞 Support

Jika ada pertanyaan atau issue:
1. Check SETUP_OTP_GUIDE.md
2. Check Troubleshooting section di atas
3. Check logs di console dan database
4. Contact developer team

---

**Dibuat dengan ❤️ untuk SiGap Dengue**
