// complaint_model.dart
class Complaint {
  final String id;
  final String referenceNumber;
  final int citizenId;
  final int entityId;
  final String entityName; // إضافة اسم الجهة
  final int complaintType;
  final String complaintTypeName; // إضافة اسم النوع
  final String location;
  final String description;
  final String status;
  final DateTime? completedAt;
  final bool locked;
  final int? lockedByEmployeeId;
  final DateTime? lockedAt;
  final DateTime createdAt;
  final DateTime updatedAt;
  final String priority; // إضافة أولوية
  final List<String> notes; // إضافة قائمة للملاحظات

  Complaint({
    required this.id,
    required this.referenceNumber,
    required this.citizenId,
    required this.entityId,
    required this.entityName,
    required this.complaintType,
    required this.complaintTypeName,
    required this.location,
    required this.description,
    required this.status,
    this.completedAt,
    required this.locked,
    this.lockedByEmployeeId,
    this.lockedAt,
    required this.createdAt,
    required this.updatedAt,
    required this.priority,
    required this.notes, // إضافة الملاحظات
  });

  static (String description, List<String> notes) _splitDescriptionAndNotes(
    String fullDescription,
  ) {
    List<String> notes = [];
    String description = fullDescription;

    print('=== SIMPLE SPLITTING METHOD ===');
    print('Input: $fullDescription');

    // طريقة مبسطة: استخدم regex للعثور على جميع الملاحظات
    // النمط: أي عدد من \n ثم "notes :" ثم أي عدد من \n ثم المحتوى
    final pattern = RegExp(r'\\?n\s*notes\s*:\s*\\?n', caseSensitive: false);

    if (pattern.hasMatch(fullDescription)) {
      List<String> parts = fullDescription.split(pattern);

      // الجزء الأول هو الوصف
      description = parts[0].trim();

      // الأجزاء الباقية هي الملاحظات
      for (int i = 1; i < parts.length; i++) {
        String note = parts[i].trim();
        if (note.isNotEmpty) {
          notes.add(note);
        }
      }
    }

    print('Result - Description: "$description"');
    print('Result - Notes count: ${notes.length}');
    print('Result - Notes: $notes');

    return (description, notes);
  }

  // أضف هذه الدالة المساعدة في أعلى الملف
  int min(int a, int b) => a < b ? a : b;
  // في complaint_model.dart
factory Complaint.fromJson(Map<String, dynamic> json) {
  print('=== PARSING COMPLAINT FROM JSON ===');
  print('Available keys: ${json.keys.toList()}');
  
  // طباعة جميع القيم للمساعدة في التصحيح
  json.forEach((key, value) {
    print('  $key: $value (${value.runtimeType})');
  });

  String fullDescription = json['description']?.toString() ?? '';

  var (cleanDescription, extractedNotes) = _splitDescriptionAndNotes(
    fullDescription,
  );

  // البحث الدقيق عن ID - نفحص جميع القيم
  String id = '0';
  
  // 1. أولاً: ابحث عن ID في الحقول المباشرة
  final directIdKeys = ['complaints_id', 'complaint_id', 'id'];
  for (var key in directIdKeys) {
    if (json[key] != null) {
      final value = json[key];
      print('Found $key: $value');
      id = value.toString();
      break;
    }
  }
  
  // 2. إذا لم نجد، ابحث في الحقول المتداخلة
  if (id == '0') {
    // ابحث في حقل 'complaint' إذا كان موجوداً
    if (json['complaint'] is Map) {
      final complaintMap = json['complaint'] as Map;
      for (var key in directIdKeys) {
        if (complaintMap[key] != null) {
          id = complaintMap[key].toString();
          print('Found ID in complaint.$key: $id');
          break;
        }
      }
    }
    
    // ابحث في حقل 'data' إذا كان موجوداً
    if (id == '0' && json['data'] is Map) {
      final dataMap = json['data'] as Map;
      for (var key in directIdKeys) {
        if (dataMap[key] != null) {
          id = dataMap[key].toString();
          print('Found ID in data.$key: $id');
          break;
        }
      }
    }
  }
  
  // 3. إذا لم نجد ID أبداً، نبحث عن أي رقم
  if (id == '0') {
    json.forEach((key, value) {
      if (value is num && value > 0 && id == '0') {
        id = value.toString();
        print('Found numeric ID in $key: $id');
      } else if (value is String && int.tryParse(value) != null && int.parse(value) > 0 && id == '0') {
        id = value;
        print('Found string ID in $key: $id');
      }
    });
  }

  if (id == '0') {
    print('❌ CRITICAL ERROR: No valid ID found in response!');
    print('Full response was:');
    print(json);
  } else {
    print('✅ Using complaint ID: $id');
  }

  return Complaint(
    id: id,
    referenceNumber: json['reference_number']?.toString() ?? 
                    json['complaint']?['reference_number']?.toString() ?? 
                    json['data']?['reference_number']?.toString() ?? '',
    citizenId: _parseInt(json['citizen_id'] ?? json['complaint']?['citizen_id'] ?? json['data']?['citizen_id']),
    entityId: _parseInt(json['entity_id'] ?? json['complaint']?['entity_id'] ?? json['data']?['entity_id']),
    entityName:
        json['entity_name']?.toString() ??
        json['government_entity']?['name']?.toString() ??
        'Unknown Entity',
    complaintType: _parseInt(json['complaint_type'] ?? json['complaint']?['complaint_type'] ?? json['data']?['complaint_type']),
    complaintTypeName:
        json['complaint_type_name']?.toString() ??
        json['type']?['type']?.toString() ??
        'Unknown Type',
    location: json['location']?.toString() ?? 'Not specified',
    description: cleanDescription,
    notes: extractedNotes,
    status: json['status']?.toString() ?? 'new',
    completedAt: _parseDateTime(json['completed_at'] ?? json['complaint']?['completed_at'] ?? json['data']?['completed_at']),
    locked: json['locked'] == true,
    lockedByEmployeeId: _parseInt(json['locked_by_employee_id'] ?? json['complaint']?['locked_by_employee_id'] ?? json['data']?['locked_by_employee_id']),
    lockedAt: _parseDateTime(json['locked_at'] ?? json['complaint']?['locked_at'] ?? json['data']?['locked_at']),
    createdAt: _parseDateTime(json['created_at'] ?? json['complaint']?['created_at'] ?? json['data']?['created_at']) ?? DateTime.now(),
    updatedAt: _parseDateTime(json['updated_at'] ?? json['complaint']?['updated_at'] ?? json['data']?['updated_at']) ?? DateTime.now(),
    priority: json['priority']?.toString() ?? 'medium',
  );
}
  // دالة للحصول على الوصف الكامل (مع الملاحظات)
  String get fullDescriptionWithNotes {
    if (notes.isEmpty) return description;

    // بناء الوصف مع جميع الملاحظات
    String result = description;
    for (String note in notes) {
      result += '\\nnotes : \\n$note';
    }
    return result;
  }

