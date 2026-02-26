import SwiftUI

// VIRGINS brand palette
extension Color {
    static let virginsPurple   = Color(red: 0.294, green: 0,     blue: 0.510)  // #4B0082
    static let virginsDark     = Color(red: 0.102, green: 0,     blue: 0.200)  // #1A0033
    static let virginsGold     = Color(red: 0.788, green: 0.659, blue: 0.298)  // #C9A84C
    static let virginsCream    = Color(red: 0.980, green: 0.969, blue: 0.945)  // #FAF7F2

    // Gradient helpers
    static let brandGradient = LinearGradient(
        colors: [.virginsDark, .virginsPurple],
        startPoint: .topLeading,
        endPoint: .bottomTrailing
    )
    static let goldGradient = LinearGradient(
        colors: [.virginsGold, .virginsGold.opacity(0.8)],
        startPoint: .topLeading,
        endPoint: .bottomTrailing
    )
}

// Typography
extension Font {
    // Playfair Display (must be bundled in project)
    static func playfair(_ size: CGFloat, weight: Font.Weight = .regular) -> Font {
        .custom("PlayfairDisplay-\(weight == .bold ? "Bold" : weight == .black ? "Black" : "Regular")", size: size)
    }
    static func playfairItalic(_ size: CGFloat) -> Font {
        .custom("PlayfairDisplay-Italic", size: size)
    }
}
