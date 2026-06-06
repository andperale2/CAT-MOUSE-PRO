package com.catmouse.pro.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val DarkColorScheme = darkColorScheme(
    primary = PrimaryIndigo,
    secondary = SecondaryIndigo,
    background = DarkBackground,
    surface = CardBackground,
    onPrimary = WhitePure,
    onSecondary = WhitePure,
    onBackground = WhitePure,
    onSurface = WhitePure,
    outline = GrayBorder
)

@Composable
fun CatMouseTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = DarkColorScheme,
        content = content
    )
}
