import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MaterialCommunityIcons,MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import baseURL from '../../ApiUrls/ApiUrls';
import * as Location from 'expo-location';

const SignupScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [locationLoading, setLocationLoading] = useState(false);

const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    vendor_type: '',
    salon_category: '',
    salon_name: '',
    city: '',
    state: '',
    street_address: '',
    locality: '',
    pincode: '',
    country: '',
  });

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const getCoordinatesFromAddress = async (address) => {
    try {
      const apiKey = "AIzaSyAZAU88Lr8CEkiFP_vXpkbnu1-g-PRigXU";
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
      );

      if (response.data.status === "OK") {
        const { lat, lng } = response.data.results[0].geometry.location;
        return { latitude: lat, longitude: lng };
      }
      return { latitude: null, longitude: null };
    } catch (error) {
      console.error("Geocoding failed:", error);
      return { latitude: null, longitude: null };
    }
  };

const getAddressFromCoordinates = async (latitude, longitude) => {
  try {
    const apiKey = "AIzaSyAZAU88Lr8CEkiFP_vXpkbnu1-g-PRigXU";
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
    );

    console.log('Geocoding API Response:', response.data); // Debugging

    if (response.data.status === "OK") {
      const result = response.data.results[0];
      const addressComponents = result.address_components;
      
      console.log('Address Components:', addressComponents); // Debugging

      // Initialize all address parts
      const addressParts = {
        street_number: '',
        route: '',
        sublocality: '',
        locality: '',
        administrative_area_level_2: '',
        administrative_area_level_1: '',
        country: '',
        postal_code: '',
        formatted_address: result.formatted_address
      };

      // Extract all address components
      addressComponents.forEach(component => {
        console.log('Component:', component); // Debugging
        component.types.forEach(type => {
          if (addressParts.hasOwnProperty(type)) {
            addressParts[type] = component.long_name;
          }
        });
      });

      console.log('Extracted Address Parts:', addressParts); // Debugging

      // Build the street address - more robust version
      let streetAddress = '';
      
      // First try to get full street address from formatted address
      if (addressParts.formatted_address) {
        // Extract first line of address (usually contains street info)
        const firstLine = addressParts.formatted_address.split(',')[0];
        streetAddress = firstLine.trim();
      }
      
      // Fallback to combining components if needed
      if (!streetAddress) {
        streetAddress = [addressParts.street_number, addressParts.route]
          .filter(Boolean)
          .join(' ')
          .trim();
      }

      // Final fallback if still empty
      if (!streetAddress) {
        streetAddress = 'Address not specified';
      }

      console.log('Final Street Address:', streetAddress); // Debugging

      // Determine locality (prefer sublocality if available)
      const locality = addressParts.sublocality || addressParts.locality;

      // Determine city (prefer locality, then administrative_area_level_2)
      const city = addressParts.locality || addressParts.administrative_area_level_2;

      return {
        street_address: streetAddress,
        locality: locality || city,
        city: city || addressParts.administrative_area_level_1,
        state: addressParts.administrative_area_level_1,
        country: addressParts.country,
        pincode: addressParts.postal_code,
        formattedAddress: addressParts.formatted_address
      };
    }
    return null;
  } catch (error) {
    console.error("Reverse geocoding failed:", error);
    return null;
  }
};

  const handleGetCurrentLocation = async () => {
    setLocationLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required to autofill address');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      
      const addressData = await getAddressFromCoordinates(latitude, longitude);
      if (addressData) {
        setFormData(prev => ({
          ...prev,
          street_address: addressData.street_address,
          locality: addressData.locality,
          city: addressData.city,
          state: addressData.state,
          country: addressData.country,
          pincode: addressData.pincode
        }));
      }
    } catch (error) {
      console.error("Error getting location:", error);
      Alert.alert('Error', 'Failed to get current location');
    } finally {
      setLocationLoading(false);
    }
  };

