import SwiftUI
import StoreKit

struct PricingSheetView: View {
    @StateObject private var storeKit = StoreKitService.shared
    @Environment(\.dismiss) private var dismiss
    @State private var selectedPeriod: Period = .monthly
    @State private var isPurchasing = false
    @State private var purchaseError: String?

    enum Period: String, CaseIterable { case monthly = "Monthly", yearly = "Yearly" }

    var body: some View {
        NavigationView {
            ZStack {
                LinearGradient(colors: [.virginsDark, .virginsPurple], startPoint: .top, endPoint: .bottom)
                    .ignoresSafeArea()

                ScrollView {
                    VStack(spacing: 28) {
                        // Badge
                        Label("Covenant Membership", systemImage: "crown.fill")
                            .font(.custom("Inter-Black", size: 12))
                            .foregroundColor(.virginsDark)
                            .padding(.horizontal, 14)
                            .padding(.vertical, 7)
                            .background(Color.virginsGold)
                            .clipShape(Capsule())
                            .padding(.top, 24)

                        Text("Invest in your forever.")
                            .font(.playfair(36, weight: .black))
                            .foregroundColor(.white)
                            .multilineTextAlignment(.center)

                        // Period toggle
                        Picker("Period", selection: $selectedPeriod) {
                            ForEach(Period.allCases, id: \.self) { Text($0.rawValue) }
                        }
                        .pickerStyle(.segmented)
                        .padding(.horizontal, 40)

                        // Plan cards
                        VStack(spacing: 16) {
                            ForEach(plans, id: \.name) { plan in
                                PlanCard(plan: plan, isOwned: storeKit.currentTier.rawValue == plan.tierId) {
                                    Task { await purchase(plan: plan) }
                                }
                            }
                        }
                        .padding(.horizontal, 20)

                        if let error = purchaseError {
                            Text(error).font(.custom("Inter-Regular", size: 13)).foregroundColor(.red.opacity(0.8)).multilineTextAlignment(.center).padding(.horizontal, 30)
                        }

                        // Restore
                        Button(action: { Task { await storeKit.restorePurchases() } }) {
                            Text("Restore Purchases")
                                .font(.custom("Inter-Regular", size: 13))
                                .foregroundColor(.white.opacity(0.6))
                                .underline()
                        }

                        Text("Billed \(selectedPeriod.rawValue.lowercased()). Cancel anytime in Settings.")
                            .font(.custom("Inter-Regular", size: 11))
                            .foregroundColor(.white.opacity(0.4))
                            .multilineTextAlignment(.center)
                            .padding(.horizontal, 40)
                            .padding(.bottom, 40)
                    }
                }
            }
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: { dismiss() }) {
                        Image(systemName: "xmark.circle.fill")
                            .foregroundColor(.white.opacity(0.7))
                            .font(.system(size: 22))
                    }
                }
            }
        }
    }

    private func purchase(plan: PlanModel) async {
        guard let productId = plan.productId(for: selectedPeriod),
              let product = storeKit.products.first(where: { $0.id == productId }) else { return }
        isPurchasing = true
        defer { isPurchasing = false }
        do {
            _ = try await storeKit.purchase(product)
        } catch {
            purchaseError = error.localizedDescription
        }
    }

    private var plans: [PlanModel] {[
        PlanModel(name: "Free", tierId: "free", monthlyPrice: "Free", yearlyPrice: "Free",
                  features: ["3 discoveries/day", "Basic profile", "GPS Radar"], productBase: nil, isPopular: false),
        PlanModel(name: "Plus", tierId: "plus", monthlyPrice: "$19.99", yearlyPrice: "$149/yr",
                  features: ["Unlimited discoveries", "See all likes", "5 AI bios/month", "Incognito mode"], productBase: "app.virgins.plus", isPopular: true),
        PlanModel(name: "Ultimate", tierId: "ultimate", monthlyPrice: "$39.99", yearlyPrice: "$299/yr",
                  features: ["Everything in Plus", "Direct messaging", "Date planning AI", "Background check badge", "Ad-free"], productBase: "app.virgins.ultimate", isPopular: false),
    ]}
}

struct PlanModel {
    let name: String
    let tierId: String
    let monthlyPrice: String
    let yearlyPrice: String
    let features: [String]
    let productBase: String?
    let isPopular: Bool

    func productId(for period: PricingSheetView.Period) -> String? {
        guard let base = productBase else { return nil }
        return base + (period == .monthly ? ".monthly" : ".yearly")
    }
}

struct PlanCard: View {
    let plan: PlanModel
    let isOwned: Bool
    var onPurchase: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            if plan.isPopular {
                Text("Most Popular")
                    .font(.custom("Inter-Black", size: 10))
                    .foregroundColor(.virginsDark)
                    .padding(.horizontal, 10).padding(.vertical, 4)
                    .background(Color.virginsGold)
                    .clipShape(Capsule())
            }

            HStack {
                Text(plan.name).font(.playfair(22, weight: .bold)).foregroundColor(plan.isPopular ? .white : .virginsPurple)
                Spacer()
                if isOwned {
                    Text("Current Plan").font(.custom("Inter-Bold", size: 11)).foregroundColor(.virginsGold).padding(.horizontal, 8).padding(.vertical, 4).background(Color.virginsGold.opacity(0.15)).clipShape(Capsule())
                }
            }

            VStack(alignment: .leading, spacing: 8) {
                ForEach(plan.features, id: \.self) { feature in
                    Label(feature, systemImage: "checkmark")
                        .font(.custom("Inter-Regular", size: 13))
                        .foregroundColor(plan.isPopular ? .white.opacity(0.85) : .gray)
                }
            }

            if !isOwned && plan.tierId != "free" {
                Button(action: onPurchase) {
                    Text("Get \(plan.name)")
                        .font(.custom("Inter-Black", size: 15))
                        .foregroundColor(plan.isPopular ? .virginsDark : .white)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 14)
                        .background(plan.isPopular ? Color.virginsGold : Color.virginsPurple)
                        .clipShape(RoundedRectangle(cornerRadius: 14))
                }
            }
        }
        .padding(20)
        .background(plan.isPopular
            ? LinearGradient(colors: [.virginsDark, .virginsPurple], startPoint: .topLeading, endPoint: .bottomTrailing)
            : LinearGradient(colors: [.white, .white], startPoint: .top, endPoint: .bottom))
        .clipShape(RoundedRectangle(cornerRadius: 22))
        .shadow(color: plan.isPopular ? .virginsPurple.opacity(0.5) : .black.opacity(0.06), radius: 16, y: 6)
    }
}
