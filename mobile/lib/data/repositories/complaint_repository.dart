// complaint_repository.dart
import 'package:get/get.dart';
import '../models/complaint_model.dart';
import '../models/api_response.dart';
import '../services/api_service.dart';

class ComplaintRepository extends GetxService {
  final ApiService _apiService = Get.find();
  
  Future<ApiResponse<List<Complaint>>> getComplaints() async {
    try {
      final response = await _apiService.get(
        '/complaints/Mycomplaints',
        fromJson: (data) {
          if (data is List) {
            return data.map<Complaint>((item) => Complaint.fromJson(item)).toList();
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
  Future<ApiResponse<Complaint>> createComplaint(Map<String, dynamic> complaintData) async {
    try {
      final response = await _apiService.post(
        '/complaints',
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
      print('Error creating complaint: $e');
      return ApiResponse<Complaint>(
        success: false,
        message: 'Failed to create complaint: $e',
        
      );
      
      
    }

    
  }
}