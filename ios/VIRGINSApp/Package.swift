// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "VIRGINSApp",
    platforms: [
        .iOS(.v17)
    ],
    products: [
        .library(
            name: "VIRGINSApp",
            targets: ["VIRGINSApp"]
        )
    ],
    dependencies: [
        .package(
            url: "https://github.com/socketio/socket.io-client-swift",
            from: "16.1.0"
        )
    ],
    targets: [
        .target(
            name: "VIRGINSApp",
            dependencies: [
                .product(name: "SocketIO", package: "socket.io-client-swift")
            ],
            path: "Sources",
            resources: [.process("PrivacyInfo.xcprivacy")]
        )
    ]
)
