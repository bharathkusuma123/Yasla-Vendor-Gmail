

// import React, { useContext, useEffect, useState } from 'react';
// import { 
//   View, 
//   Text, 
//   StyleSheet, 
//   ScrollView, 
//   ActivityIndicator, 
//   TouchableOpacity,
//   Image
// } from 'react-native';
// import axios from 'axios';
// import { AuthContext } from '../../../../context/AuthContext';
// import { MaterialIcons, Feather, Ionicons } from '@expo/vector-icons';

// const UserProfile = ({ navigation }) => {
//   const { user, logout } = useContext(AuthContext);
//   const [profileData, setProfileData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [refresh, setRefresh] = useState(false);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const response = await axios.get('https://yaslaservice.com:81/users/');
//         const matchedUser = response.data.data.find(u => u.id === user.user_id);
//         setProfileData(matchedUser || null);
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

//   if (loading) {
//     return <ActivityIndicator size="large" color="#4CAF50" style={{ marginTop: 50 }} />;
//   }

//   if (!profileData) {
//     return <Text style={{ textAlign: 'center', marginTop: 50 }}>Profile not found</Text>;
//   }

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       {/* Profile Header */}
//       <View style={styles.profileHeader}>
//        <View style={styles.avatarContainer}>
//   {profileData.profile_image ? (
//     <Image 
//       source={{ uri: profileData.profile_image }} 
//       style={styles.avatar}
//     />
//   ) : (
//     <View style={styles.defaultAvatar}>
//       <Ionicons name="person" size={50} color="#666" />
//     </View>
//   )}
// </View>
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

//       {/* Action Cards */}
//       <TouchableOpacity 
//         style={styles.actionCard}
//         // onPress={() => navigation.navigate('ChangePassword')}
//       >
//         <View style={styles.actionIcon}>
//           <Ionicons name="key-outline" size={24} color="#4CAF50" />
//         </View>
//         <Text style={styles.actionText}>Change Password</Text>
//         <MaterialIcons name="chevron-right" size={24} color="#999" />
//       </TouchableOpacity>

//       <TouchableOpacity 
//         style={styles.actionCard}
//         // onPress={() => navigation.navigate('ChangeMobile')}
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
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 16,
//     backgroundColor: '#f5f5f5',
//   },
//   profileHeader: {
//     alignItems: 'center',
//     marginBottom: 24,
//     paddingTop: 20,
//   },
//   avatarContainer: {
//   width: 100,
//   height: 100,
//   borderRadius: 50,
//   backgroundColor: '#e0e0e0',
//   justifyContent: 'center',
//   alignItems: 'center',
//   marginBottom: 16,
//   overflow: 'hidden',
// },
// avatar: {
//   width: '100%',
//   height: '100%',
// },
// defaultAvatar: {
//   width: '100%',
//   height: '100%',
//   backgroundColor: '#e0e0e0',
//   justifyContent: 'center',
//   alignItems: 'center',
// },
//   profileName: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 4,
//   },
//   profileRole: {
//     fontSize: 16,
//     color: '#666',
//     marginBottom: 8,
//   },
//   statusBadge: {
//     backgroundColor: '#e0e0e0',
//     paddingHorizontal: 12,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   statusText: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     textTransform: 'capitalize',
//   },
//   activeStatus: {
//     color: '#4CAF50',
//   },
//   inactiveStatus: {
//     color: '#F44336',
//   },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//     paddingBottom: 12,
//   },
//   cardTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginLeft: 8,
//     color: '#333',
//   },
//   detailItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   detailText: {
//     marginLeft: 12,
//     fontSize: 16,
//     color: '#333',
//   },
//   actionCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   actionIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#E8F5E9',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 16,
//   },
//   actionText: {
//     flex: 1,
//     fontSize: 16,
//     color: '#333',
//   },
//   logoutCard: {
//     marginTop: 8,
//   },
//   logoutText: {
//     color: '#F44336',
//   },
// });

// export default UserProfile;











// import React, { useContext, useEffect, useState } from 'react';
// import { 
//   View, 
//   Text, 
//   StyleSheet, 
//   ScrollView, 
//   ActivityIndicator, 
//   TouchableOpacity,
//   Image,
//   Alert
// } from 'react-native';
// import axios from 'axios';
// import { AuthContext } from '../../../../context/AuthContext';
// import { MaterialIcons, Feather, Ionicons } from '@expo/vector-icons';

