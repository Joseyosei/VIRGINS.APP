package app.virgins.ui.verification

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import app.virgins.data.model.VerificationStatus
import app.virgins.data.repository.VerificationRepository
import app.virgins.ui.theme.*
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class VerificationViewModel @Inject constructor(
    private val repo: VerificationRepository
) : ViewModel() {
    private val _status = MutableStateFlow<VerificationStatus?>(null)
    val status: StateFlow<VerificationStatus?> = _status.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    init { loadStatus() }

    fun loadStatus() {
        viewModelScope.launch {
            repo.getStatus().onSuccess { _status.value = it }
        }
    }

    fun signPledge() {
        viewModelScope.launch {
            _isLoading.value = true
            repo.signPledge().onSuccess { _status.value = it }
            _isLoading.value = false
        }
    }

    fun requestReference(email: String) {
        viewModelScope.launch {
            _isLoading.value = true
            repo.requestReference(email)
            _isLoading.value = false
        }
    }

    fun initiateBackgroundCheck() {
        viewModelScope.launch {
            _isLoading.value = true
            repo.initiateBackgroundCheck()
            loadStatus()
            _isLoading.value = false
        }
    }
}

data class VerificationStep(
    val title: String,
    val description: String,
    val icon: ImageVector,
    val requiredLevel: Int
)

private val steps = listOf(
    VerificationStep("Sign Covenant Pledge", "Commit to purity and covenant relationship standards.", Icons.Default.Favorite, 1),
    VerificationStep("ID Verification", "Upload a government ID to verify your identity.", Icons.Default.Badge, 2),
    VerificationStep("Community Reference", "A community member vouches for your character.", Icons.Default.People, 3),
    VerificationStep("Background Check", "Premium: comprehensive background verification.", Icons.Default.Security, 4)
)

@Composable
fun VerificationScreen(viewModel: VerificationViewModel = hiltViewModel()) {
    val status by viewModel.status.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()
    var referenceEmail by remember { mutableStateOf("") }
    var showReferenceInput by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(VirginsDark)
            .verticalScroll(rememberScrollState())
            .padding(20.dp)
    ) {
        Text(
            text = "Trust Verification",
            style = MaterialTheme.typography.headlineSmall,
            color = VirginsCream,
            fontWeight = FontWeight.Bold
        )
        Text(
            text = "Build trust with your covenant community",
            style = MaterialTheme.typography.bodySmall,
            color = VirginGold
        )

        Spacer(Modifier.height(24.dp))

        // Trust level stepper
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceEvenly
        ) {
            (1..4).forEach { level ->
                val currentLevel = status?.level ?: 0
                val isDone = currentLevel >= level
                val isActive = currentLevel == level - 1
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Box(
                        modifier = Modifier
                            .size(40.dp)
                            .background(
                                when {
                                    isDone -> VirginGold
                                    isActive -> VirginsPurple
                                    else -> VirginsDarkSurface
                                },
                                CircleShape
                            )
                            .border(
                                2.dp,
                                if (isActive) VirginsPurpleLight else Color.Transparent,
                                CircleShape
                            ),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = level.toString(),
                            color = if (isDone) VirginsDark else VirginsCream,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
                if (level < 4) {
                    Divider(
                        modifier = Modifier
                            .weight(1f)
                            .align(Alignment.CenterVertically),
                        color = if ((status?.level ?: 0) > level) VirginGold
                               else VirginsCream.copy(alpha = 0.2f)
                    )
                }
            }
        }

        Spacer(Modifier.height(32.dp))

        // Step cards
        steps.forEachIndexed { index, step ->
            val currentLevel = status?.level ?: 0
            val isCompleted = currentLevel >= step.requiredLevel
            val isNext = currentLevel == index

            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 12.dp),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(
                    containerColor = when {
                        isCompleted -> VirginGold.copy(alpha = 0.1f)
                        isNext -> VirginsPurpleContainer
                        else -> VirginsDarkSurface
                    }
                ),
                border = if (isNext) androidx.compose.foundation.BorderStroke(1.dp, VirginsPurpleLight)
                         else null
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(48.dp)
                            .background(
                                if (isCompleted) VirginGold.copy(alpha = 0.2f)
                                else VirginsPurple.copy(alpha = 0.15f),
                                CircleShape
                            ),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            step.icon,
                            null,
                            tint = if (isCompleted) VirginGold else VirginsPurpleLight,
                            modifier = Modifier.size(24.dp)
                        )
                    }
                    Spacer(Modifier.width(16.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            step.title,
                            style = MaterialTheme.typography.titleMedium,
                            color = if (isCompleted) VirginGold else VirginsCream,
                            fontWeight = FontWeight.SemiBold
                        )
                        Text(
                            step.description,
                            style = MaterialTheme.typography.bodySmall,
                            color = VirginsCream.copy(alpha = 0.7f)
                        )
                    }
                    if (isCompleted) {
                        Icon(Icons.Default.CheckCircle, null, tint = VirginGold)
                    }
                }

                // Action button for next step
                if (isNext && !isLoading) {
                    Box(modifier = Modifier.padding(start = 80.dp, end = 16.dp, bottom = 16.dp)) {
                        when (index) {
                            0 -> Button(
                                onClick = { viewModel.signPledge() },
                                colors = ButtonDefaults.buttonColors(containerColor = VirginsPurple)
                            ) { Text("Sign Pledge", color = VirginsCream) }
                            2 -> {
                                if (showReferenceInput) {
                                    Column {
                                        OutlinedTextField(
                                            value = referenceEmail,
                                            onValueChange = { referenceEmail = it },
                                            placeholder = { Text("Reference email") },
                                            colors = OutlinedTextFieldDefaults.colors(
                                                focusedBorderColor = VirginsPurpleLight,
                                                unfocusedBorderColor = VirginsCream.copy(alpha = 0.3f),
                                                focusedTextColor = VirginsCream,
                                                unfocusedTextColor = VirginsCream
                                            )
                                        )
                                        Spacer(Modifier.height(8.dp))
                                        Button(
                                            onClick = {
                                                viewModel.requestReference(referenceEmail)
                                                showReferenceInput = false
                                            },
                                            colors = ButtonDefaults.buttonColors(containerColor = VirginsPurple)
                                        ) { Text("Send Request", color = VirginsCream) }
                                    }
                                } else {
                                    Button(
                                        onClick = { showReferenceInput = true },
                                        colors = ButtonDefaults.buttonColors(containerColor = VirginsPurple)
                                    ) { Text("Request Reference", color = VirginsCream) }
                                }
                            }
                            3 -> Button(
                                onClick = { viewModel.initiateBackgroundCheck() },
                                colors = ButtonDefaults.buttonColors(containerColor = VirginGold)
                            ) { Text("Initiate Check", color = VirginsDark, fontWeight = FontWeight.Bold) }
                        }
                    }
                }
                if (isLoading && isNext) {
                    Box(modifier = Modifier.padding(16.dp).fillMaxWidth(), contentAlignment = Alignment.Center) {
                        CircularProgressIndicator(color = VirginGold, modifier = Modifier.size(24.dp))
                    }
                }
            }
        }
    }
}
