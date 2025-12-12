import 'package:get/get.dart';
import '../controllers/citizen_register_controller.dart';

class CitizenRegisterBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<CitizenRegisterController>(() => CitizenRegisterController());
  }
}