// const UserProfile = ({ navigation }) => {
//   const { user, logout } = useContext(AuthContext);
//   const [profileData, setProfileData] = useState(null);
//   const [bankDetails, setBankDetails] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [refresh, setRefresh] = useState(false);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         // Fetch user profile
//         const userResponse = await axios.get('https://yaslaservice.com:81/users/');
//         const matchedUser = userResponse.data.data.find(u => u.id === user.user_id);
//         setProfileData(matchedUser || null);

//         // Fetch bank details if salon_id exists
//         if (matchedUser?.salon) {
//           try {
//             const bankResponse = await axios.get('https://yaslaservice.com:81/bank-details/');
//             const matchedBankDetails = bankResponse.data.data.find(b => b.salon_id === matchedUser.salon);
//             setBankDetails(matchedBankDetails || null);
//           } catch (bankError) {
//             console.error('Error fetching bank details:', bankError);
//             setBankDetails(null);
//           }
//         }
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

//   const handleAddOrUpdateBankDetails = () => {
//     if (!profileData?.salon) {
//       Alert.alert('Error', 'Salon ID is required to add bank details');
//       return;
//     }

// navigation.navigate('BankDetailsForm', {
//   salonId: profileData.salon,
//   existingBankDetails: null,  // Always pass null to force add-only mode
//   onSaveSuccess: () => setRefresh(!refresh)
// });
//   };

//   if (loading) {
//     return <ActivityIndicator size="large" color="#4CAF50" style={{ marginTop: 50 }} />;
//   }

//   if (!profileData) {
//     return <Text style={{ textAlign: 'center', marginTop: 50 }}>Profile not found</Text>;
//   }

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       {/* Profile Header */}
//       <View style={styles.profileHeader}>
//         <View style={styles.avatarContainer}>
//           {profileData.profile_image ? (
//             <Image 
//               source={{ uri: profileData.profile_image }} 
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
//         {!bankDetails && (
//   <TouchableOpacity 
//     style={styles.editButton}
//     onPress={handleAddOrUpdateBankDetails}
//   >
//     <Text style={styles.editButtonText}>Add</Text>
//   </TouchableOpacity>
// )}

//         </View>
        
//         {bankDetails ? (
//           <>
//             <View style={styles.detailItem}>
//               <MaterialIcons name="account-circle" size={18} color="#666" />
//               <Text style={styles.detailText}>{bankDetails.account_holder_name || 'N/A'}</Text>
//             </View>
            
//             <View style={styles.detailItem}>
//               <MaterialIcons name="account-balance" size={18} color="#666" />
//               <Text style={styles.detailText}>{bankDetails.bank_name || 'N/A'}</Text>
//             </View>
            
//             <View style={styles.detailItem}>
//               <MaterialIcons name="credit-card" size={18} color="#666" />
//               <Text style={styles.detailText}>{bankDetails.account_number || 'N/A'}</Text>
//             </View>
            
//             <View style={styles.detailItem}>
//               <MaterialIcons name="code" size={18} color="#666" />
//               <Text style={styles.detailText}>{bankDetails.ifsc_code || 'N/A'}</Text>
//             </View>
            
//             <View style={styles.detailItem}>
//               <MaterialIcons name="payment" size={18} color="#666" />
//               <Text style={styles.detailText}>{bankDetails.upi_id || 'N/A'}</Text>
//             </View>
//           </>
//         ) : (
//           <View style={styles.noBankDetails}>
//             <Text style={styles.noBankDetailsText}>No bank details added yet</Text>
//             <TouchableOpacity 
//               style={styles.addButton}
//               onPress={handleAddOrUpdateBankDetails}
//             >
//               <Text style={styles.addButtonText}>Add Bank Details</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       </View>

//       {/* Action Cards */}
//       <TouchableOpacity 
//         style={styles.actionCard}
//         // onPress={() => navigation.navigate('ChangePassword')}
//       >
//         <View style={styles.actionIcon}>
//           <Ionicons name="key-outline" size={24} color="#4CAF50" />
//         </View>
//         <Text style={styles.actionText}>Change Password</Text>
//         <MaterialIcons name="chevron-right" size={24} color="#999" />
//       </TouchableOpacity>

