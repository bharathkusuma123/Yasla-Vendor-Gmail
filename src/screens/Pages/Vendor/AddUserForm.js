// import React, { useState,useContext } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   Alert
// } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import axios from 'axios';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { AuthContext } from '../../../context/AuthContext';
  
// const AddUserForm = () => {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const { salonId } = route.params || {};
// const { user } = useContext(AuthContext);
//   const initialFormData = {
//     full_name: '',
//     email: '',
//     phone: '',
//     password: '',
//     user_role: '',
//     profile_image: '',
//     status: '',
//     salon: user?.salon,
//   };

//   const [formData, setFormData] = useState(initialFormData);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleChange = (name, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async () => {
//     console.log('📤 Submitting formData:', formData);
//     if (!formData.full_name || !formData.email || !formData.phone || !formData.password) {
//       Alert.alert('Validation Error', 'Please fill in all required fields.');
//       return;
//     }

//     setLoading(true);
//     setError('');
//     try {
//       await axios.post('https://yaslaservice.com:81/users/', formData);

//       Alert.alert('Success', 'User created successfully!', [
//         {
//           text: 'OK',
//           onPress: () => {
//             setFormData(initialFormData); // Reset form
//             navigation.goBack(); // Navigate back
//           }
//         }
//       ]);
//     } catch (error) {
//       console.error('Error creating user:', error);
//       setError(error.response?.data?.message || 'Failed to create user');
//       Alert.alert('Error', 'Failed to create user');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.modalContainer}>
//       <Text style={styles.modalTitle}>Add New User</Text>
//       <Text>{user?.salon || "NA"}</Text>

//       <Text style={styles.label}>Full Name</Text>
//       <TextInput
//         style={styles.input}
//         value={formData.full_name}
//         onChangeText={(text) => handleChange('full_name', text)}
//         placeholder="Enter full name"
//       />

//       <Text style={styles.label}>Email</Text>
//       <TextInput
//         style={styles.input}
//         value={formData.email}
//         onChangeText={(text) => handleChange('email', text)}
//         placeholder="Enter email"
//         keyboardType="email-address"
//         autoCapitalize="none"
//       />

//       <Text style={styles.label}>Phone</Text>
//       <TextInput
//         style={styles.input}
//         value={formData.phone}
//         onChangeText={(text) => handleChange('phone', text)}
//         placeholder="Enter phone number"
//         keyboardType="phone-pad"
//       />

//       <Text style={styles.label}>Password</Text>
//       <TextInput
//         style={styles.input}
//         value={formData.password}
//         onChangeText={(text) => handleChange('password', text)}
//         placeholder="Enter password"
//         secureTextEntry
//       />

//     <Text style={styles.label}>User Role</Text>
// <View style={styles.pickerWrapper}>
//   <Picker
//     selectedValue={formData.user_role}
//     onValueChange={(itemValue) => handleChange('user_role', itemValue)}
    
//   >
//      <Picker.Item label="Select Role" value="Select Role" />
//     <Picker.Item label="Admin" value="Admin" />
//     <Picker.Item label="Sub Admin" value="Sub Admin" />
//     <Picker.Item label="Stylist" value="Stylist" />
//     <Picker.Item label="Receptionist" value="Receptionist" />
//   </Picker>
// </View>

// <Text style={styles.label}>Status</Text>
// <View style={styles.pickerWrapper}>
//   <Picker
//     selectedValue={formData.status}
//     onValueChange={(itemValue) => handleChange('status', itemValue)}
//   >
//      <Picker.Item label="Select Status" value="Select Status" />
//     <Picker.Item label="Active" value="Active" />
//     <Picker.Item label="Inactive" value="Inactive" />
//   </Picker>
// </View>
//       <Text style={styles.label}>Profile Image URL</Text>
//       <TextInput
//         style={styles.input}
//         value={formData.profile_image}
//         onChangeText={(text) => handleChange('profile_image', text)}
//         placeholder="Enter profile image URL"
//       />

//       {error ? <Text style={styles.errorText}>{error}</Text> : null}