  // CopyWith method مع إضافة notes
  Complaint copyWith({
    String? id,
    String? referenceNumber,
    int? citizenId,
    int? entityId,
    String? entityName,
    int? complaintType,
    String? complaintTypeName,
    String? location,
    String? description,
    List<String>? notes,
    String? status,
    DateTime? completedAt,
    bool? locked,
    int? lockedByEmployeeId,
    DateTime? lockedAt,
    DateTime? createdAt,
    DateTime? updatedAt,
    String? priority,
  }) {
    return Complaint(
      id: id ?? this.id,
      referenceNumber: referenceNumber ?? this.referenceNumber,
      citizenId: citizenId ?? this.citizenId,
      entityId: entityId ?? this.entityId,
      entityName: entityName ?? this.entityName,
      complaintType: complaintType ?? this.complaintType,
      complaintTypeName: complaintTypeName ?? this.complaintTypeName,
      location: location ?? this.location,
      description: description ?? this.description,
      notes: notes ?? this.notes,
      status: status ?? this.status,
      completedAt: completedAt ?? this.completedAt,
      locked: locked ?? this.locked,
      lockedByEmployeeId: lockedByEmployeeId ?? this.lockedByEmployeeId,
      lockedAt: lockedAt ?? this.lockedAt,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      priority: priority ?? this.priority,
    );
  }

  @override
  String toString() {
    return 'Complaint(id: $id, title: $title, status: $status)';
  }

  // Helper methods for safe parsing
  static int _parseInt(dynamic value) {
    if (value == null) return 0;
    if (value is int) return value;
    if (value is String) return int.tryParse(value) ?? 0;
    if (value is double) return value.toInt();
    return 0;
  }

  static DateTime? _parseDateTime(dynamic value) {
    if (value == null) return null;
    if (value is DateTime) return value;
    if (value is String) {
      try {
        return DateTime.parse(value);
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  // Convenience getters for UI
  String get title {
    // Create a title from the description or reference number
    final firstLine = description.split('\n').first;
    return firstLine.length > 50
        ? '${firstLine.substring(0, 50)}...'
        : firstLine;
  }

  String get category {
    // Map complaint_type to category name
    return switch (complaintType) {
      1 => 'Water Supply',
      2 => 'Electricity',
      3 => 'Sanitation',
      4 => 'Road Maintenance',
      5 => 'Building Issues',
      6 => 'Other',
      _ => 'Other',
    };
  }

  Map<String, dynamic> toJson() {
    return {
      'complaints_id': id,
      'reference_number': referenceNumber,
      'citizen_id': citizenId,
      'entity_id': entityId,
      'complaint_type': complaintType,
      'location': location,
      'description':
          fullDescriptionWithNotes, // استخدم الوصف الكامل مع الملاحظات
      'status': status,
      'completed_at': completedAt?.toIso8601String(),
      'locked': locked,
      'locked_by_employee_id': lockedByEmployeeId,
      'locked_at': lockedAt?.toIso8601String(),
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
      'priority': priority,
    };
  }
}

class ComplaintType {
  ComplaintType({
    required this.id,
    required this.type,
    required this.createdAt,
  });

  final int? id;
  final String? type;
  final DateTime? createdAt;

  factory ComplaintType.fromJson(Map<String, dynamic> json) {
    return ComplaintType(
      id: json["id"],
      type: json["type"],
      createdAt: DateTime.tryParse(json["createdAt"] ?? ""),
    );
  }

  Map<String, dynamic> toJson() => {
    "id": id,
    "type": type,
    "createdAt": createdAt?.toIso8601String(),
  };

  @override
  String toString() {
    return "$id, $type, $createdAt, ";
  }
}
