import 'package:flutter/material.dart';

import 'screens/admin_screen.dart';
import 'screens/login_screen.dart';
import 'screens/student_home_screen.dart';
import 'services/api_service.dart';
import 'services/auth_repository.dart';
import 'services/student_repository.dart';

void main() {
  runApp(const DutSisApp());
}

class DutSisApp extends StatefulWidget {
  const DutSisApp({super.key});

  @override
  State<DutSisApp> createState() => _DutSisAppState();
}

class _DutSisAppState extends State<DutSisApp> {
  final api = ApiService();
  AuthResult? _session;

  @override
  Widget build(BuildContext context) {
    final authRepo = AuthRepository(api);
    final studentRepo = StudentRepository(api);

    return MaterialApp(
      title: 'DUT Student Information System',
      theme: ThemeData(colorSchemeSeed: Colors.indigo, useMaterial3: true),
      home: _session == null
          ? LoginScreen(
              authRepository: authRepo,
              onSuccess: (result) => setState(() => _session = result),
            )
          : (_session!.role == 'admin'
              ? AdminScreen(fullName: _session!.fullName, onLogout: () => setState(() => _session = null))
              : StudentHomeScreen(
                  fullName: _session!.fullName,
                  repository: studentRepo,
                  onLogout: () => setState(() => _session = null),
                )),
    );
  }
}
