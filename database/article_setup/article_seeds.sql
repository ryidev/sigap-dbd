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
),
(
    'Vaksin Dengue 1 Dosis Mulai Diuji di Indonesia, Libatkan 1.000 …',
    '25 Nov 2025 · Uji klinis vaksin dengue dosis tunggal dimulai untuk menekan kasus DBD di Indonesia dan memperkuat perlindungan jangka panjang.',
    'https://www.liputan6.com/health/read/6220565/vaksin-dengue-1-dosis-mulai-diuji-di-indonesia-libatkan-1000-responden',
    'https://cdn0-production-images-kly.akamaized.net/828Go8ob1iy6yEoRAp6WiImqNrA=/1200x675/smart/filters:quality(75):strip_icc():format(jpeg)/kly-media-production/medias/5423398/original/052572700_1764060916-Menteri_Kesehatan_RI__Budi_Gunadi_Sadikin_di_Uji_Klinis_Vaksin_Dengue.JPG',
    NOW() - INTERVAL '19 days',
    'liputan6.com',
    'Vaksin Dengue'
),
(
    'Kota Bandung Gotong Royong Cegah DBD, - Porosmedia.com',
    '26 Nov 2025 · Porosmedia.com, Bandung – Memasuki puncak musim hujan, kewaspadaan terhadap Demam Berdarah Dengue (DBD) di Kota Bandung kembali berada pada level tinggi. Pemkot …',
    'https://porosmedia.com/kota-bandung-gotong-royong-cegah-dbd-unsur-kewilayahan-jadi-garda-terdepan/',
    'https://porosmedia.com/wp-content/uploads/2025/11/IMG-20251126-WA0104.jpg',
    NOW() - INTERVAL '18 days',
    'Porosmedia.com',
    'Pencegahan Dengue'
)
ON CONFLICT (url) DO NOTHING;
