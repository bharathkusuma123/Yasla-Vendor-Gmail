
// import React, { useContext, useEffect, useState } from 'react';
// import { 
//   View, 
//   Text, 
//   StyleSheet, 
//   ScrollView, 
//   ActivityIndicator, 
//   TouchableOpacity,
//   Image,
//   Alert,
//   TextInput,
//   Modal,
//   Pressable,
//   Platform,
//   FlatList
// } from 'react-native';
// import axios from 'axios';
// import { AuthContext } from '../../../../context/AuthContext';
// import { MaterialIcons, Feather, Ionicons } from '@expo/vector-icons';
// import * as ImagePicker from 'expo-image-picker';
// import RNPickerSelect from 'react-native-picker-select';

// const UserProfile = ({ navigation }) => {
//   const { user,salonId, logout } = useContext(AuthContext);
//   const [profileData, setProfileData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [refresh, setRefresh] = useState(false);
//   const [bankDetails, setBankDetails] = useState(null);
//   const [galleryDetails, setGalleryDetails] = useState([]);
//   const [bankModalVisible, setBankModalVisible] = useState(false);
//   const [profileModalVisible, setProfileModalVisible] = useState(false);
//   const [galleryModalVisible, setGalleryModalVisible] = useState(false);
//   const [image, setImage] = useState(null);
//   const [galleryImages, setGalleryImages] = useState([]);
//   const [uploading, setUploading] = useState(false);
//   const [uploadingGallery, setUploadingGallery] = useState(false);
  
//   const [bankFormData, setBankFormData] = useState({
//     account_holder_name: '',
//     bank_name: '',
//     account_number: '',
//     ifsc_code: '',
//     upi_id: ''
//   });
  
//   const [profileFormData, setProfileFormData] = useState({
//     full_name: '',
//     email: '',
//     phone: '',
//     user_role: 'Admin',
//     status: 'Active'
//   });

//   const fetchBankDetails = async () => {
//     try {
//       if (!salonId) {
//         console.error("❌ salonId is missing!");
//         setBankDetails(null);
//         return;
//       }

//       const url = `https://yaslaservice.com:81/bank-details/${salonId}/`;
//       console.log("🔍 Fetching Bank Details from:", url);

//       const response = await axios.get(url);
//       if (response.data?.data) {
//         console.log("✅ Bank Details Found:", response.data.data);
//         setBankDetails(response.data.data);
//       } else {
//         console.warn("⚠️ No bank details found for salonId:", salonId);
//         setBankDetails(null);
//       }
//     } catch (error) {
//       if (error.response?.status === 404) {
//         // No bank details exist, not a real error
//         console.warn(`⚠️ No bank details found for salonId: ${salonId}`);
//         setBankDetails(null);
//       } else {
//         console.error("❌ Error fetching bank details:", error);
//         Alert.alert("Error", "Failed to fetch bank details. Please try again later.");
//         setBankDetails(null);
//       }
//     }
//   };

//   const fetchGalleryDetails = async () => {
//     try {
//       if (!salonId) {
//         console.error("❌ salonId is missing!");
//         setGalleryDetails([]);
//         return;
//       }

//       const url = `https://yaslaservice.com:81/gallery/${salonId}/`;
//       console.log("🔍 Fetching Gallery Details from:", url);

//       const response = await axios.get(url);
//       if (response.data?.data) {
//         console.log("✅ Gallery Details Found:", response.data.data);
//         setGalleryDetails(response.data.data);
//       } else {
//         console.warn("⚠️ No gallery details found for salonId:", salonId);
//         setGalleryDetails([]);
//       }
//     } catch (error) {
//       if (error.response?.status === 404) {
//         // No gallery details exist, not a real error
//         console.warn(`⚠️ No gallery details found for salonId: ${salonId}`);
//         setGalleryDetails([]);
//       } else {
//         console.error("❌ Error fetching gallery details:", error);
//         setGalleryDetails([]);
//       }
//     }
//   };

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         // Fetch user profile
//         const userResponse = await axios.get('https://yaslaservice.com:81/users/');
//         const matchedUser = userResponse.data.data.find(u => u.id === user.user_id);
//         setProfileData(matchedUser || null);

//         // Set profile form data
//         if (matchedUser) {
//           setProfileFormData({
//             full_name: matchedUser.full_name || '',
//             email: matchedUser.email || '',
//             phone: matchedUser.phone || '',
//             user_role: matchedUser.user_role || 'Admin',
//             status: matchedUser.status || 'Active'
//           });
          
//           if (matchedUser.profile_image) {
//             setImage(matchedUser.profile_image);
//           }
//         }

//         // Fetch bank details
//         await fetchBankDetails();
        
//         // Fetch gallery details
//         await fetchGalleryDetails();
//       } catch (error) {
//         console.error('Error fetching user profile:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (user?.user_id) {
//       fetchUserData();
//     } else {
//       setLoading(false);
//     }
//   }, [user?.user_id, refresh]);

//   const pickImage = async () => {
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });

//     if (!result.canceled) {
//       setImage(result.assets[0].uri);
//     }
//   };

//   const pickGalleryImages = async () => {
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsMultipleSelection: true,
//       aspect: [4, 3],
//       quality: 1,
//     });

//     if (!result.canceled) {
//       setGalleryImages([...galleryImages, ...result.assets]);
//     }
//   };

//   const removeGalleryImage = (index) => {
//     const newImages = [...galleryImages];
//     newImages.splice(index, 1);
//     setGalleryImages(newImages);
//   };

//   const uploadImage = async () => {
//     if (!image) return null;
    
//     setUploading(true);
//     try {
//       const formData = new FormData();
//       formData.append('profile_image', {
//         uri: image,
//         name: 'profile.jpg',
//         type: 'image/jpeg'
//       });

//       const response = await axios.put(
//         `https://yaslaservice.com:81/users/${user.user_id}/`,
//         formData,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         }
//       );
      
//       return response.data.data.profile_image;
//     } catch (error) {
//       console.error('Error uploading image:', error);
//       return null;
//     } finally {
//       setUploading(false);
//     }
//   };

//   const uploadGalleryImages = async () => {
//     if (galleryImages.length === 0) return;
    
//     setUploadingGallery(true);
//     try {
//       for (const asset of galleryImages) {
//         const formData = new FormData();
//         formData.append('salon_id', salonId);
//         formData.append('image', {
//           uri: asset.uri,
//           name: 'gallery.jpg',
//           type: 'image/jpeg'
//         });

//         await axios.post(
//           'https://yaslaservice.com:81/gallery/',
//           formData,
//           {
//             headers: {
//               'Content-Type': 'multipart/form-data',
//             },
//           }
//         );
//       }
      
