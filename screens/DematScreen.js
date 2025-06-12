import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';
import { insertQuery } from '../src/controller';
import { encrypt } from '../src/utils';

const DematScreen = ({ navigation }) => {
  const [brokerName, setBrokerName] = useState('');
  const [dematAccountNumber, setDematAccountNumber] = useState('');
  const [despositoryName, setDespositoryName] = useState('');
  const [tradingAccountNumber, setTradingAccountNumber] = useState('');
  const [clientId, setClientId] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [accountOpeningDate, setAccountOpeningDate] = useState('');
  const [linkedBankAccount, setLinkedBankAccount] = useState('');
  const [nomineeName, setNomineeName] = useState('');
  const [tradingPin, setTradingPin] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async () => {
    if (!brokerName || !dematAccountNumber || !tradingAccountNumber || !tradingPin) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }

    try {
      let encryptData = {
        brokerName,
        dematAccountNumber: dematAccountNumber ? encrypt(dematAccountNumber) : '',
        despositoryName: despositoryName ? encrypt(despositoryName) : '',
        tradingAccountNumber: tradingAccountNumber ? encrypt(tradingAccountNumber) : '',
        clientId: clientId ? encrypt(clientId) : '',
        email: email ? encrypt(email) : '',
        mobileNumber: mobileNumber ? encrypt(mobileNumber) : '',
        accountOpeningDate: accountOpeningDate ? encrypt(accountOpeningDate) : '',
        linkedBankAccount: linkedBankAccount ? encrypt(linkedBankAccount) : '',
        nomineeName: nomineeName ? encrypt(nomineeName) : '',
        tradingPin: tradingPin ? encrypt(tradingPin) : '',
        notes: notes ? encrypt(notes) : '',
      }

      await insertQuery(
        'demat',
        encryptData
      );

      Alert.alert('Success', 'Demat details saved successfully!');
      navigation.navigate('Dashboard');
    } catch (error) {
      Alert.alert('Error', 'Failed to save data');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {[
          { label: 'Broker Name*', value: brokerName, setValue: setBrokerName, placeholder: 'e.g. Zerodha' },
          { label: 'Demat Account Number*', value: dematAccountNumber, setValue: setDematAccountNumber, placeholder: '1234567890' },
          { label: 'Depository Name', value: despositoryName, setValue: setDespositoryName, placeholder: 'e.g. CDSL or NSDL' },
          { label: 'Trading Account Number*', value: tradingAccountNumber, setValue: setTradingAccountNumber, placeholder: 'e.g. TRD00123' },
          { label: 'Client ID', value: clientId, setValue: setClientId, placeholder: 'e.g. CLT123456' },
          { label: 'Email', value: email, setValue: setEmail, placeholder: 'example@email.com', keyboardType: 'email-address' },
          { label: 'Mobile Number', value: mobileNumber, setValue: setMobileNumber, placeholder: '9876543210', keyboardType: 'phone-pad' },
          { label: 'Account Opening Date', value: accountOpeningDate, setValue: setAccountOpeningDate, placeholder: 'YYYY-MM-DD' },
          { label: 'Linked Bank Account', value: linkedBankAccount, setValue: setLinkedBankAccount, placeholder: 'e.g. HDFC XXXX1234' },
          { label: 'Nominee Name', value: nomineeName, setValue: setNomineeName, placeholder: 'Full Name' },
          { label: 'Trading PIN*', value: tradingPin, setValue: setTradingPin, placeholder: '6-digit PIN', secureTextEntry: true, keyboardType: 'numeric' }
        ].map((field, index) => (
          <View style={styles.inputContainer} key={index}>
            <Text style={styles.label}>{field.label}</Text>
            <TextInput
              style={styles.input}
              placeholder={field.placeholder}
              value={field.value}
              onChangeText={field.setValue}
              secureTextEntry={field.secureTextEntry || false}
              keyboardType={field.keyboardType || 'default'}
            />
          </View>
        ))}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.notesInput]}
            placeholder="Any additional notes..."
            value={notes}
            onChangeText={setNotes}
            multiline
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Save Details</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default DematScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20
  },
  scrollContainer: {
    paddingBottom: 30
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 25,
    textAlign: 'center'
  },
  inputContainer: {
    marginBottom: 20
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 8
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: '#333',
    elevation: 1
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top'
  },
  submitButton: {
    backgroundColor: '#2c3e50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    elevation: 2
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  }
});
