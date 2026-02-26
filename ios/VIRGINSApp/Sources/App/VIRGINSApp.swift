import SwiftUI

@main
struct VIRGINSApp: App {
    @StateObject private var authVM = AuthViewModel()
    @StateObject private var socketService = SocketService.shared

    var body: some Scene {
        WindowGroup {
            RootView()
                .environmentObject(authVM)
                .environmentObject(socketService)
                .preferredColorScheme(.light)
        }
    }
}
