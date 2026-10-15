import { useState } from 'react';
import { useAcademicPortal } from '../hooks/useAcademics';
import type { CurrentCourse } from '../types';
import {
  AcademicPageTitle,
  AcademicPanel,
  AcademicSectionHeading,
  AcademicTable,
} from '../components/AcademicUi';
import { EmptyState, ErrorState, LoadingState } from '@/shared/ui/FeedbackStates';
import { Disclosure } from '@/shared/ui/Disclosure';
import { Icon } from '@/shared/ui/Icon';

type Task = { course: string; action: 'Đề cương' | 'Công thức điểm' | 'DSSV'; description: string };
type ScheduleIconName = 'room' | 'syllabus' | 'students' | 'briefcase';

function ScheduleIcon({ name }: { name: ScheduleIconName }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-3.5 shrink-0"
    >
      {name === 'room' && (
        <>
          <path d="M4 17V3h12v14M2.5 17h15M7 6.5h1m4 0h1M7 10h1m4 0h1M8.5 17v-4h3v4" />
        </>
      )}
      {name === 'syllabus' && (
        <>
          <path d="M10 5.5C8.2 4.3 5.9 4 3 4v11.5c2.9 0 5.2.4 7 1.5 1.8-1.1 4.1-1.5 7-1.5V4c-2.9 0-5.2.3-7 1.5Z" />
          <path d="M10 5.5V17M5.5 7h2M5.5 10h2m5-3h2m-2 3h2" />
        </>
      )}
      {name === 'students' && (
        <>
          <circle cx="7" cy="7" r="2.2" />
          <path d="M2.7 16v-1.2A4.3 4.3 0 0 1 7 10.5a4.3 4.3 0 0 1 4.3 4.3V16H2.7ZM12.7 5.2a2.2 2.2 0 0 1 0 4.3M14 11a4.2 4.2 0 0 1 3.3 4.1V16h-3.1" />
        </>
      )}
      {name === 'briefcase' && (
        <>
          <rect x="2.5" y="6" width="15" height="11" rx="1.5" />
          <path d="M7 6V4.5A1.5 1.5 0 0 1 8.5 3h3A1.5 1.5 0 0 1 13 4.5V6M2.5 11.5h15M9 11.5v2h2v-2" />
        </>
      )}
    </svg>
  );
}

function taskDescription(course: CurrentCourse, action: Task['action']) {
  if (action === 'Công thức điểm') return course.formula ?? 'Chưa công bố';
  if (action === 'DSSV')
    return 'Danh sách sinh viên của lớp học phần chưa được cung cấp trong dữ liệu hiện tại.';
  return `${course.credits} tín chỉ · Giảng viên ${course.lecturer} · ${course.day}, ${course.periods}`;
}

