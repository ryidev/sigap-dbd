'use client'

import { useState, useEffect } from 'react'
import TipsCard from '@/app/components/home/TipsCard'
import TipsDetailCard from '@/app/components/home/TipsDetailCard'

export default function PreventionTipsSection() {
    const [tipsVisible, setTipsVisible] = useState<boolean>(false)

    // Tips section fade-in animation with Intersection Observer
    useEffect(() => {
        const tipsSection = document.getElementById('tips-section')
        if (!tipsSection) return

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setTipsVisible(true)
                    }
                })
            },
            {
                threshold: 0.2, // Trigger when 20% of section is visible
                rootMargin: '0px'
            }
        )

        observer.observe(tipsSection)

        return () => {
            observer.disconnect()
        }
    }, [])

    const tipsData = [
        {
            title: 'Menguras & Membersihkan',
            description: 'Kuras dan bersihkan tempat penampungan air seperti bak mandi, ember, vas bunga minimal seminggu sekali',
            footerText: '✓ Bak mandi  ✓ Ember air  ✓ Vas bunga',
            icon: (
                <svg className="w-7 h-7 text-red-700" fill="currentColor" viewBox="0 0 32 32">
                    <path d="M28 13.25h-24c-0.414 0-0.75 0.336-0.75 0.75s0.336 0.75 0.75 0.75h1.821l3.353 15.41c0.076 0.34 0.375 0.59 0.732 0.59h12.188c0.357 0 0.656-0.25 0.731-0.585l3.354-15.41h1.82c0.414 0 0.75-0.336 0.75-0.75s-0.336-0.75-0.75-0.75zM6.779 10.752c0.414 0 0.749-0.335 0.75-0.749 0-2.498 1.384-4.673 3.427-5.8 1.417-0.785 3.107-1.247 4.904-1.247 1.806 0 3.502 0.466 4.976 1.285 2.063 1.142 3.437 3.306 3.437 5.791 0 0.414 0.336 0.75 0.75 0.75s0.749-0.335 0.75-0.749c0-3.040-1.67-5.689-4.143-7.080-1.639-0.914-3.595-1.451-5.676-1.451-2.072 0-4.020 0.533-5.714 1.47-2.529 1.415-4.211 4.077-4.211 7.131 0 0.414 0.335 0.749 0.749 0.75z" />
                </svg>
            )
        },
        {
            title: 'Menutup Rapat',
            description: 'Tutup rapat-rapat tempat penyimpanan air dan wadah yang berpotensi menampung air hujan',
            footerText: '✓ Tong air  ✓ Drum  ✓ Tempayan',
            icon: (
                <svg className="w-7 h-7 text-red-700" fill="currentColor" viewBox="0 0 24 24">
                    <ellipse cx="12" cy="6" rx="7" ry="2" fill="currentColor" />
                    <rect x="5" y="6" width="14" height="12" rx="1" />
                    <ellipse cx="12" cy="18" rx="7" ry="2" fill="currentColor" opacity="0.8" />
                    <path d="M6 10H18M6 14H18" stroke="white" strokeWidth="1" opacity="0.3" />
                    <rect x="10" y="4" width="4" height="1.5" rx="0.5" fill="currentColor" opacity="0.5" />
                </svg>
            )
        },
        {
            title: 'Mendaur Ulang',
            description: 'Manfaatkan atau daur ulang barang bekas yang dapat menampung air seperti kaleng, ban bekas',
            footerText: '✓ Kaleng bekas  ✓ Ban bekas  ✓ Botol plastik',
            icon: (
                <svg className="w-7 h-7 text-red-700" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 3.1l1.4 2.2-1.6 1.1 1.3 0.3 2.8 0.6 0.6-2.7 0.4-1.4-1.8 1.1-2-3.3h-2.2l-2.6 4.3 1.7 1z" />
                    <path d="M16 12l-2.7-4.3-1.7 1 2 3.3h-2.6v-2l-3 3 3 3v-2h3.7z" />
                    <path d="M2.4 12v0l1.4-2.3 1.7 1.1-0.9-4.2-2.8 0.7-1.3 0.3 1.6 1-2.1 3.4 1.3 2h5.7v-2z" />
                </svg>
            )
        },
        {
            title: 'Plus Proteksi',
            description: 'Tambahan perlindungan dengan menanam tanaman anti nyamuk dan menggunakan obat nyamuk',
            footerText: '✓ Lavender  ✓ Serai wangi  ✓ Lotion anti nyamuk',
            icon: (
                <svg className="w-7 h-7 text-red-700" fill="currentColor" viewBox="0 0 24 24">
                    <path clipRule="evenodd" d="M10.4269 2.42148C11.4003 1.85951 12.5996 1.8595 13.573 2.42148L19.5087 5.84848C20.4821 6.41046 21.0817 7.44904 21.0817 8.573V15.427C21.0817 16.551 20.4821 17.5895 19.5087 18.1515L13.573 21.5785C12.5996 22.1405 11.4003 22.1405 10.4269 21.5785L4.49122 18.1515C3.51784 17.5895 2.91821 16.551 2.91821 15.427V8.573C2.91821 7.44904 3.51784 6.41046 4.49122 5.84848L10.4269 2.42148ZM15.75 12C15.75 12.4142 15.4142 12.75 15 12.75H12.75V15C12.75 15.4142 12.4142 15.75 12 15.75C11.5858 15.75 11.25 15.4142 11.25 15V12.75H9C8.58579 12.75 8.25 12.4142 8.25 12C8.25 11.5858 8.58579 11.25 9 11.25H11.25V9C11.25 8.58579 11.5858 8.25 12 8.25C12.4142 8.25 12.75 8.58579 12.75 9V11.25H15C15.4142 11.25 15.75 11.5858 15.75 12Z" fillRule="evenodd" />
                </svg>
            )
        }
    ];

    const gejalaItems = [
        'Demam tinggi mendadak (38°C - 40°C) selama 2-7 hari',
        'Sakit kepala hebat dan nyeri di belakang mata',
        'Nyeri otot dan sendi di seluruh tubuh',
        'Mual, muntah, dan hilang nafsu makan',
        'Ruam merah pada kulit'
    ];

    const dokterItems = [
        'Demam tidak turun setelah 3 hari',
        'Muntah terus-menerus dan tidak bisa makan/minum',
        'Nyeri perut hebat dan terus-menerus',
        'Pendarahan (mimisan, gusi berdarah)',
        'Lemas, gelisah, atau pingsan'
    ];

    return (
        <section id="tips-section" className="min-h-screen bg-gray-50 flex items-center relative overflow-hidden">
            {/* Parallax Background Layer */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    transition: 'transform 0.1s ease-out'
                }}
            >
                <div className="absolute inset-0 opacity-5">
                    <svg className="w-full h-full" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="tips-grid" width="80" height="80" patternUnits="userSpaceOnUse">
                                <circle cx="40" cy="40" r="3" fill="#dc2626" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#tips-grid)" />
                    </svg>
                </div>
            </div>

            <div className="mx-auto max-w-screen-xl px-4 py-20 w-full relative z-10">
                <div className="text-center mb-12">
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                        Tips Pencegahan DBD
                    </h2>
                    <p className="text-gray-600 text-base lg:text-lg max-w-2xl mx-auto mb-4">
                        Langkah-langkah sederhana untuk melindungi diri dan keluarga dari bahaya Demam Berdarah Dengue
                    </p>
                    <div className="inline-flex items-center gap-2 bg-red-100 border border-red-700 px-4 py-2 rounded-full text-red-700 text-sm font-medium">
                        <span className="font-bold text-base">3M+</span>
                        Metode 3M Plus - Cara Terbukti Efektif
                    </div>
                </div>

                {/* Animated Cards Container */}
                <div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
                    style={{
                        transform: tipsVisible ? 'translateY(0)' : 'translateY(50px)',
                        opacity: tipsVisible ? 1 : 0,
                        transition: 'transform 1s ease-out, opacity 1s ease-out'
                    }}
                >
                    {tipsData.map((tip, index) => (
                        <TipsCard
                            key={index}
                            icon={tip.icon}
                            title={tip.title}
                            description={tip.description}
                            footerText={tip.footerText}
                        />
                    ))}
                </div>

                {/* Additional Information Section */}
                <div
                    className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10"
                    style={{
                        transform: tipsVisible ? 'translateY(0)' : 'translateY(70px)',
                        opacity: tipsVisible ? 1 : 0,
                        transitionDelay: tipsVisible ? '300ms' : '0ms'
                    }}
                >
                    {/* Gejala DBD */}
                    <TipsDetailCard
                        icon={
                            <svg className="w-5 h-5 text-red-700" fill="currentColor" viewBox="0 0 100 100">
                                <path d="M50,12.5c-20.712,0-37.5,16.793-37.5,37.502C12.5,70.712,29.288,87.5,50,87.5c20.712,0,37.5-16.788,37.5-37.498C87.5,29.293,70.712,12.5,50,12.5z M53.826,70.86c0,0.72-0.584,1.304-1.304,1.304h-5.044c-0.72,0-1.304-0.583-1.304-1.304V46.642c0-0.72,0.584-1.304,1.304-1.304h5.044c0.72,0,1.304,0.583,1.304,1.304V70.86z M49.969,39.933c-2.47,0-4.518-2.048-4.518-4.579c0-2.53,2.048-4.518,4.518-4.518c2.531,0,4.579,1.987,4.579,4.518C54.549,37.885,52.5,39.933,49.969,39.933z" />
                            </svg>
                        }
                        title="Waspadai Gejala DBD"
                        items={gejalaItems}
                        variant="red"
                    />

                    {/* Kapan Harus ke Dokter */}
                    <TipsDetailCard
                        icon={
                            <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 16 16">
                                <path clipRule="evenodd" d="M13 1H3V5H0V15H16V5H13V1ZM7 6V8H5V10H7V12H9V10H11V8H9V6H7Z" fillRule="evenodd" />
                            </svg>
                        }
                        title="Segera ke Dokter Jika"
                        items={dokterItems}
                        variant="yellow"
                    />
                </div>


            </div>
        </section>
    )
}
