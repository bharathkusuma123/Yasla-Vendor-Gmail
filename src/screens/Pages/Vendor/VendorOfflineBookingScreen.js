
// import React, { useState, useEffect, useContext } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   FlatList,
//   ScrollView,
//   StyleSheet,
//   Alert,
//   Image,
//   ActivityIndicator,
//   Linking
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { Calendar } from 'react-native-calendars';
// import { AuthContext } from '../../../context/AuthContext';
// import axios from 'axios';

// const VendorOfflineBookingScreen = () => {
//   const { user } = useContext(AuthContext);
//   console.log("yyyyy", user);
//   const salonId = user?.salon;
  
//   const [activeTab, setActiveTab] = useState('Male');
//   const [selectedServices, setSelectedServices] = useState([]);
//   const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
//   const [markedDates, setMarkedDates] = useState({});
//   const [showCalendar, setShowCalendar] = useState(false);
//   const [selectedStylist, setSelectedStylist] = useState(null);
//   const [selectedTime, setSelectedTime] = useState(null);
//   const [servicesData, setServicesData] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [stylists, setStylists] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [timeSlots, setTimeSlots] = useState([]);
//   const [availableSlots, setAvailableSlots] = useState([]);
//   const [loadingSlots, setLoadingSlots] = useState(false);

//   useEffect(() => {
//     const today = new Date().toISOString().split('T')[0];
//     setMarkedDates({
//       [today]: { selected: true, selectedColor: '#FF6B6B' }
//     });
//   }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);

//         // Fetch services for the salon and gender
//         const servicesResponse = await axios.get(
//           `https://yaslaservice.com:81/salon/${salonId}/services/${activeTab.toLowerCase()}/`
//         );

//         // Process services data
//         const services = servicesResponse.data || [];
//         setServicesData(services);

//         // Extract unique categories
//         const uniqueCategories = [...new Set(services.map(service => service.category_name))];
//         setCategories(uniqueCategories.map((category, index) => ({
//           id: index + 1,
//           name: category || 'Other Services'
//         })));

//         // Select the first category by default
//         if (uniqueCategories.length > 0) {
//           setSelectedCategory(uniqueCategories[0] || 'Other Services');
//         }

//         // Fetch stylists for this salon
//         const usersResponse = await axios.get('https://yaslaservice.com:81/users/');
//         const allUsers = usersResponse.data.data || [];

//         const salonStylists = allUsers.filter(user =>
//           user.user_role === 'Stylist' && user.salon == salonId
//         ).map(stylist => ({
//           id: stylist.id,
//           name: stylist.full_name,
//           specialty: stylist.user_role,
//           rating: '4.5',
//           image: `https://randomuser.me/api/portraits/men/${stylist.id % 50}.jpg`
//         }));

//         setStylists(salonStylists);
//         setLoading(false);
//       } catch (err) {
//         console.error('Error fetching data:', err);
//         setError(err);
//         setLoading(false);
//         Alert.alert("Error", "Failed to load data from server.");
//       }
//     };

//     if (salonId) {
//       fetchData();
//     }
//   }, [salonId, activeTab]);

//   useEffect(() => {
//     const fetchAvailableSlots = async () => {
//       if (!selectedStylist || !selectedDate) return;
      
//       setLoadingSlots(true);
//       setSelectedTime(null);
      
//       try {
//         // Generate all possible time slots
//         const allSlots = generateTimeSlots();
//         setTimeSlots(allSlots);

//         // Fetch booked appointments for this stylist on selected date
//         const response = await axios.get(
//           `https://yaslaservice.com:81/appointments/stylist/${selectedStylist.id}/?start_date=${selectedDate}`
//         );
        
//         // Process booked appointments to get unavailable time slots
//         const bookedSlots = response.data || [];
//         const unavailableSlots = processBookedSlots(bookedSlots);
        
//         // Filter out unavailable slots from all slots
//         const available = allSlots.filter(slot => !unavailableSlots.includes(slot));
//         setAvailableSlots(available);
//       } catch (error) {
//         console.error('Error fetching time slots:', error);
//         Alert.alert("Error", "Failed to load available time slots");
//         setAvailableSlots([]);
//       } finally {
//         setLoadingSlots(false);
//       }
//     };

