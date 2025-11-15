import React, { useState, useContext, useEffect } from 'react';
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
import * as AuthSession from 'expo-auth-session';
import * as Crypto from 'expo-crypto';
import * as WebBrowser from 'expo-web-browser';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import styles from './LoginStyles';

// Required for web browser authentication
WebBrowser.maybeCompleteAuthSession();

const VendorLoginScreen = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { login } = useContext(AuthContext);

  // Google OAuth configuration
  const config = {
    clientId: "119344335-a61nrhbvjlp3rhaa9ifvjla1iiko144g.apps.googleusercontent.com",
    androidClientId: "119344335-983nadhmshad9vgb28ocqu739f5qraua.apps.googleusercontent.com",
    iosClientId: "119344335-8cspa1q97fgl7ic9r9gt1p203ae95467.apps.googleusercontent.com",
  };

  const useProxy = Platform.select({ web: false, default: true });
  const redirectUri = AuthSession.makeRedirectUri({
    useProxy,
    scheme: 'com.your.app', // Replace with your app scheme
    path: 'auth',
  });

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

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      // Generate PKCE code verifier and challenge
      const codeVerifier = await generateCodeVerifier();
      const codeChallenge = await generateCodeChallenge(codeVerifier);
      
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${config.androidClientId}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&response_type=code` +
        `&scope=openid%20profile%20email` +
        `&code_challenge=${codeChallenge}` +
        `&code_challenge_method=S256`;

      const result = await WebBrowser.openAuthSessionAsync(
        authUrl,
        redirectUri,
        {
          showTitle: false,
          enableDefaultShare: false,
          ephemeralWebSession: false,
        }
      );

      if (result.type === 'cancel' || result.type === 'dismiss') {
        throw new Error('Google Signin was cancelled');
      }

      if (result.type === 'success') {
        const url = new URL(result.url);
        const code = url.searchParams.get('code');
        
        if (!code) {
          throw new Error('Authorization code not found');
        }

        // Exchange authorization code for access token
        const tokenResponse = await axios.post(
          'https://oauth2.googleapis.com/token',
          new URLSearchParams({
            client_id: config.androidClientId,
            code: code,
            code_verifier: codeVerifier,
            grant_type: 'authorization_code',
            redirect_uri: redirectUri,
          }).toString(),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        );

        const { access_token } = tokenResponse.data;

        // Get user info from Google
        const userInfoResponse = await axios.get(
          'https://www.googleapis.com/oauth2/v2/userinfo',
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );

        const { email, name, picture } = userInfoResponse.data;

        // Check if user exists in your API
        const usersResponse = await axios.get(`https://yaslaservice.com:81/users`);
        const allUsers = usersResponse.data?.data || [];

        const existingUser = allUsers.find(user => 
          user.email && user.email.toLowerCase() === email.toLowerCase()
        );

        if (!existingUser) {
          Alert.alert(
            'Account Not Found',
            'No account found with this Google email. Please sign up first or use a different login method.'
          );
          return;
        }

        // Create user object for your app context
        const formattedUser = {
          email: existingUser.email,
          full_name: existingUser.full_name || name,
          phone: existingUser.phone,
          status: existingUser.status,
          user_id: existingUser.id || existingUser.user_id,
          user_role: existingUser.user_role,
          salon: existingUser.salon || null,
          profile_picture: picture,
        };

        await login(formattedUser);

        // Navigate based on user role
        const role = formattedUser.user_role?.toLowerCase();
        let targetRoute = 'VendorTabs';
        if (role === 'sub admin') targetRoute = 'SubAdminTabs';
        else if (role === 'receptionist') targetRoute = 'ReceptionistTabs';
        else if (role === 'stylist') targetRoute = 'StylistTabs';

        navigation.replace(targetRoute);
      }

    } catch (error) {
      console.error('Google login error:', error);
      if (error.message !== 'Google Signin was cancelled') {
        Alert.alert(
          'Google Login Failed',
          error.message || 'Failed to login with Google. Please try again.'
        );
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  // Helper functions for PKCE
  const generateCodeVerifier = async () => {
    const randomBytes = await Crypto.getRandomBytesAsync(32);
    return base64URLEncode(randomBytes);
  };

  const generateCodeChallenge = async (codeVerifier) => {
    const digest = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      codeVerifier
    );
    return base64URLEncode(hexToBytes(digest));
  };

  const base64URLEncode = (str) => {
    return str.toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  };

  const hexToBytes = (hex) => {
    const bytes = [];
    for (let i = 0; i < hex.length; i += 2) {
      bytes.push(parseInt(hex.substr(i, 2), 16));
    }
    return new Uint8Array(bytes);
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
              disabled={googleLoading}
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