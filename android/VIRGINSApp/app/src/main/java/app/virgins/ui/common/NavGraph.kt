package app.virgins.ui.common

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavDestination.Companion.hierarchy
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import app.virgins.ui.auth.AuthState
import app.virgins.ui.auth.AuthViewModel
import app.virgins.ui.auth.LoginScreen
import app.virgins.ui.auth.OnboardingScreen
import app.virgins.ui.discover.DiscoverScreen
import app.virgins.ui.messages.ChatScreen
import app.virgins.ui.messages.ConversationsScreen
import app.virgins.ui.messages.MessagesViewModel
import app.virgins.ui.premium.PricingScreen
import app.virgins.ui.profile.ProfileScreen
import app.virgins.ui.verification.VerificationScreen
import app.virgins.ui.theme.*

sealed class Screen(val route: String, val label: String, val icon: ImageVector) {
    object Discover : Screen("discover", "Discover", Icons.Default.Favorite)
    object Messages : Screen("messages", "Messages", Icons.Default.Message)
    object Verify : Screen("verify", "Verify", Icons.Default.Shield)
    object Profile : Screen("profile", "Profile", Icons.Default.Person)
}

private val bottomNavItems = listOf(Screen.Discover, Screen.Messages, Screen.Verify, Screen.Profile)

@Composable
fun VIRGINSNavGraph(authViewModel: AuthViewModel = hiltViewModel()) {
    val authState by authViewModel.state.collectAsState()

    when (authState) {
        is AuthState.Loading -> VirginsSplashScreen()
        is AuthState.Unauthenticated, is AuthState.Error -> AuthNavHost(authViewModel)
        is AuthState.Authenticated -> {
            val user = (authState as AuthState.Authenticated).user
            MainNavHost(userId = user.id, authViewModel = authViewModel)
        }
    }
}

@Composable
private fun AuthNavHost(authViewModel: AuthViewModel) {
    // Separate NavController so auth back-stack never leaks into the main app graph
    val navController = rememberNavController()
    NavHost(navController = navController, startDestination = "onboarding") {
        composable("onboarding") {
            OnboardingScreen(onComplete = { navController.navigate("login") })
        }
        composable("login") {
            LoginScreen(
                viewModel = authViewModel,
                onNavigateToOnboarding = { navController.popBackStack() }
            )
        }
    }
}

@Composable
private fun MainNavHost(userId: String, authViewModel: AuthViewModel) {
    // Fresh NavController with its own back stack — no auth routes present
    val navController = rememberNavController()
    val messagesViewModel: MessagesViewModel = hiltViewModel()

    Scaffold(
        bottomBar = {
            NavigationBar(containerColor = VirginsDarkSurface) {
                val navBackStackEntry by navController.currentBackStackEntryAsState()
                val currentDestination = navBackStackEntry?.destination
                bottomNavItems.forEach { screen ->
                    val selected = currentDestination?.hierarchy?.any { it.route == screen.route } == true
                    NavigationBarItem(
                        selected = selected,
                        onClick = {
                            navController.navigate(screen.route) {
                                popUpTo(navController.graph.findStartDestination().id) { saveState = true }
                                launchSingleTop = true
                                restoreState = true
                            }
                        },
                        icon = { Icon(screen.icon, screen.label) },
                        label = { Text(screen.label) },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = VirginGold,
                            selectedTextColor = VirginGold,
                            unselectedIconColor = VirginsCream.copy(alpha = 0.5f),
                            unselectedTextColor = VirginsCream.copy(alpha = 0.5f),
                            indicatorColor = VirginsPurple.copy(alpha = 0.3f)
                        )
                    )
                }
            }
        },
        containerColor = VirginsDark
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = Screen.Discover.route,
            modifier = Modifier.padding(innerPadding)
        ) {
            composable(Screen.Discover.route) { DiscoverScreen() }
            composable(Screen.Messages.route) {
                ConversationsScreen(viewModel = messagesViewModel) { conversation ->
                    navController.navigate("chat/${conversation.id}")
                }
            }
            composable(
                "chat/{conversationId}",
                arguments = listOf(navArgument("conversationId") { type = NavType.StringType })
            ) { backStackEntry ->
                val convId = backStackEntry.arguments?.getString("conversationId") ?: return@composable
                val conversation = messagesViewModel.conversations.value.find { it.id == convId }
                if (conversation != null) {
                    ChatScreen(
                        conversation = conversation,
                        currentUserId = userId,
                        viewModel = messagesViewModel,
                        onBack = { navController.popBackStack() }
                    )
                }
            }
            composable(Screen.Verify.route) { VerificationScreen() }
            composable(Screen.Profile.route) {
                ProfileScreen(
                    onLogout = { authViewModel.logout() },
                    onOpenPricing = { navController.navigate("pricing") },
                    onOpenVerification = { navController.navigate(Screen.Verify.route) }
                )
            }
            composable("pricing") {
                PricingScreen(onClose = { navController.popBackStack() })
            }
        }
    }
}
