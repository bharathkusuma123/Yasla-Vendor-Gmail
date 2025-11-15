import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';

const VendorDashboard = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search appointments, clients..."
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.searchIcon}>
          <MaterialIcons name="search" size={24} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      {/* Three Action Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('Bookings')}
        >
          <Text style={styles.buttonText}>Bookings (9)</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('AvailableSlots')}
        >
          <Text style={styles.buttonText}>Available Slots</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('Staff')}
        >
          <Text style={styles.buttonText}>Staff</Text>
        </TouchableOpacity>
      </View>

      {/* Booking Alert Button */}
      <TouchableOpacity 
        style={styles.alertButton}
        onPress={() => navigation.navigate('BookingAlerts')}
      >
        <FontAwesome name="bell" size={20} color="white" />
        <Text style={styles.alertButtonText}>New Booking Alert!</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    paddingBottom: 80, // Extra padding for the alert button
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    height: 50,
    color: '#333',
    fontSize: 16,
  },
  searchIcon: {
    padding: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  actionButton: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 20,
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#4CAF50', // Vendor green color
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
  },
  alertButton: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  alertButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 10,
    fontSize: 16,
  },
});

export default VendorDashboard;