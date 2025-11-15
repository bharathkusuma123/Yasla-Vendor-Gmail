// import React, { useState, useContext } from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { View, TouchableOpacity, StyleSheet, Modal } from 'react-native';
// import { MaterialIcons, Ionicons, Entypo } from '@expo/vector-icons';
// import VendorDashboard from '../screens/Pages/Vendor/VendorDashboard';
// import Bookings from '../screens/Pages/Vendor/Bookings';
// import VendorProfile from '../screens/Pages/Vendor/VendorProfile';
// import BookingAlerts from '../screens/Pages/Vendor/BookingAlerts';
// import AddFormModal from '../screens/Pages/Vendor/AddFormModal';
// import { AuthContext } from '../context/AuthContext';

// const Tab = createBottomTabNavigator();

// const BottomTabs = () => {
//   const [isModalVisible, setModalVisible] = useState(false);
//   const { logout } = useContext(AuthContext);

//   return (
//     <>
//       <Tab.Navigator
//         screenOptions={{
//           headerShown: true,
//           tabBarStyle: { height: 60 },
//           ...getHeaderOptions(logout),
//         }}
//       >
//         <Tab.Screen
//           name="Dashboard"
//           component={VendorDashboard}
//           options={{
//             tabBarIcon: ({ color, size }) => (
//               <Ionicons name="grid-outline" size={24} color={color} />
//             ),
//           }}
//         />
//         <Tab.Screen
//           name="Bookings"
//           component={Bookings}
//           options={{
//             tabBarIcon: ({ color }) => (
//               <Entypo name="calendar" size={24} color={color} />
//             ),
//           }}
//         />
//         <Tab.Screen
//           name="Add"
//           component={() => <View />} // Empty view, handled by floating button
//           options={{
//             tabBarLabel: '',
//             tabBarIcon: () => (
//               <TouchableOpacity
//                 style={styles.fabButton}
//                 onPress={() => setModalVisible(true)}
//               >
//                 <MaterialIcons name="add" size={28} color="#fff" />
//               </TouchableOpacity>
//             ),
//           }}
//         />
//         <Tab.Screen
//           name="Alerts"
//           component={BookingAlerts}
//           options={{
//             tabBarIcon: ({ color }) => (
//               <Ionicons name="notifications-outline" size={24} color={color} />
//             ),
//           }}
//         />
//         <Tab.Screen
//           name="Profile"
//           component={VendorProfile}
//           options={{
//             tabBarIcon: ({ color }) => (
//               <Ionicons name="person-circle-outline" size={24} color={color} />
//             ),
//           }}
//         />
//       </Tab.Navigator>

//       <Modal visible={isModalVisible} animationType="slide">
//         <AddFormModal onClose={() => setModalVisible(false)} />
//       </Modal>
//     </>
//   );
// };

// const getHeaderOptions = (logout) => ({
//   headerStyle: { backgroundColor: '#4CAF50' },
//   headerTintColor: '#fff',
//   headerTitleStyle: { fontWeight: 'bold' },
//   headerRight: () => (
//     <TouchableOpacity style={{ marginRight: 15 }} onPress={logout}>
//       <MaterialIcons name="logout" size={24} color="white" />
//     </TouchableOpacity>
//   ),
// });

// const styles = StyleSheet.create({
//   fabButton: {
//     width: 60,
//     height: 60,
//     backgroundColor: '#4CAF50',
//     borderRadius: 30,
//     justifyContent: 'center',
//     alignItems: 'center',
//     top: -20,
//     shadowColor: '#000',
//     shadowOpacity: 0.3,
//     shadowRadius: 5,
//     shadowOffset: { width: 0, height: 2 },
//   },
// });

// export default BottomTabs;
