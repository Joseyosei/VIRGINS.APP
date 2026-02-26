package app.virgins.service

import io.socket.client.IO
import io.socket.client.Socket
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.SharedFlow
import kotlinx.coroutines.flow.asSharedFlow
import org.json.JSONObject
import javax.inject.Inject
import javax.inject.Singleton

sealed class SocketEvent {
    data class NewMessage(val json: JSONObject) : SocketEvent()
    data class TypingStart(val userId: String) : SocketEvent()
    data class TypingStop(val userId: String) : SocketEvent()
    data class NewMatch(val json: JSONObject) : SocketEvent()
    data class MessageRead(val messageId: String) : SocketEvent()
}

@Singleton
class SocketService @Inject constructor() {

    private var socket: Socket? = null

    private val _events = MutableSharedFlow<SocketEvent>(extraBufferCapacity = 64)
    val events: SharedFlow<SocketEvent> = _events.asSharedFlow()

    fun connect(serverUrl: String, token: String) {
        if (socket?.connected() == true) return
        val options = IO.Options.builder()
            .setAuth(mapOf("token" to token))
            .build()
        socket = IO.socket(serverUrl, options).apply {
            on(Socket.EVENT_CONNECT) { }
            on("receive_message") { args ->
                (args.firstOrNull() as? JSONObject)?.let {
                    _events.tryEmit(SocketEvent.NewMessage(it))
                }
            }
            on("typing_start") { args ->
                (args.firstOrNull() as? JSONObject)?.optString("userId")?.let {
                    _events.tryEmit(SocketEvent.TypingStart(it))
                }
            }
            on("typing_stop") { args ->
                (args.firstOrNull() as? JSONObject)?.optString("userId")?.let {
                    _events.tryEmit(SocketEvent.TypingStop(it))
                }
            }
            on("new_match") { args ->
                (args.firstOrNull() as? JSONObject)?.let {
                    _events.tryEmit(SocketEvent.NewMatch(it))
                }
            }
            on("message_read") { args ->
                (args.firstOrNull() as? JSONObject)?.optString("messageId")?.let {
                    _events.tryEmit(SocketEvent.MessageRead(it))
                }
            }
            connect()
        }
    }

    fun disconnect() {
        socket?.disconnect()
        socket = null
    }

    fun joinRoom(conversationId: String) {
        socket?.emit("join_room", conversationId)
    }

    fun leaveRoom(conversationId: String) {
        socket?.emit("leave_room", conversationId)
    }

    fun sendTypingStart(conversationId: String) {
        socket?.emit("typing_start", JSONObject().put("conversationId", conversationId))
    }

    fun sendTypingStop(conversationId: String) {
        socket?.emit("typing_stop", JSONObject().put("conversationId", conversationId))
    }

    fun markRead(messageId: String) {
        socket?.emit("message_read", JSONObject().put("messageId", messageId))
    }

    fun isConnected() = socket?.connected() == true
}
