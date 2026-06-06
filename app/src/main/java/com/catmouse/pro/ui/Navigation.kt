package com.catmouse.pro.ui

sealed class Screen(val route: String, val title: String) {
    object Dashboard : Screen("dashboard", "Dashboard")
    object Games : Screen("games", "Games")
    object Devices : Screen("devices", "Devices")
    object Profiles : Screen("profiles", "Profiles")
    object Settings : Screen("settings", "Settings")
}
