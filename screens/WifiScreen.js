import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Appbar } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { insertOtherData } from '../store/database'; // Database function

const WifiScreen = ({ navigation }) => {
  const [ type , setType ] = useState('Wifi')
  const [details, setDetails] = useState({
    userName: '',
    password: '',
    frequency: '2.4 GHz', // Default Frequency
  });

  const handleInputChange = (key, value) => {
    setDetails(prevState => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    const { userName, password, frequency } = details;

    if (!userName || !password) {
      Alert.alert('Error', 'Username and Password are required');
      return;
    }

    try {
      await insertOtherData( type ,details)
        .then(() => console.log('WiFi data saved successfully'))
        .catch(err => console.error('Insert error', err));

      Alert.alert('Success', 'WiFi details saved successfully!');
      navigation.goBack(); // Navigate back after saving

      // Reset fields
      setDetails({
        userName: '',
        password: '',
        frequency: '2.4 GHz',
      });
      setType('Wifi')
    } catch (error) {
      Alert.alert('Error', 'Failed to save WiFi details');
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.headerText}>WiFi Details</Text>

            {/* Username */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>User Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter WiFi Username"
                value={details.userName}
                onChangeText={(text) => handleInputChange('userName', text)}
              />
            </View>

            {/* Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter WiFi Password"
                value={details.password}
                onChangeText={(text) => handleInputChange('password', text)}
                secureTextEntry
              />
            </View>

            {/* Frequency Selection */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Frequency</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={details.frequency}
                  onValueChange={(value) => handleInputChange('frequency', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="2.4 GHz" value="2.4 GHz" />
                  <Picker.Item label="5 GHz" value="5 GHz" />
                </Picker>
              </View>
            </View>

            {/* Save Button */}
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </>
  );
};

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
  saveButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#2c3e50',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  appBar: {
    elevation: 4,
    shadowColor: '#000',
  },
});

export default WifiScreen;
