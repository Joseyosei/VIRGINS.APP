package app.virgins.ui.common

import androidx.compose.foundation.Canvas
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.Stroke
import app.virgins.ui.theme.VirginGold
import app.virgins.ui.theme.VirginsCream

@Composable
fun RingsLogo(modifier: Modifier = Modifier, ringColor: Color = VirginGold) {
    Canvas(modifier = modifier) {
        val w = size.width
        val h = size.height
        val stroke = Stroke(width = w * 0.055f)
        val r = w * 0.28f

        // Left ring
        drawCircle(
            color = ringColor,
            radius = r,
            center = Offset(w * 0.38f, h * 0.42f),
            style = stroke
        )
        // Right ring
        drawCircle(
            color = ringColor,
            radius = r,
            center = Offset(w * 0.62f, h * 0.42f),
            style = stroke
        )
        // Diamond
        val cx = w * 0.5f
        val cy = h * 0.72f
        val dw = w * 0.14f
        val dh = h * 0.14f
        val diamond = Path().apply {
            moveTo(cx, cy - dh)
            lineTo(cx + dw, cy)
            lineTo(cx, cy + dh)
            lineTo(cx - dw, cy)
            close()
        }
        drawPath(diamond, color = VirginsCream)
        drawPath(diamond, color = ringColor, style = Stroke(width = w * 0.03f))
    }
}
