import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Appbar, SegmentedButtons } from 'react-native-paper';
import { getAllEmailData, getAllAppAccountData, getAllNotePadData } from '../store/database';
import ShowList from '../components/ShowList';

const DigitalListScreen = ({ navigation }) => {
    const [selectedCategory, setSelectedCategory] = useState('Email');
    const [dataList, setDataList] = useState([]);

    useEffect(() => {
        fetchData(selectedCategory);
    }, [selectedCategory]);

    const fetchData = async (category) => {
        try {
            let data = [];
            if (category === 'Email') {
                data = await getAllEmailData();
            } else if (category === 'App_Details') {
                data = await getAllAppAccountData();
            } else if (category === 'NotePad') {
                data = await getAllNotePadData();
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
                <Appbar.Content title="Digital List" />
            </Appbar.Header>

            {/* Segmented Buttons for Category Selection */}
            <View style={styles.buttonContainer}>
                <SegmentedButtons
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                    buttons={[
                        { value: 'Email', label: 'Email' },
                        { value: 'App_Details', label: 'App Details' },
                        { value: 'NotePad', label: 'Notepad' },
                    ]}
                />
            </View>

            {/* Show List Component */}
            <View style={styles.content}>
                <ShowList title={selectedCategory.replace('_', ' ')} data={dataList} />
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

export default DigitalListScreen;