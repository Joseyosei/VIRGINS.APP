import SwiftUI

struct RingsLogoView: View {
    var size: CGFloat = 44
    var color: Color = .virginsGold

    var body: some View {
        Canvas { context, canvasSize in
            let w = canvasSize.width
            let h = canvasSize.height
            let r = w * 0.22
            let cx1 = w * 0.35
            let cx2 = w * 0.65
            let cy  = h * 0.56

            // Left ring
            var leftPath = Path()
            leftPath.addEllipse(in: CGRect(x: cx1 - r, y: cy - r, width: r * 2, height: r * 2))
            context.stroke(leftPath, with: .color(color), lineWidth: w * 0.05)

            // Right ring
            var rightPath = Path()
            rightPath.addEllipse(in: CGRect(x: cx2 - r, y: cy - r, width: r * 2, height: r * 2))
            context.stroke(rightPath, with: .color(color), lineWidth: w * 0.05)

            // Diamond
            var diamond = Path()
            diamond.move(to:    CGPoint(x: w * 0.5, y: h * 0.15))
            diamond.addLine(to: CGPoint(x: w * 0.6, y: h * 0.35))
            diamond.addLine(to: CGPoint(x: w * 0.5, y: h * 0.55))
            diamond.addLine(to: CGPoint(x: w * 0.4, y: h * 0.35))
            diamond.closeSubpath()
            context.fill(diamond, with: .color(color))
        }
        .frame(width: size, height: size * 0.8)
    }
}

#Preview { RingsLogoView().padding().background(Color.virginsDark) }
