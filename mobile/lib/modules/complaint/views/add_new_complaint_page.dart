import 'package:complaint/core/theme/colors.dart';
import 'package:complaint/core/widgets/custom_button.dart';
import 'package:complaint/core/widgets/custom_textfield.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:file_picker/file_picker.dart';
import '../controllers/add_complaint_controller.dart';

class AddNewComplaintPage extends StatelessWidget {
  final _formKey = GlobalKey<FormState>();
  final AddComplaintController controller = Get.put(AddComplaintController());

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Add New Complaint'),
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Complaint Title
              CustomTextField(
                label: 'Complaint Title *',
                hintText: 'Enter complaint title',
                validator: controller.validateTitle,
                onChanged: controller.setTitle,
              ),
              SizedBox(height: 20),
              
              // Complaint Type Dropdown
              Text(
                'Complaint Type *',
                style: TextStyle(
                  fontWeight: FontWeight.w500,
                  color: AppColors.textPrimary,
                ),
              ),
              SizedBox(height: 8),
              Obx(() => DropdownButtonFormField<String>(
                value: controller.complaintType.value.isEmpty ? null : controller.complaintType.value,
                items: controller.complaintTypes.map((type) {
                  return DropdownMenuItem(
                    value: type,
                    child: Text(type),
                  );
                }).toList(),
                onChanged: (value) => controller.setComplaintType(value!),
                decoration: InputDecoration(
                  hintText: 'Select complaint type',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                validator: controller.validateComplaintType,
              )),
              SizedBox(height: 20),
              
              // Location Section
              Text(
                'Location *',
                style: TextStyle(
                  fontWeight: FontWeight.w500,
                  color: AppColors.textPrimary,
                ),
              ),
              SizedBox(height: 8),
              Row(
                children: [
                  Expanded(
                    child: TextFormField(
                      onChanged: controller.setLocation,
                      validator: controller.validateLocation,
                      decoration: InputDecoration(
                        hintText: 'Enter location or select from map',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                    ),
                  ),
                  SizedBox(width: 8),
                  Column(
                    children: [
                      // Current Location Button
                      Container(
                        width: 48,
                        height: 48,
                        child: IconButton(
                          onPressed: controller.getCurrentLocation,
                          icon: Icon(Icons.my_location, color: AppColors.primary),
                          style: IconButton.styleFrom(
                            backgroundColor: AppColors.primary.withOpacity(0.1),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                              side: BorderSide(color: AppColors.primary),
                            ),
                          ),
                        ),
                      ),
                      SizedBox(height: 4),
                      Text(
                        'Current',
                        style: TextStyle(fontSize: 10, color: AppColors.textSecondary),
                      ),
                    ],
                  ),
                  SizedBox(width: 8),
                  Column(
                    children: [
                      // Map Location Button
                      Container(
                        width: 48,
                        height: 48,
                        child: IconButton(
                          onPressed: controller.openMapForLocation,
                          icon: Icon(Icons.map, color: AppColors.primary),
                          style: IconButton.styleFrom(
                            backgroundColor: AppColors.primary.withOpacity(0.1),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                              side: BorderSide(color: AppColors.primary),
                            ),
                          ),
                        ),
                      ),
                      SizedBox(height: 4),
                      Text(
                        'Map',
                        style: TextStyle(fontSize: 10, color: AppColors.textSecondary),
                      ),
                    ],
                  ),
                ],
              ),
              SizedBox(height: 20),
              
