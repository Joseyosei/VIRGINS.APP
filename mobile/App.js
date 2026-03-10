import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { COLORS } from './src/constants/theme';

import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import TutorialScreen from './src/screens/TutorialScreen';
import DiscoverScreen from './src/screens/DiscoverScreen';
import LikesScreen from './src/screens/LikesScreen';
import NearbyScreen from './src/screens/NearbyScreen';
import DatePlannerScreen from './src/screens/DatePlannerScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: COLORS.slate100,
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: 28,
          height: 80,
        },
        tabBarActiveTintColor: COLORS.navy900,
        tabBarInactiveTintColor: COLORS.slate400,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
        tabBarIcon: ({ color }) => {
          const icons = {
            Discover: 'compass-outline',
            Likes: 'heart-outline',
            Nearby: 'location-outline',
            Dates: 'calendar-outline',
            Profile: 'person-outline',
          };
          const activeIcons = {
            Discover: 'compass',
            Likes: 'heart',
            Nearby: 'location',
            Dates: 'calendar',
            Profile: 'person',
          };
          const isActive = color === COLORS.navy900;
          return <Ionicons name={isActive ? activeIcons[route.name] : icons[route.name]} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Discover" component={DiscoverScreen} />
      <Tab.Screen name="Likes" component={LikesScreen} />
      <Tab.Screen name="Nearby" component={NearbyScreen} />
      <Tab.Screen name="Dates" component={DatePlannerScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { user, profile, loading } = useAuth();
  const [tutorialSeen, setTutorialSeen] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem('virgins_tutorial_seen').then(val => {
      setTutorialSeen(val === 'true');
    });
  }, [user]);

  if (loading || tutorialSeen === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.navy900 }}>
        <ActivityIndicator size="large" color={COLORS.gold500} />
      </View>
    );
  }

  const isLoggedIn = !!user;
  const onboardingDone = profile?.onboardingComplete === true;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      {!isLoggedIn ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        </>
      ) : !onboardingDone ? (
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      ) : !tutorialSeen ? (
        <>
          <Stack.Screen name="Tutorial" component={TutorialScreen} />
          <Stack.Screen name="MainTabs" component={MainTabs} />
        </>
      ) : (
        <Stack.Screen name="MainTabs" component={MainTabs} />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
        <StatusBar style="auto" />
      </NavigationContainer>
    </AuthProvider>
  );
}
