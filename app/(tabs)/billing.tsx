import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Header from '@/components/ui/Header';
import Input from '@/components/ui/Input';
import { useAuth } from '@/contexts/AuthContext';
import {
    Calendar,
    Eye,
    Pill,
    Plus,
    Search,
    Stethoscope,
    User
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface MedicineBill {
  id: string;
  patientName: string;
  medicines: {
    name: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  totalAmount: number;
  date: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  pharmacyName: string;
}

interface HospitalBill {
  id: string;
  patientName: string;
  services: {
    type: 'Consultation' | 'Radiology' | 'Laboratory' | 'Surgery' | 'Room Charges' | 'Other';
    description: string;
    amount: number;
  }[];
  doctorFees: number;
  totalAmount: number;
  date: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  admissionDate?: string;
  dischargeDate?: string;
}

const mockMedicineBills: MedicineBill[] = [
  {
    id: '1',
    patientName: 'Ajay Nagar',
    medicines: [
      { name: 'Lisinopril 10mg', quantity: 30, unitPrice: 2.50, total: 75.00 },
      { name: 'Metformin 500mg', quantity: 60, unitPrice: 1.25, total: 75.00 },
    ],
    totalAmount: 150.00,
    date: '2024-01-15',
    status: 'Paid',
    pharmacyName: 'MediCare Pharmacy'
  },
  {
    id: '2',
    patientName: 'Ritesh Jawale',
    medicines: [
      { name: 'Albuterol Inhaler', quantity: 1, unitPrice: 45.00, total: 45.00 },
    ],
    totalAmount: 45.00,
    date: '2024-01-12',
    status: 'Pending',
    pharmacyName: 'MediCare Pharmacy'
  },
];

const mockHospitalBills: HospitalBill[] = [
  {
    id: '1',
    patientName: 'Akhay More',
    services: [
      { type: 'Consultation', description: 'General Consultation', amount: 150.00 },
      { type: 'Laboratory', description: 'Blood Test Panel', amount: 200.00 },
      { type: 'Radiology', description: 'Chest X-Ray', amount: 120.00 },
    ],
    doctorFees: 150.00,
    totalAmount: 620.00,
    date: '2024-01-10',
    status: 'Paid',
    admissionDate: '2024-01-10',
    dischargeDate: '2024-01-10'
  },
  {
    id: '2',
    patientName: 'Rani M',
    services: [
      { type: 'Surgery', description: 'Minor Surgery', amount: 2500.00 },
      { type: 'Room Charges', description: '2 Days Private Room', amount: 400.00 },
      { type: 'Laboratory', description: 'Pre-op Tests', amount: 300.00 },
    ],
    doctorFees: 800.00,
    totalAmount: 4000.00,
    date: '2024-01-08',
    status: 'Pending',
    admissionDate: '2024-01-08',
    dischargeDate: '2024-01-10'
  },
];

export default function BillingScreen() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'medicine' | 'hospital'>('medicine');
  const [medicineBills, setMedicineBills] = useState<MedicineBill[]>(mockMedicineBills);
  const [hospitalBills, setHospitalBills] = useState<HospitalBill[]>(mockHospitalBills);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMedicineBill, setSelectedMedicineBill] = useState<MedicineBill | null>(null);
  const [selectedHospitalBill, setSelectedHospitalBill] = useState<HospitalBill | null>(null);
  const [showNewMedicineBill, setShowNewMedicineBill] = useState(false);
  const [showNewHospitalBill, setShowNewHospitalBill] = useState(false);

  const [newMedicineBill, setNewMedicineBill] = useState({
    patientName: '',
    medicines: [{ name: '', quantity: 1, unitPrice: 0 }],
    pharmacyName: 'MediCare Pharmacy',
  });

  const [newHospitalBill, setNewHospitalBill] = useState({
    patientName: '',
    services: [{ type: 'Consultation' as const, description: '', amount: 0 }],
    doctorFees: 0,
    admissionDate: '',
    dischargeDate: '',
  });

  const filteredMedicineBills = user?.role === 'patient' 
    ? medicineBills.filter(b => b.patientName === user.name)
    : medicineBills.filter(b => 
        b.patientName.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const filteredHospitalBills = user?.role === 'patient' 
    ? hospitalBills.filter(b => b.patientName === user.name)
    : hospitalBills.filter(b => 
        b.patientName.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return '#2E7D32';
      case 'Pending': return '#F57C00';
      case 'Overdue': return '#D32F2F';
      default: return '#666';
    }
  };

  const handleAddMedicine = () => {
    setNewMedicineBill({
      ...newMedicineBill,
      medicines: [...newMedicineBill.medicines, { name: '', quantity: 1, unitPrice: 0 }]
    });
  };

  const handleAddService = () => {
    setNewHospitalBill({
      ...newHospitalBill,
      services: [...newHospitalBill.services, { type: 'Consultation', description: '', amount: 0 }]
    });
  };

  const handleCreateMedicineBill = () => {
    if (!newMedicineBill.patientName || newMedicineBill.medicines.some(m => !m.name)) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const medicines = newMedicineBill.medicines.map(m => ({
      ...m,
      total: m.quantity * m.unitPrice
    }));

    const totalAmount = medicines.reduce((sum, m) => sum + m.total, 0);

    const bill: MedicineBill = {
      id: Date.now().toString(),
      patientName: newMedicineBill.patientName,
      medicines,
      totalAmount,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      pharmacyName: newMedicineBill.pharmacyName
    };

    setMedicineBills([bill, ...medicineBills]);
    setNewMedicineBill({
      patientName: '',
      medicines: [{ name: '', quantity: 1, unitPrice: 0 }],
      pharmacyName: 'MediCare Pharmacy',
    });
    setShowNewMedicineBill(false);
    Alert.alert('Success', 'Medicine bill created successfully');
  };

  const handleCreateHospitalBill = () => {
    if (!newHospitalBill.patientName || newHospitalBill.services.some(s => !s.description)) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const totalAmount = newHospitalBill.services.reduce((sum, s) => sum + s.amount, 0) + newHospitalBill.doctorFees;

    const bill: HospitalBill = {
      id: Date.now().toString(),
      patientName: newHospitalBill.patientName,
      services: newHospitalBill.services,
      doctorFees: newHospitalBill.doctorFees,
      totalAmount,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      admissionDate: newHospitalBill.admissionDate,
      dischargeDate: newHospitalBill.dischargeDate
    };

    setHospitalBills([bill, ...hospitalBills]);
    setNewHospitalBill({
      patientName: '',
      services: [{ type: 'Consultation', description: '', amount: 0 }],
      doctorFees: 0,
      admissionDate: '',
      dischargeDate: '',
    });
    setShowNewHospitalBill(false);
    Alert.alert('Success', 'Hospital bill created successfully');
  };

  const canCreateBills = user?.role === 'receptionist' || user?.role === 'doctor';

  return (
    <View style={styles.container}>
      <Header 
        title="Billing" 
        subtitle={`Rs.{activeTab === 'medicine' ? filteredMedicineBills.length : filteredHospitalBills.length} bills`}
        rightComponent={
          canCreateBills ? (
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => activeTab === 'medicine' ? setShowNewMedicineBill(true) : setShowNewHospitalBill(true)}
            >
              <Plus size={20} color="#fff" />
            </TouchableOpacity>
          ) : null
        }
      />

      <View style={styles.content}>
        {/* Tab Selector */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'medicine' && styles.activeTab]}
            onPress={() => setActiveTab('medicine')}
          >
            <Pill size={20} color={activeTab === 'medicine' ? '#fff' : '#1976D2'} />
            <Text style={[styles.tabText, activeTab === 'medicine' && styles.activeTabText]}>
              Medicine Bills
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'hospital' && styles.activeTab]}
            onPress={() => setActiveTab('hospital')}
          >
            <Stethoscope size={20} color={activeTab === 'hospital' ? '#fff' : '#1976D2'} />
            <Text style={[styles.tabText, activeTab === 'hospital' && styles.activeTabText]}>
              Hospital Bills
            </Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        {user?.role !== 'patient' && (
          <View style={styles.searchContainer}>
            <Search size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search bills..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        )}

        {/* Bills List */}
        <ScrollView style={styles.billsList} showsVerticalScrollIndicator={false}>
          {activeTab === 'medicine' ? (
            filteredMedicineBills.map((bill) => (
              <Card key={bill.id} style={styles.billCard}>
                <View style={styles.billHeader}>
                  <View style={styles.billInfo}>
                    <View style={styles.billIcon}>
                      <Pill size={24} color="#1976D2" />
                    </View>
                    <View style={styles.billDetails}>
                      <Text style={styles.patientName}>
                        {user?.role === 'patient' ? bill.pharmacyName : bill.patientName}
                      </Text>
                      <Text style={styles.billMeta}>
                        {bill.medicines.length} medicine{bill.medicines.length > 1 ? 's' : ''}
                      </Text>
                      <View style={styles.billFooter}>
                        <Calendar size={12} color="#666" />
                        <Text style={styles.metaText}>{bill.date}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(bill.status) + '20' }]}>
                          <Text style={[styles.statusText, { color: getStatusColor(bill.status) }]}>
                            {bill.status}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View style={styles.billAmount}>
                    <Text style={styles.amountText}>Rs.{bill.totalAmount.toFixed(2)}</Text>
                    <TouchableOpacity 
                      style={styles.viewButton}
                      onPress={() => setSelectedMedicineBill(bill)}
                    >
                      <Eye size={18} color="#1976D2" />
                    </TouchableOpacity>
                  </View>
                </View>
              </Card>
            ))
          ) : (
            filteredHospitalBills.map((bill) => (
              <Card key={bill.id} style={styles.billCard}>
                <View style={styles.billHeader}>
                  <View style={styles.billInfo}>
                    <View style={styles.billIcon}>
                      <Stethoscope size={24} color="#2E7D32" />
                    </View>
                    <View style={styles.billDetails}>
                      <Text style={styles.patientName}>{bill.patientName}</Text>
                      <Text style={styles.billMeta}>
                        {bill.services.length} service{bill.services.length > 1 ? 's' : ''} + Doctor fees
                      </Text>
                      <View style={styles.billFooter}>
                        <Calendar size={12} color="#666" />
                        <Text style={styles.metaText}>{bill.date}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(bill.status) + '20' }]}>
                          <Text style={[styles.statusText, { color: getStatusColor(bill.status) }]}>
                            {bill.status}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View style={styles.billAmount}>
                    <Text style={styles.amountText}>Rs.{bill.totalAmount.toFixed(2)}</Text>
                    <TouchableOpacity 
                      style={styles.viewButton}
                      onPress={() => setSelectedHospitalBill(bill)}
                    >
                      <Eye size={18} color="#1976D2" />
                    </TouchableOpacity>
                  </View>
                </View>
              </Card>
            ))
          )}
        </ScrollView>
      </View>

      {/* Medicine Bill Details Modal */}
      <Modal
        visible={!!selectedMedicineBill}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        {selectedMedicineBill && (
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Medicine Bill Details</Text>
              <TouchableOpacity onPress={() => setSelectedMedicineBill(null)}>
                <Text style={styles.cancelButton}>Close</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent}>
              <Card style={styles.detailsCard}>
                <View style={styles.detailRow}>
                  <User size={20} color="#666" />
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Patient</Text>
                    <Text style={styles.detailValue}>{selectedMedicineBill.patientName}</Text>
                  </View>
                </View>
                <View style={styles.detailRow}>
                  <Calendar size={20} color="#666" />
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Date</Text>
                    <Text style={styles.detailValue}>{selectedMedicineBill.date}</Text>
                  </View>
                </View>
                <View style={styles.detailRow}>
                  <Pill size={20} color="#666" />
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Pharmacy</Text>
                    <Text style={styles.detailValue}>{selectedMedicineBill.pharmacyName}</Text>
                  </View>
                </View>
              </Card>

              <Text style={styles.sectionTitle}>Medicines</Text>
              {selectedMedicineBill.medicines.map((medicine, index) => (
                <Card key={index} style={styles.itemCard}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemName}>{medicine.name}</Text>
                    <Text style={styles.itemTotal}>Rs.{medicine.total.toFixed(2)}</Text>
                  </View>
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemDetail}>Quantity: {medicine.quantity}</Text>
                    <Text style={styles.itemDetail}>Unit Price: Rs.{medicine.unitPrice.toFixed(2)}</Text>
                  </View>
                </Card>
              ))}

              <Card style={styles.totalCard}>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total Amount</Text>
                  <Text style={styles.totalAmount}>Rs.{selectedMedicineBill.totalAmount.toFixed(2)}</Text>
                </View>
                <View style={styles.statusContainer}>
                  <Text style={styles.statusLabel}>Status</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedMedicineBill.status) + '20' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(selectedMedicineBill.status) }]}>
                      {selectedMedicineBill.status}
                    </Text>
                  </View>
                </View>
              </Card>
            </ScrollView>
          </View>
        )}
      </Modal>

      {/* Hospital Bill Details Modal */}
      <Modal
        visible={!!selectedHospitalBill}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        {selectedHospitalBill && (
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Hospital Bill Details</Text>
              <TouchableOpacity onPress={() => setSelectedHospitalBill(null)}>
                <Text style={styles.cancelButton}>Close</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent}>
              <Card style={styles.detailsCard}>
                <View style={styles.detailRow}>
                  <User size={20} color="#666" />
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Patient</Text>
                    <Text style={styles.detailValue}>{selectedHospitalBill.patientName}</Text>
                  </View>
                </View>
                <View style={styles.detailRow}>
                  <Calendar size={20} color="#666" />
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Bill Date</Text>
                    <Text style={styles.detailValue}>{selectedHospitalBill.date}</Text>
                  </View>
                </View>
                {selectedHospitalBill.admissionDate && (
                  <View style={styles.detailRow}>
                    <Calendar size={20} color="#666" />
                    <View style={styles.detailContent}>
                      <Text style={styles.detailLabel}>Admission - Discharge</Text>
                      <Text style={styles.detailValue}>
                        {selectedHospitalBill.admissionDate} - {selectedHospitalBill.dischargeDate}
                      </Text>
                    </View>
                  </View>
                )}
              </Card>

              <Text style={styles.sectionTitle}>Services</Text>
              {selectedHospitalBill.services.map((service, index) => (
                <Card key={index} style={styles.itemCard}>
                  <View style={styles.itemHeader}>
                    <View>
                      <Text style={styles.itemName}>{service.description}</Text>
                      <Text style={styles.serviceType}>{service.type}</Text>
                    </View>
                    <Text style={styles.itemTotal}>Rs.{service.amount.toFixed(2)}</Text>
                  </View>
                </Card>
              ))}

              <Card style={styles.itemCard}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemName}>Doctor Fees</Text>
                  <Text style={styles.itemTotal}>Rs.{selectedHospitalBill.doctorFees.toFixed(2)}</Text>
                </View>
              </Card>

              <Card style={styles.totalCard}>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total Amount</Text>
                  <Text style={styles.totalAmount}>Rs.{selectedHospitalBill.totalAmount.toFixed(2)}</Text>
                </View>
                <View style={styles.statusContainer}>
                  <Text style={styles.statusLabel}>Status</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedHospitalBill.status) + '20' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(selectedHospitalBill.status) }]}>
                      {selectedHospitalBill.status}
                    </Text>
                  </View>
                </View>
              </Card>
            </ScrollView>
          </View>
        )}
      </Modal>

      {/* New Medicine Bill Modal */}
      <Modal
        visible={showNewMedicineBill}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>New Medicine Bill</Text>
            <TouchableOpacity onPress={() => setShowNewMedicineBill(false)}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <Input
              placeholder="Patient Name *"
              value={newMedicineBill.patientName}
              onChangeText={(text) => setNewMedicineBill({...newMedicineBill, patientName: text})}
            />
            
            <Input
              placeholder="Pharmacy Name"
              value={newMedicineBill.pharmacyName}
              onChangeText={(text) => setNewMedicineBill({...newMedicineBill, pharmacyName: text})}
            />

            <Text style={styles.sectionTitle}>Medicines</Text>
            {newMedicineBill.medicines.map((medicine, index) => (
              <Card key={index} style={styles.medicineCard}>
                <View style={styles.medicineHeader}>
                  <Text style={styles.medicineIndex}>Medicine {index + 1}</Text>
                  {newMedicineBill.medicines.length > 1 && (
                    <TouchableOpacity onPress={() => {
                      const updatedMedicines = newMedicineBill.medicines.filter((_, i) => i !== index);
                      setNewMedicineBill({ ...newMedicineBill, medicines: updatedMedicines });
                    }}>
                      <Text style={styles.removeButton}>Remove</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <Input
                  placeholder="Medicine Name *"
                  value={medicine.name}
                  onChangeText={(text) => {
                    const updatedMedicines = [...newMedicineBill.medicines];
                    updatedMedicines[index] = { ...updatedMedicines[index], name: text };
                    setNewMedicineBill({ ...newMedicineBill, medicines: updatedMedicines });
                  }}
                />
                <View style={styles.medicineRow}>
                  <Input
                    placeholder="Quantity"
                    value={medicine.quantity.toString()}
                    onChangeText={(text) => {
                      const updatedMedicines = [...newMedicineBill.medicines];
                      updatedMedicines[index] = { ...updatedMedicines[index], quantity: parseInt(text) || 1 };
                      setNewMedicineBill({ ...newMedicineBill, medicines: updatedMedicines });
                    }}
                    keyboardType="numeric"
                  />
                  <Input
                    placeholder="Unit Price"
                    value={medicine.unitPrice.toString()}
                    onChangeText={(text) => {
                      const updatedMedicines = [...newMedicineBill.medicines];
                      updatedMedicines[index] = { ...updatedMedicines[index], unitPrice: parseFloat(text) || 0 };
                      setNewMedicineBill({ ...newMedicineBill, medicines: updatedMedicines });
                    }}
                    keyboardType="numeric"
                  />
                </View>
                <Text style={styles.medicineTotal}>
                  Total: Rs.{(medicine.quantity * medicine.unitPrice).toFixed(2)}
                </Text>
              </Card>
            ))}

            <TouchableOpacity style={styles.addItemButton} onPress={handleAddMedicine}>
              <Plus size={20} color="#1976D2" />
              <Text style={styles.addItemText}>Add Another Medicine</Text>
            </TouchableOpacity>
            
            <Button
              title="Create Medicine Bill"
              onPress={handleCreateMedicineBill}
              style={styles.createButton}
            />
          </ScrollView>
        </View>
      </Modal>

      {/* New Hospital Bill Modal */}
      <Modal
        visible={showNewHospitalBill}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>New Hospital Bill</Text>
            <TouchableOpacity onPress={() => setShowNewHospitalBill(false)}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <Input
              placeholder="Patient Name *"
              value={newHospitalBill.patientName}
              onChangeText={(text) => setNewHospitalBill({...newHospitalBill, patientName: text})}
            />
            
            <View style={styles.dateRow}>
              <Input
                placeholder="Admission Date"
                value={newHospitalBill.admissionDate}
                onChangeText={(text) => setNewHospitalBill({...newHospitalBill, admissionDate: text})}
              />
              <Input
                placeholder="Discharge Date"
                value={newHospitalBill.dischargeDate}
                onChangeText={(text) => setNewHospitalBill({...newHospitalBill, dischargeDate: text})}
              />
            </View>

            <Text style={styles.sectionTitle}>Services</Text>
            {newHospitalBill.services.map((service, index) => (
              <Card key={index} style={styles.serviceCard}>
                <View style={styles.serviceHeader}>
                  <Text style={styles.serviceIndex}>Service {index + 1}</Text>
                  {newHospitalBill.services.length > 1 && (
                    <TouchableOpacity onPress={() => {
                      const updatedServices = newHospitalBill.services.filter((_, i) => i !== index);
                      setNewHospitalBill({ ...newHospitalBill, services: updatedServices });
                    }}>
                      <Text style={styles.removeButton}>Remove</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <Input
                  placeholder="Service Description *"
                  value={service.description}
                  onChangeText={(text) => {
                    const updatedServices = [...newHospitalBill.services];
                    updatedServices[index] = { ...updatedServices[index], description: text };
                    setNewHospitalBill({ ...newHospitalBill, services: updatedServices });
                  }}
                />
                <Input
                  placeholder="Amount"
                  value={service.amount.toString()}
                  onChangeText={(text) => {
                    const updatedServices = [...newHospitalBill.services];
                    updatedServices[index] = { ...updatedServices[index], amount: parseFloat(text) || 0 };
                    setNewHospitalBill({ ...newHospitalBill, services: updatedServices });
                  }}
                  keyboardType="numeric"
                />
              </Card>
            ))}

            <TouchableOpacity style={styles.addItemButton} onPress={handleAddService}>
              <Plus size={20} color="#1976D2" />
              <Text style={styles.addItemText}>Add Another Service</Text>
            </TouchableOpacity>

            <Input
              placeholder="Doctor Fees"
              value={newHospitalBill.doctorFees.toString()}
              onChangeText={(text) => setNewHospitalBill({...newHospitalBill, doctorFees: parseFloat(text) || 0})}
              keyboardType="numeric"
            />
            
            <Button
              title="Create Hospital Bill"
              onPress={handleCreateHospitalBill}
              style={styles.createButton}
            />
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  addButton: {
    backgroundColor: '#1976D2',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#1976D2',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: '#1976D2',
    marginLeft: 8,
  },
  activeTabText: {
    color: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: '#1a1a1a',
  },
  billsList: {
    flex: 1,
  },
  billCard: {
    marginBottom: 12,
    padding: 16,
  },
  billHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  billInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  billIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  billDetails: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  billMeta: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    color: '#666',
    marginBottom: 8,
  },
  billFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    color: '#666',
    marginLeft: 6,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontFamily: 'Roboto-Medium',
  },
  billAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  viewButton: {
    padding: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    color: '#1a1a1a',
  },
  cancelButton: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: '#1976D2',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  detailsCard: {
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailContent: {
    marginLeft: 16,
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    color: '#666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: '#1a1a1a',
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: '#1a1a1a',
    marginBottom: 12,
    marginTop: 8,
  },
  itemCard: {
    marginBottom: 12,
    backgroundColor: '#f8f9fa',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 14,
    fontFamily: 'Roboto-Bold',
    color: '#1a1a1a',
  },
  itemTotal: {
    fontSize: 14,
    fontFamily: 'Roboto-Bold',
    color: '#1976D2',
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemDetail: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    color: '#666',
  },
  serviceType: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    color: '#1976D2',
    marginTop: 2,
  },
  totalCard: {
    backgroundColor: '#E3F2FD',
    marginBottom: 32,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: '#1976D2',
  },
  totalAmount: {
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    color: '#1976D2',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: '#1a1a1a',
  },
  medicineCard: {
    marginBottom: 16,
    backgroundColor: '#f8f9fa',
  },
  medicineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  medicineIndex: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: '#1976D2',
  },
  removeButton: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: '#D32F2F',
  },
  medicineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  medicineTotal: {
    fontSize: 14,
    fontFamily: 'Roboto-Bold',
    color: '#1976D2',
    textAlign: 'right',
    marginTop: 8,
  },
  serviceCard: {
    marginBottom: 16,
    backgroundColor: '#f8f9fa',
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceIndex: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: '#1976D2',
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  addItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: '#1976D2',
    borderStyle: 'dashed',
    borderRadius: 12,
    marginBottom: 16,
  },
  addItemText: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: '#1976D2',
    marginLeft: 8,
  },
  createButton: {
    marginTop: 24,
    marginBottom: 32,
  },
});