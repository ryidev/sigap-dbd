'use client'

import Navbar from '../components/Navbar'
import Image from 'next/image'

export default function AboutPage() {
  return (
    <div>
      <Navbar active="about" />

      <div style={{ top: 0, marginTop: 80 }}>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-red-700 to-red-900 text-white py-16">
          <div className="mx-auto max-w-screen-xl px-4">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Tentang SiGap Dengue (Sistem Tanggap Dengue)
              </h1>
              <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto">
                Sistem deteksi dini Demam Berdarah Dengue berbasis AI untuk membantu masyarakat Indonesia
              </p>
            </div>
          </div>
        </section>

        {/* About Application Section */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-screen-xl px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Tentang Aplikasi
              </h2>
              <div className="w-20 h-1 bg-red-700 mx-auto mb-6"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <img
                  src="/dengue.png"
                  alt="SiGap Dengue"
                  className="w-full max-w-md mx-auto"
                />
              </div>
              <div className="space-y-4 text-gray-700">
                <p className="text-lg leading-relaxed">
                  <strong className="text-red-700">SiGap Dengue</strong> adalah aplikasi web inovatif yang dirancang untuk membantu deteksi dini Demam Berdarah Dengue (DBD) menggunakan teknologi Artificial Intelligence.
                </p>
                <p className="leading-relaxed">
                  Dengan memanfaatkan algoritma Machine Learning seperti <strong>Logistic Regression</strong> dan <strong>Support Vector Machine (SVM)</strong>, aplikasi ini dapat memprediksi kemungkinan seseorang terkena DBD berdasarkan gejala klinis dan hasil laboratorium yang diinputkan.
                </p>
                <p className="leading-relaxed">
                  DBD merupakan penyakit tropis yang serius dan dapat berakibat fatal jika tidak ditangani dengan cepat. Melalui aplikasi ini, kami berharap dapat membantu masyarakat untuk lebih waspada dan melakukan tindakan preventif sejak dini.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="mx-auto max-w-screen-xl px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Fitur Unggulan
              </h2>
              <div className="w-20 h-1 bg-red-700 mx-auto mb-6"></div>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Platform komprehensif untuk deteksi, pencegahan, dan edukasi DBD dengan teknologi AI dan gamifikasi
              </p>
            </div>

            {/* First Row - 4 Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Feature 1 - AI Detection */}
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg"
                    className="w-7 h-7 text-red-700"
                    viewBox="0 0 24 24"
                    fill="currentColor">
                    <g fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5">
                      <path d="m21.255 7.134l-.494-.857c-.373-.648-.56-.972-.877-1.1c-.71-.29-1.908.32-2.615.52c-.627.144-1.165-.058-1.696-.364a2 2 0 0 1-.788-.968c-.214-.64-.358-1.767-.925-2.176C13.6 2 13.252 2 12.557 2h-1.114c-.695 0-1.042 0-1.303.189c-.567.409-.71 1.536-.925 2.176c-.213.554-.633.878-1.125 1.162a2 2 0 0 1-1.359.17c-.706-.2-1.905-.81-2.615-.52c-.317.128-.504.452-.877 1.1l-.494.857c-.35.607-.525.91-.49 1.234c.083.803 1.253 1.682 1.767 2.257c.252.319.43.875.43 1.375s-.178 1.056-.43 1.375c-.514.575-1.684 1.454-1.768 2.257c-.034.324.141.627.491 1.234l.494.857c.373.648.56.972.877 1.1c.71.29 1.909-.32 2.615-.52c.982-.226 2.123.39 2.484 1.332c.214.64.358 1.767.925 2.176c.261.189.608.189 1.303.189h1.114c.695 0 1.042 0 1.303-.189c.262-.189.372-.518.591-1.178c.247-.74.42-1.517 1.122-1.966c.53-.306 1.069-.508 1.696-.364c.707.2 1.905.81 2.615.52c.317-.128.504-.452.877-1.1l.494-.857c.35-.607.525-.91.49-1.234c-.084-.803-1.253-1.682-1.767-2.257c-.583-.738-.582-2.012 0-2.75c.514-.575 1.683-1.454 1.768-2.257c.034-.324-.141-.627-.491-1.234" />
                      <path d="m7.438 14.992l1.841-5.525a.694.694 0 0 1 1.317 0l1.842 5.525m-4-2h3m4-4v6" />
                    </g>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Deteksi AI
                </h3>
                <p className="text-gray-600">
                  Algoritma machine learning untuk prediksi DBD akurat berdasarkan gejala dan hasil laboratorium.
                </p>
              </div>

              {/* Feature 2 - Weekly Missions */}
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-7 h-7 text-red-700"
                    viewBox="0 0 16 16">
                    <path
                      fill="currentColor"
                      fillRule="evenodd"
                      d="M13.293 0c.39 0 .707.317.707.707V2h1.293a.707.707 0 0 1 .5 1.207l-1.46 1.46A1.138 1.138 0 0 1 13.53 5h-1.47L8.53 8.53a.75.75 0 0 1-1.06-1.06L11 3.94V2.47c0-.301.12-.59.333-.804l1.46-1.46a.707.707 0 0 1 .5-.207ZM2.5 8a5.5 5.5 0 0 1 6.598-5.39a.75.75 0 0 0 .298-1.47A7 7 0 1 0 14.86 6.6a.75.75 0 0 0-1.47.299A5.5 5.5 0 1 1 2.5 8m5.364-2.496a.75.75 0 0 0-.08-1.498A4 4 0 1 0 11.988 8.3a.75.75 0 0 0-1.496-.111a2.5 2.5 0 1 1-2.63-2.686Z"
                      clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Misi Mingguan
                </h3>
                <p className="text-gray-600">
                  Checklist interaktif pencegahan DBD dengan tracking progress dan reward untuk konsistensi.
                </p>
              </div>

              {/* Feature 3 - Achievement System */}
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-7 h-7 text-red-700"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="8" r="7" />
                    <polyline points="8.21,13.89 7,23 12,20 17,23 15.79,13.88" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Sistem Badges
                </h3>
                <p className="text-gray-600">
                  Kumpulkan badges untuk konsistensi pencegahan dan pencapaian milestone tertentu.
                </p>
              </div>

              {/* Feature 4 - News Aggregator */}
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-7 h-7 text-red-700"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
                    <path d="M18 14h-8" />
                    <path d="M15 18h-5" />
                    <path d="M10 6h8" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Berita Terkini
                </h3>
                <p className="text-gray-600">
                  Update berita dan informasi terbaru seputar DBD dari berbagai sumber terpercaya.
                </p>
              </div>
            </div>

            {/* Second Row - 3 Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 5 - Data Visualization */}
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-7 h-7 text-red-700"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M3 9h18" />
                    <path d="M9 21V9" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Peta Sebaran
                </h3>
                <p className="text-gray-600">
                  Visualisasi interaktif sebaran kasus DBD di Indonesia dengan teknologi heatmap untuk awareness.
                </p>
              </div>

              {/* Feature 6 - History Tracking */}
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-7 h-7 text-red-700"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                    <path d="M21 3v5h-5" />
                    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                    <path d="M8 16H3v5" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Riwayat Lengkap
                </h3>
                <p className="text-gray-600">
                  Tracking pemeriksaan dan progress pencegahan dengan analytics mendalam untuk monitoring kesehatan.
                </p>
              </div>

              {/* Feature 7 - Educational Content */}
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-7 h-7 text-red-700"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Edukasi Interaktif
                </h3>
                <p className="text-gray-600">
                  FAQ komprehensif dan tips pencegahan DBD dengan format yang mudah dipahami oleh masyarakat.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-gray-50">
          <div className="mx-auto max-w-screen-xl px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Tim Pengembang
              </h2>
              <div className="w-20 h-1 bg-red-700 mx-auto mb-6"></div>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Dibangun oleh tim mahasiswa Universitas Teknologi Yogyakarta yang berdedikasi untuk membantu masyarakat
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Developer 1 */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="bg-gradient-to-r from-red-600 to-red-800 h-32"></div>
                <div className="text-center -mt-16 pb-8 px-6">
                  <div className="w-32 h-32 rounded-full bg-gray-200 border-4 border-white mx-auto mb-4 flex items-center justify-center overflow-hidden">
                    <Image
                      src="/images/marshal.png"
                      alt="Fardila Bintang Adinata"
                      width={128}
                      height={128}
                      className="w-full h-auto text-gray-400"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Fardila Bintang Adinata
                  </h3>
                  <p className="text-red-700 font-medium mb-3">Full Stack Developer</p>
                  <p className="text-gray-600 text-sm mb-4">
                    Bertanggung jawab atas pengembangan frontend dan integrasi API
                  </p>
                </div>
              </div>

              {/* Developer 2 */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="bg-gradient-to-r from-red-600 to-red-800 h-32"></div>
                <div className="text-center -mt-16 pb-8 px-6">
                  <div className="w-32 h-32 rounded-full bg-gray-200 border-4 border-white mx-auto mb-4 flex items-center justify-center overflow-hidden">
                    <Image
                      src="/images/alip.png"
                      alt="Alif Arya Kusuma"
                      width={128}
                      height={128}
                      className="w-full h-auto text-gray-400"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Alif Arya Kusuma
                  </h3>
                  <p className="text-red-700 font-medium mb-3">Machine Learning Engineer</p>
                  <p className="text-gray-600 text-sm mb-4">
                    Fokus pada pengembangan model AI dan data processing
                  </p>
                </div>
              </div>

              {/* Developer 3 */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="bg-gradient-to-r from-red-600 to-red-800 h-32"></div>
                <div className="text-center -mt-16 pb-8 px-6">
                  <div className="w-32 h-32 rounded-full bg-gray-200 border-4 border-white mx-auto mb-4 flex items-center justify-center overflow-hidden">
                    <Image
                      src="/images/ridho.png"
                      alt="Satria Ridho Ekosbar"
                      width={128}
                      height={128}
                      className="w-full h-auto text-gray-400"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Satria Ridho Eksobar
                  </h3>
                  <p className="text-red-700 font-medium mb-3">Full Stack Developer</p>
                  <p className="text-gray-600 text-sm mb-4">
                    Bertanggung jawab atas pengembangan frontend dan integrasi API
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-screen-xl px-4">
            <div className="bg-gradient-to-r from-red-700 to-red-900 rounded-2xl p-12 text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Siap Melakukan Pemeriksaan?
              </h2>
              <p className="text-lg mb-8 opacity-90">
                Deteksi DBD sejak dini untuk penanganan yang lebih cepat dan tepat
              </p>
              <a
                href="/form"
                className="inline-flex gap-x-2 items-center rounded bg-white px-8 py-4 text-sm font-medium text-red-700 shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-white/50 active:bg-gray-200 transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 7V5a2 2 0 0 1 2-2h2" />
                  <path d="M17 3h2a2 2 0 0 1 2 2v2" />
                  <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
                  <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
                  <circle cx="12" cy="12" r="3" />
                  <path d="m16 16-1.9-1.9" />
                </svg>
                Mulai Pemeriksaan Sekarang
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
