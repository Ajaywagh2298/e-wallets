import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { getAllBankAccountData, getAllCardDetailsData, getAllNetBankingData, getAllDematData } from '../store/database';
import ShowList from '../components/ShowList';

const FinanceListScreen = ({ type }) => {
    const [selectedCategory, setSelectedCategory] = useState(type);
    const [dataList, setDataList] = useState([]);
    console.log('FinanceListScreen:', selectedCategory);
    useEffect(() => {
        fetchData(selectedCategory);
    }, [selectedCategory]);

    const fetchData = async (category) => {
        try {
            let data = [];
            let processedCategory = category || 'Bank_Account';  // Ensure it's always valid

            switch (processedCategory) {
                case 'Bank_Account':
                    data = await getAllBankAccountData();
                    break;
                case 'Credit_Card_Details':
                case 'Debit_Card_Details':
                    data = await getAllCardDetailsData();
                    data = data.filter((item) => item.cardType === (processedCategory === 'Credit_Card_Details' ? 'Credit Card' : 'Debit Card'));
                    processedCategory = 'Card Details';
                    break;
                case 'Demat':
                    data = await getAllDematData();
                    break;
                case 'Net_Banking':
                    data = await getAllNetBankingData();
                    break;
                default:
                    console.warn(`Unknown category: ${processedCategory}`);
            }

            setDataList(data || []);
        } catch (error) {
            console.error(`Failed to load ${category} data:`, error);
        }
    };

    return (
        <>
                {
                    ['Debit_Card_Details', 'Credit_Card_Details'].includes(selectedCategory) ?
                        <ShowList title={'Card Details'} data={dataList} /> :
                        <ShowList title={selectedCategory.replace(/_/g, ' ')} data={dataList} />
        }
        </>
    );
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
    },
});

export default FinanceListScreen;
