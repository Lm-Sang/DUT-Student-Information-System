import { useCallback } from 'react';
import { useAsyncData } from '@/shared/hooks/useAsyncData';
import { academicsService } from '../services/academics.service';
export const useCourses = () => useAsyncData(academicsService.getCourses);
export const useAcademicPortal = () => useAsyncData(academicsService.getPortalData);
export const useGrades = () => useAsyncData(academicsService.getGrades);
export const useCourse = (id: string) =>
  useAsyncData(useCallback((signal: AbortSignal) => academicsService.getCourse(id, signal), [id]));
export function useSchedule() {
  const state = useAsyncData(academicsService.getSchedule);
  return {
    ...state,
    classes: state.data?.filter((item) => item.type === 'class') ?? [],
    exams: state.data?.filter((item) => item.type === 'exam') ?? [],
  };
}
