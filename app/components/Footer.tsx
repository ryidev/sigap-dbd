import Link from 'next/link'
import NextImage from 'next/image'

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="mx-auto max-w-screen-xl px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Column 1: About */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-3 mb-4">
                            <NextImage src="/dengue.png" width={40} height={40} className="h-10 w-auto" alt="SiGap Dengue Logo" />
                            <h3 className="text-xl font-bold">SiGap Dengue</h3>
                        </div>
                        <p className="text-gray-400 mb-4">
                            Sistem deteksi dini Demam Berdarah Dengue berbasis AI untuk membantu masyarakat Indonesia mendapatkan diagnosa lebih cepat dan akurat.
                        </p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Tautan Cepat</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                                    Beranda
                                </Link>
                            </li>
                            <li>
                                <Link href="/form" className="text-gray-400 hover:text-white transition-colors">
                                    Periksa Sekarang
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                                    Tentang
                                </Link>
                            </li>
                            <li>
                                <Link href="/history" className="text-gray-400 hover:text-white transition-colors">
                                    Riwayat
                                </Link>
                            </li>
                            <li>
                                <Link href="/login" className="text-gray-400 hover:text-white transition-colors">
                                    Masuk
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Resources */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Informasi</h4>
                        <ul className="space-y-2">
                            <li>
                                <a
                                    href="https://www.who.int/news-room/fact-sheets/detail/dengue-and-severe-dengue"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Tentang DBD (WHO)
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://www.kemkes.go.id"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Kemenkes RI
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://uty.ac.id"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Tentang UTY
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; {new Date().getFullYear()} SiGap Dengue - Universitas Teknologi Yogyakarta. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
