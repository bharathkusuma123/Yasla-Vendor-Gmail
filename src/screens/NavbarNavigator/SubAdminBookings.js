import React, { useState, useEffect, useContext } from 'react';
import {
  View, Text, StyleSheet,
  TouchableOpacity, ScrollView, ActivityIndicator
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useIsFocused } from '@react-navigation/native';

const ReceptionistBookings = () => {
  const [activeTab, setActiveTab] = useState('Bookings');
  const [staffData, setStaffData] = useState([]);
  const [bookingsData, setBookingsData] = useState([]);
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(false);

  const { user } = useContext(AuthContext);
  const isFocused = useIsFocused();

  // Function to get status text color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return '#a257b5ff'; // Purple
      case 'accepted':
        return '#1263cdff'; // Blue
      case 'pending':
        return '#FFC107'; // Orange/Yellow
      case 'declined':
        return '#F44336'; // Red
      case 'completed':
        return '#4CAF50'; // Green
      case 'offline booking':
        return '#9C27B0'; // Dark Purple
      default:
        return '#666'; // Default gray
    }
  };

  const fetchStaff = async () => {
    if (!user?.salon) return;
    try {
      setLoadingStaff(true);
      const res = await axios.get('https://yaslaservice.com:81/users/');
      const all = res.data.data || [];
      setStaffData(all.filter(u => u.salon === user.salon));
    } catch (err) {
      console.error('Staff fetch error:', err);
    } finally {
      setLoadingStaff(false);
    }
  };

  const fetchBookings = async () => {
    if (!user?.salon) return;
    try {
      setLoadingBookings(true);
      const res = await axios.get('https://yaslaservice.com:81/appointments/');
      const all = res.data.data || [];
      setBookingsData(all.filter(a => a.salon === user.salon));
    } catch (err) {
      console.error('Bookings fetch error:', err);
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    if (user?.salon && isFocused) {
      if (activeTab === 'Staff') fetchStaff();
      if (activeTab === 'Bookings') fetchBookings();
    }
  }, [user?.salon, isFocused, activeTab]);

  const renderBookings = () => {
    if (loadingBookings) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2F4EAA" />
          <Text style={styles.loadingText}>Loading bookings...</Text>
        </View>
      );
    }
    if (bookingsData.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.noData}>No bookings found</Text>
        </View>
      );
    }
    return (
      <ScrollView style={styles.contentContainer}>
        {bookingsData.map(b => {
          const time = b.start_datetime
            ? new Date(b.start_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : '—';
          const arrival = b.created_at
            ? new Date(b.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : '';
          const statusColor = getStatusColor(b.status);
          
          return (
            <View key={b.id} style={styles.bookingCard}>
              <View style={styles.bookingHeader}>
                <Text style={styles.bookingId}>Booking #{b.id}</Text>
                <View style={styles.statusBadge}>
                  <Text style={[styles.statusText, { color: statusColor }]}>
                    {b.status?.toUpperCase()}
                  </Text>
                </View>
              </View>
              
              <View style={styles.bookingInfoRow}>
                <Text style={styles.bookingLabel}>Time:</Text>
                <Text style={styles.bookingValue}>{time}</Text>
              </View>
              
              <View style={styles.bookingInfoRow}>
                <Text style={styles.bookingLabel}>Stylist:</Text>
                <Text style={styles.bookingValue}>{b.stylist ?? '—'}</Text>
              </View>
              
              <View style={styles.amountContainer}>
                <Text style={styles.amountText}>₹{b.bill_amount || '0'}</Text>
                <Text style={[
                  styles.paymentStatus,
                  b.payment_status === 'paid' ? {color: '#4CAF50'} : {color: '#F44336'}
                ]}>
                  {b.payment_status?.toUpperCase()}
                </Text>
              </View>
              
              {b.customer_message && (
                <View style={styles.messageContainer}>
                  <Text style={styles.messageLabel}>Customer Note:</Text>
                  <Text style={styles.messageText}>{b.customer_message}</Text>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    );
  };

  const renderStaff = () => {
    if (loadingStaff) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2F4EAA" />
          <Text style={styles.loadingText}>Loading staff...</Text>
        </View>
      );
    }
    if (staffData.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.noData}>No staff found</Text>
        </View>
      );
    }
    return (
      <ScrollView style={styles.staffContainer}>
        {staffData.map((staff, i) => (
          <View key={i} style={styles.staffItem}>
            <View style={styles.staffHeader}>
              <View>
                <Text style={styles.staffName}>{staff.full_name}</Text>
                <Text style={styles.staffRole}>{staff.user_role}</Text>
              </View>
              <View style={[
                styles.statusIndicator,
                staff.status === 'Active' ? styles.activeStatus : styles.inactiveStatus
              ]}>
                <Text style={styles.statusText}>{staff.status}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Bookings' && styles.activeTab]}
          onPress={() => setActiveTab('Bookings')}
        >
          <Text style={[styles.tabText, activeTab === 'Bookings' && styles.activeTabText]}>
            Bookings ({bookingsData.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Staff' && styles.activeTab]}
          onPress={() => setActiveTab('Staff')}
        >
          <Text style={[styles.tabText, activeTab === 'Staff' && styles.activeTabText]}>
            Staff ({staffData.length})
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'Bookings' && renderBookings()}
      {activeTab === 'Staff' && renderStaff()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f5f5', 
    padding: 15 
  },
  tabContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    marginBottom: 15, 
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  tabButton: { 
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  activeTab: { 
    backgroundColor: '#2F4EAA' 
  },
  tabText: { 
    fontSize: 16, 
    fontFamily: 'Inter_500Medium',
    color: '#666', 
  },
  activeTabText: { 
    color: '#fff',
    fontFamily: 'Inter_600SemiBold',
  },
  contentContainer: { 
    flex: 1,
    paddingTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  noData: { 
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#666',
  },
  // Booking Card Styles
  bookingCard: { 
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bookingHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    marginBottom: 12,
    alignItems: 'center',
  },
  bookingId: { 
    fontSize: 16, 
    fontFamily: 'Inter_600SemiBold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#e0e0e0', // Same background for all statuses
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    // Color is now set dynamically in the component
  },
  bookingInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  bookingLabel: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#666',
    width: '30%',
  },
  bookingValue: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#333',
    width: '65%',
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  amountText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#2F4EAA',
  },
  paymentStatus: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  messageContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  messageLabel: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#666',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#333',
    fontStyle: 'italic',
  },
  // Staff Styles
  staffContainer: {
    flex: 1,
  },
  staffItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  staffHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  staffName: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#333',
  },
  staffRole: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#666',
    marginTop: 2,
  },
  statusIndicator: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeStatus: {
    backgroundColor: '#e8f5e8',
  },
  inactiveStatus: {
    backgroundColor: '#ffebee',
  },
});

export default ReceptionistBookings;