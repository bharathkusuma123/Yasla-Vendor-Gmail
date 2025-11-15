// import React, { useContext, useState } from 'react';
// import {
//   View,
//   ActivityIndicator,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
//   Text  // Added Text import
// } from 'react-native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
// import { AuthContext } from "../src/context/AuthContext";
// import LoginScreen from "../src/screens/Login/LoginScreen";
// import SignupScreen from "../src/screens/SignUp/SignupScreen";
// import VendorProfile from '../src/screens/Pages/Vendor/VendorProfile';
// import Services from './screens/Pages/Vendor/Services';
// import Users from "../src/screens/Pages/Vendor/Users";
// import BookingScreen from "../src/screens/Pages/Vendor/BookingScreen"
// import UserProfile from "../src/screens/Pages/Vendor/UserProfile/UserProfile";
// import AddUserForm from './screens/Pages/Vendor/AddUserForm';
// import DashboardScreen from './screens/Pages/Vendor/DashboardScreen';
// import Bookings from '../src/screens/Pages/Vendor/Bookings';
// import BookingApprovalScreen from './screens/Pages/Vendor/BookingApprovalScreen';
// import SlotManagement from './screens/Pages/Vendor/SlotManagement';

// const Stack = createNativeStackNavigator();
// const Tab = createBottomTabNavigator();

// // Define styles before they're used
// const styles = StyleSheet.create({
//   headerRightContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 10,
//   },
//   notificationButton: {
//     marginRight: 15,
//     position: 'relative',
    
//   },
//   badge: {
//     position: 'absolute',
//     right: -9,
//     top: -7,
//     backgroundColor: '#000000ff',
//     borderRadius: 10,
//     width: 20,
//     height: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   badgeText: {
//     color: 'white',
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
//   statusButton: {
//     marginRight: 10,
//   },
//   toggleBackground: {
//     padding: 5,
//     borderRadius: 20,
//     backgroundColor: 'rgba(255, 255, 255, 1)',
//   },
//   centered: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });


// const getHeaderOptions = (logout, isOnline, toggleOnlineStatus) => ({
//   headerStyle: { backgroundColor: '#FF6B6B' },
//   headerTintColor: '#fff',
//   headerTitleAlign: 'left',
//   headerTitle: () => (
//     <Image
//       source={require('../src/Logos/yasla-logo.jpg')}
//       style={{ width: 120, height: 50, resizeMode: 'contain' }}
//     />
//   ),
//   headerRight: () => (
//     <View style={styles.headerRightContainer}>
//       {/* Notification Bell */}
//       <TouchableOpacity 
//         style={styles.notificationButton}
//         onPress={() => console.log('Notifications pressed')}
//       >
//         <MaterialIcons name="notifications" size={24} color="#fff" />
//         <View style={styles.badge}>
//           <Text style={styles.badgeText}>3</Text>
//         </View>
//       </TouchableOpacity>

//       {/* Online/Offline Toggle */}
//       <TouchableOpacity 
//         style={styles.statusButton} 
//         onPress={toggleOnlineStatus}
//       >
//         <View style={styles.toggleBackground}>
//           <MaterialIcons 
//             name={isOnline ? 'toggle-on' : 'toggle-off'} 
//             size={30}
//             color={isOnline ? '#4CAF50' : '#F44336'} 
//           />
//         </View>
//       </TouchableOpacity>

//       {/* Logout Button */}
//       <TouchableOpacity 
//         style={{ marginLeft: 10 }} 
//         onPress={() => {
//           logout(); // Trigger logout
//         }}
//       >
//         <MaterialIcons name="logout" size={26} color="#fff" />
//       </TouchableOpacity>
//     </View>
//   ),
// });


// const VendorTabNavigator = () => {
//   const { logout } = useContext(AuthContext);
//   const [isOnline, setIsOnline] = useState(true);

// const toggleOnlineStatus = () => {
//   const newStatus = !isOnline;
//   setIsOnline(newStatus);
//   alert(
//     newStatus
//       ? 'Your salon is now online and accepting bookings.'
//       : 'Your salon is now offline.'
//   );
// };

