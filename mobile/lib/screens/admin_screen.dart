import 'package:flutter/material.dart';

class AdminScreen extends StatelessWidget {
  final String fullName;
  final VoidCallback onLogout;

  const AdminScreen({super.key, required this.fullName, required this.onLogout});

  @override
  Widget build(BuildContext context) {
    const modules = [
      'Manage students',
      'Manage courses',
      'Manage classes',
      'Manage grades',
      'Manage schedules',
      'Manage tuition information',
      'Manage announcements',
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Admin Dashboard'),
        actions: [
          IconButton(onPressed: onLogout, icon: const Icon(Icons.logout)),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(12),
        children: [
          Text('Welcome, $fullName', style: Theme.of(context).textTheme.titleLarge),
          const SizedBox(height: 8),
          ...modules.map((item) => Card(child: ListTile(title: Text(item)))),
        ],
      ),
    );
  }
}
