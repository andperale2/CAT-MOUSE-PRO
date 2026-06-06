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
import com.catmouse.core.engines.InputEngine
import com.catmouse.core.engines.ScopeSensitivityType
import com.catmouse.pro.ui.theme.*

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun DevicesScreen(inputEngine: InputEngine) {
    // Collect reactive InputEngine driver states
    val isRawInputEnabled by inputEngine.isRawInputEnabled.collectAsState()
    val mouseSmoothingCoef by inputEngine.mouseSmoothingCoef.collectAsState()
    val hardwareDpi by inputEngine.hardwareDpi.collectAsState()
    val isAccelCurveActive by inputEngine.isAccelerationCurveActive.collectAsState()
    val scopeSensitivities by inputEngine.scopeSensitivities.collectAsState()

    val devices = remember {
        listOf(
            Triple("Razer Orochi V2 Tactical Mouse", "MOUSE", "CONNECTED"),
            Triple("SteelSeries Apex Pro Keyboard", "KEYBOARD", "CONNECTED")
        )
    }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkBackground)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Main Title
        item {
            Column(modifier = Modifier.fillMaxWidth()) {
                Text(
                    text = "ADB INPUT PRECISION TUNING",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White,
                    letterSpacing = 1.sp
                )
                Text(
                    text = "Calibrate pointers speed scaling, hardware DPI multipliers and tactical optic scopes",
                    fontSize = 11.sp,
                    color = GrayTextMuted
                )
            }
        }

        // Active Devices List section
        item {
            Text(
                text = "BOUND ESCOPORTS HARDWARE DEVICES",
                fontSize = 10.sp,
                fontWeight = FontWeight.Bold,
                color = GrayTextMuted,
                letterSpacing = 1.sp
            )
        }

        items(devices) { (name, type, status) ->
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = CardBackground),
                border = CardStroke()
            ) {
                Row(
                    modifier = Modifier.padding(12.dp).fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                        Box(
                            modifier = Modifier
                                .size(34.dp)
                                .background(Color.Black, RoundedCornerShape(10.dp))
                                .border(1.dp, Color.White.copy(alpha = 0.05f), RoundedCornerShape(10.dp)),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = if (type == "MOUSE") Icons.Default.Build else Icons.Default.KeyboardArrowUp,
                                contentDescription = null,
                                tint = PrimaryIndigo,
                                modifier = Modifier.size(16.dp)
                            )
                        }
                        Column {
                            Text(name, fontSize = 11.sp, fontWeight = FontWeight.SemiBold, color = Color.White)
                            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                                Text(type, fontSize = 8.sp, color = GrayTextMuted, fontFamily = FontFamily.Monospace)
                                Box(modifier = Modifier.size(4.dp).background(AccentEmerald, RoundedCornerShape(2.dp)))
                                Text("USB SECURE BIND", fontSize = 8.sp, color = AccentEmerald, fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                    Text(
                        text = status,
                        fontSize = 9.sp,
                        fontWeight = FontWeight.ExtraBold,
                        color = AccentEmerald,
                        fontFamily = FontFamily.Monospace
                    )
                }
            }
        }

        // Advanced Mouse Calibration Panel
        item {
            Text(
                text = "MOUSE HARDWARE CALIBRATION",
                fontSize = 10.sp,
                fontWeight = FontWeight.Bold,
                color = GrayTextMuted,
                letterSpacing = 1.sp,
                modifier = Modifier.padding(top = 8.dp)
            )
        }

        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = CardBackground),
                border = CardStroke()
            ) {
                Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(14.dp)) {
                    // DPI Scale Input
                    Column {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("DPI Sensor Resolution Scaling", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                            Text("${hardwareDpi} DPI", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = PrimaryIndigo, fontFamily = FontFamily.Monospace)
                        }
                        Spacer(modifier = Modifier.height(4.dp))
                        Slider(
                            value = hardwareDpi.toFloat(),
                            onValueChange = { inputEngine.setHardwareDpi(it.toInt()) },
                            valueRange = 400f..16000f,
                            steps = 39,
                            colors = SliderDefaults.colors(
                                thumbColor = PrimaryIndigo,
                                activeTrackColor = PrimaryIndigo,
                                inactiveTrackColor = Color.White.copy(alpha = 0.1f)
                            )
                        )
                    }

                    // Mouse Smoothing Coefficient slider
                    Column {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("Mouse Movement Smoothing (Low-Pass Filter)", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                            Text(
                                "${(mouseSmoothingCoef * 100).toInt()}%",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                color = PrimaryIndigo,
                                fontFamily = FontFamily.Monospace
                            )
                        }
                        Spacer(modifier = Modifier.height(4.dp))
                        Slider(
                            value = mouseSmoothingCoef,
                            onValueChange = { inputEngine.setMouseSmoothing(it) },
                            valueRange = 0.0f..1.0f,
                            colors = SliderDefaults.colors(
                                thumbColor = PrimaryIndigo,
                                activeTrackColor = PrimaryIndigo,
                                inactiveTrackColor = Color.White.copy(alpha = 0.1f)
                            )
                        )
                    }
                }
            }
        }

        // Toggles Cards
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = CardBackground),
                border = CardStroke()
            ) {
                Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    // RAW Input Control
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text("Direct Kernel RAW Input", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                            Text("By-passes standard Android touch system metrics to lock mouse sub-pixel raw data stream", fontSize = 9.sp, color = GrayTextMuted)
                        }
                        Switch(
                            checked = isRawInputEnabled,
                            onCheckedChange = { inputEngine.setRawInput(it) },
                            colors = SwitchDefaults.colors(checkedThumbColor = PrimaryIndigo)
                        )
                    }

                    Divider(color = Color.White.copy(alpha = 0.05f))

                    // Acceleration Curve Control
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text("Exponential Velocity Acceleration Curves", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                            Text("Enables dynamic scale factors multiplying displacement values relative to target drag speed", fontSize = 9.sp, color = GrayTextMuted)
                        }
                        Switch(
                            checked = isAccelCurveActive,
                            onCheckedChange = { inputEngine.setAccelerationCurve(it) },
                            colors = SwitchDefaults.colors(checkedThumbColor = PrimaryIndigo)
                        )
                    }
                }
            }
        }

        // Section Scope sensitivities (Priority 5)
        item {
            Text(
                text = "GRANULAR SCOPE OPTIC SENSITIVITY MULTIPLIERS",
                fontSize = 10.sp,
                fontWeight = FontWeight.Bold,
                color = GrayTextMuted,
                letterSpacing = 1.sp,
                modifier = Modifier.padding(top = 8.dp)
            )
        }

        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = CardBackground),
                border = CardStroke()
            ) {
                Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(14.dp)) {
                    ScopeSensitivityType.values().forEach { scopeType ->
                        val sensitivityValue = scopeSensitivities[scopeType] ?: 1.0f
                        Column {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = when(scopeType) {
                                        ScopeSensitivityType.HIPFIRE -> "Hipfire (No Scope)"
                                        ScopeSensitivityType.ADS -> "ADS (Iron Sight/Red Dot)"
                                        ScopeSensitivityType.SCOPE_3X -> "3x Scope Optics"
                                        ScopeSensitivityType.SCOPE_4X -> "4x Scope Tactics"
                                        ScopeSensitivityType.SCOPE_6X -> "6x Rifle Scope"
                                        ScopeSensitivityType.SCOPE_8X -> "8x Heavy Sniper Scope"
                                    },
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Color.White
                                )
                                Text(
                                    text = "${String.format("%.2f", sensitivityValue)}x",
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = AccentEmerald,
                                    fontFamily = FontFamily.Monospace
                                )
                            }
                            Spacer(modifier = Modifier.height(2.dp))
                            Slider(
                                value = sensitivityValue,
                                onValueChange = { inputEngine.updateScopeSensitivity(scopeType, it) },
                                valueRange = 0.05f..3.0f,
                                colors = SliderDefaults.colors(
                                    thumbColor = AccentEmerald,
                                    activeTrackColor = AccentEmerald,
                                    inactiveTrackColor = Color.White.copy(alpha = 0.05f)
                                ),
                                modifier = Modifier.height(14.dp)
                            )
                        }
                    }
                }
            }
        }

        // Subsystems latency card
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Card(
                    modifier = Modifier.weight(1f),
                    colors = CardDefaults.cardColors(containerColor = CardBackground),
                    border = CardStroke()
                ) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Text("INTERPOLATION JITTER", fontSize = 8.sp, color = GrayTextMuted, fontFamily = FontFamily.Monospace)
                        Spacer(modifier = Modifier.height(2.dp))
                        Text("< 0.05 ms", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = AccentEmerald)
                        Text("Raw sensor jitter drift", fontSize = 8.sp, color = GrayTextMuted)
                    }
                }
                Card(
                    modifier = Modifier.weight(1f),
                    colors = CardDefaults.cardColors(containerColor = CardBackground),
                    border = CardStroke()
                ) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Text("STABILITY FACTOR", fontSize = 8.sp, color = GrayTextMuted, fontFamily = FontFamily.Monospace)
                        Spacer(modifier = Modifier.height(2.dp))
                        Text("99.98 %", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = AccentEmerald)
                        Text("Polled packet integrity", fontSize = 8.sp, color = GrayTextMuted)
                    }
                }
            }
        }
    }
}
