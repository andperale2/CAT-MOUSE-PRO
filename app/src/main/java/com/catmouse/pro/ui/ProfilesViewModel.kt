package com.catmouse.pro.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.catmouse.core.ProfileEntity
import com.catmouse.core.ProfilesDao
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class ProfilesViewModel @Inject constructor(
    private val profilesDao: ProfilesDao
) : ViewModel() {

    val profilesState: StateFlow<List<ProfileEntity>> = profilesDao.getAllProfiles()
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = emptyList()
        )

    fun addProfile(name: String, desc: String, category: String) {
        viewModelScope.launch {
            val id = java.util.UUID.randomUUID().toString()
            val profile = ProfileEntity(
                id = id,
                name = name,
                description = desc,
                category = category,
                isActive = false,
                actionCount = (3..15).random()
            )
            profilesDao.insertProfile(profile)
        }
    }

    fun deleteProfile(profile: ProfileEntity) {
        viewModelScope.launch {
            profilesDao.deleteProfile(profile)
        }
    }

    fun toggleProfileActive(profile: ProfileEntity) {
        viewModelScope.launch {
            profilesDao.updateProfile(profile.copy(isActive = !profile.isActive))
        }
    }
}
