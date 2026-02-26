package app.virgins.data.model

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class User(
    @Json(name = "_id") val id: String,
    val displayName: String,
    val email: String,
    val bio: String? = null,
    val profileImages: List<String> = emptyList(),
    val gender: String? = null,
    val age: Int? = null,
    val location: UserLocation? = null,
    val denomination: String? = null,
    val faithLevel: Int = 5,
    val valuesLevel: Int = 5,
    val intentionLevel: Int = 5,
    val lifestyleLevel: Int = 5,
    val trustLevel: Int = 1,
    val trustBadges: List<String> = emptyList(),
    val videoIntroUrl: String? = null,
    val isPremium: Boolean = false,
    val subscriptionTier: String = "free",
    val isOnline: Boolean = false,
    val lastSeen: String? = null,
    val pushToken: String? = null
)

@JsonClass(generateAdapter = true)
data class UserLocation(
    val city: String? = null,
    val country: String? = null,
    val lat: Double? = null,
    val lng: Double? = null
)
