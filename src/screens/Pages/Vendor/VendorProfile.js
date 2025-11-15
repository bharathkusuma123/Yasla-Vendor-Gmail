import React, { useContext, useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator, 
  TouchableOpacity,
  Image
} from 'react-native';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';
import { MaterialIcons, Feather, Ionicons } from '@expo/vector-icons';

const VendorProfile = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('https://yaslaservice.com:81/users/');
        const matchedUser = response.data.data.find(u => u.id === user.user_id);
        setProfileData(matchedUser || null);
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

      {/* Action Cards */}
      <TouchableOpacity 
        style={styles.actionCard}
        // onPress={() => navigation.navigate('ChangePassword')}
      >
        <View style={styles.actionIcon}>
          <Ionicons name="key-outline" size={24} color="#4CAF50" />
        </View>
        <Text style={styles.actionText}>Change Password</Text>
        <MaterialIcons name="chevron-right" size={24} color="#999" />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.actionCard}
        // onPress={() => navigation.navigate('ChangeMobile')}
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
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
});

export default VendorProfile;