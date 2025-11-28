import 'package:complaint/core/constant/api_constants.dart';
import 'package:complaint/core/constant/app_constants.dart';
import 'package:get/get.dart';
import '../models/user_model.dart';
import '../models/api_response.dart';
import '../services/api_service.dart';
import '../services/storage_service.dart';

class AuthRepository extends GetxService {
  final ApiService _apiService = Get.find();
  final StorageService _storageService = Get.find();

  Future<ApiResponse<User>> login(String email, String password) async {
    // Simulate API call
    await Future.delayed(Duration(seconds: 2));

    // Mock successful login
    final user = User(
      id: '1',
      name: 'John Doe',
      email: email,
      phone: '+1234567890',
    );

    // Store token and user data
    _storageService.write(AppConstants.tokenKey, 'mock_token');
    _storageService.write(AppConstants.userKey, user.toJson());
    _apiService.setAuthToken('mock_token');

    return ApiResponse(success: true, message: 'Login successful', data: user);
  }

  Future<ApiResponse<User>> register(Map<String, dynamic> userData) async {
    final response = await _apiService.post(
      ApiConstants.register,
      body: userData,
      fromJson: (data) => User.fromJson(data),
    );

    return response;
  }

  Future<ApiResponse<bool>> verifyCode(String email, String code) async {
    final response = await _apiService.post(
      ApiConstants.verifyCode,
      body: {'email': email, 'code': code},
    );

    return ApiResponse(
      success: response.success,
      message: response.message,
      data: response.success,
    );
  }

  Future<void> logout() async {
    await _apiService.post(ApiConstants.logout);
    _storageService.remove(AppConstants.tokenKey);
    _storageService.remove(AppConstants.userKey);
    _apiService.removeAuthToken();
  }

  bool get isLoggedIn {
    return _storageService.hasData(AppConstants.tokenKey);
  }

  User? get currentUser {
    final userData = _storageService.read<Map<String, dynamic>>(
      AppConstants.userKey,
    );
    if (userData != null) {
      return User.fromJson(userData);
    }
    return null;
  }
}
