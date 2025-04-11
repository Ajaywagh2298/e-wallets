import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as LocalAuthentication from 'expo-local-authentication';
import { MaterialIcons } from '@expo/vector-icons'; 
import Logo from '../components/Logo';
import { getAllUserData } from '../store/database';
import AlertBox from '../components/AlertBox';

// Get device dimensions
const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [pin, setPin] = useState(['', '', '', '']);
  const [pinModalVisible, setPinModalVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    const setupDatabase = async () => {
      try {
        const data = await getAllUserData();
        if (data && data.length > 0) {
          const userData = data[0];
          setUser({
            name: userData.name,
            pin: userData.pin,
            bioMetric: Number(userData.bioMetric),
          });
        } else {
          navigation.replace('SignUp'); 
        }
      } catch (error) {
        showAlert('Error', 'Failed to load user data.');
      }
    };

    setupDatabase();
  }, []);

  const showAlert = (title, message) => {
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const handleBiometricAuth = async () => {
    try {
      const { success } = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to login',
      });

      if (success) {
        navigation.navigate('Dashboard');
      } else {
        showAlert('Authentication Failed', 'Please try again.');
      }
    } catch (error) {
      showAlert('Error', 'Biometric authentication failed.');
    }
  };

  const handlePinChange = (text, index) => {
    if (text.length > 1) return;

    const newPin = [...pin];
    newPin[index] = text;
    setPin(newPin);

    if (text && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    if (index === 3 && newPin.join('') === user?.pin) {
      setPinModalVisible(false);
      navigation.navigate('Dashboard');
      setPin(['', '', '', '']);
    } else if (index === 3 && newPin.join('') !== user?.pin) {
      showAlert('Warning', 'Incorrect PIN');
      setPin(['', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#4A67F0', '#4A67F0']} style={styles.gradientContainer}>
        <View style={styles.logoContainer}>
          <Logo />
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {user && <Text style={styles.userName}>Welcome, {user.name}</Text>}

        <View style={styles.authContainer}>
          {user?.bioMetric === 1 && (
            <TouchableOpacity style={styles.authButton} onPress={handleBiometricAuth}>
              <MaterialIcons name="fingerprint" size={width * 0.15} color="#0078D4" />
              <Text style={styles.authText}>Fingerprint</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.authButton} onPress={() => setPinModalVisible(true)}>
            <MaterialIcons name="lock" size={width * 0.15} color="#0078D4" />
            <Text style={styles.authText}>Enter PIN</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal animationType="slide" transparent={true} visible={pinModalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.label}>Enter PIN</Text>
            <View style={styles.pinContainer}>
              {[0, 1, 2, 3].map((index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  style={styles.pinInput}
                  maxLength={1}
                  keyboardType="numeric"
                  secureTextEntry
                  value={pin[index]}
                  onChangeText={(text) => handlePinChange(text, index)}
                />
              ))}
            </View>

            <TouchableOpacity style={styles.cancelButton} onPress={() => setPinModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <AlertBox visible={alertVisible} message={alertMessage} onClose={() => setAlertVisible(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  gradientContainer: {
    height: height * 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  logoContainer: {
    width: width * 0.6,
    height: width * 0.6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: { flex: 1, padding: 20, alignItems: 'center' },
  userName: { fontSize: width * 0.06, fontWeight: 'bold', color: '#333', marginBottom: 30 },
  authContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '80%' },
  authButton: { alignItems: 'center', padding: 10 },
  authText: { fontSize: width * 0.04, color: '#2c3e50', marginTop: 8, fontWeight: 'bold' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContent: { width: '80%', backgroundColor: '#fff', borderRadius: 10, padding: 20, alignItems: 'center' },
  label: { fontSize: width * 0.05, fontWeight: 'bold', color: '#333', marginBottom: 20 },
  pinContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  pinInput: { 
    width: width * 0.12, 
    height: width * 0.12, 
    fontSize: width * 0.06, 
    textAlign: 'center', 
    borderWidth: 1, 
    borderColor: '#2e4053', 
    borderRadius: 15,
    marginHorizontal: 5
  },
  cancelButton: { padding: 10 },
  cancelButtonText: { fontSize: width * 0.04, color: '#2c3e50', fontWeight: 'bold' },
});

export default LoginScreen;
