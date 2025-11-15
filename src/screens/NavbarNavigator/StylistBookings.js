// import React, { useState, useEffect, useContext, useCallback } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   SafeAreaView,
//   StatusBar,
//   Image,
//   Alert,
//   ActivityIndicator
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';


// import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

// import moment from 'moment';
// import { AuthContext } from '../../context/AuthContext';

// const StylistBookings = () => {
//   const navigation = useNavigation();
//   const { user } = useContext(AuthContext);
//   const [bookings, setBookings] = useState([]);
//   const [filteredBookings, setFilteredBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState('Pending');
//   const [timeAdjustments, setTimeAdjustments] = useState({});

//   const tabs = [
//     { id: 'Pending', label: 'Pending' },
//     { id: 'Confirmed', label: 'Confirmed' },
//     { id: 'Completed', label: 'Completed' },
//     { id: 'Declined', label: 'Declined' },
//   ];

//   const [countdowns, setCountdowns] = useState({});

//   // Add this useEffect to handle countdown updates
//   useEffect(() => {
//     const countdownIntervals = {};

//     bookings.forEach(booking => {
//       if (booking.status === 'pending' && booking.originalCreatedAt) {
//         const createdTime = new Date(booking.originalCreatedAt);
//         const now = new Date();
//         const elapsed = Math.floor((now - createdTime) / 1000);
//         const remaining = Math.max(30 - elapsed, 0);

//         // Set initial countdown value
//         setCountdowns(prev => ({
//           ...prev,
//           [booking.id]: remaining
//         }));

//         // Only start interval if there's time remaining
//         if (remaining > 0) {
//           countdownIntervals[booking.id] = setInterval(() => {
//             setCountdowns(prev => {
//               const current = prev[booking.id];
//               if (current > 0) {
//                 return {
//                   ...prev,
//                   [booking.id]: current - 1
//                 };
//               } else {
//                 // Clear interval when countdown reaches 0
//                 if (countdownIntervals[booking.id]) {
//                   clearInterval(countdownIntervals[booking.id]);
//                 }
//                 return prev;
//               }
//             });
//           }, 1000);
//         }
//       }
//     });

//     // Cleanup function to clear all intervals
//     return () => {
//       Object.values(countdownIntervals).forEach(interval => clearInterval(interval));
//     };
//   }, [bookings]);


//   // Auto-reject functionality for pending appointments
//   useEffect(() => {
//     const autoRejectTimers = [];

//     bookings.forEach(booking => {
//       // Fix: Check for 'Pending' (capital P) to match your API response
//       if (booking.status === 'pending' && booking.originalCreatedAt) {
//         const createdTime = new Date(booking.originalCreatedAt);
//         const now = new Date();
//         const elapsed = (now - createdTime) / 1000;
//         const remaining = Math.max(30 - elapsed, 0);

//         console.log(`Appointment ${booking.id}: ${elapsed}s elapsed, ${remaining}s remaining`);

//         if (remaining > 0) {
//           const timer = setTimeout(async () => {
//             try {
//               console.log(`Auto-rejecting appointment ${booking.id}`);

//               // Try PUT method instead of PATCH, matching your other API calls
//               const response = await fetch(`https://yaslaservice.com:81/appointments/${booking.id}/`, {
//                 method: 'PUT',
//                 headers: {
//                   'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                   status: 'Declined'
//                 }),
//               });

//               const responseText = await response.text();
//               console.log(`Auto-reject response for ${booking.id}:`, response.status, responseText);

//               if (response.ok) {
//                 console.log(`Appointment ${booking.id} auto-rejected successfully`);
//                 // Refresh bookings to update UI
//                 fetchBookings();
//               } else {
//                 console.error(`Failed to auto-reject appointment ${booking.id}:`, responseText);
//               }
//             } catch (error) {
//               console.error('Auto-reject error:', error);
//             }
//           }, remaining * 1000);

//           autoRejectTimers.push(timer);
//         } else {
//           // If time already elapsed, auto-reject immediately
//           console.log(`Time elapsed for appointment ${booking.id}, rejecting immediately`);
//           handleImmediateReject(booking.id);
//         }
//       }
//     });

//     // Cleanup function to clear all timers
//     return () => {
//       autoRejectTimers.forEach(timer => clearTimeout(timer));
//     };
//   }, [bookings, fetchBookings]); // Add fetchBookings to dependencies

//   // Helper function for immediate rejection
//   const handleImmediateReject = async (bookingId) => {
//     try {
//       const response = await fetch(`https://yaslaservice.com:81/appointments/${bookingId}/`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           status: 'Declined'
//         }),
//       });

//       if (response.ok) {
//         console.log(`Appointment ${bookingId} auto-rejected immediately`);
//         fetchBookings();
//       }
//     } catch (error) {
//       console.error('Immediate reject error:', error);
//     }
//   };

//   // Wrap fetchBookings in useCallback to avoid infinite re-renders
//   const fetchBookings = useCallback(async () => {
//     try {
//       if (!user?.user_id) throw new Error('Stylist ID not found');

//       // Fetch customers
//       const customersResponse = await fetch('https://yaslaservice.com:81/customers/');
//       if (!customersResponse.ok) throw new Error(`HTTP error! status: ${customersResponse.status}`);

//       const customersData = await customersResponse.json();

//       // Extract customers array from response
//       let customersArray = [];
//       if (Array.isArray(customersData)) {
//         customersArray = customersData;
//       } else if (customersData?.results) {
//         customersArray = customersData.results;
//       } else if (customersData?.data) {
//         customersArray = customersData.data;
//       } else if (customersData?.customers) {
//         customersArray = customersData.customers;
//       } else if (customersData?.items) {
//         customersArray = customersData.items;
//       }

//       // Create customer mapping
//       const customerMap = {};
//       customersArray.forEach(customer => {
//         if (customer?.id) {
//           customerMap[customer.id] = {
//             name: customer.full_name,
//             gender: customer.gender
//           };
//         }
//       });

//       // Fetch bookings
//       const response = await fetch(`https://yaslaservice.com:81/appointments/stylist/${user.user_id}/`);
//       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

//       const data = await response.json();

//       const transformedBookings = data.map(booking => {
//         const customerInfo = customerMap[booking.customer] || {};

//         return {
//           id: booking.id.toString(),
//           customerName: customerInfo.name || 'Anonymous Customer',
//           customerGender: customerInfo.gender || 'Unknown',
//           customerImage: require('../../Logos/bookimage.jpeg'),
//           service: booking.appointment_services.map(s => s.service_name).join(' & ') || 'Unknown Service',
//           date: booking.start_datetime,
//           status: booking.status.toLowerCase(), // This converts "Pending" to "pending"
//           price: parseFloat(booking.bill_amount) || 0,
//           duration: booking.appointment_services.reduce((total, service) =>
//             total + (service.duration_min || 0), 0) + ' mins',
//           specialRequest: booking.customer_message || booking.staff_notes || '',
//           // Store the original created_at for auto-reject functionality
//           originalCreatedAt: booking.created_at
//         };
//       });

//       setBookings(transformedBookings);
//       filterBookingsByStatus(activeTab, transformedBookings);

//       // Initialize time adjustments
//       const initialAdjustments = {};
//       transformedBookings.forEach(booking => {
//         initialAdjustments[booking.id] = 0;
//       });
//       setTimeAdjustments(initialAdjustments);

//     } catch (err) {
//       console.error('Error fetching bookings:', err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }, [user?.user_id, activeTab]); // Add dependencies for useCallback
//   useEffect(() => {
//     fetchBookings();
//   }, [user?.user_id, activeTab]);

//   useEffect(() => {
//     if (bookings.length > 0) {
//       filterBookingsByStatus(activeTab);
//     }
//   }, [activeTab, bookings]);

//   const filterBookingsByStatus = (status, bookingsToFilter = bookings) => {
//     const filtered = bookingsToFilter.filter(booking => {
//       const bookingStatus = booking.status.toLowerCase();
//       switch (status.toLowerCase()) {
//         case 'pending':
//           return bookingStatus === 'pending';
//         case 'confirmed':
//           return bookingStatus === 'confirmed';
//         case 'completed':
//           return bookingStatus === 'completed';
//         case 'declined':
//           return bookingStatus === 'declined';
//         default:
//           return true;
//       }
//     });
//     setFilteredBookings(filtered);
//   };

//   const handleTimeAdjustment = (bookingId, increment) => {
//     setTimeAdjustments(prev => ({
//       ...prev,
//       [bookingId]: Math.max(0, (prev[bookingId] || 0) + increment)
//     }));
//   };

//   const convertMinutesToTimeFormat = (minutes) => {
//     const hours = Math.floor(minutes / 60);
//     const mins = minutes % 60;
//     return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:00`;
//   };

//   const updateDurationInDB = async (bookingId, newDurationMinutes) => {
//     try {

//       console.log(`Updating booking ${bookingId} with new duration: ${newDurationMinutes}`);

//       const response = await fetch(`https://yaslaservice.com:81/appointments/${bookingId}/`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           duration_minutes: newDurationMinutes
//         })
//       });
//       console.log("Response status:", response.status);

//       if (!response.ok) {
//         throw new Error('Failed to update duration');
//       }

//       Alert.alert('Success', 'Duration updated successfully');
//       fetchBookings(); // Refresh the bookings

//       // Reset the time adjustment for this booking
//       setTimeAdjustments(prev => ({
//         ...prev,
//         [bookingId]: 0
//       }));
//     } catch (err) {
//       console.error('Error updating duration:', err);
//       Alert.alert('Error', 'Failed to update duration');
//     }
//   };

//   const handleAccept = async (bookingId) => {
//     console.log('Accepting booking:', bookingId);
//     Alert.alert(
//       'Confirm Booking',
//       'Are you sure you want to accept this booking?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Accept',
//           onPress: async () => {
//             try {
//               const response = await fetch(
//                 `https://yaslaservice.com:81/appointments/${bookingId}/`,
//                 {
//                   method: 'PUT',
//                   headers: {
//                     'Content-Type': 'application/json',
//                   },
//                   body: JSON.stringify({
//                     status: 'Accepted',
//                   }),
//                 }
//               );

//               const responseText = await response.text();
//               console.log("Response body:", responseText);

//               if (!response.ok) {
//                 throw new Error(`Failed to update booking status. HTTP ${response.status}: ${responseText}`);
//               }

//               setBookings(bookings.map(booking =>
//                 booking.id === bookingId ? { ...booking, status: 'Accepted' } : booking
//               ));

//               Alert.alert('Success', 'Booking confirmed successfully');
//               fetchBookings();
//             } catch (err) {
//               console.error('Error accepting booking:', err);
//               Alert.alert('Error', `Failed to confirm booking: ${err.message}`);
//             }
//           }
//         }
//       ]
//     );
//   };

//   const handleReject = async (bookingId) => {
//     Alert.alert(
//       'Reject Booking',
//       'Are you sure you want to reject this booking?',
//       [
//         {
//           text: 'Cancel',
//           style: 'cancel'
//         },
//         {
//           text: 'Reject',
//           onPress: async () => {
//             try {
//               const response = await fetch(`https://yaslaservice.com:81/appointments/${bookingId}/`, {
//                 method: 'PUT',
//                 headers: {
//                   'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                   status: 'Declined'
//                 })
//               });

//               if (!response.ok) {
//                 throw new Error('Failed to update booking status');
//               }

//               setBookings(bookings.map(booking =>
//                 booking.id === bookingId ? { ...booking, status: 'declined' } : booking
//               ));

//               Alert.alert('Done', 'Booking has been rejected');
//               fetchBookings();
//             } catch (err) {
//               console.error('Error rejecting booking:', err);
//               Alert.alert('Error', 'Failed to reject booking');
//             }
//           }
//         }
//       ]
//     );
//   };

//   const handleComplete = async (bookingId) => {
//     Alert.alert(
//       'Mark as Completed',
//       'Have you completed this service?',
//       [
//         {
//           text: 'Cancel',
//           style: 'cancel'
//         },
//         {
//           text: 'Complete',
//           onPress: async () => {
//             try {
//               const response = await fetch(`https://yaslaservice.com:81/appointments/${bookingId}/`, {
//                 method: 'PUT',
//                 headers: {
//                   'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                   status: 'Completed'
//                 })
//               });

//               if (!response.ok) {
//                 throw new Error('Failed to update booking status');
//               }

//               setBookings(bookings.map(booking =>
//                 booking.id === bookingId ? { ...booking, status: 'completed' } : booking
//               ));

//               Alert.alert(
//                 'Service Completed',
//                 'This booking has been marked as completed. The time slot is now available for new bookings.',
//                 [{ text: 'OK' }]
//               );
//               fetchBookings();
//             } catch (err) {
//               console.error('Error completing booking:', err);
//               Alert.alert('Error', 'Failed to mark booking as completed');
//             }
//           }
//         }
//       ]
//     );
//   };

//   const getStatusColor = (status) => {
//     switch (status.toLowerCase()) {
//       case 'confirmed': return '#4CAF50';
//       case 'pending': return '#FF9800';
//       case 'declined': return '#F44336';
//       case 'completed': return '#2196F3';
//       default: return '#9E9E9E';
//     }
//   };

//   const getServiceIcon = (service) => {
//     if (service.includes('Hair Cut') || service.includes('Haircut')) return 'content-cut';
//     if (service.includes('Spa')) return 'spa';
//     if (service.includes('Color') || service.includes('Colour')) return 'palette';
//     if (service.includes('Beard') || service.includes('Shave')) return 'face';
//     return 'calendar-today';
//   };