//       Alert.alert('Success', 'Gallery images uploaded successfully');
//       setGalleryModalVisible(false);
//       setGalleryImages([]);
//       await fetchGalleryDetails();
//     } catch (error) {
//       console.error('Error uploading gallery images:', error);
//       Alert.alert('Error', 'Failed to upload gallery images');
//     } finally {
//       setUploadingGallery(false);
//     }
//   };

//   const handleBankInputChange = (name, value) => {
//     setBankFormData({
//       ...bankFormData,
//       [name]: value
//     });
//   };

//   const handleProfileInputChange = (name, value) => {
//     setProfileFormData({
//       ...profileFormData,
//       [name]: value
//     });
//   };

//   const handleSubmitBankDetails = async () => {
//     // Validate required fields
//     if (!bankFormData.account_holder_name || !bankFormData.bank_name || 
//         !bankFormData.account_number || !bankFormData.ifsc_code) {
//       Alert.alert('Error', 'Please fill all required fields');
//       return;
//     }

//     // Validate IFSC code format (4 letters + 7 alphanumeric characters)
//     const ifscRegex = /^[A-Z]{4}[0-9A-Z]{7}$/;
//     if (!ifscRegex.test(bankFormData.ifsc_code)) {
//       Alert.alert('Error', 'Please enter a valid IFSC code (Format: XXXX0000000)');
//       return;
//     }

//     try {
//       const payload = {
//         salon_id: salonId,   // required for POST
//         account_holder_name: bankFormData.account_holder_name,
//         bank_name: bankFormData.bank_name,
//         account_number: bankFormData.account_number,
//         ifsc_code: bankFormData.ifsc_code,
//         upi_id: bankFormData.upi_id || '',
//         razorpay_contact_id: bankFormData.razorpay_contact_id || '',
//         razorpay_fund_account_id: bankFormData.razorpay_fund_account_id || '',
//         is_verified: bankFormData.is_verified ?? false
//       };

//       const config = {
//         headers: { 'Content-Type': 'application/json' }
//       };

//       let response;
//       if (bankDetails) {
//         // UPDATE existing details (PUT)
//         response = await axios.put(
//           `https://yaslaservice.com:81/bank-details/${salonId}/`, 
//           payload,
//           config
//         );
//       } else {
//         // ADD new details (POST)
//         response = await axios.post(
//           'https://yaslaservice.com:81/bank-details/', 
//           payload,
//           config
//         );
//       }

//       Alert.alert('Success', bankDetails ? 'Bank details updated successfully' : 'Bank details added successfully');
//       setBankModalVisible(false);
//       await fetchBankDetails();

//     } catch (error) {
//       console.error('Error saving bank details:', error);
//       let errorMessage = 'Failed to save bank details';
      
//       if (error.response) {
//         if (error.response.data && error.response.data.errors) {
//           const fieldErrors = Object.entries(error.response.data.errors)
//             .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
//             .join('\n');
//           errorMessage = fieldErrors;
//         } else if (error.response.data?.message) {
//           errorMessage = error.response.data.message;
//         }
//       }
      
//       Alert.alert('Error', errorMessage);
//     }
//   };

//   const handleSubmitProfileDetails = async () => {
//     try {
//       let imageUrl = image !== profileData?.profile_image ? await uploadImage() : profileData?.profile_image;
      
//       const payload = {
//         ...profileFormData,
//         profile_image: imageUrl || null
//       };

//       // Update user profile
//       await axios.put(`https://yaslaservice.com:81/users/${user.user_id}/`, payload);
//       Alert.alert('Success', 'Profile updated successfully');
      
//       setProfileModalVisible(false);
//       // Refresh profile data
//       setRefresh(!refresh);
//     } catch (error) {
//       console.error('Error updating profile:', error);
//       Alert.alert('Error', 'Failed to update profile');
//     }
//   };

//   const openBankEditModal = () => {
//     if (bankDetails) {
//       setBankFormData({
//         account_holder_name: bankDetails.account_holder_name,
//         bank_name: bankDetails.bank_name,
//         account_number: bankDetails.account_number,
//         ifsc_code: bankDetails.ifsc_code,
//         upi_id: bankDetails.upi_id
//       });
//     } else {
//       setBankFormData({
//         account_holder_name: profileData.full_name || '',
//         bank_name: '',
//         account_number: '',
//         ifsc_code: '',
//         upi_id: ''
//       });
//     }
//     setBankModalVisible(true);
//   };

//   const openProfileEditModal = () => {
//     setProfileFormData({
//       full_name: profileData.full_name || '',
//       email: profileData.email || '',
//       phone: profileData.phone || '',
//       user_role: profileData.user_role || 'Admin',
//       status: profileData.status || 'Active'
//     });
//     setImage(profileData.profile_image || null);
//     setProfileModalVisible(true);
//   };

//   const openGalleryModal = () => {
//     setGalleryImages([]);
//     setGalleryModalVisible(true);
//   };

//   if (loading) {
//     return <ActivityIndicator size="large" color="#4CAF50" style={{ marginTop: 50 }} />;
//   }

//   if (!profileData) {
//     return <Text style={{ textAlign: 'center', marginTop: 50 }}>Profile not found</Text>;
//   }

//   const renderGalleryItem = ({ item, index }) => (
//     <View style={styles.galleryItem}>
//       <Image source={{ uri: item.image }} style={styles.galleryImage} />
//       <TouchableOpacity 
//         style={styles.removeImageButton}
//         onPress={() => removeGalleryImage(index)}
//       >
//         <Ionicons name="close-circle" size={24} color="#F44336" />
//       </TouchableOpacity>
//     </View>
//   );

//   const renderGalleryDetailItem = ({ item }) => (
//     <View style={styles.galleryDetailItem}>
//       <Image source={{ uri: item.image }} style={styles.galleryDetailImage} />
//     </View>
//   );

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       {/* Profile Header */}
//       <View style={styles.profileHeader}>
//         <View style={styles.avatarContainer}>
//           {image ? (
//             <Image 
//               source={{ uri: image }} 
//               style={styles.avatar}
//             />
//           ) : (
//             <View style={styles.defaultAvatar}>
//               <Ionicons name="person" size={50} color="#666" />
//             </View>
//           )}
//         </View>
//         <Text style={styles.profileName}>{profileData.full_name || 'N/A'}</Text>
//         <Text style={styles.profileRole}>{profileData.user_role || 'N/A'}</Text>
//         <View style={styles.statusBadge}>
//           <Text style={[
//             styles.statusText,
//             profileData.status === 'Active' ? styles.activeStatus : styles.inactiveStatus
//           ]}>
//             {profileData.status || 'N/A'}
//           </Text>
//         </View>
//       </View>

