import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView
} from 'react-native';
import { DataTable } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';

// Static mock data
const mockBookings = [
  {
    sno: 1,
    start_datetime: "2025-07-30T10:00:00",
    end_datetime: "2025-07-30T11:30:00",
    stylist: "John Doe",
    service: "Haircut & Styling",
    salon: "Glamour Salon",
    status: "Pending"
  },
  {
    sno: 2,
    start_datetime: "2025-07-30T12:00:00",
    end_datetime: "2025-07-30T13:00:00",
    stylist: "John Doe",
    service: "Beard Trim",
    salon: "Glamour Salon",
    status: "Pending"
  },
  {
    sno: 3,
    start_datetime: "2025-07-31T14:00:00",
    end_datetime: "2025-07-31T15:30:00",
    stylist: "John Doe",
    service: "Hair Coloring",
    salon: "Glamour Salon",
    status: "Pending"
  },
];

const BookingApprovalScreen = () => {
  const [bookings, setBookings] = React.useState(mockBookings);

  const formatTime = (dateTime) => {
    if (!dateTime) return 'N/A';
    const date = new Date(dateTime);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateTime) => {
    if (!dateTime) return 'N/A';
    const date = new Date(dateTime);
    return date.toLocaleDateString();
  };

  const handleStatusChange = (sno, status) => {
    const updatedBookings = bookings.map(booking => 
      booking.sno === sno ? {...booking, status} : booking
    );
    setBookings(updatedBookings);
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Approved':
        return styles.statusApproved;
      case 'Rejected':
        return styles.statusRejected;
      case 'Pending':
      default:
        return styles.statusPending;
    }
  };

  const getStatusTextStyle = (status) => {
    switch(status) {
      case 'Approved':
        return styles.statusTextApproved;
      case 'Rejected':
        return styles.statusTextRejected;
      case 'Pending':
      default:
        return styles.statusTextPending;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Bookings Approval</Text>
      
      <ScrollView horizontal={true}>
        <DataTable style={styles.table}>
          <DataTable.Header>
            <DataTable.Title style={styles.headerCell}>S.No</DataTable.Title>
            <DataTable.Title style={styles.headerCell}>Date</DataTable.Title>
            <DataTable.Title style={styles.headerCell}>Start Time</DataTable.Title>
            <DataTable.Title style={styles.headerCell}>End Time</DataTable.Title>
            <DataTable.Title style={styles.headerCell}>Stylist</DataTable.Title>
            <DataTable.Title style={styles.headerCell}>Service</DataTable.Title>
            <DataTable.Title style={styles.headerCell}>Salon</DataTable.Title>
            <DataTable.Title style={styles.headerCell}>Status</DataTable.Title>
          </DataTable.Header>

          {bookings.map((booking) => (
            <DataTable.Row key={booking.sno}>
              <DataTable.Cell style={styles.cell}>{booking.sno}</DataTable.Cell>
              <DataTable.Cell style={styles.cell}>{formatDate(booking.start_datetime)}</DataTable.Cell>
              <DataTable.Cell style={styles.cell}>{formatTime(booking.start_datetime)}</DataTable.Cell>
              <DataTable.Cell style={styles.cell}>{formatTime(booking.end_datetime)}</DataTable.Cell>
              <DataTable.Cell style={styles.cell}>{booking.stylist}</DataTable.Cell>
              <DataTable.Cell style={styles.cell}>{booking.service}</DataTable.Cell>
              <DataTable.Cell style={styles.cell}>{booking.salon}</DataTable.Cell>
              <DataTable.Cell style={[styles.cell, styles.statusCell]}>
                <View style={[styles.statusContainer, getStatusStyle(booking.status)]}>
                    <Picker
                      selectedValue={booking.status}
                      style={styles.picker}
                      dropdownIconColor="#000"
                      mode="dropdown"
                      itemStyle={styles.pickerItem}
                      onValueChange={(itemValue) => handleStatusChange(booking.sno, itemValue)}
                    >
                      <Picker.Item label="Pending" value="Pending" />
                      <Picker.Item label="Approved" value="Approved" />
                      <Picker.Item label="Rejected" value="Rejected" />
                    </Picker>
                    <Text style={[styles.selectedStatusText, getStatusTextStyle(booking.status)]}>
                      {booking.status}
                    </Text>
                  </View>
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2C3E50',
    textAlign: 'center',
  },
  table: {
    width: '100%',
  },
  headerCell: {
    backgroundColor: '#f5f5f5',
    padding: 8,
    minWidth: 100,
  },
  cell: {
    padding: 8,
    minWidth: 100,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statusCell: {
    minWidth: 150,
  },
  statusContainer: {
  borderRadius: 4,
  overflow: 'hidden',
  height: 40,
  width: 140,
  justifyContent: 'center',
  position: 'relative', // Needed for absolute positioning of the Text
},
picker: {
  position: 'absolute',
  height: '100%',
  width: '100%',
  opacity: 0, // Make the native picker transparent
},
selectedStatusText: {
  position: 'absolute',
  left: 10,
  right: 30,
  fontSize: 14,
  fontWeight: '700',
  paddingVertical: 10,
},
pickerItem: {
  color: '#000',
  fontSize: 14,
  fontWeight: '700',
},
// Keep your existing status color styles
statusPending: {
  backgroundColor: '#FFF3CD',
},
statusApproved: {
  backgroundColor: '#D4EDDA',
},
statusRejected: {
  backgroundColor: '#F8D7DA',
},
statusTextPending: {
  color: '#856404',
},
statusTextApproved: {
  color: '#155724',
},
statusTextRejected: {
  color: '#721c24',
},
});

export default BookingApprovalScreen;