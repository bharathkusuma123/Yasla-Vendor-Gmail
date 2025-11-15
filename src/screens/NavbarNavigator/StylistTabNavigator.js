import React, { useContext } from 'react';
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
import StylistDashboard from '../NavbarNavigator/StylistDashboard';
import StylistBookings from '../NavbarNavigator/StylistBookings';
import StylistProfile from '../NavbarNavigator/StylistProfile';
import StylistOfflineBookingScreen from '../NavbarNavigator/StylistOfflineBookingScreen';

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
     color:"black"
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
        onPress={() => logout()}
      >
        <MaterialIcons name="logout" size={26} color="black" />
      </TouchableOpacity>
    </View>
  ),
});

const StylistTabNavigator = () => {
  const { logout } = useContext(AuthContext);

  return (
    // <Tab.Navigator
    //   screenOptions={{
    //     headerShown: true,
    //     ...getHeaderOptions(logout),
    //     tabBarActiveTintColor: '#4CAF50',
    //     tabBarInactiveTintColor: 'gray',
    //     tabBarStyle: { paddingBottom: 5, height: 80 },
    //   }}
    // >
    //   <Tab.Screen
    //     name="Dashboard"
    //     component={StylistDashboard}
    //     options={{
    //       tabBarIcon: ({ color }) => <MaterialIcons name="dashboard" size={20} color={color} />,
    //     }}
    //   />
    //   <Tab.Screen
    //     name="Bookings"
    //     component={StylistBookings}
    //     options={{
    //       tabBarIcon: ({ color }) => <Ionicons name="calendar" size={20} color={color} />,
    //     }}
    //   />
    //   <Tab.Screen
    //     name="Profile"
    //     component={StylistProfile}
    //     options={{
    //       tabBarIcon: ({ color }) => <FontAwesome5 name="user" size={20} color={color} />,
    //     }}
    //   />
    //    <Tab.Screen
    //     name="Offline Booking"
    //     component={StylistOfflineBookingScreen}
    //     options={{
    //       tabBarIcon: ({ color }) => <FontAwesome5 name="user" size={20} color={color} />,
    //     }}
    //   />
    // </Tab.Navigator>

    <Tab.Navigator
  initialRouteName="Bookings"  // 👈 Default tab set to “Bookings”
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
    component={StylistDashboard}
    options={{
      tabBarIcon: ({ color }) => (
        <MaterialIcons name="dashboard" size={20} color={color} />
      ),
    }}
  />
  <Tab.Screen
    name="Bookings"
    component={StylistBookings}
    options={{
      tabBarIcon: ({ color }) => (
        <Ionicons name="calendar" size={20} color={color} />
      ),
    }}
  />
  <Tab.Screen
    name="Profile"
    component={StylistProfile}
    options={{
      tabBarIcon: ({ color }) => (
        <FontAwesome5 name="user" size={20} color={color} />
      ),
    }}
  />
  <Tab.Screen
    name="Offline Booking"
    component={StylistOfflineBookingScreen}
    options={{
      tabBarIcon: ({ color }) => (
       <Ionicons name="calendar-outline" size={20} color={color} />
      ),
    }}
  />
</Tab.Navigator>

  );
};

export default StylistTabNavigator;