//     fetchAvailableSlots();
//   }, [selectedStylist, selectedDate]);

//   const generateTimeSlots = () => {
//     const slots = [];
//     for (let hour = 7; hour < 19; hour++) {
//       const displayHour = hour % 12 === 0 ? 12 : hour % 12;
//       const ampm = hour < 12 ? 'AM' : 'PM';

//       slots.push(`${displayHour.toString().padStart(2, '0')}:00 ${ampm}`);
//       slots.push(`${displayHour.toString().padStart(2, '0')}:30 ${ampm}`);
//     }
//     return slots;
//   };

//   const processBookedSlots = (appointments) => {
//     const bookedSlots = [];
    
//     appointments.forEach(appointment => {
//       const startTime = new Date(appointment.start_datetime);
//       const endTime = new Date(appointment.end_datetime);
      
//       // Convert to 12-hour format with AM/PM
//       let currentTime = new Date(startTime);
      
//       while (currentTime < endTime) {
//         const hours = currentTime.getHours();
//         const minutes = currentTime.getMinutes();
//         const ampm = hours >= 12 ? 'PM' : 'AM';
//         const displayHours = hours % 12 || 12;
//         const timeStr = `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
        
//         bookedSlots.push(timeStr);
//         currentTime = new Date(currentTime.getTime() + 30 * 60000);
//       }
//     });
    
//     return bookedSlots;
//   };

//   const groupServicesByCategory = () => {
//     return servicesData.reduce((acc, service) => {
//       const category = service.category_name || 'Other Services';
//       if (!acc[category]) {
//         acc[category] = [];
//       }

//       const [hours, minutes] = service.completion_time.split(':').map(Number);
//       const totalMinutes = hours * 60 + minutes;
//       acc[category].push({
//         id: service.id,
//         service: service.service,
//         name: service.service_name,
//         duration: `${totalMinutes} mins`,
//         price: `₹${service.cost}`,
//         category: category
//       });
//       return acc;
//     }, {});
//   };

//   const servicesByCategory = groupServicesByCategory();

//   const handleDateSelect = (day) => {
//     setSelectedDate(day.dateString);
//     setMarkedDates({
//       [day.dateString]: { selected: true, selectedColor: '#FF6B6B' }
//     });
//     setShowCalendar(false);
//   };

//   const handleServiceSelect = (service) => {
//     setSelectedServices(prev => {
//       const isSelected = prev.some(s => s.id === service.id);
//       let updatedServices;

//       if (isSelected) {
//         updatedServices = prev.filter(s => s.id !== service.id);
//       } else {
//         updatedServices = [...prev, service];
//       }

//       return updatedServices;
//     });
//   };

//   const isServiceSelected = (service) => {
//     return selectedServices.some(s => s.id === service.id);
//   };

//   const handleTimeSelect = (time) => {
//     setSelectedTime(time);
//   };

//   const handleStylistSelect = (stylist) => {
//     setSelectedStylist(stylist);
//   };

//   const calculateTotals = () => {
//     return selectedServices.reduce((totals, service) => {
//       const durationMatch = service.duration.match(/(\d+)/);
//       const priceMatch = service.price.match(/(\d+)/);

//       const duration = durationMatch ? parseInt(durationMatch[0]) : 0;
//       const price = priceMatch ? parseInt(priceMatch[0]) : 0;

//       return {
//         totalDuration: totals.totalDuration + duration,
//         totalPrice: totals.totalPrice + price
//       };
//     }, { totalDuration: 0, totalPrice: 0 });
//   };

//   const { totalDuration, totalPrice } = calculateTotals();

//   const convertToISOString = (time12h) => {
//     const [time, modifier] = time12h.split(' ');
//     let [hours, minutes] = time.split(':').map(Number);

//     if (modifier === 'PM' && hours !== 12) hours += 12;
//     if (modifier === 'AM' && hours === 12) hours = 0;

