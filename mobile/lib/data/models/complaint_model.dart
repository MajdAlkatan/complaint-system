// complaint_model.dart
class Complaint {
  final String id; // This should be complaints_id from API
  final String referenceNumber;
  final int citizenId;
  final int entityId;
  final int complaintType;
  final String location;
  final String description;
  final String status;
  final DateTime? completedAt;
  final bool locked;
  final int? lockedByEmployeeId;
  final DateTime? lockedAt;
  final DateTime createdAt;
  final DateTime updatedAt;

  Complaint({
    required this.id,
    required this.referenceNumber,
    required this.citizenId,
    required this.entityId,
    required this.complaintType,
    required this.location,
    required this.description,
    required this.status,
    this.completedAt,
    required this.locked,
    this.lockedByEmployeeId,
    this.lockedAt,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Complaint.fromJson(Map<String, dynamic> json) {
    return Complaint(
      id: json['complaints_id']?.toString() ?? json['id']?.toString() ?? '0',
      referenceNumber: json['reference_number']?.toString() ?? '',
      citizenId: _parseInt(json['citizen_id']),
      entityId: _parseInt(json['entity_id']),
      complaintType: _parseInt(json['complaint_type']),
      location: json['location']?.toString() ?? 'Not specified',
      description: json['description']?.toString() ?? '',
      status: json['status']?.toString() ?? 'new',
      completedAt: _parseDateTime(json['completed_at']),
      locked: json['locked'] == true,
      lockedByEmployeeId: _parseInt(json['locked_by_employee_id']),
      lockedAt: _parseDateTime(json['locked_at']),
      createdAt: _parseDateTime(json['created_at']) ?? DateTime.now(),
      updatedAt: _parseDateTime(json['updated_at']) ?? DateTime.now(),
    );
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

  String get priority {
    // Determine priority based on complaint type or other logic
    // You might want to get this from API if available
    return 'medium'; // Default priority
  }

 Map<String, dynamic> toJson() {
    return {
      'complaints_id': id,
      'reference_number': referenceNumber,
      'citizen_id': citizenId,
      'entity_id': entityId,
      'complaint_type': complaintType,
      'location': location,
      'description': description,
      'status': status,
      'completed_at': completedAt?.toIso8601String(),
      'locked': locked,
      'locked_by_employee_id': lockedByEmployeeId,
      'locked_at': lockedAt?.toIso8601String(),
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
    };
  }
}