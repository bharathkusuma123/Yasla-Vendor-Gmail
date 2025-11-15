import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, ScrollView } from 'react-native';

const AddFormModal = ({ onClose }) => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
  });

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = () => {
    console.log('Form Submitted:', form);
    onClose();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add User</Text>

      <TextInput
        placeholder="Full Name"
        style={styles.input}
        value={form.fullName}
        onChangeText={(text) => handleChange('fullName', text)}
      />
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={form.email}
        onChangeText={(text) => handleChange('email', text)}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Phone"
        style={styles.input}
        value={form.phone}
        onChangeText={(text) => handleChange('phone', text)}
        keyboardType="phone-pad"
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        value={form.password}
        onChangeText={(text) => handleChange('password', text)}
        secureTextEntry
      />

      <View style={styles.buttonGroup}>
        <Button title="Submit" color="#4CAF50" onPress={handleSubmit} />
        <Button title="Cancel" color="gray" onPress={onClose} />
      </View>
    </ScrollView>
  );
};

export default AddFormModal;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#4CAF50',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  buttonGroup: {
    marginTop: 20,
  },
});
