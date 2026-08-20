import {
  courses,
  grades,
  notifications,
  registeredCourseIds,
  schedules,
  studentProfile,
  tuitionPayments,
  adminSummary,
} from '../mock/data';
import type { Course } from '../types';
import { mockRequest } from './apiClient';

let registrationState = [...registeredCourseIds];

export const studentService = {
  getProfile: async () => (await mockRequest(studentProfile)).data,
  getCourses: async () => (await mockRequest(courses)).data,
  getCourseById: async (id: string) => {
    const course = courses.find((item) => item.id === id);
    return (await mockRequest(course)).data;
  },
  getGrades: async () => (await mockRequest(grades)).data,
  getSchedules: async () => (await mockRequest(schedules.filter((item) => item.type === 'class'))).data,
  getExamSchedules: async () => (await mockRequest(schedules.filter((item) => item.type === 'exam'))).data,
  getRegisteredCourses: async () => {
    const data = courses.filter((course) => registrationState.includes(course.id));
    return (await mockRequest(data)).data;
  },
  registerCourse: async (courseId: string) => {
    if (!registrationState.includes(courseId)) {
      registrationState = [...registrationState, courseId];
    }

    return (await mockRequest(courses.filter((course) => registrationState.includes(course.id)))).data;
  },
  removeRegisteredCourse: async (courseId: string) => {
    registrationState = registrationState.filter((id) => id !== courseId);
    return (await mockRequest(courses.filter((course) => registrationState.includes(course.id)))).data;
  },
  getTuition: async () => (await mockRequest(tuitionPayments)).data,
  getNotifications: async () => (await mockRequest(notifications)).data,
  getAdminSummary: async () => (await mockRequest(adminSummary)).data,
  getAdminManagementLists: async () =>
    (await
      mockRequest([
        'Manage students',
        'Manage courses',
        'Manage classes',
        'Manage grades',
        'Manage schedules',
        'Manage tuition information',
        'Manage announcements',
      ])).data,
};

export function calculateTotalCredits(registeredCourses: Course[]): number {
  return registeredCourses.reduce((total, course) => total + course.credits, 0);
}
