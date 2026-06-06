package com.catmouse.core.engines

import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import javax.inject.Inject
import javax.inject.Singleton

enum class VehicleType {
    HELICOPTER,
    JACKAL,
    TANK,
    ANTELOPE,
    MOTORCYCLE,
    TACTICAL_BOAT,
    SNOWBOARD,
    HOVER_BIKE,
    TRUCK
}

enum class MovementCurveType {
    LINEAR,
    SMOOTH,
    AGGRESSIVE,
    DRIFT_ACCELERATION
}

data class VehicleProfile(
    val type: VehicleType,
    val name: String,
    val steeringSensitivity: Float, // 1.0 .. 3.5
    val gasToTurnCoeff: Float, // multiplier
    val keyBindings: Map<String, String>, // ActionName -> KeyChar
    val cameraSpeed: Int, // 10..150
    val curve: MovementCurveType
)

@Singleton
class VehicleManager @Inject constructor(
    private val diagnosticManager: DiagnosticManager
) {
    private val _vehicleProfiles = MutableStateFlow<Map<VehicleType, VehicleProfile>>(emptyMap())
    val vehicleProfiles: StateFlow<Map<VehicleType, VehicleProfile>> = _vehicleProfiles.asStateFlow()

    private val _activeVehicle = MutableStateFlow<VehicleType?>(null)
    val activeVehicle: StateFlow<VehicleType?> = _activeVehicle.asStateFlow()

    init {
        diagnosticManager.log("VEHICLE_ENGINE", "Initializing tactical vehicle database engine...")
        loadDefaultVehicles()
    }

    private fun loadDefaultVehicles() {
        val database = mutableMapOf<VehicleType, VehicleProfile>()
        
        database[VehicleType.HELICOPTER] = VehicleProfile(
            type = VehicleType.HELICOPTER,
            name = "Stalth Stealth Helicopter",
            steeringSensitivity = 2.1f,
            gasToTurnCoeff = 1.3f,
            keyBindings = mapOf("Throttle Up" to "W", "Throttle Down" to "S", "Yaw Left" to "A", "Yaw Right" to "D", "Rocket Pod" to "L_CLICK", "Flares" to "G"),
            cameraSpeed = 100,
            curve = MovementCurveType.SMOOTH
        )

        database[VehicleType.JACKAL] = VehicleProfile(
            type = VehicleType.JACKAL,
            name = "Jackal Supersonic Jet Fighter",
            steeringSensitivity = 3.2f,
            gasToTurnCoeff = 1.8f,
            keyBindings = mapOf("Thrust Max" to "SHIFT", "Brake" to "CTRL", "Pitch Up" to "S", "Pitch Down" to "W", "Auto Canon" to "SPACE", "Decoy" to "F"),
            cameraSpeed = 140,
            curve = MovementCurveType.AGGRESSIVE
        )

        database[VehicleType.TANK] = VehicleProfile(
            type = VehicleType.TANK,
            name = "T-90 Heavy Armored Tank",
            steeringSensitivity = 1.2f,
            gasToTurnCoeff = 0.8f,
            keyBindings = mapOf("Move Forward" to "W", "Move Reverse" to "S", "Pivot Left" to "A", "Pivot Right" to "D", "Fire Shell" to "L_CLICK", "Coaxial MG" to "R_CLICK"),
            cameraSpeed = 60,
            curve = MovementCurveType.LINEAR
        )

        database[VehicleType.ANTELOPE] = VehicleProfile(
            type = VehicleType.ANTELOPE,
            name = "Antelope Fast Scout Assault Vehicle",
            steeringSensitivity = 1.8f,
            gasToTurnCoeff = 1.1f,
            keyBindings = mapOf("Accelerate" to "W", "Reverse" to "S", "Turn Left" to "A", "Turn Right" to "D", "Roof Turret" to "R", "Nitro" to "SPACE"),
            cameraSpeed = 85,
            curve = MovementCurveType.DRIFT_ACCELERATION
        )

        database[VehicleType.MOTORCYCLE] = VehicleProfile(
            type = VehicleType.MOTORCYCLE,
            name = "MX Tactical Cross Bike",
            steeringSensitivity = 2.4f,
            gasToTurnCoeff = 1.6f,
            keyBindings = mapOf("Gas" to "W", "Rear Brake" to "S", "Lean Left" to "A", "Lean Right" to "D", "Wheelie" to "CTRL", "Stoppie" to "SPACE"),
            cameraSpeed = 110,
            curve = MovementCurveType.AGGRESSIVE
        )

        database[VehicleType.TACTICAL_BOAT] = VehicleProfile(
            type = VehicleType.TACTICAL_BOAT,
            name = "RIB Stealth Patrol Boat",
            steeringSensitivity = 1.7f,
            gasToTurnCoeff = 1.2f,
            keyBindings = mapOf("Engine Fwd" to "W", "Engine Rev" to "S", "Steer Left" to "A", "Steer Right" to "D", "Drop Mine" to "G"),
            cameraSpeed = 75,
            curve = MovementCurveType.SMOOTH
        )

        database[VehicleType.SNOWBOARD] = VehicleProfile(
            type = VehicleType.SNOWBOARD,
            name = "Fleece Extreme Ice Snowboard",
            steeringSensitivity = 2.8f,
            gasToTurnCoeff = 2.0f,
            keyBindings = mapOf("Glide" to "W", "Carve Left" to "A", "Carve Right" to "D", "Apex Flip Jump" to "SPACE"),
            cameraSpeed = 120,
            curve = MovementCurveType.DRIFT_ACCELERATION
        )

        database[VehicleType.HOVER_BIKE] = VehicleProfile(
            type = VehicleType.HOVER_BIKE,
            name = "Void Levitation Hover Bike",
            steeringSensitivity = 2.3f,
            gasToTurnCoeff = 1.5f,
            keyBindings = mapOf("Hover Lift" to "W", "Sink" to "S", "Glide Left" to "A", "Glide Right" to "D", "Boost Shield" to "SHIFT"),
            cameraSpeed = 95,
            curve = MovementCurveType.SMOOTH
        )

        database[VehicleType.TRUCK] = VehicleProfile(
            type = VehicleType.TRUCK,
            name = "Heavy Cargo Logistics Truck",
            steeringSensitivity = 1.0f,
            gasToTurnCoeff = 0.6f,
            keyBindings = mapOf("Gear Drive" to "W", "Gear Reverse" to "S", "Steer Left" to "A", "Steer Right" to "D", "Parking Brake" to "SPACE", "Ram Horn" to "E"),
            cameraSpeed = 50,
            curve = MovementCurveType.LINEAR
        )

        _vehicleProfiles.value = database
        diagnosticManager.log("VEHICLE_ENGINE", "Successfully deployed profiles for 9 standard vehicle models.")
    }

    fun updateVehicleSensitivity(type: VehicleType, sensitivity: Float) {
        val current = _vehicleProfiles.value.toMutableMap()
        val profile = current[type] ?: return
        current[type] = profile.copy(steeringSensitivity = sensitivity.coerceIn(0.5f, 5.0f))
        _vehicleProfiles.value = current
        diagnosticManager.log("VEHICLE_ENGINE", "Sensitivity optimized for vehicle [$type] => $sensitivity")
    }

    fun updateVehicleCurve(type: VehicleType, curveType: MovementCurveType) {
        val current = _vehicleProfiles.value.toMutableMap()
        val profile = current[type] ?: return
        current[type] = profile.copy(curve = curveType)
        _vehicleProfiles.value = current
        diagnosticManager.log("VEHICLE_ENGINE", "Movement curve dynamics for [$type] updated to: $curveType")
    }

    fun selectActiveVehicle(type: VehicleType?) {
        _activeVehicle.value = type
        if (type != null) {
            diagnosticManager.log("VEHICLE_ENGINE", "Active Vehicle mounted: $type")
        } else {
            diagnosticManager.log("VEHICLE_ENGINE", "Dismounted active vehicle. Reverting to base combat mechanics.")
        }
    }
}
