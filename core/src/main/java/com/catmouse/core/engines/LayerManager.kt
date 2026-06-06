package com.catmouse.core.engines

import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import javax.inject.Inject
import javax.inject.Singleton

enum class TacticalLayer {
    COMBAT_LAYER,
    LOOT_LAYER,
    VEHICLE_LAYER,
    HELICOPTER_LAYER,
    TANK_LAYER,
    MENU_LAYER
}

data class ContextActionMapping(
    val keyChar: String, // e.g. "F", "G"
    val layer: TacticalLayer,
    val boundAction: String, // e.g. "Loot Weapon", "C4"
    val macroSequence: String // relative coordinates script actions
)

@Singleton
class LayerManager @Inject constructor(
    private val diagnosticManager: DiagnosticManager
) {
    private val _activeLayer = MutableStateFlow(TacticalLayer.COMBAT_LAYER)
    val activeLayer: StateFlow<TacticalLayer> = _activeLayer.asStateFlow()

    private val _bindings = MutableStateFlow<List<ContextActionMapping>>(emptyList())
    val bindings: StateFlow<List<ContextActionMapping>> = _bindings.asStateFlow()

    init {
        diagnosticManager.log("LAYER_ENGINE", "Initializing Context Layer matrix engine.")
        loadDefaultLayerMappings()
    }

    fun loadDefaultLayerMappings() {
        val list = mutableListOf<ContextActionMapping>()
        
        // Key F context binds
        list.add(ContextActionMapping("F", TacticalLayer.COMBAT_LAYER, "Reload & Melee", "tap(x=0.75, y=0.82) -> delay(50)"))
        list.add(ContextActionMapping("F", TacticalLayer.LOOT_LAYER, "Loot Weapon / Open Box", "tap(x=0.58, y=0.45) -> delay(80)"))
        list.add(ContextActionMapping("F", TacticalLayer.VEHICLE_LAYER, "Enter Driver Seat", "tap(x=0.62, y=0.55) -> delay(100)"))
        list.add(ContextActionMapping("F", TacticalLayer.HELICOPTER_LAYER, "Mount Tactical Turret", "tap(x=0.64, y=0.42) -> delay(100)"))
        list.add(ContextActionMapping("F", TacticalLayer.TANK_LAYER, "Enter Gunner Berth", "tap(x=0.68, y=0.48) -> delay(100)"))
        list.add(ContextActionMapping("F", TacticalLayer.MENU_LAYER, "Confirm Action / Buy Back", "tap(x=0.50, y=0.60) -> delay(50)"))

        // Key G context binds
        list.add(ContextActionMapping("G", TacticalLayer.COMBAT_LAYER, "Throw Fragmentation Grenade", "tap(x=0.65, y=0.88)"))
        list.add(ContextActionMapping("G", TacticalLayer.LOOT_LAYER, "Swipe Quick Loot Chest", "swipe(x1=0.6, y1=0.3, x2=0.6, y2=0.7)"))
        list.add(ContextActionMapping("G", TacticalLayer.VEHICLE_LAYER, "Toss C4 Exploder", "tap(x=0.72, y=0.84)"))
        list.add(ContextActionMapping("G", TacticalLayer.HELICOPTER_LAYER, "Launch Flares Countermeasure", "tap(x=0.82, y=0.25)"))
        list.add(ContextActionMapping("G", TacticalLayer.TANK_LAYER, "Deploy Smoke Gas Veil", "tap(x=0.78, y=0.32)"))
        list.add(ContextActionMapping("G", TacticalLayer.MENU_LAYER, "Cancel Buy / Close HUD Overlay", "tap(x=0.90, y=0.10)"))

        // Key E context binds
        list.add(ContextActionMapping("E", TacticalLayer.COMBAT_LAYER, "Interact/Revive Teammate", "tap(x=0.50, y=0.50) -> delay(2000)"))
        list.add(ContextActionMapping("E", TacticalLayer.VEHICLE_LAYER, "Honk Loud Horn", "tap(x=0.28, y=0.44)"))

        _bindings.value = list
        diagnosticManager.log("LAYER_ENGINE", "Loaded 14 dynamic contextual binding channels for F, G and E.")
    }

    fun setTacticalLayer(newLayer: TacticalLayer) {
        _activeLayer.value = newLayer
        diagnosticManager.log("LAYER_ENGINE", "Tactical context shifted directly to: $newLayer")
    }

    fun getActionForKey(key: String): ContextActionMapping? {
        val current = _activeLayer.value
        return _bindings.value.find { it.keyChar.equals(key, ignoreCase = true) && it.layer == current }
    }

    fun updateCustomMapping(key: String, layer: TacticalLayer, actionLabel: String, macro: String) {
        val updated = _bindings.value.map { item ->
            if (item.keyChar.equals(key, ignoreCase = true) && item.layer == layer) {
                item.copy(boundAction = actionLabel, macroSequence = macro)
            } else {
                item
            }
        }
        _bindings.value = updated
        diagnosticManager.log("LAYER_ENGINE", "Customized bind: Key [$key] in $layer mapped to '$actionLabel'")
    }
}
