import React from 'react';
import { View, Text,StyleSheet, Image } from 'react-native';

const Logo = () => {
  return (
    <View style={styles.walletLogoContain}>
      <Image source={require('../assets/wallet.png')} style={styles.walletIcon} />
      <Text style={styles.walletLogo}>Wallet's</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  walletLogoContain: {
    position: 'absolute',
    top: 100,
    alignItems: 'center',
  },
  walletIcon: {
    width: 50,
    height: 50,
  },
  walletLogo: {
    fontSize: 40,
    fontFamily: 'monospace',
    color: '#2c3e50',
    marginTop: 10,
  },
});

export default Logo;