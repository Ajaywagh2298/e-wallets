import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Appbar } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { insertNetBankingData } from '../store/database'; // Database function

const NetBankingScreen = ({ navigation }) => {
  const [accountType, setAccountType] = useState('Bank');
  const [ifscCode, setIfscCode] = useState('');
  const [bankName, setBankName] = useState('');
  const [branch, setBranch] = useState('');
  const [city, setCity] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [note, setNote] = useState('');

  // Fetch Bank Details using IFSC Code
  const fetchBankDetails = async () => {
    if (!ifscCode || ifscCode.length !== 11) {
      Alert.alert("Invalid IFSC", "Please enter a valid 11-character IFSC code.");
      return;
    }

    try {
      const response = await axios.get(`https://ifsc.razorpay.com/${ifscCode}`);
      if (response.data) {
        setBankName(response.data.BANK);
        setBranch(response.data.BRANCH);
        setCity(response.data.CITY);
      } else {
        Alert.alert("Invalid IFSC", "No bank details found for this IFSC.");
      }
    } catch (error) {
      Alert.alert("Error", "Could not fetch bank details. Please check the IFSC code.");
    }
  };

  const handleSubmit = async () => {
    if (!bankName || !accountNumber || !userId || !password || !ifscCode || !branch || !city) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    try {
      await insertNetBankingData(accountType, bankName, accountNumber, userId, password, note, ifscCode, branch, city);
      Alert.alert('Success', 'Net Banking details saved!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save details');
    }
  };

  return (
    <>
      <Appbar.Header style={styles.appBar}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Net Banking" />
      </Appbar.Header>

      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.headerText}>Enter Net Banking Details</Text>

            {/* Account Type Picker */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Account Type</Text>
              <Picker selectedValue={accountType} onValueChange={setAccountType} style={styles.picker}>
                <Picker.Item label="Bank" value="Bank" />
                <Picker.Item label="Credit Card" value="Credit Card" />
              </Picker>
            </View>

            {/* IFSC Code Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>IFSC Code</Text>
              <View style={styles.row}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Enter IFSC Code"
                  value={ifscCode}
                  onChangeText={setIfscCode}
                />
                <TouchableOpacity style={styles.fetchButton} onPress={fetchBankDetails}>
                  <Text style={styles.fetchButtonText}>Fetch</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Auto-filled Bank Details */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Bank Name</Text>
              <TextInput style={styles.input} placeholder="Bank Name" value={bankName} editable={false} />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputContainer, { flex: 1 }]}>
                <Text style={styles.label}>Branch</Text>
                <TextInput style={styles.input} placeholder="Branch" value={branch} editable={false} />
              </View>
              <View style={[styles.inputContainer, { flex: 1, marginLeft: 10 }]}>
                <Text style={styles.label}>City</Text>
                <TextInput style={styles.input} placeholder="City" value={city} editable={false} />
              </View>
            </View>

            {/* Account Details */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Account Number</Text>
              <TextInput style={styles.input} placeholder="Enter Account Number" value={accountNumber} onChangeText={setAccountNumber} keyboardType="numeric" />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>User ID</Text>
              <TextInput style={styles.input} placeholder="Enter User ID" value={userId} onChangeText={setUserId} />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput style={styles.input} placeholder="Enter Password" value={password} onChangeText={setPassword} secureTextEntry />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Note</Text>
              <TextInput style={styles.input} placeholder="Additional Notes" value={note} onChangeText={setNote} multiline />
            </View>

            {/* Submit Button */}
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Save Details</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  scrollContainer: { flexGrow: 1, alignItems: 'center' },
  scrollContainer: { flexGrow: 1 },
  headerText: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  inputContainer: { marginBottom: 12 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 5 },
  input: { width: '100%', height: 48, backgroundColor: '#fff', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10 },
  row: { flexDirection: 'row', alignItems: 'center' },
  picker: { backgroundColor: '#fff', borderWidth: 1, borderRadius: 8 },
  fetchButtonText: { color: '#fff', fontWeight: 'bold' },
  submitButton: { height: 50, backgroundColor: '#2c3e50', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  submitButtonText: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  appBar: { elevation: 4 },
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  scrollContainer: { flexGrow: 1, alignItems: 'center' },
  headerText: { fontSize: 24, fontWeight: 'bold', color: '#000', marginBottom: 20, textAlign: 'center' },
  inputContainer: { width: '100%', marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '500', color: '#000', marginBottom: 5 },
  input: { width: '100%', height: 50, backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 10, paddingHorizontal: 15, fontSize: 16 },
  fetchButton: { marginTop: 10, backgroundColor: '#3498db', padding: 10, borderRadius: 8, alignItems: 'center', marginLeft : 10 },
  fetchButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  submitButton: { width: '100%', height: 50, backgroundColor: '#2c3e50', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  submitButtonText: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  appBar: { elevation: 4, shadowColor: '#000' },
  innerContainer: { width: '100%', backgroundColor: '#fff', borderRadius: 15, padding: 20, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 5, top: 30 },
});

export default NetBankingScreen;
