import '../data/mock_data.dart';
import '../models/models.dart';
import 'api_service.dart';

class StudentRepository {
  final ApiService _api;

  StudentRepository(this._api);

  Future<StudentProfile> getProfile() => _api.mock(studentProfile);

  Future<List<Course>> getCourses() => _api.mock(courses);

  Future<List<Grade>> getGrades() => _api.mock(grades);

  Future<List<ScheduleItem>> getClassSchedule() => _api.mock(classSchedule);

  Future<List<ScheduleItem>> getExamSchedule() => _api.mock(examSchedule);

  Future<List<TuitionRecord>> getTuition() => _api.mock(tuitionRecords);

  Future<List<NotificationItem>> getNotifications() => _api.mock(notifications);
}
