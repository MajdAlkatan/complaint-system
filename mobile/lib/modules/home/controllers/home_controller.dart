import 'package:get/get.dart';
import '../../../data/models/complaint_model.dart';
import '../../../data/repositories/complaint_repository.dart';

class HomeController extends GetxController {
  final ComplaintRepository _complaintRepository = Get.find();
  
  var complaints = <Complaint>[].obs;
  var isLoading = false.obs;
  var selectedFilter = 'All'.obs;
  
  final filters = ['All', 'New', 'In Progress', 'Resolved', 'Rejected'];
  
  @override
  void onInit() {
    fetchComplaints();
    super.onInit();
  }
  
  Future<void> fetchComplaints() async {
    try {
      isLoading.value = true;
      final response = await _complaintRepository.getComplaints();
      
      if (response.success) {
        complaints.assignAll(response.data ?? []);
      } else {
        Get.snackbar('Error', response.message);
      }
    } catch (e) {
      Get.snackbar('Error', 'Failed to load complaints');
    } finally {
      isLoading.value = false;
    }
  }
  
  void setFilter(String filter) {
    selectedFilter.value = filter;
  }
  
  List<Complaint> get filteredComplaints {
    if (selectedFilter.value == 'All') {
      return complaints;
    }
    
    // Map UI filters to complaint status
    final statusMap = {
      'New': 'pending',
      'In Progress': 'in_progress',
      'Resolved': 'resolved',
      'Rejected': 'rejected',
    };
    
    final status = statusMap[selectedFilter.value];
    return complaints.where((complaint) => complaint.status == status).toList();
  }
  
  void navigateToComplaintDetails(Complaint complaint) {
    Get.toNamed('/complaint-details', arguments: complaint);
  }
  
  void navigateToAddComplaint() {
    Get.toNamed('/add-new-complaint');
  }
  
  void navigateToComplaintHistory() {
    Get.toNamed('/complaint-history');
  }
  
  void navigateToSearch() {
    Get.toNamed('/search');
  }
  
  // Mock user data - replace with actual user data from your auth system
  String get userName => 'John Citizen';
  String get organizationName => 'SYRIAN GOVERNMENT COMPLAINTS';
}