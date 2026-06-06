package com.catmouse.pro

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.catmouse.core.SettingsManager
import com.catmouse.core.engines.*
import com.catmouse.pro.ui.*
import com.catmouse.pro.ui.theme.*
import dagger.hilt.android.AndroidEntryPoint
import javax.inject.Inject

@AndroidEntryPoint
class MainActivity : ComponentActivity() {

    @Inject
    lateinit var settingsManager: SettingsManager

    @Inject
    lateinit var gameDetectionManager: GameDetectionManager

    @Inject
    lateinit var hudScannerEngine: HudScannerEngine

    @Inject
    lateinit var layerManager: LayerManager

    @Inject
    lateinit var vehicleManager: VehicleManager

    @Inject
    lateinit var inputEngine: InputEngine

    @Inject
    lateinit var diagnosticManager: DiagnosticManager

    @Inject
    lateinit var importExportManager: ImportExportManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            CatMouseTheme {
                MainLayout(
                    settingsManager = settingsManager,
                    gameDetectionManager = gameDetectionManager,
                    hudScannerEngine = hudScannerEngine,
                    layerManager = layerManager,
                    vehicleManager = vehicleManager,
                    inputEngine = inputEngine,
                    diagnosticManager = diagnosticManager,
                    importExportManager = importExportManager
                )
            }
        }
    }
}

@Composable
fun MainLayout(
    settingsManager: SettingsManager,
    gameDetectionManager: GameDetectionManager,
    hudScannerEngine: HudScannerEngine,
    layerManager: LayerManager,
    vehicleManager: VehicleManager,
    inputEngine: InputEngine,
    diagnosticManager: DiagnosticManager,
    importExportManager: ImportExportManager
) {
    val navController = rememberNavController()
    var currentRoute by remember { mutableStateOf(Screen.Dashboard.route) }

    Scaffold(
        bottomBar = {
            NavigationBar(
                containerColor = CardBackground,
                tonalElevation = 8.dp
            ) {
                val items = listOf(
                    Triple(Screen.Dashboard, Icons.Default.Home, "Dashboard"),
                    Triple(Screen.Games, Icons.Default.PlayArrow, "Cloud"),
                    Triple(Screen.Devices, Icons.Default.Build, "Input"),
                    Triple(Screen.Profiles, Icons.Default.List, "Macros"),
                    Triple(Screen.Settings, Icons.Default.Settings, "HUD Setup")
                )

                items.forEach { (screen, icon, label) ->
                    val isSelected = currentRoute == screen.route
                    NavigationBarItem(
                        selected = isSelected,
                        onClick = {
                            currentRoute = screen.route
                            navController.navigate(screen.route) {
                                popUpTo(navController.graph.startDestinationId) {
                                    saveState = true
                                }
                                launchSingleTop = true
                                restoreState = true
                            }
                        },
                        icon = {
                            Icon(
                                imageVector = icon,
                                contentDescription = null,
                                tint = if (isSelected) PrimaryIndigo else GrayTextMuted
                            )
                        },
                        label = {
                            Text(
                                text = label,
                                color = if (isSelected) Color.White else GrayTextMuted
                            )
                        },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = PrimaryIndigo,
                            indicatorColor = PrimaryIndigo.copy(alpha = 0.15f)
                        )
                    )
                }
            }
        }
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .background(DarkBackground)
        ) {
            NavHost(
                navController = navController,
                startDestination = Screen.Dashboard.route
            ) {
                composable(Screen.Dashboard.route) {
                    DashboardScreen(diagnosticManager = diagnosticManager)
                }
                composable(Screen.Games.route) {
                    GamesScreen(
                        gameDetectionManager = gameDetectionManager,
                        hudScannerEngine = hudScannerEngine
                    )
                }
                composable(Screen.Devices.route) {
                    DevicesScreen(inputEngine = inputEngine)
                }
                composable(Screen.Profiles.route) {
                    ProfilesScreen(
                        layerManager = layerManager,
                        importExportManager = importExportManager
                    )
                }
                composable(Screen.Settings.route) {
                    SettingsScreen(
                        settingsManager = settingsManager,
                        vehicleManager = vehicleManager
                    )
                }
            }
        }
    }
}
