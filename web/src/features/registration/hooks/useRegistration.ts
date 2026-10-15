import { useRef, useState } from 'react';
import { academicsService } from '@/features/academics';
import { useAsyncData } from '@/shared/hooks/useAsyncData';
import { registrationService } from '../services/registration.service';
async function getRegistration(signal: AbortSignal) {
  const [courses, registered] = await Promise.all([
    academicsService.getCourses(signal),
    registrationService.getRegisteredCourses(signal),
  ]);
  return { courses, registered };
}
export function useRegistration() {
  const state = useAsyncData(getRegistration);
  const [pending, setPending] = useState(false);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const busy = useRef(false);
  async function mutate(courseId: string, action: 'register' | 'remove') {
    if (busy.current) return;
    busy.current = true;
    setPending(true);
    setMutationError(null);
    try {
      if (action === 'register') await registrationService.registerCourse(courseId);
      else await registrationService.removeCourse(courseId);
      await state.reload();
    } catch (err) {
      setMutationError(err instanceof Error ? err.message : 'Không thể cập nhật đăng ký học phần.');
    } finally {
      busy.current = false;
      setPending(false);
    }
  }
  const registeredIds = new Set(state.data?.registered.map((course) => course.id));
  const totalCredits = (state.data?.registered ?? []).reduce(
    (total, course) => total + course.credits,
    0,
  );
  return {
    ...state,
    pending,
    mutationError,
    registeredIds,
    totalCredits,
    register: (id: string) => mutate(id, 'register'),
    remove: (id: string) => mutate(id, 'remove'),
  };
}
