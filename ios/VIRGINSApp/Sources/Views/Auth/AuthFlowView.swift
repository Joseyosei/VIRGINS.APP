import SwiftUI

struct AuthFlowView: View {
    @State private var showLogin = false

    var body: some View {
        if showLogin {
            LoginView(onBack: { showLogin = false })
                .transition(.move(edge: .trailing))
        } else {
            WelcomeView(onLogin: { showLogin = true })
                .transition(.move(edge: .leading))
        }
    }
}

// MARK: - Welcome Screen
struct WelcomeView: View {
    var onLogin: () -> Void
    @State private var animate = false

    var body: some View {
        ZStack {
            // Brand gradient background
            LinearGradient(colors: [.virginsDark, .virginsPurple], startPoint: .top, endPoint: .bottom)
                .ignoresSafeArea()

            // Decorative circles
            Circle()
                .fill(Color.virginsGold.opacity(0.08))
                .frame(width: 400)
                .offset(x: 150, y: -200)
                .blur(radius: 60)

            Circle()
                .fill(Color.virginsPurple.opacity(0.3))
                .frame(width: 300)
                .offset(x: -120, y: 200)
                .blur(radius: 80)

            VStack(spacing: 0) {
                Spacer()

                // Logo
                VStack(spacing: 16) {
                    RingsLogoView(size: 100, color: .virginsGold)
                        .scaleEffect(animate ? 1 : 0.6)
                        .opacity(animate ? 1 : 0)

                    Text("VIRGINS")
                        .font(.playfair(42, weight: .black))
                        .tracking(14)
                        .foregroundColor(.white)
                        .opacity(animate ? 1 : 0)

                    Text("Love Worth Waiting For")
                        .font(.custom("Inter-Regular", size: 14))
                        .tracking(3)
                        .foregroundColor(.virginsGold.opacity(0.85))
                        .textCase(.uppercase)
                        .opacity(animate ? 1 : 0)
                }

                Spacer()

                // Tagline
                VStack(spacing: 12) {
                    Text("The premier community for those\nsaving intimacy for marriage.")
                        .font(.custom("Inter-Regular", size: 16))
                        .foregroundColor(.white.opacity(0.75))
                        .multilineTextAlignment(.center)
                        .lineSpacing(4)

                    Text("54,896 verified members")
                        .font(.custom("Inter-Bold", size: 12))
                        .foregroundColor(.virginsGold)
                        .tracking(2)
                        .textCase(.uppercase)
                }
                .opacity(animate ? 1 : 0)
                .offset(y: animate ? 0 : 20)
                .padding(.horizontal, 40)
                .padding(.bottom, 48)

                // CTAs
                VStack(spacing: 14) {
                    NavigationLink(destination: OnboardingView()) {
                        Text("Create Covenant Profile")
                            .font(.custom("Inter-Black", size: 16))
                            .tracking(1)
                            .foregroundColor(.virginsDark)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 18)
                            .background(Color.virginsGold)
                            .clipShape(RoundedRectangle(cornerRadius: 20))
                    }

                    Button(action: onLogin) {
                        Text("Sign In")
                            .font(.custom("Inter-Bold", size: 16))
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 18)
                            .overlay(RoundedRectangle(cornerRadius: 20).stroke(Color.white.opacity(0.3), lineWidth: 1))
                    }
                }
                .padding(.horizontal, 28)
                .padding(.bottom, 50)
                .opacity(animate ? 1 : 0)
                .offset(y: animate ? 0 : 30)
            }
        }
        .navigationBarHidden(true)
        .onAppear {
            withAnimation(.spring(response: 1.0, dampingFraction: 0.8).delay(0.2)) {
                animate = true
            }
        }
    }
}
