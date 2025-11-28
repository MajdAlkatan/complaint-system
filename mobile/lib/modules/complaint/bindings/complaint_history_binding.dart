import 'package:get/get.dart';
import '../../../data/repositories/complaint_repository.dart';
import '../../../data/services/api_service.dart';
import '../controllers/complaint_history_controller.dart';

class ComplaintHistoryBinding extends Bindings {
  @override
  void dependencies() {
    // Ensure services are initialized
    Get.lazyPut<ApiService>(() => ApiService());
    
    // Initialize repository
    Get.lazyPut<ComplaintRepository>(() => ComplaintRepository());
    
    // Initialize controller
    Get.lazyPut<ComplaintHistoryController>(() => ComplaintHistoryController());
  }
}