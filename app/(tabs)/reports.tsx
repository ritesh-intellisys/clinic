import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Header from '@/components/ui/Header';
import Input from '@/components/ui/Input';
import { useAuth } from '@/contexts/AuthContext';
import * as DocumentPicker from 'expo-document-picker';
import {
    Calendar,
    Eye,
    FileText,
    Upload,
    User
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface Report {
  id: string;
  patientName: string;
  reportType: string;
  fileName: string;
  uploadDate: string;
  uploadedBy: string;
  fileSize: string;
  status: 'Pending' | 'Reviewed' | 'Archived';
}

const mockReports: Report[] = [
  {
    id: '1',
    patientName: 'Ajay Nagar',
    reportType: 'Blood Test',
    fileName: 'blood_test_john_smith.pdf',
    uploadDate: '2024-01-15',
    uploadedBy: 'Ritesh Jawale',
    fileSize: '2.3 MB',
    status: 'Reviewed'
  },
  {
    id: '2',
    patientName: 'Ritesh Jawale',
    reportType: 'X-Ray',
    fileName: 'chest_xray_Ritesh.jpg',
    uploadDate: '2024-01-12',
    uploadedBy: 'Ritesh Jawale',
    fileSize: '4.1 MB',
    status: 'Pending'
  },
  {
    id: '3',
    patientName: 'Akhay More',
    reportType: 'MRI Scan',
    fileName: 'brain_mri_michael.pdf',
    uploadDate: '2024-01-10',
    uploadedBy: 'Ritesh Jawale',
    fileSize: '15.7 MB',
    status: 'Reviewed'
  },
];

export default function ReportsScreen() {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [uploadData, setUploadData] = useState({
    patientName: '',
    reportType: '',
    selectedFile: null as any,
  });

  const filteredReports = user?.role === 'patient' 
    ? reports.filter(r => r.patientName === user.name)
    : reports;

  const handleFilePicker = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        setUploadData({
          ...uploadData,
          selectedFile: result.assets[0]
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick file');
    }
  };

  const handleUploadReport = () => {
    if (!uploadData.patientName || !uploadData.reportType || !uploadData.selectedFile) {
      Alert.alert('Error', 'Please fill in all fields and select a file');
      return;
    }

    const newReport: Report = {
      id: Date.now().toString(),
      patientName: uploadData.patientName,
      reportType: uploadData.reportType,
      fileName: uploadData.selectedFile.name,
      uploadDate: new Date().toISOString().split('T')[0],
      uploadedBy: user?.name || 'Unknown',
      fileSize: `Rs.{(uploadData.selectedFile.size / (1024 * 1024)).toFixed(1)} MB`,
      status: 'Pending'
    };

    setReports([newReport, ...reports]);
    setUploadData({
      patientName: '',
      reportType: '',
      selectedFile: null,
    });
    setShowUploadModal(false);
    Alert.alert('Success', 'Report uploaded successfully');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return '#F57C00';
      case 'Reviewed': return '#2E7D32';
      case 'Archived': return '#666';
      default: return '#666';
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    return extension === 'pdf' ? FileText : FileText;
  };

  const canUpload = user?.role === 'receptionist';

  return (
    <View style={styles.container}>
      <Header 
        title="Lab Reports" 
        subtitle={`Rs.{filteredReports.length} reports`}
        rightComponent={
          canUpload ? (
            <TouchableOpacity 
              style={styles.uploadButton}
              onPress={() => setShowUploadModal(true)}
            >
              <Upload size={20} color="#fff" />
            </TouchableOpacity>
          ) : null
        }
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredReports.map((report) => {
          const FileIcon = getFileIcon(report.fileName);
          return (
            <Card key={report.id} style={styles.reportCard}>
              <View style={styles.reportHeader}>
                <View style={styles.reportInfo}>
                  <View style={styles.fileIcon}>
                    <FileIcon size={24} color="#1976D2" />
                  </View>
                  <View style={styles.reportDetails}>
                    <Text style={styles.reportType}>{report.reportType}</Text>
                    <Text style={styles.patientName}>
                      {user?.role === 'patient' ? `Uploaded by Rs.{report.uploadedBy}` : report.patientName}
                    </Text>
                    <View style={styles.reportMeta}>
                      <Calendar size={12} color="#666" />
                      <Text style={styles.metaText}>{report.uploadDate}</Text>
                      <Text style={styles.metaText}>• {report.fileSize}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.reportActions}>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(report.status) + '20' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(report.status) }]}>
                      {report.status}
                    </Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => setSelectedReport(report)}
                  >
                    <Eye size={18} color="#1976D2" />
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.fileName}>
                <Text style={styles.fileNameText}>{report.fileName}</Text>
              </View>
            </Card>
          );
        })}

        {filteredReports.length === 0 && (
          <View style={styles.emptyState}>
            <FileText size={48} color="#ccc" />
            <Text style={styles.emptyTitle}>No Reports Found</Text>
            <Text style={styles.emptySubtitle}>
              {canUpload ? 'Upload your first lab report to get started' : 'No lab reports available yet'}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Upload Report Modal */}
      <Modal
        visible={showUploadModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Upload Lab Report</Text>
            <TouchableOpacity onPress={() => setShowUploadModal(false)}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <Input
              placeholder="Patient Name *"
              value={uploadData.patientName}
              onChangeText={(text) => setUploadData({...uploadData, patientName: text})}
            />
            
            <Input
              placeholder="Report Type (e.g., Blood Test, X-Ray) *"
              value={uploadData.reportType}
              onChangeText={(text) => setUploadData({...uploadData, reportType: text})}
            />

            <TouchableOpacity style={styles.filePicker} onPress={handleFilePicker}>
              <Upload size={24} color="#1976D2" />
              <View style={styles.filePickerContent}>
                <Text style={styles.filePickerTitle}>
                  {uploadData.selectedFile ? 'File Selected' : 'Select File'}
                </Text>
                <Text style={styles.filePickerSubtitle}>
                  {uploadData.selectedFile 
                    ? uploadData.selectedFile.name 
                    : 'PDF, JPG, PNG files supported'
                  }
                </Text>
              </View>
            </TouchableOpacity>

            <Button
              title="Upload Report"
              onPress={handleUploadReport}
              style={styles.uploadReportButton}
            />
          </ScrollView>
        </View>
      </Modal>

      {/* Report Details Modal */}
      <Modal
        visible={!!selectedReport}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        {selectedReport && (
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Report Details</Text>
              <TouchableOpacity onPress={() => setSelectedReport(null)}>
                <Text style={styles.cancelButton}>Close</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent}>
              <Card style={styles.detailsCard}>
                <View style={styles.detailsHeader}>
                  <View style={styles.detailsIcon}>
                    <FileText size={32} color="#1976D2" />
                  </View>
                  <View style={styles.detailsInfo}>
                    <Text style={styles.detailsTitle}>{selectedReport.reportType}</Text>
                    <Text style={styles.detailsSubtitle}>{selectedReport.fileName}</Text>
                  </View>
                </View>

                <View style={styles.detailsGrid}>
                  <View style={styles.detailItem}>
                    <User size={20} color="#666" />
                    <View style={styles.detailContent}>
                      <Text style={styles.detailLabel}>Patient</Text>
                      <Text style={styles.detailValue}>{selectedReport.patientName}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.detailItem}>
                    <Calendar size={20} color="#666" />
                    <View style={styles.detailContent}>
                      <Text style={styles.detailLabel}>Upload Date</Text>
                      <Text style={styles.detailValue}>{selectedReport.uploadDate}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.detailItem}>
                    <User size={20} color="#666" />
                    <View style={styles.detailContent}>
                      <Text style={styles.detailLabel}>Uploaded By</Text>
                      <Text style={styles.detailValue}>{selectedReport.uploadedBy}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.detailItem}>
                    <FileText size={20} color="#666" />
                    <View style={styles.detailContent}>
                      <Text style={styles.detailLabel}>File Size</Text>
                      <Text style={styles.detailValue}>{selectedReport.fileSize}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.statusContainer}>
                  <Text style={styles.statusLabel}>Status</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedReport.status) + '20' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(selectedReport.status) }]}>
                      {selectedReport.status}
                    </Text>
                  </View>
                </View>
              </Card>

              <Button
                title="Download Report"
                onPress={() => Alert.alert('Download', 'Download functionality would be implemented here')}
                style={styles.downloadButton}
              />
            </ScrollView>
          </View>
        )}
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
  uploadButton: {
    backgroundColor: '#1976D2',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reportCard: {
    marginBottom: 12,
    padding: 16,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reportInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  fileIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  reportDetails: {
    flex: 1,
  },
  reportType: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  patientName: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: '#666',
    marginBottom: 6,
  },
  reportMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    color: '#666',
    marginLeft: 6,
  },
  reportActions: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 10,
    fontFamily: 'Roboto-Medium',
  },
  actionButton: {
    padding: 8,
  },
  fileName: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginTop: 8,
  },
  fileNameText: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    color: '#666',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    color: '#1a1a1a',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 32,
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
  filePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1976D2',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  filePickerContent: {
    marginLeft: 16,
    flex: 1,
  },
  filePickerTitle: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: '#1976D2',
    marginBottom: 4,
  },
  filePickerSubtitle: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    color: '#666',
  },
  uploadReportButton: {
    marginTop: 24,
    marginBottom: 32,
  },
  detailsCard: {
    marginBottom: 24,
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  detailsIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  detailsInfo: {
    flex: 1,
  },
  detailsTitle: {
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  detailsSubtitle: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: '#666',
  },
  detailsGrid: {
    marginBottom: 24,
  },
  detailItem: {
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
  downloadButton: {
    marginBottom: 32,
  },
});