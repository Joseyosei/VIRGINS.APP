import SwiftUI

struct VerificationView: View {
    @State private var status: VerificationStatus?
    @State private var isLoading = false
    @State private var activeStep: Int? = nil

    var body: some View {
        NavigationView {
            ZStack {
                Color.virginsCream.ignoresSafeArea()

                ScrollView {
                    VStack(spacing: 24) {
                        // Header
                        VStack(spacing: 8) {
                            Image(systemName: "shield.fill")
                                .font(.system(size: 48))
                                .foregroundStyle(
                                    LinearGradient(colors: [.virginsPurple, .virginsGold], startPoint: .top, endPoint: .bottom)
                                )
                            Text("Trust Verification")
                                .font(.playfair(28, weight: .bold))
                                .foregroundColor(.virginsPurple)
                            Text("Verified members get 3x more matches.")
                                .font(.custom("Inter-Regular", size: 14))
                                .foregroundColor(.gray)
                        }
                        .padding(.top, 8)

                        // Progress stepper
                        if let status {
                            TrustStepperView(currentLevel: status.level)
                        }

                        // Steps
                        VStack(spacing: 16) {
                            VerificationStepCard(
                                step: 1, title: "Sign the Covenant Pledge",
                                description: "Publicly declare your commitment to saving intimacy for marriage.",
                                icon: "hand.raised.fill",
                                isCompleted: (status?.level ?? 0) >= 1,
                                isPremiumRequired: false
                            ) { Task { await signPledge() } }

                            VerificationStepCard(
                                step: 2, title: "Upload Government ID",
                                description: "A selfie with your ID proves your identity. Reviewed privately by our team.",
                                icon: "creditcard.fill",
                                isCompleted: (status?.level ?? 0) >= 2,
                                isPremiumRequired: false
                            ) { activeStep = 2 }

                            VerificationStepCard(
                                step: 3, title: "Community Reference",
                                description: "A pastor, mentor, or friend vouches for your character.",
                                icon: "person.2.fill",
                                isCompleted: (status?.level ?? 0) >= 3,
                                isPremiumRequired: false
                            ) { activeStep = 3 }

                            VerificationStepCard(
                                step: 4, title: "Background Check",
                                description: "Full criminal background check. Shows the gold shield badge.",
                                icon: "magnifyingglass.circle.fill",
                                isCompleted: (status?.level ?? 0) >= 4,
                                isPremiumRequired: true
                            ) { Task { await initiateBackgroundCheck() } }
                        }
                        .padding(.horizontal, 20)
                        .padding(.bottom, 40)
                    }
                }
            }
            .navigationTitle("Verification")
            .navigationBarTitleDisplayMode(.inline)
            .task {
                isLoading = true
                status = try? await APIService.shared.getVerificationStatus()
                isLoading = false
            }
            .sheet(item: $activeStep.animation()) { step in
                if step == 2 { IDUploadSheet(onComplete: { activeStep = nil; Task { await reloadStatus() } }) }
                if step == 3 { ReferenceSheet(onComplete: { activeStep = nil; Task { await reloadStatus() } }) }
            }
        }
    }

    private func signPledge() async {
        status = try? await APIService.shared.signPledge()
    }

    private func initiateBackgroundCheck() async {
        // Premium gate handled by server
    }

    private func reloadStatus() async {
        status = try? await APIService.shared.getVerificationStatus()
    }
}

// Binding Int? for sheet(item:)
extension Int: Identifiable { public var id: Int { self } }

// MARK: - Trust Stepper
struct TrustStepperView: View {
    let currentLevel: Int
    private let levels = ["Pledge", "ID", "Vouched", "Background"]

    var body: some View {
        HStack(spacing: 0) {
            ForEach(Array(levels.enumerated()), id: \.offset) { i, label in
                VStack(spacing: 6) {
                    ZStack {
                        Circle()
                            .fill(i < currentLevel ? Color.virginsGold : (i == currentLevel ? Color.virginsPurple : Color.gray.opacity(0.2)))
                            .frame(width: 36, height: 36)
                        if i < currentLevel {
                            Image(systemName: "checkmark").font(.system(size: 14, weight: .bold)).foregroundColor(.white)
                        } else {
                            Text("\(i+1)").font(.custom("Inter-Bold", size: 13)).foregroundColor(i == currentLevel ? .white : .gray)
                        }
                    }
                    Text(label).font(.custom("Inter-Regular", size: 9)).foregroundColor(.gray).textCase(.uppercase).tracking(0.5)
                }
                if i < levels.count - 1 {
                    Rectangle()
                        .fill(i < currentLevel - 1 ? Color.virginsGold : Color.gray.opacity(0.2))
                        .frame(height: 2)
                        .padding(.bottom, 16)
                }
            }
        }
        .padding(.horizontal, 28)
    }
}

// MARK: - Step Card
struct VerificationStepCard: View {
    let step: Int
    let title: String
    let description: String
    let icon: String
    let isCompleted: Bool
    let isPremiumRequired: Bool
    var onTap: () -> Void

