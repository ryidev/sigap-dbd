'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { createClient } from '../../utils/supabase/client'
import { User } from '@supabase/supabase-js'
import NextImage from 'next/image'

interface NavbarProps {
  active: 'home' | 'form' | 'login' | 'history' | 'about' | 'articles' | 'checklist' | 'profile'
}

export default function Navbar({ active }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const [userName, setUserName] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    // Get initial user
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      // Get user's full name from user_profiles or metadata
      if (user) {
        try {
          const { data: profile, error } = await supabase
            .from('user_profiles')
            .select('full_name')
            .eq('id', user.id)
            .single()

          if (profile?.full_name) {
            setUserName(profile.full_name)
          } else if (error?.code === 'PGRST116') {
            // Profile doesn't exist, use metadata or create profile
            const name = user.user_metadata?.full_name ||
              user.user_metadata?.name ||
              user.email?.split('@')[0] ||
              'User'
            setUserName(name)

            // Try to create profile
            try {
              await supabase
                .from('user_profiles')
                .insert([{
                  id: user.id,
                  full_name: name,
                  avatar_url: user.user_metadata?.avatar_url
                }])
            } catch (createError) {
              console.log('Profile creation failed:', createError)
            }
          } else {
            // Fallback to metadata or email
            setUserName(
              user.user_metadata?.full_name ||
              user.user_metadata?.name ||
              user.email?.split('@')[0] ||
              'User'
            )
          }
        } catch (error) {
          console.error('Error fetching profile:', error)
          // Use metadata as fallback
          setUserName(
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.email?.split('@')[0] ||
            'User'
          )
        }
      }

      // Set loading to false after auth check
      setIsLoading(false)
    }
    getUser()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (!session?.user) {
        setUserName('')
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showDropdown])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  // Get initials from full name
  const getInitials = (name: string) => {
    const names = name.trim().split(' ')
    if (names.length === 1) {
      return names[0].substring(0, 2).toUpperCase()
    }
    return (names[0][0] + names[names.length - 1][0]).toUpperCase()
  }

  const activeList =
    'flex gap-x-2 py-2 px-3 text-white bg-red-700 rounded md:bg-transparent md:text-red-700 md:p-0 md:dark:text-red-700'
  const regularList =
    'flex gap-x-2 py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-red-700 md:p-0'

  return (
    <nav className="bg-white dark:bg-white fixed w-full z-50 top-0 start-0 border-2 border-gray-200">
      {isLoading ? (
        // Full navbar skeleton during auth check
        <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
          {/* Logo skeleton */}
          <div className="flex items-center space-x-3">
            <div className="h-8 md:h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* Navigation skeleton - desktop */}
          <div className="hidden md:flex items-center gap-8">
            <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* Auth button skeleton */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse"></div>
            <div className="hidden md:block w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      ) : (
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4 relative">
          <div className="flex items-center space-x-3 rtl:space-x-reverse w-fit">
            <a
              href="/"
              className="flex items-center space-x-3 rtl:space-x-reverse"
              target="_blank"
              rel="noopener noreferrer"
            >
              {/* Logo untuk mobile - ukuran lebih kecil */}
              <NextImage src="/dengue.png" width={48} height={48} className="h-8 md:h-12 w-auto" alt="SiGap Dengue Logo" priority />
            </a>
          </div>
          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse gap-3">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  onMouseEnter={() => setShowDropdown(true)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {/* Avatar with Initials */}
                  <div className="w-9 h-9 rounded-full bg-red-700 flex items-center justify-center text-white font-bold text-sm">
                    {getInitials(userName)}
                  </div>
                  {/* User Name - Hidden on mobile */}
                  <span className="text-sm font-medium text-gray-700 hidden md:block max-w-[150px] truncate">
                    {userName}
                  </span>
                  {/* Dropdown Icon */}
                  <svg
                    className={`w-4 h-4 text-gray-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div
                    className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                    onMouseLeave={() => setShowDropdown(false)}
                  >
                    {/* Greeting */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm text-gray-500">Halo,</p>
                      <p className="text-base font-semibold text-gray-900 truncate">{userName}</p>
                      <p className="text-xs text-gray-400 truncate mt-1">{user.email}</p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowDropdown(false)}
                      >
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Misi & Badges
                      </Link>

                      <Link
                        href="/history"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowDropdown(false)}
                      >
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8M21 3v5h-5M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16M8 16H3v5" />
                        </svg>
                        Riwayat Pemeriksaan
                      </Link>

                      <Link
                        href="/form"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowDropdown(false)}
                      >
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Pemeriksaan Baru
                      </Link>
                    </div>

                    {/* Logout Button */}
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors w-full"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Keluar Akun
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex gap-x-2 items-center text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-red-700 dark:hover:bg-red-800 dark:focus:ring-red-900"
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
                Masuk
              </Link>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="navbar-sticky"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          </div>
          <div
            className={`${isOpen ? 'block' : 'hidden'
              } items-center justify-between w-full md:flex md:w-auto md:order-1 md:absolute md:left-1/2 md:-translate-x-1/2`}
            id="navbar-sticky"
          >
            <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-white md:dark:bg-white dark:border-gray-700">
              <li>
                <Link href="/" className={active === 'home' ? activeList : regularList}>
                  <svg xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    viewBox="0 0 16 16"
                    fill="currentColor">
                    <path
                      d="M12.5 12.618c.307-.275.5-.674.5-1.118V6.977a1.5 1.5 0 0 0-.585-1.189l-3.5-2.692a1.5 1.5 0 0 0-1.83 0l-3.5 2.692A1.5 1.5 0 0 0 3 6.978V11.5A1.496 1.496 0 0 0 4.493 13H5V9.5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2V13h.507c.381-.002.73-.146.993-.382m2-1.118a3 3 0 0 1-3 3h-7a3 3 0 0 1-3-3V6.977A3 3 0 0 1 2.67 4.6l3.5-2.692a3 3 0 0 1 3.66 0l3.5 2.692a3.003 3.003 0 0 1 1.17 2.378zm-5-2A.5.5 0 0 0 9 9H7a.5.5 0 0 0-.5.5V13h3z"
                      clipRule="evenodd" />
                  </svg>
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/form" className={active === 'form' ? activeList : regularList}>
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
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" x2="8" y1="13" y2="13" />
                    <line x1="16" x2="8" y1="17" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                  Periksa
                </Link>
              </li>
              <li>
                <Link href="/articles" className={active === 'articles' ? activeList : regularList}>
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
                    <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
                    <path d="M18 14h-8" />
                    <path d="M15 18h-5" />
                    <path d="M10 6h8v4h-8V6Z" />
                  </svg>
                  Artikel
                </Link>
              </li>
              {user && (
                <li>
                  <Link
                    href="/checklist"
                    className={active === 'checklist' ? activeList : regularList}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      viewBox="0 0 16 16">
                      <path
                        fill="currentColor"
                        fillRule="evenodd"
                        d="M13.293 0c.39 0 .707.317.707.707V2h1.293a.707.707 0 0 1 .5 1.207l-1.46 1.46A1.138 1.138 0 0 1 13.53 5h-1.47L8.53 8.53a.75.75 0 0 1-1.06-1.06L11 3.94V2.47c0-.301.12-.59.333-.804l1.46-1.46a.707.707 0 0 1 .5-.207ZM2.5 8a5.5 5.5 0 0 1 6.598-5.39a.75.75 0 0 0 .298-1.47A7 7 0 1 0 14.86 6.6a.75.75 0 0 0-1.47.299A5.5 5.5 0 1 1 2.5 8m5.364-2.496a.75.75 0 0 0-.08-1.498A4 4 0 1 0 11.988 8.3a.75.75 0 0 0-1.496-.111a2.5 2.5 0 1 1-2.63-2.686Z"
                        clipRule="evenodd" />
                    </svg>
                    Misi
                  </Link>
                </li>
              )}
              {user && (
                <li>
                  <Link
                    href="/history"
                    className={active === 'history' ? activeList : regularList}
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
                      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                      <path d="M21 3v5h-5" />
                      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                      <path d="M8 16H3v5" />
                    </svg>
                    Riwayat
                  </Link>
                </li>
              )}
              <li>
                <Link href="/about" className={active === 'about' ? activeList : regularList}>
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
                  Tentang
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </nav>
  )
}
