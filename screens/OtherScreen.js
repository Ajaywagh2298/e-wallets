import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, Modal, Share } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import BottomTabNavigator from '../components/BottomTabNavigator';
import DateTimePicker from '@react-native-community/datetimepicker';
import { insertQuery, selectQuery } from '../src/controller';
import { encrypt, decrypt } from '../src/utils';

const modernVibrantColors = [
  '#FF6B6B', // Coral Red
  '#6BCB77', // Mint Green
  '#4D96FF', // Sky Blue
  '#F7B801', // Mustard Yellow
  '#9D4EDD', // Violet Purple
  '#3EC1D3', // Aqua
  '#E23E57', // Crimson Pink
  '#38B000', // Lime Green
  '#F15BB5', // Bubblegum Pink
  '#00BBF9', // Bright Cyan
  '#FB5607', // Neon Orange
  '#8338EC', // Deep Purple
  '#3A86FF', // Bright Blue
  '#FFBE0B', // Vivid Yellow
  '#FF006E', // Hot Pink
  '#6A4C93', // Royal Purple
  '#06D6A0', // Turquoise Green
  '#EF476F', // Rose Red
  '#FFD166', // Pale Yellow
  '#118AB2', // Blue Teal
];

const OtherScreen = ({ navigation }) => {
  const [documentType, setDocumentType] = useState('SELECT');
  const [selectedUid, setSelectedUid] = useState('');
  const [formFields, setFormFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [otherData, setOtherData] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentDateField, setCurrentDateField] = useState('');

  // Filter only active forms
  const activeFormFields = formFields.filter(field => field.active === 1);

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchData();
      } catch (error) {
        // console.error('Initial load error:', error);
        // Initialize with empty state if loading fails
        setOtherData({});
        setFormFields([]);
      }
    };

    loadData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch form definitions
      const forms = await selectQuery('custom_form', {}, '*', { orderType: 'title' });
      const processedForms = forms.map(item => ({
        ...item,
        title: item.title || 'Untitled Form',
        form_inputs: item.form_inputs ? JSON.parse(item.form_inputs) : [],
        active: item.active,
        isReminder: Boolean(item.isReminder)
      }));

      setFormFields(processedForms);

      // Fetch form data with robust error handling
      const formData = await selectQuery('custom_form_data', {}, '*');

      const processedData = await Promise.all(
        formData.map(async (item) => {
          try {
            let details = {};

            if (item.details) {
              try {
                // Initialize details outside to maintain scope
                let decryptedDetails = {};

                // Try to parse the original string to an object first
                let parsedDetails = item.details;
                if (typeof item.details === 'string') {
                  parsedDetails = JSON.parse(item.details);
                }

                // Decrypt each field
                for (const key in parsedDetails) {
                  const value = parsedDetails[key];
                  // console.log(`Decrypting ${key}: ${value}`);
                  if (typeof value === 'string') {
                    decryptedDetails[key] = await decrypt(value);
                  } else {
                    decryptedDetails[key] = value;
                  }
                }

                details = decryptedDetails;
              } catch (decryptError) {
                console.warn('Decryption failed, trying plain JSON:', decryptError);
                try {
                  details = JSON.parse(item.details) || {};
                } catch (parseError) {
                  console.warn('JSON parse failed:', parseError);
                }
              }
            }

            return {
              ...item,
              type: item.type || 'unknown',
              details: details,
              custom_form_uid: item.custom_form_uid || null
            };
          } catch (error) {
            // console.error('Item processing error:', error);
            return {
              ...item,
              type: item.type || 'unknown',
              details: {},
              custom_form_uid: item.custom_form_uid || null
            };
          }
        })
      );

      // Format data with null checks
      const formattedData = processedData.reduce((acc, item) => {
        if (!item || !item.type) return acc;

        if (!acc[item.type]) acc[item.type] = [];
        if (item.details && typeof item.details === 'object') {
          acc[item.type].push(item.details);
        }
        return acc;
      }, {});

      setOtherData(formattedData);
    } catch (error) {
      // console.error('Fetch error:', error);
      setOtherData({});
      Alert.alert('Error', 'Failed to load data. Please try again.');
    }
  };

  const handleInputChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      handleInputChange(currentDateField, selectedDate.toISOString().split('T')[0]);
    }
  };

  const handleSave = async () => {
    try {

      if (!selectQuery || !formData || Object.keys(formData).length === 0) {
        Alert.alert('Validation Error', 'Please fill in the form!');
        return;
      }

      const encryptedData = {};
      for (const key in formData) {
        const value = formData[key];
        // console.log(`Encrypting ${key}: ${value}`);
        if (typeof value === 'string') {
          encryptedData[key] = await encrypt(value);
        } else {
          encryptedData[key] = value;
        }
      }

      const jsonString = JSON.stringify(encryptedData);
      if (!jsonString) {
        throw new Error('Failed to convert encrypted data to JSON');
      }

      // Insert into database
      await insertQuery('custom_form_data', {
        type: documentType,
        details: jsonString,
        custom_form_uid: selectedUid
      });

      Alert.alert('Success', 'Document Saved Successfully!');
      setIsFormVisible(false);
      setFormData({});
      await fetchData();
    } catch (error) {
      // console.error('Save error:', error);
      Alert.alert('Error', 'Failed to save document: ' + error.message);
    }
  };

  const getRandomColor = () => {
    return modernVibrantColors[Math.floor(Math.random() * modernVibrantColors.length)];
  }
  const formatLabel = (label) => {
    return label
      .replace(/([A-Z])/g, " $1")
      .replace(/_/g, " ")
      .replace(/\b\w/g, char => char.toUpperCase());
  };

  const handleShare = async (data) => {
    try {
      let message = '';

      // Handle both single entry and grouped entries
      if (Array.isArray(data)) {
        message = data.map(entry =>
          Object.entries(entry)
            .map(([key, value]) => `${formatLabel(key)}: ${value}`)
            .join('\n')
        ).join('\n\n');
      } else {
        // Handle grouped by type
        for (const [type, entries] of Object.entries(data)) {
          message += `${formatLabel(type)}:\n`;
          message += entries.map(entry =>
            Object.entries(entry)
              .map(([key, value]) => `  ${formatLabel(key)}: ${value}`)
              .join('\n')
          ).join('\n\n');
        }
      }

      await Share.share({
        message: `Document Details:\n\n${message}`,
      });
    } catch (error) {
      // console.error('Share error:', error);
      Alert.alert('Error', 'Unable to share');
    }
  };

  const renderInputField = (input) => {
    switch (input.inputType) {
      case 'NUMBER':
        return (
          <TextInput
            style={styles.input}
            placeholder={`Enter ${input.label}`}
            value={formData[input.key] || ''}
            onChangeText={text => handleInputChange(input.key, text)}
            keyboardType="numeric"
          />
        );
      case 'DATE':
        return (
          <TouchableOpacity
            style={styles.input}
            onPress={() => {
              setCurrentDateField(input.key);
              setShowDatePicker(true);
            }}
          >
            <Text>{formData[input.key] || `Select ${input.label}`}</Text>
          </TouchableOpacity>
        );
      default:
        return (
          <TextInput
            style={styles.input}
            placeholder={`Enter ${input.label}`}
            value={formData[input.key] || ''}
            onChangeText={text => handleInputChange(input.key, text)}
          />
        );
    }
  };

  return (
    <>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          {Object.keys(otherData).length === 0 ? (
            <Text style={styles.emptyText}>No data available</Text>
          ) : (
            Object.entries(otherData).flatMap(([type, entries]) =>
              entries.map((entry, entryIndex) => (
                <View key={`${type}-${entryIndex}`} style={styles.card}>
                  <View
                    style={[
                      styles.cardHeader,
                      { backgroundColor: getRandomColor() }
                    ]}
                  >
                    <Feather name="file-text" size={22} color="#fff" />
                    <Text style={styles.cardTitle}>{formatLabel(type)} Details</Text>
                    <TouchableOpacity
                      style={styles.shareButton}
                      onPress={() => handleShare({ [type]: [entry] })}
                    >
                      <Feather name="share-2" size={20} color="#fff" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.entryWrapper}>
                    {Object.entries(entry).map(([key, value]) => (
                      <View key={key} style={styles.entryRow}>
                        <Text style={styles.entryLabel}>{formatLabel(key)}:</Text>
                        <Text style={styles.entryValue}>
                          {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))
            )
          )}
        </ScrollView>



        <TouchableOpacity
          style={styles.fab}
          onPress={() => setIsFormVisible(true)}
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>

        <Modal visible={isFormVisible} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.headerText}>Document Details</Text>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Document Type</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={documentType}
                      onValueChange={(value) => {
                        setDocumentType(value);
                        setFormData({});
                        const form = activeFormFields.find(f => f.title === value);
                        setSelectedUid(form?.uid || '');
                      }}
                      style={styles.picker}
                    >
                      <Picker.Item label="Select Document Type" value="SELECT" />
                      {activeFormFields.map(form => (
                        <Picker.Item
                          key={form.uid}
                          label={form.title}
                          value={form.title}
                        />
                      ))}
                    </Picker>
                  </View>
                </View>

                {documentType !== 'SELECT' &&
                  activeFormFields
                    .find(form => form.title === documentType)
                    ?.form_inputs.map(input => (
                      <View key={input.key} style={styles.inputContainer}>
                        <Text style={styles.label}>{input.label}</Text>
                        {renderInputField(input)}
                      </View>
                    ))
                }

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSave}
                  >
                    <Text style={styles.saveButtonText}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setIsFormVisible(false)}
                  >
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {showDatePicker && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
      </View>
      <BottomTabNavigator menu={'Other'} />
    </>
  );
};

