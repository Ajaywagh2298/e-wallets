import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Icon Import

import SignUpScreen from './screens/SignUpScreen';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import BankAccountScreen from './screens/BankAccountScreen';
import CreditCardScreen from './screens/CreditCardScreen';
import NetBankingScreen from './screens/NetBankingScreen';
import EmailScreen from './screens/EmailScreen';
import WifiScreen from './screens/WifiScreen';
import AppScreen from './screens/AppScreen';
import NotesScreen from './screens/NotesScreen';
import PanScreen from './screens/PanScreen';
import FinanceScreen from './screens/FinanceScreen';
import DigitalScreen from './screens/DigitalScreen';
import OtherScreen from './screens/OtherScreen';
import DigitalListScreen from './screens/DigitalListScreen';
import DematScreen from './screens/DematScreen';
import SettingsScreen from './screens/SettingsScreen';
import FinanceListScreen from './screens/FinanceListScreen';
import { 
  createUserTable, createEmailTable, createNetBankingTable, createCardDetailsTable, 
  createBankAccountTable, createDematTable, createAppAccountTable, 
  createNotePadTable, createOtherTable, createConfigTable
} from './store/database';
import { initConfigService } from './store/configService';

const Stack = createStackNavigator();

export default function App() {
  const [isDbReady, setIsDbReady] = useState(false);
  const [showGetStarted, setShowGetStarted] = useState(false);

  useEffect(() => {
    const setupDatabase = async () => {
      try {
        await createUserTable();
        await createEmailTable();
        await createBankAccountTable();
        await createCardDetailsTable();
        await createDematTable();
        await createAppAccountTable();
        await createNotePadTable();
        await createOtherTable();
        await createNetBankingTable();
        await createConfigTable();
        await initConfigService();

        setIsDbReady(true);  
      } catch (error) {
        console.error('Database initialization failed:', error);
      }
    };

    setupDatabase();

    const timer = setTimeout(() => {
      setShowGetStarted(true);
    }, 360000);

    return () => clearTimeout(timer);
  }, []);

  if (!isDbReady) {
    return (
      <View style={styles.splashContainer}>
        <Text style={styles.appTitle}>Amazing App</Text>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.loadingText}>Setting up the app...</Text>

        {showGetStarted && (
          <TouchableOpacity style={styles.getStartedButton} onPress={() => setIsDbReady(true)}>
            <Text style={styles.getStartedText}>Get Started</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login" 
        screenOptions={({ route, navigation}) => ({
          // headerRight: () => (
          //   <TouchableOpacity style={{ marginRight: 15 }} onPress={() => navigation.navigate('Setting')}>
          //     <Ionicons name="settings-outline" size={24} color="black" />
          //   </TouchableOpacity>
          // ),
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
        <Stack.Screen name="Login" component={LoginScreen}/>
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Bank Account" component={BankAccountScreen} />
        <Stack.Screen name="Card" component={CreditCardScreen} />
        <Stack.Screen name="Net Banking" component={NetBankingScreen} />
        <Stack.Screen name="Email" component={EmailScreen} />
        <Stack.Screen name="Wifi" component={WifiScreen} />
        <Stack.Screen name="App" component={AppScreen} />
        <Stack.Screen name="Notes" component={NotesScreen} />
        <Stack.Screen name="Pan" component={PanScreen} />
        <Stack.Screen name="Digital List" component={DigitalListScreen} />
        <Stack.Screen name="Demat Screen" component={DematScreen} />
        <Stack.Screen name="Profile" component={SettingsScreen} />
        <Stack.Screen name="Finance List" component={FinanceListScreen} />
        <Stack.Screen name="Finance" component={FinanceScreen} />
        <Stack.Screen name="Digital" component={DigitalScreen} />
        <Stack.Screen name="Other" component={OtherScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#2c3e50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 18,
    color: '#ffffff',
    marginTop: 10,
  },
  getStartedButton: {
    marginTop: 20,
    backgroundColor: '#3498db',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  getStartedText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});
