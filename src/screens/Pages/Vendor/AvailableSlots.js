import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AvailableSlots = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Available Slots</Text>
    </View>
  );
};

export default AvailableSlots;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 20,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
});
