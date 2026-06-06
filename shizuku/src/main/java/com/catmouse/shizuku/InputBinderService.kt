package com.catmouse.shizuku

import android.app.Service
import android.content.Intent
import android.os.IBinder

class InputBinderService : Service() {

    private val binder = object : IInputBinder.Stub() {
        override fun injectTap(x: Int, y: Int) {
            AccessibilityGestureService.instance?.clickAt(x.toFloat(), y.toFloat())
        }

        override fun injectSwipe(x1: Int, y1: Int, x2: Int, y2: Int, durationMs: Int) {
            AccessibilityGestureService.instance?.swipe(x1.toFloat(), y1.toFloat(), x2.toFloat(), y2.toFloat(), durationMs.toLong())
        }

        override fun setPointerSpeedMultiplier(multiplier: Float) {
            // Stub implementation for multiplier config
        }

        override fun isAuthorized(): Boolean {
            return true
        }
    }

    override fun onBind(intent: Intent?): IBinder {
        return binder
    }
}
