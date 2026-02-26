import Foundation

struct Match: Codable, Identifiable {
    let id: String
    let user: MatchedUser
    let matchedAt: Date
    let conversationId: String?

    enum CodingKeys: String, CodingKey {
        case id = "_id"
        case user, matchedAt, conversationId
    }
}

struct MatchedUser: Codable, Identifiable {
    let id: String
    var displayName: String
    var profileImages: [String]
    var trustLevel: Int
    var isOnline: Bool
    var location: String?

    enum CodingKeys: String, CodingKey {
        case id = "_id"
        case displayName, profileImages, trustLevel, isOnline, location
    }

    var profileImage: String { profileImages.first ?? "" }
}

struct DiscoverProfile: Codable, Identifiable {
    let id: String
    let user: User
    let score: Double
    let reasons: [String]
    let breakdown: ScoreBreakdown

    enum CodingKeys: String, CodingKey {
        case id = "_id"
        case user, score, reasons, breakdown
    }
}

struct ScoreBreakdown: Codable {
    let faithScore: Double
    let valuesScore: Double
    let intentionScore: Double
    let lifestyleScore: Double
    let locationBonus: Double
    let trustBonus: Double
}
