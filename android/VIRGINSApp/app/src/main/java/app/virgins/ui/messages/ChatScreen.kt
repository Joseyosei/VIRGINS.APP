package app.virgins.ui.messages

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Send
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import app.virgins.data.model.ChatMessage
import app.virgins.data.model.Conversation
import app.virgins.ui.common.TrustBadge
import app.virgins.ui.theme.*

@Composable
fun ChatScreen(
    conversation: Conversation,
    currentUserId: String,
    viewModel: MessagesViewModel,
    onBack: () -> Unit
) {
    val messages by viewModel.messages.collectAsState()
    val typingUsers by viewModel.typingUsers.collectAsState()
    var messageText by remember { mutableStateOf("") }
    val listState = rememberLazyListState()

    LaunchedEffect(conversation.id) {
        viewModel.openConversation(conversation.id)
    }

    LaunchedEffect(messages.size) {
        if (messages.isNotEmpty()) {
            listState.animateScrollToItem(messages.size - 1)
        }
    }

    DisposableEffect(Unit) {
        onDispose { viewModel.closeConversation() }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(VirginsDark)
    ) {
        // Header
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(Brush.horizontalGradient(listOf(VirginsDark, VirginsPurple)))
                .padding(12.dp)
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                IconButton(onClick = onBack) {
                    Icon(Icons.Default.ArrowBack, null, tint = VirginsCream)
                }
                Spacer(Modifier.width(8.dp))
                Column(modifier = Modifier.weight(1f)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            text = conversation.partner?.displayName ?: "Chat",
                            style = MaterialTheme.typography.titleMedium,
                            color = VirginsCream,
                            fontWeight = FontWeight.SemiBold
                        )
                        Spacer(Modifier.width(6.dp))
                        TrustBadge(conversation.partner?.trustLevel ?: 1, size = 18.dp)
                    }
                    Text(
                        text = if (conversation.partner?.isOnline == true) "Online" else "Offline",
                        style = MaterialTheme.typography.bodySmall,
                        color = if (conversation.partner?.isOnline == true) SuccessGreen
                               else VirginsCream.copy(alpha = 0.5f)
                    )
                }
            }
        }

        // Messages
        LazyColumn(
            state = listState,
            modifier = Modifier.weight(1f),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(messages) { msg ->
                MessageBubble(message = msg, isOwn = msg.senderId == currentUserId)
            }
            if (typingUsers.isNotEmpty()) {
                item { TypingIndicator() }
            }
        }

        // Input bar
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(VirginsDarkSurface)
                .padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            OutlinedTextField(
                value = messageText,
                onValueChange = {
                    messageText = it
                    if (it.isNotEmpty()) viewModel.startTyping()
                },
                placeholder = { Text("Write a message...", color = VirginsCream.copy(alpha = 0.4f)) },
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = VirginsPurpleLight,
                    unfocusedBorderColor = VirginsCream.copy(alpha = 0.2f),
                    focusedTextColor = VirginsCream,
                    unfocusedTextColor = VirginsCream,
                    cursorColor = VirginGold
                ),
                modifier = Modifier.weight(1f),
                maxLines = 4,
                shape = RoundedCornerShape(20.dp)
            )
            Spacer(Modifier.width(8.dp))
            FloatingActionButton(
                onClick = {
                    if (messageText.isNotBlank()) {
                        viewModel.sendMessage(messageText.trim(), currentUserId)
                        messageText = ""
                    }
                },
                containerColor = VirginGold,
                contentColor = VirginsDark,
                modifier = Modifier.size(48.dp)
            ) {
                Icon(Icons.Default.Send, null)
            }
        }
    }
}

@Composable
fun MessageBubble(message: ChatMessage, isOwn: Boolean) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = if (isOwn) Arrangement.End else Arrangement.Start
    ) {
        Box(
            modifier = Modifier
                .widthIn(max = 280.dp)
                .background(
                    if (isOwn) VirginsPurple else VirginsDarkSurface,
                    RoundedCornerShape(
                        topStart = 16.dp, topEnd = 16.dp,
                        bottomStart = if (isOwn) 16.dp else 4.dp,
                        bottomEnd = if (isOwn) 4.dp else 16.dp
                    )
                )
                .padding(horizontal = 14.dp, vertical = 10.dp)
        ) {
            Text(
                text = message.content,
                color = VirginsCream,
                style = MaterialTheme.typography.bodyMedium
            )
        }
    }
}

@Composable
fun TypingIndicator() {
    val infiniteTransition = rememberInfiniteTransition(label = "typing")
    Row(
        modifier = Modifier.padding(start = 8.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        repeat(3) { i ->
            val offsetY by infiniteTransition.animateFloat(
                initialValue = 0f,
                targetValue = -6f,
                animationSpec = infiniteRepeatable(
                    animation = tween(400, delayMillis = i * 130),
                    repeatMode = RepeatMode.Reverse
                ),
                label = "dot$i"
            )
            Box(
                modifier = Modifier
                    .offset(y = offsetY.dp)
                    .size(8.dp)
                    .background(VirginGold, CircleShape)
            )
            if (i < 2) Spacer(Modifier.width(4.dp))
        }
    }
}
