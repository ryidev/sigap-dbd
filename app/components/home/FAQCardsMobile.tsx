'use client'

import { useState } from 'react'
import Link from 'next/link'

// FAQ Accordion Component
const FAQAccordion = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    const faqData = [
        {
            question: "Bagaimana mengenali gejala awal DBD?",
            icon: "❓",
            color: "red",
            content: [
                { icon: "🌡️", text: "Demam tinggi mendadak (38°C - 40°C) tanpa sebab yang jelas" },
                { icon: "🤕", text: "Sakit kepala hebat yang terasa menusuk, terutama di area belakang mata" },
                { icon: "💪", text: "Nyeri otot dan sendi yang membuat tubuh terasa sangat pegal" },
                { icon: "🤢", text: "Mual, muntah, dan hilang nafsu makan secara tiba-tiba" },
                { icon: "🔴", text: "Ruam merah kecil yang muncul di kulit, biasanya setelah hari ke-3" },
                { icon: "⚠️", text: "Perlu diingat: Gejala awal DBD mirip flu biasa, jadi waspada jika demam tidak kunjung turun" }
            ]
        },
        {
            question: "Apakah DBD bisa menular antar manusia?",
            icon: "🦟",
            color: "red",
            content: [
                { icon: "❌", text: "TIDAK! DBD tidak menular dari manusia ke manusia secara langsung" },
                { icon: "🦟", text: "DBD hanya menular melalui gigitan nyamuk Aedes aegypti yang terinfeksi virus dengue" },
                { icon: "�", text: "Nyamuk menjadi pembawa virus setelah menggigit orang yang sudah terinfeksi DBD" },
                { icon: "⏱️", text: "Virus berkembang dalam tubuh nyamuk selama 8-12 hari sebelum bisa menular ke orang lain" },
                { icon: "👨‍👩‍👧", text: "Aman merawat pasien DBD di rumah asalkan lingkungan bebas nyamuk" },
                { icon: "🛡️", text: "Fokus pencegahan: basmi nyamuk dan lindungi pasien dari gigitan nyamuk agar tidak menular ke orang lain" }
            ]
        },
        {
            question: "Apa perbedaan DBD dan tipes?",
            icon: "🔍",
            color: "red",
            content: [
                { icon: "🌡️", text: "DBD: Demam tinggi mendadak vs Tipes: Demam naik bertahap" },
                { icon: "�", text: "DBD: Sakit kepala hebat dan nyeri mata vs Tipes: Sakit kepala ringan" },
                { icon: "🔴", text: "DBD: Ruam merah kecil muncul hari ke-3 vs Tipes: Bintik merah di dada (rose spot)" },
                { icon: "�", text: "DBD: Nyeri otot dan sendi parah vs Tipes: Nyeri otot ringan" },
                { icon: "🍽️", text: "DBD: Mual muntah awal penyakit vs Tipes: Gangguan pencernaan dominan" },
                { icon: "🧪", text: "Diagnosis pasti memerlukan tes laboratorium: NS1, IgG/IgM untuk DBD" }
            ]
        },
        {
            question: "Apa yang harus dilakukan dalam 24 jam pertama demam?",
            icon: "⏰",
            color: "red",
            content: [
                { icon: "🌡️", text: "Monitor suhu tubuh setiap 2-3 jam dan catat dalam buku harian" },
                { icon: "💊", text: "Berikan paracetamol untuk menurunkan demam, HINDARI aspirin dan ibuprofen" },
                { icon: "💧", text: "Perbanyak minum air putih, oralit, atau jus buah segar" },
                { icon: "🛏️", text: "Istirahat total di tempat tidur dan hindari aktivitas berat" },
                { icon: "🍲", text: "Konsumsi makanan bergizi yang mudah dicerna seperti bubur atau sup" },
                { icon: "👨‍⚕️", text: "Hubungi dokter jika demam tidak turun setelah 24 jam atau muncul gejala lain" }
            ]
        },
        {
            question: "Kapan harus segera ke dokter?",
            icon: "🏥",
            color: "red",
            content: [
                { icon: "🚨", text: "Demam tinggi berlangsung lebih dari 3 hari berturut-turut" },
                { icon: "�", text: "Muntah terus-menerus sehingga tidak bisa makan atau minum" },
                { icon: "⚡", text: "Nyeri perut hebat dan berkelanjutan yang tidak tertahankan" },
                { icon: "🩸", text: "Pendarahan spontan: mimisan, gusi berdarah, atau bintik merah di kulit" },
                { icon: "😵", text: "Lemas berlebihan, gelisah, atau kehilangan kesadaran" },
                { icon: "💧", text: "Tanda dehidrasi: mulut kering, jarang buang air kecil, kulit pucat" }
            ]
        }
    ]

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index)
    }

    const getColorClasses = (color: string) => {
        // Semua card FAQ menggunakan warna merah seperti card pertama
        return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: 'bg-red-100' }
    }

    return (
        <div className="space-y-4">
            {faqData.map((faq, index) => {
                const colors = getColorClasses(faq.color)
                const isOpen = openIndex === index

                return (
                    <div key={index} className={`rounded-xl border-2 ${colors.border} ${colors.bg} overflow-hidden transition-all duration-300`}>
                        <button
                            onClick={() => toggleAccordion(index)}
                            className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-opacity-80 transition-all duration-200"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 ${colors.icon} rounded-full flex items-center justify-center text-xl`}>
                                    {faq.icon}
                                </div>
                                <h3 className={`text-lg font-semibold ${colors.text}`}>
                                    {faq.question}
                                </h3>
                            </div>
                            <svg
                                className={`w-5 h-5 ${colors.text} transform transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'
                                    }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        <div className={`px-6 transition-all duration-300 ${isOpen ? 'pb-6' : 'pb-0 max-h-0 overflow-hidden'}`}>
                            <div className="space-y-3 pt-2">
                                {faq.content.map((item, itemIndex) => (
                                    <div key={itemIndex} className="flex items-start gap-3">
                                        <span className="text-lg mt-0.5 flex-shrink-0">{item.icon}</span>
                                        <p className={`${colors.text} leading-relaxed`}>
                                            {item.text}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Call to action di akhir setiap FAQ */}
                            <div className="mt-4 pt-4 border-t border-opacity-30">
                                <p className="text-sm text-gray-600 mb-3">
                                    Masih ada pertanyaan? Gunakan sistem deteksi kami untuk analisis lebih lanjut.
                                </p>
                                <Link
                                    href="/form"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-700 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors shadow-md hover:shadow-lg"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Cek Gejala Sekarang
                                </Link>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default function FAQSection() {
    return (
        <section className="min-h-screen bg-white flex items-center">
            <div className="mx-auto max-w-screen-xl px-4 py-20 w-full">
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                        Pertanyaan Umum tentang DBD
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Pertanyaan umum seputar DBD yang perlu Anda ketahui untuk pencegahan dan penanganan yang tepat
                    </p>
                </div>

                <div className="max-w-4xl mx-auto">
                    <FAQAccordion />
                </div>
            </div>
        </section>
    )
}
