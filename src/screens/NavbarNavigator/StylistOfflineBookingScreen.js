
import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

// Time slots from CScreen1.js (now used directly)
const timeSlotsFromCScreen1 = [
  "07:00 AM","07:30 AM","08:00 AM","08:30 AM","09:00 AM","09:30 AM",
  "10:00 AM","10:30 AM","11:00 AM","11:30 AM","12:00 PM","12:30 PM",
  "01:00 PM","01:30 PM","02:00 PM","02:30 PM","03:00 PM","03:30 PM",
  "04:00 PM","04:30 PM","05:00 PM","05:30 PM","06:00 PM","06:30 PM",
  "07:00 PM","07:30 PM","08:00 PM","08:30 PM","09:00 PM","09:30 PM"
];

const VendorOfflineBookingScreen = () => {
  const { user } = useContext(AuthContext);
  const salonId = user?.salon;

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [markedDates, setMarkedDates] = useState({});
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedStylist, setSelectedStylist] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [stylists, setStylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [timeAdjustment, setTimeAdjustment] = useState(0); // New state for time adjustment

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setMarkedDates({
      [today]: { selected: true, selectedColor: '#2F4EAA' }
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const usersResponse = await axios.get('https://yaslaservice.com:81/users/');
        const allUsers = usersResponse.data.data || [];
      const salonStylists = allUsers
  .filter(user => user.user_role === 'Stylist' && user.salon == salonId)
  .map(stylist => ({
    id: stylist.id,
    name: stylist.full_name,
    specialty: stylist.user_role,
    rating: '4.5',
    // ✅ prepend base URL if image exists
    profile_pic: stylist.profile_image
      ? `https://yaslaservice.com:81${stylist.profile_image}`
      : null,
  }));

        setStylists(salonStylists);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err);
        setLoading(false);
        Alert.alert('Error', 'Failed to load data from server.');
      }
    };
    if (salonId) fetchData();
  }, [salonId]);

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!selectedStylist || !selectedDate) return;
      setLoadingSlots(true);
      setSelectedTime(null);

      try {
        const response = await axios.get(
          `https://yaslaservice.com:81/appointments/stylist/${selectedStylist.id}/?start_date=${selectedDate}`
        );
        const bookedSlots = processBookedSlots(response.data || []);
        const available = timeSlotsFromCScreen1.filter(slot => !bookedSlots.includes(slot));
        setAvailableSlots(available);
      } catch (error) {
        console.error('Error fetching time slots:', error);
        Alert.alert('Error', 'Failed to load available time slots');
        setAvailableSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };
    fetchAvailableSlots();
  }, [selectedStylist, selectedDate]);

  const processBookedSlots = (appointments) => {
    const bookedSlots = [];
    appointments.forEach(appointment => {
      const startTime = new Date(appointment.start_datetime);
      const endTime = new Date(appointment.end_datetime);
      let currentTime = new Date(startTime);

      while (currentTime < endTime) {
        const hours = currentTime.getHours();
        const minutes = currentTime.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        const timeStr = `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
        bookedSlots.push(timeStr);
        currentTime = new Date(currentTime.getTime() + 30 * 60000);
      }
    });
    return bookedSlots;
  };

  const isTimeSlotInPast = (time) => {
    const now = new Date();
    const slotDate = new Date(selectedDate);
    const [timePart, modifier] = time.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);

    if (modifier === 'PM' && hours !== 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;

    slotDate.setHours(hours);
    slotDate.setMinutes(minutes);
    slotDate.setSeconds(0);

    return slotDate < now;
  };

  const handleDateSelect = (day) => {
    setSelectedDate(day.dateString);
    setMarkedDates({
      [day.dateString]: { selected: true, selectedColor: '#2F4EAA' }
    });
    setShowCalendar(false);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setTimeAdjustment(0); // Reset time adjustment when selecting a new time
  };

  const handleStylistSelect = (stylist) => setSelectedStylist(stylist);

  const handleTimeAdjustment = (increment) => {
    setTimeAdjustment(prev => Math.max(0, prev + increment));
  };

  const convertToISOString = (time12h) => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier === 'PM' && hours !== 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    const date = new Date(selectedDate);
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date.toISOString();
  };

  const calculateEndTime = (startTimeISO) => {
    const startTime = new Date(startTimeISO);
    const endTime = new Date(startTime.getTime() + (30 + timeAdjustment) * 60000);
    return endTime.toISOString();
  };

  // NEW: Function to render stylist image with fallback to person icon
 const renderStylistImage = (stylist) => {
  if (stylist.profile_pic) {
    return (
      <Image
        source={{ uri: stylist.profile_pic }}
        style={styles.stylistImage}
        resizeMode="cover"
      />
    );
  } else {
    return (
      <View style={styles.stylistIconContainer}>
        <Ionicons name="person" size={30} color="#666" />
      </View>
    );
  }
};


  const handleBookAppointment = async () => {
    if (!selectedTime) return Alert.alert('Error', 'Please select a time slot');
    if (!selectedStylist) return Alert.alert('Error', 'Please select a stylist');

    setLoading(true);
    try {
      const startDateTimeISO = convertToISOString(selectedTime);
      const endDateTimeISO = calculateEndTime(startDateTimeISO);
      const payload = {
        appointment_services: [],
        start_datetime: startDateTimeISO,
        end_datetime: endDateTimeISO,
        status: 'Offline Booking',
        salon: salonId,
        stylist: selectedStylist.id
      };
      const response = await axios.post('https://yaslaservice.com:81/appointments/', payload);
      setLoading(false);
      setSelectedStylist(null);
      setSelectedTime(null);
      setTimeAdjustment(0);
      setSelectedDate(new Date().toISOString().split('T')[0]);
      Alert.alert(
        'Booking Successful',
        `Walk-in appointment booked successfully! OTP: ${response.data.data.otp_code}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      setLoading(false);
      console.error('Appointment post error:', error);
      if (error.response) {
        Alert.alert('Error', `Failed to book appointment.\nServer responded with: ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        Alert.alert('Error', 'No response from server. Check your network.');
      } else {
        Alert.alert('Error', 'An unexpected error occurred.');
      }
    }
  };

  const formatTime = (time) => time.replace(/\s([AP]M)$/, '$1');

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#2F4EAA" />
        <Text style={styles.loadingText}>Loading data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>Error loading data. Please try again later.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.salonName}>Offline Booking</Text>
          <Text style={styles.headerSubtitle}>Book walk-in appointments</Text>
        </View>
      </View>

      <ScrollView>
        <View style={styles.bookingSection}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <TouchableOpacity
            style={styles.dateSelector}
            onPress={() => setShowCalendar(!showCalendar)}
          >
            <Ionicons name="calendar" size={20} color="#2F4EAA" />
            <Text style={styles.dateText}>
              {new Date(selectedDate).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
              })}
            </Text>
          </TouchableOpacity>

          {showCalendar && (
            <View style={styles.calendarContainer}>
              <Calendar
                current={selectedDate}
                minDate={new Date().toISOString().split('T')[0]}
                onDayPress={handleDateSelect}
                markedDates={markedDates}
                theme={{
                  selectedDayBackgroundColor: '#2F4EAA',
                  todayTextColor: '#2F4EAA',
                  arrowColor: '#2F4EAA',
                }}
              />
            </View>
          )}

          <Text style={styles.sectionTitle}>Select Stylist</Text>
          <FlatList
            horizontal
            data={stylists}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item: stylist }) => (
              <TouchableOpacity
                style={[
                  styles.stylistCard,
                  selectedStylist?.id === stylist.id && styles.selectedStylistCard
                ]}
                onPress={() => handleStylistSelect(stylist)}
              >
                {/* UPDATED: Use the new renderStylistImage function */}
                {renderStylistImage(stylist)}
                <Text style={styles.stylistName}>{stylist.name}</Text>
                <Text style={styles.stylistSpecialty}>{stylist.specialty}</Text>
                <Text style={styles.stylistRating}>★ {stylist.rating}</Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.stylistContainer}
            showsHorizontalScrollIndicator={false}
          />

          <Text style={styles.sectionTitle}>Available Time Slots</Text>
          {loadingSlots ? (
            <ActivityIndicator size="small" color="#2F4EAA" />
          ) : (
            <View style={styles.timeSlotsGrid}>
              {timeSlotsFromCScreen1.map((time, index) => {
                const isPast = isTimeSlotInPast(time);
                const isAvailable = availableSlots.includes(time) && !isPast;
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.timeSlot,
                      selectedTime === time && styles.selectedTimeSlot,
                      isPast ? styles.pastTimeSlot : !availableSlots.includes(time) && styles.unavailableTimeSlot
                    ]}
                    onPress={() => isAvailable && handleTimeSelect(time)}
                    disabled={!isAvailable}
                  >
                    {isAvailable ? (
                      <Text style={[
                        styles.timeSlotText,
                        selectedTime === time && styles.selectedTimeSlotText
                      ]}>
                        {formatTime(time)}
                      </Text>
                    ) : (
                      <Text style={styles.bookedText}>{isPast ? formatTime(time) : 'Booked'}</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* Time Adjustment Section - Similar to StylistBookings */}
          {selectedTime && (
            <View style={styles.timeAdjustmentContainer}>
              <Text style={styles.timeAdjustmentLabel}>Adjust Time (if customer is late):</Text>
              <View style={styles.quantitySelector}>
                <TouchableOpacity 
                  style={[styles.quantityButton, timeAdjustment <= 0 && styles.disabledButton]}
                  onPress={() => handleTimeAdjustment(-5)}
                  disabled={timeAdjustment <= 0}
                >
                  <Text style={styles.quantityButtonText}>-5</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.quantityButton, timeAdjustment <= 0 && styles.disabledButton]}
                  onPress={() => handleTimeAdjustment(-1)}
                  disabled={timeAdjustment <= 0}
                >
                  <Text style={styles.quantityButtonText}>-1</Text>
                </TouchableOpacity>
                
                <Text style={styles.quantityValue}>
                  {timeAdjustment > 0 ? `+${timeAdjustment}` : timeAdjustment} min
                </Text>
                
                <TouchableOpacity 
                  style={styles.quantityButton}
                  onPress={() => handleTimeAdjustment(1)}
                >
                  <Text style={styles.quantityButtonText}>+1</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.quantityButton}
                  onPress={() => handleTimeAdjustment(5)}
                >
                  <Text style={styles.quantityButtonText}>+5</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {selectedTime && selectedStylist && (
            <TouchableOpacity style={styles.bookButton} onPress={handleBookAppointment}>
              <Text style={styles.bookButtonText}>
                Book with {selectedStylist.name} at {formatTime(selectedTime)}
                {timeAdjustment > 0 ? ` (+${timeAdjustment} min)` : ''}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  center: { 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#d32f2f',
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    padding: 16, 
    backgroundColor: '#fff', 
    borderBottomWidth: 1, 
    borderBottomColor: '#eee',
  },
  headerTextContainer: { 
    flex: 1 
  },
  salonName: { 
    fontSize: 20, 
    fontFamily: 'Inter_600SemiBold',
    color: '#333' 
  },
  headerSubtitle: { 
    fontSize: 14, 
    fontFamily: 'Inter_400Regular',
    color: '#666', 
    marginTop: 4 
  },
  bookingSection: { 
    padding: 16 
  },
  sectionTitle: { 
    fontSize: 18, 
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 16, 
    color: '#333' 
  },
  dateSelector: {
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 12,
    backgroundColor: '#f9f9f9', 
    borderRadius: 8, 
    marginBottom: 16,
  },
  dateText: { 
    marginLeft: 12, 
    fontSize: 16, 
    fontFamily: 'Inter_500Medium',
    color: '#333' 
  },
  calendarContainer: { 
    marginBottom: 16 
  },
  stylistContainer: { 
    paddingBottom: 8 
  },
  stylistCard: {
    alignItems: 'center', 
    padding: 12, 
    backgroundColor: '#f9f9f9',
    borderRadius: 12, 
    marginRight: 16, 
    width: 100,
  },
  selectedStylistCard: { 
    backgroundColor: '#FF6B6B20', 
    borderColor: '#2F4EAA', 
    borderWidth: 1 
  },
  stylistImage: { 
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    marginBottom: 8 
  },
  // NEW: Style for the default person icon container
  stylistIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  stylistName: { 
    fontFamily: 'Inter_600SemiBold',
    color: '#333', 
    fontSize: 14,
    textAlign: 'center',
  },
  stylistSpecialty: { 
    fontSize: 12, 
    fontFamily: 'Inter_400Regular',
    color: '#666', 
    textAlign: 'center' 
  },
  stylistRating: { 
    fontSize: 12, 
    fontFamily: 'Inter_500Medium',
    color: '#ffc107', 
    marginTop: 4 
  },
  timeSlotsGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between' 
  },
  timeSlot: {
    width: '30%', 
    padding: 12, 
    backgroundColor: '#f9f9f9',
    borderRadius: 8, 
    alignItems: 'center', 
    marginBottom: 12,
  },
  selectedTimeSlot: { 
    backgroundColor: '#2F4EAA' 
  },
  unavailableTimeSlot: { 
    backgroundColor: '#f0f0f0' 
  },
  pastTimeSlot: { 
    backgroundColor: '#e0e0e0' 
  },
  timeSlotText: { 
    color: '#333', 
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
  },
  selectedTimeSlotText: { 
    color: '#fff',
    fontFamily: 'Inter_600SemiBold',
  },
  bookedText: { 
    color: '#999', 
    fontStyle: 'italic',
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
  },
  // Time Adjustment Styles
  timeAdjustmentContainer: {
    marginBottom: 12,
    alignItems: "center"
  },
  timeAdjustmentLabel: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    marginBottom: 8,
    color: '#333',
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  quantityButtonText: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#333',
  },
  disabledButton: {
    backgroundColor: '#E0E0E0',
    borderColor: '#CCC',
  },
  quantityValue: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#333',
    marginHorizontal: 12,
    minWidth: 60,
    textAlign: 'center',
  },
  bookButton: {
    backgroundColor: '#2F4EAA', 
    padding: 16, 
    borderRadius: 8,
    alignItems: 'center', 
    marginTop: 16,
  },
  bookButtonText: { 
    color: '#fff', 
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16, 
    textAlign: 'center' 
  },
});

export default VendorOfflineBookingScreen;