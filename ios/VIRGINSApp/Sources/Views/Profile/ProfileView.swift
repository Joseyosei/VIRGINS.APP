import SwiftUI

struct ProfileView: View {
    @EnvironmentObject var authVM: AuthViewModel
    @StateObject private var storeKit = StoreKitService.shared
    @State private var analytics: UserAnalytics?
    @State private var showPricing = false
    @State private var showVerification = false

    var body: some View {
        NavigationView {
            ZStack {
                Color.virginsCream.ignoresSafeArea()

                ScrollView {
                    VStack(spacing: 20) {
                        // Header Card
                        profileHeaderCard

                        // Upgrade banner (if not ultimate)
                        if storeKit.currentTier != .ultimate {
                            upgradeBanner
                        }

                        // Analytics card
                        analyticsCard

                        // Settings
                        settingsSection
                    }
                    .padding(.bottom, 40)
                }
            }
            .navigationTitle("Profile")
            .navigationBarTitleDisplayMode(.inline)
            .task {
                if storeKit.currentTier.isPremium {
                    analytics = try? await APIService.shared.getAnalytics()
                }
            }
            .sheet(isPresented: $showPricing) { PricingSheetView() }
            .sheet(isPresented: $showVerification) { NavigationView { VerificationView() } }
        }
    }

    // MARK: - Profile Header
    private var profileHeaderCard: some View {
        ZStack(alignment: .bottom) {
            // Gradient background
            LinearGradient(
                colors: [.virginsDark, .virginsPurple],
                startPoint: .topLeading, endPoint: .bottomTrailing
            )
            .frame(height: 240)
            .clipShape(RoundedRectangle(cornerRadius: 28))

            VStack(spacing: 0) {
                // Avatar
                ZStack(alignment: .bottomTrailing) {
                    AsyncImage(url: URL(string: authVM.currentUser?.profileImages.first ?? "")) { img in
                        img.resizable().scaledToFill()
                    } placeholder: {
                        Color.virginsPurple.opacity(0.3)
                    }
                    .frame(width: 100, height: 100)
                    .clipShape(Circle())
                    .overlay(Circle().stroke(Color.virginsGold, lineWidth: 3))
                    .shadow(color: .black.opacity(0.3), radius: 12, y: 4)

                    Button(action: {}) {
                        Image(systemName: "pencil")
                            .font(.system(size: 12, weight: .bold))
                            .foregroundColor(.virginsDark)
                            .padding(8)
                            .background(Color.virginsGold)
                            .clipShape(Circle())
                    }
                }
                .padding(.bottom, 12)

                Text("\(authVM.currentUser?.displayName ?? ""), \(authVM.currentUser?.age ?? 0)")
                    .font(.playfair(24, weight: .bold))
                    .foregroundColor(.white)

                HStack(spacing: 8) {
                    Text(storeKit.currentTier.displayName + " Member")
                        .font(.custom("Inter-Bold", size: 12))
                        .foregroundColor(.virginsGold)

                    if let location = authVM.currentUser?.location {
                        Text("•").foregroundColor(.white.opacity(0.4))
                        Label(location, systemImage: "location.fill")
                            .font(.custom("Inter-Regular", size: 12))
                            .foregroundColor(.white.opacity(0.7))
                    }
                }
                .padding(.bottom, 16)

                // Stats
                HStack(spacing: 0) {
                    StatItem(value: "12", label: "Matches")
                    Divider().background(Color.white.opacity(0.2)).frame(height: 30)
                    StatItem(value: "48", label: "Likes")
                    Divider().background(Color.white.opacity(0.2)).frame(height: 30)
                    StatItem(value: "342", label: "Views")
                }
                .padding(.bottom, 20)
            }
        }
        .padding(.horizontal, 20)
        .padding(.top, 8)
    }

    // MARK: - Upgrade Banner
    private var upgradeBanner: some View {
        Button(action: { showPricing = true }) {
            HStack(spacing: 16) {
                Image(systemName: "crown.fill")
                    .font(.system(size: 24))
                    .foregroundColor(.virginsDark)
                VStack(alignment: .leading, spacing: 2) {
                    Text("Upgrade to \(storeKit.currentTier == .free ? "Plus" : "Ultimate")")
                        .font(.custom("Inter-Black", size: 15))
                        .foregroundColor(.virginsDark)
                    Text("Unlock unlimited matches & premium features")
                        .font(.custom("Inter-Regular", size: 12))
                        .foregroundColor(.virginsDark.opacity(0.7))
                }
                Spacer()
                Image(systemName: "chevron.right")
                    .foregroundColor(.virginsDark.opacity(0.6))
            }
            .padding(16)
            .background(
                LinearGradient(colors: [.virginsGold, .virginsGold.opacity(0.8)], startPoint: .leading, endPoint: .trailing)
            )
            .clipShape(RoundedRectangle(cornerRadius: 18))
            .shadow(color: .virginsGold.opacity(0.4), radius: 12, y: 4)
        }
        .padding(.horizontal, 20)
    }

