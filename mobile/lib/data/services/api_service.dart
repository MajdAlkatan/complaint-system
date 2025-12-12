import 'dart:convert';
import 'package:get/get.dart';
import 'package:http/http.dart' as http;
import '../models/api_response.dart';

class ApiService extends GetxService {
  final String baseUrl = 'http://127.0.0.1:8000/api';
  final Map<String, String> _headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  Future<ApiService> init() async {
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
      final uri = Uri.parse(
        '$baseUrl$endpoint',
      ).replace(queryParameters: queryParams);
      final response = await http.get(uri, headers: _headers);

      return _handleResponse<T>(response, fromJson);
    } catch (e) {
      return ApiResponse(
        success: false,
        message: 'Network error: Check your connection',
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
        message: 'Network error: Check your connection',
      );
    }
  }

  ApiResponse<T> _handleResponse<T>(
    http.Response response,
    T Function(dynamic)? fromJson,
  ) {
    try {
      final Map<String, dynamic> responseData = jsonDecode(response.body);

      if (response.statusCode >= 200 && response.statusCode < 300) {
        return ApiResponse<T>(
          success: true,
          message: 'Success',
          data: fromJson != null ? fromJson(responseData) : responseData,
          statusCode: response.statusCode,
        );
      } else {
        String errorMessage = 'Request failed';
        if (responseData.containsKey('message')) {
          errorMessage = responseData['message'];
        } else if (responseData.containsKey('errors')) {
          final errors = responseData['errors'];
          if (errors is Map && errors.isNotEmpty) {
            final firstError = errors.values.first;
            if (firstError is List && firstError.isNotEmpty) {
              errorMessage = firstError.first.toString();
            }
          }
        }

        return ApiResponse<T>(
          success: false,
          message: errorMessage,
          statusCode: response.statusCode,
        );
      }
    } catch (e) {
      return ApiResponse<T>(
        success: false,
        message: 'Server error: Invalid response format',
        statusCode: response.statusCode,
      );
    }
  }
}
