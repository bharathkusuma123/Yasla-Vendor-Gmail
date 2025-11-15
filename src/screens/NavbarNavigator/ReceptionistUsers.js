// // import React, { Component } from 'react'
// // import { Text, View } from 'react-native'

// // export class ReceptionistUsers extends Component {
// //   render() {
// //     return (
// //       <View>
// //         <Text> ReceptionistUsers </Text>
// //       </View>
// //     )
// //   }
// // }

// // export default ReceptionistUsers






// import React, { useContext, useEffect, useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Dimensions } from 'react-native';
// import axios from 'axios';
// import { AuthContext } from '../../context/AuthContext';
// import { useIsFocused } from '@react-navigation/native';
// import Icon from 'react-native-vector-icons/MaterialIcons';

// const ReceptionistUsers = ({ navigation }) => {
//   const { user } = useContext(AuthContext);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const isFocused = useIsFocused();

//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get('https://yaslaservice.com:81/users/');
//       const allUsers = response.data.data;
//       const matchedUsers = allUsers.filter(u => u.salon === user?.salon);
//       setFilteredUsers(matchedUsers);
//     } catch (error) {
//       console.error('Error fetching users:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (user?.salon && isFocused) {
//       fetchUsers();
//     }
//   }, [user?.salon, isFocused]);

//   const handleAddUser = () => {
//     navigation.navigate('AddUser', { 
//       salonId: user.salon,
//       onUserAdded: fetchUsers
//     });
//   };

//   const handleEditUser = (user) => {
//     navigation.navigate('EditUser', {
//       user,
//       onUserUpdated: fetchUsers
//     });
//   };

//   const handleDeleteUser = async (userId) => {
//     try {
//       await axios.delete(`https://yaslaservice.com:81/users/${userId}`);
//       fetchUsers(); // Refresh the list after deletion
//     } catch (error) {
//       console.error('Error deleting user:', error);
//     }
//   };

//   if (!user) {
//     return (
//       <View style={styles.centered}>
//         <Text>Loading user...</Text>
//       </View>
//     );
//   }

//   const renderUserCard = ({ item, index }) => (
//     <View style={styles.card}>
//       <View style={styles.cardHeader}>
//         <Text style={styles.cardTitle}>{item.full_name}</Text>
//         <View style={styles.actionsContainer}>
//           <TouchableOpacity onPress={() => handleEditUser(item)} style={styles.actionButton}>
//             <Icon name="edit" size={20} color="#4CAF50" />
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => handleDeleteUser(item.id)} style={styles.actionButton}>
//             <Icon name="delete" size={20} color="#f44336" />
//           </TouchableOpacity>
//           <View style={[
//             styles.statusBadge,
//             item.status === 'Active' ? styles.statusActiveBadge : styles.statusInactiveBadge
//           ]}>
//             <Text style={styles.statusBadgeText}>{item.status}</Text>
//           </View>
//         </View>
//       </View>
      
//       <View style={styles.cardBody}>
//         <View style={styles.infoRow}>
//           <Text style={styles.infoLabel}>Role:</Text>
//           <Text style={styles.infoValue}>{item.user_role}</Text>
//         </View>
        
//         <View style={styles.infoRow}>
//           <Text style={styles.infoLabel}>Email:</Text>
//           <Text style={styles.infoValue}>{item.email}</Text>
//         </View>
//       </View>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       {/* Top-right button */}
//       <TouchableOpacity style={styles.topRightButton} onPress={handleAddUser}>
//         <Text style={styles.buttonText}>+ Add User</Text>
//       </TouchableOpacity>

//       {/* Header */}
//       <Text style={styles.heading}>Users</Text>

//       {/* User Cards */}
//       {loading ? (
//         <ActivityIndicator size="large" color="#4CAF50" />
//       ) : (
//         <FlatList
//           data={filteredUsers}
//           keyExtractor={(item) => item.id}
//           renderItem={renderUserCard}
//           ListEmptyComponent={<Text style={styles.noData}>No users found.</Text>}
//           contentContainerStyle={styles.listContainer}
//           numColumns={Math.floor(Dimensions.get('window').width / 350) || 1}
//           key={Dimensions.get('window').width > 600 ? 'two-column' : 'one-column'}
//         />
//       )}
//     </View>
//   );
// };

// export default ReceptionistUsers;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//     paddingTop: 60,
//     paddingHorizontal: 10,
//   },
//   heading: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//     color: '#333',
//   },
//   topRightButton: {
//     position: 'absolute',
//     top: 20,
//     right: 20,
//     backgroundColor: '#4CAF50',
//     paddingVertical: 10,
//     paddingHorizontal: 16,
//     borderRadius: 5,
//     zIndex: 999,
//     elevation: 3,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: 'bold',
//   },
//   listContainer: {
//     paddingBottom: 20,
//   },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 15,
//     margin: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//     flex: 1,
//     width: Dimensions.get('window').width > 600 ? '48%' : '100%',
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//     paddingBottom: 10,
//   },
//   cardTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   cardBody: {
//     marginTop: 5,
//   },
//   infoRow: {
//     flexDirection: 'row',
//     marginBottom: 8,
//   },
//   infoLabel: {
//     fontWeight: 'bold',
//     width: 80,
//     color: '#555',
//   },
//   infoValue: {
//     flex: 1,
//     color: '#333',
//   },
//   actionsContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   actionButton: {
//     marginHorizontal: 5,
//   },
//   statusBadge: {
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginLeft: 5,
//   },
//   statusActiveBadge: {
//     backgroundColor: '#4c9953ff',
//   },
//   statusInactiveBadge: {
//     backgroundColor: '#cd233cff',
//   },
//   statusBadgeText: {
//     fontSize: 12,
//     fontWeight: 'bold',
//     textTransform: 'capitalize',
//     color: '#fff',
//   },
//   noData: {
//     textAlign: 'center',
//     marginTop: 20,
//     fontStyle: 'italic',
//     color: '#777',
//   },
//   centered: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Dimensions, Alert } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

