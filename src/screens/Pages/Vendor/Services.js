


// import React, { useContext, useEffect, useState } from 'react';
// import axios from 'axios';
// import { AuthContext } from '../../../context/AuthContext';
// import { 
//   View, 
//   Text, 
//   StyleSheet, 
//   ActivityIndicator, 
//   TouchableOpacity, 
//   ScrollView,
//   TextInput,
//   Button,
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
//   Keyboard
// } from 'react-native';
// import styles from './ServicesStyles'; 
// import AddCategoryModal from './AddCategoryModal';
// import AddServiceModal from './AddServiceModal'; 
// import { Checkbox } from 'react-native-paper';
// import { Picker } from '@react-native-picker/picker';
// // Adjust path if needed

// const Services = () => {
//   const { user } = useContext(AuthContext);
// const [profileData, setProfileData] = useState(null);
//   const [categories, setCategories] = useState([]);
//   const [services, setServices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [servicesLoading, setServicesLoading] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [selectedService, setSelectedService] = useState(null);
//   const [serviceDetails, setServiceDetails] = useState(null);
//   const [formData, setFormData] = useState({
//   is_available: true,
//   cost: '',
//   completion_time: '00:30:00'
// });
//   const [detailsLoading, setDetailsLoading] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [salonName, setSalonName] = useState(''); // This should come from logged in user
// const [showCategoryModal, setShowCategoryModal] = useState(false);
// const [showServiceModal, setShowServiceModal] = useState(false);

//   const fetchCategories = async () => {
//     try {
//       const response = await fetch('https://yaslaservice.com:81/service-categories/');
//       const result = await response.json();
//       if (result.status === "success") {
//         setCategories(result.data);
//       } else {
//         console.error('Error in response:', result.message);
//       }
//     } catch (error) {
//       console.error('Error fetching categories:', error);
//     } finally {
//       setLoading(false);
//     }
//   };



//   useEffect(() => {
//   const fetchUserData = async () => {
//     try {
//       const response = await axios.get('https://yaslaservice.com:81/users/');
//       const matchedUser = response.data.data.find(u => u.id === user.user_id);
//       setProfileData(matchedUser || null);
//     } catch (error) {
//       console.error('Error fetching user profile:', error);
//     }
//   };

//   if (user?.user_id) {
//     fetchUserData();
//   }
// }, [user?.user_id]);

//   const fetchServices = async (categoryId) => {
//     setServicesLoading(true);
//     try {
//       const response = await fetch('https://yaslaservice.com:81/services/');
//       const result = await response.json();
//       if (result.status === "success") {
//         const filteredServices = result.data.filter(
//           service => service.category.id === categoryId
//         );
//         setServices(filteredServices);
//       } else {
//         console.error('Error in response:', result.message);
//       }
//     } catch (error) {
//       console.error('Error fetching services:', error);
//     } finally {
//       setServicesLoading(false);
//     }
//   };

//  const fetchServiceDetails = async (serviceId) => {
//   setDetailsLoading(true);
//   try {
//     // Static data instead of API call
//     const staticData = {
//       is_available: true,
//       cost: '',
//       completion_time: '00:30:00'
//     };
    
//     setServiceDetails(staticData);
//     setFormData(staticData);
//   } catch (error) {
//     console.error('Error in fetchServiceDetails:', error);
//   } finally {
//     setDetailsLoading(false);
//   }
// };


// const saveServiceAvailability = async () => {
//   if (!formData.cost || !formData.completion_time) {
//     Alert.alert('Error', 'Please fill all fields');
//     return;
//   }

//   if (!selectedService || !profileData?.salon) {
//     Alert.alert('Error', 'Missing service or salon data');
//     return;
//   }

//   setSubmitting(true);

//   const payload = {
//     service: selectedService.id,
//     is_available: formData.is_available,
//     cost: parseFloat(formData.cost),
//     completion_time: formData.completion_time,
//     salon_id: profileData.salon
//   };

//   try {
//     const response = await axios.post(
//       'https://yaslaservice.com:81/api/service-availability/',
//       payload
//     );

//     if (response.data?.status === 'success') {
//       Alert.alert('Success', 'Service availability saved successfully!');
      
//       // Update both serviceDetails and formData with the new values
//       setServiceDetails({
//         ...serviceDetails,
//         ...payload
//       });
      