    // MARK: - Analytics
    private var analyticsCard: some View {
        VStack(alignment: .leading, spacing: 0) {
            HStack {
                Label("Profile Insights", systemImage: "chart.bar.fill")
                    .font(.custom("Inter-Bold", size: 13))
                    .foregroundColor(.virginsPurple)
                Spacer()
                Text("Last 7 Days")
                    .font(.custom("Inter-Bold", size: 10))
                    .foregroundColor(.virginsGold)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 3)
                    .background(Color.virginsGold.opacity(0.12))
                    .clipShape(Capsule())
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
            .background(Color.gray.opacity(0.04))

            HStack(spacing: 0) {
                AnalyticItem(value: "\(analytics?.likeCount ?? 0)", label: "Likes Received", color: .virginsPurple)
                Divider().frame(height: 50)
                AnalyticItem(value: "\(analytics?.matchCount ?? 0)", label: "New Matches", color: .virginsGold)
                Divider().frame(height: 50)
                AnalyticItem(value: "\(analytics?.profileCompleteness ?? 0)%", label: "Completeness", color: .green)
            }
            .padding(.vertical, 16)
        }
        .background(Color.white)
        .clipShape(RoundedRectangle(cornerRadius: 20))
        .shadow(color: .black.opacity(0.05), radius: 10, y: 3)
        .overlay(
            // Premium gate blur if free
            Group {
                if storeKit.currentTier == .free {
                    ZStack {
                        Color.white.opacity(0.5)
                        VStack(spacing: 10) {
                            Image(systemName: "lock.fill").font(.system(size: 28)).foregroundColor(.virginsPurple)
                            Text("Upgrade to see insights").font(.custom("Inter-Bold", size: 13)).foregroundColor(.virginsPurple)
                        }
                    }
                    .clipShape(RoundedRectangle(cornerRadius: 20))
                }
            }
        )
        .padding(.horizontal, 20)
    }

    // MARK: - Settings
    private var settingsSection: some View {
        VStack(spacing: 0) {
            settingsRow(icon: "pencil.circle.fill", title: "Edit Profile") {}
            Divider().padding(.leading, 56)
            settingsRow(icon: "shield.lefthalf.filled", title: "Trust Verification") { showVerification = true }
            Divider().padding(.leading, 56)
            settingsRow(icon: "crown.fill", title: "Subscription") { showPricing = true }
            Divider().padding(.leading, 56)
            settingsRow(icon: "location.circle.fill", title: "Location Visibility") {}
            Divider().padding(.leading, 56)
            settingsRow(icon: "bell.circle.fill", title: "Notifications") {}
            Divider().padding(.leading, 56)
            settingsRow(icon: "rectangle.portrait.and.arrow.right.fill", title: "Sign Out", color: .red) {
                Task { await authVM.logout() }
            }
        }
        .background(Color.white)
        .clipShape(RoundedRectangle(cornerRadius: 20))
        .shadow(color: .black.opacity(0.05), radius: 10, y: 3)
        .padding(.horizontal, 20)
    }

    private func settingsRow(icon: String, title: String, color: Color = .virginsPurple, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            HStack(spacing: 14) {
                Image(systemName: icon)
                    .font(.system(size: 20))
                    .foregroundColor(color)
                    .frame(width: 30)
                Text(title)
                    .font(.custom("Inter-Medium", size: 15))
                    .foregroundColor(color == .red ? .red : .primary)
                Spacer()
                Image(systemName: "chevron.right")
                    .font(.system(size: 12))
                    .foregroundColor(.gray.opacity(0.4))
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 14)
        }
    }
}

// MARK: - Sub-components
struct StatItem: View {
    let value: String
    let label: String
    var body: some View {
        VStack(spacing: 2) {
            Text(value).font(.playfair(22, weight: .bold)).foregroundColor(.white)
            Text(label).font(.custom("Inter-Regular", size: 10)).foregroundColor(.white.opacity(0.6)).tracking(1).textCase(.uppercase)
        }
        .frame(maxWidth: .infinity)
    }
}

struct AnalyticItem: View {
    let value: String
    let label: String
    let color: Color
    var body: some View {
        VStack(spacing: 4) {
            Text(value).font(.playfair(28, weight: .black)).foregroundColor(color)
            Text(label).font(.custom("Inter-Regular", size: 10)).foregroundColor(.gray).tracking(0.5).textCase(.uppercase).multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity)
    }
}
