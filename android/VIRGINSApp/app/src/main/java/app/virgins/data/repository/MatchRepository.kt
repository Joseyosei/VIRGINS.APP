package app.virgins.data.repository

import app.virgins.data.model.DiscoverProfile
import app.virgins.data.model.LikeResponse
import app.virgins.data.model.Match
import app.virgins.data.network.ApiService
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class MatchRepository @Inject constructor(private val api: ApiService) {

    suspend fun getDiscover(): Result<List<DiscoverProfile>> = runCatching {
        api.getDiscover(mapOf("maxDistanceKm" to 100, "minTrustLevel" to 1))
    }

    suspend fun likeUser(userId: String): Result<LikeResponse> = runCatching {
        api.likeUser(userId)
    }

    suspend fun passUser(userId: String): Result<Unit> = runCatching {
        api.passUser(userId)
    }

    suspend fun getMatches(): Result<List<Match>> = runCatching { api.getMatches() }

    suspend fun unmatch(matchId: String): Result<Unit> = runCatching {
        api.unmatch(matchId)
    }
}
