// import React, { useContext } from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
// import { AuthContext } from '../../context/AuthContext';
// import ReceptionistDashboard from '../NavbarNavigator/ReceptionistDashboard';
// import ReceptionistUsers from '../NavbarNavigator/ReceptionistUsers';
// import ReceptionistBookings from '../NavbarNavigator/ReceptionistBookings';
// import ReceptionistServices from '../NavbarNavigator/ReceptionistServices';
// import ReceptionistProfile from '../NavbarNavigator/ReceptionistProfile';

// const Tab = createBottomTabNavigator();

// const ReceptionistTabNavigator = () => {
//   const { logout } = useContext(AuthContext);

//   return (
//     <Tab.Navigator
//       screenOptions={{
//         headerShown: false,
//         tabBarActiveTintColor: '#4CAF50',
//         tabBarInactiveTintColor: 'gray',
//         tabBarStyle: { paddingBottom: 5, height: 80 },
//       }}
//     >
//       <Tab.Screen
//         name="Receptionist Dashboard"
//         component={ReceptionistDashboard}
//         options={{
//           tabBarIcon: ({ color }) => <MaterialIcons name="dashboard" size={20} color={color} />,
//         }}
//       />
//       <Tab.Screen
//         name="Receptionist Users"
//         component={ReceptionistUsers}
//         options={{
//           tabBarIcon: ({ color }) => <MaterialIcons name="people" size={20} color={color} />,
//         }}
//       />
//       <Tab.Screen
//         name="Receptionist Bookings"
//         component={ReceptionistBookings}
//         options={{
//           tabBarIcon: ({ color }) => <Ionicons name="calendar" size={20} color={color} />,
//         }}
//       />
//       <Tab.Screen
//         name="Receptionist Services"
//         component={ReceptionistServices}
//         options={{
//           tabBarIcon: ({ color }) => <MaterialIcons name="build" size={20} color={color} />,
//         }}
//       />
//       <Tab.Screen
//         name="Receptionist Profile"
//         component={ReceptionistProfile}
//         options={{
//           tabBarIcon: ({ color }) => <FontAwesome5 name="user" size={20} color={color} />,
//         }}
//       />
//     </Tab.Navigator>
//   );
// };

// export default ReceptionistTabNavigator;




import React, { useContext, useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Image
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';
import ReceptionistDashboard from '../NavbarNavigator/ReceptionistDashboard';
import ReceptionistUsers from '../NavbarNavigator/ReceptionistUsers';
import ReceptionistBookings from '../NavbarNavigator/ReceptionistBookings';
import ReceptionistServices from '../NavbarNavigator/ReceptionistServices';
import ReceptionistProfile from '../NavbarNavigator/ReceptionistProfile';

const Tab = createBottomTabNavigator();

const styles = StyleSheet.create({
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  notificationButton: {
    marginRight: 15,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    right: -9,
    top: -7,
    backgroundColor: '#f5f1f1ff',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'black',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusButton: {
    marginRight: 10,
  },
  toggleBackground: {
    padding: 5,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
});

const getHeaderOptions = (logout) => ({
  headerStyle: { backgroundColor: 'white' },
  headerTintColor: '#fff',
  headerTitleAlign: 'left',
  headerTitle: () => (
    <Image
      source={require('../../Logos/Insidelogo.jpg')}
      style={{ width: 120, height: 70, marginLeft: 100, marginTop: -25, resizeMode: 'contain' }}
    />
  ),
  headerRight: () => (
    <View style={styles.headerRightContainer}>
      {/* Notification Bell */}
      <TouchableOpacity 
        style={styles.notificationButton}
        onPress={() => console.log('Notifications pressed')}
      >
        <MaterialIcons name="notifications" size={24} color="black" />
        <View style={styles.badge}>
          <Text style={styles.badgeText}>3</Text>
        </View>
      </TouchableOpacity>

      {/* Logout Button */}
      <TouchableOpacity 
        style={{ marginLeft: 10 }} 
        onPress={() => {
          logout(); // Trigger logout
        }}
      >
        <MaterialIcons name="logout" size={26} color="black" />
      </TouchableOpacity>
    </View>
  ),
});

const ReceptionistTabNavigator = () => {
  const { logout } = useContext(AuthContext);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        ...getHeaderOptions(logout),
        tabBarActiveTintColor: '#2F4EAA',
        tabBarInactiveTintColor: 'black',
        tabBarStyle: { paddingBottom: 5, height: 80 },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={ReceptionistDashboard}
        options={{
          tabBarIcon: ({ color }) => <MaterialIcons name="dashboard" size={20} color={color} />,
        }}
      />
      <Tab.Screen
        name="Users"
        component={ReceptionistUsers}
        options={{
          tabBarIcon: ({ color }) => <MaterialIcons name="people" size={20} color={color} />,
        }}
      />
      <Tab.Screen
        name="Bookings"
        component={ReceptionistBookings}
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="calendar" size={20} color={color} />,
        }}
      />
      {/* <Tab.Screen
        name="Services"
        component={ReceptionistServices}
        options={{
          tabBarIcon: ({ color }) => <MaterialIcons name="build" size={20} color={color} />,
        }}
      /> */}
      <Tab.Screen
        name="Profile"
        component={ReceptionistProfile}
        options={{
          tabBarIcon: ({ color }) => <FontAwesome5 name="user" size={20} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default ReceptionistTabNavigator;