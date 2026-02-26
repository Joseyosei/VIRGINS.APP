import SwiftUI

struct MainTabView: View {
    @EnvironmentObject var authVM: AuthViewModel
    @StateObject private var discoverVM  = DiscoverViewModel()
    @StateObject private var messagesVM  = MessagesViewModel()
    @State private var selectedTab = 0
    @State private var showMatchAlert = false
    @State private var newMatch: Match?

    var body: some View {
        TabView(selection: $selectedTab) {
            DiscoverView(viewModel: discoverVM)
                .tabItem { Label("Discover", systemImage: "heart.circle.fill") }
                .tag(0)

            MatchesListView(viewModel: messagesVM)
                .tabItem { Label("Matches", systemImage: "person.2.fill") }
                .tag(1)

            ConversationsView(viewModel: messagesVM)
                .tabItem { Label("Messages", systemImage: "message.fill") }
                .tag(2)

            VerificationView()
                .tabItem { Label("Verify", systemImage: "shield.fill") }
                .tag(3)

            ProfileView()
                .tabItem { Label("Profile", systemImage: "person.crop.circle.fill") }
                .tag(4)
        }
        .tint(.virginsPurple)
        .onReceive(discoverVM.$matchAlert.compactMap { $0 }) { match in
            newMatch = match
            showMatchAlert = true
        }
        .sheet(isPresented: $showMatchAlert) {
            if let match = newMatch {
                MatchCelebrationView(match: match) {
                    showMatchAlert = false
                    selectedTab = 2
                }
            }
        }
        .task { await discoverVM.loadProfiles() }
        .task { await messagesVM.loadConversations() }
    }
}
