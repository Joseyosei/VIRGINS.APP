import Foundation

enum APIError: Error, LocalizedError {
    case invalidURL
    case noData
    case decodingError(Error)
    case serverError(Int, String)
    case unauthorized

    var errorDescription: String? {
        switch self {
        case .invalidURL:       return "Invalid URL"
        case .noData:           return "No data received"
        case .decodingError(let e): return "Decoding error: \(e.localizedDescription)"
        case .serverError(let code, let msg): return "Server error \(code): \(msg)"
        case .unauthorized:     return "Session expired. Please sign in again."
        }
    }
}

actor APIService {
    static let shared = APIService()

    private let baseURL: String = {
        // Switch to production URL in release builds
        #if DEBUG
        return "http://localhost:5000/api"
        #else
        return "https://api.virgins.app/api"
        #endif
    }()

    private var accessToken: String? {
        get { KeychainService.shared.getToken(key: "accessToken") }
    }

    // MARK: - Auth
    func login(email: String, password: String) async throws -> AuthResponse {
        try await post("/auth/login", body: ["email": email, "password": password])
    }

    func refreshToken() async throws -> AuthResponse {
        guard let refresh = KeychainService.shared.getToken(key: "refreshToken") else {
            throw APIError.unauthorized
        }
        return try await post("/auth/refresh-token", body: ["refreshToken": refresh], authenticated: false)
    }

    func getMe() async throws -> User {
        try await get("/auth/me")
    }

    // MARK: - Discover / Matching
    func getDiscover(prefs: DiscoverPrefs) async throws -> [DiscoverProfile] {
        let body: [String: Any] = [
            "maxDistanceKm": prefs.maxDistanceKm,
            "minTrustLevel": prefs.minTrustLevel,
            "faithImportance": prefs.faithImportance,
            "valueImportance": prefs.valueImportance
        ]
        return try await post("/users/matches", body: body)
    }

    func likeUser(_ userId: String) async throws -> LikeResponse {
        try await post("/matches/like/\(userId)", body: [:])
    }

    func passUser(_ userId: String) async throws -> EmptyResponse {
        try await post("/matches/pass/\(userId)", body: [:])
    }

    func getMatches() async throws -> [Match] {
        try await get("/matches")
    }

    // MARK: - Messages
    func getConversations() async throws -> [Conversation] {
        try await get("/messages/conversations")
    }

    func getMessages(conversationId: String, page: Int = 1) async throws -> [ChatMessage] {
        try await get("/messages/conversations/\(conversationId)/messages?page=\(page)")
    }

    func sendMessage(conversationId: String, content: String) async throws -> ChatMessage {
        try await post("/messages/conversations/\(conversationId)/messages", body: ["content": content])
    }

    // MARK: - Verification
    func getVerificationStatus() async throws -> VerificationStatus {
        try await get("/verify/status")
    }

    func signPledge() async throws -> VerificationStatus {
        try await post("/verify/pledge", body: [:])
    }

    func requestReference(email: String) async throws -> EmptyResponse {
        try await post("/verify/reference", body: ["referenceEmail": email])
    }

    // MARK: - Premium
    func activateBoost() async throws -> EmptyResponse {
        try await post("/premium/boost", body: [:])
    }

    func getAnalytics() async throws -> UserAnalytics {
        try await get("/premium/analytics")
    }

    // MARK: - Push Notifications
    func savePushToken(_ token: String) async throws -> EmptyResponse {
        try await post("/users/push-token", body: ["pushToken": token])
    }

    // MARK: - Core HTTP
    private func get<T: Decodable>(_ path: String, authenticated: Bool = true) async throws -> T {
        let request = try buildRequest(method: "GET", path: path, body: nil, authenticated: authenticated)
        return try await perform(request)
    }

    private func post<T: Decodable>(_ path: String, body: [String: Any], authenticated: Bool = true) async throws -> T {
        let request = try buildRequest(method: "POST", path: path, body: body, authenticated: authenticated)
        return try await perform(request)
    }

    private func buildRequest(method: String, path: String, body: [String: Any]?, authenticated: Bool) throws -> URLRequest {
        guard let url = URL(string: baseURL + path) else { throw APIError.invalidURL }
        var req = URLRequest(url: url)
        req.httpMethod = method
        req.setValue("application/json", forHTTPHeaderField: "Content-Type")
        if authenticated, let token = accessToken {
            req.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }
        if let body {
            req.httpBody = try JSONSerialization.data(withJSONObject: body)
        }
        return req
    }

    private func perform<T: Decodable>(_ request: URLRequest) async throws -> T {
        let (data, response) = try await URLSession.shared.data(for: request)
        guard let http = response as? HTTPURLResponse else { throw APIError.noData }
        if http.statusCode == 401 { throw APIError.unauthorized }
        guard (200...299).contains(http.statusCode) else {
            let msg = (try? JSONDecoder().decode(ErrorResponse.self, from: data))?.message ?? "Unknown error"
            throw APIError.serverError(http.statusCode, msg)
        }
        do {
            let decoder = JSONDecoder()
            decoder.keyDecodingStrategy = .convertFromSnakeCase
            decoder.dateDecodingStrategy = .iso8601
            return try decoder.decode(T.self, from: data)
        } catch {
            throw APIError.decodingError(error)
        }
    }
}

// MARK: - Response types
struct AuthResponse: Codable {
    let accessToken: String
    let refreshToken: String
    let user: User
}

struct LikeResponse: Codable {
    let matched: Bool
    let conversationId: String?
}

struct EmptyResponse: Codable {}

struct ErrorResponse: Codable {
    let message: String
}

struct DiscoverPrefs {
    var maxDistanceKm: Int = 100
    var minTrustLevel: Int = 1
    var faithImportance: Double = 0.7
    var valueImportance: Double = 0.8
}

struct VerificationStatus: Codable {
    let level: Int
    let pledgeSignedAt: Date?
    let idReviewStatus: String?
    let referenceApproved: Bool
    let backgroundCheckStatus: String?
}

struct UserAnalytics: Codable {
    let likeCount: Int
    let matchCount: Int
    let profileCompleteness: Int
    let boostActive: Bool
}
