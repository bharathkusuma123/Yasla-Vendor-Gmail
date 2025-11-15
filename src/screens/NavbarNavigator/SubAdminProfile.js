// // import React, { Component } from 'react'
// // import { Text, View } from 'react-native'

// // export class SubAdminProfile extends Component {
// //   render() {
// //     return (
// //       <View>
// //         <Text> SubAdminProfile </Text>
// //       </View>
// //     )
// //   }
// // }

// // export default SubAdminProfile











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
// import { AuthContext } from '../../context/AuthContext';
// import { MaterialIcons, Feather, Ionicons } from '@expo/vector-icons';

// const SubAdminProfile = ({ navigation }) => {
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

// export default SubAdminProfile;




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
import { AuthContext } from '../../context/AuthContext';
import { MaterialIcons, Feather, Ionicons } from '@expo/vector-icons';

const SubAdminProfile = ({ navigation }) => {
  const { user, logout, salonId } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [salonData, setSalonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [bankDetails, setBankDetails] = useState(null);
  const [bankModalVisible, setBankModalVisible] = useState(false);
  
  const [bankFormData, setBankFormData] = useState({
    account_holder_name: '',
    bank_name: '',
    account_number: '',
    ifsc_code: '',
    upi_id: ''
  });

  // Fetch salon data by ID
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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('https://yaslaservice.com:81/users/');
        const matchedUser = response.data.data.find(u => u.id === user.user_id);
        setProfileData(matchedUser || null);
        
        // Fetch salon data
        await fetchSalonData();
        
        // Fetch bank details if salonId exists
        if (salonId) {
          await fetchBankDetails();
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

  const handleBankInputChange = (name, value) => {
    setBankFormData({
      ...bankFormData,
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

  if (loading) {
    return <ActivityIndicator size="large" color="#2F4EAA" style={{ marginTop: 50 }} />;
  }

  if (!profileData) {
    return <Text style={{ textAlign: 'center', marginTop: 50 }}>Profile not found</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Full Profile Card */}
      <View style={styles.fullCard}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            {profileData.profile_image ? (
              <Image source={{ uri: profileData.profile_image }} style={styles.avatar} />
            ) : (
              <View style={styles.defaultAvatar}>
                <Ionicons name="person" size={50} color="#666" />
              </View>
            )}
          </View>
          <Text style={styles.profileName}>{profileData.full_name || 'N/A'}</Text>
          <Text style={styles.profileRole}>{profileData.user_role || 'N/A'}</Text>
          <View style={styles.statusBadge}>
            <Text
              style={[
                styles.statusText,
                profileData.status === 'Active' ? styles.activeStatus : styles.inactiveStatus
              ]}
            >
              {profileData.status || 'N/A'}
            </Text>
          </View>
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <View style={styles.infoRow}>
            <Feather name="mail" size={20} color="#666" />
            <Text style={styles.detailText}>{profileData.email || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Feather name="phone" size={20} color="#666" />
            <Text style={styles.detailText}>{profileData.phone || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="store" size={20} color="#666" />
            <Text style={styles.detailText}>Salon: {salonData ? salonData.salon_name : 'N/A'}</Text>
          </View>
        </View>

        {/* Bank Details Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="account-balance" size={20} color="#2F4EAA" />
            <Text style={styles.sectionTitle}>Bank Details</Text>
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
              <View style={styles.infoRow}>
                <MaterialIcons name="person" size={20} color="#666" />
                <View>
                  <Text style={styles.detailLabel}>Account Holder Name</Text>
                  <Text style={styles.detailText}>{bankDetails.account_holder_name || 'N/A'}</Text>
                </View>
              </View>
              
              <View style={styles.infoRow}>
                <MaterialIcons name="account-balance" size={20} color="#666" />
                <View>
                  <Text style={styles.detailLabel}>Bank Name</Text>
                  <Text style={styles.detailText}>{bankDetails.bank_name || 'N/A'}</Text>
                </View>
              </View>
              
              <View style={styles.infoRow}>
                <MaterialIcons name="credit-card" size={20} color="#666" />
                <View>
                  <Text style={styles.detailLabel}>Account Number</Text>
                  <Text style={styles.detailText}>{bankDetails.account_number || 'N/A'}</Text>
                </View>
              </View>
              
              <View style={styles.infoRow}>
                <MaterialIcons name="code" size={20} color="#666" />
                <View>
                  <Text style={styles.detailLabel}>IFSC Code</Text>
                  <Text style={styles.detailText}>{bankDetails.ifsc_code || 'N/A'}</Text>
                </View>
              </View>
              
              {bankDetails.upi_id && (
                <View style={styles.infoRow}>
                  <MaterialIcons name="payment" size={20} color="#666" />
                  <View>
                    <Text style={styles.detailLabel}>UPI ID</Text>
                    <Text style={styles.detailText}>{bankDetails.upi_id}</Text>
                  </View>
                </View>
              )}
            </>
          ) : (
            <Text style={styles.noBankText}>No bank details added yet</Text>
          )}
        </View>

        {/* Action Options */}
        <TouchableOpacity style={styles.actionRow}>
          <View style={styles.iconCircle}>
            <Ionicons name="key-outline" size={22} color="#2F4EAA" />
          </View>
          <Text style={styles.actionText}>Change Password</Text>
          <MaterialIcons name="chevron-right" size={24} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionRow}>
          <View style={styles.iconCircle}>
            <Feather name="smartphone" size={22} color="#2F4EAA" />
          </View>
          <Text style={styles.actionText}>Change Mobile Number</Text>
          <MaterialIcons name="chevron-right" size={24} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutRow} onPress={logout}>
          <View style={styles.iconCircle}>
            <MaterialIcons name="logout" size={22} color="#F44336" />
          </View>
          <Text style={[styles.actionText, styles.logoutText]}>Logout</Text>
        </TouchableOpacity>
      </View>

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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    paddingBottom: 30,
  },
  fullCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 10,
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
  section: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#333',
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginLeft: 12,
    marginBottom: 2,
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
  editButton: {
    backgroundColor: '#2F4EAA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
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
  inputLabel: {
    fontSize: 14,
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
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default SubAdminProfile;