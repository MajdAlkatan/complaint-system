import 'package:complaint/data/models/user_model.dart';
import 'package:get/get.dart';
import '../../../data/repositories/auth_repository.dart';

class AuthController extends GetxController {
  final AuthRepository _authRepository = Get.find();
  
  var isLoggedIn = false.obs;
  var currentUser = Rxn<User>();
  
  @override
  void onInit() {
    checkAuthStatus();
    super.onInit();
  }
  
  void checkAuthStatus() {
    isLoggedIn.value = _authRepository.isLoggedIn;
    if (isLoggedIn.value) {
      currentUser.value = _authRepository.currentUser;
    }
  }
  
  Future<void> logout() async {
    await _authRepository.logout();
    isLoggedIn.value = false;
    currentUser.value = null;
    Get.offAllNamed('/login');
  }
}