// import React, { useState, useEffect, useContext } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import axios from 'axios';
// import { AuthContext } from '../../../context/AuthContext';

// const EditUser = ({ route, navigation }) => {
//   const { userId, onUserUpdated } = route.params;
//   const { user: currentUser } = useContext(AuthContext);

//   const [user, setUser] = useState({
//     full_name: '',
//     email: '',
//     phone: '',
//     password: '',
//     user_role: '',
//     profile_image: '',
//     status: '',
//     salon: 0,
//     branches: [],
//   });

//   const [loading, setLoading] = useState(false);
//   const [fetching, setFetching] = useState(true);
//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     const fetchUserDetails = async () => {
//       try {
//         const response = await axios.get(`https://yaslaservice.com:81/users/${userId}/`);
//         const data = response.data.data;

//         setUser({
//           full_name: data.full_name || '',
//           email: data.email || '',
//           phone: data.phone || '',
//           password: '',
//           user_role: data.user_role || '',
//           profile_image: data.profile_image || '',
//           status: data.status || '',
//           salon: data.salon ?? 0,
//           branches: Array.isArray(data.branches) ? data.branches.map(b => b.id || b) : [],
//         });
//       } catch (error) {
//         console.error('Error fetching user details:', error);
//         Alert.alert("Error", "Failed to load user details");
//       } finally {
//         setFetching(false);
//       }
//     };

//     fetchUserDetails();
//   }, [userId]);

//   const handleChange = (field, value) => {
//     setUser(prev => ({ ...prev, [field]: value }));
//     if (errors[field]) {
//       setErrors(prev => ({ ...prev, [field]: '' }));
//     }
//   };

