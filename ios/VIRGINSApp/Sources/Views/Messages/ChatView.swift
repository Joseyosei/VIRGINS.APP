import SwiftUI

struct ChatView: View {
    let conversation: Conversation
    @ObservedObject var viewModel: MessagesViewModel
    let currentUserId: String
    @Environment(\.dismiss) private var dismiss
    @State private var typingDebounce: Task<Void, Never>?

    var body: some View {
        VStack(spacing: 0) {
            // Header
            chatHeader

            // Messages
            ScrollViewReader { proxy in
                ScrollView {
                    LazyVStack(spacing: 12) {
                        ForEach(viewModel.messages) { msg in
                            MessageBubble(message: msg, isSent: msg.isSentBy(currentUserId))
                                .id(msg.id)
                        }
                        if viewModel.partnerIsTyping {
                            TypingIndicator()
                                .id("typing")
                        }
                    }
                    .padding(.horizontal, 16)
                    .padding(.vertical, 12)
                }
                .onChange(of: viewModel.messages.count) { _ in
                    if let last = viewModel.messages.last {
                        withAnimation { proxy.scrollTo(last.id, anchor: .bottom) }
                    }
                }
                .onChange(of: viewModel.partnerIsTyping) { isTyping in
                    if isTyping { withAnimation { proxy.scrollTo("typing", anchor: .bottom) } }
                }
            }

            // Input bar
            inputBar
        }
        .background(Color.virginsCream)
        .navigationBarHidden(true)
        .task {
            await viewModel.openConversation(conversation.id)
        }
        .onDisappear { viewModel.closeConversation() }
    }

    private var chatHeader: some View {
        HStack(spacing: 12) {
            Button(action: { dismiss() }) {
                Image(systemName: "chevron.left")
                    .font(.system(size: 18, weight: .semibold))
                    .foregroundColor(.white)
            }

            AsyncImage(url: URL(string: conversation.partner.profileImage)) { img in
                img.resizable().scaledToFill()
            } placeholder: {
                Color.white.opacity(0.3)
            }
            .frame(width: 40, height: 40)
            .clipShape(Circle())
            .overlay(Circle().stroke(Color.virginsGold.opacity(0.6), lineWidth: 1.5))

            VStack(alignment: .leading, spacing: 2) {
                Text(conversation.partner.displayName)
                    .font(.custom("Inter-Bold", size: 16))
                    .foregroundColor(.white)
                Text(conversation.partner.isOnline ? "Online" : "Offline")
                    .font(.custom("Inter-Regular", size: 12))
                    .foregroundColor(conversation.partner.isOnline ? .green : .white.opacity(0.6))
            }

            Spacer()

            TrustBadgeView(level: conversation.partner.trustLevel, compact: true)
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
        .background(
            LinearGradient(colors: [.virginsDark, .virginsPurple], startPoint: .leading, endPoint: .trailing)
        )
    }

    private var inputBar: some View {
        HStack(spacing: 12) {
            TextField("Type a message...", text: $viewModel.newMessageText, axis: .vertical)
                .font(.custom("Inter-Regular", size: 15))
                .padding(.horizontal, 16)
                .padding(.vertical, 10)
                .background(Color.white)
                .clipShape(RoundedRectangle(cornerRadius: 22))
                .shadow(color: .black.opacity(0.05), radius: 4)
                .onChange(of: viewModel.newMessageText) { _ in
                    viewModel.sendTypingStart()
                    typingDebounce?.cancel()
                    typingDebounce = Task {
                        try? await Task.sleep(nanoseconds: 2_000_000_000)
                        viewModel.sendTypingStop()
                    }
                }
                .lineLimit(4)

            Button(action: { Task { await viewModel.sendMessage(currentUserId: currentUserId) } }) {
                Image(systemName: "arrow.up.circle.fill")
                    .font(.system(size: 38))
                    .foregroundColor(viewModel.newMessageText.isEmpty ? .gray.opacity(0.4) : .virginsGold)
            }
            .disabled(viewModel.newMessageText.isEmpty)
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
        .background(Color.white.shadow(radius: 4, y: -2))
    }
}

// MARK: - Message Bubble
struct MessageBubble: View {
    let message: ChatMessage
    let isSent: Bool

    var body: some View {
        HStack {
            if isSent { Spacer(minLength: 60) }

            VStack(alignment: isSent ? .trailing : .leading, spacing: 4) {
                Text(message.content)
                    .font(.custom("Inter-Regular", size: 15))
                    .foregroundColor(isSent ? .white : .black.opacity(0.85))
                    .padding(.horizontal, 14)
                    .padding(.vertical, 10)
                    .background(isSent ? Color.virginsPurple : Color.white)
                    .clipShape(
                        RoundedRectangle(cornerRadius: 18)
                            .corners(isSent ? [.topLeft, .topRight, .bottomLeft] : [.topLeft, .topRight, .bottomRight], radius: 18)
                    )
                    .shadow(color: .black.opacity(0.06), radius: 4, y: 2)

                HStack(spacing: 4) {
                    Text(message.createdAt.formatted(.dateTime.hour().minute()))
                        .font(.custom("Inter-Regular", size: 10))
                        .foregroundColor(.gray.opacity(0.7))
                    if isSent {
                        Image(systemName: message.readAt != nil ? "checkmark.circle.fill" : "checkmark.circle")
                            .font(.system(size: 10))
                            .foregroundColor(message.readAt != nil ? .virginsGold : .gray.opacity(0.5))
                    }
                }
            }

            if !isSent { Spacer(minLength: 60) }
        }
    }
}

// MARK: - Typing Indicator
struct TypingIndicator: View {
    @State private var bouncing = false

    var body: some View {
        HStack {
            HStack(spacing: 5) {
                ForEach(0..<3, id: \.self) { i in
                    Circle()
                        .fill(Color.gray.opacity(0.5))
                        .frame(width: 7, height: 7)
                        .offset(y: bouncing ? -4 : 0)
                        .animation(.easeInOut(duration: 0.4).repeatForever().delay(Double(i) * 0.13), value: bouncing)
                }
            }
            .padding(.horizontal, 14)
            .padding(.vertical, 10)
            .background(Color.white)
            .clipShape(RoundedRectangle(cornerRadius: 18))
            Spacer()
        }
        .onAppear { bouncing = true }
    }
}

// Corner radius helper
extension RoundedRectangle {
    func corners(_ corners: UIRectCorner, radius: CGFloat) -> some Shape {
        UnevenRoundedRectangle(cornerRadii: .init(
            topLeading:     corners.contains(.topLeft)     ? radius : 4,
            bottomLeading:  corners.contains(.bottomLeft)  ? radius : 4,
            bottomTrailing: corners.contains(.bottomRight) ? radius : 4,
            topTrailing:    corners.contains(.topRight)    ? radius : 4
        ))
    }
}
