import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Appbar } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { insertBankAccountData } from '../store/database'; // Database function
import BottomTabNavigator from '../components/BottomTabNavigator';

const BankAccountScreen = ({ navigation }) => {
  const [ifscCode, setIfscCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [bankName, setBankName] = useState('');
  const [branch, setBranch] = useState('');
  const [city, setCity] = useState('');
  const [cifCode, setCifCode] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch Bank Details using IFSC Code
  const fetchBankDetails = async (ifsc) => {
    if (ifsc.length === 11) {
      setLoading(true);
      try {
        const response = await axios.get(`https://ifsc.razorpay.com/${ifsc}`);
        if (response.data) {
          setBankName(response.data.BANK);
          setBranch(response.data.BRANCH);
          setCity(response.data.CITY);
        } else {
          Alert.alert("Invalid IFSC", "Please enter a valid IFSC code.");
        }
      } catch (error) {
        Alert.alert("Error", "Could not fetch bank details. Check IFSC code.");
      }
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!accountNumber || !accountHolderName || !ifscCode || !bankName || !branch || !cifCode) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    try {
      console.info(accountNumber, accountHolderName, bankName, branch, city, ifscCode, cifCode)
      await insertBankAccountData(accountNumber, accountHolderName, bankName, branch, city, ifscCode, cifCode);
      Alert.alert('Success', 'Bank account details saved!');
      navigation.navigate('Dashboard');

      // Reset form
      setAccountNumber('');
      setAccountHolderName('');
      setIfscCode('');
      setBankName('');
      setBranch('');
      setCity('');
      setCifCode('');
    } catch (error) {
      Alert.alert('Error', 'Failed to save bank details');
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.innerContainer}>

          <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            <Text style={styles.headerText}>Bank Account Form</Text>

            {/* IFSC Code Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>IFSC Code</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter IFSC Code"
                value={ifscCode}
                onChangeText={(text) => {
                  setIfscCode(text);
                  fetchBankDetails(text);
                }}
              />
            </View>

            {/* Bank Name (Auto-filled) */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Bank Name</Text>
              <TextInput style={styles.input} value={bankName} editable={false} />
            </View>

            {/* Branch Name (Auto-filled) */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Branch</Text>
              <TextInput style={styles.input} value={branch} editable={false} />
            </View>

            {/* City Name (Auto-filled) */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>City</Text>
              <TextInput style={styles.input} value={city} editable={false} />
            </View>

            {/* Account Number */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>A/C No</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Account Number"
                value={accountNumber}
                onChangeText={setAccountNumber}
                keyboardType="numeric"
              />
            </View>

            {/* Account Holder Name */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>A/C Holder Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Account Holder Name"
                value={accountHolderName}
                onChangeText={setAccountHolderName}
              />
            </View>

            {/* CIF Code */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>CIF Code</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter CIF Code"
                value={cifCode}
                onChangeText={setCifCode}
              />
            </View>

            {/* Submit Button */}
            {loading ? (
              <ActivityIndicator size="large" color="#000" />
            ) : (
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      </View>
      {/* <BottomTabNavigator /> */}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
    paddingTop: 2,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  submitButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#2c3e50',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  appBar: {
    elevation: 4,
    shadowColor: '#000',
  },
  innerContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    top : 30
  },
});

export default BankAccountScreen;
