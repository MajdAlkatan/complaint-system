import 'package:complaint/core/theme/colors.dart';
import 'package:complaint/data/services/api_service.dart';
import 'package:complaint/data/services/storage_service.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class SplashScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // Initialize services
    _initializeServices().then((_) {
      // Check authentication status and navigate accordingly
      Future.delayed(Duration(seconds: 2), () {
        Get.offAllNamed('/home'); // Change to '/login' if not authenticated
      });
    });

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

  Future<void> _initializeServices() async {
    // Initialize GetX services
    await Get.putAsync(() => StorageService().init());
    await Get.putAsync(() => ApiService().init());
  }
}