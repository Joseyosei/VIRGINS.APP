import SwiftUI

struct DiscoverView: View {
    @ObservedObject var viewModel: DiscoverViewModel
    @State private var dragOffset: CGSize = .zero
    @State private var cardRotation: Double = 0

    var body: some View {
        NavigationView {
            ZStack {
                Color.virginsCream.ignoresSafeArea()

                if viewModel.isLoading {
                    VStack(spacing: 16) {
                        ProgressView().tint(.virginsPurple).scaleEffect(1.5)
                        Text("Finding your matches...")
                            .font(.custom("Inter-Medium", size: 14))
                            .foregroundColor(.gray)
                    }
                } else if viewModel.profiles.isEmpty {
                    EmptyDiscoverView { Task { await viewModel.loadProfiles() } }
                } else {
                    VStack(spacing: 20) {
                        // Stack of cards (show top 3)
                        ZStack {
                            ForEach(Array(viewModel.profiles.prefix(3).enumerated().reversed()), id: \.element.id) { index, profile in
                                if index == 0 {
                                    ProfileCard(profile: profile)
                                        .offset(dragOffset)
                                        .rotationEffect(.degrees(cardRotation))
                                        .gesture(swipeGesture(profile: profile))
                                        .zIndex(Double(3 - index))
                                } else {
                                    ProfileCard(profile: profile)
                                        .scaleEffect(1 - CGFloat(index) * 0.04)
                                        .offset(y: CGFloat(index) * 12)
                                        .zIndex(Double(3 - index))
                                }
                            }
                        }
                        .padding(.horizontal, 20)

                        // Action buttons
                        ActionButtonsView(
                            onPass: { Task { await viewModel.pass() } },
                            onLike: { Task { await viewModel.like() } }
                        )
                        .padding(.bottom, 20)
                    }
                }
            }
            .navigationTitle("Discover")
            .navigationBarTitleDisplayMode(.large)
        }
    }

    private func swipeGesture(profile: DiscoverProfile) -> some Gesture {
        DragGesture()
            .onChanged { value in
                dragOffset = value.translation
                cardRotation = Double(value.translation.width / 20)
            }
            .onEnded { value in
                let threshold: CGFloat = 100
                if value.translation.width > threshold {
                    swipeRight()
                } else if value.translation.width < -threshold {
                    swipeLeft()
                } else {
                    withAnimation(.spring()) { dragOffset = .zero; cardRotation = 0 }
                }
            }
    }

    private func swipeRight() {
        withAnimation(.easeOut(duration: 0.3)) {
            dragOffset = CGSize(width: 500, height: 0)
            cardRotation = 20
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
            dragOffset = .zero; cardRotation = 0
            Task { await viewModel.like() }
        }
    }

    private func swipeLeft() {
        withAnimation(.easeOut(duration: 0.3)) {
            dragOffset = CGSize(width: -500, height: 0)
            cardRotation = -20
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
            dragOffset = .zero; cardRotation = 0
            Task { await viewModel.pass() }
        }
    }
}

// MARK: - Profile Card
struct ProfileCard: View {
    let profile: DiscoverProfile

    var body: some View {
        ZStack(alignment: .bottom) {
            // Photo
            AsyncImage(url: URL(string: profile.user.profileImages.first ?? "")) { image in
                image.resizable().scaledToFill()
            } placeholder: {
                Rectangle().fill(Color.virginsPurple.opacity(0.2))
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .clipped()

            // Gradient overlay
            LinearGradient(
                colors: [.clear, .black.opacity(0.7)],
                startPoint: .center,
                endPoint: .bottom
            )

            // Info panel
            VStack(alignment: .leading, spacing: 8) {
                HStack(alignment: .bottom) {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("\(profile.user.displayName), \(profile.user.age ?? 0)")
                            .font(.playfair(28, weight: .bold))
                            .foregroundColor(.white)

                        if let location = profile.user.location {
                            Label(location, systemImage: "location.fill")
                                .font(.custom("Inter-Medium", size: 13))
                                .foregroundColor(.white.opacity(0.8))
                        }
                    }

                    Spacer()

                    // Covenant Score
                    VStack(spacing: 2) {
                        Text("\(Int(profile.score))%")
                            .font(.playfair(24, weight: .black))
                            .foregroundColor(.virginsGold)
                        Text("Match")
                            .font(.custom("Inter-Bold", size: 9))
                            .foregroundColor(.virginsGold.opacity(0.8))
                            .tracking(2)
                            .textCase(.uppercase)
                    }
                    .padding(10)
                    .background(Color.black.opacity(0.4))
                    .clipShape(RoundedRectangle(cornerRadius: 12))
                }

                // Trust badge + denomination
                HStack(spacing: 8) {
                    TrustBadgeView(level: profile.user.trustLevel, compact: true)

                    if let denom = profile.user.denomination {
                        Text(denom)
                            .font(.custom("Inter-Medium", size: 12))
                            .foregroundColor(.white.opacity(0.7))
                    }

                    Spacer()

                    // Online indicator
                    if profile.user.isOnline {
                        HStack(spacing: 4) {
                            Circle().fill(Color.green).frame(width: 7, height: 7)
                            Text("Online")
                                .font(.custom("Inter-Medium", size: 11))
                                .foregroundColor(.white.opacity(0.8))
                        }
                    }
                }
            }
            .padding(20)
        }
        .clipShape(RoundedRectangle(cornerRadius: 28))
        .shadow(color: .black.opacity(0.18), radius: 20, y: 8)
        .frame(height: 520)
    }
}

