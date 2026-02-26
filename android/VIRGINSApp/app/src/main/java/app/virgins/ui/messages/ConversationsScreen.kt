package app.virgins.ui.messages

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import app.virgins.data.model.Conversation
import app.virgins.ui.common.TrustBadge
import app.virgins.ui.theme.*
import coil.compose.AsyncImage

@Composable
fun ConversationsScreen(
    viewModel: MessagesViewModel = hiltViewModel(),
    onOpenChat: (Conversation) -> Unit
) {
    val conversations by viewModel.conversations.collectAsState()

    LaunchedEffect(Unit) { viewModel.loadConversations() }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(VirginsDark)
    ) {
        Text(
            text = "Messages",
            style = MaterialTheme.typography.headlineSmall,
            color = VirginsCream,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(20.dp)
        )

        if (conversations.isEmpty()) {
            Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("💬", style = MaterialTheme.typography.displayMedium)
                    Spacer(Modifier.height(8.dp))
                    Text("No conversations yet", color = VirginsCream, style = MaterialTheme.typography.titleMedium)
                    Text("Match with someone to start chatting", color = VirginGold, style = MaterialTheme.typography.bodySmall)
                }
            }
        } else {
            LazyColumn {
                items(conversations) { conversation ->
                    ConversationRow(
                        conversation = conversation,
                        onClick = { onOpenChat(conversation) }
                    )
                }
            }
        }
    }
}

@Composable
fun ConversationRow(conversation: Conversation, onClick: () -> Unit) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick)
            .padding(horizontal = 16.dp, vertical = 10.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Box {
            val photoUrl = conversation.partner?.profileImages?.firstOrNull()
            if (photoUrl != null) {
                AsyncImage(
                    model = photoUrl,
                    contentDescription = null,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.size(56.dp).clip(CircleShape)
                )
            } else {
                Box(
                    modifier = Modifier
                        .size(56.dp)
                        .clip(CircleShape)
                        .background(VirginsPurpleContainer),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = conversation.partner?.displayName?.first()?.uppercaseChar()?.toString() ?: "?",
                        style = MaterialTheme.typography.titleLarge,
                        color = VirginsCream
                    )
                }
            }
            if (conversation.partner?.isOnline == true) {
                Box(
                    modifier = Modifier
                        .size(14.dp)
                        .align(Alignment.BottomEnd)
                        .background(SuccessGreen, CircleShape)
                )
            }
        }

        Spacer(Modifier.width(12.dp))

        Column(modifier = Modifier.weight(1f)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(
                    text = conversation.partner?.displayName ?: "Unknown",
                    style = MaterialTheme.typography.titleMedium,
                    color = VirginsCream,
                    fontWeight = FontWeight.SemiBold
                )
                Spacer(Modifier.width(6.dp))
                TrustBadge(conversation.partner?.trustLevel ?: 1, size = 16.dp)
            }
            Text(
                text = conversation.lastMessage ?: "Start your courtship...",
                style = MaterialTheme.typography.bodySmall,
                color = VirginsCream.copy(alpha = 0.6f),
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
        }

        if (conversation.unreadCount > 0) {
            Box(
                modifier = Modifier
                    .background(VirginGold, CircleShape)
                    .padding(horizontal = 6.dp, vertical = 2.dp),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = conversation.unreadCount.toString(),
                    color = VirginsDark,
                    style = MaterialTheme.typography.labelLarge,
                    fontWeight = FontWeight.Bold
                )
            }
        }
    }
}
