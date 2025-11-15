

// import React, { Component } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Alert,
//   ActivityIndicator,
//   ScrollView,
//   Image,
//   FlatList,
//   RefreshControl
// } from 'react-native';
// import { MaterialIcons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
// import { AuthContext } from '../../context/AuthContext';
//   const { user } = useContext(AuthContext);

// export class StylistDashboard extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       isOnline: false,
//       isLoading: true,
//       salonId: null,
//       stats: {
//         totalBookings: 0,
//         totalAmount: 0,
//         totalServices: 0,
//         totalUsers: 0
//       },
//       popularServices: [],
//       refreshing: false,
//       ratingStats: {
//         averageRating: 4.7,
//         totalReviews: 128,
//         starsDistribution: {
//           5: 80,
//           4: 30,
//           3: 12,
//           2: 4,
//           1: 2
//         }
//       }
//     };
//   }

//   componentDidMount() {
//     this.setState({ salonId: '123' }, () => {
//       this.fetchDashboardData();
//     });
//   }

//   fetchDashboardData = async () => {
//     try {
//       this.setState({ refreshing: true });

//       // Mock data - replace with actual API calls
//       const mockStats = {
//         totalBookings: 124,
//         totalAmount: 5820,
//         totalServices: 15,
//         totalUsers: 87
//       };

//       const mockPopularServices = [
//         {
//           id: 1,
//           name: 'Haircut & Styling',
//           rating: 4.8,
//           image: 'https://via.placeholder.com/150/FF6B6B/FFFFFF?text=Haircut',
//           bookings: 45
//         },
//         {
//           id: 2,
//           name: 'Beard Trim',
//           rating: 4.7,
//           image: 'https://via.placeholder.com/150/4ECDC4/FFFFFF?text=Beard',
//           bookings: 38
//         },
//         {
//           id: 3,
//           name: 'Hair Color',
//           rating: 4.5,
//           image: 'https://via.placeholder.com/150/45B7D1/FFFFFF?text=Color',
//           bookings: 27
//         },
//         {
//           id: 4,
//           name: 'Facial',
//           rating: 4.6,
//           image: 'https://via.placeholder.com/150/FFA07A/FFFFFF?text=Facial',
//           bookings: 22
//         }
//       ];

//       const mockRatingStats = {
//         averageRating: 4.7,
//         totalReviews: 128,
//         starsDistribution: {
//           5: 80,
//           4: 30,
//           3: 12,
//           2: 4,
//           1: 2
//         }
//       };

//       setTimeout(() => {
//         this.setState({
//           stats: mockStats,
//           popularServices: mockPopularServices,
//           ratingStats: mockRatingStats,
//           isOnline: true,
//           isLoading: false,
//           refreshing: false
//         });
//       }, 1000);

//     } catch (error) {
//       Alert.alert('Error', 'Failed to load dashboard data');
//       this.setState({ isLoading: false, refreshing: false });
//     }
//   };

//   toggleStatus = () => {
//     const { isOnline } = this.state;
//     this.setState({ isOnline: !isOnline }, () => {
//       Alert.alert(
//         'Status Updated',
//         this.state.isOnline
//           ? 'Your salon is now online and accepting bookings'
//           : 'Your salon is now offline'
//       );
//     });
//   };

//   renderStatsCard = (icon, value, label, color) => (
//     <View style={[styles.statCard, { borderLeftColor: color }]}>
//       <View style={styles.statIconContainer}>
//         {icon}
//       </View>
//       <View style={styles.statTextContainer}>
//         <Text style={styles.statValue}>{value}</Text>
//         <Text style={styles.statLabel}>{label}</Text>
//       </View>
//     </View>
//   );

//   renderServiceItem = ({ item }) => (
//     <View style={styles.serviceCard}>
//       <Image source={{ uri: item.image }} style={styles.serviceImage} />
//       <View style={styles.serviceInfo}>
//         <Text style={styles.serviceName} numberOfLines={1}>{item.name}</Text>
//         <View style={styles.ratingContainer}>
//           <FontAwesome name="star" size={14} color="#FFD700" />
//           <Text style={styles.ratingText}>{item.rating}</Text>
//           <Text style={styles.bookingsText}>({item.bookings} bookings)</Text>
//         </View>
//       </View>
//     </View>
//   );