//       setFormData({
//         ...formData,
//         ...payload
//       });
//     } else {
//       console.error('Unexpected response:', response.data);
//       Alert.alert('Error', 'Failed to save data. Please try again.');
//     }
//   } catch (error) {
//     console.error('Error posting service availability:', error);
//     Alert.alert('Error', 'Something went wrong while saving.');
//      setFormData({
//     cost: '',
//     completion_time: ''
//   });
//   } finally {
//     setSubmitting(false);
//   }
// };

//   useEffect(() => {
//     fetchCategories();
//     // In a real app, you would get the salon name from your user context or auth state
//     // setSalonName(loggedInUser.salonName);
//   }, []);

//   const handleCategoryPress = (category) => {
//     setSelectedCategory(category);
//     setSelectedService(null);
//     setServiceDetails(null);
//     fetchServices(category.id);
//   };

//   const handleServicePress = (service) => {
//     setSelectedService(service);
//     fetchServiceDetails(service.id);
//   };

//   const handleInputChange = (name, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Service Categories</Text>

// <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
//   <TouchableOpacity
//     style={styles.addButton}
//     onPress={() => setShowCategoryModal(true)}
//   >
//     <Text style={styles.addButtonText}>Add Categories</Text>
//   </TouchableOpacity>

//   <TouchableOpacity
//     style={styles.addButton}
//     onPress={() => setShowServiceModal(true)}
//   >
//     <Text style={styles.addButtonText}>Add Service</Text>
//   </TouchableOpacity>
// </View>


      
//       {loading ? (
//         <ActivityIndicator size="large" color="#4A90E2" />
//       ) : (
//         <>
//           {/* Horizontal Scrollable Categories */}
//           <View style={styles.sectionContainer}>
//             <Text style={styles.sectionTitle}>Categories</Text>
//             <ScrollView 
//               horizontal 
//               showsHorizontalScrollIndicator={false}
//               contentContainerStyle={styles.horizontalScroll}
//             >
//               {categories.map((category) => (
//                 <TouchableOpacity
//                   key={category.id.toString()}
//                   style={[
//                     styles.categoryButton,
//                     selectedCategory?.id === category.id && styles.selectedCategory
//                   ]}
//                   onPress={() => handleCategoryPress(category)}
//                 >
//                   <Text style={[
//                     styles.categoryText,
//                     selectedCategory?.id === category.id && styles.selectedCategoryText
//                   ]}>
//                     {category.service_category_name}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>
//           </View>

//           {/* Horizontal Scrollable Services */}
//           {selectedCategory && (
//             <View style={styles.sectionContainer}>
//               <Text style={styles.sectionTitle}>
//                 Services for {selectedCategory.service_category_name}
//               </Text>
//               {servicesLoading ? (
//                 <ActivityIndicator size="small" color="#4A90E2" />
//               ) : services.length > 0 ? (
//                 <ScrollView 
//                   horizontal 
//                   showsHorizontalScrollIndicator={false}
//                   contentContainerStyle={styles.horizontalScroll}
//                 >
//                   {services.map((service) => (
//                     <TouchableOpacity
//                       key={service.id.toString()}
//                       style={[
//                         styles.serviceButton,
//                         selectedService?.id === service.id && styles.selectedService
//                       ]}
//                       onPress={() => handleServicePress(service)}
//                     >
//                       <Text style={[
//                         styles.serviceText,
//                         selectedService?.id === service.id && styles.selectedServiceText
//                       ]}>
//                         {service.service_name}
//                       </Text>
//                     </TouchableOpacity>
//                   ))}
//                 </ScrollView>
//               ) : (
//                 <Text style={styles.noItemsText}>No services found</Text>
//               )}
//             </View>
//           )}

//           {/* Service Details Form */}
//       {selectedService && (
//             <KeyboardAvoidingView
//               behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//               style={{ flex: 1 }}
//               keyboardVerticalOffset={Platform.select({ ios: 100, android: 0 })}
//             >
//               <ScrollView 
//                 contentContainerStyle={styles.formScrollContainer}
//                 keyboardShouldPersistTaps="handled"
//               >
//                 <View style={styles.formContainer}>
//                   <Text style={styles.formTitle}>
//                     {selectedService.service_name} Details
//                   </Text>