//       <TouchableOpacity 
//         style={styles.actionCard}
//         // onPress={() => navigation.navigate('ChangeMobile')}
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
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 16,
//     backgroundColor: '#f5f5f5',
//   },
//   profileHeader: {
//     alignItems: 'center',
//     marginBottom: 24,
//     paddingTop: 20,
//   },
//   avatarContainer: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     backgroundColor: '#e0e0e0',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 16,
//     overflow: 'hidden',
//   },
//   avatar: {
//     width: '100%',
//     height: '100%',
//   },
//   defaultAvatar: {
//     width: '100%',
//     height: '100%',
//     backgroundColor: '#e0e0e0',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   profileName: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 4,
//   },
//   profileRole: {
//     fontSize: 16,
//     color: '#666',
//     marginBottom: 8,
//   },
//   statusBadge: {
//     backgroundColor: '#e0e0e0',
//     paddingHorizontal: 12,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   statusText: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     textTransform: 'capitalize',
//   },
//   activeStatus: {
//     color: '#4CAF50',
//   },
//   inactiveStatus: {
//     color: '#F44336',
//   },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//     paddingBottom: 12,
//   },
//   cardTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginLeft: 8,
//     color: '#333',
//     flex: 1,
//   },
//   editButton: {
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     backgroundColor: '#E8F5E9',
//     borderRadius: 6,
//   },
//   editButtonText: {
//     color: '#4CAF50',
//     fontWeight: 'bold',
//   },
//   detailItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   detailText: {
//     marginLeft: 12,
//     fontSize: 16,
//     color: '#333',
//   },
//   noBankDetails: {
//     alignItems: 'center',
//     paddingVertical: 16,
//   },
//   noBankDetailsText: {
//     color: '#666',
//     marginBottom: 16,
//   },
//   addButton: {
//     backgroundColor: '#4CAF50',
//     paddingHorizontal: 24,
//     paddingVertical: 10,
//     borderRadius: 6,
//   },
//   addButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   actionCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   actionIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#E8F5E9',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 16,
//   },
//   actionText: {
//     flex: 1,
//     fontSize: 16,
//     color: '#333',
//   },
//   logoutCard: {
//     marginTop: 8,
//   },
//   logoutText: {
//     color: '#F44336',
//   },
// });

// export default UserProfile;





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
  Pressable
} from 'react-native';
import axios from 'axios';
import { AuthContext } from '../../../../context/AuthContext';
import { MaterialIcons, Feather, Ionicons } from '@expo/vector-icons';

