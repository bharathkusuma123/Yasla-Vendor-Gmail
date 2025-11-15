
// import React, { useEffect, useState, useContext } from "react";
// import { 
//   View, 
//   Text, 
//   StyleSheet, 
//   FlatList, 
//   ActivityIndicator, 
//   TouchableOpacity,
//   Modal,
//   TextInput,
//   Alert 
// } from "react-native";
// import { AuthContext } from "../../../context/AuthContext";
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { Card, Button } from 'react-native-paper';

// const ServiceAvailability = () => {
//   const { user } = useContext(AuthContext);
//   const [services, setServices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editingService, setEditingService] = useState(null);
//   const [isEditModalVisible, setIsEditModalVisible] = useState(false);
//   const [formData, setFormData] = useState({
//     cost: '',
//     completion_time: '',
//     is_available: false
//   });

//   useEffect(() => {
//     fetchServices();
//   }, [user]);

//   const fetchServices = async () => {
//     try {
//       const salonId = user?.salon;
//       if (!salonId) {
//         setError("No salon associated with this account");
//         setLoading(false);
//         return;
//       }

//       const response = await fetch(`https://yaslaservice.com:81/api/service-availability/?salon_id=${salonId}`);
      
//       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

//       const data = await response.json();
//       const arr = Array.isArray(data) ? data : data.results || data.data || [];
      
//       if (arr.length === 0) setError("No services available for this salon");
//       setServices(arr);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       setError("Failed to load services. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (service) => {
//     setEditingService(service);
//     setFormData({
//       cost: service.cost,
//       completion_time: service.completion_time,
//       is_available: service.is_available !== undefined ? service.is_available : service.is_avaiable
//     });
//     setIsEditModalVisible(true);
//   };

//   const handleUpdate = async () => {
//   const salonid = user?.salon;
//       try {
//       const response = await fetch(`https://yaslaservice.com:81/api/service-availability/${editingService.id}/`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           cost: formData.cost,
//           completion_time: formData.completion_time,
//           is_available: formData.is_available,
//           salon_id: salonid

//         })
//       });

//       if (!response.ok) throw new Error('Failed to update service');

//       // Update local state
//       const updatedServices = services.map(service => 
//         service.id === editingService.id ? { 
//           ...service, 
//           cost: formData.cost,
//           completion_time: formData.completion_time,
//           is_available: formData.is_available
//         } : service
//       );

//       setServices(updatedServices);
//       setIsEditModalVisible(false);
//       Alert.alert('Success', 'Service updated successfully');
//     } catch (error) {
//       console.error('Update error:', error);
//       Alert.alert('Error', 'Failed to update service');
//     }
//   };

//   const renderServiceCard = ({ item }) => {
//     const isAvailable = item.is_available !== undefined ? item.is_available : item.is_avaiable;
    
//     return (
//       <Card style={styles.card}>
//         <Card.Content>
//           <View style={styles.cardHeader}>
//             <Text style={styles.serviceName}>{item.service_name}</Text>
//             <View style={[styles.availabilityBadge, isAvailable ? styles.availableBadge : styles.unavailableBadge]}>
//               <Text style={styles.availabilityText}>{isAvailable ? 'Available' : 'Unavailable'}</Text>
//             </View>
//           </View>
          
//           <View style={styles.detailRow}>
//             <Icon name="category" size={18} color="#555" />
//             <Text style={styles.detailLabel}>Category: </Text>
//             <Text style={styles.detailText}>{item.category_name}</Text>
//           </View>
          
//           <View style={styles.detailRow}>
//             <Icon name="currency-rupee" size={18} color="#555" />
//             <Text style={styles.detailLabel}>Price: </Text>
//             <Text style={styles.detailText}>₹{item.cost}</Text>
//           </View>
          
//           <View style={styles.detailRow}>
//             <Icon name="access-time" size={18} color="#555" />
//             <Text style={styles.detailLabel}>Duration: </Text>
//             <Text style={styles.detailText}>{item.completion_time?.replace('00:', '') || 'N/A'}</Text>
//           </View>
          
