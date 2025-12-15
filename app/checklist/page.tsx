'use client'

import { useState, useEffect } from 'react'
import { createClient } from '../../utils/supabase/client'
import { User } from '@supabase/supabase-js'
import Navbar from '../components/Navbar'
import Link from 'next/link'

// Interface untuk checklist item
interface ChecklistItem {
  id: string
  title: string
  description: string
  category: 'lingkungan' | 'personal' | 'rumah'
  icon: string
  isCompleted: boolean
}

// Interface untuk progress mingguan
interface WeeklyProgress {
  id?: string
  user_id: string
  week_start: string
  completed_items: string[]
  total_items: number
  completion_percentage: number
  created_at?: string
}

export default function PreventionChecklistPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [checklist, setChecklist] = useState<ChecklistItem[]>([])
  const [weeklyProgress, setWeeklyProgress] = useState<WeeklyProgress | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const supabase = createClient()

  // Data checklist pencegahan DBD
  const defaultChecklist: ChecklistItem[] = [
    {
      id: 'drain_water_tank',
      title: 'Menguras dan menyikat bak mandi/WC',
      description: 'Lakukan minimal 1x semingga, bersihkan dinding bak dari telur nyamuk',
      category: 'rumah',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24"><path fill="#780606" fill-rule="evenodd" d="M5.385 2.75c-.903 0-1.635.732-1.635 1.635v6.865H22a.75.75 0 0 1 0 1.5h-.268q.01.067.014.136q.005.088.004.18v.039c0 .375 0 .595-.016.84c-.142 2.236-1.35 4.302-3.101 5.652l.038.068l1 2a.75.75 0 1 1-1.342.67l-.968-1.935a7.36 7.36 0 0 1-3.228.805h-.007c-.74.028-1.464.045-2.126.045s-1.386-.017-2.126-.045h-.007a7.36 7.36 0 0 1-3.228-.805l-.968 1.935a.75.75 0 1 1-1.342-.67l1-2l.038-.068c-1.751-1.35-2.96-3.416-3.101-5.652a13 13 0 0 1-.016-.84v-.355H2a.75.75 0 0 1 0-1.5h.25V4.385a3.135 3.135 0 0 1 6.046-1.164l.11.275a3.84 3.84 0 0 1 2.466.192a3.97 3.97 0 0 1 2.132 2.213a.75.75 0 0 1-.401.963L6.643 9.43a.75.75 0 0 1-.995-.413a4.18 4.18 0 0 1 .02-3.107a4.1 4.1 0 0 1 1.379-1.774l-.144-.358A1.635 1.635 0 0 0 5.385 2.75m-1.302 10h-.1a.25.25 0 0 0-.233.25v.083c0 .402 0 .574.013.767c.185 2.922 2.695 5.528 5.607 5.823c.195.02.303.023.56.033c.728.027 1.433.044 2.07.044s1.342-.017 2.07-.044c.257-.01.365-.014.56-.034c2.912-.294 5.422-2.9 5.608-5.822c.012-.193.012-.365.012-.767v-.099q0-.003 0 0a.25.25 0 0 0-.234-.233q.002 0 0 0H20l-.082-.001zm6.2-7.682a2.36 2.36 0 0 0-1.976.053a2.57 2.57 0 0 0-1.25 1.354a2.7 2.7 0 0 0-.19 1.226l4.38-1.886a2.4 2.4 0 0 0-.965-.747" clip-rule="evenodd"/></svg>',
      isCompleted: false
    },
    {
      id: 'close_water_containers',
      title: 'Menutup rapat tempat penampungan air',
      description: 'Tutup drum, kendi, tong air, dan tempat penampungan air lainnya',
      category: 'rumah',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24"><path fill="#780606" d="M4 21q-.425 0-.712-.288T3 20t.288-.712T4 19h1v-6H4q-.425 0-.712-.288T3 12t.288-.712T4 11h1V5H4q-.425 0-.712-.288T3 4t.288-.712T4 3h16q.425 0 .713.288T21 4t-.288.713T20 5h-1v6h1q.425 0 .713.288T21 12t-.288.713T20 13h-1v6h1q.425 0 .713.288T21 20t-.288.713T20 21zm3-2h10v-6q-.425 0-.712-.288T16 12t.288-.712T17 11V5H7v6q.425 0 .713.288T8 12t-.288.713T7 13zm5-3q1.25 0 2.125-.862T15 13.05q0-.975-.562-1.675T12 8.5q-1.875 2.15-2.437 2.863T9 13.05q0 1.225.875 2.088T12 16m-5 3V5z"/></svg>',
      isCompleted: false
    },
    {
      id: 'recycle_containers',
      title: 'Mendaur ulang barang bekas yang dapat menampung air',
      description: 'Singkirkan kaleng, botol bekas, ban bekas yang bisa jadi tempat genangan',
      category: 'lingkungan',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="132.75" height="128" viewBox="0 0 1792 1728"><path fill="#780606" d="m836 1169l-15 368l-2 22l-420-29q-36-3-67-31.5t-47-65.5q-11-27-14.5-55t4-65t12-55t21.5-64t19-53q78 12 509 28M449 583l180 379l-147-92q-63 72-111.5 144.5t-72.5 125t-39.5 94.5t-18.5 63l-4 21L46 961q-17-26-18-56t6-47l8-18q35-63 114-188L16 566zm1231 517l-188 359q-12 29-36.5 46.5T1412 1526l-18 4q-71 7-219 12l8 164l-230-367l211-362l7 173q170 16 283 5t170-33zM895 176q-47 63-265 435L313 424l-19-12L519 56q20-31 60-45t80-10q24 2 48.5 12t42 21T791 67t36 34.5t36 39.5t32 35m655 307l212 363q18 37 12.5 76t-27.5 74q-13 20-33 37t-38 28t-48.5 22t-47 16t-51.5 14t-46 12q-34-72-265-436l313-195zm-143-226l142-83l-220 373l-419-20l151-86q-34-89-75-166t-75.5-123.5t-64.5-80T799 25l-17-13l405 1q31-3 58 10.5t39 28.5l11 15q39 61 112 190"/></svg>',
      isCompleted: false
    },
    {
      id: 'use_repellent',
      title: 'Menggunakan lotion/spray nyamuk',
      description: 'Pakai repellent terutama saat pagi dan sore hari',
      category: 'personal',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 48 48"><defs><mask id="SVGe7ggsQXr"><g fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"><path fill="#555555" d="M17 37h14v7H17z"/><path d="M36 4H12s0 8 1 17s4 16 4 16h14s3-7 4-16s1-17 1-17"/><path d="M20.643 21.889c1.431-1.88 2.535-4.479 3.131-5.889c1.044 1.41 3.31 4.948 4.026 6.829c.894 2.35-1.342 5.171-4.026 5.171s-4.92-3.76-3.131-6.111M13 10h22"/></g></mask></defs><path fill="#780606" d="M0 0h48v48H0z" mask="url(#SVGe7ggsQXr)"/></svg>',
      isCompleted: false
    },
    {
      id: 'clean_plant_pots',
      title: 'Membersihkan pot tanaman dan gahangan ini',
      description: 'Periksa dan bersihkan tatakan pot, ganti air vas bunga secara rutin',
      category: 'lingkungan',
      // icon: '🪴',
      icon:'<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 256 256"><path fill="#780606" d="M200 144h-76.7l2.35-2.35l20.06-20.06a59.55 59.55 0 0 0 26.1 6.36a49.56 49.56 0 0 0 25.89-7.22c23.72-14.36 36.43-47.6 34-88.92a8 8 0 0 0-7.52-7.52c-41.32-2.42-74.56 10.28-88.92 34c-9.36 15.45-9.6 34.11-.87 52L120 124.68l-12.21-12.21c6-13.25 5.57-27-1.39-38.48C95.53 56 70.61 46.41 39.73 48.22a8 8 0 0 0-7.51 7.51C30.4 86.6 40 111.52 58 122.4a38.2 38.2 0 0 0 20 5.6a45 45 0 0 0 18.52-4.19L108.68 136l-8 8H56a8 8 0 0 0 0 16h9.59l13.21 59.47A15.91 15.91 0 0 0 94.42 232h67.17a15.91 15.91 0 0 0 15.62-12.53L190.42 160H200a8 8 0 0 0 0-16m-51-77.42c10.46-17.26 35.24-27 67-26.57c.41 31.81-9.31 56.58-26.57 67c-11.51 7-25.4 6.54-39.28-1.18C142.42 92 142 78.09 149 66.58m-56.89 41.53c-9.2 4.93-18.31 5.16-25.83.6C54.78 101.74 48.15 85.31 48 64c21.31.15 37.75 6.78 44.71 18.28c4.56 7.52 4.29 16.63-.6 25.83M161.59 216H94.42L82 160h92Z"/></svg>',
      isCompleted: false
    },
    {
      id: 'check_gutters',
      title: 'Membersihkan saluran air/got rumah',
      description: 'Pastikan air mengalir lancar, tidak ada genangan di sekitar rumah',
      category: 'lingkungan',
      // icon: '🏠',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 48 48"><path fill="none" stroke="#780606" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M9 29a5 5 0 0 0 5-5a5 5 0 0 0 10 0a5 5 0 0 0 10 0a5 5 0 0 0 10 0c0 11.046-8.954 20-20 20S4 35.046 4 24a5 5 0 0 0 5 5M19 5l10 10m0-10L19 15"/></svg>',
      isCompleted: false
    },
    {
      id: 'use_mosquito_net',
      title: 'Menggunakan kelambu saat tidur',
      description: 'Terutama untuk anak-anak dan area yang banyak nyamuk',
      category: 'personal',
      // icon: '🪲',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="128" viewBox="0 0 640 512"><path fill="#780606" d="M168.8 462.3c-7.9-4-11.1-13.6-7.2-21.5l30.4-60.6V336c0-4.2 1.7-8.3 4.7-11.3l59.3-59.3v-23.1L139.2 344C87.8 395.3 0 358.9 0 286.3c0-41.1 30.6-75.8 71.4-80.9l159.9-23.9l-49.6-41.3c-5.1-4.2-7-11.1-4.9-17.4l13.9-41.7l-29-58.1c-4-7.9-.7-17.5 7.2-21.5s17.5-.7 21.5 7.2l32 64c1.9 3.8 2.2 8.2.9 12.2l-12.5 37.6l45.2 38v-22.6c0-14.9 10.1-27.3 23.8-31V63.6c0-4.5 3.7-8.2 8.2-8.2s8.2 3.7 8.2 8.2v43.3c13.7 3.6 23.8 16.1 23.8 31v22.6l45.4-37.8l-12.6-37.6c-1.3-4-1-8.4.9-12.2l32-64c4-7.9 13.6-11.1 21.5-7.2s11.1 13.6 7.2 21.5l-29 58.1l13.9 41.7c2.1 6.2.1 13.1-4.9 17.4l-49.6 41.3l159.9 23.9c22.5 2.8 41.8 14.6 54.7 31.4c-2.7 2.6-5.2 5.4-7.3 8.6c-8.6-12.9-23.3-21.5-40-21.5s-31.4 8.5-40 21.5c-8.6-12.9-23.3-21.5-40-21.5c-21.7 0-40 14.3-45.9 34.1c-10.7 3.2-19.8 10.1-25.9 19.2l-40.2-35v23.1l32.4 32.4c-.3 2-.4 4.1-.4 6.2c0 16.7 8.5 31.4 21.5 40c-4 2.6-7.5 5.9-10.6 9.5l-43-43v50c0 17.7-14.3 32-32 32s-32-14.3-32-32v-50l-32 32V384c0 2.5-.6 4.9-1.7 7.2l-32 64c-4 7.9-13.6 11.1-21.5 7.2zM512 256c8.8 0 16 7.2 16 16v16h48v-16c0-8.8 7.2-16 16-16s16 7.2 16 16v16h16c8.8 0 16 7.2 16 16s-7.2 16-16 16h-16v48h16c8.8 0 16 7.2 16 16s-7.2 16-16 16h-16v48h16c8.8 0 16 7.2 16 16s-7.2 16-16 16h-16v16c0 8.8-7.2 16-16 16s-16-7.2-16-16v-16h-48v16c0 8.8-7.2 16-16 16s-16-7.2-16-16v-16h-48v16c0 8.8-7.2 16-16 16s-16-7.2-16-16v-16h-16c-8.8 0-16-7.2-16-16s7.2-16 16-16h16v-48h-16c-8.8 0-16-7.2-16-16s7.2-16 16-16h16v-48h-16c-8.8 0-16-7.2-16-16s7.2-16 16-16h16v-16c0-8.8 7.2-16 16-16s16 7.2 16 16v16h48v-16c0-8.8 7.2-16 16-16m16 112h48v-48h-48zm0 80h48v-48h-48zm-80-128v48h48v-48zm0 80v48h48v-48z"/></svg>',
      isCompleted: false
    },
    {
      id: 'plant_repellent_plants',
      title: 'Menanam tanaman pengusir nyamuk',
      description: 'Serai, lavender, mint, atau tanaman pengusir nyamuk lainnya',
      category: 'lingkungan',
      // icon: '🌿',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 16 16"><path fill="#780606" d="M9 1h2.85c.635 0 1.15.515 1.15 1.15V5q-.002.519-.126 1h.884C14.444 6 15 6.556 15 7.242V10.5a4.5 4.5 0 0 1-7.309 3.516l-.837.838a.5.5 0 0 1-.707-.708l.837-.837a4.5 4.5 0 0 1-.788-1.49A4 4 0 0 1 1 8V5.148A1.15 1.15 0 0 1 2.15 4H5l.126.002A4 4 0 0 1 9 1m1.854 9.854l-2.45 2.45A3.5 3.5 0 0 0 14 10.5V7.241A.24.24 0 0 0 13.758 7H10.5a3.5 3.5 0 0 0-2.803 5.596l2.45-2.45a.5.5 0 0 1 .707.708M11.829 6c.11-.313.171-.65.171-1V2.15a.15.15 0 0 0-.15-.15H9a3 3 0 0 0-2.88 2.159A4.01 4.01 0 0 1 8.663 6.39A4.5 4.5 0 0 1 10.5 6zm-4.035.904A3 3 0 0 0 5 5H2.15a.15.15 0 0 0-.15.15V8a3 3 0 0 0 4.012 2.825a4.6 4.6 0 0 1 .047-1.058L4.146 7.854a.5.5 0 1 1 .708-.708l1.53 1.531a4.5 4.5 0 0 1 1.41-1.773"/></svg>',
      isCompleted: false
    }
  ]

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        await loadWeeklyProgress(user.id)
      }
      setLoading(false)
    }
    getUser()
  }, [])

  const loadWeeklyProgress = async (userId: string) => {
    const weekStart = getWeekStart()

    // Coba ambil progress minggu ini
    const { data: existingProgress } = await supabase
      .from('weekly_prevention_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('week_start', weekStart)
      .maybeSingle()

    if (existingProgress) {
      setWeeklyProgress(existingProgress)
      // Load checklist dengan status yang tersimpan
      const updatedChecklist = defaultChecklist.map(item => ({
        ...item,
        isCompleted: existingProgress.completed_items.includes(item.id)
      }))
      setChecklist(updatedChecklist)
    } else {
      setChecklist(defaultChecklist)
    }
  }

  const getWeekStart = () => {
    const today = new Date()
    const dayOfWeek = today.getDay()
    const monday = new Date(today)
    monday.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1))
    return monday.toISOString().split('T')[0]
  }

  const handleChecklistChange = (itemId: string) => {
    const updatedChecklist = checklist.map(item =>
      item.id === itemId
        ? { ...item, isCompleted: !item.isCompleted }
        : item
    )
    setChecklist(updatedChecklist)
  }

  const calculateProgress = () => {
    const completed = checklist.filter(item => item.isCompleted).length
    const total = checklist.length
    return {
      completed,
      total,
      percentage: Math.round((completed / total) * 100)
    }
  }

  const saveWeeklyProgress = async () => {
    if (!user) return

    setSaving(true)
    const progress = calculateProgress()
    const weekStart = getWeekStart()
    const completedItems = checklist.filter(item => item.isCompleted).map(item => item.id)

    const progressData: WeeklyProgress = {
      user_id: user.id,
      week_start: weekStart,
      completed_items: completedItems,
      total_items: progress.total,
      completion_percentage: progress.percentage
    }

    const { error } = await supabase
      .from('weekly_prevention_progress')
      .upsert(progressData, {
        onConflict: 'user_id,week_start'
      })

    if (error) {
      setSaveMessage('Gagal menyimpan progress. Silakan coba lagi.')
    } else {
      setSaveMessage('Progress berhasil disimpan! 🎉')
      await loadWeeklyProgress(user.id)
    }

    setSaving(false)
    setTimeout(() => setSaveMessage(''), 3000)
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'rumah': return '🏠'
      case 'lingkungan': return '🌿'
      case 'personal': return '👤'
      default: return '✅'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'rumah': return 'bg-blue-50 border-blue-200 text-blue-800'
      case 'lingkungan': return 'bg-green-50 border-green-200 text-green-800'
      case 'personal': return 'bg-purple-50 border-purple-200 text-purple-800'
      default: return 'bg-gray-50 border-gray-200 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar active="checklist" />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar active="checklist" />
        <div className="pt-20">
          <div className="max-w-2xl mx-auto px-4 py-16 text-center">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-6xl mb-6">🔒</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Login Diperlukan
              </h1>
              <p className="text-gray-600 mb-8">
                Fitur Checklist Pencegahan Interaktif hanya tersedia untuk pengguna yang sudah login.
                Masuk untuk melacak progress pencegahan DBD mingguan Anda.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/login"
                  className="bg-red-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-800 transition-colors"
                >
                  Masuk Sekarang
                </Link>
                <Link
                  href="/register"
                  className="bg-white border border-red-700 text-red-700 px-6 py-3 rounded-lg font-medium hover:bg-red-50 transition-colors"
                >
                  Daftar Akun Baru
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const progress = calculateProgress()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar active="checklist" />

      <div className="pt-20">
        {/* Header with background image and red overlay */}
        <div className="relative min-h-[180px]">
          {/* Background image (z-0 so it's behind overlay and content) */}
          <div className="absolute inset-0 z-0 bg-[url('/background/bgmisi.png')] bg-cover bg-center"></div>

          {/* Semi-transparent red overlay for readability (above bg, below content) */}
          <div className="absolute inset-0 z-10 bg-red-900/60"></div>

          <div className="relative z-20 max-w-4xl mx-auto px-4 py-16 text-white">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">
                Checklist Pencegahan Interaktif
              </h1>
              <p className="text-xl text-red-100/90">
                Lakukan langkah pencegahan DBD secara rutin dan pantau progress mingguan Anda
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Progress Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Progress Pencegahan Minggu Ini
              </h2>
              <div className="text-5xl font-bold text-gray-900 mb-4">
                {progress.percentage}%
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div
                  className="bg-gray-300 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progress.percentage}%` }}
                ></div>
              </div>

              <p className="text-gray-600 text-sm">
                {progress.completed} dr {progress.total} langkah pencegahan telah diselesaikan
              </p>
            </div>
          </div>

          {/* Checklist Items Grid */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Langkah-Langkah Pencegahan DBD
            </h3>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  className={`bg-white rounded-lg shadow-md overflow-hidden border transition-all duration-300 ${
                    item.isCompleted ? 'border-green-500' : 'border-gray-200'
                  }`}
                >
                  <div className="p-6">
                    {/* Icon */}
                    <div className="flex justify-center mb-4">
                      {item.icon.startsWith('<svg') ? (
                        <div
                          className={`w-20 h-20 flex items-center justify-center transition-all duration-300 ${
                            item.isCompleted ? 'brightness-0 saturate-100 [filter:invert(43%)_sepia(96%)_saturate(458%)_hue-rotate(92deg)_brightness(96%)_contrast(86%)]' : ''
                          }`}
                          dangerouslySetInnerHTML={{ __html: item.icon }}
                        />
                      ) : (
                        <div className={`text-6xl transition-all duration-300 ${
                          item.isCompleted ? 'grayscale-0 brightness-110 [filter:hue-rotate(90deg)_saturate(150%)]' : ''
                        }`}>
                          {item.icon}
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <h4 className="font-semibold text-center text-gray-900 mb-3 min-h-[48px] flex items-center justify-center">
                      {item.title}
                    </h4>

                    {/* Description */}
                    <p className="text-sm text-gray-600 text-center mb-4 min-h-[60px]">
                      {item.description}
                    </p>

                    {/* Button */}
                    <button
                      onClick={() => handleChecklistChange(item.id)}
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                        item.isCompleted
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-red-800 text-white hover:bg-red-900'
                      }`}
                    >
                      {item.isCompleted ? '✓ Selesai' : 'Selesai'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Save Progress Button */}
          <div className="bg-white rounded-xl shadow-lg p-8 text-center mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Simpan Progress Mingguan
            </h3>
            <p className="text-gray-600 mb-6">
              Simpan progress Anda untuk melacak perkembangan pencegahan DBD dari minggu ke minggu
            </p>

            <button
              onClick={saveWeeklyProgress}
              disabled={saving}
              className="bg-red-800 text-white px-8 py-3 rounded-lg font-medium hover:bg-red-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Menyimpan...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Simpan Progress
                </>
              )}
            </button>

            {saveMessage && (
              <div className={`mt-4 p-3 rounded-lg ${saveMessage.includes('Gagal')
                  ? 'bg-red-100 text-red-700'
                  : 'bg-green-100 text-green-700'
                }`}>
                {saveMessage}
              </div>
            )}
          </div>

          {/* Tips Section */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-8 border border-red-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <span className="text-2xl">💡</span>
              Tips Pencegahan Efektif
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">🕐</span>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Waktu Terbaik</h4>
                  <p className="text-sm text-gray-700">Lakukan pencegahan setiap hari Minggu untuk hasil maksimal</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">👨‍👩‍👧‍👦</span>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Libatkan Keluarga</h4>
                  <p className="text-sm text-gray-700">Ajak anggota keluarga untuk melakukan pencegahan bersama</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">📱</span>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Pengingat</h4>
                  <p className="text-sm text-gray-700">Set alarm atau reminder untuk checklist mingguan</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">🎯</span>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Konsistensi</h4>
                  <p className="text-sm text-gray-700">Lakukan secara rutin untuk pencegahan yang efektif</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}