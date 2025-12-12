import 'package:get/get.dart';
import '../models/user_model.dart';
import '../models/api_response.dart';
import '../services/api_service.dart';
import '../services/storage_service.dart';

class AuthRepository extends GetxService {
  final ApiService _apiService = Get.find();
  final StorageService _storageService = Get.find();
  
  Future<ApiResponse<LoginResponse>> login(String email, String password) async {
    final response = await _apiService.post(
      '/citizens/login',
      body: {
        'email': email,
        'password': password,
      },
      fromJson: (data) => LoginResponse.fromJson(data),
    );
    
    if (response.success && response.data != null) {
      // Store token
      _storageService.write('access_token', response.data!.accessToken);
      _storageService.write('token_type', response.data!.tokenType);
      
      // Set auth token in API service
      _apiService.setAuthToken(response.data!.accessToken);
      
      // Fetch user data after login
      final userResponse = await getUserProfile();
      if (userResponse.success && userResponse.data != null) {
        _storageService.write('user', userResponse.data!.toJson());
      }
    }
    
    return response;
  }
  
  Future<ApiResponse<RegisterResponse>> register(Map<String, dynamic> userData) async {
    final response = await _apiService.post(
      '/citizens/register',
      body: userData,
      fromJson: (data) => RegisterResponse.fromJson(data),
    );
    
    if (response.success && response.data != null) {
      // Store user data
      _storageService.write('user', response.data!.citizen.toJson());
    }
    
    return response;
  }
  
  Future<ApiResponse<User>> getUserProfile() async {
    final response = await _apiService.get(
      '/citizens/profile',
      fromJson: (data) => User.fromJson(data),
    );
    
    return response;
  }
  
  Future<void> logout() async {
    // Simply clear local storage and navigate to login
    // No API call needed for JWT logout
    _storageService.remove('access_token');
    _storageService.remove('token_type');
    _storageService.remove('user');
    _apiService.removeAuthToken();
    
    print('Token cleared. User logged out.');
  }
  
  bool get isLoggedIn {
    return _storageService.hasData('access_token');
  }
  
  String? get accessToken {
    return _storageService.read<String>('access_token');
  }
  
  User? get currentUser {
    final userData = _storageService.read<Map<String, dynamic>>('user');
    if (userData != null) {
      return User.fromJson(userData);
    }
    return null;
  }
}