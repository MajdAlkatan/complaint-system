import 'package:complaint/modules/auth/bindings/citizen_register_binding.dart';
import 'package:complaint/modules/auth/views/splash_screen.dart';
import 'package:complaint/modules/profile/bindings/profile_binding.dart';
import 'package:complaint/modules/profile/views/profile_page.dart';
import 'package:get/get.dart';
import '../modules/auth/views/login_page.dart';
import '../modules/auth/views/citizen_register_page.dart';
import '../modules/auth/views/verification_code_page.dart';
import '../modules/home/views/home_page.dart';
import '../modules/home/views/search_page.dart';
import '../modules/home/views/search_page_empty.dart';
import '../modules/complaint/views/complaint_history_page.dart';
import '../modules/complaint/views/complaint_details_page.dart';
import '../modules/complaint/views/add_new_complaint_page.dart';

// Import bindings
import '../modules/auth/bindings/login_binding.dart';
import '../modules/home/bindings/home_binding.dart';
import '../modules/complaint/bindings/complaint_binding.dart';
import '../modules/complaint/bindings/complaint_history_binding.dart';
import '../modules/complaint/bindings/add_complaint_binding.dart';

import 'app_routes.dart';

class AppPages {
  static final pages = [
    GetPage(
      name: AppRoutes.SPLASH,
      page: () => SplashScreen(),
    ),
    GetPage(
      name: AppRoutes.LOGIN,
      page: () => LoginPage(),
      binding: LoginBinding(),
    ),
    GetPage(
      name: AppRoutes.CITIZEN_REGISTER,
      page: () => CitizenRegisterPage(),
      binding: CitizenRegisterBinding(),
    ),
    GetPage(
      name: AppRoutes.VERIFICATION_CODE,
      page: () => VerificationCodePage(),
    ),
    GetPage(
      name: AppRoutes.HOME,
      page: () => HomePage(),
      binding: HomeBinding(),
    ),
  
    GetPage(
      name: AppRoutes.SEARCH,
      page: () => SearchPage(),
      binding: HomeBinding(),
    ),
    GetPage(
      name: AppRoutes.SEARCH_EMPTY,
      page: () => SearchPageEmpty(),
      binding: HomeBinding(),
    ),
    GetPage(
      name: AppRoutes.COMPLAINT_HISTORY,
      page: () => ComplaintHistoryPage(),
      binding: ComplaintHistoryBinding(),
    ),
    GetPage(
      name: AppRoutes.COMPLAINT_DETAILS,
      page: () => ComplaintDetailsPage(),
      binding: ComplaintBinding(),
    ),
    GetPage(
      name: AppRoutes.ADD_NEW_COMPLAINT,
      page: () => AddNewComplaintPage(),
      binding: AddComplaintBinding(), // Use the specific binding
    ),
    GetPage(
      name: AppRoutes.PROFILE,
      page: () => ProfilePage(),
      binding: ProfileBinding(), // You'll need to create this
    ),
  ];
}