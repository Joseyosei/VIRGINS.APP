package app.virgins.data.model

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class Match(
    @Json(name = "_id") val id: String,
    val userId1: String,
    val userId2: String,
    val matchedAt: String,
    val status: String,
    val partner: MatchedUser? = null
)

@JsonClass(generateAdapter = true)
data class MatchedUser(
    @Json(name = "_id") val id: String,
    val displayName: String,
    val profileImages: List<String> = emptyList(),
    val trustLevel: Int = 1,
    val isOnline: Boolean = false,
    val denomination: String? = null,
    val age: Int? = null
)

@JsonClass(generateAdapter = true)
data class DiscoverProfile(
    val user: User,
    val score: Int,
    val reasons: List<String> = emptyList(),
    val breakdown: ScoreBreakdown? = null
)

@JsonClass(generateAdapter = true)
data class ScoreBreakdown(
    val faith: Int,
    val values: Int,
    val intention: Int,
    val lifestyle: Int,
    val location: Int,
    val trustBonus: Double
)

@JsonClass(generateAdapter = true)
data class LikeResponse(
    val matched: Boolean,
    val conversationId: String? = null
)
