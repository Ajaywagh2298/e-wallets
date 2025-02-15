import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const FinanceScreen = ({ navigation }) => {
  const menuItems = [
    { id: '1', title: 'Bank Account', screen: 'BankAccountScreen', src: require('../assets/ba.png'), path :'Bank Account' },
    { id: '2', title: 'Credit Card', screen: 'CreditCardScreen', src: require('../assets/cc.png') , path :'Card' , setValue : { cardType: 'Credit Card' }},
    { id: '3', title: 'Debit Card', screen: 'CreditCardScreen', src: require('../assets/dc.png') , path :'Card' , setValue : { cardType: 'Debit Card' }},
    { id: '4', title: 'Net Banking', screen: 'NetBankingScreen', src: require('../assets/nt.jpg'), path :'Net Banking'  },
    { id: '5', title: 'Demat', screen: 'DematScreen', src: require('../assets/dmart.png'), path :'Demat Screen'  },
    // { id: '6', title: 'Other', screen: 'OtherScreen', src: require('../assets/ot.png'), path :'Bank Account'  },
    { id: '7', title: 'List', screen: 'FinanceListScreen', src: require('../assets/list.png') , path :'Finance List' },
  ];

  return (
    <LinearGradient colors={['#fbfcfc', '#fbfcfc']} style={styles.container}>
      <View style={styles.header}>
      </View>
      <FlatList
        data={menuItems}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() =>{ item.setValue ? navigation.navigate(item.path,item.setValue) : navigation.navigate(item.path)}}>
            <Image source={item.src} style={styles.icon} />
            <Text style={styles.cardText}>{item.title}</Text>
            <Text style={styles.subText}>Manage your {item.title.toLowerCase()}</Text>
          </TouchableOpacity>
        )}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50,
  },
  header: {
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  card: {
    width: '45%',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  icon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000',
  },
  subText: {
    fontSize: 14,
    color: '#000',
  },
});

export default FinanceScreen;
