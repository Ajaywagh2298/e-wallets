import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Dimensions, Modal, TouchableOpacity, Share } from 'react-native';
import { Card, Provider as PaperProvider, Button } from 'react-native-paper';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { selectQuery } from '../src/controller';
import CreditCardDetails from './CreditCardDetails';
import ServiceCardDetails from './ServiceCardDetails';

const screenWidth = Dimensions.get('window').width;

// Updated color scheme to match DashboardScreen
const subjectColors = ['#4285F4', '#34A853', '#FBBC04', '#EA4335', '#9C27B0', '#FF9800'];
const subjectIcons = {
  'Bank Account': 'bank',
  'Credit Card': 'credit-card',
  'Debit Card': 'credit-card-outline',
  'Net Banking': 'desktop-mac',
  'Demat': 'chart-line',
  'Card Details': 'credit-card',
  'Email': 'email',
  'App Details': 'application',
};

const ShowList = ({ title, tableKey, data }) => {

  const [listSetting, setListSetting] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const initSetting = async () => {
      setLoading(true);
      try {
        //let sync = await getFilteredConfig('title', title);
        let sync = await selectQuery('config', {
          table_key: {
            value: tableKey,
            filter: 'equal',
            dataType: 'text',
          }
        }, '*', { orderBy: 'title' });
        if (sync?.length > 0) {
          sync = sync.map(sc => ({
            ...sc,
            mainHeader: JSON.parse(sc.mainHeader || '[]'),
            showDataHeader: JSON.parse(sc.showDataHeader || '[]'),
          }));
          setListSetting(sync);
        }
      } catch (error) {
         // console.error("Error loading settings:", error);
      }
      setLoading(false);
    };
    initSetting();
  }, [title]);


  const listConfig = listSetting.find(item => item.table_key === tableKey);

  if (loading) return <ActivityIndicator size="large" color="#6200ee" style={styles.loading} />;
  if (!listConfig) return <Text style={styles.errorText}>Invalid List Setting</Text>;

  const { mainHeader, showDataHeader, isShare, isVisible } = listConfig;

  const handleShare = async (item) => {
    let shareText = showDataHeader
      .filter(field => field.isVisible === 1)
      .map(field => `${field.headerValue}: ${item[field.headerKey] || 'N/A'}`)
      .join('\n');

    try {
      await Share.share({ message: shareText });
    } catch (error) {
       // console.error('Error sharing:', error);
    }
  };

  const renderItem = ({ item, index }) => {
    const color = subjectColors[index % subjectColors.length];
    const icon = subjectIcons[title] || 'bank';

    return (
      <TouchableOpacity
        onPress={() => setSelectedItem(item)}
        style={styles.cardTouchable}
        activeOpacity={0.8}
      >
        {/* Beautiful gradient card with glassmorphism effect */}
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          {/* Left colored accent bar */}
          <View style={[styles.accentBar, { backgroundColor: color }]} />

          {/* Card content */}
          <View style={styles.cardContent}>
            {/* Icon section with floating effect */}
            <View style={styles.iconSection}>
              <LinearGradient
                colors={[color, `${color}CC`]}
                style={styles.iconContainer}
              >
                <MaterialCommunityIcons name={icon} size={24} color="white" />
              </LinearGradient>
              <View style={styles.cardNumber}>
                <Text style={styles.cardNumberText}>#{String(index + 1).padStart(2, '0')}</Text>
              </View>
            </View>

            {/* Text content */}
            <View style={styles.textSection}>
              {mainHeader.length > 0 && (
                <>
                  <Text style={styles.primaryText} numberOfLines={1}>
                    {item[mainHeader[0]?.headerValue] || 'N/A'}
                  </Text>
                  <Text style={styles.secondaryText} numberOfLines={1}>
                    {item[mainHeader[1]?.headerValue] || 'N/A'}
                  </Text>

                  {/* Status indicator */}
                  <View style={styles.statusContainer}>
                    <View style={[styles.statusDot, { backgroundColor: color }]} />
                    <Text style={styles.statusText}>Active</Text>
                  </View>
                </>
              )}
            </View>

            {/* Action section */}
            <View style={styles.actionSection}>
              <View style={styles.actionButton}>
                <MaterialIcons name="arrow-forward-ios" size={16} color={color} />
              </View>
            </View>
          </View>

          {/* Bottom shine effect */}
          <LinearGradient
            colors={['transparent', 'rgba(66, 133, 244, 0.1)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.shineEffect}
          />
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        {/* Header with gradient background */}
        <LinearGradient
          colors={['#4285F4', '#6366F1']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <Text style={styles.header}>{title}</Text>
          <Text style={styles.headerSubtitle}>Total : {data.length}</Text>
        </LinearGradient>

        {isVisible === 1 ? (
          <FlatList
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.restrictionContainer}>
            <MaterialIcons name="visibility-off" size={48} color="#FF9800" />
            <Text style={styles.restrictionTitle}>Access Restricted</Text>
            <Text style={styles.restrictionText}>Data viewing is currently disabled for this section</Text>
          </View>
        )}

        {/* Modal for details view */}
        {selectedItem && (
          <Modal visible={!!selectedItem} transparent animationType="fade">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                {title === "Card Details" ? (
                  <CreditCardDetails cardData={selectedItem} />
                ) : (
                  <ServiceCardDetails
                    selectedItem={selectedItem}
                    showDataHeader={showDataHeader}
                    isShare={isShare}
                    title={title}
                  />
                )}
              </View>

              {/* Close Button */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedItem(null)}
              >
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
    backgroundColor: '#F5F5F5',
    width: screenWidth,
    alignSelf: 'center',
  },

  // Header Gradient Styles
  headerGradient: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
    width: '80%',
    marginLeft: '10%',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },

  // Beautiful Card Styles
  cardTouchable: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  card: {
    borderRadius: 20,
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
    overflow: 'hidden',
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingLeft: 26, // Account for accent bar
  },

  // Icon Section
  iconSection: {
    alignItems: 'center',
    marginRight: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  cardNumber: {
    marginTop: 8,
    backgroundColor: 'rgba(66, 133, 244, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  cardNumberText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#4285F4',
  },

  // Text Section
  textSection: {
    flex: 1,
    marginRight: 12,
  },
  primaryText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  secondaryText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#4285F4',
    fontWeight: '600',
  },

  // Action Section
  actionSection: {
    justifyContent: 'center',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(66, 133, 244, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Shine Effect
  shineEffect: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 30,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },

  // Restriction Styles
  restrictionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  restrictionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  restrictionText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default ShowList;