//   if (loading) {
//     return (
//       <SafeAreaView style={styles.safeArea}>
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#2F4EAA" />
//         </View>
//       </SafeAreaView>
//     );
//   }

//   if (error) {
//     return (
//       <SafeAreaView style={styles.safeArea}>
//         <View style={styles.errorContainer}>
//           <MaterialIcons name="error" size={50} color="#F44336" />
//           <Text style={styles.errorText}>Failed to load bookings</Text>
//           <Text style={styles.errorDetail}>{error}</Text>
//           <TouchableOpacity
//             style={styles.retryButton}
//             onPress={() => {
//               setLoading(true);
//               setError(null);
//               fetchBookings();
//             }}
//           >
//             <Text style={styles.retryButtonText}>Try Again</Text>
//           </TouchableOpacity>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   const getGenderIcon = (gender) => {
//     switch (gender?.toLowerCase()) {
//       case 'male':
//         return 'gender-male';
//       case 'female':
//         return 'gender-female';
//       default:
//         return 'gender-male-female'; // For unknown or other genders
//     }
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar barStyle="dark-content" backgroundColor="#F9F9F9" />
//       <ScrollView contentContainerStyle={styles.container}>
//         <View style={styles.header}>
//           <Text style={styles.heading}>My Bookings</Text>
//         </View>

//         {/* Status Tabs */}
//         <View style={styles.tabsContainer}>
//           {tabs.map(tab => (
//             <TouchableOpacity
//               key={tab.id}
//               style={[
//                 styles.tab,
//                 activeTab === tab.id && styles.activeTab
//               ]}
//               onPress={() => setActiveTab(tab.id)}
//             >
//               <Text style={[
//                 styles.tabText,
//                 activeTab === tab.id && styles.activeTabText
//               ]}>
//                 {tab.label}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         {filteredBookings.length === 0 ? (
//           <View style={styles.emptyContainer}>
//             <MaterialIcons name="event-busy" size={50} color="#9E9E9E" />
//             <Text style={styles.emptyText}>No {activeTab.toLowerCase()} bookings found</Text>
//           </View>
//         ) : (
//           filteredBookings.map(booking => (
//             <View key={booking.id} style={styles.bookingCard}>
//               <View style={styles.bookingHeader}>
//                 <View style={styles.customerInfo}>
//                   <Image source={booking.customerImage} style={styles.customerImage} />
//                   <View>
//                     <Text style={styles.customerName}>{booking.customerName}</Text>
//                     {/* <View style={styles.ratingContainer}>
//                       <Icon name="star" size={16} color="#FFD700" />
//                       <Text style={styles.ratingText}>4.8</Text>
//                     </View> */}
//                   </View>
//                 </View>

//                 <View style={[
//                   styles.statusBadge,
//                   { backgroundColor: getStatusColor(booking.status) + '20' }
//                 ]}>
//                   <Text style={[styles.statusText, { color: getStatusColor(booking.status) }]}>
//                     {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
//                   </Text>
//                 </View>
//               </View>

//               <View style={styles.detailRow}>
//                 <MaterialCommunityIcons
//                   name={getGenderIcon(booking.customerGender)}
//                   size={20}
//                   color="#666"
//                 />
//                 <Text style={styles.detailText}>{booking.customerGender.toLocaleString('en-IN')}</Text>
//               </View>

//               <View style={styles.bookingDetails}>
//                 <View style={styles.detailRow}>
//                   <MaterialIcons name={getServiceIcon(booking.service)} size={20} color="#666" />
//                   <Text style={styles.detailText}>{booking.service}</Text>
//                 </View>

//                 <View style={styles.detailRow}>
//                   <MaterialIcons name="access-time" size={20} color="#666" />
//                   <Text style={styles.detailText}>
//                     {moment(booking.date).format('MMM D, h:mm A')} • {booking.duration}
//                   </Text>
//                 </View>

//                 <View style={styles.detailRow}>
//                   <MaterialCommunityIcons name="currency-inr" size={20} color="#666" />
//                   <Text style={styles.detailText}>{booking.price.toLocaleString('en-IN')}</Text>
//                 </View>

//                 {booking.specialRequest && (
//                   <View style={styles.detailRow}>
//                     <MaterialIcons name="info" size={20} color="#666" />
//                     <Text style={styles.detailText}>{booking.specialRequest}</Text>
//                   </View>
//                 )}
//               </View>

//             {booking.status === 'pending' && (
//   <View>
//     {/* Buttons Row */}
//     <View style={styles.actionButtons}>
//       <TouchableOpacity 
//         style={[styles.actionButton, styles.acceptButton]}
//         onPress={() => handleAccept(booking.id)}
//       >
//         <Text style={styles.actionButtonText}>Accept</Text>
//       </TouchableOpacity>
      
//       <TouchableOpacity 
//         style={[styles.actionButton, styles.rejectButton]}
//         onPress={() => handleReject(booking.id)}
//       >
//         <Text style={styles.actionButtonText}>Reject</Text>
//       </TouchableOpacity>
//     </View>

//     {/* Countdown Row */}
//     <View style={styles.countdownContainer}>
//       <MaterialIcons name="access-time" size={16} color="#2F4EAA" />
//       <Text style={styles.countdownText}>
//         {countdowns[booking.id] > 0 
//           ? `This booking will be automatically declined in ${countdowns[booking.id]}s`
//           : 'Booking will be declined shortly...'
//         }
//       </Text>
//     </View>
//   </View>
// )}


//               {booking.status === 'confirmed' && (
//                 <View style={styles.confirmedActions}>
//                   {/* Time Adjustment Section */}
//                   <View style={styles.timeAdjustmentContainer}>
//                     <Text style={styles.timeAdjustmentLabel}>Adjust Service Time:</Text>
//                     <View style={styles.quantitySelector}>
//                       <TouchableOpacity
//                         style={[styles.quantityButton, timeAdjustments[booking.id] <= 0 && styles.disabledButton]}
//                         onPress={() => handleTimeAdjustment(booking.id, -5)}
//                         disabled={timeAdjustments[booking.id] <= 0}
//                       >
//                         <Text style={styles.quantityButtonText}>-5</Text>
//                       </TouchableOpacity>

//                       <TouchableOpacity
//                         style={[styles.quantityButton, timeAdjustments[booking.id] <= 0 && styles.disabledButton]}
//                         onPress={() => handleTimeAdjustment(booking.id, -1)}
//                         disabled={timeAdjustments[booking.id] <= 0}
//                       >
//                         <Text style={styles.quantityButtonText}>-1</Text>
//                       </TouchableOpacity>

//                       <Text style={styles.quantityValue}>
//                         {timeAdjustments[booking.id] > 0 ? `+${timeAdjustments[booking.id]}` : timeAdjustments[booking.id]} min
//                       </Text>

//                       <TouchableOpacity
//                         style={styles.quantityButton}
//                         onPress={() => handleTimeAdjustment(booking.id, 1)}
//                       >
//                         <Text style={styles.quantityButtonText}>+1</Text>
//                       </TouchableOpacity>

//                       <TouchableOpacity
//                         style={styles.quantityButton}
//                         onPress={() => handleTimeAdjustment(booking.id, 5)}
//                       >
//                         <Text style={styles.quantityButtonText}>+5</Text>
//                       </TouchableOpacity>

//                       {timeAdjustments[booking.id] !== 0 && (
//                         <TouchableOpacity
//                           style={styles.addButton}
//                           onPress={() => {
//                             // Extract the original duration in minutes from the booking string
//                             const originalDuration = parseInt(booking.duration);
//                             const newDuration = originalDuration + timeAdjustments[booking.id];
//                             updateDurationInDB(booking.id, newDuration);
//                           }}
//                         >
//                           <Text style={styles.addButtonText}>Update</Text>
//                         </TouchableOpacity>
//                       )}
//                     </View>
//                   </View>

//                   <TouchableOpacity
//                     style={styles.completeButton}
//                     onPress={() => handleComplete(booking.id)}
//                   >
//                     <Text style={styles.completeButtonText}>Mark as Completed</Text>
//                   </TouchableOpacity>
//                 </View>
//               )}
//             </View>
//           ))
//         )}
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#F9F9F9',
//   },
//   container: {
//     flexGrow: 1,
//     padding: 16,
//   },
//   header: {
//     marginBottom: 20,
//   },
//   heading: {
//     fontSize: 28,
//     fontFamily: 'Inter_600SemiBold',
//     color: '#333',
//   },
//   tabsContainer: {
//     flexDirection: 'row',
//     marginBottom: 20,
//     backgroundColor: '#FFF',
//     borderRadius: 10,
//     padding: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   tab: {
//     flex: 1,
//     paddingVertical: 10,
//     alignItems: 'center',
//     borderRadius: 8,
//   },
//   activeTab: {
//     backgroundColor: '#2F4EAA',
//   },
//   tabText: {
//     fontSize: 14,
//     fontFamily: 'Inter_500Medium',
//     color: '#666',
//   },
//   activeTabText: {
//     color: '#FFF',
//     fontFamily: 'Inter_600SemiBold',
//   },
//   bookingCard: {
//     backgroundColor: '#FFF',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   bookingHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 5,
//   },
//   customerInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   customerImage: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     marginRight: 12,
//   },
//   customerName: {
//     fontSize: 20,
//     fontFamily: 'Inter_600SemiBold',
//     color: '#333',
//   },
//   customergender: {
//     fontSize: 14,
//     fontFamily: 'Inter_400Regular',
//     color: '#666',
//   },
//   ratingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 4,
//   },
//   ratingText: {
//     marginLeft: 4,
//     fontSize: 14,
//     fontFamily: 'Inter_400Regular',
//     color: '#666',
//   },
//   statusBadge: {
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 16,
//   },
//   statusText: {
//     fontSize: 12,
//     fontFamily: 'Inter_600SemiBold',
//   },
//   bookingDetails: {
//     marginBottom: 16,
//   },
//   detailRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   detailText: {
//     marginLeft: 12,
//     fontSize: 14,
//     fontFamily: 'Inter_400Regular',
//     color: '#666',
//     flex: 1,
//   },
//   actionButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   actionButton: {
//     flex: 1,
//     paddingVertical: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginHorizontal: 4,
//   },
//   acceptButton: {
//     backgroundColor: '#2F4EAA',
//   },
//   rejectButton: {
//     backgroundColor: '#F44336',
//   },
//   actionButtonText: {
//     color: '#FFF',
//     fontFamily: 'Inter_600SemiBold',
//     fontSize: 14,
//   },
//   confirmedActions: {
//     marginTop: 3,
//   },
//   timeAdjustmentContainer: {
//     marginBottom: 12,
//     alignItems: "center"
//   },
//   timeAdjustmentLabel: {
//     fontSize: 14,
//     fontFamily: 'Inter_500Medium',
//     marginBottom: 8,
//     color: '#333',
//   },
//   quantitySelector: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   quantityButton: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     backgroundColor: '#F0F0F0',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#DDD',
//   },
//   quantityButtonText: {
//     fontSize: 18,
//     fontFamily: 'Inter_600SemiBold',
//     color: '#333',
//   },
//   disabledButton: {
//     backgroundColor: '#E0E0E0',
//     borderColor: '#CCC',
//   },
//   quantityValue: {
//     fontSize: 16,
//     fontFamily: 'Inter_600SemiBold',
//     color: '#333',
//     marginHorizontal: 12,
//     minWidth: 60,
//     textAlign: 'center',
//   },
//   addButton: {
//     backgroundColor: '#2F4EAA',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 4,
//     marginLeft: 8,
//   },
//   addButtonText: {
//     color: '#FFF',
//     fontFamily: 'Inter_600SemiBold',
//     fontSize: 14,
//   },
//   completeButton: {
//     backgroundColor: '#2F4EAA',
//     paddingVertical: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   completeButtonText: {
//     color: '#FFF',
//     fontFamily: 'Inter_600SemiBold',
//     fontSize: 14,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   errorText: {
//     fontSize: 18,
//     fontFamily: 'Inter_600SemiBold',
//     color: '#333',
//     marginTop: 16,
//     marginBottom: 8,
//   },
//   errorDetail: {
//     fontSize: 14,
//     fontFamily: 'Inter_400Regular',
//     color: '#666',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   retryButton: {
//     backgroundColor: '#6C63FF',
//     paddingHorizontal: 20,
//     paddingVertical: 12,
//     borderRadius: 8,
//   },
//   retryButtonText: {
//     color: '#FFF',
//     fontFamily: 'Inter_600SemiBold',
//     fontSize: 14,
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 40,
//   },
//   emptyText: {
//     fontSize: 16,
//     fontFamily: 'Inter_400Regular',
//     color: '#666',
//     marginTop: 16,
//   },
//   countdownContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 8,
//     padding: 8,
//     backgroundColor: '#FFF3E0',
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#2F4EAA',
//   },
//   countdownText: {
//     fontSize: 12,
//     fontFamily: 'Inter_500Medium',
//     color: '#2F4EAA',
//     marginLeft: 4,
//   },
// });

// export default StylistBookings;




//=========================================================================

//Time adjustment in pending tab 

// import React, { useState, useEffect, useContext, useCallback } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   SafeAreaView,
//   StatusBar,
//   Image,
//   Alert,
//   ActivityIndicator
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
// import moment from 'moment';
// import { AuthContext } from '../../context/AuthContext';

