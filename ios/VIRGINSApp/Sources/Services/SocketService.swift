import Foundation
import Combine

// NOTE: Requires SocketIO Swift package:
// https://github.com/socketio/socket.io-client-swift
// Add via SPM: .package(url: "https://github.com/socketio/socket.io-client-swift", from: "16.0.0")

import SocketIO

final class SocketService: ObservableObject {
    static let shared = SocketService()

    private var manager: SocketManager?
    private var socket: SocketIOClient?

    // Publishers
    let newMessagePublisher    = PassthroughSubject<ChatMessage, Never>()
    let typingPublisher        = PassthroughSubject<(conversationId: String, userId: String, isTyping: Bool), Never>()
    let newMatchPublisher      = PassthroughSubject<Match, Never>()
    let messageReadPublisher   = PassthroughSubject<(conversationId: String, messageId: String), Never>()

    @Published var isConnected = false

    func connect(token: String) {
        let serverURL = URL(string: "http://localhost:5000")!
        manager = SocketManager(socketURL: serverURL, config: [
            .log(false),
            .compress,
            .connectParams(["token": token]),
            .reconnects(true),
            .reconnectAttempts(5)
        ])
        socket = manager?.defaultSocket

        socket?.on(clientEvent: .connect)    { [weak self] _, _ in self?.isConnected = true }
        socket?.on(clientEvent: .disconnect) { [weak self] _, _ in self?.isConnected = false }

        socket?.on("receive_message") { [weak self] data, _ in
            guard let json = data.first as? [String: Any],
                  let msg = try? JSONDecoder.isoDecoder.decode(ChatMessage.self, from: JSONSerialization.data(withJSONObject: json)) else { return }
            self?.newMessagePublisher.send(msg)
        }

        socket?.on("typing_start") { [weak self] data, _ in
            guard let d = data.first as? [String: String],
                  let cid = d["conversationId"], let uid = d["userId"] else { return }
            self?.typingPublisher.send((cid, uid, true))
        }

        socket?.on("typing_stop") { [weak self] data, _ in
            guard let d = data.first as? [String: String],
                  let cid = d["conversationId"], let uid = d["userId"] else { return }
            self?.typingPublisher.send((cid, uid, false))
        }

        socket?.on("new_match") { [weak self] data, _ in
            guard let json = data.first as? [String: Any],
                  let match = try? JSONDecoder.isoDecoder.decode(Match.self, from: JSONSerialization.data(withJSONObject: json)) else { return }
            self?.newMatchPublisher.send(match)
        }

        socket?.on("message_read") { [weak self] data, _ in
            guard let d = data.first as? [String: String],
                  let cid = d["conversationId"], let mid = d["messageId"] else { return }
            self?.messageReadPublisher.send((cid, mid))
        }

        socket?.connect()
    }

    func disconnect() {
        socket?.disconnect()
        manager = nil
        socket = nil
        isConnected = false
    }

    func joinRoom(_ conversationId: String) {
        socket?.emit("join_room", ["conversationId": conversationId])
    }

    func leaveRoom(_ conversationId: String) {
        socket?.emit("leave_room", ["conversationId": conversationId])
    }

    func sendTypingStart(_ conversationId: String) {
        socket?.emit("typing_start", ["conversationId": conversationId])
    }

    func sendTypingStop(_ conversationId: String) {
        socket?.emit("typing_stop", ["conversationId": conversationId])
    }

    func markRead(conversationId: String, messageId: String) {
        socket?.emit("message_read", ["conversationId": conversationId, "messageId": messageId])
    }
}

private extension JSONDecoder {
    static var isoDecoder: JSONDecoder {
        let d = JSONDecoder()
        d.keyDecodingStrategy = .convertFromSnakeCase
        d.dateDecodingStrategy = .iso8601
        return d
    }
}
