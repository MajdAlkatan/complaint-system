import 'package:get/get.dart';
import 'package:hive/hive.dart';

class StorageService extends GetxService {
  late Box _box; // Don't use late if you can't guarantee initialization
  
  Future<StorageService> init() async {
    try {
      // Make sure Hive is initialized
      if (!Hive.isBoxOpen('appBox')) {
        _box = await Hive.openBox('appBox');
      } else {
        _box = Hive.box('appBox');
      }
      
      // Alternatively, use nullable and check:
      // _box = await Hive.openBox('appBox');
      
      return this;
    } catch (e) {
      print('Error initializing StorageService: $e');
      rethrow;
    }
  }
  
  // Use a nullable box or ensure it's initialized
  Box get box {
    // Check if box is initialized
    if (!Hive.isBoxOpen('appBox')) {
      throw Exception('StorageService not initialized');
    }
    return _box;
  }
  
  void write<T>(String key, T value) {
    box.put(key, value);
  }
  
  T? read<T>(String key) {
    return box.get(key);
  }
  
  bool hasData(String key) {
    return box.containsKey(key);
  }
  
  void remove(String key) {
    box.delete(key);
  }
}