// const StylistBookings = () => {
//   const navigation = useNavigation();
//   const { user } = useContext(AuthContext);
//   const [bookings, setBookings] = useState([]);
//   const [filteredBookings, setFilteredBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState('Pending');
//   const [timeAdjustments, setTimeAdjustments] = useState({});

//   const tabs = [
//     { id: 'Pending', label: 'Pending' },
//     { id: 'Confirmed', label: 'Confirmed' },
//     { id: 'Completed', label: 'Completed' },
//     { id: 'Declined', label: 'Declined' },
//   ];

//   const [countdowns, setCountdowns] = useState({});

//   // Add this useEffect to handle countdown updates
//   useEffect(() => {
//     const countdownIntervals = {};

//     bookings.forEach(booking => {
//       if (booking.status === 'pending' && booking.originalCreatedAt) {
//         const createdTime = new Date(booking.originalCreatedAt);
//         const now = new Date();
//         const elapsed = Math.floor((now - createdTime) / 1000);
//         const remaining = Math.max(30 - elapsed, 0);

//         // Set initial countdown value
//         setCountdowns(prev => ({
//           ...prev,
//           [booking.id]: remaining
//         }));

//         // Only start interval if there's time remaining
//         if (remaining > 0) {
//           countdownIntervals[booking.id] = setInterval(() => {
//             setCountdowns(prev => {
//               const current = prev[booking.id];
//               if (current > 0) {
//                 return {
//                   ...prev,
//                   [booking.id]: current - 1
//                 };
//               } else {
//                 // Clear interval when countdown reaches 0
//                 if (countdownIntervals[booking.id]) {
//                   clearInterval(countdownIntervals[booking.id]);
//                 }
//                 return prev;
//               }
//             });
//           }, 1000);
//         }
//       }
//     });

//     // Cleanup function to clear all intervals
//     return () => {
//       Object.values(countdownIntervals).forEach(interval => clearInterval(interval));
//     };
//   }, [bookings]);

//   // Auto-reject functionality for pending appointments
//   useEffect(() => {
//     const autoRejectTimers = [];

//     bookings.forEach(booking => {
//       // Fix: Check for 'Pending' (capital P) to match your API response
//       if (booking.status === 'pending' && booking.originalCreatedAt) {
//         const createdTime = new Date(booking.originalCreatedAt);
//         const now = new Date();
//         const elapsed = (now - createdTime) / 1000;
//         const remaining = Math.max(30 - elapsed, 0);

//         console.log(`Appointment ${booking.id}: ${elapsed}s elapsed, ${remaining}s remaining`);

//         if (remaining > 0) {
//           const timer = setTimeout(async () => {
//             try {
//               console.log(`Auto-rejecting appointment ${booking.id}`);

//               // Try PUT method instead of PATCH, matching your other API calls
//               const response = await fetch(`https://yaslaservice.com:81/appointments/${booking.id}/`, {
//                 method: 'PUT',
//                 headers: {
//                   'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                   status: 'Declined'
//                 }),
//               });

//               const responseText = await response.text();
//               console.log(`Auto-reject response for ${booking.id}:`, response.status, responseText);

//               if (response.ok) {
//                 console.log(`Appointment ${booking.id} auto-rejected successfully`);
//                 // Refresh bookings to update UI
//                 fetchBookings();
//               } else {
//                 console.error(`Failed to auto-reject appointment ${booking.id}:`, responseText);
//               }
//             } catch (error) {
//               console.error('Auto-reject error:', error);
//             }
//           }, remaining * 1000);

//           autoRejectTimers.push(timer);
//         } else {
//           // If time already elapsed, auto-reject immediately
//           console.log(`Time elapsed for appointment ${booking.id}, rejecting immediately`);
//           handleImmediateReject(booking.id);
//         }
//       }
//     });

//     // Cleanup function to clear all timers
//     return () => {
//       autoRejectTimers.forEach(timer => clearTimeout(timer));
//     };
//   }, [bookings, fetchBookings]); // Add fetchBookings to dependencies

//   // Helper function for immediate rejection
//   const handleImmediateReject = async (bookingId) => {
//     try {
//       const response = await fetch(`https://yaslaservice.com:81/appointments/${bookingId}/`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           status: 'Declined'
//         }),
//       });

//       if (response.ok) {
//         console.log(`Appointment ${bookingId} auto-rejected immediately`);
//         fetchBookings();
//       }
//     } catch (error) {
//       console.error('Immediate reject error:', error);
//     }
//   };
//     const sortBookingsByDate = (bookingsArray) => {
//     return bookingsArray.sort((a, b) => {
//       // Sort by appointment date in descending order (newest first)
//       return new Date(b.date) - new Date(a.date);
//     });
//   };

//   // Wrap fetchBookings in useCallback to avoid infinite re-renders
//   const fetchBookings = useCallback(async () => {
//     try {
//       if (!user?.user_id) throw new Error('Stylist ID not found');

//       // Fetch customers
//       const customersResponse = await fetch('https://yaslaservice.com:81/customers/');
//       if (!customersResponse.ok) throw new Error(`HTTP error! status: ${customersResponse.status}`);

//       const customersData = await customersResponse.json();

//       // Extract customers array from response
//       let customersArray = [];
//       if (Array.isArray(customersData)) {
//         customersArray = customersData;
//       } else if (customersData?.results) {
//         customersArray = customersData.results;
//       } else if (customersData?.data) {
//         customersArray = customersData.data;
//       } else if (customersData?.customers) {
//         customersArray = customersData.customers;
//       } else if (customersData?.items) {
//         customersArray = customersData.items;
//       }

//       // Create customer mapping
//       const customerMap = {};
//       customersArray.forEach(customer => {
//         if (customer?.id) {
//           customerMap[customer.id] = {
//             name: customer.full_name,
//             gender: customer.gender
//           };
//         }
//       });

//       // Fetch bookings
//       const response = await fetch(`https://yaslaservice.com:81/appointments/stylist/${user.user_id}/`);
//       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

//       const data = await response.json();

//       const transformedBookings = data.map(booking => {
//         const customerInfo = customerMap[booking.customer] || {};

//         return {
//           id: booking.id.toString(),
//           customerName: customerInfo.name || 'Anonymous Customer',
//           customerGender: customerInfo.gender || 'Unknown',
//           customerImage: require('../../Logos/bookimage.jpeg'),
//           service: booking.appointment_services.map(s => s.service_name).join(' & ') || 'Unknown Service',
//           date: booking.start_datetime,
//           status: booking.status.toLowerCase(), // This converts "Pending" to "pending"
//           price: parseFloat(booking.bill_amount) || 0,
//           duration: booking.appointment_services.reduce((total, service) =>
//             total + (service.duration_min || 0), 0) + ' mins',
//           specialRequest: booking.customer_message || booking.staff_notes || '',
//           // Store the original created_at for auto-reject functionality
//           originalCreatedAt: booking.created_at
//         };
//       });
//             const sortedBookings = sortBookingsByDate(transformedBookings);


//       setBookings(transformedBookings);
//       filterBookingsByStatus(activeTab, transformedBookings);

//       // Initialize time adjustments
//       const initialAdjustments = {};
//       transformedBookings.forEach(booking => {
//         initialAdjustments[booking.id] = 0;
//       });
//       setTimeAdjustments(initialAdjustments);

//     } catch (err) {
//       console.error('Error fetching bookings:', err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }, [user?.user_id, activeTab]); // Add dependencies for useCallback
//   useEffect(() => {
//     fetchBookings();
//   }, [user?.user_id, activeTab]);

//   useEffect(() => {
//     if (bookings.length > 0) {
//       filterBookingsByStatus(activeTab);
//     }
//   }, [activeTab, bookings]);

//   const filterBookingsByStatus = (status, bookingsToFilter = bookings) => {
//     const filtered = bookingsToFilter.filter(booking => {
//       const bookingStatus = booking.status.toLowerCase();
//       switch (status.toLowerCase()) {
//         case 'pending':
//           return bookingStatus === 'pending';
//         case 'confirmed':
//           return bookingStatus === 'confirmed';
//         case 'completed':
//           return bookingStatus === 'completed';
//         case 'declined':
//           return bookingStatus === 'declined';
//         default:
//           return true;
//       }
//     });
//     setFilteredBookings(filtered);
//   };

//   const handleTimeAdjustment = (bookingId, increment) => {
//     setTimeAdjustments(prev => ({
//       ...prev,
//       [bookingId]: Math.max(0, (prev[bookingId] || 0) + increment)
//     }));
//   };

//   const convertMinutesToTimeFormat = (minutes) => {
//     const hours = Math.floor(minutes / 60);
//     const mins = minutes % 60;
//     return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:00`;
//   };

//   const updateDurationInDB = async (bookingId, newDurationMinutes) => {
//     try {

//       console.log(`Updating booking ${bookingId} with new duration: ${newDurationMinutes}`);

//       const response = await fetch(`https://yaslaservice.com:81/appointments/${bookingId}/`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           duration_minutes: newDurationMinutes
//         })
//       });
//       console.log("Response status:", response.status);

//       if (!response.ok) {
//         throw new Error('Failed to update duration');
//       }

//       Alert.alert('Success', 'Duration updated successfully');
//       fetchBookings(); // Refresh the bookings

//       // Reset the time adjustment for this booking
//       setTimeAdjustments(prev => ({
//         ...prev,
//         [bookingId]: 0
//       }));
//     } catch (err) {
//       console.error('Error updating duration:', err);
//       Alert.alert('Error', 'Failed to update duration');
//     }
//   };

//   // const handleAccept = async (bookingId) => {
//   //   console.log('Accepting booking:', bookingId);
//   //   Alert.alert(
//   //     'Confirm Booking',
//   //     'Are you sure you want to accept this booking?',
//   //     [
//   //       { text: 'Cancel', style: 'cancel' },
//   //       {
//   //         text: 'Accept',
//   //         onPress: async () => {
//   //           try {
//   //             const response = await fetch(
//   //               `https://yaslaservice.com:81/appointments/${bookingId}/`,
//   //               {
//   //                 method: 'PUT',
//   //                 headers: {
//   //                   'Content-Type': 'application/json',
//   //                 },
//   //                 body: JSON.stringify({
//   //                   status: 'Accepted',
//   //                 }),
//   //               }
//   //             );

//   //             const responseText = await response.text();
//   //             console.log("Response body:", responseText);

//   //             if (!response.ok) {
//   //               throw new Error(`Failed to update booking status. HTTP ${response.status}: ${responseText}`);
//   //             }

//   //             setBookings(bookings.map(booking =>
//   //               booking.id === bookingId ? { ...booking, status: 'Accepted' } : booking
//   //             ));

//   //             Alert.alert('Success', 'Booking confirmed successfully');
//   //             fetchBookings();
//   //           } catch (err) {
//   //             console.error('Error accepting booking:', err);
//   //             Alert.alert('Error', `Failed to confirm booking: ${err.message}`);
//   //           }
//   //         }
//   //       }
//   //     ]
//   //   );
//   // };

//   const handleAccept = async (bookingId) => {
//   console.log('Accepting booking:', bookingId);
//   Alert.alert(
//     'Confirm Booking',
//     'Are you sure you want to accept this booking?',
//     [
//       { text: 'Cancel', style: 'cancel' },
//       {
//         text: 'Accept',
//         onPress: async () => {
//           try {
//             const response = await fetch(
//               `https://yaslaservice.com:81/appointments/${bookingId}/`,
//               {
//                 method: 'PUT',
//                 headers: {
//                   'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                   status: 'Confirmed', // ✅ change here
//                 }),
//               }
//             );

//             const responseText = await response.text();
//             console.log("Response body:", responseText);

//             if (!response.ok) {
//               throw new Error(`Failed to update booking status. HTTP ${response.status}: ${responseText}`);
//             }

//             // ✅ update state correctly
//             setBookings(bookings.map(booking =>
//               booking.id === bookingId ? { ...booking, status: 'confirmed' } : booking
//             ));

//             Alert.alert('Success', 'Booking confirmed successfully');
//             fetchBookings(); // ✅ refresh list
//           } catch (err) {
//             console.error('Error accepting booking:', err);
//             Alert.alert('Error', `Failed to confirm booking: ${err.message}`);
//           }
//         }
//       }
//     ]
//   );
// };


//   const handleReject = async (bookingId) => {
//     Alert.alert(
//       'Reject Booking',
//       'Are you sure you want to reject this booking?',
//       [
//         {
//           text: 'Cancel',
//           style: 'cancel'
//         },
//         {
//           text: 'Reject',
//           onPress: async () => {
//             try {
//               const response = await fetch(`https://yaslaservice.com:81/appointments/${bookingId}/`, {
//                 method: 'PUT',
//                 headers: {
//                   'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                   status: 'Declined'
//                 })
//               });

//               if (!response.ok) {
//                 throw new Error('Failed to update booking status');
//               }

//               setBookings(bookings.map(booking =>
//                 booking.id === bookingId ? { ...booking, status: 'declined' } : booking
//               ));

//               Alert.alert('Done', 'Booking has been rejected');
//               fetchBookings();
//             } catch (err) {
//               console.error('Error rejecting booking:', err);
//               Alert.alert('Error', 'Failed to reject booking');
//             }
//           }
//         }
//       ]
//     );
//   };

