package app.virgins.ui.profile

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import app.virgins.data.model.User
import app.virgins.data.model.UserAnalytics
import app.virgins.data.repository.AuthRepository
import app.virgins.data.repository.VerificationRepository
import app.virgins.ui.common.TrustBadge
import app.virgins.ui.theme.*
import coil.compose.AsyncImage
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class ProfileViewModel @Inject constructor(
    private val authRepo: AuthRepository,
    private val verificationRepo: VerificationRepository
) : ViewModel() {
    private val _user = MutableStateFlow<User?>(null)
    val user: StateFlow<User?> = _user.asStateFlow()

    private val _analytics = MutableStateFlow<UserAnalytics?>(null)
    val analytics: StateFlow<UserAnalytics?> = _analytics.asStateFlow()

    init {
        viewModelScope.launch {
            authRepo.getMe().onSuccess { _user.value = it }
            verificationRepo.getAnalytics().onSuccess { _analytics.value = it }
        }
    }

    fun logout() {
        viewModelScope.launch { authRepo.logout() }
    }
}

@Composable
fun ProfileScreen(
    viewModel: ProfileViewModel = hiltViewModel(),
    onLogout: () -> Unit,
    onOpenPricing: () -> Unit
) {
    val user by viewModel.user.collectAsState()
    val analytics by viewModel.analytics.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(VirginsDark)
            .verticalScroll(rememberScrollState())
    ) {
        // Gradient header card
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(
                    Brush.verticalGradient(listOf(VirginsDark, VirginsPurple, VirginsPurple.copy(alpha = 0.8f)))
                )
                .padding(24.dp)
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.fillMaxWidth()) {
                val photoUrl = user?.profileImages?.firstOrNull()
                if (photoUrl != null) {
                    AsyncImage(
                        model = photoUrl,
                        contentDescription = null,
                        contentScale = ContentScale.Crop,
                        modifier = Modifier
                            .size(100.dp)
                            .clip(CircleShape)
                            .background(VirginsPurpleContainer)
                    )
                } else {
                    Box(
                        modifier = Modifier
                            .size(100.dp)
                            .clip(CircleShape)
                            .background(Brush.radialGradient(listOf(VirginsPurpleLight, VirginsDark))),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            user?.displayName?.first()?.uppercaseChar()?.toString() ?: "V",
                            style = MaterialTheme.typography.headlineLarge,
                            color = VirginsCream
                        )
                    }
                }

                Spacer(Modifier.height(12.dp))
                Text(
                    user?.displayName ?: "",
                    style = MaterialTheme.typography.titleLarge,
                    color = VirginsCream,
                    fontWeight = FontWeight.Bold
                )
                Row(verticalAlignment = Alignment.CenterVertically) {
                    TrustBadge(user?.trustLevel ?: 1, showLabel = true)
                }
                if (user?.isPremium == true) {
                    Spacer(Modifier.height(4.dp))
                    Text(user?.subscriptionTier?.replaceFirstChar { it.uppercase() } ?: "",
                        color = VirginGold, style = MaterialTheme.typography.labelLarge)
                }
            }
        }

        // Stats row
        user?.let { u ->
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                horizontalArrangement = Arrangement.SpaceEvenly
            ) {
                StatItem("Matches", analytics?.matchCount?.toString() ?: "—", Icons.Default.Favorite)
                StatItem("Likes", analytics?.likeCount?.toString() ?: "—", Icons.Default.ThumbUp)
                StatItem("Profile", "${analytics?.profileCompleteness ?: 0}%", Icons.Default.Person)
            }
        }

        // Upgrade banner (free users)
        if (user?.isPremium != true) {
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(
                    containerColor = VirginGold
                )
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(Icons.Default.Star, null, tint = VirginsDark)
                    Spacer(Modifier.width(12.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text("Upgrade to Premium", style = MaterialTheme.typography.titleMedium,
                            color = VirginsDark, fontWeight = FontWeight.Bold)
                        Text("Unlock analytics, boosts & more", style = MaterialTheme.typography.bodySmall,
                            color = VirginsDark.copy(alpha = 0.8f))
                    }
                    Button(
                        onClick = onOpenPricing,
                        colors = ButtonDefaults.buttonColors(containerColor = VirginsDark)
                    ) { Text("Upgrade", color = VirginGold) }
                }
            }
        }

        // Settings section
        Column(modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)) {
            Text("Settings", style = MaterialTheme.typography.titleMedium,
                color = VirginGold, modifier = Modifier.padding(bottom = 8.dp))
            SettingsItem(Icons.Default.Edit, "Edit Profile") {}
            SettingsItem(Icons.Default.Shield, "Trust Verification") {}
            SettingsItem(Icons.Default.CreditCard, "Subscription") { onOpenPricing() }
            SettingsItem(Icons.Default.LocationOn, "Location") {}
            SettingsItem(Icons.Default.Notifications, "Notifications") {}
            Divider(color = VirginsCream.copy(alpha = 0.1f), modifier = Modifier.padding(vertical = 8.dp))
            SettingsItem(Icons.Default.Logout, "Sign Out", tint = ErrorRed) {
                viewModel.logout()
                onLogout()
            }
        }
    }
}

@Composable
private fun StatItem(label: String, value: String, icon: ImageVector) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Box(
            modifier = Modifier
                .size(48.dp)
                .background(VirginsPurple.copy(alpha = 0.2f), CircleShape),
            contentAlignment = Alignment.Center
        ) {
            Icon(icon, null, tint = VirginGold, modifier = Modifier.size(22.dp))
        }
        Spacer(Modifier.height(4.dp))
        Text(value, style = MaterialTheme.typography.titleMedium, color = VirginsPurpleLight, fontWeight = FontWeight.Bold)
        Text(label, style = MaterialTheme.typography.bodySmall, color = VirginsCream.copy(alpha = 0.6f))
    }
}

@Composable
private fun SettingsItem(
    icon: ImageVector,
    label: String,
    tint: androidx.compose.ui.graphics.Color = VirginsCream,
    onClick: () -> Unit
) {
    TextButton(
        onClick = onClick,
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(icon, null, tint = if (tint == VirginsCream) VirginGold else tint)
            Spacer(Modifier.width(12.dp))
            Text(label, color = tint, style = MaterialTheme.typography.bodyLarge)
            Spacer(Modifier.weight(1f))
            Icon(Icons.Default.ChevronRight, null, tint = VirginsCream.copy(alpha = 0.4f))
        }
    }
}
