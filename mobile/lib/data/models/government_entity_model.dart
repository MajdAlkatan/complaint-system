// في ملف جديد: government_entity.dart
class GovernmentEntity {
  final int id;
  final String name;
  final String description;
  final String contactEmail;
  final String contactPhone;
  final DateTime createdAt;

  GovernmentEntity({
    required this.id,
    required this.name,
    required this.description,
    required this.contactEmail,
    required this.contactPhone,
    required this.createdAt,
  });

  factory GovernmentEntity.fromJson(Map<String, dynamic> json) {
    return GovernmentEntity(
      id: json['government_entities_id'] ?? json['id'] ?? 0,
      name: json['name'] ?? '',
      description: json['description'] ?? '',
      contactEmail: json['contact_email'] ?? '',
      contactPhone: json['contact_phone'] ?? '',
      createdAt: DateTime.parse(json['created_at'] ?? DateTime.now().toIso8601String()),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'government_entities_id': id,
      'name': name,
      'description': description,
      'contact_email': contactEmail,
      'contact_phone': contactPhone,
      'created_at': createdAt.toIso8601String(),
    };
  }

  @override
  String toString() {
    return 'GovernmentEntity(id: $id, name: $name)';
  }
}