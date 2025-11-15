import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const BookingsScreen = () => {
  const [activeTab, setActiveTab] = useState('Bookings');

  // Bookings Data
  const bookingsData = [
    {
      id: 1,
      stylist: 'Nani',
      time: '11:30 PM',
      arrivalTime: '11:15',
      idNumber: '4029',
      service: '1 X Haircut & beard trim',
      price: '150',
      customer: 'Gowtham'
    },
    {
      id: 2,
      stylist: 'DHINESH',
      time: '11:30 PM',
      arrivalTime: '11:15',
      idNumber: '4029',
      service: '1 X Haircut & beard trim',
      price: '150',
      customer: 'Gowtham'
    },
    {
      id: 3,
      stylist: 'KARTHIK',
      time: '12:00 PM',
      arrivalTime: '11:15',
      idNumber: '4029',
      service: '1 X Haircut & beard trim',
      price: '150',
      customer: 'Gowtham'
    },
    {
      id: 4,
      stylist: 'Nani',
      time: '1:00 PM',
      arrivalTime: '11:15',
      idNumber: '4029',
      service: '1 X Haircut & beard trim',
      price: '150',
      customer: 'Gowtham'
    },
    {
      id: 5,
      stylist: 'DHINESH',
      time: '1:00 PM',
      arrivalTime: '11:15',
      idNumber: '4029',
      service: '1 X Haircut & beard trim',
      price: '150',
      customer: 'Gowtham'
    }
  ];

  // Available Slots Data
  const timeSlots = [
    '1.00 PM', '1.30 PM', '2.00 PM', '3.00 PM', '4.00 PM', '5.00 PM', 
    '6.00 PM', '7.00 PM', '8.00 PM', '9.00 PM', '10.00 PM', '11.00 AM',
    '12.00 PM', '1.00 PM', '2.00 PM', '3.00 PM', '4.00 PM', '5.00 PM',
    '6.00 PM', '7.00 PM', '8.00 PM', '9.00 PM', '10.00 PM', '11.00 PM'
  ];

    // Staff Data
  const staffData = [
    { role: 'Admin', name: 'Arpitha', status: 'active' },
    { role: 'Sub Admin', name: 'Tamil', status: 'inactive' },
    { role: 'Stylist', name: 'Nani', status: 'active' },
    { role: 'Stylist', name: 'Dhinesh', status: 'inactive' },
    { role: 'Stylist', name: 'Karthik', status: 'active' },
    { role: 'Stylist', name: 'Gowtham', status: 'active' },
  ];

  const renderBookings = () => (
    <ScrollView style={styles.contentContainer}>
      {bookingsData.map((booking) => (
        <View key={booking.id} style={styles.bookingCard}>
          <View style={styles.bookingHeader}>
            <Text style={styles.bookingId}>{booking.id} :</Text>
            <Text style={styles.stylistName}>Stylist: {booking.stylist}</Text>
            <Text style={styles.timeText}>TIME: {booking.time}  {booking.arrivalTime}</Text>
          </View>
          <Text style={styles.idText}>ID: {booking.idNumber}</Text>
          <View style={styles.serviceRow}>
            <Text style={styles.serviceText}>Services: {booking.service}</Text>
            <MaterialIcons name="keyboard-arrow-down" size={24} color="#FF6B6B" />
            <Text style={styles.priceText}>{booking.price}</Text>
          </View>
          <Text style={styles.messageText}>Message {booking.customer}</Text>
        </View>
      ))}
    </ScrollView>
  );

  const renderAvailableSlots = () => (
    <View style={styles.slotsContainer}>
      <Text style={styles.stylistTitle}>[NANI (9)]</Text>
      <FlatList
        data={timeSlots}
        numColumns={4}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.timeSlot}>
            <Text style={styles.slotText}>{item}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.slotsGrid}
      />
    </View>
  );

   const renderStaff = () => (
    <ScrollView style={styles.staffContainer}>
      {staffData.map((staff, index) => (
        <View key={index} style={styles.staffItem}>
          <View style={styles.staffHeader}>
            <Text style={styles.staffRole}>{staff.role}</Text>
            <View style={[
              styles.statusIndicator,
              staff.status === 'active' ? styles.active : styles.inactive
            ]}>
              <Text style={styles.statusText}>{staff.status}</Text>
            </View>
          </View>
          <Text style={styles.staffName}>{staff.name}</Text>
          {staff.role === 'Stylist' && (
            <View style={styles.inActiveContainer}>
              <Text style={styles.inActiveText}>in active</Text>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      {/* Online Status */}
      <View style={styles.onlineStatus}>
        <View style={styles.onlineDot} />
        <Text style={styles.onlineText}>online</Text>
      </View>

      {/* Tab Buttons */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Bookings' && styles.activeTab]}
          onPress={() => setActiveTab('Bookings')}
        >
          <Text style={[styles.tabText, activeTab === 'Bookings' && styles.activeTabText]}>Bookings(9)</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'AvailableSlots' && styles.activeTab]}
          onPress={() => setActiveTab('AvailableSlots')}
        >
          <Text style={[styles.tabText, activeTab === 'AvailableSlots' && styles.activeTabText]}>Available slots</Text>
        </TouchableOpacity>
         <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Staff' && styles.activeTab]}
          onPress={() => setActiveTab('Staff')}
        >
          <Text style={[styles.tabText, activeTab === 'Staff' && styles.activeTabText]}>STAFF</Text>
        </TouchableOpacity>
      </View>

      {/* Content Area */}
      {activeTab === 'Bookings' && renderBookings()}
      {activeTab === 'AvailableSlots' && renderAvailableSlots()}
       {activeTab === 'Staff' && renderStaff()}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
  },
  onlineStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  onlineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
    marginRight: 8,
  },
  onlineText: {
    fontSize: 16,
    color: '#4CAF50',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  tabButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  activeTab: {
    backgroundColor: '#FF6B6B',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
  activeTabText: {
    color: '#fff',
  },
  contentContainer: {
    flex: 1,
  },
  bookingCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  bookingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  bookingId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 5,
  },
  stylistName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 10,
  },
  timeText: {
    fontSize: 14,
    color: '#666',
  },
  idText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  serviceText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  messageText: {
    fontSize: 14,
    color: '#FF6B6B',
  },
  slotsContainer: {
    flex: 1,
    paddingTop: 10,
  },
  stylistTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  slotsGrid: {
    justifyContent: 'center',
  },
  timeSlot: {
    width: '22%',
    padding: 10,
    margin: 5,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotText: {
    fontSize: 14,
    color: '#333',
  },
  tabContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

   staffContainer: {
    flex: 1,
    padding: 15,
  },
  staffItem: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 15,
  },
  staffHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  staffRole: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statusIndicator: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  active: {
    backgroundColor: '#4CAF50',
  },
  inactive: {
    backgroundColor: '#FF6B6B',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  staffName: {
    fontSize: 15,
    color: '#555',
    marginTop: 5,
  },
  inActiveContainer: {
    marginTop: 5,
  },
  inActiveText: {
    fontSize: 13,
    color: '#888',
    fontStyle: 'italic',
  },
});

export default BookingsScreen;