import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
import { MaterialIcons } from '@expo/vector-icons';

import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';

const UserDetails = ({ route, navigation }) => {
  const { user, onUserUpdated } = route.params;
  const { user: currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this user?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              await axios.delete(`https://yaslaservice.com:81/users/${user.id}`);
              onUserUpdated();
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting user:', error);
              Alert.alert("Error", "Failed to delete user. Please try again.");
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleEdit = () => {
    navigation.navigate('EditUser', {
      user,
      onUserUpdated: () => {
        onUserUpdated();
        navigation.goBack();
      }
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {/* <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#2F4EAA" />
        </TouchableOpacity> */}
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                   <MaterialIcons name="arrow-back" size={24} color="#2F4EAA" />
                </TouchableOpacity>
        <Text style={styles.title}>User Details</Text>
        {currentUser?.id !== user.id && (
          <View style={styles.actionButtons}>
            {/* <TouchableOpacity onPress={handleEdit} style={styles.actionButton}>
              <Icon name="edit" size={24} color="#2F4EAA" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete} style={styles.actionButton}>
              <Icon name="delete" size={24} color="#f44336" />
            </TouchableOpacity> */}
          </View>
        )}
      </View>

      <View style={styles.card}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Full Name:</Text>
            <Text style={styles.infoValue}>{user.full_name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{user.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status:</Text>
            <View style={[
              styles.statusBadge,
              user.status === 'Active' ? styles.statusActiveBadge : styles.statusInactiveBadge
            ]}>
              <Text style={styles.statusBadgeText}>{user.status}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Role Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>User Role:</Text>
            <Text style={styles.infoValue}>{user.user_role}</Text>
          </View>
        </View>

        {user.phone && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone:</Text>
              <Text style={styles.infoValue}>{user.phone}</Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 20,
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
    color: '#333',
  },
  backButton: {
    padding: 5,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 15,
    padding: 5,
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
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: 'black',
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  infoLabel: {
    fontFamily: 'Inter_600SemiBold',
    width: 100,
    color: '#555',
    fontSize: 14,
  },
  infoValue: {
    flex: 1,
    color: '#333',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusActiveBadge: {
    backgroundColor: '#e0e0e0',
  },
  statusInactiveBadge: {
    backgroundColor: '#cd233cff',
  },
  statusBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    textTransform: 'capitalize',
    color: '#4c9953ff',
  },
});

export default UserDetails;