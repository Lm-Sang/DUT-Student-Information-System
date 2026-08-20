import '../data/mock_data.dart';
import 'api_service.dart';

class AuthResult {
  final String role;
  final String fullName;

  const AuthResult({required this.role, required this.fullName});
}

class AuthRepository {
  final ApiService _api;

  AuthRepository(this._api);

  Future<AuthResult> login(String username, String password) async {
    final account = users[username];
    if (account == null || account['password'] != password) {
      throw Exception('Invalid username or password');
    }

    return _api.mock(
      AuthResult(
        role: account['role']!,
        fullName: account['name']!,
      ),
    );
  }
}
