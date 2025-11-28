import 'package:complaint/core/theme/colors.dart';
import 'package:complaint/core/widgets/main_layout.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../controllers/search_controllers.dart';
import '../../../core/widgets/custom_textfield.dart';

class SearchPage extends GetView<SearchControllers> {
  @override
  Widget build(BuildContext context) {
     return MainLayout(
      currentIndex: 1, // Search is selected
      child: Scaffold(
        appBar: AppBar(
          title: Text('Search Complaints'),
        ),
      body: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          children: [
            CustomTextField(
              label: 'Search',
              hintText: 'Enter complaint title or description...',
              onChanged: controller.setSearchQuery,
            ),
            SizedBox(height: 20),
            Obx(() {
              if (controller.isLoading.value) {
                return Expanded(
                  child: Center(child: CircularProgressIndicator()),
                );
              }
              
              if (controller.searchQuery.isEmpty) {
                return Expanded(
                  child: Center(
                    child: Text(
                      'Enter search terms to find complaints',
                      style: TextStyle(color: AppColors.textSecondary),
                    ),
                  ),
                );
              }
              
              if (controller.searchResults.isEmpty) {
                return Expanded(
                  child: Center(
                    child: Text(
                      'No complaints found',
                      style: TextStyle(color: AppColors.textSecondary),
                    ),
                  ),
                );
              }
              
              return Expanded(
                child: ListView.builder(
                  itemCount: controller.searchResults.length,
                  itemBuilder: (context, index) {
                    final complaint = controller.searchResults[index];
                    return Card(
                      child: ListTile(
                        title: Text(complaint.title),
                        subtitle: Text(complaint.category),
                        trailing: Text(complaint.status),
                      ),
                    );
                  },
                ),
              );
            }),
          ],
        ),
      ),
     ));
  }
}