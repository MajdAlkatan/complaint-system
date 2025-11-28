class ApiConstants {
  static const String baseUrl = 'https://your-api-url.com/api';
  
  // Auth endpoints
  static const String login = '/auth/login';
  static const String register = '/auth/register';
  static const String verifyCode = '/auth/verify';
  static const String logout = '/auth/logout';
  
  // Complaint endpoints
  static const String complaints = '/complaints';
  static const String complaintDetails = '/complaints/{id}';
  static const String createComplaint = '/complaints/create';
  static const String updateComplaint = '/complaints/{id}';
  
  // Headers
  static const Map<String, String> headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
}