const styles = StyleSheet.create({
  // Main Container - Dashboard color scheme
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5' // Dashboard background color
  },

  // Header Styles - Dashboard gradient theme
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333' // Dashboard text color
  },

  // Empty State - Dashboard theme
  emptyText: {
    textAlign: 'center',
    color: '#666', // Dashboard secondary text color
    fontSize: 16
  },

  // Section Styles
  section: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333', // Dashboard primary text color
    marginBottom: 5
  },

  // Entry Styles - Dashboard card theme
  entry: {
    backgroundColor: 'white', // Dashboard card background
    padding: 10,
    borderRadius: 12, // Dashboard border radius
    marginBottom: 5,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4, // Dashboard shadow
  },
  entryText: {
    fontSize: 16,
    color: '#333' // Dashboard text color
  },
  bold: { fontWeight: 'bold' },

  // FAB - Dashboard gradient theme
  fab: {
    position: 'absolute',
    bottom: '15%',
    right: 20,
    width: 60,
    height: 60,
    backgroundColor: '#4285F4', // Dashboard primary color
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8, // Dashboard elevation
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  fabText: {
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold'
  },

  // Modal Styles - Dashboard theme
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16, // Dashboard border radius
    elevation: 8, // Dashboard elevation
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },

  // Input Styles - Dashboard theme
  inputContainer: { marginBottom: 15 },
  label: {
    fontSize: 16,
    fontWeight: '600', // Dashboard font weight
    marginBottom: 5,
    color: '#333' // Dashboard text color
  },
  input: {
    height: 45,
    borderWidth: 1,
    borderColor: '#E9ECEF', // Dashboard border color
    borderRadius: 12, // Dashboard border radius
    paddingHorizontal: 15,
    justifyContent: 'center',
    backgroundColor: 'white',
    fontSize: 16,
    color: '#333',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E9ECEF', // Dashboard border color
    borderRadius: 12, // Dashboard border radius
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  picker: { height: 50, width: '100%' },

  // Button Styles - Dashboard gradient theme
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#4285F4', // Dashboard primary color
    padding: 12,
    borderRadius: 12, // Dashboard border radius
    alignItems: 'center',
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600' // Dashboard font weight
  },
  closeButton: {
    flex: 1,
    backgroundColor: '#FF5722', // Dashboard accent color
    padding: 12,
    borderRadius: 12, // Dashboard border radius
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600' // Dashboard font weight
  },

  // Scroll View
  scrollView: {
    padding: 15
  },

  // Card Styles - Dashboard theme
  card: {
    backgroundColor: 'white',
    borderRadius: 16, // Dashboard border radius
    marginBottom: 15,
    elevation: 4,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: '#4285F4', // Dashboard primary gradient color
    padding: 16, // Dashboard padding
    borderTopLeftRadius: 16, // Dashboard border radius
    borderTopRightRadius: 16 // Dashboard border radius
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 12, // Dashboard spacing
    flex: 1
  },

  // Entry Wrapper - Dashboard theme
  entryWrapper: {
    backgroundColor: '#F8F9FA', // Dashboard light background
    padding: 16, // Dashboard padding
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF', // Dashboard border color
    borderRadius: 12, // Dashboard border radius
    marginVertical: 8,
    position: 'relative',
  },
  entryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6, // Dashboard spacing
  },
  entryLabel: {
    fontWeight: '600', // Dashboard font weight
    fontSize: 16,
    color: '#4285F4', // Dashboard primary color
    flex: 1,
  },
  entryValue: {
    fontSize: 16,
    color: '#333', // Dashboard text color
    flex: 1,
    textAlign: 'right',
    fontWeight: '500', // Dashboard font weight
  },

  // Share Button - Dashboard theme
  shareButton: {
    marginLeft: 'auto',
    padding: 8, // Dashboard padding
    borderRadius: 8, // Dashboard border radius
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Dashboard button background
  },
});

export default OtherScreen;