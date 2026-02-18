# VIRGINS Dating App - PRD

## Original Problem Statement
Build a faith-based dating app (VIRGINS) for marriage-minded Christians from an existing GitHub repo. Adapt from React+TypeScript+Vite+Express to React+FastAPI+MongoDB on Emergent platform.

## Architecture
- **Frontend**: React 18 + Tailwind CSS + @vis.gl/react-google-maps
- **Backend**: FastAPI (Python) + MongoDB (Motor async driver)
- **AI**: Emergent LLM (Gemini 2.5 Flash) for profile bio generation
- **Auth**: Dual system - Firebase Auth primary, Backend JWT fallback
- **Database**: MongoDB (users, likes, matches, payment_transactions collections)
- **Storage**: Firebase Storage for photo uploads
- **Payments**: Stripe via emergentintegrations
- **Maps**: Google Maps JavaScript API + Google Places API

## User Personas
1. **Marriage-Minded Christian Singles** (18-35) - Primary users seeking spouse
2. **Faith-Focused Community** - Values purity, traditional courtship
3. **Premium Members** - Access to enhanced features
4. **Admin** - Manages community, reviews profiles

## Core Requirements (Static)
- Real authentication (dual Firebase + JWT fallback)
- MongoDB data persistence (users, likes, matches, payments)
- Covenant Algorithm matching (faith 35%, values 30%, intention 25%, lifestyle 10%)
- FREE "See Who Likes You" screen (key differentiator)
- AI-powered profile bio generation
- Bumble-style progressive onboarding
- Premium branding: Navy #1A1A2E, Gold #D4A574

## What's Been Implemented

### Phase 1 - Core MVP ✅
- [x] Backend auth (bcrypt + JWT) with Firebase fallback
- [x] MongoDB backend with Motor (users, likes, matches, payments collections)
- [x] 8 seeded mock users with realistic profiles + coordinates
- [x] Covenant Algorithm scoring (faith, values, intention, lifestyle)
- [x] Likes system with mutual match detection
- [x] Matches system (auto-created on mutual like)
- [x] LikesScreen component (FREE "See Who Likes You")
- [x] AI bio generation endpoint (Gemini via Emergent LLM)
- [x] Full landing page with all sections
- [x] Login/Signup with dual auth system

### Phase 2 - Bumble-Style Improvements ✅
- [x] 7-step progressive onboarding
- [x] Enhanced profile editing (Bumble-style)
- [x] Circular navigation buttons

### Phase 3 - Advanced Features (Feb 17, 2026) ✅
- [x] **Real GPS Nearby Map**
  - Browser Geolocation API for user location
  - Google Maps JavaScript API integration
  - @vis.gl/react-google-maps library
  - Custom user markers with profile photos
  - Ghost/Incognito mode toggle
  - Real-time distance calculation (Haversine formula)
  - MongoDB 2dsphere index for geospatial queries
  - `/api/users/nearby` - Find users near coordinates
  - `/api/users/me/location` - Update user location

- [x] **Google Places API Integration**
  - `/api/venues/nearby` - Search nearby venues
  - Filter by type: restaurants, cafes, parks, churches
  - Rating and address display
  - Fallback to mock venues if API fails

- [x] **Firebase Storage Photo Upload**
  - `uploadPhoto()` function with progress tracking
  - `compressImage()` for image optimization
  - `deletePhoto()` for cleanup
  - PhotoUploader component (grid, 6 photo max)
  - SinglePhotoUploader for profile image
  - Auto-update profile image in backend

- [x] **Stripe Membership System**
  - 3 pricing tiers:
    - Monthly: $9.99/month
    - Annual: $79.99/year (33% savings)
    - Lifetime: $199.99 one-time
  - Stripe Checkout integration
  - Webhook handling for payment events
  - `/api/payments/packages` - Get pricing
  - `/api/payments/create-checkout` - Create session
  - `/api/payments/status/{session_id}` - Check payment
  - `/api/webhook/stripe` - Handle webhooks

- [x] **Account Management**
  - `/api/account/membership` - Get subscription status
  - `/api/account/cancel-membership` - Cancel premium
  - `/api/account/delete` - Delete account permanently
  - MembershipPage with cancel/delete modals

- [x] **Enhanced Date Planner** (Mix Approach)
  - **AI Suggestions**: Personalized date ideas with conversation starters
  - **Community Events**: Group activities for faith-centered singles
  - **Browse Venues**: Real Google Places search
  - 4-step flow: Mode → Select → Schedule → Confirm
  - Match invitation system

### Testing Results
- Backend: 100% API tests passing
- All new endpoints verified:
  - GET /api/payments/packages ✅
  - POST /api/payments/create-checkout ✅
  - GET /api/account/membership ✅
  - POST /api/users/nearby ✅
  - GET /api/venues/nearby ✅

## API Keys Required
- `REACT_APP_GOOGLE_MAPS_API_KEY` - Google Maps (frontend)
- `GOOGLE_MAPS_API_KEY` - Google Places (backend)
- `STRIPE_API_KEY` - Stripe payments (backend)
- Firebase config - Auth + Storage

## Mocked/Placeholder Features
- Community Events in DatePlanner are static mock data
- Google Places fallback to mock venues if API fails
- Chat functionality not yet implemented

## Prioritized Backlog

### P0 - Next Delivery
- [ ] Real-time Chat with WebSockets
- [ ] Push notifications
- [ ] Profile verification flow

### P1 - Future
- [ ] Message persistence in MongoDB
- [ ] Typing indicators + read receipts
- [ ] Email notifications (SendGrid)
- [ ] Community Events backend API

### P2 - Later
- [ ] React Native mobile app
- [ ] Daily Devotional Match feature
- [ ] Analytics dashboard
- [ ] Advanced search/filter
