import { useState, useEffect } from 'react'
import { useBlinkAuth } from '@blinkdotnew/react'
import { Toaster, toast } from 'react-hot-toast'
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
import MessagingUI from './components/MessagingUI'
import VerificationFlow from './components/VerificationFlow'
import PasswordResetPage from './components/PasswordResetPage'
import { connectSocket, disconnectSocket } from './lib/socket'
import { PageView } from './types'

function App() {
  const { user, isAuthenticated, isLoading } = useBlinkAuth()
  const [currentPage, setCurrentPage] = useState<PageView>('home')
  const [activeConversation, setActiveConversation] = useState<{
    conversationId: string;
    partner: any;
  } | null>(null)

  useEffect(() => {
    if (!isLoading && isAuthenticated && currentPage === 'home') {
      setCurrentPage('dashboard')
    }
  }, [isAuthenticated, isLoading])

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      const token = localStorage.getItem('virgins_access_token')
      if (token) {
        const socket = connectSocket(token)
        socket.on('new_match', () => {
          toast.success("It's a Covenant Match! 💛", {
            duration: 5000,
            style: {
              background: 'hsl(270 100% 25%)',
              color: 'hsl(36 30% 97%)',
              fontFamily: 'Playfair Display, serif',
              border: '1px solid hsl(42 55% 55%)'
            }
          })
        })
      }
    }
    return () => {
      if (!isAuthenticated) disconnectSocket()
    }
  }, [isAuthenticated, isLoading])


  // Stripe success / cancel detection
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const sessionId = params.get('session_id')
    const canceled = params.get('canceled')
    const page = params.get('page')
    if (page) setCurrentPage(page as PageView)
    if (sessionId) {
      toast.success('Payment successful! Welcome to Premium. 💛', { duration: 6000 })
      window.history.replaceState({}, '', window.location.pathname)
    }
    if (canceled) {
      toast('Checkout canceled. You can upgrade anytime.', { icon: 'ℹ️' })
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center" style={{ background: 'hsl(270 100% 10%)' }}>
        <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'hsl(42 55% 55%)', borderTopColor: 'transparent' }}></div>
      </div>
    )
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            <Hero onNavigate={(page) => setCurrentPage(page as PageView)} />
            <Features />
            <Testimonials />
          </>
        )
      case 'login':
        return <LoginPage onNavigate={(page) => setCurrentPage(page as PageView)} />
      case 'signup':
        return <SignupPage onNavigate={(page) => setCurrentPage(page as PageView)} />
      case 'onboarding':
        return <OnboardingFlow onNavigate={(page) => setCurrentPage(page as PageView)} />
      case 'dashboard':
      case 'matches':
      case 'matchmaker':
        return <MatchmakerDemo onNavigate={(page) => setCurrentPage(page as PageView)} />
      case 'messages':
        return activeConversation ? (
          <MessagingUI
            conversationId={activeConversation.conversationId}
            partner={activeConversation.partner}
            currentUserId={(user as any)?.id || (user as any)?._id || ''}
            onClose={() => { setCurrentPage('matches'); setActiveConversation(null); }}
          />
        ) : <MatchmakerDemo onNavigate={(page) => setCurrentPage(page as PageView)} />
      case 'verification':
        return (
          <VerificationFlow
            onClose={() => setCurrentPage('profile')}
            currentLevel={1}
            isPremium={(user as any)?.isPremium || false}
            onLevelUp={() => setCurrentPage('profile')}
          />
        )
      case 'profile':
        return <UserProfile onNavigate={(page) => setCurrentPage(page as PageView)} />
      case 'nearby':
        return <NearbyMap />
      case 'date-planner':
        return <DatePlanner onNavigate={(page) => setCurrentPage(page as PageView)} />
      case 'pricing':
        return <PricingPage onNavigate={(page) => setCurrentPage(page as PageView)} />
      case 'password-reset': {
        const params = new URLSearchParams(window.location.search)
        const token = params.get('token') || ''
        return <PasswordResetPage onNavigate={(page) => setCurrentPage(page as PageView)} token={token} />
      }
      default:
        return <Hero onNavigate={(page) => setCurrentPage(page as PageView)} />
    }
  }

  const hiddenFooterPages: PageView[] = [
    'onboarding', 'profile', 'nearby', 'date-planner', 'login', 'signup',
    'dashboard', 'matches', 'likes', 'matchmaker', 'messages', 'verification', 'password-reset'
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Toaster position="top-center" />
      <Header onNavigate={(page) => setCurrentPage(page as PageView)} currentPage={currentPage} />
      <main className="flex-1">
        {renderPage()}
      </main>
      {!hiddenFooterPages.includes(currentPage) && <Footer onNavigate={(page) => setCurrentPage(page as PageView)} />}
    </div>
  )
}

export default App
