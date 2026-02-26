# VIRGINS.APP — Master Build Plan
> "Love Worth Waiting For" — A Premium, Faith-Based Dating Platform

---

## VISION

VIRGINS.APP is the world's first **premium, multi-platform dating app** built exclusively
for people who are committed to saving intimacy for marriage. It will surpass Hinge,
Bumble, eHarmony, and all faith-based competitors by combining:

- The **elegance** of a luxury brand
- The **depth** of a real compatibility system
- The **safety** of a tiered trust/verification framework
- The **intelligence** of AI-powered matchmaking and coaching
- The **authenticity** of short video introductions

---

## PLATFORM TARGETS

| Platform | Technology | Status |
|----------|-----------|--------|
| Web App | React 18 + TypeScript + Vite | Partially built — needs redesign |
| iOS | Native Swift (SwiftUI) | To be built |
| Android | Native Kotlin (Jetpack Compose) | To be built |
| Backend API | Node.js + Express + TypeScript | Partially built — needs expansion |
| Database | MongoDB + Mongoose | Partially built |
| Real-time | Socket.io | To be integrated |

---

## DESIGN SYSTEM

**Aesthetic: Premium & Elegant**

| Element | Value |
|---------|-------|
| Primary | Deep Purple `#4B0082` |
| Secondary | Royal Gold `#C9A84C` |
| Accent | Soft White `#FAF7F2` |
| Background Dark | `#1A0033` |
| Background Light | `#F9F5FF` |
| Text Primary | `#1A0033` |
| Text Muted | `#7B6A8D` |
| Success | `#2D7A4F` |
| Error | `#B91C1C` |

**Typography**
- Headings: Playfair Display (serif, luxury feel)
- Body: Inter (clean, readable)
- Accent/Labels: Cormorant Garamond

**Motion**
- Framer Motion (web), SwiftUI animations (iOS), Compose animations (Android)
- Subtle fade-ins, elegant transitions — no aggressive swipe-heavy UX

---

## ARCHITECTURE

```
VIRGINS.APP/
├── web/                        ← React 18 + TypeScript (redesigned)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── store/              ← Zustand state management
│   │   ├── services/           ← API client layer
│   │   └── design-system/      ← Shared UI tokens, components
│   └── ...
│
├── ios/                        ← Native Swift (SwiftUI)
│   └── Virgins/
│       ├── App/
│       ├── Features/
│       │   ├── Auth/
│       │   ├── Onboarding/
│       │   ├── Discovery/
│       │   ├── Messaging/
│       │   ├── Profile/
│       │   ├── VideoIntro/
│       │   └── Premium/
│       ├── Core/               ← Networking, Storage, DI
│       └── DesignSystem/
│
├── android/                    ← Native Kotlin (Jetpack Compose)
│   └── app/
│       ├── src/main/kotlin/com/virgins/dating/
│       │   ├── ui/
│       │   │   ├── auth/
│       │   │   ├── onboarding/
│       │   │   ├── discovery/
│       │   │   ├── messaging/
│       │   │   ├── profile/
│       │   │   └── premium/
│       │   ├── data/
│       │   ├── domain/
│       │   └── core/
│       └── ...
│
├── server/                     ← Node.js + Express + TypeScript (primary API)
│   └── src/
│       ├── controllers/
│       ├── models/
│       ├── routes/
│       ├── services/
│       │   ├── ai/             ← Gemini AI integrations
│       │   ├── matching/       ← Covenant Algorithm
│       │   ├── verification/   ← Trust level system
│       │   ├── messaging/      ← Socket.io chat
│       │   ├── media/          ← S3 video/image uploads
│       │   ├── payments/       ← Stripe
│       │   └── notifications/  ← Push notifications
│       ├── middleware/
│       ├── socket/             ← Real-time handlers
│       └── utils/
│
└── shared/                     ← Shared TypeScript types
    └── types/
```

---

## FEATURE ROADMAP

### PHASE 1 — Foundation (Web + Backend)

#### 1.1 Design System & Web Redesign
- [ ] Implement new Premium & Elegant design tokens (purple/gold/white)
- [ ] Redesign all existing web components with new aesthetic
- [ ] Build reusable component library: Button, Card, Input, Badge, Avatar, Modal
- [ ] Implement Playfair Display + Inter typography system
- [ ] Framer Motion page transitions and microanimations

