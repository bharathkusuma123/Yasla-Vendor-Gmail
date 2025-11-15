import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { DataTable } from 'react-native-paper';
import axios from 'axios';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination states
  const [page, setPage] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('https://yaslaservice.com:81/appointments/');
        if (response.data.status === 'success') {
          setBookings(response.data.data);
        } else {
          setError('Failed to fetch bookings');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const formatDateTime = (dateTime) => {
    if (!dateTime) return 'N/A';
    const date = new Date(dateTime);
    return date.toLocaleString();
  };

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, bookings.length);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bookings</Text>
      <ScrollView horizontal={true}>
        <View>
          <DataTable style={styles.table}>
            <DataTable.Header>
              <DataTable.Title style={styles.cell}>ID</DataTable.Title>
              <DataTable.Title style={styles.cell}>Start Time</DataTable.Title>
              <DataTable.Title style={styles.cell}>End Time</DataTable.Title>
              <DataTable.Title style={styles.cell}>Status</DataTable.Title>
              <DataTable.Title style={styles.cell}>Payment</DataTable.Title>
              <DataTable.Title style={styles.cell}>Amount</DataTable.Title>
              <DataTable.Title style={styles.cell}>Salon</DataTable.Title>
              <DataTable.Title style={styles.cell}>Stylist</DataTable.Title>
              <DataTable.Title style={styles.cell}>Customer</DataTable.Title>
            </DataTable.Header>

            {bookings.slice(from, to).map((booking) => (
              <DataTable.Row key={booking.id}>
                <DataTable.Cell style={styles.cell}>{booking.id}</DataTable.Cell>
                <DataTable.Cell style={styles.cell}>{formatDateTime(booking.start_datetime)}</DataTable.Cell>
                <DataTable.Cell style={styles.cell}>{formatDateTime(booking.end_datetime)}</DataTable.Cell>
                <DataTable.Cell style={styles.cell}>{booking.status}</DataTable.Cell>
                <DataTable.Cell style={styles.cell}>{booking.payment_status}</DataTable.Cell>
                <DataTable.Cell style={styles.cell}>₹{booking.bill_amount}</DataTable.Cell>
                <DataTable.Cell style={styles.cell}>{booking.salon}</DataTable.Cell>
                <DataTable.Cell style={styles.cell}>{booking.stylist}</DataTable.Cell>
                <DataTable.Cell style={styles.cell}>{booking.customer}</DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>

          {/* Pagination Footer */}
          <DataTable.Pagination
            page={page}
            numberOfPages={Math.ceil(bookings.length / itemsPerPage)}
            onPageChange={(page) => setPage(page)}
            label={`${from + 1}-${to} of ${bookings.length}`}
            showFastPaginationControls
            numberOfItemsPerPage={itemsPerPage}
            selectPageDropdownLabel={'Rows per page'}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  table: {
    width: Dimensions.get('window').width * 2,
  },
  cell: {
    width: 100,
    padding: 8,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2C3E50',
    textAlign: 'center',
  },
});

export default Bookings;
