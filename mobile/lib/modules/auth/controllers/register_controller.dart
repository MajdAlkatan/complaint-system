import 'package:get/get.dart';
import '../../../data/repositories/auth_repository.dart';
import '../../../core/utils/validators.dart';

class RegisterController extends GetxController {
  final AuthRepository _authRepository = Get.find();
  
  var name = ''.obs;
  var email = ''.obs;
  var phone = ''.obs;
  var password = ''.obs;
  var confirmPassword = ''.obs;
  var isLoading = false.obs;
  var obscurePassword = true.obs;
  var obscureConfirmPassword = true.obs;
  
  void setName(String value) => name.value = value;
  void setEmail(String value) => email.value = value;
  void setPhone(String value) => phone.value = value;
  void setPassword(String value) => password.value = value;
  void setConfirmPassword(String value) => confirmPassword.value = value;
  
  void togglePasswordVisibility() => obscurePassword.value = !obscurePassword.value;
  void toggleConfirmPasswordVisibility() => obscureConfirmPassword.value = !obscureConfirmPassword.value;
  
  String? validateName(String? value) => Validators.validateRequired(value, 'Name');
  String? validateEmail(String? value) => Validators.validateEmail(value);
  String? validatePhone(String? value) => Validators.validatePhone(value);
  String? validatePassword(String? value) => Validators.validatePassword(value);
  
  String? validateConfirmPassword(String? value) {
    if (value == null || value.isEmpty) {
      return 'Please confirm your password';
    }
    if (value != password.value) {
      return 'Passwords do not match';
    }
    return null;
  }
  
  bool get isFormValid =>
      validateName(name.value) == null &&
      validateEmail(email.value) == null &&
      validatePhone(phone.value) == null &&
      validatePassword(password.value) == null &&
      validateConfirmPassword(confirmPassword.value) == null;
  
  Future<void> register() async {
    if (!isFormValid) return;
    
    try {
      isLoading.value = true;
      final response = await _authRepository.register({
        'name': name.value,
        'email': email.value,
        'phone': phone.value,
        'password': password.value,
      });
      
      if (response.success) {
        Get.offAllNamed('/verification-code', arguments: email.value);
        Get.snackbar('Success', 'Registration successful');
      } else {
        Get.snackbar('Error', response.message);
      }
    } catch (e) {
      Get.snackbar('Error', 'An error occurred during registration');
    } finally {
      isLoading.value = false;
    }
  }
  
  void navigateToLogin() {
    Get.offAllNamed('/login');
  }
}