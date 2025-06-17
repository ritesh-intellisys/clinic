import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Ionicons, Entypo, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

export default function AdminDashboard() {
  return (
    <View style={styles.page}>
      {/* Sidebar */}
      <View style={styles.sidebar}>
        <Text style={styles.logo}>🧬</Text>
        <Text style={styles.sidebarTitle}>MediLab</Text>

        <View style={styles.sidebarItem}>
          <Entypo name="bar-graph" size={20} color="#fff" />
          <Text style={styles.sidebarText}>Dashboard</Text>
        </View>
        <View style={styles.sidebarItem}>
          <Ionicons name="people" size={20} color="#fff" />
          <Text style={styles.sidebarText}>Patients</Text>
        </View>
        <View style={styles.sidebarItem}>
          <MaterialCommunityIcons name="doctor" size={20} color="#fff" />
          <Text style={styles.sidebarText}>Doctors</Text>
        </View>
        <View style={styles.sidebarItem}>
          <FontAwesome5 name="hospital" size={20} color="#fff" />
          <Text style={styles.sidebarText}>Wards</Text>
        </View>
        <View style={styles.sidebarItem}>
          <MaterialCommunityIcons name="flask" size={20} color="#fff" />
          <Text style={styles.sidebarText}>Labs</Text>
        </View>
        <View style={styles.sidebarItem}>
          <FontAwesome5 name="pills" size={20} color="#fff" />
          <Text style={styles.sidebarText}>Medicines</Text>
        </View>
        <View style={styles.sidebarItem}>
          <Ionicons name="settings" size={20} color="#fff" />
          <Text style={styles.sidebarText}>Settings</Text>
        </View>
      </View>

      {/* Main content */}
      <View style={styles.main}>
        {/* Navbar */}
        <View style={styles.navbar}>
          <TouchableOpacity>
            <Entypo name="menu" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.navTitle}>MediLab Hospital</Text>
          <Text style={styles.navUser}>🔵 Prasad</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Cards */}
          <View style={styles.cardRow}>
            {['Total Patients', 'Total Doctors', 'Total Wards', 'Total Labs'].map((label, idx) => (
              <View key={idx} style={styles.card}>
                <Text style={styles.cardLabel}>{label}</Text>
                <Text style={styles.cardValue}>20</Text>
              </View>
            ))}
          </View>

          {/* Chart */}
          <Text style={styles.sectionTitle}>Patient Trends</Text>
          <LineChart
            data={{
              labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
              datasets: [{ data: [2200, 2700, 2100, 2900, 2300] }],
            }}
            width={screenWidth - 100}
            height={220}
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(72, 61, 139, ${opacity})`,
              labelColor: () => '#444',
            }}
            bezier
            style={styles.chart}
          />

          {/* Appointments */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Appointments</Text>
            <Text style={styles.viewAll}>View All</Text>
          </View>
          {['Chance Vaccaro', 'Desiree Kerter', 'Philip Bautz'].map((name, i) => (
            <View key={i} style={styles.appointmentRow}>
              <Text>{name}</Text>
              <View style={styles.buttons}>
                <TouchableOpacity style={styles.acceptBtn}><Text style={styles.btnText}>Accept</Text></TouchableOpacity>
                <TouchableOpacity style={styles.rejectBtn}><Text style={styles.btnText}>Reject</Text></TouchableOpacity>
              </View>
            </View>
          ))}

          {/* Recent Doctors */}
          <Text style={styles.sectionTitle}>Recent Doctors</Text>
          <View style={styles.tableRow}><Text>ID</Text><Text>Name</Text><Text>Status</Text></View>
          <View style={styles.tableRow}><Text>1</Text><Text>Sam</Text><Text style={styles.online}>Online</Text></View>
          <View style={styles.tableRow}><Text>2</Text><Text>John</Text><Text style={styles.offline}>Offline</Text></View>

          {/* Medicines */}
          <Text style={styles.sectionTitle}>Out of Stock Medicines</Text>
          <View style={styles.tableRow}><Text>ID</Text><Text>Name</Text><Text>Qty</Text></View>
          <View style={styles.tableRow}><Text>1</Text><Text>Panadol</Text><Text>0</Text></View>
          <View style={styles.tableRow}><Text>2</Text><Text>Azithro</Text><Text>0</Text></View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, flexDirection: 'row', backgroundColor: '#f0f2f5' },
  sidebar: {
    width: 200,
    backgroundColor: '#3c44a1',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  logo: { fontSize: 30, color: '#fff', textAlign: 'center' },
  sidebarTitle: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    marginVertical: 20,
    fontWeight: 'bold',
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    gap: 12,
  },
  sidebarText: {
    color: '#fff',
    fontSize: 16,
  },

  main: { flex: 1, padding: 15 },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  navTitle: { fontSize: 20, fontWeight: 'bold' },
  navUser: { fontSize: 16 },

  cardRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },
  cardLabel: { fontSize: 14, color: '#555' },
  cardValue: { fontSize: 20, fontWeight: 'bold' },

  chart: { borderRadius: 10, marginBottom: 20 },

  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewAll: { color: '#6c5ce7' },

  appointmentRow: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttons: { flexDirection: 'row', gap: 8 },
  acceptBtn: {
    backgroundColor: '#28a745',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginRight: 6,
  },
  rejectBtn: {
    backgroundColor: '#dc3545',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  btnText: { color: '#fff', fontSize: 12 },

  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  online: { color: 'green' },
  offline: { color: 'red' },
});
