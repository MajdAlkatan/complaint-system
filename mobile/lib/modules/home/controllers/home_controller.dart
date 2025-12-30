import 'package:complaint/data/repositories/auth_repository.dart';
import 'package:get/get.dart';
import '../../../data/models/complaint_model.dart';
import '../../../data/repositories/complaint_repository.dart';

class HomeController extends GetxController {
  final ComplaintRepository _complaintRepository = Get.find();
  final AuthRepository _authRepository = Get.find();
  
  var complaints = <Complaint>[].obs;
  var isLoading = false.obs;
  var selectedFilter = 'All'.obs;
  
  final filters = ['All', 'New', 'In Progress', 'Resolved', 'Rejected'];
  
  @override
  void onInit() {
    fetchComplaints();
    super.onInit();
  }
  
  String get userName {
    final user = _authRepository.currentUser;
    return user?.fullName.split(' ').first ?? 'User';
  }
  
  Future<void> fetchComplaints() async {
    try {
      isLoading.value = true;
      final response = await _complaintRepository.getComplaints();
      
      if (response.success) {
        complaints.assignAll(response.data ?? []);
        print('Fetched ${complaints.length} complaints');
      } else {
        Get.snackbar('Error', response.message);
      }
    } catch (e) {
      print('Error in fetchComplaints: $e');
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
      'New': 'new',
      'In Progress': 'in_progress',
      'Resolved': 'resolved',
      'Rejected': 'rejected',
    };
    
    final status = statusMap[selectedFilter.value];
    if (status == null) return complaints;
    
    return complaints.where((complaint) => complaint.status == status).toList();
  }
  
  void navigateToComplaintDetails(Complaint complaint) {
  print('=== NAVIGATING TO COMPLAINT DETAILS ===');
  print('Complaint ID: ${complaint.id}');
  print('Reference: ${complaint.referenceNumber}');
  print('Title: ${complaint.title}');
  print('Complaint object: $complaint');
  
  // Pass the complaint object directly to details page
  Get.toNamed(
    '/complaint-details',
    arguments: complaint.toJson(), // Convert to JSON for serialization
  );
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
  String get organizationName => 'SYRIAN GOVERNMENT COMPLAINTS';
}