//       <View style={styles.buttonContainer}>
//         <TouchableOpacity
//           style={[styles.button, styles.cancelButton]}
//           onPress={() => {
//             setFormData(initialFormData);
//             navigation.goBack();
//           }}
//           disabled={loading}
//         >
//           <Text style={styles.buttonText}>Cancel</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[styles.button, styles.submitButton]}
//           onPress={handleSubmit}
//           disabled={loading}
//         >
//           <Text style={styles.buttonText}>
//             {loading ? 'Creating...' : 'Create User'}
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   modalContainer: {
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//     color: '#4CAF50',
//   },
//   label: {
//     marginTop: 10,
//     marginBottom: 5,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 4,
//     padding: 10,
//     marginBottom: 10,
//     backgroundColor: '#fff',
//   },
// pickerWrapper: {
//   borderWidth:1,
//   borderColor: '#ddd',
//   borderRadius: 4,
//   marginBottom: 10,
//   backgroundColor: '#fff',
// },

//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 20,
//   },
//   button: {
//     padding: 12,
//     borderRadius: 4,
//     alignItems: 'center',
//     flex: 1,
//     marginHorizontal: 5,
//   },
//   submitButton: {
//     backgroundColor: '#4CAF50',
//   },
//   cancelButton: {
//     backgroundColor: '#f44336',
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   errorText: {
//     color: '#f44336',
//     textAlign: 'center',
//     marginVertical: 10,
//   },
// });

// export default AddUserForm;









import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { Picker } from '@react-native-picker/picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AuthContext } from '../../../context/AuthContext';

const AddUserForm = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { salonId } = route.params || {};
  const { user } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);

  const initialFormData = {
    full_name: '',
    email: '',
    phone: '',
    password: '',
    user_role: '',
    profile_image: null, // file object
    status: '',
    salon: user?.salon,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // 📸 Pick image from gallery with cropping options
  const pickImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission required', 'You need to allow access to the photo library.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // Square aspect ratio for profile pictures
        quality: 0.8,
      });

      if (!result.canceled) {
        const image = result.assets[0];
        
        // Optionally crop and resize the image
        const manipulatedImage = await ImageManipulator.manipulateAsync(
          image.uri,
          [
            { resize: { width: 500, height: 500 } }, // Resize to reasonable dimensions
          ],
          { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
        );

        setFormData(prev => ({
          ...prev,
          profile_image: {
            ...manipulatedImage,
            originalUri: image.uri // Keep original for reference
          },
        }));
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image.');
    }
  };

  // 📷 Take photo with camera
  const takePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission required', 'You need to allow access to the camera.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        const image = result.assets[0];
        
        const manipulatedImage = await ImageManipulator.manipulateAsync(
          image.uri,
          [
            { resize: { width: 500, height: 500 } },
          ],
          { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
        );

        setFormData(prev => ({
          ...prev,
          profile_image: {
            ...manipulatedImage,
            originalUri: image.uri
          },
        }));
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('Error', 'Failed to take photo.');
    }
  };

  // 🗑️ Remove selected image
  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      profile_image: null,
    }));
  };

  // 🔄 Change image (shows options to pick new or take photo)
  const changeImage = () => {
    Alert.alert(
      'Change Profile Image',
      'Choose an option',
      [
        {
          text: 'Choose from Gallery',
          onPress: pickImage,
        },
        {
          text: 'Take Photo',
          onPress: takePhoto,
        },
        {
          text: 'Remove Current',
          onPress: removeImage,
          style: 'destructive',
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  // 📨 Submit form with multipart/form-data
  const handleSubmit = async () => {
    if (!formData.full_name || !formData.email || !formData.phone || !formData.password) {
      Alert.alert('Validation Error', 'Please fill in all required fields.');
      return;
    }

    if (!formData.user_role) {
      Alert.alert('Validation Error', 'Please select a user role.');
      return;
    }

    if (!formData.status) {
      Alert.alert('Validation Error', 'Please select a status.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = new FormData();

      payload.append('full_name', formData.full_name);
      payload.append('email', formData.email);
      payload.append('phone', formData.phone);
      payload.append('password', formData.password);
      payload.append('user_role', formData.user_role);
      payload.append('status', formData.status);
      payload.append('salon', user?.salon?.id || salonId);

      if (formData.profile_image) {
        const uriParts = formData.profile_image.uri.split('.');
        const fileType = uriParts[uriParts.length - 1];

        payload.append('profile_image', {
          uri: formData.profile_image.uri,
          name: `profile_${Date.now()}.${fileType}`,
          type: `image/${fileType}`,
        });
      }

      console.log('📤 Sending payload:', payload);

      const res = await axios.post('https://yaslaservice.com:81/users/', payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('✅ API Response:', res.data);

      Alert.alert('Success', 'User created successfully', [
        {
          text: 'OK',
          onPress: () => {
            setFormData(initialFormData);
            navigation.goBack();
          },
        },
      ]);
    } catch (error) {
      console.error('❌ Error creating user:', error.response?.data || error.message);
      const apiMessage = error.response?.data?.message;
      setError(apiMessage || 'Failed to create user');
      Alert.alert('Error', apiMessage || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.modalContainer} keyboardShouldPersistTaps="handled">
        <Text style={styles.modalTitle}>Add New User</Text>

        {/* Profile Image Section */}
        <View style={styles.imageSection}>
          <Text style={styles.label}>Profile Image</Text>
          
          {formData.profile_image ? (
            <View style={styles.imagePreviewContainer}>
              <Image
                source={{ uri: formData.profile_image.uri }}
                style={styles.profileImage}
              />
              <View style={styles.imageActions}>
                <TouchableOpacity 
                  style={[styles.imageButton, styles.changeButton]} 
                  onPress={changeImage}
                >
                  <MaterialCommunityIcons name="pencil" size={16} color="#fff" />
                  <Text style={styles.imageButtonText}>Change</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.imageButton, styles.removeButton]} 
                  onPress={removeImage}
                >
                  <MaterialCommunityIcons name="delete" size={16} color="#fff" />
                  <Text style={styles.imageButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.imageUploadOptions}>
              <TouchableOpacity style={styles.uploadOption} onPress={pickImage}>
                <MaterialCommunityIcons name="image" size={24} color="#2F4EAA" />
                <Text style={styles.uploadOptionText}>Choose from Gallery</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.uploadOption} onPress={takePhoto}>
                <MaterialCommunityIcons name="camera" size={24} color="#2F4EAA" />
                <Text style={styles.uploadOptionText}>Take Photo</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <Text style={styles.label}>Full Name *</Text>
        <TextInput
          style={styles.input}
          value={formData.full_name}
          onChangeText={text => handleChange('full_name', text)}
          placeholder="Enter full name"
        />

        <Text style={styles.label}>Email *</Text>
        <TextInput
          style={styles.input}
          value={formData.email}
          onChangeText={text => handleChange('email', text)}
          placeholder="Enter email"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Phone *</Text>
        <TextInput
          style={styles.input}
          value={formData.phone}
          onChangeText={text => handleChange('phone', text)}
          placeholder="Enter phone number"
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Password *</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            value={formData.password}
            onChangeText={text => handleChange('password', text)}
            placeholder="Enter password"
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
            <MaterialCommunityIcons
              name={showPassword ? 'eye-off' : 'eye'}
              size={24}
              color="#777"
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>User Role *</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={formData.user_role}
            onValueChange={itemValue => handleChange('user_role', itemValue)}
          >
            <Picker.Item label="Select Role" value="" />
            <Picker.Item label="Admin" value="Admin" />
            <Picker.Item label="Sub Admin" value="Sub Admin" />
            <Picker.Item label="Stylist" value="Stylist" />
            <Picker.Item label="Receptionist" value="Receptionist" />
          </Picker>
        </View>

        <Text style={styles.label}>Status *</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={formData.status}
            onValueChange={itemValue => handleChange('status', itemValue)}
          >
            <Picker.Item label="Select Status" value="" />
            <Picker.Item label="Active" value="Active" />
            <Picker.Item label="Inactive" value="Inactive" />
          </Picker>
        </View>

        <Text style={styles.requiredNote}>* Required fields</Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => {
              setFormData(initialFormData);
              navigation.goBack();
            }}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.submitButton, loading && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Create User</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2F4EAA',
  },
  label: {
    marginTop: 10,
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  passwordInput: {
    flex: 1,
    padding: 10,
  },
  eyeIcon: {
    padding: 10,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  imageSection: {
    marginBottom: 15,
  },
  imagePreviewContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: '#2F4EAA',
  },
  imageActions: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 10,
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 5,
  },
  changeButton: {
    backgroundColor: '#2F4EAA',
  },
  removeButton: {
    backgroundColor: '#f44336',
  },
  imageButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  imageUploadOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  uploadOption: {
    flex: 1,
    alignItems: 'center',
    padding: 15,
    borderWidth: 2,
    borderColor: '#2F4EAA',
    borderRadius: 8,
    marginHorizontal: 5,
    backgroundColor: '#f8f9ff',
  },
  uploadOptionText: {
    marginTop: 5,
    color: '#2F4EAA',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  submitButton: {
    backgroundColor: '#2F4EAA',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  disabledButton: {
    backgroundColor: '#a0a0a0',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  errorText: {
    color: '#f44336',
    textAlign: 'center',
    marginVertical: 10,
    fontWeight: 'bold',
  },
  requiredNote: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 5,
  },
});

export default AddUserForm;
