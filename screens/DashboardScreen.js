import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Modal, Alert, RefreshControl } from 'react-native';
import { Feather, FontAwesome, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator } from 'react-native-paper';
import BottomTabNavigator from '../components/BottomTabNavigator';
import { selectQuery, monthlyExpense } from '../src/controller';
import { getCurrentMonthReminders, getReminderStats, completeReminder, deleteReminder } from '../src/reminderController';
import Svg, { Circle, Path, Text as SvgText } from 'react-native-svg';

const { width } = Dimensions.get('window');

// Amazing Pie Chart Component
const PieChart = ({ data }) => {
  const colors = ['#4285F4', '#34A853', '#FBBC04', '#EA4335', '#9C27B0', '#FF9800'];
  const size = 200;
  const strokeWidth = 40;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;

  if (!data || data.length === 0) {
    return (
      <View style={styles.emptyChart}>
        <MaterialIcons name="pie-chart" size={64} color="#E0E0E0" />
        <Text style={styles.emptyChartText}>No payment data available</Text>
      </View>
    );
  }

  // Calculate angles for each slice
  let cumulativePercentage = 0;
  const slices = data.map((item, index) => {
    const percentage = parseFloat(item.percentage);
    const startAngle = cumulativePercentage * 3.6; // Convert percentage to degrees
    const endAngle = (cumulativePercentage + percentage) * 3.6;
    cumulativePercentage += percentage;

    return {
      ...item,
      startAngle,
      endAngle,
      color: colors[index % colors.length],
      percentage
    };
  });

  // Create SVG path for each slice
  const createPath = (startAngle, endAngle, radius, center) => {
    const start = polarToCartesian(center, center, radius, endAngle);
    const end = polarToCartesian(center, center, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
      "M", center, center,
      "L", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      "Z"
    ].join(" ");
  };

  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  return (
    <View style={styles.chartContainer}>
      {/* SVG Pie Chart */}
      <View style={styles.pieChartWrapper}>
        <Svg width={size} height={size} style={styles.pieChart}>
          {slices.map((slice, index) => (
            <Path
              key={index}
              d={createPath(slice.startAngle, slice.endAngle, radius, center)}
              fill={slice.color}
              stroke="white"
              strokeWidth="2"
            />
          ))}
          {/* Center circle for donut effect */}
          <Circle
            cx={center}
            cy={center}
            r={radius * 0.6}
            fill="white"
            stroke="#F0F0F0"
            strokeWidth="1"
          />
          {/* Center text */}
          <SvgText
            x={center}
            y={center - 10}
            textAnchor="middle"
            fontSize="16"
            fontWeight="bold"
            fill="#333"
          >
            Total
          </SvgText>
          <SvgText
            x={center}
            y={center + 10}
            textAnchor="middle"
            fontSize="14"
            fill="#666"
          >
          {data.reduce((sum, item) => sum + item.totalAmount, 0).toLocaleString('en-IN')}
          </SvgText>
        </Svg>
      </View>

      {/* Legend */}
      <View style={styles.chartLegend}>
        {slices.map((slice, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: slice.color }]} />
            <View style={styles.legendText}>
              <Text style={styles.legendMethod}>{slice.paymentMethod}</Text>
              <Text style={styles.legendAmount}>₹{slice.totalAmount.toLocaleString('en-IN')} ({slice.percentage}%)</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

// Category Pie Chart Component
const CategoryPieChart = ({ data }) => {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
  const size = 200;
  const strokeWidth = 40;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;

  if (!data || data.length === 0) {
    return (
      <View style={styles.emptyChart}>
        <MaterialIcons name="pie-chart" size={64} color="#E0E0E0" />
        <Text style={styles.emptyChartText}>No category data available</Text>
      </View>
    );
  }

  // Calculate angles for each slice
  let cumulativePercentage = 0;
  const slices = data.map((item, index) => {
    const percentage = parseFloat(item.percentage);
    const startAngle = cumulativePercentage * 3.6;
    const endAngle = (cumulativePercentage + percentage) * 3.6;
    cumulativePercentage += percentage;

    return {
      ...item,
      startAngle,
      endAngle,
      color: colors[index % colors.length],
      percentage
    };
  });

  // Create SVG path for each slice
  const createPath = (startAngle, endAngle, radius, center) => {
    const start = polarToCartesian(center, center, radius, endAngle);
    const end = polarToCartesian(center, center, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
      "M", center, center,
      "L", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      "Z"
    ].join(" ");
  };

  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  return (
    <View style={styles.chartContainer}>
      {/* SVG Pie Chart */}
      <View style={styles.pieChartWrapper}>
        <Svg width={size} height={size} style={styles.pieChart}>
          {slices.map((slice, index) => (
            <Path
              key={index}
              d={createPath(slice.startAngle, slice.endAngle, radius, center)}
              fill={slice.color}
              stroke="white"
              strokeWidth="2"
            />
          ))}
          {/* Center circle for donut effect */}
          <Circle
            cx={center}
            cy={center}
            r={radius * 0.6}
            fill="white"
            stroke="#F0F0F0"
            strokeWidth="1"
          />
          {/* Center text */}
          <SvgText
            x={center}
            y={center - 10}
            textAnchor="middle"
            fontSize="16"
            fontWeight="bold"
            fill="#333"
          >
            Category
          </SvgText>
          <SvgText
            x={center}
            y={center + 10}
            textAnchor="middle"
            fontSize="14"
            fill="#666"
          >
            {data.reduce((sum, item) => sum + item.totalAmount, 0).toLocaleString('en-IN')}
          </SvgText>
        </Svg>
      </View>

      {/* Legend */}
      <View style={styles.chartLegend}>
        {slices.map((slice, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: slice.color }]} />
            <View style={styles.legendText}>
              <Text style={styles.legendMethod}>{slice.category}</Text>
              <Text style={styles.legendAmount}>₹{slice.totalAmount.toLocaleString('en-IN')} ({slice.percentage}%)</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

// Reminder Component
const ReminderCard = ({ reminders, stats, onReminderClick }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#FF5722';
      case 'Medium': return '#FF9800';
      case 'Low': return '#4CAF50';
      default: return '#9E9E9E';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'High': return 'priority-high';
      case 'Medium': return 'remove';
      case 'Low': return 'keyboard-arrow-down';
      default: return 'radio-button-unchecked';
    }
  };

  if (!reminders || reminders.length === 0) {
    return (
      <View style={styles.emptyReminders}>
        <MaterialIcons name="event-note" size={48} color="#E0E0E0" />
        <Text style={styles.emptyRemindersText}>No reminders this month</Text>
      </View>
    );
  }

  return (
    <View style={styles.reminderContainer}>
      {/* Stats Header */}
      <View style={styles.reminderStatsHeader}>
        <View style={styles.reminderStatItem}>
          <Text style={styles.reminderStatNumber}>{stats.total || 0}</Text>
          <Text style={styles.reminderStatLabel}>Total</Text>
        </View>
        <View style={styles.reminderStatItem}>
          <Text style={[styles.reminderStatNumber, { color: '#FF5722' }]}>{stats.high || 0}</Text>
          <Text style={styles.reminderStatLabel}>High</Text>
        </View>
        <View style={styles.reminderStatItem}>
          <Text style={[styles.reminderStatNumber, { color: '#FF9800' }]}>{stats.medium || 0}</Text>
          <Text style={styles.reminderStatLabel}>Medium</Text>
        </View>
        <View style={styles.reminderStatItem}>
          <Text style={[styles.reminderStatNumber, { color: '#4CAF50' }]}>{stats.low || 0}</Text>
          <Text style={styles.reminderStatLabel}>Low</Text>
        </View>
      </View>

      {/* Reminder List */}
      <ScrollView style={styles.reminderList} showsVerticalScrollIndicator={false}>
        {reminders.slice(0, 5).map((reminder, index) => (
          <TouchableOpacity
            key={reminder.uid || index}
            style={styles.reminderItem}
            onPress={() => onReminderClick && onReminderClick(reminder)}
            activeOpacity={0.7}
          >
            <View style={styles.reminderItemHeader}>
              <View style={styles.reminderPriorityBadge}>
                <MaterialIcons
                  name={getPriorityIcon(reminder.priority)}
                  size={16}
                  color={getPriorityColor(reminder.priority)}
                />
                <Text style={[styles.reminderPriorityText, { color: getPriorityColor(reminder.priority) }]}>
                  {reminder.priority}
                </Text>
              </View>
              <Text style={styles.reminderCategory}>{reminder.category || 'General'}</Text>
            </View>

            <Text style={styles.reminderTitle}>{reminder.taskName}</Text>
            <Text style={styles.reminderDescription} numberOfLines={2}>
              {reminder.description}
            </Text>

            <View style={styles.reminderFooter}>
              <View style={styles.reminderTypeInfo}>
                <MaterialIcons name="schedule" size={14} color="#666" />
                <Text style={styles.reminderTypeText}>
                  {reminder.reminderType === 'date' && reminder.reminderValue
                    ? new Date(reminder.reminderValue).toLocaleDateString('en-IN')
                    : reminder.reminderValue || 'Reminder set'
                  }
                </Text>
              </View>
              <Text style={[styles.reminderStatus,
                { color: reminder.status === 'Completed' ? '#4CAF50' : '#FF9800' }]}>
                {reminder.status}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {reminders.length > 5 && (
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View All {reminders.length} Reminders</Text>
          <MaterialIcons name="arrow-forward" size={16} color="#4285F4" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const DashboardScreen = ({ navigation }) => {
  const [bankAccounts, setBankAccounts] = useState([]);
  const [cardDetails, setCardDetails] = useState([]);
  const [netBanking, setNetBanking] = useState([]);
  const [task, setTask] = useState([]);
  const [monthExpense, setMonthExpense] = useState([]);
  const [expense, setExpense] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalExpense, setTotalExpense] = useState([]);
  const [paymentMethodsData, setPaymentMethodsData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [reminderStats, setReminderStats] = useState({});
  const [selectedReminder, setSelectedReminder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  // Add focus listener to refresh data when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
            loadData();
    });

    return unsubscribe;
  }, [navigation]);

  // Listen for route params to trigger refresh
  useEffect(() => {
    if (navigation.getState()?.routes?.find(route => route.name === 'Dashboard')?.params?.refresh) {
      loadData();
      // Clear the refresh parameter
      navigation.setParams({ refresh: false });
    }
  }, [navigation]);

  // Pull to refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const loadData = async () => {
    try {
      const banks = await selectQuery('bank_account');
      const cards = await selectQuery('card_details');
      const netBanks = await selectQuery('net_banking');
      const tasks = await selectQuery('task');
      let year = new Date().getFullYear();
      let month = new Date().getMonth() + 1;
      const expenses = await monthlyExpense(year, month);
      const totalExpense = expenses.reduce((acc, expense) => acc + parseFloat(expense.amount), 0);
      const monthlyLimit = expenses.reduce((acc, expense) => acc + parseFloat(expense.monthlyLimit), 0);
      const grouped = expenses.reduce((acc, expense) => {
        const method = expense.paymentMethod;
        const amount = parseFloat(expense.amount) || 0;
        acc[method] = (acc[method] || 0) + amount;
        return acc;
      }, {});
      
      const paymentMethodsArray = Object.entries(grouped).map(([paymentMethod, totalAmount]) => ({
        paymentMethod,
        totalAmount,
        percentage: totalExpense > 0 ? ((totalAmount / totalExpense) * 100).toFixed(1) : 0
      }));

      // Process category data
      const categoryGrouped = expenses.reduce((acc, expense) => {
        const category = expense.category || 'Uncategorized';
        const amount = parseFloat(expense.amount) || 0;
        acc[category] = (acc[category] || 0) + amount;
        return acc;
      }, {});

      const categoryArray = Object.entries(categoryGrouped).map(([category, totalAmount]) => ({
        category,
        totalAmount,
        percentage: totalExpense > 0 ? ((totalAmount / totalExpense) * 100).toFixed(1) : 0
      }));

      setBankAccounts(banks || []);
      setCardDetails(cards || []);
      setNetBanking(netBanks || []);
      setTask(tasks || []);
      setExpense(expenses || []);
      setMonthExpense(totalExpense);
      setTotalExpense(monthlyLimit);
      setPaymentMethodsData(paymentMethodsArray);
      setCategoryData(categoryArray);

      // Load reminder data
      const currentReminders = await getCurrentMonthReminders();
      const stats = await getReminderStats();
      setReminders(currentReminders);
      setReminderStats(stats);
    } catch (error) {
       // console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle reminder click
  const handleReminderClick = (reminder) => {
    setSelectedReminder(reminder);
    setModalVisible(true);
  };

  // Handle complete reminder
  const handleCompleteReminder = async () => {
    if (!selectedReminder) return;

    try {
      const success = await completeReminder(selectedReminder.uid);
      if (success) {
        Alert.alert('Success', 'Reminder marked as completed!');
        setModalVisible(false);
        setSelectedReminder(null);
        // Reload data to refresh the list
        loadData();
      } else {
        Alert.alert('Error', 'Failed to complete reminder');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to complete reminder');
    }
  };

  // Handle delete reminder
  const handleDeleteReminder = async () => {
    if (!selectedReminder) return;

    Alert.alert(
      'Delete Reminder',
      'Are you sure you want to delete this reminder?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('deleteReminder', selectedReminder.uid);
              const success = await deleteReminder(selectedReminder.uid);
              if (success) {
                Alert.alert('Success', 'Reminder deleted successfully!');
                setModalVisible(false);
                setSelectedReminder(null);
                // Reload data to refresh the list
                loadData();
              } else {
                Alert.alert('Error', 'Failed to delete reminder');
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to delete reminder');
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating={true} size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading Dashboard...</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#4285F4']}
            tintColor="#4285F4"
          />
        }
      >

        {/* Refresh Indicator */}
        {refreshing && (
          <View style={styles.refreshIndicator}>
            <ActivityIndicator size="small" color="#4285F4" />
            <Text style={styles.refreshText}>Refreshing data...</Text>
          </View>
        )}

        {/* Header Section with Gradient */}
        <LinearGradient
          colors={['#4285F4', '#6366F1']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeText}>Welcome back!</Text>
              <Text style={styles.welcomeSubtext}>Your secure digital wallet</Text>
            </View>
            <View style={styles.vaultIconContainer}>
              <MaterialIcons name="fingerprint" size={32} color="white" />
            </View>
          </View>

          <View style={styles.vaultStatusCard}>
            <View style={styles.vaultStatusContent}>
              <MaterialIcons name="security" size={24} color="#4285F4" />
              <View style={styles.vaultStatusText}>
                <Text style={styles.vaultStatusTitle}>Vault Status</Text>
                <Text style={styles.vaultStatusSubtitle}>Secured & Encrypted</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        <Text style={styles.sectionTitle}>Quick Access</Text>

        <View style={styles.quickAccess}>
          <TouchableOpacity style={styles.quickItem} onPress={() => navigation.navigate('Bank Account')}>
            <View style={[styles.quickItemIcon, { backgroundColor: '#E3F2FD' }]}>
              <FontAwesome name="university" size={24} color="#4285F4" />
            </View>
            <Text style={styles.quickLabel}>Bank Accounts</Text>
            <Text style={styles.quickCount}>{bankAccounts.length}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickItem} onPress={() => navigation.navigate('Expense Details')}>
            <View style={[styles.quickItemIcon, { backgroundColor: '#E8F5E8' }]}>
              <MaterialCommunityIcons name="account-cash" size={24} color="#4CAF50" />
            </View>
            <Text style={styles.quickLabel}>Expenses</Text>
            <Text style={styles.quickCount}>{expense.length}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickItem} onPress={() => navigation.navigate('Net Banking')}>
            <View style={[styles.quickItemIcon, { backgroundColor: '#FFF3E0' }]}>
              <Feather name="key" size={24} color="#FF9800" />
            </View>
            <Text style={styles.quickLabel}>Net Banking</Text>
            <Text style={styles.quickCount}>{netBanking.length}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickItem} onPress={() => navigation.navigate('Notes')}>
            <View style={[styles.quickItemIcon, { backgroundColor: '#F3E5F5' }]}>
              <MaterialCommunityIcons name="note-text-outline" size={24} color="#9C27B0" />
            </View>
            <Text style={styles.quickLabel}>Notes</Text>
            <Text style={styles.quickCount}>{task.length}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Insights</Text>

        <View style={styles.insightContainer}>
          <View style={styles.insightCard}>
            <View style={styles.insightIconContainer}>
              <MaterialIcons name="trending-down" size={24} color="#FF5722" />
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightValue}>₹{monthExpense.toLocaleString('en-IN')}</Text>
              <Text style={styles.insightLabel}>Monthly Expenses</Text>
            </View>
          </View>

          <View style={styles.insightCard}>
            <View style={styles.insightIconContainer}>
              <MaterialIcons name="account-balance-wallet" size={24} color="#4285F4" />
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightValue}>{totalExpense}</Text>
              <Text style={styles.insightLabel}>Month Limit</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Payment Methods</Text>

        <View style={styles.paymentMethodsCard}>
          <PieChart data={paymentMethodsData} />
        </View>

        <Text style={styles.sectionTitle}>Expense Categories</Text>

        <View style={styles.paymentMethodsCard}>
          <CategoryPieChart data={categoryData} />
        </View>

        <Text style={styles.sectionTitle}>This Month's Reminders</Text>

        <View style={styles.paymentMethodsCard}>
          <ReminderCard
            reminders={reminders}
            stats={reminderStats}
            onReminderClick={handleReminderClick}
          />
        </View>
      </ScrollView>

      {/* Reminder Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {selectedReminder && (
              <>
                {/* Modal Header */}
                <View style={styles.modalHeader}>
                  <View style={styles.modalHeaderLeft}>
                    <View style={[styles.modalPriorityBadge,
                      { backgroundColor: selectedReminder.priority === 'High' ? '#FF5722' :
                        selectedReminder.priority === 'Medium' ? '#FF9800' : '#4CAF50' }]}>
                      <Text style={styles.modalPriorityText}>{selectedReminder.priority}</Text>
                    </View>
                    <Text style={styles.modalCategory}>{selectedReminder.category || 'General'}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.modalCloseButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <MaterialIcons name="close" size={24} color="#666" />
                  </TouchableOpacity>
                </View>

                {/* Modal Content */}
                <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
                  <Text style={styles.modalTitle}>{selectedReminder.taskName}</Text>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Description</Text>
                    <Text style={styles.modalDescription}>
                      {selectedReminder.description || 'No description provided'}
                    </Text>
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Reminder Details</Text>
                    <View style={styles.modalDetailRow}>
                      <MaterialIcons name="schedule" size={20} color="#4285F4" />
                      <Text style={styles.modalDetailText}>
                        {selectedReminder.reminderType === 'date' && selectedReminder.reminderValue
                          ? `Due: ${new Date(selectedReminder.reminderValue).toLocaleDateString('en-IN')}`
                          : selectedReminder.reminderValue || 'Reminder set'
                        }
                      </Text>
                    </View>
                    <View style={styles.modalDetailRow}>
                      <MaterialIcons name="info" size={20} color="#4285F4" />
                      <Text style={styles.modalDetailText}>
                        Status: {selectedReminder.status}
                      </Text>
                    </View>
                    <View style={styles.modalDetailRow}>
                      <MaterialIcons name="event" size={20} color="#4285F4" />
                      <Text style={styles.modalDetailText}>
                        Created: {new Date(selectedReminder.created_at).toLocaleDateString('en-IN')}
                      </Text>
                    </View>
                  </View>
                </ScrollView>

                {/* Modal Actions */}
                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.modalCompleteButton}
                    onPress={handleCompleteReminder}
                  >
                    <MaterialIcons name="check-circle" size={20} color="white" />
                    <Text style={styles.modalCompleteText}>Complete</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.modalDeleteButton}
                    onPress={handleDeleteReminder}
                  >
                    <MaterialIcons name="delete" size={20} color="white" />
                    <Text style={styles.modalDeleteText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      <BottomTabNavigator />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  contentContainer: {
    paddingBottom: 20,
  },

  // Refresh Indicator Styles
  refreshIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F4FF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E3EBFF',
  },
  refreshText: {
    fontSize: 12,
    color: '#4285F4',
    fontWeight: '500',
    marginLeft: 8,
  },

  // Header Gradient Styles
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    marginBottom: 0,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeSection: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  welcomeSubtext: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  vaultIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 12,
    borderRadius: 20,
  },
  vaultStatusCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  vaultStatusContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vaultStatusText: {
    marginLeft: 12,
    flex: 1,
  },
  vaultStatusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  vaultStatusSubtitle: {
    fontSize: 14,
    color: '#4285F4',
    fontWeight: '500',
  },

  // Section Title
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 16,
    marginHorizontal: 20,
    color: '#333',
  },

  // Quick Access Styles
  quickAccess: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 30,
    flexWrap: 'wrap',
  },
  quickItem: {
    width: '47%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  quickItemIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  quickCount: {
    fontSize: 18,
    color: '#4285F4',
    fontWeight: 'bold',
  },

  // Insights Styles
  insightContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    gap: 12,
  },
  insightCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  insightIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  insightLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },

  // Payment Methods Chart Styles
  paymentMethodsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  chartContainer: {
    alignItems: 'center',
  },
  pieChartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  pieChart: {
    backgroundColor: 'transparent',
  },
  chartLegend: {
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  legendText: {
    flex: 1,
  },
  legendMethod: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  legendAmount: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  emptyChart: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyChartText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    fontStyle: 'italic',
  },

  // Reminder Styles
  reminderContainer: {
    flex: 1,
  },
  reminderStatsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingVertical: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
  },
  reminderStatItem: {
    alignItems: 'center',
  },
  reminderStatNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  reminderStatLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  reminderList: {
    maxHeight: 300,
  },
  reminderItem: {
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4285F4',
  },
  reminderItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reminderPriorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  reminderPriorityText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  reminderCategory: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  reminderDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  reminderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reminderTypeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderTypeText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
    fontWeight: '500',
  },
  reminderStatus: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#FFF3E0',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 12,
    backgroundColor: '#F0F4FF',
    borderRadius: 8,
  },
  viewAllText: {
    fontSize: 14,
    color: '#4285F4',
    fontWeight: '600',
    marginRight: 8,
  },
  emptyReminders: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyRemindersText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    fontStyle: 'italic',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '100%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  modalPriorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 12,
  },
  modalPriorityText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  modalCategory: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    backgroundColor: '#F0F4FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    padding: 20,
    maxHeight: 300,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    lineHeight: 28,
  },
  modalSection: {
    marginBottom: 20,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4285F4',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  modalDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
  },
  modalDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  modalDetailText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 12,
    fontWeight: '500',
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  modalCompleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  modalCompleteText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalDeleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF5722',
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#FF5722',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  modalDeleteText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },

  // Loading Styles
  loadingContainer: {
    flex: 1,
    backgroundColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '500',
  },
});

export default DashboardScreen;
