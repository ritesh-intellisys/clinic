import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TextInput, Button } from 'react-native';

export default function App() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>OrthoCare Hospital</Text>
        <View style={styles.nav}>
          <Text style={styles.navItem}>Home</Text>
          <Text style={styles.navItem}>Appointment</Text>
          <Text style={styles.navItem}>Doctors</Text>
          <Text style={styles.navItem}>About</Text>
          <Text style={styles.navItem}>Contact</Text>
        </View>
      </View>

      {/* Hero Section */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>We help people to get appointment in online</Text>
        <Text style={styles.heroDesc}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero.
        </Text>
        <Image source={require('../../assets/images/hero.png')} style={styles.heroImage} />
      </View>

      {/* Who We Are */}
      <View style={styles.about}>
        <Image source={require('../../assets/images/about.png')} style={styles.aboutImage} />
        <View style={styles.aboutText}>
          <Text style={styles.aboutTitle}>Who We Are</Text>
          <Text style={styles.aboutDesc}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, nisl eget consectetur.
          </Text>
        </View>
      </View>

      {/* Services Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Services</Text>
        <View style={styles.cardRow}>
          {['NEUROLOGISTS', 'NEPHROLOGISTS', 'MICROBIOLOGISTS'].map((service, i) => (
            <View style={styles.serviceCard} key={i}>
              <Image source={require('../../assets/images/service.png')} style={styles.serviceImg} />
              <Text style={styles.serviceText}>{service}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Doctors Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Doctors</Text>
        <View style={styles.grid}>
          {Array.from({ length: 9 }).map((_, i) => (
            <View key={i} style={styles.doctorCard}>
              {/* <Image source={require('./assets/doctor.png')} style={styles.doctorImg} /> */}
              <Text>Dr. Name</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Contact Form */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Send us a message</Text>
        <TextInput placeholder="First Name" style={styles.input} />
        <TextInput placeholder="Last Name" style={styles.input} />
        <TextInput placeholder="Mobile Number" style={styles.input} keyboardType="phone-pad" />
        <TextInput placeholder="Email" style={styles.input} keyboardType="email-address" />
        <TextInput placeholder="Message" style={[styles.input, { height: 100 }]} multiline />
        <Button title="Send" color="#6C63FF" />
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 OrthoCare Hospital</Text>
        <Text style={styles.footerLinks}>Quick Links · Home · About · Services · Contact</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  header: { padding: 20, backgroundColor: '#f5f5f5' },
  logo: { fontSize: 20, fontWeight: 'bold' },
  nav: { flexDirection: 'row', marginTop: 10, flexWrap: 'wrap' },
  navItem: { marginHorizontal: 8, color: '#333' },

  hero: { padding: 20, alignItems: 'center' },
  heroTitle: { fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
  heroDesc: { marginVertical: 10, textAlign: 'center', color: '#666' },
  heroImage: { width: 400, height: 400, resizeMode: 'contain' },

  about: { flexDirection: 'row', padding: 20, alignItems: 'center' },
  aboutImage: { width: 120, height: 120, resizeMode: 'contain', marginRight: 15 },
  aboutText: { flex: 1 },
  aboutTitle: { fontSize: 20, fontWeight: 'bold' },
  aboutDesc: { color: '#666' },

  section: { padding: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },

  cardRow: { flexDirection: 'row', justifyContent: 'space-around' },
  serviceCard: { alignItems: 'center' },
  serviceImg: { width: 80, height: 80, marginBottom: 5 },
  serviceText: { fontSize: 14, fontWeight: '500' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  doctorCard: { width: '30%', alignItems: 'center', marginVertical: 10 },
  doctorImg: { width: 60, height: 60, borderRadius: 30, marginBottom: 5 },

  input: {
    borderWidth: 1, borderColor: '#ccc',
    borderRadius: 6, padding: 10,
    marginBottom: 10
  },

  footer: { padding: 20, backgroundColor: '#f1f1f1', alignItems: 'center' },
  footerText: { marginBottom: 5 },
  footerLinks: { fontSize: 12, color: 'gray' },
});
