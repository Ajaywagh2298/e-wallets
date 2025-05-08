import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

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
      console.log("Error sharing:", error);
    }
  };

  return (
    <View style={styles.wrapper}>
      {/* Decorative blur container */}
      <BlurView intensity={100} tint="light" style={styles.cardContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.cardTitle}>{title}</Text>
          <View style={styles.actions}>
            <TouchableOpacity onPress={toggleSensitiveInfo}>
              <Ionicons name={showSensitiveInfo ? "eye-off" : "eye"} size={22} color="#444" />
            </TouchableOpacity>
            {isShare === 1 && (
              <TouchableOpacity onPress={handleShare} style={{ marginLeft: 14 }}>
                <Ionicons name="share-social-outline" size={22} color="#444" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <ScrollView contentContainerStyle={{ paddingVertical: 10 }}>
          {showDataHeader?.map((field, index) =>
            field.isVisible === 1 ? (
              <View key={index} style={styles.fieldRow}>
                <Text style={styles.label}>{field.headerValue}</Text>
                <Text style={styles.value}>
                  {showSensitiveInfo
                    ? selectedItem[field.headerKey] || "N/A"
                    : field.headerKey.toLowerCase().includes("password") ||
                      field.headerKey.toLowerCase().includes("pin")
                    ? "••••••"
                    : selectedItem[field.headerKey] || "N/A"}
                </Text>
              </View>
            ) : null
          )}
        </ScrollView>
      </BlurView>
    </View>
  );
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
    borderRadius: 20,
    padding: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderColor: "rgba(255,255,255,0.3)",
    borderWidth: 1,
    overflow: "hidden",
    elevation: 8,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#273746",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  fieldRow: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: "#273746",
    marginBottom: 2,
  },
  value: {
    fontSize: 16,
    fontWeight: "500",
    color: "#273746",
  },
});

export default ServiceCardDetails;
