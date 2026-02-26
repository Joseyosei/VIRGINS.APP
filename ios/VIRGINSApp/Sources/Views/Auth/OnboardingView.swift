import SwiftUI

struct OnboardingView: View {
    @EnvironmentObject var authVM: AuthViewModel
    @Environment(\.dismiss) private var dismiss
    @State private var step = 1
    @State private var details = OnboardingDetails()
    @State private var isLoading = false

    var body: some View {
        ZStack {
            Color.virginsCream.ignoresSafeArea()

            VStack(spacing: 0) {
                // Progress bar
                GeometryReader { geo in
                    ZStack(alignment: .leading) {
                        Rectangle().fill(Color.gray.opacity(0.12)).frame(height: 3)
                        Rectangle().fill(Color.virginsPurple).frame(width: geo.size.width * CGFloat(step) / 5.0, height: 3)
                            .animation(.easeInOut(duration: 0.4), value: step)
                    }
                }
                .frame(height: 3)

                // Step label
                HStack {
                    if step > 1 {
                        Button(action: { withAnimation { step -= 1 } }) {
                            Image(systemName: "chevron.left").foregroundColor(.virginsPurple)
                        }
                    }
                    Spacer()
                    Text("Step \(step) of 5")
                        .font(.custom("Inter-Bold", size: 12))
                        .foregroundColor(.virginsPurple)
                        .tracking(1)
                        .textCase(.uppercase)
                }
                .padding(.horizontal, 24)
                .padding(.vertical, 12)

                // Step content
                ScrollView {
                    Group {
                        switch step {
                        case 1: step1View
                        case 2: step2View
                        case 3: step3View
                        case 4: step4View
                        case 5: step5View
                        default: EmptyView()
                        }
                    }
                    .padding(.horizontal, 24)
                    .padding(.bottom, 40)
                    .transition(.asymmetric(insertion: .move(edge: .trailing), removal: .move(edge: .leading)))
                }
            }
        }
        .navigationBarHidden(true)
    }

    // MARK: - Step 1: Email
    private var step1View: some View {
        VStack(alignment: .leading, spacing: 24) {
            stepHeader(title: "Your Email", subtitle: "We'll use this to secure your covenant account.")

            VStack(alignment: .leading, spacing: 8) {
                fieldLabel("Email Address")
                TextField("you@example.com", text: $details.email)
                    .keyboardType(.emailAddress)
                    .autocapitalization(.none)
                    .styledInput()
            }

            continueButton("Start My Journey", disabled: details.email.isEmpty) { withAnimation { step = 2 } }
        }
    }

