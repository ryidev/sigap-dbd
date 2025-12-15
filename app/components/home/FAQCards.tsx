'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

interface FAQCard {
  id: number
  question: string
  icon: string
  color: string
  backgroundUrl: string
  content: Array<{ icon: string; text: string }>
}

const faqData: FAQCard[] = [
  {
    id: 1,
    question: "Bagaimana mengenali gejala awal DBD?",
    icon: "❓",
    color: "red",
    backgroundUrl: "https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=2070",
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
    id: 2,
    question: "Apakah DBD bisa menular antar manusia?",
    icon: "🦟",
    color: "red",
    backgroundUrl: "https://asset.kompas.com/crops/aoFyj1dKTGJxK1TEanlHyigR2H0=/63x94:863x627/750x500/data/photo/2018/12/08/1132293230.jpg",
    content: [
      { icon: "❌", text: "TIDAK! DBD tidak menular dari manusia ke manusia secara langsung" },
      { icon: "🦟", text: "DBD hanya menular melalui gigitan nyamuk Aedes aegypti yang terinfeksi virus dengue" },
      { icon: "🩸", text: "Nyamuk menjadi pembawa virus setelah menggigit orang yang sudah terinfeksi DBD" },
      { icon: "⏱️", text: "Virus berkembang dalam tubuh nyamuk selama 8-12 hari sebelum bisa menular ke orang lain" },
      { icon: "👨‍👩‍👧", text: "Aman merawat pasien DBD di rumah asalkan lingkungan bebas nyamuk" },
      { icon: "🛡️", text: "Fokus pencegahan: basmi nyamuk dan lindungi pasien dari gigitan nyamuk agar tidak menular ke orang lain" }
    ]
  },
  {
    id: 3,
    question: "Apa perbedaan DBD dan tipes?",
    icon: "🔍",
    color: "red",
    backgroundUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070",
    content: [
      { icon: "🌡️", text: "DBD: Demam tinggi mendadak vs Tipes: Demam naik bertahap" },
      { icon: "🤕", text: "DBD: Sakit kepala hebat dan nyeri mata vs Tipes: Sakit kepala ringan" },
      { icon: "🔴", text: "DBD: Ruam merah kecil muncul hari ke-3 vs Tipes: Bintik merah di dada (rose spot)" },
      { icon: "💪", text: "DBD: Nyeri otot dan sendi parah vs Tipes: Nyeri otot ringan" },
      { icon: "🍽️", text: "DBD: Mual muntah awal penyakit vs Tipes: Gangguan pencernaan dominan" },
      { icon: "🧪", text: "Diagnosis pasti memerlukan tes laboratorium: NS1, IgG/IgM untuk DBD" }
    ]
  },
  {
    id: 4,
    question: "Apa yang harus dilakukan dalam 24 jam pertama demam?",
    icon: "⏰",
    color: "red",
    backgroundUrl: "https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=2071",
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
    id: 5,
    question: "Kapan harus segera ke dokter?",
    icon: "🏥",
    color: "red",
    backgroundUrl: "https://th.bing.com/th/id/OIP.L61_ldQ2xcvgzyjeO7qsvwHaEK?w=328&h=185&c=7&r=0&o=7&cb=ucfimg2&dpr=1.3&pid=1.7&rm=3&ucfimg=1",
    content: [
      { icon: "🚨", text: "Demam tinggi berlangsung lebih dari 3 hari berturut-turut" },
      { icon: "🤮", text: "Muntah terus-menerus sehingga tidak bisa makan atau minum" },
      { icon: "⚡", text: "Nyeri perut hebat dan berkelanjutan yang tidak tertahankan" },
      { icon: "🩸", text: "Pendarahan spontan: mimisan, gusi berdarah, atau bintik merah di kulit" },
      { icon: "😵", text: "Lemas berlebihan, gelisah, atau kehilangan kesadaran" },
      { icon: "💧", text: "Tanda dehidrasi: mulut kering, jarang buang air kecil, kulit pucat" }
    ]
  }
]

const getColorClasses = (color: string) => {
  return {
    gradient: 'from-red-700 to-red-800',
    badge: 'bg-red-100 text-red-700'
  }
}

