import Foundation
import StoreKit

@MainActor
final class StoreKitService: ObservableObject {
    static let shared = StoreKitService()

    // Product IDs — must match App Store Connect configuration
    enum ProductID: String, CaseIterable {
        case plusMonthly    = "app.virgins.plus.monthly"
        case plusYearly     = "app.virgins.plus.yearly"
        case ultimateMonthly = "app.virgins.ultimate.monthly"
        case ultimateYearly  = "app.virgins.ultimate.yearly"
    }

    @Published var products: [Product] = []
    @Published var purchasedProductIDs: Set<String> = []
    @Published var isLoading = false

    private var updateListenerTask: Task<Void, Error>?

    init() {
        updateListenerTask = listenForTransactions()
        Task { await loadProducts() }
    }

    deinit { updateListenerTask?.cancel() }

    var currentTier: SubscriptionTier {
        if purchasedProductIDs.contains(ProductID.ultimateMonthly.rawValue) ||
           purchasedProductIDs.contains(ProductID.ultimateYearly.rawValue) {
            return .ultimate
        } else if purchasedProductIDs.contains(ProductID.plusMonthly.rawValue) ||
                  purchasedProductIDs.contains(ProductID.plusYearly.rawValue) {
            return .plus
        }
        return .free
    }

    func loadProducts() async {
        isLoading = true
        defer { isLoading = false }
        do {
            products = try await Product.products(for: ProductID.allCases.map(\.rawValue))
            await updatePurchasedProducts()
        } catch {
            print("StoreKit load error: \(error)")
        }
    }

    func purchase(_ product: Product) async throws -> Bool {
        let result = try await product.purchase()
        switch result {
        case .success(let verification):
            let transaction = try checkVerified(verification)
            await updatePurchasedProducts()
            await transaction.finish()
            return true
        case .userCancelled:
            return false
        case .pending:
            return false
        @unknown default:
            return false
        }
    }

    func restorePurchases() async {
        try? await AppStore.sync()
        await updatePurchasedProducts()
    }

    private func updatePurchasedProducts() async {
        var purchased = Set<String>()
        for await result in Transaction.currentEntitlements {
            if case .verified(let transaction) = result, transaction.revocationDate == nil {
                purchased.insert(transaction.productID)
            }
        }
        purchasedProductIDs = purchased
    }

    private func listenForTransactions() -> Task<Void, Error> {
        Task.detached { [weak self] in
            for await result in Transaction.updates {
                if case .verified(let transaction) = result {
                    await self?.updatePurchasedProducts()
                    await transaction.finish()
                }
            }
        }
    }

    private func checkVerified<T>(_ result: VerificationResult<T>) throws -> T {
        switch result {
        case .unverified: throw StoreKitError.notEntitled
        case .verified(let value): return value
        }
    }
}

enum SubscriptionTier: String {
    case free, plus, ultimate

    var displayName: String {
        switch self {
        case .free:     return "Free"
        case .plus:     return "Plus"
        case .ultimate: return "Ultimate"
        }
    }

    var isPremium: Bool { self != .free }
}