export function SchedulePage() {
  const { data, loading, error, reload } = useAcademicPortal();
  const [task, setTask] = useState<Task | null>(null);
  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!data) return <EmptyState message="Chưa có lịch học." />;
  return (
    <div className="space-y-6 text-ink">
      <div>
        <AcademicPageTitle title="Lịch học & lịch thi" subtitle={data.student} />
        <div className="flex flex-wrap gap-2 text-[0.8125rem] text-brand">
          <span className="rounded-lg bg-subtle px-3 py-2">HK1 · 2026 – 2027⌄</span>
          <span className="rounded-lg bg-subtle px-3 py-2">5 học phần · 12 tín chỉ</span>
        </div>
      </div>
      <section className="overflow-hidden rounded-xl border border-line bg-surface shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="px-5 pt-5">
          <AcademicSectionHeading detail="Học kỳ 1 · 2026 – 2027">
            Lớp học phần
          </AcademicSectionHeading>
        </div>
        <div
          role="region"
          aria-label="Lịch học"
          tabIndex={0}
          className="schedule-desktop max-w-full overflow-x-auto"
        >
          <table className="schedule-table">
            <caption className="sr-only">Lịch học</caption>
            <colgroup>
              <col style={{ width: '17%' }} />
              <col style={{ width: '27%' }} />
              <col style={{ width: '6%' }} />
              <col style={{ width: '18%' }} />
              <col style={{ width: '15%' }} />
              <col style={{ width: '9%' }} />
              <col style={{ width: '8%' }} />
            </colgroup>
            <thead>
              <tr>
                <th scope="col">Mã HP / Lớp HP</th>
                <th scope="col">Tên học phần &amp; giảng viên</th>
                <th scope="col" className="!text-center">
                  Số TC
                </th>
                <th scope="col">Thời gian học</th>
                <th scope="col">Địa điểm</th>
                <th scope="col">Tuần</th>
                <th scope="col" className="!text-center">
                  Tác vụ
                </th>
              </tr>
            </thead>
            <tbody>
              {data.currentCourses.map((course) => {
                const openTask = (action: Task['action']) =>
                  setTask({
                    course: course.name,
                    action,
                    description: taskDescription(course, action),
                  });
                return (
                  <tr key={course.classCode}>
                    <td>
                      <span className="block whitespace-nowrap font-semibold text-brand-deep">
                        {course.classCode}
                      </span>
                      <span className="mt-0.5 block text-xs text-muted">{course.classGroup}</span>
                    </td>
                    <td>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="font-semibold text-ink">{course.name}</span>
                        {course.kind === 'project' && (
                          <span className="rounded bg-warning-soft px-1.5 py-0.5 text-xs font-semibold text-warning">
                            Trọng điểm
                          </span>
                        )}
                      </div>
                      <span className="mt-0.5 block text-xs text-muted">{course.lecturer}</span>
                    </td>
                    <td className="!text-center">
                      <button
                        type="button"
                        aria-label={`Công thức điểm ${course.name}`}
                        title="Công thức điểm"
                        onClick={() => openTask('Công thức điểm')}
                        className="inline-flex min-h-6 min-w-6 items-center justify-center rounded bg-subtle px-1.5 text-xs font-semibold text-brand-deep hover:bg-subtle"
                      >
                        {course.credits}
                      </button>
                    </td>
                    <td>
                      <span className="block font-medium text-ink">{course.day}</span>
                      <span className="mt-0.5 block whitespace-nowrap text-xs text-muted">
                        {course.periods}
                        {course.time ? ` (${course.time})` : ''}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`inline-flex max-w-full items-center gap-1 rounded-full px-2 py-1 text-xs font-medium whitespace-nowrap ${course.kind === 'project' ? 'bg-subtle text-brand-deep' : course.kind === 'internship' ? 'bg-subtle text-muted' : 'bg-subtle text-brand-deep'}`}
                      >
                        <ScheduleIcon name={course.kind === 'internship' ? 'briefcase' : 'room'} />
                        {course.room}
                      </span>
                    </td>
                    <td
                      className={`whitespace-nowrap font-medium ${course.kind === 'internship' ? 'text-warning' : 'text-ink'}`}
                    >
                      {course.weeks}
                    </td>
                    <td>
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          aria-label={`Đề cương ${course.name}`}
                          title="Đề cương"
                          onClick={() => openTask('Đề cương')}
                          className="grid size-8 place-items-center rounded-lg text-muted hover:bg-subtle hover:text-brand"
                        >
                          <ScheduleIcon name="syllabus" />
                        </button>
                        <button
                          type="button"
                          aria-label={`DSSV ${course.name}`}
                          title="Danh sách sinh viên"
                          onClick={() => openTask('DSSV')}
                          className="grid size-8 place-items-center rounded-lg text-muted hover:bg-subtle hover:text-brand"
                        >
                          <ScheduleIcon
                            name={course.kind === 'internship' ? 'briefcase' : 'students'}
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="schedule-mobile px-5" role="region" aria-label="Danh sách lịch học">
          {data.currentCourses.map((course) => (
            <article key={course.classCode} className="border-t border-line py-5">
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-brand">
                <Icon name="calendar" className="!size-4" />
                {course.day} · {course.time ?? course.periods}
              </div>
              <h3 className="text-base font-semibold">{course.name}</h3>
              <p className="mt-2 text-sm text-muted">Phòng {course.room}</p>
              <details className="mt-3 schedule-class-details">
                <summary className="text-sm font-medium text-brand">Chi tiết lớp</summary>
                <p className="mt-1 break-words text-xs text-muted">
                  {course.classCode} · {course.credits} tín chỉ
                </p>
                <dl className="my-4 grid grid-cols-[72px_1fr] gap-x-3 gap-y-2 text-sm">
                  <dt className="text-muted">Phòng</dt>
                  <dd>{course.room}</dd>
                  <dt className="text-muted">Giảng viên</dt>
                  <dd>{course.lecturer}</dd>
                  <dt className="text-muted">Tuần</dt>
                  <dd>{course.weeks}</dd>
                  <dt className="text-muted">Tiết</dt>
                  <dd>{course.periods}</dd>
                </dl>
                <div className="flex flex-wrap gap-2">
                  {(['Đề cương', 'Công thức điểm', 'DSSV'] as const).map((action) => (
                    <button
                      key={action}
                      type="button"
                      aria-label={`${action} ${course.name}`}
                      className="min-h-11 rounded-lg bg-subtle px-3 text-xs font-medium text-brand"
                      onClick={() =>
                        setTask({
                          course: course.name,
                          action,
                          description: taskDescription(course, action),
                        })
                      }
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </details>
            </article>
          ))}
        </div>
        {task && (
          <div
            role="status"
            className="mx-5 mt-4 flex flex-wrap items-start justify-between gap-3 rounded-lg bg-subtle p-4 text-[0.8125rem]"
          >
            <div>
              <p className="font-semibold">
                {task.action} · {task.course}
              </p>
              <p className="mt-1 text-muted">{task.description}</p>
            </div>
            <button type="button" className="text-brand" onClick={() => setTask(null)}>
              Đóng
            </button>
          </div>
        )}
        <p className="px-5 py-3 text-xs text-muted">
          Chọn số tín chỉ để xem công thức điểm. DSSV: Danh sách sinh viên.
        </p>
      </section>
      <AcademicPanel>
        <AcademicSectionHeading detail="Học kỳ 1 · 2026 – 2027">
          Lịch thi cuối kỳ
        </AcademicSectionHeading>
        <div className="mb-4 rounded-lg bg-subtle p-4 text-[0.8125rem]">
          <p className="font-medium text-brand">Lịch thi chưa được công bố</p>
          <p className="mt-1 text-muted">
            Ngày, ca và phòng thi sẽ hiển thị khi có thông báo từ nhà trường.
          </p>
        </div>
        <Disclosure title="Học phần & nhóm thi" flush>
          <AcademicTable label="Lịch thi" minWidth={850}>
            <thead>
              <tr>
                <th>Học phần / Mã lớp</th>
                <th>Nhóm thi</th>
                <th>Thi chung / riêng</th>
                <th>Ngày thi</th>
                <th>Giờ / Ca</th>
                <th>Phòng</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {data.currentCourses.map((course) => (
                <tr key={course.classCode}>
                  <td>
                    <span className="block font-medium">{course.name}</span>
                    <span className="text-xs text-muted">{course.classCode}</span>
                  </td>
                  <td>{course.examGroup ?? '—'}</td>
                  <td>—</td>
                  <td>—</td>
                  <td>—</td>
                  <td>—</td>
                  <td>
                    <span className="rounded bg-subtle px-2 py-1 text-xs text-muted">
                      Chưa công bố
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </AcademicTable>
        </Disclosure>
        <p className="mt-4 text-xs text-muted">“—”: chưa có thông tin lịch thi.</p>
      </AcademicPanel>
    </div>
  );
}
