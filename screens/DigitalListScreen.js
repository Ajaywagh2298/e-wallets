import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { getAllEmailData, getAllAppAccountData, getAllNotePadData, getAllDigitalListData } from '../src/database';
import ShowList from '../components/ShowList';

const DigitalListScreen = ({ type }) => {
    const [selectedCategory, setSelectedCategory] = useState(type);
    const [dataList, setDataList] = useState([]);

    console.log('DigitalListScreen:', selectedCategory);

    useEffect(() => {
        fetchData(selectedCategory);
    }, [selectedCategory]);

    const fetchData = async (category) => {
        try {
            let data = [];
            let processedCategory = category || 'Email'; // Default fallback

            switch (processedCategory) {
                case 'Email':
                    data = await getAllEmailData();
                    break;
                case 'App_Details':
                    data = await getAllAppAccountData();
                    break;
                case 'NotePad':
                    data = await getAllNotePadData();
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
            {selectedCategory !== 'Wi-Fi' ? (
                <ShowList title={selectedCategory.replace(/_/g, ' ')} data={dataList} />
            ) : null}
        </>
    );
    
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
    },
});

export default DigitalListScreen;
