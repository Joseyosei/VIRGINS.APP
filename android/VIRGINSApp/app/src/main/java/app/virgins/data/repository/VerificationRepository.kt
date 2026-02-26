package app.virgins.data.repository

import app.virgins.data.model.UserAnalytics
import app.virgins.data.model.VerificationStatus
import app.virgins.data.network.ApiService
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class VerificationRepository @Inject constructor(private val api: ApiService) {

    suspend fun getStatus(): Result<VerificationStatus> = runCatching {
        api.getVerificationStatus()
    }

    suspend fun signPledge(): Result<VerificationStatus> = runCatching { api.signPledge() }

    suspend fun requestReference(email: String): Result<Unit> = runCatching {
        api.requestReference(mapOf("referenceEmail" to email))
    }

    suspend fun initiateBackgroundCheck(): Result<Unit> = runCatching {
        api.initiateBackgroundCheck()
    }

    suspend fun getAnalytics(): Result<UserAnalytics> = runCatching { api.getAnalytics() }

    suspend fun activateBoost(): Result<Unit> = runCatching { api.activateBoost() }
}
