package app.virgins.ui.premium

import android.app.Activity
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.ViewModel
import app.virgins.service.BillingService
import app.virgins.service.SubscriptionTier
import app.virgins.ui.theme.*
import com.android.billingclient.api.ProductDetails
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject

@HiltViewModel
class PremiumViewModel @Inject constructor(
    val billingService: BillingService
) : ViewModel() {
    val tier = billingService.tier
    val products = billingService.products
}

data class PlanInfo(
    val name: String,
    val monthlyPrice: String,
    val yearlyPrice: String,
    val features: List<String>,
    val isPopular: Boolean = false
)

private val plans = listOf(
    PlanInfo(
        name = "Free",
        monthlyPrice = "$0",
        yearlyPrice = "$0",
        features = listOf("5 likes/day", "Basic matching", "Pledge verification", "Standard messaging")
    ),
    PlanInfo(
        name = "Plus",
        monthlyPrice = "$19.99",
        yearlyPrice = "$159.99/yr",
        features = listOf("Unlimited likes", "Advanced filters", "See who liked you", "ID verification", "Profile boost (1/mo)", "Priority support"),
        isPopular = true
    ),
    PlanInfo(
        name = "Ultimate",
        monthlyPrice = "$34.99",
        yearlyPrice = "$279.99/yr",
        features = listOf("Everything in Plus", "Background check", "Incognito mode", "Travel mode", "Analytics dashboard", "Unlimited boosts", "Concierge matching")
    )
)

@Composable
fun PricingScreen(
    viewModel: PremiumViewModel = hiltViewModel(),
    onClose: () -> Unit
) {
    var isYearly by remember { mutableStateOf(false) }
    val currentTier by viewModel.tier.collectAsState()
    val products by viewModel.products.collectAsState()
    val context = LocalContext.current
    val activity = context as? Activity

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Brush.verticalGradient(listOf(VirginsDark, VirginsPurple)))
            .verticalScroll(rememberScrollState())
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "Choose Your Plan",
                style = MaterialTheme.typography.headlineSmall,
                color = VirginsCream,
                fontWeight = FontWeight.Bold
            )
            IconButton(onClick = onClose) {
                Icon(Icons.Default.Close, null, tint = VirginsCream)
            }
        }

        Text(
            text = "Invest in your covenant journey",
            style = MaterialTheme.typography.bodyMedium,
            color = VirginGold,
            modifier = Modifier.padding(horizontal = 16.dp)
        )

        Spacer(Modifier.height(16.dp))

        // Period toggle
        Row(
            modifier = Modifier
                .padding(horizontal = 16.dp)
                .background(VirginsDarkSurface, RoundedCornerShape(24.dp))
                .padding(4.dp),
            horizontalArrangement = Arrangement.Center
        ) {
            listOf("Monthly", "Yearly").forEachIndexed { i, label ->
                val isSelected = (i == 1) == isYearly
                Button(
                    onClick = { isYearly = i == 1 },
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(20.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = if (isSelected) VirginGold else androidx.compose.ui.graphics.Color.Transparent,
                        contentColor = if (isSelected) VirginsDark else VirginsCream
                    ),
                    elevation = ButtonDefaults.buttonElevation(0.dp)
                ) {
                    Text(label, fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal)
                }
            }
        }
        if (isYearly) {
            Text(
                text = "Save up to 33% annually",
                color = VirginGold,
                style = MaterialTheme.typography.labelLarge,
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 4.dp)
            )
        }

        Spacer(Modifier.height(16.dp))

        plans.forEachIndexed { i, plan ->
            PlanCard(
                plan = plan,
                isYearly = isYearly,
                isCurrentPlan = when (i) {
                    0 -> currentTier == SubscriptionTier.FREE
                    1 -> currentTier == SubscriptionTier.PLUS
                    2 -> currentTier == SubscriptionTier.ULTIMATE
                    else -> false
                },
                onSelect = {
                    val productDetails = when (i) {
                        1 -> products.find { it.productId.contains("plus") }
                        2 -> products.find { it.productId.contains("ultimate") }
                        else -> null
                    }
                    if (productDetails != null && activity != null) {
                        viewModel.billingService.launchBillingFlow(activity, productDetails)
                    }
                }
            )
        }

        Spacer(Modifier.height(8.dp))
        TextButton(
            onClick = {
                viewModel.billingService.queryExistingPurchases()
            },
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("Restore Purchases", color = VirginsCream.copy(alpha = 0.6f),
                style = MaterialTheme.typography.bodySmall)
        }
        Spacer(Modifier.height(24.dp))
    }
}

@Composable
fun PlanCard(
    plan: PlanInfo,
    isYearly: Boolean,
    isCurrentPlan: Boolean,
    onSelect: () -> Unit
) {
    val isPopular = plan.isPopular
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 6.dp)
            .then(
                if (isPopular) Modifier.border(2.dp, VirginGold, RoundedCornerShape(20.dp))
                else Modifier
            ),
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(
            containerColor = if (isPopular) VirginsPurpleContainer else VirginsDarkSurface
        )
    ) {
        Column(modifier = Modifier.padding(20.dp)) {
            if (isPopular) {
                Box(
                    modifier = Modifier
                        .background(VirginGold, RoundedCornerShape(4.dp))
                        .padding(horizontal = 8.dp, vertical = 3.dp)
                ) {
                    Text("Most Popular", color = VirginsDark, style = MaterialTheme.typography.labelLarge,
                        fontWeight = FontWeight.Bold)
                }
                Spacer(Modifier.height(8.dp))
            }

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(plan.name, style = MaterialTheme.typography.headlineSmall,
                    color = VirginsCream, fontWeight = FontWeight.Bold)
                Text(
                    if (isYearly) plan.yearlyPrice else plan.monthlyPrice,
                    style = MaterialTheme.typography.titleLarge,
                    color = VirginGold,
                    fontWeight = FontWeight.Bold
                )
            }
            if (!isYearly && plan.name != "Free") {
                Text("per month", style = MaterialTheme.typography.bodySmall,
                    color = VirginsCream.copy(alpha = 0.6f))
            }

            Spacer(Modifier.height(12.dp))

            plan.features.forEach { feature ->
                Row(verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.padding(vertical = 2.dp)) {
                    Icon(Icons.Default.Check, null, tint = if (isPopular) VirginGold else VirginsPurpleLight,
                        modifier = Modifier.size(16.dp))
                    Spacer(Modifier.width(8.dp))
                    Text(feature, style = MaterialTheme.typography.bodySmall, color = VirginsCream.copy(alpha = 0.9f))
                }
            }

            if (plan.name != "Free") {
                Spacer(Modifier.height(16.dp))
                Button(
                    onClick = onSelect,
                    enabled = !isCurrentPlan,
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = if (isPopular) VirginGold else VirginsPurple,
                        contentColor = if (isPopular) VirginsDark else VirginsCream,
                        disabledContainerColor = VirginsCream.copy(alpha = 0.2f)
                    )
                ) {
                    Text(
                        if (isCurrentPlan) "Current Plan" else "Get ${plan.name}",
                        fontWeight = FontWeight.SemiBold
                    )
                }
            }
        }
    }
}
