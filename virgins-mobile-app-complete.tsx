/**
 * VIRGINS - Mobile App Reference Code
 * 
 * This file contains a complete structure for the Virgins React Native mobile application.
 * Note: This file is designed to be used in a React Native environment (e.g., Expo).
 * It will not render in a standard web-only React environment without appropriate setup.
 * 
 * INSTRUCTIONS:
 * 1. Create a new Expo project: npx create-expo-app virgins-mobile
 * 2. Install dependencies: npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs react-native-safe-area-context react-native-screens lucide-react-native
 * 3. Copy this content into your App.tsx
 */

import React, { useState, useEffect, createContext, useContext } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Image, 
  TextInput, 
  ScrollView, 
  SafeAreaView, 
  StatusBar, 
  FlatList,
  Dimensions,
  Alert,
  Switch,
  Platform,
  KeyboardAvoidingView,
  Modal
} from 'react-native';
// Note: In a real project, you would import these from '@react-navigation/...'
// We are mocking navigation state for this single-file demonstration
import { Heart, MessageCircle, User, Shield, Check, X, ArrowRight, Settings, Camera, Mic, Gem, ChevronLeft, Search, Filter, Lock, Mail, Star, Crown, Zap, Eye, CheckCircle } from 'lucide-react-native';

// --- THEME ---
const COLORS = {
  navyDark: '#1A1A2E',
  navyMid: '#16213E',
  goldLight: '#F5E6D3',
  goldMid: '#D4A574',
  goldDark: '#B8860B',
  cream: '#E8D5B7',
  white: '#FFFFFF',
  gray: '#888888',
  lightGray: '#F5F5F5',
  red: '#FF6B6B',
  green: '#44FF44'
};

const FONTS = {
  serif: Platform.OS === 'ios' ? 'Georgia' : 'serif', 
  sans: 'System'
};

// --- MOCK DATA ---
const MOCK_PROFILES = [
  { id: '1', name: 'Sarah', age: 24, location: 'Austin, TX', bio: 'Faith-driven and waiting for the right one. Love classical music and hiking.', image: 'https://picsum.photos/400/600?random=1', verified: true, values: ['Faith', 'Family', 'Music'] },
  { id: '2', name: 'Hannah', age: 22, location: 'Dallas, TX', bio: 'Teacher. Values tradition, family, and kindness.', image: 'https://picsum.photos/400/600?random=2', verified: true, values: ['Teaching', 'Kindness', 'Tradition'] },
  { id: '3', name: 'Elizabeth', age: 26, location: 'Houston, TX', bio: 'Nurse. Looking for a leader and future husband.', image: 'https://picsum.photos/400/600?random=3', verified: true, values: ['Nursing', 'Leadership', 'Marriage'] },
];

const MOCK_MESSAGES = [
  { id: '1', sender: 'Sarah', lastMessage: 'That sounds like a lovely idea!', time: '10:30 AM', avatar: 'https://picsum.photos/100/100?random=1', unread: true },
  { id: '2', sender: 'James', lastMessage: 'Are you going to church this Sunday?', time: 'Yesterday', avatar: 'https://picsum.photos/100/100?random=4', unread: false },
];

const MOCK_LIKES = [
  { id: '4', name: 'Jessica', age: 23, image: 'https://picsum.photos/200/300?random=4' },
  { id: '5', name: 'Rachel', age: 25, image: 'https://picsum.photos/200/300?random=5' },
  { id: '6', name: 'Amanda', age: 24, image: 'https://picsum.photos/200/300?random=6' },
  { id: '7', name: 'Grace', age: 22, image: 'https://picsum.photos/200/300?random=7' },
];

// --- TYPES ---
type SubscriptionTier = 'free' | 'plus' | 'ultimate';

// --- CONTEXT ---
const AuthContext = createContext<any>(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<SubscriptionTier>('free');
  const [isLoading, setIsLoading] = useState(false);

  const login = (email: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setUser({ email, name: 'User', isVerified: false });
      setIsLoading(false);
    }, 1000);
  };

  const register = (data: any) => {
    setIsLoading(true);
    setTimeout(() => {
      setUser({ ...data, isVerified: false, isEmailVerified: false });
      setIsLoading(false);
    }, 1500);
  };

  const logout = () => {
    setUser(null);
    setSubscription('free');
  };

  const verifyUser = () => {
    if (user) setUser({ ...user, isVerified: true });
  };

  const purchaseSubscription = (tier: SubscriptionTier) => {
    setIsLoading(true);
    // Simulate API call to RevenueCat/App Store
    setTimeout(() => {
      setSubscription(tier);
      setIsLoading(false);
      Alert.alert("Success", `Welcome to Virgins ${tier === 'plus' ? 'Plus' : 'Ultimate'}!`);
    }, 2000);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, verifyUser, isLoading, subscription, purchaseSubscription }}>
      {children}
    </AuthContext.Provider>
  );
};

// --- COMPONENTS ---
const GoldButton = ({ title, onPress, style, disabled }: any) => (
  <TouchableOpacity 
    style={[styles.primaryButton, style, disabled && { opacity: 0.5 }]} 
    onPress={onPress}
    disabled={disabled}
  >
    <Text style={styles.primaryButtonText}>{title}</Text>
  </TouchableOpacity>
);

const OutlineButton = ({ title, onPress, style }: any) => (
  <TouchableOpacity style={[styles.secondaryButton, style]} onPress={onPress}>
    <Text style={styles.secondaryButtonText}>{title}</Text>
  </TouchableOpacity>
);

const InputField = ({ placeholder, value, onChangeText, secureTextEntry }: any) => (
  <TextInput 
    style={styles.input} 
    placeholder={placeholder} 
    placeholderTextColor="#888"
    value={value}
    onChangeText={onChangeText}
    secureTextEntry={secureTextEntry}
  />
);

// --- SCREENS ---

