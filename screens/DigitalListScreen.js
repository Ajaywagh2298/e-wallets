import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { selectQuery } from '../src/controller';
import { decrypt } from '../src/utils';
import ShowList from '../components/ShowList';

const DigitalListScreen = ({ titleKey, tableKey }) => {
    const [selectedCategory, setSelectedCategory] = useState(tableKey);
    const [title, setTitle] = useState(titleKey);
    const [dataList, setDataList] = useState([]);


    useEffect(() => {
        fetchData(selectedCategory);
    }, [selectedCategory]);

    const fetchData = async (category) => {
        try {
            let data = [];
            let processedCategory = category || 'Email'; // Default fallback

            switch (processedCategory) {
                case 'email_details':
                    data = await selectQuery('email_details',{},'*',{ orderType : 'companyType'});
                    data = await Promise.all(data.map( async ( item) => ({
                        companyName: item.companyName || '',
                        accountHolderName: item.accountHolderName ? await decrypt(item.accountHolderName) : '',
                        email: item.emailId ? await decrypt(item.emailId) : '',
                        password: item.password ? await decrypt(item.password) : ''
                    })))
                    break;
                case 'app_accounts':
                    data = await selectQuery('app_accounts',{},'*',{ orderType : 'appName'});
                    data = await Promise.all(data.map( async ( item) => ({
                        appName: item.appName || '',
                        username: item.username ? await decrypt(item.username) : '',
                        password: item.password ? await decrypt(password) : '',
                        loginMethod : loginMethod || '',
                        faEnabled: item.faEnabled ? 'Yes' : 'No',
                        securityQuestion: item.securityQuestion ? await decrypt(item.securityQuestion) : '',
                        phone: item.phone ? await decrypt(item.phone) : '',
                        notes: item.notes ? await decrypt(item.notes) : '',
                    })))
                    break;
                case 'task':
                    data = await selectQuery('task');
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
                <ShowList title={selectedCategory.replace(/_/g, ' ')} tableKey={selectedCategory}
                key={selectedCategory}
                data={dataList} />
        </>
    );
    
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
    },
});

export default DigitalListScreen;