//           <Button 
//             mode="contained" 
//             style={styles.editButton}
//             onPress={() => handleEdit(item)}
//           >
//             Edit Service
//           </Button>
//         </Card.Content>
//       </Card>
//     );
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#2F4EAA" />
//         <Text style={styles.loadingText}>Loading services...</Text>
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.errorContainer}>
//         <Icon name="error-outline" size={50} color="#d32f2f" />
//         <Text style={styles.errorText}>{error}</Text>
//         <Button 
//           mode="contained" 
//           style={styles.retryButton}
//           onPress={fetchServices}
//         >
//           Try Again
//         </Button>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={services}
//         renderItem={renderServiceCard}
//         keyExtractor={(item) => item.id.toString()}
//         contentContainerStyle={styles.listContent}
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <Icon name="info-outline" size={40} color="#666" />
//             <Text style={styles.emptyText}>No services found</Text>
//           </View>
//         }
//       />

//       {/* Edit Modal */}
//       <Modal
//         visible={isEditModalVisible}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={() => setIsEditModalVisible(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContainer}>
//             <Text style={styles.modalTitle}>Edit Service</Text>
            
//             <TextInput
//               style={styles.input}
//               placeholder="Cost (₹)"
//               value={formData.cost}
//               onChangeText={(text) => setFormData({...formData, cost: text})}
//               keyboardType="numeric"
//             />
            
//             <TextInput
//               style={styles.input}
//               placeholder="Completion Time (HH:MM)"
//               value={formData.completion_time}
//               onChangeText={(text) => setFormData({...formData, completion_time: text})}
//             />
            
//             <View style={styles.switchContainer}>
//               <Text>Available:</Text>
//               <TouchableOpacity
//                 style={[styles.toggleButton, formData.is_available ? styles.toggleActive : styles.toggleInactive]}
//                 onPress={() => setFormData({...formData, is_available: !formData.is_available})}
//               >
//                 <Text style={styles.toggleText}>{formData.is_available ? 'Yes' : 'No'}</Text>
//               </TouchableOpacity>
//             </View>
            
//             <View style={styles.modalButtons}>
//               <Button 
//                 mode="outlined" 
//                 style={styles.cancelButton}
//                 onPress={() => setIsEditModalVisible(false)}
//               >
//                 Cancel
//               </Button>
//               <Button 
//                 mode="contained" 
//                 style={styles.saveButton}
//                 onPress={handleUpdate}
//               >
//                 Save Changes
//               </Button>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//     padding: 10,
//   },
//   listContent: {
//     paddingBottom: 20,
//   },
//   card: {
//     marginBottom: 15,
//     borderRadius: 12,
//     elevation: 3,
//     backgroundColor: '#fff',
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   serviceName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//     flex: 1,
//   },
//   availabilityBadge: {
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   availableBadge: {
//     backgroundColor: '#e8f5e9',
//   },
//   unavailableBadge: {
//     backgroundColor: '#ffebee',
//   },
//   availabilityText: {
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
//   detailRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 5,
//   },
//   detailLabel: {
//     marginLeft: 10,
//     fontSize: 14,
//     color: '#555',
//     fontWeight: 'bold',
//   },
//   detailText: {
//     marginLeft: 5,
//     fontSize: 14,
//     color: '#555',
//   },
//   editButton: {
//     marginTop: 15,
//     backgroundColor: '#2F4EAA',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f5f5f5',
//   },
//   loadingText: {
//     marginTop: 15,
//     fontSize: 16,
//     color: '#666',
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#f5f5f5',
//   },
//   errorText: {
//     marginTop: 15,
//     fontSize: 16,
//     color: '#d32f2f',
//     textAlign: 'center',
//   },
//   retryButton: {
//     marginTop: 20,
//     backgroundColor: '#2F4EAA',
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 40,
//   },
//   emptyText: {
//     marginTop: 15,
//     fontSize: 16,
//     color: '#666',
//   },
//   modalOverlay: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   modalContainer: {
//     width: '90%',
//     backgroundColor: 'white',
//     borderRadius: 10,
//     padding: 20,
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//     color: '#2F4EAA',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 6,
//     padding: 12,
//     marginBottom: 15,
//     fontSize: 16,
//   },
//   switchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginBottom: 20,
//   },
//   toggleButton: {
//     paddingHorizontal: 20,
//     paddingVertical: 8,
//     borderRadius: 20,
//   },
//   toggleActive: {
//     backgroundColor: '#4caf50',
//   },
//   toggleInactive: {
//     backgroundColor: '#f44336',
//   },
//   toggleText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   modalButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   cancelButton: {
//     borderColor: '#2F4EAA',
//     flex: 1,
//     marginRight: 10,
//   },
//   saveButton: {
//     backgroundColor: '#2F4EAA',
//     flex: 1,
//   },
// });

// export default ServiceAvailability;




import React, { useEffect, useState, useContext } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator, 
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ScrollView
} from "react-native";
import { AuthContext } from "../../../context/AuthContext";
import { MaterialIcons } from '@expo/vector-icons';
import { Card, Button } from 'react-native-paper';
import { TabView, TabBar } from 'react-native-tab-view';

