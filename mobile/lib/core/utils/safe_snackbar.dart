import 'package:flutter/material.dart';
import 'package:get/get.dart';

class SafeSnackbar {
  static void show({
    required String title,
    required String message,
    bool isError = false,
    Duration duration = const Duration(seconds: 3),
  }) {
    // Check if we're in a valid context
    if (!Get.isSnackbarOpen) {
      // Use post-frame callback to ensure safe context
      WidgetsBinding.instance?.addPostFrameCallback((_) {
        Get.snackbar(
          title,
          message,
          snackPosition: SnackPosition.BOTTOM,
          duration: duration,
          backgroundColor: isError ? Colors.red : Colors.green,
          colorText: Colors.white,
          margin: EdgeInsets.all(16),
          borderRadius: 8,
        );
      });
    }
  }

  static void showError(String message) {
    show(title: 'Error', message: message, isError: true);
  }

  static void showSuccess(String message) {
    show(title: 'Success', message: message, isError: false);
  }
}