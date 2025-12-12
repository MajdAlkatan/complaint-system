import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../../data/repositories/auth_repository.dart';
import '../../../core/utils/validators.dart';

class LoginController extends GetxController {
  final AuthRepository _authRepository = Get.find();

  var email = ''.obs;
  var password = ''.obs;
  var isLoading = false.obs;
  var obscurePassword = true.obs;

  @override
  void onInit() {
    // Don't pre-fill for security in production
    // For testing only
    email.value = '';
    password.value = '';
    super.onInit();
  }

  void setEmail(String value) => email.value = value;
  void setPassword(String value) => password.value = value;
  void togglePasswordVisibility() =>
      obscurePassword.value = !obscurePassword.value;

  String? validateEmail(String? value) => Validators.validateEmail(value);
  String? validatePassword(String? value) => Validators.validatePassword(value);

  bool get isFormValid =>
      validateEmail(email.value) == null &&
      validatePassword(password.value) == null;

  Future<void> login() async {
    if (!isFormValid) return;

    try {
      isLoading.value = true;
      final response = await _authRepository.login(email.value, password.value);

      if (response.success) {
        // Simply navigate without showing snackbar
        Get.offAllNamed('/home');
      } else {
        // Show error using simple dialog instead of snackbar
        _showErrorDialog(response.message);
      }
    } catch (e) {
      _showErrorDialog('An error occurred during login: $e');
    } finally {
      isLoading.value = false;
    }
  }

  void _showErrorDialog(String message) {
    Get.dialog(
      AlertDialog(
        title: Text('Error'),
        content: Text(message),
        actions: [TextButton(onPressed: () => Get.back(), child: Text('OK'))],
      ),
      barrierDismissible: false,
    );
  }

  void navigateToRegister() {
    Get.toNamed('/citizen-register');
  }

  
}
