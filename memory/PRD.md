# VIRGINS Dating App - PRD

## Original Problem Statement
Build a faith-based dating app (VIRGINS) for marriage-minded Christians from an existing GitHub repo. Adapt from React+TypeScript+Vite+Express to React+FastAPI+MongoDB on Emergent platform.

## Architecture
- **Frontend**: React 18 + Tailwind CSS
- **Backend**: FastAPI (Python) + MongoDB (Motor async driver)
- **AI**: Emergent LLM (Gemini 2.5 Flash) for profile bio generation
- **Auth**: Backend-based (bcrypt password hashing + JWT tokens)
- **Database**: MongoDB (users, likes, matches collections)

## User Personas
1. **Marriage-Minded Christian Singles** (18-35) - Primary users seeking spouse
2. **Faith-Focused Community** - Values purity, traditional courtship
3. **Admin** - Manages community, reviews profiles

## Core Requirements (Static)
- Real authentication (signup/login/logout with password hashing)
- MongoDB data persistence (users, likes, matches)
- Covenant Algorithm matching (faith 35%, values 30%, intention 25%, lifestyle 10%)
- FREE "See Who Likes You" screen (key differentiator)
- AI-powered profile bio generation
- Bumble-style progressive onboarding
- Premium branding: Navy #1A1A2E, Gold #D4A574

## What's Been Implemented

### Phase 1 - Core MVP (Jan 17, 2026) ✅
- [x] Backend auth (bcrypt + JWT) - signup, login, duplicate protection, session persistence
- [x] MongoDB backend with Motor (users, likes, matches collections)
- [x] 8 seeded mock users with realistic profiles
- [x] Covenant Algorithm scoring (faith, values, intention, lifestyle)
- [x] Likes system with mutual match detection
- [x] Matches system (auto-created on mutual like)
- [x] LikesScreen component (FREE "See Who Likes You")
- [x] AI bio generation endpoint (Gemini via Emergent LLM)
- [x] Full landing page (Hero, Features, CommunityGuidelines, AI Helper, Testimonials, Download)
- [x] Splash intro screen
- [x] Login/Signup with real backend auth
- [x] Matchmaker/Discover feed connected to real backend
- [x] NearbyMap (GPS radar)
- [x] DatePlanner (3-step courtship planner)
- [x] Admin Dashboard
- [x] Static pages (About, Careers, Press, Contact, Privacy, Terms, Cookies, Safety)
- [x] Product pages (How It Works, Pricing)

### Phase 2 - Bumble-Style Improvements (Jan 17, 2026) ✅
- [x] 7-step progressive onboarding (one question per full-screen card)
  - Step 1: Gender selection + "Show on profile" toggle
  - Step 2: Age + Location
  - Step 3: Denomination grid + Faith level
  - Step 4: Intention (Marriage ASAP, etc.)
  - Step 5: Values selection (up to 5)
  - Step 6: Bio + Work/Education/Height/Exercise
  - Step 7: Summary + Start Matching
- [x] Enhanced profile editing (Bumble-style)
  - Bio with 500 char limit
  - Work, Education, Location, Hometown, Height, Exercise fields
  - Inline edit mode with Cancel/Save
- [x] Profile view with all user details
- [x] Circular next button (Bumble-style) in onboarding
- [x] Progress bar in onboarding

### Testing Results
- Backend: 100% tests passing
- Frontend: All core flows verified (signup → onboarding → login → discover → likes → profile edit)

## Prioritized Backlog

### P0 - Next Delivery
- [ ] Real-time Chat with WebSockets
- [ ] Photo Upload to cloud storage
- [ ] Phone number verification (as shown in Bumble reference)

### P1 - Future
- [ ] Push notifications permission screen
- [ ] Premium/Subscription with Stripe
- [ ] Profile verification flow (photo/ID/voice)
- [ ] Message persistence in MongoDB
- [ ] Typing indicators + read receipts

### P2 - Later
- [ ] React Native mobile app
- [ ] Email notifications (SendGrid)
- [ ] Daily Devotional Match feature
- [ ] Analytics dashboard
- [ ] Advanced search/filter
