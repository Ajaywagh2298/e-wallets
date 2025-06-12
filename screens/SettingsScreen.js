import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Modal,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  TextInput,
} from "react-native";
import { ProgressBar, Avatar } from "react-native-paper";
import { LinearGradient } from 'expo-linear-gradient';
import { selectQuery, updateQuery, executeQuery } from "../src/controller";
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import * as Sharing from 'expo-sharing';
import * as Crypto from 'expo-crypto';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';

const SettingsScreen = ({ navigation }) => {
  const [configs, setConfigs] = useState([]);
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: '',
    subject: '',
    message: '',
  });
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  // Helper function to safely parse JSON
  const safeJsonParse = (jsonString, fallback = []) => {
    if (!jsonString) return fallback;
    try {
      const parsed = typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
      return Array.isArray(parsed) ? parsed : fallback;
    } catch (e) {
      console.error('JSON Parse Error:', e);
      return fallback;
    }
  };

  // Helper function to convert database boolean values
  const convertDbBoolean = (value) => {
    return value === 1 || value === '1' || value === true;
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch configs
      let configData = await selectQuery('config', {}, '*', { orderBy: 'title' });
      if (configData?.length > 0) {
        configData = configData.map(config => {
          //console.log('Raw config from DB:', config); // Debug log

          const processedConfig = {
            ...config,
            // Parse JSON strings safely
            mainHeader: safeJsonParse(config.mainHeader, []),
            showDataHeader: safeJsonParse(config.showDataHeader, []),
            // Convert database boolean values (1/0) to actual booleans
            isShare: convertDbBoolean(config.isShare),
            isVisible: convertDbBoolean(config.isVisible)
          };

          //console.log('Processed config:', processedConfig); // Debug log
          return processedConfig;
        });
        setConfigs(configData);
      } else {
        setConfigs([]);
      }

      // Fetch user data
      const userData = await selectQuery('user', {}, '*');
      if (userData?.length > 0) {
        setUserData({
          name: userData[0].name || '@appsinppuser',
          email: userData[0].email || 'developer@appsnipp.com',
          phone: userData[0].phone || '+91 8129999999'
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to load data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleEdit = (config) => {
    try {
      //console.log('Editing config:', config); // Debug log

      const processedConfig = {
        ...config,
        // Ensure arrays are properly handled
        mainHeader: Array.isArray(config.mainHeader) ? config.mainHeader : [],
        showDataHeader: Array.isArray(config.showDataHeader) ? config.showDataHeader : [],
        // Ensure booleans are properly handled
        isShare: convertDbBoolean(config.isShare),
        isVisible: convertDbBoolean(config.isVisible)
      };

      //console.log('Setting selected config:', processedConfig); // Debug log
      setSelectedConfig(processedConfig);
      setModalVisible(true);
    } catch (error) {
      console.error('Error processing config for edit:', error);
      Alert.alert('Error', 'Failed to load configuration data.');
    }
  };

  const handleToggle = (key) => {
    setSelectedConfig((prevConfig) => {
      const newValue = !prevConfig[key];
      //console.log(`Toggling ${key} from ${prevConfig[key]} to ${newValue}`); // Debug log
      return {
        ...prevConfig,
        [key]: newValue,
      };
    });
  };

  const handleUpdate = async () => {
    if (selectedConfig) {
      try {
        //console.log('Updating config:', selectedConfig); // Debug log

        const updatedConfig = {
          ...selectedConfig,
          // Convert arrays back to JSON strings for database storage
          mainHeader: JSON.stringify(selectedConfig.mainHeader || []),
          showDataHeader: JSON.stringify(selectedConfig.showDataHeader || []),
          // Convert booleans to database format (1/0)
          isShare: selectedConfig.isShare ? 1 : 0,
          isVisible: selectedConfig.isVisible ? 1 : 0,
        };

        //console.log('Config being sent to database:', updatedConfig); // Debug log

        await updateQuery('config', updatedConfig, { uid: updatedConfig.uid });

        // Update local state with the processed version
        const updatedConfigForState = {
          ...selectedConfig,
          isShare: convertDbBoolean(updatedConfig.isShare),
          isVisible: convertDbBoolean(updatedConfig.isVisible)
        };

        setConfigs((prevConfigs) =>
          prevConfigs.map((config) =>
            config.uid === updatedConfig.uid ? updatedConfigForState : config
          )
        );

        setModalVisible(false);
        Alert.alert('Success', 'Configuration updated successfully!');
      } catch (error) {
        console.error('Update error:', error);
        Alert.alert('Error', 'Failed to update configuration');
      }
    }
  };

  // Handle data header visibility toggle
  const handleDataHeaderToggle = (headerKey) => {
    setSelectedConfig((prevConfig) => ({
      ...prevConfig,
      showDataHeader: prevConfig.showDataHeader.map((header) =>
        header.headerKey === headerKey
          ? { ...header, isVisible: header.isVisible ? 0 : 1 }
          : header
      ),
    }));
  };

  const exportDatabase = async () => {
    try {
      const tablesQuery = "SELECT name FROM sqlite_master WHERE type='table' AND name NOT IN ('user', 'migrations', 'sqlite_sequence')";
      const tables = await executeQuery(tablesQuery); // Check if result.rows needed
  
      let exportData = {};
  
      for (const table of tables) {
        const tableName = table.name;
        const tableData = await selectQuery(tableName, {}, '*');
        exportData[tableName] = tableData;
      }
  
      const jsonData = JSON.stringify(exportData);
      const checksum = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        jsonData
      );
  
      const timestamp = new Date().getTime();
      const secureFilePath = `${FileSystem.documentDirectory}lakshcrypt_backup_${timestamp}.lcrypt`;
  
      const fileHeader = "LAKSHCRYPT_SECURE_BACKUP_V1";
      const fileContent = `${fileHeader}|${checksum}|${jsonData}`;
  
      await FileSystem.writeAsStringAsync(secureFilePath, fileContent);
  
      return secureFilePath;
    } catch (error) {
      console.error('Export error:', error);
      throw error;
    }
  };
  

  const importDatabase = async (jsonData) => {
    try {
      const importData = JSON.parse(jsonData);
  
      for (const [tableName, tableData] of Object.entries(importData)) {
        await executeQuery(`DELETE FROM ${tableName}`); // Clear table
  
        for (const record of tableData) {
          const columns = Object.keys(record);
          const values = columns.map(col => record[col]);
          const placeholders = columns.map(() => '?').join(', ');
          const insertQuery = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`;
          await executeQuery(insertQuery, values);
        }
      }
  
      return true;
    } catch (error) {
      console.error('Import error:', error);
      throw error;
    }
  };
  
  

  const handleExport = async () => {
    try {
      setIsExporting(true);
      setProgress(0.1);

      const secureFilePath = await exportDatabase();
      setProgress(0.8);

      const isAvailable = await Sharing.isAvailableAsync();

      if (isAvailable) {
        await Sharing.shareAsync(secureFilePath, {
          mimeType: 'application/octet-stream',
          dialogTitle: 'Save LAKSHCRYPT Backup File',
          UTI: 'public.data'
        });
      } else {
        Alert.alert(
          'Export Successful',
          `Database exported securely to:\n${secureFilePath}`,
          [{ text: 'OK' }]
        );
      }

      setProgress(1);
      setIsExporting(false);
    } catch (error) {
      setIsExporting(false);
      Alert.alert('Export Failed', error.message);
    }
  };

  const handleImport = async () => {
    try {
      setIsImporting(true);
      setProgress(0.1);
  
      const result = await DocumentPicker.getDocumentAsync();
  
      if (result.canceled) {
        setIsImporting(false);
        return;
      }
  
      const fileUri = result.assets[0].uri;
      const fileName = result.assets[0].name;
  
      if (!fileName.endsWith('.lcrypt')) {
        setIsImporting(false);
        Alert.alert('Invalid File', 'Please select a valid LAKSHCRYPT backup file (.lcrypt)');
        return;
      }
  
      const fileContent = await FileSystem.readAsStringAsync(fileUri);
  
      if (!fileContent.startsWith("LAKSHCRYPT_SECURE_BACKUP_V1|")) {
        setIsImporting(false);
        Alert.alert('Invalid Format', 'The selected file is not a valid backup.');
        return;
      }
  
      const parts = fileContent.split("|");
      if (parts.length !== 3) {
        setIsImporting(false);
        Alert.alert('Corrupted File', 'The selected file is corrupted or incomplete.');
        return;
      }
  
      const [, checksum, jsonData] = parts;
      const calculatedChecksum = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        jsonData
      );
  
      if (checksum !== calculatedChecksum) {
        setIsImporting(false);
        Alert.alert('Checksum Failed', 'The file integrity check failed. Import aborted.');
        return;
      }
  
      // Ask for user confirmation BEFORE proceeding
      Alert.alert(
        'Confirm Import',
        'Importing this backup will erase your existing data. Do you want to continue?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => {
              setIsImporting(false);
            }
          },
          {
            text: 'Yes, Import',
            style: 'destructive',
            onPress: async () => {
              try {
                setProgress(0.5);
                await importDatabase(jsonData);
                setProgress(1);
                setIsImporting(false);
  
                Alert.alert(
                  'Import Successful',
                  'Database imported successfully. The app will now reload.',
                  [{
                    text: 'OK',
                    onPress: () => {
                      navigation.reset({
                        index: 0,
                        routes: [{ name: 'Dashboard' }],
                      });
                    }
                  }]
                );
              } catch (error) {
                setIsImporting(false);
                Alert.alert('Import Failed', error.message);
              }
            }
          }
        ]
      );
    } catch (error) {
      setIsImporting(false);
      Alert.alert('Import Error', error.message);
    }
  };
  

  const handleSubmitContactForm = async () => {
    const { name, email, phone, type, subject, message } = formData;

    if (!name || !email || !message) {
      alert('Please fill in required fields.');
      return;
    }

    const telegramMessage = {
      name,
      email,
      phone,
      type,
      subject,
      message
    };

    try {
      await apiErrorLogsSendTelegram(telegramMessage);
      alert('Message sent successfully!');
      setFormData({ name: '', email: '', phone: '', type: '', subject: '', message: '' });
    } catch (error) {
      alert('Failed to send message.');
      console.error(error);
    }
  };

  async function apiErrorLogsSendTelegram(data) {
    const statusEmoji = data.type === 'Error' ? '🔴' : '🟢';

    const messageStyle = `
*${statusEmoji} ------ ${data.type} ------ ${statusEmoji}*
*Report UID:* ${data.type}
*Name:* ${data.name || ''}
*Email:* ${data.email || ''}
*Phone:* ${data.phone || ''}
*Subject:* ${data.subject || ''}
*Message:* ${data.message || ''}
  `;
    //console.log('Message being sent to Telegram:', messageStyle);
    try {
      await axios.post(`https://api.telegram.org/bot7670966901:AAHLBCcLuTgL1b0gyZ2oG3-4B_1Dz9MwWo4/sendMessage`, {
        chat_id: '-1002313547539',
        text: messageStyle,
        parse_mode: 'Markdown',
      });
    } catch (error) {
      console.error('Failed to send message to Telegram:', error.message);
    }
  }

  const renderSection = ({ item }) => {
    switch (item.type) {
      case 'profile':
        return (
          <View style={styles.headerContainer}>
            <LinearGradient
              colors={['#4285F4', '#6366F1']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.headerGradient}
            >
              <View style={styles.profileCard}>
                <View style={styles.profileHeader}>
                  <View style={styles.avatarContainer}>
                    <Avatar.Text
                      size={80}
                      label={item.data.name.substring(1, 3).toUpperCase()}
                      backgroundColor="rgba(255, 255, 255, 0.2)"
                      color="#fff"
                      labelStyle={styles.avatarLabel}
                    />
                  </View>
                  <View style={styles.profileInfo}>
                    <Text style={styles.profileName}>{item.data.name}</Text>
                    <Text style={styles.profileRole}>{item.data.email}</Text>
                    <Text style={styles.profileRole}>{item.data.phone}</Text>
                  </View>
                </View>

                <View style={styles.actionButtonsRow}>
                  <TouchableOpacity
                    style={styles.messageButton}
                    onPress={handleImport}
                    disabled={isImporting}
                  >
                    <Text style={styles.messageButtonText}>
                      {isImporting ? 'Importing...' : 'Import Data'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.followButton}
                    onPress={handleExport}
                    disabled={isExporting}
                  >
                    <MaterialIcons name="file-download" size={18} color="white" style={styles.followIcon} />
                    <Text style={styles.followButtonText}>
                      {isExporting ? 'Exporting...' : 'Export Data'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </LinearGradient>
          </View>
        );

      case 'actions':
        return (
          <View style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <MaterialIcons name="settings" size={24} color="#4285F4" />
              <Text style={styles.statusTitle}>App Query / Suggestion</Text>
            </View>
            <View style={styles.formContainer}>
              <TextInput
                style={styles.input}
                placeholder="Name"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={formData.email}
                keyboardType="email-address"
                onChangeText={(text) => setFormData({ ...formData, email: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Phone"
                value={formData.phone}
                keyboardType="phone-pad"
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
              />
              {/* Picker for type */}
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.type}
                  onValueChange={(itemValue) => setFormData({ ...formData, type: itemValue })}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Type" value="" />
                  <Picker.Item label="Error" value="Error" />
                  <Picker.Item label="Suggestion" value="Suggestion" />
                </Picker>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Subject"
                value={formData.subject}
                onChangeText={(text) => setFormData({ ...formData, subject: text })}
              />
              <TextInput
                style={[styles.input, { height: 100 }]}
                placeholder="Message"
                value={formData.message}
                multiline
                onChangeText={(text) => setFormData({ ...formData, message: text })}
              />
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmitContactForm}
              >
                <Text style={styles.submitText}>SEND MESSAGE</Text>
                <MaterialIcons name="arrow-forward" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        );

      case 'progress':
        return (
          <LinearGradient
            colors={['#4285F4', '#6366F1']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.progressContainer}
          >
            <Text style={styles.progrssTitle}>Data Inprogress...</Text>
            <ProgressBar progress={item.data.progress} color="#82e0aa" style={styles.progressBar} />
            <Text style={styles.progressText}>
              {item.data.isExporting ? 'Exporting database...' : 'Importing database...'}
              {Math.round(item.data.progress * 100)}%
            </Text>
          </LinearGradient>
        );

      case 'configs':
        return (
          <View style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <MaterialIcons name="settings" size={24} color="#4285F4" />
              <Text style={styles.statusTitle}>App Modules Configuration</Text>
            </View>
          <View style={styles.configsContainer}>
            {item.data.length > 0 ? (
              item.data.map((config) => (
                <TouchableOpacity
                  key={config.uid}
                  style={styles.configCard}
                  onPress={() => handleEdit(config)}
                >
                  <View style={styles.configHeader}>
                    <View style={styles.configIconContainer}>
                      <MaterialIcons name="settings" size={24} color="#4285F4" />
                    </View>
                    <View style={styles.configInfo}>
                      <Text style={styles.configTitle}>{config.title}</Text>
                      <Text style={styles.configSubtitle}>
                        {config.isVisible ? 'Visible' : 'Hidden'} • {config.isShare ? 'Shareable' : 'Private'}
                      </Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={20} color="#4285F4" />
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyState}>
                <MaterialIcons name="info" size={24} color="#999" />
                <Text style={styles.emptyStateText}>No configurations found</Text>
              </View>
            )}
          </View>
          </View>
        );
      default:
        return null;
    }
  };

  const sections = [
    { type: 'profile', data: userData },
    ...(isExporting || isImporting ? [{ type: 'progress', data: { progress, isExporting, isImporting } }] : []),
    { type: 'actions', data: null },
    { type: 'configs', data: configs },
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ProgressBar indeterminate color="#4285F4" />
        <Text style={styles.loadingText}>Loading settings...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={sections}
        keyExtractor={(item, index) => `${item.type}-${index}`}
        renderItem={renderSection}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#4285F4']}
            tintColor="#4285F4"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialIcons name="info" size={24} color="#999" />
            <Text style={styles.emptyStateText}>No data available</Text>
          </View>
        }
      />

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {/* Header */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {selectedConfig?.title || 'Config'} Settings
                </Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <MaterialIcons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              {/* Scrollable Body */}
              <ScrollView
                style={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                
              >
                <View style={styles.formSection}>
                  {/* Basic Info */}
                  <Text style={styles.sectionTitle}>Configuration Settings</Text>
                  {/* Toggle Options */}
                  <View style={styles.settingsGroup}>
                    <Text style={styles.groupTitle}>Visibility Settings</Text>

                    <View style={styles.toggleRow}>
                      <View style={styles.toggleInfo}>
                        <Text style={styles.toggleLabel}>Share Configuration</Text>
                        <Text style={styles.toggleDescription}>Allow this configuration to be shared with others</Text>
                      </View>
                      <TouchableOpacity
                        style={[styles.toggleSwitch, selectedConfig?.isShare && styles.toggleSwitchActive]}
                        onPress={() => handleToggle("isShare")}
                      >
                        <View style={[styles.toggleThumb, selectedConfig?.isShare && styles.toggleThumbActive]} />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.toggleRow}>
                      <View style={styles.toggleInfo}>
                        <Text style={styles.toggleLabel}>Visible Configuration</Text>
                        <Text style={styles.toggleDescription}>Show this configuration in the main list</Text>
                      </View>
                      <TouchableOpacity
                        style={[styles.toggleSwitch, selectedConfig?.isVisible && styles.toggleSwitchActive]}
                        onPress={() => handleToggle("isVisible")}
                      >
                        <View style={[styles.toggleThumb, selectedConfig?.isVisible && styles.toggleThumbActive]} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Main Headers */}
                  <View style={styles.settingsGroup}>
                    <Text style={styles.groupTitle}>Main Headers ({selectedConfig?.mainHeader?.length || 0})</Text>
                    {selectedConfig?.mainHeader?.length > 0 ? (
                      selectedConfig.mainHeader.map((header, index) => {
                        return (
                          <View key={index} style={styles.headerCard}>
                            <View style={styles.headerCardIcon}>
                              <MaterialIcons name="label" size={20} color="#f39c12" />
                            </View>
                            <View style={styles.headerCardContent}>
                              <Text style={styles.headerCardTitle}>{header.headerKey}</Text>
                            </View>
                          </View>
                        );
                      })
                    ) : (
                      <View style={styles.emptyState}>
                        <MaterialIcons name="info" size={24} color="#999" />
                        <Text style={styles.emptyStateText}>No main headers configured</Text>
                      </View>
                    )}
                  </View>

                  {/* Data Headers */}
                  <View style={styles.settingsGroup}>
                    <Text style={styles.groupTitle}>Data Headers ({selectedConfig?.showDataHeader?.length || 0})</Text>
                    {selectedConfig?.showDataHeader?.length > 0 ? (
                      selectedConfig.showDataHeader.map((header, index) => (
                        <View key={header.headerKey || index} style={styles.dataHeaderCard}>
                          <View style={styles.dataHeaderInfo}>
                            <View style={styles.dataHeaderIcon}>
                              <MaterialIcons name="view-column" size={18} color="#fdfefe" />
                            </View>
                            <View style={styles.dataHeaderContent}>
                              <Text style={styles.dataHeaderTitle}>{header.headerValue}</Text>
                              <Text style={styles.dataHeaderPosition}>Position: {header.position}</Text>
                            </View>
                          </View>
                          <TouchableOpacity
                            style={[styles.dataHeaderToggle, convertDbBoolean(header.isVisible) && styles.dataHeaderToggleActive]}
                            onPress={() => handleDataHeaderToggle(header.headerKey)}
                          >
                            {convertDbBoolean(header.isVisible) ? (
                              <MaterialIcons name="visibility" size={20} color="white" />
                            ) : (
                              <MaterialIcons name="visibility-off" size={20} color="#ec7063" />
                            )}
                          </TouchableOpacity>
                        </View>
                      ))
                    ) : (
                      <View style={styles.emptyState}>
                        <MaterialIcons name="info" size={24} color="#999" />
                        <Text style={styles.emptyStateText}>No data headers configured</Text>
                      </View>
                    )}
                  </View>
                      {/* Footer Buttons */}
                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <MaterialIcons name="close" size={18} color="#fdfefe" style={styles.buttonIcon} />
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.updateButton}
                    onPress={handleUpdate}
                  >
                    <MaterialIcons name="save" size={18} color="white" style={styles.buttonIcon} />
                    <Text style={styles.updateButtonText}>Save Changes</Text>
                  </TouchableOpacity>
                </View>
                </View>
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5"
  },
  flatListContent: {
    paddingBottom: 20,
  },
  headerContainer: {
    marginBottom: 0,
  },
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatarLabel: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 14,
    color: '#4285F4',
    fontWeight: '500',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  messageButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4285F4',
    alignItems: 'center',
  },
  messageButtonText: {
    color: '#4285F4',
    fontWeight: '600',
    fontSize: 16,
  },
  followButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#4285F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  followIcon: {
    marginRight: 8,
  },
  followButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  statusCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
    marginLeft: 8,
    letterSpacing: 1,
  },
  progrssTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fdfefe',
    marginLeft: 8,
    letterSpacing: 1,
    marginBottom: 12,
  },
  statusText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  progressContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 20,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    color: '#fdfefe',
    textAlign: 'center',
  },
  configsContainer: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  configCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  configHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  configIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  configInfo: {
    flex: 1,

  },
  configTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  configSubtitle: {
    fontSize: 12,
    color: '#999',
  },
  projectCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  projectText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
    letterSpacing: 1,
  },
  modalContainer: {
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 20,
    height: '98%',
  },
  scrollContainer: {
    padding: '5%',
    height: '100%',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  formSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  settingsGroup: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 20,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4285F4',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  formRow: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  formInputContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  formValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 12,
  },
  toggleInfo: {
    flex: 1,
    marginRight: 16,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  toggleDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  toggleSwitch: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ec7063',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleSwitchActive: {
    backgroundColor: '#4285F4',
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F4FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E3EBFF',
  },
  headerCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#4285F4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerCardContent: {
    flex: 1,
    justifyContent : 'center',
    fontWeight : 'bold',
    fontSize : 20
  },
  headerCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  headerCardSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  dataHeaderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  dataHeaderInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dataHeaderIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#27ae60',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  dataHeaderContent: {
    flex: 1,
    marginRight: 12,
  },
  dataHeaderTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  dataHeaderKey: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  dataHeaderPosition: {
    fontSize: 11,
    color: '#999',
    fontWeight: '500',
  },
  dataHeaderToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  dataHeaderToggleActive: {
    backgroundColor: '#4285F4',
    borderColor: '#4285F4',
  },
  emptyState: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    marginHorizontal: 20,
    marginTop: 20,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#999',
    marginLeft: 8,
    fontStyle: 'italic',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: "space-between",
    padding: 15,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    alignItems: 'center',
    marginRight: 8,
    backgroundColor: '#ec7063',
  },
  cancelButtonText: {
    color: '#fdfefe',
    fontSize: 16,
    fontWeight: '600',
  },
  updateButton: {
    flex: 1,
    backgroundColor: "#4285F4",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  updateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonIcon: {
    marginRight: 8,
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  formContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  submitButton: {
    backgroundColor: '#4285F4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 8,
    width: '50%',
    margin: 10,
    display: 'flex',
    alignSelf: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    marginRight: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
});

export default SettingsScreen;