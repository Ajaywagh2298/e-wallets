import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';


const BottomTabNavigator = ({menu}) => {
  const [activeTab, setActiveTab] = useState(menu);
  const navigation = useNavigation();

  const handlePress = (screen) => {
    setActiveTab(screen);
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBackground}>
        {/* Left Side Tabs */}
        {[
          { name: 'Finance', icon: <MCIcon name="bank-outline" size={30} /> },
          { name: 'Digital', icon: <MIcon name="device-hub" size={30} /> },
        ].map((item) => (
          <TouchableOpacity
            key={item.name}
            style={[styles.tabButton, activeTab === item.name && styles.activeTab]}
            onPress={() => handlePress(item.name)}
          >
            {activeTab === item.name && <View style={styles.activeIndicator}><View style={styles.activeDot} /></View>}
            {React.cloneElement(item.icon, { color: activeTab === item.name ? '#fff' : '#fff' })}
          </TouchableOpacity>
        ))}

        {/* Center Mic Button */}
        <View style={styles.micContainer}>
          <TouchableOpacity style={styles.micButton} onPress={() => handlePress('Dashboard')}>
            <MCIcon name="shield-home" size={45} color={'#2c3e50'} />
          </TouchableOpacity>
        </View>

        {/* Right Side Tabs */}
        {[
          { name: 'Other', icon: <MIcon name="extension" size={30} /> },
          { name: 'Profile', icon: <Icon name="user" size={30} /> },
        ].map((item) => (
          <TouchableOpacity
            key={item.name}
            style={[styles.tabButton, activeTab === item.name && styles.activeTab]}
            onPress={() => handlePress(item.name)}
          >
            {activeTab === item.name && <View style={styles.activeIndicator}><View style={styles.activeDot} /></View>}
            {React.cloneElement(item.icon, { color: activeTab === item.name ? '#fff' : '#fff' })}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '94%',
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '3%',
    marginBottom: '3%'
  },
  tabBackground: {
    flexDirection: 'row',
    width: '100%',
    height: 70,
    backgroundColor: '#2c3e50',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingVertical: 12,
  },
  activeIndicator: {
    position: 'absolute',
    top: -30,
    width: 20,
    height: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDot: {
    width: 15,
    height: 15,
    backgroundColor: '#2c3e50',
    borderRadius: 100,
  },
  micContainer: {
    position: 'relative',
    bottom: 20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  micButton: {
    backgroundColor: '#fff',
    width: 65,
    height: 65,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
});

export default BottomTabNavigator;