import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';

const AddCategoryModal = ({ visible, onClose, salonId, onSuccess }) => {
  const [formData, setFormData] = useState({
    service_category_name: '',
    service_category_description: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.service_category_name || !formData.service_category_description) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        created_salon: salonId,
        created_branch: null
      };

      const response = await fetch('https://yaslaservice.com:81/api/service-categories/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok && result.status === "success") {
        Alert.alert('Success', 'Category added successfully');
        onSuccess?.();  // trigger parent update
        onClose();      // close modal
        setFormData({ service_category_name: '', service_category_description: '' });
      } else {
        throw new Error(result.message || 'Something went wrong');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Add Category</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Category Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter category name"
              value={formData.service_category_name}
              onChangeText={(text) => handleChange('service_category_name', text)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.descriptionInput]}
              placeholder="Enter category description"
              value={formData.service_category_description}
              onChangeText={(text) => handleChange('service_category_description', text)}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.submitButton} 
              onPress={handleSubmit} 
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Add Category</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddCategoryModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000099',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    width: '90%',
    borderRadius: 8,
    elevation: 5
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333'
  },
  inputContainer: {
    marginBottom: 16
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#555'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 6,
    backgroundColor: '#f9f9f9',
    fontSize: 16
  },
  descriptionInput: {
    height: 80,
    textAlignVertical: 'top'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8
  },
  cancelButton: {
    padding: 12,
    backgroundColor: '#e74c3c',
    borderRadius: 6,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  submitButton: {
    padding: 12,
    backgroundColor: '#2F4EAA',
    borderRadius: 6,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16
  }
});