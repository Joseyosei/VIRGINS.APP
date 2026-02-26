import SwiftUI

struct ConversationsView: View {
    @ObservedObject var viewModel: MessagesViewModel
    @EnvironmentObject var authVM: AuthViewModel
    @State private var selectedConversation: Conversation?

    var body: some View {
        NavigationView {
            ZStack {
                Color.virginsCream.ignoresSafeArea()

                if viewModel.conversations.isEmpty {
                    VStack(spacing: 16) {
                        Image(systemName: "message.badge.circle")
                            .font(.system(size: 60))
                            .foregroundColor(.virginsPurple.opacity(0.3))
                        Text("No Conversations Yet")
                            .font(.playfair(22, weight: .bold))
                            .foregroundColor(.virginsPurple)
                        Text("Match with someone to start a courtship conversation.")
                            .font(.custom("Inter-Regular", size: 14))
                            .foregroundColor(.gray)
                            .multilineTextAlignment(.center)
                            .padding(.horizontal, 40)
                    }
                } else {
                    List(viewModel.conversations) { conversation in
                        Button(action: { selectedConversation = conversation }) {
                            ConversationRow(conversation: conversation)
                        }
                        .listRowBackground(Color.white)
                        .listRowSeparatorTint(Color.virginsPurple.opacity(0.1))
                    }
                    .listStyle(.plain)
                    .scrollContentBackground(.hidden)
                }
            }
            .navigationTitle("Messages")
            .sheet(item: $selectedConversation) { conversation in
                ChatView(
                    conversation: conversation,
                    viewModel: viewModel,
                    currentUserId: authVM.currentUser?.id ?? ""
                )
            }
            .task { await viewModel.loadConversations() }
        }
    }
}

// MARK: - Conversation Row
struct ConversationRow: View {
    let conversation: Conversation

    var body: some View {
        HStack(spacing: 14) {
            // Avatar
            ZStack(alignment: .bottomTrailing) {
                AsyncImage(url: URL(string: conversation.partner.profileImage)) { img in
                    img.resizable().scaledToFill()
                } placeholder: {
                    Color.virginsPurple.opacity(0.2)
                }
                .frame(width: 56, height: 56)
                .clipShape(Circle())
                .overlay(Circle().stroke(Color.virginsGold.opacity(0.5), lineWidth: 1.5))

                if conversation.partner.isOnline {
                    Circle()
                        .fill(Color.green)
                        .frame(width: 12, height: 12)
                        .overlay(Circle().stroke(Color.white, lineWidth: 2))
                }
            }

            // Content
            VStack(alignment: .leading, spacing: 4) {
                HStack {
                    Text(conversation.partner.displayName)
                        .font(.custom("Inter-Bold", size: 15))
                        .foregroundColor(.virginsPurple)
                    Spacer()
                    if let date = conversation.lastMessageAt {
                        Text(date.timeAgo)
                            .font(.custom("Inter-Regular", size: 11))
                            .foregroundColor(.gray)
                    }
                }

                HStack {
                    Text(conversation.lastMessage ?? "Say hello!")
                        .font(.custom("Inter-Regular", size: 13))
                        .foregroundColor(.gray)
                        .lineLimit(1)
                    Spacer()
                    if conversation.unreadCount > 0 {
                        Text("\(conversation.unreadCount)")
                            .font(.custom("Inter-Bold", size: 11))
                            .foregroundColor(.white)
                            .padding(.horizontal, 7)
                            .padding(.vertical, 3)
                            .background(Color.virginsPurple)
                            .clipShape(Capsule())
                    }
                }

                TrustBadgeView(level: conversation.partner.trustLevel, compact: true)
            }
        }
        .padding(.vertical, 8)
    }
}

// MARK: - Date extension
extension Date {
    var timeAgo: String {
        let interval = Date().timeIntervalSince(self)
        if interval < 60 { return "now" }
        if interval < 3600 { return "\(Int(interval/60))m" }
        if interval < 86400 { return "\(Int(interval/3600))h" }
        return "\(Int(interval/86400))d"
    }
}
