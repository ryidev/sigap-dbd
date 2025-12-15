'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '../../../utils/supabase/client'
import { User } from '@supabase/supabase-js'

export default function Step1Landing() {
    const [user, setUser] = useState<User | null>(null)
    const supabase = createClient()
    const [isDodging, setIsDodging] = useState(true)
    const [isHunting, setIsHunting] = useState(true)
    const [isFalling, setIsFalling] = useState(false)
    const [isShot, setIsShot] = useState(false)

    useEffect(() => {
        // Get initial user
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }

        getUser()

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user ?? null)
            }
        )

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    return (
        <div className="flex flex-col items-center pt-36 pb-24 gap-y-20">
            {/* Animated mosquito illustration */}
            <div className="relative w-full max-w-md p-6 sm:p-12 mx-auto">
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

                <div className="absolute inset-0 flex items-center justify-center">
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
                        <img
                            src="/mosquito2.png"
                            alt="Mosquito Illustration"
                            className="w-32 h-32 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-80 lg:h-80 object-contain"
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
                            <circle cx="50" cy="50" r="45" strokeWidth={isShot ? "3" : "1.5"} opacity={isShot ? "1" : "0.6"} style={{ transition: 'all 0.3s' }} />
                            <circle cx="50" cy="50" r="35" strokeWidth="1" opacity="0.4" />
                            <line x1="50" y1="5" x2="50" y2="25" strokeWidth="2" strokeLinecap="round" opacity={isShot ? "1" : "0.8"} />
                            <line x1="50" y1="75" x2="50" y2="95" strokeWidth="2" strokeLinecap="round" opacity={isShot ? "1" : "0.8"} />
                            <line x1="5" y1="50" x2="25" y2="50" strokeWidth="2" strokeLinecap="round" opacity={isShot ? "1" : "0.8"} />
                            <line x1="75" y1="50" x2="95" y2="50" strokeWidth="2" strokeLinecap="round" opacity={isShot ? "1" : "0.8"} />
                            <circle cx="50" cy="50" r={isShot ? "4" : "2"} fill="currentColor" style={{ transition: 'r 0.3s' }} />
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
            </div>
            <div className="flex flex-col text-3xl font-extrabold sm:text-5xl gap-x-2">
                <span> Deteksi DBD hanya dengan </span>
                <span className="text-red-700"> beberapa pertanyaan saja! </span>
            </div>

            {user ? (
                // Logged in: Show single "Lanjutkan" button
                <div className="flex flex-col gap-4">
                    <Link
                        href="/form?step=1"
                        className="flex gap-x-2 rounded bg-red-700 px-12 py-3 text-sm font-medium text-white shadow hover:bg-red-800 focus:outline-none focus:ring active:bg-red-800 sm:w-auto justify-center"
                    >
                        Lanjutkan
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5 text-white"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </Link>
                </div>
            ) : (
                // Not logged in: Show both buttons
                <div className="flex flex-col gap-4">
                    <Link
                        href="/form?step=1"
                        className="flex gap-x-2 rounded bg-red-700 px-6 py-3 text-sm font-medium text-white shadow hover:bg-red-800 focus:outline-none focus:ring active:bg-red-800 sm:w-auto justify-center"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5 text-white"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M2 12a5 5 0 0 0 5 5 8 8 0 0 1 5 2 8 8 0 0 1 5-2 5 5 0 0 0 5-5V7h-5a8 8 0 0 0-5 2 8 8 0 0 0-5-2H2Z" />
                            <path d="M6 11c1.5 0 3 .5 3 2-2 0-3 0-3-2Z" />
                            <path d="M18 11c-1.5 0-3 .5-3 2 2 0 3 0 3-2Z" />
                        </svg>
                        Isi sebagai anonim
                    </Link>

                    <div className="text-center">
                        <p className="text-sm text-gray-600 mb-2">atau</p>
                        <Link
                            href="/login"
                            className="flex gap-x-2 rounded bg-white border-2 border-red-700 px-6 py-3 text-sm font-medium text-red-700 shadow hover:bg-red-50 focus:outline-none focus:ring active:bg-red-100 sm:w-auto justify-center"
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
                                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                                <polyline points="10 17 15 12 10 7" />
                                <line x1="15" x2="3" y1="12" y2="12" />
                            </svg>
                            Masuk dengan akun
                        </Link>
                    </div>
                </div>
            )}
        </div>
    )
}