const ReceptionistUsers = () => {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://yaslaservice.com:81/users/');
      const allUsers = response.data.data;
      const matchedUsers = allUsers.filter(u => u.salon === user?.salon);
      setFilteredUsers(matchedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      Alert.alert("Error", "Failed to fetch users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.salon && isFocused) {
      fetchUsers();
    }
  }, [user?.salon, isFocused]);

  const handleAddUser = () => {
    navigation.navigate('AddUser', { salonId: user.salon });
  };

  const handleUserPress = (user) => {
    navigation.navigate('UserDetails', { user });
  };

  const handleEditUser = (user, e) => {
    e.stopPropagation();
    navigation.navigate('EditUser', { userId: user.id });
  };

  const handleDeleteUser = async (userId, e) => {
    e.stopPropagation();
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this user?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            try {
              await axios.delete(`https://yaslaservice.com:81/users/${userId}/`);
              fetchUsers();
              Alert.alert("Success", "User deleted successfully");
            } catch (error) {
              console.error('Error deleting user:', error);
              Alert.alert("Error", error.response?.data?.message || "Failed to delete user.");
            }
          }
        }
      ]
    );
  };

  const renderUserCard = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleUserPress(item)} activeOpacity={0.8}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.full_name}</Text>
        <View style={styles.actionsContainer}>
          <TouchableOpacity onPress={(e) => handleEditUser(item, e)} style={styles.actionButton}>
            <MaterialIcons name="edit" size={20} color="#2F4EAA" />
          </TouchableOpacity>
          <TouchableOpacity onPress={(e) => handleDeleteUser(item.id, e)} style={styles.actionButton}>
            <MaterialIcons name="delete" size={20} color="#f44336" />
          </TouchableOpacity>
          <View style={[
            styles.statusBadge,
            item.status === 'Active' ? styles.statusActiveBadge : styles.statusInactiveBadge
          ]}>
            <Text style={styles.statusBadgeText}>{item.status}</Text>
          </View>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Role:</Text>
          <Text style={styles.infoValue}>{item.user_role}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}>{item.email}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.topRightButton} onPress={handleAddUser}>
        <Text style={styles.buttonText}>+ Add User</Text>
      </TouchableOpacity>
      <Text style={styles.heading}>Users</Text>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2F4EAA" />
          <Text style={styles.loadingText}>Loading users...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderUserCard}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.noData}>No users found</Text>
            </View>
          }
          contentContainerStyle={styles.listContainer}
          numColumns={Math.floor(Dimensions.get('window').width / 350) || 1}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f5f5', 
    paddingTop: 60, 
    paddingHorizontal: 10 
  },
  heading: { 
    fontSize: 22, 
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 20, 
    textAlign: 'center', 
    color: '#333' 
  },
  topRightButton: { 
    position: 'absolute', 
    top: 20, 
    right: 20, 
    backgroundColor: '#2F4EAA', 
    paddingVertical: 10, 
    paddingHorizontal: 16, 
    borderRadius: 5, 
    zIndex: 999, 
    elevation: 3 
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 14, 
    fontFamily: 'Inter_600SemiBold'
  },
  listContainer: { 
    paddingBottom: 20 
  },
  card: { 
    backgroundColor: '#fff', 
    borderRadius: 10, 
    padding: 15, 
    margin: 8, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 4, 
    elevation: 3, 
    flex: 1, 
    width: Dimensions.get('window').width > 600 ? '48%' : '100%' 
  },
  cardHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 10, 
    borderBottomWidth: 1, 
    borderBottomColor: '#eee', 
    paddingBottom: 10 
  },
  cardTitle: { 
    fontSize: 20, 
    fontFamily: 'Inter_600SemiBold',
    color: '#333' 
  },
  cardBody: { 
    marginTop: 5 
  },
  infoRow: { 
    flexDirection: 'row', 
    marginBottom: 8 
  },
  infoLabel: { 
    fontSize: 16, 
    fontFamily: 'Inter_600SemiBold',
    width: 80, 
    color: '#555' 
  },
  infoValue: { 
    flex: 1, 
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#333' 
  },
  actionsContainer: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  actionButton: { 
    marginHorizontal: 5 
  },
  statusBadge: { 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 12, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginLeft: 5 
  },
  statusActiveBadge: { 
    backgroundColor: '#e8f5e8' 
  },
  statusInactiveBadge: { 
    backgroundColor: '#ffebee' 
  },
  statusBadgeText: { 
    fontSize: 12, 
    fontFamily: 'Inter_600SemiBold',
    textTransform: 'capitalize', 
    color: '#4CAF50' 
  },
  noData: { 
    textAlign: 'center', 
    marginTop: 20, 
    fontStyle: 'italic', 
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#777' 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
});

export default ReceptionistUsers;