import React, { useState, useRef , useEffect} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput, Animated, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Logo from '../components/Logo';
import { createUserTable, insertUserData, getAllUserData } from '../store/database';

const SignUpScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [bioMetric, setBioMetric] = useState(false);
  const switchAnim = useRef(new Animated.Value(0)).current; // For animation

  const handleSignUp = async () => {
    if (pin === confirmPin) {

      try {
        await insertUserData(name, pin, bioMetric)
          .then(() => console.log('User Data inserted successfully'))
          .catch(err => console.error('Insert User error', err));;
        Alert.alert('Success', 'User Sign Up Successfully!');

        setName('')
        setPin('')
        setBioMetric('')
        navigation.navigate('Login')
      } catch (err) {
        console.log(`Error File User create ${err}`)
      }
      navigation.navigate('Login');
    } else {
      Alert.alert('Error', 'Pins do not match');
    }
  };

  const toggleSwitch = () => {
    const toValue = bioMetric ? 0 : 1;
    Animated.timing(switchAnim, {
      toValue,
      duration: 200,
      useNativeDriver: false,
    }).start();
    setBioMetric(!bioMetric);
  };

  const switchTranslateX = switchAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 24], // Adjust based on the size of the switch
  });

  return (
    <LinearGradient colors={['#fbfcfc', '#fbfcfc']} style={styles.container}>
      <Logo />
      <View style={styles.content}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.inputPassword}
          placeholder="PIN"
          placeholderTextColor="#999"
          secureTextEntry
          value={pin}
          onChangeText={setPin}
          keyboardType="numeric"
          maxLength={4}
        />
        <TextInput
          style={styles.inputPassword}
          placeholder="Confirm PIN"
          placeholderTextColor="#999"
          secureTextEntry
          value={confirmPin}
          onChangeText={setConfirmPin}
          keyboardType="numeric"
          maxLength={4}
        />
        <View style={styles.bioMetricContainer}>
          <Text style={styles.bioMetricText}>Enable Biometric</Text>
          <TouchableOpacity style={styles.switchContainer} onPress={toggleSwitch} activeOpacity={0.8}>
            <Animated.View
              style={[
                styles.switchBackground,
                { backgroundColor: bioMetric ? '#82e0aa' : '#2c3e50' },
              ]}
            />
            <Animated.View
              style={[
                styles.switchThumb,
                { transform: [{ translateX: switchTranslateX }] },
                { backgroundColor: bioMetric ? '#2c3e50' : '#f4f3f4' },
              ]}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => {
          navigation.navigate('Login');
        }}
      >
        <View style={styles.signButton}>
          <Image
            source={require('../assets/leftA.png')}
            style={styles.fingerprintIcon}
          />
          <Text style={styles.signButtonText}>Sign Up</Text>
        </View>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  inputPassword : {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 20,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  bioMetricContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  bioMetricText: {
    fontSize: 16,
    color: '#333',
  },
  switchContainer: {
    width: 50,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    position: 'relative',
  },
  switchBackground: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
    position: 'absolute',
  },
  switchThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#f4f3f4',
    position: 'absolute',
    top: 2,
    left: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  signUpButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#2c3e50',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  signButton: {
    flexDirection: 'row', // Align children horizontally
    alignItems: 'center', // Center children vertically
    justifyContent: 'center', // Center children horizontally (optional)
  },
  signButtonText: {
    marginRight: 8, // Add some spacing between the text and the image
    fontSize: 16, // Adjust font size as needed
    color: '#000', // Adjust text color as needed
  },
  fingerprintIcon: {
    width: 24, // Adjust width as needed
    height: 24, // Adjust height as needed
    marginRight: 10
  },
});

export default SignUpScreen;