import 'package:get/get.dart';
import '../../../data/repositories/complaint_repository.dart';
import '../../../data/services/api_service.dart';
import '../../../data/services/storage_service.dart';
import '../controllers/complaint_controller.dart';
import '../controllers/complaint_history_controller.dart';
import '../controllers/add_complaint_controller.dart';

class ComplaintBinding extends Bindings {
  @override
  void dependencies() {
    // Ensure services are initialized
    Get.lazyPut<ApiService>(() => ApiService());
    Get.lazyPut<StorageService>(() => StorageService());
    
    // Initialize repository
    Get.lazyPut<ComplaintRepository>(() => ComplaintRepository());
    
    // Initialize controllers
    Get.lazyPut<ComplaintController>(() => ComplaintController());
    Get.lazyPut<ComplaintHistoryController>(() => ComplaintHistoryController());
    Get.lazyPut<AddComplaintController>(() => AddComplaintController());
  }
}