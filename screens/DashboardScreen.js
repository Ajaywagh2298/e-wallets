import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card, Title, Paragraph, ActivityIndicator } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';
import { getAllBankAccountData, getAllCardDetailsData, getAllNetBankingData } from '../store/database';
import BottomTabNavigator from '../components/BottomTabNavigator';

const DashboardScreen = ({ navigation }) => {
  const [bankAccounts, setBankAccounts] = useState([]);
  const [cardDetails, setCardDetails] = useState([]);
  const [netBanking, setNetBanking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const banks = await getAllBankAccountData();
      const cards = await getAllCardDetailsData();
      const netBanks = await getAllNetBankingData();
      setBankAccounts(banks || []);
      setCardDetails(cards || []);
      setNetBanking(netBanks || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating={true} size="large" color="#ffffff" />
        <Text style={styles.loadingText}>Loading Dashboard...</Text>
      </View>
    );
  }

  return (
    <>
      <LinearGradient colors={['#fbfcfc', '#fbfcfc']} style={styles.container}>
        <ScrollView contentContainerStyle={styles.contentContainer}>

          {/* Bank Accounts Card */}
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <Feather name="database" size={28} color="#3498db" />
                <Title style={styles.cardTitle}>Bank Accounts</Title>
              </View>
              <Paragraph>{bankAccounts.length} accounts found</Paragraph>
            </Card.Content>
          </Card>

          {/* Card Details */}
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <Feather name="credit-card" size={28} color="#e74c3c" />
                <Title style={styles.cardTitle}>Card Details</Title>
              </View>
              <Paragraph>{cardDetails.length} cards saved</Paragraph>
            </Card.Content>
          </Card>

          {/* Net Banking */}
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <Feather name="globe" size={28} color="#27ae60" />
                <Title style={styles.cardTitle}>Net Banking</Title>
              </View>
              <Paragraph>{netBanking.length} accounts linked</Paragraph>
            </Card.Content>
          </Card>
        </ScrollView>
      </LinearGradient>
      <BottomTabNavigator />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
  dashboardTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    marginBottom: 15,
    borderRadius: 10,
    elevation: 4,
    padding: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#2c3e50',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#ffffff',
    fontSize: 18,
  },
});

export default DashboardScreen;
