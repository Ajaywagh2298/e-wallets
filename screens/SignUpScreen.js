import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert,  Animated  } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons'; // For fingerprint icon
import Logo from '../components/Logo';
import { insertUserData } from '../store/database';
import AlertBox from '../components/AlertBox';

const SignUpScreen = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [pin, setPin] = useState(['', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '', '']);
  const [bioMetric, setBioMetric] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const pinRefs = useRef([]);
  const confirmPinRefs = useRef([]);
  const switchAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    checkBiometricSupport();
  }, []);

  const showAlert = (type, message) => {
    setAlertType(type);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const checkBiometricSupport = async () => {
    const isBiometricAvailable = await LocalAuthentication.hasHardwareAsync();
    const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (!isBiometricAvailable || supportedTypes.length === 0 || !isEnrolled) {
      showAlert('error', 'Your device does not support biometric authentication or it is not set up.');
      setBioMetric(false);
    }
  };

  const handlePinChange = (index, value, isConfirm = false) => {
    if (!/^\d*$/.test(value)) return;

    const updatedPin = isConfirm ? [...confirmPin] : [...pin];
    updatedPin[index] = value;
    if (isConfirm) {
      setConfirmPin(updatedPin);
    } else {
      setPin(updatedPin);
    }

    if (value !== '' && index < 3) {
      (isConfirm ? confirmPinRefs.current : pinRefs.current)[index + 1]?.focus();
    }
  };

  const handleNextStep = () => {
    if (step === 2 && pin.join('').length < 4) {
      // Alert.alert('Error', 'Please enter a 4-digit PIN');
      showAlert('error', 'Error', 'Please enter a 4-digit PIN');
      return;
    }
    if (step === 3 && confirmPin.join('') !== pin.join('')) {
      // Alert.alert('Error', 'Pins do not match');
      showAlert('error', 'Pins do not match');
      return;
    }
    setStep(step + 1);
  };

  const handleSignUp = async () => {

    if (bioMetric) {
      const isBiometricAvailable = await LocalAuthentication.hasHardwareAsync();
      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!isBiometricAvailable || supportedTypes.length === 0) {
        showAlert('error', 'Your device does not support biometric authentication.');
        setBioMetric(false);
        return;
      }

      if (!isEnrolled) {
        showAlert('warning', 'You need to set up fingerprint/Face ID in your device settings.');
        setBioMetric(false);
        return;
      }
    }

    if (!name) {
      showAlert('error', 'Please enter your name.');
      return;
    }

    try {
      let pinString = pin.join('');
      console.log(`Creating user: ${name}, ${pinString}, ${bioMetric}`);
      await insertUserData(name, pinString, bioMetric);
      showAlert('success', 'User Sign Up Successfully!');
      setName('');
      setPin(['', '', '', '']);
      setConfirmPin(['', '', '', '']);
      setBioMetric(false);
      setTimeout(() => navigation.navigate('Login'), 1000);
    } catch (err) {
      console.log(`Error in user creation: ${err}`);
      showAlert('error', 'Something went wrong. Please try again.');
    }
  };

  const toggleSwitch = async () => {
    const isBiometricAvailable = await LocalAuthentication.hasHardwareAsync();
    const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (!isBiometricAvailable || supportedTypes.length === 0) {
      showAlert('error', 'Your device does not support biometric authentication.');
      return;
    }

    if (!isEnrolled) {
      showAlert('warning', 'You need to set up fingerprint/Face ID in your device settings.');
      return;
    }

    const toValue = bioMetric ? 0 : 1;
    Animated.timing(switchAnim, {
      toValue,
      duration: 200,
      useNativeDriver: false,
    }).start();
    setBioMetric(!bioMetric);
  };

  return (
    <View style={styles.container}>
      {/* Blue Gradient Top Section */}
      <LinearGradient colors={['#4A67F0', '#4A67F0']} style={styles.gradientContainer}>
        
        {/* Title at the Top */}
        <Text style={styles.title}>Sign Up</Text>

        {/* Centered Logo */}
        <View style={styles.logoContainer}>
          <Logo style={styles.logo} />
        </View>

        {/* Progress Bar at the Bottom */}
        <View style={styles.progressBarContainer}>
          {[1, 2, 3, 4].map((s, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                step > s ? styles.successDot : step === s ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>

      </LinearGradient>

      {/* White Card Bottom Section */}
      <View style={styles.content}>
        {step === 1 && (
          <>
            <Text style={styles.label}>Enter Your Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
            />
            <TouchableOpacity style={styles.nextButton} onPress={handleNextStep}>
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </>
        )}

        {step === 2 && (
          <>
            <Text style={styles.label}>Set a 4-digit PIN</Text>
            <View style={styles.pinContainer}>
              {pin.map((digit, index) => (
                <TextInput
                  key={index}
                  style={styles.pinInput}
                  maxLength={1}
                  keyboardType="numeric"
                  ref={(ref) => (pinRefs.current[index] = ref)}
                  value={digit}
                  onChangeText={(value) => handlePinChange(index, value)}
                />
              ))}
            </View>
            <TouchableOpacity style={styles.nextButton} onPress={handleNextStep}>
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </>
        )}

        {step === 3 && (
          <>
            <Text style={styles.label}>Confirm Your PIN</Text>
            <View style={styles.pinContainer}>
              {confirmPin.map((digit, index) => (
                <TextInput
                  key={index}
                  style={styles.pinInput}
                  maxLength={1}
                  keyboardType="numeric"
                  ref={(ref) => (confirmPinRefs.current[index] = ref)}
                  value={digit}
                  onChangeText={(value) => handlePinChange(index, value, true)}
                />
              ))}
            </View>
            <TouchableOpacity style={styles.nextButton} onPress={handleNextStep}>
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </>
        )}

        {step === 4 && (
          <>
            <Text style={styles.label}>Enable Biometric Authentication?</Text>
            <TouchableOpacity style={styles.toggleButton} onPress={toggleSwitch}>
              <MaterialIcons
                name="fingerprint"
                size={60}
                color={bioMetric ? '#0078D4' : '#000'}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.nextButton} onPress={handleSignUp}>
              <Text style={styles.nextButtonText}>Sign Up</Text>
            </TouchableOpacity>
            <AlertBox show={alertVisible} type={alertType} message={alertMessage} onClose={() => setAlertVisible(false)} />
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  gradientContainer: {
    height: '60%',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingTop: 50,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    justifyContent: 'center',
    alignItems : 'center',
  },
  progressBarContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  progressDot: {
    width: 40,
    height: 5,
    borderRadius: 7.5,
    marginHorizontal: 5,
  },
  successDot: { backgroundColor: '#00FF00' },
  activeDot: { backgroundColor: '#fff' },
  inactiveDot: { backgroundColor: '#bbb' },
  content: { flex: 1, padding: 20, alignItems: 'center' },
  label: { fontSize: 18, fontWeight: 'bold', color: '#333' , marginBottom: '10%', marginTop: '5%'},
  input: {
    width: '100%',
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
  },
  pinContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '80%', marginBottom: 20 },
  pinInput: {
    width: 60,
    height: 60,
    fontSize: 20,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
  },
  nextButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#0078D4',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '10%',
  },
  nextButtonText: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
});

export default SignUpScreen;
