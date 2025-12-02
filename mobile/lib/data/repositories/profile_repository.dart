import 'package:get/get.dart';
import '../models/profile_model.dart';
import '../models/api_response.dart';
import '../services/api_service.dart';
import '../services/storage_service.dart';

class ProfileRepository extends GetxService {
  final ApiService _apiService = Get.find();
  final StorageService _storageService = Get.find();

  Future<ApiResponse<Profile>> getProfile() async {
    // Simulate API call - replace with actual implementation
    await Future.delayed(Duration(seconds: 1));

    // Mock data - replace with actual API call
    final mockProfile = Profile(
      id: '1',
      name: 'John Citizen',
      email: 'john.citizen@gov.sy',
      phone: '+963 123 456 789',
      department: 'Public Services',
      position: 'Citizen Services Officer',
      joinDate: DateTime(2023, 1, 15),
    );

    return ApiResponse(
      success: true,
      message: 'Profile loaded successfully',
      data: mockProfile,
    );
  }

  Future<ApiResponse<Profile>> updateProfile(Map<String, dynamic> profileData) async {
    // Simulate API call - replace with actual implementation
    await Future.delayed(Duration(seconds: 2));

    final updatedProfile = Profile(
      id: profileData['id'] ?? '1',
      name: profileData['name'] ?? '',
      email: profileData['email'] ?? '',
      phone: profileData['phone'] ?? '',
      department: profileData['department'] ?? '',
      position: profileData['position'] ?? '',
      joinDate: DateTime.parse(profileData['joinDate'] ?? DateTime.now().toIso8601String()),
    );

    return ApiResponse(
      success: true,
      message: 'Profile updated successfully',
      data: updatedProfile,
    );
  }

  Future<ApiResponse<bool>> changePassword(String currentPassword, String newPassword) async {
    // Simulate API call
    await Future.delayed(Duration(seconds: 1));

    return ApiResponse(
      success: true,
      message: 'Password changed successfully',
      data: true,
    );
  }
}