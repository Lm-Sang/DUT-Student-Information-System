import 'dart:async';

const apiBaseUrl = String.fromEnvironment('API_BASE_URL', defaultValue: 'http://localhost:3000/api');

class ApiService {
  Future<T> mock<T>(T data) async {
    await Future<void>.delayed(const Duration(milliseconds: 300));
    return data;
  }
}
