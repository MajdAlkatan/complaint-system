// complaint_repository.dart
import 'package:complaint/data/models/government_entity_model.dart';
import 'package:file_picker/file_picker.dart';
import 'package:get/get.dart';
import '../models/complaint_model.dart';
import '../models/api_response.dart';
import '../services/api_service.dart';
import 'package:http/http.dart' as http;

class ComplaintRepository extends GetxService {
  final ApiService _apiService = Get.find();

  Future<ApiResponse<List<Complaint>>> getComplaints() async {
    try {
      final response = await _apiService.get(
        '/complaints/Mycomplaints',
        fromJson: (data) {
          if (data is List) {
            return data
                .map<Complaint>((item) => Complaint.fromJson(item))
                .toList();
          }
          return [];
        },
      );

      return ApiResponse<List<Complaint>>(
        success: response.success,
        message: response.message,
        data: response.data as List<Complaint>? ?? [],
        statusCode: response.statusCode,
      );
    } catch (e) {
      print('Error fetching complaints: $e');
      return ApiResponse<List<Complaint>>(
        success: false,
        message: 'Failed to fetch complaints: $e',
        data: [],
      );
    }
  }

  Future<ApiResponse<Complaint>> getComplaintDetails(String complaintId) async {
    try {
      final response = await _apiService.get(
        '/complaints/Mycomplaints/$complaintId',
        fromJson: (data) => Complaint.fromJson(data),
      );

      return ApiResponse<Complaint>(
        success: response.success,
        message: response.message,
        data: response.data as Complaint?,
        statusCode: response.statusCode,
      );
    } catch (e) {
      print('Error fetching complaint details: $e');
      return ApiResponse<Complaint>(
        success: false,
        message: 'Failed to fetch complaint details: $e',
      );
    }
  }

  // Add this method for creating complaints
  // في complaint_repository.dart
Future<ApiResponse<Complaint>> createComplaint(
  Map<String, dynamic> complaintData,
) async {
  try {
    print('=== CREATING COMPLAINT ===');
    print('Request data: $complaintData');
    
    final response = await _apiService.post(
      '/complaints',
      body: complaintData,
      fromJson: (data) {
        // أولاً، طباعة البيانات الخام
        print('=== RAW RESPONSE DATA ===');
        print('Data type: ${data.runtimeType}');
        print('Data: $data');
        
        if (data is Map) {
          // تحقق من بنية الرد
          final Map<String, dynamic> responseMap = Map<String, dynamic>.from(data);
          
          // إذا كان هناك حقل 'data'، استخدمه
          if (responseMap.containsKey('data') && responseMap['data'] is Map) {
            print('Response has "data" field');
            return Complaint.fromJson(responseMap['data'] as Map<String, dynamic>);
          }
          
          // إذا كان هناك حقل 'complaint'، استخدمه
          if (responseMap.containsKey('complaint') && responseMap['complaint'] is Map) {
            print('Response has "complaint" field');
            return Complaint.fromJson(responseMap['complaint'] as Map<String, dynamic>);
          }
          
          // وإلا استخدم الرد مباشرة
          print('Using response directly');
          return Complaint.fromJson(responseMap);
        }
        
        // إذا كانت البيانات ليست Map، أنشئ شكوى فارغة
        print('Response is not a Map, creating empty complaint');
        return Complaint.fromJson({});
      },
    );

    print('=== CREATE COMPLAINT FINAL ===');
    print('Success: ${response.success}');
    print('Message: ${response.message}');
    print('Status: ${response.statusCode}');
    
    if (response.data != null) {
      final complaint = response.data as Complaint;
      print('Created complaint:');
      print('- ID: ${complaint.id}');
      print('- Reference: ${complaint.referenceNumber}');
      print('- Status: ${complaint.status}');
      
      // تحقق إضافي: إذا كان الـ ID لا يزال 0
      if (complaint.id == '0') {
        print('⚠️ WARNING: Complaint ID is still 0!');
        print('This will cause attachment upload to fail.');
        
        // محاولة استخراج ID من رسالة الاستجابة
        if (response.message.contains('created') || response.message.contains('success')) {
          // قد يكون الـ ID في رسالة النجاح
          final idMatch = RegExp(r'ID[:\s]*(\d+)').firstMatch(response.message);
          if (idMatch != null) {
            final extractedId = idMatch.group(1);
            print('Extracted ID from message: $extractedId');
            // يمكننا تحديث كائن Complaint هنا إذا لزم الأمر
          }
        }
      }
    }

    return ApiResponse<Complaint>(
      success: response.success,
      message: response.message,
      data: response.data as Complaint?,
      statusCode: response.statusCode,
    );
  } catch (e) {
    print('Error creating complaint: $e');
    return ApiResponse<Complaint>(
      success: false,
      message: 'Failed to create complaint: $e',
    );
  }
}

