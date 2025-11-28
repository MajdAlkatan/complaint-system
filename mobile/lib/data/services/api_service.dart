import 'dart:convert';
import 'package:complaint/core/constant/app_constants.dart';
import 'package:get/get.dart';
import 'package:http/http.dart' as http;
import '../models/api_response.dart';

class ApiService extends GetxService {
  static ApiService get to => Get.find();
  
  final String baseUrl = ApiConstants.baseUrl;
  final Map<String, String> _headers = {};
  
  Future<ApiService> init() async {
    // Initialize headers with auth token if available
    _headers.addAll(ApiConstants.headers);
    return this;
  }
  
  void setAuthToken(String token) {
    _headers['Authorization'] = 'Bearer $token';
  }
  
  void removeAuthToken() {
    _headers.remove('Authorization');
  }
  
  Future<ApiResponse<T>> get<T>(
    String endpoint, {
    Map<String, String>? queryParams,
    T Function(dynamic)? fromJson,
  }) async {
    try {
      final uri = Uri.parse('$baseUrl$endpoint').replace(queryParameters: queryParams);
      final response = await http.get(uri, headers: _headers);
      
      return _handleResponse<T>(response, fromJson);
    } catch (e) {
      return ApiResponse(
        success: false,
        message: 'Network error: $e',
      );
    }
  }
  
  Future<ApiResponse<T>> post<T>(
    String endpoint, {
    dynamic body,
    T Function(dynamic)? fromJson,
  }) async {
    try {
      final uri = Uri.parse('$baseUrl$endpoint');
      final response = await http.post(
        uri,
        headers: _headers,
        body: jsonEncode(body),
      );
      
      return _handleResponse<T>(response, fromJson);
    } catch (e) {
      return ApiResponse(
        success: false,
        message: 'Network error: $e',
      );
    }
  }
  
  ApiResponse<T> _handleResponse<T>(http.Response response, T Function(dynamic)? fromJson) {
    final Map<String, dynamic> responseData = jsonDecode(response.body);
    
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return ApiResponse<T>(
        success: true,
        message: responseData['message'] ?? 'Success',
        data: fromJson != null ? fromJson(responseData['data']) : responseData['data'],
        statusCode: response.statusCode,
      );
    } else {
      return ApiResponse<T>(
        success: false,
        message: responseData['message'] ?? 'Request failed',
        statusCode: response.statusCode,
      );
    }
  }
}