//                   {detailsLoading ? (
//                     <ActivityIndicator size="small" color="#4A90E2" />
//                   ) : (
//                     <>
//                       {/* <Text style={[styles.formTitle, { fontSize: 18, marginBottom: 10 }]}>
//                         Service ID: {selectedService.id}
//                       </Text> */}

//                       <View style={[styles.inputGroup, { flexDirection: 'row', alignItems: 'center' }]}>
//                         <Text style={styles.label}>Available</Text>
//                         <Checkbox.Item
//                           label="Available"
//                           status={formData.is_available ? 'checked' : 'unchecked'}
//                           onPress={() => handleInputChange('is_available', !formData.is_available)}
//                           position="leading"
//                         />
//                       </View>

//                       <View style={styles.inputGroup}>
//                         <Text style={styles.label}>Cost (₹)</Text>
//                         <TextInput
//                           style={styles.input}
//                           value={formData.cost}
//                           onChangeText={(text) => handleInputChange('cost', text)}
//                           keyboardType="numeric"
//                           placeholder="Enter cost"
//                           returnKeyType="next"
//                           onSubmitEditing={() => {
//                             // Optionally focus next field or dismiss keyboard
//                             Keyboard.dismiss();
//                           }}
//                         />
//                       </View>

//                       <View style={styles.inputGroup}>
//                         <Text style={styles.label}>Completion Time (HH:MM:SS)</Text>
//                         <TextInput
//                           style={styles.input}
//                           value={formData.completion_time}
//                           onChangeText={(text) => handleInputChange('completion_time', text)}
//                           placeholder="00:30:00"
//                           returnKeyType="done"
//                           onSubmitEditing={() => Keyboard.dismiss()}
//                         />
//                       </View>

//                       <View style={{ marginTop: 20 }}>
//                         <Button
//                           title={submitting ? "Saving..." : "Save Details"}
//                           onPress={saveServiceAvailability}
//                           color="#4A90E2"
//                           disabled={submitting}
//                         />
//                       </View>
//                     </>
//                   )}
//                 </View>
//               </ScrollView>
//             </KeyboardAvoidingView>
//           )}

//         </>
//       )}
// {profileData && (
//   <AddCategoryModal
//     visible={showCategoryModal}
//     onClose={() => setShowCategoryModal(false)}
//     salonId={profileData.salon}
//     onSuccess={() => fetchCategories()} // refresh categories
//   />
// )}

// {showServiceModal && profileData && (
//   <AddServiceModal
//     visible={showServiceModal}
//     onClose={() => setShowServiceModal(false)}
//     salonId={profileData.salon}
//     onSuccess={() => {
//       fetchServices(selectedCategory?.id); // Optional: Refresh services
//     }}
//   />
// )}

//     </View>
//   );
// };

// export default Services;




import React, { useContext, useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';
import { MaterialIcons } from '@expo/vector-icons';
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacity, 
  ScrollView,
  TextInput,
  Button,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard
} from 'react-native';
import styles from './ServicesStyles'; 
import AddCategoryModal from './AddCategoryModal';
import AddServiceModal from './AddServiceModal'; 
import { Checkbox } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';

