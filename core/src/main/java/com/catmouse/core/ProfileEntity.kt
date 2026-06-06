package com.catmouse.core

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "profiles")
data class ProfileEntity(
    @PrimaryKey val id: String,
    val name: String,
    val description: String,
    val category: String,
    val isActive: Boolean,
    val actionCount: Int
)
