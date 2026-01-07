// في api_service.dart
import 'dart:convert';
import 'package:complaint/data/services/storage_service.dart';
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
    await _loadAuthTokenFromStorage();
    return this;
  }

  Future<void> _loadAuthTokenFromStorage() async {
    try {
      final storageService = Get.find<StorageService>();
      final token = storageService.read<String>('access_token');
      if (token != null && token.isNotEmpty) {
        _headers['Authorization'] = 'Bearer $token';
        print('Loaded auth token from storage');
      } else {
        print('No auth token found in storage');
      }
    } catch (e) {
      print('Error loading auth token from storage: $e');
    }
  }

  void setAuthToken(String token) {
    _headers['Authorization'] = 'Bearer $token';
  }

  void removeAuthToken() {
    _headers.remove('Authorization');
  }

  Future<ApiResponse<T>> postMultipart<T>(
    String endpoint, {
    required Map<String, String> fields,
    required List<http.MultipartFile> files,
    T Function(dynamic)? fromJson,
  }) async {
    try {
      print('API Multipart POST Request: $baseUrl$endpoint');
      print('Headers: $_headers');
      print('Fields: $fields');
      print('Files count: ${files.length}');

      final uri = Uri.parse('$baseUrl$endpoint');
      var request = http.MultipartRequest('POST', uri);

      // إضافة الهيدرات (مع إزالة Content-Type لأن MultipartRequest يضيفه تلقائياً)
      final headersWithoutContentType = Map<String, String>.from(_headers);
      headersWithoutContentType.remove('Content-Type');
      request.headers.addAll(headersWithoutContentType);

      // إضافة الحقول النصية
      fields.forEach((key, value) {
        request.fields[key] = value;
      });

      // إضافة الملفات
      request.files.addAll(files);

      // إرسال الطلب
      final streamedResponse = await request.send();
      final response = await http.Response.fromStream(streamedResponse);

      print('API Multipart POST Response Status: ${response.statusCode}');
      print('API Multipart POST Response Body: ${response.body}');

      return _handleResponse<T>(response, fromJson);
    } catch (e, s) {
      print('API Multipart POST Error: $e');
      print('Stack Trace: $s');
      return ApiResponse<T>(
        success: false,
        message: 'Network error: Check your connection. Error: $e',
      );
    }
  }

  // GET method
  Future<ApiResponse<T>> get<T>(
    String endpoint, {
    Map<String, String>? queryParams,
    T Function(dynamic)? fromJson,
  }) async {
    try {
      print('API GET Request: $baseUrl$endpoint');
      print('Headers: $_headers');

      final uri = Uri.parse(
        '$baseUrl$endpoint',
      ).replace(queryParameters: queryParams);
      final response = await http.get(uri, headers: _headers);

      print('API GET Response Status: ${response.statusCode}');
      print('API GET Response Body: ${response.body}');

      return _handleResponse<T>(response, fromJson);
    } catch (e, s) {
      print('API GET Error: $e');
      print('Stack Trace: $s');
      return ApiResponse<T>(
        success: false,
        message: 'Network error: Check your connection. Error: $e',
      );
    }
  }

  // POST method
  Future<ApiResponse<T>> post<T>(
    String endpoint, {
    dynamic body,
    T Function(dynamic)? fromJson,
  }) async {
    try {
      print('API POST Request: $baseUrl$endpoint');
      print('Headers: $_headers');
      print('Request Body: $body');

      final uri = Uri.parse('$baseUrl$endpoint');
      final response = await http.post(
        uri,
        headers: _headers,
        body: jsonEncode(body),
      );

      print('API POST Response Status: ${response.statusCode}');
      print('API POST Response Body: ${response.body}');

      return _handleResponse<T>(response, fromJson);
    } catch (e, s) {
      print('API POST Error: $e');
      print('Stack Trace: $s');
      return ApiResponse<T>(
        success: false,
        message: 'Network error: Check your connection. Error: $e',
      );
    }
  }

  // PUT method (new)
  Future<ApiResponse<T>> put<T>(
    String endpoint, {
    dynamic body,
    T Function(dynamic)? fromJson,
  }) async {
    try {
      print('API PUT Request: $baseUrl$endpoint');
      print('Headers: $_headers');
      print('Request Body: $body');

      final uri = Uri.parse('$baseUrl$endpoint');
      final response = await http.put(
        uri,
        headers: _headers,
        body: jsonEncode(body),
      );

      print('API PUT Response Status: ${response.statusCode}');
      print('API PUT Response Body: ${response.body}');

      return _handleResponse<T>(response, fromJson);
    } catch (e, s) {
      print('API PUT Error: $e');
      print('Stack Trace: $s');
      return ApiResponse<T>(
        success: false,
        message: 'Network error: Check your connection. Error: $e',
      );
    }
  }

  // DELETE method (new)
  Future<ApiResponse<T>> delete<T>(
    String endpoint, {
    T Function(dynamic)? fromJson,
  }) async {
    try {
      print('API DELETE Request: $baseUrl$endpoint');
      print('Headers: $_headers');

      final uri = Uri.parse('$baseUrl$endpoint');
      final response = await http.delete(uri, headers: _headers);

      print('API DELETE Response Status: ${response.statusCode}');
      print('API DELETE Response Body: ${response.body}');

      return _handleResponse<T>(response, fromJson);
    } catch (e, s) {
      print('API DELETE Error: $e');
      print('Stack Trace: $s');
      return ApiResponse<T>(
        success: false,
        message: 'Network error: Check your connection. Error: $e',
      );
    }
  }

  // Common response handler
  ApiResponse<T> _handleResponse<T>(
    http.Response response,
    T Function(dynamic)? fromJson,
  ) {
    try {
      print('Handling response with status: ${response.statusCode}');
      print('Response body: ${response.body}');

      // Check if response body is empty
      if (response.body.isEmpty) {
        return ApiResponse<T>(
          success: false,
          message: 'Empty response from server',
          statusCode: response.statusCode,
        );
      }

      final decodedBody = jsonDecode(response.body);

      // For web compatibility
      dynamic responseData = decodedBody;
      if (decodedBody is Map) {
        final Map<String, dynamic> convertedMap = {};
        decodedBody.forEach((key, value) {
          convertedMap[key.toString()] = value;
        });
        responseData = convertedMap;
      }

      if (response.statusCode >= 200 && response.statusCode < 300) {
        return ApiResponse<T>(
          success: true,
          message: 'Success',
          data: fromJson != null ? fromJson(responseData) : responseData,
          statusCode: response.statusCode,
        );
      } else {
        String errorMessage =
            'Request failed with status ${response.statusCode}';

        if (responseData is Map) {
          if (responseData.containsKey('message')) {
            errorMessage = responseData['message']?.toString() ?? errorMessage;
          } else if (responseData.containsKey('errors')) {
            final errors = responseData['errors'];
            if (errors is Map && errors.isNotEmpty) {
              final firstError = errors.values.first;
              if (firstError is List && firstError.isNotEmpty) {
                errorMessage = firstError.first.toString();
              }
            }
          }
        }

        return ApiResponse<T>(
          success: false,
          message: errorMessage,
          statusCode: response.statusCode,
        );
      }
    } catch (e, s) {
      print('Error handling response: $e');
      print('Response handling stack trace: $s');
      print('Raw response: ${response.body}');
      return ApiResponse<T>(
        success: false,
        message: 'Server error: Invalid response format. Error: $e',
        statusCode: response.statusCode,
      );
    }
  }
}
