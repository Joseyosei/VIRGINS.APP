package app.virgins.ui.messages

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import app.virgins.data.model.ChatMessage
import app.virgins.data.model.Conversation
import app.virgins.data.repository.MessageRepository
import app.virgins.service.SocketEvent
import app.virgins.service.SocketService
import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class MessagesViewModel @Inject constructor(
    private val messageRepo: MessageRepository,
    private val socketService: SocketService
) : ViewModel() {

    private val _conversations = MutableStateFlow<List<Conversation>>(emptyList())
    val conversations: StateFlow<List<Conversation>> = _conversations.asStateFlow()

    private val _messages = MutableStateFlow<List<ChatMessage>>(emptyList())
    val messages: StateFlow<List<ChatMessage>> = _messages.asStateFlow()

    private val _activeConversationId = MutableStateFlow<String?>(null)
    val activeConversationId: StateFlow<String?> = _activeConversationId.asStateFlow()

    private val _typingUsers = MutableStateFlow<Set<String>>(emptySet())
    val typingUsers: StateFlow<Set<String>> = _typingUsers.asStateFlow()

    private var typingJob: Job? = null

    init {
        loadConversations()
        observeSocketEvents()
    }

    fun loadConversations() {
        viewModelScope.launch {
            messageRepo.getConversations()
                .onSuccess { _conversations.value = it }
        }
    }

    fun openConversation(conversationId: String) {
        _activeConversationId.value?.let { socketService.leaveRoom(it) }
        _activeConversationId.value = conversationId
        socketService.joinRoom(conversationId)
        viewModelScope.launch {
            messageRepo.getMessages(conversationId)
                .onSuccess { _messages.value = it }
        }
    }

    fun closeConversation() {
        _activeConversationId.value?.let { socketService.leaveRoom(it) }
        _activeConversationId.value = null
        _messages.value = emptyList()
    }

    fun sendMessage(content: String, currentUserId: String) {
        val conversationId = _activeConversationId.value ?: return
        val optimistic = ChatMessage(
            id = "temp_${System.currentTimeMillis()}",
            conversationId = conversationId,
            senderId = currentUserId,
            content = content,
            createdAt = ""
        )
        _messages.value = _messages.value + optimistic
        viewModelScope.launch {
            messageRepo.sendMessage(conversationId, content)
                .onSuccess { msg ->
                    _messages.value = _messages.value.map {
                        if (it.id == optimistic.id) msg else it
                    }
                }
                .onFailure {
                    _messages.value = _messages.value.filter { it.id != optimistic.id }
                }
        }
    }

    fun startTyping() {
        _activeConversationId.value?.let {
            socketService.sendTypingStart(it)
            typingJob?.cancel()
            typingJob = viewModelScope.launch {
                delay(2000)
                socketService.sendTypingStop(it)
            }
        }
    }

    private fun observeSocketEvents() {
        viewModelScope.launch {
            socketService.events.collect { event ->
                when (event) {
                    is SocketEvent.NewMessage -> {
                        // Parse and append if it belongs to the active conversation
                        val json = event.json
                        val convId = json.optString("conversationId")
                        if (convId == _activeConversationId.value) {
                            val msg = ChatMessage(
                                id = json.optString("_id"),
                                conversationId = convId,
                                senderId = json.optString("senderId"),
                                content = json.optString("content"),
                                createdAt = json.optString("createdAt")
                            )
                            _messages.value = _messages.value + msg
                        }
                        loadConversations()
                    }
                    is SocketEvent.TypingStart -> {
                        _typingUsers.value = _typingUsers.value + event.userId
                    }
                    is SocketEvent.TypingStop -> {
                        _typingUsers.value = _typingUsers.value - event.userId
                    }
                    else -> {}
                }
            }
        }
    }
}
