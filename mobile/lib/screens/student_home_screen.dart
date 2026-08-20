import 'package:flutter/material.dart';

import '../models/models.dart';
import '../services/student_repository.dart';
import '../widgets/info_card.dart';

class StudentHomeScreen extends StatefulWidget {
  final String fullName;
  final StudentRepository repository;
  final VoidCallback onLogout;

  const StudentHomeScreen({
    super.key,
    required this.fullName,
    required this.repository,
    required this.onLogout,
  });

  @override
  State<StudentHomeScreen> createState() => _StudentHomeScreenState();
}

class _StudentHomeScreenState extends State<StudentHomeScreen> {
  int _index = 0;

  @override
  Widget build(BuildContext context) {
    final pages = [
      _dashboard(),
      _courses(),
      _grades(),
      _schedule(),
      _registration(),
      _tuition(),
      _notifications(),
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Student Portal'),
        actions: [
          IconButton(onPressed: widget.onLogout, icon: const Icon(Icons.logout)),
        ],
      ),
      body: pages[_index],
      bottomNavigationBar: NavigationBar(
        selectedIndex: _index,
        destinations: const [
          NavigationDestination(icon: Icon(Icons.dashboard), label: 'Dashboard'),
          NavigationDestination(icon: Icon(Icons.book), label: 'Courses'),
          NavigationDestination(icon: Icon(Icons.grade), label: 'Grades'),
          NavigationDestination(icon: Icon(Icons.schedule), label: 'Schedule'),
          NavigationDestination(icon: Icon(Icons.app_registration), label: 'Register'),
          NavigationDestination(icon: Icon(Icons.payments), label: 'Tuition'),
          NavigationDestination(icon: Icon(Icons.notifications), label: 'Notices'),
        ],
        onDestinationSelected: (value) => setState(() => _index = value),
      ),
    );
  }

  Widget _dashboard() {
    return FutureBuilder<StudentProfile>(
      future: widget.repository.getProfile(),
      builder: (context, snapshot) {
        if (snapshot.connectionState != ConnectionState.done) {
          return const Center(child: CircularProgressIndicator());
        }
        if (!snapshot.hasData) {
          return const Center(child: Text('No profile data'));
        }

        final profile = snapshot.data!;
        return ListView(
          padding: const EdgeInsets.all(12),
          children: [
            InfoCard(
              title: 'Student profile',
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Student ID: ${profile.studentId}'),
                  Text('Full name: ${profile.fullName}'),
                  Text('Class: ${profile.className}'),
                  Text('Major: ${profile.major}'),
                  Text('Academic year: ${profile.academicYear}'),
                  Text('Current GPA: ${profile.gpa.toStringAsFixed(2)}'),
                  Text('Academic status: ${profile.status}'),
                ],
              ),
            ),
          ],
        );
      },
    );
  }

  Widget _courses() {
    return _listBuilder<Course>(
      title: 'Courses',
      future: widget.repository.getCourses(),
      itemBuilder: (course) => Text('${course.code} - ${course.name} (${course.credits} credits)'),
    );
  }

  Widget _grades() {
    return _listBuilder<Grade>(
      title: 'Grades',
      future: widget.repository.getGrades(),
      itemBuilder: (grade) => Text('${grade.course}: ${grade.score} (${grade.letter})'),
    );
  }

  Widget _schedule() {
    return FutureBuilder<List<dynamic>>(
      future: Future.wait([widget.repository.getClassSchedule(), widget.repository.getExamSchedule()]),
      builder: (context, snapshot) {
        if (snapshot.connectionState != ConnectionState.done) {
          return const Center(child: CircularProgressIndicator());
        }
        if (!snapshot.hasData) return const Center(child: Text('No schedules'));

        final classes = snapshot.data![0] as List<ScheduleItem>;
        final exams = snapshot.data![1] as List<ScheduleItem>;

        return ListView(
          padding: const EdgeInsets.all(12),
          children: [
            InfoCard(
              title: 'Class schedule',
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: classes.map((e) => Text('${e.time} - ${e.title} (${e.room})')).toList(),
              ),
            ),
            InfoCard(
              title: 'Exam schedule',
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: exams.map((e) => Text('${e.time} - ${e.title} (${e.room})')).toList(),
              ),
            ),
          ],
        );
      },
    );
  }

  Widget _registration() {
    return _listBuilder<Course>(
      title: 'Course registration (mock)',
      future: widget.repository.getCourses(),
      itemBuilder: (course) => Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(child: Text('${course.code} - ${course.name} (${course.credits} credits)')),
          FilledButton.tonal(onPressed: () {}, child: const Text('Register')),
        ],
      ),
    );
  }

  Widget _tuition() {
    return _listBuilder<TuitionRecord>(
      title: 'Tuition',
      future: widget.repository.getTuition(),
      itemBuilder: (record) => Text('${record.semester}: ${record.amount} VND - ${record.status}'),
    );
  }

  Widget _notifications() {
    return _listBuilder<NotificationItem>(
      title: 'Notifications',
      future: widget.repository.getNotifications(),
      itemBuilder: (record) => Text('${record.title}\n${record.content}'),
    );
  }

  Widget _listBuilder<T>({
    required String title,
    required Future<List<T>> future,
    required Widget Function(T item) itemBuilder,
  }) {
    return FutureBuilder<List<T>>(
      future: future,
      builder: (context, snapshot) {
        if (snapshot.connectionState != ConnectionState.done) {
          return const Center(child: CircularProgressIndicator());
        }
        if (!snapshot.hasData || snapshot.data!.isEmpty) {
          return const Center(child: Text('No data found'));
        }

        return ListView(
          padding: const EdgeInsets.all(12),
          children: [
            InfoCard(
              title: title,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: snapshot.data!.map(itemBuilder).toList(),
              ),
            ),
          ],
        );
      },
    );
  }
}
