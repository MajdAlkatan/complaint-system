import 'package:complaint/core/theme/colors.dart';
import 'package:complaint/core/utils/extensions.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../controllers/complaint_controller.dart';
import '../../../core/widgets/loading_widget.dart';
import '../../../data/models/complaint_model.dart';

class ComplaintDetailsPage extends GetView<ComplaintController> {
  @override
  void onInit() {
    // super.onInit();
    final complaint = Get.arguments;
    if (complaint is Complaint) {
      controller.loadComplaint(complaint);
    } else if (complaint is String) {
      controller.fetchComplaintDetails(complaint);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Complaint Details'),
      ),
      body: Obx(() {
        if (controller.isLoading.value) {
          return LoadingWidget(message: 'Loading complaint details...');
        }
        
        final complaint = controller.complaint.value;
        if (complaint == null) {
          return Center(
            child: Text('Complaint not found'),
          );
        }
        
        return SingleChildScrollView(
          padding: EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Status Chip
              Align(
                alignment: Alignment.centerRight,
                child: Chip(
                  label: Text(
                    complaint.status.replaceAll('_', ' ').toUpperCase(),
                    style: TextStyle(
                      color: _getStatusColor(complaint.status),
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  backgroundColor: _getStatusColor(complaint.status).withOpacity(0.1),
                ),
              ),
              
              SizedBox(height: 20),
              
              // Title
              Text(
                complaint.title,
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: AppColors.textPrimary,
                ),
              ),
              
              SizedBox(height: 16),
              
              // Category and Priority
              Row(
                children: [
                  _buildInfoChip(
                    icon: Icons.category,
                    text: complaint.category,
                  ),
                  SizedBox(width: 8),
                  _buildInfoChip(
                    icon: Icons.priority_high,
                    text: complaint.priority.toUpperCase(),
                  ),
                ],
              ),
              
              SizedBox(height: 24),
              
              // Description
              Text(
                'Description',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textPrimary,
                ),
              ),
              SizedBox(height: 8),
              Text(
                complaint.description,
                style: TextStyle(
                  fontSize: 16,
                  color: AppColors.textSecondary,
                  height: 1.5,
                ),
              ),
              
              SizedBox(height: 24),
              
              // Dates
              _buildInfoRow('Created', complaint.createdAt.toReadableDateTime),
              if (complaint.updatedAt != null)
                _buildInfoRow('Updated', complaint.updatedAt!.toReadableDateTime),
            ],
          ),
        );
      }),
    );
  }

  Widget _buildInfoChip({required IconData icon, required String text}) {
    return Chip(
      label: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 16),
          SizedBox(width: 4),
          Text(text),
        ],
      ),
      backgroundColor: AppColors.background,
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          Text(
            '$label: ',
            style: TextStyle(
              fontWeight: FontWeight.w500,
              color: AppColors.textPrimary,
            ),
          ),
          Text(
            value,
            style: TextStyle(color: AppColors.textSecondary),
          ),
        ],
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