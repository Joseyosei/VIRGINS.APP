import Foundation
import Combine

@MainActor
final class MessagesViewModel: ObservableObject {
    @Published var conversations: [Conversation] = []
    @Published var messages: [ChatMessage] = []
    @Published var isLoading = false
    @Published var partnerIsTyping = false
    @Published var newMessageText = ""

    private var currentConversationId: String?
    private let api = APIService.shared
    private let socket = SocketService.shared
    private var cancellables = Set<AnyCancellable>()

    init() {
        socket.newMessagePublisher
            .receive(on: DispatchQueue.main)
            .sink { [weak self] msg in
                guard let self, msg.conversationId == currentConversationId else { return }
                if !messages.contains(where: { $0.id == msg.id }) {
                    messages.append(msg)
                }
                updateConversationPreview(msg)
            }
            .store(in: &cancellables)

        socket.typingPublisher
            .receive(on: DispatchQueue.main)
            .sink { [weak self] (cid, _, isTyping) in
                guard let self, cid == currentConversationId else { return }
                partnerIsTyping = isTyping
            }
            .store(in: &cancellables)
    }

    func loadConversations() async {
        isLoading = true
        defer { isLoading = false }
        conversations = (try? await api.getConversations()) ?? []
    }

    func openConversation(_ conversationId: String) async {
        currentConversationId = conversationId
        socket.joinRoom(conversationId)
        isLoading = true
        defer { isLoading = false }
        messages = (try? await api.getMessages(conversationId: conversationId)) ?? []
    }

    func closeConversation() {
        if let cid = currentConversationId { socket.leaveRoom(cid) }
        currentConversationId = nil
        messages = []
        partnerIsTyping = false
    }

    func sendMessage(currentUserId: String) async {
        let text = newMessageText.trimmingCharacters(in: .whitespaces)
        guard !text.isEmpty, let cid = currentConversationId else { return }
        newMessageText = ""

        // Optimistic update
        let optimistic = ChatMessage(
            id: UUID().uuidString,
            conversationId: cid,
            senderId: currentUserId,
            content: text,
            type: .text,
            readAt: nil,
            createdAt: Date()
        )
        messages.append(optimistic)

        if let sent = try? await api.sendMessage(conversationId: cid, content: text) {
            if let idx = messages.firstIndex(where: { $0.id == optimistic.id }) {
                messages[idx] = sent
            }
        }
    }

    func sendTypingStart() {
        guard let cid = currentConversationId else { return }
        socket.sendTypingStart(cid)
    }

    func sendTypingStop() {
        guard let cid = currentConversationId else { return }
        socket.sendTypingStop(cid)
    }

    private func updateConversationPreview(_ msg: ChatMessage) {
        if let idx = conversations.firstIndex(where: { $0.id == msg.conversationId }) {
            conversations[idx].lastMessage = msg.content
            conversations[idx].lastMessageAt = msg.createdAt
        }
    }
}
