import Foundation
import Combine

@MainActor
final class AuthViewModel: ObservableObject {
    @Published var currentUser: User?
    @Published var isAuthenticated = false
    @Published var isLoading = true
    @Published var errorMessage: String?

    private let api = APIService.shared
    private let keychain = KeychainService.shared
    private let socketService = SocketService.shared

    init() {
        Task { await restoreSession() }
    }

    // MARK: - Auth Actions

    func login(email: String, password: String) async {
        errorMessage = nil
        do {
            let response = try await api.login(email: email, password: password)
            saveTokens(response)
            currentUser = response.user
            isAuthenticated = true
            socketService.connect(token: response.accessToken)
            await NotificationService.shared.requestPermission()
            NotificationService.shared.registerForRemoteNotifications()
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func logout() async {
        keychain.clearAll()
        currentUser = nil
        isAuthenticated = false
        socketService.disconnect()
    }

    // MARK: - Session Restore

    private func restoreSession() async {
        defer { isLoading = false }
        guard keychain.getToken(key: "accessToken") != nil else { return }
        do {
            // Try fetching current user with existing token
            currentUser = try await api.getMe()
            isAuthenticated = true
            if let token = keychain.getToken(key: "accessToken") {
                socketService.connect(token: token)
            }
        } catch APIError.unauthorized {
            // Token expired — try refresh
            await refreshSession()
        } catch {
            keychain.clearAll()
        }
    }

    private func refreshSession() async {
        do {
            let response = try await api.refreshToken()
            saveTokens(response)
            currentUser = response.user
            isAuthenticated = true
            socketService.connect(token: response.accessToken)
        } catch {
            keychain.clearAll()
        }
    }

    private func saveTokens(_ response: AuthResponse) {
        keychain.saveToken(response.accessToken, key: "accessToken")
        keychain.saveToken(response.refreshToken, key: "refreshToken")
    }
}
