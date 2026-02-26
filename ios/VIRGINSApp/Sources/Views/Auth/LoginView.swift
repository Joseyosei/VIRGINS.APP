import SwiftUI

struct LoginView: View {
    @EnvironmentObject var authVM: AuthViewModel
    var onBack: () -> Void

    @State private var email = ""
    @State private var password = ""
    @State private var showPassword = false
    @FocusState private var focusedField: Field?

    enum Field { case email, password }

    var body: some View {
        ZStack {
            Color.virginsCream.ignoresSafeArea()

            ScrollView {
                VStack(spacing: 0) {
                    // Header
                    VStack(spacing: 12) {
                        ZStack {
                            RoundedRectangle(cornerRadius: 20)
                                .fill(Color.virginsPurple)
                                .frame(width: 72, height: 72)
                                .shadow(color: .virginsPurple.opacity(0.4), radius: 20, y: 8)
                            Text("V")
                                .font(.playfair(36, weight: .black))
                                .foregroundColor(.virginsGold)
                        }
                        .padding(.top, 60)

                        Text("Welcome Back")
                            .font(.playfair(30, weight: .bold))
                            .foregroundColor(.virginsPurple)

                        Text("Sign in to continue your courtship journey.")
                            .font(.custom("Inter-Regular", size: 15))
                            .foregroundColor(.gray)
                    }
                    .padding(.bottom, 40)

                    // Form card
                    VStack(spacing: 20) {
                        VStack(alignment: .leading, spacing: 8) {
                            Label("Email Address", systemImage: "envelope")
                                .font(.custom("Inter-Bold", size: 11))
                                .foregroundColor(.gray)
                                .textCase(.uppercase)
                                .tracking(1.5)

                            TextField("you@example.com", text: $email)
                                .keyboardType(.emailAddress)
                                .autocapitalization(.none)
                                .focused($focusedField, equals: .email)
                                .padding()
                                .background(Color.gray.opacity(0.07))
                                .clipShape(RoundedRectangle(cornerRadius: 16))
                                .overlay(
                                    RoundedRectangle(cornerRadius: 16)
                                        .stroke(focusedField == .email ? Color.virginsPurple : Color.clear, lineWidth: 2)
                                )
                        }

                        VStack(alignment: .leading, spacing: 8) {
                            HStack {
                                Label("Password", systemImage: "lock")
                                    .font(.custom("Inter-Bold", size: 11))
                                    .foregroundColor(.gray)
                                    .textCase(.uppercase)
                                    .tracking(1.5)
                                Spacer()
                                Button("Forgot?") {}
                                    .font(.custom("Inter-Bold", size: 12))
                                    .foregroundColor(.virginsGold)
                            }

                            HStack {
                                Group {
                                    if showPassword {
                                        TextField("••••••••", text: $password)
                                    } else {
                                        SecureField("••••••••", text: $password)
                                    }
                                }
                                .focused($focusedField, equals: .password)

                                Button(action: { showPassword.toggle() }) {
                                    Image(systemName: showPassword ? "eye.slash" : "eye")
                                        .foregroundColor(.gray)
                                }
                            }
                            .padding()
                            .background(Color.gray.opacity(0.07))
                            .clipShape(RoundedRectangle(cornerRadius: 16))
                            .overlay(
                                RoundedRectangle(cornerRadius: 16)
                                    .stroke(focusedField == .password ? Color.virginsPurple : Color.clear, lineWidth: 2)
                            )
                        }

                        if let error = authVM.errorMessage {
                            Text(error)
                                .font(.custom("Inter-Regular", size: 13))
                                .foregroundColor(.red)
                                .multilineTextAlignment(.center)
                        }

                        Button(action: { Task { await authVM.login(email: email, password: password) } }) {
                            HStack {
                                if authVM.isLoading {
                                    ProgressView().tint(.white)
                                } else {
                                    Text("Sign In")
                                        .font(.custom("Inter-Black", size: 16))
                                        .tracking(0.5)
                                }
                            }
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 18)
                            .background(Color.virginsPurple)
                            .clipShape(RoundedRectangle(cornerRadius: 18))
                            .shadow(color: .virginsPurple.opacity(0.35), radius: 16, y: 6)
                        }
                        .disabled(email.isEmpty || password.isEmpty || authVM.isLoading)
                        .opacity((email.isEmpty || password.isEmpty) ? 0.6 : 1)
                    }
                    .padding(28)
                    .background(Color.white)
                    .clipShape(RoundedRectangle(cornerRadius: 36))
                    .shadow(color: .black.opacity(0.06), radius: 30, y: 10)
                    .padding(.horizontal, 20)

                    // Back
                    Button(action: onBack) {
                        Text("← Back")
                            .font(.custom("Inter-Medium", size: 14))
                            .foregroundColor(.gray)
                    }
                    .padding(.top, 24)
                    .padding(.bottom, 40)
                }
            }
        }
        .navigationBarHidden(true)
    }
}
