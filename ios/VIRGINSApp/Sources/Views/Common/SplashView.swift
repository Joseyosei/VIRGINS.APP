import SwiftUI

struct SplashView: View {
    @State private var scale: CGFloat = 0.8
    @State private var opacity: Double = 0

    var body: some View {
        ZStack {
            Color.virginsDark.ignoresSafeArea()

            VStack(spacing: 24) {
                RingsLogoView(size: 80, color: .virginsGold)
                    .scaleEffect(scale)
                    .opacity(opacity)

                Text("VIRGINS")
                    .font(.playfair(36, weight: .black))
                    .tracking(12)
                    .foregroundColor(.white)
                    .opacity(opacity)

                Text("Love Worth Waiting For")
                    .font(.custom("Inter-Medium", size: 13))
                    .tracking(4)
                    .foregroundColor(.virginsGold.opacity(0.8))
                    .textCase(.uppercase)
                    .opacity(opacity)
            }
        }
        .onAppear {
            withAnimation(.spring(response: 0.8, dampingFraction: 0.7)) {
                scale = 1.0
                opacity = 1.0
            }
        }
    }
}
