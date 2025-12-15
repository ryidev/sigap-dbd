'use client'

import { useState, useEffect } from 'react'
import { createClient } from '../../utils/supabase/client'
import { User } from '@supabase/supabase-js'
import Navbar from '../components/Navbar'
import Link from 'next/link'
import ProfileHeader from '../components/profile/ProfileHeader'
import StatsGrid from '../components/profile/StatsGrid'
import BadgeGrid from '../components/profile/BadgeGrid'
import CTASection from '../components/profile/CTASection'
import { Badge, UserProfile } from '../components/profile/types'

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [badges, setBadges] = useState<Badge[]>([])
  const [stats, setStats] = useState<UserProfile | null>(null)
  const supabase = createClient()

  // Definisi semua badges yang tersedia
  const allBadges: Badge[] = [
    // Consistency Badges
    {
      id: 'first_week',
      name: 'Langkah Pertama',
      description: 'Menyelesaikan checklist pencegahan untuk pertama kali',
      icon: '🌱',
      color: 'from-green-400 to-green-600',
      category: 'milestone',
      requirement: '1 minggu aktivitas',
      isEarned: false
    },
    {
      id: 'consistent_3_weeks',
      name: 'Konsisten',
      description: 'Menyelesaikan checklist 3 minggu berturut-turut (minimal 50%)',
      icon: '🔥',
      color: 'from-orange-400 to-orange-600',
      category: 'consistency',
      requirement: '3 minggu berturut-turut ≥50%',
      isEarned: false
    },
    {
      id: 'consistent_5_weeks',
      name: 'Tekun',
      description: 'Menyelesaikan checklist 5 minggu berturut-turut (minimal 50%)',
      icon: '⚡',
      color: 'from-yellow-400 to-yellow-600',
      category: 'consistency',
      requirement: '5 minggu berturut-turut ≥50%',
      isEarned: false
    },
    {
      id: 'consistent_10_weeks',
      name: 'Dedikasi Tinggi',
      description: 'Menyelesaikan checklist 10 minggu berturut-turut (minimal 50%)',
      icon: '💎',
      color: 'from-blue-400 to-blue-600',
      category: 'consistency',
      requirement: '10 minggu berturut-turut ≥50%',
      isEarned: false
    },

    // Perfect Completion Streaks
    {
      id: 'perfect_3_weeks',
      name: 'Perfeksionis',
      description: '3 minggu berturut-turut dengan completion 100%',
      icon: '✨',
      color: 'from-purple-400 to-purple-600',
      category: 'streak',
      requirement: '3 minggu 100% berturut-turut',
      isEarned: false
    },
    {
      id: 'perfect_5_weeks',
      name: 'Master Pencegahan',
      description: '5 minggu berturut-turut dengan completion 100%',
      icon: '👑',
      color: 'from-yellow-400 to-yellow-600',
      category: 'streak',
      requirement: '5 minggu 100% berturut-turut',
      isEarned: false
    },
    {
      id: 'perfect_10_weeks',
      name: 'Legend',
      description: '10 minggu berturut-turut dengan completion 100%',
      icon: '🏆',
      color: 'from-gradient-to-r from-yellow-400 via-red-500 to-pink-500',
      category: 'streak',
      requirement: '10 minggu 100% berturut-turut',
      isEarned: false
    },

    // Completion Milestones
    {
      id: 'total_10_weeks',
      name: 'Veteran',
      description: 'Total 10 minggu melakukan checklist pencegahan',
      icon: '🎖️',
      color: 'from-indigo-400 to-indigo-600',
      category: 'milestone',
      requirement: '10 minggu total aktivitas',
      isEarned: false
    },
    {
      id: 'total_25_weeks',
      name: 'Pahlawan Kesehatan',
      description: 'Total 25 minggu melakukan checklist pencegahan',
      icon: '🦸‍♂️',
      color: 'from-red-400 to-red-600',
      category: 'milestone',
      requirement: '25 minggu total aktivitas',
      isEarned: false
    },
    {
      id: 'average_80_percent',
      name: 'High Achiever',
      description: 'Rata-rata completion ≥80% selama minimal 5 minggu',
      icon: '📈',
      color: 'from-teal-400 to-teal-600',
      category: 'completion',
      requirement: 'Rata-rata ≥80% (min 5 minggu)',
      isEarned: false
    },
    {
      id: 'monthly_champion',
      name: 'Juara Bulanan',
      description: 'Completion rate 100% selama 1 bulan penuh',
      icon: '🌟',
      color: 'from-pink-400 to-pink-600',
      category: 'completion',
      requirement: '4 minggu 100% dalam 1 bulan',
      isEarned: false
    }
  ]

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        await Promise.all([
          loadUserProfile(user.id),
          calculateUserStats(user.id),
          checkEarnedBadges(user.id)
        ])
      }
      setLoading(false)
    }
    getUser()
  }, [])

  const loadUserProfile = async (userId: string) => {
    try {
      console.log('Loading profile for user:', userId)

      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Profile query error:', error)

        // If profile doesn't exist, try to create one
        if (error.code === 'PGRST116') {
          console.log('Profile not found, creating new profile...')
          await createUserProfile(userId)
          return
        }
      }

      console.log('Profile loaded:', profile)
      setUserProfile(profile)

    } catch (error) {
      console.error('Error loading user profile:', error)
      // Try to create profile if it doesn't exist
      await createUserProfile(userId)
    }
  }

  const createUserProfile = async (userId: string) => {
    try {
      console.log('Creating profile for user:', userId)

      // Get user metadata from auth
      const { data: { user: authUser } } = await supabase.auth.getUser()

      const profileData = {
        id: userId,
        full_name: authUser?.user_metadata?.full_name ||
          authUser?.user_metadata?.name ||
          authUser?.email?.split('@')[0] ||
          'User',
        avatar_url: authUser?.user_metadata?.avatar_url || null
      }

      const { data: newProfile, error } = await supabase
        .from('user_profiles')
        .insert([profileData])
        .select()
        .single()

      if (error) {
        console.error('Error creating profile:', error)
      } else {
        console.log('Profile created successfully:', newProfile)
        setUserProfile(newProfile)
      }

    } catch (error) {
      console.error('Error in createUserProfile:', error)
    }
  }

  const calculateUserStats = async (userId: string) => {
    try {
      // Get all weekly progress records
      const { data: weeklyRecords } = await supabase
        .from('weekly_prevention_progress')
        .select('*')
        .eq('user_id', userId)
        .order('week_start', { ascending: true })

      if (!weeklyRecords || weeklyRecords.length === 0) {
        setStats({
          totalWeeks: 0,
          perfectWeeks: 0,
          currentStreak: 0,
          longestStreak: 0,
          averageCompletion: 0,
          totalBadges: 0,
          lastActivity: 'Belum ada aktivitas'
        })
        return
      }

      // Calculate statistics
      const totalWeeks = weeklyRecords.length
      const perfectWeeks = weeklyRecords.filter(record => record.completion_percentage === 100).length
      const averageCompletion = Math.round(
        weeklyRecords.reduce((sum, record) => sum + record.completion_percentage, 0) / totalWeeks
      )

      // Calculate current and longest streak
      const { currentStreak, longestStreak } = calculateStreaks(weeklyRecords)

      // Get earned badges count
      const { count: badgeCount } = await supabase
        .from('user_achievements')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)

      setStats({
        totalWeeks,
        perfectWeeks,
        currentStreak,
        longestStreak,
        averageCompletion,
        totalBadges: badgeCount || 0,
        lastActivity: weeklyRecords[weeklyRecords.length - 1]?.week_start || 'Tidak diketahui'
      })

    } catch (error) {
      console.error('Error calculating stats:', error)
    }
  }

  const calculateStreaks = (records: any[]) => {
    let currentStreak = 0
    let longestStreak = 0
    let tempStreak = 0

    // Sort by week_start descending to calculate current streak
    const sortedRecords = [...records].sort((a, b) =>
      new Date(b.week_start).getTime() - new Date(a.week_start).getTime()
    )

    // Calculate current streak (from most recent)
    for (const record of sortedRecords) {
      if (record.completion_percentage >= 50) {
        currentStreak++
      } else {
        break
      }
    }

    // Calculate longest streak
    const sortedForLongest = [...records].sort((a, b) =>
      new Date(a.week_start).getTime() - new Date(b.week_start).getTime()
    )

    for (const record of sortedForLongest) {
      if (record.completion_percentage >= 50) {
        tempStreak++
        longestStreak = Math.max(longestStreak, tempStreak)
      } else {
        tempStreak = 0
      }
    }

    return { currentStreak, longestStreak }
  }

  const checkEarnedBadges = async (userId: string) => {
    try {
      const { data: weeklyRecords } = await supabase
        .from('weekly_prevention_progress')
        .select('*')
        .eq('user_id', userId)
        .order('week_start', { ascending: true })

      const updatedBadges = allBadges.map(badge => {
        const earnedBadge = { ...badge }

        if (!weeklyRecords || weeklyRecords.length === 0) {
          return earnedBadge
        }

        switch (badge.id) {
          case 'first_week':
            earnedBadge.isEarned = weeklyRecords.length >= 1
            if (earnedBadge.isEarned) {
              earnedBadge.earnedAt = weeklyRecords[0].week_start
            }
            break

          case 'consistent_3_weeks':
          case 'consistent_5_weeks':
          case 'consistent_10_weeks':
            const targetWeeks = parseInt(badge.id.split('_')[1])
            const { longestStreak } = calculateStreaks(weeklyRecords)
            earnedBadge.isEarned = longestStreak >= targetWeeks
            earnedBadge.progress = {
              current: Math.min(longestStreak, targetWeeks),
              target: targetWeeks
            }
            break

          case 'perfect_3_weeks':
          case 'perfect_5_weeks':
          case 'perfect_10_weeks':
            const perfectTarget = parseInt(badge.id.split('_')[1])
            const perfectStreak = calculatePerfectStreak(weeklyRecords)
            earnedBadge.isEarned = perfectStreak >= perfectTarget
            earnedBadge.progress = {
              current: Math.min(perfectStreak, perfectTarget),
              target: perfectTarget
            }
            break

          case 'total_10_weeks':
          case 'total_25_weeks':
            const totalTarget = parseInt(badge.id.split('_')[1])
            earnedBadge.isEarned = weeklyRecords.length >= totalTarget
            earnedBadge.progress = {
              current: Math.min(weeklyRecords.length, totalTarget),
              target: totalTarget
            }
            break

          case 'average_80_percent':
            if (weeklyRecords.length >= 5) {
              const average = weeklyRecords.reduce((sum, record) => sum + record.completion_percentage, 0) / weeklyRecords.length
              earnedBadge.isEarned = average >= 80
              earnedBadge.progress = {
                current: Math.min(Math.round(average), 80),
                target: 80
              }
            }
            break

          case 'monthly_champion':
            earnedBadge.isEarned = checkMonthlyChampion(weeklyRecords)
            break
        }

        return earnedBadge
      })

      setBadges(updatedBadges)

      // Simpan badges yang baru earned ke database
      await saveEarnedBadgesToDatabase(userId, updatedBadges)

      // Update stats setelah badges disimpan
      await updateBadgeCount(userId)
    } catch (error) {
      console.error('Error checking badges:', error)
    }
  }

  const saveEarnedBadgesToDatabase = async (userId: string, badges: Badge[]) => {
    try {
      // Get existing achievements from database
      const { data: existingAchievements } = await supabase
        .from('user_achievements')
        .select('badge_id')
        .eq('user_id', userId)

      const existingIds = new Set(existingAchievements?.map(a => a.badge_id) || [])

      // Filter badges yang earned tapi belum ada di database
      const newEarnedBadges = badges.filter(badge =>
        badge.isEarned && !existingIds.has(badge.id)
      )

      // Insert new achievements
      if (newEarnedBadges.length > 0) {
        const achievementsToInsert = newEarnedBadges.map(badge => ({
          user_id: userId,
          badge_id: badge.id,
          earned_at: badge.earnedAt || new Date().toISOString()
        }))

        const { error } = await supabase
          .from('user_achievements')
          .insert(achievementsToInsert)

        if (error) {
          console.error('Error inserting achievements:', error)
        } else {
          console.log(`Saved ${newEarnedBadges.length} new achievements to database`)
        }
      }
    } catch (error) {
      console.error('Error saving badges to database:', error)
    }
  }

  const updateBadgeCount = async (userId: string) => {
    try {
      const { count: badgeCount } = await supabase
        .from('user_achievements')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)

      if (stats) {
        setStats({
          ...stats,
          totalBadges: badgeCount || 0
        })
      }
    } catch (error) {
      console.error('Error updating badge count:', error)
    }
  }

  const calculatePerfectStreak = (records: any[]) => {
    let longestPerfectStreak = 0
    let tempStreak = 0

    const sortedRecords = [...records].sort((a, b) =>
      new Date(a.week_start).getTime() - new Date(b.week_start).getTime()
    )

    for (const record of sortedRecords) {
      if (record.completion_percentage === 100) {
        tempStreak++
        longestPerfectStreak = Math.max(longestPerfectStreak, tempStreak)
      } else {
        tempStreak = 0
      }
    }

    return longestPerfectStreak
  }

  const checkMonthlyChampion = (records: any[]) => {
    // Group records by month and check if any month has 4 consecutive weeks with 100%
    const monthGroups: { [key: string]: any[] } = {}

    records.forEach(record => {
      const monthKey = record.week_start.substring(0, 7) // YYYY-MM
      if (!monthGroups[monthKey]) {
        monthGroups[monthKey] = []
      }
      monthGroups[monthKey].push(record)
    })

    for (const month in monthGroups) {
      const monthRecords = monthGroups[month]
      if (monthRecords.length >= 4) {
        const perfectWeeks = monthRecords.filter(record => record.completion_percentage === 100)
        if (perfectWeeks.length >= 4) {
          return true
        }
      }
    }

    return false
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar active="profile" />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar active="profile" />
        <div className="pt-20">
          <div className="max-w-2xl mx-auto px-4 py-16 text-center">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-6xl mb-6">🔒</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Login Diperlukan
              </h1>
              <p className="text-gray-600 mb-8">
                Halaman profile dan badges hanya tersedia untuk pengguna yang sudah login.
              </p>
              <Link
                href="/login"
                className="bg-red-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-800 transition-colors"
              >
                Masuk Sekarang
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar active="profile" />

      <div className="pt-20">
        {/* Header */}
        <ProfileHeader user={user} userProfile={userProfile} />

        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Statistics Cards */}
          <StatsGrid stats={stats} />

          {/* Badges Grid with Filters */}
          <BadgeGrid badges={badges} />

          {/* Call to Action */}
          <CTASection />
        </div>
      </div>
    </div>
  )
}
