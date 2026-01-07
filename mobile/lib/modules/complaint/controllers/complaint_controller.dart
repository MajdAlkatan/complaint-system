import 'package:complaint/data/models/government_entity_model.dart';
import 'package:get/get.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter/material.dart';
import '../../../data/models/complaint_model.dart';
import '../../../data/repositories/complaint_repository.dart';

class ComplaintController extends GetxController {
  final ComplaintRepository _complaintRepository = Get.find();

  var complaint = Rxn<Complaint>();
  var isLoading = false.obs;

  var governmentEntities = <GovernmentEntity>[].obs;
  var complaintTypes = <ComplaintType>[].obs;
  var isLoadingEntities = false.obs;
  var isLoadingTypes = false.obs;
  var attachments = <Map<String, dynamic>>[].obs;
  var isLoadingAttachments = false.obs;

  @override
  void onInit() {
    super.onInit();
    fetchGovernmentEntities();
    fetchComplaintTypes();
  }



Future<void> fetchComplaintAttachments(String complaintId) async {
  try {
    isLoadingAttachments.value = true;
    
    print('Fetching attachments for complaint: $complaintId');
    
    final response = await _complaintRepository.getAttachmentsByComplaint(
      complaintId,
    );

    if (response.success) {
      attachments.assignAll(response.data ?? []);
      print('Loaded ${attachments.length} attachments');
    } else {
      print('Failed to fetch attachments: ${response.message}');
    }
  } catch (e) {
    print('Error fetching attachments: $e');
  } finally {
    isLoadingAttachments.value = false;
  }
}


  Future<void> fetchGovernmentEntities() async {
    try {
      isLoadingEntities.value = true;
      final response = await _complaintRepository.getGovernmentEntities();

      if (response.success && response.data != null) {
        governmentEntities.assignAll(response.data!);
      }
    } catch (e) {
      print('Error fetching government entities: $e');
    } finally {
      isLoadingEntities.value = false;
    }
  }

  // دالة لتحميل أنواع الشكاوى
  Future<void> fetchComplaintTypes() async {
    try {
      isLoadingTypes.value = true;
      final response = await _complaintRepository.getAllComplaintTypes();

      if (response.success && response.data != null) {
        complaintTypes.assignAll(response.data!);
      }
    } catch (e) {
      print('Error fetching complaint types: $e');
    } finally {
      isLoadingTypes.value = false;
    }
  }

  
  void fetchComplaintDetails(String complaintId) async {
  try {
    isLoading.value = true;
    print('=== FETCHING COMPLAINT DETAILS ===');
    print('Complaint ID: $complaintId');
    
    // تحميل تفاصيل الشكوى والمرفقات في نفس الوقت
    final complaintFuture = _complaintRepository.getComplaintDetails(complaintId);
    final attachmentsFuture = fetchComplaintAttachments(complaintId);
    
    // انتظار انتهاء كلا الطلبتين
    final complaintResponse = await complaintFuture;
    await attachmentsFuture;

    if (complaintResponse.success) {
      print('=== API RESPONSE ===');
      print('Raw response: ${complaintResponse.data}');
      
      complaint.value = complaintResponse.data;

      // إضافة الأسماء إذا لم تكن موجودة في الـ API
      if (complaint.value != null) {
        await _enrichComplaintWithNames(complaint.value!);
        
        print('=== AFTER LOADING ===');
        print('Notes count: ${complaint.value!.notes.length}');
        print('Attachments count: ${attachments.length}');
      }
    } else {
      print('=== API ERROR ===');
      print('Error message: ${complaintResponse.message}');
      _showSafeSnackbar(
        title: 'Error',
        message: complaintResponse.message,
        isError: true,
      );
      Get.back();
    }
  } catch (e) {
    print('=== EXCEPTION ===');
    print('Error: $e');
    _showSafeSnackbar(
      title: 'Error',
      message: 'Failed to load complaint details',
      isError: true,
    );
    Get.back();
  } finally {
    isLoading.value = false;
  }
}

  // دالة لإثراء الشكوى بالأسماء من البيانات المرجعية
  Future<void> _enrichComplaintWithNames(Complaint complaintData) async {
    // انتظار تحميل البيانات المرجعية إذا لم تكن محملة بعد
    if (governmentEntities.isEmpty) {
      await fetchGovernmentEntities();
    }
    if (complaintTypes.isEmpty) {
      await fetchComplaintTypes();
    }

    // تحديث اسم الجهة
    final entity = governmentEntities.firstWhere(
      (e) => e.id == complaintData.entityId,
      orElse: () => GovernmentEntity(
        id: complaintData.entityId,
        name: 'Unknown Entity',
        description: '',
        contactEmail: '',
        contactPhone: '',
        createdAt: DateTime.now(),
      ),
    );

    // تحديث اسم نوع الشكوى
    final type = complaintTypes.firstWhere(
      (t) => t.id == complaintData.complaintType,
      orElse: () => ComplaintType(
        id: complaintData.complaintType,
        type: 'Unknown Type',
        createdAt: null,
      ),
    );

    // تحديث كائن الشكوى بالأسماء
    this.complaint.value = complaintData.copyWith(
      entityName: entity.name,
      complaintTypeName: type.type ?? 'Unknown Type',
    );
  }

