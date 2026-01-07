import 'dart:io';
import 'package:complaint/data/models/complaint_model.dart';
import 'package:complaint/data/models/government_entity_model.dart';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:geolocator/geolocator.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:flutter/scheduler.dart';
import 'package:http/http.dart' as http; // إضافة package http
import 'dart:convert'; // للتعامل مع JSON
import '../../../../data/repositories/complaint_repository.dart';
import '../../../../core/utils/validators.dart';

class AddComplaintController extends GetxController {
  final ComplaintRepository _complaintRepository = Get.find();

  // Form fields
  var entityId = ''.obs; // تغيير من '1' إلى ''
  var complaintType = ''.obs;
  var location = ''.obs;
  var description = ''.obs;
  var isLoading = false.obs;
  var selectedFiles = <PlatformFile>[].obs;
  var isLoadingTypes = false.obs;
  var isLoadingEntities = false.obs;

  // Dynamic dropdown options for complaint types
  var complaintTypes = <ComplaintType>[].obs;
  var governmentEntities = <GovernmentEntity>[].obs;

  @override
  void onInit() {
    super.onInit();
    fetchComplaintTypes();
    fetchGovernmentEntities();
  }

  // جلب government entities من API
  Future<void> fetchGovernmentEntities() async {
    try {
      isLoadingEntities.value = true;

      final response = await _complaintRepository.getGovernmentEntities();

      if (response.success &&
          response.data != null &&
          response.data!.isNotEmpty) {
        governmentEntities.assignAll(response.data!);

        // تعيين القيمة الافتراضية لأول entity إذا لم تكن هناك قيمة محددة
        if (entityId.value.isEmpty && governmentEntities.isNotEmpty) {
          entityId.value = governmentEntities.first.id.toString();
        }
      } else {
        // استخدام قائمة افتراضية إذا فشل الاتصال بالـ API
        governmentEntities.assignAll([
          GovernmentEntity(
            id: 1,
            name: 'Ministry of Water Resources',
            description: 'Water supply and management',
            contactEmail: 'water@syria.gov',
            contactPhone: '123456789',
            createdAt: DateTime.now(),
          ),
          GovernmentEntity(
            id: 2,
            name: 'Ministry of Electricity',
            description: 'Electricity generation and distribution',
            contactEmail: 'electricity@syria.gov',
            contactPhone: '987654321',
            createdAt: DateTime.now(),
          ),
          GovernmentEntity(
            id: 3,
            name: 'Ministry of Public Works',
            description: 'Road maintenance and infrastructure',
            contactEmail: 'publicworks@syria.gov',
            contactPhone: '555555555',
            createdAt: DateTime.now(),
          ),
        ]);

        if (entityId.value.isEmpty) {
          entityId.value = '1';
        }

        _showSafeSnackbar(
          title: 'Warning',
          message: 'Using default government entities',
          isError: false,
        );
      }
    } catch (e) {
      print('Error fetching government entities: $e');
      _showSafeSnackbar(
        title: 'Error',
        message: 'Failed to load government entities',
        isError: true,
      );
    } finally {
      isLoadingEntities.value = false;
    }
  }

  Future<void> fetchComplaintTypes() async {
    try {
      isLoadingTypes.value = true;

      final response = await _complaintRepository.getAllComplaintTypes();

      if (response.success &&
          response.data != null &&
          response.data!.isNotEmpty) {
        complaintTypes.assignAll(response.data!);

        if (complaintType.value.isEmpty && complaintTypes.isNotEmpty) {
          complaintType.value = complaintTypes.first.id.toString();
        }
      } else {
        complaintTypes.assignAll([
          ComplaintType(id: 1, type: 'Water Supply', createdAt: null),
          ComplaintType(id: 2, type: 'Electricity', createdAt: null),
          ComplaintType(id: 3, type: 'Sanitation', createdAt: null),
          ComplaintType(id: 4, type: 'Road Maintenance', createdAt: null),
          ComplaintType(id: 5, type: 'Building Issues', createdAt: null),
          ComplaintType(id: 6, type: 'Other', createdAt: null),
        ]);

        if (complaintType.value.isEmpty) {
          complaintType.value = '1';
        }

        _showSafeSnackbar(
          title: 'Warning',
          message: 'Using default complaint types',
          isError: false,
        );
      }
    } catch (e) {
      print('Error fetching complaint types: $e');
      _showSafeSnackbar(
        title: 'Error',
        message: 'Failed to load complaint types',
        isError: true,
      );
    } finally {
      isLoadingTypes.value = false;
    }
  }