// MARK: - Action Buttons
struct ActionButtonsView: View {
    var onPass: () -> Void
    var onLike: () -> Void

    var body: some View {
        HStack(spacing: 40) {
            // Pass
            Button(action: onPass) {
                Image(systemName: "xmark")
                    .font(.system(size: 28, weight: .bold))
                    .foregroundColor(.gray)
                    .frame(width: 70, height: 70)
                    .background(Color.white)
                    .clipShape(Circle())
                    .shadow(color: .black.opacity(0.1), radius: 10, y: 4)
            }

            // Like
            Button(action: onLike) {
                Image(systemName: "heart.fill")
                    .font(.system(size: 32, weight: .bold))
                    .foregroundColor(.white)
                    .frame(width: 80, height: 80)
                    .background(
                        LinearGradient(colors: [.virginsPurple, .virginsDark], startPoint: .topLeading, endPoint: .bottomTrailing)
                    )
                    .clipShape(Circle())
                    .shadow(color: .virginsPurple.opacity(0.4), radius: 16, y: 6)
            }
        }
    }
}

// MARK: - Empty State
struct EmptyDiscoverView: View {
    var onRefresh: () -> Void
    var body: some View {
        VStack(spacing: 20) {
            RingsLogoView(size: 80, color: .virginsPurple)
            Text("No New Profiles").font(.playfair(24, weight: .bold)).foregroundColor(.virginsPurple)
            Text("Check back soon — new covenant members join every day.")
                .font(.custom("Inter-Regular", size: 15))
                .foregroundColor(.gray)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 40)
            Button(action: onRefresh) {
                Text("Refresh")
                    .font(.custom("Inter-Bold", size: 15))
                    .foregroundColor(.white)
                    .padding(.horizontal, 32)
                    .padding(.vertical, 14)
                    .background(Color.virginsPurple)
                    .clipShape(Capsule())
            }
        }
    }
}

// MARK: - Match Celebration
struct MatchCelebrationView: View {
    let match: Match
    var onMessage: () -> Void
    @State private var scale: CGFloat = 0.5
    @State private var opacity: Double = 0

    var body: some View {
        ZStack {
            LinearGradient(colors: [.virginsDark, .virginsPurple], startPoint: .top, endPoint: .bottom)
                .ignoresSafeArea()

            VStack(spacing: 28) {
                Text("It's a\nCovenant Match!")
                    .font(.playfair(38, weight: .black))
                    .foregroundColor(.white)
                    .multilineTextAlignment(.center)
                    .lineSpacing(4)

                HStack(spacing: 20) {
                    AsyncImage(url: URL(string: match.user.profileImage)) { img in
                        img.resizable().scaledToFill()
                    } placeholder: {
                        Color.virginsPurple.opacity(0.3)
                    }
                    .frame(width: 100, height: 100)
                    .clipShape(Circle())
                    .overlay(Circle().stroke(Color.virginsGold, lineWidth: 3))

                    RingsLogoView(size: 50, color: .virginsGold)
                }
                .scaleEffect(scale)

                Text("You and \(match.user.displayName) both liked each other.")
                    .font(.custom("Inter-Regular", size: 16))
                    .foregroundColor(.white.opacity(0.8))
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 40)

                VStack(spacing: 14) {
                    Button(action: onMessage) {
                        Text("Send First Message 💍")
                            .font(.custom("Inter-Black", size: 16))
                            .foregroundColor(.virginsDark)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 18)
                            .background(Color.virginsGold)
                            .clipShape(RoundedRectangle(cornerRadius: 18))
                    }

                    Button(action: onMessage) {
                        Text("Continue Discovering")
                            .font(.custom("Inter-Bold", size: 16))
                            .foregroundColor(.white.opacity(0.7))
                    }
                }
                .padding(.horizontal, 28)
            }
        }
        .onAppear {
            withAnimation(.spring(response: 0.7, dampingFraction: 0.6)) {
                scale = 1.0
                opacity = 1.0
            }
        }
    }
}