#### 1.2 Authentication & Onboarding (Web)
- [ ] Email + phone number registration
- [ ] Apple Sign-In and Google Sign-In (web)
- [ ] Multi-step onboarding flow:
  - Step 1: Basic info (name, age, gender, location)
  - Step 2: Faith profile (denomination, faith level, spiritual practices)
  - Step 3: Values & lifestyle (values[], lifestyle, intention/timeline)
  - Step 4: Purity pledge (self-declaration — earns Level 1 badge)
  - Step 5: Photo upload (up to 6 photos)
  - Step 6: Video introduction (30–60 second video)
  - Step 7: AI bio generation (Gemini-powered)
  - Step 8: Matching preferences

#### 1.3 Tiered Trust & Verification System
- [ ] **Level 1 — Purity Pledge** *(Silver badge)*
  - Self-declaration via signed commitment form
  - Shown on profile: "Committed to Purity"
- [ ] **Level 2 — ID Verified** *(Gold badge)*
  - Government ID upload + liveness check (face match)
  - Third-party ID verification API (Jumio or Persona)
- [ ] **Level 3 — Community Vouched** *(Purple badge)*
  - User provides reference (pastor, mentor, family member)
  - System sends email to reference requesting confirmation
  - Reference approves → badge granted
- [ ] **Level 4 — Background Checked** *(Platinum badge — Ultimate tier)*
  - Premium-only feature
  - Integration with background check API (Checkr or similar)
  - Checks criminal record, sex offender registry
  - Badge shown on profile + search filter

#### 1.4 Covenant Matching Algorithm (Enhanced)
- [ ] Faith compatibility (35%): denomination, faith level, spiritual practices
- [ ] Values alignment (30%): shared life values
- [ ] Intention match (20%): marriage timeline compatibility
- [ ] Lifestyle fit (15%): traditional/modern/moderate
- [ ] Trust level filter: users can filter by minimum trust tier
- [ ] Distance filter: radius-based matching
- [ ] Deal-breaker system: hard filters (e.g., denomination must match)
- [ ] Match percentage displayed on every profile card

#### 1.5 Discovery & Profile Cards (Web)
- [ ] Profile cards showing: photo, name, age, city, match %, trust badges
- [ ] Video intro preview on hover/tap
- [ ] Elegant express interest (no swiping — intentional "Show Interest" button)
- [ ] Mutual interest → match → messaging unlocked
- [ ] Advanced filters panel

#### 1.6 Messaging System (Real-time)
- [ ] Socket.io real-time chat
- [ ] Message requests (must match first to DM freely)
- [ ] Text, emoji, GIFs, photo sharing
- [ ] Voice messages
- [ ] Read receipts (Premium feature — shows when message was read)
- [ ] Conversation starters (AI-generated icebreakers)
- [ ] Report/block user from chat

---

### PHASE 2 — Premium Features

#### 2.1 Freemium vs Ultimate Tier

**Free Tier (all users)**
- Create profile + verification up to Level 2
- Up to 10 likes per day
- Messaging with mutual matches
- Basic filters
- 1 photo (no video intro upload without premium)

**Ultimate Tier ($29.99/month or $199/year)**
- [ ] **Profile Boost (Spotlight)** — Feature profile at top of discovery for 30 min
- [ ] **Read Receipts** — See when messages are read
- [ ] **Advanced Relationship Analytics** — Compatibility deep-dive, conversation health scores, match trends
- [ ] **Travel Mode** — Set a second location to match in other cities (great for people open to long-distance)
- [ ] **"We Met" Feedback System** — After a date, both users confirm they met. Builds reputation score. Unlocks new matches
- [ ] **Date Planning Tools** — AI date planner, venue recommendations, calendar sync, date reminders, shared itinerary
- [ ] **Ultimate Background Check Badge** — Verified criminal record / sex offender registry clearance
- [ ] Unlimited likes
- [ ] See who liked you
- [ ] Priority matching (shown to more people)
- [ ] Video intro upload (full 60 seconds)
- [ ] Multiple video intros

#### 2.2 AI Matchmaker Features
- [ ] **AI Bio Writer** — Gemini generates personalized, faith-authentic bio
- [ ] **AI Compatibility Insights** — "Here's why you and [Name] could be great together"
- [ ] **AI Date Coach** — Tips for first dates, conversation starters, relationship milestones
- [ ] **AI Photo Feedback** — Scores profile photos, suggests improvements
- [ ] **AI Icebreakers** — Context-aware first message suggestions based on their profile
- [ ] **Relationship Health Score** — AI monitors conversation quality for active matches

