package app.virgins.ui.common

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material.icons.filled.Verified
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import app.virgins.ui.theme.*

@Composable
fun TrustBadge(
    level: Int,
    modifier: Modifier = Modifier,
    size: Dp = 20.dp,
    showLabel: Boolean = false
) {
    val (color, label) = when (level) {
        1 -> Pair(Color(0xFF2196F3), "Pledge")
        2 -> Pair(Color(0xFF4CAF50), "ID Verified")
        3 -> Pair(VirginsPurple, "Vouched")
        4 -> Pair(VirginGold, "Background")
        else -> Pair(Color.Gray, "Unverified")
    }

    Row(verticalAlignment = Alignment.CenterVertically, modifier = modifier) {
        Box(
            modifier = Modifier
                .size(size)
                .background(color.copy(alpha = 0.15f), CircleShape),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = if (level >= 3) Icons.Filled.Verified else Icons.Filled.Shield,
                contentDescription = "Trust level $level",
                tint = color,
                modifier = Modifier.size(size * 0.7f)
            )
        }
        if (showLabel) {
            Spacer(Modifier.width(4.dp))
            Text(text = label, color = color, fontSize = 11.sp)
        }
    }
}
