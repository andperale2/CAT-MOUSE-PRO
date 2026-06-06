package com.catmouse.pro.ui

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.catmouse.core.SettingsManager
import com.catmouse.core.engines.MovementCurveType
import com.catmouse.core.engines.VehicleManager
import com.catmouse.core.engines.VehicleType
import com.catmouse.pro.ui.theme.*
import kotlinx.coroutines.launch

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun SettingsScreen(
    settingsManager: SettingsManager,
    vehicleManager: VehicleManager
) {
    val scope = rememberCoroutineScope()

    val currentTheme by settingsManager.hudGaugeThemeFlow.collectAsState(initial = "cyber")
    val speedLimit by settingsManager.speedLimitFlow.collectAsState(initial = 110)

    // Vehicle Engine states
    val vehicleProfiles by vehicleManager.vehicleProfiles.collectAsState()
    val activeVehicle by vehicleManager.activeVehicle.collectAsState()

    var selectedVehicleType by remember { mutableStateOf(VehicleType.HELICOPTER) }
    val currentVehicleProfile = vehicleProfiles[selectedVehicleType]

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkBackground)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // App Title
        item {
            Column(modifier = Modifier.fillMaxWidth()) {
                Text(
                    text = "CAT MOUSE PRO PREFERENCES",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White,
                    letterSpacing = 1.sp
                )
                Text(
                    text = "Adjust wireless telemetry binders, vehicle profiles and visual HUD overlays",
                    fontSize = 11.sp,
                    color = GrayTextMuted
                )
            }
        }

        // Section: Select engine HUD Theme
        item {
            Text(
                text = "SELECT ENGINE HUD DESIGN STYLE",
                fontSize = 10.sp,
                fontWeight = FontWeight.Bold,
                color = GrayTextMuted,
                letterSpacing = 1.sp,
                modifier = Modifier.padding(top = 8.dp)
            )
        }

        item {
            GridRow {
                val themes = listOf(
                    "cyber" to "Cyber Reticle",
                    "sport" to "Sport Dynamic",
                    "classic_car" to "Classic Carbon",
                    "minimalist" to "Stealth Gray"
                )
                themes.forEach { (themeId, labelName) ->
                    val isActive = currentTheme == themeId
                    Card(
                        modifier = Modifier
                            .weight(1f)
                            .border(1.dp, if (isActive) PrimaryIndigo.copy(alpha = 0.4f) else Color.White.copy(alpha = 0.05f), RoundedCornerShape(12.dp)),
                        colors = CardDefaults.cardColors(containerColor = CardBackground),
                        onClick = {
                            scope.launch {
                                settingsManager.setHudGaugeTheme(themeId)
                            }
                        }
                    ) {
                        Column(
                            modifier = Modifier.padding(14.dp).fillMaxWidth(),
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            Icon(
                                imageVector = if (isActive) Icons.Default.CheckCircle else Icons.Default.Star,
                                contentDescription = null,
                                tint = if (isActive) PrimaryIndigo else GrayTextMuted,
                                modifier = Modifier.size(16.dp)
                            )
                            Text(
                                text = labelName,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = if (isActive) Color.White else GrayTextMuted
                            )
                        }
                    }
                }
            }
        }

        // Section: Tactical Vehicle Profiles Editor (Priority 4)
        item {
            Text(
                text = "TACTICAL VEHICLES CALIBRATION PANEL",
                fontSize = 10.sp,
                fontWeight = FontWeight.Bold,
                color = GrayTextMuted,
                letterSpacing = 1.sp,
                modifier = Modifier.padding(top = 12.dp)
            )
        }

        // Horizontal Grid list of vehicle types
        item {
            FlowRow(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(6.dp),
                verticalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                VehicleType.values().forEach { vType ->
                    val isSel = selectedVehicleType == vType
                    val isMounted = activeVehicle == vType
                    Button(
                        onClick = { selectedVehicleType = vType },
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (isSel) PrimaryIndigo.copy(alpha = 0.15f) else Color.White.copy(alpha = 0.05f),
                            contentColor = if (isSel) Color.White else GrayTextMuted
                        ),
                        shape = RoundedCornerShape(8.dp),
                        contentPadding = PaddingValues(horizontal = 10.dp, vertical = 6.dp),
                        modifier = Modifier
                            .height(32.dp)
                            .border(
                                1.dp,
                                if (isSel) PrimaryIndigo.copy(alpha = 0.4f) else Color.White.copy(alpha = 0.05f),
                                RoundedCornerShape(8.dp)
                            )
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                            if (isMounted) {
                                Box(modifier = Modifier.size(5.dp).background(AccentEmerald, RoundedCornerShape(2.5f)))
                            }
                            Text(vType.name, fontSize = 8.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }

        // Vehicle editor card
        if (currentVehicleProfile != null) {
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = CardBackground),
                    border = CardStroke()
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text(currentVehicleProfile.name, fontSize = 13.sp, fontWeight = FontWeight.Bold, color = Color.White)
                                Text("Vehicle type: ${currentVehicleProfile.type}", fontSize = 9.sp, color = GrayTextMuted)
                            }

                            val isMounted = activeVehicle == currentVehicleProfile.type
                            Button(
                                onClick = {
                                    vehicleManager.selectActiveVehicle(
                                        if (isMounted) null else currentVehicleProfile.type
                                    )
                                },
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = if (isMounted) AccentRose.copy(alpha = 0.15f) else PrimaryIndigo.copy(alpha = 0.15f),
                                    contentColor = if (isMounted) AccentRose else PrimaryIndigo
                                ),
                                shape = RoundedCornerShape(6.dp),
                                contentPadding = PaddingValues(horizontal = 12.dp, vertical = 2.dp),
                                modifier = Modifier
                                    .height(26.dp)
                                    .border(1.dp, if (isMounted) AccentRose.copy(alpha = 0.3f) else PrimaryIndigo.copy(alpha = 0.3f), RoundedCornerShape(6.dp))
                            ) {
                                Text(
                                    text = if (isMounted) "DISMOUNT DRIVER" else "MOUNT VEHICLE",
                                    fontSize = 9.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(14.dp))

                        // Steering Slider
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("Steering Sensitivity Multiplier", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                            Text(
                                "${String.format("%.1f", currentVehicleProfile.steeringSensitivity)}x",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = PrimaryIndigo,
                                fontFamily = FontFamily.Monospace
                            )
                        }
                        Slider(
                            value = currentVehicleProfile.steeringSensitivity,
                            onValueChange = { vehicleManager.updateVehicleSensitivity(currentVehicleProfile.type, it) },
                            valueRange = 0.5f..3.5f,
                            colors = SliderDefaults.colors(
                                thumbColor = PrimaryIndigo,
                                activeTrackColor = PrimaryIndigo,
                                inactiveTrackColor = Color.White.copy(alpha = 0.05f)
                            ),
                            modifier = Modifier.height(18.dp)
                        )

                        Spacer(modifier = Modifier.height(12.dp))

                        // Curve toggle selector
                        Text("Active Movement Physics Curve style", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        Spacer(modifier = Modifier.height(6.dp))
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            MovementCurveType.values().forEach { curve ->
                                val isCurveSel = currentVehicleProfile.curve == curve
                                Button(
                                    onClick = { vehicleManager.updateVehicleCurve(currentVehicleProfile.type, curve) },
                                    colors = ButtonDefaults.buttonColors(
                                        containerColor = if (isCurveSel) AccentEmerald.copy(alpha = 0.15f) else Color.White.copy(alpha = 0.03f),
                                        contentColor = if (isCurveSel) AccentEmerald else Color.White
                                    ),
                                    shape = RoundedCornerShape(6.dp),
                                    contentPadding = PaddingValues(horizontal = 4.dp, vertical = 2.dp),
                                    modifier = Modifier
                                        .weight(1f)
                                        .height(28.dp)
                                        .border(
                                            1.dp,
                                            if (isCurveSel) AccentEmerald.copy(alpha = 0.3f) else Color.White.copy(alpha = 0.03f),
                                            RoundedCornerShape(6.dp)
                                        )
                                ) {
                                    Text(curve.name.replace("_", " "), fontSize = 7.sp, fontWeight = FontWeight.Bold)
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(14.dp))

                        // Custom Keybindings Mapping
                        Text("MAPPED TELEMETRY GESTURES & KEYS", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = GrayTextMuted)
                        Spacer(modifier = Modifier.height(6.dp))

                        currentVehicleProfile.keyBindings.forEach { (action, key) ->
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(vertical = 3.dp)
                                    .background(Color.Black.copy(alpha = 0.12f), RoundedCornerShape(4.dp))
                                    .padding(horizontal = 8.dp, vertical = 4.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(action, fontSize = 10.sp, color = Color.White)
                                Box(
                                    modifier = Modifier
                                        .background(PrimaryIndigo.copy(alpha = 0.12f), RoundedCornerShape(4.dp))
                                        .border(1.dp, PrimaryIndigo.copy(alpha = 0.2f), RoundedCornerShape(4.dp))
                                        .padding(horizontal = 6.dp, vertical = 2.dp)
                                ) {
                                    Text(key, fontSize = 9.sp, color = PrimaryIndigo, fontWeight = FontWeight.Bold, fontFamily = FontFamily.Monospace)
                                }
                            }
                        }
                    }
                }
            }
        }

        // Section: Threshold values
        item {
            Text(
                text = "SPEED LIMIT WARNING COGNITION",
                fontSize = 10.sp,
                fontWeight = FontWeight.Bold,
                color = GrayTextMuted,
                letterSpacing = 1.sp,
                modifier = Modifier.padding(top = 12.dp)
            )
        }

        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = CardBackground),
                border = CardStroke()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "Alert boundary range threshold",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                            Text(
                                text = speedLimit.toString(),
                                fontSize = 14.sp,
                                color = AccentRose,
                                fontWeight = FontWeight.ExtraBold,
                                fontFamily = FontFamily.Monospace
                            )
                            Text("KM/H", fontSize = 9.sp, color = GrayTextMuted)
                        }
                    }

                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Warn HUD flash background sequences if car telemetry metrics exceed this maximum rate value limit.",
                        fontSize = 10.sp,
                        color = GrayTextMuted,
                        lineHeight = 14.sp
                    )

                    Spacer(modifier = Modifier.height(14.dp))
                    @Suppress("DEPRECATION")
                    Slider(
                        value = speedLimit.toFloat(),
                        onValueChange = {
                            scope.launch {
                                settingsManager.setSpeedLimit(it.toInt())
                            }
                        },
                        valueRange = 50f..180f,
                        colors = SliderDefaults.colors(
                            thumbColor = AccentRose,
                            activeTrackColor = AccentRose,
                            inactiveTrackColor = Color.White.copy(alpha = 0.1f)
                        )
                    )
                }
            }
        }

        // Section: Companion details
        item {
            Text(
                text = "ADB & SHIZUKU SERVICES",
                fontSize = 10.sp,
                fontWeight = FontWeight.Bold,
                color = GrayTextMuted,
                letterSpacing = 1.sp,
                modifier = Modifier.padding(top = 12.dp)
            )
        }

        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = CardBackground),
                border = CardStroke()
            ) {
                Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text(
                        text = "Android Gradle multi-module structure bindings:",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                    Text(
                        text = "• :shizuku -- binder auth, AIDL interfaces, root touched gestures\n" +
                               "• :overlay -- window injection framework canvas panels\n" +
                               "• :input -- Razer multipliers calibration, pointer curves coefficients\n" +
                               "• :vehicles -- OBD simulator speed models dials mapping",
                        fontSize = 10.sp,
                        color = GrayTextMuted,
                        lineHeight = 16.sp
                    )
                }
            }
        }
    }
}

@Composable
fun GridRow(content: @Composable RowScope.() -> Unit) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(10.dp),
        content = content
    )
}
