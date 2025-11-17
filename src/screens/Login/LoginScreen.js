import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Image,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import styles from './LoginStyles';

// Required for Expo
WebBrowser.maybeCompleteAuthSession();

const VendorLoginScreen = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { login } = useContext(AuthContext);

  // Google Auth Request with CORRECT redirectUri
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '796283920864-ugon3v43r514s98aab1cf91qt4vhtb0c.apps.googleusercontent.com',
    iosClientId: '796283920864-sf0429dvc8iatc63s064oras73i094q0.apps.googleusercontent.com', 
    androidClientId: '796283920864-33pkk167okl48q3skqgrlh3v75m6484n.apps.googleusercontent.com',
    scopes: ['openid', 'profile', 'email'],
    redirectUri: 'https://auth.expo.io/@iiiqbets/yasla-vendor', // YOUR EXACT REDIRECT URI
  });

  // Handle Google Login Response
  React.useEffect(() => {
    console.log('Google Response:', response);
    
    if (response?.type === 'success') {
      handleGoogleSignIn(response.authentication.accessToken);
    } else if (response?.type === 'error') {
      setGoogleLoading(false);
      console.log('Google auth error:', response.error);
      
      let errorMessage = 'An error occurred during Google login';
      if (response.error === 'access_denied') {
        errorMessage = 'Google login was cancelled.';
      } else if (response.error === 'invalid_request') {
        errorMessage = 'Please make sure the redirect URI is configured in Google Cloud Console.';
      }
      
      Alert.alert('Google Login Failed', errorMessage);
    }
  }, [response]);

  const handleLogin = async () => {
    if (!phone || !password) {
      Alert.alert('Error', 'Please enter both phone number and password');
      return;
    }

    setIsLoading(true);
    try {
      const loginResponse = await axios.post(`https://yaslaservice.com:81/user_login`, {
        phone,
        password,
      });

      const userData = loginResponse.data?.data;
      if (!userData) throw new Error('User data not found in response');

      const usersResponse = await axios.get(`https://yaslaservice.com:81/users`);
      const allUsers = usersResponse.data?.data || [];

      const matchedUser = allUsers.find(
        (u) => u.phone === userData.phone || u.id === userData.user_id
      );

      const formattedUser = {
        email: userData.email,
        full_name: userData.full_name,
        phone: userData.phone,
        status: userData.status,
        user_id: userData.user_id,
        user_role: userData.user_role,
        salon: matchedUser?.salon ?? null,
      };

      await login(formattedUser);

      const role = formattedUser.user_role?.toLowerCase();
      let targetRoute = 'VendorTabs';
      if (role === 'sub admin') targetRoute = 'SubAdminTabs';
      else if (role === 'receptionist') targetRoute = 'ReceptionistTabs';
      else if (role === 'stylist') targetRoute = 'StylistTabs';

      navigation.replace(targetRoute);

    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      Alert.alert(
        'Login Failed',
        error.response?.data?.message || error.message || 'Invalid phone number or password'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async (accessToken) => {
    try {
      setGoogleLoading(true);
      
      console.log('Google access token received');
      
      // Get user info from Google API
      const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { 
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!userInfoResponse.ok) {
        throw new Error(`Google API error: ${userInfoResponse.status}`);
      }

      const userInfo = await userInfoResponse.json();
      const userEmail = userInfo.email;

      if (!userEmail) {
        throw new Error('No email found from Google account');
      }

      console.log('Google login successful for:', userEmail);

      // Fetch users from backend and match email
      const usersResponse = await axios.get(`https://yaslaservice.com:81/users`);
      const allUsers = usersResponse.data?.data || [];

      const matchedUser = allUsers.find(user => 
        user.email.toLowerCase() === userEmail.toLowerCase()
      );

      if (!matchedUser) {
        throw new Error('No account found with this Google email. Please contact administrator.');
      }

      if (matchedUser.status !== 'Active') {
        throw new Error('Your account is not active. Please contact administrator.');
      }

      const formattedUser = {
        email: matchedUser.email,
        full_name: matchedUser.full_name || userInfo.name,
        phone: matchedUser.phone,
        status: matchedUser.status,
        user_id: matchedUser.id,
        user_role: matchedUser.user_role,
        salon: matchedUser.salon,
        profile_image: matchedUser.profile_image,
      };

      await login(formattedUser);

      const role = formattedUser.user_role?.toLowerCase();
      let targetRoute = 'VendorTabs';
      if (role === 'sub admin') targetRoute = 'SubAdminTabs';
      else if (role === 'receptionist') targetRoute = 'ReceptionistTabs';
      else if (role === 'stylist') targetRoute = 'StylistTabs';

      Alert.alert('Success', `Welcome ${formattedUser.full_name}!`);
      navigation.replace(targetRoute);

    } catch (error) {
      console.error('Google login error:', error);
      Alert.alert(
        'Google Login Failed',
        error.message || 'Failed to login with Google. Please try again.'
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      console.log('Starting Google login...');
      await promptAsync();
    } catch (error) {
      console.error('Google prompt error:', error);
      setGoogleLoading(false);
      Alert.alert('Error', 'Failed to start Google login. Please try again.');
    }
  };

  const handleForgotPassword = () => {
    navigation.push('ForgotPassword');
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            {/* Logo */}
            <Image
              source={require('../../Logos/Outsidelogo.jpg')}
              style={styles.logo}
              resizeMode="contain"
            />

            <Text style={styles.title}>Vendor Login</Text>

            {/* Phone Input */}
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              placeholderTextColor="#999"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              autoCapitalize="none"
              maxLength={10}
            />

            {/* Password Input */}
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <MaterialCommunityIcons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={24}
                  color="#777"
                />
              </TouchableOpacity>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity
              style={styles.forgotPasswordLink}
              onPress={handleForgotPassword}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.button, isLoading && styles.disabledButton]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </TouchableOpacity>

            {/* OR Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Google Login */}
            <TouchableOpacity
              style={[styles.googleButton, googleLoading && styles.disabledButton]}
              onPress={handleGoogleLogin}
              disabled={googleLoading || !request}
              activeOpacity={0.8}
            >
              {googleLoading ? (
                <ActivityIndicator color="#666" />
              ) : (
                <>
                  <Image
                    source={require('../../Logos/Googleicon.jpeg')}
                    style={styles.googleIcon}
                  />
                  <Text style={styles.googleText}>Login with Google</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Signup Link */}
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.push('Signup')}>
                <Text style={styles.signupLink}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default VendorLoginScreen;