package app.virgins.ui.auth

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowForward
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import app.virgins.ui.theme.*
import kotlinx.coroutines.launch

data class OnboardingPage(
    val title: String,
    val subtitle: String,
    val emoji: String
)

private val pages = listOf(
    OnboardingPage("Your Covenant Journey", "Find a partner who shares your commitment to purity and faith.", "💍"),
    OnboardingPage("Faith-First Matching", "Our Covenant Algorithm matches by denomination, values, and intention.", "✝️"),
    OnboardingPage("4-Tier Trust System", "Verify your identity to show you're serious about covenant love.", "🛡️"),
    OnboardingPage("Real-Time Courtship", "Message your matches in a safe, monitored environment.", "💬"),
    OnboardingPage("Begin Your Story", "Join thousands finding covenant love. Create your profile today.", "🌹")
)

@Composable
fun OnboardingScreen(onComplete: () -> Unit) {
    val pagerState = rememberPagerState { pages.size }
    val scope = rememberCoroutineScope()

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Brush.verticalGradient(listOf(VirginsDark, VirginsPurple)))
    ) {
        HorizontalPager(
            state = pagerState,
            modifier = Modifier.fillMaxSize()
        ) { page ->
            OnboardingPageContent(pages[page])
        }

        // Indicators + button
        Column(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .padding(bottom = 48.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Dot indicators
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                repeat(pages.size) { index ->
                    Box(
                        modifier = Modifier
                            .size(if (pagerState.currentPage == index) 24.dp else 8.dp, 8.dp)
                            .clip(if (pagerState.currentPage == index) RoundedCornerShape(4.dp) else CircleShape)
                            .background(
                                if (pagerState.currentPage == index) VirginGold
                                else VirginsCream.copy(alpha = 0.4f)
                            )
                    )
                }
            }
            Spacer(Modifier.height(32.dp))

            if (pagerState.currentPage < pages.size - 1) {
                OutlinedButton(
                    onClick = {
                        scope.launch {
                            pagerState.animateScrollToPage(pagerState.currentPage + 1)
                        }
                    },
                    shape = CircleShape,
                    modifier = Modifier.size(64.dp),
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = VirginGold),
                    border = androidx.compose.foundation.BorderStroke(2.dp, VirginGold)
                ) {
                    Icon(Icons.Default.ArrowForward, null, tint = VirginGold)
                }
            } else {
                Button(
                    onClick = onComplete,
                    modifier = Modifier
                        .fillMaxWidth(0.8f)
                        .height(56.dp),
                    shape = RoundedCornerShape(28.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = VirginGold)
                ) {
                    Text(
                        "Create Covenant Profile",
                        color = VirginsDark,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }
    }
}

@Composable
private fun OnboardingPageContent(page: OnboardingPage) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 40.dp)
            .padding(top = 120.dp, bottom = 160.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(text = page.emoji, style = MaterialTheme.typography.displayLarge)
        Spacer(Modifier.height(32.dp))
        Text(
            text = page.title,
            style = MaterialTheme.typography.headlineMedium,
            color = VirginsCream,
            fontWeight = FontWeight.Bold
        )
        Spacer(Modifier.height(16.dp))
        Text(
            text = page.subtitle,
            style = MaterialTheme.typography.bodyLarge,
            color = VirginsCream.copy(alpha = 0.8f),
            textAlign = androidx.compose.ui.text.style.TextAlign.Center
        )
    }
}
