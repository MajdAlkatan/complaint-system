import 'package:get/get.dart';
import '../../data/services/api_service.dart';
import '../../data/services/storage_service.dart';
import '../../data/repositories/auth_repository.dart';
import '../../data/repositories/complaint_repository.dart';

class GlobalBinding extends Bindings {
  @override
  void dependencies() {
    // Initialize services
    Get.put<ApiService>(ApiService(), permanent: true);
    Get.put<StorageService>(StorageService(), permanent: true);
    
    // Initialize repositories
    Get.put<AuthRepository>(AuthRepository(), permanent: true);
    Get.put<ComplaintRepository>(ComplaintRepository(), permanent: true);
  }
}