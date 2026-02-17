# VIRGINS Dating App - PRD

## Original Problem Statement
Build a faith-based dating app (VIRGINS) for marriage-minded Christians from an existing GitHub codebase. Adapt from React+TypeScript+Vite+Express to React+FastAPI+MongoDB on Emergent platform.

## Architecture
- **Frontend**: React 18 + Tailwind CSS + Firebase Auth (client-side)
- **Backend**: FastAPI (Python) + MongoDB (Motor async driver)
- **AI**: Emergent LLM (Gemini 2.5 Flash) for profile bio generation
- **Auth**: Firebase Authentication (email/password)
- **Database**: MongoDB (users, likes, matches collections)

## User Personas
1. **Marriage-Minded Christian Singles** (18-35) - Primary users seeking spouse
2. **Faith-Focused Community** - Values purity, traditional courtship
3. **Admin** - Manages community, reviews profiles

## Core Requirements (Static)
- Firebase Auth (real signup/login/logout/password reset)
- MongoDB data persistence (users, likes, matches)
- Covenant Algorithm matching (faith 35%, values 30%, intention 25%, lifestyle 10%)
- FREE "See Who Likes You" screen (key differentiator)
- AI-powered profile bio generation
- Premium branding: Navy #1A1A2E, Gold #D4A574

## What's Been Implemented (Jan 2026)
### Phase 1 - First Delivery ✅
- [x] Firebase Auth integration (signup, login, logout, password reset)
- [x] MongoDB backend with Motor (users, likes, matches collections)
- [x] 8 seeded mock users with realistic profiles
- [x] Covenant Algorithm scoring (faith, values, intention, lifestyle)
- [x] Likes system with mutual match detection
- [x] Matches system (auto-created on mutual like)
- [x] LikesScreen component (FREE "See Who Likes You")
- [x] AI bio generation endpoint (Gemini via Emergent LLM)
- [x] Full landing page (Hero, Features, CommunityGuidelines, AI Helper, Testimonials, Download)
- [x] Splash intro screen
- [x] Login/Signup with real Firebase Auth
- [x] Matchmaker/Discover feed connected to real backend
- [x] User profile page
- [x] Onboarding/Waitlist flow (multi-step)
- [x] NearbyMap (GPS radar)
- [x] DatePlanner (3-step courtship planner)
- [x] Admin Dashboard
- [x] Static pages (About, Careers, Press, Contact, Privacy, Terms, Cookies, Safety)
- [x] Product pages (How It Works, Pricing)

### Testing Results
- Backend: 91.7% tests passing (11/12)
- Frontend: 85% core functionality working
- All API endpoints functional
- Firebase Auth integrated

## Prioritized Backlog

### P0 - Next Delivery
- [ ] Real-time Chat with WebSockets
- [ ] Photo Upload to cloud storage
- [ ] Complete Onboarding Flow with photo step

### P1 - Future
- [ ] Push notifications
- [ ] Premium/Subscription with Stripe
- [ ] Profile verification flow (photo/ID/voice)
- [ ] Message persistence in MongoDB
- [ ] Typing indicators + read receipts

### P2 - Later
- [ ] React Native mobile app
- [ ] Email notifications (SendGrid)
- [ ] Analytics dashboard
- [ ] Advanced search/filter
- [ ] Video calling feature

## Next Tasks
1. Real-time Chat (WebSockets + MongoDB message storage)
2. Photo Upload (cloud storage integration)
3. Enhanced Onboarding with photo upload step
4. Push notifications for matches/messages