// 1. PAYWALL SCREEN (NEW)
const PaywallScreen = ({ navigation }: any) => {
  const { purchaseSubscription, subscription } = useContext(AuthContext);
  const [selectedPlan, setSelectedPlan] = useState<'plus' | 'ultimate'>('ultimate');

  const handlePurchase = () => {
    purchaseSubscription(selectedPlan);
    navigation.goBack();
  };

  const FeatureRow = ({ text }: { text: string }) => (
    <View style={styles.featureRow}>
      <Check color={COLORS.goldMid} size={18} />
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );

  return (
    <View style={styles.paywallContainer}>
      <Image 
        source={{ uri: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800' }} 
        style={styles.paywallBackground} 
        blurRadius={10}
      />
      <View style={styles.paywallOverlay} />

      <SafeAreaView style={{ flex: 1 }}>
        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
          <X color={COLORS.white} size={28} />
        </TouchableOpacity>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
          <View style={{ alignItems: 'center', marginBottom: 30 }}>
            <View style={styles.crownContainer}>
              <Crown color={COLORS.navyDark} size={32} fill={COLORS.navyDark} />
            </View>
            <Text style={styles.paywallTitle}>Unlock the Full Experience</Text>
            <Text style={styles.paywallSubtitle}>Invest in your future marriage with premium tools.</Text>
          </View>

          {/* Plus Card */}
          <TouchableOpacity 
            style={[styles.planCard, selectedPlan === 'plus' && styles.planCardSelected]}
            onPress={() => setSelectedPlan('plus')}
          >
            <View style={styles.planHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Star color={COLORS.goldMid} size={24} fill={COLORS.goldMid} />
                <Text style={styles.planName}>Virgins Plus</Text>
              </View>
              <Text style={styles.planPrice}>$9.99/mo</Text>
            </View>
            <View style={styles.planFeatures}>
               <FeatureRow text="Unlimited Likes" />
               <FeatureRow text="See Who Liked You" />
               <FeatureRow text="Read Receipts" />
            </View>
          </TouchableOpacity>

          {/* Ultimate Card */}
          <TouchableOpacity 
            style={[styles.planCard, styles.ultimateCard, selectedPlan === 'ultimate' && styles.planCardSelected]}
            onPress={() => setSelectedPlan('ultimate')}
          >
            <View style={styles.popularBadge}>
              <Text style={styles.popularText}>MOST POPULAR</Text>
            </View>
            <View style={styles.planHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Crown color={COLORS.navyDark} size={24} fill={COLORS.navyDark} />
                <Text style={[styles.planName, { color: COLORS.navyDark }]}>Virgins Ultimate</Text>
              </View>
              <Text style={[styles.planPrice, { color: COLORS.navyDark }]}>$19.99/mo</Text>
            </View>
            <View style={styles.planFeatures}>
               <View style={styles.featureRow}>
                 <Check color={COLORS.navyDark} size={18} />
                 <Text style={[styles.featureText, { color: COLORS.navyDark }]}>Everything in Plus</Text>
               </View>
               <View style={styles.featureRow}>
                 <Check color={COLORS.navyDark} size={18} />
                 <Text style={[styles.featureText, { color: COLORS.navyDark }]}>Incognito Mode</Text>
               </View>
               <View style={styles.featureRow}>
                 <Check color={COLORS.navyDark} size={18} />
                 <Text style={[styles.featureText, { color: COLORS.navyDark }]}>Priority Likes</Text>
               </View>
               <View style={styles.featureRow}>
                 <Check color={COLORS.navyDark} size={18} />
                 <Text style={[styles.featureText, { color: COLORS.navyDark }]}>Video Chat Access</Text>
               </View>
            </View>
          </TouchableOpacity>

          <Text style={styles.disclaimerText}>
            Recurring billing, cancel anytime. Subscription automatically renews unless auto-renew is turned off at least 24-hours before the end of the current period.
          </Text>
        </ScrollView>

        <View style={styles.paywallFooter}>
          <GoldButton 
            title={selectedPlan === 'ultimate' ? 'Get Ultimate' : 'Get Plus'} 
            onPress={handlePurchase}
          />
          <TouchableOpacity style={{ marginTop: 15 }}>
            <Text style={styles.restoreText}>Restore Purchases</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

// 2. WELCOME SCREEN
const WelcomeScreen = ({ navigation }: any) => (
  <View style={styles.container}>
    <View style={styles.heroOverlay} />
    <Image source={{ uri: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800' }} style={styles.backgroundImage} />
    
    <View style={styles.welcomeContent}>
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoInitial}>V</Text>
        </View>
        <Text style={styles.logoText}>VIRGINS</Text>
        <Text style={styles.tagline}>Love Worth Waiting For</Text>
        <View style={styles.statsContainer}>
          <Text style={styles.statText}>50,000+ Members</Text>
          <Text style={styles.statDot}>•</Text>
          <Text style={styles.statText}>100% Verified</Text>
        </View>
      </View>
      
      <View style={styles.buttonContainer}>
        <GoldButton title="Create Account" onPress={() => navigation.navigate('SignUp')} />
        <OutlineButton title="Sign In" onPress={() => navigation.navigate('Login')} />
      </View>
    </View>
  </View>
);

// 3. LOGIN SCREEN
const LoginScreen = ({ navigation }: any) => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.authContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft color={COLORS.goldMid} size={32} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Welcome Back</Text>
        <Text style={styles.headerSubtitle}>Sign in to continue your journey</Text>
        
        <InputField placeholder="Email Address" value={email} onChangeText={setEmail} />
        <InputField placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
        
        <TouchableOpacity style={{alignSelf: 'flex-end', marginBottom: 20}}>
          <Text style={{color: COLORS.goldMid}}>Forgot Password?</Text>
        </TouchableOpacity>
        
        <GoldButton title="Sign In" onPress={() => login(email)} />
        
        <TouchableOpacity style={{marginTop: 20, alignSelf: 'center'}} onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.linkText}>Don't have an account? <Text style={{fontWeight: 'bold', color: COLORS.goldMid}}>Create one</Text></Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// 4. SIGN UP SCREEN
const SignUpScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleNext = () => {
    // Navigate to Email Verification instead of Profile Setup
    navigation.navigate('EmailVerification', { email });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.authContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft color={COLORS.goldMid} size={32} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Create Account</Text>
        <Text style={styles.headerSubtitle}>Begin your journey to lasting love</Text>
        
        <InputField placeholder="Full Name" value={name} onChangeText={setName} />
        <InputField placeholder="Email Address" value={email} onChangeText={setEmail} />
        <InputField placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
        <InputField placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
        
        <GoldButton title="Continue" onPress={handleNext} />
        
        <Text style={styles.legalText}>
          By creating an account, you agree to our Terms of Service and Privacy Policy.
        </Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// 5. EMAIL VERIFICATION SCREEN
const EmailVerificationScreen = ({ navigation, route }: any) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const email = route?.params?.email || 'your email';

  const handleVerify = () => {
    setIsVerifying(true);
    // Simulate verification delay
    setTimeout(() => {
      setIsVerifying(false);
      Alert.alert("Success", "Email verified successfully!", [
        { text: "Continue", onPress: () => navigation.navigate('ProfileSetup1') }
      ]);
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.authContainer, { alignItems: 'center' }]}>
        <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.navyMid, alignItems: 'center', justifyContent: 'center', marginBottom: 20, borderWidth: 1, borderColor: COLORS.goldMid }}>
          <Mail color={COLORS.goldMid} size={40} />
        </View>

        <Text style={[styles.headerTitle, { textAlign: 'center' }]}>Verify your Email</Text>
        <Text style={[styles.headerSubtitle, { textAlign: 'center', marginBottom: 40 }]}>
          We've sent a verification link to {email}. Please click the link to verify your account.
        </Text>

        <View style={{ width: '100%', backgroundColor: '#252540', padding: 20, borderRadius: 12, marginBottom: 30, borderStyle: 'dashed', borderWidth: 1, borderColor: '#444' }}>
          <Text style={{ color: '#888', fontSize: 12, marginBottom: 10, textTransform: 'uppercase', fontWeight: 'bold' }}>Simulate Email Action</Text>
          <GoldButton 
            title={isVerifying ? "Verifying..." : "Verify Email Address"} 
            onPress={handleVerify}
            disabled={isVerifying}
          />
        </View>

        <TouchableOpacity>
          <Text style={{ color: COLORS.goldMid, fontWeight: 'bold' }}>Resend Email</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={{ marginTop: 20 }} onPress={() => navigation.goBack()}>
           <Text style={{ color: COLORS.gray }}>Use a different email</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// 6. PROFILE SETUP STEPS
// Step 1: Basic Identity
const ProfileSetup1 = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.contentContainer}>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: '25%' }]} />
        </View>
        <Text style={styles.stepTitle}>Who are you?</Text>
        
        <Text style={styles.label}>I am a...</Text>
        <View style={styles.setupRow}>
          <TouchableOpacity style={styles.optionButtonSelected}><Text style={styles.optionTextSelected}>Man</Text></TouchableOpacity>
          <TouchableOpacity style={styles.optionButton}><Text style={styles.optionText}>Woman</Text></TouchableOpacity>
        </View>

        <Text style={styles.label}>Looking for a...</Text>
        <View style={styles.setupRow}>
          <TouchableOpacity style={styles.optionButton}><Text style={styles.optionText}>Man</Text></TouchableOpacity>
          <TouchableOpacity style={styles.optionButtonSelected}><Text style={styles.optionTextSelected}>Woman</Text></TouchableOpacity>
        </View>

        <Text style={styles.label}>My Age</Text>
        <InputField placeholder="Age" />

        <View style={{flex: 1}} />
        <GoldButton title="Next Step" onPress={() => navigation.navigate('ProfileSetup2')} />
      </View>
    </SafeAreaView>
  );
};

