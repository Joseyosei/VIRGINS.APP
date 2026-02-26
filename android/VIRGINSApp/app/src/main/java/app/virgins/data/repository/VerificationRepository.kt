package app.virgins.data.repository

import android.content.Context
import android.net.Uri
import app.virgins.data.model.UserAnalytics
import app.virgins.data.model.VerificationStatus
import app.virgins.data.network.ApiService
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.RequestBody.Companion.toRequestBody
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

    suspend fun uploadId(uri: Uri, context: Context): Result<Unit> = runCatching {
        val stream = context.contentResolver.openInputStream(uri)
            ?: error("Cannot open file")
        val bytes = stream.readBytes()
        stream.close()
        val requestFile = bytes.toRequestBody("image/*".toMediaTypeOrNull())
        val body = MultipartBody.Part.createFormData("idFront", "id_document.jpg", requestFile)
        val idType = "government_id".toRequestBody("text/plain".toMediaTypeOrNull())
        api.uploadId(body, idType)
    }

    suspend fun initiateBackgroundCheck(): Result<Unit> = runCatching {
        api.initiateBackgroundCheck()
    }

    suspend fun getAnalytics(): Result<UserAnalytics> = runCatching { api.getAnalytics() }

    suspend fun activateBoost(): Result<Unit> = runCatching { api.activateBoost() }
}