const Services = () => {
  const { user } = useContext(AuthContext);
  console.log(user)
  const [profileData, setProfileData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [serviceDetails, setServiceDetails] = useState(null);
  const [formData, setFormData] = useState({
    is_available: true,
    cost: '',
    completion_time: '00:30:00',
    description: '' // Added for Description field
  });
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [salonName, setSalonName] = useState('');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  // Refs for scroll views
const categoriesScrollRef = useRef(null);
const servicesScrollRef = useRef(null);

// Scroll functions for categories
const scrollCategoriesLeft = () => {
  categoriesScrollRef.current?.scrollTo({ x: -100, animated: true });
};

const scrollCategoriesRight = () => {
  categoriesScrollRef.current?.scrollTo({ x: 100, animated: true });
};

// Scroll functions for services
const scrollServicesLeft = () => {
  servicesScrollRef.current?.scrollTo({ x: -100, animated: true });
};

const scrollServicesRight = () => {
  servicesScrollRef.current?.scrollTo({ x: 100, animated: true });
};

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://yaslaservice.com:81/service-categories/');
      const result = await response.json();
      if (result.status === "success") {
        setCategories(result.data);
      } else {
        console.error('Error in response:', result.message);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('https://yaslaservice.com:81/users/');
        const matchedUser = response.data.data.find(u => u.id === user.user_id);
        setProfileData(matchedUser || null);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    if (user?.user_id) {
      fetchUserData();
    }
  }, [user?.user_id]);

  const fetchServices = async (categoryId) => {
    setServicesLoading(true);
    try {
      const response = await fetch('https://yaslaservice.com:81/services/');
      const result = await response.json();
      if (result.status === "success") {
        const filteredServices = result.data.filter(
          service => service.category.id === categoryId
        );
        setServices(filteredServices);
      } else {
        console.error('Error in response:', result.message);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setServicesLoading(false);
    }
  };

  const fetchServiceDetails = async (serviceId) => {
    setDetailsLoading(true);
    try {
      const staticData = {
        is_available: true,
        cost: '',
        completion_time: '00:30:00',
        description: ''
      };
      setServiceDetails(staticData);
      setFormData(staticData);
    } catch (error) {
      console.error('Error in fetchServiceDetails:', error);
    } finally {
      setDetailsLoading(false);
    }
  };

  const saveServiceAvailability = async () => {
  if (!formData.cost || !formData.completion_time || !formData.description) {
    Alert.alert('Error', 'Please fill all fields');
    return;
  }

  if (!selectedService || !profileData?.salon) {
    Alert.alert('Error', 'Missing service or salon data');
    return;
  }

  setSubmitting(true);

  const payload = {
    service: selectedService.id,
    is_avaiable: formData.is_available,
    cost: parseFloat(formData.cost),
    completion_time: formData.completion_time,
    description: formData.description,
    salon_id: profileData.salon
  };
  console.log(payload)

  try {
    const response = await axios.post(
      'https://yaslaservice.com:81/api/service-availability/',
      payload
    );

    if (response.data?.status === 'success') {
      Alert.alert('Success', 'Service availability saved successfully!');
      
      // Clear inputs and selection after success
      setFormData({
        is_available: true,
        cost: '',
        completion_time: '00:30:00',
        description: ''
      });
      setServiceDetails(null);
      setSelectedService(null); // optional

    } else {
      console.error('Unexpected response:', response.data);
      Alert.alert('Error', 'Failed to save data. Please try again.');
    }
  } catch (error) {
    console.error('Error posting service availability:', error);
    Alert.alert('Error', 'Something went wrong while saving.');
    setFormData({
      cost: '',
      completion_time: '',
      description: ''
    });
  } finally {
    setSubmitting(false);
  }
};

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
    setSelectedService(null);
    setServiceDetails(null);
    fetchServices(category.id);
  };

  const handleServicePress = (service) => {
    setSelectedService(service);
    fetchServiceDetails(service.id);
  };

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Service Categories</Text>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowCategoryModal(true)}
        >
          <Text style={styles.addButtonText}>Add Categories</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowServiceModal(true)}
        >
          <Text style={styles.addButtonText}>Add Service</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4A90E2" />
      ) : (
        <>
<View style={styles.sectionContainer}>
  <Text style={styles.sectionTitle}>Categories</Text>
  
  <View style={styles.scrollWrapper}>
    {/* Left Arrow */}
    <TouchableOpacity 
      style={styles.leftArrow}
      onPress={scrollCategoriesLeft}
    >
      <MaterialIcons name="keyboard-arrow-left" size={28} color="#2F4EAA" />
    </TouchableOpacity>

    {/* Categories Scroll View */}
    <View style={styles.scrollContainer}>
      <ScrollView 
        ref={categoriesScrollRef}
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScroll}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id.toString()}
            style={[
              styles.categoryButton,
              selectedCategory?.id === category.id && styles.selectedCategory
            ]}
            onPress={() => handleCategoryPress(category)}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory?.id === category.id && styles.selectedCategoryText
            ]}>
              {category.service_category_name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>

    {/* Right Arrow */}
    <TouchableOpacity 
      style={styles.rightArrow}
      onPress={scrollCategoriesRight}
    >
      <MaterialIcons name="keyboard-arrow-right" size={28} color="#2F4EAA" />
    </TouchableOpacity>
  </View>
</View>
{selectedCategory && (
  <View style={styles.sectionContainer}>
    <Text style={styles.sectionTitle}>
      Services for {selectedCategory.service_category_name}
    </Text>
    
    <View style={styles.scrollWrapper}>
      {/* Left Arrow */}
      <TouchableOpacity 
        style={styles.leftArrow}
        onPress={scrollServicesLeft}
      >
        <MaterialIcons name="keyboard-arrow-left" size={28} color="#2F4EAA" />
      </TouchableOpacity>

      {/* Services Scroll View */}
      <View style={styles.scrollContainer}>
        {servicesLoading ? (
          <ActivityIndicator size="small" color="#2F4EAA" />
        ) : services.length > 0 ? (
          <ScrollView 
            ref={servicesScrollRef}
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {services.map((service) => (
              <TouchableOpacity
                key={service.id.toString()}
                style={[
                  styles.serviceButton,
                  selectedService?.id === service.id && styles.selectedService
                ]}
                onPress={() => handleServicePress(service)}
              >
                <Text style={[
                  styles.serviceText,
                  selectedService?.id === service.id && styles.selectedServiceText
                ]}>
                  {service.service_name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <Text style={styles.noItemsText}>No services found</Text>
        )}
      </View>

      {/* Right Arrow */}
      <TouchableOpacity 
        style={styles.rightArrow}
        onPress={scrollServicesRight}
      >
        <MaterialIcons name="keyboard-arrow-right" size={28} color="#4A90E2" />
      </TouchableOpacity>
    </View>
  </View>
)}

          {selectedService && (
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{ flex: 1 }}
              keyboardVerticalOffset={Platform.select({ ios: 100, android: 0 })}
            >
              <ScrollView 
                contentContainerStyle={styles.formScrollContainer}
                keyboardShouldPersistTaps="handled"
              >
                <View style={styles.formContainer}>
                  <Text style={styles.formTitle}>
                    {selectedService.service_name} Details
                  </Text>

                  {detailsLoading ? (
                    <ActivityIndicator size="small" color="#4A90E2" />
                  ) : (
                    <>
                      <View style={[styles.inputGroup, { flexDirection: 'row', alignItems: 'center' }]}>
                        <Text style={styles.label}>Available</Text>
                        <Checkbox.Item
                          label="Available"
                          status={formData.is_available ? 'checked' : 'unchecked'}
                          onPress={() => handleInputChange('is_available', !formData.is_available)}
                          position="leading"
                        />
                      </View>

                      <View style={styles.inputGroup}>
                        <Text style={styles.label}>Cost (₹)</Text>
                        <TextInput
                          style={styles.input}
                          value={formData.cost}
                          onChangeText={(text) => handleInputChange('cost', text)}
                          keyboardType="numeric"
                          placeholder="Enter cost"
                          returnKeyType="next"
                          onSubmitEditing={() => Keyboard.dismiss()}
                        />
                      </View>

                      <View style={styles.inputGroup}>
                        <Text style={styles.label}>Completion Time (HH:MM:SS)</Text>
                        <TextInput
                          style={styles.input}
                          value={formData.completion_time}
                          onChangeText={(text) => handleInputChange('completion_time', text)}
                          placeholder="00:30:00"
                          returnKeyType="next"
                          onSubmitEditing={() => Keyboard.dismiss()}
                        />
                      </View>

                      {/* New Description Field */}
                      <View style={styles.inputGroup}>
                        <Text style={styles.label}>Description</Text>
                        <TextInput
                          style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                          value={formData.description}
                          onChangeText={(text) => handleInputChange('description', text)}
                          placeholder="Enter service description"
                          multiline
                        />
                      </View>

                      <View style={{ marginTop: 20 }}>
                        <Button
                          title={submitting ? "Saving..." : "Save Details"}
                          onPress={saveServiceAvailability}
                          color="#2F4EAA"
                          disabled={submitting}
                        />
                      </View>
                    </>
                  )}
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          )}
        </>
      )}

      {profileData && (
        <AddCategoryModal
          visible={showCategoryModal}
          onClose={() => setShowCategoryModal(false)}
          salonId={profileData.salon}
          onSuccess={() => fetchCategories()}
        />
      )}

      {showServiceModal && profileData && (
        <AddServiceModal
          visible={showServiceModal}
          onClose={() => setShowServiceModal(false)}
          salonId={profileData.salon}
          onSuccess={() => {
            fetchServices(selectedCategory?.id);
          }}
        />
      )}
    </View>
  );
};

export default Services;
