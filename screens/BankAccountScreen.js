import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { insertQuery } from '../src/controller';
import { encrypt } from '../src/utils';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const BankAccountScreen = ({ navigation }) => {
  const [ifscCode, setIfscCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [accountType, setAccountType] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [branch, setBranch] = useState('');
  const [city, setCity] = useState('');
  const [branchAddress, setBranchAddress] = useState('');
  const [micrCode, setMicrCode] = useState('');
  const [nomineeName, setNomineeName] = useState('');
  const [upiId, setUpiId] = useState('');
  const [notes, setNotes] = useState('');
  const [cifCode, setCifCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  // Fetch Bank Details using IFSC Code
  const fetchBankDetails = async (ifsc) => {
    if (ifsc.length === 11) {
      setLoading(true);
      try {
        const response = await axios.get(`https://ifsc.razorpay.com/${ifsc}`);
        if (response.data) {
          setBankName(response.data.BANK);
          setBranch(response.data.BRANCH);
          setCity(response.data.CITY);
          setBranchAddress(response.data.ADDRESS);
          setMicrCode(response.data.MICR);
        } else {
          Alert.alert("Invalid IFSC", "Please enter a valid IFSC code.");
        }
      } catch (error) {
        Alert.alert("Error", "Could not fetch bank details. Check IFSC code.");
      }
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!accountNumber || !accountHolderName || !ifscCode || !bankName || !branch || !cifCode) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    try {
      let dataObj = {
        accountNumber: accountNumber ? await encrypt(accountNumber) : '',
        accountHolderName: accountHolderName ? await encrypt(accountHolderName) : '',
        accountType: accountType ? accountType : '',
        bankName: bankName,
        branch: branch,
        branchAddress: branchAddress,
        city: city,
        ifscCode: ifscCode ? await encrypt(ifscCode) : '',
        cifCode: cifCode ? await encrypt(cifCode) : '',
        micrCode: micrCode ? await encrypt(micrCode) : '',
        mobileNumber: mobileNumber ? await encrypt(mobileNumber) : '',
        nomineeName: nomineeName ? await encrypt(nomineeName) : '',
        upiId: upiId ? await encrypt(upiId) : '',
        notes: notes ? await encrypt(notes) : '',
      }

      await insertQuery('bank_account', dataObj);
      Alert.alert('Success', 'Bank account details saved!');
      navigation.navigate('Dashboard');

      // Reset form
      setAccountNumber('');
      setAccountHolderName('');
      setIfscCode('');
      setBankName('');
      setBranch('');
      setCity('');
      setCifCode('');
      setMicrCode('');
      setNomineeName('');
      setUpiId('');
      setNotes('');
      setAccountType('');
      setMobileNumber('');
      setBranchAddress('');
      setShowMore(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to save bank details');
    }
  };

  const toggleMoreFields = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowMore(!showMore);
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.innerContainer}>

          <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            {/* IFSC Code Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>IFSC Code</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter IFSC Code"
                value={ifscCode}
                onChangeText={(text) => {
                  setIfscCode(text);
                  fetchBankDetails(text);
                }}
              />
            </View>

            {/* Bank Name (Auto-filled) */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Bank Name</Text>
              <TextInput style={styles.input} value={bankName} editable={false} />
            </View>

            {/* Account Number */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>A/C No</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Account Number"
                value={accountNumber}
                onChangeText={setAccountNumber}
                keyboardType="numeric"
              />
            </View>

            {/* Account Holder Name */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>A/C Holder Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Account Holder Name"
                value={accountHolderName}
                onChangeText={setAccountHolderName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>A/C Type</Text>
              <Picker
                selectedValue={accountType}
                onValueChange={(itemValue) => setAccountType(itemValue)}
                style={[styles.input, { paddingVertical: 10 }]}
              >
                <Picker.Item label="Select Account Type" value="" />
                <Picker.Item label="Savings" value="savings" />
                <Picker.Item label="Current" value="current" />
                <Picker.Item label="Salary" value="salary" />
                <Picker.Item label="Recurring" value="recurring" />
                <Picker.Item label="Fixed" value="fixed" />
                <Picker.Item label="NRE" value="nre" />
                <Picker.Item label="NRO" value="nro" />
                <Picker.Item label="FCNR" value="fcnr" />
                <Picker.Item label="Others" value="others" />
              </Picker>
            </View>

            {/* CIF Code */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>CIF Code</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter CIF Code"
                value={cifCode}
                onChangeText={setCifCode}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Link Mobile Number</Text>
              <TextInput style={styles.input} value={mobileNumber} onChangeText={setMobileNumber} />
            </View>

            {/* City Name (Auto-filled) */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>City</Text>
              <TextInput style={styles.input} value={city} editable={false} />
            </View>

            {/* Toggle Button */}
            <TouchableOpacity activeOpacity={0.9} onPress={toggleMoreFields} style={styles.buttonWrapper}>
              <LinearGradient
                colors={['#2c3e50', '#2c3e50']} // cool blue gradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.showMoreButton}
              >
                <AntDesign name={showMore ? 'up' : 'down'} size={18} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.showMoreButtonText}>
                  {showMore ? 'Hide Extra Fields' : 'Show More Fields'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {showMore && (
              <>
                {/* Branch Name (Auto-filled) */}
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Branch</Text>
                  <TextInput style={styles.input} value={branch} editable={false} />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Branch Address</Text>
                  <TextInput style={styles.input} value={branchAddress} editable={false} />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>MICR Number</Text>
                  <TextInput style={styles.input} value={micrCode} editable={true} onChangeText={setMicrCode} />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Nominee Name</Text>
                  <TextInput style={styles.input} value={nomineeName} editable={true} onChangeText={setNomineeName} />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>UPI ID</Text>
                  <TextInput style={styles.input} value={upiId} editable={true} onChangeText={setUpiId} />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Addition Info.</Text>
                  <TextInput style={styles.input} value={notes} editable={true} onChangeText={setNotes} />
                </View>
              </>
            )}

            {/* Submit Button */}
            {loading ? (
              <ActivityIndicator size="large" color="#000" />
            ) : (
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      </View>
      {/* <BottomTabNavigator /> */}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 15,
    paddingTop: 30,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  innerContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dcdcdc',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 48,
    fontSize: 16,
    color: '#111',
  },
  submitButton: {
    backgroundColor: '#2c3e50',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  showMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 10,
    backgroundColor: '#2c3e50',
  },
  showMoreButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  buttonWrapper: {
    alignItems: 'center',
  },
});


export default BankAccountScreen;