  // Form field setters
  void setEntityId(String value) => entityId.value = value;
  void setComplaintType(String value) => complaintType.value = value;
  void setLocation(String value) => location.value = value;
  void setDescription(String value) => description.value = value;

  // Validators
  String? validateEntityId(String? value) =>
      Validators.validateRequired(value, 'Government Entity');

  String? validateLocation(String? value) =>
      Validators.validateRequired(value, 'Location');

  String? validateDescription(String? value) {
    if (value == null || value.isEmpty) {
      return 'Description is required';
    }
    return null;
  }

  bool get isFormValid =>
      validateEntityId(entityId.value) == null &&
      validateLocation(location.value) == null &&
      validateDescription(description.value) == null &&
      complaintType.value.isNotEmpty;

  // Updated Location method for web
  Future<void> getCurrentLocation() async {
    try {
      // Check location permission
      var status = await Permission.location.status;
      if (status.isDenied) {
        status = await Permission.location.request();
      }

      if (status.isGranted) {
        isLoading.value = true;

        // Get current position
        Position position = await Geolocator.getCurrentPosition(
          desiredAccuracy: LocationAccuracy.high,
        );

        print('Got position: ${position.latitude}, ${position.longitude}');

        // Use OpenStreetMap API to get address (works on web)
        await _getAddressFromOpenStreetMap(
          position.latitude,
          position.longitude,
        );

        _showSafeSnackbar(
          title: 'Success',
          message: 'Location obtained successfully',
          isError: false,
        );
      } else {
        _showSafeSnackbar(
          title: 'Error',
          message: 'Location permission denied',
          isError: true,
        );
      }
    } catch (e) {
      print('Error getting location: $e');
      _showSafeSnackbar(
        title: 'Error',
        message: 'Failed to get location: $e',
        isError: true,
      );
    } finally {
      isLoading.value = false;
    }
  }

  // OpenStreetMap API method for web
  Future<void> _getAddressFromOpenStreetMap(
    double latitude,
    double longitude,
  ) async {
    try {
      print('Fetching address from OpenStreetMap...');

      // Use OpenStreetMap Nominatim API
      final url = Uri.parse(
        'https://nominatim.openstreetmap.org/reverse?format=json&lat=$latitude&lon=$longitude&zoom=18&addressdetails=1',
      );

      // Make HTTP GET request
      final response = await http.get(
        url,
        headers: {
          'User-Agent': 'ComplaintApp/1.0', // Required by OpenStreetMap
        },
      );

      print('OpenStreetMap response status: ${response.statusCode}');
      print('OpenStreetMap response body: ${response.body}');

      if (response.statusCode == 200) {
        final jsonData = jsonDecode(response.body);

        if (jsonData['display_name'] != null) {
          String displayName = jsonData['display_name'].toString();

          // Try to get a shorter, more meaningful address
          String address = _extractMeaningfulAddress(jsonData);

          if (address.isNotEmpty) {
            location.value = address;
          } else {
            location.value = displayName;
          }

          print('Got address: ${location.value}');
        } else {
          // If no address found, use coordinates with city name
          location.value =
              '${_getCityFromCoordinates(latitude, longitude)} (${latitude.toStringAsFixed(4)}, ${longitude.toStringAsFixed(4)})';
        }
      } else {
        print('OpenStreetMap API error: ${response.statusCode}');
        location.value =
            '${_getCityFromCoordinates(latitude, longitude)} (${latitude.toStringAsFixed(4)}, ${longitude.toStringAsFixed(4)})';
      }
    } catch (e) {
      print('OpenStreetMap API failed: $e');
      location.value =
          '${_getCityFromCoordinates(latitude, longitude)} (${latitude.toStringAsFixed(4)}, ${longitude.toStringAsFixed(4)})';
    }
  }

  // Extract meaningful address from OpenStreetMap data
  String _extractMeaningfulAddress(Map<String, dynamic> jsonData) {
    try {
      final address = jsonData['address'];
      if (address == null) return '';

      List<String> parts = [];

      // Build address in order: street, city/district, city, state, country
      if (address['road'] != null) {
        parts.add(address['road'].toString());
      }
      if (address['quarter'] != null) {
        parts.add(address['quarter'].toString());
      } else if (address['suburb'] != null) {
        parts.add(address['suburb'].toString());
      }
      if (address['city'] != null) {
        parts.add(address['city'].toString());
      } else if (address['town'] != null) {
        parts.add(address['town'].toString());
      } else if (address['village'] != null) {
        parts.add(address['village'].toString());
      }
      if (address['state'] != null) {
        parts.add(address['state'].toString());
      }
      if (address['country'] != null) {
        parts.add(address['country'].toString());
      }

      if (parts.isNotEmpty) {
        return parts.join(', ');
      }

      return '';
    } catch (e) {
      print('Error extracting address: $e');
      return '';
    }
  }

