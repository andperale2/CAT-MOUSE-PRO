package com.catmouse.shizuku

import android.content.pm.PackageManager
import rikka.shizuku.Shizuku
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class ShizukuManagerHelper @Inject constructor() {
    private val _isShizukuAvailable = MutableStateFlow(false)
    val isShizukuAvailable: StateFlow<Boolean> = _isShizukuAvailable

    private val _isShizukuPermissionGranted = MutableStateFlow(false)
    val isShizukuPermissionGranted: StateFlow<Boolean> = _isShizukuPermissionGranted

    fun checkShizukuState(): Boolean {
        return try {
            val available = Shizuku.pingBinder()
            _isShizukuAvailable.value = available
            if (available) {
                val granted = Shizuku.checkSelfPermission() == PackageManager.PERMISSION_GRANTED
                _isShizukuPermissionGranted.value = granted
                granted
            } else {
                _isShizukuPermissionGranted.value = false
                false
            }
        } catch (e: Exception) {
            _isShizukuAvailable.value = false
            _isShizukuPermissionGranted.value = false
            false
        }
    }

    fun requestShizukuPermission() {
        try {
            if (Shizuku.pingBinder()) {
                Shizuku.requestPermission(1001)
            }
        } catch (e: Exception) {
            // Avoid crashing in environments where Shizuku classloader isn't bound yet
        }
    }
}
