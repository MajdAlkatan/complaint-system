import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:complaint/core/theme/colors.dart';
import 'package:complaint/core/widgets/custom_button.dart';
import 'package:complaint/core/widgets/custom_textfield.dart';
import '../controllers/login_controller.dart';

class LoginPage extends GetView<LoginController> {
  final _formKey = GlobalKey<FormState>();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: SingleChildScrollView(
          child: Padding(
            padding: EdgeInsets.all(24),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  SizedBox(height: 40),
                  
                  // Logo in center
                  Center(
                    child: Container(
                      width: 120,
                      height: 120,
                      child: Image.asset(
                        'assets/images/logosyr3@3x.png',
                        fit: BoxFit.contain,
                      ),
                    ),
                  ),
                  
                  SizedBox(height: 24),
                  
                  // Title: Syrian Government Complaint
                  Center(
                    child: Text(
                      'Syrian Government Complaint',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.w600,
                        color: AppColors.textPrimary,
                      ),
                    ),
                  ),
                  
                  SizedBox(height: 32),
                  
                  // Bold Title: Sign in to your account
                  Text(
                    'Sign in to your account',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  
                  SizedBox(height: 8),
                  
                  // Don't have an account? Sign Up
                  Row(
                    children: [
                      Text(
                        'Don\'t have an account?',
                        style: TextStyle(
                          fontSize: 14,
                          color: AppColors.textSecondary,
                        ),
                      ),
                      SizedBox(width: 4),
                      GestureDetector(
                        onTap: controller.navigateToRegister,
                        child: Text(
                          'Sign Up',
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                            color: AppColors.primary,
                          ),
                        ),
                      ),
                    ],
                  ),
                  
                  SizedBox(height: 32),
                  
                  // Email Field
                  CustomTextField(
                    label: 'Email',
                    hintText: 'Enter your email',
                    keyboardType: TextInputType.emailAddress,
                    validator: controller.validateEmail,
                    onChanged: controller.setEmail,
                    prefixIcon: Icon(Icons.email_outlined, color: AppColors.textSecondary),
                  ),
                  
                  SizedBox(height: 20),
                  
                  // Password Field
                  Obx(() => CustomTextField(
                    label: 'Password',
                    hintText: 'Enter your password',
                    obscureText: controller.obscurePassword.value,
                    validator: controller.validatePassword,
                    onChanged: controller.setPassword,
                    prefixIcon: Icon(Icons.lock_outline, color: AppColors.textSecondary),
                    suffixIcon: IconButton(
                      icon: Icon(
                        controller.obscurePassword.value
                            ? Icons.visibility_off_outlined
                            : Icons.visibility_outlined,
                        color: AppColors.textSecondary,
                      ),
                      onPressed: controller.togglePasswordVisibility,
                    ),
                  )),
                  
                  SizedBox(height: 8),
                  
                  // Forgot Password
                  Align(
                    alignment: Alignment.centerRight,
                    child: TextButton(
                      onPressed: () {
                        // Handle forgot password
                        Get.snackbar('Info', 'Forgot password feature coming soon');
                      },
                      child: Text(
                        'Forgot Password?',
                        style: TextStyle(
                          color: AppColors.primary,
                          fontSize: 14,
                        ),
                      ),
                    ),
                  ),
                  
                  SizedBox(height: 32),
                  
                  // Login Button
                  Obx(() => CustomButton(
                    text: 'Sign In',
                    onPressed: controller.isFormValid && !controller.isLoading.value
                        ? () {
                            if (_formKey.currentState!.validate()) {
                              controller.login();
                            }
                          }
                        : null,
                    isLoading: controller.isLoading.value,
                    backgroundColor: AppColors.primary,
                  )),
                  
                  SizedBox(height: 24),
                  
                  // Or continue with divider
                  Row(
                    children: [
                      Expanded(
                        child: Divider(
                          color: AppColors.border,
                          thickness: 1,
                        ),
                      ),
                      Padding(
                        padding: EdgeInsets.symmetric(horizontal: 16),
                        child: Text(
                          'Or continue with',
                          style: TextStyle(
                            color: AppColors.textSecondary,
                            fontSize: 14,
                          ),
                        ),
                      ),
                      Expanded(
                        child: Divider(
                          color: AppColors.border,
                          thickness: 1,
                        ),
                      ),
                    ],
                  ),
                  
                  SizedBox(height: 24),
                  
                  // Social Login Options (Optional)
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      _buildSocialButton(
                        icon: Icons.facebook,
                        color: Color(0xFF1877F2),
                        onPressed: () {
                          Get.snackbar('Info', 'Facebook login coming soon');
                        },
                      ),
                      SizedBox(width: 16),
                      _buildSocialButton(
                        icon: Icons.email,
                        color: Color(0xFFEA4335),
                        onPressed: () {
                          Get.snackbar('Info', 'Google login coming soon');
                        },
                      ),
                      SizedBox(width: 16),
                      _buildSocialButton(
                        icon: Icons.phone,
                        color: AppColors.primary,
                        onPressed: () {
                          Get.snackbar('Info', 'Phone login coming soon');
                        },
                      ),
                    ],
                  ),
                  
                  SizedBox(height: 32),
                  
                  // Terms and Privacy
                  Center(
                    child: RichText(
                      textAlign: TextAlign.center,
                      text: TextSpan(
                        style: TextStyle(
                          fontSize: 12,
                          color: AppColors.textSecondary,
                        ),
                        children: [
                          TextSpan(text: 'By continuing, you agree to our '),
                          TextSpan(
                            text: 'Terms of Service',
                            style: TextStyle(
                              color: AppColors.primary,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          TextSpan(text: ' and '),
                          TextSpan(
                            text: 'Privacy Policy',
                            style: TextStyle(
                              color: AppColors.primary,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSocialButton({
    required IconData icon,
    required Color color,
    required VoidCallback onPressed,
  }) {
    return Container(
      width: 56,
      height: 56,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        border: Border.all(
          color: AppColors.border,
          width: 1,
        ),
      ),
      child: IconButton(
        onPressed: onPressed,
        icon: Icon(icon, color: color),
        style: IconButton.styleFrom(
          padding: EdgeInsets.zero,
        ),
      ),
    );
  }
}