  // Get city name from coordinates (fallback method)
  String _getCityFromCoordinates(double lat, double lng) {
    // Approximate coordinates for major Syrian cities
    // دمشق
    if (lat >= 33.4 && lat <= 33.6 && lng >= 36.2 && lng <= 36.4) {
      return 'دمشق';
    }
    // حلب
    else if (lat >= 36.1 && lat <= 36.3 && lng >= 37.0 && lng <= 37.2) {
      return 'حلب';
    }
    // حمص
    else if (lat >= 34.7 && lat <= 34.8 && lng >= 36.6 && lng <= 36.8) {
      return 'حمص';
    }
    // اللاذقية
    else if (lat >= 35.4 && lat <= 35.6 && lng >= 35.7 && lng <= 35.9) {
      return 'اللاذقية';
    }
    // درعا
    else if (lat >= 32.6 && lat <= 32.7 && lng >= 36.0 && lng <= 36.2) {
      return 'درعا';
    }
    // حماه
    else if (lat >= 35.1 && lat <= 35.2 && lng >= 36.7 && lng <= 36.8) {
      return 'حماه';
    }
    // طرطوس
    else if (lat >= 34.9 && lat <= 35.0 && lng >= 35.8 && lng <= 35.9) {
      return 'طرطوس';
    }
    // إدلب
    else if (lat >= 35.9 && lat <= 36.0 && lng >= 36.6 && lng <= 36.7) {
      return 'إدلب';
    }
    // الحسكة
    else if (lat >= 36.5 && lat <= 36.6 && lng >= 40.7 && lng <= 40.8) {
      return 'الحسكة';
    }
    // دير الزور
    else if (lat >= 35.3 && lat <= 35.4 && lng >= 40.1 && lng <= 40.2) {
      return 'دير الزور';
    }
    // الرقة
    else if (lat >= 35.9 && lat <= 36.0 && lng >= 39.0 && lng <= 39.1) {
      return 'الرقة';
    }
    // السويداء
    else if (lat >= 32.7 && lat <= 32.8 && lng >= 36.5 && lng <= 36.6) {
      return 'السويداء';
    }
    // القنيطرة
    else if (lat >= 33.1 && lat <= 33.2 && lng >= 35.8 && lng <= 35.9) {
      return 'القنيطرة';
    }
    // If coordinates are outside Syria (like your test coordinates in California)
    else if (lat >= 34.9 && lat <= 35.0 && lng >= -116.5 && lng <= -116.3) {
      return 'كاليفورنيا، الولايات المتحدة';
    }
    // Generic fallback
    else {
      return 'موقع غير معروف';
    }
  }

  // Safe snackbar method
  void _showSafeSnackbar({
    required String title,
    required String message,
    bool isError = false,
  }) {
    SchedulerBinding.instance.addPostFrameCallback((_) {
      try {
        if (Get.context != null) {
          ScaffoldMessenger.of(Get.context!).clearSnackBars();
          ScaffoldMessenger.of(Get.context!).showSnackBar(
            SnackBar(
              content: Text(message),
              backgroundColor: isError ? Colors.red : Colors.green,
              duration: Duration(seconds: 2),
            ),
          );
        } else {
          try {
            Get.snackbar(
              title,
              message,
              snackPosition: SnackPosition.BOTTOM,
              duration: Duration(seconds: 2),
              backgroundColor: isError ? Colors.red : Colors.green,
              colorText: Colors.white,
            );
          } catch (e) {
            print('Failed to show snackbar: $e');
            print('$title: $message');
          }
        }
      } catch (e) {
        print('Error in _showSafeSnackbar: $e');
        print('$title: $message');
      }
    });
  }

