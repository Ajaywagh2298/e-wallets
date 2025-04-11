// EmailScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import { Appbar } from 'react-native-paper';
import { insertDematData } from '../store/database';

const DeamtScreen  = ({ navigation }) => {
    const [dematId, setDematId] = useState('');
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
  
    const handleSubmit = async () => {
      if (!dematId || !username || !password) {
        Alert.alert('Error', 'All fields are required');
        return;
      }
  
      try {
        await insertDematData( dematId, username, password)
          .then(() => console.log('Data inserted successfully'))
          .catch(err => console.error('Insert error', err));;
        Alert.alert('Success', 'Form submitted and saved successfully!');
        navigation.navigate('Dashboard')
  
        setDematId('');
        setUserName('');
        setPassword('');
      } catch (error) {
        // console.error('Error inserting data:', error);
        Alert.alert('Error', 'Failed to save data');
      }
    };
    return (
      <>
        <View style={styles.container}>
          <View style={styles.innerContainer}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <Text style={styles.headerText}>Demat Account Form</Text>
              {/* Account Holder Name */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Account ID</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Account ID"
                  value={dematId}
                  onChangeText={setDematId}
                />
              </View>
  
              {/* Email ID */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>User Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="User Name"
                  value={username}
                  onChangeText={setUserName}
                  keyboardType="email-address"
                />
              </View>
  
              {/* Password */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Password"
                  value={password}
                  onChangeText={setPassword}
                />
              </View>
  
              {/* Submit Button */}
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </ScrollView>
  
          </View>
          <View >
          </View>
        </View>
      </>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
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
  pickerContainer: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    justifyContent: 'center',
  },
  picker: {
    width: '100%',
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
    shadowColor: '#000'
  }
});

export default DeamtScreen;
