import Foundation

struct Conversation: Codable, Identifiable {
    let id: String
    let matchId: String
    let partner: MatchedUser
    var lastMessage: String?
    var lastMessageAt: Date?
    var unreadCount: Int

    enum CodingKeys: String, CodingKey {
        case id = "_id"
        case matchId, partner, lastMessage, lastMessageAt, unreadCount
    }
}

struct ChatMessage: Codable, Identifiable {
    let id: String
    let conversationId: String
    let senderId: String
    var content: String
    let type: MessageType
    var readAt: Date?
    let createdAt: Date

    enum CodingKeys: String, CodingKey {
        case id = "_id"
        case conversationId, senderId, content, type, readAt, createdAt
    }

    enum MessageType: String, Codable {
        case text, image, voice, gif
    }

    func isSentBy(_ userId: String) -> Bool { senderId == userId }
}