// Step 2: About You
const ProfileSetup2 = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.contentContainer}>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: '50%' }]} />
        </View>
        <Text style={styles.stepTitle}>About You</Text>
        
        <Text style={styles.label}>Bio</Text>
        <TextInput 
          style={[styles.input, {height: 100, textAlignVertical: 'top'}]} 
          placeholder="Tell us about yourself..." 
          placeholderTextColor="#888"
          multiline 
        />
        
        <Text style={styles.label}>Interests</Text>
        <View style={styles.chipsContainer}>
          {['Music', 'Travel', 'Reading', 'Faith', 'Cooking'].map(i => (
            <View key={i} style={styles.chip}><Text style={styles.chipText}>{i}</Text></View>
          ))}
          <View style={[styles.chip, styles.chipSelected]}><Text style={styles.chipTextSelected}>Hiking</Text></View>
        </View>

        <View style={{flex: 1}} />
        <GoldButton title="Next Step" onPress={() => navigation.navigate('ProfileSetup3')} />
      </View>
    </SafeAreaView>
  );
};

// Step 3: Core Values (Required)
const ProfileSetup3 = ({ navigation }: any) => {
  const values = ['Faith', 'Family', 'Commitment', 'Purity', 'Marriage', 'Children', 'Tradition', 'Respect', 'Honesty', 'Loyalty'];
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.contentContainer}>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: '75%' }]} />
        </View>
        <Text style={styles.stepTitle}>Core Values</Text>
        <Text style={styles.stepSubtitle}>Select at least 3 values that define you.</Text>
        
        <View style={styles.chipsContainer}>
          {values.map((v, i) => (
            <TouchableOpacity key={v} style={i < 3 ? [styles.chip, styles.chipGold] : styles.chip}>
              <Text style={i < 3 ? styles.chipTextSelected : styles.chipText}>{v}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{flex: 1}} />
        <GoldButton title="Next Step" onPress={() => navigation.navigate('ProfileSetup4')} />
      </View>
    </SafeAreaView>
  );
};

// Step 4: Photos
const ProfileSetup4 = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.contentContainer}>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: '100%' }]} />
        </View>
        <Text style={styles.stepTitle}>Your Photos</Text>
        <Text style={styles.stepSubtitle}>Upload at least 2 photos to continue.</Text>
        
        <View style={styles.photoGrid}>
          {[1,2,3,4,5,6].map(i => (
             <TouchableOpacity key={i} style={styles.photoSlot}>
               <Camera color={COLORS.goldMid} size={24} />
             </TouchableOpacity>
          ))}
        </View>

        <View style={{flex: 1}} />
        <GoldButton title="Complete Profile" onPress={() => navigation.navigate('Verification')} />
      </View>
    </SafeAreaView>
  );
};

