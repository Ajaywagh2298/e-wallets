import React, { useState } from 'react';
import { 
    View, Text, TextInput, StyleSheet, TouchableOpacity, 
    ScrollView, Alert 
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { createTable, insertEmailData } from '../store/database';
import { MaterialIcons } from '@expo/vector-icons';

const EmailScreen = ({ navigation }) => {
    const [companyType, setCompanyType] = useState('Google');
    const [customCompany, setCustomCompany] = useState('');
    const [accountHolderName, setAccountHolderName] = useState('');
    const [emailId, setEmailId] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Email validation function
    const isValidEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async () => {
        if (!accountHolderName || !emailId || !password) {
            Alert.alert('Error', 'All fields are required');
            return;
        }
        if (!isValidEmail(emailId)) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }
        const companyName = companyType === 'Other' ? customCompany : companyType;

        try {
            await insertEmailData(companyName, accountHolderName, emailId, password);
            Alert.alert('Success', 'Form submitted and saved successfully!');
            navigation.navigate('Dashboard');

            setAccountHolderName('');
            setEmailId('');
            setPassword('');
            setCustomCompany('');
            setShowPassword(false);
        } catch (error) {
            Alert.alert('Error', 'Failed to save data');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.innerContainer}>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <Text style={styles.headerText}>Email Account Form</Text>

                    {/* Company Type Dropdown */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Company Type</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={companyType}
                                onValueChange={(itemValue) => setCompanyType(itemValue)}
                                style={styles.picker}
                            >
                                <Picker.Item label="Google" value="Google" />
                                <Picker.Item label="Yahoo" value="Yahoo" />
                                <Picker.Item label="Hotmail" value="Hotmail" />
                                <Picker.Item label="Outlook" value="Outlook" />
                                <Picker.Item label="Rediff Mail" value="Rediff Mail" />
                                <Picker.Item label="Other" value="Other" />
                            </Picker>
                        </View>
                    </View>

                    {/* Custom Company Name (Only if 'Other' is selected) */}
                    {companyType === 'Other' && (
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Custom Company Name</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter Company Name"
                                value={customCompany}
                                onChangeText={setCustomCompany}
                            />
                        </View>
                    )}

                    {/* Account Holder Name */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Account Holder Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Account Holder Name"
                            value={accountHolderName}
                            onChangeText={setAccountHolderName}
                        />
                    </View>

                    {/* Email ID with validation */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email ID</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Email ID"
                            value={emailId}
                            onChangeText={setEmailId}
                            keyboardType="email-address"
                        />
                        {!isValidEmail(emailId) && emailId !== '' && (
                            <Text style={styles.errorText}>Invalid email format</Text>
                        )}
                    </View>

                    {/* Password with toggle visibility */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Password</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                placeholder="Enter Password"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <MaterialIcons
                                    name={showPassword ? 'visibility' : 'visibility-off'}
                                    size={24}
                                    color="gray"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                        <Text style={styles.submitButtonText}>Submit</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </View>
    );
};

// Styles
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
    pickerContainer: {
        width: '100%',
        height: 50,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        justifyContent: 'center',
    },
    picker: {
        width: '100%',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        paddingHorizontal: 15,
        height: 50,
        backgroundColor: '#fff',
    },
    passwordInput: {
        flex: 1,
        fontSize: 16,
    },
    submitButton: {
        width: '100%',
        height: 50,
        backgroundColor: '#2c3e50',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    submitButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginTop: 5,
    },
});

export default EmailScreen;