//   const handleComplete = async (bookingId) => {
//     Alert.alert(
//       'Mark as Completed',
//       'Have you completed this service?',
//       [
//         {
//           text: 'Cancel',
//           style: 'cancel'
//         },
//         {
//           text: 'Complete',
//           onPress: async () => {
//             try {
//               const response = await fetch(`https://yaslaservice.com:81/appointments/${bookingId}/`, {
//                 method: 'PUT',
//                 headers: {
//                   'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                   status: 'Completed'
//                 })
//               });

//               if (!response.ok) {
//                 throw new Error('Failed to update booking status');
//               }

//               setBookings(bookings.map(booking =>
//                 booking.id === bookingId ? { ...booking, status: 'completed' } : booking
//               ));

//               Alert.alert(
//                 'Service Completed',
//                 'This booking has been marked as completed. The time slot is now available for new bookings.',
//                 [{ text: 'OK' }]
//               );
//               fetchBookings();
//             } catch (err) {
//               console.error('Error completing booking:', err);
//               Alert.alert('Error', 'Failed to mark booking as completed');
//             }
//           }
//         }
//       ]
//     );
//   };

//   const getStatusColor = (status) => {
//     switch (status.toLowerCase()) {
//       case 'confirmed': return '#4CAF50';
//       case 'pending': return '#FF9800';
//       case 'declined': return '#F44336';
//       case 'completed': return '#2196F3';
//       default: return '#9E9E9E';
//     }
//   };

//   const getServiceIcon = (service) => {
//     if (service.includes('Hair Cut') || service.includes('Haircut')) return 'content-cut';
//     if (service.includes('Spa')) return 'spa';
//     if (service.includes('Color') || service.includes('Colour')) return 'palette';
//     if (service.includes('Beard') || service.includes('Shave')) return 'face';
//     return 'calendar-today';
//   };

//   if (loading) {
//     return (
//       <SafeAreaView style={styles.safeArea}>
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#2F4EAA" />
//         </View>
//       </SafeAreaView>
//     );
//   }

//   if (error) {
//     return (
//       <SafeAreaView style={styles.safeArea}>
//         <View style={styles.errorContainer}>
//           <MaterialIcons name="error" size={50} color="#F44336" />
//           <Text style={styles.errorText}>Failed to load bookings</Text>
//           <Text style={styles.errorDetail}>{error}</Text>
//           <TouchableOpacity
//             style={styles.retryButton}
//             onPress={() => {
//               setLoading(true);
//               setError(null);
//               fetchBookings();
//             }}
//           >
//             <Text style={styles.retryButtonText}>Try Again</Text>
//           </TouchableOpacity>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   const getGenderIcon = (gender) => {
//     switch (gender?.toLowerCase()) {
//       case 'male':
//         return 'gender-male';
//       case 'female':
//         return 'gender-female';
//       default:
//         return 'gender-male-female'; // For unknown or other genders
//     }
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar barStyle="dark-content" backgroundColor="#F9F9F9" />
//       <ScrollView contentContainerStyle={styles.container}>
//         <View style={styles.header}>
//           <Text style={styles.heading}>My Bookings</Text>
//         </View>

//         {/* Status Tabs */}
//         <View style={styles.tabsContainer}>
//           {tabs.map(tab => (
//             <TouchableOpacity
//               key={tab.id}
//               style={[
//                 styles.tab,
//                 activeTab === tab.id && styles.activeTab
//               ]}
//               onPress={() => setActiveTab(tab.id)}
//             >
//               <Text style={[
//                 styles.tabText,
//                 activeTab === tab.id && styles.activeTabText
//               ]}>
//                 {tab.label}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         {filteredBookings.length === 0 ? (
//           <View style={styles.emptyContainer}>
//             <MaterialIcons name="event-busy" size={50} color="#9E9E9E" />
//             <Text style={styles.emptyText}>No {activeTab.toLowerCase()} bookings found</Text>
//           </View>
//         ) : (
//           filteredBookings.map(booking => (
//             <View key={booking.id} style={styles.bookingCard}>
//               <View style={styles.bookingHeader}>
//                 <View style={styles.customerInfo}>
//                   <Image source={booking.customerImage} style={styles.customerImage} />
//                   <View>
//                     <Text style={styles.customerName}>{booking.customerName}</Text>
//                     {/* Booking ID Display */}
//                     <Text style={styles.bookingIdText}>Booking ID: {booking.id}</Text>
//                   </View>
//                 </View>

//                 <View style={[
//                   styles.statusBadge,
//                   { backgroundColor: getStatusColor(booking.status) + '20' }
//                 ]}>
//                   <Text style={[styles.statusText, { color: getStatusColor(booking.status) }]}>
//                     {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
//                   </Text>
//                 </View>
//               </View>

//               <View style={styles.detailRow}>
//                 <MaterialCommunityIcons
//                   name={getGenderIcon(booking.customerGender)}
//                   size={20}
//                   color="#666"
//                 />
//                 <Text style={styles.detailText}>{booking.customerGender.toLocaleString('en-IN')}</Text>
//               </View>

//               <View style={styles.bookingDetails}>
//                 <View style={styles.detailRow}>
//                   <MaterialIcons name={getServiceIcon(booking.service)} size={20} color="#666" />
//                   <Text style={styles.detailText}>{booking.service}</Text>
//                 </View>

//                 <View style={styles.detailRow}>
//                   <MaterialIcons name="access-time" size={20} color="#666" />
//                   <Text style={styles.detailText}>
//                     {moment(booking.date).format('MMM D, h:mm A')} • {booking.duration}
//                   </Text>
//                 </View>

//                 <View style={styles.detailRow}>
//                   <MaterialCommunityIcons name="currency-inr" size={20} color="#666" />
//                   <Text style={styles.detailText}>{booking.price.toLocaleString('en-IN')}</Text>
//                 </View>

//                 {booking.specialRequest && (
//                   <View style={styles.detailRow}>
//                     <MaterialIcons name="info" size={20} color="#666" />
//                     <Text style={styles.detailText}>{booking.specialRequest}</Text>
//                   </View>
//                 )}
//               </View>

//               {booking.status === 'pending' && (
//                 <View>
//                   {/* Time Adjustment Section - MOVED TO PENDING TAB */}
//                   <View style={styles.timeAdjustmentContainer}>
//                     <Text style={styles.timeAdjustmentLabel}>Adjust Service Time:</Text>
//                     <View style={styles.quantitySelector}>
//                       <TouchableOpacity
//                         style={[styles.quantityButton, timeAdjustments[booking.id] <= 0 && styles.disabledButton]}
//                         onPress={() => handleTimeAdjustment(booking.id, -5)}
//                         disabled={timeAdjustments[booking.id] <= 0}
//                       >
//                         <Text style={styles.quantityButtonText}>-5</Text>
//                       </TouchableOpacity>

//                       <TouchableOpacity
//                         style={[styles.quantityButton, timeAdjustments[booking.id] <= 0 && styles.disabledButton]}
//                         onPress={() => handleTimeAdjustment(booking.id, -1)}
//                         disabled={timeAdjustments[booking.id] <= 0}
//                       >
//                         <Text style={styles.quantityButtonText}>-1</Text>
//                       </TouchableOpacity>

//                       <Text style={styles.quantityValue}>
//                         {timeAdjustments[booking.id] > 0 ? `+${timeAdjustments[booking.id]}` : timeAdjustments[booking.id]} min
//                       </Text>

//                       <TouchableOpacity
//                         style={styles.quantityButton}
//                         onPress={() => handleTimeAdjustment(booking.id, 1)}
//                       >
//                         <Text style={styles.quantityButtonText}>+1</Text>
//                       </TouchableOpacity>

//                       <TouchableOpacity
//                         style={styles.quantityButton}
//                         onPress={() => handleTimeAdjustment(booking.id, 5)}
//                       >
//                         <Text style={styles.quantityButtonText}>+5</Text>
//                       </TouchableOpacity>

//                       {timeAdjustments[booking.id] !== 0 && (
//                         <TouchableOpacity
//                           style={styles.addButton}
//                           onPress={() => {
//                             // Extract the original duration in minutes from the booking string
//                             const originalDuration = parseInt(booking.duration);
//                             const newDuration = originalDuration + timeAdjustments[booking.id];
//                             updateDurationInDB(booking.id, newDuration);
//                           }}
//                         >
//                           <Text style={styles.addButtonText}>Update</Text>
//                         </TouchableOpacity>
//                       )}
//                     </View>
//                   </View>

//                   {/* Buttons Row */}
//                   <View style={styles.actionButtons}>
//                     <TouchableOpacity 
//                       style={[styles.actionButton, styles.acceptButton]}
//                       onPress={() => handleAccept(booking.id)}
//                     >
//                       <Text style={styles.actionButtonText}>Accept</Text>
//                     </TouchableOpacity>
                    
//                     <TouchableOpacity 
//                       style={[styles.actionButton, styles.rejectButton]}
//                       onPress={() => handleReject(booking.id)}
//                     >
//                       <Text style={styles.actionButtonText}>Reject</Text>
//                     </TouchableOpacity>
//                   </View>

//                   {/* Countdown Row */}
//                   <View style={styles.countdownContainer}>
//                     <MaterialIcons name="access-time" size={16} color="#2F4EAA" />
//                     <Text style={styles.countdownText}>
//                       {countdowns[booking.id] > 0 
//                         ? `This booking will be automatically declined in ${countdowns[booking.id]}s`
//                         : 'Booking will be declined shortly...'
//                       }
//                     </Text>
//                   </View>
//                 </View>
//               )}

//               {booking.status === 'confirmed' && (
//                 <View style={styles.confirmedActions}>
//                   <TouchableOpacity
//                     style={styles.completeButton}
//                     onPress={() => handleComplete(booking.id)}
//                   >
//                     <Text style={styles.completeButtonText}>Mark as Completed</Text>
//                   </TouchableOpacity>
//                 </View>
//               )}
//             </View>
//           ))
//         )}
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#F9F9F9',
//   },
//   container: {
//     flexGrow: 1,
//     padding: 16,
//   },
//   header: {
//     marginBottom: 20,
//   },
//   heading: {
//     fontSize: 28,
//     fontFamily: 'Inter_600SemiBold',
//     color: '#333',
//   },
//   tabsContainer: {
//     flexDirection: 'row',
//     marginBottom: 20,
//     backgroundColor: '#FFF',
//     borderRadius: 10,
//     padding: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   tab: {
//     flex: 1,
//     paddingVertical: 10,
//     alignItems: 'center',
//     borderRadius: 8,
//   },
//   activeTab: {
//     backgroundColor: '#2F4EAA',
//   },
//   tabText: {
//     fontSize: 14,
//     fontFamily: 'Inter_500Medium',
//     color: '#666',
//   },
//   activeTabText: {
//     color: '#FFF',
//     fontFamily: 'Inter_600SemiBold',
//   },
//   bookingCard: {
//     backgroundColor: '#FFF',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   bookingHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     marginBottom: 5,
//   },
//   customerInfo: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     flex: 1,
//   },
//   customerImage: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     marginRight: 12,
//   },
//   customerName: {
//     fontSize: 20,
//     fontFamily: 'Inter_600SemiBold',
//     color: '#333',
//     marginBottom: 4,
//   },
//   bookingIdText: {
//     fontSize: 14,
//     fontFamily: 'Inter_500Medium',
//     color: 'black',
//   },
//   customergender: {
//     fontSize: 14,
//     fontFamily: 'Inter_400Regular',
//     color: '#666',
//   },
//   ratingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 4,
//   },
//   ratingText: {
//     marginLeft: 4,
//     fontSize: 14,
//     fontFamily: 'Inter_400Regular',
//     color: '#666',
//   },
//   statusBadge: {
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 16,
//     marginLeft: 8,
//   },
//   statusText: {
//     fontSize: 12,
//     fontFamily: 'Inter_600SemiBold',
//   },
//   bookingDetails: {
//     marginBottom: 16,
//   },
//   detailRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   detailText: {
//     marginLeft: 12,
//     fontSize: 14,
//     fontFamily: 'Inter_400Regular',
//     color: '#666',
//     flex: 1,
//   },
//   actionButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 12,
//   },
//   actionButton: {
//     flex: 1,
//     paddingVertical: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginHorizontal: 4,
//   },
//   acceptButton: {
//     backgroundColor: '#2F4EAA',
//   },
//   rejectButton: {
//     backgroundColor: '#F44336',
//   },
//   actionButtonText: {
//     color: '#FFF',
//     fontFamily: 'Inter_600SemiBold',
//     fontSize: 14,
//   },
//   confirmedActions: {
//     marginTop: 3,
//   },
//   timeAdjustmentContainer: {
//     marginBottom: 12,
//     alignItems: "center"
//   },
//   timeAdjustmentLabel: {
//     fontSize: 14,
//     fontFamily: 'Inter_500Medium',
//     marginBottom: 8,
//     color: '#333',
//   },
//   quantitySelector: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   quantityButton: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     backgroundColor: '#F0F0F0',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#DDD',
//   },
//   quantityButtonText: {
//     fontSize: 18,
//     fontFamily: 'Inter_600SemiBold',
//     color: '#333',
//   },
//   disabledButton: {
//     backgroundColor: '#E0E0E0',
//     borderColor: '#CCC',
//   },
//   quantityValue: {
//     fontSize: 16,
//     fontFamily: 'Inter_600SemiBold',
//     color: '#333',
//     marginHorizontal: 12,
//     minWidth: 60,
//     textAlign: 'center',
//   },
//   addButton: {
//     backgroundColor: '#2F4EAA',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 4,
//     marginLeft: 8,
//   },
//   addButtonText: {
//     color: '#FFF',
//     fontFamily: 'Inter_600SemiBold',
//     fontSize: 14,
//   },
//   completeButton: {
//     backgroundColor: '#2F4EAA',
//     paddingVertical: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   completeButtonText: {
//     color: '#FFF',
//     fontFamily: 'Inter_600SemiBold',
//     fontSize: 14,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   errorText: {
//     fontSize: 18,
//     fontFamily: 'Inter_600SemiBold',
//     color: '#333',
//     marginTop: 16,
//     marginBottom: 8,
//   },
//   errorDetail: {
//     fontSize: 14,
//     fontFamily: 'Inter_400Regular',
//     color: '#666',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   retryButton: {
//     backgroundColor: '#6C63FF',
//     paddingHorizontal: 20,
//     paddingVertical: 12,
//     borderRadius: 8,
//   },
//   retryButtonText: {
//     color: '#FFF',
//     fontFamily: 'Inter_600SemiBold',
//     fontSize: 14,
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 40,
//   },
//   emptyText: {
//     fontSize: 16,
//     fontFamily: 'Inter_400Regular',
//     color: '#666',
//     marginTop: 16,
//   },
//   countdownContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 8,
//     padding: 8,
//     backgroundColor: '#FFF3E0',
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#2F4EAA',
//   },
//   countdownText: {
//     fontSize: 12,
//     fontFamily: 'Inter_500Medium',
//     color: '#2F4EAA',
//     marginLeft: 4,
//   },
// });

