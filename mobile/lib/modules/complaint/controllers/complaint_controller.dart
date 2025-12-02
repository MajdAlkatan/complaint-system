import 'package:get/get.dart';
import '../../../data/models/complaint_model.dart';
import '../../../data/repositories/complaint_repository.dart';

class ComplaintController extends GetxController {
  final ComplaintRepository _complaintRepository = Get.find();
  
  var complaint = Rxn<Complaint>();
  var isLoading = false.obs;
  
  void fetchComplaintDetails(String complaintId) async {
    try {
      isLoading.value = true;
      final response = await _complaintRepository.getComplaintDetails(complaintId);
      
      if (response.success) {
        complaint.value = response.data;
      } else {
        Get.snackbar('Error', response.message);
        Get.back();
      }
    } catch (e) {
      Get.snackbar('Error', 'Failed to load complaint details');
      Get.back();
    } finally {
      isLoading.value = false;
    }
  }
  
  void loadComplaint(Complaint loadedComplaint) {
    complaint.value = loadedComplaint;
  }
}