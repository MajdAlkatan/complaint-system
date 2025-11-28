import 'package:get/get.dart';
import '../models/complaint_model.dart';
import '../models/api_response.dart';
import '../services/api_service.dart';

class ComplaintRepository extends GetxService {
  final ApiService _apiService = Get.find();
  
  Future<ApiResponse<List<Complaint>>> getComplaints() async {
    // Simulate API call - replace with actual implementation
    await Future.delayed(Duration(seconds: 1));
    
    // Mock data for demonstration
    final mockComplaints = [
      Complaint(
        id: '1',
        title: 'Electrical Issue',
        description: 'Lights not working in living room',
        category: 'Electrical',
        status: 'pending',
        priority: 'medium',
        createdAt: DateTime.now(),
        userId: 'user1',
      ),
      Complaint(
        id: '2',
        title: 'Water Leak',
        description: 'Leaking pipe in kitchen',
        category: 'Plumbing',
        status: 'in_progress',
        priority: 'high',
        createdAt: DateTime.now().subtract(Duration(days: 1)),
        userId: 'user1',
      ),
    ];
    
    return ApiResponse(
      success: true,
      message: 'Complaints fetched successfully',
      data: mockComplaints,
    );
  }
  
  Future<ApiResponse<Complaint>> getComplaintDetails(String id) async {
    await Future.delayed(Duration(seconds: 1));
    
    final mockComplaint = Complaint(
      id: id,
      title: 'Complaint Details',
      description: 'Detailed description of the complaint',
      category: 'Electrical',
      status: 'pending',
      priority: 'medium',
      createdAt: DateTime.now(),
      userId: 'user1',
    );
    
    return ApiResponse(
      success: true,
      message: 'Complaint details fetched successfully',
      data: mockComplaint,
    );
  }
  
  Future<ApiResponse<Complaint>> createComplaint(Map<String, dynamic> complaintData) async {
    await Future.delayed(Duration(seconds: 2));
    
    final newComplaint = Complaint(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      title: complaintData['title'] ?? '',
      description: complaintData['description'] ?? '',
      category: complaintData['category'] ?? '',
      status: 'pending',
      priority: complaintData['priority'] ?? 'medium',
      createdAt: DateTime.now(),
      userId: 'user1',
    );
    
    return ApiResponse(
      success: true,
      message: 'Complaint created successfully',
      data: newComplaint,
    );
  }
  
  Future<ApiResponse<Complaint>> updateComplaint(String id, Map<String, dynamic> complaintData) async {
    await Future.delayed(Duration(seconds: 1));
    
    final updatedComplaint = Complaint(
      id: id,
      title: complaintData['title'] ?? '',
      description: complaintData['description'] ?? '',
      category: complaintData['category'] ?? '',
      status: complaintData['status'] ?? 'pending',
      priority: complaintData['priority'] ?? 'medium',
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
      userId: 'user1',
    );
    
    return ApiResponse(
      success: true,
      message: 'Complaint updated successfully',
      data: updatedComplaint,
    );
  }
}