// export default StylistBookings;


//============================
// code with all tabs 

// import React, { useState, useEffect, useContext, useCallback } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   SafeAreaView,
//   StatusBar,
//   Image,
//   Alert,
//   ActivityIndicator
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
// import moment from 'moment';
// import { AuthContext } from '../../context/AuthContext';

// const StylistBookings = () => {
//   const navigation = useNavigation();
//   const { user } = useContext(AuthContext);
//   const [bookings, setBookings] = useState([]);
//   const [filteredBookings, setFilteredBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState('All');
//   const [timeAdjustments, setTimeAdjustments] = useState({});

//   const tabs = [
//     { id: 'All', label: 'All' },
//     { id: 'Pending', label: 'Pending' },
//     { id: 'Confirmed', label: 'Confirmed' },
//     { id: 'Completed', label: 'Completed' },
//     { id: 'Declined', label: 'Declined' },
//   ];

//   const [countdowns, setCountdowns] = useState({});

//   // Add this useEffect to handle countdown updates
//   useEffect(() => {
//     const countdownIntervals = {};

//     bookings.forEach(booking => {
//       if (booking.status === 'pending' && booking.originalCreatedAt) {
//         const createdTime = new Date(booking.originalCreatedAt);
//         const now = new Date();
//         const elapsed = Math.floor((now - createdTime) / 1000);
//         const remaining = Math.max(30 - elapsed, 0);

//         // Set initial countdown value
//         setCountdowns(prev => ({
//           ...prev,
//           [booking.id]: remaining
//         }));

//         // Only start interval if there's time remaining
//         if (remaining > 0) {
//           countdownIntervals[booking.id] = setInterval(() => {
//             setCountdowns(prev => {
//               const current = prev[booking.id];
//               if (current > 0) {
//                 return {
//                   ...prev,
//                   [booking.id]: current - 1
//                 };
//               } else {
//                 // Clear interval when countdown reaches 0
//                 if (countdownIntervals[booking.id]) {
//                   clearInterval(countdownIntervals[booking.id]);
//                 }
//                 return prev;
//               }
//             });
//           }, 1000);
//         }
//       }
//     });

//     // Cleanup function to clear all intervals
//     return () => {
//       Object.values(countdownIntervals).forEach(interval => clearInterval(interval));
//     };
//   }, [bookings]);

//   // Auto-reject functionality for pending appointments
//   useEffect(() => {
//     const autoRejectTimers = [];

//     bookings.forEach(booking => {
//       // Fix: Check for 'Pending' (capital P) to match your API response
//       if (booking.status === 'pending' && booking.originalCreatedAt) {
//         const createdTime = new Date(booking.originalCreatedAt);
//         const now = new Date();
//         const elapsed = (now - createdTime) / 1000;
//         const remaining = Math.max(30 - elapsed, 0);

//         console.log(`Appointment ${booking.id}: ${elapsed}s elapsed, ${remaining}s remaining`);

//         if (remaining > 0) {
//           const timer = setTimeout(async () => {
//             try {
//               console.log(`Auto-rejecting appointment ${booking.id}`);

//               // Try PUT method instead of PATCH, matching your other API calls
//               const response = await fetch(`https://yaslaservice.com:81/appointments/${booking.id}/`, {
//                 method: 'PUT',
//                 headers: {
//                   'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                   status: 'Declined'
//                 }),
//               });

//               const responseText = await response.text();
//               console.log(`Auto-reject response for ${booking.id}:`, response.status, responseText);

//               if (response.ok) {
//                 console.log(`Appointment ${booking.id} auto-rejected successfully`);
//                 // Refresh bookings to update UI
//                 fetchBookings();
//               } else {
//                 console.error(`Failed to auto-reject appointment ${booking.id}:`, responseText);
//               }
//             } catch (error) {
//               console.error('Auto-reject error:', error);
//             }
//           }, remaining * 1000);

//           autoRejectTimers.push(timer);
//         } else {
//           // If time already elapsed, auto-reject immediately
//           console.log(`Time elapsed for appointment ${booking.id}, rejecting immediately`);
//           handleImmediateReject(booking.id);
//         }
//       }
//     });

//     // Cleanup function to clear all timers
//     return () => {
//       autoRejectTimers.forEach(timer => clearTimeout(timer));
//     };
//   }, [bookings, fetchBookings]); // Add fetchBookings to dependencies

//   // Helper function for immediate rejection
//   const handleImmediateReject = async (bookingId) => {
//     try {
//       const response = await fetch(`https://yaslaservice.com:81/appointments/${bookingId}/`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           status: 'Declined'
//         }),
//       });

//       if (response.ok) {
//         console.log(`Appointment ${bookingId} auto-rejected immediately`);
//         fetchBookings();
//       }
//     } catch (error) {
//       console.error('Immediate reject error:', error);
//     }
//   };

//   const sortBookingsByDate = (bookingsArray) => {
//     return bookingsArray.sort((a, b) => {
//       // Sort by creation date (most recent bookings first)
//       return new Date(b.originalCreatedAt) - new Date(a.originalCreatedAt);
//     });
//   };

//   // Helper function to get payment status text
//   const getPaymentStatusText = (booking) => {
//     if (booking.status === 'completed') {
//       // For completed bookings, always show as paid (either via app or in shop)
//       return booking.paymentStatus === 'Paid' 
//         ? `Payment Received - Paid via ${booking.paymentMode || 'App'}`
//         : 'Payment Received - Paid in Shop';
//     }
    
//     if (booking.status === 'confirmed') {
//       return booking.paymentStatus === 'Paid' 
//         ? `Payment Received - Paid via ${booking.paymentMode || 'App'}`
//         : 'Payment Pending';
//     }
    
//     return booking.paymentStatus === 'Paid' ? 'Paid' : 'Unpaid';
//   };

//   const getPaymentStatusColor = (booking) => {
//     if (booking.status === 'completed' || booking.paymentStatus === 'Paid') {
//       return '#4CAF50'; // Green for paid/completed
//     }
//     return '#FF9800'; // Orange for pending
//   };

//   // Wrap fetchBookings in useCallback to avoid infinite re-renders
//   const fetchBookings = useCallback(async () => {
//     try {
//       if (!user?.user_id) throw new Error('Stylist ID not found');

//       // Fetch customers
//       const customersResponse = await fetch('https://yaslaservice.com:81/customers/');
//       if (!customersResponse.ok) throw new Error(`HTTP error! status: ${customersResponse.status}`);

//       const customersData = await customersResponse.json();

//       // Extract customers array from response
//       let customersArray = [];
//       if (Array.isArray(customersData)) {
//         customersArray = customersData;
//       } else if (customersData?.results) {
//         customersArray = customersData.results;
//       } else if (customersData?.data) {
//         customersArray = customersData.data;
//       } else if (customersData?.customers) {
//         customersArray = customersData.customers;
//       } else if (customersData?.items) {
//         customersArray = customersData.items;
//       }

//       // Create customer mapping
//       const customerMap = {};
//       customersArray.forEach(customer => {
//         if (customer?.id) {
//           customerMap[customer.id] = {
//             name: customer.full_name,
//             gender: customer.gender
//           };
//         }
//       });

//       // Fetch bookings
//       const response = await fetch(`https://yaslaservice.com:81/appointments/stylist/${user.user_id}/`);
//       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

//       const data = await response.json();

//       const transformedBookings = data.map(booking => {
//         const customerInfo = customerMap[booking.customer] || {};

//         return {
//           id: booking.id.toString(),
//           customerName: customerInfo.name || 'Anonymous Customer',
//           customerGender: customerInfo.gender || 'Unknown',
//           customerImage: require('../../Logos/bookimage.jpeg'),
//           service: booking.appointment_services.map(s => s.service_name).join(' & ') || 'Unknown Service',
//           date: booking.start_datetime,
//           status: booking.status.toLowerCase(), // This converts "Pending" to "pending"
//           paymentStatus: booking.payment_status, // Add payment status
//           paymentMode: booking.payment_mode, // Add payment mode
//           price: parseFloat(booking.bill_amount) || 0,
//           duration: booking.appointment_services.reduce((total, service) =>
//             total + (service.duration_min || 0), 0) + ' mins',
//           specialRequest: booking.customer_message || booking.staff_notes || '',
//           // Store the original created_at for auto-reject functionality
//           originalCreatedAt: booking.created_at
//         };
//       });
      
//       const sortedBookings = sortBookingsByDate(transformedBookings);

//       setBookings(transformedBookings);
//       filterBookingsByStatus(activeTab, transformedBookings);

//       // Initialize time adjustments
//       const initialAdjustments = {};
//       transformedBookings.forEach(booking => {
//         initialAdjustments[booking.id] = 0;
//       });
//       setTimeAdjustments(initialAdjustments);

//     } catch (err) {
//       console.error('Error fetching bookings:', err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }, [user?.user_id, activeTab]); // Add dependencies for useCallback

//   useEffect(() => {
//     fetchBookings();
//   }, [fetchBookings]);

//   useEffect(() => {
//     if (bookings.length > 0) {
//       filterBookingsByStatus(activeTab);
//     }
//   }, [activeTab, bookings]);

//   const filterBookingsByStatus = (status, bookingsToFilter = bookings) => {
//     let filtered = [];
    
//     if (status.toLowerCase() === 'all') {
//       filtered = bookingsToFilter;
//     } else {
//       filtered = bookingsToFilter.filter(booking => {
//         const bookingStatus = booking.status.toLowerCase();
//         switch (status.toLowerCase()) {
//           case 'pending':
//             return bookingStatus === 'pending';
//           case 'confirmed':
//             return bookingStatus === 'confirmed';
//           case 'completed':
//             return bookingStatus === 'completed';
//           case 'declined':
//             return bookingStatus === 'declined';
//           default:
//             return true;
//         }
//       });
//     }
//     setFilteredBookings(filtered);
//   };

//   const handleTimeAdjustment = (bookingId, increment) => {
//     setTimeAdjustments(prev => ({
//       ...prev,
//       [bookingId]: Math.max(0, (prev[bookingId] || 0) + increment)
//     }));
//   };

//   const convertMinutesToTimeFormat = (minutes) => {
//     const hours = Math.floor(minutes / 60);
//     const mins = minutes % 60;
//     return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:00`;
//   };

//   const updateDurationInDB = async (bookingId, newDurationMinutes) => {
//     try {
//       console.log(`Updating booking ${bookingId} with new duration: ${newDurationMinutes}`);

//       const response = await fetch(`https://yaslaservice.com:81/appointments/${bookingId}/`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           duration_minutes: newDurationMinutes
//         })
//       });
//       console.log("Response status:", response.status);

//       if (!response.ok) {
//         throw new Error('Failed to update duration');
//       }

//       Alert.alert('Success', 'Duration updated successfully');
//       fetchBookings(); // Refresh the bookings

//       // Reset the time adjustment for this booking
//       setTimeAdjustments(prev => ({
//         ...prev,
//         [bookingId]: 0
//       }));
//     } catch (err) {
//       console.error('Error updating duration:', err);
//       Alert.alert('Error', 'Failed to update duration');
//     }
//   };

//   const handleAccept = async (bookingId) => {
//     console.log('Accepting booking:', bookingId);
//     Alert.alert(
//       'Confirm Booking',
//       'Are you sure you want to accept this booking?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Accept',
//           onPress: async () => {
//             try {
//               const response = await fetch(
//                 `https://yaslaservice.com:81/appointments/${bookingId}/`,
//                 {
//                   method: 'PUT',
//                   headers: {
//                     'Content-Type': 'application/json',
//                   },
//                   body: JSON.stringify({
//                     status: 'Confirmed', // ✅ change here
//                   }),
//                 }
//               );

//               const responseText = await response.text();
//               console.log("Response body:", responseText);

//               if (!response.ok) {
//                 throw new Error(`Failed to update booking status. HTTP ${response.status}: ${responseText}`);
//               }

