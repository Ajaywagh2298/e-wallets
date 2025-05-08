import React, { useState, useEffect, use } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Feather, FontAwesome, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator } from 'react-native-paper';
import BottomTabNavigator from '../components/BottomTabNavigator';
import { selectQuery, monthlyExpense } from '../src/controller';

const DashboardScreen = ({ navigation }) => {
  const [bankAccounts, setBankAccounts] = useState([]);
  const [cardDetails, setCardDetails] = useState([]);
  const [netBanking, setNetBanking] = useState([]);
  const [task, setTask] = useState([]);
  const [monthExpense, setMonthExpense] = useState([]);
  const [expense, setExpense] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalExpense, setTotalExpense] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const banks = await selectQuery('bank_account');
      const cards = await selectQuery('card_details');
      const netBanks = await selectQuery('net_banking');
      const tasks = await selectQuery('task');
      let year = new Date().getFullYear();
      let month = new Date().getMonth() + 1;
      const expenses = await monthlyExpense(year, month);
      const totalExpense = expenses.reduce((acc, expense) => acc + parseFloat(expense.amount), 0);
      const totalIncome = expenses.reduce((acc, expense) => acc + parseFloat(expense.remainingbalance), 0);
      setBankAccounts(banks || []);
      setCardDetails(cards || []);
      setNetBanking(netBanks || []);
      setTask(tasks || []);
      setExpense(expenses || []);
      setMonthExpense(totalExpense);
      setTotalExpense(totalIncome);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating={true} size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading Dashboard...</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

        <View style={styles.vaultContainer}>
          <Text style={styles.vaultText}>Vault Locked</Text>
          <MaterialIcons name="fingerprint" size={48} color="white" />
        </View>

        <Text style={styles.sectionTitle}>Quick Access</Text>

        <View style={styles.quickAccess}>
          <TouchableOpacity style={[styles.quickItem, { backgroundColor: '#eaf3fc' }]} onPress={() => navigation.navigate('Bank Account')}>
            <FontAwesome name="university" size={32} color="#3498db" />
            <Text style={styles.quickLabel}>Bank Accounts</Text>
            <Text style={styles.quickLabel}>{bankAccounts.length}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.quickItem, { backgroundColor: '#e9f9f3' }]} onPress={() => navigation.navigate('Expense')}>
            <MaterialCommunityIcons name="account-cash" size={32} color="#2ecc71" />
            <Text style={styles.quickLabel}>Expenses</Text>
            <Text style={styles.quickLabel}>{expense.length}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.quickItem, { backgroundColor: '#fff3e6' }]} onPress={() => navigation.navigate('Net Banking')}>
            <Feather name="key" size={32} color="#f39c12" />
            <Text style={styles.quickLabel}>Passwords</Text>
            <Text style={styles.quickLabel}>{netBanking.length}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.quickItem, { backgroundColor: '#eae8ff' }]} onPress={() => navigation.navigate('Notes')}>
            <MaterialCommunityIcons name="note-text-outline" size={32} color="#6c5ce7" />
            <Text style={styles.quickLabel}>Notes</Text>
            <Text style={styles.quickLabel}>{task.length}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Insights</Text>

        <View style={styles.insightContainer}>
          <View style={styles.insightBox}>
            <Text style={styles.insightValue}>₹ {monthExpense}</Text>
            <Text style={styles.insightLabel}>Total Expenses This Month</Text>
          </View>
          <View style={styles.insightBox}>
            <Text style={styles.insightValue}>₹ {totalExpense} </Text>
            <Text style={styles.insightLabel}>Total Expense</Text>
          </View>
        </View>
      </ScrollView>


      <BottomTabNavigator />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbfcfc',
  },
  contentContainer: {
    padding: 20,
  },
  banner: {
    backgroundColor: '#fef1e6',
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  bannerText: {
    color: '#2c3e50',
    fontWeight: 'bold',
    marginLeft: 10,
    fontSize: 16,
  },
  vaultContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // or 'center' depending on your layout
    alignItems: 'center',
    backgroundColor: '#2c3e50',
    padding: 20,
    borderRadius: 20,
    marginVertical: 15,
  },
  vaultText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#2c3e50',
  },
  quickAccess: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  quickItem: {
    width: '47%',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  quickLabel: {
    marginTop: 10,
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: 'bold',
  },
  insightContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 2,
  },
  insightBox: {
    alignItems: 'center',
    flex: 1,
  },
  insightValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  insightLabel: {
    marginTop: 4,
    fontSize: 13,
    color: '#34495e',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#2c3e50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#ffffff',
    fontSize: 18,
  },
  notificationContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    elevation: 2,
  },
});

export default DashboardScreen;