const handleSignup = async () => {
  const { name, email, phone, password, vendor_type, salon_category, salon_name, city, state,
    street_address, locality, pincode, country } = formData;

  if (!name || !email || !phone || !password || !vendor_type || !salon_category || !salon_name ||
      !city || !state || !street_address || !locality || !pincode || !country) {
    Alert.alert('Error', 'Please fill all fields.');
    return;
  }

  // Full address for geocoding
  const fullAddress = `${street_address}, ${locality}, ${city}, ${state}, ${pincode}, ${country}`;
  const { latitude, longitude } = await getCoordinatesFromAddress(fullAddress);
  // format to meet backend constraints
const formattedLatitude = latitude ? Number(latitude.toFixed(6)) : null;
const formattedLongitude = longitude ? Number(longitude.toFixed(6)) : null;

  const payload = {
    salon_name,
    vendor_name: name,
    email,
    phone,
    vendor_type,
    salon_category,
    city,
    state,
    street_address,
    locality,
    pincode,
    country,
    latitude: formattedLatitude,
  longitude: formattedLongitude,
    user: {
      full_name: name,
      email,
      phone,
      password,
      user_role: "Admin",
    }
  };

  setIsLoading(true);
  try {
    await axios.post(`${baseURL}/register/vendor/`, payload);
    Alert.alert('Success', 'Vendor registered successfully!');
    navigation.navigate('Login');
  } catch (error) {
    console.error(error.response?.data || error.message);
    Alert.alert('Error', error.response?.data?.message || 'Registration failed');
  } finally {
    setIsLoading(false);
  }
};

  return (
     <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
    <ScrollView contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Vendor Registration</Text>

      <Text style={styles.label}>Full Name *</Text>
      <TextInput
        style={styles.input}
        value={formData.name}
        onChangeText={v => handleChange('name', v)}
      />
       <Text style={styles.label}>Salon Name *</Text>
      <TextInput
        style={styles.input}
        value={formData.salon_name}
        onChangeText={v => handleChange('salon_name', v)}
      />

      <Text style={styles.label}>Email *</Text>
      <TextInput
        style={styles.input}
        keyboardType="email-address"
        value={formData.email}
        onChangeText={v => handleChange('email', v)}
      />

      <Text style={styles.label}>Phone *</Text>
      <TextInput
        style={styles.input}
        keyboardType="phone-pad"
        value={formData.phone}
        onChangeText={v => handleChange('phone', v)}
      />

      <Text style={styles.label}>Password *</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          value={formData.password}
          onChangeText={v => handleChange('password', v)}
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

      <Text style={styles.label}>Vendor Type *</Text>
      <Picker
        selectedValue={formData.vendor_type}
        onValueChange={v => handleChange('vendor_type', v)}
        style={styles.picker}
      >
        <Picker.Item label="Select Type" value="" />
        <Picker.Item label="Individual" value="Individual" />
        <Picker.Item label="Franchise" value="Franchise" />
      </Picker>

      <Text style={styles.label}>Salon Category *</Text>
      <Picker
        selectedValue={formData.salon_category}
        onValueChange={v => handleChange('salon_category', v)}
        style={styles.picker}
      >
        <Picker.Item label="Select Category" value="" />
        <Picker.Item label="Men" value="Men" />
        <Picker.Item label="Women" value="Women" />
        <Picker.Item label="Unisex" value="Unisex" />
      </Picker>
<View style={styles.locationContainer}>
          <Text style={styles.label}> Address *</Text>
          <TouchableOpacity 
            style={styles.locationButton} 
            onPress={handleGetCurrentLocation}
            disabled={locationLoading}
          >
            {locationLoading ? (
              <ActivityIndicator size="small" color="#2F4EAA" />
            ) : (
              <>
                <MaterialIcons name="my-location" size={18} color="#2F4EAA" />
                <Text style={styles.locationButtonText}>Use Current Location</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
     <Text style={styles.label}>Street Address *</Text>
<TextInput
  style={styles.input}
  value={formData.street_address}
  onChangeText={v => handleChange('street_address', v)}
/>

<Text style={styles.label}>Locality *</Text>
<TextInput
  style={styles.input}
  value={formData.locality}
  onChangeText={v => handleChange('locality', v)}
/>

      <Text style={styles.label}>City *</Text>
      <TextInput
        style={styles.input}
        value={formData.city}
        onChangeText={v => handleChange('city', v)}
      />

      <Text style={styles.label}>State *</Text>
      <TextInput
        style={styles.input}
        value={formData.state}
        onChangeText={v => handleChange('state', v)}
      />
      <Text style={styles.label}>Pincode *</Text>
<TextInput
  style={styles.input}
  keyboardType="numeric"
  value={formData.pincode}
  onChangeText={v => handleChange('pincode', v)}
/>

<Text style={styles.label}>Country *</Text>
<TextInput
  style={styles.input}
  value={formData.country}
  onChangeText={v => handleChange('country', v)}
/>


      <TouchableOpacity
        style={styles.button}
        onPress={handleSignup}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Register</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginLink}>Already have an account? Login</Text>
      </TouchableOpacity>
    </ScrollView>
        </KeyboardAvoidingView>

  );
};

export default SignupScreen;


const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  picker: {
    width: '100%',
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#555',
  },
  button: {
    backgroundColor: '#2F4EAA',
    padding: 14,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  passwordInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
  },
  eyeIcon: {
    padding: 10,
  },
  loginLink: {
    color: '#2F4EAA',
    textAlign: 'center',
    marginTop: 20,
    fontWeight: '600',
  },
   locationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
    backgroundColor: '#e8f5e9',
  },
  locationButtonText: {
    marginLeft: 5,
    color: '#4CAF50',
    fontSize: 14,
  },
});
