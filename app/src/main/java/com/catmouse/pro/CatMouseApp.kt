package com.catmouse.pro

import android.app.Application
import dagger.hilt.android.HiltAndroidApp

@HiltAndroidApp
class CatMouseApp : Application() {
    override fun onCreate() {
        super.onCreate()
    }
}