// 7. VERIFICATION
const VerificationScreen = ({ navigation }: any) => {
  const { login } = useContext(AuthContext); // Actually trigger login state to enter app
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.contentContainer, {justifyContent: 'center', alignItems: 'center'}]}>
        <Shield size={80} color={COLORS.goldMid} style={{marginBottom: 20}} />
        <Text style={styles.headerTitle}>Verification</Text>
        <Text style={[styles.headerSubtitle, {textAlign: 'center'}]}>
          To ensure safety and authenticity, every member must be verified.
        </Text>

        <View style={styles.verificationStep}>
          <View style={styles.checkCircle}><Check color={COLORS.navyDark} size={16} /></View>
          <Text style={styles.stepText}>Face Verification</Text>
        </View>
        <View style={styles.verificationStep}>
          <View style={styles.checkCircle}><Check color={COLORS.navyDark} size={16} /></View>
          <Text style={styles.stepText}>ID Upload</Text>
        </View>
        <View style={styles.verificationStep}>
          <View style={styles.circle}><Text style={{color: '#fff'}}>3</Text></View>
          <Text style={styles.stepText}>Voice Verification</Text>
        </View>

        <GoldButton title="Start Verification" onPress={() => login('demo@user.com')} style={{marginTop: 40, width: '100%'}} />
      </View>
    </SafeAreaView>
  );
};

// 8. MAIN APP TABS
const DiscoverScreen = ({ navigation }: any) => {
  const { subscription } = useContext(AuthContext);

  const handlePremiumAction = () => {
    if (subscription === 'free') {
      navigation.navigate('Paywall');
    } else {
      Alert.alert('Action', 'Feature available!');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Image source={{uri: 'https://picsum.photos/50/50'}} style={styles.smallLogo} />
        <Text style={styles.headerTitleSmall}>Discover</Text>
        <TouchableOpacity style={styles.filterButton} onPress={handlePremiumAction}>
          <Filter color={COLORS.goldMid} size={24} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.cardContainer}>
        {/* Simplified Swipe Card */}
        <Image source={{ uri: MOCK_PROFILES[0].image }} style={styles.cardImage} />
        <View style={styles.cardGradient} />
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardName}>{MOCK_PROFILES[0].name}, {MOCK_PROFILES[0].age}</Text>
            {MOCK_PROFILES[0].verified && <Gem color={COLORS.goldMid} size={20} style={{marginLeft: 8}} />}
          </View>
          <Text style={styles.cardLocation}>{MOCK_PROFILES[0].location}</Text>
          <View style={styles.cardTags}>
             {MOCK_PROFILES[0].values.map(v => (
               <View key={v} style={styles.cardTag}><Text style={styles.cardTagText}>{v}</Text></View>
             ))}
          </View>
          <Text style={styles.cardBio}>{MOCK_PROFILES[0].bio}</Text>
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity style={[styles.actionButton, styles.passButton]}>
            <X color={COLORS.red} size={32} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.superLikeButton]} onPress={handlePremiumAction}>
             <Gem color="#3B82F6" size={24} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.likeButton]}>
            <Heart color={COLORS.green} size={32} fill={COLORS.green} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const LikesScreen = ({ navigation }: any) => {
  const { subscription } = useContext(AuthContext);
  const isFree = subscription === 'free';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitleSmall}>Likes You</Text>
        <View style={styles.goldBadge}>
          <Text style={styles.goldBadgeText}>{isFree ? 'FREE' : 'PREMIUM'}</Text>
        </View>
      </View>
      {isFree && (
        <TouchableOpacity style={styles.freeBanner} onPress={() => navigation.navigate('Paywall')}>
           <Text style={styles.freeBannerText}>Upgrade to see who likes you!</Text>
        </TouchableOpacity>
      )}
      <FlatList 
        data={MOCK_LIKES}
        numColumns={2}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.gridItem} 
            onPress={() => isFree ? navigation.navigate('Paywall') : Alert.alert(item.name)}
          >
            <Image 
              source={{ uri: item.image }} 
              style={styles.gridImage} 
              blurRadius={isFree ? 15 : 0} // Feature Gate
            />
            {isFree ? (
              <View style={[styles.gridOverlay, { justifyContent: 'center', alignItems: 'center', height: '100%' }]}>
                <Lock color={COLORS.goldMid} size={24} />
              </View>
            ) : (
              <View style={styles.gridOverlay}>
                <Text style={styles.gridName}>{item.name}, {item.age}</Text>
                <View style={styles.verifiedBadgeSmall}><Gem size={10} color={COLORS.navyDark}/></View>
              </View>
            )}
          </TouchableOpacity>
        )}
        contentContainerStyle={{ padding: 8 }}
      />
    </SafeAreaView>
  );
};

const MessagesScreen = ({ onChatOpen, navigation }: any) => {
  const { subscription } = useContext(AuthContext);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitleSmall}>Messages</Text>
        <Search color={COLORS.goldMid} size={24} />
      </View>
      <View style={styles.newMatchesContainer}>
        <Text style={styles.sectionHeader}>New Matches</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{paddingLeft: 15}}>
            {[1,2,3,4].map(i => (
              <View key={i} style={styles.newMatchItem}>
                  <Image source={{uri: `https://picsum.photos/100/100?random=${i+10}`}} style={styles.newMatchAvatar} />
                  <View style={styles.newBadge}><Text style={styles.newBadgeText}>NEW</Text></View>
              </View>
            ))}
        </ScrollView>
      </View>
      <FlatList 
        data={MOCK_MESSAGES}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.messageItem} onPress={onChatOpen}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View style={styles.messageContent}>
              <View style={styles.messageRow}>
                <Text style={styles.senderName}>{item.sender}</Text>
                <Text style={styles.messageTime}>{item.time}</Text>
              </View>
              <Text style={[styles.lastMessage, item.unread && styles.unreadMessage]}>
                {item.lastMessage}
              </Text>
            </View>
            {item.unread && (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                 {subscription === 'plus' || subscription === 'ultimate' ? (
                   <Eye size={12} color={COLORS.goldMid} style={{marginRight: 4}} /> // Read Receipt Sim
                 ) : null}
                 <View style={styles.unreadDot} />
              </View>
            )}
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

