import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
  ScrollView,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const ServiceCardDetails = ({ selectedItem, showDataHeader, isShare, title }) => {
  const [showSensitiveInfo, setShowSensitiveInfo] = useState(false);
  if (!selectedItem) return null;

  const toggleSensitiveInfo = () => setShowSensitiveInfo(!showSensitiveInfo);

  const handleShare = async () => {
    try {
      let shareMessage = "";
      showDataHeader?.forEach((field) => {
        if (field.isVisible === 1 && field.headerKey !== "password") {
          shareMessage += `${field.headerValue}: ${selectedItem[field.headerKey] || "N/A"}\n`;
        }
      });
      await Share.share({ message: shareMessage });
    } catch (error) {
       // console.log("Error sharing:", error);
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.cardContainer}>
        <LinearGradient
          colors={['#4285F4', '#6366F1']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <MaterialIcons name="account-circle" size={24} color="white" />
              <Text style={styles.cardTitle}>{title}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity onPress={toggleSensitiveInfo} style={styles.actionButton}>
                <Ionicons name={showSensitiveInfo ? "eye-off" : "eye"} size={20} color="white" />
              </TouchableOpacity>
              {isShare === 1 && (
                <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
                  <Ionicons name="share-social" size={20} color="white" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </LinearGradient>

        <ScrollView style={styles.contentArea} showsVerticalScrollIndicator={false}>
          {showDataHeader?.map((field, index) =>
            field.isVisible === 1 ? (
              <View key={index}>
                <View style={styles.fieldHeader}>
                  <MaterialIcons
                    name={getFieldIcon(field.headerKey)}
                    size={18}
                    color="#4285F4"
                  />
                  <Text style={styles.label}>{field.headerValue}</Text>
                </View>
                <View style={styles.valueContainer}>
                  <Text style={styles.value}>
                    {showSensitiveInfo
                      ? selectedItem[field.headerKey] || "N/A"
                      : field.headerKey.toLowerCase().includes("password") ||
                        field.headerKey.toLowerCase().includes("pin")
                      ? "••••••••"
                      : selectedItem[field.headerKey] || "N/A"}
                  </Text>
                </View>
              </View>
            ) : null
          )}
        </ScrollView>
      </View>
    </View>
  );
};

// Helper function to get appropriate icon for field
const getFieldIcon = (fieldKey) => {
  const key = fieldKey.toLowerCase();
  if (key.includes('email')) return 'email';
  if (key.includes('password') || key.includes('pin')) return 'lock';
  if (key.includes('phone') || key.includes('mobile')) return 'phone';
  if (key.includes('account') || key.includes('number')) return 'account-balance';
  if (key.includes('name') || key.includes('user')) return 'person';
  if (key.includes('bank')) return 'account-balance-wallet';
  if (key.includes('url') || key.includes('website')) return 'language';
  return 'info';
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  cardContainer: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  headerGradient: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginLeft: 12,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  contentArea: {
    maxHeight: 400,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  fieldRow: {
    marginBottom: 16,
    padding: 16,
  },
  fieldHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4285F4",
    marginLeft: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  valueContainer: {
    backgroundColor: "white",
    padding: 12,
  },
  value: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    lineHeight: 22,
    marginLeft : '5%'
  },
});

export default ServiceCardDetails;