#### 2.3 Video Introductions
- [ ] In-app video recording (max 60 seconds)
- [ ] Video upload from camera roll
- [ ] AI auto-generated thumbnail from best frame
- [ ] Video moderation (content safety scan before publishing)
- [ ] Video plays automatically (muted) on profile card hover
- [ ] Full-screen video viewer on profile page

#### 2.4 Date Planner
- [ ] AI-powered date idea generator based on both profiles + location
- [ ] Category filters: Coffee, Dinner, Outdoors, Cultural, Church events
- [ ] Venue suggestions via Google Maps API
- [ ] Send a "Date Request" to a match with proposed plan
- [ ] Match accepts → shared calendar event created
- [ ] "We Met" confirmation post-date → reputation points

---

### PHASE 3 — iOS (Native Swift)

#### 3.1 iOS Project Setup
- [ ] New Xcode project: SwiftUI, iOS 16+ target
- [ ] Package dependencies: Alamofire, Kingfisher, SocketIO, Stripe, AVFoundation
- [ ] Architecture: MVVM + Coordinator pattern
- [ ] Design system: Custom SwiftUI components matching web purple/gold aesthetic
- [ ] Dark mode support

#### 3.2 iOS Features
- [ ] Apple Sign-In (required for App Store)
- [ ] Biometric authentication (Face ID / Touch ID)
- [ ] Push notifications (APNs)
- [ ] Camera & microphone for video intros (AVFoundation)
- [ ] Core Location for proximity matching
- [ ] StoreKit 2 for in-app purchases (Ultimate subscription)
- [ ] All web features ported to native SwiftUI
- [ ] Native animations and haptic feedback
- [ ] Offline mode with Core Data caching

#### 3.3 iOS-Specific UX
- [ ] Swipe gestures (but intentional — "Express Interest" not tinder swipe)
- [ ] Widget support (iOS 16+) showing new matches
- [ ] Dynamic Island integration for active conversations
- [ ] Spotlight search for matches

---

### PHASE 4 — Android (Native Kotlin)

#### 4.1 Android Project Setup
- [ ] New Android project: Kotlin + Jetpack Compose, API 26+ (Android 8)
- [ ] Dependencies: Retrofit, Coil, Socket.IO, Stripe, CameraX
- [ ] Architecture: MVVM + Hilt (dependency injection) + Clean Architecture
- [ ] Material3 with custom purple/gold theme
- [ ] Dynamic color support (Android 12+)

#### 4.2 Android Features
- [ ] Google Sign-In
- [ ] Biometric authentication (fingerprint/face)
- [ ] Firebase Cloud Messaging for push notifications
- [ ] CameraX for video intros
- [ ] Google Maps SDK for proximity matching
- [ ] Google Play Billing for in-app purchases (Ultimate subscription)
- [ ] All web features ported to Jetpack Compose
- [ ] Compose animations matching the elegant aesthetic

#### 4.3 Android-Specific UX
- [ ] Adaptive layouts (phone + tablet)
- [ ] Android 12+ Material You dynamic theming (with brand override)
- [ ] App shortcuts for quick actions
- [ ] Notification channels for messages, matches, boosts

---

### PHASE 5 — Backend Expansion

#### 5.1 API Endpoints (Complete List)

**Auth**
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `POST /api/auth/verify-email`
- `POST /api/auth/apple` (Sign in with Apple)
- `POST /api/auth/google` (Google OAuth)

**Users & Profiles**
- `GET /api/users/me`
- `PUT /api/users/me`
- `GET /api/users/:id`
- `POST /api/users/me/photos` (upload photos)
- `DELETE /api/users/me/photos/:photoId`
- `POST /api/users/me/video` (upload video intro)
- `POST /api/users/me/bio/generate` (AI bio)
- `DELETE /api/users/me` (account deletion — GDPR)

**Verification / Trust**
- `POST /api/verification/pledge` (Level 1)
- `POST /api/verification/id` (Level 2 — upload ID)
- `POST /api/verification/reference` (Level 3 — submit reference)
- `GET /api/verification/status`
- `POST /api/verification/background-check` (Level 4 — premium)

**Discovery & Matching**
- `GET /api/discovery` (paginated, filtered)
- `POST /api/matches/like/:userId`
- `POST /api/matches/pass/:userId`
- `GET /api/matches` (mutual matches)
- `GET /api/matches/:matchId`
- `DELETE /api/matches/:matchId` (unmatch)
- `GET /api/matches/who-liked-me` (premium)

**Messaging**
- `GET /api/conversations`
- `GET /api/conversations/:id/messages`
- `POST /api/conversations/:id/messages`
- `DELETE /api/conversations/:id/messages/:msgId`
- `POST /api/conversations/:id/report`

