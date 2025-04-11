import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Share } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card, Button } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";

// Function to get random gradient colors
const getRandomGradient = () => {
    const gradients = [
        ["#4B6CB7", "#4B6CB7"], // Blue
        ["#11998E", "#11998E"], // Green
        ["#833AB4", "#833AB4"], // Purple-Pink
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
};

const ServiceCardDetails = ({ selectedItem, showDataHeader, isShare, title }) => {
    const [showSensitiveInfo, setShowSensitiveInfo] = useState(false);
    const [cardColors, setCardColors] = useState(getRandomGradient()); // Store random color for consistency

    if (!selectedItem) return null;

    // Toggle visibility for sensitive data
    const toggleSensitiveInfo = () => setShowSensitiveInfo(!showSensitiveInfo);

    // Share Card Details (excluding sensitive info)
    const handleShare = async () => {
        try {
            let shareMessage = "";
            showDataHeader.forEach((field) => {
                if (field.isVisible === 1 && field.headerKey !== "password") {
                    shareMessage += `${field.headerValue}: ${selectedItem[field.headerKey] || "N/A"}\n\n`; // Added spacing
                }
            });

            await Share.share({ message: shareMessage });
        } catch (error) {
            console.log("Error sharing:", error);
        }
    };

    return (
        <View style={styles.modalOverlay} visible={!!selectedItem}>
            <View style={styles.modalContainer}>
                <LinearGradient colors={cardColors} style={styles.card}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.cardTitle}>{title}</Text>
                        <View style={styles.iconRow}>
                            <TouchableOpacity onPress={toggleSensitiveInfo} style={styles.iconButton}>
                                <Ionicons name={showSensitiveInfo ? "eye-off" : "eye"} size={24} color="white" />
                            </TouchableOpacity>
                            {isShare === 1 && (
                            <TouchableOpacity  onPress={handleShare} style={styles.iconButton}>
                              <Ionicons name="share-social" size={24} color="white" />
                            </TouchableOpacity>
                        )}
                        </View>
                    </View>

                    {/* Card Details */}
                    <Card.Content>
                        {Array.isArray(showDataHeader) &&
                            showDataHeader.map((field, index) =>
                                field.isVisible === 1 ? (
                                    <Text key={index} style={styles.detailText}>
                                        <Text style={styles.bold}>{field.headerValue} :  </Text>
                                        <Text style={styles.bold}>{selectedItem?.[field.headerKey] || "N/A"} </Text>
                                    </Text>
                                ) : null
                            )}
                    </Card.Content>
                </LinearGradient>
            </View>
        </View>
    );
};

// Styles
const styles = StyleSheet.create({
    modalOverlay: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 50,
    },
    modalContainer: {
        width: "90%",
        borderRadius: 12,
        overflow: "hidden",
    },
    card: {
        padding: 20,
        borderRadius: 12,
        elevation: 5,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "white",
    },
    iconRow: {
        flexDirection: "row",
        gap: 12,
    },
    iconButton: {
        padding: 6,
    },
    detailText: {
        fontSize: 16,
        color: "white",
        marginBottom: 20, // Added space between lines
    },
    bold: {
        fontWeight: "bold",
        color: "white",
    },
});

export default ServiceCardDetails;