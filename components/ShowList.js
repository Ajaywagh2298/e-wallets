import React, { useState, useEffect } from 'react';
import { 
  View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, Share, ActivityIndicator
} from 'react-native';
import { Card, Button, Provider as PaperProvider } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';
import { getFilteredConfig } from '../store/database';

// Main Component
const ShowList = ({ title, data }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [listSetting, setListSetting] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initSetting = async () => {
      setLoading(true);
      try {
        let sync = await getFilteredConfig('title', title);
        if (sync && sync.length > 0) {
          sync = sync.map(sc => ({
            ...sc,
            mainHeader: JSON.parse(sc.mainHeader),
            showDataHeader: JSON.parse(sc.showDataHeader),
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

  if (loading) {
    return <ActivityIndicator size="large" color="#6200ee" style={styles.loading} />;
  }

  if (!listConfig) {
    return <Text style={styles.errorText}>Invalid List Setting</Text>;
  }

  const { mainHeader, showDataHeader, isShare } = listConfig;

  const handleShare = async (item) => {
    let shareText = showDataHeader
      .map(field => `${field.headerValue}: ${item[field.headerKey] || ''}`)
      .join('\n');

    try {
      await Share.share({ message: shareText });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        {/* List Header */}
        <Text style={styles.header}>{title}</Text>

        {/* Data List */}
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity 
              style={styles.listItem} 
              activeOpacity={0.7} 
              onPress={() => setSelectedItem(item)}
            >
              <View style={styles.card}>
                <View style={styles.leftSection}>
                  <Text style={styles.serial}>{index + 1}.</Text>
                </View>
                <View style={styles.centerSection}>
                  <Text style={styles.mainHeaderText}>
                    {mainHeader[0]?.headerValue}:
                  </Text>
                  <Text style={styles.mainText}>
                    {item[mainHeader[0]?.headerKey] || 'N/A'}
                  </Text>
                </View>
                <View style={styles.rightSection}>
                  <Feather name="chevron-right" size={22} color="#777" />
                </View>
              </View>
            </TouchableOpacity>
          )}
        />

        {/* Detail Modal */}
        <Modal visible={!!selectedItem} animationType="fade" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Card style={styles.card}>
                <Card.Title title={title} titleStyle={styles.cardTitle} />
                <Card.Content>
                  {showDataHeader.map((field, index) => (
                    field.isVisible === 1 && (
                    <Text key={index} style={styles.detailText}>
                      <Text style={styles.bold}>{field.headerValue}: </Text>
                      {selectedItem?.[field.headerKey] || 'N/A'}
                    </Text>
                    )
                  ))}
                </Card.Content>
                <Card.Actions>
                  {isShare === 1 && (
                    <Button icon="share-variant" onPress={() => handleShare(selectedItem)}>
                      Share
                    </Button>
                  )}
                  <Button onPress={() => setSelectedItem(null)} style={styles.cancelbtn}>
                    Close
                  </Button>
                </Card.Actions>
              </Card>
            </View>
          </View>
        </Modal>
      </View>
    </PaperProvider>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#222',
  },
  listItem: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  leftSection: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serial: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
  },
  centerSection: {
    flex: 1,
    justifyContent: 'center',
  },
  mainHeaderText: {
    fontSize: 14,
    color: '#888',
    fontWeight: '500',
  },
  mainText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 2,
  },
  rightSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 16,
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  detailText: {
    fontSize: 16,
    marginBottom: 8,
  },
  bold: {
    fontWeight: 'bold',
    color: '#333',
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
    marginTop: 20,
  },
  loading: {
    marginTop: 20,
  },
  cancelbtn: {
    backgroundColor: '#2c3e50',
  },
});

export default ShowList;
