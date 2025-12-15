'use client'

import { useState } from 'react'
import BadgeCard from './BadgeCard'
import { Badge } from './types'

interface BadgeGridProps {
    badges: Badge[]
}

export default function BadgeGrid({ badges }: BadgeGridProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>('all')

    const filteredBadges = selectedCategory === 'all'
        ? badges
        : badges.filter(badge => badge.category === selectedCategory)

    return (
        <>
            {/* Badge Categories Filter dengan Modern Style */}
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <span className="text-4xl">🏅</span>
                    Koleksi Badges
                </h2>
                <div className="flex flex-wrap gap-3">
                    {[
                        { key: 'all', label: 'Semua', count: badges.length },
                        { key: 'consistency', label: 'Konsistensi', count: badges.filter(b => b.category === 'consistency').length },
                        { key: 'streak', label: 'Perfect Streak', count: badges.filter(b => b.category === 'streak').length },
                        { key: 'completion', label: 'Pencapaian', count: badges.filter(b => b.category === 'completion').length },
                        { key: 'milestone', label: 'Milestone', count: badges.filter(b => b.category === 'milestone').length }
                    ].map((category) => (
                        <button
                            key={category.key}
                            onClick={() => setSelectedCategory(category.key)}
                            className={`px-5 py-3 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-md ${selectedCategory === category.key
                                    ? 'bg-[#780606] text-white shadow-lg scale-105'
                                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-[#780606] hover:text-[#780606]'
                                }`}
                        >
                            {category.label} <span className="ml-1 opacity-75">({category.count})</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Badges Grid dengan space untuk floating badges */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-12">
                {filteredBadges.map((badge) => (
                    <BadgeCard
                        key={badge.id}
                        badge={badge}
                    />
                ))}
            </div>
        </>
    )
}