//       {/* Profile Details Card */}
//       <View style={styles.card}>
//         <View style={styles.cardHeader}>
//           <MaterialIcons name="person-outline" size={20} color="#4CAF50" />
//           <Text style={styles.cardTitle}>Personal Information</Text>
//           <TouchableOpacity 
//             style={styles.editButton}
//             onPress={openProfileEditModal}
//           >
//             <Text style={styles.editButtonText}>Edit</Text>
//           </TouchableOpacity>
//         </View>
        
//         <View style={styles.detailItem}>
//           <Feather name="mail" size={18} color="#666" />
//           <Text style={styles.detailText}>{profileData.email || 'N/A'}</Text>
//         </View>
        
//         <View style={styles.detailItem}>
//           <Feather name="phone" size={18} color="#666" />
//           <Text style={styles.detailText}>{profileData.phone || 'N/A'}</Text>
//         </View>
        
//         <View style={styles.detailItem}>
//           <MaterialIcons name="store" size={18} color="#666" />
//           <Text style={styles.detailText}>Salon ID: {profileData.salon || 'N/A'}</Text>
//         </View>
//       </View>

//       {/* Bank Details Card */}
//       <View style={styles.card}>
//         <View style={styles.cardHeader}>
//           <MaterialIcons name="account-balance" size={20} color="#4CAF50" />
//           <Text style={styles.cardTitle}>Bank Details</Text>
//           <TouchableOpacity 
//             style={styles.editButton}
//             onPress={openBankEditModal}
//           >
//             <Text style={styles.editButtonText}>
//               {bankDetails ? 'Edit' : 'Add'}
//             </Text>
//           </TouchableOpacity>
//         </View>
        
//         {bankDetails ? (
//           <>
//             <View style={styles.detailItem}>
//               <MaterialIcons name="person" size={18} color="#666" />
//               <View>
//                 <Text style={styles.detailLabel}>Account Holder Name</Text>
//                 <Text style={styles.detailText}>{bankDetails.account_holder_name || 'N/A'}</Text>
//               </View>
//             </View>
            
//             <View style={styles.detailItem}>
//               <MaterialIcons name="account-balance" size={18} color="#666" />
//               <View>
//                 <Text style={styles.detailLabel}>Bank Name</Text>
//                 <Text style={styles.detailText}>{bankDetails.bank_name || 'N/A'}</Text>
//               </View>
//             </View>
            
//             <View style={styles.detailItem}>
//               <MaterialIcons name="credit-card" size={18} color="#666" />
//               <View>
//                 <Text style={styles.detailLabel}>Account Number</Text>
//                 <Text style={styles.detailText}>{bankDetails.account_number || 'N/A'}</Text>
//               </View>
//             </View>
            
//             <View style={styles.detailItem}>
//               <MaterialIcons name="code" size={18} color="#666" />
//               <View>
//                 <Text style={styles.detailLabel}>IFSC Code</Text>
//                 <Text style={styles.detailText}>{bankDetails.ifsc_code || 'N/A'}</Text>
//               </View>
//             </View>
            
//             {bankDetails.upi_id && (
//               <View style={styles.detailItem}>
//                 <MaterialIcons name="payment" size={18} color="#666" />
//                 <View>
//                   <Text style={styles.detailLabel}>UPI ID</Text>
//                   <Text style={styles.detailText}>{bankDetails.upi_id}</Text>
//                 </View>
//               </View>
//             )}

//             {bankDetails.razorpay_contact_id && (
//               <View style={styles.detailItem}>
//                 <MaterialIcons name="payment" size={18} color="#666" />
//                 <View>
//                   <Text style={styles.detailLabel}>Razorpay Contact ID</Text>
//                   <Text style={styles.detailText}>{bankDetails.razorpay_contact_id}</Text>
//                 </View>
//               </View>
//             )}

//             {bankDetails.razorpay_fund_account_id && (
//               <View style={styles.detailItem}>
//                 <MaterialIcons name="payment" size={18} color="#666" />
//                 <View>
//                   <Text style={styles.detailLabel}>Razorpay Fund Account ID</Text>
//                   <Text style={styles.detailText}>{bankDetails.razorpay_fund_account_id}</Text>
//                 </View>
//               </View>
//             )}
//           </>
//         ) : (
//           <Text style={styles.noBankText}>No bank details added yet</Text>
//         )}
//       </View>

//       {/* Gallery Details Card */}
//       <View style={styles.card}>
//         <View style={styles.cardHeader}>
//           <MaterialIcons name="photo-library" size={20} color="#4CAF50" />
//           <Text style={styles.cardTitle}>Gallery Details</Text>
//           <TouchableOpacity 
//             style={styles.editButton}
//             onPress={openGalleryModal}
//           >
//             <Text style={styles.editButtonText}>Add</Text>
//           </TouchableOpacity>
//         </View>
        
//         {galleryDetails.length > 0 ? (
//           <FlatList
//             horizontal
//             data={galleryDetails}
//             renderItem={renderGalleryDetailItem}
//             keyExtractor={(item, index) => index.toString()}
//             contentContainerStyle={styles.galleryList}
//           />
//         ) : (
//           <Text style={styles.noBankText}>No gallery images added yet</Text>
//         )}
//       </View>

//       {/* Action Cards */}
//       <TouchableOpacity 
//         style={styles.actionCard}
//         onPress={() => navigation.navigate('ChangePassword')}
//       >
//         <View style={styles.actionIcon}>
//           <Ionicons name="key-outline" size={24} color="#4CAF50" />
//         </View>
//         <Text style={styles.actionText}>Change Password</Text>
//         <MaterialIcons name="chevron-right" size={24} color="#999" />
//       </TouchableOpacity>

//       <TouchableOpacity 
//         style={styles.actionCard}
//         onPress={() => navigation.navigate('ChangeMobile')}
//       >
//         <View style={styles.actionIcon}>
//           <Feather name="smartphone" size={24} color="#4CAF50" />
//         </View>
//         <Text style={styles.actionText}>Change Mobile Number</Text>
//         <MaterialIcons name="chevron-right" size={24} color="#999" />
//       </TouchableOpacity>

//       <TouchableOpacity 
//         style={[styles.actionCard, styles.logoutCard]}
//         onPress={logout}
//       >
//         <View style={styles.actionIcon}>
//           <MaterialIcons name="logout" size={24} color="#F44336" />
//         </View>
//         <Text style={[styles.actionText, styles.logoutText]}>Logout</Text>
//       </TouchableOpacity>

