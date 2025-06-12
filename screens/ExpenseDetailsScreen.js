import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

import { insertQuery } from '../src/controller';

const ExpenseDetailsScreen = ({ navigation }) => {
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [category, setCategory] = useState('');
    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [monthlyLimit, setMonthlyLimit] = useState('');
    const [notes, setNotes] = useState('');
    const [customCategory, setCustomCategory] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const [customPaymentMethod, setCustomPaymentMethod] = useState('');


    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) setDate(selectedDate);
    };

    const handleSubmit = async () => {
        if (!category || !amount || !paymentMethod) {
            Alert.alert('Validation Error', 'Please fill all required fields.');
            return;
        }

        const finalCategory = category === 'Other' ? customCategory : category;
        const finalPaymentMethod = paymentMethod === 'Other' ? customPaymentMethod : paymentMethod;

        try {
            await insertQuery(
                'expense_details',
                {
                    transactionId,
                    date: date.toISOString().split('T')[0],
                    category: finalCategory,
                    amount: parseInt(amount),
                    paymentMethod: finalPaymentMethod,
                    monthlyLimit: monthlyLimit ? parseFloat(monthlyLimit) : 0,
                    notes
                });

            Alert.alert('Success', 'Expense added successfully!', [
                {
                    text: 'OK',
                    onPress: () => {
                        // Navigate back to dashboard and trigger refresh
                        navigation.navigate('Dashboard', { refresh: true });
                    }
                }
            ]);
        } catch (err) {
             // console.error('Insert Error:', err);
            Alert.alert('Error', 'Failed to save expense');
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Date</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateInput}>
                    <Text style={styles.dateText}>{date.toDateString()}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker value={date} mode="date" display="default" onChange={handleDateChange} />
                )}
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Category*</Text>
                <Picker
                    selectedValue={category}
                    onValueChange={(value) => {
                        setCategory(value);
                        if (value !== 'Other') setCustomCategory('');
                    }}
                    style={styles.picker}
                >
                    <Picker.Item label="Select category" value="" />
                    <Picker.Item label="Food" value="Food" />
                    <Picker.Item label="Travel" value="Travel" />
                    <Picker.Item label="Shopping" value="Shopping" />
                    <Picker.Item label="Bills" value="Bills" />
                    <Picker.Item label="Others" value="Others" />
                    <Picker.Item label="Other (Specify)" value="Other" />
                </Picker>

                {category === 'Other' && (
                    <TextInput
                        style={[styles.input, { marginTop: 10 }]}
                        placeholder="Enter custom category"
                        value={customCategory}
                        onChangeText={setCustomCategory}
                    />
                )}
            </View>


            <View style={styles.inputGroup}>
                <Text style={styles.label}>Amount*</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter amount"
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Payment Method*</Text>
                <Picker
                    selectedValue={paymentMethod}
                    onValueChange={(value) => {
                        setPaymentMethod(value);
                        if (value !== 'Other') setCustomPaymentMethod('');
                    }}
                    style={styles.picker}
                >
                    <Picker.Item label="Select method" value="" />
                    <Picker.Item label="Cash" value="Cash" />
                    <Picker.Item label="Card" value="Card" />
                    <Picker.Item label="UPI" value="UPI" />
                    <Picker.Item label="Bank Transfer" value="Bank Transfer" />
                    <Picker.Item label="Other (Specify)" value="Other" />
                </Picker>

                {paymentMethod === 'Other' && (
                    <TextInput
                        style={[styles.input, { marginTop: 10 }]}
                        placeholder="Enter custom payment method"
                        value={customPaymentMethod}
                        onChangeText={setCustomPaymentMethod}
                    />
                )}
            </View>


            <View style={styles.inputGroup}>
                <Text style={styles.label}>Monthly Limit</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Set a limit (optional)"
                    keyboardType="numeric"
                    value={monthlyLimit}
                    onChangeText={setMonthlyLimit}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>transaction ID </Text>
                <TextInput
                    style={styles.input}
                    placeholder="Transaction ID (if any)"
                    keyboardType="text"
                    value={transactionId}
                    onChangeText={setTransactionId}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Notes</Text>
                <TextInput
                    style={[styles.input, styles.notesInput]}
                    placeholder="Any additional notes..."
                    multiline
                    numberOfLines={4}
                    value={notes}
                    onChangeText={setNotes}
                />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Save Expense</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default ExpenseDetailsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: 16
    },
    content: {
        paddingBottom: 40
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 20,
        color: '#2c3e50'
    },
    inputGroup: {
        marginBottom: 20
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 6,
        color: '#34495e'
    },
    input: {
        backgroundColor: '#fff',
        padding: 14,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        fontSize: 16
    },
    notesInput: {
        height: 100,
        textAlignVertical: 'top'
    },
    dateInput: {
        backgroundColor: '#fff',
        padding: 14,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        justifyContent: 'center'
    },
    dateText: {
        fontSize: 16,
        color: '#333'
    },
    picker: {
        backgroundColor: '#fff',
        borderRadius: 8
    },
    button: {
        backgroundColor: '#2c3e50',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
        elevation: 3
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff'
    }
});
