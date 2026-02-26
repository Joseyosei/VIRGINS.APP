package app.virgins.ui.auth

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import app.virgins.BuildConfig
import app.virgins.data.local.TokenManager
import app.virgins.data.model.User
import app.virgins.data.repository.AuthRepository
import app.virgins.service.SocketService
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

sealed class AuthState {
    object Loading : AuthState()
    object Unauthenticated : AuthState()
    data class Authenticated(val user: User) : AuthState()
    data class Error(val message: String) : AuthState()
}

@HiltViewModel
class AuthViewModel @Inject constructor(
    private val authRepo: AuthRepository,
    private val tokenManager: TokenManager,
    private val socketService: SocketService
) : ViewModel() {

    private val _state = MutableStateFlow<AuthState>(AuthState.Loading)
    val state: StateFlow<AuthState> = _state.asStateFlow()

    init { restoreSession() }

    private fun restoreSession() {
        viewModelScope.launch {
            if (!authRepo.isLoggedIn()) {
                _state.value = AuthState.Unauthenticated
                return@launch
            }
            authRepo.getMe()
                .onSuccess { user ->
                    _state.value = AuthState.Authenticated(user)
                    connectSocket()
                }
                .onFailure {
                    authRepo.refreshSession()
                        .onSuccess { response ->
                            _state.value = AuthState.Authenticated(response.user)
                            connectSocket()
                        }
                        .onFailure {
                            authRepo.logout()
                            _state.value = AuthState.Unauthenticated
                        }
                }
        }
    }

    fun login(email: String, password: String) {
        _state.value = AuthState.Loading
        viewModelScope.launch {
            authRepo.login(email, password)
                .onSuccess { response ->
                    _state.value = AuthState.Authenticated(response.user)
                    connectSocket()
                }
                .onFailure { _state.value = AuthState.Error(it.message ?: "Login failed") }
        }
    }

    fun logout() {
        viewModelScope.launch {
            socketService.disconnect()
            authRepo.logout()
            _state.value = AuthState.Unauthenticated
        }
    }

    fun clearError() {
        if (_state.value is AuthState.Error) {
            _state.value = AuthState.Unauthenticated
        }
    }

    private fun connectSocket() {
        val token = tokenManager.accessToken ?: return
        socketService.connect(BuildConfig.BASE_URL.removeSuffix("/api"), token)
    }
}
