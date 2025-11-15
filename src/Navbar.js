import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text
} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { AuthContext } from "../src/context/AuthContext";
import LoginScreen from "./screens/Login/LoginScreen";
import SignupScreen from "./screens/SignUp/SignupScreen";
import Services from './screens/Pages/Vendor/Services';
import Users from "./screens/Pages/Vendor/Users";
import BookingScreen from "./screens/Pages/Vendor/BookingScreen"
import AddUserForm from './screens/Pages/Vendor/AddUserForm';
import DashboardScreen from './screens/Pages/Vendor/DashboardScreen';
import Bookings from './screens/Pages/Vendor/Bookings';
import SubAdminTabNavigator from './screens/NavbarNavigator/SubAdminTabNavigator';
import ReceptionistTabNavigator from './screens/NavbarNavigator/ReceptionistTabNavigator';
import StylistTabNavigator from './screens/NavbarNavigator/StylistTabNavigator';
import UserProfile from './screens/Pages/Vendor/UserProfile/UserProfile';
import BankDetailsForm from './screens/Pages/Vendor/UserProfile/BankDetailsForm';
import UserDetails from './screens/Pages/Vendor/UserDetails';
import EditUser from './screens/Pages/Vendor/EditUser';
import VendorResetPasswordScreen from './screens/Login/VendorResetPasswordScreen';
import VendorForgotPasswordScreen from './screens/Login/VendorForgotPasswordScreen';
import ServiceAvailability from './screens/Pages/Vendor/ServiceAvailability';
import VendorOfflineBookingScreen from './screens/Pages/Vendor/VendorOfflineBookingScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Define styles with custom fonts
const styles = StyleSheet.create({
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  notificationButton: {
    marginRight: 15,
    position: 'relative',
    color: "black"
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
    fontFamily: 'Inter_600SemiBold',
  },
  statusButton: {
    marginRight: 10,
  },
  toggleBackground: {
    padding: 5,
    borderRadius: 50,
    backgroundColor: '#2F4EAA',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  notificationText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  notificationSubText: {
    fontSize: 12,
    color: 'gray',
    fontFamily: 'Inter_400Regular',
  },
  viewAllText: {
    fontFamily: 'Inter_600SemiBold',
  },
  tabBarLabel: {
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
  },
});

const getHeaderOptions = (logout, salonStatus, toggleOnlineStatus) => ({
  headerStyle: { backgroundColor: 'white' },
  headerTintColor: '#fff',
  headerTitleAlign: 'left',
  headerTitle: () => (
    <Image
      source={require('../src/Logos/Insidelogo.jpg')}
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

      {/* Online/Offline Toggle */}
      <TouchableOpacity
        style={styles.statusButton}
        onPress={toggleOnlineStatus}
      >
        <View style={styles.toggleBackground}>
          <MaterialIcons
            name={salonStatus === 'Online' ? 'toggle-on' : 'toggle-off'}
            size={30}
            color={salonStatus === 'Online' ? '#4CAF50' : 'white'}
          />
        </View>
      </TouchableOpacity>

      {/* Logout Button */}
      <TouchableOpacity
        style={{ marginLeft: 10 }}
        onPress={() => {
          logout();
        }}
      >
        <MaterialIcons name="logout" size={26} color="black" />
      </TouchableOpacity>
    </View>
  ),
});

const VendorTabNavigator = () => {
  const { logout, user } = useContext(AuthContext);
  const salonId = user?.salon;
  const [salonStatus, setSalonStatus] = useState(null);

  useEffect(() => {
    const fetchSalonStatus = async () => {
      try {
        const response = await fetch(`https://yaslaservice.com:81/salons/${salonId}/`);
        const result = await response.json();
        console.log('API Response:', result);

        setSalonStatus(result.data.salon_status || 'Offline');
      } catch (error) {
        console.error('Error fetching salon status:', error);
        setSalonStatus('Offline');
      }
    };

    fetchSalonStatus();
  }, [salonId]);

  const toggleOnlineStatus = async () => {
    if (!salonId) return;

    const newStatus = salonStatus === 'Online' ? 'Offline' : 'Online';

    try {
      const response = await fetch(`https://yaslaservice.com:81/salons/${salonId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ salon_status: newStatus }),
      });

      if (response.ok) {
        setSalonStatus(newStatus);
        alert(
          newStatus === 'Online'
            ? 'Your salon is now online and accepting bookings.'
            : 'Your salon is now offline.'
        );
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating salon status:', error);
      alert('Failed to update salon status. Please try again.');
    }
  };

  return (
    <Stack.Navigator>
      <Stack.Screen name="VendorTabs" options={{ headerShown: false }}>
        {() => (
          <Tab.Navigator
            screenOptions={{
              headerShown: true,
              ...getHeaderOptions(logout, salonStatus, toggleOnlineStatus),
              tabBarActiveTintColor: '#2F4EAA',
              tabBarInactiveTintColor: 'black',
              tabBarStyle: { paddingBottom: 5, height: 80 },
              tabBarLabelStyle: styles.tabBarLabel,
            }}
          >
            <Tab.Screen
              name="Dashboard"
              component={DashboardScreen}
              options={{
                tabBarIcon: ({ color }) => <MaterialIcons name="dashboard" size={20} color={color} />,
              }}
            />
            <Tab.Screen
              name="Users"
              component={Users}
              options={{
                tabBarIcon: ({ color }) => <MaterialIcons name="people" size={20} color={color} />,
              }}
            />
            <Tab.Screen
              name="Services"
              component={Services}
              options={{
                tabBarIcon: ({ color }) => <MaterialIcons name="business-center" size={20} color={color} />,
              }}
            />
            <Tab.Screen
              name="Availability Services"
              component={ServiceAvailability}
              options={{
                tabBarIcon: ({ color }) => (
                  <MaterialIcons name="event-available" size={20} color={color} />
                ),
              }}
            />
            <Tab.Screen
              name="Bookings"
              component={Bookings}
              options={{
                tabBarIcon: ({ color }) => <Ionicons name="calendar" size={20} color={color} />,
              }}
            />
            <Tab.Screen
              name="Profile"
              component={UserProfile}
              options={{
                tabBarIcon: ({ color }) => <FontAwesome5 name="user" size={20} color={color} />,
              }}
            />
            <Tab.Screen
              name="Slot Booking"
              component={VendorOfflineBookingScreen}
              options={{
                tabBarIcon: ({ color }) => <Ionicons name="calendar-outline" size={20} color={color} />,
              }}
            />
          </Tab.Navigator>
        )}
      </Stack.Screen>
      <Stack.Screen
        name="BankDetailsForm"
        component={BankDetailsForm}
        options={{
          title: 'Bank Details',
          headerShown: true,
          headerStyle: { backgroundColor: '#2F4EAA' },
          headerTintColor: '#fff',
          headerTitleStyle: styles.headerTitle,
        }}
      />
    </Stack.Navigator>
  );
};

const MainNavigator = () => {
  const { user, isAuthLoading } = useContext(AuthContext);

  if (isAuthLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2F4EAA" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const role = user?.user_role?.toLowerCase();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
        </>
      ) : role === 'admin' ? (
        <Stack.Screen name="VendorTabs" component={VendorTabNavigator} />
      ) : role === 'sub admin' ? (
        <Stack.Screen name="SubAdminTabs" component={SubAdminTabNavigator} />
      ) : role === 'receptionist' ? (
        <Stack.Screen name="ReceptionistTabs" component={ReceptionistTabNavigator} />
      ) : role === 'stylist' ? (
        <Stack.Screen name="StylistTabs" component={StylistTabNavigator} />
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}

      {/* Always keep these available */}
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ResetPassword" component={VendorResetPasswordScreen} />
      <Stack.Screen name="ForgotPassword" component={VendorForgotPasswordScreen} />
      <Stack.Screen name="AddUser" component={AddUserForm} />
      <Stack.Screen name="UserDetails" component={UserDetails} />
      <Stack.Screen name="EditUser" component={EditUser} />
    </Stack.Navigator>
  );
};

export default MainNavigator;