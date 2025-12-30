// utils/safe_snackbar.dart
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class SafeSnackbar {
  static void show({
    required String title,
    required String message,
    bool isError = false,
    Duration duration = const Duration(seconds: 3),
  }) {
    // Use post-frame callback to ensure we have a valid context
    WidgetsBinding.instance?.addPostFrameCallback((_) {
      if (!Get.isSnackbarOpen) {
        Get.snackbar(
          title,
          message,
          snackPosition: SnackPosition.BOTTOM,
          duration: duration,
          backgroundColor: isError ? Colors.red : Colors.green,
          colorText: Colors.white,
          margin: EdgeInsets.all(16),
          borderRadius: 8,
          icon: Icon(isError ? Icons.error : Icons.check_circle, color: Colors.white),
        );
      }
    });
  }

  static void showError(String message) {
    show(title: 'Error', message: message, isError: true);
  }

  static void showSuccess(String message) {
    show(title: 'Success', message: message, isError: false);
  }
}