import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, Modal, Share } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { insertOtherData, getAllOtherData } from '../store/database'; // Database function
import { MaterialIcons, Feather } from '@expo/vector-icons'; // For icons
import { LinearGradient } from 'expo-linear-gradient'; // For gradients
import BottomTabNavigator from '../components/BottomTabNavigator'; // Bottom Tab Navigator

const OtherScreen = ({ navigation }) => {
  const [documentType, setDocumentType] = useState('SELECT');
  const [formData, setFormData] = useState({});
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [otherData, setOtherData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await getAllOtherData();
      const formattedData = formatDataByType(data);
      setOtherData(formattedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const formatDataByType = (data) => {
    const groupedData = {};

    data.forEach(({ type, details }) => {
      let parsedDetails = {};

      if (details && typeof details === 'string') {
        try {
          // Replace '=' with ':' and ensure valid JSON formatting
          let jsonString = details
            .replace(/(\w+)=/g, '"$1":') // Wrap keys with double quotes
            .replace(/'/g, '"'); // Ensure proper quotes for values

          parsedDetails = JSON.parse(jsonString);
        } catch (error) {
          console.error('Invalid JSON format:', details, error);
        }
      }

      if (!groupedData[type]) groupedData[type] = [];
      groupedData[type].push(parsedDetails);
    });

    return groupedData;
  };


  const handleInputChange = (key, value) => {
    setFormData((prevState) => ({ ...prevState, [key]: value }));
  };

  const handleSave = async () => {
    if (documentType === 'SELECT') {
      Alert.alert('Error', 'Select The Valid Document Type !');
      return;
    }

    if (Object.values(formData).some((value) => !value)) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    try {
      await insertOtherData(documentType, formData);
      Alert.alert('Success', 'Document details saved successfully!');
      setIsFormVisible(false);
      setDocumentType('SELECT');
      setFormData({});
      fetchData(); // Refresh data list
    } catch (error) {
      Alert.alert('Error', 'Failed to save document details');
    }
  };

  const formFields = {
    SELECT: [],
    PAN: [{ key: 'holderName', label: 'PAN Holder Name' }, { key: 'panNumber', label: 'PAN Number' }],
    AADHAR: [{ key: 'holderName', label: 'Aadhar Holder Name' }, { key: 'aadharNumber', label: 'Aadhar Number (12 Digits)' }],
    NPS: [{ key: 'pranNumber', label: 'PRAN Number' }, { key: 'userName', label: 'User Name' }, { key: 'password', label: 'Password' }],
    EPFO: [{ key: 'uan', label: 'UAN Number' }, { key: 'userName', label: 'User Name' }, { key: 'password', label: 'Password' }],
    DRIVING_LICENSE: [{ key: 'licenseNumber', label: 'License Number' }, { key: 'validMonth', label: 'Valid Until (Month)' }, { key: 'validYear', label: 'Valid Until (Year)' }],
    VOTER_ID: [{ key: 'voterID', label: 'Voter ID Number' }, { key: 'holderName', label: 'Voter Holder Name' }],
    PASSPORT: [{ key: 'passportNumber', label: 'Passport Number' }, { key: 'expiryMonth', label: 'Expiry Month' }, { key: 'expiryYear', label: 'Expiry Year' }],
  };

  const formatLabel = (label) => {
    return label
      .replace(/([A-Z])/g, " $1")  // Insert space before capital letters (camelCase)
      .replace(/_/g, " ")          // Replace underscores with spaces (snake_case)
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
  };

  const handleShare = async (entry) => {
    const shareMessage = Object.entries(entry)
      .map(([key, value]) => `${key.replace(/_/g, ' ')}: ${value}`)
      .join('\n');

    try {
      await Share.share({
        message: `Here are my document details:\n\n${shareMessage}`,
      });
    } catch (error) {
      Alert.alert('Error', 'Unable to share details');
    }
  };

  return (
    <>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          {Object.keys(otherData).length === 0 ? (
            <Text style={styles.emptyText}>No data available</Text>
          ) : (
            Object.entries(otherData).map(([type, entries]) => (
              <View key={type} style={styles.card}>
                {/* Document Type Header with Icon */}
                <View style={styles.cardHeader}>
                  <Feather name="file-text" size={22} color="#fff" />
                  <Text style={styles.cardTitle}>{formatLabel(type)}</Text>
                  <TouchableOpacity onPress={() => handleShare(entry)}>
                    <Feather name="share-2" size={20} color="#34495e" />
                  </TouchableOpacity>
                </View>

                {/* Document Entries */}
                {entries.map((entry, index) => (
                  <View
                    key={index}
                    style={[
                      styles.entry,
                    ]}
                  >
                    {Object.entries(entry).map(([key, value]) => (
                      <View key={key} style={styles.entryRow}>
                        <Text style={styles.entryLabel}>{formatLabel(key)}:</Text>
                        <Text style={styles.entryValue}>{value}</Text>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            ))
          )}
        </ScrollView>

        {/* Floating Action Button */}
        <TouchableOpacity style={styles.fab} onPress={() => setIsFormVisible(true)}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>

        {/* Modal Popup for Adding Data */}
        <Modal visible={isFormVisible} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.headerText}>Document Details</Text>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Document Type</Text>
                  <View style={styles.pickerContainer}>
                    <Picker selectedValue={documentType} onValueChange={(value) => { setDocumentType(value); setFormData({}); }} style={styles.picker}>
                      {Object.keys(formFields).map((key) => (
                        <Picker.Item key={key} label={key.replace('_', " ")} value={key} />
                      ))}
                    </Picker>
                  </View>
                </View>

                {formFields[documentType].map(({ key, label }) => (
                  <View key={key} style={styles.inputContainer}>
                    <Text style={styles.label}>{label}</Text>
                    <TextInput style={styles.input} placeholder={`Enter ${label}`} value={formData[key] || ''} onChangeText={(text) => handleInputChange(key, text)} />
                  </View>
                ))}

                <View style={styles.buttonRow}>
                  <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.closeButton} onPress={() => setIsFormVisible(false)}>
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
      <BottomTabNavigator menu={'Other'} />
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  headerText: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  emptyText: { textAlign: 'center', color: '#888', fontSize: 16 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50', marginBottom: 5 },
  entry: { backgroundColor: '#f4f4f4', padding: 10, borderRadius: 8, marginBottom: 5 },
  entryText: { fontSize: 16, color: '#333' },
  bold: { fontWeight: 'bold' },

  fab: { position: 'absolute', bottom: '15%', right: 20, width: 60, height: 60, backgroundColor: '#2c3e50', borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  fabText: { fontSize: 30, color: '#fff', fontWeight: 'bold' },

  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContent: { width: '90%', backgroundColor: '#fff', padding: 20, borderRadius: 15, elevation: 5 },
  inputContainer: { marginBottom: 15 },
  label: { fontSize: 16, fontWeight: '500' },
  input: { height: 45, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 10 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  saveButton: { flex: 1, backgroundColor: '#2c3e50', padding: 10, borderRadius: 8, alignItems: 'center', marginRight: 4 },
  saveButtonText: { color: '#fff', fontSize: 16 },
  closeButton: { flex: 1, backgroundColor: '#d9534f', padding: 10, borderRadius: 8, alignItems: 'center' },
  closeButtonText: { color: '#fff', fontSize: 16 },
  scrollView: { padding: 15 },
  emptyText: { textAlign: 'center', fontSize: 18, color: 'gray', marginTop: 20 },
  /* Card Styles */
  card: { backgroundColor: 'white', borderRadius: 12, marginBottom: 15, elevation: 4, overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#34495e', padding: 12, borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: 'white', marginLeft: 10 },
  /* Entry Styles */
  entry: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  entryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
  entryLabel: { fontWeight: 'bold', fontSize: 16, color: '#333' },
  entryValue: { fontSize: 16, color: '#555' }
});

export default OtherScreen;