//     const date = new Date(selectedDate);
//     date.setHours(hours);
//     date.setMinutes(minutes);
//     date.setSeconds(0);
//     date.setMilliseconds(0);

//     return date.toISOString();
//   };

//   const calculateEndTime = (startTimeISO) => {
//     // Calculate end time based on total duration of selected services
//     const startTime = new Date(startTimeISO);
//     const endTime = new Date(startTime.getTime() + totalDuration * 60000);
//     return endTime.toISOString();
//   };

//   const handleBookAppointment = async () => {
//     if (selectedServices.length === 0) {
//       Alert.alert("Error", "Please select at least one service");
//       return;
//     }
//     if (!selectedTime) {
//       Alert.alert("Error", "Please select a time slot");
//       return;
//     }
//     if (!selectedStylist) {
//       Alert.alert("Error", "Please select a stylist");
//       return;
//     }

//     setLoading(true);

//     try {
//       const startDateTimeISO = convertToISOString(selectedTime);
//       const endDateTimeISO = calculateEndTime(startDateTimeISO);

//       // Prepare appointment services array with service IDs
//       const appointmentServices = selectedServices.map(service => ({
//         service: service.service // Assuming this is the service ID
//       }));

//       const payload = {
//         appointment_services: appointmentServices,
//         start_datetime: startDateTimeISO,
//         end_datetime: endDateTimeISO,
//         status: "Offline Booking",
//         salon: salonId,
//         stylist: selectedStylist.id
//       };

//       console.log("Sending Payload", payload);

//       const response = await axios.post(
//         "https://yaslaservice.com:81/appointments/",
//         payload
//       );

//       setLoading(false);
      
//       // Reset all selections
//       setSelectedServices([]);
//       setSelectedStylist(null);
//       setSelectedTime(null);
//       setSelectedDate(new Date().toISOString().split('T')[0]);
      
//       Alert.alert(
//         "Booking Successful",
//         `Appointment has been booked for walk-in customer! OTP: ${response.data.data.otp_code}`,
//         [{ text: "OK" }]
//       );
//     } catch (error) {
//       setLoading(false);
//       console.error("Appointment post error:", error);

//       if (error.response) {
//         Alert.alert(
//           "Error",
//           `Failed to book appointment.\nServer responded with: ${JSON.stringify(error.response.data)}`
//         );
//       } else if (error.request) {
//         Alert.alert("Error", "No response from server. Check your network.");
//       } else {
//         Alert.alert("Error", "An unexpected error occurred.");
//       }
//     }
//   };

//   const formatTime = (time) => {
//     return time.replace(/\s([AP]M)$/, '$1');
//   };

//   if (loading) {
//     return (
//       <View style={[styles.container, styles.center]}>
//         <ActivityIndicator size="large" color="#0000ff" />
//         <Text>Loading data...</Text>
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={[styles.container, styles.center]}>
//         <Text>Error loading data. Please try again later.</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {/* Salon Header */}
//       <View style={styles.header}>
//         <View style={styles.headerTextContainer}>
//           <Text style={styles.salonName}>Offline Booking</Text>
//         </View>
//       </View>

//       {/* Gender Tabs */}
//       <View style={styles.tabsWrapper}>
//         <FlatList
//           horizontal
//           data={['Male', 'Female']}
//           keyExtractor={(item) => item}
//           renderItem={({ item }) => (
//             <TouchableOpacity
//               style={[
//                 styles.tab,
//                 activeTab === item && styles.activeTab
//               ]}
//               onPress={() => setActiveTab(item)}
//             >
//               <Text style={[
//                 styles.tabText,
//                 activeTab === item && styles.activeTabText
//               ]}>
//                 {item}
//               </Text>
//             </TouchableOpacity>
//           )}
//           contentContainerStyle={styles.tabContainer}
//           showsHorizontalScrollIndicator={false}
//         />
//       </View>

