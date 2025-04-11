import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Dimensions, Modal, TouchableOpacity, Share } from 'react-native';
import { Card, Provider as PaperProvider, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { getFilteredConfig } from '../store/database';
import CreditCardDetails from './CreditCardDetails';
import ServiceCardDetails from './ServiceCardDetails';

const screenWidth = Dimensions.get('window').width;

const subjectColors = ['#2ecc71', '#3498db', '#9b59b6', '#f1c40f', '#e74c3c', '#34495e'];
const subjectIcons = {
  'Bank Account': 'bank',
  'Credit Card': 'credit-card',
  'Debit Card': 'credit-card-outline',
  'Net Banking': 'desktop-mac',
  'Demat': 'chart-line',
};

const ShowList = ({ title, data }) => {
  const [listSetting, setListSetting] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const initSetting = async () => {
      setLoading(true);
      try {
        let sync = await getFilteredConfig('title', title);
        if (sync?.length > 0) {
          sync = sync.map(sc => ({
            ...sc,
            mainHeader: JSON.parse(sc.mainHeader || '[]'),
            showDataHeader: JSON.parse(sc.showDataHeader || '[]'),
          }));
          setListSetting(sync);
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      }
      setLoading(false);
    };
    initSetting();
  }, [title]);

  const listConfig = listSetting.find(item => item.title === title);
  if (loading) return <ActivityIndicator size="large" color="#6200ee" style={styles.loading} />;
  if (!listConfig) return <Text style={styles.errorText}>Invalid List Setting</Text>;

  const { mainHeader, showDataHeader, isShare } = listConfig;

  const handleShare = async (item) => {
    let shareText = showDataHeader
      .filter(field => field.isVisible === 1)
      .map(field => `${field.headerValue}: ${item[field.headerKey] || 'N/A'}`)
      .join('\n');

    try {
      await Share.share({ message: shareText });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const renderItem = ({ item, index }) => {
    const color = subjectColors[index % subjectColors.length];
    const icon = subjectIcons[title] || 'bank';

    return (
      <TouchableOpacity onPress={() => setSelectedItem(item)}>
        <Card style={styles.card}>
          <View style={styles.cardContent}>
            <View style={[styles.iconContainer, { backgroundColor: color }]}>
              <MaterialCommunityIcons name={icon} size={28} color="white" />
            </View>
            <View style={styles.textContainer}>
              {mainHeader.length > 0 && (
                <>
                  <Text style={styles.mainText}>{mainHeader[0]?.headerValue}</Text>
                  <Text style={styles.subText}>{item[mainHeader[0]?.headerKey] || 'N/A'}</Text>
                </>
              )}
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.header}>{title}</Text>
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />

        {selectedItem && (
          <Modal visible={!!selectedItem} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {/* Render components conditionally */}
              {title === "Card Details" ? (
                <>
                  <CreditCardDetails cardData={selectedItem} />
                </>
              ) : (
                <>
                  <ServiceCardDetails
                    selectedItem={selectedItem}
                    showDataHeader={showDataHeader}
                    isShare={isShare}
                    title={ title }
                  />
                </>
              )}
        
             
            </View>
             {/* Close Button */}
             <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedItem(null)}>
                <MaterialCommunityIcons name="close-circle" size={30} color="white" />
              </TouchableOpacity>
          </View>
        </Modal>        
        )}
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    backgroundColor: '#F7F9FC',
    width: screenWidth - 24,
    alignSelf: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#222',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderBottomLeftRadius: 50,
    borderTopLeftRadius: 50,
    marginLeft: 10,
    marginRight: 10,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  mainText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  subText: {
    fontSize: 15,
    color: '#666',
    marginTop: 2,
  },
  time: {
    fontSize: 14,
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContent: {
    width: "90%",
    backgroundColor: "transparent", // Ensures the card has no extra background
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 50,
    padding: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
  detailText: {
    fontSize: 16,
    color: '#333',
    marginVertical: 4,
  },
  bold: {
    fontWeight: 'bold',
  },
  cancelbtn: {
    backgroundColor: '#e74c3c',
    color: 'white',
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ShowList;
