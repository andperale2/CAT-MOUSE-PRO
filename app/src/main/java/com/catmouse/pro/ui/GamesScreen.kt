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
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.catmouse.core.engines.GameDetectionManager
import com.catmouse.core.engines.HudElementType
import com.catmouse.core.engines.HudScannerEngine
import com.catmouse.pro.ui.theme.*
import kotlinx.coroutines.launch

@OptIn(ExperimentalLayoutApi::class, ExperimentalMaterial3Api::class)
@Composable
fun GamesScreen(
    gameDetectionManager: GameDetectionManager,
    hudScannerEngine: HudScannerEngine
) {
    val coroutineScope = rememberCoroutineScope()
    
    // Game Detection states
    val installedGames by gameDetectionManager.installedGames.collectAsState()
    val gameProfiles by gameDetectionManager.currentGameProfiles.collectAsState()
    val activeGamePackage by gameDetectionManager.activeGamePackage.collectAsState()

    // HUD Scanner states
    val isScanning by hudScannerEngine.isScanning.collectAsState()
    val scannedElements by hudScannerEngine.scannedElements.collectAsState()

    var selectedGamePkg by remember { mutableStateOf("") }
    
    // Choose first game as selected default
    LaunchedEffect(installedGames) {
        if (installedGames.isNotEmpty() && selectedGamePkg.isBlank()) {
            selectedGamePkg = installedGames.first().packageName
        }
    }

    val selectedGame = installedGames.find { it.packageName == selectedGamePkg }
    val displayMetrics = remember { gameDetectionManager.detectScreenPhysicalMetrics() }

    // Dialog state for adding a custom sub-profile
    var showProfileDialog by remember { mutableStateOf(false) }
    var newProfileName by remember { mutableStateOf("") }
    var newProfileMode by remember { mutableStateOf("MULTIPLAYER") }

    // Dialog state for registering games manually
    var showAddGameDialog by remember { mutableStateOf(false) }
    var manuallyGamePkg by remember { mutableStateOf("") }
    var manuallyGameLabel by remember { mutableStateOf("") }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkBackground)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Upper Title
        item {
            Column(modifier = Modifier.fillMaxWidth()) {
                Text(
                    text = "tactical game mapping center",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White,
                    letterSpacing = 1.sp
                )
                Text(
                    text = "Configure specific profile macros and relative HUD scanners per game",
                    fontSize = 11.sp,
                    color = GrayTextMuted
                )
            }
        }

        // Section: Devices Hardware Spec Viewport
        item {
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
                    Column {
                        Text("viewport hardware metrics", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color.White)
                        Text(
                            text = "Aspect: ${displayMetrics.aspectRatioLabel} (${displayMetrics.widthPx}x${displayMetrics.heightPx} px)",
                            fontSize = 9.sp,
                            color = GrayTextMuted
                        )
                    }
                    Box(
                        modifier = Modifier
                            .background(PrimaryIndigo.copy(alpha = 0.1f), RoundedCornerShape(4.dp))
                            .border(1.dp, PrimaryIndigo.copy(alpha = 0.3f), RoundedCornerShape(4.dp))
                            .padding(horizontal = 8.dp, vertical = 4.dp)
                    ) {
                        Text("RELATIVE GPS COORDS BIND", fontSize = 8.sp, color = PrimaryIndigo, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }

        // Horizontal tabs of detected games
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "TARGET GAMES INSTALLED / MAPPED",
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Bold,
                    color = GrayTextMuted,
                    letterSpacing = 1.sp
                )
                TextButton(
                    onClick = { showAddGameDialog = true },
                    contentPadding = PaddingValues(horizontal = 8.dp, vertical = 2.dp),
                    modifier = Modifier.height(26.dp)
                ) {
                    Icon(Icons.Default.Add, contentDescription = null, modifier = Modifier.size(11.dp), tint = PrimaryIndigo)
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("REGISTER GAME MANUAL", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = PrimaryIndigo)
                }
            }
        }

        item {
            FlowRow(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                installedGames.forEach { game ->
                    val isSelected = selectedGamePkg == game.packageName
                    val isActiveRun = activeGamePackage == game.packageName
                    Button(
                        onClick = { selectedGamePkg = game.packageName },
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (isSelected) PrimaryIndigo.copy(alpha = 0.15f) else Color.White.copy(alpha = 0.05f),
                            contentColor = if (isSelected) Color.White else GrayTextMuted
                        ),
                        shape = RoundedCornerShape(10.dp),
                        contentPadding = PaddingValues(horizontal = 14.dp, vertical = 8.dp),
                        modifier = Modifier
                            .height(42.dp)
                            .border(
                                1.dp,
                                if (isSelected) PrimaryIndigo.copy(alpha = 0.5f) else Color.White.copy(alpha = 0.05f),
                                RoundedCornerShape(10.dp)
                            )
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            if (isActiveRun) {
                                Box(modifier = Modifier.size(6.dp).background(AccentEmerald, RoundedCornerShape(3.dp)))
                            }
                            Text(game.name, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }

        // Active Selected Game Details / SubProfiles Block
        if (selectedGame != null) {
            val profiles = gameProfiles[selectedGame.packageName] ?: emptyList()
            
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
                                Text(selectedGame.name, fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Color.White)
                                Text(selectedGame.packageName, fontSize = 9.sp, color = GrayTextMuted, fontFamily = FontFamily.Monospace)
                            }
                            
                            val isFocusedNow = activeGamePackage == selectedGame.packageName
                            Button(
                                onClick = {
                                    gameDetectionManager.selectActiveGame(
                                        if (isFocusedNow) null else selectedGame.packageName
                                    )
                                },
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = if (isFocusedNow) AccentEmerald.copy(alpha = 0.15f) else PrimaryIndigo,
                                    contentColor = Color.White
                                ),
                                shape = RoundedCornerShape(6.dp),
                                contentPadding = PaddingValues(horizontal = 12.dp, vertical = 2.dp),
                                modifier = Modifier.height(26.dp)
                            ) {
                                Text(
                                    text = if (isFocusedNow) "DOCK FOCUS IN HUD" else "SIMULATE LAUNCH",
                                    fontSize = 9.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(12.dp))
                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                            Column {
                                Text("VERSION", fontSize = 8.sp, color = GrayTextMuted)
                                Text(selectedGame.installedVersion, fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color.White)
                            }
                            Column {
                                Text("TARGET API", fontSize = 8.sp, color = GrayTextMuted)
                                Text(selectedGame.targetSdkVersion.toString(), fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color.White)
                            }
                            Column {
                                Text("SIZE FLOP", fontSize = 8.sp, color = GrayTextMuted)
                                Text("${selectedGame.sizeMb} MB", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color.White)
                            }
                        }

                        Divider(modifier = Modifier.padding(vertical = 12.dp), color = Color.White.copy(alpha = 0.05f))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "Tactical Profile Assignments",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = GrayTextMuted
                            )
                            IconButton(
                                onClick = { showProfileDialog = true },
                                modifier = Modifier.size(24.dp)
                            ) {
                                Icon(Icons.Default.AddCircle, contentDescription = "Add Profile Slot", tint = PrimaryIndigo, modifier = Modifier.size(18.dp))
                            }
                        }

                        Spacer(modifier = Modifier.height(6.dp))

                        profiles.forEach { profile ->
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(vertical = 4.dp)
                                    .background(Color.Black.copy(alpha = 0.15f), RoundedCornerShape(6.dp))
                                    .padding(horizontal = 10.dp, vertical = 6.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column {
                                    Text(profile.profileName, fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color.White)
                                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                                        Text(profile.mode, fontSize = 8.sp, color = PrimaryIndigo, fontWeight = FontWeight.Black)
                                        Box(modifier = Modifier.size(3.dp).background(Color.White.copy(alpha = 0.2f), RoundedCornerShape(1f)))
                                        Text(if (profile.isAutoGenerated) "AUTO GEN" else "USER", fontSize = 8.sp, color = Color.White.copy(alpha = 0.4f))
                                    }
                                }

                                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                                    IconButton(
                                        onClick = {
                                            gameDetectionManager.deleteProfile(selectedGame.packageName, profile.id)
                                        },
                                        modifier = Modifier.size(20.dp)
                                    ) {
                                        Icon(Icons.Default.Delete, contentDescription = null, tint = AccentRose.copy(alpha = 0.6f), modifier = Modifier.size(14.dp))
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // HUD Scanner vision board (Priority 2)
            item {
                Text(
                    text = "Tactical Overlays & HUD Vision Scanner",
                    fontSize = 11.sp,
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
                    Column(modifier = Modifier.padding(14.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text("Computer Vision HUD Auto-Scanner", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Color.White)
                                Text("Analyses interactive display coordinate boundaries", fontSize = 9.sp, color = GrayTextMuted)
                            }
                            
                            Button(
                                onClick = {
                                    coroutineScope.launch {
                                        hudScannerEngine.performAutomaticScan(selectedGame.packageName)
                                    }
                                },
                                enabled = !isScanning,
                                colors = ButtonDefaults.buttonColors(containerColor = AccentAmber),
                                shape = RoundedCornerShape(8.dp),
                                contentPadding = PaddingValues(horizontal = 14.dp, vertical = 4.dp),
                                modifier = Modifier.height(28.dp)
                            ) {
                                if (isScanning) {
                                    CircularProgressIndicator(modifier = Modifier.size(10.dp), color = Color.Black, strokeWidth = 1.5.dp)
                                } else {
                                    Icon(Icons.Default.Refresh, contentDescription = null, tint = Color.Black, modifier = Modifier.size(12.dp))
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text("AUTO-SCAN", color = Color.Black, fontSize = 9.sp, fontWeight = FontWeight.Black)
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(14.dp))

                        // Relative HUD Scanning Elements Map
                        scannedElements.forEach { element ->
                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(vertical = 4.dp)
                                    .border(1.dp, Color.White.copy(alpha = 0.05f), RoundedCornerShape(8.dp))
                                    .background(Color.Black.copy(alpha = 0.2f))
                                    .padding(10.dp)
                            ) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                                        Box(
                                            modifier = Modifier
                                                .size(8.dp)
                                                .background(AccentAmber.copy(alpha = 0.2f), RoundedCornerShape(2.dp))
                                        )
                                        Text(element.type.name, fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color.White)
                                    }
                                    Text(
                                        text = element.formattedCoordinates,
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = AccentAmber,
                                        fontFamily = FontFamily.Monospace
                                    )
                                }

                                Spacer(modifier = Modifier.height(8.dp))
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.spacedBy(16.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text("X-COOR", fontSize = 8.sp, color = GrayTextMuted, modifier = Modifier.width(45.dp))
                                    Slider(
                                        value = element.xRelative,
                                        onValueChange = {
                                            hudScannerEngine.updateCoordinatesManual(element.type, it, element.yRelative)
                                        },
                                        valueRange = 0.0f..1.0f,
                                        colors = SliderDefaults.colors(
                                            thumbColor = AccentAmber,
                                            activeTrackColor = AccentAmber,
                                            inactiveTrackColor = Color.White.copy(alpha = 0.05f)
                                        ),
                                        modifier = Modifier.weight(1f).height(12.dp)
                                    )
                                }
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.spacedBy(16.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text("Y-COOR", fontSize = 8.sp, color = GrayTextMuted, modifier = Modifier.width(45.dp))
                                    Slider(
                                        value = element.yRelative,
                                        onValueChange = {
                                            hudScannerEngine.updateCoordinatesManual(element.type, element.xRelative, it)
                                        },
                                        valueRange = 0.0f..1.0f,
                                        colors = SliderDefaults.colors(
                                            thumbColor = AccentAmber,
                                            activeTrackColor = AccentAmber,
                                            inactiveTrackColor = Color.White.copy(alpha = 0.05f)
                                        ),
                                        modifier = Modifier.weight(1f).height(12.dp)
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    // Modal dialog to add a subprofile slot to a detected game package
    if (showProfileDialog && selectedGame != null) {
        AlertDialog(
            onDismissRequest = { showProfileDialog = false },
            title = { Text("Compile Game Slot Subprofile", fontSize = 14.sp, fontWeight = FontWeight.Bold) },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Text("Designate specific key layouts for this game mode:", fontSize = 11.sp, color = GrayTextMuted)
                    
                    OutlinedTextField(
                        value = newProfileName,
                        onValueChange = { newProfileName = it },
                        placeholder = { Text("Subprofile Name (e.g. Gunfight Arena, 5v5 Mode)", fontSize = 11.sp) },
                        modifier = Modifier.fillMaxWidth(),
                        colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = PrimaryIndigo)
                    )

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        listOf("MULTIPLAYER", "BATTLE_ROYALE", "ZOMBIES", "RANKED").forEach { mode ->
                            val isSel = newProfileMode == mode
                            Button(
                                onClick = { newProfileMode = mode },
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = if (isSel) PrimaryIndigo.copy(alpha = 0.15f) else Color.White.copy(alpha = 0.05f),
                                    contentColor = if (isSel) PrimaryIndigo else Color.White
                                ),
                                shape = RoundedCornerShape(8.dp),
                                modifier = Modifier
                                    .weight(1.dp.value)
                                    .border(1.dp, if (isSel) PrimaryIndigo.copy(alpha = 0.3f) else Color.White.copy(alpha = 0.05f), RoundedCornerShape(8.dp)),
                                contentPadding = PaddingValues(horizontal = 4.dp, vertical = 2.dp)
                            ) {
                                Text(mode, fontSize = 8.sp, fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }
            },
            confirmButton = {
                TextButton(
                    onClick = {
                        if (newProfileName.isNotBlank()) {
                            gameDetectionManager.addNewProfileToGame(selectedGame.packageName, newProfileName, newProfileMode)
                            newProfileName = ""
                            showProfileDialog = false
                        }
                    }
                ) {
                    Text("ADD SUBPROFILE", fontWeight = FontWeight.Bold, color = PrimaryIndigo, fontSize = 11.sp)
                }
            },
            dismissButton = {
                TextButton(onClick = { showProfileDialog = false }) {
                    Text("CLOSE", color = AccentRose, fontSize = 11.sp)
                }
            },
            containerColor = CardBackground,
            titleContentColor = Color.White,
            textContentColor = Color.White
        )
    }

    // Modal dialog to manually map click triggers for any custom game slot
    if (showAddGameDialog) {
        AlertDialog(
            onDismissRequest = { showAddGameDialog = false },
            title = { Text("Register New Game Slot", fontSize = 14.sp, fontWeight = FontWeight.Bold) },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Text("Enter name and package to assign overlay buttons and tap gestures manually:", fontSize = 11.sp, color = GrayTextMuted)
                    
                    OutlinedTextField(
                        value = manuallyGameLabel,
                        onValueChange = { manuallyGameLabel = it },
                        placeholder = { Text("Game Name (e.g. Call of Duty Mobile)", fontSize = 11.sp) },
                        modifier = Modifier.fillMaxWidth(),
                        colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = PrimaryIndigo)
                    )

                    OutlinedTextField(
                        value = manuallyGamePkg,
                        onValueChange = { manuallyGamePkg = it },
                        placeholder = { Text("Package Name (e.g. com.activision.callofduty.shooter)", fontSize = 11.sp) },
                        modifier = Modifier.fillMaxWidth(),
                        colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = PrimaryIndigo)
                    )
                }
            },
            confirmButton = {
                TextButton(
                    onClick = {
                        if (manuallyGameLabel.isNotBlank() && manuallyGamePkg.isNotBlank()) {
                            gameDetectionManager.manuallyAddGame(manuallyGamePkg.trim(), manuallyGameLabel.trim())
                            selectedGamePkg = manuallyGamePkg.trim()
                            manuallyGameLabel = ""
                            manuallyGamePkg = ""
                            showAddGameDialog = false
                        }
                    }
                ) {
                    Text("REGISTER TARGET", fontWeight = FontWeight.Bold, color = PrimaryIndigo, fontSize = 11.sp)
                }
            },
            dismissButton = {
                TextButton(onClick = { showAddGameDialog = false }) {
                    Text("CANCEL", color = AccentRose, fontSize = 11.sp)
                }
            },
            containerColor = CardBackground,
            titleContentColor = Color.White,
            textContentColor = Color.White
        )
    }
}
