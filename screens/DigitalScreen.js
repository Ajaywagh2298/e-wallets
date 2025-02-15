import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const DigitalScreen = ( { navigation }  ) => {
    const menuItems = [
        { id: '1', title: 'Email', screen: 'EmailScreen', src: require('../assets/gmail.png'), path :'Email' },
        { id: '2', title: 'App Account', screen: 'AppScreen', src: require('../assets/app.png') , path :'App' },
        { id: '3', title: 'Notes', screen: 'NotesScreen', src: require('../assets/note.png') , path :'Notes' },
        { id: '4', title: 'Wi-Fi', screen: 'WifiScreen', src: require('../assets/wifi.png') , path :'Wifi' },
        { id: '5', title: 'List', screen: 'CreditCardScreen', src: require('../assets/list.png') , path :'Digital List' },
      ];
    return(
    <LinearGradient colors={['#fbfcfc', '#fbfcfc']} style={styles.container}>
          <View style={styles.header}>
          </View>
          <FlatList
            data={menuItems}
            numColumns={2}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.card} onPress={() => navigation.navigate(item.path)}>
                <Image source={item.src} style={styles.icon} />
                <Text style={styles.cardText}>{item.title}</Text>
                <Text style={styles.subText}>Manage your {item.title.toLowerCase()}</Text>
              </TouchableOpacity>
            )}
          />
   
   </LinearGradient>)
}

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

  
export default DigitalScreen;