package app.virgins.data.repository

import app.virgins.data.model.ChatMessage
import app.virgins.data.model.Conversation
import app.virgins.data.model.SendMessageRequest
import app.virgins.data.network.ApiService
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class MessageRepository @Inject constructor(private val api: ApiService) {

    suspend fun getConversations(): Result<List<Conversation>> = runCatching {
        api.getConversations()
    }

    suspend fun getMessages(conversationId: String, page: Int = 1): Result<List<ChatMessage>> =
        runCatching { api.getMessages(conversationId, page) }

    suspend fun sendMessage(conversationId: String, content: String): Result<ChatMessage> =
        runCatching { api.sendMessage(conversationId, SendMessageRequest(content)) }
}
