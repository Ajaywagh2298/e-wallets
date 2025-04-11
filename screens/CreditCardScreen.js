import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
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

  // Format Card Number into groups (e.g., 4985 9454 4594 4594)
  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 16);
    const formatted = cleaned.replace(/(.{4})/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  // Validate Expiry Date (Auto-Add / and Ensure MM/YY format)
  const handleExpiryDateChange = (text) => {
    let cleaned = text.replace(/\D/g, '').slice(0, 4); // Only numbers, max 4 digits

    if (cleaned.length >= 2) {
      cleaned = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    }

    setValidDate(cleaned);
  };

  const validateExpiryDate = (date) => {
    const regex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/; // MM/YY format
    if (!regex.test(date)) {
      return false;
    }

    const [month, year] = date.split("/").map(Number);
    const currentYear = new Date().getFullYear() % 100; // Get last two digits of year
    const currentMonth = new Date().getMonth() + 1;

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return false; // Expired card
    }

    return true;
  };

  const handleSubmit = async () => {
    // Validation
    if (!bankName || !cardNumber || !cvv || !validDate || !cardholderName || !pin || !ifscCode || !branch || !city) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    if (cardNumber.replace(/\s/g, '').length !== 16) {
      Alert.alert("Invalid Card Number", "Card number must be exactly 16 digits.");
      return;
    }

    if (cvv.length !== 3) {
      Alert.alert("Invalid CVV", "CVV must be exactly 3 digits.");
      return;
    }

    if (pin.length !== 4) {
      Alert.alert("Invalid PIN", "PIN must be exactly 4 digits.");
      return;
    }

    if (!validateExpiryDate(validDate)) {
      Alert.alert("Invalid Expiry Date", "Enter a valid expiry date (MM/YY) that is not expired.");
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
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <Text style={styles.headerText}>{cardType} Form</Text>

          {/* IFSC Code */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>IFSC Code</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter IFSC Code"
              value={ifscCode}
              onChangeText={setIfscCode}
            />
            <TouchableOpacity style={styles.fetchButton} onPress={fetchBankDetails}>
              <Text style={styles.fetchButtonText}>Fetch Bank</Text>
            </TouchableOpacity>
          </View>

          {/* Auto-filled fields */}
          <View style={styles.inputContainer}><Text style={styles.label}>Bank Name</Text><TextInput style={styles.input} value={bankName} editable={false} /></View>
          <View style={styles.inputContainer}><Text style={styles.label}>Branch</Text><TextInput style={styles.input} value={branch} editable={false} /></View>
          <View style={styles.inputContainer}><Text style={styles.label}>City</Text><TextInput style={styles.input} value={city} editable={false} /></View>

          {/* Card Details */}
          <View style={styles.inputContainer}><Text style={styles.label}>Card Number</Text><TextInput style={styles.input} value={cardNumber} onChangeText={formatCardNumber} keyboardType="numeric" maxLength={19} /></View>
          <View style={styles.inputContainer}><Text style={styles.label}>CVV</Text><TextInput style={styles.input} value={cvv} onChangeText={setCvv} keyboardType="numeric" maxLength={3} /></View>
          <View style={styles.inputContainer}><Text style={styles.label}>Expiry Date (MM/YY)</Text><TextInput style={styles.input} value={validDate} onChangeText={handleExpiryDateChange} keyboardType="numeric" maxLength={5} /></View>
          <View style={styles.inputContainer}><Text style={styles.label}>Cardholder Name</Text><TextInput style={styles.input} value={cardholderName} onChangeText={setCardholderName} /></View>
          <View style={styles.inputContainer}><Text style={styles.label}>PIN</Text><TextInput style={styles.input} value={pin} onChangeText={setPin} keyboardType="numeric" maxLength={4} /></View>

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
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
  innerContainer: { width: '100%', backgroundColor: '#fff', borderRadius: 15, padding: 20, elevation: 5 },
});

export default CreditCardScreen;