//   return (
//     <Tab.Navigator
//       screenOptions={{
//         headerShown: true,
//         ...getHeaderOptions(logout, isOnline, toggleOnlineStatus),
//         tabBarActiveTintColor: '#4CAF50',
//         tabBarInactiveTintColor: 'gray',
//         tabBarStyle: { paddingBottom: 5, height: 80 },
//       }}
//     >
//       <Tab.Screen
//         name="Dashboard"
//         component={DashboardScreen}
//         options={{
//           tabBarIcon: ({ color }) => <MaterialIcons name="dashboard" size={20} color={color} />,
//         }}
//       />
    
//       <Tab.Screen
//         name="Users"
//         component={Users}
//         options={{
//           tabBarIcon: ({ color }) => <MaterialIcons name="people" size={20} color={color} />,
//         }}
//       />
//       <Tab.Screen
//         name="Services"
//         component={Services}
//         options={{
//           tabBarIcon: ({ color }) => <MaterialIcons name="business-center" size={20} color={color} />,
//         }}
//       />
//        <Tab.Screen
//         name="Bookings"
//         component={Bookings}
//         options={{
//           tabBarIcon: ({ color }) => <Ionicons name="calendar" size={20} color={color} />,
//         }}
//       />
//       <Tab.Screen
//         name="Profile"
//         component={VendorProfile}
//         options={{
//           tabBarIcon: ({ color }) => <FontAwesome5 name="user" size={20} color={color} />,
//         }}
//       />
//       {/* <Tab.Screen
//         name="Approvals"
//         component={BookingApprovalScreen}
//         options={{
//           tabBarIcon: ({ color }) => <Ionicons name="checkmark-circle" size={20} color={color} />,
//         }}
//       /> */}
//        <Tab.Screen
//         name="Slot Booking"
//         component={SlotManagement}
//         options={{
//           tabBarIcon: ({ color }) => <Ionicons name="calendar-outline" size={20} color={color} />,
//         }}
//       />
//     </Tab.Navigator>
//   );
// };

// const UserTabNavigator = () => {
//   const { logout } = useContext(AuthContext);

//   return (
//     <Tab.Navigator
//       screenOptions={{
//         headerShown: true,
//         ...getHeaderOptions(logout, false, () => {}),
//         tabBarActiveTintColor: '#4CAF50',
//         tabBarInactiveTintColor: 'gray',
//         tabBarStyle: { paddingBottom: 5, height: 80 },
//       }}
//     >
//       <Tab.Screen
//         name="UserProfile"
//         component={UserProfile}
//         options={{
//           title: 'Profile',
//           tabBarIcon: ({ color }) => <FontAwesome5 name="user-circle" size={20} color={color} />,
//         }}
//       />
//       <Tab.Screen
//         name="Bookings"
//         component={BookingScreen}
//         options={{
//           tabBarIcon: ({ color }) => <Ionicons name="calendar" size={20} color={color} />,
//         }}
//       />
      
//     </Tab.Navigator>
//   );
// };

// const MainNavigator = () => {
//   const { user, isAuthLoading } = useContext(AuthContext);

//   if (isAuthLoading) {
//     return (
//       <View style={styles.centered}>
//         <ActivityIndicator size="large" color="#4CAF50" />
//       </View>
//     );
//   }

//   const isAdmin = user?.user_role?.toLowerCase() === 'admin';

//   return (
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//       {!user ? (
//         <>
//           <Stack.Screen name="Login" component={LoginScreen} />
//           <Stack.Screen name="Signup" component={SignupScreen} />
//         </>
//       ) : isAdmin ? (
//         <Stack.Screen name="VendorTabs" component={VendorTabNavigator} />
//       ) : (
//         <Stack.Screen name="UserTabs" component={UserTabNavigator} />
//       )}
//       <Stack.Screen name="AddUser" component={AddUserForm} />
//     </Stack.Navigator>
//   );
// };

// export default MainNavigator;