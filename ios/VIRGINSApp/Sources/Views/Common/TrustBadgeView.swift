import SwiftUI

struct TrustBadgeView: View {
    let level: Int
    var compact = false

    private var color: Color {
        switch level {
        case 1: return .blue
        case 2: return .green
        case 3: return .virginsPurple
        case 4: return .virginsGold
        default: return .gray
        }
    }

    private var label: String {
        switch level {
        case 1: return "Pledged"
        case 2: return "ID Verified"
        case 3: return "Vouched"
        case 4: return "Background ✓"
        default: return "Unverified"
        }
    }

    var body: some View {
        HStack(spacing: 4) {
            Image(systemName: "shield.fill")
                .font(.system(size: compact ? 10 : 12))
                .foregroundColor(color)
            if !compact {
                Text(label)
                    .font(.custom("Inter-Bold", size: 10))
                    .foregroundColor(color)
            }
        }
        .padding(.horizontal, compact ? 6 : 8)
        .padding(.vertical, compact ? 3 : 4)
        .background(color.opacity(0.12))
        .clipShape(Capsule())
        .overlay(Capsule().strokeBorder(color.opacity(0.3), lineWidth: 1))
    }
}
