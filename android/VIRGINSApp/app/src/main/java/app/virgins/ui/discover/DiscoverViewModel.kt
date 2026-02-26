package app.virgins.ui.discover

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import app.virgins.data.model.DiscoverProfile
import app.virgins.data.model.LikeResponse
import app.virgins.data.repository.MatchRepository
import app.virgins.service.SocketEvent
import app.virgins.service.SocketService
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.filterIsInstance
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class DiscoverViewModel @Inject constructor(
    private val matchRepo: MatchRepository,
    private val socketService: SocketService
) : ViewModel() {

    private val _profiles = MutableStateFlow<List<DiscoverProfile>>(emptyList())
    val profiles: StateFlow<List<DiscoverProfile>> = _profiles.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    private val _matchAlert = MutableStateFlow<LikeResponse?>(null)
    val matchAlert: StateFlow<LikeResponse?> = _matchAlert.asStateFlow()

    private val _currentIndex = MutableStateFlow(0)
    val currentIndex: StateFlow<Int> = _currentIndex.asStateFlow()

    init {
        loadProfiles()
        observeNewMatches()
    }

    fun loadProfiles() {
        viewModelScope.launch {
            _isLoading.value = true
            matchRepo.getDiscover()
                .onSuccess { _profiles.value = it }
                .onFailure { /* show error */ }
            _isLoading.value = false
        }
    }

    fun like(userId: String) {
        viewModelScope.launch {
            matchRepo.likeUser(userId)
                .onSuccess { response ->
                    if (response.matched) _matchAlert.value = response
                    advance()
                }
                .onFailure { advance() }
        }
    }

    fun pass(userId: String) {
        viewModelScope.launch {
            matchRepo.passUser(userId)
            advance()
        }
    }

    fun dismissMatchAlert() {
        _matchAlert.value = null
    }

    private fun advance() {
        val next = _currentIndex.value + 1
        if (next >= _profiles.value.size) {
            _currentIndex.value = 0
            loadProfiles()
        } else {
            _currentIndex.value = next
        }
    }

    private fun observeNewMatches() {
        viewModelScope.launch {
            socketService.events
                .filterIsInstance<SocketEvent.NewMatch>()
                .collect { /* toast handled in UI */ }
        }
    }
}
