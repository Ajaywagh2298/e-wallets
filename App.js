import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { registerReminderTask } from './src/ReminderNotificationService';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

import SignUpScreen from './screens/SignUpScreen';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import BankAccountScreen from './screens/BankAccountScreen';
import CreditCardScreen from './screens/CreditCardScreen';
import NetBankingScreen from './screens/NetBankingScreen';
import EmailScreen from './screens/EmailScreen';
import AppScreen from './screens/AppScreen';
import NotesScreen from './screens/NotesScreen';
import FinanceScreen from './screens/FinanceScreen';
import DigitalScreen from './screens/DigitalScreen';
import OtherScreen from './screens/OtherScreen';
import DigitalListScreen from './screens/DigitalListScreen';
import DematScreen from './screens/DematScreen';
import SettingsScreen from './screens/SettingsScreen';
import FinanceListScreen from './screens/FinanceListScreen';
import ExpenseDetailsScreen from './screens/ExpenseDetailsScreen';

import initdbServer  from './src/database';
import Logo from './components/Logo';

const Stack = createStackNavigator();

export default function App() {
  const [isDbReady, setIsDbReady] = useState(false);
  const [isAppReady, setIsAppReady] = useState(false);
  const [showGetStarted, setShowGetStarted] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await initdbServer();
        setIsDbReady(true);
      } catch (error) {
         // console.error('❌ DB Initialization Error:', error);
      }
    };

    initializeApp();

    const timer = setTimeout(() => {
      setShowGetStarted(true);
    }, 1000); 
    
    // Only request notification permissions if not using Expo Go
    if (!Constants.appOwnership || Constants.appOwnership !== 'expo') {
      Notifications.requestPermissionsAsync();
      registerReminderTask();
    }

    return () => clearTimeout(timer);
  }, []);

  if (!isDbReady || !isAppReady) {
    return (
      <LinearGradient
        colors={['#4A67F0', '#4A67F0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.splashContainer}
      >
        <Logo />
        {showGetStarted && (
          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={() => setIsAppReady(true)}
          >
            <Text style={styles.getStartedText}>Get Started</Text>
          </TouchableOpacity>
        )}
      </LinearGradient>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={({ route }) => ({
          headerStyle: {
            backgroundColor: '#fff',
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTitleAlign: 'center',
          headerShown: !(route.name === 'Login' || route.name === 'SignUp'),
        })}
      >
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Bank Account" component={BankAccountScreen} />
        <Stack.Screen name="Card" component={CreditCardScreen} />
        <Stack.Screen name="Net Banking" component={NetBankingScreen} />
        <Stack.Screen name="Email" component={EmailScreen} />
        <Stack.Screen name="App" component={AppScreen} />
        <Stack.Screen name="Notes" component={NotesScreen} />
        <Stack.Screen name="Digital List" component={DigitalListScreen} />
        <Stack.Screen name="Demat Screen" component={DematScreen} />
        <Stack.Screen name="Profile" component={SettingsScreen} />
        <Stack.Screen name="Finance List" component={FinanceListScreen} />
        <Stack.Screen name="Finance" component={FinanceScreen} />
        <Stack.Screen name="Digital" component={DigitalScreen} />
        <Stack.Screen name="Other" component={OtherScreen} />
        <Stack.Screen name="Expense Details" component={ExpenseDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 42,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 12,
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
  loadingText: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 20,
    fontWeight: '600',
    letterSpacing: 1,
  },
  getStartedButton: {
    marginTop: 30,
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { 
      width: 0, 
      height: 4  // Reduced from 8 for more natural shadow
    },
    shadowOpacity: 0.2,  // Reduced from 0.3 for subtlety
    shadowRadius: 8,      // Reduced from 16 for tighter shadow
    elevation: 8,         // Reduced from 12 for Android
    alignItems: 'center', // Added for proper text alignment
    justifyContent: 'center' // Added for vertical centering
  },
  getStartedText: {
    fontSize: 18,
    color: '#000000',
    fontWeight: '700',
    letterSpacing: 1,
    textAlign: 'center'   // Ensures text is centered
  }
});
