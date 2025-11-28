import 'package:complaint/core/theme/colors.dart';
import 'package:complaint/core/utils/extensions.dart';
import 'package:complaint/core/widgets/main_layout.dart';
import 'package:complaint/data/models/complaint_model.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../controllers/complaint_history_controller.dart';
import '../../../core/widgets/loading_widget.dart';

class ComplaintHistoryPage extends GetView<ComplaintHistoryController> {
  @override
  Widget build(BuildContext context) {
    return MainLayout(
      currentIndex: 2, // Reports is selected
      child: Scaffold(
        appBar: AppBar(title: Text('Complaint History')),
        body: Column(
          children: [
            // Status Filter
            Container(
              height: 60,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                itemCount: controller.statusFilters.length,
                itemBuilder: (context, index) {
                  final status = controller.statusFilters[index];
                  return Obx(
                    () => FilterChip(
                      label: Text(status.replaceAll('_', ' ').toUpperCase()),
                      selected: controller.filterStatus.value == status,
                      onSelected: (selected) =>
                          controller.setFilterStatus(status),
                    ),
                  );
                },
              ),
            ),

            // Complaints List
            Expanded(
              child: Obx(() {
                if (controller.isLoading.value) {
                  return LoadingWidget(message: 'Loading history...');
                }

                return controller.filteredComplaints.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(
                              Icons.history,
                              size: 64,
                              color: AppColors.textSecondary,
                            ),
                            SizedBox(height: 16),
                            Text(
                              'No complaints found',
                              style: TextStyle(
                                fontSize: 18,
                                color: AppColors.textSecondary,
                              ),
                            ),
                          ],
                        ),
                      )
                    : ListView.builder(
                        itemCount: controller.filteredComplaints.length,
                        itemBuilder: (context, index) {
                          final complaint =
                              controller.filteredComplaints[index];
                          return ComplaintHistoryCard(complaint: complaint);
                        },
                      );
              }),
            ),
          ],
        ),
      ),
    );
  }
}

class ComplaintHistoryCard extends GetView<ComplaintHistoryController> {
  final Complaint complaint;

  const ComplaintHistoryCard({Key? key, required this.complaint})
    : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: ListTile(
        leading: Container(
          width: 8,
          decoration: BoxDecoration(
            color: _getStatusColor(complaint.status),
            borderRadius: BorderRadius.circular(4),
          ),
        ),
        title: Text(
          complaint.title,
          style: TextStyle(fontWeight: FontWeight.w500),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(complaint.category),
            Text(
              complaint.createdAt.toReadableDate,
              style: TextStyle(fontSize: 12, color: AppColors.textSecondary),
            ),
          ],
        ),
        trailing: Chip(
          label: Text(
            complaint.status.replaceAll('_', ' ').toUpperCase(),
            style: TextStyle(fontSize: 10),
          ),
          backgroundColor: _getStatusColor(complaint.status).withOpacity(0.1),
        ),
        onTap: () => controller.navigateToComplaintDetails(complaint),
      ),
    );
  }

  Color _getStatusColor(String status) {
    switch (status) {
      case 'resolved':
        return AppColors.success;
      case 'in_progress':
        return AppColors.warning;
      case 'rejected':
        return AppColors.error;
      default:
        return AppColors.textSecondary;
    }
  }
}
