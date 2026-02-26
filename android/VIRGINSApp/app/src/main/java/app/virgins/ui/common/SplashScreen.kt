package app.virgins.ui.common

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import app.virgins.ui.theme.*

@Composable
fun VirginsSplashScreen() {
    val scale by rememberInfiniteTransition(label = "pulse").animateFloat(
        initialValue = 0.95f,
        targetValue = 1.05f,
        animationSpec = infiniteRepeatable(
            animation = tween(1200, easing = EaseInOutSine),
            repeatMode = RepeatMode.Reverse
        ),
        label = "scale"
    )

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    colors = listOf(VirginsDark, VirginsPurple)
                )
            ),
        contentAlignment = Alignment.Center
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            RingsLogo(
                modifier = Modifier
                    .size(96.dp)
                    .scale(scale)
            )
            Spacer(Modifier.height(24.dp))
            Text(
                text = "VIRGINS",
                style = MaterialTheme.vTypography.headlineLarge,
                color = VirginsCream,
                fontWeight = FontWeight.Bold,
                letterSpacing = 8.sp
            )
            Spacer(Modifier.height(8.dp))
            Text(
                text = "Love Worth Waiting For",
                style = MaterialTheme.vTypography.bodyMedium,
                color = VirginGold,
                textAlign = TextAlign.Center
            )
        }
    }
}

// Simple extension to access typography without import conflict
private val MaterialTheme.vTypography get() = androidx.compose.material3.MaterialTheme.typography