const ServiceAvailability = () => {
  const { user } = useContext(AuthContext);
  const [services, setServices] = useState([]);
  const [pendingServices, setPendingServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingLoading, setPendingLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingError, setPendingError] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    cost: '',
    completion_time: '',
    is_available: false
  });
  
  // Tab view state
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'available', title: 'Available Services' },
    { key: 'pending', title: 'Pending Services' },
  ]);

  useEffect(() => {
    fetchServices();
    fetchPendingServices();
  }, [user]);

  const fetchServices = async () => {
    try {
      const salonId = user?.salon;
      if (!salonId) {
        setError("No salon associated with this account");
        setLoading(false);
        return;
      }

      const response = await fetch(`https://yaslaservice.com:81/api/service-availability/?salon_id=${salonId}`);
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      const arr = Array.isArray(data) ? data : data.results || data.data || [];
      
      if (arr.length === 0) setError("No services available for this salon");
      setServices(arr);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load services. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingServices = async () => {
    try {
      const salonId = user?.salon;
      if (!salonId) {
        setPendingError("No salon associated with this account");
        setPendingLoading(false);
        return;
      }

      const response = await fetch(`https://yaslaservice.com:81/api/salon-services/`);
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      const allServices = Array.isArray(data) ? data : data.data || [];
      
      // Filter services that are not approved and belong to this salon
      const pending = allServices.filter(service => 
        service.approved === false && service.created_salon === salonId
      );
      
      if (pending.length === 0) setPendingError("No pending services for this salon");
      setPendingServices(pending);
    } catch (error) {
      console.error("Error fetching pending services:", error);
      setPendingError("Failed to load pending services. Please try again.");
    } finally {
      setPendingLoading(false);
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      cost: service.cost,
      completion_time: service.completion_time,
      is_available: service.is_available !== undefined ? service.is_available : service.is_avaiable
    });
    setIsEditModalVisible(true);
  };

  const handleUpdate = async () => {
    const salonid = user?.salon;
    try {
      const response = await fetch(`https://yaslaservice.com:81/api/service-availability/${editingService.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cost: formData.cost,
          completion_time: formData.completion_time,
          is_available: formData.is_available,
          salon_id: salonid
        })
      });

      if (!response.ok) throw new Error('Failed to update service');

      // Update local state
      const updatedServices = services.map(service => 
        service.id === editingService.id ? { 
          ...service, 
          cost: formData.cost,
          completion_time: formData.completion_time,
          is_available: formData.is_available
        } : service
      );

      setServices(updatedServices);
      setIsEditModalVisible(false);
      Alert.alert('Success', 'Service updated successfully');
    } catch (error) {
      console.error('Update error:', error);
      Alert.alert('Error', 'Failed to update service');
    }
  };

  const renderServiceCard = ({ item }) => {
    const isAvailable = item.is_available !== undefined ? item.is_available : item.is_avaiable;
    
    return (
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Text style={styles.serviceName}>{item.service_name}</Text>
            <View style={[styles.availabilityBadge, isAvailable ? styles.availableBadge : styles.unavailableBadge]}>
              <Text style={styles.availabilityText}>{isAvailable ? 'Available' : 'Unavailable'}</Text>
            </View>
          </View>
          
          <View style={styles.detailRow}>
            <MaterialIcons name="category" size={18} color="#555" />
            <Text style={styles.detailLabel}>Category: </Text>
            <Text style={styles.detailText}>{item.category_name}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <MaterialIcons name="currency-rupee" size={18} color="#555" />
            <Text style={styles.detailLabel}>Price: </Text>
            <Text style={styles.detailText}>₹{item.cost}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <MaterialIcons name="access-time" size={18} color="#555" />
            <Text style={styles.detailLabel}>Duration: </Text>
            <Text style={styles.detailText}>{item.completion_time?.replace('00:', '') || 'N/A'}</Text>
          </View>
          
          <Button 
            mode="contained" 
            style={styles.editButton}
            onPress={() => handleEdit(item)}
          >
            <Text style={styles.editButtonText}>Edit Service</Text>
          </Button>
        </Card.Content>
      </Card>
    );
  };

  const renderPendingServiceCard = ({ item }) => {
    return (
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Text style={styles.serviceName}>{item.service_name}</Text>
            <View style={[styles.availabilityBadge, styles.pendingBadge]}>
              <Text style={styles.availabilityText}>Pending Approval</Text>
            </View>
          </View>
          
          <View style={styles.detailRow}>
            <MaterialIcons name="description" size={18} color="#555" />
            <Text style={styles.detailLabel}>Description: </Text>
            <Text style={styles.detailText}>{item.description || 'N/A'}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <MaterialIcons name="wc" size={18} color="#555" />
            <Text style={styles.detailLabel}>Gender: </Text>
            <Text style={styles.detailText}>{item.gender_specific}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <MaterialIcons name="category" size={18} color="#555" />
            <Text style={styles.detailLabel}>Category ID: </Text>
            <Text style={styles.detailText}>{item.category}</Text>
          </View>
        </Card.Content>
      </Card>
    );
  };

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'available':
        return <AvailableServicesView 
          services={services} 
          loading={loading} 
          error={error} 
          renderServiceCard={renderServiceCard}
          fetchServices={fetchServices}
        />;
      case 'pending':
        return <PendingServicesView 
          pendingServices={pendingServices} 
          loading={pendingLoading} 
          error={pendingError} 
          renderPendingServiceCard={renderPendingServiceCard}
          fetchPendingServices={fetchPendingServices}
        />;
      default:
        return null;
    }
  };

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: '#2F4EAA' }}
      style={{ backgroundColor: 'white' }}
      labelStyle={({ focused, route }) => ({
        color: focused ? '#2F4EAA' : '#999',
        fontFamily: focused ? 'Inter_600SemiBold' : 'Inter_400Regular',
        fontSize: 14,
      })}
      activeColor="#2F4EAA"
      inactiveColor="#999"
    />
  );

  return (
    <View style={styles.container}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={renderTabBar}
        style={styles.tabView}
      />
      
      {/* Edit Modal */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Service</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Cost (₹)"
              value={formData.cost}
              onChangeText={(text) => setFormData({...formData, cost: text})}
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Completion Time (HH:MM)"
              value={formData.completion_time}
              onChangeText={(text) => setFormData({...formData, completion_time: text})}
              placeholderTextColor="#999"
            />
            
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Available:</Text>
              <TouchableOpacity
                style={[styles.toggleButton, formData.is_available ? styles.toggleActive : styles.toggleInactive]}
                onPress={() => setFormData({...formData, is_available: !formData.is_available})}
              >
                <Text style={styles.toggleText}>{formData.is_available ? 'Yes' : 'No'}</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalButtons}>
              <Button 
                mode="outlined" 
                style={styles.cancelButton}
                onPress={() => setIsEditModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Button>
              <Button 
                mode="contained" 
                style={styles.saveButton}
                onPress={handleUpdate}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Separate component for Available Services view
const AvailableServicesView = ({ services, loading, error, renderServiceCard, fetchServices }) => {
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2F4EAA" />
        <Text style={styles.loadingText}>Loading services...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={50} color="#d32f2f" />
        <Text style={styles.errorText}>{error}</Text>
        <Button 
          mode="contained" 
          style={styles.retryButton}
          onPress={fetchServices}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.tabContent}>
      <FlatList
        data={services}
        renderItem={renderServiceCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="info-outline" size={40} color="#666" />
            <Text style={styles.emptyText}>No services available</Text>
          </View>
        }
      />
    </View>
  );
};

// Separate component for Pending Services view
const PendingServicesView = ({ pendingServices, loading, error, renderPendingServiceCard, fetchPendingServices }) => {
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2F4EAA" />
        <Text style={styles.loadingText}>Loading pending services...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={50} color="#d32f2f" />
        <Text style={styles.errorText}>{error}</Text>
        <Button 
          mode="contained" 
          style={styles.retryButton}
          onPress={fetchPendingServices}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.tabContent}>
      <FlatList
        data={pendingServices}
        renderItem={renderPendingServiceCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="info-outline" size={40} color="#666" />
            <Text style={styles.emptyText}>No pending services</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  tabView: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
    padding: 10,
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    marginBottom: 15,
    borderRadius: 12,
    elevation: 3,
    backgroundColor: '#fff',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  serviceName: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#333',
    flex: 1,
  },
  availabilityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  availableBadge: {
    backgroundColor: '#e8f5e9',
  },
  unavailableBadge: {
    backgroundColor: '#ffebee',
  },
  pendingBadge: {
    backgroundColor: '#fff3e0',
  },
  availabilityText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  detailLabel: {
    marginLeft: 10,
    fontSize: 14,
    color: '#555',
    fontFamily: 'Inter_600SemiBold',
  },
  detailText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#555',
    fontFamily: 'Inter_400Regular',
  },
  editButton: {
    marginTop: 15,
    backgroundColor: '#2F4EAA',
  },
  editButtonText: {
    fontFamily: 'Inter_600SemiBold',
    color: '#fff',
  },
  actionButton: {
    marginTop: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
    fontFamily: 'Inter_400Regular',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    marginTop: 15,
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#2F4EAA',
  },
  retryButtonText: {
    fontFamily: 'Inter_600SemiBold',
    color: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
    fontFamily: 'Inter_400Regular',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2F4EAA',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  switchLabel: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: '#333',
  },
  toggleButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  toggleActive: {
    backgroundColor: '#4caf50',
  },
  toggleInactive: {
    backgroundColor: '#f44336',
  },
  toggleText: {
    color: 'white',
    fontFamily: 'Inter_600SemiBold',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    borderColor: '#2F4EAA',
    flex: 1,
    marginRight: 10,
  },
  cancelButtonText: {
    fontFamily: 'Inter_600SemiBold',
    color: '#2F4EAA',
  },
  saveButton: {
    backgroundColor: '#2F4EAA',
    flex: 1,
  },
  saveButtonText: {
    fontFamily: 'Inter_600SemiBold',
    color: '#fff',
  },
  tabLabel: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  activeTabLabel: {
    color: '#2F4EAA',
    fontFamily: 'Inter_600SemiBold',
  },
  inactiveTabLabel: {
    color: '#999',
    fontFamily: 'Inter_400Regular',
  },
});

export default ServiceAvailability;