import { useAsyncData } from '@/shared/hooks/useAsyncData';
import { studentService } from '../services/student.service';
export const useStudentProfile = () => useAsyncData(studentService.getProfile);