const ChatScreen = ({ onBack, navigation }: any) => {
  const { subscription } = useContext(AuthContext);

  const handleVideoCall = () => {
    if (subscription !== 'ultimate') {
      navigation.navigate('Paywall');
    } else {
      Alert.alert("Video Call", "Starting secure video call...");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.chatHeader}>
          <TouchableOpacity onPress={onBack}><ChevronLeft color={COLORS.goldMid} size={28} /></TouchableOpacity>
          <Image source={{uri: MOCK_MESSAGES[0].avatar}} style={styles.chatAvatar} />
          <View style={{flex: 1, marginLeft: 10}}>
            <Text style={styles.chatName}>{MOCK_MESSAGES[0].sender}</Text>
            <Text style={styles.chatStatus}>Online</Text>
          </View>
          <TouchableOpacity onPress={handleVideoCall}>
             <Camera color={subscription === 'ultimate' ? COLORS.goldMid : COLORS.gray} size={24} />
          </TouchableOpacity>
      </View>
      <ScrollView style={styles.chatBody}>
          <View style={styles.msgLeft}>
            <Text style={styles.msgTextLeft}>Hi Sarah! I noticed we both love hiking.</Text>
            <Text style={styles.msgTimeLeft}>10:28 AM</Text>
          </View>
          <View style={styles.msgRight}>
            <Text style={styles.msgTextRight}>Yes! It's my favorite way to connect with nature.</Text>
            <Text style={styles.msgTimeRight}>10:29 AM</Text>
          </View>
          <View style={styles.msgLeft}>
            <Text style={styles.msgTextLeft}>That sounds like a lovely idea!</Text>
            <Text style={styles.msgTimeLeft}>10:30 AM</Text>
          </View>
      </ScrollView>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={100}>
          <View style={styles.chatInputContainer}>
            <TouchableOpacity><ArrowRight color={COLORS.gray} size={24} style={{transform: [{rotate: '45deg'}]}} /></TouchableOpacity>
            <TextInput style={styles.chatInput} placeholder="Type a message..." placeholderTextColor={COLORS.gray} />
            <TouchableOpacity style={styles.sendButton}><ArrowRight color={COLORS.navyDark} size={20} /></TouchableOpacity>
          </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const ProfileScreen = ({ logout, navigation }: any) => {
  const { subscription } = useContext(AuthContext);

  const getBadge = () => {
    if (subscription === 'ultimate') return <Crown size={18} color={COLORS.goldDark} fill={COLORS.goldDark} />;
    if (subscription === 'plus') return <Star size={18} color={COLORS.goldMid} fill={COLORS.goldMid} />;
    return <Gem size={18} color={COLORS.gray} />;
  };

  const getPlanName = () => {
    if (subscription === 'ultimate') return 'Ultimate Member';
    if (subscription === 'plus') return 'Plus Member';
    return 'Free Member';
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <View style={styles.profileHeader}>
          <Image source={{ uri: 'https://picsum.photos/200/200' }} style={styles.profileAvatar} />
          <View style={styles.editIcon}><Settings size={16} color={COLORS.white} /></View>
          
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
             <Text style={styles.profileName}>James, 27</Text>
             {getBadge()}
          </View>
          <Text style={styles.profileStatus}>{getPlanName()} • Austin, TX</Text>
          
          <View style={styles.statsRow}>
             <View style={styles.statBox}><Text style={styles.statNum}>12</Text><Text style={styles.statLabel}>Matches</Text></View>
             <View style={styles.statBox}><Text style={styles.statNum}>48</Text><Text style={styles.statLabel}>Likes</Text></View>
             <View style={styles.statBox}><Text style={styles.statNum}>342</Text><Text style={styles.statLabel}>Views</Text></View>
          </View>
        </View>

        {subscription !== 'ultimate' && (
          <TouchableOpacity style={styles.upgradeBanner} onPress={() => navigation.navigate('Paywall')}>
            <View>
                <Text style={styles.upgradeTitle}>Upgrade to {subscription === 'plus' ? 'Ultimate' : 'Premium'}</Text>
                <Text style={styles.upgradeSubtitle}>Unlock full access to matches & features</Text>
            </View>
            <Crown color={COLORS.navyDark} size={24} fill={COLORS.navyDark} />
          </TouchableOpacity>
        )}
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <TouchableOpacity style={styles.row}>
            <Text style={styles.rowText}>Edit Profile</Text>
            <ArrowRight color={COLORS.gray} size={20} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('Paywall')}>
            <Text style={styles.rowText}>Manage Subscription</Text>
            <ArrowRight color={COLORS.gray} size={20} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.row}>
            <Text style={styles.rowText}>Discovery Settings</Text>
            <ArrowRight color={COLORS.gray} size={20} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.row}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
               <Text style={styles.rowText}>Incognito Mode</Text>
               {subscription !== 'ultimate' && <Lock size={14} color={COLORS.goldMid} style={{marginLeft: 8}} />}
            </View>
            <Switch 
              trackColor={{ false: "#767577", true: COLORS.goldMid }}
              thumbColor={COLORS.white}
              value={subscription === 'ultimate'} 
              onValueChange={() => {
                if(subscription !== 'ultimate') navigation.navigate('Paywall');
              }}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.row}>
            <Text style={styles.rowText}>Privacy & Safety</Text>
            <ArrowRight color={COLORS.gray} size={20} />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
        <Text style={styles.versionText}>Version 1.2.0 (Build 56)</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

