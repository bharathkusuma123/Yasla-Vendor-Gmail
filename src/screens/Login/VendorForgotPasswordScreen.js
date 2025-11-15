import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from 'react-native';
import axios from 'axios';

const VendorForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        'https://yaslaservice.com:81/user/forgot-password/',
        { email },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const message = response.data?.message;

      if (message && message.includes('Reset code sent')) {
        Alert.alert('Success', message, [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('ResetPassword', { email });
            },
          },
        ]);
      } else {
        Alert.alert('Error', message || 'Failed to send reset code');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../../Logos/Outsidelogo.jpg')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.title}>Vendor Forgot Password</Text>
          <Text style={styles.subtitle}>Enter your email to receive a reset code</Text>

          {/* Email Input */}
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your registered email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.button, isLoading && styles.disabledButton]}
            onPress={handleResetPassword}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Send Reset Code</Text>
            )}
          </TouchableOpacity>

          {/* Back to Login Link */}
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Remember your password? </Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.signupLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 25,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 250,
    height: 250,
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2F4EAA',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  label: {
    fontWeight: '600',
    marginBottom: 8,
    color: '#444',
    fontSize: 15,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    fontSize: 15,
  },
  button: {
    height: 50,
    backgroundColor: '#2F4EAA',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#2F4EAA',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  signupText: {
    color: '#666',
    fontSize: 15,
  },
  signupLink: {
    color: '#2F4EAA',
    fontWeight: '600',
    fontSize: 15,
  },
});

export default VendorForgotPasswordScreen;
