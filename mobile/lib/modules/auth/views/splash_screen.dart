import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:complaint/core/theme/colors.dart';
import '../../../data/repositories/auth_repository.dart';

class SplashScreen extends StatefulWidget {
  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    _navigateToNextScreen();
  }

  Future<void> _navigateToNextScreen() async {
    try {
      // Get repository instance (it should already be initialized in main())
      final authRepository = Get.find<AuthRepository>();
      
      // Check if user is logged in
      final isLoggedIn = authRepository.isLoggedIn;
      
      // Navigate after delay
      await Future.delayed(Duration(seconds: 2));
      
      if (isLoggedIn && mounted) {
        Get.offAllNamed('/home');
      } else if (mounted) {
        Get.offAllNamed('/login');
      }
    } catch (e) {
      print('Error in splash screen: $e');
      // If any error occurs, go to login page
      if (mounted) {
        await Future.delayed(Duration(seconds: 2));
        Get.offAllNamed('/login');
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.primary,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            FlutterLogo(size: 100),
            SizedBox(height: 20),
            Text(
              'Complaint App',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
          ],
        ),
      ),
    );
  }
}