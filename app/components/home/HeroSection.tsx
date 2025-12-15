'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { User } from '@supabase/supabase-js'

interface HeroSectionProps {
    user: User | null
    isLoading: boolean
}

export default function HeroSection({ user, isLoading }: HeroSectionProps) {
    // Hero animation - simple one-shot trigger
    const [hasShot, setHasShot] = useState<boolean>(false)
    const [shootProgress, setShootProgress] = useState<number>(0) // 0 to 1

    // Animation states - crosshair always hunting, shoot on scroll
    const isDodging = true // Always dodging
    const isHunting = true // Crosshair always visible
    const isShot = hasShot && shootProgress > 0.2
    const isFalling = hasShot && shootProgress > 0.4

    // Simple shoot animation on scroll - resets when scrolling back up
    useEffect(() => {
        let lastScrollY = window.scrollY

        const handleScroll = () => {
            const currentScrollY = window.scrollY

            // Reset animation when scrolling back to top
            if (currentScrollY < 10 && hasShot) {
                setHasShot(false)
                setShootProgress(0)
            }
            // Trigger shoot on scroll down
            else if (currentScrollY > 10 && !hasShot) {
                setHasShot(true)
            }

            lastScrollY = currentScrollY
        }

        window.addEventListener('scroll', handleScroll, { passive: true })

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [hasShot])

    // Animate shoot progress when triggered
    useEffect(() => {
        if (!hasShot) return

        let progress = 0
        const duration = 2000 // 2 seconds for full animation
        const startTime = Date.now()

        const animate = () => {
            const elapsed = Date.now() - startTime
            progress = Math.min(1, elapsed / duration)
            setShootProgress(progress)

            if (progress < 1) {
                requestAnimationFrame(animate)
            }
        }

        requestAnimationFrame(animate)
    }, [hasShot])

    return (
        <div style={{ top: 0, marginTop: 20 }}>
            {isLoading ? (
                // Full Hero section skeleton
                <section className="relative bg-white overflow-hidden min-h-screen">
                    <div className="relative mx-auto max-w-screen-xl px-4 py-20">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
                            {/* Left Content Skeleton */}
                            <div className="text-left space-y-6 lg:pr-8">
                                {/* Badge skeleton */}
                                <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
                                    <div className="w-40 h-4 bg-gray-200 rounded animate-pulse"></div>
                                </div>

                                {/* Title skeleton */}
                                <div className="space-y-4">
                                    <div className="space-y-3">
                                        <div className="w-64 h-12 bg-gray-200 rounded animate-pulse"></div>
                                        <div className="w-56 h-12 bg-gray-200 rounded animate-pulse"></div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="w-full max-w-lg h-6 bg-gray-200 rounded animate-pulse"></div>
                                        <div className="w-4/5 max-w-lg h-6 bg-gray-200 rounded animate-pulse"></div>
                                    </div>
                                </div>

                                {/* Buttons skeleton */}
                                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                    <div className="w-48 h-12 bg-gray-200 rounded-xl animate-pulse"></div>
                                    <div className="w-40 h-12 bg-gray-200 rounded-xl animate-pulse"></div>
                                </div>

                                {/* Links skeleton */}
                                <div className="flex flex-wrap gap-6 pt-4">
                                    <div className="w-36 h-5 bg-gray-200 rounded animate-pulse"></div>
                                    <div className="w-28 h-5 bg-gray-200 rounded animate-pulse"></div>
                                    <div className="w-32 h-5 bg-gray-200 rounded animate-pulse"></div>
                                </div>

                                {/* Stats skeleton */}
                                <div className="flex gap-8 pt-8">
                                    <div className="text-center space-y-2">
                                        <div className="w-12 h-8 bg-gray-200 rounded animate-pulse mx-auto"></div>
                                        <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                                    </div>
                                    <div className="text-center space-y-2">
                                        <div className="w-16 h-8 bg-gray-200 rounded animate-pulse mx-auto"></div>
                                        <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                                    </div>
                                    <div className="text-center space-y-2">
                                        <div className="w-12 h-8 bg-gray-200 rounded animate-pulse mx-auto"></div>
                                        <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Right illustration skeleton */}
                            <div className="relative lg:pl-8">
                                <div className="relative w-80 h-80 lg:w-96 lg:h-96 mx-auto">
                                    <div className="absolute inset-0 bg-gray-200 rounded-full animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            ) : (
                <section className="relative bg-white overflow-hidden min-h-screen">
                    {/* Subtle Background Pattern */}
                    <div className="absolute inset-0 opacity-5">
                        <svg className="w-full h-full" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                                    <circle cx="30" cy="30" r="2" fill="#dc2626" />
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#grid)" />
                        </svg>
                    </div>

                    <div className="relative mx-auto max-w-screen-xl px-4 py-20">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">

                            {/* Left Content */}
                            <div className="text-left space-y-6 lg:pr-8">
                                <div className="inline-flex items-center gap-2 bg-red-100 border border-red-700 px-4 py-2 rounded-full text-red-700 text-sm font-medium">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    Deteksi Dini. Akurat. Terpercaya.
                                </div>

                                <div className="space-y-4">
                                    <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                                        <span className="block">Deteksi DBD</span>
                                        <span className="block text-red-700">lebih dini!</span>
                                    </h1>

                                    <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                                        Sistem AI canggih untuk membantu deteksi Demam Berdarah Dengue (DBD)
                                        lebih dini dengan akurasi tinggi
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                    <Link
                                        className="group flex items-center justify-center gap-3 bg-gradient-to-r from-red-700 to-red-800 text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-red-900/20 hover:shadow-red-900/40 hover:from-red-800 hover:to-red-900 transform hover:scale-105 transition-all duration-300"
                                        href="/form"
                                    >
                                        <svg
                                            className="w-5 h-5 group-hover:rotate-12 transition-transform"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Mulai Pemeriksaan
                                    </Link>

                                    {user ? (
                                        <Link
                                            className="group flex items-center justify-center gap-3 bg-white border-2 border-red-300 text-red-700 px-8 py-4 rounded-xl font-semibold hover:bg-red-50 transform hover:scale-105 transition-all duration-300"
                                            href="/history"
                                        >
                                            <svg
                                                className="w-5 h-5 group-hover:rotate-12 transition-transform"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Lihat Riwayat
                                        </Link>
                                    ) : (
                                        <Link
                                            className="group flex items-center justify-center gap-3 bg-white border-2 border-red-300 text-red-700 px-8 py-4 rounded-xl font-semibold hover:bg-red-50 transform hover:scale-105 transition-all duration-300"
                                            href="/login"
                                        >
                                            <svg
                                                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                            </svg>
                                            Masuk
                                        </Link>
                                    )}
                                </div>

                                {/* Additional Links */}
                                <div className="flex flex-wrap gap-6 pt-4">
                                    <Link
                                        href="/articles"
                                        className="group flex items-center gap-2 text-gray-600 hover:text-red-700 font-medium transition-colors"
                                    >
                                        <svg
                                            className="w-4 h-4 group-hover:scale-110 transition-transform"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                        </svg>
                                        Baca Artikel Terbaru
                                        <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>

                                    {user ? (
                                        <Link
                                            href="/checklist"
                                            className="group flex items-center gap-2 text-gray-600 hover:text-red-700 font-medium transition-colors"
                                        >
                                            <svg
                                                className="w-4 h-4 group-hover:scale-110 transition-transform"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Misi Mingguan
                                            <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    ) : null}

                                    {user ? (
                                        <Link
                                            href="/profile"
                                            className="group flex items-center gap-2 text-gray-600 hover:text-red-700 font-medium transition-colors"
                                        >
                                            <svg
                                                className="w-4 h-4 group-hover:scale-110 transition-transform"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            Misi & Badges
                                            <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    ) : null}

                                    <Link
                                        href="/about"
                                        className="group flex items-center gap-2 text-gray-600 hover:text-red-700 font-medium transition-colors"
                                    >
                                        <svg
                                            className="w-4 h-4 group-hover:scale-110 transition-transform"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Pelajari Lebih Lanjut
                                        <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>

                                {/* Stats */}
                                <div className="flex gap-8 pt-8">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-red-700">98%</div>
                                        <div className="text-gray-500 text-sm">Akurasi</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-red-700">5 Menit</div>
                                        <div className="text-gray-500 text-sm">Hasil Cepat</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-red-700">24/7</div>
                                        <div className="text-gray-500 text-sm">Tersedia</div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Illustration - Mosquito & Medical Theme */}
                            <div className="relative lg:pl-8">
                                <div className="relative">
                                    {/* Main Background Circle */}
                                    <div className="relative w-80 h-80 lg:w-96 lg:h-96 mx-auto">
                                        <div className="absolute inset-0 bg-gradient-to-br from-red-700 to-red-700 rounded-full shadow-xl opacity-10"></div>
                                        <div className="absolute inset-4 bg-gradient-to-br from-red-400 to-red-700 rounded-full opacity-20"></div>

                                        {/* Main Mosquito Illustration - Scroll-triggered Hunt Sequence */}
                                        <div className="absolute inset-16 flex items-center justify-center">
                                            <style jsx>{`
                      @keyframes mosquito-dodge {
                        0%, 100% { transform: translate(0, 0) rotate(12deg); }
                        25% { transform: translate(15px, -10px) rotate(-5deg); }
                        50% { transform: translate(-20px, 10px) rotate(25deg); }
                        75% { transform: translate(10px, 15px) rotate(0deg); }
                      }
                      
                      @keyframes crosshair-hunt {
                        0%, 100% { transform: translate(0, 0) scale(1); }
                        25% { transform: translate(-15px, 10px) scale(1.05); }
                        50% { transform: translate(20px, -12px) scale(0.95); }
                        75% { transform: translate(-10px, -15px) scale(1.02); }
                      }
                      
                      @keyframes mosquito-fall {
                        0% { transform: translate(0, 0) rotate(12deg); opacity: 1; }
                        50% { transform: translate(0, 150px) rotate(180deg); opacity: 0.5; }
                        100% { transform: translate(0, 300px) rotate(360deg); opacity: 0; }
                      }
                      
                      @keyframes crosshair-lock {
                        0%, 100% { transform: translate(0, 0) scale(1); }
                        50% { transform: translate(0, 0) scale(1.1); }
                      }
                      
                      @keyframes shot-flash {
                        0%, 100% { opacity: 0; }
                        50% { opacity: 1; }
                      }
                    `}</style>

                                            {/* Mosquito */}
                                            <div
                                                style={{
                                                    animation: isFalling
                                                        ? 'mosquito-fall 1.5s ease-in forwards'
                                                        : isDodging
                                                            ? 'mosquito-dodge 3s ease-in-out infinite'
                                                            : 'none',
                                                    transform: !isDodging && !isFalling ? 'rotate(12deg)' : undefined
                                                }}
                                            >
                                                <Image
                                                    src="/mosquito2.png"
                                                    alt="Mosquito Illustration"
                                                    width={500}
                                                    height={500}
                                                    priority
                                                    className="w-40 h-40 lg:w-68 lg:h-68 object-contain"
                                                    style={{
                                                        filter: isShot ? 'brightness(0.5)' : 'none',
                                                        transition: 'filter 0.3s'
                                                    }}
                                                />
                                            </div>

                                            {/* Red Crosshair - Appears when hunting */}
                                            <div
                                                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                                                style={{
                                                    opacity: isHunting ? 0.9 : 0,
                                                    animation: isShot
                                                        ? 'crosshair-lock 0.5s ease-in-out'
                                                        : isHunting
                                                            ? 'crosshair-hunt 3s ease-in-out infinite'
                                                            : 'none',
                                                    transition: 'opacity 0.5s'
                                                }}
                                            >
                                                <svg className="w-48 h-48 lg:w-72 lg:h-72 text-red-700" viewBox="0 0 100 100" fill="none" stroke="currentColor">
                                                    {/* Outer circle */}
                                                    <circle
                                                        cx="50"
                                                        cy="50"
                                                        r="45"
                                                        strokeWidth={isShot ? "3" : "1.5"}
                                                        opacity={isShot ? "1" : "0.6"}
                                                        style={{ transition: 'all 0.3s' }}
                                                    >
                                                        {!isShot && <animate attributeName="r" values="45;47;45" dur="2s" repeatCount="indefinite" />}
                                                    </circle>
                                                    <circle
                                                        cx="50"
                                                        cy="50"
                                                        r="35"
                                                        strokeWidth="1"
                                                        opacity="0.4"
                                                    >
                                                        {!isShot && <animate attributeName="r" values="35;33;35" dur="2s" repeatCount="indefinite" />}
                                                    </circle>

                                                    {/* Crosshair lines */}
                                                    <line x1="50" y1="5" x2="50" y2="25" strokeWidth="2" strokeLinecap="round" opacity={isShot ? "1" : "0.8"}>
                                                        {!isShot && <animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite" />}
                                                    </line>
                                                    <line x1="50" y1="75" x2="50" y2="95" strokeWidth="2" strokeLinecap="round" opacity={isShot ? "1" : "0.8"}>
                                                        {!isShot && <animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite" />}
                                                    </line>
                                                    <line x1="5" y1="50" x2="25" y2="50" strokeWidth="2" strokeLinecap="round" opacity={isShot ? "1" : "0.8"}>
                                                        {!isShot && <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite" />}
                                                    </line>
                                                    <line x1="75" y1="50" x2="95" y2="50" strokeWidth="2" strokeLinecap="round" opacity={isShot ? "1" : "0.8"}>
                                                        {!isShot && <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite" />}
                                                    </line>

                                                    {/* Center dot - RED when shot */}
                                                    <circle
                                                        cx="50"
                                                        cy="50"
                                                        r={isShot ? "4" : "2"}
                                                        fill="currentColor"
                                                        style={{ transition: 'r 0.3s' }}
                                                    >
                                                        {!isShot && <animate attributeName="r" values="2;3;2" dur="1s" repeatCount="indefinite" />}
                                                    </circle>
                                                </svg>
                                            </div>

                                            {/* Shot Flash Effect */}
                                            {isShot && !isFalling && (
                                                <div
                                                    className="absolute inset-0 bg-red-700 rounded-full pointer-events-none"
                                                    style={{
                                                        animation: 'shot-flash 0.3s ease-out',
                                                        mixBlendMode: 'screen'
                                                    }}
                                                />
                                            )}
                                        </div>

                                        {/* Medical Icons around mosquito */}
                                        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-red-400 animate-bounce rotate-125">
                                            <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                                                {/* Top half - white */}
                                                <path d="M7 14 L7 9 Q7 4 12 4 Q17 4 17 9 L17 14 Z" fill="white" />
                                                {/* Bottom half - red */}
                                                <path d="M7 14 L7 19 Q7 24 12 24 Q17 24 17 19 L17 14 Z" fill="currentColor" />
                                                {/* Dividing line */}
                                                <path d="M7 14 L17 14" stroke="currentColor" strokeWidth="1" fill="none" />
                                            </svg>
                                        </div>

                                        {/* Blood drop */}
                                        <div className="absolute top-16 right-12 text-red-700 animate-pulse">
                                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2C12 2 6 8 6 13C6 16.866 9.134 20 13 20C16.866 20 20 16.866 20 13C20 8 12 2 12 2Z" />
                                            </svg>
                                        </div>

                                        {/* Temperature/thermometer */}
                                        <div className="absolute bottom-16 left-12 text-red-400 animate-pulse" style={{ animationDelay: '0.5s' }}>
                                            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                                                <rect x="10" y="3" width="4" height="12" rx="2" />
                                                <circle cx="12" cy="18" r="4" />
                                                <rect x="11" y="5" width="2" height="9" fill="white" opacity="0.3" />
                                            </svg>
                                        </div>

                                        {/* Medical cross */}
                                        <div className="absolute bottom-8 right-16 text-red-300 animate-pulse" style={{ animationDelay: '1s' }}>
                                            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M14 2H10V10H2V14H10V22H14V14H22V10H14V2Z" />
                                            </svg>
                                        </div>

                                        {/* Virus particle */}
                                        <div className="absolute top-20 left-8 text-red-300 animate-bounce" style={{ animationDelay: '1.5s' }}>
                                            <div className="relative w-8 h-8 bg-current rounded-full opacity-60">
                                                <div className="absolute -top-1 -left-1 w-2 h-2 bg-current rounded-full"></div>
                                                <div className="absolute -top-1 -right-1 w-2 h-2 bg-current rounded-full"></div>
                                                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-current rounded-full"></div>
                                                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-current rounded-full"></div>
                                            </div>
                                        </div>

                                        {/* Heart pulse */}
                                        <div className="absolute bottom-20 right-8 text-red-400 animate-pulse" style={{ animationDelay: '2s' }}>
                                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 21L10.55 19.7C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 19.7L12 21Z" />
                                            </svg>
                                        </div>

                                        {/* DNA strand */}
                                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-red-300 animate-spin" style={{ animationDuration: '10s' }}>
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                <circle cx="8" cy="4" r="2" />
                                                <circle cx="16" cy="8" r="2" />
                                                <circle cx="8" cy="12" r="2" />
                                                <circle cx="16" cy="16" r="2" />
                                                <circle cx="8" cy="20" r="2" />
                                                <line x1="8" y1="4" x2="16" y2="8" stroke="currentColor" strokeWidth="1.5" />
                                                <line x1="16" y1="8" x2="8" y2="12" stroke="currentColor" strokeWidth="1.5" />
                                                <line x1="8" y1="12" x2="16" y2="16" stroke="currentColor" strokeWidth="1.5" />
                                                <line x1="16" y1="16" x2="8" y2="20" stroke="currentColor" strokeWidth="1.5" />
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Floating decorative elements */}
                                    <div className="absolute -top-4 left-1/4 text-red-300 animate-float">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    </div>

                                    <div className="absolute -right-4 top-1/3 text-red-200 animate-bounce" style={{ animationDelay: '0.7s' }}>
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <circle cx="12" cy="12" r="2" />
                                        </svg>
                                    </div>

                                    <div className="absolute -left-6 bottom-1/4 text-red-300 animate-pulse" style={{ animationDelay: '1.3s' }}>
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <circle cx="12" cy="12" r="2.5" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </div>
    )
}
