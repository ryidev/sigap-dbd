'use client'

export default function FeaturesSection() {
    return (
        <section className="py-16 bg-white">
            <div className="mx-auto max-w-screen-xl px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Fitur Unggulan
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Platform komprehensif untuk deteksi, pencegahan, dan edukasi DBD dengan teknologi AI dan gamifikasi
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Feature 1 - AI Detection */}
                    <div className="text-center p-6 rounded-lg border-2 border-red-200 bg-red-50 hover:border-red-400 hover:shadow-lg transition-all">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg"
                                className="w-8 h-8 text-red-700"
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
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                            Deteksi AI
                        </h3>
                        <p className="text-gray-600 text-sm">
                            Algoritma machine learning untuk prediksi DBD akurat berdasarkan gejala
                        </p>
                    </div>

                    {/* Feature 2 - Weekly Missions */}
                    <div className="text-center p-6 rounded-lg border-2 border-red-200 bg-red-50 hover:border-red-400 hover:shadow-lg transition-all">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-8 h-8 text-red-700"
                                viewBox="0 0 16 16">
                                <path
                                    fill="currentColor"
                                    fillRule="evenodd"
                                    d="M13.293 0c.39 0 .707.317.707.707V2h1.293a.707.707 0 0 1 .5 1.207l-1.46 1.46A1.138 1.138 0 0 1 13.53 5h-1.47L8.53 8.53a.75.75 0 0 1-1.06-1.06L11 3.94V2.47c0-.301.12-.59.333-.804l1.46-1.46a.707.707 0 0 1 .5-.207ZM2.5 8a5.5 5.5 0 0 1 6.598-5.39a.75.75 0 0 0 .298-1.47A7 7 0 1 0 14.86 6.6a.75.75 0 0 0-1.47.299A5.5 5.5 0 1 1 2.5 8m5.364-2.496a.75.75 0 0 0-.08-1.498A4 4 0 1 0 11.988 8.3a.75.75 0 0 0-1.496-.111a2.5 2.5 0 1 1-2.63-2.686Z"
                                    clipRule="evenodd" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                            Misi Mingguan
                        </h3>
                        <p className="text-gray-600 text-sm">
                            Checklist interaktif pencegahan DBD dengan tracking progress dan reward
                        </p>
                    </div>

                    {/* Feature 3 - Achievement System */}
                    <div className="text-center p-6 rounded-lg border-2 border-red-200 bg-red-50 hover:border-red-400 hover:shadow-lg transition-all">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-8 h-8 text-red-700"
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
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                            Sistem Badges
                        </h3>
                        <p className="text-gray-600 text-sm">
                            Kumpulkan badges untuk konsistensi pencegahan dan pencapaian milestone
                        </p>
                    </div>

                    {/* Feature 4 - News Aggregator */}
                    <div className="text-center p-6 rounded-lg border-2 border-red-200 bg-red-50 hover:border-red-400 hover:shadow-lg transition-all">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-8 h-8 text-red-700"
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
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                            Berita Terkini
                        </h3>
                        <p className="text-gray-600 text-sm">
                            Update berita dan informasi terbaru seputar DBD dari berbagai sumber
                        </p>
                    </div>
                </div>

                {/* Additional Features Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                    {/* Feature 5 - Data Visualization */}
                    <div className="text-center p-6 rounded-lg border-2 border-red-200 bg-red-50 hover:border-red-400 hover:shadow-lg transition-all">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-8 h-8 text-red-700"
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
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Peta Sebaran
                        </h3>
                        <p className="text-gray-600">
                            Visualisasi interaktif sebaran kasus DBD di Indonesia dengan teknologi heatmap
                        </p>
                    </div>

                    {/* Feature 6 - History Tracking */}
                    <div className="text-center p-6 rounded-lg border-2 border-red-200 bg-red-50 hover:border-red-400 hover:shadow-lg transition-all">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-8 h-8 text-red-700"
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
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Riwayat Lengkap
                        </h3>
                        <p className="text-gray-600">
                            Tracking pemeriksaan dan progress pencegahan dengan analytics mendalam
                        </p>
                    </div>

                    {/* Feature 7 - Educational Content */}
                    <div className="text-center p-6 rounded-lg border-2 border-red-200 bg-red-50 hover:border-red-400 hover:shadow-lg transition-all">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-8 h-8 text-red-700"
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
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Edukasi Interaktif
                        </h3>
                        <p className="text-gray-600">
                            FAQ komprehensif dan tips pencegahan DBD dengan format yang mudah dipahami
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
