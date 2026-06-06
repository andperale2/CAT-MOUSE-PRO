package com.catmouse.shizuku

import android.accessibilityservice.AccessibilityService
import android.accessibilityservice.GestureDescription
import android.graphics.Path
import android.os.Build
import android.view.accessibility.AccessibilityEvent

class AccessibilityGestureService : AccessibilityService() {

    companion object {
        @Volatile
        var instance: AccessibilityGestureService? = null
            private set
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        // No-op implementation
    }

    override fun onInterrupt() {
        // No-op
    }

    override fun onServiceConnected() {
        super.onServiceConnected()
        instance = this
    }

    override fun onDestroy() {
        if (instance == this) {
            instance = null
        }
        super.onDestroy()
    }

    fun clickAt(x: Float, y: Float): Boolean {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            val path = Path()
            path.moveTo(x, y)
            val gestureBuilder = GestureDescription.Builder()
            val stroke = GestureDescription.StrokeDescription(path, 0, 80)
            gestureBuilder.addStroke(stroke)
            return dispatchGesture(gestureBuilder.build(), null, null)
        }
        return false
    }

    fun swipe(x1: Float, y1: Float, x2: Float, y2: Float, durationMs: Long): Boolean {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            val path = Path()
            path.moveTo(x1, y1)
            path.lineTo(x2, y2)
            val gestureBuilder = GestureDescription.Builder()
            val stroke = GestureDescription.StrokeDescription(path, 0, durationMs.coerceAtLeast(50))
            gestureBuilder.addStroke(stroke)
            return dispatchGesture(gestureBuilder.build(), null, null)
        }
        return false
    }
}
