package app.virgins.data.network

import app.virgins.data.model.*
import retrofit2.http.*

interface ApiService {

    // Auth
    @POST("auth/login")
    suspend fun login(@Body body: Map<String, String>): AuthResponse

    @POST("auth/logout")
    suspend fun logout(): EmptyResponse

    @GET("auth/me")
    suspend fun getMe(): User

    @POST("auth/refresh-token")
    suspend fun refreshToken(@Body body: Map<String, String>): AuthResponse

    // Discover / Matching
    @POST("users/matches")
    suspend fun getDiscover(@Body prefs: Map<String, @JvmSuppressWildcards Any>): List<DiscoverProfile>

    @POST("matches/like/{userId}")
    suspend fun likeUser(@Path("userId") userId: String): LikeResponse

    @POST("matches/pass/{userId}")
    suspend fun passUser(@Path("userId") userId: String): EmptyResponse

    @GET("matches")
    suspend fun getMatches(): List<Match>

    @DELETE("matches/unmatch/{matchId}")
    suspend fun unmatch(@Path("matchId") matchId: String): EmptyResponse

    // Messages
    @GET("messages/conversations")
    suspend fun getConversations(): List<Conversation>

    @GET("messages/conversations/{id}/messages")
    suspend fun getMessages(
        @Path("id") conversationId: String,
        @Query("page") page: Int = 1
    ): List<ChatMessage>

    @POST("messages/conversations/{id}/messages")
    suspend fun sendMessage(
        @Path("id") conversationId: String,
        @Body body: SendMessageRequest
    ): ChatMessage

    // Verification
    @GET("verify/status")
    suspend fun getVerificationStatus(): VerificationStatus

    @POST("verify/pledge")
    suspend fun signPledge(): VerificationStatus

    @POST("verify/reference")
    suspend fun requestReference(@Body body: Map<String, String>): EmptyResponse

    @POST("verify/background-check")
    suspend fun initiateBackgroundCheck(): EmptyResponse

    // Premium
    @POST("premium/boost")
    suspend fun activateBoost(): EmptyResponse

    @GET("premium/analytics")
    suspend fun getAnalytics(): UserAnalytics

    // Push token
    @POST("users/push-token")
    suspend fun savePushToken(@Body body: Map<String, String>): EmptyResponse
}