//       {/* Bank Details Modal */}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={bankModalVisible}
//         onRequestClose={() => setBankModalVisible(false)}
//       >
//         <View style={styles.centeredView}>
//           <View style={styles.modalView}>
//             <Text style={styles.modalTitle}>
//               {bankDetails ? 'Edit Bank Details' : 'Add Bank Details'}
//             </Text>
            
//             <Text style={styles.inputLabel}>Account Holder Name</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Enter account holder name"
//               value={bankFormData.account_holder_name}
//               onChangeText={(text) => handleBankInputChange('account_holder_name', text)}
//             />
            
//             <Text style={styles.inputLabel}>Bank Name</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Enter bank name"
//               value={bankFormData.bank_name}
//               onChangeText={(text) => handleBankInputChange('bank_name', text)}
//             />
            
//             <Text style={styles.inputLabel}>Account Number</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Enter account number"
//               value={bankFormData.account_number}
//               onChangeText={(text) => handleBankInputChange('account_number', text)}
//               keyboardType="numeric"
//             />
            
//             <Text style={styles.inputLabel}>IFSC Code</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Enter IFSC code"
//               value={bankFormData.ifsc_code}
//               onChangeText={(text) => handleBankInputChange('ifsc_code', text)}
//               autoCapitalize="characters"
//             />
            
//             <Text style={styles.inputLabel}>UPI ID (Optional)</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Enter UPI ID if available"
//               value={bankFormData.upi_id}
//               onChangeText={(text) => handleBankInputChange('upi_id', text)}
//             />
            
//             <View style={styles.modalButtonContainer}>
//               <Pressable
//                 style={[styles.modalButton, styles.cancelButton]}
//                 onPress={() => setBankModalVisible(false)}
//               >
//                 <Text style={styles.modalButtonText}>Cancel</Text>
//               </Pressable>
              
//               <Pressable
//                 style={[styles.modalButton, styles.submitButton]}
//                 onPress={handleSubmitBankDetails}
//               >
//                 <Text style={styles.modalButtonText}>Submit</Text>
//               </Pressable>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       {/* Profile Edit Modal */}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={profileModalVisible}
//         onRequestClose={() => setProfileModalVisible(false)}
//       >
//         <ScrollView contentContainerStyle={styles.modalScrollView}>
//           <View style={styles.centeredView}>
//             <View style={styles.modalView}>
//               <Text style={styles.modalTitle}>Edit Profile</Text>
              
//               <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
//                 {image ? (
//                   <Image source={{ uri: image }} style={styles.modalAvatar} />
//                 ) : (
//                   <View style={styles.modalDefaultAvatar}>
//                     <Ionicons name="person" size={50} color="#666" />
//                   </View>
//                 )}
//               </TouchableOpacity>
              
//               <Text style={styles.inputLabel}>Full Name</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Enter full name"
//                 value={profileFormData.full_name}
//                 onChangeText={(text) => handleProfileInputChange('full_name', text)}
//               />
              
//               <Text style={styles.inputLabel}>Email</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Enter email"
//                 value={profileFormData.email}
//                 onChangeText={(text) => handleProfileInputChange('email', text)}
//                 keyboardType="email-address"
//               />
              
//               <Text style={styles.inputLabel}>Phone Number</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Enter phone number"
//                 value={profileFormData.phone}
//                 onChangeText={(text) => handleProfileInputChange('phone', text)}
//                 keyboardType="phone-pad"
//               />
              
//               <View style={styles.pickerContainer}>
//                 <Text style={styles.pickerLabel}>User Role</Text>
//                 <View style={styles.picker}>
//                   <RNPickerSelect
//                     onValueChange={(value) => handleProfileInputChange('user_role', value)}
//                     items={[
//                       { label: 'Admin', value: 'Admin' },
//                       { label: 'Manager', value: 'Manager' },
//                       { label: 'Staff', value: 'Staff' },
//                     ]}
//                     value={profileFormData.user_role}
//                     style={pickerSelectStyles}
//                   />
//                 </View>
//               </View>
              
//               <View style={styles.pickerContainer}>
//                 <Text style={styles.pickerLabel}>Status</Text>
//                 <View style={styles.picker}>
//                   <RNPickerSelect
//                     onValueChange={(value) => handleProfileInputChange('status', value)}
//                     items={[
//                       { label: 'Active', value: 'Active' },
//                       { label: 'Inactive', value: 'Inactive' },
//                     ]}
//                     value={profileFormData.status}
//                     style={pickerSelectStyles}
//                   />
//                 </View>
//               </View>
              
//               <View style={styles.modalButtonContainer}>
//                 <Pressable
//                   style={[styles.modalButton, styles.cancelButton]}
//                   onPress={() => setProfileModalVisible(false)}
//                 >
//                   <Text style={styles.modalButtonText}>Cancel</Text>
//                 </Pressable>
                
//                 <Pressable
//                   style={[styles.modalButton, styles.submitButton]}
//                   onPress={handleSubmitProfileDetails}
//                   disabled={uploading}
//                 >
//                   {uploading ? (
//                     <ActivityIndicator color="white" />
//                   ) : (
//                     <Text style={styles.modalButtonText}>Save Changes</Text>
//                   )}
//                 </Pressable>
//               </View>
//             </View>
//           </View>
//         </ScrollView>
//       </Modal>

//       {/* Gallery Modal */}
// {/* Gallery Modal */}
// <Modal
//   animationType="slide"
//   transparent={true}
//   visible={galleryModalVisible}
//   onRequestClose={() => setGalleryModalVisible(false)}
// >
//   <View style={styles.centeredView}>
//     <View style={[styles.modalView, styles.galleryModal]}>
//       <Text style={styles.modalTitle}>Add Gallery Images</Text>
      
//       <Text style={styles.galleryInstruction}>Select Images</Text>
      
//       <TouchableOpacity 
//         style={styles.fileUploadButton}
//         onPress={pickGalleryImages}
//       >
//         <Ionicons name="cloud-upload-outline" size={24} color="#4CAF50" />
//         <Text style={styles.fileUploadText}>Choose Files</Text>
//       </TouchableOpacity>
      
//       {galleryImages.length > 0 && (
//         <View>
//           <Text style={styles.selectedImagesText}>
//             Selected Images ({galleryImages.length})
//           </Text>
//           <FlatList
//             horizontal
//             data={galleryImages}
//             renderItem={({item, index}) => (
//               <View style={styles.galleryItem}>
//                 <Image 
//                   source={{ uri: item.uri }} 
//                   style={styles.galleryImage} 
//                 />
//                 <TouchableOpacity 
//                   style={styles.removeImageButton}
//                   onPress={() => removeGalleryImage(index)}
//                 >
//                   <Ionicons name="close-circle" size={24} color="#F44336" />
//                 </TouchableOpacity>
//               </View>
//             )}
//             keyExtractor={(item, index) => index.toString()}
//             contentContainerStyle={styles.galleryList}
//           />
//         </View>
//       )}
      