//   renderRatingBar = (stars, count, totalReviews) => {
//     const percentage = (count / totalReviews) * 100;
//     return (
//       <View style={styles.ratingBarContainer}>
//         {/* <Text style={styles.starLabel}>{stars} star</Text> */}
//         <View style={styles.ratingBarBackground}>
//           <View style={[styles.ratingBarFill, { width: `${percentage}%` }]} />
//         </View>
//         <Text style={styles.ratingCount}>{count}</Text>
//       </View>
//     );
//   };

//   render() {
//     const { isOnline, isLoading, stats, popularServices, refreshing, ratingStats } = this.state;

//     if (isLoading) {
//       return (
//         <View style={styles.loaderContainer}>
//           <ActivityIndicator size="large" color="#4CAF50" />
//         </View>
//       );
//     }

//     return (
//       <ScrollView
//         style={styles.container}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={this.fetchDashboardData}
//             colors={['#4CAF50']}
//           />
//         }
//       >
//         {/* Rating Card Section */}
//         <Text style={styles.sectionTitle}>Stylist Dashboard </Text>

//         <Text style={styles.sectionTitle}>Customer Ratings</Text>
//         <View style={styles.ratingCard}>
//           <View style={styles.ratingOverview}>
//             <Text style={styles.averageRating}>{ratingStats.averageRating}</Text>
//             <View style={styles.starsContainer}>
//               {[...Array(5)].map((_, i) => (
//                 <FontAwesome
//                   key={i}
//                   name={i < Math.floor(ratingStats.averageRating) ? 'star' : 'star-o'}
//                   size={20}
//                   color="#FFD700"
//                   style={styles.starIcon}
//                 />
//               ))}
//             </View>
//             <Text style={styles.totalReviews}>{ratingStats.totalReviews} reviews</Text>
//           </View>

//           <View style={styles.ratingDetails}>
//             {[5, 4, 3, 2, 1].map((stars) => (
//               <View key={`rating-${stars}`}>
//                 {this.renderRatingBar(
//                   stars,
//                   ratingStats.starsDistribution[stars],
//                   ratingStats.totalReviews
//                 )}
//               </View>
//             ))}
//           </View>
//         </View>

//         {/* Statistics Section */}
//         <Text style={styles.sectionTitle}>Business Overview</Text>
//         <View style={styles.statsRow}>
//           {this.renderStatsCard(
//             <MaterialCommunityIcons name="calendar-check" size={24} color="#FF6B6B" />,
//             stats.totalBookings,
//             'Total Bookings',
//             '#FF6B6B'
//           )}
//           {this.renderStatsCard(
//             <MaterialCommunityIcons name="currency-inr" size={24} color="#4CAF50" />,
//             `₹${stats.totalAmount}`,
//             'Total Revenue',
//             '#4CAF50'
//           )}
//         </View>
//         <View style={styles.statsRow}>
//           {this.renderStatsCard(
//             <MaterialCommunityIcons name="scissors-cutting" size={24} color="#45B7D1" />,
//             stats.totalServices,
//             'Total Services',
//             '#45B7D1'
//           )}

//         </View>

