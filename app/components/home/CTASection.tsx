'use client'

import Link from 'next/link'

export default function CTASection() {
    return (
        <section
            className="py-16 text-white bg-right bg-no-repeat bg-cover"
            style={{
                backgroundImage: `linear-gradient(to right, #780606 20%, rgba(120, 6, 6, 0.8) 50%, rgba(120, 6, 6, 0) 100%), url('/magnifying_glass.jpg')`,
                minHeight: '50vh',
            }}
        >
            <div className="mx-auto max-w-screen-xl px-4">
                <div className="text-center text-white">
                    <h2 className="text-3xl md:text-4xl mb-4">
                        Deteksi DBD Sejak Dini
                    </h2>
                    <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
                        Jangan tunggu sampai terlambat. Lakukan pemeriksaan sekarang dan dapatkan hasil prediksi instan!
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/form"
                            className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900 shadow-lg shadow-red-900/20 hover:shadow-red-900/40 hover:scale-[1.02] transition-all duration-200"
                        >
                            <svg
                                className="mr-2 -ml-1 w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                ></path>
                            </svg>
                            Mulai Pemeriksaan
                        </Link>
                        <a
                            href="https://www.who.int/news-room/fact-sheets/detail/dengue-and-severe-dengue"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex gap-x-2 items-center rounded border-2 border-white px-8 py-4 text-sm font-medium text-white hover:bg-white hover:text-red-700 focus:outline-none focus:ring-4 focus:ring-white/50 transition-all"
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
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 16v-4" />
                                <path d="M12 8h.01" />
                            </svg>
                            Pelajari Lebih Lanjut
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}
