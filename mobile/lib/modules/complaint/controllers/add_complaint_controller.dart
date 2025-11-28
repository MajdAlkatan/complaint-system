import 'dart:io';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:geolocator/geolocator.dart';
import 'package:permission_handler/permission_handler.dart';
import '../../../../data/repositories/complaint_repository.dart';
import '../../../../core/utils/validators.dart';

class AddComplaintController extends GetxController {
  final ComplaintRepository _complaintRepository = Get.find();
  
  // Form fields
  var title = ''.obs;
  var complaintType = ''.obs;
  var location = ''.obs;
  var governmentEntity = ''.obs;
  var description = ''.obs;
  var isLoading = false.obs;
  var selectedFiles = <PlatformFile>[].obs;
  
  // Dropdown options
  final complaintTypes = [
    'Infrastructure',
    'Public Services',
    'Environmental',
    'Health & Safety',
    'Administrative',
    'Other'
  ];
  
  final governmentEntities = [
    'Ministry of Public Works',
    'Ministry of Health',
    'Ministry of Education',
    'Ministry of Transportation',
    'Municipality',
    'Public Services Commission',
    'Environmental Protection Agency'
  ];
  
  // Form field setters
  void setTitle(String value) => title.value = value;
  void setComplaintType(String value) => complaintType.value = value;
  void setLocation(String value) => location.value = value;
  void setGovernmentEntity(String value) => governmentEntity.value = value;
  void setDescription(String value) => description.value = value;
  
  // Validators
  String? validateTitle(String? value) => Validators.validateRequired(value, 'Complaint Title');
  String? validateComplaintType(String? value) => Validators.validateRequired(value, 'Complaint Type');
  String? validateLocation(String? value) => Validators.validateRequired(value, 'Location');
  String? validateGovernmentEntity(String? value) => Validators.validateRequired(value, 'Government Entity');
  
  String? validateDescription(String? value) {
    if (value == null || value.isEmpty) {
      return 'Description is required';
    }
    if (value.length > 250) {
      return 'Description must be 250 characters or less';
    }
    return null;
  }
  
  bool get isFormValid =>
      validateTitle(title.value) == null &&
      validateComplaintType(complaintType.value) == null &&
      validateLocation(location.value) == null &&
      validateGovernmentEntity(governmentEntity.value) == null &&
      validateDescription(description.value) == null;
  
  // Location methods
  Future<void> getCurrentLocation() async {
    try {
      // Check location permission
      var status = await Permission.location.status;
      if (status.isDenied) {
        status = await Permission.location.request();
      }
      
      if (status.isGranted) {
        isLoading.value = true;
        Position position = await Geolocator.getCurrentPosition(
          desiredAccuracy: LocationAccuracy.high,
        );
        
        // Convert coordinates to address (you might want to use a geocoding service)
        location.value = '${position.latitude}, ${position.longitude}';
        Get.snackbar('Success', 'Location obtained successfully');
      } else {
        Get.snackbar('Error', 'Location permission denied');
      }
    } catch (e) {
      Get.snackbar('Error', 'Failed to get location: $e');
    } finally {
      isLoading.value = false;
    }
  }
  
  void openMapForLocation() {
    // This would open a map screen for location selection
    // For now, we'll simulate it with a dialog
    Get.dialog(
      AlertDialog(
        title: Text('Select Location'),
        content: Text('Map integration would go here. For demo, enter location manually.'),
        actions: [
          TextButton(
            onPressed: () => Get.back(),
            child: Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              Get.back();
              location.value = 'Selected from map';
            },
            child: Text('Confirm'),
          ),
        ],
      ),
    );
  }
  
  // File attachment methods
  Future<void> pickFiles() async {
    try {
      FilePickerResult? result = await FilePicker.platform.pickFiles(
        allowMultiple: true,
        type: FileType.custom,
        allowedExtensions: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx', 'xls', 'xlsx'],
      );
      
      if (result != null) {
        selectedFiles.addAll(result.files);
        Get.snackbar('Success', '${result.files.length} file(s) selected');
      }
    } catch (e) {
      Get.snackbar('Error', 'Failed to pick files: $e');
    }
  }
  
  void removeFile(int index) {
    selectedFiles.removeAt(index);
  }
  
  String getFileSizeString(int bytes) {
    if (bytes < 1024) {
      return '$bytes B';
    } else if (bytes < 1048576) {
      return '${(bytes / 1024).toStringAsFixed(1)} KB';
    } else {
      return '${(bytes / 1048576).toStringAsFixed(1)} MB';
    }
  }
  
  // Submit complaint
  Future<void> submitComplaint() async {
    if (!isFormValid) return;
    
    try {
      isLoading.value = true;
      final complaintData = {
        'title': title.value,
        'complaintType': complaintType.value,
        'location': location.value,
        'governmentEntity': governmentEntity.value,
        'description': description.value,
        'attachments': selectedFiles.map((file) => file.name).toList(),
      };
      
      final response = await _complaintRepository.createComplaint(complaintData);
      
      if (response.success) {
        Get.back();
        Get.snackbar('Success', 'Complaint submitted successfully');
        clearForm();
      } else {
        Get.snackbar('Error', response.message);
      }
    } catch (e) {
      Get.snackbar('Error', 'Failed to submit complaint: $e');
    } finally {
      isLoading.value = false;
    }
  }
  
  void clearForm() {
    title.value = '';
    complaintType.value = '';
    location.value = '';
    governmentEntity.value = '';
    description.value = '';
    selectedFiles.clear();
  }
}