//       {/* Service Category Tabs */}
//       <View style={styles.tabsWrapper}>
//         <FlatList
//           horizontal
//           data={categories}
//           keyExtractor={(item) => item.id.toString()}
//           renderItem={({ item }) => (
//             <TouchableOpacity
//               style={[
//                 styles.categoryTab,
//                 selectedCategory === item.name && styles.activeCategoryTab
//               ]}
//               onPress={() => setSelectedCategory(item.name)}
//             >
//               <Text style={[
//                 styles.categoryTabText,
//                 selectedCategory === item.name && styles.activeCategoryTabText
//               ]}>
//                 {item.name}
//               </Text>
//             </TouchableOpacity>
//           )}
//           contentContainerStyle={styles.tabContainer}
//           showsHorizontalScrollIndicator={false}
//         />
//       </View>

//       {/* Services List */}
//       <ScrollView>
//         {/* Selected Services Summary */}
//         {selectedServices.length > 0 && (
//           <View style={styles.selectedServicesSummary}>
//             <Text style={styles.summaryTitle}>Selected Services</Text>
//             {selectedServices.map(service => (
//               <View key={service.id} style={styles.selectedServiceItem}>
//                 <Ionicons
//                   name="checkmark-circle"
//                   size={16}
//                   color="#4CAF50"
//                   style={styles.serviceCheckIcon}
//                 />
//                 <View style={styles.serviceDetails}>
//                   <Text style={styles.selectedServiceName}>{service.name}</Text>
//                   <Text style={styles.selectedServiceDetails}>
//                     {service.duration} • {service.price}
//                   </Text>
//                 </View>
//                 <TouchableOpacity
//                   onPress={() => handleServiceSelect(service)}
//                   style={styles.removeServiceBtn}
//                 >
//                   <Ionicons name="close" size={16} color="#FF6B6B" />
//                 </TouchableOpacity>
//               </View>
//             ))}
//             <View style={styles.totalsContainer}>
//               <Text style={styles.totalText}>Total: ~{totalDuration} mins • ₹{totalPrice}</Text>
//             </View>
//           </View>
//         )}

//         {/* Services for Selected Category */}
//         {selectedCategory && servicesByCategory[selectedCategory] && (
//           <View style={styles.servicesContainer}>
//             {servicesByCategory[selectedCategory].map(service => (
//               <TouchableOpacity
//                 key={service.id}
//                 style={[
//                   styles.serviceCard,
//                   isServiceSelected(service) && styles.selectedServiceCard
//                 ]}
//                 onPress={() => handleServiceSelect(service)}
//               >
//                 <View style={styles.serviceInfo}>
//                   <Text style={styles.serviceName}>{service.name}</Text>
//                   <View style={styles.serviceMeta}>
//                     <Text style={styles.serviceDuration}>{service.duration}</Text>
//                     <Text style={styles.servicePrice}>{service.price}</Text>
//                   </View>
//                 </View>
//                 <Ionicons
//                   name={isServiceSelected(service) ? 'checkmark-circle' : 'add-circle'}
//                   size={20}
//                   color={isServiceSelected(service) ? "#4CAF50" : "#FF6B6B"}
//                 />
//               </TouchableOpacity>
//             ))}
//           </View>
//         )}

//         {/* Booking Section */}
//         {selectedServices.length > 0 && (
//           <View style={styles.bookingSection}>
//             {/* Date Selection */}
//             <Text style={styles.sectionTitle}>Select Date</Text>
//             <TouchableOpacity
//               style={styles.dateSelector}
//               onPress={() => setShowCalendar(!showCalendar)}
//             >
//               <Ionicons name="calendar" size={20} color="#FF6B6B" />
//               <Text style={styles.dateText}>
//                 {new Date(selectedDate).toLocaleDateString('en-US', {
//                   weekday: 'long',
//                   month: 'long',
//                   day: 'numeric'
//                 })}
//               </Text>
//             </TouchableOpacity>