//               // ✅ update state correctly
//               setBookings(bookings.map(booking =>
//                 booking.id === bookingId ? { ...booking, status: 'confirmed' } : booking
//               ));

//               Alert.alert('Success', 'Booking confirmed successfully');
//               fetchBookings(); // ✅ refresh list
//             } catch (err) {
//               console.error('Error accepting booking:', err);
//               Alert.alert('Error', `Failed to confirm booking: ${err.message}`);
//             }
//           }
//         }
//       ]
//     );
//   };

//   const handleReject = async (bookingId) => {
//     Alert.alert(
//       'Reject Booking',
//       'Are you sure you want to reject this booking?',
//       [
//         {
//           text: 'Cancel',
//           style: 'cancel'
//         },
//         {
//           text: 'Reject',
//           onPress: async () => {
//             try {
//               const response = await fetch(`https://yaslaservice.com:81/appointments/${bookingId}/`, {
//                 method: 'PUT',
//                 headers: {
//                   'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                   status: 'Declined'
//                 })
//               });

//               if (!response.ok) {
//                 throw new Error('Failed to update booking status');
//               }

//               setBookings(bookings.map(booking =>
//                 booking.id === bookingId ? { ...booking, status: 'declined' } : booking
//               ));

//               Alert.alert('Done', 'Booking has been rejected');
//               fetchBookings();
//             } catch (err) {
//               console.error('Error rejecting booking:', err);
//               Alert.alert('Error', 'Failed to reject booking');
//             }
//           }
//         }
//       ]
//     );
//   };

//   const handleComplete = async (bookingId) => {
//     Alert.alert(
//       'Mark as Completed',
//       'Have you completed this service?',
//       [
//         {
//           text: 'Cancel',
//           style: 'cancel'
//         },
//         {
//           text: 'Complete',
//           onPress: async () => {
//             try {
//               const response = await fetch(`https://yaslaservice.com:81/appointments/${bookingId}/`, {
//                 method: 'PUT',
//                 headers: {
//                   'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                   status: 'Completed'
//                 })
//               });

//               if (!response.ok) {
//                 throw new Error('Failed to update booking status');
//               }

//               setBookings(bookings.map(booking =>
//                 booking.id === bookingId ? { ...booking, status: 'completed' } : booking
//               ));

//               Alert.alert(
//                 'Service Completed',
//                 'This booking has been marked as completed. The time slot is now available for new bookings.',
//                 [{ text: 'OK' }]
//               );
//               fetchBookings();
//             } catch (err) {
//               console.error('Error completing booking:', err);
//               Alert.alert('Error', 'Failed to mark booking as completed');
//             }
//           }
//         }
//       ]
//     );
//   };

//   const getStatusColor = (status) => {
//     switch (status.toLowerCase()) {
//       case 'confirmed': return '#4CAF50';
//       case 'pending': return '#FF9800';
//       case 'declined': return '#F44336';
//       case 'completed': return '#2196F3';
//       default: return '#9E9E9E';
//     }
//   };

//   const getServiceIcon = (service) => {
//     if (service.includes('Hair Cut') || service.includes('Haircut')) return 'content-cut';
//     if (service.includes('Spa')) return 'spa';
//     if (service.includes('Color') || service.includes('Colour')) return 'palette';
//     if (service.includes('Beard') || service.includes('Shave')) return 'face';
//     return 'calendar-today';
//   };

//   if (loading) {
//     return (
//       <SafeAreaView style={styles.safeArea}>
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#2F4EAA" />
//         </View>
//       </SafeAreaView>
//     );
//   }

//   if (error) {
//     return (
//       <SafeAreaView style={styles.safeArea}>
//         <View style={styles.errorContainer}>
//           <MaterialIcons name="error" size={50} color="#F44336" />
//           <Text style={styles.errorText}>Failed to load bookings</Text>
//           <Text style={styles.errorDetail}>{error}</Text>
//           <TouchableOpacity
//             style={styles.retryButton}
//             onPress={() => {
//               setLoading(true);
//               setError(null);
//               fetchBookings();
//             }}
//           >
//             <Text style={styles.retryButtonText}>Try Again</Text>
//           </TouchableOpacity>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   const getGenderIcon = (gender) => {
//     switch (gender?.toLowerCase()) {
//       case 'male':
//         return 'gender-male';
//       case 'female':
//         return 'gender-female';
//       default:
//         return 'gender-male-female'; // For unknown or other genders
//     }
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar barStyle="dark-content" backgroundColor="#F9F9F9" />
//       <ScrollView contentContainerStyle={styles.container}>
//         <View style={styles.header}>
//           <Text style={styles.heading}>My Bookings</Text>
//         </View>

//         {/* Status Tabs */}
//         <View style={styles.tabsContainer}>
//           {tabs.map(tab => (
//             <TouchableOpacity
//               key={tab.id}
//               style={[
//                 styles.tab,
//                 activeTab === tab.id && styles.activeTab
//               ]}
//               onPress={() => setActiveTab(tab.id)}
//             >
//               <Text style={[
//                 styles.tabText,
//                 activeTab === tab.id && styles.activeTabText
//               ]}>
//                 {tab.label}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         {filteredBookings.length === 0 ? (
//           <View style={styles.emptyContainer}>
//             <MaterialIcons name="event-busy" size={50} color="#9E9E9E" />
//             <Text style={styles.emptyText}>No {activeTab.toLowerCase()} bookings found</Text>
//           </View>
//         ) : (
//           filteredBookings.map(booking => (
//             <View key={booking.id} style={styles.bookingCard}>
//               <View style={styles.bookingHeader}>
//                 <View style={styles.customerInfo}>
//                   <Image source={booking.customerImage} style={styles.customerImage} />
//                   <View>
//                     <Text style={styles.customerName}>{booking.customerName}</Text>
//                     {/* Booking ID Display */}
//                     <Text style={styles.bookingIdText}>Booking ID: {booking.id}</Text>
//                   </View>
//                 </View>

//                 <View style={[
//                   styles.statusBadge,
//                   { backgroundColor: getStatusColor(booking.status) + '20' }
//                 ]}>
//                   <Text style={[styles.statusText, { color: getStatusColor(booking.status) }]}>
//                     {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
//                   </Text>
//                 </View>
//               </View>

//               <View style={styles.detailRow}>
//                 <MaterialCommunityIcons
//                   name={getGenderIcon(booking.customerGender)}
//                   size={20}
//                   color="#666"
//                 />
//                 <Text style={styles.detailText}>{booking.customerGender.toLocaleString('en-IN')}</Text>
//               </View>

//               <View style={styles.bookingDetails}>
//                 <View style={styles.detailRow}>
//                   <MaterialIcons name={getServiceIcon(booking.service)} size={20} color="#666" />
//                   <Text style={styles.detailText}>{booking.service}</Text>
//                 </View>

//                 <View style={styles.detailRow}>
//                   <MaterialIcons name="access-time" size={20} color="#666" />
//                   <Text style={styles.detailText}>
//                     {moment(booking.date).format('MMM D, h:mm A')} • {booking.duration}
//                   </Text>
//                 </View>

//                 <View style={styles.detailRow}>
//                   <MaterialCommunityIcons name="currency-inr" size={20} color="#666" />
//                   <Text style={styles.detailText}>{booking.price.toLocaleString('en-IN')}</Text>
//                 </View>

//                 {booking.specialRequest && (
//                   <View style={styles.detailRow}>
//                     <MaterialIcons name="info" size={20} color="#666" />
//                     <Text style={styles.detailText}>{booking.specialRequest}</Text>
//                   </View>
//                 )}
//               </View>

//               {/* Show action buttons only for pending bookings in All tab */}
//               {booking.status === 'pending' && (
//                 <View>
//                   {/* Time Adjustment Section */}
//                   <View style={styles.timeAdjustmentContainer}>
//                     <Text style={styles.timeAdjustmentLabel}>Adjust Service Time:</Text>
//                     <View style={styles.quantitySelector}>
//                       <TouchableOpacity
//                         style={[styles.quantityButton, timeAdjustments[booking.id] <= 0 && styles.disabledButton]}
//                         onPress={() => handleTimeAdjustment(booking.id, -5)}
//                         disabled={timeAdjustments[booking.id] <= 0}
//                       >
//                         <Text style={styles.quantityButtonText}>-5</Text>
//                       </TouchableOpacity>

//                       <TouchableOpacity
//                         style={[styles.quantityButton, timeAdjustments[booking.id] <= 0 && styles.disabledButton]}
//                         onPress={() => handleTimeAdjustment(booking.id, -1)}
//                         disabled={timeAdjustments[booking.id] <= 0}
//                       >
//                         <Text style={styles.quantityButtonText}>-1</Text>
//                       </TouchableOpacity>

//                       <Text style={styles.quantityValue}>
//                         {timeAdjustments[booking.id] > 0 ? `+${timeAdjustments[booking.id]}` : timeAdjustments[booking.id]} min
//                       </Text>

//                       <TouchableOpacity
//                         style={styles.quantityButton}
//                         onPress={() => handleTimeAdjustment(booking.id, 1)}
//                       >
//                         <Text style={styles.quantityButtonText}>+1</Text>
//                       </TouchableOpacity>

//                       <TouchableOpacity
//                         style={styles.quantityButton}
//                         onPress={() => handleTimeAdjustment(booking.id, 5)}
//                       >
//                         <Text style={styles.quantityButtonText}>+5</Text>
//                       </TouchableOpacity>

//                       {timeAdjustments[booking.id] !== 0 && (
//                         <TouchableOpacity
//                           style={styles.addButton}
//                           onPress={() => {
//                             // Extract the original duration in minutes from the booking string
//                             const originalDuration = parseInt(booking.duration);
//                             const newDuration = originalDuration + timeAdjustments[booking.id];
//                             updateDurationInDB(booking.id, newDuration);
//                           }}
//                         >
//                           <Text style={styles.addButtonText}>Update</Text>
//                         </TouchableOpacity>
//                       )}
//                     </View>
//                   </View>

//                   {/* Buttons Row */}
//                   <View style={styles.actionButtons}>
//                     <TouchableOpacity 
//                       style={[styles.actionButton, styles.acceptButton]}
//                       onPress={() => handleAccept(booking.id)}
//                     >
//                       <Text style={styles.actionButtonText}>Accept</Text>
//                     </TouchableOpacity>
                    
//                     <TouchableOpacity 
//                       style={[styles.actionButton, styles.rejectButton]}
//                       onPress={() => handleReject(booking.id)}
//                     >
//                       <Text style={styles.actionButtonText}>Reject</Text>
//                     </TouchableOpacity>
//                   </View>

//                   {/* Countdown Row */}
//                   <View style={styles.countdownContainer}>
//                     <MaterialIcons name="access-time" size={16} color="#2F4EAA" />
//                     <Text style={styles.countdownText}>
//                       {countdowns[booking.id] > 0 
//                         ? `This booking will be automatically declined in ${countdowns[booking.id]}s`
//                         : 'Booking will be declined shortly...'
//                       }
//                     </Text>
//                   </View>
//                 </View>
//               )}

//               {/* Show payment status and complete button for confirmed and completed bookings */}
//               {(booking.status === 'confirmed' || booking.status === 'completed') && (
//                 <View>
//                   {/* Payment Status Display */}
//                   <View style={styles.paymentStatusContainer}>
//                     <View style={[
//                       styles.paymentStatusBadge,
//                       { 
//                         backgroundColor: getPaymentStatusColor(booking) + '20',
//                         borderColor: getPaymentStatusColor(booking)
//                       }
//                     ]}>
//                       <MaterialIcons 
//                         name={(booking.status === 'completed' || booking.paymentStatus === 'Paid') ? 'check-circle' : 'pending'} 
//                         size={16} 
//                         color={getPaymentStatusColor(booking)} 
//                       />
//                       <Text style={[
//                         styles.paymentStatusText,
//                         { color: getPaymentStatusColor(booking) }
//                       ]}>
//                         {getPaymentStatusText(booking)}
//                       </Text>
//                     </View>
//                   </View>

//                   {/* Complete Button - Only show for confirmed bookings */}
                
