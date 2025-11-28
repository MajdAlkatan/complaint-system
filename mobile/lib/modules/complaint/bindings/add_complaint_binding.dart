import 'package:get/get.dart';
import '../../../../data/repositories/complaint_repository.dart';
import '../../../../data/services/api_service.dart';
import '../../../../data/services/storage_service.dart';
import '../controllers/add_complaint_controller.dart';

class AddComplaintBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<ApiService>(() => ApiService());
    Get.lazyPut<StorageService>(() => StorageService());
    Get.lazyPut<ComplaintRepository>(() => ComplaintRepository());
    Get.lazyPut<AddComplaintController>(() => AddComplaintController());
  }
}