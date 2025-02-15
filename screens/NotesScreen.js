import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Appbar } from 'react-native-paper';
import { insertNotePadData } from '../store/database'; // Assuming a database function

const NotesScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');

  const handleSave = async () => {
    if (!title || !note) {
      Alert.alert('Error', 'Both fields are required');
      return;
    }

    try {
      await insertNotePadData(title, note)
        .then(() => console.log('Note saved successfully'))
        .catch(err => console.error('Insert error', err));

      Alert.alert('Success', 'Note saved successfully!');
      navigation.goBack(); 

      // Reset fields
      setTitle('');
      setNote('');
    } catch (error) {
      Alert.alert('Error', 'Failed to save note');
    }
  };

  return (
    <>
      <Appbar.Header style={styles.appBar}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="New Note" />
      </Appbar.Header>
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.headerText}>Create a Note</Text>

            {/* Title Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Title</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter title"
                value={title}
                onChangeText={setTitle}
              />
            </View>

            {/* Note Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Note</Text>
              <TextInput
                multiline
                numberOfLines={6}
                maxLength={500} // Adjusted max length
                style={styles.inputArea}
                placeholder="Write your note here..."
                value={note}
                onChangeText={setNote}
              />
            </View>

            {/* Save Button */}
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  inputArea: {
    width: '100%',
    height: 150,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    textAlignVertical: 'top', // Ensures text starts from the top
  },
  saveButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#2c3e50',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  appBar: {
    elevation: 4,
    shadowColor: '#000',
  },
});

export default NotesScreen;