//                 </View>
//               )}
//             </View>
//           ))
//         )}
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#F9F9F9',
//   },
//   container: {
//     flexGrow: 1,
//     padding: 16,
//   },
//   header: {
//     marginBottom: 20,
//   },
//   heading: {
//     fontSize: 28,
//     fontFamily: 'Inter_600SemiBold',
//     color: '#333',
//   },
//   tabsContainer: {
//     flexDirection: 'row',
//     marginBottom: 20,
//     backgroundColor: '#FFF',
//     borderRadius: 10,
//     padding: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   tab: {
//     flex: 1,
//     paddingVertical: 10,
//     alignItems: 'center',
//     borderRadius: 8,
//   },
//   activeTab: {
//     backgroundColor: '#2F4EAA',
//   },
//   tabText: {
//     fontSize: 14,
//     fontFamily: 'Inter_500Medium',
//     color: '#666',
//   },
//   activeTabText: {
//     color: '#FFF',
//     fontFamily: 'Inter_600SemiBold',
//   },
//   bookingCard: {
//     backgroundColor: '#FFF',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   bookingHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     marginBottom: 5,
//   },
//   customerInfo: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     flex: 1,
//   },
//   customerImage: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     marginRight: 12,
//   },
//   customerName: {
//     fontSize: 20,
//     fontFamily: 'Inter_600SemiBold',
//     color: '#333',
//     marginBottom: 4,
//   },
//   bookingIdText: {
//     fontSize: 14,
//     fontFamily: 'Inter_500Medium',
//     color: 'black',
//   },
//   customergender: {
//     fontSize: 14,
//     fontFamily: 'Inter_400Regular',
//     color: '#666',
//   },
//   ratingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 4,
//   },
//   ratingText: {
//     marginLeft: 4,
//     fontSize: 14,
//     fontFamily: 'Inter_400Regular',
//     color: '#666',
//   },
//   statusBadge: {
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 16,
//     marginLeft: 8,
//   },
//   statusText: {
//     fontSize: 12,
//     fontFamily: 'Inter_600SemiBold',
//   },
//   bookingDetails: {
//     marginBottom: 16,
//   },
//   detailRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   detailText: {
//     marginLeft: 12,
//     fontSize: 14,
//     fontFamily: 'Inter_400Regular',
//     color: '#666',
//     flex: 1,
//   },
//   actionButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 12,
//   },
//   actionButton: {
//     flex: 1,
//     paddingVertical: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginHorizontal: 4,
//   },
//   acceptButton: {
//     backgroundColor: '#2F4EAA',
//   },
//   rejectButton: {
//     backgroundColor: '#F44336',
//   },
//   actionButtonText: {
//     color: '#FFF',
//     fontFamily: 'Inter_600SemiBold',
//     fontSize: 14,
//   },
//   confirmedActions: {
//     marginTop: 3,
//   },
//   timeAdjustmentContainer: {
//     marginBottom: 12,
//     alignItems: "center"
//   },
//   timeAdjustmentLabel: {
//     fontSize: 14,
//     fontFamily: 'Inter_500Medium',
//     marginBottom: 8,
//     color: '#333',
//   },
//   quantitySelector: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   quantityButton: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     backgroundColor: '#F0F0F0',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#DDD',
//   },
//   quantityButtonText: {
//     fontSize: 18,
//     fontFamily: 'Inter_600SemiBold',
//     color: '#333',
//   },
//   disabledButton: {
//     backgroundColor: '#E0E0E0',
//     borderColor: '#CCC',
//   },
//   quantityValue: {
//     fontSize: 16,
//     fontFamily: 'Inter_600SemiBold',
//     color: '#333',
//     marginHorizontal: 12,
//     minWidth: 60,
//     textAlign: 'center',
//   },
//   addButton: {
//     backgroundColor: '#2F4EAA',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 4,
//     marginLeft: 8,
//   },
//   addButtonText: {
//     color: '#FFF',
//     fontFamily: 'Inter_600SemiBold',
//     fontSize: 14,
//   },
//   completeButton: {
//     backgroundColor: '#2F4EAA',
//     paddingVertical: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//     width: '100%',
//   },
//   completeButtonText: {
//     color: '#FFF',
//     fontFamily: 'Inter_600SemiBold',
//     fontSize: 14,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   errorText: {
//     fontSize: 18,
//     fontFamily: 'Inter_600SemiBold',
//     color: '#333',
//     marginTop: 16,
//     marginBottom: 8,
//   },
//   errorDetail: {
//     fontSize: 14,
//     fontFamily: 'Inter_400Regular',
//     color: '#666',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   retryButton: {
//     backgroundColor: '#6C63FF',
//     paddingHorizontal: 20,
//     paddingVertical: 12,
//     borderRadius: 8,
//   },
//   retryButtonText: {
//     color: '#FFF',
//     fontFamily: 'Inter_600SemiBold',
//     fontSize: 14,
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 40,
//   },
//   emptyText: {
//     fontSize: 16,
//     fontFamily: 'Inter_400Regular',
//     color: '#666',
//     marginTop: 16,
//   },
//   countdownContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 8,
//     padding: 8,
//     backgroundColor: '#FFF3E0',
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#2F4EAA',
//   },
//   countdownText: {
//     fontSize: 12,
//     fontFamily: 'Inter_500Medium',
//     color: '#2F4EAA',
//     marginLeft: 4,
//   },
//   paymentStatusContainer: {
//     marginTop: 12,
//     alignItems: 'center',
//   },
//   paymentStatusBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 8,
//     marginBottom: 8,
//     borderWidth: 1,
//   },
//   paymentStatusText: {
//     fontSize: 14,
//     fontFamily: 'Inter_600SemiBold',
//     marginLeft: 6,
//   },
// });

// export default StylistBookings;



//================================================================================

// Code with location, call and whatsapp icons

import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Image,
  Alert,
  ActivityIndicator,
  Linking
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import { AuthContext } from '../../context/AuthContext';

