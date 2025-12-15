# SiGap Dengue 🦟

<div align="center">
  <img src="public/dengue.png" alt="SiGap Dengue Logo" width="120"/>
  
  <p><strong>Sistem Deteksi Dini Demam Berdarah Dengue Berbasis AI</strong></p>
  
  <p>Aplikasi web inovatif untuk membantu deteksi dini DBD menggunakan teknologi Machine Learning</p>

  [![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=flat&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
  [![Supabase](https://img.shields.io/badge/Supabase-Auth-green?style=flat&logo=supabase)](https://supabase.com/)
  [![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
</div>

---

## 📖 Tentang Aplikasi

**SiGap Dengue** adalah aplikasi web yang dirancang untuk membantu masyarakat Indonesia melakukan deteksi dini Demam Berdarah Dengue (DBD) secara mandiri. Dengan memanfaatkan algoritma Machine Learning seperti **Logistic Regression** dan **Support Vector Machine (SVM)**, aplikasi ini dapat memprediksi kemungkinan seseorang terkena DBD berdasarkan gejala klinis dan hasil laboratorium.

### 🎯 Manfaat Aplikasi

#### Untuk Masyarakat Umum:
- ✅ **Deteksi Dini**: Identifikasi risiko DBD sejak gejala awal muncul
- ✅ **Mudah Digunakan**: Interface yang user-friendly dan interaktif
- ✅ **Tanpa Biaya**: Gratis dan dapat diakses kapan saja, dimana saja
- ✅ **Privasi Terjamin**: Pemeriksaan anonim tanpa harus login
- ✅ **Edukasi Kesehatan**: Informasi lengkap tentang DBD dan pencegahannya

#### Untuk Tenaga Kesehatan:
- 📊 **Data Visual**: Peta sebaran kasus DBD di Indonesia
- 🔍 **Screening Awal**: Membantu triase pasien sebelum pemeriksaan mendalam
- 📱 **Akses Cepat**: Dapat digunakan untuk konsultasi online

#### Untuk Peneliti:
- 📈 **Pattern Recognition**: Analisis pola gejala DBD
- 🧪 **Validasi Model**: Platform untuk testing model ML berbeda
- 📊 **Data Insights**: Visualisasi data kasus DBD

---

## ✨ Fitur Utama

### 🎯 Prediksi Berbasis AI
- Menggunakan algoritma Logistic Regression dan SVM
- Akurasi tinggi berdasarkan dataset klinis
- Prediksi real-time dan instan

### 📋 Form Interaktif Multi-Step
- **Step 1**: Data Pribadi & Gejala Utama (demam, suhu, durasi)
- **Step 2**: Gejala Tambahan (8 gejala klinis)
- **Step 3**: Hasil Uji Laboratorium (WBC, Hemoglobin, Hematokrit, Platelet)
- Progress indicator untuk tracking pengisian

### 📊 Visualisasi Data
- Peta interaktif sebaran kasus DBD di Indonesia
- Heatmap geografis dengan Leaflet & Plotly
- Real-time data visualization

### 👤 Sistem Autentikasi
- Login dengan email/password atau Google OAuth
- Riwayat pemeriksaan tersimpan untuk user terdaftar
- Mode anonim untuk privasi maksimal

### 📁 Riwayat Pemeriksaan
- Simpan semua hasil pemeriksaan
- Download hasil dalam format PDF/Image
- Monitoring kesehatan dari waktu ke waktu

### ✅ Checklist Pencegahan Mingguan
- Tracking aktivitas pencegahan DBD dengan metode 3M Plus
- Progress bar untuk memonitor penyelesaian checklist
- Sistem achievements untuk memotivasi konsistensi
- Reset otomatis setiap minggu untuk kebiasaan berkelanjutan

### 🏆 Sistem Achievement
- Badge "Langkah Pertama" untuk menyelesaikan checklist pertama kali
- Badge "Pahlawan Setengah Jalan" untuk 50% completion
- Badge "Minggu Sempurna" untuk 100% completion
- Riwayat achievements tersimpan di profile

### 📰 Artikel & Edukasi
- Informasi lengkap tentang DBD dan pencegahannya
- Tips kesehatan untuk mencegah penyebaran nyamuk
- Update terkini tentang DBD di Indonesia

### 📱 Responsive Design
- Optimal di desktop, tablet, dan mobile
- Interface adaptif untuk semua ukuran layar
- Fast loading dan smooth navigation
- Animasi smooth dengan GSAP

---

## 🚀 Instalasi & Setup

### Prasyarat

Pastikan Anda sudah menginstal:
- **Node.js** (v18 atau lebih baru) - [Download](https://nodejs.org/)
- **npm** atau **Bun** (Package Manager) - npm sudah termasuk dengan Node.js, atau install [Bun](https://bun.sh/) untuk performa lebih cepat
- **Git** - [Download](https://git-scm.com/)
- **Akun Supabase** (gratis) - [Sign Up](https://supabase.com/)

### Langkah 1: Clone Repository

```bash
git clone https://github.com/aliepratama/dengue-checker-nextjs.git
cd dengue-checker-nextjs
```

### Langkah 2: Install Dependencies

Menggunakan **npm**:
```bash
npm install
```

Atau menggunakan **Bun** (lebih cepat):
```bash
bun install
```

### Langkah 3: Setup Supabase

#### 3.1 Buat Project Supabase

1. Buka [Supabase Dashboard](https://app.supabase.com/)
2. Klik **"New Project"**
3. Isi nama project, password database, dan pilih region (Southeast Asia untuk Indonesia)
4. Tunggu setup selesai (~2 menit)

#### 3.2 Aktifkan Google OAuth (Opsional)

Untuk fitur login dengan Google:

1. Buka project Anda di Supabase Dashboard
2. Navigasi ke **Authentication** → **Providers**
3. Enable **Google** provider
4. Dapatkan Google OAuth credentials:
   - Buka [Google Cloud Console](https://console.cloud.google.com/)
   - Buat OAuth 2.0 Client ID
   - Tambahkan redirect URI: `https://[PROJECT-ID].supabase.co/auth/v1/callback`
5. Paste Client ID dan Secret ke Supabase

#### 3.3 Setup Database Tables

Jalankan SQL berikut di Supabase SQL Editor:

```sql
-- Table untuk menyimpan profil user
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Table untuk menyimpan riwayat pemeriksaan
CREATE TABLE examinations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  form_data JSONB NOT NULL,
  prediction INTEGER NOT NULL,
  probability FLOAT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE examinations ENABLE ROW LEVEL SECURITY;

-- Policies untuk user_profiles
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Policies untuk examinations
CREATE POLICY "Users can view own examinations"
  ON examinations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create examinations"
  ON examinations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Tambahkan table untuk menyimpan profile user yang lebih detail
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS untuk user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policy untuk user_profiles - user hanya bisa akses profile mereka sendiri
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Trigger untuk auto-update updated_at pada user_profiles
CREATE OR REPLACE FUNCTION update_user_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_user_profiles_updated_at();

-- Function untuk otomatis membuat profile ketika user baru register
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_profiles (id, full_name)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'User')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger untuk auto-create profile ketika user baru register
DROP TRIGGER IF EXISTS create_user_profile_trigger ON auth.users;
CREATE TRIGGER create_user_profile_trigger
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION create_user_profile();

-- Update existing users yang belum punya profile (optional, untuk existing users)
INSERT INTO user_profiles (id, full_name)
SELECT id, COALESCE(raw_user_meta_data->>'full_name', 'User')
FROM auth.users
WHERE id NOT IN (SELECT id FROM user_profiles)
ON CONFLICT (id) DO NOTHING;

-- Table untuk menyimpan progress checklist pencegahan mingguan
CREATE TABLE IF NOT EXISTS weekly_prevention_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    week_start DATE NOT NULL,
    completed_items TEXT[] NOT NULL DEFAULT '{}',
    total_items INTEGER NOT NULL DEFAULT 8,
    completion_percentage INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraint untuk memastikan satu user hanya punya satu record per minggu
    UNIQUE(user_id, week_start)
);

-- Index untuk performa query
CREATE INDEX IF NOT EXISTS idx_weekly_prevention_user_id ON weekly_prevention_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_prevention_week_start ON weekly_prevention_progress(week_start);
CREATE INDEX IF NOT EXISTS idx_weekly_prevention_user_week ON weekly_prevention_progress(user_id, week_start);

-- Function untuk update timestamp otomatis
CREATE OR REPLACE FUNCTION update_weekly_prevention_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger untuk auto-update updated_at
CREATE OR REPLACE TRIGGER update_weekly_prevention_updated_at 
    BEFORE UPDATE ON weekly_prevention_progress 
    FOR EACH ROW 
    EXECUTE FUNCTION update_weekly_prevention_updated_at();

-- RLS Policy untuk keamanan
ALTER TABLE weekly_prevention_progress ENABLE ROW LEVEL SECURITY;

-- Policy untuk user hanya bisa akses data mereka sendiri
CREATE POLICY "Users can view their own prevention progress" ON weekly_prevention_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own prevention progress" ON weekly_prevention_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own prevention progress" ON weekly_prevention_progress
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own prevention progress" ON weekly_prevention_progress
    FOR DELETE USING (auth.uid() = user_id);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON weekly_prevention_progress TO authenticated;

-- Table untuk menyimpan achievement/pencapaian user
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_type VARCHAR(50) NOT NULL,
    achievement_name VARCHAR(100) NOT NULL,
    description TEXT,
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    week_start DATE,
    
    -- Constraint untuk memastikan satu user tidak bisa dapat achievement yang sama di minggu yang sama
    UNIQUE(user_id, achievement_type, week_start)
);

-- Index untuk achievements
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_type ON user_achievements(achievement_type);

-- RLS Policy untuk achievements
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own achievements" ON user_achievements
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements" ON user_achievements
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Grant permissions
GRANT SELECT, INSERT ON user_achievements TO authenticated;

-- Function untuk auto-create achievements berdasarkan progress
CREATE OR REPLACE FUNCTION create_achievement_on_progress()
RETURNS TRIGGER AS $$
BEGIN
    -- Achievement untuk first time completion
    IF NEW.completion_percentage > 0 AND (
        OLD IS NULL OR OLD.completion_percentage = 0
    ) THEN
        INSERT INTO user_achievements (user_id, achievement_type, achievement_name, description, week_start)
        VALUES (
            NEW.user_id, 
            'first_steps', 
            'Langkah Pertama', 
            'Menyelesaikan checklist pencegahan pertama kali',
            NEW.week_start
        )
        ON CONFLICT (user_id, achievement_type, week_start) DO NOTHING;
    END IF;
    
    -- Achievement untuk 50% completion
    IF NEW.completion_percentage >= 50 AND (
        OLD IS NULL OR OLD.completion_percentage < 50
    ) THEN
        INSERT INTO user_achievements (user_id, achievement_type, achievement_name, description, week_start)
        VALUES (
            NEW.user_id, 
            'halfway_hero', 
            'Pahlawan Setengah Jalan', 
            'Menyelesaikan 50% checklist pencegahan',
            NEW.week_start
        )
        ON CONFLICT (user_id, achievement_type, week_start) DO NOTHING;
    END IF;
    
    -- Achievement untuk 100% completion
    IF NEW.completion_percentage = 100 AND (
        OLD IS NULL OR OLD.completion_percentage < 100
    ) THEN
        INSERT INTO user_achievements (user_id, achievement_type, achievement_name, description, week_start)
        VALUES (
            NEW.user_id, 
            'perfect_week', 
            'Minggu Sempurna', 
            'Menyelesaikan 100% checklist pencegahan',
            NEW.week_start
        )
        ON CONFLICT (user_id, achievement_type, week_start) DO NOTHING;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger untuk create achievements otomatis
CREATE OR REPLACE TRIGGER create_achievements_trigger
    AFTER INSERT OR UPDATE ON weekly_prevention_progress
    FOR EACH ROW
    EXECUTE FUNCTION create_achievement_on_progress();
```

### Langkah 4: Konfigurasi Environment Variables

1. Salin file environment template:
   ```bash
   cp .env.local.example .env.local
   ```

2. Buka `.env.local` dan isi dengan credentials Supabase Anda:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. Cara mendapatkan credentials:
   - Buka Supabase Dashboard
   - Pilih project Anda
   - Navigasi ke **Settings** → **API**
   - Copy **Project URL** dan **anon public** key

### Langkah 5: Jalankan Aplikasi

#### Development Mode:

Menggunakan **npm**:
```bash
npm run dev
```

Atau menggunakan **Bun**:
```bash
bun dev
```

Aplikasi akan berjalan di: **http://localhost:3000**

> **Note**: Aplikasi menggunakan Turbopack untuk build yang lebih cepat

#### Production Build:

Menggunakan **npm**:
```bash
# Build aplikasi
npm run build

# Jalankan production server
npm start
```

Atau menggunakan **Bun**:
```bash
# Build aplikasi
bun run build

# Jalankan production server
bun start
```

---

## 📱 Cara Menggunakan

### Untuk User Baru (Tanpa Login)

1. **Akses Homepage**
   - Buka http://localhost:3000
   - Lihat peta sebaran DBD di Indonesia
   - Baca informasi pencegahan dengan metode 3M Plus
   - Klik tombol **"Periksa Sekarang"** atau **"Mulai Pemeriksaan"**

2. **Isi Formulir Pemeriksaan**
   - **Step 1**: Isi data pribadi (nama, umur, no. telp), gejala demam, dan suhu tubuh
   - **Step 2**: Centang gejala tambahan yang dialami (sakit kepala, nyeri mata, dll)
   - **Step 3**: Isi hasil uji laboratorium jika sudah melakukan tes darah (WBC, Hemoglobin, Hematokrit, Platelet)
   - Klik **"Submit"** untuk mendapatkan hasil prediksi

3. **Lihat Hasil Prediksi**
   - Lihat status: **Positif DBD** atau **Negatif DBD**
   - Perhatikan persentase probabilitas
   - Baca rekomendasi tindakan yang disarankan
   - Download hasil untuk dibawa ke dokter (opsional)

4. **Eksplorasi Fitur Lainnya**
   - **Artikel**: Baca artikel tentang DBD dan pencegahannya
   - **Tentang**: Pelajari lebih lanjut tentang aplikasi dan tim pengembang

### Untuk User Terdaftar

1. **Daftar/Login**
   - Klik **"Masuk"** di navbar
   - Pilih **"Daftar"** untuk membuat akun baru dengan email/password
   - Atau login dengan **Google** untuk akses lebih cepat
   - Verifikasi email jika diminta

2. **Lakukan Pemeriksaan**
   - Sama seperti user tanpa login
   - Hasil otomatis tersimpan di riwayat pemeriksaan Anda

3. **Akses Riwayat Pemeriksaan**
   - Klik menu **"Riwayat"** di navbar
   - Lihat semua pemeriksaan yang pernah dilakukan
   - Lihat detail hasil pemeriksaan sebelumnya
   - Download atau cetak hasil untuk keperluan medis

4. **Gunakan Checklist Pencegahan Mingguan**
   - Klik menu **"Checklist"** di navbar
   - Centang aktivitas pencegahan yang sudah dilakukan
   - Monitor progress bar untuk melihat penyelesaian
   - Dapatkan badges achievement saat mencapai milestone tertentu
   - Checklist akan reset otomatis setiap minggu

5. **Kelola Profile**
   - Klik foto profil atau menu **"Profile"** di navbar
   - Lihat informasi akun Anda
   - Lihat achievement/badges yang telah diraih
   - Lihat statistik pemeriksaan dan aktivitas pencegahan
   - Update informasi profil jika diperlukan

6. **Logout**
   - Klik menu dropdown di foto profil
   - Pilih **"Keluar"** untuk logout dari akun

---

## 🛠️ Tech Stack

| Kategori | Teknologi |
|----------|-----------|
| **Framework** | Next.js 15.5 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4 |
| **UI Components** | Flowbite, Flowbite React |
| **Authentication** | Supabase Auth (Google OAuth) |
| **Database** | Supabase (PostgreSQL) |
| **Maps** | MapTiler SDK, Plotly.js |
| **Animations** | GSAP 3.14 |
| **Icons** | React Icons |
| **Machine Learning** | Logistic Regression, SVM (ScikitJS) |
| **Package Manager** | npm/bun |
| **Deployment** | Vercel (recommended) |

---

## 📂 Struktur Project

```
dengue-cheker/
├── app/                          # Next.js App Router
│   ├── components/               # Reusable components
│   │   ├── Navbar.tsx           # Navigation bar dengan menu responsif
│   │   ├── Footer.tsx           # Footer section
│   │   ├── Stepper.tsx          # Progress indicator untuk form
│   │   ├── AuthButton.tsx       # Tombol autentikasi
│   │   ├── LoginForm.tsx        # Form login
│   │   ├── SignUpForm.tsx       # Form registrasi
│   │   ├── Maptilermap.tsx      # Komponen peta interaktif
│   │   ├── PlotlyChart.tsx      # Chart dengan Plotly
│   │   ├── form/                # Form components
│   │   │   ├── FormGejalaUtama.tsx
│   │   │   ├── FormGejalaTambahan.tsx
│   │   │   └── FormUjiLab.tsx
│   │   ├── home/                # Homepage sections
│   │   │   ├── HeroSection.tsx
│   │   │   ├── MapSection.tsx
│   │   │   ├── PreventionTipsSection.tsx
│   │   │   ├── FeaturesSection.tsx
│   │   │   ├── CTASection.tsx
│   │   │   ├── FAQCards.tsx
│   │   │   └── FAQCardsMobile.tsx
│   │   └── profile/             # Profile components
│   │       ├── ProfileHeader.tsx
│   │       ├── AchievementCard.tsx
│   │       └── ...
│   ├── about/                    # About page (Tentang Aplikasi)
│   ├── articles/                 # Articles page (Artikel DBD)
│   ├── checklist/                # Weekly prevention checklist
│   ├── form/                     # Multi-step diagnosis form
│   ├── history/                  # Examination history
│   ├── auth/                     # Authentication routes
│   │   ├── login/
│   │   └── callback/
│   ├── profile/                  # User profile page
│   ├── result/                   # Result page (diagnosis results)
│   ├── api/                      # API routes
│   ├── page.tsx                  # Homepage
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles
│   └── not-found.tsx             # 404 page
├── lib/                          # Utilities & logic
│   ├── model.ts                  # ML models & prediction logic
│   └── dengue-service.ts         # Supabase services
├── utils/                        # Utility functions
│   └── supabase/                 # Supabase clients
│       ├── client.ts             # Client-side Supabase client
│       ├── server.ts             # Server-side Supabase client
│       └── middleware.ts         # Auth middleware
├── database/                     # Database migrations & setup
├── public/                       # Static assets
│   ├── images/                   # Images
│   ├── icons/                    # SVG icons
│   ├── dengue.png               # App logo
│   └── heatmap_geo.json         # Map data for Indonesia
├── types/                        # TypeScript types
├── .env.local                    # Environment variables (create this)
├── .env.example                  # Environment template
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── next.config.ts                # Next.js config
├── tailwind.config.js            # Tailwind config
└── README.md                     # This file
```

---

## 🤝 Kontribusi

Kami menerima kontribusi dari siapa saja! Jika Anda ingin berkontribusi:

1. Fork repository ini
2. Buat branch baru (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

---

## 📄 Lisensi

Project ini dilisensikan di bawah MIT License - lihat file [LICENSE](LICENSE) untuk detail.

---

## 👥 Tim Pengembang

Dibuat oleh mahasiswa Universitas Teknologi Yogyakarta:

- **Satria Ridho Eksobar** - Full Stack Developer
- **Alif Arya Kusuma** - Machine Learning Engineer  
- **Fardila Bintang Adinata** - Full Stack Developer

---

## ⚠️ Disclaimer

Aplikasi ini **BUKAN** pengganti diagnosis medis profesional. Hasil prediksi hanya sebagai **screening awal** dan **referensi**. Selalu konsultasikan dengan dokter atau tenaga kesehatan untuk diagnosis dan pengobatan yang tepat.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Supabase](https://supabase.com/) - Open Source Firebase Alternative
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [MapTiler](https://www.maptiler.com/) - Maps and geolocation services
- [Plotly.js](https://plotly.com/javascript/) - Interactive data visualization library
- [GSAP](https://gsap.com/) - Professional-grade animation library
- [Flowbite](https://flowbite.com/) - Component library built on Tailwind CSS
- [WHO](https://www.who.int/) - Dengue data and guidelines
- [Kemenkes RI](https://www.kemkes.go.id/) - Indonesian health data
.
---

<div align="center">
  <p>Made with ❤️ for Indonesian Healthcare</p>
  <p>© 2025 SiGap Dengue - Universitas Teknologi Yogyakarta</p>
</div>
</p>
</div>