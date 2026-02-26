package app.virgins.data.model

import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class VerificationStatus(
    val level: Int,
    val pledgeSignedAt: String? = null,
    val idReviewStatus: String? = null,
    val referenceApproved: Boolean = false,
    val backgroundCheckStatus: String? = null
)

@JsonClass(generateAdapter = true)
data class UserAnalytics(
    val likeCount: Int,
    val matchCount: Int,
    val profileCompleteness: Int,
    val boostActive: Boolean
)

@JsonClass(generateAdapter = true)
data class AuthResponse(
    val accessToken: String,
    val refreshToken: String,
    val user: User
)

@JsonClass(generateAdapter = true)
data class EmptyResponse(val success: Boolean = true)
