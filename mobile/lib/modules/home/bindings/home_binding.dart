import 'package:get/get.dart';
import '../../../data/repositories/complaint_repository.dart';
import '../../../data/repositories/auth_repository.dart';
import '../../../data/services/api_service.dart';
import '../../../data/services/storage_service.dart';
import '../controllers/home_controller.dart';
import '../controllers/search_controllers.dart';

class HomeBinding extends Bindings {
  @override
  void dependencies() {
    // Ensure services are initialized
    Get.lazyPut<ApiService>(() => ApiService());
    Get.lazyPut<StorageService>(() => StorageService());
    
    // Initialize repositories
    Get.lazyPut<ComplaintRepository>(() => ComplaintRepository());
    Get.lazyPut<AuthRepository>(() => AuthRepository());
    
    // Initialize controllers
    Get.lazyPut<HomeController>(() => HomeController());
    Get.lazyPut<SearchControllers>(() => SearchControllers());
  }
}