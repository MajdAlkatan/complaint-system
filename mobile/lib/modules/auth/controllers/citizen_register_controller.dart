import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:intl/intl.dart';
import '../../../../data/repositories/auth_repository.dart';
import '../../../../core/utils/validators.dart';

class CitizenRegisterController extends GetxController {
  final AuthRepository _authRepository = Get.find();
  
  // Form fields
  var fullName = ''.obs;
  var birthOfDate = ''.obs;
  var phone = ''.obs;
  var email = ''.obs;
  var password = ''.obs;
  var passwordConfirmation = ''.obs;
  var isLoading = false.obs;
  var obscurePassword = true.obs;
  var obscureConfirmPassword = true.obs;
  
  @override
  void onInit() {
    super.onInit();
    resetForm();
  }
  
  @override
  void onClose() {
    // Clean up any resources if needed
    super.onClose();
  }
  
  void resetForm() {
    fullName.value = '';
    birthOfDate.value = '';
    phone.value = '';
    email.value = '';
    password.value = '';
    passwordConfirmation.value = '';
  }
  
  // Setters
  void setFullName(String value) => fullName.value = value;
  void setBirthOfDate(String value) => birthOfDate.value = value;
  void setPhone(String value) => phone.value = value;
  void setEmail(String value) => email.value = value;
  void setPassword(String value) => password.value = value;
  void setPasswordConfirmation(String value) => passwordConfirmation.value = value;
  
  void togglePasswordVisibility() => obscurePassword.value = !obscurePassword.value;
  void toggleConfirmPasswordVisibility() => obscureConfirmPassword.value = !obscureConfirmPassword.value;
  
  // Validators
  String? validateFullName(String? value) => Validators.validateRequired(value, 'Full Name');
  
  String? validateBirthOfDate(String? value) {
    if (value == null || value.isEmpty) {
      return 'Birth date is required';
    }
    
    try {
      final date = DateFormat('yyyy/M/d').parseStrict(value);
      final now = DateTime.now();
      final minDate = DateTime(1900, 1, 1);
      
      if (date.isAfter(now)) {
        return 'Birth date cannot be in the future';
      }
      if (date.isBefore(minDate)) {
        return 'Please enter a valid birth date';
      }
    } catch (e) {
      return 'Please enter date in YYYY/M/D format (e.g., 2003/5/2)';
    }
    
    return null;
  }
  
  String? validatePhone(String? value) => Validators.validatePhone(value);
  String? validateEmail(String? value) => Validators.validateEmail(value);
  String? validatePassword(String? value) => Validators.validatePassword(value);
  
  String? validatePasswordConfirmation(String? value) {
    if (value == null || value.isEmpty) {
      return 'Please confirm your password';
    }
    if (value != password.value) {
      return 'Passwords do not match';
    }
    return null;
  }
  
  bool get isFormValid =>
      validateFullName(fullName.value) == null &&
      validateBirthOfDate(birthOfDate.value) == null &&
      validatePhone(phone.value) == null &&
      validateEmail(email.value) == null &&
      validatePassword(password.value) == null &&
      validatePasswordConfirmation(passwordConfirmation.value) == null;
  
  // Date picker
  Future<void> pickDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime(2003, 5, 2),
      firstDate: DateTime(1900, 1, 1),
      lastDate: DateTime.now(),
    );
    
    if (picked != null) {
      birthOfDate.value = DateFormat('yyyy/M/d').format(picked);
    }
  }
  
  // Registration
  Future<void> register() async {
    if (!isFormValid) {
      print('Form validation failed');
      return;
    }
    
    // Prevent multiple clicks
    if (isLoading.value) return;
    
    try {
      isLoading.value = true;
      
      final userData = {
        'full_name': fullName.value,
        'birth_of_date': birthOfDate.value,
        'phone': phone.value,
        'email': email.value,
        'password': password.value,
        'password_confirmation': passwordConfirmation.value,
      };
      
      print('Starting registration process...');
      final response = await _authRepository.register(userData);
      
      if (response.success && response.data != null) {
        print('Registration successful, attempting auto-login...');
        
        // After successful registration, automatically login
        final loginResponse = await _authRepository.login(email.value, password.value);
        
        if (loginResponse.success) {
          print('Auto-login successful');
          // Navigate immediately without awaiting anything else
          Get.offAllNamed('/home');
        } else {
          print('Auto-login failed: ${loginResponse.message}');
          // Navigate to login page
          Get.offAllNamed('/login');
        }
      } else {
        print('Registration failed: ${response.message}');
        // Show error using a dialog to avoid rendering issues
        _showErrorDialog('Registration Failed', response.message);
      }
    } catch (e) {
      print('Registration error: $e');
      // Show error using a dialog
      _showErrorDialog('Registration Error', 'An unexpected error occurred. Please try again.');
    } finally {
      // Only update loading state if we haven't navigated away
      if (Get.isDialogOpen != true) {
        isLoading.value = false;
      }
    }
  }
  
  void _showErrorDialog(String title, String message) {
    // Check if context is still valid
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!Get.isDialogOpen!) {
        Get.dialog(
          AlertDialog(
            title: Text(title),
            content: Text(message),
            actions: [
              TextButton(
                onPressed: () => Get.back(),
                child: Text('OK'),
              ),
            ],
          ),
          barrierDismissible: false,
        );
      }
    });
  }
  
  void navigateToLogin() {
    Get.offAllNamed('/login');
  }
}