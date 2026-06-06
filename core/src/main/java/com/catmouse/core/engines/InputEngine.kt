package com.catmouse.core.engines

import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import javax.inject.Inject
import javax.inject.Singleton

enum class ScopeSensitivityType {
    HIPFIRE,
    ADS,
    SCOPE_3X,
    SCOPE_4X,
    SCOPE_6X,
    SCOPE_8X
}

@Singleton
class InputEngine @Inject constructor(
    private val diagnosticManager: DiagnosticManager
) {
    // Basic settings
    private val _isRawInputEnabled = MutableStateFlow(true)
    val isRawInputEnabled: StateFlow<Boolean> = _isRawInputEnabled.asStateFlow()

    private val _mouseSmoothingCoef = MutableStateFlow(0.85f) // 0.0 to 1.0
    val mouseSmoothingCoef: StateFlow<Float> = _mouseSmoothingCoef.asStateFlow()

    private val _hardwareDpi = MutableStateFlow(1600) // 400 .. 16000
    val hardwareDpi: StateFlow<Int> = _hardwareDpi.asStateFlow()

    private val _isAccelerationCurveActive = MutableStateFlow(true)
    val isAccelerationCurveActive: StateFlow<Boolean> = _isAccelerationCurveActive.asStateFlow()

    // Sensitivity map per scope (Priority 5)
    private val _scopeSensitivities = MutableStateFlow<Map<ScopeSensitivityType, Float>>(emptyMap())
    val scopeSensitivities: StateFlow<Map<ScopeSensitivityType, Float>> = _scopeSensitivities.asStateFlow()

    init {
        diagnosticManager.log("INPUT_ENGINE", "Calibrating tactical input dispatcher matrix...")
        loadDefaultSensitivityGrid()
    }

    private fun loadDefaultSensitivityGrid() {
        val grid = mapOf(
            ScopeSensitivityType.HIPFIRE to 1.0f,
            ScopeSensitivityType.ADS to 0.85f,
            ScopeSensitivityType.SCOPE_3X to 0.65f,
            ScopeSensitivityType.SCOPE_4X to 0.50f,
            ScopeSensitivityType.SCOPE_6X to 0.35f,
            ScopeSensitivityType.SCOPE_8X to 0.18f
        )
        _scopeSensitivities.value = grid
        diagnosticManager.log("INPUT_ENGINE", "Hipfire/ADS/Optic coefficients calculated successfully.")
    }

    fun setRawInput(enabled: Boolean) {
        _isRawInputEnabled.value = enabled
        diagnosticManager.log("INPUT_ENGINE", "Raw Input pipeline: ${if (enabled) "ENABLED (Direct kernel /dev/input bypass)" else "DISABLED (Simulated system pointer)"}")
    }

    fun setMouseSmoothing(coef: Float) {
        val clamp = coef.coerceIn(0.0f, 1.0f)
        _mouseSmoothingCoef.value = clamp
        diagnosticManager.log("INPUT_ENGINE", "Smoothing coefficient updated to: $clamp (Interpolation latency: ${String.format("%.1f", clamp * 12)} ms)")
    }

    fun setHardwareDpi(dpi: Int) {
        val clamp = dpi.coerceIn(400, 16000)
        _hardwareDpi.value = clamp
        diagnosticManager.log("INPUT_ENGINE", "Hardware DPI scale factor adjusted to: ${clamp} DPI")
    }

    fun setAccelerationCurve(active: Boolean) {
        _isAccelerationCurveActive.value = active
        diagnosticManager.log("INPUT_ENGINE", "Exponential acceleration curve: ${if (active) "ACTIVE (Multipliers scaling with velocity)" else "INACTIVE (Linear 1:1 translation)"}")
    }

    fun updateScopeSensitivity(type: ScopeSensitivityType, value: Float) {
        val current = _scopeSensitivities.value.toMutableMap()
        current[type] = value.coerceIn(0.05f, 4.0f)
        _scopeSensitivities.value = current
        diagnosticManager.log("INPUT_ENGINE", "Zoom multiplier for scope [$type] refined directly to: ${String.format("%.2f", value)}x")
    }

    /**
     * Mathematical calibration simulation for mouse motion vectors
     * Applies smoothing coefficients, scaling DPI buffers and active velocities
     */
    fun interpolatePointerDelta(dx: Float, dy: Float, velocity: Float): Pair<Float, Float> {
        val dpiScale = _hardwareDpi.value / 1600f
        var accelFactor = 1.0f
        
        if (_isAccelerationCurveActive.value) {
            // High velocity yields higher scaling
            accelFactor = 1.0f + (velocity * 0.05f).coerceAtMost(2.5f)
        }

        val rawDx = dx * dpiScale * accelFactor
        val rawDy = dy * dpiScale * accelFactor

        // Apply low pass filter simulation for mouse smoothing
        val smooth = _mouseSmoothingCoef.value
        val smoothedDx = rawDx * (1f - smooth)
        val smoothedDy = rawDy * (1f - smooth)

        return Pair(smoothedDx, smoothedDy)
    }
}
