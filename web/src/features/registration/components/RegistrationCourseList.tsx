import type { Course } from '@/features/academics';
import { Button } from '@/shared/ui/Button';
interface Props {
  courses: Course[];
  pending: boolean;
  onAction: (id: string) => void;
  action: 'register' | 'remove';
  registeredIds?: Set<string>;
}
export function RegistrationCourseList({
  courses,
  pending,
  onAction,
  action,
  registeredIds,
}: Props) {
  return (
    <ul className="divide-y divide-line">
      {courses.map((course) => {
        const registered = action === 'register' && registeredIds?.has(course.id);
        return (
          <li key={course.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
            <div className="min-w-0">
              <p className="font-medium">{course.name}</p>
              <p className="mt-1 text-xs text-muted">
                {course.code} · {course.credits} tín chỉ
              </p>
            </div>
            <Button
              variant={action === 'remove' ? 'secondary' : 'primary'}
              disabled={pending || !!registered}
              onClick={() => onAction(course.id)}
            >
              {action === 'remove' ? 'Hủy đăng ký' : registered ? 'Đã đăng ký' : 'Đăng ký'}
            </Button>
          </li>
        );
      })}
    </ul>
  );
}
