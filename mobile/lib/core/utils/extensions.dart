import 'package:complaint/core/theme/colors.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

extension StringExtensions on String {
  bool get isEmail {
    final emailRegex = RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');
    return emailRegex.hasMatch(this);
  }
  
  bool get isPhoneNumber {
    final phoneRegex = RegExp(r'^[0-9]{10,11}$');
    return phoneRegex.hasMatch(this);
  }
}

extension DateTimeExtensions on DateTime {
  String format(String pattern) {
    return DateFormat(pattern).format(this);
  }
  
  String get toReadableDate {
    return DateFormat('dd MMM yyyy').format(this);
  }
  
  String get toReadableDateTime {
    return DateFormat('dd MMM yyyy HH:mm').format(this);
  }
}

extension ContextExtensions on BuildContext {
  double get screenWidth => MediaQuery.of(this).size.width;
  double get screenHeight => MediaQuery.of(this).size.height;
  
  void showSnackBar(String message, {bool isError = false}) {
    ScaffoldMessenger.of(this).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: isError ? AppColors.error : AppColors.primary,
      ),
    );
  }
}