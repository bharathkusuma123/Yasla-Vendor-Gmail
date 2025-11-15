import React, { useEffect, useState } from 'react';
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
import { Picker } from '@react-native-picker/picker';

const AddServiceModal = ({ visible, onClose, salonId, onSuccess }) => {
  const [formData, setFormData] = useState({
    service_name: '',
    category: '',
    description: '',
    gender_specific: '',
  });

  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://yaslaservice.com:81/api/service-categories/');
      const result = await response.json();
      if (result.status === 'success') {
        setCategories(result.data);
      } else {
        throw new Error(result.message || 'Failed to fetch categories');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchCategories();
    }
  }, [visible]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.service_name || !formData.category || !formData.description) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    const payload = {
      ...formData,
      category: parseInt(formData.category),
      created_salon: salonId,
      created_branch: null,
    };

    setSubmitting(true);
    try {
      const response = await fetch('https://yaslaservice.com:81/api/salon-services/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok && result.status === 'success') {
        Alert.alert('Success', 'Service added successfully');
        onSuccess?.();
        onClose();
        setFormData({
          service_name: '',
          category: '',
          description: '',
          gender_specific: '',
        });
      } else {
        throw new Error(result.message || 'Failed to add service');
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
          <Text style={styles.title}>Add New Service</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Service Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter service name"
              value={formData.service_name}
              onChangeText={(text) => handleChange('service_name', text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category *</Text>
            {loadingCategories ? (
              <ActivityIndicator size="small" color="#2F4EAA" style={styles.loader} />
            ) : (
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.category}
                  onValueChange={(value) => handleChange('category', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select a category" value="" />
                  {categories.map(cat => (
                    <Picker.Item 
                      key={cat.id} 
                      label={cat.service_category_name} 
                      value={cat.id} 
                    />
                  ))}
                </Picker>
              </View>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter service description"
              value={formData.description}
              onChangeText={(text) => handleChange('description', text)}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Gender Specific</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.gender_specific}
                onValueChange={(value) => handleChange('gender_specific', value)}
                style={styles.picker}
              >
                <Picker.Item label="Select gender option" value="" />
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
                <Picker.Item label="Unisex" value="Unisex" />
              </Picker>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]} 
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Add Service</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddServiceModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '100%',
    maxWidth: 500,
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
    color: '#444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f9f9f9',
  },
  picker: {
    width: '100%',
  },
  loader: {
    padding: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
    marginRight: 10,
  },
  submitButton: {
    backgroundColor: '#2F4EAA',
    marginLeft: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});