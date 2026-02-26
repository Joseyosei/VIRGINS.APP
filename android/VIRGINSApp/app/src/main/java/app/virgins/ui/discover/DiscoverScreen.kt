package app.virgins.ui.discover

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import app.virgins.data.model.DiscoverProfile
import app.virgins.ui.common.TrustBadge
import app.virgins.ui.theme.*
import coil.compose.AsyncImage
import kotlin.math.absoluteValue

@Composable
fun DiscoverScreen(viewModel: DiscoverViewModel = hiltViewModel()) {
    val profiles by viewModel.profiles.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()
    val currentIndex by viewModel.currentIndex.collectAsState()
    val matchAlert by viewModel.matchAlert.collectAsState()

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(VirginsDark)
    ) {
        Column(modifier = Modifier.fillMaxSize()) {
            // Header
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(20.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Discover",
                    style = MaterialTheme.typography.headlineSmall,
                    color = VirginsCream,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = "Covenant Score™",
                    style = MaterialTheme.typography.bodySmall,
                    color = VirginGold
                )
            }

            Box(
                modifier = Modifier
                    .weight(1f)
                    .padding(horizontal = 16.dp),
                contentAlignment = Alignment.Center
            ) {
                when {
                    isLoading -> CircularProgressIndicator(color = VirginGold)
                    profiles.isEmpty() -> EmptyDiscoverView()
                    else -> {
                        val profile = profiles.getOrNull(currentIndex)
                        if (profile != null) {
                            SwipeableProfileCard(
                                profile = profile,
                                onLike = { viewModel.like(profile.user.id) },
                                onPass = { viewModel.pass(profile.user.id) }
                            )
                        }
                    }
                }
            }
        }

        // Match celebration overlay
        if (matchAlert != null) {
            MatchCelebrationDialog(
                onDismiss = { viewModel.dismissMatchAlert() }
            )
        }
    }
}

@Composable
fun SwipeableProfileCard(
    profile: DiscoverProfile,
    onLike: () -> Unit,
    onPass: () -> Unit
) {
    var offsetX by remember { mutableFloatStateOf(0f) }
    val animatedOffset by animateFloatAsState(offsetX, label = "swipe")
    val rotation = (animatedOffset / 20f).coerceIn(-15f, 15f)

    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .aspectRatio(0.75f)
                .rotate(rotation)
                .clip(RoundedCornerShape(20.dp))
                .pointerInput(Unit) {
                    detectDragGestures(
                        onDragEnd = {
                            when {
                                offsetX > 120f -> onLike()
                                offsetX < -120f -> onPass()
                            }
                            offsetX = 0f
                        },
                        onDrag = { _, amount -> offsetX += amount.x }
                    )
                }
        ) {
            // Photo
            val photoUrl = profile.user.profileImages.firstOrNull()
            if (photoUrl != null) {
                AsyncImage(
                    model = photoUrl,
                    contentDescription = null,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.fillMaxSize()
                )
            } else {
                Box(Modifier.fillMaxSize().background(VirginsPurpleContainer))
            }

            // Gradient overlay
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(
                        Brush.verticalGradient(
                            0f to Color.Transparent,
                            0.6f to Color.Transparent,
                            1f to VirginsDark.copy(alpha = 0.9f)
                        )
                    )
            )

            // Profile info
            Column(
                modifier = Modifier
                    .align(Alignment.BottomStart)
                    .padding(16.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = "${profile.user.displayName}, ${profile.user.age ?: "?"}",
                        style = MaterialTheme.typography.titleLarge,
                        color = VirginsCream,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(Modifier.width(8.dp))
                    TrustBadge(profile.user.trustLevel)
                }
                profile.user.location?.city?.let {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.LocationOn, null, tint = VirginGold, modifier = Modifier.size(14.dp))
                        Text(it, color = VirginGold, style = MaterialTheme.typography.bodySmall)
                    }
                }
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .background(VirginsPurple.copy(alpha = 0.8f), RoundedCornerShape(8.dp))
                            .padding(horizontal = 8.dp, vertical = 3.dp)
                    ) {
                        Text(
                            text = "${profile.score}% Match",
                            color = VirginGold,
                            style = MaterialTheme.typography.labelLarge,
                            fontWeight = FontWeight.Bold
                        )
                    }
                    profile.user.denomination?.let {
                        Spacer(Modifier.width(8.dp))
                        Text(it, color = VirginsCream.copy(alpha = 0.8f), style = MaterialTheme.typography.bodySmall)
                    }
                }
            }

            // Swipe indicators
            if (offsetX.absoluteValue > 40f) {
                Box(
                    modifier = Modifier
                        .align(if (offsetX > 0) Alignment.TopStart else Alignment.TopEnd)
                        .padding(24.dp)
                        .background(
                            if (offsetX > 0) VirginGold else ErrorRed,
                            RoundedCornerShape(8.dp)
                        )
                        .padding(horizontal = 12.dp, vertical = 6.dp)
                ) {
                    Text(
                        if (offsetX > 0) "LIKE" else "PASS",
                        color = if (offsetX > 0) VirginsDark else VirginsCream,
                        fontWeight = FontWeight.ExtraBold
                    )
                }
            }
        }

        Spacer(Modifier.height(24.dp))

        // Action buttons
        Row(
            horizontalArrangement = Arrangement.spacedBy(40.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            FloatingActionButton(
                onClick = onPass,
                containerColor = VirginsDarkSurface,
                contentColor = ErrorRed,
                modifier = Modifier.size(60.dp)
            ) {
                Icon(Icons.Default.Close, null, modifier = Modifier.size(28.dp))
            }
            FloatingActionButton(
                onClick = onLike,
                containerColor = VirginGold,
                contentColor = VirginsDark,
                modifier = Modifier.size(72.dp)
            ) {
                Icon(Icons.Default.Favorite, null, modifier = Modifier.size(32.dp))
            }
        }
    }
}

@Composable
fun EmptyDiscoverView() {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center,
        modifier = Modifier.fillMaxSize()
    ) {
        Text("💍", style = MaterialTheme.typography.displayLarge)
        Spacer(Modifier.height(16.dp))
        Text("No new profiles nearby", style = MaterialTheme.typography.titleMedium, color = VirginsCream)
        Text("Check back soon", style = MaterialTheme.typography.bodySmall, color = VirginGold)
    }
}

@Composable
fun MatchCelebrationDialog(onDismiss: () -> Unit) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(VirginsDark.copy(alpha = 0.85f)),
        contentAlignment = Alignment.Center
    ) {
        Card(
            modifier = Modifier.padding(32.dp),
            shape = RoundedCornerShape(20.dp),
            colors = CardDefaults.cardColors(containerColor = VirginsDarkSurface)
        ) {
            Column(
                modifier = Modifier.padding(32.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text("💍", style = MaterialTheme.typography.displayMedium)
                Spacer(Modifier.height(16.dp))
                Text(
                    "It's a Covenant Match!",
                    style = MaterialTheme.typography.headlineSmall,
                    color = VirginGold,
                    fontWeight = FontWeight.Bold
                )
                Spacer(Modifier.height(8.dp))
                Text(
                    "You've found someone who shares your covenant values. Start your courtship journey.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = VirginsCream.copy(alpha = 0.8f),
                    textAlign = androidx.compose.ui.text.style.TextAlign.Center
                )
                Spacer(Modifier.height(24.dp))
                Button(
                    onClick = onDismiss,
                    colors = ButtonDefaults.buttonColors(containerColor = VirginsPurple),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text("Begin Courtship", color = VirginsCream, fontWeight = FontWeight.SemiBold)
                }
            }
        }
    }
}
