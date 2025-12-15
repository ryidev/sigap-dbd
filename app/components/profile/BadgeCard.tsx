'use client'

import { Badge } from './types'

interface BadgeCardProps {
    badge: Badge
}

export default function BadgeCard({ badge }: BadgeCardProps) {
    const getCategoryGradient = (category: string) => {
        switch (category) {
            case 'consistency': return 'from-orange-100 via-orange-50 to-white'
            case 'completion': return 'from-green-100 via-green-50 to-white'
            case 'streak': return 'from-purple-100 via-purple-50 to-white'
            case 'milestone': return 'from-blue-100 via-blue-50 to-white'
            default: return 'from-gray-100 via-gray-50 to-white'
        }
    }

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'consistency': return 'text-orange-600 bg-orange-100'
            case 'completion': return 'text-green-600 bg-green-100'
            case 'streak': return 'text-purple-600 bg-purple-100'
            case 'milestone': return 'text-blue-600 bg-blue-100'
            default: return 'text-gray-600 bg-gray-100'
        }
    }

    return (
        <div
            className={`relative bg-gradient-to-b ${getCategoryGradient(badge.category)} rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-visible border border-gray-100 group`}
        >
            {/* Floating Badge Icon */}
            <div className="relative -mt-8 mb-4 flex justify-center">
                <div className={`relative w-24 h-24 rounded-full shadow-2xl flex items-center justify-center ${badge.isEarned
                        ? `bg-gradient-to-br ${badge.color}`
                        : 'bg-[#780606]'
                }`}>
                    <div className="text-5xl relative z-10">{badge.icon}</div>

                    {/* Earned Checkmark */}
                    {badge.isEarned && (
                        <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg border-2 border-white">
                            <span className="text-sm font-bold">✓</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Badge Content */}
            <div className="px-6 pb-6 pt-2">
                {/* Category Badge */}
                <div className="flex items-center justify-center mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getCategoryColor(badge.category)}`}>
                        {badge.category === 'consistency' && 'Konsistensi'}
                        {badge.category === 'completion' && 'Pencapaian'}
                        {badge.category === 'streak' && 'Streak'}
                        {badge.category === 'milestone' && 'Milestone'}
                    </span>
                </div>

                {/* Badge Name */}
                <h3 className="text-xl font-extrabold text-gray-900 mb-3 text-center">
                    {badge.name}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 text-center leading-relaxed">
                    {badge.description}
                </p>

                {/* Requirement */}
                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 mb-4 border border-gray-200">
                    <div className="text-xs text-gray-500 font-semibold mb-1">Syarat:</div>
                    <div className="text-sm text-gray-700 font-medium">{badge.requirement}</div>
                </div>

                {/* Progress Bar untuk badge yang belum earned */}
                {!badge.isEarned && badge.progress && (
                    <div className="mb-4">
                        <div className="flex justify-between text-xs font-semibold text-gray-600 mb-2">
                            <span>Progress</span>
                            <span className="text-[#780606]">{badge.progress.current}/{badge.progress.target}</span>
                        </div>
                        <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                            <div
                                className="absolute inset-y-0 left-0 bg-[#780606] rounded-full transition-all duration-500"
                                style={{ width: `${Math.min((badge.progress.current / badge.progress.target) * 100, 100)}%` }}
                            ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1 text-center">
                            {Math.round((badge.progress.current / badge.progress.target) * 100)}% tercapai
                        </div>
                    </div>
                )}

                {/* Status */}
                {badge.isEarned && badge.earnedAt ? (
                    <div className="bg-green-100 border border-green-300 rounded-xl p-3 text-center">
                        <div className="text-xs text-green-700 font-bold mb-1">Diraih</div>
                        <div className="text-xs text-green-600">
                            {new Date(badge.earnedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                    </div>
                ) : (
                    <div className="bg-gray-100 border border-gray-200 rounded-xl p-3 text-center">
                        <div className="text-xs text-gray-500 font-semibold">Belum Tercapai</div>
                    </div>
                )}
            </div>
        </div>
    )
}