    // MARK: - Step 2: Basics
    private var step2View: some View {
        VStack(alignment: .leading, spacing: 20) {
            stepHeader(title: "About You", subtitle: "Help your future partner find you.")

            VStack(alignment: .leading, spacing: 8) {
                fieldLabel("Full Name")
                TextField("Your name", text: $details.name).styledInput()
            }
            HStack(spacing: 12) {
                VStack(alignment: .leading, spacing: 8) {
                    fieldLabel("Age")
                    TextField("25", text: $details.age).keyboardType(.numberPad).styledInput()
                }
                VStack(alignment: .leading, spacing: 8) {
                    fieldLabel("Gender")
                    Picker("", selection: $details.gender) {
                        Text("Select").tag("")
                        Text("Man").tag("Man")
                        Text("Woman").tag("Woman")
                    }
                    .pickerStyle(.menu)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.gray.opacity(0.07))
                    .clipShape(RoundedRectangle(cornerRadius: 14))
                }
            }
            VStack(alignment: .leading, spacing: 8) {
                fieldLabel("Denomination")
                TextField("e.g. Baptist, Catholic, Non-denominational", text: $details.faith).styledInput()
            }
            VStack(alignment: .leading, spacing: 8) {
                fieldLabel("City")
                TextField("e.g. Austin, TX", text: $details.city).styledInput()
            }

            continueButton("Save Basics", disabled: details.name.isEmpty || details.age.isEmpty) { withAnimation { step = 3 } }
        }
    }

    // MARK: - Step 3: Preferences
    private var step3View: some View {
        VStack(alignment: .leading, spacing: 24) {
            stepHeader(title: "Your Intentions", subtitle: "Be clear so you attract the right match.")

            VStack(alignment: .leading, spacing: 12) {
                fieldLabel("I'm Looking For")
                let options = ["Marriage ASAP", "Marriage in 1-2 years", "Dating to Marry", "Courtship"]
                LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 10) {
                    ForEach(options, id: \.self) { opt in
                        chipButton(opt, isSelected: details.lookingFor.contains(opt)) {
                            if details.lookingFor.contains(opt) { details.lookingFor.remove(opt) }
                            else { details.lookingFor.insert(opt) }
                        }
                    }
                }
            }

            VStack(alignment: .leading, spacing: 12) {
                fieldLabel("Life Interests")
                let interests = ["Faith", "Family", "Yoga", "Travel", "Music", "Cooking", "Fitness", "Art", "Reading", "Outdoors"]
                LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 10) {
                    ForEach(interests, id: \.self) { opt in
                        chipButton(opt, isSelected: details.interests.contains(opt), style: .gold) {
                            if details.interests.contains(opt) { details.interests.remove(opt) }
                            else { details.interests.insert(opt) }
                        }
                    }
                }
            }

            continueButton("Set My Values", disabled: details.lookingFor.isEmpty) { withAnimation { step = 4 } }
        }
    }

    // MARK: - Step 4: Values Sliders
    private var step4View: some View {
        VStack(alignment: .leading, spacing: 24) {
            stepHeader(title: "Your Covenant Values", subtitle: "These power the matching algorithm.")

            VStack(spacing: 20) {
                covenantSlider("Faith Commitment", value: $details.faithLevel, min: "Exploring", max: "Very Serious")
                covenantSlider("Traditional Values", value: $details.valuesLevel, min: "Moderate", max: "Traditional")
                covenantSlider("Marriage Readiness", value: $details.intentionLevel, min: "Dating First", max: "Ready Now")
                covenantSlider("Purity Commitment", value: $details.lifestyleLevel, min: "Determined", max: "Absolute")
            }

            continueButton("Continue to Photos") { withAnimation { step = 5 } }
        }
    }

    // MARK: - Step 5: Photos (simplified)
    private var step5View: some View {
        VStack(alignment: .leading, spacing: 24) {
            stepHeader(title: "Profile Photos", subtitle: "Show your best self to potential matches.")

            Text("In the full Xcode project, add photo picker here using PhotosUI framework (PHPickerViewController).")
                .font(.custom("Inter-Regular", size: 13))
                .foregroundColor(.gray)
                .padding()
                .background(Color.gray.opacity(0.06))
                .clipShape(RoundedRectangle(cornerRadius: 12))

            continueButton("Complete Registration", isLoading: isLoading) {
                Task { await completeRegistration() }
            }
        }
    }

    // MARK: - Helpers
    private func stepHeader(title: String, subtitle: String) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(title).font(.playfair(30, weight: .bold)).foregroundColor(.virginsPurple)
            Text(subtitle).font(.custom("Inter-Regular", size: 14)).foregroundColor(.gray)
        }
        .padding(.top, 8)
    }

    private func fieldLabel(_ text: String) -> some View {
        Text(text)
            .font(.custom("Inter-Bold", size: 11))
            .foregroundColor(.gray)
            .textCase(.uppercase)
            .tracking(1.5)
    }

    private func continueButton(_ title: String, disabled: Bool = false, isLoading: Bool = false, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            Group {
                if isLoading { ProgressView().tint(.white) }
                else { Text(title).font(.custom("Inter-Black", size: 16)).tracking(0.5) }
            }
            .foregroundColor(.white)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 18)
            .background(Color.virginsPurple)
            .clipShape(RoundedRectangle(cornerRadius: 18))
            .shadow(color: .virginsPurple.opacity(0.35), radius: 14, y: 5)
        }
        .disabled(disabled || isLoading)
        .opacity(disabled ? 0.55 : 1)
        .padding(.top, 8)
    }

    private func chipButton(_ title: String, isSelected: Bool, style: ChipStyle = .purple, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            Text(title)
                .font(.custom("Inter-Bold", size: 13))
                .foregroundColor(isSelected ? (style == .gold ? Color.virginsDark : .white) : .gray)
                .padding(.horizontal, 14)
                .padding(.vertical, 10)
                .frame(maxWidth: .infinity)
                .background(isSelected ? (style == .gold ? Color.virginsGold : Color.virginsPurple) : Color.gray.opacity(0.08))
                .clipShape(RoundedRectangle(cornerRadius: 12))
        }
    }

    enum ChipStyle { case purple, gold }

    private func covenantSlider(_ title: String, value: Binding<Double>, min: String, max: String) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text(title).font(.custom("Inter-Bold", size: 13)).foregroundColor(.virginsPurple)
                Spacer()
                Text("\(Int(value.wrappedValue))/10").font(.custom("Inter-Black", size: 13)).foregroundColor(.virginsGold)
            }
            Slider(value: value, in: 1...10, step: 1)
                .tint(.virginsPurple)
            HStack {
                Text(min).font(.custom("Inter-Regular", size: 10)).foregroundColor(.gray)
                Spacer()
                Text(max).font(.custom("Inter-Regular", size: 10)).foregroundColor(.gray)
            }
        }
    }

    private func completeRegistration() async {
        isLoading = true
        // In production: call API to create profile, then log in
        try? await Task.sleep(nanoseconds: 1_000_000_000)
        isLoading = false
        // authVM.currentUser = ...
    }
}

extension View {
    func styledInput() -> some View {
        self
            .font(.custom("Inter-Regular", size: 15))
            .padding()
            .background(Color.gray.opacity(0.07))
            .clipShape(RoundedRectangle(cornerRadius: 14))
    }
}

struct OnboardingDetails {
    var email = ""
    var name = ""
    var age = ""
    var gender = ""
    var faith = ""
    var city = ""
    var lookingFor: Set<String> = []
    var interests: Set<String> = []
    var faithLevel: Double = 7
    var valuesLevel: Double = 7
    var intentionLevel: Double = 7
    var lifestyleLevel: Double = 8
}
