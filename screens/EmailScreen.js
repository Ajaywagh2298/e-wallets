import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  ScrollView, Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { insertQuery } from '../src/controller';
import { encrypt } from '../src/utils';
import { MaterialIcons } from '@expo/vector-icons';

const EmailScreen = ({ navigation }) => {
  const [companyType, setCompanyType] = useState('Google');
  const [customCompany, setCustomCompany] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [emailId, setEmailId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    if (!accountHolderName || !emailId || !password) {
      Alert.alert('Error', 'All fields are required');
      return;
    }
    if (!isValidEmail(emailId)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    const companyName = companyType === 'Other' ? customCompany : companyType;

    try {
      let data = {
        companyType: companyName || '',
        accountHolderName: accountHolderName ? await encrypt(accountHolderName) : '',
        email: emailId ? await encrypt(emailId) : '',
        password: password ? await encrypt(password) : ''
      };
      await insertQuery('email_details', data);
      Alert.alert('Success', 'Form submitted and saved successfully!');
      navigation.navigate('Dashboard');

      // Reset fields
      setAccountHolderName('');
      setEmailId('');
      setPassword('');
      setCustomCompany('');
      setShowPassword(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to save data');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.card}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Company Type</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={companyType}
              onValueChange={(itemValue) => setCompanyType(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Google" value="Google" />
              <Picker.Item label="Yahoo" value="Yahoo" />
              <Picker.Item label="Hotmail" value="Hotmail" />
              <Picker.Item label="Outlook" value="Outlook" />
              <Picker.Item label="Rediff Mail" value="Rediff Mail" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>
        </View>

        {companyType === 'Other' && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Custom Company Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Company Name"
              value={customCompany}
              onChangeText={setCustomCompany}
            />
          </View>
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Account Holder Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Full Name"
            value={accountHolderName}
            onChangeText={setAccountHolderName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email ID</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Email"
            value={emailId}
            onChangeText={setEmailId}
            keyboardType="email-address"
          />
          {!isValidEmail(emailId) && emailId !== '' && (
            <Text style={styles.errorText}>Invalid email format</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordWrapper}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <MaterialIcons
                name={showPassword ? 'visibility' : 'visibility-off'}
                size={22}
                color="gray"
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 25,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 6,
    color: '#34495e',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    overflow: 'hidden',
    height: 48,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  picker: {
    height: 48,
    width: '100%',
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 48,
    backgroundColor: '#fff',
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 13,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#2c3e50',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  submitText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});

export default EmailScreen;
