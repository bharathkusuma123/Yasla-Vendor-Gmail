import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';

const BankDetailsForm = ({ route, navigation }) => {
  const { salonId, existingBankDetails, onSaveSuccess } = route.params;
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    salon_id: salonId,
    account_holder_name: '',
    bank_name: '',
    account_number: '',
    ifsc_code: '',
    upi_id: ''
  });

//   useEffect(() => {
//     if (existingBankDetails) {
//       setFormData({
//         salon_id: salonId,
//         account_holder_name: existingBankDetails.account_holder_name || '',
//         bank_name: existingBankDetails.bank_name || '',
//         account_number: existingBankDetails.account_number || '',
//         ifsc_code: existingBankDetails.ifsc_code || '',
//         upi_id: existingBankDetails.upi_id || ''
//       });
//     }
//   }, [existingBankDetails]);

useEffect(() => {
  setFormData({
    salon_id: salonId,
    account_holder_name: '',
    bank_name: '',
    account_number: '',
    ifsc_code: '',
    upi_id: ''
  });
}, []);


  const handleSubmit = async () => {
    if (!formData.account_holder_name || !formData.bank_name || !formData.account_number || !formData.ifsc_code) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
     await axios.post('https://yaslaservice.com:81/bank-details/', formData);

      onSaveSuccess();
      navigation.goBack();
      Alert.alert('Success', 'Bank details saved successfully');
    } catch (error) {
      console.error('Error saving bank details:', error);
      Alert.alert('Error', 'Failed to save bank details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        {existingBankDetails ? 'Update Bank Details' : 'Add Bank Details'}
      </Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Account Holder Name*</Text>
        <TextInput
          style={styles.input}
          value={formData.account_holder_name}
          onChangeText={(text) => setFormData({...formData, account_holder_name: text})}
          placeholder="Enter account holder name"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Bank Name*</Text>
        <TextInput
          style={styles.input}
          value={formData.bank_name}
          onChangeText={(text) => setFormData({...formData, bank_name: text})}
          placeholder="Enter bank name"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Account Number*</Text>
        <TextInput
          style={styles.input}
          value={formData.account_number}
          onChangeText={(text) => setFormData({...formData, account_number: text})}
          placeholder="Enter account number"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>IFSC Code*</Text>
        <TextInput
          style={styles.input}
          value={formData.ifsc_code}
          onChangeText={(text) => setFormData({...formData, ifsc_code: text})}
          placeholder="Enter IFSC code"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>UPI ID (Optional)</Text>
        <TextInput
          style={styles.input}
          value={formData.upi_id}
          onChangeText={(text) => setFormData({...formData, upi_id: text})}
          placeholder="Enter UPI ID"
        />
      </View>

      <TouchableOpacity 
        style={styles.saveButton} 
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>Save Bank Details</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default BankDetailsForm;