//             {showCalendar && (
//               <View style={styles.calendarContainer}>
//                 <Calendar
//                   current={selectedDate}
//                   minDate={new Date().toISOString().split('T')[0]}
//                   onDayPress={handleDateSelect}
//                   markedDates={markedDates}
//                   theme={{
//                     selectedDayBackgroundColor: '#FF6B6B',
//                     todayTextColor: '#FF6B6B',
//                     arrowColor: '#FF6B6B',
//                   }}
//                 />
//               </View>
//             )}

//             {/* Stylist Selection */}
//             <Text style={styles.sectionTitle}>Preferred Stylist</Text>
//             <FlatList
//               horizontal
//               data={stylists}
//               keyExtractor={(item) => item.id.toString()}
//               renderItem={({ item: stylist }) => (
//                 <TouchableOpacity
//                   style={[
//                     styles.stylistCard,
//                     selectedStylist?.id === stylist.id && styles.selectedStylistCard
//                   ]}
//                   onPress={() => handleStylistSelect(stylist)}
//                 >
//                   <Image
//                     source={{ uri: stylist.image }}
//                     style={styles.stylistImage}
//                   />
//                   <Text style={styles.stylistName}>{stylist.name}</Text>
//                   <Text style={styles.stylistSpecialty}>{stylist.specialty}</Text>
//                   <Text style={styles.stylistRating}>★ {stylist.rating}</Text>
//                 </TouchableOpacity>
//               )}
//               contentContainerStyle={styles.stylistContainer}
//               showsHorizontalScrollIndicator={false}
//             />

//             {/* Time Slots */}
//             <Text style={styles.sectionTitle}>Available Time Slots</Text>
//             {loadingSlots ? (
//               <ActivityIndicator size="small" color="#FF6B6B" />
//             ) : (
//               <View style={styles.timeSlotsGrid}>
//                 {timeSlots.map((time, index) => (
//                   <TouchableOpacity
//                     key={index}
//                     style={[
//                       styles.timeSlot,
//                       selectedTime === time && styles.selectedTimeSlot,
//                       !availableSlots.includes(time) && styles.unavailableTimeSlot
//                     ]}
//                     onPress={() => availableSlots.includes(time) && handleTimeSelect(time)}
//                     disabled={!availableSlots.includes(time)}
//                   >
//                     {availableSlots.includes(time) ? (
//                       <Text style={[
//                         styles.timeSlotText,
//                         selectedTime === time && styles.selectedTimeSlotText
//                       ]}>
//                         {formatTime(time)}
//                       </Text>
//                     ) : (
//                       <Text style={styles.bookedText}>Booked</Text>
//                     )}
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             )}

