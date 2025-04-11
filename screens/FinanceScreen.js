import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Animated, Dimensions, Image  } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import BottomTabNavigator from '../components/BottomTabNavigator';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FinanceListScreen from './FinanceListScreen';
import Logo from '../assets/appLogo.png'
const { width, height } = Dimensions.get('window');
const ITEM_WIDTH = width / 3; 
const CENTER_POSITION = width / 2 - ITEM_WIDTH / 2;

const menuItems = [
  { id: '1', title: 'Bank Account', icon: 'account-balance', path: 'Bank Account', data: 'Bank_Account' },
  { id: '2', title: 'Credit Card', icon: 'credit-card', path: 'Card', data: 'Credit_Card_Details', setValue: { cardType: 'Credit Card' } },
  { id: '3', title: 'Debit Card', icon: 'credit-card', path: 'Card', data: 'Debit_Card_Details', setValue: { cardType: 'Debit Card' } },
  { id: '4', title: 'Net Banking', icon: 'language', path: 'Net Banking', data: 'Net_Banking' },
  { id: '5', title: 'Demat', icon: 'graphic-eq', path: 'Demat Screen', data: 'Demat' }
];

const LOOP_OFFSET = menuItems.length;
const loopedMenuItems = [...menuItems, ...menuItems, ...menuItems];

const CircularMenu = ({ navigation, onSelect }) => {
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [selectedIndex, setSelectedIndex] = useState(LOOP_OFFSET);

  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToOffset({ offset: ITEM_WIDTH * LOOP_OFFSET, animated: false });
    }, 100);
  }, []);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const onScrollEnd = (event) => {
    let contentOffsetX = event.nativeEvent.contentOffset.x;
    let index = Math.round(contentOffsetX / ITEM_WIDTH);

    if (index < LOOP_OFFSET) {
      index = index + menuItems.length;
      flatListRef.current?.scrollToOffset({ offset: ITEM_WIDTH * index, animated: false });
    }
    if (index >= LOOP_OFFSET + menuItems.length) {
      index = index - menuItems.length;
      flatListRef.current?.scrollToOffset({ offset: ITEM_WIDTH * index, animated: false });
    }

    setSelectedIndex(index);
    onSelect(menuItems[index % menuItems.length]);
  };

  return (
    <LinearGradient colors={['#4A67F0', '#4A67F0']} style={styles.circleContainer}>
      <View style={styles.header}>
        <Image source={Logo} style={styles.logoImg} />
      </View>
      <FlatList
        ref={flatListRef}
        data={loopedMenuItems}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        snapToInterval={ITEM_WIDTH}
        contentContainerStyle={styles.menuContainer}
        onScroll={handleScroll}
        onMomentumScrollEnd={onScrollEnd}
        renderItem={({ item, index }) => {
          const isSelected = index === selectedIndex;
          return (
            <TouchableOpacity
              style={[styles.menuItem, isSelected && styles.selectedMenuItem]}
              onPress={() => {
                setSelectedIndex(index);
                onSelect(item);
                navigation.navigate(item.path, item.setValue || {});
              }}
            >
              <Icon
                name={item.icon}
                style={[styles.icon, isSelected && styles.selectedIcon]}
                size={35}
                color="#fff"
              />
              <Text style={[styles.title, isSelected && styles.selectedTitle]}>{item.title}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </LinearGradient>
  );
};

const FinanceScreen = ({ navigation }) => {
  const [selectedMenuItem, setSelectedMenuItem] = useState(menuItems[0]);

  return (
    <>
      <CircularMenu navigation={navigation} onSelect={setSelectedMenuItem} />
      <LinearGradient colors={['#fbfcfc', '#fbfcfc']} style={styles.container}>
        <FinanceListScreen key={selectedMenuItem.data} type={selectedMenuItem.data} />
      </LinearGradient>
      <BottomTabNavigator menu={'Finance'} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    margin: 10,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  selectedItemText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  circleContainer: {
    height: '28%',
    borderBottomLeftRadius: 300,
    borderBottomRightRadius: 300,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '2%',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  header: {
    position: 'absolute',
    top: '10%',
    alignItems: 'center',
    fontSize: 30,
  },
  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  menuContainer: {
    paddingTop: '24%',
    paddingHorizontal: CENTER_POSITION,
  },
  menuItem: {
    width: ITEM_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  selectedMenuItem: {
    transform: [{ scale: 1.1 }],
  },
  icon: {
    width: width / 6,
    height: width / 6,
    borderRadius: 100,
    backgroundColor: '#4A67F0',
    textAlign: 'center',
    textAlignVertical: 'center',
    borderWidth: 5,
    borderColor: '#fff',
    marginBottom: 5,
  },
  logoImg : {
    width: width / 2.3,
    height: width / 6,
    backgroundColor: '#3B4CCA',
    marginBottom: 8,
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 12,
  },
  selectedTitle: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default FinanceScreen;