  Future<ApiResponse<List<ComplaintType>>> getAllComplaintTypes() async {
    try {
      final response = await _apiService.get(
        '/Alltypes',
        fromJson: (data) {
          if (data is List) {
            return data
                .map<ComplaintType>((item) => ComplaintType.fromJson(item))
                .toList();
          }
          return [];
        },
      );

      return ApiResponse<List<ComplaintType>>(
        success: response.success,
        message: response.message,
        data: response.data as List<ComplaintType>? ?? [],
        statusCode: response.statusCode,
      );
    } catch (e) {
      print('Error fetching complaint types: $e');
      return ApiResponse<List<ComplaintType>>(
        success: false,
        message: 'Failed to fetch complaint types: $e',
        data: [],
      );
    }
  }

  // إضافة دالة جديدة لجلب government entities
  Future<ApiResponse<List<GovernmentEntity>>> getGovernmentEntities() async {
    try {
      final response = await _apiService.get(
        '/governmentEntites',
        fromJson: (data) {
          if (data is List) {
            return data
                .map<GovernmentEntity>(
                  (item) => GovernmentEntity.fromJson(item),
                )
                .toList();
          }
          return [];
        },
      );

      return ApiResponse<List<GovernmentEntity>>(
        success: response.success,
        message: response.message,
        data: response.data as List<GovernmentEntity>? ?? [],
        statusCode: response.statusCode,
      );
    } catch (e) {
      print('Error fetching government entities: $e');
      return ApiResponse<List<GovernmentEntity>>(
        success: false,
        message: 'Failed to fetch government entities: $e',
        data: [],
      );
    }
  }

  // إضافة دالة جديدة لتحديث الشكوى
  Future<ApiResponse<Complaint>> updateComplaint(
    String complaintId,
    Map<String, dynamic> complaintData,
  ) async {
    try {
      final response = await _apiService.put(
        '/complaints/Mycomplaints/$complaintId',
        body: complaintData,
        fromJson: (data) => Complaint.fromJson(data),
      );

      return ApiResponse<Complaint>(
        success: response.success,
        message: response.message,
        data: response.data as Complaint?,
        statusCode: response.statusCode,
      );
    } catch (e) {
      print('Error updating complaint: $e');
      return ApiResponse<Complaint>(
        success: false,
        message: 'Failed to update complaint: $e',
      );
    }
  }

  // إضافة دالة جديدة لحذف الشكوى
  Future<ApiResponse<void>> deleteComplaint(String complaintId) async {
    try {
      final response = await _apiService.delete(
        '/complaints/$complaintId',
        fromJson: (data) => null, // لا نتوقع بيانات في الاستجابة
      );

      return ApiResponse<void>(
        success: response.success,
        message: response.message,
        statusCode: response.statusCode,
      );
    } catch (e) {
      print('Error deleting complaint: $e');
      return ApiResponse<void>(
        success: false,
        message: 'Failed to delete complaint: $e',
      );
    }
  }

  Future<ApiResponse<Complaint>> addNotesToComplaint(
    String complaintId,
    String notes,
  ) async {
    try {
      final response = await _apiService.put(
        '/complaints/AddNotes/$complaintId',
        body: {'notes': notes},
        fromJson: (data) => Complaint.fromJson(data),
      );

      return ApiResponse<Complaint>(
        success: response.success,
        message: response.message,
        data: response.data as Complaint?,
        statusCode: response.statusCode,
      );
    } catch (e) {
      print('Error adding notes to complaint: $e');
      return ApiResponse<Complaint>(
        success: false,
        message: 'Failed to add notes: $e',
      );
    }
  }