// --- NAVIGATION MOCK ---
const TabBar = ({ currentTab, setTab }: any) => (
  <View style={styles.tabBar}>
    <TouchableOpacity onPress={() => setTab('discover')} style={styles.tabItem}>
      <User color={currentTab === 'discover' ? COLORS.goldMid : COLORS.gray} size={24} />
      <Text style={[styles.tabText, currentTab === 'discover' && styles.activeTabText]}>Discover</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => setTab('likes')} style={styles.tabItem}>
      <View>
        <Heart color={currentTab === 'likes' ? COLORS.goldMid : COLORS.gray} size={24} />
        <View style={styles.tabBadge}><Text style={styles.tabBadgeText}>4</Text></View>
      </View>
      <Text style={[styles.tabText, currentTab === 'likes' && styles.activeTabText]}>Likes</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => setTab('messages')} style={styles.tabItem}>
      <MessageCircle color={currentTab === 'messages' ? COLORS.goldMid : COLORS.gray} size={24} />
      <Text style={[styles.tabText, currentTab === 'messages' && styles.activeTabText]}>Messages</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => setTab('profile')} style={styles.tabItem}>
      <Settings color={currentTab === 'profile' ? COLORS.goldMid : COLORS.gray} size={24} />
      <Text style={[styles.tabText, currentTab === 'profile' && styles.activeTabText]}>Profile</Text>
    </TouchableOpacity>
  </View>
);

