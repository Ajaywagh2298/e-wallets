import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { selectQuery , insertQuery } from '../src/controller';
import { encrypt } from '../src/utils';

const NetBankingScreen = ({ navigation }) => {
  const [bankName, setBankName] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [transactionPin, setTransactionPin] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [upiId, setUpiId] = useState('');
  const [notes, setNotes] = useState('');
  const [accountType, setAccountType] = useState('Bank');

  const [bankSuggestions, setBankSuggestions] = useState([]);
  const [showBankSuggestions, setShowBankSuggestions] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (bankName.length > 1) {
        const suggestions = await selectQuery('banks', {
          bank_name: {
            value: bankName,
            filter: 'like',
            dataType: 'text',
          },
        });

        const uniqueSuggestions = Array.from(
          new Map(suggestions.map(item => [item.bank_name, item])).values()
        );
        setBankSuggestions(uniqueSuggestions);
        setShowBankSuggestions(uniqueSuggestions.length > 0);
      } else {
        setBankSuggestions([]);
        setShowBankSuggestions(false);
      }
    };

    fetchSuggestions();
  }, [bankName]);

  const selectBank = (bank) => {
    setBankName(bank);
    setShowBankSuggestions(false);
  };

  const handleSubmit = async () => {
    if (!bankName || !userName || !password || !transactionPin) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    try {
      let insertData = {
        bankName : bankName,
        userName : userName ? encrypt(userName) : '',
        password : password ? encrypt(password) : '',
        transactionPin : transactionPin ? encrypt(transactionPin) : '',
        customerId : customerId ? encrypt(customerId) : '',
        securityQuestion : securityQuestion ? encrypt(securityQuestion) : '',
        mobileNumber : mobileNumber ? encrypt(mobileNumber) : '',
        upiId : upiId ? encrypt(upiId) : '',
        notes : notes ? encrypt(notes) : '',
        accountType : accountType,
      }
      await insertQuery(
        'net_banking',
        insertData
      );
      Alert.alert('Success', 'Net Banking details saved!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save details');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {/* Bank Name with Suggestions */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Bank Name*</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. ICICI Bank"
            value={bankName}
            onChangeText={setBankName}
            onFocus={() => bankName.length > 1 && setShowBankSuggestions(true)}
          />
          <Modal
            visible={showBankSuggestions}
            transparent
            animationType="fade"
            onRequestClose={() => setShowBankSuggestions(false)}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPressOut={() => setShowBankSuggestions(false)}
              style={{ flex: 1 }}
            >
              <View style={styles.suggestionModal}>
                <FlatList
                  data={bankSuggestions}
                  keyExtractor={(item, index) => item.id?.toString() ?? index.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.suggestionItem}
                      onPress={() => selectBank(item.bank_name)}
                    >
                      <Text style={styles.suggestionText}>{item.bank_name}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </TouchableOpacity>
          </Modal>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Account Type</Text>
          <Picker selectedValue={accountType} onValueChange={setAccountType} style={styles.picker}>
            <Picker.Item label="Bank" value="Bank" />
            <Picker.Item label="Credit Card" value="Credit Card" />
          </Picker>
        </View>

        {/* Username */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>User Name*</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter username"
            value={userName}
            onChangeText={setUserName}
          />
        </View>

        {/* Password */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password*</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {/* Transaction PIN */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Transaction PIN*</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter transaction PIN"
            value={transactionPin}
            onChangeText={setTransactionPin}
            keyboardType="numeric"
            secureTextEntry
          />
        </View>

        {/* Customer ID */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Customer ID</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter customer ID"
            value={customerId}
            onChangeText={setCustomerId}
          />
        </View>

        {/* Security Question */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Security Question</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Mother's maiden name"
            value={securityQuestion}
            onChangeText={setSecurityQuestion}
          />
        </View>

        {/* Mobile Number */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mobile Number</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 9876543210"
            value={mobileNumber}
            onChangeText={setMobileNumber}
            keyboardType="phone-pad"
          />
        </View>

        {/* UPI ID */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>UPI ID</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. user@bank"
            value={upiId}
            onChangeText={setUpiId}
          />
        </View>

        {/* Notes */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
            placeholder="Any additional notes"
            value={notes}
            onChangeText={setNotes}
            multiline
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Save Details</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff', padding: 20 },
  scrollContainer: { paddingBottom: 30, backgroundColor: '#ffffff' },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 25,
    textAlign: 'center',
  },
  inputGroup: { marginBottom: 20, backgroundColor: '#ffffff' , marginTop : 20},
  label: { fontSize: 14, fontWeight: '600', color: '#34495e', marginBottom: 8 , backgroundColor: '#ffffff'},
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: '#333',
    elevation: 1,
  },
  suggestionModal: {
    marginTop: 100,
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    maxHeight: '60%',
    elevation: 5,
  },
  suggestionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  suggestionText: {
    fontSize: 16,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#2c3e50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    elevation: 2,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default NetBankingScreen;
