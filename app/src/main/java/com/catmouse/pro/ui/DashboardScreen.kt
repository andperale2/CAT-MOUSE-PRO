package com.catmouse.pro.ui

import androidx.compose.animation.*
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.catmouse.core.engines.DiagnosticManager
import com.catmouse.core.engines.SystemServiceState
import com.catmouse.core.engines.TechLogMessage
import com.catmouse.pro.ui.theme.*
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.*

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun DashboardScreen(diagnosticManager: DiagnosticManager) {
    var speed by remember { mutableFloatStateOf(80f) }
    var rpm by remember { mutableFloatStateOf(2400f) }

    val shizukuState by diagnosticManager.shizukuState.collectAsState()
    val accessibilityState by diagnosticManager.accessibilityState.collectAsState()
    val overlayState by diagnosticManager.overlayState.collectAsState()
    val inputState by diagnosticManager.inputState.collectAsState()
    val layerState by diagnosticManager.layerState.collectAsState()
    val vehicleState by diagnosticManager.vehicleState.collectAsState()
    val hudScannerState by diagnosticManager.hudScannerState.collectAsState()

    val logFeed by diagnosticManager.logFeed.collectAsState()
    
    val listState = rememberLazyListState()
    val scope = rememberCoroutineScope()

    // Smooth scroll logger to top on new feed
    LaunchedEffect(logFeed.size) {
        if (logFeed.isNotEmpty()) {
            listState.animateScrollToItem(0)
        }
    }

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
                    text = "CAT MOUSE PRO DIAGNOSTICS",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White,
                    letterSpacing = 1.sp
                )
                Text(
                    text = "Observe real-time telemetry systems, binders and active core mapping engines",
                    fontSize = 11.sp,
                    color = GrayTextMuted
                )
            }
        }

        // Speed gauges Row
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Speed dial Card
                Card(
                    modifier = Modifier.weight(1f).height(180.dp),
                    colors = CardDefaults.cardColors(containerColor = CardBackground),
                    border = CardStroke()
                ) {
                    Column(
                        modifier = Modifier.fillMaxSize().padding(12.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(
                            text = "SPEEDOMETER",
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = PrimaryIndigo,
                            letterSpacing = 1.sp
                        )
                        
                        Box(contentAlignment = Alignment.Center, modifier = Modifier.size(90.dp)) {
                            Canvas(modifier = Modifier.fillMaxSize()) {
                                drawArc(
                                    color = Color.White.copy(alpha = 0.05f),
                                    startAngle = 135f,
                                    sweepAngle = 270f,
                                    useCenter = false,
                                    style = Stroke(width = 8f, cap = StrokeCap.Round)
                                )
                                drawArc(
                                    color = PrimaryIndigo,
                                    startAngle = 135f,
                                    sweepAngle = (speed / 160f) * 270f,
                                    useCenter = false,
                                    style = Stroke(width = 8f, cap = StrokeCap.Round)
                                )
                            }
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Text(
                                    text = speed.toInt().toString(),
                                    fontSize = 24.sp,
                                    fontWeight = FontWeight.ExtraBold,
                                    color = Color.White
                                )
                                Text(
                                    text = "KM/H",
                                    fontSize = 9.sp,
                                    color = GrayTextMuted
                                )
                            }
                        }

                        Slider(
                            value = speed,
                            onValueChange = { speed = it },
                            valueRange = 0f..160f,
                            colors = SliderDefaults.colors(
                                thumbColor = PrimaryIndigo,
                                activeTrackColor = PrimaryIndigo,
                                inactiveTrackColor = Color.White.copy(alpha = 0.1f)
                            ),
                            modifier = Modifier.height(18.dp)
                        )
                    }
                }

                // RPM dial Card
                Card(
                    modifier = Modifier.weight(1f).height(180.dp),
                    colors = CardDefaults.cardColors(containerColor = CardBackground),
                    border = CardStroke()
                ) {
                    Column(
                        modifier = Modifier.fillMaxSize().padding(12.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(
                            text = "ENGINE REVOLUTIONS",
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = AccentRose,
                            letterSpacing = 1.sp
                        )
                        
                        Box(contentAlignment = Alignment.Center, modifier = Modifier.size(90.dp)) {
                            Canvas(modifier = Modifier.fillMaxSize()) {
                                drawArc(
                                    color = Color.White.copy(alpha = 0.05f),
                                    startAngle = 135f,
                                    sweepAngle = 270f,
                                    useCenter = false,
                                    style = Stroke(width = 8f, cap = StrokeCap.Round)
                                )
                                drawArc(
                                    color = AccentRose,
                                    startAngle = 135f,
                                    sweepAngle = (rpm / 8000f) * 270f,
                                    useCenter = false,
                                    style = Stroke(width = 8f, cap = StrokeCap.Round)
                                )
                            }
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Text(
                                    text = rpm.toInt().toString(),
                                    fontSize = 22.sp,
                                    fontWeight = FontWeight.ExtraBold,
                                    color = Color.White
                                )
                                Text(
                                    text = "RPM",
                                    fontSize = 9.sp,
                                    color = GrayTextMuted
                                )
                            }
                        }

                        Slider(
                            value = rpm,
                            onValueChange = { rpm = it },
                            valueRange = 800f..8000f,
                            colors = SliderDefaults.colors(
                                thumbColor = AccentRose,
                                activeTrackColor = AccentRose,
                                inactiveTrackColor = Color.White.copy(alpha = 0.1f)
                            ),
                            modifier = Modifier.height(18.dp)
                        )
                    }
                }
            }
        }

        // Subsystems Status Row (Priority 8)
        item {
            Text(
                text = "ENGINE DIAGNOSTIC STATUS (INTELLIGENT BINDERS)",
                fontSize = 10.sp,
                fontWeight = FontWeight.Bold,
                color = GrayTextMuted,
                letterSpacing = 1.sp,
                modifier = Modifier.padding(top = 8.dp)
            )
        }

        item {
            FlowRow(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                StatusBadge(name = "Shizuku Binder", value = shizukuState.name, color = mapTechColor(shizukuState))
                StatusBadge(name = "Accessibility Gestures", value = accessibilityState.name, color = mapTechColor(accessibilityState))
                StatusBadge(name = "Overlay Canvas", value = overlayState.name, color = mapTechColor(overlayState))
                StatusBadge(name = "Input Precision Driver", value = inputState.name, color = mapTechColor(inputState))
                StatusBadge(name = "Context Layer Matrix", value = layerState.name, color = mapTechColor(layerState))
                StatusBadge(name = "Vehicle Profile Engine", value = vehicleState.name, color = mapTechColor(vehicleState))
                StatusBadge(name = "HUD Vision Scanner", value = hudScannerState.name, color = mapTechColor(hudScannerState))
            }
        }

        // Terminal Output Logger
        item {
            Card(
                modifier = Modifier.fillMaxWidth().height(260.dp),
                colors = CardDefaults.cardColors(containerColor = Color.Black),
                border = CardStroke()
            ) {
                Column(modifier = Modifier.padding(12.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            Box(modifier = Modifier.size(6.dp).background(AccentEmerald, RoundedCornerShape(3.dp)))
                            Text(
                                "REAL-TIME LOG FEED",
                                fontSize = 10.sp,
                                fontFamily = FontFamily.Monospace,
                                color = Color.White.copy(alpha = 0.8f)
                            )
                        }
                        TextButton(
                            onClick = {
                                diagnosticManager.log("SYSTEM", "User cleared active memory logger stream.")
                            },
                            contentPadding = PaddingValues(horizontal = 8.dp, vertical = 2.dp)
                        ) {
                            Text("FLUSH", fontSize = 9.sp, color = AccentRose, fontFamily = FontFamily.Monospace)
                        }
                    }
                    Spacer(modifier = Modifier.height(8.dp))
                    LazyColumn(
                        state = listState,
                        modifier = Modifier.fillMaxSize().background(Color.Black)
                    ) {
                        items(logFeed) { log ->
                            Row(
                                modifier = Modifier.fillMaxWidth().padding(vertical = 3.dp),
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                Text(
                                    text = SimpleDateFormat("HH:mm:ss", Locale.getDefault()).format(Date(log.timestamp)),
                                    color = GrayTextMuted,
                                    fontSize = 10.sp,
                                    fontFamily = FontFamily.Monospace,
                                    modifier = Modifier.width(60.dp)
                                )
                                Text(
                                    text = "[${log.tag}]",
                                    color = when(log.tag) {
                                        "SYSTEM" -> PrimaryIndigo
                                        "GAME_DETECTION" -> AccentEmerald
                                        "HUD_SCANNER" -> AccentAmber
                                        "VEHICLE_ENGINE" -> AccentRose
                                        else -> Color.White.copy(alpha = 0.5f)
                                    },
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold,
                                    fontFamily = FontFamily.Monospace,
                                    modifier = Modifier.width(110.dp)
                                )
                                Text(
                                    text = log.message,
                                    color = Color.White.copy(alpha = 0.9f),
                                    fontSize = 10.sp,
                                    fontFamily = FontFamily.Monospace,
                                    modifier = Modifier.weight(1f)
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

fun mapTechColor(state: SystemServiceState): Color {
    return when(state) {
        SystemServiceState.ACTIVE -> AccentEmerald
        SystemServiceState.INITIALIZING -> AccentAmber
        SystemServiceState.ERROR -> AccentRose
        SystemServiceState.INACTIVE -> GrayTextMuted
    }
}

@Composable
fun StatusBadge(name: String, value: String, color: Color) {
    Surface(
        color = Color(0xFF14141A),
        shape = RoundedCornerShape(6.dp),
        border = CardStroke(),
        modifier = Modifier.padding(bottom = 4.dp)
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            Text(name, fontSize = 9.sp, color = Color.White.copy(alpha = 0.6f), fontWeight = FontWeight.SemiBold)
            Box(
                modifier = Modifier
                    .background(color.copy(alpha = 0.1f), RoundedCornerShape(4.dp))
                    .border(1.dp, color.copy(alpha = 0.3f), RoundedCornerShape(4.dp))
                    .padding(horizontal = 6.dp, vertical = 2.dp)
            ) {
                Text(value, fontSize = 8.sp, color = color, fontWeight = FontWeight.Bold, fontFamily = FontFamily.Monospace)
            }
        }
    }
}

@Composable
fun CardStroke(): BorderStroke {
    return BorderStroke(1.dp, Color.White.copy(alpha = 0.05f))
}
