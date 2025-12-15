'use client'

import { useEffect, useState } from 'react'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import { createClient } from '../utils/supabase/client'
import { User } from '@supabase/supabase-js'

// Import new home components
import HeroSection from './components/home/HeroSection'
import PreventionTipsSection from './components/home/PreventionTipsSection'
import MapSection from './components/home/MapSection'
import FeaturesSection from './components/home/FeaturesSection'
import CTASection from './components/home/CTASection'
import FAQCards from './components/home/FAQCards'
import FAQCardsMobile from './components/home/FAQCardsMobile'

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Get user auth state
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setIsLoading(false)
    }
    getUser()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  return (
    <div>
      <Navbar active="home" />

      {/* Hero Section */}
      <HeroSection user={user} isLoading={isLoading} />

      {/* FAQ Cards Section - Responsive */}
      <div className="hidden md:block">
        <FAQCards />
      </div>
      <div className="block md:hidden">
        <FAQCardsMobile />
      </div>

      {/* Quick Tips Cards Section */}
      <PreventionTipsSection />

      {/* Peta Sebaran DBD Section */}
      <MapSection />

      {/* Section: Features */}
      <FeaturesSection />

      {/* Section: CTA */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </div>
  )
}
