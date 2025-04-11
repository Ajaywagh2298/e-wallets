import React from 'react';
import { View, Text,StyleSheet, Image } from 'react-native';

const Logo = () => {
  return (
    <View style={styles.walletLogoContain}>
      <Image source={require('../assets/wallet.png')} style={styles.walletIcon} />
      {/* <Text style={styles.walletLogo}>Wallet's</Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  walletLogoContain: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletIcon: {
    marginTop : 20,
    width: 350,
    height: 350,
  },
  walletLogo: {
    fontSize: 40,
    fontFamily: 'monospace',
    color: '#ffffff',
    marginTop: 10,
  },
});

export default Logo;