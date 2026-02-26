package app.virgins.data.repository

import app.virgins.data.local.TokenManager
import app.virgins.data.model.AuthResponse
import app.virgins.data.model.User
import app.virgins.data.network.ApiService
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AuthRepository @Inject constructor(
    private val api: ApiService,
    private val tokenManager: TokenManager
) {
    suspend fun login(email: String, password: String): Result<AuthResponse> = runCatching {
        val response = api.login(mapOf("email" to email, "password" to password))
        tokenManager.accessToken = response.accessToken
        tokenManager.refreshToken = response.refreshToken
        response
    }

    suspend fun getMe(): Result<User> = runCatching { api.getMe() }

    suspend fun refreshSession(): Result<AuthResponse> = runCatching {
        val refresh = tokenManager.refreshToken ?: error("No refresh token")
        val response = api.refreshToken(mapOf("refreshToken" to refresh))
        tokenManager.accessToken = response.accessToken
        tokenManager.refreshToken = response.refreshToken
        response
    }

    suspend fun logout() {
        runCatching { api.logout() }
        tokenManager.clear()
    }

    fun isLoggedIn() = tokenManager.accessToken != null
}