const UserProfile = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [bankDetails, setBankDetails] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    account_holder_name: '',
    bank_name: '',
    account_number: '',
    ifsc_code: '',
    upi_id: ''
  });

  const fetchBankDetails = async (salonId) => {
    try {
      const response = await axios.get(`https://yaslaservice.com:81/bank-details/?salon_id=${salonId}`);
      if (response.data.data && response.data.data.length > 0) {
        setBankDetails(response.data.data[0]);
      } else {
        setBankDetails(null);
      }
    } catch (error) {
      console.error('Error fetching bank details:', error);
      setBankDetails(null);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user profile
        const userResponse = await axios.get('https://yaslaservice.com:81/users/');
        const matchedUser = userResponse.data.data.find(u => u.id === user.user_id);
        setProfileData(matchedUser || null);

        // Fetch bank details if user has a salon
        if (matchedUser?.salon) {
          await fetchBankDetails(matchedUser.salon);
        }
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

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmitBankDetails = async () => {
    if (!profileData?.salon) {
      Alert.alert('Error', 'Salon information not available');
      return;
    }

    try {
      const payload = {
        salon_id: profileData.salon,
        ...formData
      };

      if (bankDetails) {
        // Update existing bank details
        await axios.put(`https://yaslaservice.com:81/bank-details/${bankDetails.id}/`, payload);
        Alert.alert('Success', 'Bank details updated successfully');
      } else {
        // Create new bank details
        await axios.post('https://yaslaservice.com:81/bank-details/', payload);
        Alert.alert('Success', 'Bank details added successfully');
      }

      setModalVisible(false);
      // Refresh bank details specifically
      await fetchBankDetails(profileData.salon);
    } catch (error) {
      console.error('Error saving bank details:', error);
      Alert.alert('Error', 'Failed to save bank details');
    }
  };

  const openEditModal = () => {
    if (bankDetails) {
      setFormData({
        account_holder_name: bankDetails.account_holder_name,
        bank_name: bankDetails.bank_name,
        account_number: bankDetails.account_number,
        ifsc_code: bankDetails.ifsc_code,
        upi_id: bankDetails.upi_id
      });
    } else {
      setFormData({
        account_holder_name: profileData.full_name || '',
        bank_name: '',
        account_number: '',
        ifsc_code: '',
        upi_id: ''
      });
    }
    setModalVisible(true);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#4CAF50" style={{ marginTop: 50 }} />;
  }

  if (!profileData) {
    return <Text style={{ textAlign: 'center', marginTop: 50 }}>Profile not found</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          {profileData.profile_image ? (
            <Image 
              source={{ uri: profileData.profile_image }} 
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

      {/* Profile Details Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MaterialIcons name="person-outline" size={20} color="#4CAF50" />
          <Text style={styles.cardTitle}>Personal Information</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Feather name="mail" size={18} color="#666" />
          <Text style={styles.detailText}>{profileData.email || 'N/A'}</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Feather name="phone" size={18} color="#666" />
          <Text style={styles.detailText}>{profileData.phone || 'N/A'}</Text>
        </View>
        
        <View style={styles.detailItem}>
          <MaterialIcons name="store" size={18} color="#666" />
          <Text style={styles.detailText}>Salon ID: {profileData.salon || 'N/A'}</Text>
        </View>
      </View>

      {/* Bank Details Card */}
   
      {/* Bank Details Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MaterialIcons name="account-balance" size={20} color="#4CAF50" />
          <Text style={styles.cardTitle}>Bank Details</Text>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={openEditModal}
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
              <Text style={styles.detailText}>{bankDetails.account_holder_name || 'N/A'}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <MaterialIcons name="account-balance" size={18} color="#666" />
              <Text style={styles.detailText}>{bankDetails.bank_name || 'N/A'}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <MaterialIcons name="credit-card" size={18} color="#666" />
              <Text style={styles.detailText}>{bankDetails.account_number || 'N/A'}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <MaterialIcons name="code" size={18} color="#666" />
              <Text style={styles.detailText}>{bankDetails.ifsc_code || 'N/A'}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <MaterialIcons name="payment" size={18} color="#666" />
              <Text style={styles.detailText}>{bankDetails.upi_id || 'N/A'}</Text>
            </View>
          </>
        ) : (
          <Text style={styles.noBankText}>No bank details added yet</Text>
        )}
      </View>

      {/* Action Cards */}
      <TouchableOpacity 
        style={styles.actionCard}
        onPress={() => navigation.navigate('ChangePassword')}
      >
        <View style={styles.actionIcon}>
          <Ionicons name="key-outline" size={24} color="#4CAF50" />
        </View>
        <Text style={styles.actionText}>Change Password</Text>
        <MaterialIcons name="chevron-right" size={24} color="#999" />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.actionCard}
        onPress={() => navigation.navigate('ChangeMobile')}
      >
        <View style={styles.actionIcon}>
          <Feather name="smartphone" size={24} color="#4CAF50" />
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

       {/* Bank Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>
              {bankDetails ? 'Edit Bank Details' : 'Add Bank Details'}
            </Text>
            
            <TextInput
              style={styles.input}
              placeholder="Account Holder Name"
              value={formData.account_holder_name}
              onChangeText={(text) => handleInputChange('account_holder_name', text)}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Bank Name"
              value={formData.bank_name}
              onChangeText={(text) => handleInputChange('bank_name', text)}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Account Number"
              value={formData.account_number}
              onChangeText={(text) => handleInputChange('account_number', text)}
              keyboardType="numeric"
            />
            
            <TextInput
              style={styles.input}
              placeholder="IFSC Code"
              value={formData.ifsc_code}
              onChangeText={(text) => handleInputChange('ifsc_code', text)}
            />
            
            <TextInput
              style={styles.input}
              placeholder="UPI ID"
              value={formData.upi_id}
              onChangeText={(text) => handleInputChange('upi_id', text)}
            />
            
            <View style={styles.modalButtonContainer}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
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
    </ScrollView>
  );
};

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
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 16,
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
    fontWeight: 'bold',
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
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#333',
    flex: 1,
  },
  editButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  noBankText: {
    textAlign: 'center',
    color: '#666',
    marginVertical: 10,
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
    color: '#333',
  },
  logoutCard: {
    marginTop: 8,
  },
  logoutText: {
    color: '#F44336',
  },
  // Modal styles
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
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
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
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
    backgroundColor: '#4CAF50',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default UserProfile;