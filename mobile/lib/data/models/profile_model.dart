class Profile {
  final String id;
  final String name;
  final String email;
  final String phone;
  final String? profileImage;
  final String department;
  final String position;
  final DateTime joinDate;

  Profile({
    required this.id,
    required this.name,
    required this.email,
    required this.phone,
    this.profileImage,
    required this.department,
    required this.position,
    required this.joinDate,
  });

  factory Profile.fromJson(Map<String, dynamic> json) {
    return Profile(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      phone: json['phone'] ?? '',
      profileImage: json['profileImage'],
      department: json['department'] ?? '',
      position: json['position'] ?? '',
      joinDate: DateTime.parse(json['joinDate']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'phone': phone,
      'profileImage': profileImage,
      'department': department,
      'position': position,
      'joinDate': joinDate.toIso8601String(),
    };
  }
}