export default function FAQCards() {
  const [activeCard, setActiveCard] = useState<number | null>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const isAnimatingRef = useRef(false)

  useEffect(() => {
    // Initial positioning for 5 cards with GPU acceleration
    cardsRef.current.forEach((card, index) => {
      if (card) {
        gsap.set(card, {
          x: index * 200 - 400,
          y: 0,
          rotation: (index - 2) * 4,
          zIndex: faqData.length - 1 - index,
          scale: 1,
          force3D: true, // Enable GPU acceleration
          willChange: 'transform' // Hint to browser for optimization
        })
      }
    })
  }, [])

  const handleCardClick = (index: number, event: React.MouseEvent) => {
    event.stopPropagation()

    // Prevent multiple animations at once
    if (isAnimatingRef.current) return

    if (activeCard === index) {
      returnToSpread()
    } else {
      isAnimatingRef.current = true
      setActiveCard(index)

      cardsRef.current.forEach((card, i) => {
        if (card) {
          if (i === index) {
            gsap.to(card, {
              x: 0,
              y: -50,
              rotation: 0,
              zIndex: 10,
              scale: 1.05,
              duration: 0.4, // Reduced from 0.6
              ease: 'power2.out',
              force3D: true,
              onComplete: () => {
                isAnimatingRef.current = false
              }
            })
          } else {
            const offset = (i - index) * 8
            gsap.to(card, {
              x: offset,
              y: offset + 20,
              rotation: 0,
              zIndex: 5 - Math.abs(i - index),
              scale: 0.95,
              duration: 0.4, // Reduced from 0.6
              ease: 'power2.out',
              force3D: true
            })
          }
        }
      })
    }
  }

  const returnToSpread = () => {
    if (isAnimatingRef.current) return

    isAnimatingRef.current = true
    setActiveCard(null)

    cardsRef.current.forEach((card, i) => {
      if (card) {
        gsap.to(card, {
          x: i * 200 - 400,
          y: 0,
          rotation: (i - 2) * 4,
          zIndex: faqData.length - 1 - i,
          scale: 1,
          duration: 0.4, // Reduced from 0.6
          ease: 'power2.out',
          force3D: true,
          onComplete: () => {
            isAnimatingRef.current = false
          }
        })
      }
    })
  }

  const handleBackdropClick = () => {
    if (activeCard !== null && !isAnimatingRef.current) {
      returnToSpread()
    }
  }

  const navigateToCard = (newIndex: number) => {
    if (newIndex >= 0 && newIndex < faqData.length && !isAnimatingRef.current) {
      isAnimatingRef.current = true
      setActiveCard(newIndex)

      cardsRef.current.forEach((card, i) => {
        if (card) {
          if (i === newIndex) {
            gsap.to(card, {
              x: 0,
              y: -50,
              rotation: 0,
              zIndex: 10,
              scale: 1.05,
              duration: 0.4, // Reduced from 0.6
              ease: 'power2.out',
              force3D: true,
              onComplete: () => {
                isAnimatingRef.current = false
              }
            })
          } else {
            const offset = (i - newIndex) * 8
            gsap.to(card, {
              x: offset,
              y: offset + 20,
              rotation: 0,
              zIndex: 5 - Math.abs(i - newIndex),
              scale: 0.95,
              duration: 0.4, // Reduced from 0.6
              ease: 'power2.out',
              force3D: true
            })
          }
        }
      })
    }
  }

  const handlePrevCard = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (activeCard !== null && activeCard > 0 && !isAnimatingRef.current) {
      navigateToCard(activeCard - 1)
    }
  }

  const handleNextCard = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (activeCard !== null && activeCard < faqData.length - 1 && !isAnimatingRef.current) {
      navigateToCard(activeCard + 1)
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeCard !== null && !isAnimatingRef.current) {
        if (e.key === 'ArrowLeft' && activeCard > 0) {
          navigateToCard(activeCard - 1)
        } else if (e.key === 'ArrowRight' && activeCard < faqData.length - 1) {
          navigateToCard(activeCard + 1)
        } else if (e.key === 'Escape') {
          returnToSpread()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeCard])

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-20 px-4"
      onClick={handleBackdropClick}
    >
      <div className="mb-2 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Pertanyaan Umum tentang DBD
        </h2>
        <p className="text-gray-600 text-lg">
          Pertanyaan umum seputar Demam Berdarah Dengue yang perlu diketahui dan cara penanganannya.
        </p>
      </div>

      <div
        ref={containerRef}
        className="relative w-full max-w-7xl h-[650px] flex items-center justify-center"
      >
        {faqData.map((faq, index) => {
          const colors = getColorClasses(faq.color)
          return (
            <div
              key={faq.id}
              ref={(el) => {
                cardsRef.current[index] = el
              }}
              onClick={(e) => handleCardClick(index, e)}
              className="absolute w-96 h-[450px] bg-white rounded-3xl shadow-2xl cursor-pointer overflow-hidden border border-gray-200 transition-shadow hover:shadow-3xl"
              style={{
                transformOrigin: 'center center',
                willChange: 'transform',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden'
              }}
            >
              {/* Card Header */}
              <div className={`absolute top-0 left-0 right-0 h-28 bg-gradient-to-br ${colors.gradient} flex items-center justify-center overflow-hidden`}>
                {/* Background Image with Transparency */}
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-70"
                  style={{
                    backgroundImage: `url(${faq.backgroundUrl})`,
                    backgroundBlendMode: 'overlay'
                  }}
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-700/80 to-red-800/80" />

                {/* Number */}
                <span className="relative text-white text-8xl font-bold opacity-30 z-10">
                  {String(faq.id).padStart(2, '0')}
                </span>
                <div className="absolute top-6 left-6 text-5xl z-10">
                  {/* {faq.icon} */}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-7 pt-32 h-full flex flex-col">
                <h3 className="text-xl font-bold text-gray-800 mb-3 leading-tight">
                  {faq.question}
                </h3>

                {/* Preview - show first 2 items when not active */}
                {activeCard !== index && (
                  <div className="flex-1 space-y-2 opacity-60">
                    {faq.content.slice(0, 2).map((item, itemIndex) => (
                      <div key={itemIndex} className="flex gap-2 items-start">
                        <span className="text-lg flex-shrink-0">{item.icon}</span>
                        <p className="text-xs text-gray-600 leading-relaxed line-clamp-1">
                          {item.text}
                        </p>
                      </div>
                    ))}
                    <p className="text-xs text-gray-400 italic mt-2">Klik untuk detail lengkap...</p>
                  </div>
                )}

                {/* Full content when active */}
                {activeCard === index && (
                  <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                    {faq.content.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex gap-3 items-start">
                        <span className="text-xl flex-shrink-0">{item.icon}</span>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {item.text}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Card Footer Badge */}
                <div className="mt-auto pt-4">
                  <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCard === index
                    ? colors.badge
                    : 'bg-gray-100 text-gray-600'
                    }`}>
                    {activeCard === index ? 'Klik lagi untuk kembali' : 'Klik untuk detail'}
                  </div>
                </div>
              </div>

              {/* Decorative Corner */}
              <div className="absolute top-6 right-6 w-12 h-12 border-t-2 border-r-2 border-white opacity-50 rounded-tr-2xl"></div>
            </div>
          )
        })}
      </div>

      {/* Navigation Controls - Show when card is active */}
      {activeCard !== null && (
        <>
          {/* Previous Button */}
          {activeCard > 0 && (
            <button
              onClick={handlePrevCard}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 bg-red-700 hover:bg-red-800 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110 active:scale-95"
              aria-label="Previous card"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Next Button */}
          {activeCard < faqData.length - 1 && (
            <button
              onClick={handleNextCard}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 bg-red-700 hover:bg-red-800 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110 active:scale-95"
              aria-label="Next card"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Close Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              returnToSpread()
            }}
            className="fixed top-8 right-8 z-20 bg-gray-800 hover:bg-gray-900 text-white p-3 rounded-full shadow-2xl transition-all hover:scale-110 active:scale-95"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Keyboard Hint */}
          {/* <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-20 text-xs text-gray-500 bg-white/80 backdrop-blur px-3 py-1 rounded-full">
            Gunakan ← → atau klik tombol untuk navigasi
          </div> */}
        </>
      )}


    </div>
  )
}
