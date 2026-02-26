package app.virgins.di

import app.virgins.data.local.TokenManager
import app.virgins.data.network.ApiClient
import app.virgins.data.network.ApiService
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {

    @Provides
    @Singleton
    fun provideApiService(tokenManager: TokenManager): ApiService =
        ApiClient.create(tokenManager)
}
