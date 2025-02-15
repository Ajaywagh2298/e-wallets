import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Appbar, SegmentedButtons } from 'react-native-paper';
import { getAllBankAccountData, getAllCardDetailsData, getAllNetBankingData, getAllDematData } from '../store/database';
import ShowList from '../components/ShowList';

const FinanceListScreen = ({ navigation }) => {
    const [selectedCategory, setSelectedCategory] = useState('Bank_Account');
    const [dataList, setDataList] = useState([]);

    useEffect(() => {
        fetchData(selectedCategory);
    }, [selectedCategory]);

    const fetchData = async (category) => {
        try {
            let data = [];
            let processedCategory = category;  // To avoid invalid state updates inside JSX

            if (category === 'Bank_Account') {
                data = await getAllBankAccountData();
            } else if (category === 'Credit_Card_Details' || category === 'Debit_Card_Details') {
                data = await getAllCardDetailsData();
                data = data.filter((item) => item.cardType === (category === 'Credit_Card_Details' ? 'Credit Card' : 'Debit Card'));
                processedCategory = 'Card Details'; // Ensure correct title
            } else if (category === 'Demat') {
                data = await getAllDematData();
            } else if (category === 'Net_Banking') {
                data = await getAllNetBankingData();
            }

            setDataList(data || []);
        } catch (error) {
            console.error(`Failed to load ${category} data:`, error);
        }
    };

    return (
        <LinearGradient colors={['#ffffff', '#f2f2f2']} style={styles.container}>
            {/* Custom Appbar */}
            <Appbar.Header style={styles.appBar}>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Finance List" />
            </Appbar.Header>

            {/* Segmented Buttons for Category Selection */}
            <View style={styles.buttonContainer}>
                <SegmentedButtons
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                    buttons={[
                        { value: 'Bank_Account', label: 'Bank Account' },
                        { value: 'Net_Banking', label: 'Net Banking' },
                        { value: 'Debit_Card_Details', label: 'Debit Card Details' },
                        { value: 'Credit_Card_Details', label: 'Credit Card Details' },
                        { value: 'Demat', label: 'Demat' }
                    ]}
                />
            </View>

            {/* Show List Component */}
            <View style={styles.content}>
                {
                    ['Debit_Card_Details', 'Credit_Card_Details'].includes(selectedCategory) ?
                        <ShowList title={'Card Details'} data={dataList} /> :
                        <ShowList title={selectedCategory.replace(/_/g, ' ')} data={dataList} />
                }

            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    appBar: {
        elevation: 4,
    },
    buttonContainer: {
        paddingHorizontal: 16,
        marginTop: 10,
    },
    content: {
        flex: 1,
        padding: 16,
    }
});

export default FinanceListScreen;
