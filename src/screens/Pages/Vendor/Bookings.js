import React, { useState, useEffect, useContext } from 'react';
import {
  View, Text, StyleSheet,
  TouchableOpacity, ScrollView, ActivityIndicator
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';
import { useIsFocused } from '@react-navigation/native';

const BookingsScreen = () => {
  const [activeTab, setActiveTab] = useState('Bookings');
  const [staffData, setStaffData] = useState([]);
  const [bookingsData, setBookingsData] = useState([]);
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [customersData, setCustomersData] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [stylistBookings, setStylistBookings] = useState([]);
  const [loadingStylistBookings, setLoadingStylistBookings] = useState(false);
  const [selectedStylistId, setSelectedStylistId] = useState(null);

  const { user } = useContext(AuthContext);
  const isFocused = useIsFocused();

  // Function to sort bookings by creation date (most recent first)
  const sortBookingsByCreatedDate = (bookingsArray) => {
    return bookingsArray.sort((a, b) => {
      return new Date(b.created_at) - new Date(a.created_at);
    });
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
      const filteredBookings = all.filter(a => a.salon === user.salon);
      
      // Sort bookings by creation date (most recent first)
      const sortedBookings = sortBookingsByCreatedDate(filteredBookings);
      setBookingsData(sortedBookings);
    } catch (err) {
      console.error('Bookings fetch error:', err);
    } finally {
      setLoadingBookings(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      setLoadingCustomers(true);
      const res = await axios.get('https://yaslaservice.com:81/customers/');
      setCustomersData(res.data.data || []);
    } catch (err) {
      console.error('Customers fetch error:', err);
    } finally {
      setLoadingCustomers(false);
    }
  };

  // Combined function to fetch all booking-related data
  const fetchBookingData = async () => {
    await Promise.all([fetchBookings(), fetchCustomers()]);
  };

  const fetchStylistBookings = async (stylistId) => {
    if (selectedStylistId === stylistId) {
      setSelectedStylistId(null);
      setStylistBookings([]);
      return;
    }

    if (!stylistId) return;
    try {
      setLoadingStylistBookings(true);
      const res = await axios.get(`https://yaslaservice.com:81/appointments/stylist/${stylistId}/`);
      
      // Sort stylist bookings by creation date (most recent first)
      const sortedStylistBookings = sortBookingsByCreatedDate(res.data || []);
      setStylistBookings(sortedStylistBookings);
      setSelectedStylistId(stylistId);
    } catch (err) {
      console.error('Stylist bookings fetch error:', err);
    } finally {
      setLoadingStylistBookings(false);
    }
  };

  const getStylistNameById = (stylistId) => {
    if (!stylistId) return '—';
    const stylist = staffData.find(staff => staff.id === stylistId);
    return stylist ? stylist.full_name : '—';
  };

  const getCustomerNameById = (customerId) => {
    if (!customerId) return '—';
    const customer = customersData.find(c => c.id === customerId);
    return customer ? customer.full_name : `ID: ${customerId}`;
  };

  // Function to get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return '#4CAF50'; // Green
      case 'accepted':
        return '#2196F3'; // Blue
      case 'pending':
        return '#FF9800'; // Orange
      case 'declined':
        return '#F44336'; // Red
      case 'offline booking':
        return '#9C27B0'; // Purple
      case 'completed':
        return '#607D8B'; // Gray
      default:
        return '#666'; // Default gray
    }
  };

  // Format date to show creation time
  const formatCreationDate = (createdAt) => {
    if (!createdAt) return '—';
    const date = new Date(createdAt);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  useEffect(() => {
    if (user?.salon && isFocused) {
      // Always fetch staff data regardless of active tab
      fetchStaff();
      
      if (activeTab === 'Bookings') {
        fetchBookingData();
      }
    }
  }, [user?.salon, isFocused, activeTab]);

  // Filter staff by role
  const getStylists = () => {
    return staffData.filter(staff => staff.user_role === 'Stylist');
  };

  const getNonStylistStaff = () => {
    return staffData.filter(staff => staff.user_role !== 'Stylist');
  };

  const renderBookingCard = (booking) => {
    const time = booking.start_datetime
      ? new Date(booking.start_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : '—';
    const date = booking.start_datetime
      ? new Date(booking.start_datetime).toLocaleDateString()
      : '—';
    
    const statusColor = getStatusColor(booking.status);
    const createdAt = formatCreationDate(booking.created_at);
    
    return (
      <View key={booking.id} style={styles.bookingCard}>
        <View style={styles.bookingHeader}>
          <Text style={styles.bookingId}>Booking #{booking.id}</Text>
          <View style={styles.statusBadge}>
            <Text style={[styles.statusText, { color: statusColor }]}>
              {booking.status?.toUpperCase()}
            </Text>
          </View>
        </View>
        
        <View style={styles.bookingInfoRow}>
          <Text style={styles.bookingLabel}>Stylist:</Text>
          <Text style={styles.bookingValue}>{getStylistNameById(booking.stylist)}</Text>
        </View>
        
        <View style={styles.bookingInfoRow}>
          <Text style={styles.bookingLabel}>Customer:</Text>
          <Text style={styles.bookingValue}>{getCustomerNameById(booking.customer)}</Text>
        </View>
        
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>
            <MaterialIcons name="date-range" size={14} color="#666" /> {date}
          </Text>
          <Text style={styles.timeText}>
            <MaterialIcons name="access-time" size={14} color="#666" /> {time}
          </Text>
        </View>

        {/* Added creation date display */}
        {/* <View style={styles.creationContainer}>
          <Text style={styles.creationText}>
            <MaterialIcons name="schedule" size={14} color="#666" /> Created: {createdAt}
          </Text>
        </View> */}
        
        <View style={styles.amountContainer}>
          <Text style={styles.amountText}>₹{booking.bill_amount || '0'}</Text>
          <Text style={[
            styles.paymentStatus,
            booking.payment_status === 'paid' ? {color: '#4CAF50'} : {color: '#F44336'}
          ]}>
            {booking.payment_status?.toUpperCase()}
          </Text>
        </View>
        
        {booking.customer_message && (
          <View style={styles.messageContainer}>
            <Text style={styles.messageLabel}>Customer Note:</Text>
            <Text style={styles.messageText}>{booking.customer_message}</Text>
          </View>
        )}
      </View>
    );
  };

  const renderBookings = () => {
    if (loadingBookings || loadingCustomers) {
      return <ActivityIndicator size="large" color="#2F4EAA" style={{marginTop: 30}} />;
    }
    if (bookingsData.length === 0) {
      return <Text style={styles.noData}>No bookings found</Text>;
    }
    return (
      <ScrollView 
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {bookingsData.map(booking => renderBookingCard(booking))}
      </ScrollView>
    );
  };

  const renderStylistBookings = () => {
    if (loadingStylistBookings || loadingCustomers) {
      return <ActivityIndicator size="large" color="#2F4EAA" style={{marginTop: 10}} />;
    }
    if (stylistBookings.length === 0) {
      return <Text style={styles.noData}>No bookings for this stylist</Text>;
    }
    return (
      <View style={styles.stylistBookingsContainer}>
        {stylistBookings.map(booking => renderBookingCard(booking))}
      </View>
    );
  };

  const renderStaffList = (staffList) => {
    if (loadingStaff) {
      return <ActivityIndicator size="large" color="#2F4EAA" style={{marginTop: 30}} />;
    }
    if (staffList.length === 0) {
      return <Text style={styles.noData}>No staff found</Text>;
    }
    return (
      <ScrollView 
        style={styles.staffContainer}
        showsVerticalScrollIndicator={false}
      >
        {staffList.map((staff) => (
          <View key={staff.id} style={styles.staffItem}>
            <View style={styles.staffHeader}>
              <View>
                <Text style={styles.staffName}>{staff.full_name}</Text>
                <Text style={styles.staffRole}>{staff.user_role}</Text>
              </View>
              <View style={[
                styles.staffStatus,
                staff.status === 'Active' ? styles.activeStatus : styles.inactiveStatus
              ]}>
                <Text style={styles.statusText}>{staff.status}</Text>
              </View>
            </View>
            {staff.user_role === 'Stylist' && (
              <TouchableOpacity 
                style={styles.viewBookingsButton}
                onPress={() => fetchStylistBookings(staff.id)}
              >
                <Text style={styles.viewBookingsText}>
                  {selectedStylistId === staff.id ? 'Hide Bookings' : 'View Bookings'}
                </Text>
              </TouchableOpacity>
            )}
            {selectedStylistId === staff.id && renderStylistBookings()}
          </View>
        ))}
      </ScrollView>
    );
  };

  const renderStylists = () => {
    const stylists = getStylists();
    return renderStaffList(stylists);
  };

  const renderStaff = () => {
    const nonStylistStaff = getNonStylistStaff();
    return renderStaffList(nonStylistStaff);
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
          style={[styles.tabButton, activeTab === 'Stylists' && styles.activeTab]}
          onPress={() => setActiveTab('Stylists')}
        >
          <Text style={[styles.tabText, activeTab === 'Stylists' && styles.activeTabText]}>
            Stylists ({getStylists().length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Staff' && styles.activeTab]}
          onPress={() => setActiveTab('Staff')}
        >
          <Text style={[styles.tabText, activeTab === 'Staff' && styles.activeTabText]}>
            Staff ({getNonStylistStaff().length})
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'Bookings' && renderBookings()}
      {activeTab === 'Stylists' && renderStylists()}
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
    color: '#666', 
    fontFamily: 'Inter_500Medium',
  },
  activeTabText: { 
    color: '#fff',
    fontFamily: 'Inter_600SemiBold',
  },
  contentContainer: { 
    flex: 1,
    paddingTop: 10,
  },
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
  bookingInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  bookingLabel: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Inter_500Medium',
    width: '30%',
  },
  bookingValue: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Inter_400Regular',
    width: '65%',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  timeText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Inter_400Regular',
  },
  creationContainer: {
    marginTop: 8,
  },
  creationText: {
    fontSize: 12,
    color: '#888',
    fontFamily: 'Inter_400Regular',
    fontStyle: 'italic',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#e0e0e0',
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
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
    color: '#666',
    fontFamily: 'Inter_500Medium',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 14,
    color: '#333',
    fontStyle: 'italic',
    fontFamily: 'Inter_400Regular',
  },
  noData: { 
    textAlign: 'center', 
    marginTop: 30, 
    color: '#888',
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
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
    marginBottom: 12,
  },
  staffName: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#333',
  },
  staffRole: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
    fontFamily: 'Inter_400Regular',
  },
  staffStatus: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeStatus: {
    backgroundColor: '#e0e0e0',
  },
  inactiveStatus: {
    backgroundColor: '#F44336',
  },
  viewBookingsButton: {
    backgroundColor: '#2F4EAA',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  viewBookingsText: {
    color: '#fff',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  stylistBookingsContainer: {
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
  },
});

export default BookingsScreen;