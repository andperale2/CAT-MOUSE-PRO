pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "CatMouseProAndroid"

include(":app")
include(":core")
include(":input")
include(":overlay")
include(":profiles")
include(":devices")
include(":vehicles")
include(":shizuku")
