package app.virgins.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable

private val VIRGINSDarkColorScheme = darkColorScheme(
    primary = VirginsPurple,
    onPrimary = VirginsCream,
    primaryContainer = VirginsPurpleContainer,
    onPrimaryContainer = VirginsCream,
    secondary = VirginGold,
    onSecondary = VirginsDark,
    secondaryContainer = VirginGoldContainer,
    onSecondaryContainer = VirginGoldLight,
    background = VirginsDark,
    onBackground = VirginsCream,
    surface = VirginsDarkSurface,
    onSurface = VirginsCream,
    surfaceVariant = VirginsPurpleContainer,
    onSurfaceVariant = VirginsCream,
    error = ErrorRed,
    outline = VirginsPurpleLight
)

@Composable
fun VIRGINSTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = VIRGINSDarkColorScheme,
        typography = VIRGINSTypography,
        content = content
    )
}
