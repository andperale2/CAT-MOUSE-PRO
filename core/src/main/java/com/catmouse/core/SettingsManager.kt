package com.catmouse.core

import android.content.Context
import androidx.datastore.preferences.core.*
import androidx.datastore.preferences.preferencesDataStore
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import javax.inject.Inject
import javax.inject.Singleton

private val Context.dataStore by preferencesDataStore(name = "catmouse_settings")

@Singleton
class SettingsManager @Inject constructor(
    @ApplicationContext private val context: Context
) {
    companion object {
        val POINTER_SPEED = floatPreferencesKey("pointer_speed")
        val ACCELERATOR_ON = booleanPreferencesKey("accelerator_on")
        val HUD_GAUGE_THEME = stringPreferencesKey("hud_gauge_theme")
        val SPEED_LIMIT_THRESHOLD = intPreferencesKey("speed_limit_threshold")
    }

    val pointerSpeedFlow: Flow<Float> = context.dataStore.data.map { prefs ->
        prefs[POINTER_SPEED] ?: 1.0f
    }

    val acceleratorOnFlow: Flow<Boolean> = context.dataStore.data.map { prefs ->
        prefs[ACCELERATOR_ON] ?: false
    }

    val hudGaugeThemeFlow: Flow<String> = context.dataStore.data.map { prefs ->
        prefs[HUD_GAUGE_THEME] ?: "cyber"
    }

    val speedLimitFlow: Flow<Int> = context.dataStore.data.map { prefs ->
        prefs[SPEED_LIMIT_THRESHOLD] ?: 110
    }

    suspend fun setPointerSpeed(value: Float) {
        context.dataStore.edit { prefs ->
            prefs[POINTER_SPEED] = value
        }
    }

    suspend fun setAcceleratorOn(value: Boolean) {
        context.dataStore.edit { prefs ->
            prefs[ACCELERATOR_ON] = value
        }
    }

    suspend fun setHudGaugeTheme(value: String) {
        context.dataStore.edit { prefs ->
            prefs[HUD_GAUGE_THEME] = value
        }
    }

    suspend fun setSpeedLimit(value: Int) {
        context.dataStore.edit { prefs ->
            prefs[SPEED_LIMIT_THRESHOLD] = value
        }
    }
}