              // Government Entity Dropdown
              Text(
                'Government Entity *',
                style: TextStyle(
                  fontWeight: FontWeight.w500,
                  color: AppColors.textPrimary,
                ),
              ),
              SizedBox(height: 8),
              Obx(() => DropdownButtonFormField<String>(
                value: controller.governmentEntity.value.isEmpty ? null : controller.governmentEntity.value,
                items: controller.governmentEntities.map((entity) {
                  return DropdownMenuItem(
                    value: entity,
                    child: Text(entity),
                  );
                }).toList(),
                onChanged: (value) => controller.setGovernmentEntity(value!),
                decoration: InputDecoration(
                  hintText: 'Select government entity',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                validator: controller.validateGovernmentEntity,
              )),
              SizedBox(height: 20),
              
              // Description with character counter
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  CustomTextField(
                    label: 'Description *',
                    hintText: 'Enter detailed description (max 250 characters)',
                    validator: controller.validateDescription,
                    onChanged: controller.setDescription,
                    maxLines: 4,
                  ),
                  SizedBox(height: 4),
                  Obx(() => Text(
                    '${controller.description.value.length}/250 characters',
                    style: TextStyle(
                      fontSize: 12,
                      color: controller.description.value.length > 250 
                          ? AppColors.error 
                          : AppColors.textSecondary,
                    ),
                  )),
                ],
              ),
              SizedBox(height: 20),
              
              // Attachment Section
              _buildAttachmentSection(),
              SizedBox(height: 30),
              
              // Submit Button
              Obx(() => CustomButton(
                text: 'Submit Complaint',
                onPressed: controller.isFormValid.value && !controller.isLoading.value
                    ? () {
                        if (_formKey.currentState!.validate()) {
                          controller.submitComplaint();
                        }
                      }
                    : null,
                isLoading: controller.isLoading.value,
              )),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildAttachmentSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Attachment',
          style: TextStyle(
            fontWeight: FontWeight.w500,
            color: AppColors.textPrimary,
          ),
        ),
        SizedBox(height: 8),
        
        // Dashed border file picker
        Container(
          width: double.infinity,
          padding: EdgeInsets.all(20),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: AppColors.border,
              width: 2,
              style: BorderStyle.solid,
            ),
          ),
          child: Column(
            children: [
              Icon(
                Icons.attach_file,
                size: 48,
                color: AppColors.textSecondary,
              ),
              SizedBox(height: 8),
              Text(
                'Attach files (Images, PDF, Documents)',
                style: TextStyle(
                  color: AppColors.textSecondary,
                ),
              ),
              SizedBox(height: 12),
              CustomButton(
                text: 'Choose File',
                onPressed: controller.pickFiles,
                backgroundColor: AppColors.primary,
                isEnabled: true,
              ),
              SizedBox(height: 8),
              Text(
                'Max 10 files, 10MB each',
                style: TextStyle(
                  fontSize: 12,
                  color: AppColors.textSecondary,
                ),
              ),
            ],
          ),
        ),
        
        // Selected files list - Only wrap the dynamic part in Obx
        Obx(() {
          if (controller.selectedFiles.isEmpty) {
            return SizedBox();
          }
          
          return Column(
            children: [
              SizedBox(height: 16),
              Text(
                'Selected Files:',
                style: TextStyle(
                  fontWeight: FontWeight.w500,
                  color: AppColors.textPrimary,
                ),
              ),
              SizedBox(height: 8),
              ...controller.selectedFiles.asMap().entries.map((entry) {
                final index = entry.key;
                final file = entry.value;
                return _buildFileItem(file, index);
              }).toList(),
            ],
          );
        }),
      ],
    );
  }

  Widget _buildFileItem(PlatformFile file, int index) {
    return Container(
      margin: EdgeInsets.only(bottom: 8),
      padding: EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.background,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          Icon(
            _getFileIcon(file.extension),
            color: AppColors.primary,
            size: 24,
          ),
          SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  file.name,
                  style: TextStyle(
                    fontWeight: FontWeight.w500,
                    color: AppColors.textPrimary,
                  ),
                  overflow: TextOverflow.ellipsis,
                ),
                SizedBox(height: 2),
                Text(
                  controller.getFileSizeString(file.size),
                  style: TextStyle(
                    fontSize: 12,
                    color: AppColors.textSecondary,
                  ),
                ),
              ],
            ),
          ),
          IconButton(
            onPressed: () => controller.removeFile(index),
            icon: Icon(Icons.delete, color: AppColors.error, size: 20),
            padding: EdgeInsets.zero,
            constraints: BoxConstraints(),
          ),
        ],
      ),
    );
  }

  IconData _getFileIcon(String? extension) {
    switch (extension?.toLowerCase()) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return Icons.image;
      case 'pdf':
        return Icons.picture_as_pdf;
      case 'doc':
      case 'docx':
        return Icons.description;
      case 'xls':
      case 'xlsx':
        return Icons.table_chart;
      default:
        return Icons.insert_drive_file;
    }
  }
}

extension on bool {
  bool get value => true;
}