const StylistBookings = () => {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('All');
  const [timeAdjustments, setTimeAdjustments] = useState({});

  const tabs = [
    { id: 'All', label: 'All' },
    { id: 'Pending', label: 'Pending' },
    { id: 'Confirmed', label: 'Confirmed' },
    { id: 'Completed', label: 'Completed' },
    { id: 'Declined', label: 'Declined' },
  ];

  const [countdowns, setCountdowns] = useState({});

  // Contact Icons Functions
  const makeCall = (phoneNumber) => {
    if (!phoneNumber) {
      Alert.alert("Error", "Customer phone number not available");
      return;
    }
    
    const url = `tel:${phoneNumber}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          Alert.alert('Error', 'Calling not supported on this device');
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => {
        console.error('Error:', err);
        Alert.alert('Error', 'Failed to make call');
      });
  };

  const openWhatsApp = (phoneNumber) => {
    if (!phoneNumber) {
      Alert.alert("Error", "Customer phone number not available");
      return;
    }
    
    // Remove any non-digit characters from phone number
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    const url = `https://wa.me/${cleanPhone}`;
    
    Linking.openURL(url).catch(err => {
      console.error('Error opening WhatsApp:', err);
      Alert.alert("Error", "WhatsApp is not installed or couldn't be opened");
    });
  };

  const openMaps = (latitude, longitude, address) => {
    // If coordinates are available, use them. Otherwise use address.
    if (latitude && longitude) {
      const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
      Linking.openURL(url).catch(err => {
        console.error('Error opening maps:', err);
        Alert.alert("Error", "Could not open maps");
      });
    } else if (address) {
      const encodedAddress = encodeURIComponent(address);
      const url = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
      Linking.openURL(url).catch(err => {
        console.error('Error opening maps:', err);
        Alert.alert("Error", "Could not open maps");
      });
    } else {
      Alert.alert("Error", "Customer location information not available");
    }
  };

  // Contact Icons Component
  const ContactIcons = ({ booking }) => (
    <View style={styles.contactIconsContainer}>
      <TouchableOpacity
        onPress={() => openMaps(booking.customerLatitude, booking.customerLongitude, booking.customerAddress)}
        style={styles.iconButton}
      >
        <FontAwesome name="map-marker" size={20} color="#ff0000" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => openWhatsApp(booking.customerPhone)}
        style={styles.iconButton}
      >
        <FontAwesome name="whatsapp" size={20} color="#25D366" />
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => makeCall(booking.customerPhone)}
        style={styles.iconButton}
      >
        <FontAwesome name="phone" size={20} color="#000000" />
      </TouchableOpacity>
    </View>
  );

  // Add this useEffect to handle countdown updates
  useEffect(() => {
    const countdownIntervals = {};

    bookings.forEach(booking => {
      if (booking.status === 'pending' && booking.originalCreatedAt) {
        const createdTime = new Date(booking.originalCreatedAt);
        const now = new Date();
        const elapsed = Math.floor((now - createdTime) / 1000);
        const remaining = Math.max(30 - elapsed, 0);

        // Set initial countdown value
        setCountdowns(prev => ({
          ...prev,
          [booking.id]: remaining
        }));

        // Only start interval if there's time remaining
        if (remaining > 0) {
          countdownIntervals[booking.id] = setInterval(() => {
            setCountdowns(prev => {
              const current = prev[booking.id];
              if (current > 0) {
                return {
                  ...prev,
                  [booking.id]: current - 1
                };
              } else {
                // Clear interval when countdown reaches 0
                if (countdownIntervals[booking.id]) {
                  clearInterval(countdownIntervals[booking.id]);
                }
                return prev;
              }
            });
          }, 1000);
        }
      }
    });

    // Cleanup function to clear all intervals
    return () => {
      Object.values(countdownIntervals).forEach(interval => clearInterval(interval));
    };
  }, [bookings]);

  // Auto-reject functionality for pending appointments
  useEffect(() => {
    const autoRejectTimers = [];

    bookings.forEach(booking => {
      if (booking.status === 'pending' && booking.originalCreatedAt) {
        const createdTime = new Date(booking.originalCreatedAt);
        const now = new Date();
        const elapsed = (now - createdTime) / 1000;
        const remaining = Math.max(30 - elapsed, 0);

        console.log(`Appointment ${booking.id}: ${elapsed}s elapsed, ${remaining}s remaining`);

        if (remaining > 0) {
          const timer = setTimeout(async () => {
            try {
              console.log(`Auto-rejecting appointment ${booking.id}`);

              const response = await fetch(`https://yaslaservice.com:81/appointments/${booking.id}/`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  status: 'Declined'
                }),
              });

              const responseText = await response.text();
              console.log(`Auto-reject response for ${booking.id}:`, response.status, responseText);

              if (response.ok) {
                console.log(`Appointment ${booking.id} auto-rejected successfully`);
                fetchBookings();
              } else {
                console.error(`Failed to auto-reject appointment ${booking.id}:`, responseText);
              }
            } catch (error) {
              console.error('Auto-reject error:', error);
            }
          }, remaining * 1000);

          autoRejectTimers.push(timer);
        } else {
          console.log(`Time elapsed for appointment ${booking.id}, rejecting immediately`);
          handleImmediateReject(booking.id);
        }
      }
    });

    return () => {
      autoRejectTimers.forEach(timer => clearTimeout(timer));
    };
  }, [bookings, fetchBookings]);

  // Helper function for immediate rejection
  const handleImmediateReject = async (bookingId) => {
    try {
      const response = await fetch(`https://yaslaservice.com:81/appointments/${bookingId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'Declined'
        }),
      });

      if (response.ok) {
        console.log(`Appointment ${bookingId} auto-rejected immediately`);
        fetchBookings();
      }
    } catch (error) {
      console.error('Immediate reject error:', error);
    }
  };

  const sortBookingsByDate = (bookingsArray) => {
    return bookingsArray.sort((a, b) => {
      return new Date(b.originalCreatedAt) - new Date(a.originalCreatedAt);
    });
  };

  // Helper function to get payment status text
  const getPaymentStatusText = (booking) => {
    if (booking.status === 'completed') {
      return booking.paymentStatus === 'Paid' 
        ? `Payment Received - Paid via ${booking.paymentMode || 'App'}`
        : 'Payment Received - Paid in Shop';
    }
    
    if (booking.status === 'confirmed') {
      return booking.paymentStatus === 'Paid' 
        ? `Payment Received - Paid via ${booking.paymentMode || 'App'}`
        : 'Payment Pending';
    }
    
    return booking.paymentStatus === 'Paid' ? 'Paid' : 'Unpaid';
  };

  const getPaymentStatusColor = (booking) => {
    if (booking.status === 'completed' || booking.paymentStatus === 'Paid') {
      return '#4CAF50';
    }
    return '#FF9800';
  };

  // Wrap fetchBookings in useCallback to avoid infinite re-renders
  const fetchBookings = useCallback(async () => {
    try {
      if (!user?.user_id) throw new Error('Stylist ID not found');

      // Fetch customers
      const customersResponse = await fetch('https://yaslaservice.com:81/customers/');
      if (!customersResponse.ok) throw new Error(`HTTP error! status: ${customersResponse.status}`);

      const customersData = await customersResponse.json();

      // Extract customers array from response
      let customersArray = [];
      if (Array.isArray(customersData)) {
        customersArray = customersData;
      } else if (customersData?.results) {
        customersArray = customersData.results;
      } else if (customersData?.data) {
        customersArray = customersData.data;
      } else if (customersData?.customers) {
        customersArray = customersData.customers;
      } else if (customersData?.items) {
        customersArray = customersData.items;
      }

      // Create customer mapping with contact info
      const customerMap = {};
      customersArray.forEach(customer => {
        if (customer?.id) {
          customerMap[customer.id] = {
            name: customer.full_name,
            gender: customer.gender,
            phone: customer.phone || customer.phone_number || customer.mobile || '',
            latitude: customer.latitude || customer.lat || null,
            longitude: customer.longitude || customer.lng || null,
            address: customer.address || customer.street_address || ''
          };
        }
      });

      // Fetch bookings
      const response = await fetch(`https://yaslaservice.com:81/appointments/stylist/${user.user_id}/`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();

      const transformedBookings = data.map(booking => {
        const customerInfo = customerMap[booking.customer] || {};

        return {
          id: booking.id.toString(),
          customerName: customerInfo.name || 'Anonymous Customer',
          customerGender: customerInfo.gender || 'Unknown',
          customerImage: require('../../Logos/bookimage.jpeg'),
          service: booking.appointment_services.map(s => s.service_name).join(' & ') || 'Unknown Service',
          date: booking.start_datetime,
          status: booking.status.toLowerCase(),
          paymentStatus: booking.payment_status,
          paymentMode: booking.payment_mode,
          price: parseFloat(booking.bill_amount) || 0,
          duration: booking.appointment_services.reduce((total, service) =>
            total + (service.duration_min || 0), 0) + ' mins',
          specialRequest: booking.customer_message || booking.staff_notes || '',
          originalCreatedAt: booking.created_at,
          // Add customer contact information
          customerPhone: customerInfo.phone,
          customerLatitude: customerInfo.latitude,
          customerLongitude: customerInfo.longitude,
          customerAddress: customerInfo.address
        };
      });
      
      const sortedBookings = sortBookingsByDate(transformedBookings);

      setBookings(transformedBookings);
      filterBookingsByStatus(activeTab, transformedBookings);

      // Initialize time adjustments
      const initialAdjustments = {};
      transformedBookings.forEach(booking => {
        initialAdjustments[booking.id] = 0;
      });
      setTimeAdjustments(initialAdjustments);

    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user?.user_id, activeTab]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  useEffect(() => {
    if (bookings.length > 0) {
      filterBookingsByStatus(activeTab);
    }
  }, [activeTab, bookings]);

  const filterBookingsByStatus = (status, bookingsToFilter = bookings) => {
    let filtered = [];
    
    if (status.toLowerCase() === 'all') {
      filtered = bookingsToFilter;
    } else {
      filtered = bookingsToFilter.filter(booking => {
        const bookingStatus = booking.status.toLowerCase();
        switch (status.toLowerCase()) {
          case 'pending':
            return bookingStatus === 'pending';
          case 'confirmed':
            return bookingStatus === 'confirmed';
          case 'completed':
            return bookingStatus === 'completed';
          case 'declined':
            return bookingStatus === 'declined';
          default:
            return true;
        }
      });
    }
    setFilteredBookings(filtered);
  };

  const handleTimeAdjustment = (bookingId, increment) => {
    setTimeAdjustments(prev => ({
      ...prev,
      [bookingId]: Math.max(0, (prev[bookingId] || 0) + increment)
    }));
  };

  const updateDurationInDB = async (bookingId, newDurationMinutes) => {
    try {
      console.log(`Updating booking ${bookingId} with new duration: ${newDurationMinutes}`);

      const response = await fetch(`https://yaslaservice.com:81/appointments/${bookingId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          duration_minutes: newDurationMinutes
        })
      });
      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error('Failed to update duration');
      }

      Alert.alert('Success', 'Duration updated successfully');
      fetchBookings();

      setTimeAdjustments(prev => ({
        ...prev,
        [bookingId]: 0
      }));
    } catch (err) {
      console.error('Error updating duration:', err);
      Alert.alert('Error', 'Failed to update duration');
    }
  };

  const handleAccept = async (bookingId) => {
    console.log('Accepting booking:', bookingId);
    Alert.alert(
      'Confirm Booking',
      'Are you sure you want to accept this booking?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          onPress: async () => {
            try {
              const response = await fetch(
                `https://yaslaservice.com:81/appointments/${bookingId}/`,
                {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    status: 'Confirmed',
                  }),
                }
              );

              const responseText = await response.text();
              console.log("Response body:", responseText);

              if (!response.ok) {
                throw new Error(`Failed to update booking status. HTTP ${response.status}: ${responseText}`);
              }

              setBookings(bookings.map(booking =>
                booking.id === bookingId ? { ...booking, status: 'confirmed' } : booking
              ));

              Alert.alert('Success', 'Booking confirmed successfully');
              fetchBookings();
            } catch (err) {
              console.error('Error accepting booking:', err);
              Alert.alert('Error', `Failed to confirm booking: ${err.message}`);
            }
          }
        }
      ]
    );
  };

  const handleReject = async (bookingId) => {
    Alert.alert(
      'Reject Booking',
      'Are you sure you want to reject this booking?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Reject',
          onPress: async () => {
            try {
              const response = await fetch(`https://yaslaservice.com:81/appointments/${bookingId}/`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  status: 'Declined'
                })
              });

              if (!response.ok) {
                throw new Error('Failed to update booking status');
              }

              setBookings(bookings.map(booking =>
                booking.id === bookingId ? { ...booking, status: 'declined' } : booking
              ));

              Alert.alert('Done', 'Booking has been rejected');
              fetchBookings();
            } catch (err) {
              console.error('Error rejecting booking:', err);
              Alert.alert('Error', 'Failed to reject booking');
            }
          }
        }
      ]
    );
  };

  const handleComplete = async (bookingId) => {
    Alert.alert(
      'Mark as Completed',
      'Have you completed this service?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Complete',
          onPress: async () => {
            try {
              const response = await fetch(`https://yaslaservice.com:81/appointments/${bookingId}/`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  status: 'Completed'
                })
              });

              if (!response.ok) {
                throw new Error('Failed to update booking status');
              }

              setBookings(bookings.map(booking =>
                booking.id === bookingId ? { ...booking, status: 'completed' } : booking
              ));

              Alert.alert(
                'Service Completed',
                'This booking has been marked as completed. The time slot is now available for new bookings.',
                [{ text: 'OK' }]
              );
              fetchBookings();
            } catch (err) {
              console.error('Error completing booking:', err);
              Alert.alert('Error', 'Failed to mark booking as completed');
            }
          }
        }
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return '#4CAF50';
      case 'pending': return '#FF9800';
      case 'declined': return '#F44336';
      case 'completed': return '#2196F3';
      default: return '#9E9E9E';
    }
  };

  const getServiceIcon = (service) => {
    if (service.includes('Hair Cut') || service.includes('Haircut')) return 'content-cut';
    if (service.includes('Spa')) return 'spa';
    if (service.includes('Color') || service.includes('Colour')) return 'palette';
    if (service.includes('Beard') || service.includes('Shave')) return 'face';
    return 'calendar-today';
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2F4EAA" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <MaterialIcons name="error" size={50} color="#F44336" />
          <Text style={styles.errorText}>Failed to load bookings</Text>
          <Text style={styles.errorDetail}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setLoading(true);
              setError(null);
              fetchBookings();
            }}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const getGenderIcon = (gender) => {
    switch (gender?.toLowerCase()) {
      case 'male':
        return 'gender-male';
      case 'female':
        return 'gender-female';
      default:
        return 'gender-male-female';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9F9F9" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.heading}>My Bookings</Text>
        </View>

        {/* Status Tabs */}
        <View style={styles.tabsContainer}>
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                activeTab === tab.id && styles.activeTab
              ]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text style={[
                styles.tabText,
                activeTab === tab.id && styles.activeTabText
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {filteredBookings.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="event-busy" size={50} color="#9E9E9E" />
            <Text style={styles.emptyText}>No {activeTab.toLowerCase()} bookings found</Text>
          </View>
        ) : (
          filteredBookings.map(booking => (
            <View key={booking.id} style={styles.bookingCard}>
              <View style={styles.bookingHeader}>
                <View style={styles.customerInfo}>
                  <Image source={booking.customerImage} style={styles.customerImage} />
                  <View>
                    <Text style={styles.customerName}>{booking.customerName}</Text>
                    <Text style={styles.bookingIdText}>Booking ID: {booking.id}</Text>
                  </View>
                </View>

                <View style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(booking.status) + '20' }
                ]}>
                  <Text style={[styles.statusText, { color: getStatusColor(booking.status) }]}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </Text>
                </View>
              </View>

              {/* Contact Icons - Show for pending and confirmed bookings */}
              {(booking.status === 'pending' || booking.status === 'confirmed') && (
                <ContactIcons booking={booking} />
              )}

              <View style={styles.detailRow}>
                <MaterialCommunityIcons
                  name={getGenderIcon(booking.customerGender)}
                  size={20}
                  color="#666"
                />
                <Text style={styles.detailText}>{booking.customerGender.toLocaleString('en-IN')}</Text>
              </View>

              <View style={styles.bookingDetails}>
                <View style={styles.detailRow}>
                  <MaterialIcons name={getServiceIcon(booking.service)} size={20} color="#666" />
                  <Text style={styles.detailText}>{booking.service}</Text>
                </View>

                <View style={styles.detailRow}>
                  <MaterialIcons name="access-time" size={20} color="#666" />
                  <Text style={styles.detailText}>
                    {moment(booking.date).format('MMM D, h:mm A')} • {booking.duration}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <MaterialCommunityIcons name="currency-inr" size={20} color="#666" />
                  <Text style={styles.detailText}>{booking.price.toLocaleString('en-IN')}</Text>
                </View>

                {booking.specialRequest && (
                  <View style={styles.detailRow}>
                    <MaterialIcons name="info" size={20} color="#666" />
                    <Text style={styles.detailText}>{booking.specialRequest}</Text>
                  </View>
                )}
              </View>

              {/* Show action buttons only for pending bookings */}
              {booking.status === 'pending' && (
                <View>
                  {/* Time Adjustment Section */}
                  <View style={styles.timeAdjustmentContainer}>
                    <Text style={styles.timeAdjustmentLabel}>Adjust Service Time:</Text>
                    <View style={styles.quantitySelector}>
                      <TouchableOpacity
                        style={[styles.quantityButton, timeAdjustments[booking.id] <= 0 && styles.disabledButton]}
                        onPress={() => handleTimeAdjustment(booking.id, -5)}
                        disabled={timeAdjustments[booking.id] <= 0}
                      >
                        <Text style={styles.quantityButtonText}>-5</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.quantityButton, timeAdjustments[booking.id] <= 0 && styles.disabledButton]}
                        onPress={() => handleTimeAdjustment(booking.id, -1)}
                        disabled={timeAdjustments[booking.id] <= 0}
                      >
                        <Text style={styles.quantityButtonText}>-1</Text>
                      </TouchableOpacity>

                      <Text style={styles.quantityValue}>
                        {timeAdjustments[booking.id] > 0 ? `+${timeAdjustments[booking.id]}` : timeAdjustments[booking.id]} min
                      </Text>

                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => handleTimeAdjustment(booking.id, 1)}
                      >
                        <Text style={styles.quantityButtonText}>+1</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => handleTimeAdjustment(booking.id, 5)}
                      >
                        <Text style={styles.quantityButtonText}>+5</Text>
                      </TouchableOpacity>

                      {timeAdjustments[booking.id] !== 0 && (
                        <TouchableOpacity
                          style={styles.addButton}
                          onPress={() => {
                            const originalDuration = parseInt(booking.duration);
                            const newDuration = originalDuration + timeAdjustments[booking.id];
                            updateDurationInDB(booking.id, newDuration);
                          }}
                        >
                          <Text style={styles.addButtonText}>Update</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>

                  {/* Buttons Row */}
                  <View style={styles.actionButtons}>
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.acceptButton]}
                      onPress={() => handleAccept(booking.id)}
                    >
                      <Text style={styles.actionButtonText}>Accept</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.rejectButton]}
                      onPress={() => handleReject(booking.id)}
                    >
                      <Text style={styles.actionButtonText}>Reject</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Countdown Row */}
                  <View style={styles.countdownContainer}>
                    <MaterialIcons name="access-time" size={16} color="#2F4EAA" />
                    <Text style={styles.countdownText}>
                      {countdowns[booking.id] > 0 
                        ? `This booking will be automatically declined in ${countdowns[booking.id]}s`
                        : 'Booking will be declined shortly...'
                      }
                    </Text>
                  </View>
                </View>
              )}

              {/* Show payment status and complete button for confirmed and completed bookings */}
              {(booking.status === 'confirmed' || booking.status === 'completed') && (
                <View>
                  {/* Payment Status Display */}
                  <View style={styles.paymentStatusContainer}>
                    <View style={[
                      styles.paymentStatusBadge,
                      { 
                        backgroundColor: getPaymentStatusColor(booking) + '20',
                        borderColor: getPaymentStatusColor(booking)
                      }
                    ]}>
                      <MaterialIcons 
                        name={(booking.status === 'completed' || booking.paymentStatus === 'Paid') ? 'check-circle' : 'pending'} 
                        size={16} 
                        color={getPaymentStatusColor(booking)} 
                      />
                      <Text style={[
                        styles.paymentStatusText,
                        { color: getPaymentStatusColor(booking) }
                      ]}>
                        {getPaymentStatusText(booking)}
                      </Text>
                    </View>
                  </View>

                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  container: {
    flexGrow: 1,
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 28,
    fontFamily: 'Inter_600SemiBold',
    color: '#333',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#2F4EAA',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#666',
  },
  activeTabText: {
    color: '#FFF',
    fontFamily: 'Inter_600SemiBold',
  },
  bookingCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  customerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  customerName: {
    fontSize: 20,
    fontFamily: 'Inter_600SemiBold',
    color: '#333',
    marginBottom: 4,
  },
  bookingIdText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: 'black',
  },
  customergender: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#666',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 8,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  // Contact Icons Styles - Added to your existing styles
  contactIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginVertical: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F0F0F0',
  },
  iconButton: {
    marginRight: 20,
    padding: 8,
  },
  bookingDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 12,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#666',
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  acceptButton: {
    backgroundColor: '#2F4EAA',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  completeButton: {
    backgroundColor: '#2F4EAA',
  },
  actionButtonText: {
    color: '#FFF',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  confirmedActions: {
    marginTop: 3,
  },
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
  addButton: {
    backgroundColor: '#2F4EAA',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  addButtonText: {
    color: '#FFF',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  errorDetail: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFF',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#666',
    marginTop: 16,
  },
  countdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    padding: 8,
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2F4EAA',
  },
  countdownText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#2F4EAA',
    marginLeft: 4,
  },
  paymentStatusContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  paymentStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  paymentStatusText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    marginLeft: 6,
  },
});

export default StylistBookings;