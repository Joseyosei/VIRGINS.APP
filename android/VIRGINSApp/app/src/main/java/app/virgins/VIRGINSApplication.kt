package app.virgins

import android.app.Application
import app.virgins.service.BillingService
import dagger.hilt.android.HiltAndroidApp
import javax.inject.Inject

@HiltAndroidApp
class VIRGINSApplication : Application() {

    @Inject
    lateinit var billingService: BillingService

    override fun onCreate() {
        super.onCreate()
        billingService.startConnection()
    }
}