**Premium / Payments**
- `GET /api/subscription/plans`
- `POST /api/subscription/create-checkout` (Stripe)
- `POST /api/subscription/cancel`
- `GET /api/subscription/status`
- `POST /api/subscription/boost` (spotlight)
- `POST /api/subscription/travel-mode`

**Date Planning**
- `GET /api/dates/ideas` (AI-generated, location-based)
- `POST /api/dates/request` (send date request to match)
- `PUT /api/dates/:dateId/respond`
- `POST /api/dates/:dateId/we-met` (confirm meeting)

**AI Features**
- `POST /api/ai/bio` (generate bio)
- `POST /api/ai/icebreaker` (first message suggestions)
- `GET /api/ai/insights/:matchId` (compatibility insights)
- `POST /api/ai/photo-feedback` (photo quality scoring)
- `GET /api/ai/date-coach` (relationship coaching tips)

**Admin**
- `GET /api/admin/users`
- `PUT /api/admin/users/:id/verify`
- `PUT /api/admin/users/:id/ban`
- `GET /api/admin/reports`
- `PUT /api/admin/reports/:id/resolve`
- `GET /api/admin/analytics`

#### 5.2 Real-time (Socket.io Events)
- `connection` / `disconnect`
- `join_conversation` / `leave_conversation`
- `send_message` / `receive_message`
- `typing_start` / `typing_stop`
- `message_read`
- `new_match`
- `boost_started`

#### 5.3 Infrastructure & Services
- [ ] MongoDB Atlas (production database)
- [ ] AWS S3 (photo & video storage) + CloudFront CDN
- [ ] Stripe (subscriptions + one-time payments)
- [ ] SendGrid (transactional emails)
- [ ] Twilio (SMS verification)
- [ ] Firebase Admin (push notifications — iOS APNs + Android FCM)
- [ ] Jumio or Persona (ID verification)
- [ ] Checkr (background checks — Level 4)
- [ ] Google Gemini API (AI features)
- [ ] Google Maps API (venue suggestions, proximity)
- [ ] Redis (session caching, rate limiting)

---

## SAFETY & MODERATION

- [ ] AI content moderation on all photos and videos before publishing
- [ ] Report & block system
- [ ] Age verification (18+) — required during onboarding
- [ ] Automatic ban for sex offender registry matches
- [ ] Rate limiting on all API endpoints
- [ ] GDPR + CCPA compliance (data export, account deletion)
- [ ] End-to-end encrypted messaging option (Ultimate tier)
- [ ] Emergency contact feature for in-person meetups

---

## MONETIZATION SUMMARY

| Tier | Price | Features |
|------|-------|----------|
| Free | $0 | Profile, 10 likes/day, basic chat, Level 1-2 verification |
| Ultimate | $29.99/mo or $199/yr | Everything + Boost, Read Receipts, Analytics, Travel Mode, "We Met", Date Tools, Background Check Badge, unlimited likes, see who liked you |

**Additional Revenue**
- A-la-carte Boosts: $4.99 per boost (non-subscribers)
- Background Check add-on: $9.99 one-time (non-subscribers)
- Super Interest (stand-out message): $0.99 each

---

## BUILD ORDER (Recommended Sequence)

```
Week 1-2:   Backend foundation (auth, models, core API)
Week 3-4:   Web redesign (design system, all pages repolished)
Week 5-6:   Verification system + Covenant Algorithm enhancement
Week 7-8:   Messaging (Socket.io) + real-time features
Week 9-10:  AI features (bio, icebreakers, date coach, insights)
Week 11-12: Premium system (Stripe, Boost, Travel Mode, Analytics)
Week 13-16: iOS Swift app (SwiftUI full feature parity)
Week 17-20: Android Kotlin app (Jetpack Compose full feature parity)
Week 21-22: Testing, QA, App Store + Play Store submission prep
Week 23-24: Beta launch → Production launch
```

---

## SUCCESS METRICS (Better Than Competitors)

| Metric | Hinge | eHarmony | VIRGINS.APP Goal |
|--------|-------|----------|------------------|
| Match quality | Algorithm | Questionnaire | Covenant Algorithm + Trust Tiers |
| Safety | Basic | Basic | 4-level verification + background check |
| Authenticity | Photos | Photos | Video intros + pledges |
| AI Integration | None | Basic | Full AI coach + insights |
| Niche clarity | None | Broad | Precise (marriage-minded, faith-based) |

---

*This is a living document. More premium features to be added as confirmed by the founder.*
