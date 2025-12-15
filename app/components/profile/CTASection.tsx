'use client'

import Link from 'next/link'

export default function CTASection() {
    return (
        <div className="relative mt-16 mb-8 bg-gradient-to-br from-red-50 via-white to-red-50 rounded-3xl p-10 md:p-12 shadow-2xl border border-red-100 overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#780606]/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-red-300/20 rounded-full blur-3xl"></div>

            {/* Content */}
            <div className="relative z-10 text-center">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                    Raih Badge Selanjutnya!
                </h3>
                <p className="text-gray-700 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
                    Lakukan checklist pencegahan secara konsisten untuk membuka badge baru dan meningkatkan level pencegahan DBD Anda.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link
                        href="/checklist"
                        className="group relative bg-[#780606] text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-[#5a0404] transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            Lanjutkan Misi
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    </Link>
                    <Link
                        href="/history"
                        className="bg-white border-2 border-[#780606] text-[#780606] px-8 py-4 rounded-2xl font-bold text-lg hover:bg-red-50 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center gap-2"
                    >
                        Lihat Riwayat
                    </Link>
                </div>
            </div>
        </div>
    )
}
