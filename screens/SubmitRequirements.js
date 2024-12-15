import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

export default function SubmitRequirements({ route, navigation }) {
  // Default requirements list passed through route params
  const requirements = route?.params?.requirements || [
    'Certificate of Enrollment',
    'Certificate of Grades',
    'Certificate of Indigency',
    'Scanned Copy of Valid ID or School ID',
  ];

  const [uploadedFiles, setUploadedFiles] = useState(
    requirements.map((req) => ({
      name: req,
      file: null, // File name
    }))
  );

  // Check if all files are uploaded
  const allFilesUploaded = uploadedFiles.every((file) => file.file);

  // File Picker with Reupload Confirmation
  const pickDocument = async (index) => {
    const fileAlreadyUploaded = uploadedFiles[index].file;

    if (fileAlreadyUploaded) {
      Alert.alert(
        'Replace File',
        'Do you want to replace the existing file?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Replace', onPress: () => uploadNewFile(index) },
        ]
      );
    } else {
      uploadNewFile(index);
    }
  };

  // Handle Document Picking
  const uploadNewFile = async (index) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*', // Allow all file types
        copyToCacheDirectory: false,
      });

      if (result.type === 'success') {
        const updatedFiles = [...uploadedFiles];
        updatedFiles[index].file = result.name; // Store file name
        setUploadedFiles(updatedFiles);
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to pick file. Please try again.');
    }
  };

  // Handle Submit Confirmation
  const handleSubmit = () => {
    Alert.alert(
      'Confirm Submission',
      'Are you sure you want to submit the requirements?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit',
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'NotificationList' }],
            });
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>REQUIREMENTS</Text>
      <FlatList
        data={uploadedFiles}
        keyExtractor={(item) => item.name}
        renderItem={({ item, index }) => (
          <View style={styles.requirementRow}>
            <View style={styles.fileDetails}>
              <Text style={styles.requirementName}>{item.name}:</Text>
              {item.file && (
                <Text style={styles.fileName}>Uploaded: {item.file}</Text>
              )}
            </View>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => pickDocument(index)}
            >
              <Text style={styles.buttonText}>
                {item.file ? 'REUPLOAD FILE' : 'UPLOAD FILE'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <TouchableOpacity
        style={[styles.submitButton, !allFilesUploaded && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={!allFilesUploaded} // Disable the button if not all files are uploaded
      >
        <Text style={styles.submitButtonText}>SUBMIT</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F4F4', padding: 15 },
  header: { fontSize: 20, fontWeight: 'bold', color: 'maroon', marginBottom: 10 },
  requirementRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
    alignItems: 'center',
  },
  fileDetails: {
    flex: 1,
  },
  requirementName: { fontSize: 14, color: '#555' },
  fileName: { fontSize: 12, color: '#7B0A0A', marginTop: 4 },
  uploadButton: {
    backgroundColor: 'maroon',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  buttonText: { color: '#FFFFFF', fontWeight: 'bold' },
  submitButton: {
    backgroundColor: 'maroon',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 15,
  },
  disabledButton: {
    backgroundColor: '#CCCCCC', // Greyed out button
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
