'use client'

import { User } from '@supabase/supabase-js'

interface ProfileHeaderProps {
    user: User
    userProfile: any
}

export default function ProfileHeader({ user, userProfile }: ProfileHeaderProps) {
    return (
        <div className="relative bg-[#780606] overflow-hidden">
            {/* Abstract Pattern Background */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
                <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                            <circle cx="2" cy="2" r="1" fill="white" opacity="0.3"/>
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#dots)" />
                </svg>
            </div>

            <div className="relative max-w-6xl mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    {/* Avatar dengan Ring Border Tebal */}
                    <div className="relative">
                        <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-4xl font-bold text-white ring-4 ring-white/30 shadow-xl">
                            {userProfile?.full_name?.[0]?.toUpperCase() ||
                                user?.user_metadata?.full_name?.[0]?.toUpperCase() ||
                                user?.user_metadata?.name?.[0]?.toUpperCase() ||
                                user.email?.[0]?.toUpperCase() || 'U'}
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">
                            {userProfile?.full_name ||
                                user?.user_metadata?.full_name ||
                                user?.user_metadata?.name ||
                                user.email?.split('@')[0] ||
                                'User'}
                        </h1>
                        <p className="text-red-50 mb-1">
                            {user.email}
                        </p>
                        <p className="text-red-100 text-sm">
                            Bergabung sejak: {new Date(user.created_at || '').toLocaleDateString('id-ID')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
