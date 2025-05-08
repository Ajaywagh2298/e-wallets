import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { encrypt } from '../src/utils';
import { insertQuery, selectQuery } from '../src/controller';

const CreditCardScreen = ({ route, navigation }) => {
  const { cardType } = route.params || { cardType: 'Credit Card' };

  const [bankName, setBankName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  const [pin, setPin] = useState('');
  const [cardUserType, setCardUserType] = useState('Visa');
  const [billingAddress, setBillingAddress] = useState('');
  const [cardLimit, setCardLimit] = useState('');
  const [notes, setNotes] = useState('');

  const [bankSuggestions, setBankSuggestions] = useState([]);
  const [showBankSuggestions, setShowBankSuggestions] = useState(false);

  const months = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, '0')
  );
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) =>
    (currentYear + i).toString().slice(-2)
  );

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (bankName.length > 1) {
        const suggestions = await selectQuery('banks', {
          bank_name: {
            value: bankName,
            filter: 'like',
            dataType: 'text',
          },
        });

        const uniqueSuggestions = Array.from(
          new Map(suggestions.map(item => [item.bank_name, item])).values()
        );
        setBankSuggestions(uniqueSuggestions);
        setShowBankSuggestions(uniqueSuggestions.length > 0);
      } else {
        setBankSuggestions([]);
        setShowBankSuggestions(false);
      }
    };

    fetchSuggestions();
  }, [bankName]);

  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 16);
    const formatted = cleaned.replace(/(.{4})/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  const handleSubmit = async () => {
    if (
      !bankName ||
      !cardNumber ||
      !cvv ||
      !expiryMonth ||
      !expiryYear ||
      !cardHolderName ||
      !pin
    ) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    if (cardNumber.replace(/\s/g, '').length !== 16) {
      Alert.alert('Invalid Card Number', 'Card number must be 16 digits');
      return;
    }

    if (cvv.length < 3 || cvv.length > 4) {
      Alert.alert('Invalid CVV', 'CVV must be 3 or 4 digits');
      return;
    }

    if (pin.length !== 4 && pin.length !== 6) {
      Alert.alert('Invalid PIN', 'PIN must be 4 or 6 digits');
      return;
    }

    const validDate = `${expiryMonth}/${expiryYear}`;

    try {
      const data = {
        bankName: bankName,
        cardNumber: await encrypt(cardNumber),
        cvv: await encrypt(cvv),
        validDate,
        cardHolderName: await encrypt(cardHolderName),
        pin: await encrypt(pin),
        cardType,
        cardUserType,
        billingAddress: billingAddress ? await encrypt(billingAddress) : '',
        cardLimit: cardLimit ? await encrypt(cardLimit) : '',
        notes: notes ? await encrypt(notes) : '',
      };

      await insertQuery('card_details', data);
      Alert.alert('Success', `${cardType} details saved!`);
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', `Failed to save ${cardType} details`);
    }
  };

  const selectBank = (bank) => {
    setBankName(bank);
    setShowBankSuggestions(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>{cardType} Details</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Bank Name*</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. State Bank of India"
            value={bankName}
            onChangeText={setBankName}
            onFocus={() => bankName.length > 1 && setShowBankSuggestions(true)}
          />

          <Modal
            visible={showBankSuggestions}
            transparent
            animationType="fade"
            onRequestClose={() => setShowBankSuggestions(false)}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPressOut={() => setShowBankSuggestions(false)}
              style={{ flex: 1 }}
            >
              <View style={styles.suggestionModal}>
                <FlatList
                  data={bankSuggestions}
                  keyExtractor={(item, index) =>
                    item.id?.toString() ?? index.toString()
                  }
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.suggestionItem}
                      onPress={() => selectBank(item.bank_name)}
                    >
                      <Text style={styles.suggestionText}>{item.bank_name}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </TouchableOpacity>
          </Modal>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Card Number*</Text>
          <TextInput
            style={styles.input}
            placeholder="0000 0000 0000 0000"
            value={cardNumber}
            onChangeText={formatCardNumber}
            keyboardType="numeric"
            maxLength={19}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.label}>CVV*</Text>
            <TextInput
              style={styles.input}
              placeholder="123"
              value={cvv}
              onChangeText={setCvv}
              keyboardType="numeric"
              maxLength={4}
              secureTextEntry
            />
          </View>

          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Card Type</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={cardUserType}
                onValueChange={setCardUserType}
                style={styles.picker}
                dropdownIconColor="#666"
              >
                <Picker.Item label="Visa" value="Visa" />
                <Picker.Item label="Mastercard" value="Mastercard" />
                <Picker.Item label="Rupay" value="Rupay" />
                <Picker.Item label="American Express" value="American Express" />
              </Picker>
            </View>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Expiry Date*</Text>
          <View style={styles.row}>
            <View style={[styles.pickerContainer, { flex: 1, marginRight: 10 }]}>
              <Picker
                selectedValue={expiryMonth}
                onValueChange={setExpiryMonth}
                style={styles.picker}
                dropdownIconColor="#666"
              >
                <Picker.Item label="Month" value="" />
                {months.map(month => (
                  <Picker.Item key={month} label={month} value={month} />
                ))}
              </Picker>
            </View>

            <View style={[styles.pickerContainer, { flex: 1 }]}>
              <Picker
                selectedValue={expiryYear}
                onValueChange={setExpiryYear}
                style={styles.picker}
                dropdownIconColor="#666"
              >
                <Picker.Item label="Year" value="" />
                {years.map(year => (
                  <Picker.Item key={year} label={year} value={year} />
                ))}
              </Picker>
            </View>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Cardholder Name*</Text>
          <TextInput
            style={styles.input}
            placeholder="Name on card"
            value={cardHolderName}
            onChangeText={setCardHolderName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>PIN*</Text>
          <TextInput
            style={styles.input}
            placeholder="4 or 6-digit PIN"
            value={pin}
            onChangeText={setPin}
            keyboardType="numeric"
            maxLength={6}
            secureTextEntry
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Billing Address</Text>
          <TextInput
            style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
            placeholder="Billing address associated with card"
            value={billingAddress}
            onChangeText={setBillingAddress}
            multiline
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.label}>Card Limit</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. ₹50,000"
              value={cardLimit}
              onChangeText={setCardLimit}
              keyboardType="numeric"
            />
          </View>

          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={styles.input}
              placeholder="Any notes"
              value={notes}
              onChangeText={setNotes}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Save Card Details</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 25,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: '#333',
    elevation: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 1,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#333',
  },
  suggestionModal: {
    marginTop: 100,
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    maxHeight: '60%',
    elevation: 5,
  },
  suggestionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  suggestionText: {
    fontSize: 16,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#2c3e50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    elevation: 2,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CreditCardScreen;
