package app.virgins.service

import android.app.Activity
import android.content.Context
import com.android.billingclient.api.*
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.suspendCancellableCoroutine
import javax.inject.Inject
import javax.inject.Singleton
import kotlin.coroutines.resume

enum class SubscriptionTier { FREE, PLUS, ULTIMATE }

@Singleton
class BillingService @Inject constructor(@ApplicationContext private val context: Context) :
    PurchasesUpdatedListener {

    private val _tier = MutableStateFlow(SubscriptionTier.FREE)
    val tier: StateFlow<SubscriptionTier> = _tier.asStateFlow()

    private val _products = MutableStateFlow<List<ProductDetails>>(emptyList())
    val products: StateFlow<List<ProductDetails>> = _products.asStateFlow()

    private val billingClient = BillingClient.newBuilder(context)
        .setListener(this)
        .enablePendingPurchases()
        .build()

    private val productIds = listOf(
        "app.virgins.plus.monthly",
        "app.virgins.plus.yearly",
        "app.virgins.ultimate.monthly",
        "app.virgins.ultimate.yearly"
    )

    fun startConnection() {
        billingClient.startConnection(object : BillingClientStateListener {
            override fun onBillingSetupFinished(result: BillingResult) {
                if (result.responseCode == BillingClient.BillingResponseCode.OK) {
                    queryProducts()
                    queryExistingPurchases()
                }
            }
            override fun onBillingServiceDisconnected() {}
        })
    }

    private fun queryProducts() {
        val params = QueryProductDetailsParams.newBuilder()
            .setProductList(productIds.map {
                QueryProductDetailsParams.Product.newBuilder()
                    .setProductId(it)
                    .setProductType(BillingClient.ProductType.SUBS)
                    .build()
            }).build()

        billingClient.queryProductDetailsAsync(params) { result, details ->
            if (result.responseCode == BillingClient.BillingResponseCode.OK) {
                _products.value = details
            }
        }
    }

    fun queryExistingPurchases() {
        billingClient.queryPurchasesAsync(
            QueryPurchasesParams.newBuilder()
                .setProductType(BillingClient.ProductType.SUBS)
                .build()
        ) { result, purchases ->
            if (result.responseCode == BillingClient.BillingResponseCode.OK) {
                updateTierFromPurchases(purchases)
            }
        }
    }

    fun launchBillingFlow(activity: Activity, productDetails: ProductDetails): BillingResult {
        val offerToken = productDetails.subscriptionOfferDetails?.firstOrNull()?.offerToken ?: return BillingResult.newBuilder()
            .setResponseCode(BillingClient.BillingResponseCode.ERROR).build()

        val params = BillingFlowParams.newBuilder()
            .setProductDetailsParamsList(
                listOf(
                    BillingFlowParams.ProductDetailsParams.newBuilder()
                        .setProductDetails(productDetails)
                        .setOfferToken(offerToken)
                        .build()
                )
            ).build()

        return billingClient.launchBillingFlow(activity, params)
    }

    override fun onPurchasesUpdated(result: BillingResult, purchases: List<Purchase>?) {
        if (result.responseCode == BillingClient.BillingResponseCode.OK && purchases != null) {
            purchases.forEach { purchase ->
                if (purchase.purchaseState == Purchase.PurchaseState.PURCHASED && !purchase.isAcknowledged) {
                    billingClient.acknowledgePurchase(
                        AcknowledgePurchaseParams.newBuilder()
                            .setPurchaseToken(purchase.purchaseToken).build()
                    ) {}
                }
            }
            updateTierFromPurchases(purchases)
        }
    }

    private fun updateTierFromPurchases(purchases: List<Purchase>) {
        val activePurchaseIds = purchases
            .filter { it.purchaseState == Purchase.PurchaseState.PURCHASED }
            .flatMap { it.products }

        _tier.value = when {
            activePurchaseIds.any { it.contains("ultimate") } -> SubscriptionTier.ULTIMATE
            activePurchaseIds.any { it.contains("plus") } -> SubscriptionTier.PLUS
            else -> SubscriptionTier.FREE
        }
    }
}
