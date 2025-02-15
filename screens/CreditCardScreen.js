import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Appbar } from 'react-native-paper';
import axios from 'axios';
import { insertCardDetailsData } from '../store/database'; // Database function

const CreditCardScreen = ({ route, navigation }) => {
  const { cardType } = route.params || { cardType: 'Credit Card' };

  const [ifscCode, setIfscCode] = useState('');
  const [bankName, setBankName] = useState('');
  const [branch, setBranch] = useState('');
  const [city, setCity] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [validDate, setValidDate] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [pin, setPin] = useState('');

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
    if (!bankName || !cardNumber || !cvv || !validDate || !cardholderName || !pin || !ifscCode || !branch || !city) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    try {
      await insertCardDetailsData(bankName, cardNumber, cvv, validDate, cardholderName, pin, cardType, ifscCode, branch, city);
      Alert.alert('Success', `${cardType} details saved!`);
      navigation.goBack();

      // Reset form
      setIfscCode('');
      setBankName('');
      setBranch('');
      setCity('');
      setCardNumber('');
      setCvv('');
      setValidDate('');
      setCardholderName('');
      setPin('');
    } catch (error) {
      Alert.alert('Error', `Failed to save ${cardType} details`);
    }
  };

  return (
    <>
      <Appbar.Header style={styles.appBar}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={cardType} />
      </Appbar.Header>

      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.headerText}>{cardType} Form</Text>

            {/* IFSC Code Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>IFSC Code</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter IFSC Code"
                value={ifscCode}
                onChangeText={setIfscCode}
                keyboardType="default"
              />
              <TouchableOpacity style={styles.fetchButton} onPress={fetchBankDetails}>
                <Text style={styles.fetchButtonText}>Fetch Bank</Text>
              </TouchableOpacity>
            </View>

            {/* Bank Name (Auto-filled) */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Bank Name</Text>
              <TextInput style={styles.input} placeholder="Bank Name" value={bankName} editable={false} />
            </View>

            {/* Branch (Auto-filled) */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Branch</Text>
              <TextInput style={styles.input} placeholder="Branch" value={branch} editable={false} />
            </View>

            {/* City (Auto-filled) */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>City</Text>
              <TextInput style={styles.input} placeholder="City" value={city} editable={false} />
            </View>

            {/* Card Number */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Card Number</Text>
              <TextInput style={styles.input} placeholder="Enter Card Number" value={cardNumber} onChangeText={setCardNumber} keyboardType="numeric" />
            </View>

            {/* CVV */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>CVV</Text>
              <TextInput style={styles.input} placeholder="Enter CVV" value={cvv} onChangeText={setCvv} keyboardType="numeric"/>
            </View>

            {/* Expiry Date */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Expiry Date</Text>
              <TextInput style={styles.input} placeholder="MM/YY" value={validDate} onChangeText={setValidDate} keyboardType="numeric" />
            </View>

            {/* Cardholder Name */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Cardholder Name</Text>
              <TextInput style={styles.input} placeholder="Enter Cardholder Name" value={cardholderName} onChangeText={setCardholderName} />
            </View>

            {/* PIN */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>PIN</Text>
              <TextInput style={styles.input} placeholder="Enter PIN" value={pin} onChangeText={setPin} keyboardType="numeric"/>
            </View>

            {/* Submit Button */}
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Submit</Text>
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
  headerText: { fontSize: 24, fontWeight: 'bold', color: '#000', marginBottom: 20, textAlign: 'center' },
  inputContainer: { width: '100%', marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '500', color: '#000', marginBottom: 5 },
  input: { width: '100%', height: 50, backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 10, paddingHorizontal: 15, fontSize: 16 },
  fetchButton: { marginTop: 10, backgroundColor: '#3498db', padding: 10, borderRadius: 8, alignItems: 'center' },
  fetchButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  submitButton: { width: '100%', height: 50, backgroundColor: '#2c3e50', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  submitButtonText: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  appBar: { elevation: 4, shadowColor: '#000' },
  innerContainer: { width: '100%', backgroundColor: '#fff', borderRadius: 15, padding: 20, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 5, top: 30 },
});

export default CreditCardScreen;
