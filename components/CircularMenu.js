import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width / 3; // Width of each item
const CENTER_OFFSET = (width - ITEM_WIDTH) / 2; // Calculate center position

const menuItems = [
  { id: '1', title: 'Bank', screen: 'BankAccountScreen', icon: 'account-balance' },
  { id: '2', title: 'Credit', screen: 'CreditCardScreen', icon: 'credit-card' },
  { id: '3', title: 'Debit', screen: 'DebitCardScreen', icon: 'credit-card' },
  { id: '4', title: 'NetBank', screen: 'NetBankingScreen', icon: 'language' },
  { id: '5', title: 'Demat', screen: 'DematScreen', icon: 'graphic-eq' },
  { id: '6', title: 'List', screen: 'FinanceListScreen', icon: 'list' },
];

// Duplicate items to create an infinite scrolling effect
const extendedMenu = [...menuItems, ...menuItems, ...menuItems];

const CircularMenu = ({ navigation }) => {
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [selectedIndex, setSelectedIndex] = useState(menuItems.length); // Start in middle

  // Handle scroll animation
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  // Ensure infinite scrolling works smoothly
  const onScrollEnd = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / ITEM_WIDTH);

    if (index >= menuItems.length * 2) {
      flatListRef.current.scrollToOffset({ offset: ITEM_WIDTH * menuItems.length, animated: false });
    } else if (index < menuItems.length) {
      flatListRef.current.scrollToOffset({ offset: ITEM_WIDTH * menuItems.length, animated: false });
    }
  };

  // Move selected item to the exact center
  const handleSelectItem = (index) => {
    setSelectedIndex(index);

    // Calculate center offset correctly
    const exactOffset = index * ITEM_WIDTH - CENTER_OFFSET;

    flatListRef.current.scrollToOffset({
      offset: exactOffset,
      animated: true,
    });

    // Navigate to screen
    navigation.navigate(menuItems[index % menuItems.length].screen);
  };

  return (
    <LinearGradient colors={['#4A67F0', '#3B4CCA']} style={styles.container}>
      {/* Greeting Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Hi User</Text>
      </View>

      {/* Scrollable Circular Menu */}
      <FlatList
        ref={flatListRef}
        data={extendedMenu}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToAlignment="center"
        pagingEnabled
        decelerationRate="fast"
        snapToInterval={ITEM_WIDTH}
        contentContainerStyle={styles.menuContainer}
        initialScrollIndex={menuItems.length} // Start in the middle
        getItemLayout={(data, index) => ({
          length: ITEM_WIDTH,
          offset: ITEM_WIDTH * index,
          index,
        })}
        onScroll={handleScroll}
        onMomentumScrollEnd={onScrollEnd}
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 1) * ITEM_WIDTH,
            index * ITEM_WIDTH,
            (index + 1) * ITEM_WIDTH,
          ];

          // Make center item more visible
          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.9, 0.9, 0.9], // Increased center scale
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [1, 1, 1], // Increased brightness in center
            extrapolate: 'clamp',
          });

          return (
            <Animated.View style={[styles.menuItem, { transform: [{ scale }], opacity }]}>
              <TouchableOpacity onPress={() => handleSelectItem(index)}>
                <Icon
                  name={item.icon}
                  style={[
                    styles.icon,
                    selectedIndex === index && styles.selectedIcon, // Apply selected effect
                  ]}
                  size={50}
                  color="#fff"
                />
                <Text style={[styles.title, selectedIndex === index && styles.selectedTitle]}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          );
        }}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 210,
    borderBottomLeftRadius: 200,
    borderBottomRightRadius: 200,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  header: {
    position: 'absolute',
    top: 40,
    alignItems: 'center',
  },
  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  menuContainer: {
    paddingTop: '25%',
    borderRadius: 200,
    position: 'relative',
  },
  menuItem: {
    width: ITEM_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#3B4CCA',
    textAlign: 'center',
    textAlignVertical: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  title: {
    marginTop: 5,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CircularMenu;
