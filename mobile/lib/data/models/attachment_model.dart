// models/attachment_model.dart
class Attachment {
  final int id;
  final int complaintId;
  final String filePath;
  final String fileType;
  final DateTime uploadedAt;

  Attachment({
    required this.id,
    required this.complaintId,
    required this.filePath,
    required this.fileType,
    required this.uploadedAt,
  });

  factory Attachment.fromJson(Map<String, dynamic> json) {
    return Attachment(
      id: json['attachments_id'] ?? json['id'] ?? 0,
      complaintId: json['complaint_id'] ?? 0,
      filePath: json['file_path'] ?? json['path'] ?? '',
      fileType: json['file_type'] ?? 'png',
      uploadedAt: DateTime.parse(json['uploaded_at'] ?? DateTime.now().toIso8601String()),
    );
  }

  String get fullPath {
    // Adjust based on your server URL
    return 'http://127.0.0.1:8000/storage/$filePath';
  }

  String get fileName {
    return filePath.split('/').last;
  }
}