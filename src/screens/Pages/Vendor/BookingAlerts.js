import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const BookingAlerts = () => {
  const alerts = [
    {
      id: 1,
      stylist: 'Nani',
      stylistId: '4029',
      services: ['1 X Haircut & beard trim'],
      time: '11:30 PM',
      duration: '25 mins',
      bill: 'set services completed time',
      acceptTime: '0.19'
    },
    {
      id: 2,
      stylist: 'Dhinesh M',
      stylistId: '6079',
      services: ['1 X Haircut & beard trim', 'Hair colour'],
      time: '11:30 PM',
      duration: '60 mins',
      bill: 'set services completed time',
      acceptTime: '0.19'
    },
    {
      id: 3,
      stylist: 'Nani',
      stylistId: '4029',
      services: ['1 X Haircut & beard trim'],
      time: '11:30 PM',
      duration: '50 mins',
      bill: 'set services completed time',
      acceptTime: '0.19'
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Booking alert</Text>
      
      {alerts.map((alert, index) => (
        <View key={alert.id} style={styles.alertContainer}>
          {/* Stylist Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{index + 2}</Text>
            <View style={styles.stylistInfo}>
              <Text style={styles.stylistName}>Stylist: {alert.stylist}</Text>
              <Text style={styles.stylistDetail}>ID: {alert.stylistId}</Text>
              <Text style={styles.stylistDetail}>Services</Text>
              <Text style={styles.timeText}>TIME: {alert.time}</Text>
            </View>
          </View>

          {/* Services */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{index + 3}</Text>
            <View style={styles.servicesInfo}>
              {alert.services.map((service, i) => (
                <Text key={i} style={styles.serviceText}>{service}</Text>
              ))}
              <Text style={styles.billText}>TOTAL BILL</Text>
              <Text style={styles.timeText}>{alert.bill}</Text>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{index + 4}</Text>
            <View style={styles.actionsContainer}>
              <Text style={styles.durationText}>{alert.duration}</Text>
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.iconButton}>
                  <MaterialIcons name="add" size={24} color="#4CAF50" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.rejectButton}>
                  <Text style={styles.rejectText}>Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.acceptButton}>
                  <Text style={styles.acceptText}>Accept booking ({alert.acceptTime})</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {index < alerts.length - 1 && <View style={styles.divider} />}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  alertContainer: {
    marginBottom: 15,
  },
  section: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  sectionTitle: {
    width: 30,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  stylistInfo: {
    flex: 1,
  },
  stylistName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  stylistDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  timeText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  servicesInfo: {
    flex: 1,
  },
  serviceText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  billText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
    marginBottom: 3,
  },
  actionsContainer: {
    flex: 1,
  },
  durationText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginRight: 15,
  },
  rejectButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#FF6B6B',
    borderRadius: 5,
    marginRight: 15,
  },
  rejectText: {
    color: '#FF6B6B',
    fontWeight: 'bold',
  },
  acceptButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  acceptText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 15,
  },
});

export default BookingAlerts;