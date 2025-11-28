import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';

class StorageService extends GetxService {
  late GetStorage _box;

  Future<StorageService> init() async {
    await GetStorage.init();
    _box = GetStorage();
    return this;
  }

  void write(String key, dynamic value) {
    _box.write(key, value);
  }

  T? read<T>(String key) {
    return _box.read<T>(key);
  }

  void remove(String key) {
    _box.remove(key);
  }

  void clear() {
    _box.erase();
  }

  bool hasData(String key) {
    return _box.hasData(key);
  }
}