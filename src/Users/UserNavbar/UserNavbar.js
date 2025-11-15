import React, { useContext } from 'react';
import { View, ActivityIndicator, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { AuthContext } from "../src/context/AuthContext";
import LoginScreen from "../src/screens/Login/LoginScreen";
import SignupScreen from "../src/screens/SignUp/SignupScreen";
// import VendorProfile from '../src/screens/Pages/Vendor/VendorProfile';
import Reports from '../src/screens/Pages/Vendor/Reports';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const getHeaderOptions = (logout) => ({
  headerStyle: { backgroundColor: '#4CAF50' },
  headerTintColor: '#fff',
  headerTitleAlign: 'left',
  headerTitle: () => (
    <Image
      source={require('../src/Logos/yasla-logo.jpg')}
      style={{ width: 120, height: 50, resizeMode: 'contain' }}
    />
  ),
  headerRight: () => (
    <TouchableOpacity style={styles.logoutButton} onPress={logout}>
      <MaterialIcons name="logout" size={24} color="white" />
    </TouchableOpacity>
  ),
});

const VendorTabNavigator = () => {
  const { logout } = useContext(AuthContext);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        ...getHeaderOptions(logout),
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { paddingBottom: 5, height: 80 },
      }}
    >
      <Tab.Screen
        name="UserProfile"
        component={UserProfile}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <FontAwesome5 name="user" size={20} color={color} />,
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
        name="Reports"
        component={Reports}
        options={{
          tabBarIcon: ({ color }) => <MaterialIcons name="bar-chart" size={20} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

const MainNavigator = () => {
  const { user, isAuthLoading } = useContext(AuthContext);

  if (isAuthLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        </>
      ) : (
        <Stack.Screen name="VendorTabs" component={VendorTabNavigator} />
      )}
      
    </Stack.Navigator>
  );
};

export default MainNavigator;

const styles = StyleSheet.create({
  logoutButton: {
    marginRight: 15,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