  // دالة تحميل شكوى من JSON
  void loadComplaint(Complaint loadedComplaint) async {
    complaint.value = loadedComplaint;

    // إضافة الأسماء إذا لم تكن موجودة في البيانات المحملة
    if (complaint.value != null &&
        (complaint.value!.entityName == 'Unknown Entity' ||
            complaint.value!.complaintTypeName == 'Unknown Type')) {
      await _enrichComplaintWithNames(complaint.value!);
    }
  }

  // دوال للحصول على الأسماء
  String getEntityName(int entityId) {
    if (governmentEntities.isEmpty) return 'Loading...';

    final entity = governmentEntities.firstWhere(
      (e) => e.id == entityId,
      orElse: () => GovernmentEntity(
        id: entityId,
        name: 'Entity #$entityId',
        description: '',
        contactEmail: '',
        contactPhone: '',
        createdAt: DateTime.now(),
      ),
    );

    return entity.name;
  }

  String getComplaintTypeName(int typeId) {
    if (complaintTypes.isEmpty) return 'Loading...';

    final type = complaintTypes.firstWhere(
      (t) => t.id == typeId,
      orElse: () =>
          ComplaintType(id: typeId, type: 'Type #$typeId', createdAt: null),
    );

    return type.type ?? 'Unknown Type';
  }

  // دالة لتحديث وصف الشكوى
  Future<void> updateComplaintDescription(
    String complaintId,
    String newDescription,
  ) async {
    try {
      isLoading.value = true;

      // استدعاء API للتحديث
      final response = await _complaintRepository.updateComplaint(complaintId, {
        'description': newDescription,
      });

      if (response.success) {
        // تحديث البيانات المحلية
        if (complaint.value != null) {
          complaint.value = complaint.value!.copyWith(
            description: newDescription,
          );
        }

        _showSafeSnackbar(
          title: 'Success',
          message: 'Complaint description updated successfully',
          isError: false,
        );
      } else {
        _showSafeSnackbar(
          title: 'Error',
          message: response.message,
          isError: true,
        );
      }
    } catch (e) {
      _showSafeSnackbar(
        title: 'Error',
        message: 'Failed to update complaint: $e',
        isError: true,
      );
    } finally {
      isLoading.value = false;
    }
  }

  // دالة لحذف الشكوى
  Future<void> deleteComplaint(String complaintId) async {
    try {
      isLoading.value = true;

      // استدعاء API للحذف
      final response = await _complaintRepository.deleteComplaint(complaintId);

      if (response.success) {
        Get.back(); // العودة للصفحة السابقة

        _showSafeSnackbar(
          title: 'Success',
          message: 'Complaint deleted successfully',
          isError: false,
        );
      } else {
        _showSafeSnackbar(
          title: 'Error',
          message: response.message,
          isError: true,
        );
      }
    } catch (e) {
      _showSafeSnackbar(
        title: 'Error',
        message: 'Failed to delete complaint: $e',
        isError: true,
      );
    } finally {
      isLoading.value = false;
    }
  }

  // Safe snackbar method that won't crash if no overlay is available
  void _showSafeSnackbar({
    required String title,
    required String message,
    bool isError = false,
  }) {
    // Use SchedulerBinding to ensure we're in a safe context
    SchedulerBinding.instance.addPostFrameCallback((_) {
      try {
        // Check if we have a valid context
        if (Get.context != null) {
          // Try to use ScaffoldMessenger which is more reliable
          ScaffoldMessenger.of(Get.context!).clearSnackBars();
          ScaffoldMessenger.of(Get.context!).showSnackBar(
            SnackBar(
              content: Text(message),
              backgroundColor: isError ? Colors.red : Colors.green,
              duration: Duration(seconds: 2),
            ),
          );
        } else {
          // Fallback to Get.snackbar with error handling
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

  Future<void> addNoteToComplaint(String complaintId, String note) async {
    try {
      isLoading.value = true;

      print('=== ADDING NOTE ===');
      print('Complaint ID: $complaintId');
      print('Note to add: $note');

      // استدعاء API الخاص بإضافة الملاحظات
      final response = await _complaintRepository.addNotesToComplaint(
        complaintId,
        note,
      );

      if (response.success) {
        print('✅ Note added successfully via API');

        // إعادة تحميل الشكوى للحصول على البيانات المحدثة
        fetchComplaintDetails(complaintId);

        _showSafeSnackbar(
          title: 'Success',
          message: 'Note added successfully',
          isError: false,
        );
      } else {
        print('❌ API error: ${response.message}');
        _showSafeSnackbar(
          title: 'Error',
          message: response.message,
          isError: true,
        );
      }
    } catch (e) {
      print('❌ Exception in addNoteToComplaint: $e');
      _showSafeSnackbar(
        title: 'Error',
        message: 'Failed to add note: $e',
        isError: true,
      );
    } finally {
      isLoading.value = false;
    }
  }
}
