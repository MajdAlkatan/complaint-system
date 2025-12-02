import 'package:get/get.dart';
import '../../../../data/repositories/profile_repository.dart';
import '../../../../data/services/api_service.dart';
import '../../../../data/services/storage_service.dart';
import '../controllers/profile_controller.dart';

class ProfileBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<ProfileController>(() => ProfileController());
    Get.lazyPut<ProfileRepository>(() => ProfileRepository());
  }
}