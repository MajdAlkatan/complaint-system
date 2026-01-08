class User {
  final int citizenId;
  final String fullName;
  final String email;
  final String? phone;
  final String? birthOfDate;
  final String? createdAt;
  final String? updatedAt;

  User({
    required this.citizenId,
    required this.fullName,
    required this.email,
    this.phone,
    this.birthOfDate,
    this.createdAt,
    this.updatedAt,
  });

  factory User.fromJson(Map<dynamic, dynamic> json) {
    return User(
      citizenId: json['citizen_id'] ?? json['id'] ?? 0,
      fullName: json['full_name'] ?? '',
      email: json['email'] ?? '',
      phone: json['phone'],
      birthOfDate: json['birth_of_date'],
      createdAt: json['created_at'],
      updatedAt: json['updated_at'],
    );
  }

  Map<dynamic, dynamic> toJson() {
    return {
      'citizen_id': citizenId, // Added
      'full_name': fullName,
      'email': email,
      'phone': phone,
      'birth_of_date': birthOfDate,
      'created_at': createdAt, // Added
      'updated_at': updatedAt, // Added
    };
  }
}

// Login response model
// Login response model
class LoginResponse {
  final String accessToken;
  final String tokenType;
  final User? user; // Add this field
  final String? refreshToken; // Optional: add if you need it

  LoginResponse({
    required this.accessToken,
    required this.tokenType,
    this.user,
    this.refreshToken,
  });

  factory LoginResponse.fromJson(Map<dynamic, dynamic> json) {
    return LoginResponse(
      accessToken: json['access_token'] ?? '',
      tokenType: json['token_type'] ?? 'bearer',
      user: json['user'] != null ? User.fromJson(json['user']) : null, // Add this
      refreshToken: json['refresh_token'],
    );
  }
}

// Register response model
class RegisterResponse {
  final User citizen;

  RegisterResponse({required this.citizen});

  factory RegisterResponse.fromJson(Map<String, dynamic> json) {
    return RegisterResponse(citizen: User.fromJson(json['citizen'] ?? {}));
  }
}