    var body: some View {
        HStack(spacing: 16) {
            ZStack {
                RoundedRectangle(cornerRadius: 14)
                    .fill(isCompleted ? Color.virginsGold.opacity(0.15) : Color.virginsPurple.opacity(0.08))
                    .frame(width: 52, height: 52)
                Image(systemName: isCompleted ? "checkmark.shield.fill" : icon)
                    .font(.system(size: 22))
                    .foregroundColor(isCompleted ? .virginsGold : .virginsPurple)
            }

            VStack(alignment: .leading, spacing: 4) {
                HStack {
                    Text(title)
                        .font(.custom("Inter-Bold", size: 14))
                        .foregroundColor(.virginsPurple)
                    if isPremiumRequired {
                        Text("PREMIUM")
                            .font(.custom("Inter-Black", size: 8))
                            .foregroundColor(.virginsGold)
                            .padding(.horizontal, 5)
                            .padding(.vertical, 2)
                            .background(Color.virginsGold.opacity(0.15))
                            .clipShape(Capsule())
                    }
                }
                Text(description)
                    .font(.custom("Inter-Regular", size: 12))
                    .foregroundColor(.gray)
                    .lineLimit(2)
            }

            Spacer()

            if !isCompleted {
                Button(action: onTap) {
                    Image(systemName: "chevron.right")
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundColor(.virginsPurple)
                }
            }
        }
        .padding(16)
        .background(Color.white)
        .clipShape(RoundedRectangle(cornerRadius: 18))
        .shadow(color: .black.opacity(0.05), radius: 8, y: 3)
        .opacity(isCompleted ? 0.75 : 1)
    }
}

// MARK: - ID Upload Sheet
struct IDUploadSheet: View {
    var onComplete: () -> Void
    @State private var selectedImage: UIImage?
    @State private var showPicker = false

    var body: some View {
        VStack(spacing: 24) {
            Text("Upload Government ID").font(.playfair(24, weight: .bold)).foregroundColor(.virginsPurple)
            Text("Take a selfie holding your ID. Reviewed privately — never shared.").font(.custom("Inter-Regular", size: 14)).foregroundColor(.gray).multilineTextAlignment(.center).padding(.horizontal)

            if let img = selectedImage {
                Image(uiImage: img).resizable().scaledToFit().frame(height: 200).clipShape(RoundedRectangle(cornerRadius: 16))
                Button("Submit for Review") { onComplete() }
                    .font(.custom("Inter-Black", size: 15)).foregroundColor(.white)
                    .frame(maxWidth: .infinity).padding().background(Color.virginsPurple).clipShape(RoundedRectangle(cornerRadius: 16))
                    .padding(.horizontal)
            } else {
                Button(action: { showPicker = true }) {
                    VStack(spacing: 8) {
                        Image(systemName: "camera.fill").font(.system(size: 32)).foregroundColor(.virginsPurple)
                        Text("Take / Choose Photo").font(.custom("Inter-Bold", size: 14)).foregroundColor(.virginsPurple)
                    }
                    .frame(maxWidth: .infinity).padding(40)
                    .background(Color.virginsPurple.opacity(0.06))
                    .clipShape(RoundedRectangle(cornerRadius: 20))
                    .overlay(RoundedRectangle(cornerRadius: 20).strokeBorder(Color.virginsPurple.opacity(0.2), style: StrokeStyle(lineWidth: 2, dash: [8])))
                }
                .padding(.horizontal)
            }
        }
        .padding(.top, 32)
    }
}

// MARK: - Reference Sheet
struct ReferenceSheet: View {
    var onComplete: () -> Void
    @State private var email = ""
    @State private var isSubmitting = false

    var body: some View {
        VStack(spacing: 24) {
            Text("Community Reference").font(.playfair(24, weight: .bold)).foregroundColor(.virginsPurple)
            Text("Enter the email of a pastor, mentor, or trusted friend who can vouch for your character.").font(.custom("Inter-Regular", size: 14)).foregroundColor(.gray).multilineTextAlignment(.center).padding(.horizontal)

            TextField("their@email.com", text: $email)
                .keyboardType(.emailAddress).autocapitalization(.none)
                .padding().background(Color.gray.opacity(0.07)).clipShape(RoundedRectangle(cornerRadius: 14))
                .padding(.horizontal)

            Button(action: {
                isSubmitting = true
                Task {
                    _ = try? await APIService.shared.requestReference(email: email)
                    onComplete()
                }
            }) {
                Group {
                    if isSubmitting { ProgressView().tint(.white) }
                    else { Text("Send Reference Request").font(.custom("Inter-Black", size: 15)).foregroundColor(.white) }
                }
                .frame(maxWidth: .infinity).padding().background(Color.virginsPurple).clipShape(RoundedRectangle(cornerRadius: 16))
            }
            .disabled(email.isEmpty || isSubmitting)
            .padding(.horizontal)
        }
        .padding(.top, 32)
    }
}