//         {/* Popular Services Section */}
//         <Text style={styles.sectionTitle}>Popular Services</Text>
//         <FlatList
//           data={popularServices}
//           renderItem={this.renderServiceItem}
//           keyExtractor={item => item.id.toString()}
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={styles.servicesList}
//         />
//       </ScrollView>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//     padding: 15,
//   },
//   loaderContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   statusContainer: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 20,
//     marginBottom: 15,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 15,
//     marginLeft: 5,
//   },
//   toggleButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 12,
//     borderRadius: 8,
//     marginBottom: 10,
//   },
//   onlineButton: {
//     backgroundColor: '#4CAF50',
//   },
//   offlineButton: {
//     backgroundColor: '#F44336',
//   },
//   toggleButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginLeft: 10,
//   },
//   statusDescription: {
//     fontSize: 14,
//     color: '#666',
//     textAlign: 'center',
//   },
//   statsRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 15,
//   },
//   statCard: {
//     flex: 1,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 15,
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderLeftWidth: 4,
//     marginHorizontal: 5,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   statIconContainer: {
//     marginRight: 15,
//   },
//   statTextContainer: {
//     flex: 1,
//   },
//   statValue: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 5,
//   },
//   statLabel: {
//     fontSize: 12,
//     color: '#666',
//   },
//   servicesList: {
//     paddingHorizontal: 5,
//     paddingBottom: 15,
//   },
//   serviceCard: {
//     width: 150,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     marginRight: 15,
//     overflow: 'hidden',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   serviceImage: {
//     width: '100%',
//     height: 100,
//     resizeMode: 'cover',
//   },
//   serviceInfo: {
//     padding: 10,
//   },
//   serviceName: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 5,
//   },
//   ratingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   ratingText: {
//     fontSize: 12,
//     fontWeight: 'bold',
//     color: '#333',
//     marginLeft: 5,
//     marginRight: 10,
//   },
//   bookingsText: {
//     fontSize: 10,
//     color: '#666',
//   },
//   // Rating Card Styles
//   ratingCard: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 15,
//     marginBottom: 15,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//     flexDirection: 'row',
//   },
//   ratingOverview: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingRight: 15,
//     borderRightWidth: 1,
//     borderRightColor: '#eee',
//     width: '35%',
//   },
//   averageRating: {
//     fontSize: 36,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   starsContainer: {
//     flexDirection: 'row',
//     marginVertical: 5,
//   },
//   starIcon: {
//     marginHorizontal: 2,
//   },
//   totalReviews: {
//     fontSize: 12,
//     color: '#666',
//   },
//   ratingDetails: {
//     flex: 1,
//     paddingLeft: 15,
//   },
//   ratingBarContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   starLabel: {
//     width: 50,
//     fontSize: 12,
//     color: '#666',
//   },
//   ratingBarBackground: {
//     flex: 1,
//     height: 8,
//     backgroundColor: '#eee',
//     borderRadius: 4,
//     marginHorizontal: 5,
//     overflow: 'hidden',
//   },
//   ratingBarFill: {
//     height: '100%',
//     backgroundColor: '#FFD700',
//     borderRadius: 4,
//   },
//   ratingCount: {
//     width: 30,
//     fontSize: 12,
//     color: '#666',
//     textAlign: 'right',
//   },
// });

// export default StylistDashboard;













