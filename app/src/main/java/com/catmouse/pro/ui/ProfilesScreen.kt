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
import androidx.hilt.navigation.compose.hiltViewModel
import com.catmouse.core.ProfileEntity
import com.catmouse.core.engines.ImportExportManager
import com.catmouse.core.engines.LayerManager
import com.catmouse.core.engines.TacticalLayer
import com.catmouse.pro.ui.theme.*

@OptIn(ExperimentalLayoutApi::class, ExperimentalMaterial3Api::class)
@Composable
fun ProfilesScreen(
    layerManager: LayerManager,
    importExportManager: ImportExportManager,
    viewModel: ProfilesViewModel = hiltViewModel()
) {
    val profiles by viewModel.profilesState.collectAsState()
    
    // Core Layer Manager states
    val activeLayer by layerManager.activeLayer.collectAsState()
    val layerBindings by layerManager.bindings.collectAsState()

    // Import/Export engine states
    val backups by importExportManager.createdBackups.collectAsState()
    val lastOpResult by importExportManager.lastOperationResult.collectAsState()

    var showDialog by remember { mutableStateOf(false) }
    var nameInput by remember { mutableStateOf("") }
    var descInput by remember { mutableStateOf("") }
    var categoryInput by remember { mutableStateOf("GAMES") }

    // Backup dialog states
    var showImportDialog by remember { mutableStateOf(false) }
    var importInputText by remember { mutableStateOf("") }

    // Seed initial items if DB is empty
    LaunchedEffect(profiles) {
        if (profiles.isEmpty()) {
            viewModel.addProfile("Wild Rift Advanced Maps Map", "Standard coordinate macros snapping relative camera swipe binders.", "GAMES")
            viewModel.addProfile("Apex Legends 180 Snap Swipe", "Hyper swipe mouse sequence to execute a perfect 180 degrees spin.", "GAMES")
            viewModel.addProfile("Stealth Mode HUD Customizer", "Fades HUD overlays instantly on quick key bindings to secure confidentiality.", "GENERAL")
        }
    }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkBackground)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // App Header
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = "MACRO PLAYBOOK SCRIPTS",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White,
                        letterSpacing = 1.sp
                    )
                    Text(
                        text = "Build touch sequences, layout layers and coordinate tap binders",
                        fontSize = 11.sp,
                        color = GrayTextMuted
                    )
                }
                
                Button(
                    onClick = { showDialog = true },
                    colors = ButtonDefaults.buttonColors(containerColor = PrimaryIndigo),
                    shape = RoundedCornerShape(10.dp),
                    contentPadding = PaddingValues(horizontal = 14.dp, vertical = 6.dp)
                ) {
                    Icon(Icons.Default.Add, contentDescription = null, tint = Color.White, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("NEW", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                }
            }
        }

        // Section Context Aware mapping layers (Priority 3)
        item {
            Text(
                text = "CONTEXT INTERACTIVE LAYERS MANAGER",
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
                Column(modifier = Modifier.padding(14.dp)) {
                    Text(
                        "Switch Tactical Context Layers",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                    Text(
                        "Hardware keys trigger different relative macros depending on which layer is locked",
                        fontSize = 9.sp,
                        color = GrayTextMuted
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    FlowRow(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(6.dp),
                        verticalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        TacticalLayer.values().forEach { layer ->
                            val isSel = activeLayer == layer
                            Button(
                                onClick = { layerManager.setTacticalLayer(layer) },
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = if (isSel) PrimaryIndigo.copy(alpha = 0.15f) else Color.White.copy(alpha = 0.05f),
                                    contentColor = if (isSel) Color.White else GrayTextMuted
                                ),
                                shape = RoundedCornerShape(8.dp),
                                contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp),
                                modifier = Modifier
                                    .height(30.dp)
                                    .border(
                                        1.dp,
                                        if (isSel) PrimaryIndigo.copy(alpha = 0.4f) else Color.White.copy(alpha = 0.05f),
                                        RoundedCornerShape(8.dp)
                                    )
                            ) {
                                Text(layer.name.replace("_", " "), fontSize = 8.sp, fontWeight = FontWeight.SemiBold)
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(14.dp))
                    Text(
                        "Active Layer Key Mappings for '$activeLayer':",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = PrimaryIndigo
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    layerBindings.filter { it.layer == activeLayer }.forEach { map ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 4.dp)
                                .background(Color.Black.copy(alpha = 0.2f), RoundedCornerShape(8.dp))
                                .border(1.dp, Color.White.copy(alpha = 0.03f), RoundedCornerShape(8.dp))
                                .padding(10.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                                Box(
                                    modifier = Modifier
                                        .size(24.dp)
                                        .background(PrimaryIndigo.copy(alpha = 0.1f), RoundedCornerShape(4.dp))
                                        .border(1.dp, PrimaryIndigo.copy(alpha = 0.2f), RoundedCornerShape(4.dp)),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(map.keyChar, fontSize = 11.sp, fontWeight = FontWeight.Bold, color = PrimaryIndigo, fontFamily = FontFamily.Monospace)
                                }
                                Column {
                                    Text(map.boundAction, fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color.White)
                                    Text(map.macroSequence, fontSize = 9.sp, color = GrayTextMuted, fontFamily = FontFamily.Monospace)
                                }
                            }
                            Box(
                                modifier = Modifier
                                    .background(Color.White.copy(alpha = 0.05f), RoundedCornerShape(4.dp))
                                    .padding(horizontal = 6.dp, vertical = 2.dp)
                            ) {
                                Text("LOCKED", fontSize = 8.sp, color = GrayTextMuted)
                            }
                        }
                    }
                }
            }
        }

        // Active playbook scripts
        item {
            Text(
                text = "SAVED PLAYBOOK PROFILES IN STORAGE",
                fontSize = 10.sp,
                fontWeight = FontWeight.Bold,
                color = GrayTextMuted,
                letterSpacing = 1.sp
            )
        }

        items(profiles) { profile ->
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
                            Text(profile.name, fontSize = 13.sp, fontWeight = FontWeight.Bold, color = Color.White)
                            Spacer(modifier = Modifier.height(2.dp))
                            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                                Text(profile.category, fontSize = 9.sp, color = PrimaryIndigo, fontWeight = FontWeight.Bold)
                                Box(modifier = Modifier.size(3.dp).background(Color.White.copy(alpha = 0.2f), RoundedCornerShape(1.dp)))
                                Text("${profile.actionCount} COMPONENT TASKS", fontSize = 8.sp, color = GrayTextMuted, fontFamily = FontFamily.Monospace)
                            }
                        }

                        IconButton(
                            onClick = { viewModel.deleteProfile(profile) }
                        ) {
                            Icon(Icons.Default.Delete, contentDescription = "Delete", tint = AccentRose.copy(alpha = 0.7f), modifier = Modifier.size(18.dp))
                        }
                    }

                    Spacer(modifier = Modifier.height(8.dp))
                    Text(profile.description, fontSize = 10.sp, color = GrayTextMuted, lineHeight = 14.sp)
                    Spacer(modifier = Modifier.height(14.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            Box(
                                modifier = Modifier
                                    .size(8.dp)
                                    .background(if (profile.isActive) AccentEmerald else Color.White.copy(alpha = 0.1f), RoundedCornerShape(4.dp))
                            )
                            Text(
                                text = if (profile.isActive) "BOUND LIVE" else "READY IN PLAYBOOK",
                                fontSize = 9.sp,
                                fontWeight = FontWeight.Bold,
                                color = if (profile.isActive) AccentEmerald else GrayTextMuted
                            )
                        }

                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            // Export catmap action
                            TextButton(
                                onClick = {
                                    importExportManager.exportProfileToCatMap(
                                        "com.activision.callofduty.shooter",
                                        profile.name,
                                        "{\"actionCount\":${profile.actionCount}}"
                                    )
                                },
                                contentPadding = PaddingValues(0.dp),
                                modifier = Modifier.height(28.dp)
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Icon(Icons.Default.Share, contentDescription = null, modifier = Modifier.size(11.dp))
                                    Spacer(modifier = Modifier.width(3.dp))
                                    Text("EXPORT .CATMAP", fontSize = 9.sp, color = PrimaryIndigo, fontWeight = FontWeight.Bold)
                                }
                            }

                            Button(
                                onClick = { viewModel.toggleProfileActive(profile) },
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = if (profile.isActive) AccentRose.copy(alpha = 0.1f) else PrimaryIndigo.copy(alpha = 0.1f),
                                    contentColor = if (profile.isActive) AccentRose else PrimaryIndigo
                                ),
                                shape = RoundedCornerShape(8.dp),
                                modifier = Modifier
                                    .height(28.dp)
                                    .border(1.dp, if (profile.isActive) AccentRose.copy(alpha = 0.2f) else PrimaryIndigo.copy(alpha = 0.2f), RoundedCornerShape(8.dp)),
                                contentPadding = PaddingValues(horizontal = 12.dp, vertical = 2.dp)
                            ) {
                                Text(
                                    text = if (profile.isActive) "UNBIND MACRO" else "BIND SHORTCUT",
                                    fontSize = 9.sp,
                                    fontWeight = FontWeight.Black
                                )
                            }
                        }
                    }
                }
            }
        }

        // Section: File Backup Dumps & Snapshot Imports (Priority 7)
        item {
            Text(
                text = "BACKUP DUMPS & SNAPSHOT ARCHIVE (.CATMAP)",
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
                Column(modifier = Modifier.padding(14.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text("Import / Export Tactical snap archives", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Color.White)
                            Text("Deploy local exports or restore online cloud backups", fontSize = 9.sp, color = GrayTextMuted)
                        }

                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            Button(
                                onClick = {
                                    importExportManager.triggerInstantBackup("com.activision.callofduty.shooter", "Manual Snapshot Session Run")
                                },
                                colors = ButtonDefaults.buttonColors(containerColor = Color.White.copy(alpha = 0.05f)),
                                contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp),
                                shape = RoundedCornerShape(6.dp),
                                modifier = Modifier.height(26.dp)
                            ) {
                                Text("SNAP SAVE", fontSize = 8.sp, color = Color.White, fontWeight = FontWeight.Bold)
                            }

                            Button(
                                onClick = { showImportDialog = true },
                                colors = ButtonDefaults.buttonColors(containerColor = PrimaryIndigo),
                                contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp),
                                shape = RoundedCornerShape(6.dp),
                                modifier = Modifier.height(26.dp)
                            ) {
                                Text("IMPORT .CATMAP", fontSize = 8.sp, color = Color.White, fontWeight = FontWeight.Bold)
                            }
                        }
                    }

                    if (lastOpResult != null) {
                        Spacer(modifier = Modifier.height(10.dp))
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(AccentEmerald.copy(alpha = 0.1f), RoundedCornerShape(4.dp))
                                .padding(8.dp)
                        ) {
                            Text(lastOpResult!!, fontSize = 9.sp, color = AccentEmerald, fontWeight = FontWeight.Bold)
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))
                    Text("Stored Archive Snaps:", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = GrayTextMuted)
                    Spacer(modifier = Modifier.height(6.dp))

                    backups.forEach { snapshot ->
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
                                Text(snapshot.fileName, fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color.White)
                                Text("Pkg: ${snapshot.sourceGamePkg}", fontSize = 8.sp, color = GrayTextMuted, fontFamily = FontFamily.Monospace)
                            }

                            IconButton(
                                onClick = { importExportManager.deleteBackup(snapshot) },
                                modifier = Modifier.size(24.dp)
                            ) {
                                Icon(Icons.Default.Delete, contentDescription = null, tint = AccentRose.copy(alpha = 0.5f), modifier = Modifier.size(14.dp))
                            }
                        }
                    }
                }
            }
        }
    }

    // Modal compiling dialog
    if (showDialog) {
        AlertDialog(
            onDismissRequest = { showDialog = false },
            title = { Text("Compile Custom Macro", fontSize = 14.sp, fontWeight = FontWeight.Bold) },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    OutlinedTextField(
                        value = nameInput,
                        onValueChange = { nameInput = it },
                        placeholder = { Text("Profile Name (e.g. Apex Recoil Snap)", fontSize = 11.sp) },
                        modifier = Modifier.fillMaxWidth(),
                        colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = PrimaryIndigo)
                    )

                    OutlinedTextField(
                        value = descInput,
                        onValueChange = { descInput = it },
                        placeholder = { Text("Description...", fontSize = 11.sp) },
                        modifier = Modifier.fillMaxWidth(),
                        colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = PrimaryIndigo)
                    )

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        listOf("GAMES", "GENERAL", "WORKPLACE").forEach { cat ->
                            val isSelected = categoryInput == cat
                            Button(
                                onClick = { categoryInput = cat },
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = if (isSelected) PrimaryIndigo.copy(alpha = 0.15f) else Color.White.copy(alpha = 0.05f),
                                    contentColor = if (isSelected) PrimaryIndigo else Color.White
                                ),
                                shape = RoundedCornerShape(8.dp),
                                modifier = Modifier
                                    .weight(1f)
                                    .border(1.dp, if (isSelected) PrimaryIndigo.copy(alpha = 0.3f) else Color.White.copy(alpha = 0.05f), RoundedCornerShape(8.dp)),
                                contentPadding = PaddingValues(horizontal = 6.dp, vertical = 4.dp)
                            ) {
                                Text(cat, fontSize = 8.sp, fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }
            },
            confirmButton = {
                TextButton(
                    onClick = {
                        if (nameInput.isNotBlank()) {
                            viewModel.addProfile(nameInput, descInput, categoryInput)
                            nameInput = ""
                            descInput = ""
                            showDialog = false
                        }
                    }
                ) {
                    Text("COMPILE & PERSIST", fontWeight = FontWeight.Bold, color = PrimaryIndigo, fontSize = 11.sp)
                }
            },
            dismissButton = {
                TextButton(onClick = { showDialog = false }) {
                    Text("CANCEL", color = AccentRose, fontSize = 11.sp)
                }
            },
            containerColor = CardBackground,
            titleContentColor = Color.White,
            textContentColor = Color.White
        )
    }

    // Modal Dialog for Importing a RAW .catmap script
    if (showImportDialog) {
        AlertDialog(
            onDismissRequest = { showImportDialog = false },
            title = { Text("Paste Crytographic .catmap String", fontSize = 14.sp, fontWeight = FontWeight.Bold) },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Text("Insert a valid .catmap script configuration containing relative binds:", fontSize = 11.sp, color = GrayTextMuted)
                    
                    OutlinedTextField(
                        value = importInputText,
                        onValueChange = { importInputText = it },
                        placeholder = { Text("##_CATMAP_V3_##;PKG:com.tencent.ig;LABEL:Clasico Matrix...", fontSize = 10.sp) },
                        modifier = Modifier.fillMaxWidth().height(115.dp),
                        colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = PrimaryIndigo),
                        textStyle = LocalTextStyle.current.copy(fontSize = 10.sp, fontFamily = FontFamily.Monospace)
                    )

                    Button(
                        onClick = {
                            importInputText = "##_CATMAP_V3_##;PKG:com.activision.callofduty.shooter;LABEL:Faker Reflex Sweep;META:{\"sens\":1.4};CHKSUM:8ae4"
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = Color.White.copy(alpha = 0.05f)),
                        shape = RoundedCornerShape(6.dp),
                        contentPadding = PaddingValues(horizontal = 8.dp, vertical = 2.dp),
                        modifier = Modifier.height(24.dp)
                    ) {
                        Text("LOAD SAMPLE DECRYPT STRING", fontSize = 8.sp, color = Color.White)
                    }
                }
            },
            confirmButton = {
                TextButton(
                    onClick = {
                        if (importInputText.isNotBlank()) {
                            importExportManager.importProfileFromCatMap(importInputText)
                            importInputText = ""
                            showImportDialog = false
                        }
                    }
                ) {
                    Text("DECRYPT & RESTORE", fontWeight = FontWeight.Bold, color = PrimaryIndigo, fontSize = 11.sp)
                }
            },
            dismissButton = {
                TextButton(onClick = { showImportDialog = false }) {
                    Text("CANCEL", color = AccentRose, fontSize = 11.sp)
                }
            },
            containerColor = CardBackground,
            titleContentColor = Color.White,
            textContentColor = Color.White
        )
    }
}
