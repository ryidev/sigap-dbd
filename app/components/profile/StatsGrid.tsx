'use client'

import { UserProfile } from './types'

interface StatsGridProps {
    stats: UserProfile | null
}

export default function StatsGrid({ stats }: StatsGridProps) {
    const statCards = [
        {
            value: stats?.totalWeeks || 0,
            label: 'Total Minggu',
            icon: '📅'
        },
        {
            value: stats?.perfectWeeks || 0,
            label: 'Minggu Sempurna',
            icon: '⭐'
        },
        {
            value: stats?.currentStreak || 0,
            label: 'Streak Saat Ini',
            icon: '🔥'
        },
        {
            value: stats?.totalBadges || 0,
            label: 'Total Badges',
            icon: '🏆'
        }
    ]

    return (
        <>
            {/* Statistics Cards - Layout Horizontal seperti Screenshot */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {statCards.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-5 flex items-center gap-4 border border-gray-100"
                    >
                        {/* Icon Circle */}
                        <div className="w-14 h-14 bg-[#780606] rounded-full flex items-center justify-center text-2xl flex-shrink-0 shadow-md">
                            {stat.icon}
                        </div>

                        {/* Stats */}
                        <div className="flex-1">
                            <div className="text-3xl font-extrabold text-gray-900">
                                {stat.value}
                            </div>
                            <div className="text-xs text-gray-600 font-medium leading-tight">
                                {stat.label}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Statistik Pencegahan - Clean Design seperti Screenshot */}
            <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Statistik Pencegahan</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Rata-rata Completion */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Rata-rata Completion</h3>
                        <div className="mb-3">
                            <div className="text-2xl font-bold text-gray-900 mb-2">
                                {stats?.averageCompletion || 0}%
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                    className="bg-[#780606] h-2.5 rounded-full transition-all duration-500"
                                    style={{ width: `${stats?.averageCompletion || 0}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Streak Terpanjang */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Streak Terpanjang</h3>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-extrabold text-[#780606]">
                                {stats?.longestStreak || 0}
                            </span>
                            <span className="text-sm text-gray-600">minggu berturut-turut</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
