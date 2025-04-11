import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Modal, TouchableOpacity  , ProgressBarAndroid } from "react-native";
import { Appbar } from 'react-native-paper';
import { Checkbox, Button, Card, Divider, IconButton } from "react-native-paper";
import { ProgressBar } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { getAllConfig, updateConfig , importDatabase, exportDatabase} from "../store/database";
import { reloadAppAsync } from "expo";
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import * as Crypto from 'expo-crypto';

const SettingsScreen = ({ navigation }) => {
  const [configs, setConfigs] = useState([]);
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchConfigs = async () => {
      const data = await getAllConfig();
      if (data?.length > 0) {
        setConfigs(data);
      }
    };
    fetchConfigs();
  }, []);

  const handleEdit = (config) => {
    setSelectedConfig({
      ...config,
      mainHeader: JSON.parse(config.mainHeader),
      showDataHeader: JSON.parse(config.showDataHeader),
    });
    setModalVisible(true);
  };

  const handleToggle = (key) => {
    setSelectedConfig((prevConfig) => ({
      ...prevConfig,
      [key]: prevConfig[key] ? 0 : 1,
    }));
  };

  const handleHeaderChange = (value) => {
    setSelectedConfig((prevConfig) => ({
      ...prevConfig,
      mainHeader: [
        {
          headerKey: value,
          headerValue:
            prevConfig.showDataHeader.find((h) => h.headerKey === value)?.headerValue || "",
        },
      ],
    }));
  };

  const handleUpdate = async () => {
    if (selectedConfig) {
      const updatedConfig = {
        ...selectedConfig,
        mainHeader: JSON.stringify(selectedConfig.mainHeader),
        showDataHeader: JSON.stringify(selectedConfig.showDataHeader),
      };
      console.log(updatedConfig)
      await updateConfig(updatedConfig);
      setConfigs((prevConfigs) =>
        prevConfigs.map((config) =>
          config.id === updatedConfig.id ? updatedConfig : config
        )
      );
      setModalVisible(false);
      reloadAppAsync()
    }
  };
  const encryptFile = async (fileUri) => {
    const content = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.Base64 });
    const hash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, content);
    const encryptedPath = `${FileSystem.documentDirectory}encrypted_db.sqlite`;
    await FileSystem.writeAsStringAsync(encryptedPath, hash, { encoding: FileSystem.EncodingType.Base64 });
    return encryptedPath;
  };

  const handleExport = async () => {
    setProgress(0.1);
    const dbPath = await exportDatabase();
    setProgress(0.5);
    const encryptedPath = await encryptFile(dbPath);
    setProgress(1);
    alert(`Database exported and encrypted at: ${encryptedPath}`);
  };

  const handleImport = async () => {
    setProgress(0.1);
    const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
    if (result.type === 'success') {
      setProgress(0.5);
      const decryptedData = await FileSystem.readAsStringAsync(result.uri, { encoding: FileSystem.EncodingType.Base64 });
      setProgress(0.8);
      await importDatabase(decryptedData);
      setProgress(1);
      alert('Database imported successfully!');
    }
  };
  return (
    <>
      <View >
        <Card style={styles.actionCard}>
          <Text style={styles.sectionTitle}>Data Transfer</Text>
          <View style={styles.buttonContainer}>
            <Button mode="contained" onPress={handleExport} style={styles.button}>Export</Button>
            <Button mode="contained" onPress={handleImport} style={styles.button}>Import</Button>
          </View>
          {/* {progress !== 0 && progress < 100 && (
  <ProgressBar progress={progress} style={styles.progressBar} />
)} */}
        </Card>
      </View>
    <View style={styles.container}>
           <View style={styles.innerContainer}>
      <FlatList
        data={configs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <IconButton icon="cog" size={24} onPress={() => handleEdit(item)} />
            </View>
          </Card>
        )}
      />
      </View>

      {/* Settings Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <Card style={styles.modalContent}>
            <Card.Title title={`${selectedConfig?.title} Settings`} />
            <Card.Content>
              <View style={styles.checkboxRow}>
                <Checkbox
                  status={selectedConfig?.isShare ? "checked" : "unchecked"}
                  onPress={() => handleToggle("isShare")}
                />
                <Text>Share</Text>
              </View>
              <View style={styles.checkboxRow}>
                <Checkbox
                  status={selectedConfig?.isVisible ? "checked" : "unchecked"}
                  onPress={() => handleToggle("isVisible")}
                />
                <Text>Visible</Text>
              </View>

              <Divider style={styles.divider} />

              <Text>Main Header:</Text>
              <Picker
                selectedValue={selectedConfig?.mainHeader[0]?.headerKey}
                onValueChange={(value) => handleHeaderChange(value)}
              >
                {selectedConfig?.showDataHeader.map((header, index) => (
                  <Picker.Item key={index} label={header.headerValue} value={header.headerKey} />
                ))}
              </Picker>

              <Divider style={styles.divider} />

              <Text style={styles.subTitle}>Show Data Headers</Text>
              <FlatList
                data={selectedConfig?.showDataHeader}
                keyExtractor={(item) => item.headerKey}
                renderItem={({ item }) => (
                  <View style={styles.checkboxRow}>
                    <Text>{item.headerValue}</Text>
                    <Checkbox
                      status={item.isVisible ? "checked" : "unchecked"}
                      onPress={() => {
                        setSelectedConfig((prevConfig) => ({
                          ...prevConfig,
                          showDataHeader: prevConfig.showDataHeader.map((h) =>
                            h.headerKey === item.headerKey
                              ? { ...h, isVisible: h.isVisible ? 0 : 1 }
                              : h
                          ),
                        }));
                      }}
                    />
                  </View>
                )}
              />
            </Card.Content>

            <Card.Actions>
              <Button onPress={() => setModalVisible(false)}>Cancel</Button>
              <Button mode="contained" onPress={handleUpdate}>
                Update
              </Button>
            </Card.Actions>
          </Card>
        </View>
      </Modal>
    </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#f8f9fa" },
  innerContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  card: { backgroundColor: "#fff", padding: 15, marginVertical: 5, borderRadius: 10},
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardTitle: { fontSize: 18, fontWeight: "bold" },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { width: "90%", padding: 20, backgroundColor: "#fff", borderRadius: 10 },
  checkboxRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginVertical: 10 },
  divider: { marginVertical: 10 },
  subTitle: { fontSize: 16, fontWeight: "600", marginTop: 10 },
  appBar: {
    elevation: 4,
    shadowColor: '#000',
  },
  actionCard: { padding: 20, margin: 10, backgroundColor: "#fff", borderRadius: 10 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  buttonContainer: { flexDirection: "row", justifyContent: "space-around", marginTop: 1 },
  button: { width: "40%" },
});

export default SettingsScreen;
