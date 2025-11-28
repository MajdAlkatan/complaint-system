import 'package:complaint/core/theme/colors.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../controllers/register_controller.dart';
import '../../../core/widgets/custom_button.dart';
import '../../../core/widgets/custom_textfield.dart';

class RegisterPage extends GetView<RegisterController> {
  final _formKey = GlobalKey<FormState>();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: EdgeInsets.all(24),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                SizedBox(height: 20),
                IconButton(
                  onPressed: () => Get.back(),
                  icon: Icon(Icons.arrow_back),
                ),
                SizedBox(height: 20),
                Text(
                  'Create Account',
                  style: TextStyle(
                    fontSize: 32,
                    fontWeight: FontWeight.bold,
                    color: AppColors.textPrimary,
                  ),
                ),
                SizedBox(height: 8),
                Text(
                  'Sign up to get started',
                  style: TextStyle(
                    fontSize: 16,
                    color: AppColors.textSecondary,
                  ),
                ),
                SizedBox(height: 40),
                CustomTextField(
                  label: 'Full Name',
                  hintText: 'Enter your full name',
                  validator: controller.validateName,
                  onChanged: controller.setName,
                ),
                SizedBox(height: 20),
                CustomTextField(
                  label: 'Email',
                  hintText: 'Enter your email',
                  keyboardType: TextInputType.emailAddress,
                  validator: controller.validateEmail,
                  onChanged: controller.setEmail,
                ),
                SizedBox(height: 20),
                CustomTextField(
                  label: 'Phone Number',
                  hintText: 'Enter your phone number',
                  keyboardType: TextInputType.phone,
                  validator: controller.validatePhone,
                  onChanged: controller.setPhone,
                ),
                SizedBox(height: 20),
                Obx(() => CustomTextField(
                  label: 'Password',
                  hintText: 'Enter your password',
                  obscureText: controller.obscurePassword.value,
                  validator: controller.validatePassword,
                  onChanged: controller.setPassword,
                  suffixIcon: IconButton(
                    icon: Icon(
                      controller.obscurePassword.value
                          ? Icons.visibility_off
                          : Icons.visibility,
                      color: AppColors.textSecondary,
                    ),
                    onPressed: controller.togglePasswordVisibility,
                  ),
                )),
                SizedBox(height: 20),
                Obx(() => CustomTextField(
                  label: 'Confirm Password',
                  hintText: 'Confirm your password',
                  obscureText: controller.obscureConfirmPassword.value,
                  validator: controller.validateConfirmPassword,
                  onChanged: controller.setConfirmPassword,
                  suffixIcon: IconButton(
                    icon: Icon(
                      controller.obscureConfirmPassword.value
                          ? Icons.visibility_off
                          : Icons.visibility,
                      color: AppColors.textSecondary,
                    ),
                    onPressed: controller.toggleConfirmPasswordVisibility,
                  ),
                )),
                SizedBox(height: 30),
                Obx(() => CustomButton(
                  text: 'Create Account',
                  onPressed: controller.isFormValid ? controller.register : null,
                  isLoading: controller.isLoading.value,
                )),
                SizedBox(height: 20),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      "Already have an account?",
                      style: TextStyle(color: AppColors.textSecondary),
                    ),
                    TextButton(
                      onPressed: controller.navigateToLogin,
                      child: Text('Sign In'),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}