import Foundation

struct User: Codable, Identifiable {
    let id: String
    var displayName: String
    var email: String
    var bio: String?
    var profileImages: [String]
    var gender: String?
    var age: Int?
    var location: String?
    var denomination: String?
    var faithLevel: Int
    var valuesLevel: Int
    var intentionLevel: Int
    var lifestyleLevel: Int
    var trustLevel: Int
    var trustBadges: [String]
    var videoIntroUrl: String?
    var isPremium: Bool
    var subscriptionTier: String?
    var isOnline: Bool
    var lastSeen: Date?

    enum CodingKeys: String, CodingKey {
        case id = "_id"
        case displayName, email, bio, profileImages, gender, age
        case location, denomination
        case faithLevel, valuesLevel, intentionLevel, lifestyleLevel
        case trustLevel, trustBadges, videoIntroUrl
        case isPremium, subscriptionTier, isOnline, lastSeen
    }
}

struct TrustBadge {
    let level: Int
    var title: String {
        switch level {
        case 1: return "Pledge Signed"
        case 2: return "ID Verified"
        case 3: return "Community Vouched"
        case 4: return "Background Checked"
        default: return "Unverified"
        }
    }
    var color: Color {
        switch level {
        case 1: return .blue
        case 2: return .green
        case 3: return .virginsPurple
        case 4: return .virginsGold
        default: return .gray
        }
    }
}

import SwiftUI
