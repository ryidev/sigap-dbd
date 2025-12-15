// Shared types for profile components

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  color: string
  category: 'consistency' | 'completion' | 'streak' | 'milestone'
  requirement: string
  isEarned: boolean
  earnedAt?: string
  progress?: {
    current: number
    target: number
  }
}

export interface UserProfile {
  totalWeeks: number
  perfectWeeks: number
  currentStreak: number
  longestStreak: number
  averageCompletion: number
  totalBadges: number
  lastActivity: string
}
