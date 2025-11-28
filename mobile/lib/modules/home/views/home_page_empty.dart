import 'package:complaint/core/theme/colors.dart';
import 'package:complaint/core/widgets/custom_button.dart';
import 'package:complaint/modules/auth/controllers/auth_controller.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../controllers/home_controller.dart';

class HomePageEmpty extends GetView<HomeController> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Column(
        children: [
          // Header Section (same as HomePage)
          _buildHeader(),

          // Empty State Content
          Expanded(
            child: Center(
              child: Padding(
                padding: EdgeInsets.all(20),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.receipt_long,
                      size: 100,
                      color: AppColors.textSecondary,
                    ),
                    SizedBox(height: 24),
                    Text(
                      'No Complaints Yet',
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    SizedBox(height: 12),
                    Text(
                      'Start by creating your first complaint to get started with the system',
                      style: TextStyle(
                        fontSize: 16,
                        color: AppColors.textSecondary,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    SizedBox(height: 32),
                    CustomButton(
                      text: 'Add First Complaint',
                      onPressed: controller.navigateToAddComplaint,
                      backgroundColor: AppColors.primary,
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: controller.navigateToAddComplaint,
        backgroundColor: AppColors.primary,
        child: Icon(Icons.add, color: Colors.white),
      ),
    );
  }

  Widget _buildHeader() {
    return Container(
      width: double.infinity,
      padding: EdgeInsets.symmetric(horizontal: 20, vertical: 16),
      decoration: BoxDecoration(
        color: AppColors.background,
        borderRadius: BorderRadius.only(
          bottomLeft: Radius.circular(20),
          bottomRight: Radius.circular(20),
        ),
      ),
      child: SafeArea(
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            // Left side: Logo + Text
            Expanded(
              child: Row(
                children: [
                  // Logo
                  Container(
                    width: 64,
                    height: 64,
                    margin: EdgeInsets.only(right: 12),
                    child: Image.asset(
                      'assets/images/logosyr3@3x.png',
                      fit: BoxFit.contain,
                    ),
                  ),

                  // Text section
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          'Welcome back, ${controller.userName}',
                          style: TextStyle(
                            color: Colors.black,
                            fontSize: 14,
                            fontWeight: FontWeight.w500,
                          ),
                          overflow: TextOverflow.ellipsis,
                        ),
                        SizedBox(height: 2),
                        Text(
                          controller.organizationName,
                          style: TextStyle(
                            color: Colors.black,
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            SizedBox(width: 16),

            // Right side: Icons
            Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                _buildIconButton(
                  icon: Icons.notifications_outlined,
                  onPressed: () {
                    // Handle notification
                  },
                ),
                SizedBox(width: 4),
                _buildIconButton(
                  icon: Icons.person_outline,
                  onPressed: () {
                    // Handle profile
                  },
                ),
                SizedBox(width: 4),
                _buildIconButton(
                  icon: Icons.logout,
                  onPressed: _showLogoutDialog,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildIconButton({
    required IconData icon,
    required VoidCallback onPressed,
  }) {
    return Container(
      width: 40,
      height: 40,
      child: IconButton(
        onPressed: onPressed,
        icon: Icon(icon, color: Colors.black, size: 22),
        padding: EdgeInsets.zero,
        style: IconButton.styleFrom(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        ),
      ),
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
              // Call logout method from auth controller
              Get.find<AuthController>().logout();
            },
            child: Text('Logout'),
          ),
        ],
      ),
    );
  }
}
