import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AppBarWithDrawer from '../components/AppBarWithDrawer'
import { LinearGradient } from 'expo-linear-gradient';

const DashboardScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
     <Text > DashboardScreen </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DashboardScreen;