import 'package:get/get.dart';
import '../../../data/models/complaint_model.dart';
import '../../../data/repositories/complaint_repository.dart';

class ComplaintHistoryController extends GetxController {
  final ComplaintRepository _complaintRepository = Get.find();
  
  var complaints = <Complaint>[].obs;
  var isLoading = false.obs;
  var filterStatus = 'All'.obs;
  
  final statusFilters = ['All', 'pending', 'in_progress', 'resolved', 'rejected'];
  
  @override
  void onInit() {
    fetchComplaintHistory();
    super.onInit();
  }
  
  Future<void> fetchComplaintHistory() async {
    try {
      isLoading.value = true;
      final response = await _complaintRepository.getComplaints();
      
      if (response.success) {
        complaints.assignAll((response.data ?? []) as Iterable<Complaint>);
      } else {
        Get.snackbar('Error', response.message);
      }
    } catch (e) {
      Get.snackbar('Error', 'Failed to load complaint history');
    } finally {
      isLoading.value = false;
    }
  }
  
  void setFilterStatus(String status) {
    filterStatus.value = status;
  }
  
  List<Complaint> get filteredComplaints {
    if (filterStatus.value == 'All') {
      return complaints;
    }
    return complaints.where((complaint) => complaint.status == filterStatus.value).toList();
  }
  
  void navigateToComplaintDetails(Complaint complaint) {
    Get.toNamed('/complaint-details', arguments: complaint);
  }
}