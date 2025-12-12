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

  factory User.fromJson(Map<String, dynamic> json) {
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

  Map<String, dynamic> toJson() {
    return {
      'full_name': fullName,
      'email': email,
      'phone': phone,
      'birth_of_date': birthOfDate,
    };
  }
}

// Login response model
class LoginResponse {
  final String accessToken;
  final String tokenType;

  LoginResponse({
    required this.accessToken,
    required this.tokenType,
  });

  factory LoginResponse.fromJson(Map<String, dynamic> json) {
    return LoginResponse(
      accessToken: json['access_token'] ?? '',
      tokenType: json['token_type'] ?? 'bearer',
    );
  }
}

// Register response model
class RegisterResponse {
  final User citizen;

  RegisterResponse({
    required this.citizen,
  });

  factory RegisterResponse.fromJson(Map<String, dynamic> json) {
    return RegisterResponse(
      citizen: User.fromJson(json['citizen'] ?? {}),
    );
  }
}