import 'package:complaint/core/theme/colors.dart';
import 'package:complaint/core/widgets/custom_button.dart';
import 'package:complaint/core/widgets/custom_textfield.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../controllers/citizen_register_controller.dart';

class CitizenRegisterPage extends GetView<CitizenRegisterController> {
  final _formKey = GlobalKey<FormState>();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SingleChildScrollView(
        child: SafeArea(
          child: Padding(
            padding: EdgeInsets.all(24),
            child: Form(
              key: _formKey,
              child: Column(
                children: [
                  // Logo
                  Container(
                    width: 120,
                    height: 120,
                    margin: EdgeInsets.only(bottom: 8),
                    child: Image.asset(
                      'assets/images/logosyr3@3x.png',
                      fit: BoxFit.contain,
                    ),
                  ),

                  // Title
                  Text(
                    'Signup',
                    style: TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  SizedBox(height: 4),

                  Text(
                    'Create your citizen account',
                    style: TextStyle(
                      fontSize: 16,
                      color: AppColors.textSecondary,
                    ),
                  ),
                  SizedBox(height: 32),

                  // Full Name
                  CustomTextField(
                    label: 'Full Name *',
                    hintText: 'Enter your full name',
                    validator: controller.validateFullName,
                    onChanged: controller.setFullName,
                    prefixIcon: Icon(
                      Icons.person_outline,
                      color: AppColors.textSecondary,
                    ),
                  ),
                  SizedBox(height: 20),

                  // Birth Date - FIXED: Don't create TextEditingController inside Obx
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Birth Date *',
                        style: TextStyle(
                          fontWeight: FontWeight.w500,
                          color: AppColors.textPrimary,
                        ),
                      ),
                      SizedBox(height: 8),
                      GestureDetector(
                        onTap: () => controller.pickDate(context),
                        child: AbsorbPointer(
                          child: Obx(
                            () => TextFormField(
                              controller: TextEditingController(
                                text: controller.birthOfDate.value,
                              )..selection = TextSelection.collapsed(
                                  offset: controller.birthOfDate.value.length,
                                ),
                              validator: controller.validateBirthOfDate,
                              decoration: InputDecoration(
                                hintText: 'YYYY/MM/DD',
                                border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                prefixIcon: Icon(
                                  Icons.calendar_today,
                                  color: AppColors.textSecondary,
                                ),
                                suffixIcon: Icon(
                                  Icons.arrow_drop_down,
                                  color: AppColors.textSecondary,
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                  SizedBox(height: 20),

                  // Phone
                  CustomTextField(
                    label: 'Phone Number *',
                    hintText: 'Enter your phone number',
                    validator: controller.validatePhone,
                    onChanged: controller.setPhone,
                    keyboardType: TextInputType.phone,
                    prefixIcon: Icon(
                      Icons.phone_outlined,
                      color: AppColors.textSecondary,
                    ),
                  ),
                  SizedBox(height: 20),

                  // Email
                  CustomTextField(
                    label: 'Email *',
                    hintText: 'Enter your email',
                    validator: controller.validateEmail,
                    onChanged: controller.setEmail,
                    keyboardType: TextInputType.emailAddress,
                    prefixIcon: Icon(
                      Icons.email_outlined,
                      color: AppColors.textSecondary,
                    ),
                  ),
                  SizedBox(height: 20),

                  // Password
                  CustomTextField(
                    label: 'Password *',
                    hintText: 'Enter your password',
                    obscureText: controller.obscurePassword.value,
                    validator: controller.validatePassword,
                    onChanged: controller.setPassword,
                    prefixIcon: Icon(
                      Icons.lock_outline,
                      color: AppColors.textSecondary,
                    ),
                    suffixIcon: IconButton(
                      icon: Obx(
                        () => Icon(
                          controller.obscurePassword.value
                              ? Icons.visibility_off
                              : Icons.visibility,
                          color: AppColors.textSecondary,
                        ),
                      ),
                      onPressed: controller.togglePasswordVisibility,
                    ),
                  ),
                  SizedBox(height: 20),

                  // Confirm Password
                  CustomTextField(
                    label: 'Confirm Password *',
                    hintText: 'Confirm your password',
                    obscureText: controller.obscureConfirmPassword.value,
                    validator: controller.validatePasswordConfirmation,
                    onChanged: controller.setPasswordConfirmation,
                    prefixIcon: Icon(
                      Icons.lock_outline,
                      color: AppColors.textSecondary,
                    ),
                    suffixIcon: IconButton(
                      icon: Obx(
                        () => Icon(
                          controller.obscureConfirmPassword.value
                              ? Icons.visibility_off
                              : Icons.visibility,
                          color: AppColors.textSecondary,
                        ),
                      ),
                      onPressed: controller.toggleConfirmPasswordVisibility,
                    ),
                  ),

                  SizedBox(height: 32),

                  // Password requirements
                  Container(
                    width: double.infinity,
                    padding: EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppColors.background,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: AppColors.border),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Password must contain:',
                          style: TextStyle(
                            fontWeight: FontWeight.w600,
                            color: AppColors.textPrimary,
                          ),
                        ),
                        SizedBox(height: 8),
                        Obx(() => Column(
                          children: [
                            _buildRequirement(
                              'At least 6 characters',
                              controller.password.value.length >= 6,
                            ),
                            _buildRequirement(
                              'At least one uppercase letter',
                              _hasUppercase(controller.password.value),
                            ),
                            _buildRequirement(
                              'At least one lowercase letter',
                              _hasLowercase(controller.password.value),
                            ),
                            _buildRequirement(
                              'At least one number',
                              _hasNumber(controller.password.value),
                            ),
                            _buildRequirement(
                              'At least one special character',
                              _hasSpecialChar(controller.password.value),
                            ),
                          ],
                        )),
                      ],
                    ),
                  ),

                  SizedBox(height: 32),

                  // Register Button
                  Obx(
                    () => CustomButton(
                      text: 'Create Account',
                      onPressed:
                          controller.isFormValid && !controller.isLoading.value
                              ? () {
                                  if (_formKey.currentState!.validate()) {
                                    controller.register();
                                  }
                                }
                              : null,
                      isLoading: controller.isLoading.value,
                      backgroundColor: AppColors.primary,
                    ),
                  ),

                  SizedBox(height: 24),

                  // Login Link
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        'Already have an account?',
                        style: TextStyle(color: AppColors.textSecondary),
                      ),
                      SizedBox(width: 8),
                      TextButton(
                        onPressed: controller.navigateToLogin,
                        child: Text(
                          'Sign In',
                          style: TextStyle(
                            color: AppColors.primary,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildRequirement(String text, bool isMet) {
    return Padding(
      padding: EdgeInsets.only(bottom: 4),
      child: Row(
        children: [
          Icon(
            isMet ? Icons.check_circle : Icons.circle_outlined,
            color: isMet ? AppColors.success : AppColors.textSecondary,
            size: 16,
          ),
          SizedBox(width: 8),
          Text(
            text,
            style: TextStyle(
              color: isMet ? AppColors.success : AppColors.textSecondary,
              fontSize: 14,
            ),
          ),
        ],
      ),
    );
  }

  bool _hasUppercase(String password) {
    return password.contains(RegExp(r'[A-Z]'));
  }

  bool _hasLowercase(String password) {
    return password.contains(RegExp(r'[a-z]'));
  }

  bool _hasNumber(String password) {
    return password.contains(RegExp(r'[0-9]'));
  }

  bool _hasSpecialChar(String password) {
    return password.contains(RegExp(r'[!@#$%^&*(),.?":{}|<>]'));
  }
}