//             {/* Book Button */}
//             {selectedTime && (
//               <TouchableOpacity
//                 style={styles.bookButton}
//                 onPress={handleBookAppointment}
//               >
//                 <Text style={styles.bookButtonText}>
//                   {selectedStylist
//                     ? `Book with ${selectedStylist.name} at ${formatTime(selectedTime)}`
//                     : `Book at ${formatTime(selectedTime)}`
//                   }
//                 </Text>
//                 <Text style={styles.bookButtonSubtext}>
//                   {selectedServices.length} service{selectedServices.length > 1 ? 's' : ''} selected
//                 </Text>
//               </TouchableOpacity>
//             )}
//           </View>
//         )}
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   center: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 16,
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   headerTextContainer: {
//     flex: 1,
//   },
//   salonName: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   tabsWrapper: {
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   tabContainer: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//   },
//   tab: {
//     paddingHorizontal: 20,
//     paddingVertical: 12,
//     marginRight: 16,
//     borderRadius: 8,
//     backgroundColor: '#f5f5f5',
//   },
//   activeTab: {
//     backgroundColor: '#FF6B6B',
//   },
//   tabText: {
//     fontWeight: '600',
//     color: '#666',
//   },
//   activeTabText: {
//     color: '#fff',
//   },
//   categoryTab: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     marginRight: 12,
//     borderRadius: 20,
//     backgroundColor: '#f5f5f5',
//   },
//   activeCategoryTab: {
//     backgroundColor: '#FF6B6B',
//   },
//   categoryTabText: {
//     fontSize: 14,
//     color: '#666',
//   },
//   activeCategoryTabText: {
//     color: '#fff',
//   },
//   selectedServicesSummary: {
//     padding: 16,
//     backgroundColor: '#f9f9f9',
//     margin: 16,
//     borderRadius: 8,
//   },
//   summaryTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 12,
//     color: '#333',
//   },
//   selectedServiceItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   serviceCheckIcon: {
//     marginRight: 8,
//   },
//   serviceDetails: {
//     flex: 1,
//   },
//   selectedServiceName: {
//     fontWeight: '600',
//     color: '#333',
//   },
//   selectedServiceDetails: {
//     fontSize: 12,
//     color: '#666',
//   },
//   removeServiceBtn: {
//     padding: 4,
//   },
//   totalsContainer: {
//     marginTop: 12,
//     paddingTop: 12,
//     borderTopWidth: 1,
//     borderTopColor: '#eee',
//   },
//   totalText: {
//     fontWeight: 'bold',
//     color: '#FF6B6B',
//   },
//   servicesContainer: {
//     padding: 16,
//   },
//   serviceCard: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 16,
//     backgroundColor: '#f9f9f9',
//     borderRadius: 8,
//     marginBottom: 12,
//   },
//   selectedServiceCard: {
//     backgroundColor: '#FF6B6B20',
//     borderColor: '#FF6B6B',
//     borderWidth: 1,
//   },
//   serviceInfo: {
//     flex: 1,
//   },
//   serviceName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 4,
//   },
//   serviceMeta: {
//     flexDirection: 'row',
//   },
//   serviceDuration: {
//     fontSize: 14,
//     color: '#666',
//     marginRight: 12,
//   },
//   servicePrice: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#FF6B6B',
//   },
//   bookingSection: {
//     padding: 16,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 16,
//     color: '#333',
//   },
//   dateSelector: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 12,
//     backgroundColor: '#f9f9f9',
//     borderRadius: 8,
//     marginBottom: 16,
//   },
//   dateText: {
//     marginLeft: 12,
//     fontSize: 16,
//     color: '#333',
//   },
//   calendarContainer: {
//     marginBottom: 16,
//   },
//   stylistContainer: {
//     paddingBottom: 8,
//   },
//   stylistCard: {
//     alignItems: 'center',
//     padding: 12,
//     backgroundColor: '#f9f9f9',
//     borderRadius: 12,
//     marginRight: 16,
//     width: 100,
//   },
//   selectedStylistCard: {
//     backgroundColor: '#FF6B6B20',
//     borderColor: '#FF6B6B',
//     borderWidth: 1,
//   },
//   stylistImage: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     marginBottom: 8,
//   },
//   stylistName: {
//     fontWeight: '600',
//     color: '#333',
//     fontSize: 14,
//   },
//   stylistSpecialty: {
//     fontSize: 12,
//     color: '#666',
//     textAlign: 'center',
//   },
//   stylistRating: {
//     fontSize: 12,
//     color: '#ffc107',
//     marginTop: 4,
//   },
//   timeSlotsGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },
//   timeSlot: {
//     width: '30%',
//     padding: 12,
//     backgroundColor: '#f9f9f9',
//     borderRadius: 8,
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   selectedTimeSlot: {
//     backgroundColor: '#FF6B6B',
//   },
//   unavailableTimeSlot: {
//     backgroundColor: '#f0f0f0',
//   },
//   timeSlotText: {
//     color: '#333',
//     fontWeight: '500',
//   },
//   selectedTimeSlotText: {
//     color: '#fff',
//   },
//   bookedText: {
//     color: '#999',
//     fontStyle: 'italic',
//   },
//   bookButton: {
//     backgroundColor: '#FF6B6B',
//     padding: 16,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 16,
//   },
//   bookButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 16,
//     textAlign: 'center',
//   },
//   bookButtonSubtext: {
//     color: '#fff',
//     fontSize: 12,
//     marginTop: 4,
//     opacity: 0.9,
//   },
// });

// export default VendorOfflineBookingScreen;


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
import { AuthContext } from '../../../context/AuthContext';
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