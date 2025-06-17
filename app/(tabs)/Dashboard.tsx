import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from 'expo-router';
import type { NavigationProp } from '@react-navigation/native';
const Dashboard = () => {
  const navigation = useNavigation<NavigationProp<any>>();

  const features = [
    { name: 'Patients', route: 'Patients' },
    { name: 'Appointments', route: 'Appointments' },
    { name: 'Doctors', route: 'Doctors' },
    { name: 'Prescriptions', route: 'Prescriptions' },
    { name: 'Reports', route: 'Reports' },
    { name: 'Video Call', route: 'VideoCall' },
    { name: 'EMR', route: 'EMR' },
    { name: 'Notifications', route: 'Notifications' },
    { name: 'Settings', route: 'Settings' },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🏥 Hospital Dashboard</Text>
      <View style={styles.grid}>
        {features.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => navigation.navigate(item.route)}
          >
            <Text style={styles.cardText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingHorizontal: 20,
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    height: 100,
    backgroundColor: '#00b4d8',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Dashboard;
