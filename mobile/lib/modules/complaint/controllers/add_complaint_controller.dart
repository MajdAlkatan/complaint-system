// add_complaint_controller.dart
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
  
  // Form fields - Updated to match API requirements
  var entityId = '1'.obs; // Default to 1 as per your API
  var complaintType = '1'.obs; // Default to 1 as per your API
  var location = ''.obs;
  var description = ''.obs;
  var isLoading = false.obs;
  var selectedFiles = <PlatformFile>[].obs;
  
  // Dropdown options for complaint types
  final complaintTypes = [
    {'id': '1', 'name': 'Water Supply'},
    {'id': '2', 'name': 'Electricity'},
    {'id': '3', 'name': 'Sanitation'},
    {'id': '4', 'name': 'Road Maintenance'},
    {'id': '5', 'name': 'Building Issues'},
    {'id': '6', 'name': 'Other'},
  ];
  
  // Form field setters
  void setComplaintType(String value) => complaintType.value = value;
  void setLocation(String value) => location.value = value;
  void setDescription(String value) => description.value = value;
  
  // Validators
  String? validateLocation(String? value) => Validators.validateRequired(value, 'Location');
  
  String? validateDescription(String? value) {
    if (value == null || value.isEmpty) {
      return 'Description is required';
    }
    return null;
  }
  
  bool get isFormValid =>
      validateLocation(location.value) == null &&
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
        
        // Get address from coordinates (simplified - you might want to use geocoding)
        location.value = 'Lat: ${position.latitude}, Lng: ${position.longitude}';
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
  
  // Submit complaint - Updated to match API requirements
  Future<void> submitComplaint() async {
    if (!isFormValid) return;
    
    try {
      isLoading.value = true;
      
      // Prepare complaint data according to API requirements
      final complaintData = {
        'entity_id': int.parse(entityId.value),
        'complaint_type': int.parse(complaintType.value),
        'location': location.value,
        'description': description.value,
      };
      
      print('Submitting complaint: $complaintData');
      
      final response = await _complaintRepository.createComplaint(complaintData);
      
      if (response.success) {
        Get.back();
        Get.snackbar(
          'Success',
          'Complaint submitted successfully!',
          snackPosition: SnackPosition.BOTTOM,
          duration: Duration(seconds: 3),
        );
        clearForm();
      } else {
        Get.snackbar(
          'Error',
          response.message,
          snackPosition: SnackPosition.BOTTOM,
          duration: Duration(seconds: 4),
        );
      }
    } catch (e) {
      print('Error submitting complaint: $e');
      Get.snackbar(
        'Error',
        'Failed to submit complaint: ${e.toString()}',
        snackPosition: SnackPosition.BOTTOM,
        duration: Duration(seconds: 4),
      );
    } finally {
      isLoading.value = false;
    }
  }
  
  void clearForm() {
    complaintType.value = '1';
    location.value = '';
    description.value = '';
    selectedFiles.clear();
  }
}