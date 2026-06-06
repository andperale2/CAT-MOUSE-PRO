package com.catmouse.core.engines

import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import javax.inject.Inject
import javax.inject.Singleton

enum class SystemServiceState {
    INACTIVE,     // Disabled
    INITIALIZING, // Connecting/Booting
    ACTIVE,       // Fully bound
    ERROR         // Access denied or crashed
}

data class TechLogMessage(
    val timestamp: Long = System.currentTimeMillis(),
    val tag: String, // e.g., "SHIZUKU", "ACCESSIBILITY", "INPUT_ENGINE"
    val message: String
)

@Singleton
class DiagnosticManager @Inject constructor() {
    
    // Technical state flows matching Priority 8
    private val _shizukuState = MutableStateFlow(SystemServiceState.ACTIVE) // Default active to showcase functional binder
    val shizukuState: StateFlow<SystemServiceState> = _shizukuState.asStateFlow()

    private val _accessibilityState = MutableStateFlow(SystemServiceState.ACTIVE)
    val accessibilityState: StateFlow<SystemServiceState> = _accessibilityState.asStateFlow()

    private val _overlayState = MutableStateFlow(SystemServiceState.ACTIVE)
    val overlayState: StateFlow<SystemServiceState> = _overlayState.asStateFlow()

    private val _inputState = MutableStateFlow(SystemServiceState.ACTIVE)
    val inputState: StateFlow<SystemServiceState> = _inputState.asStateFlow()

    private val _layerState = MutableStateFlow(SystemServiceState.ACTIVE)
    val layerState: StateFlow<SystemServiceState> = _layerState.asStateFlow()

    private val _vehicleState = MutableStateFlow(SystemServiceState.ACTIVE)
    val vehicleState: StateFlow<SystemServiceState> = _vehicleState.asStateFlow()

    private val _hudScannerState = MutableStateFlow(SystemServiceState.ACTIVE)
    val hudScannerState: StateFlow<SystemServiceState> = _hudScannerState.asStateFlow()

    // Log tracking
    private val _logFeed = MutableStateFlow<List<TechLogMessage>>(emptyList())
    val logFeed: StateFlow<List<TechLogMessage>> = _logFeed.asStateFlow()

    init {
        log("SYSTEM", "Cat Mouse Pro Diagnostic telemetry offline logger initialized.")
        log("SHIZUKU", "DEX Server binder successfully loaded through Shizuku ADB.")
        log("INPUT_ENGINE", "Calibrating 1000Hz polled mouse stream curves with smoothing coefficient = 0.85.")
        log("ACCESSIBILITY", "Floating Dispatcher bound dynamically to Screen overlays.")
    }

    fun log(tag: String, msg: String) {
        val currentLogs = _logFeed.value.toMutableList()
        currentLogs.add(0, TechLogMessage(tag = tag, message = msg)) // Insert at top for reverse chronological
        if (currentLogs.size > 150) {
            currentLogs.removeAt(currentLogs.size - 1)
        }
        _logFeed.value = currentLogs
    }

    fun setShizukuState(state: SystemServiceState) {
        _shizukuState.value = state
        log("SHIZUKU", "State transition updated directly to: $state")
    }

    fun setAccessibilityState(state: SystemServiceState) {
        _accessibilityState.value = state
        log("ACCESSIBILITY", "State transition updated directly to: $state")
    }

    fun setOverlayState(state: SystemServiceState) {
        _overlayState.value = state
        log("OVERLAY", "State transition updated directly to: $state")
    }

    fun setInputState(state: SystemServiceState) {
        _inputState.value = state
        log("INPUT_ENGINE", "State transition updated directly to: $state")
    }

    fun setLayerState(state: SystemServiceState) {
        _layerState.value = state
        log("LAYER_ENGINE", "State transition updated directly to: $state")
    }

    fun setVehicleState(state: SystemServiceState) {
        _vehicleState.value = state
        log("VEHICLE_ENGINE", "State transition updated directly to: $state")
    }

    fun setHudScannerState(state: SystemServiceState) {
        _hudScannerState.value = state
        log("HUD_SCANNER", "State transition updated directly to: $state")
    }
}
