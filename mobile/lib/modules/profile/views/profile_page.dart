import 'package:complaint/core/theme/colors.dart';
import 'package:complaint/core/widgets/custom_button.dart';
import 'package:complaint/core/widgets/custom_textfield.dart';
import 'package:complaint/core/widgets/loading_widget.dart';
import 'package:complaint/core/widgets/main_layout.dart';
import 'package:complaint/modules/auth/controllers/auth_controller.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../controllers/profile_controller.dart';

class ProfilePage extends GetView<ProfileController> {
  final _profileFormKey = GlobalKey<FormState>();
  final _passwordFormKey = GlobalKey<FormState>();

  @override
  Widget build(BuildContext context) {
    return MainLayout(
      currentIndex: 3, // Search is selected
      child: Scaffold(
        backgroundColor: AppColors.background,
        body: Obx(() {
          if (controller.isLoading.value && controller.profile.value == null) {
            return LoadingWidget(message: 'Loading profile...');
          }

          return SingleChildScrollView(
            padding: EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Profile Header
                _buildProfileHeader(),
                SizedBox(height: 24),

                // Profile Information
                _buildProfileSection(),
                SizedBox(height: 24),

                // Change Password Section
                _buildPasswordSection(),
                SizedBox(height: 24),

                // Logout Button
                _buildLogoutButton(),
              ],
            ),
          );
        }),
      ),
    );
  }

  Widget _buildProfileHeader() {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Container(
        padding: EdgeInsets.all(20),
        width: double.infinity,
        child: Obx(() {
          final profile = controller.profile.value;
          return Column(
            children: [
              // Profile Avatar
              Container(
                width: 80,
                height: 80,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: AppColors.primary.withOpacity(0.1),
                ),
                child: Icon(Icons.person, size: 40, color: AppColors.primary),
              ),
              SizedBox(height: 16),

              // Name and Position
              Text(
                profile?.name ?? 'Loading...',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: AppColors.textPrimary,
                ),
              ),
              SizedBox(height: 4),
              Text(
                profile?.position ?? '',
                style: TextStyle(fontSize: 16, color: AppColors.textSecondary),
              ),
              SizedBox(height: 8),
              Text(
                profile?.department ?? '',
                style: TextStyle(fontSize: 14, color: AppColors.textSecondary),
              ),
            ],
          );
        }),
      ),
    );
  }

  Widget _buildProfileSection() {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Container(
        padding: EdgeInsets.all(20),
        width: double.infinity,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Profile Information',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: AppColors.textPrimary,
                  ),
                ),
                Obx(
                  () => IconButton(
                    onPressed: controller.toggleEditMode,
                    icon: Icon(
                      controller.isEditing.value ? Icons.cancel : Icons.edit,
                      color: AppColors.primary,
                    ),
                  ),
                ),
              ],
            ),
            SizedBox(height: 16),

            Form(
              key: _profileFormKey,
              child: Obx(() {
                final isEditing = controller.isEditing.value;
                return Column(
                  children: [
                    CustomTextField(
                      label: 'Full Name',
                      hintText: 'Enter your full name',
                      initialValue: controller.name.value,
                      onChanged: controller.setName,
                      enabled: isEditing,
                      validator: (value) =>
                          value?.isEmpty ?? true ? 'Name is required' : null,
                    ),
                    SizedBox(height: 16),
                    CustomTextField(
                      label: 'Email',
                      hintText: 'Enter your email',
                      initialValue: controller.email.value,
                      onChanged: controller.setEmail,
                      enabled: isEditing,
                      keyboardType: TextInputType.emailAddress,
                      validator: (value) {
                        if (value?.isEmpty ?? true) return 'Email is required';
                        if (!value!.isEmail)
                          return 'Please enter a valid email';
                        return null;
                      },
                    ),
                    SizedBox(height: 16),
                    CustomTextField(
                      label: 'Phone',
                      hintText: 'Enter your phone number',
                      initialValue: controller.phone.value,
                      onChanged: controller.setPhone,
                      enabled: isEditing,
                      keyboardType: TextInputType.phone,
                      validator: (value) =>
                          value?.isEmpty ?? true ? 'Phone is required' : null,
                    ),
                    SizedBox(height: 16),
                    CustomTextField(
                      label: 'Department',
                      hintText: 'Enter your department',
                      initialValue: controller.department.value,
                      onChanged: controller.setDepartment,
                      enabled: isEditing,
                    ),
                    SizedBox(height: 16),
                    CustomTextField(
                      label: 'Position',
                      hintText: 'Enter your position',
                      initialValue: controller.position.value,
                      onChanged: controller.setPosition,
                      enabled: isEditing,
                    ),

                    if (isEditing) ...[
                      SizedBox(height: 20),
                      Row(
                        children: [
                          Expanded(
                            child: CustomButton(
                              text: 'Cancel',
                              onPressed: controller.toggleEditMode,
                              backgroundColor: AppColors.textSecondary,
                            ),
                          ),
                          SizedBox(width: 12),
                          Expanded(
                            child: CustomButton(
                              text: 'Save Changes',
                              onPressed: () {
                                if (_profileFormKey.currentState?.validate() ??
                                    false) {
                                  controller.updateProfile();
                                }
                              },
                              isLoading: controller.isLoading.value,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ],
                );
              }),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPasswordSection() {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Container(
        padding: EdgeInsets.all(20),
        width: double.infinity,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Change Password',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: AppColors.textPrimary,
              ),
            ),
            SizedBox(height: 16),

            Form(
              key: _passwordFormKey,
              child: Column(
                children: [
                  CustomTextField(
                    label: 'Current Password',
                    hintText: 'Enter current password',
                    obscureText: true,
                    onChanged: controller.setCurrentPassword,
                    validator: (value) => value?.isEmpty ?? true
                        ? 'Current password is required'
                        : null,
                  ),
                  SizedBox(height: 16),
                  CustomTextField(
                    label: 'New Password',
                    hintText: 'Enter new password',
                    obscureText: true,
                    onChanged: controller.setNewPassword,
                    validator: (value) {
                      if (value?.isEmpty ?? true)
                        return 'New password is required';
                      if (value!.length < 6)
                        return 'Password must be at least 6 characters';
                      return null;
                    },
                  ),
                  SizedBox(height: 16),
                  CustomTextField(
                    label: 'Confirm New Password',
                    hintText: 'Confirm new password',
                    obscureText: true,
                    onChanged: controller.setConfirmPassword,
                    validator: (value) {
                      if (value?.isEmpty ?? true)
                        return 'Please confirm password';
                      if (value != controller.newPassword.value)
                        return 'Passwords do not match';
                      return null;
                    },
                  ),
                  SizedBox(height: 20),
                  CustomButton(
                    text: 'Change Password',
                    onPressed: () {
                      if (_passwordFormKey.currentState?.validate() ?? false) {
                        controller.changePassword();
                      }
                    },
                    isLoading: controller.isChangingPassword.value,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLogoutButton() {
    return CustomButton(
      text: 'Logout',
      onPressed: _showLogoutDialog,
      backgroundColor: AppColors.error,
    );
  }

  void _showLogoutDialog() {
    Get.dialog(
      AlertDialog(
        title: Text('Logout'),
        content: Text('Are you sure you want to logout?'),
        actions: [
          TextButton(onPressed: () => Get.back(), child: Text('Cancel')),
          TextButton(
            onPressed: () {
              Get.back();
              Get.find<AuthController>().logout();
            },
            child: Text('Logout', style: TextStyle(color: AppColors.error)),
          ),
        ],
      ),
    );
  }
}