  Future<ApiResponse<Map<String, dynamic>>> uploadAttachment({
    required String complaintId,
    required PlatformFile file,
  }) async {
    try {
      // إنشاء MultipartFile من PlatformFile
      http.MultipartFile multipartFile;

      if (file.bytes != null) {
        // إذا كانت الملفات في الذاكرة (Web)
        multipartFile = http.MultipartFile.fromBytes(
          'image',
          file.bytes!,
          filename: file.name,
        );
      } else if (file.path != null) {
        // إذا كانت الملفات في نظام الملفات (Android/iOS)
        multipartFile = await http.MultipartFile.fromPath(
          'image',
          file.path!,
          filename: file.name,
        );
      } else {
        return ApiResponse<Map<String, dynamic>>(
          success: false,
          message: 'Invalid file',
        );
      }

      // إرسال الطلب
      final response = await _apiService.postMultipart<Map<String, dynamic>>(
        '/attachments',
        fields: {'complaint_id': complaintId},
        files: [multipartFile],
        fromJson: (data) => data as Map<String, dynamic>,
      );

      return ApiResponse<Map<String, dynamic>>(
        success: response.success,
        message: response.message,
        data: response.data,
        statusCode: response.statusCode,
      );
    } catch (e) {
      print('Error uploading attachment: $e');
      return ApiResponse<Map<String, dynamic>>(
        success: false,
        message: 'Failed to upload attachment: $e',
      );
    }
  }

  // دالة لجلب المرفقات الخاصة بشكوى
  Future<ApiResponse<List<Map<String, dynamic>>>> getAttachmentsByComplaint(
    String complaintId,
  ) async {
    try {
      final response = await _apiService.get(
        '/attachments/byComplaint/$complaintId',
        fromJson: (data) {
          if (data is List) {
            return data
                .map<Map<String, dynamic>>(
                  (item) => item as Map<String, dynamic>,
                )
                .toList();
          }
          return [];
        },
      );

      return ApiResponse<List<Map<String, dynamic>>>(
        success: response.success,
        message: response.message,
        data: response.data as List<Map<String, dynamic>>? ?? [],
        statusCode: response.statusCode,
      );
    } catch (e) {
      print('Error fetching attachments: $e');
      return ApiResponse<List<Map<String, dynamic>>>(
        success: false,
        message: 'Failed to fetch attachments: $e',
        data: [],
      );
    }
  }

  Future<void> uploadAllAttachments({
    required String complaintId,
    required List<PlatformFile> files,
  }) async {
    final results = <String>[];
    int successCount = 0;

    print(
      'Starting to upload ${files.length} attachments for complaint $complaintId',
    );

    for (var file in files) {
      try {
        print('Uploading file: ${file.name} (${file.size} bytes)');

        final response = await uploadAttachment(
          complaintId: complaintId,
          file: file,
        );

        if (response.success) {
          successCount++;
          results.add('✅ ${file.name} uploaded successfully');
          print('Successfully uploaded: ${file.name}');
        } else {
          results.add('❌ ${file.name} failed: ${response.message}');
          print('Failed to upload ${file.name}: ${response.message}');
          print('Response status: ${response.statusCode}');
          print('Response data: ${response.data}');
        }
      } catch (e, stackTrace) {
        results.add('❌ ${file.name} error: $e');
        print('Error uploading ${file.name}: $e');
        print('Stack trace: $stackTrace');
      }

      // تأخير صغير بين كل رفع لمنع ازدحام الطلبات
      await Future.delayed(Duration(milliseconds: 100));
    }

    print('=== UPLOAD SUMMARY ===');
    print('Total files: ${files.length}');
    print('Successful: $successCount');
    print('Failed: ${files.length - successCount}');
    print('Results: ${results.join(', ')}');
    print('======================');
  }
}
