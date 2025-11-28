import 'package:get/get.dart';
import '../../../data/repositories/auth_repository.dart';
import '../../../core/utils/validators.dart';

class LoginController extends GetxController {
  final AuthRepository _authRepository = Get.find();
  
  var email = ''.obs;
  var password = ''.obs;
  var isLoading = false.obs;
  var obscurePassword = true.obs;
  
  void setEmail(String value) => email.value = value;
  void setPassword(String value) => password.value = value;
  void togglePasswordVisibility() => obscurePassword.value = !obscurePassword.value;
  
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
        Get.offAllNamed('/home');
        Get.snackbar('Success', 'Login successful');
      } else {
        Get.snackbar('Error', response.message);
      }
    } catch (e) {
      Get.snackbar('Error', 'An error occurred during login');
    } finally {
      isLoading.value = false;
    }
  }
  
  void navigateToRegister() {
    Get.toNamed('/register');
  }
}