// import React, { useContext } from 'react';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { View, ActivityIndicator, StyleSheet } from 'react-native';
// import { AuthContext } from '../context/AuthContext';

// import LoginScreen from '../screens/Login/LoginScreen';
// import SignupScreen from '../screens/SignUp/SignupScreen';
// import BottomTabs from './VendorTabs';

// const Stack = createNativeStackNavigator();

// const MainNavigator = () => {
//   const { user, isAuthLoading } = useContext(AuthContext);

//   if (isAuthLoading) {
//     return (
//       <View style={styles.centered}>
//         <ActivityIndicator size="large" color="#4CAF50" />
//       </View>
//     );
//   }

//   return (
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//       {!user ? (
//         <>
//           <Stack.Screen name="Login" component={LoginScreen} />
//           <Stack.Screen name="Signup" component={SignupScreen} />
//         </>
//       ) : (
//         <Stack.Screen name="VendorTabs" component={BottomTabs} />
//       )}
//     </Stack.Navigator>
//   );
// };

// export default MainNavigator;

// const styles = StyleSheet.create({
//   centered: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });
