import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

// Import actual screens
import DashboardScreen from '../screens/DashboardScreen';
import FinanceScreen from '../screens/FinanceScreen';
import DigitalScreen from '../screens/DigitalScreen';
// import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const ProfileScreen = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Profile</Text>
    </View>
  );
  
const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.label,
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Dashboard') {
            iconName = 'home';
          } else if (route.name === 'Finance') {
            iconName = 'chart-line';
          } else if (route.name === 'Digital') {
            iconName = 'globe';
          } else if (route.name === 'Profile') {
            iconName = 'user';
          }
          return <Icon name={iconName} size={20} color={focused ? '#ff5e5e' : '#556'} />;
        },
        tabBarActiveTintColor: '#ff5e5e',
        tabBarInactiveTintColor: '#556',
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Finance" component={FinanceScreen} />
      <Tab.Screen name="Digital" component={DigitalScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 10,
    left: 20,
    right: 20,
    elevation: 5,
    backgroundColor: '#fff',
    borderRadius: 20,
    height: 70,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    paddingBottom: 5,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default BottomTabNavigator;
