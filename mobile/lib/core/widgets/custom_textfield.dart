import 'package:complaint/core/theme/colors.dart';
import 'package:flutter/material.dart';

class CustomTextField extends StatelessWidget {
  final String label;
  final String? hintText;
  final TextEditingController? controller;
  final String? initialValue;
  final ValueChanged<String>? onChanged;
  final FormFieldValidator<String>? validator;
  final bool obscureText;
  final TextInputType keyboardType;
  final Widget? suffixIcon;
  final int maxLines;
  final bool enabled;

  const CustomTextField({
    Key? key,
    required this.label,
    this.hintText,
    this.controller,
    this.initialValue,
    this.onChanged,
    this.validator,
    this.obscureText = false,
    this.keyboardType = TextInputType.text,
    this.suffixIcon,
    this.maxLines = 1,
    this.enabled = true,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: TextStyle(
            fontWeight: FontWeight.w500,
            color: AppColors.textPrimary,
          ),
        ),
        SizedBox(height: 8),
        TextFormField(
          controller: controller,
          initialValue: initialValue,
          onChanged: onChanged,
          validator: validator,
          obscureText: obscureText,
          keyboardType: keyboardType,
          maxLines: maxLines,
          enabled: enabled,
          decoration: InputDecoration(
            hintText: hintText,
            suffixIcon: suffixIcon,
            enabled: enabled,
          ),
        ),
      ],
    );
  }
}