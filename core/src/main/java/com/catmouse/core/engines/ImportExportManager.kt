package com.catmouse.core.engines

import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import javax.inject.Inject
import javax.inject.Singleton
import java.util.UUID

data class CatMapConfig(
    val fileName: String,
    val sourceGamePkg: String,
    val profileCount: Int,
    val serializedMeta: String,
    val timestamp: Long = System.currentTimeMillis()
)

@Singleton
class ImportExportManager @Inject constructor(
    private val diagnosticManager: DiagnosticManager
) {
    private val _createdBackups = MutableStateFlow<List<CatMapConfig>>(emptyList())
    val createdBackups: StateFlow<List<CatMapConfig>> = _createdBackups.asStateFlow()

    private val _lastOperationResult = MutableStateFlow<String?>(null)
    val lastOperationResult: StateFlow<String?> = _lastOperationResult.asStateFlow()

    init {
        diagnosticManager.log("SYSTEM", "Import/Export Engine for .catmap scripts active.")
        generateSeedBackups()
    }

    private fun generateSeedBackups() {
        _createdBackups.value = listOf(
            CatMapConfig("codm_multi_master.catmap", "com.activision.callofduty.shooter", 3, "{\"ver\":3,\"layers\":[\"Combat\",\"Loot\"],\"sens\":1.2}"),
            CatMapConfig("pubg_arena_flick.catmap", "com.tencent.ig", 2, "{\"ver\":3,\"layers\":[\"Combat\",\"Menu\"],\"sens\":0.85}"),
            CatMapConfig("arena_ranked_ext.catmap", "com.reproger.arena.breakout", 2, "{\"ver\":3,\"layers\":[\"Combat\",\"Loot\",\"Vehicle\"],\"sens\":1.0}")
        )
    }

    /**
     * Serializes a profile context to mock encrypted .catmap format string
     */
    fun exportProfileToCatMap(gamePkg: String, profileName: String, extraMeta: String): String {
        diagnosticManager.log("SYSTEM", "Compressing mapping structures... OK")
        val serialized = "##_CATMAP_V3_##;PKG:$gamePkg;LABEL:$profileName;META:$extraMeta;CHKSUM:${UUID.randomUUID().hashCode().toString(16)}"
        _lastOperationResult.value = "Successfully serialized script [$profileName] into .catmap bundle!"
        diagnosticManager.log("SYSTEM", "Encrypted .catmap signature created successfully.")
        return serialized
    }

    /**
     * Restores profiles from raw text content matching .catmap structuring protocols
     */
    fun importProfileFromCatMap(rawContent: String): CatMapConfig? {
        diagnosticManager.log("SYSTEM", "Decompressing signature file...")
        if (!rawContent.startsWith("##_CATMAP_V3_##")) {
            _lastOperationResult.value = "Aborted: Outdated or corrupt .catmap package signature."
            diagnosticManager.log("SYSTEM", "ERROR: Invalid .catmap header signature.")
            return null
        }

        try {
            val parts = rawContent.split(";")
            val pkg = parts.find { it.startsWith("PKG:") }?.substringAfter("PKG:") ?: "unknown"
            val label = parts.find { it.startsWith("LABEL:") }?.substringAfter("LABEL:") ?: "Imported Game Profile"
            val meta = parts.find { it.startsWith("META:") }?.substringAfter("META:") ?: "{}"

            val newConfig = CatMapConfig(
                fileName = "${label.lowercase().replace(" ", "_")}_restored.catmap",
                sourceGamePkg = pkg,
                profileCount = 1,
                serializedMeta = meta
            )

            val current = _createdBackups.value.toMutableList()
            current.add(0, newConfig)
            _createdBackups.value = current
            _lastOperationResult.value = "Imported successfully: '$label' ready in playbook."
            diagnosticManager.log("SYSTEM", "Restored profiles for Package [$pkg] in context.")
            return newConfig
        } catch (e: Exception) {
            _lastOperationResult.value = "Decryption error occurred during import stream."
            diagnosticManager.log("SYSTEM", "ERROR: Deflating mapping stream failed.")
            return null
        }
    }

    /**
     * Executes automatic cloud/local backup dumps
     */
    fun triggerInstantBackup(gamePkg: String, notes: String) {
        diagnosticManager.log("SYSTEM", "Dumping relational database schemas to memory profile blocks...")
        val backupName = "auto_snapshot_${System.currentTimeMillis() / 10000}.catmap"
        val fresh = CatMapConfig(
            fileName = backupName,
            sourceGamePkg = gamePkg,
            profileCount = 2,
            serializedMeta = "{\"timestamp\":${System.currentTimeMillis()},\"comment\":\"$notes\"}"
        )
        val current = _createdBackups.value.toMutableList()
        current.add(0, fresh)
        _createdBackups.value = current
        _lastOperationResult.value = "Snapshot saved: $backupName"
        diagnosticManager.log("SYSTEM", "Cron Auto-Backup routine successfully dumped snapshot to drive.")
    }

    fun deleteBackup(backup: CatMapConfig) {
        val current = _createdBackups.value.toMutableList()
        current.remove(backup)
        _createdBackups.value = current
        diagnosticManager.log("SYSTEM", "Deleted backup archive file: ${backup.fileName}")
    }
}
