import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import ShowList from '../components/ShowList';
import { selectQuery } from '../src/controller';
import { decrypt } from '../src/utils';

const FinanceListScreen = ({ titleKey, tableKey }) => {
     // console.log('FinanceListScreen:', tableKey, titleKey);
    const [selectedCategory, setSelectedCategory] = useState(tableKey);
    const [title, setTitle] = useState(titleKey);
    const [dataList, setDataList] = useState([]);

    useEffect(() => {
        fetchData(selectedCategory);
    }, [selectedCategory]);

    const fetchData = async (category) => {
        try {
            let data = [];
            let processedCategory = category || 'bank_account';

            switch (processedCategory) {
                case 'bank_account':
                    data = await selectQuery('bank_account', {}, '*', { orderBy: 'bankName' });
                    data = await Promise.all(data.map(async (item) => ({
                        bankName: item.bankName || '',
                        accountNumber: item.accountNumber ? await decrypt(item.accountNumber) : '',
                        accountType: item.accountType || '',
                        accountHolderName: item.accountHolderName ? await decrypt(item.accountHolderName) : '',
                        branch: item.branch || '',
                        branchAddress: item.branchAddress || '',
                        city: item.city || '',
                        ifscCode: item.ifscCode ? await decrypt(item.ifscCode) : '',
                        cifCode: item.cifCode ? await decrypt(item.cifCode) : '',
                        micrCode: item.micrCode ?  await decrypt(item.micrCode) : '',
                        mobileNumber: item.mobileNumber ? await decrypt(item.mobileNumber) : "",
                        nomineeName: item.nomineeName ? await decrypt(item.nomineeName) : "",
                        upiId: item.upiId ? await decrypt(item.upiId) : '',
                        notes: item.notes ? await decrypt(item.notes) : '',
                    })));
                    break;
                case 'Credit_Card_Details':
                case 'Debit_Card_Details':
                    data = await selectQuery('card_details', {}, '*', { orderBy: 'bankName' });
                    const cardTypeToFilter = processedCategory === 'Credit_Card_Details' ? 'Credit Card' : 'Debit Card';
                    data = data.filter((item) => item.cardType === cardTypeToFilter);
                    data = await Promise.all(data.map(async (item) => ({
                        bankName: item.bankName,
                        cardNumber: item.cardNumber ? await decrypt(item.cardNumber) : '',
                        cvv: item.cvv ? await decrypt(item.cvv) : '',
                        validDate: item.validDate ? item.validDate : '',
                        cardHolderName: item.cardHolderName ? await decrypt(item.cardHolderName) : '',
                        pin: item.pin ? await decrypt(item.pin) : '',
                        cardType: item.cardType ? item.cardType : '',
                        cardUserType: item.cardUserType,
                        billingAddress: item.billingAddress ? await decrypt(item.billingAddress) : '',
                        cardLimit: item.cardLimit ? await decrypt(item.cardLimit) : '',
                        notes: item.notes ? await decrypt(item.notes) : '',
                    })));
                    break;
                case 'demat':
                    data = await selectQuery('demat', {}, '*', { orderBy: 'brokerName' });
                    break;
                case 'net_banking':
                    data = await selectQuery('net_banking', {}, '*', { orderBy: 'bankName' });
                    break;
                case 'expense_details':
                    data = await selectQuery('expense_details', {}, '*', { orderBy: 'date' });
                    break;
                default:
                    console.warn(`Unknown category: ${processedCategory}`);
            }

            setDataList(data || []);
        } catch (error) {
             // console.error(`Failed to load ${category} data:`, error);
        }
    };

    return (
        <>
            {['Debit_Card_Details', 'Credit_Card_Details'].includes(selectedCategory) ? (
                <ShowList
                    title="Card Details"
                    tableKey={'card_details'}
                    key={selectedCategory}
                    data={dataList}
                />
                ) : (
                <ShowList
                    title={selectedCategory.replace(/_/g, ' ')}
                    tableKey={selectedCategory}
                    key={selectedCategory}
                    data={dataList}
                />
            )}
        </>
    );
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
    },
});

export default FinanceListScreen;
