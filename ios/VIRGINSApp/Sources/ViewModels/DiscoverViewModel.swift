import Foundation
import Combine

@MainActor
final class DiscoverViewModel: ObservableObject {
    @Published var profiles: [DiscoverProfile] = []
    @Published var currentIndex = 0
    @Published var isLoading = false
    @Published var matchAlert: Match?
    @Published var errorMessage: String?

    var prefs = DiscoverPrefs()
    private let api = APIService.shared
    private var cancellables = Set<AnyCancellable>()

    init() {
        // Listen for new matches via socket
        SocketService.shared.newMatchPublisher
            .receive(on: DispatchQueue.main)
            .sink { [weak self] match in self?.matchAlert = match }
            .store(in: &cancellables)
    }

    var currentProfile: DiscoverProfile? {
        guard currentIndex < profiles.count else { return nil }
        return profiles[currentIndex]
    }

    func loadProfiles() async {
        isLoading = true
        defer { isLoading = false }
        do {
            profiles = try await api.getDiscover(prefs: prefs)
            currentIndex = 0
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func like() async {
        guard let profile = currentProfile else { return }
        do {
            let result = try await api.likeUser(profile.user.id)
            if result.matched {
                // Build a temporary match for the alert
                let matched = Match(
                    id: result.conversationId ?? UUID().uuidString,
                    user: MatchedUser(
                        id: profile.user.id,
                        displayName: profile.user.displayName,
                        profileImages: profile.user.profileImages,
                        trustLevel: profile.user.trustLevel,
                        isOnline: profile.user.isOnline,
                        location: profile.user.location
                    ),
                    matchedAt: Date(),
                    conversationId: result.conversationId
                )
                matchAlert = matched
            }
        } catch {
            errorMessage = error.localizedDescription
        }
        advance()
    }

    func pass() async {
        guard let profile = currentProfile else { return }
        _ = try? await api.passUser(profile.user.id)
        advance()
    }

    private func advance() {
        if currentIndex < profiles.count - 1 {
            currentIndex += 1
        } else {
            // Reload when deck is exhausted
            Task { await loadProfiles() }
        }
    }
}
