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

  const { login } = useContext(AuthContext);



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