//       <View style={styles.modalButtonContainer}>
//         <Pressable
//           style={[styles.modalButton, styles.cancelButton]}
//           onPress={() => setGalleryModalVisible(false)}
//         >
//           <Text style={styles.modalButtonText}>Cancel</Text>
//         </Pressable>
        
//         <Pressable
//           style={[styles.modalButton, styles.submitButton]}
//           onPress={uploadGalleryImages}
//           disabled={uploadingGallery || galleryImages.length === 0}
//         >
//           {uploadingGallery ? (
//             <ActivityIndicator color="white" />
//           ) : (
//             <Text style={styles.modalButtonText}>Upload Images</Text>
//           )}
//         </Pressable>
//       </View>
//     </View>
//   </View>
// </Modal>
//     </ScrollView>
//   );
// };



import React, { useContext, useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator, 
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
  Modal,
  Pressable,
  Platform,
  FlatList
} from 'react-native';
import axios from 'axios';
import { AuthContext } from '../../../../context/AuthContext';
import { MaterialIcons, Feather, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import RNPickerSelect from 'react-native-picker-select';

const UserProfile = ({ navigation }) => {
  const { user, salonId, logout } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [bankDetails, setBankDetails] = useState(null);
  const [galleryDetails, setGalleryDetails] = useState([]);
  const [salonData, setSalonData] = useState(null);
  const [bankModalVisible, setBankModalVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [galleryModalVisible, setGalleryModalVisible] = useState(false);
  const [image, setImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  
  const [bankFormData, setBankFormData] = useState({
    account_holder_name: '',
    bank_name: '',
    account_number: '',
    ifsc_code: '',
    upi_id: ''
  });
  
  const [profileFormData, setProfileFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    user_role: 'Admin',
    status: 'Active'
  });

  const fetchSalonData = async () => {
    try {
      if (!salonId) {
        console.error("❌ salonId is missing!");
        return;
      }

      const url = `https://yaslaservice.com:81/salons/${salonId}/`;
      console.log("🔍 Fetching Salon Data from:", url);

      const response = await axios.get(url);
      if (response.data?.data) {
        console.log("✅ Salon Data Found:", response.data.data);
        setSalonData(response.data.data);
      } else {
        console.warn("⚠️ No salon data found for salonId:", salonId);
      }
    } catch (error) {
      console.error("❌ Error fetching salon data:", error);
    }
  };

  const fetchBankDetails = async () => {
    try {
      if (!salonId) {
        console.error("❌ salonId is missing!");
        setBankDetails(null);
        return;
      }

      const url = `https://yaslaservice.com:81/bank-details/${salonId}/`;
      console.log("🔍 Fetching Bank Details from:", url);

      const response = await axios.get(url);
      if (response.data?.data) {
        console.log("✅ Bank Details Found:", response.data.data);
        setBankDetails(response.data.data);
      } else {
        console.warn("⚠️ No bank details found for salonId:", salonId);
        setBankDetails(null);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        // No bank details exist, not a real error
        console.warn(`⚠️ No bank details found for salonId: ${salonId}`);
        setBankDetails(null);
      } else {
        console.error("❌ Error fetching bank details:", error);
        Alert.alert("Error", "Failed to fetch bank details. Please try again later.");
        setBankDetails(null);
      }
    }
  };

  const fetchGalleryDetails = async () => {
    try {
      if (!salonId) {
        console.error("❌ salonId is missing!");
        setGalleryDetails([]);
        return;
      }

      const url = `https://yaslaservice.com:81/salon-galleries/?salon=${salonId}`;
      console.log("🔍 Fetching Gallery Details from:", url);

      const response = await axios.get(url);
      if (response.data?.data) {
        console.log("✅ Gallery Details Found:", response.data.data);
        setGalleryDetails(response.data.data);
      } else {
        console.warn("⚠️ No gallery details found for salonId:", salonId);
        setGalleryDetails([]);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        // No gallery details exist, not a real error
        console.warn(`⚠️ No gallery details found for salonId: ${salonId}`);
        setGalleryDetails([]);
      } else {
        console.error("❌ Error fetching gallery details:", error);
        setGalleryDetails([]);
      }
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user profile
        const userResponse = await axios.get('https://yaslaservice.com:81/users/');
        const matchedUser = userResponse.data.data.find(u => u.id === user.user_id);
        setProfileData(matchedUser || null);

        // Set profile form data
        if (matchedUser) {
          setProfileFormData({
            full_name: matchedUser.full_name || '',
            email: matchedUser.email || '',
            phone: matchedUser.phone || '',
            user_role: matchedUser.user_role || 'Admin',
            status: matchedUser.status || 'Active'
          });
          
          if (matchedUser.profile_image) {
            setImage(matchedUser.profile_image);
          }
        }

        // Fetch salon data
        await fetchSalonData();
        
        // Fetch bank details
        await fetchBankDetails();
        
        // Fetch gallery details
        await fetchGalleryDetails();
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.user_id) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [user?.user_id, refresh]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const pickGalleryImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setGalleryImages([...galleryImages, ...result.assets]);
    }
  };

  const removeGalleryImage = (index) => {
    const newImages = [...galleryImages];
    newImages.splice(index, 1);
    setGalleryImages(newImages);
  };

  const uploadImage = async () => {
    if (!image) return null;
    
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('profile_image', {
        uri: image,
        name: 'profile.jpg',
        type: 'image/jpeg'
      });

      const response = await axios.put(
        `https://yaslaservice.com:81/users/${user.user_id}/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      return response.data.data.profile_image;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const uploadGalleryImages = async () => {
    if (galleryImages.length === 0) return;
    
    setUploadingGallery(true);
    try {
      for (const asset of galleryImages) {
        const formData = new FormData();
        formData.append('salon', salonId);
        formData.append('image', {
          uri: asset.uri,
          name: 'gallery.jpg',
          type: 'image/jpeg'
        });

        await axios.post(
          'https://yaslaservice.com:81/salon-galleries/',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      }
      
      Alert.alert('Success', 'Gallery images uploaded successfully');
      setGalleryModalVisible(false);
      setGalleryImages([]);
      await fetchGalleryDetails();
    } catch (error) {
      console.error('Error uploading gallery images:', error);
      Alert.alert('Error', 'Failed to upload gallery images');
    } finally {
      setUploadingGallery(false);
    }
  };

  const handleBankInputChange = (name, value) => {
    setBankFormData({
      ...bankFormData,
      [name]: value
    });
  };

  const handleProfileInputChange = (name, value) => {
    setProfileFormData({
      ...profileFormData,
      [name]: value
    });
  };

  const handleSubmitBankDetails = async () => {
    // Validate required fields
    if (!bankFormData.account_holder_name || !bankFormData.bank_name || 
        !bankFormData.account_number || !bankFormData.ifsc_code) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    // Validate IFSC code format (4 letters + 7 alphanumeric characters)
    const ifscRegex = /^[A-Z]{4}[0-9A-Z]{7}$/;
    if (!ifscRegex.test(bankFormData.ifsc_code)) {
      Alert.alert('Error', 'Please enter a valid IFSC code (Format: XXXX0000000)');
      return;
    }

    try {
      const payload = {
        salon_id: salonId,   // required for POST
        account_holder_name: bankFormData.account_holder_name,
        bank_name: bankFormData.bank_name,
        account_number: bankFormData.account_number,
        ifsc_code: bankFormData.ifsc_code,
        upi_id: bankFormData.upi_id || '',
        razorpay_contact_id: bankFormData.razorpay_contact_id || '',
        razorpay_fund_account_id: bankFormData.razorpay_fund_account_id || '',
        is_verified: bankFormData.is_verified ?? false
      };

      const config = {
        headers: { 'Content-Type': 'application/json' }
      };

      let response;
      if (bankDetails) {
        // UPDATE existing details (PUT)
        response = await axios.put(
          `https://yaslaservice.com:81/bank-details/${salonId}/`, 
          payload,
          config
        );
      } else {
        // ADD new details (POST)
        response = await axios.post(
          'https://yaslaservice.com:81/bank-details/', 
          payload,
          config
        );
      }

      Alert.alert('Success', bankDetails ? 'Bank details updated successfully' : 'Bank details added successfully');
      setBankModalVisible(false);
      await fetchBankDetails();

    } catch (error) {
      console.error('Error saving bank details:', error);
      let errorMessage = 'Failed to save bank details';
      
      if (error.response) {
        if (error.response.data && error.response.data.errors) {
          const fieldErrors = Object.entries(error.response.data.errors)
            .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
            .join('\n');
          errorMessage = fieldErrors;
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      }
      
      Alert.alert('Error', errorMessage);
    }
  };

  const handleSubmitProfileDetails = async () => {
    try {
      let imageUrl = image !== profileData?.profile_image ? await uploadImage() : profileData?.profile_image;
      
      const payload = {
        ...profileFormData,
        profile_image: imageUrl || null
      };

      // Update user profile
      await axios.put(`https://yaslaservice.com:81/users/${user.user_id}/`, payload);
      Alert.alert('Success', 'Profile updated successfully');
      
      setProfileModalVisible(false);
      // Refresh profile data
      setRefresh(!refresh);
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const openBankEditModal = () => {
    if (bankDetails) {
      setBankFormData({
        account_holder_name: bankDetails.account_holder_name,
        bank_name: bankDetails.bank_name,
        account_number: bankDetails.account_number,
        ifsc_code: bankDetails.ifsc_code,
        upi_id: bankDetails.upi_id
      });
    } else {
      setBankFormData({
        account_holder_name: profileData.full_name || '',
        bank_name: '',
        account_number: '',
        ifsc_code: '',
        upi_id: ''
      });
    }
    setBankModalVisible(true);
  };

  const openProfileEditModal = () => {
    setProfileFormData({
      full_name: profileData.full_name || '',
      email: profileData.email || '',
      phone: profileData.phone || '',
      user_role: profileData.user_role || 'Admin',
      status: profileData.status || 'Active'
    });
    setImage(profileData.profile_image || null);
    setProfileModalVisible(true);
  };

  const openGalleryModal = () => {
    setGalleryImages([]);
    setGalleryModalVisible(true);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#2F4EAA" style={{ marginTop: 50 }} />;
  }

  if (!profileData) {
    return <Text style={{ textAlign: 'center', marginTop: 50 }}>Profile not found</Text>;
  }

  const renderGalleryItem = ({ item, index }) => (
    <View style={styles.galleryItem}>
      <Image source={{ uri: item.image }} style={styles.galleryImage} />
      <TouchableOpacity 
        style={styles.removeImageButton}
        onPress={() => removeGalleryImage(index)}
      >
        <Ionicons name="close-circle" size={24} color="#F44336" />
      </TouchableOpacity>
    </View>
  );

  const renderGalleryDetailItem = ({ item }) => (
    <View style={styles.galleryDetailItem}>
      <Image source={{ uri: item.image }} style={styles.galleryDetailImage} />
    </View>
  );
  
const handleDeleteAccount = () => {
  Alert.alert(
    "Delete Account",
    "Are you sure you want to delete your account? This action cannot be undone.",
    [
      {
        text: "Cancel",
        style: "cancel"
      },
      { 
        text: "OK", 
        onPress: () => deleteAccount()
      }
    ]
  );
};

const deleteAccount = async () => {
  try {
    setLoading(true);
    const response = await axios.delete(`https://yaslaservice.com:81/salons/${salonId}/`);
    
    if (response.status === 200 || response.status === 204) {
      Alert.alert(
        "Success", 
        "Your account has been deleted successfully.",
        [
          {
            text: "OK",
            onPress: () => {
              // Just call logout and let your app's authentication flow handle the navigation
              logout();
            }
          }
        ]
      );
    } else {
      throw new Error("Failed to delete account");
    }
  } catch (error) {
    console.error("Error deleting account:", error);
    Alert.alert("Error", "Failed to delete account. Please try again later.");
  } finally {
    setLoading(false);
  }
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          {image ? (
            <Image 
              source={{ uri: image }} 
              style={styles.avatar}
            />
          ) : (
            <View style={styles.defaultAvatar}>
              <Ionicons name="person" size={50} color="#666" />
            </View>
          )}
        </View>
        <Text style={styles.profileName}>{profileData.full_name || 'N/A'}</Text>
        <Text style={styles.profileRole}>{profileData.user_role || 'N/A'}</Text>
        <View style={styles.statusBadge}>
          <Text style={[
            styles.statusText,
            profileData.status === 'Active' ? styles.activeStatus : styles.inactiveStatus
          ]}>
            {profileData.status || 'N/A'}
          </Text>
        </View>
      </View>

      {/* Salon Information Card */}
<View style={styles.card}>
  <View style={styles.cardHeader}>
    <MaterialIcons name="store" size={20} />
    <Text style={styles.cardTitle}>Salon Information</Text>
  </View>
  
  <View style={styles.detailItem}>
    <MaterialIcons name="business" size={18} color="#666" />
    <Text style={styles.detailText}>{salonData.salon_name || 'N/A'}</Text>
  </View>
  
  <View style={styles.detailItem}>
    <MaterialIcons name="category" size={18} color="#666" />
    <Text style={styles.detailText}>
      Vendor Type: {salonData.vendor_type || 'N/A'}
    </Text>
  </View>
  
  <View style={styles.detailItem}>
    <MaterialIcons name="style" size={18} color="#666" />
    <Text style={styles.detailText}>
      Salon Category: {salonData.salon_category || 'N/A'}
    </Text>
  </View>
  
  <View style={styles.detailItem}>
    <MaterialIcons name="location-on" size={18} color="#666" />
    <Text style={styles.detailText}>{salonData.locality || 'N/A'}</Text>
  </View>
</View>

      {/* Profile Details Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MaterialIcons name="person-outline" size={20}  />
          <Text style={styles.cardTitle}>Personal Information</Text>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={openProfileEditModal}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.detailItem}>
          <Feather name="mail" size={18} color="#666" />
          <Text style={styles.detailText}>{profileData.email || 'N/A'}</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Feather name="phone" size={18} color="#666" />
          <Text style={styles.detailText}>{profileData.phone || 'N/A'}</Text>
        </View>
      </View>

      {/* Bank Details Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MaterialIcons name="account-balance" size={20} />
          <Text style={styles.cardTitle}>Bank Details</Text>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={openBankEditModal}
          >
            <Text style={styles.editButtonText}>
              {bankDetails ? 'Edit' : 'Add'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {bankDetails ? (
          <>
            <View style={styles.detailItem}>
              <MaterialIcons name="person" size={18} color="#666" />
              <View>
                <Text style={styles.detailLabel}>Account Holder Name</Text>
                <Text style={styles.detailText}>{bankDetails.account_holder_name || 'N/A'}</Text>
              </View>
            </View>
            
            <View style={styles.detailItem}>
              <MaterialIcons name="account-balance" size={18} color="#666" />
              <View>
                <Text style={styles.detailLabel}>Bank Name</Text>
                <Text style={styles.detailText}>{bankDetails.bank_name || 'N/A'}</Text>
              </View>
            </View>
            
            <View style={styles.detailItem}>
              <MaterialIcons name="credit-card" size={18} color="#666" />
              <View>
                <Text style={styles.detailLabel}>Account Number</Text>
                <Text style={styles.detailText}>{bankDetails.account_number || 'N/A'}</Text>
              </View>
            </View>
            
            <View style={styles.detailItem}>
              <MaterialIcons name="code" size={18} color="#666" />
              <View>
                <Text style={styles.detailLabel}>IFSC Code</Text>
                <Text style={styles.detailText}>{bankDetails.ifsc_code || 'N/A'}</Text>
              </View>
            </View>
            
            {bankDetails.upi_id && (
              <View style={styles.detailItem}>
                <MaterialIcons name="payment" size={18} color="#666" />
                <View>
                  <Text style={styles.detailLabel}>UPI ID</Text>
                  <Text style={styles.detailText}>{bankDetails.upi_id}</Text>
                </View>
              </View>
            )}

            {bankDetails.razorpay_contact_id && (
              <View style={styles.detailItem}>
                <MaterialIcons name="payment" size={18} color="#666" />
                <View>
                  <Text style={styles.detailLabel}>Razorpay Contact ID</Text>
                  <Text style={styles.detailText}>{bankDetails.razorpay_contact_id}</Text>
                </View>
              </View>
            )}

            {bankDetails.razorpay_fund_account_id && (
              <View style={styles.detailItem}>
                <MaterialIcons name="payment" size={18} color="#666" />
                <View>
                  <Text style={styles.detailLabel}>Razorpay Fund Account ID</Text>
                  <Text style={styles.detailText}>{bankDetails.razorpay_fund_account_id}</Text>
                </View>
              </View>
            )}
          </>
        ) : (
          <Text style={styles.noBankText}>No bank details added yet</Text>
        )}
      </View>

      {/* Gallery Details Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MaterialIcons name="photo-library" size={20} />
          <Text style={styles.cardTitle}>Gallery Details</Text>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={openGalleryModal}
          >
            <Text style={styles.editButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
        
        {galleryDetails.length > 0 ? (
          <FlatList
            horizontal
            data={galleryDetails}
            renderItem={renderGalleryDetailItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.galleryList}
          />
        ) : (
          <Text style={styles.noBankText}>No gallery images added yet</Text>
        )}
      </View>

      {/* Action Cards */}
      <TouchableOpacity 
        style={styles.actionCard}
        // onPress={() => navigation.navigate('ChangePassword')}
      >
        <View style={styles.actionIcon}>
          <Ionicons name="key-outline" size={24} />
        </View>
        <Text style={styles.actionText}>Change Password</Text>
        <MaterialIcons name="chevron-right" size={24} color="#999" />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.actionCard}
        // onPress={() => navigation.navigate('ChangeMobile')}
      >
        <View style={styles.actionIcon}>
          <Feather name="smartphone" size={24} />
        </View>
        <Text style={styles.actionText}>Change Mobile Number</Text>
        <MaterialIcons name="chevron-right" size={24} color="#999" />
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.actionCard, styles.logoutCard]}
        onPress={logout}
      >
        <View style={styles.actionIcon}>
          <MaterialIcons name="logout" size={24} color="#F44336" />
        </View>
        <Text style={[styles.actionText, styles.logoutText]}>Logout</Text>
      </TouchableOpacity>

           {/* Delete Account Card */}
      <TouchableOpacity 
        style={[styles.actionCard, styles.deleteCard]}
        onPress={handleDeleteAccount}
      >
        <View style={styles.actionIcon}>
          <MaterialIcons name="delete-outline" size={24} color="#F44336" />
        </View>
        <Text style={[styles.actionText, styles.deleteText]}>Delete Your Account</Text>
      </TouchableOpacity>

      {/* Bank Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={bankModalVisible}
        onRequestClose={() => setBankModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>
              {bankDetails ? 'Edit Bank Details' : 'Add Bank Details'}
            </Text>
            
            <Text style={styles.inputLabel}>Account Holder Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter account holder name"
              value={bankFormData.account_holder_name}
              onChangeText={(text) => handleBankInputChange('account_holder_name', text)}
            />
            
            <Text style={styles.inputLabel}>Bank Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter bank name"
              value={bankFormData.bank_name}
              onChangeText={(text) => handleBankInputChange('bank_name', text)}
            />
            
            <Text style={styles.inputLabel}>Account Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter account number"
              value={bankFormData.account_number}
              onChangeText={(text) => handleBankInputChange('account_number', text)}
              keyboardType="numeric"
            />
            
            <Text style={styles.inputLabel}>IFSC Code</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter IFSC code"
              value={bankFormData.ifsc_code}
              onChangeText={(text) => handleBankInputChange('ifsc_code', text)}
              autoCapitalize="characters"
            />
            
            <Text style={styles.inputLabel}>UPI ID (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter UPI ID if available"
              value={bankFormData.upi_id}
              onChangeText={(text) => handleBankInputChange('upi_id', text)}
            />
            
            <View style={styles.modalButtonContainer}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setBankModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </Pressable>
              
              <Pressable
                style={[styles.modalButton, styles.submitButton]}
                onPress={handleSubmitBankDetails}
              >
                <Text style={styles.modalButtonText}>Submit</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Profile Edit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={profileModalVisible}
        onRequestClose={() => setProfileModalVisible(false)}
      >
        <ScrollView contentContainerStyle={styles.modalScrollView}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              
              <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
                {image ? (
                  <Image source={{ uri: image }} style={styles.modalAvatar} />
                ) : (
                  <View style={styles.modalDefaultAvatar}>
                    <Ionicons name="person" size={50} color="#666" />
                  </View>
                )}
              </TouchableOpacity>
              
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter full name"
                value={profileFormData.full_name}
                onChangeText={(text) => handleProfileInputChange('full_name', text)}
              />
              
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter email"
                value={profileFormData.email}
                onChangeText={(text) => handleProfileInputChange('email', text)}
                keyboardType="email-address"
              />
              
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter phone number"
                value={profileFormData.phone}
                onChangeText={(text) => handleProfileInputChange('phone', text)}
                keyboardType="phone-pad"
              />
              
              <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>User Role</Text>
                <View style={styles.picker}>
                  <RNPickerSelect
                    onValueChange={(value) => handleProfileInputChange('user_role', value)}
                    items={[
                      { label: 'Admin', value: 'Admin' },
                      { label: 'Manager', value: 'Manager' },
                      { label: 'Staff', value: 'Staff' },
                    ]}
                    value={profileFormData.user_role}
                    style={pickerSelectStyles}
                  />
                </View>
              </View>
              
              <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>Status</Text>
                <View style={styles.picker}>
                  <RNPickerSelect
                    onValueChange={(value) => handleProfileInputChange('status', value)}
                    items={[
                      { label: 'Active', value: 'Active' },
                      { label: 'Inactive', value: 'Inactive' },
                    ]}
                    value={profileFormData.status}
                    style={pickerSelectStyles}
                  />
                </View>
              </View>
              
              <View style={styles.modalButtonContainer}>
                <Pressable
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setProfileModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </Pressable>
                
                <Pressable
                  style={[styles.modalButton, styles.submitButton]}
                  onPress={handleSubmitProfileDetails}
                  disabled={uploading}
                >
                  {uploading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.modalButtonText}>Save Changes</Text>
                  )}
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </Modal>

      {/* Gallery Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={galleryModalVisible}
        onRequestClose={() => setGalleryModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={[styles.modalView, styles.galleryModal]}>
            <Text style={styles.modalTitle}>Add Gallery Images</Text>
            
            <Text style={styles.galleryInstruction}>Select Images</Text>
            
            <TouchableOpacity 
              style={styles.fileUploadButton}
              onPress={pickGalleryImages}
            >
              <Ionicons name="cloud-upload-outline" size={24} />
              <Text style={styles.fileUploadText}>Choose Files</Text>
            </TouchableOpacity>
            
            {galleryImages.length > 0 && (
              <View>
                <Text style={styles.selectedImagesText}>
                  Selected Images ({galleryImages.length})
                </Text>
                <FlatList
                  horizontal
                  data={galleryImages}
                  renderItem={({item, index}) => (
                    <View style={styles.galleryItem}>
                      <Image 
                        source={{ uri: item.uri }} 
                        style={styles.galleryImage} 
                      />
                      <TouchableOpacity 
                        style={styles.removeImageButton}
                        onPress={() => removeGalleryImage(index)}
                      >
                        <Ionicons name="close-circle" size={24} color="#F44336" />
                      </TouchableOpacity>
                    </View>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                  contentContainerStyle={styles.galleryList}
                />
              </View>
            )}
            
            <View style={styles.modalButtonContainer}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setGalleryModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </Pressable>
              
              <Pressable
                style={[styles.modalButton, styles.submitButton]}
                onPress={uploadGalleryImages}
                disabled={uploadingGallery || galleryImages.length === 0}
              >
                {uploadingGallery ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.modalButtonText}>Upload Images</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
  },
});

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    paddingBottom: 30,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  defaultAvatar: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileName: {
    fontSize: 24,
    fontFamily: 'Inter_600SemiBold',
    color: '#333',
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#666',
    marginBottom: 8,
  },
  statusBadge: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    textTransform: 'capitalize',
  },
  activeStatus: {
    color: '#4CAF50',
  },
  inactiveStatus: {
    color: '#F44336',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    marginLeft: 8,
    color: '#333',
    flex: 1,
  },
  editButton: {
    backgroundColor: '#2F4EAA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#666',
    marginLeft: 12,
    marginBottom: 2,
  },
  detailText: {
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#333',
  },
  noBankText: {
    textAlign: 'center',
    color: '#666',
    marginVertical: 10,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: '#333',
  },
  logoutCard: {
    marginTop: 8,
    marginBottom: 12,
  },
  logoutText: {
    color: '#F44336',
    fontFamily: 'Inter_500Medium',
  },
  // Modal styles
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalScrollView: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  modalView: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  galleryModal: {
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#666',
    marginBottom: 5,
    marginLeft: 5,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    borderRadius: 8,
    padding: 12,
    elevation: 2,
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#F44336',
  },
  submitButton: {
    backgroundColor: '#2F4EAA',
  },
  modalButtonText: {
    color: 'white',
    fontFamily: 'Inter_600SemiBold',
    textAlign: 'center',
    fontSize: 16,
  },
  imagePicker: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  modalDefaultAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePickerText: {
    marginTop: 8,
    color: '#666',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  pickerContainer: {
    marginBottom: 15,
  },
  pickerLabel: {
    marginBottom: 8,
    color: '#333',
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  galleryInstruction: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  fileUploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    marginBottom: 20,
  },
  fileUploadText: {
    marginLeft: 10,
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
  },
  selectedImagesText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 10,
    color: '#333',
  },
  galleryItem: {
    position: 'relative',
    marginRight: 10,
    marginBottom: 10,
  },
  galleryImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  galleryList: {
    paddingVertical: 10,
  },
  deleteCard: {
    marginBottom: 12,
  },
  deleteText: {
    color: '#F44336',
    fontFamily: 'Inter_500Medium',
  },
});

export default UserProfile;