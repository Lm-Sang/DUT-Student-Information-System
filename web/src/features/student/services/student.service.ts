import { mockRequest } from '@/shared/lib/api/mockRequest';
import { studentProfile } from '../mocks/student.mock';
import type { StudentProfile } from '../types';
export const studentService = {
  getProfile: (signal?: AbortSignal): Promise<StudentProfile> =>
    mockRequest(studentProfile, signal),
};
