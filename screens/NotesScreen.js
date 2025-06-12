import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { insertQuery } from '../src/controller';

const NoteScreen = ({ navigation }) => {
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [status, setStatus] = useState('');
  const [reminder, setReminder] = useState(false);
  const [reminderType, setReminderType] = useState('');
  const [reminderValue, setReminderValue] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const dayOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleSave = async () => {
    if (!taskName || !description) {
      Alert.alert('Error', 'Task name and description are required');
      return;
    }

    let data = {
      taskName : taskName || '',
      description : description || '',
      category : category || '',
      priority : priority || '',
      dueDate : dueDate || null,
      status : 'PENDING',
      reminder : reminder ? 1 : 0,
      reminderType : reminderType || '',
      reminderValue : reminderValue || '',
    }

    try {
      await insertQuery('task', data);
      Alert.alert('Success', 'Task saved successfully!', [
        {
          text: 'OK',
          onPress: () => {
            // Navigate back and trigger refresh
            navigation.navigate('Dashboard', { refresh: true });
          }
        }
      ]);
    } catch (error) {
       // console.error('Error saving task:', error);
      Alert.alert('Error', 'Failed to save task. Please try again.');
    }
  };

  const renderReminderValueInput = () => {
    if (!reminder) return null;

    switch (reminderType) {
      case 'date':
        return (
          <>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
              <Text>{reminderValue ? reminderValue : 'Select Reminder Date'}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    const dateStr = selectedDate.toISOString().split('T')[0];
                    setReminderValue(dateStr);
                  }
                }}
              />
            )}
          </>
        );
      case 'day':
      case 'week':
        return (
          <View style={styles.input}>
            <Picker
              selectedValue={reminderValue}
              onValueChange={(value) => setReminderValue(value)}
              style={styles.picker}
            >
              <Picker.Item label="Select a day" value="" />
              {dayOptions.map((day) => (
                <Picker.Item key={day} label={day} value={day} />
              ))}
            </Picker>
          </View>
        );
      case 'daily':
      case 'monthly':
        return (
          <TextInput
            style={styles.input}
            placeholder="Enter reminder details"
            value={reminderValue}
            onChangeText={setReminderValue}
          />
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>CREATE TODO</Text>

      <TextInput
        style={styles.input}
        placeholder="Task Name"
        placeholderTextColor="#888"
        value={taskName}
        onChangeText={setTaskName}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        placeholderTextColor="#888"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Category"
        placeholderTextColor="#888"
        value={category}
        onChangeText={setCategory}
      />

      <View style={styles.input}>
        <Picker selectedValue={priority} onValueChange={(val) => setPriority(val)} style={styles.picker}>
          <Picker.Item label="Select Priority" value="" />
          <Picker.Item label="High" value="High" />
          <Picker.Item label="Medium" value="Medium" />
          <Picker.Item label="Low" value="Low" />
        </Picker>
      </View>

      {/* <View style={styles.input}>
        <Picker selectedValue={status} onValueChange={(val) => setStatus(val)} style={styles.picker}>
          <Picker.Item label="Select Status" value="" />
          <Picker.Item label="Pending" value="Pending" />
          <Picker.Item label="In Progress" value="In Progress" />
          <Picker.Item label="Completed" value="Completed" />
        </Picker>
      </View> */}

      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
        <Text>{dueDate ? dueDate.toDateString() : 'Select Due Date'}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={dueDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDueDate(selectedDate);
          }}
        />
      )}

      <View style={styles.row}>
        <Text style={styles.label}>Set Reminder</Text>
        <Switch value={reminder} onValueChange={setReminder} />
      </View>

      {reminder && (
        <View style={styles.input}>
          <Picker
            selectedValue={reminderType}
            onValueChange={(val) => {
              setReminderType(val);
              setReminderValue('');
            }}
            style={styles.picker}
          >
            <Picker.Item label="Select Reminder Type" value="" />
            <Picker.Item label="Date" value="date" />
            <Picker.Item label="Day" value="day" />
            <Picker.Item label="Week" value="week" />
            <Picker.Item label="Monthly" value="monthly" />
            <Picker.Item label="Daily" value="daily" />
          </Picker>
        </View>
      )}

      {renderReminderValueInput()}

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#ffffff',
    flexGrow: 1,
    alignItems: 'center',
  },
  header: {
    fontSize: 26,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50, // ✅ Uniform height for all inputs
    backgroundColor: '#fff',
    borderRadius: 12,
    borderColor: '#ddd',
    borderWidth: 1,
    paddingHorizontal: 15,
    justifyContent: 'center', // For vertical alignment
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#aaa',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  picker: {
    height: 50,
    color: '#333',
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#2c3e50',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default NoteScreen;
