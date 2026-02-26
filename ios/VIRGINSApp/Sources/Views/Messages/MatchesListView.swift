import SwiftUI

struct MatchesListView: View {
    @ObservedObject var viewModel: MessagesViewModel
    @State private var matches: [Match] = []
    @State private var isLoading = false

    var body: some View {
        NavigationView {
            ZStack {
                Color.virginsCream.ignoresSafeArea()

                if isLoading {
                    ProgressView().tint(.virginsPurple)
                } else if matches.isEmpty {
                    VStack(spacing: 16) {
                        RingsLogoView(size: 70, color: .virginsPurple.opacity(0.4))
                        Text("No Matches Yet")
                            .font(.playfair(24, weight: .bold))
                            .foregroundColor(.virginsPurple)
                        Text("Start discovering — your first covenant match is waiting.")
                            .font(.custom("Inter-Regular", size: 14))
                            .foregroundColor(.gray)
                            .multilineTextAlignment(.center)
                            .padding(.horizontal, 40)
                    }
                } else {
                    ScrollView {
                        LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 16) {
                            ForEach(matches) { match in
                                MatchCard(match: match)
                            }
                        }
                        .padding(16)
                    }
                }
            }
            .navigationTitle("Matches")
            .task {
                isLoading = true
                matches = (try? await APIService.shared.getMatches()) ?? []
                isLoading = false
            }
        }
    }
}

struct MatchCard: View {
    let match: Match

    var body: some View {
        VStack(spacing: 0) {
            AsyncImage(url: URL(string: match.user.profileImage)) { img in
                img.resizable().scaledToFill()
            } placeholder: {
                Color.virginsPurple.opacity(0.15)
            }
            .frame(height: 160)
            .clipped()

            VStack(alignment: .leading, spacing: 6) {
                Text(match.user.displayName)
                    .font(.custom("Inter-Bold", size: 14))
                    .foregroundColor(.virginsPurple)
                    .lineLimit(1)

                HStack {
                    TrustBadgeView(level: match.user.trustLevel, compact: true)
                    Spacer()
                    if match.user.isOnline {
                        Circle().fill(Color.green).frame(width: 8, height: 8)
                    }
                }

                Text("Matched \(match.matchedAt.timeAgo) ago")
                    .font(.custom("Inter-Regular", size: 11))
                    .foregroundColor(.gray)
            }
            .padding(10)
            .background(Color.white)
        }
        .clipShape(RoundedRectangle(cornerRadius: 18))
        .shadow(color: .black.opacity(0.08), radius: 10, y: 4)
    }
}
