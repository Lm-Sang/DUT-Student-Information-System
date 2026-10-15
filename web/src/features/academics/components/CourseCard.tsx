import { Link } from 'react-router-dom';
import type { Course } from '../types';
import { Card } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import { paths } from '@/shared/config/routes';
export function CourseCard({ course }: { course: Course }) {
  return (
    <Card className="flex flex-col items-start gap-4">
      <div className="flex w-full items-center justify-between">
        <span className="text-xs font-semibold text-muted">{course.code}</span>
        <Badge>{course.credits} tín chỉ</Badge>
      </div>
      <h2 className="text-lg font-semibold">{course.name}</h2>
      <p className="text-muted">Giảng viên: {course.instructor}</p>
      <p className="flex-1 text-muted">{course.description}</p>
      <Link to={paths.course(course.id)} className="font-medium text-brand hover:underline">
        Xem chi tiết →
      </Link>
    </Card>
  );
}