//   const validate = () => {
//     const newErrors = {};
//     if (!user.full_name) newErrors.full_name = 'Full name is required';
//     if (!user.email) newErrors.email = 'Email is required';
//     if (!user.user_role) newErrors.user_role = 'Role is required';
//     if (!user.status) newErrors.status = 'Status is required';
//     if (!user.password) newErrors.password = 'Password is required';
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async () => {
//     if (!validate()) return;

//     const {
//       full_name,
//       email,
//       phone,
//       password,
//       user_role,
//       profile_image,
//       status,
//       salon,
//     } = user;

//     const payload = {
//       full_name,
//       email,
//       phone,
//       password,
//       user_role,
//       profile_image,
//       status,
//       salon,
//     };

//     try {
//       setLoading(true);
//       await axios.put(`https://yaslaservice.com:81/users/${userId}/`, payload);
//       Alert.alert("Success", "User updated successfully");
//       if (onUserUpdated) onUserUpdated();
//       navigation.goBack();
//     } catch (error) {
//       let errMsg = "Server error";

//       if (error.response?.data) {
//         const data = error.response.data;
//         if (typeof data === 'string') {
//           errMsg = data;
//         } else if (data.message) {
//           errMsg = data.message;
//         } else {
//           errMsg = JSON.stringify(data, null, 2);
//         }
//       }

//       console.error("Error updating user:", errMsg);
//       Alert.alert("Error", errMsg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (fetching) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#4CAF50" />
//       </View>
//     );
//   }

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//           <Icon name="arrow-back" size={24} color="#4CAF50" />
//         </TouchableOpacity>
//         <Text style={styles.title}>Edit User</Text>
//         <TouchableOpacity onPress={handleSubmit} style={styles.saveButton}>
//           {loading ? (
//             <ActivityIndicator size="small" color="#fff" />
//           ) : (
//             <Text style={styles.saveButtonText}>Save</Text>
//           )}
//         </TouchableOpacity>
//       </View>

//       <View style={styles.card}>
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Basic Information</Text>

//           <InputField
//             label="Full Name"
//             value={user.full_name}
//             onChangeText={text => handleChange('full_name', text)}
//             error={errors.full_name}
//           />
//           <InputField
//             label="Email"
//             value={user.email}
//             onChangeText={text => handleChange('email', text)}
//             error={errors.email}
//             keyboardType="email-address"
//             autoCapitalize="none"
//           />
//           <InputField
//             label="Phone"
//             value={user.phone || ''}
//             onChangeText={text => handleChange('phone', text)}
//             keyboardType="phone-pad"
//           />
//           <InputField
//             label="Password"
//             value={user.password}
//             onChangeText={text => handleChange('password', text)}
//             secureTextEntry
//             error={errors.password}
//           />
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Role & Status</Text>

//           <RadioGroup
//             label="User Role"
//             options={['Admin', 'Sub Admin', 'Stylist', 'Receptionist']}
//             selected={user.user_role}
//             onSelect={value => handleChange('user_role', value)}
//             error={errors.user_role}
//           />

//           <RadioGroup
//             label="Status"
//             options={['Active', 'Inactive']}
//             selected={user.status}
//             onSelect={value => handleChange('status', value)}
//             error={errors.status}
//           />
//         </View>
//       </View>
//     </ScrollView>
//   );
// };

// // Reusable Input Field
// const InputField = ({ label, value, onChangeText, error, ...rest }) => (
//   <View style={styles.inputGroup}>
//     <Text style={styles.label}>{label}</Text>
//     <TextInput
//       style={[styles.input, error && styles.inputError]}
//       value={value}
//       onChangeText={onChangeText}
//       placeholder={`Enter ${label.toLowerCase()}`}
//       {...rest}
//     />
//     {error && <Text style={styles.errorText}>{error}</Text>}
//   </View>
// );

// // Reusable Radio Group
// const RadioGroup = ({ label, options, selected, onSelect, error }) => (
//   <View style={styles.inputGroup}>
//     <Text style={styles.label}>{label}</Text>
//     <View style={styles.radioGroup}>
//       {options.map(option => (
//         <TouchableOpacity
//           key={option}
//           style={[styles.radioButton, selected === option && styles.radioButtonActive]}
//           onPress={() => onSelect(option)}
//         >
//           <Text style={selected === option ? styles.radioButtonTextActive : styles.radioButtonText}>
//             {option}
//           </Text>
//         </TouchableOpacity>
//       ))}
//     </View>
//     {error && <Text style={styles.errorText}>{error}</Text>}
//   </View>
// );

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#f5f5f5', paddingTop: 20 },
//   loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   header: {
//     flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
//     paddingHorizontal: 15, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee',
//   },
//   title: { fontSize: 20, fontWeight: 'bold', color: '#333' },
//   backButton: { padding: 5 },
//   saveButton: { backgroundColor: '#4CAF50', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 5 },
//   saveButtonText: { color: '#fff', fontWeight: 'bold' },
//   card: {
//     backgroundColor: '#fff', borderRadius: 10, margin: 15, padding: 20,
//     shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
//   },
//   section: { marginBottom: 20 },
//   sectionTitle: {
//     fontSize: 16, fontWeight: 'bold', color: '#4CAF50',
//     marginBottom: 15, paddingBottom: 5, borderBottomWidth: 1, borderBottomColor: '#eee',
//   },
//   inputGroup: { marginBottom: 15 },
//   label: { fontWeight: 'bold', marginBottom: 5, color: '#555' },
//   input: {
//     borderWidth: 1, borderColor: '#ddd', borderRadius: 5,
//     padding: 10, fontSize: 16, backgroundColor: '#f9f9f9',
//   },
//   inputError: { borderColor: '#f44336' },
//   errorText: { color: '#f44336', fontSize: 12, marginTop: 5 },
//   radioGroup: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 5 },
//   radioButton: {
//     borderWidth: 1, borderColor: '#ddd', borderRadius: 5,
//     paddingVertical: 8, paddingHorizontal: 15, marginRight: 10, marginBottom: 8, backgroundColor: '#f9f9f9',
//   },
//   radioButtonActive: { borderColor: '#4CAF50', backgroundColor: '#e8f5e9' },
//   radioButtonText: { color: '#555' },
//   radioButtonTextActive: { color: '#4CAF50', fontWeight: 'bold' },
// });

// export default EditUser;



import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';

const EditUser = ({ route, navigation }) => {
  const { userId, onUserUpdated } = route.params;
  const { user: currentUser } = useContext(AuthContext);

  const [user, setUser] = useState({
    full_name: '',
    email: '',
    phone: '',
    user_role: '',
    profile_image: '',
    status: '',
    salon: 0,
    branches: [],
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`https://yaslaservice.com:81/users/${userId}/`);
        const data = response.data.data;

        setUser({
          full_name: data.full_name || '',
          email: data.email || '',
          phone: data.phone || '',
          user_role: data.user_role || '',
          profile_image: data.profile_image || '',
          status: data.status || '',
          salon: data.salon ?? 0,
          branches: Array.isArray(data.branches) ? data.branches.map(b => b.id || b) : [],
        });
      } catch (error) {
        console.error('Error fetching user details:', error);
        Alert.alert("Error", "Failed to load user details");
      } finally {
        setFetching(false);
      }
    };

    fetchUserDetails();
  }, [userId]);

  const handleChange = (field, value) => {
    setUser(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!user.full_name) newErrors.full_name = 'Full name is required';
    if (!user.email) newErrors.email = 'Email is required';
    if (!user.user_role) newErrors.user_role = 'Role is required';
    if (!user.status) newErrors.status = 'Status is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const handleSubmit = async () => {
  if (!validate()) return;

  const {
    full_name,
    email,
    phone,
    user_role,
    profile_image,
    status,
    salon,
  } = user;

  // Create FormData to handle file uploads properly
  const formData = new FormData();
  
  // Add all fields to formData
  formData.append('full_name', full_name);
  formData.append('email', email);
  formData.append('phone', phone);
  formData.append('user_role', user_role);
  formData.append('status', status);
  formData.append('salon', salon.toString());
  
  // Handle profile_image field - only append if it's a file
  // If it's null or empty string, don't include it (API will keep existing value)
  // Or explicitly set to null if you want to remove the image
  if (profile_image) {
    // Check if it's a file URI (starts with file://)
    if (typeof profile_image === 'string' && profile_image.startsWith('file://')) {
      // Extract filename from URI
      const filename = profile_image.split('/').pop();
      // Determine file type
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image';
      
      // Append the file
      formData.append('profile_image', {
        uri: profile_image,
        name: filename,
        type: type,
      });
    } else {
      // For non-file values, don't include in formData
      // The API will keep the existing profile image
    }
  } else {
    // If profile_image is null or empty, explicitly set it to null
    // to remove the existing image (if that's what you want)
    // formData.append('profile_image', null);
    
    // OR don't include it at all to keep the existing image
    // The API will maintain the current profile_image value
  }

  try {
    setLoading(true);
    console.log(`Updating user ${userId} with formData:`);
    
    // Log formData contents for debugging
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
    
    const response = await axios.put(`https://yaslaservice.com:81/users/${userId}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log("User update successful:", response.data);
    
    Alert.alert("Success", "User updated successfully");
    if (onUserUpdated) onUserUpdated();
    navigation.goBack();
  } catch (error) {
    let errMsg = "Server error";
    let errorDetails = {};

    if (error.response) {
      console.error("Server responded with error status:", error.response.status);
      console.error("Error response headers:", error.response.headers);
      console.error("Error response data:", error.response.data);
      
      errorDetails = {
        status: error.response.status,
        headers: error.response.headers,
        data: error.response.data
      };
      
      if (error.response.data) {
        const data = error.response.data;
        
        if (typeof data === 'string') {
          errMsg = data;
        } else if (data.message) {
          errMsg = data.message;
        } else if (data.detail) {
          errMsg = data.detail;
        } else if (data.non_field_errors) {
          errMsg = data.non_field_errors.join(', ');
        } else if (data.errors) {
          // Handle the specific error format from your API
          const fieldErrors = [];
          for (const [field, messages] of Object.entries(data.errors)) {
            fieldErrors.push(`${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`);
          }
          errMsg = fieldErrors.join('; ');
        } else {
          // Handle other error formats
          const fieldErrors = [];
          for (const [field, messages] of Object.entries(data)) {
            fieldErrors.push(`${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`);
          }
          errMsg = fieldErrors.join('; ');
        }
      }
    } else if (error.request) {
      console.error("No response received:", error.request);
      errMsg = "No response from server. Please check your connection.";
      errorDetails = { request: error.request };
    } else {
      console.error("Error setting up request:", error.message);
      errMsg = error.message;
      errorDetails = { message: error.message };
    }
    
    console.error("Error updating user:", errMsg, "Details:", errorDetails);
    Alert.alert("Error", errMsg);
  } finally {
    setLoading(false);
  }
};

  if (fetching) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2F4EAA" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {/* <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#4CAF50" />
        </TouchableOpacity> */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
           <MaterialIcons name="arrow-back" size={24} color="#2F4EAA" />
        </TouchableOpacity>
        <Text style={styles.title}>Edit User</Text>
        <TouchableOpacity onPress={handleSubmit} style={styles.saveButton}>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>

          <InputField
            label="Full Name"
            value={user.full_name}
            onChangeText={text => handleChange('full_name', text)}
            error={errors.full_name}
          />
          <InputField
            label="Email"
            value={user.email}
            onChangeText={text => handleChange('email', text)}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <InputField
            label="Phone"
            value={user.phone || ''}
            onChangeText={text => handleChange('phone', text)}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Role & Status</Text>

          <RadioGroup
            label="User Role"
            options={['Admin', 'Sub Admin', 'Stylist', 'Receptionist']}
            selected={user.user_role}
            onSelect={value => handleChange('user_role', value)}
            error={errors.user_role}
          />

          <RadioGroup
            label="Status"
            options={['Active', 'Inactive']}
            selected={user.status}
            onSelect={value => handleChange('status', value)}
            error={errors.status}
          />
        </View>
      </View>
    </ScrollView>
  );
};

// Reusable Input Field
const InputField = ({ label, value, onChangeText, error, ...rest }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, error && styles.inputError]}
      value={value}
      onChangeText={onChangeText}
      placeholder={`Enter ${label.toLowerCase()}`}
      {...rest}
    />
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

// Reusable Radio Group
const RadioGroup = ({ label, options, selected, onSelect, error }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.radioGroup}>
      {options.map(option => (
        <TouchableOpacity
          key={option}
          style={[styles.radioButton, selected === option && styles.radioButtonActive]}
          onPress={() => onSelect(option)}
        >
          <Text style={selected === option ? styles.radioButtonTextActive : styles.radioButtonText}>
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f5f5', 
    paddingTop: 20 
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  header: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingHorizontal: 15, 
    paddingVertical: 10, 
    borderBottomWidth: 1, 
    borderBottomColor: '#eee',
  },
  title: { 
    fontSize: 20, 
    fontFamily: 'Inter_600SemiBold',
    color: '#333' 
  },
  backButton: { 
    padding: 5 
  },
  saveButton: { 
    backgroundColor: '#2F4EAA', 
    paddingVertical: 8, 
    paddingHorizontal: 15, 
    borderRadius: 5 
  },
  saveButtonText: { 
    color: '#fff', 
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14
  },
  card: {
    backgroundColor: '#fff', 
    borderRadius: 10, 
    margin: 15, 
    padding: 20,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, 
    shadowRadius: 4, 
    elevation: 3,
  },
  section: { 
    marginBottom: 20 
  },
  sectionTitle: {
    fontSize: 18, 
    fontFamily: 'Inter_600SemiBold', 
    color: 'black',
    marginBottom: 15, 
    paddingBottom: 5, 
    borderBottomWidth: 1, 
    borderBottomColor: '#eee',
  },
  inputGroup: { 
    marginBottom: 15 
  },
  label: { 
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 5, 
    color: '#555',
    fontSize: 14
  },
  input: {
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 5,
    padding: 10, 
    fontSize: 16, 
    backgroundColor: '#f9f9f9',
    fontFamily: 'Inter_400Regular',
  },
  inputError: { 
    borderColor: '#f44336' 
  },
  errorText: { 
    color: '#f44336', 
    fontSize: 12, 
    marginTop: 5,
    fontFamily: 'Inter_400Regular',
  },
  radioGroup: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    marginTop: 5 
  },
  radioButton: {
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 5,
    paddingVertical: 8, 
    paddingHorizontal: 15, 
    marginRight: 10, 
    marginBottom: 8, 
    backgroundColor: '#f9f9f9',
  },
  radioButtonActive: { 
    borderColor: '#4CAF50', 
    backgroundColor: '#e8f5e9' 
  },
  radioButtonText: { 
    color: '#555',
    fontFamily: 'Inter_400Regular',
    fontSize: 14
  },
  radioButtonTextActive: { 
    color: '#4CAF50', 
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14
  },
});

export default EditUser;