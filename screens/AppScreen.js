import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
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
      const insertData = {
        appName: appName || '',
        username: username ? await encrypt(username) : '',
        password: password ? await encrypt(password) : '',
        loginMethod,
        faEnabled: faEnabled ? 1 : 0,
        securityQuestion: securityQuestion ? await encrypt(securityQuestion) : '',
        phone: phone ? await encrypt(phone) : '',
        notes: notes ? await encrypt(notes) : '',
      };

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
       // console.error('Insert Error:', error);
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
          <Text style={styles.label}>Two-Factor Authentication</Text>
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

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const InputField = ({
  label,
  value,
  onChangeText,
  secureTextEntry,
  multiline,
  numberOfLines,
  keyboardType,
  isTextArea,
}) => (
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
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#34495e',
    marginBottom: 6,
  },
  input: {
    height: 50, // ✅ Height for all inputs
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 16,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  inputArea: {
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 16,
    paddingTop: 12,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#2c3e50',
    borderRadius: 12,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    elevation: 3,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default AppScreen;
