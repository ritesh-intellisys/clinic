import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function UploadFiles() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Upload Prescription</Text>
      <Button title="Upload File (PDF/IMG)" onPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { fontSize: 24, marginBottom: 20 },
});