import 'package:get/get.dart';
import '../../../../data/models/profile_model.dart';
import '../../../../data/repositories/profile_repository.dart';
import '../../../../core/utils/validators.dart';

class ProfileController extends GetxController {
  final ProfileRepository _profileRepository = Get.find();

  var profile = Rxn<Profile>();
  var isLoading = false.obs;
  var isEditing = false.obs;

  // Form fields
  var name = ''.obs;
  var email = ''.obs;
  var phone = ''.obs;
  var department = ''.obs;
  var position = ''.obs;

  // Password change fields
  var currentPassword = ''.obs;
  var newPassword = ''.obs;
  var confirmPassword = ''.obs;
  var isChangingPassword = false.obs;

  @override
  void onInit() {
    fetchProfile();
    super.onInit();
  }

  Future<void> fetchProfile() async {
    try {
      isLoading.value = true;
      final response = await _profileRepository.getProfile();

      if (response.success && response.data != null) {
        profile.value = response.data;
        _initializeFormFields();
      } else {
        Get.snackbar('Error', response.message);
      }
    } catch (e) {
      Get.snackbar('Error', 'Failed to load profile');
    } finally {
      isLoading.value = false;
    }
  }

  void _initializeFormFields() {
    if (profile.value != null) {
      name.value = profile.value!.name;
      email.value = profile.value!.email;
      phone.value = profile.value!.phone;
      department.value = profile.value!.department;
      position.value = profile.value!.position;
    }
  }

  void toggleEditMode() {
    isEditing.value = !isEditing.value;
    if (!isEditing.value) {
      // Reset form fields when canceling edit
      _initializeFormFields();
    }
  }

  Future<void> updateProfile() async {
    if (!_validateProfileForm()) return;

    try {
      isLoading.value = true;
      final profileData = {
        'id': profile.value?.id,
        'name': name.value,
        'email': email.value,
        'phone': phone.value,
        'department': department.value,
        'position': position.value,
        'joinDate': profile.value?.joinDate.toIso8601String(),
      };

      final response = await _profileRepository.updateProfile(profileData);

      if (response.success && response.data != null) {
        profile.value = response.data;
        isEditing.value = false;
        Get.snackbar('Success', 'Profile updated successfully');
      } else {
        Get.snackbar('Error', response.message);
      }
    } catch (e) {
      Get.snackbar('Error', 'Failed to update profile');
    } finally {
      isLoading.value = false;
    }
  }

  bool _validateProfileForm() {
    if (name.value.isEmpty) {
      Get.snackbar('Error', 'Name is required');
      return false;
    }
    if (email.value.isEmpty) {
      Get.snackbar('Error', 'Email is required');
      return false;
    }
    if (!email.value.isEmail) {
      Get.snackbar('Error', 'Please enter a valid email');
      return false;
    }
    if (phone.value.isEmpty) {
      Get.snackbar('Error', 'Phone is required');
      return false;
    }
    return true;
  }

  Future<void> changePassword() async {
    if (!_validatePasswordForm()) return;

    try {
      isChangingPassword.value = true;
      final response = await _profileRepository.changePassword(
        currentPassword.value,
        newPassword.value,
      );

      if (response.success) {
        Get.snackbar('Success', 'Password changed successfully');
        _clearPasswordFields();
      } else {
        Get.snackbar('Error', response.message);
      }
    } catch (e) {
      Get.snackbar('Error', 'Failed to change password');
    } finally {
      isChangingPassword.value = false;
    }
  }

  bool _validatePasswordForm() {
    if (currentPassword.value.isEmpty) {
      Get.snackbar('Error', 'Current password is required');
      return false;
    }
    if (newPassword.value.isEmpty) {
      Get.snackbar('Error', 'New password is required');
      return false;
    }
    if (newPassword.value.length < 6) {
      Get.snackbar('Error', 'New password must be at least 6 characters');
      return false;
    }
    if (newPassword.value != confirmPassword.value) {
      Get.snackbar('Error', 'Passwords do not match');
      return false;
    }
    return true;
  }

  void _clearPasswordFields() {
    currentPassword.value = '';
    newPassword.value = '';
    confirmPassword.value = '';
  }

  // Form field setters
  void setName(String value) => name.value = value;
  void setEmail(String value) => email.value = value;
  void setPhone(String value) => phone.value = value;
  void setDepartment(String value) => department.value = value;
  void setPosition(String value) => position.value = value;
  void setCurrentPassword(String value) => currentPassword.value = value;
  void setNewPassword(String value) => newPassword.value = value;
  void setConfirmPassword(String value) => confirmPassword.value = value;
}