import 'package:get/get.dart';
import '../../../data/models/complaint_model.dart';

class SearchControllers extends GetxController {
  var searchQuery = ''.obs;
  var searchResults = <Complaint>[].obs;
  var isLoading = false.obs;
  
  void setSearchQuery(String query) {
    searchQuery.value = query;
    performSearch();
  }
  
  void performSearch() {
    // This would typically call an API endpoint
    // For now, we'll simulate search with local data
    isLoading.value = true;
    
    // Simulate API call delay
    Future.delayed(Duration(milliseconds: 500), () {
      // In real app, this would come from API
      searchResults.assignAll([]); // Empty for now
      isLoading.value = false;
    });
  }
  
  void clearSearch() {
    searchQuery.value = '';
    searchResults.clear();
  }
}