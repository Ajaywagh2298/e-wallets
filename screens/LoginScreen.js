import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  Alert,
  Modal
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as LocalAuthentication from 'expo-local-authentication';
import Logo from '../components/Logo';
import { getAllUserData } from '../store/database';

const LoginScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [pin, setPin] = useState(['', '', '', '']);
  const [pinModalVisible, setPinModalVisible] = useState(false);
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
          console.info(`✅ User Set:`, userData);
        } else {
          navigation.replace('SignUp'); // Redirect if no user exists
        }
      } catch (error) {
        console.error('❌ Database initialization failed:', error);
      }
    };

    setupDatabase();
  }, []);

  const handleBiometricAuth = async () => {
    try {
      const { success } = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to login',
      });

      if (success) {
        navigation.navigate('Dashboard');
      } else {
        Alert.alert('Authentication Failed', 'Please try again.');
      }
    } catch (error) {
      console.error('❌ Biometric authentication error:', error);
    }
  };

  const handlePinChange = (text, index) => {
    if (text.length > 1) return; // Prevent multiple characters in one box

    const newPin = [...pin];
    newPin[index] = text;
    setPin(newPin);

    // Move focus to next input
    if (text && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check PIN if last digit is entered
    if (index === 3 && newPin.join('') === user?.pin) {
      setPinModalVisible(false);
      navigation.navigate('Dashboard');
      setPin(['', '', '', '']); // Reset PIN input
    } else if (index === 3 && newPin.join('') !== user?.pin) {
      Alert.alert('Warning', 'Incorrect PIN');
      setPin(['', '', '', '']); // Reset PIN input
      inputRefs.current[0]?.focus(); // Move cursor back to first box
    }
  };

  return (
    <LinearGradient colors={['#fbfcfc', '#fbfcfc']} style={styles.container}>
      {/* App Logo */}
      <Logo />

      {/* Show User Name */}
      {user && <Text style={styles.userName}>Welcome, {user.name}</Text>}

      {/* Biometric and PIN Login */}
      {user?.bioMetric === 1 ? (
        <View style={styles.authContainer}>
          <TouchableOpacity style={styles.authButton} onPress={handleBiometricAuth}>
            <Image source={require('../assets/fingerprint.png')} style={styles.authIcon} />
            <Text style={styles.authText}>Fingerprint</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.authButton} onPress={() => setPinModalVisible(true)}>
            <Image source={require('../assets/pin.png')} style={styles.authIcon} />
            <Text style={styles.authText}>PIN</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.authContainer}>
          <TouchableOpacity style={styles.authButton} onPress={() => setPinModalVisible(true)}>
            <Image source={require('../assets/pin.png')} style={styles.authIcon} />
            <Text style={styles.authText}>PIN</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* PIN Entry Modal */}
      <Modal animationType="slide" transparent={true} visible={pinModalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Enter PIN</Text>
            <View style={styles.pinContainer}>
              {[0, 1, 2, 3].map((index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  style={styles.pinBox}
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

      {/* Sign Up Button (if no user is found) */}
      {!user && (
        <TouchableOpacity
          style={styles.signUpButton}
          onPress={() => navigation.replace('SignUp')}
        >
          <Text style={styles.signUpText}>Sign Up</Text>
        </TouchableOpacity>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 20,
    textAlign: 'center',
    marginBottom: 50,
  },
  authContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '80%',
    marginTop: 30,
  },
  authButton: {
    alignItems: 'center',
  },
  authIcon: {
    width: 80,
    height: 80,
  },
  authText: {
    fontSize: 16,
    color: '#2c3e50',
    marginTop: 8,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
  },
  pinContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '60%',
  },
  pinBox: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: '#2c3e50',
    borderRadius: 15,
    textAlign: 'center',
    fontSize: 20,
    marginHorizontal: 5,
  },
  cancelButton: {
    padding: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: 'bold',
  },
  signUpButton: {
    position: 'absolute',
    bottom: 50,
  },
  signUpText: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
