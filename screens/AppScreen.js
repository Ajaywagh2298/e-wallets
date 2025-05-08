import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, Switch } from 'react-native';
import { insertQuery } from '../src/controller';
import { encrypt } from '../src/utils';

const AppScreen = ({ navigation }) => {
  const [appName, setAppName] = useState('');
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [loginMethod, setLoginMethod] = useState('');
  const [faEnabled, setFaEnabled] = useState(false);
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async () => {
    if (!appName || !username || !password) {
      Alert.alert('Validation Error', 'Application Name, Username, and Password are required.');
      return;
    }

    try {
      let insertData = {
        appName: appName || '',
        username: username ? await encrypt(username) : '',
        password: password ? await encrypt(password) : '',
        loginMethod,
        faEnabled: faEnabled ? 1 : 0,
        securityQuestion: securityQuestion ? await encrypt(securityQuestion) : '',
        phone: phone ? await encrypt(phone) : '',
        notes: notes ? await encrypt(notes) : ''
      }
      await insertQuery('app_accounts', insertData);
      Alert.alert('Success', 'Data saved successfully!');
      navigation.navigate('Dashboard');

      // Reset fields
      setAppName('');
      setUserName('');
      setPassword('');
      setLoginMethod('');
      setFaEnabled(false);
      setSecurityQuestion('');
      setPhone('');
      setNotes('');
    } catch (error) {
      console.error('Insert Error:', error);
      Alert.alert('Error', 'Failed to save data.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <InputField label="Application Name" value={appName} onChangeText={setAppName} />
        <InputField label="Username" value={username} onChangeText={setUserName} />
        <InputField label="Password" value={password} onChangeText={setPassword} secureTextEntry />
        <InputField label="Login Method (e.g., Email, Google, OTP)" value={loginMethod} onChangeText={setLoginMethod} />

        {/* 2FA Toggle */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Two-Factor Authentication Enabled</Text>
          <Switch value={faEnabled} onValueChange={setFaEnabled} />
        </View>

        <InputField label="Security Question / Answer" value={securityQuestion} onChangeText={setSecurityQuestion} />
        <InputField label="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

        <InputField
          label="Additional Notes"
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
          isTextArea
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

// Reusable input field
const InputField = ({ label, value, onChangeText, secureTextEntry, multiline, numberOfLines, keyboardType, isTextArea }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={isTextArea ? styles.inputArea : styles.input}
      placeholder={label}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      multiline={multiline}
      numberOfLines={numberOfLines}
      keyboardType={keyboardType}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdfefe',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  scrollContainer: {
    paddingBottom: 30,
    backgroundColor: '#fdfefe',
  },
  headerText: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 24,
    color: '#2c3e50',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 6,
    color: '#34495e',
  },
  input: {
    backgroundColor: '#fdfefe',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  inputArea: {
    backgroundColor: '#fdfefe',
    padding: 12,
    height: 100,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#2c3e50',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AppScreen;