// --- MAIN APP COMPONENT ---
export default function VirginsMobileApp() {
  // Simple state-based navigation for demo purposes
  // In a real app, this would be React Navigation
  const [screen, setScreen] = useState('welcome'); 
  const [tab, setTab] = useState('discover');
  
  // Fake context provider wrapper (logic moved to AuthProvider)
  
  const MainStack = () => {
    // Nav stacks
    if (screen === 'welcome') return <WelcomeScreen navigation={{ navigate: setScreen }} />;
    if (screen === 'Login') return <LoginScreen navigation={{ goBack: () => setScreen('welcome'), navigate: setScreen }} />;
    if (screen === 'SignUp') return <SignUpScreen navigation={{ goBack: () => setScreen('welcome'), navigate: setScreen }} />;
    if (screen === 'EmailVerification') return <EmailVerificationScreen navigation={{ navigate: setScreen }} route={{ params: { email: 'demo@user.com' } }} />;
    
    // Profile Setup Flow
    if (screen === 'ProfileSetup1') return <ProfileSetup1 navigation={{ navigate: setScreen }} />;
    if (screen === 'ProfileSetup2') return <ProfileSetup2 navigation={{ navigate: setScreen }} />;
    if (screen === 'ProfileSetup3') return <ProfileSetup3 navigation={{ navigate: setScreen }} />;
    if (screen === 'ProfileSetup4') return <ProfileSetup4 navigation={{ navigate: setScreen }} />;
    if (screen === 'Verification') return <VerificationScreen navigation={{ navigate: setScreen }} />;
    
    // Paywall
    if (screen === 'Paywall') return <PaywallScreen navigation={{ goBack: () => setScreen('main') }} />;

    // Main App
    if (screen === 'chat') return <ChatScreen onBack={() => setScreen('main')} navigation={{ navigate: setScreen }} />;

    const { logout } = useContext(AuthContext);

    return (
      <View style={{ flex: 1, backgroundColor: COLORS.navyDark }}>
        <StatusBar barStyle="light-content" />
        <View style={{ flex: 1 }}>
          {tab === 'discover' && <DiscoverScreen navigation={{ navigate: setScreen }} />}
          {tab === 'likes' && <LikesScreen navigation={{ navigate: setScreen }} />}
          {tab === 'messages' && <MessagesScreen onChatOpen={() => setScreen('chat')} navigation={{ navigate: setScreen }} />}
          {tab === 'profile' && <ProfileScreen logout={() => {logout(); setScreen('welcome')}} navigation={{ navigate: setScreen }} />}
        </View>
        <TabBar currentTab={tab} setTab={setTab} />
      </View>
    );
  }

  return (
    <AuthProvider>
      <MainStack />
    </AuthProvider>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.navyDark },
  safeArea: { flex: 1, backgroundColor: COLORS.navyDark },
  contentContainer: { flex: 1, padding: 20 },
  
  // Welcome Screen
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(26, 26, 46, 0.85)', zIndex: 1 },
  backgroundImage: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  welcomeContent: { flex: 1, zIndex: 2, justifyContent: 'space-between', padding: 30, paddingBottom: 60 },
  logoContainer: { alignItems: 'center', marginTop: 100 },
  logoCircle: { width: 80, height: 80, borderRadius: 40, borderWidth: 2, borderColor: COLORS.goldMid, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  logoInitial: { fontSize: 40, color: COLORS.goldMid, fontWeight: 'bold' },
  logoText: { fontSize: 32, color: COLORS.goldMid, fontWeight: 'bold', letterSpacing: 4 },
  tagline: { fontSize: 16, color: COLORS.cream, marginTop: 10, fontStyle: 'italic' },
  statsContainer: { marginTop: 20, flexDirection: 'row', alignItems: 'center' },
  statText: { color: COLORS.goldLight, fontSize: 14, fontWeight: '600' },
  statDot: { color: COLORS.goldMid, marginHorizontal: 10 },
  buttonContainer: { width: '100%', gap: 15 },
  
  // Buttons
  primaryButton: { backgroundColor: COLORS.goldMid, padding: 18, borderRadius: 30, alignItems: 'center', shadowColor: COLORS.goldDark, shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.3, shadowRadius: 5 },
  primaryButtonText: { color: COLORS.navyDark, fontWeight: 'bold', fontSize: 16 },
  secondaryButton: { borderWidth: 1, borderColor: COLORS.goldMid, padding: 18, borderRadius: 30, alignItems: 'center' },
  secondaryButtonText: { color: COLORS.goldMid, fontWeight: 'bold', fontSize: 16 },
  
  // Auth
  authContainer: { flex: 1, padding: 30, justifyContent: 'center' },
  backButton: { position: 'absolute', top: 50, left: 20, zIndex: 10 },
  headerTitle: { fontSize: 32, color: COLORS.goldLight, fontWeight: 'bold', marginBottom: 10, fontFamily: FONTS.serif },
  headerSubtitle: { fontSize: 16, color: COLORS.gray, marginBottom: 40 },
  input: { backgroundColor: '#252540', padding: 18, borderRadius: 12, color: COLORS.white, marginBottom: 15, fontSize: 16, borderWidth: 1, borderColor: '#333' },
  linkText: { color: COLORS.gray, textAlign: 'center' },
  legalText: { color: COLORS.gray, fontSize: 12, textAlign: 'center', marginTop: 30, lineHeight: 18 },
  
  // Profile Setup
  progressContainer: { width: '100%', height: 4, backgroundColor: '#333', borderRadius: 2, marginBottom: 30 },
  progressBar: { height: '100%', backgroundColor: COLORS.goldMid, borderRadius: 2 },
  stepTitle: { fontSize: 28, color: COLORS.white, fontWeight: 'bold', marginBottom: 10 },
  stepSubtitle: { fontSize: 16, color: COLORS.gray, marginBottom: 30 },
  label: { fontSize: 16, color: COLORS.goldLight, marginBottom: 10, marginTop: 20 },
  setupRow: { flexDirection: 'row', gap: 10 },
  optionButton: { flex: 1, padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#444', alignItems: 'center' },
  optionButtonSelected: { flex: 1, padding: 15, borderRadius: 12, backgroundColor: COLORS.goldMid, alignItems: 'center' },
  optionText: { color: COLORS.gray, fontSize: 16 },
  optionTextSelected: { color: COLORS.navyDark, fontWeight: 'bold', fontSize: 16 },
  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: '#252540', borderWidth: 1, borderColor: '#333' },
  chipSelected: { backgroundColor: COLORS.goldMid },
  chipGold: { borderColor: COLORS.goldMid, borderWidth: 1 },
  chipText: { color: COLORS.gray },
  chipTextSelected: { color: COLORS.white, fontWeight: 'bold' },
  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  photoSlot: { width: '30%', aspectRatio: 1, backgroundColor: '#252540', borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: '#555' },
  
  // Verification
  verificationStep: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, width: '100%', padding: 15, backgroundColor: '#252540', borderRadius: 12 },
  checkCircle: { width: 24, height: 24, borderRadius: 12, backgroundColor: COLORS.goldMid, alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  circle: { width: 24, height: 24, borderRadius: 12, borderWidth: 1, borderColor: COLORS.gray, alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  stepText: { color: COLORS.white, fontSize: 16, fontWeight: '600' },

  // Paywall
  paywallContainer: { flex: 1, backgroundColor: COLORS.navyDark },
  paywallBackground: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  paywallOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(26, 26, 46, 0.9)' },
  closeButton: { alignSelf: 'flex-end', padding: 20 },
  crownContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.goldMid, alignItems: 'center', justifyContent: 'center', marginBottom: 20, shadowColor: COLORS.goldLight, shadowRadius: 20, shadowOpacity: 0.5 },
  paywallTitle: { fontSize: 26, color: COLORS.white, fontWeight: 'bold', fontFamily: FONTS.serif, marginBottom: 10 },
  paywallSubtitle: { fontSize: 16, color: COLORS.gray, textAlign: 'center', marginHorizontal: 20 },
  planCard: { backgroundColor: COLORS.navyMid, borderRadius: 16, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: '#333' },
  planCardSelected: { borderColor: COLORS.goldMid, borderWidth: 2 },
  ultimateCard: { backgroundColor: COLORS.goldMid },
  popularBadge: { position: 'absolute', top: -12, alignSelf: 'center', backgroundColor: COLORS.navyDark, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  popularText: { color: COLORS.goldMid, fontSize: 10, fontWeight: 'bold' },
  planHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.1)', paddingBottom: 15 },
  planName: { fontSize: 20, fontWeight: 'bold', color: COLORS.white, fontFamily: FONTS.serif },
  planPrice: { fontSize: 16, fontWeight: 'bold', color: COLORS.goldMid },
  planFeatures: { gap: 10 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  featureText: { color: COLORS.white, fontSize: 14 },
  disclaimerText: { fontSize: 10, color: COLORS.gray, textAlign: 'center', marginTop: 20 },
  paywallFooter: { padding: 20, borderTopWidth: 1, borderTopColor: '#333', backgroundColor: COLORS.navyDark },
  restoreText: { color: COLORS.gray, textAlign: 'center', fontSize: 12 },

  // Main Headers
  header: { padding: 15, paddingTop: Platform.OS === 'ios' ? 10 : 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.navyDark },
  headerTitleSmall: { fontSize: 20, color: COLORS.goldLight, fontWeight: 'bold', fontFamily: FONTS.serif },
  smallLogo: { width: 30, height: 30, borderRadius: 15 },
  filterButton: { padding: 8 },
  goldBadge: { backgroundColor: COLORS.goldMid, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  goldBadgeText: { color: COLORS.navyDark, fontSize: 10, fontWeight: 'bold' },
  
  // Cards
  cardContainer: { flex: 1, margin: 10, borderRadius: 20, overflow: 'hidden', position: 'relative', backgroundColor: '#000' },
  cardImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  cardGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 250, backgroundColor: 'rgba(0,0,0,0.6)' }, 
  cardContent: { position: 'absolute', bottom: 100, left: 20, right: 20 },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  cardName: { fontSize: 32, color: COLORS.white, fontWeight: 'bold', fontFamily: FONTS.serif },
  cardLocation: { fontSize: 16, color: COLORS.cream, marginTop: 4 },
  cardTags: { flexDirection: 'row', marginTop: 10, gap: 5 },
  cardTag: { backgroundColor: 'rgba(212, 165, 116, 0.3)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  cardTagText: { color: COLORS.goldLight, fontSize: 12 },
  cardBio: { fontSize: 16, color: COLORS.white, marginTop: 12, opacity: 0.9, lineHeight: 22 },
  
  // Action Buttons
  actionButtons: { position: 'absolute', bottom: 30, flexDirection: 'row', justifyContent: 'space-evenly', width: '100%', alignItems: 'center' },
  actionButton: { width: 60, height: 60, borderRadius: 30, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 5, elevation: 5 },
  likeButton: { backgroundColor: '#E8F5E9', width: 70, height: 70, borderRadius: 35 },
  passButton: { backgroundColor: '#FFEBEE', width: 70, height: 70, borderRadius: 35 },
  superLikeButton: { backgroundColor: '#E3F2FD', width: 50, height: 50, borderRadius: 25, marginTop: 10 },
  
  // Grid (Likes)
  freeBanner: { backgroundColor: 'rgba(212, 165, 116, 0.1)', padding: 10, alignItems: 'center', marginBottom: 5 },
  freeBannerText: { color: COLORS.goldMid, fontSize: 12, fontWeight: 'bold' },
  gridItem: { flex: 1, margin: 6, height: 220, borderRadius: 12, overflow: 'hidden', backgroundColor: '#252540' },
  gridImage: { width: '100%', height: '100%' },
  gridOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 10, backgroundColor: 'rgba(0,0,0,0.6)' },
  gridName: { color: COLORS.white, fontWeight: 'bold' },
  verifiedBadgeSmall: { position: 'absolute', top: 8, right: 8, backgroundColor: COLORS.goldMid, padding: 2, borderRadius: 10 },
  
  // Messages
  newMatchesContainer: { paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#222' },
  sectionHeader: { color: COLORS.goldMid, fontSize: 14, fontWeight: 'bold', marginLeft: 15, marginBottom: 10, textTransform: 'uppercase' },
  newMatchItem: { marginRight: 15, alignItems: 'center' },
  newMatchAvatar: { width: 64, height: 64, borderRadius: 32, borderWidth: 2, borderColor: COLORS.goldMid },
  newBadge: { position: 'absolute', bottom: -5, backgroundColor: COLORS.goldMid, paddingHorizontal: 6, borderRadius: 4 },
  newBadgeText: { fontSize: 10, fontWeight: 'bold', color: COLORS.navyDark },
  messageItem: { flexDirection: 'row', padding: 20, borderBottomWidth: 1, borderBottomColor: '#252540' },
  avatar: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
  messageContent: { flex: 1, justifyContent: 'center' },
  messageRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  senderName: { color: COLORS.goldLight, fontWeight: 'bold', fontSize: 16 },
  messageTime: { color: COLORS.gray, fontSize: 12 },
  lastMessage: { color: COLORS.gray, fontSize: 14 },
  unreadMessage: { color: COLORS.white, fontWeight: 'bold' },
  unreadDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.goldMid, marginTop: 10 },
  
  // Chat
  chatHeader: { flexDirection: 'row', padding: 15, borderBottomWidth: 1, borderBottomColor: '#333', alignItems: 'center' },
  chatAvatar: { width: 40, height: 40, borderRadius: 20, marginLeft: 10 },
  chatName: { color: COLORS.white, fontWeight: 'bold', fontSize: 16 },
  chatStatus: { color: COLORS.green, fontSize: 12 },
  chatBody: { flex: 1, padding: 20 },
  msgLeft: { alignSelf: 'flex-start', backgroundColor: '#333', padding: 12, borderRadius: 16, borderBottomLeftRadius: 0, marginBottom: 10, maxWidth: '80%' },
  msgRight: { alignSelf: 'flex-end', backgroundColor: COLORS.goldMid, padding: 12, borderRadius: 16, borderBottomRightRadius: 0, marginBottom: 10, maxWidth: '80%' },
  msgTextLeft: { color: COLORS.white },
  msgTextRight: { color: COLORS.navyDark },
  msgTimeLeft: { color: '#888', fontSize: 10, marginTop: 4 },
  msgTimeRight: { color: COLORS.navyDark, fontSize: 10, marginTop: 4, alignSelf: 'flex-end', opacity: 0.7 },
  chatInputContainer: { flexDirection: 'row', padding: 15, borderTopWidth: 1, borderTopColor: '#333', alignItems: 'center', paddingBottom: 30 },
  chatInput: { flex: 1, backgroundColor: '#222', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 10, marginHorizontal: 10, color: '#fff' },
  sendButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.goldMid, alignItems: 'center', justifyContent: 'center' },

  // Profile
  profileHeader: { alignItems: 'center', padding: 40, backgroundColor: COLORS.navyMid },
  profileAvatar: { width: 120, height: 120, borderRadius: 60, borderWidth: 3, borderColor: COLORS.goldMid, marginBottom: 15 },
  editIcon: { position: 'absolute', top: 130, right: '35%', backgroundColor: COLORS.goldMid, padding: 8, borderRadius: 20 },
  profileName: { fontSize: 24, color: COLORS.white, fontWeight: 'bold', flexDirection: 'row', alignItems: 'center' },
  profileStatus: { fontSize: 14, color: COLORS.gray, marginTop: 5 },
  statsRow: { flexDirection: 'row', marginTop: 25, width: '100%', justifyContent: 'space-around' },
  statBox: { alignItems: 'center' },
  statNum: { color: COLORS.white, fontSize: 20, fontWeight: 'bold' },
  statLabel: { color: COLORS.gray, fontSize: 12 },
  upgradeBanner: { margin: 20, padding: 15, borderRadius: 12, backgroundColor: COLORS.goldMid, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowColor: COLORS.goldLight, shadowOpacity: 0.5, shadowRadius: 10 },
  upgradeTitle: { color: COLORS.navyDark, fontWeight: 'bold', fontSize: 18 },
  upgradeSubtitle: { color: COLORS.navyDark, fontSize: 12 },
  section: { padding: 20 },
  sectionTitle: { color: COLORS.gray, fontSize: 14, marginBottom: 15, textTransform: 'uppercase', letterSpacing: 1 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#252540' },
  rowText: { color: COLORS.white, fontSize: 16 },
  logoutButton: { margin: 20, padding: 15, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: COLORS.red },
  logoutText: { color: COLORS.red, fontWeight: 'bold' },
  versionText: { textAlign: 'center', color: '#444', marginBottom: 40, fontSize: 12 },

  // Tab Bar
  tabBar: { flexDirection: 'row', backgroundColor: '#121225', paddingBottom: 30, paddingTop: 15, borderTopWidth: 1, borderTopColor: '#252540' },
  tabItem: { flex: 1, alignItems: 'center' },
  tabText: { color: COLORS.gray, fontSize: 10, marginTop: 4 },
  activeTabText: { color: COLORS.goldMid },
  tabBadge: { position: 'absolute', top: -5, right: -5, backgroundColor: COLORS.red, width: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  tabBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' }
});