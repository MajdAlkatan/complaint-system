class Complaint {
  final String id;
  final String title;
  final String description;
  final String category;
  final String status;
  final String priority; // Add this field
  final DateTime createdAt;
  final DateTime? updatedAt;
  final String userId;
  final List<String>? images;

  Complaint({
    required this.id,
    required this.title,
    required this.description,
    required this.category,
    required this.status,
    required this.priority, // Add this
    required this.createdAt,
    this.updatedAt,
    required this.userId,
    this.images,
  });

  factory Complaint.fromJson(Map<String, dynamic> json) {
    return Complaint(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      category: json['category'] ?? '',
      status: json['status'] ?? 'pending',
      priority: json['priority'] ?? 'medium',
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: json['updatedAt'] != null
          ? DateTime.parse(json['updatedAt'])
          : null,
      userId: json['userId'] ?? '',
      images: json['images'] != null ? List<String>.from(json['images']) : [],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'category': category,
      'status': status,
      'priority': priority,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt?.toIso8601String(),
      'userId': userId,
      'images': images,
    };
  }

  String get statusColor {
    switch (status) {
      case 'resolved':
        return '#16A34A';
      case 'in_progress':
        return '#D97706';
      case 'rejected':
        return '#DC2626';
      default:
        return '#64748B';
    }
  }
}
