package com.catmouse.shizuku

import android.app.Service
import android.content.Intent
import android.os.IBinder

class InputBinderService : Service() {

    private val binder = object : IInputBinder.Stub() {
        override fun injectTap(x: Int, y: Int) {
            // Stub implementation for Phase 1 base architecture
        }

        override fun injectSwipe(x1: Int, y1: Int, x2: Int, y2: Int, durationMs: Int) {
            // Stub implementation for Phase 1 base architecture
        }

        override fun setPointerSpeedMultiplier(multiplier: Float) {
            // Stub implementation for Phase 1 base architecture
        }

        override fun isAuthorized(): Boolean {
            return true
        }
    }

    override fun onBind(intent: Intent?): IBinder {
        return binder
    }
}
