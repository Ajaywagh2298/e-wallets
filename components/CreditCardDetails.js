import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Share,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

const getRandomColor = () => {
  const colors = [
    ["#4285F4", "#6366F1"], // Google Blue gradient (matches dashboard)
    ["#34A853", "#4CAF50"], // Green gradient
    ["#9C27B0", "#E91E63"], // Purple-Pink gradient
    ["#FF9800", "#FF5722"], // Orange-Red gradient
    ["#00BCD4", "#009688"], // Cyan-Teal gradient
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const getRandomChipColor = () => {
  const chipColors = [
    "#FBBC04", // Google Yellow (matches dashboard)
    "#EA4335", // Google Red
    "#34A853", // Google Green
    "#FF9800", // Orange
    "#9C27B0", // Purple
  ];
  return chipColors[Math.floor(Math.random() * chipColors.length)];
};

const CreditCardDetails = ({ cardData, onClose }) => {
  const [showSensitiveInfo, setShowSensitiveInfo] = useState(false);
  const [cardColors, setCardColors] = useState(getRandomColor());
  const [chipColor, setChipColor] = useState(getRandomChipColor());

  useEffect(() => {
    setCardColors(getRandomColor());
    setChipColor(getRandomChipColor());
  }, []);

  // Toggle visibility for sensitive data
  const toggleSensitiveInfo = () => {
    setShowSensitiveInfo(!showSensitiveInfo);
  };

  // Share Card Details (excluding CVV & PIN)
  const shareCard = async () => {
    try {
      await Share.share({
        message: `Bank: ${cardData.bankName}\nCard Number: ${maskCardNumber(cardData.cardNumber)}\nValid Thru: ${cardData.validDate}\nCard Holder: ${cardData.cardHolderName}`,
      });
    } catch (error) {
       // console.log("Error sharing:", error);
    }
  };

  // Format card number into groups of 4
  const formatCardNumber = (number) => {
    return number.replace(/\s+/g, "").replace(/(\d{4})/g, "$1 ").trim();
  };

  // Function to mask sensitive data
  const maskValue = (value, visibleLength = 0, maskChar = "*") => {
    if (showSensitiveInfo) return value;
    return `${maskChar.repeat(value.length - visibleLength)}${value.slice(-visibleLength)}`;
  };

  // Masked Card Number (shows only last 4 digits)
  const maskCardNumber = (number) => {
    if (!showSensitiveInfo) {
      return "**** **** **** " + number.slice(-4);
    }
    return formatCardNumber(number);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={cardColors} style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.bankName}>{cardData.bankName}</Text>
          <View style={styles.iconRow}>
            <TouchableOpacity onPress={toggleSensitiveInfo} style={styles.iconButton}>
              <Ionicons name={showSensitiveInfo ? "eye-off" : "eye"} size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={shareCard} style={styles.iconButton}>
              <Ionicons name="share-social" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Card Body */}
        <View style={styles.cardBody}>
          <View style={[styles.chip, { backgroundColor: chipColor }]} />
          <Text style={styles.cardNumber}>{maskCardNumber(cardData.cardNumber)}</Text>
          <View style={styles.row}>
            <View>
              <Text style={styles.label}>CARD HOLDER</Text>
              <Text style={styles.cardHolder}>{cardData.cardHolderName}</Text>
            </View>
            <View>
              <Text style={styles.label}>EXPIRES</Text>
              <Text style={styles.expiry}>{cardData.validDate}</Text>
            </View>
          </View>
        </View>

        {/* CVV, PIN & Card Type Positioned */}
        <View style={styles.bottomRow}>
          <View style={styles.bottomItem}>
            <Text style={styles.label}>PIN</Text>
            <Text style={styles.sensitiveValue}>{maskValue(cardData.pin, 1)}</Text>
          </View>
          <View style={styles.bottomItemCenter}>
            <Text style={styles.label}>CVV</Text>
            <Text style={styles.sensitiveValue}>{maskValue(cardData.cvv, 1)}</Text>
          </View>
          <View style={styles.bottomItem}>
            <Text style={styles.cardBrand}>{cardData.cardType}</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  card: {
    width: width * 0.92,
    height: 270,
    borderRadius: 18,
    padding: 22,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bankName: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  iconRow: {
    flexDirection: "row",
    gap: 12,
  },
  iconButton: {
    padding: 6,
  },
  cardBody: {
    flex: 1,
    justifyContent: "center",
  },
  chip: {
    width: 50,
    height: 35,
    borderRadius: 6,
    marginBottom: 14,
    marginTop: 10,
  },
  cardNumber: {
    fontSize: 32,
    color: "#fbfcfc",
    fontWeight: "bold",
    letterSpacing: 2,
    marginBottom: 10,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
  },
  bottomItem: {
    width: "30%", // Adjust for proper alignment
    alignItems: "center",
  },
  bottomItemCenter: {
    width: "40%", // Center alignment for CVV
    alignItems: "center",
  },
  label: {
    fontSize: 12,
    color: "#fbfcfc",
    fontWeight: "bold",
    letterSpacing: 1,
  },
  cardHolder: {
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
    marginTop: 4,
  },
  expiry: {
    fontSize: 16,
    color: "#fbfcfc",
    fontWeight: "bold",
    marginTop: 4,
  },
  sensitiveValue: {
    fontSize: 18,
    color: "#fbfcfc",
    fontWeight: "bold",
    letterSpacing: 1.5,
    marginTop: 4,
  },
  cardBrand: {
    fontSize: 20,
    color: "#fbfcfc",
    fontWeight: "bold",
    alignSelf: "flex-end",
  },
});

export default CreditCardDetails;
