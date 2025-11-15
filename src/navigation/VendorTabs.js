// import React, { useState } from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { Modal, View, StyleSheet } from 'react-native';
// import { MaterialIcons } from '@expo/vector-icons';

// import VendorProfile from '../screens/Pages/Vendor/VendorProfile';
// import Bookings from '../screens/Pages/Vendor/Bookings';
// import BookingAlerts from '../screens/Pages/Vendor/BookingAlerts';
// import AvailableSlots from '../screens/Pages/Vendor/AvailableSlots';
// import SignupModal from '../screens/Pages/Vendor/AddFormModal';

// const Tab = createBottomTabNavigator();

// const BottomTabs = () => {
//   const [modalVisible, setModalVisible] = useState(false);

//   return (
//     <>
//       <Tab.Navigator
//         screenOptions={{
//           tabBarStyle: { backgroundColor: '#4CAF50' },
//           tabBarActiveTintColor: 'white',
//           headerShown: false,
//         }}
//       >
//         <Tab.Screen
//           name="Profile"
//           component={VendorProfile}
//           options={{
//             tabBarIcon: ({ color, size }) => (
//               <MaterialIcons name="person" size={size} color={color} />
//             ),
//           }}
//         />
//         <Tab.Screen
//           name="Bookings"
//           component={Bookings}
//           options={{
//             tabBarIcon: ({ color, size }) => (
//               <MaterialIcons name="book" size={size} color={color} />
//             ),
//           }}
//         />
//         <Tab.Screen
//           name="Add"
//           component={View}
//           listeners={{
//             tabPress: e => {
//               e.preventDefault();
//               setModalVisible(true);
//             },
//           }}
//           options={{
//             tabBarLabel: '',
//             tabBarIcon: ({ size }) => (
//               <View style={styles.plusButton}>
//                 <MaterialIcons name="add" size={30} color="#fff" />
//               </View>
//             ),
//           }}
//         />
//         <Tab.Screen
//           name="Alerts"
//           component={BookingAlerts}
//           options={{
//             tabBarIcon: ({ color, size }) => (
//               <MaterialIcons name="notifications" size={size} color={color} />
//             ),
//           }}
//         />
//         <Tab.Screen
//           name="Slots"
//           component={AvailableSlots}
//           options={{
//             tabBarIcon: ({ color, size }) => (
//               <MaterialIcons name="access-time" size={size} color={color} />
//             ),
//           }}
//         />
//       </Tab.Navigator>

//       <Modal visible={modalVisible} animationType="slide">
//         <SignupModal onClose={() => setModalVisible(false)} />
//       </Modal>
//     </>
//   );
// };

// export default BottomTabs;

// const styles = StyleSheet.create({
//   plusButton: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: '#4CAF50',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 30,
//   },
// });