import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  Image,
  FlatList,
  RefreshControl
} from 'react-native';
import { MaterialIcons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

export class StylistDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOnline: false,
      isLoading: true,
      salonId: null,
      stats: {
        totalBookings: 0,
        totalAmount: 0,
        totalServices: 0,
        totalUsers: 0
      },
      popularServices: [],
      refreshing: false,
      feedbacks: [],
      ratingStats: {
        averageRating: 0,
        totalReviews: 0,
        starsDistribution: {
          5: 0,
          4: 0,
          3: 0,
          2: 0,
          1: 0
        }
      }
    };
  }

  componentDidMount() {
    const { user } = this.context;
    this.setState({ salonId: user?.salon }, () => {
      this.fetchDashboardData();
    });
  }

  calculateRatingStats = (feedbacks) => {
    if (!feedbacks || feedbacks.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        starsDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      };
    }

    const totalRatings = feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0);
    const averageRating = (totalRatings / feedbacks.length).toFixed(1);

    const starsDistribution = {
      5: feedbacks.filter(f => f.rating === 5).length,
      4: feedbacks.filter(f => f.rating === 4).length,
      3: feedbacks.filter(f => f.rating === 3).length,
      2: feedbacks.filter(f => f.rating === 2).length,
      1: feedbacks.filter(f => f.rating === 1).length
    };

    return {
      averageRating: parseFloat(averageRating),
      totalReviews: feedbacks.length,
      starsDistribution
    };
  };

  // Fetch bookings and calculate revenue dynamically
  fetchTotalBookingsAndRevenue = async (stylistId, salonId) => {
    try {
      const response = await fetch(`https://yaslaservice.com:81/appointments/stylist/${stylistId}/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // Only consider appointments that belong to this salon
      const salonAppointments = data.filter(appt => appt.salon === salonId);

      const totalBookings = salonAppointments.length;

      // Calculate revenue only from Paid appointments
      const totalRevenue = salonAppointments
        .filter(appt => appt.payment_status === "Paid")
        .reduce((sum, appt) => sum + parseFloat(appt.bill_amount || 0), 0);

      return { totalBookings, totalRevenue };
    } catch (error) {
      console.error('Error fetching bookings/revenue:', error);
      return { totalBookings: 0, totalRevenue: 0 };
    }
  };

  fetchDashboardData = async () => {
    try {
      this.setState({ refreshing: true });
      const { user } = this.context;
      const { salonId } = this.state;

      // Fetch feedback data
      const feedbackRes = await fetch('https://yaslaservice.com:81/feedbacks/');
      const feedbackJson = await feedbackRes.json();
      const feedbacks = feedbackJson?.data || [];
      const ratingStats = this.calculateRatingStats(feedbacks);

      // Fetch total services dynamically
      let totalServicesCount = 0;
      if (salonId) {
        const servicesRes = await axios.get(
          `https://yaslaservice.com:81/api/service-availability/?salon_id=${salonId}`
        );
        const allServices = servicesRes.data?.data || [];
        totalServicesCount = allServices.length;
      }

      // Fetch bookings + revenue dynamically
      const { totalBookings, totalRevenue } = await this.fetchTotalBookingsAndRevenue(
        user?.user_id,
        salonId
      );

      const stats = {
        totalBookings,
        totalAmount: totalRevenue,
        totalServices: totalServicesCount,
        totalUsers: 87 // (still mock for now)
      };

      const mockPopularServices = [
        {
          id: 1,
          name: 'Haircut & Styling',
          rating: 4.8,
          image: 'https://via.placeholder.com/150/FF6B6B/FFFFFF?text=Haircut',
          bookings: 45
        },
        {
          id: 2,
          name: 'Beard Trim',
          rating: 4.7,
          image: 'https://via.placeholder.com/150/4ECDC4/FFFFFF?text=Beard',
          bookings: 38
        },
        {
          id: 3,
          name: 'Hair Color',
          rating: 4.5,
          image: 'https://via.placeholder.com/150/45B7D1/FFFFFF?text=Color',
          bookings: 27
        },
        {
          id: 4,
          name: 'Facial',
          rating: 4.6,
          image: 'https://via.placeholder.com/150/FFA07A/FFFFFF?text=Facial',
          bookings: 22
        }
      ];

      this.setState({
        stats,
        popularServices: mockPopularServices,
        feedbacks,
        ratingStats,
        isOnline: true,
        isLoading: false,
        refreshing: false
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      Alert.alert('Error', error.message || 'Failed to load dashboard data');
      this.setState({ isLoading: false, refreshing: false });
    }
  };

  toggleStatus = () => {
    const { isOnline } = this.state;
    this.setState({ isOnline: !isOnline }, () => {
      Alert.alert(
        'Status Updated',
        this.state.isOnline
          ? 'Your salon is now online and accepting bookings'
          : 'Your salon is now offline'
      );
    });
  };

  renderStatsCard = (icon, value, label, color) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statIconContainer}>{icon}</View>
      <View style={styles.statTextContainer}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
    </View>
  );

  renderServiceItem = ({ item }) => (
    <View style={styles.serviceCard}>
      <Image source={{ uri: item.image }} style={styles.serviceImage} />
      <View style={styles.serviceInfo}>
        <Text style={styles.serviceName} numberOfLines={1}>{item.name}</Text>
        <View style={styles.ratingContainer}>
          <FontAwesome name="star" size={14} color="#FFD700" />
          <Text style={styles.ratingText}>{item.rating}</Text>
          <Text style={styles.bookingsText}>({item.bookings} bookings)</Text>
        </View>
      </View>
    </View>
  );

  renderRatingBar = (stars, count, totalReviews) => {
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return (
      <View style={styles.ratingBarContainer}>
        <View style={styles.ratingBarBackground}>
          <View style={[styles.ratingBarFill, { width: `${percentage}%` }]} />
        </View>
        <Text style={styles.ratingCount}>{count}</Text>
      </View>
    );
  };

  render() {
    const { isOnline, isLoading, stats, popularServices, refreshing, ratingStats } = this.state;

    if (isLoading) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#2F4EAA" />
          <Text style={styles.loadingText}>Loading dashboard...</Text>
        </View>
      );
    }

    return (
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={this.fetchDashboardData}
            colors={['#2F4EAA']}
          />
        }
      >
        <Text style={styles.sectionTitle}>Stylist Dashboard</Text>

        {/* Rating Section */}
        <Text style={styles.sectionTitle}>Customer Ratings</Text>
        <View style={styles.ratingCard}>
          <View style={styles.ratingOverview}>
            <Text style={styles.averageRating}>{ratingStats.averageRating}</Text>
            <View style={styles.starsContainer}>
              {[...Array(5)].map((_, i) => (
                <FontAwesome
                  key={i}
                  name={i < Math.floor(ratingStats.averageRating) ? 'star' : 'star-o'}
                  size={20}
                  color="#FFD700"
                  style={styles.starIcon}
                />
              ))}
            </View>
            <Text style={styles.totalReviews}>{ratingStats.totalReviews} reviews</Text>
          </View>

          <View style={styles.ratingDetails}>
            {[5, 4, 3, 2, 1].map((stars) => (
              <View key={`rating-${stars}`} style={styles.ratingRow}>
                <Text style={styles.starLabel}>{stars} </Text>
                {this.renderRatingBar(
                  stars,
                  ratingStats.starsDistribution[stars],
                  ratingStats.totalReviews
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Business Overview */}
        <Text style={styles.sectionTitle}>Business Overview</Text>
        <View style={styles.statsRow}>
          {this.renderStatsCard(
            <MaterialCommunityIcons name="calendar-check" size={24} color="#2F4EAA" />,
            stats.totalBookings,
            'Total Bookings',
            '#2F4EAA'
          )}
          {this.renderStatsCard(
            <MaterialCommunityIcons name="currency-inr" size={24} color="#2F4EAA" />,
            `₹${stats.totalAmount.toFixed(2)}`,
            'Total Revenue',
            '#2F4EAA'
          )}
        </View>
        <View style={styles.statsRow}>
          {this.renderStatsCard(
            <MaterialCommunityIcons name="scissors-cutting" size={24} color="#2F4EAA" />,
            stats.totalServices,
            'Total Services',
            '#2F4EAA'
          )}
        </View>

        {/* Popular Services */}
        <Text style={styles.sectionTitle}>Popular Services</Text>
        <FlatList
          data={popularServices}
          renderItem={this.renderServiceItem}
          keyExtractor={item => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.servicesList}
        />
      </ScrollView>
    );
  }
}

StylistDashboard.contextType = AuthContext;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
  },
  loaderContainer: {
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
  statusContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#333',
    marginBottom: 15,
    marginLeft: 5,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  onlineButton: {
    backgroundColor: '#4CAF50',
  },
  offlineButton: {
    backgroundColor: '#F44336',
  },
  toggleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    marginLeft: 10,
  },
  statusDescription: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#666',
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIconContainer: {
    marginRight: 15,
  },
  statTextContainer: {
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Inter_600SemiBold',
    color: '#333',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#666',
  },
  servicesList: {
    paddingHorizontal: 5,
    paddingBottom: 15,
  },
  serviceCard: {
    width: 150,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginRight: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceImage: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
  serviceInfo: {
    padding: 10,
  },
  serviceName: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#333',
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: '#333',
    marginLeft: 5,
    marginRight: 10,
  },
  bookingsText: {
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
    color: '#666',
  },
  // Rating Card Styles
  ratingCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
  },
  ratingOverview: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 15,
    borderRightWidth: 1,
    borderRightColor: '#eee',
    width: '35%',
  },
  averageRating: {
    fontSize: 36,
    fontFamily: 'Inter_600SemiBold',
    color: '#333',
  },
  starsContainer: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  starIcon: {
    marginHorizontal: 2,
  },
  totalReviews: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#666',
  },
  ratingDetails: {
    flex: 1,
    paddingLeft: 15,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  starLabel: {
    width: 50,
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#666',
  },
  ratingBarContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
    marginHorizontal: 5,
    overflow: 'hidden',
  },
  ratingBarFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 4,
  },
  ratingCount: {
    width: 30,
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#666',
    textAlign: 'right',
  },
});

export default StylistDashboard;