  // باقي الدوال كما هي...
  Future<void> pickFiles() async {
    try {
      FilePickerResult? result = await FilePicker.platform.pickFiles(
        allowMultiple: true,
        type: FileType.custom,
        allowedExtensions: [
          'jpg',
          'jpeg',
          'png',
          'pdf',
          'doc',
          'docx',
          'xls',
          'xlsx',
        ],
      );

      if (result != null) {
        selectedFiles.addAll(result.files);
        _showSafeSnackbar(
          title: 'Success',
          message: '${result.files.length} file(s) selected',
          isError: false,
        );
      }
    } catch (e) {
      _showSafeSnackbar(
        title: 'Error',
        message: 'Failed to pick files: $e',
        isError: true,
      );
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
  // Future<void> submitComplaint() async {
  //   if (!isFormValid) return;

  //   try {
  //     isLoading.value = true;

  //     final complaintData = {
  //       'entity_id': int.parse(entityId.value),
  //       'complaint_type': int.parse(complaintType.value),
  //       'location': location.value,
  //       'description': description.value,
  //     };

  //     print('Submitting complaint: $complaintData');

  //     final response = await _complaintRepository.createComplaint(
  //       complaintData,
  //     );

  //     if (response.success) {
  //       Get.back();
  //       _showSafeSnackbar(
  //         title: 'Success',
  //         message: 'Complaint submitted successfully!',
  //         isError: false,
  //       );
  //       clearForm();
  //     } else {
  //       _showSafeSnackbar(
  //         title: 'Error',
  //         message: response.message,
  //         isError: true,
  //       );
  //     }
  //   } catch (e) {
  //     print('Error submitting complaint: $e');
  //     _showSafeSnackbar(
  //       title: 'Error',
  //       message: 'Failed to submit complaint: ${e.toString()}',
  //       isError: true,
  //     );
  //   } finally {
  //     isLoading.value = false;
  //   }
  // }

  void clearForm() {
    entityId.value = '';
    complaintType.value = '';
    location.value = '';
    description.value = '';
    selectedFiles.clear();
  }

  Future<void> submitComplaint() async {
  if (!isFormValid) return;

  try {
    isLoading.value = true;

    final complaintData = {
      'entity_id': int.parse(entityId.value),
      'complaint_type': int.parse(complaintType.value),
      'location': location.value,
      'description': description.value,
    };

    print('Submitting complaint: $complaintData');

    // 1. أولاً: إنشاء الشكوى في الـ API
    final createResponse = await _complaintRepository.createComplaint(
      complaintData,
    );

    if (createResponse.success) {
      final createdComplaint = createResponse.data;
      
      if (createdComplaint != null) {
        print('✅ Complaint created successfully with ID: ${createdComplaint.id}');
        
        // 2. ثانياً: إذا كانت هناك ملفات، قم برفعها باستخدام ID الشكوى
        if (selectedFiles.isNotEmpty) {
          await _uploadComplaintAttachments(createdComplaint.id);
        }
        
        Get.back();
        _showSafeSnackbar(
          title: 'Success',
          message: 'Complaint submitted successfully!',
          isError: false,
        );
        clearForm();
      } else {
        _showSafeSnackbar(
          title: 'Error',
          message: 'Failed to get complaint ID',
          isError: true,
        );
      }
    } else {
      _showSafeSnackbar(
        title: 'Error',
        message: createResponse.message,
        isError: true,
      );
    }
  } catch (e) {
    print('Error submitting complaint: $e');
    _showSafeSnackbar(
      title: 'Error',
      message: 'Failed to submit complaint: ${e.toString()}',
      isError: true,
    );
  } finally {
    isLoading.value = false;
  }
}


Future<void> _uploadComplaintAttachments(String complaintId) async {
  try {
    print('Uploading ${selectedFiles.length} attachments for complaint $complaintId');
    
    final results = <String>[];
    int successCount = 0;
    
    for (var file in selectedFiles) {
      try {
        final response = await _complaintRepository.uploadAttachment(
          complaintId: complaintId,
          file: file,
        );

        if (response.success) {
          successCount++;
          results.add('✅ ${file.name} uploaded successfully');
          print('Uploaded: ${file.name}');
        } else {
          results.add('❌ ${file.name} failed: ${response.message}');
          print('Failed to upload ${file.name}: ${response.message}');
        }
      } catch (e) {
        results.add('❌ ${file.name} error: $e');
        print('Error uploading ${file.name}: $e');
      }

      // تأخير صغير بين كل رفع لمنع ازدحام الطلبات
      await Future.delayed(Duration(milliseconds: 100));
    }

    print('Upload results: ${results.join(', ')}');
    
    if (successCount > 0) {
      _showSafeSnackbar(
        title: 'Success',
        message: '$successCount file(s) uploaded successfully',
        isError: false,
      );
    }
    
    if (successCount < selectedFiles.length) {
      _showSafeSnackbar(
        title: 'Info',
        message: '${selectedFiles.length - successCount} file(s) failed to upload',
        isError: false,
      );
    }
  } catch (e) {
    print('Error in upload process: $e');
    _showSafeSnackbar(
      title: 'Error',
      message: 'Failed to upload attachments: $e',
      isError: true,
    );
  }
}

// دالة لتنظيف الملفات بعد الرفع (اختياري)
void clearAttachments() {
  selectedFiles.clear();
}
}
