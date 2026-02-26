package app.virgins.data.model

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class Conversation(
    @Json(name = "_id") val id: String,
    val participants: List<String>,
    val partner: MatchedUser? = null,
    val lastMessage: String? = null,
    val lastMessageAt: String? = null,
    val unreadCount: Int = 0,
    val isActive: Boolean = true
)

@JsonClass(generateAdapter = true)
data class ChatMessage(
    @Json(name = "_id") val id: String,
    val conversationId: String,
    val senderId: String,
    val content: String,
    val type: String = "text",
    val readAt: String? = null,
    val createdAt: String,
    val isDeleted: Boolean = false
)

@JsonClass(generateAdapter = true)
data class SendMessageRequest(
    val content: String,
    val type: String = "text"
)
