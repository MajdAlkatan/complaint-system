import 'dart:ui';
import 'package:complaint/data/repositories/complaint_repository.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'core/theme/app_theme.dart';
import 'routes/app_pages.dart';
import 'data/services/storage_service.dart';
import 'data/services/api_service.dart';
import 'data/repositories/auth_repository.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize services BEFORE running the app
  await initializeServices();
  
  // Catch and handle errors
  FlutterError.onError = (details) {
    print('Flutter Error: ${details.exception}');
    print('Stack trace: ${details.stack}');
  };
  
  PlatformDispatcher.instance.onError = (error, stack) {
    print('Platform Error: $error');
    print('Stack trace: $stack');
    return true;
  };

  runApp(MyApp());
}

Future<void> initializeServices() async {
  try {
    print('Initializing services...');
    
    // Initialize StorageService first
    await Get.putAsync(() => StorageService().init());
    print('StorageService initialized');
    
    // Initialize ApiService
    await Get.putAsync(() => ApiService().init());
    print('ApiService initialized');
    
    // Initialize AuthRepository
    Get.put(AuthRepository());
    print('AuthRepository initialized');
    
    // Initialize ComplaintRepository
    Get.put(ComplaintRepository());
    print('ComplaintRepository initialized');
    
    print('All services initialized successfully');
  } catch (e, s) {
    print('Error initializing services: $e');
    print('Stack trace: $s');
    rethrow;
  }
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return GetMaterialApp(
      title: 'Complaint App',
      theme: AppTheme.lightTheme,
      initialRoute: '/splash',
      getPages: AppPages.pages,
      debugShowCheckedModeBanner: false,
      defaultTransition: Transition.cupertino,
    );
  }
}