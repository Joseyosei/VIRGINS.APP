import { useState, useEffect } from 'react'
import { useBlinkAuth } from '@blinkdotnew/react'
import { blink } from './lib/blink'
import Hero from './components/Hero'
import Header from './components/Header'
import Footer from './components/Footer'
import Features from './components/Features'
import Testimonials from './components/Testimonials'
import OnboardingFlow from './components/OnboardingFlow'
import MatchmakerDemo from './components/MatchmakerDemo'
import UserProfile from './components/UserProfile'
import LoginPage from './components/LoginPage'
import SignupPage from './components/SignupPage'
import NearbyMap from './components/NearbyMap'
import DatePlanner from './components/DatePlanner'
import PricingPage from './components/PricingPage'
import { PageView } from './types'

function App() {
  const { user, isAuthenticated, isLoading } = useBlinkAuth()
  const [currentPage, setCurrentPage] = useState<PageView>('home')

  useEffect(() => {
    if (!isLoading && isAuthenticated && currentPage === 'home') {
      setCurrentPage('dashboard')
    }
  }, [isAuthenticated, isLoading])

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-primary">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            <Hero onNavigate={(page) => setCurrentPage(page)} />
            <Features />
            <Testimonials />
          </>
        )
      case 'login':
        return <LoginPage onNavigate={(page) => setCurrentPage(page)} />
      case 'signup':
        return <SignupPage onNavigate={(page) => setCurrentPage(page)} />
      case 'onboarding':
        return <OnboardingFlow onNavigate={(page) => setCurrentPage(page)} />
      case 'dashboard':
      case 'matches':
      case 'matchmaker':
        return <MatchmakerDemo onNavigate={(page) => setCurrentPage(page)} />
      case 'profile':
        return <UserProfile onNavigate={(page) => setCurrentPage(page)} />
      case 'nearby':
        return <NearbyMap />
      case 'date-planner':
        return <DatePlanner onNavigate={(page) => setCurrentPage(page)} />
      case 'pricing':
        return <PricingPage onNavigate={(page) => setCurrentPage(page)} />
      default:
        return <Hero onNavigate={(page) => setCurrentPage(page)} />
    }
  }

  const hiddenFooterPages: PageView[] = ['onboarding', 'profile', 'nearby', 'date-planner', 'login', 'signup', 'dashboard', 'matches', 'likes', 'matchmaker'];

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Header onNavigate={(page) => setCurrentPage(page)} currentPage={currentPage} />
      <main className="flex-1">
        {renderPage()}
      </main>
      {!hiddenFooterPages.includes(currentPage) && <Footer onNavigate={(page) => setCurrentPage(page)} />}
    </div>
  )
}

export default App