import { useState } from 'react';
import { usePortalEdition } from '@/shared/config/portalEdition';
import { ProgramV2Summary } from '../components/AcademicV2Summary';
import { Link, useSearchParams } from 'react-router-dom';
import { useAcademicPortal } from '../hooks/useAcademics';
import {
  AcademicMetric,
  AcademicMetrics,
  AcademicPageTitle,
  AcademicPanel,
  AcademicSectionHeading,
  AcademicTable,
} from '../components/AcademicUi';
import { EmptyState, ErrorState, LoadingState } from '@/shared/ui/FeedbackStates';
import { Disclosure } from '@/shared/ui/Disclosure';
import { Badge } from '@/shared/ui/Badge';
import { paths } from '@/shared/config/routes';

export function CoursesPage() {
  const v2 = usePortalEdition() === 'v2';
  const { data, loading, error, reload } = useAcademicPortal();
  const [params, setParams] = useSearchParams();
  const [semester, setSemester] = useState(2);
  const [status, setStatus] = useState('Tất cả trạng thái');
  const query = params.get('q') ?? '';
  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!data) return <EmptyState message="Chưa có khung chương trình." />;
  const shown =
    semester === 2
      ? data.program.courses.filter(
          (course) =>
            `${course.code} ${course.name}`
              .toLocaleLowerCase('vi')
              .includes(query.trim().toLocaleLowerCase('vi')) &&
            (status === 'Tất cả trạng thái' || course.status === status),
        )
      : [];
  return (
    <div className="space-y-6 text-ink">
      <div>
        <AcademicPageTitle title="Khung chương trình đào tạo" subtitle={data.program.name} />
      </div>

      {v2 ? (
        <ProgramV2Summary
          code={data.program.code}
          majorCode={data.program.majorCode}
          student={data.student}
        />
      ) : (
        <AcademicMetrics>
          <AcademicMetric
            label="Tín chỉ tích lũy"
            value="112 / 130"
            hint="Hoàn thành 86,2% chương trình"
          />
          <AcademicMetric label="Khối bắt buộc" value="104 / 122" hint="Còn 18 tín chỉ" />
          <AcademicMetric label="Khối tự chọn" value="8 / 8" hint="Đã hoàn thành" />
          <AcademicMetric label="GPA tích lũy" value="3.69 / 4.0" hint="Theo kết quả đã công bố" />
        </AcademicMetrics>
      )}
      <AcademicPanel>
        <AcademicSectionHeading detail="8 học kỳ">
          Học phần trong chương trình
        </AcademicSectionHeading>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <input
            type="search"
            aria-label="Tìm tên hoặc mã học phần"
            placeholder="Tìm tên hoặc mã học phần"
            value={query}
            onChange={(event) =>
              setParams(event.target.value ? { q: event.target.value } : {}, { replace: true })
            }
            className="!min-h-9 w-full max-w-64 !border-0 !bg-subtle !text-[0.8125rem]"
          />
          <select
            aria-label="Trạng thái học phần"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="!min-h-9 !border-0 !bg-subtle !text-[0.8125rem] text-brand"
          >
            {['Tất cả trạng thái', 'Đã đạt', 'Đang học', 'Chưa học'].map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
        <div
          className="mb-4 flex max-w-full gap-1 overflow-x-auto rounded-lg bg-subtle p-1 sm:w-fit"
          role="group"
          aria-label="Chọn học kỳ"
        >
          {Array.from({ length: 8 }, (_, index) => index + 1).map((term) => (
            <button
              key={term}
              type="button"
              aria-pressed={semester === term}
              onClick={() => setSemester(term)}
              className={`shrink-0 rounded-md px-3 py-2 text-xs font-medium ${semester === term ? 'bg-action text-white' : 'text-brand hover:bg-surface'}`}
            >
              HK {term}
            </button>
          ))}
        </div>
        <div className="mb-4 flex items-center justify-between gap-2">
          <h3 className="text-[1.0625rem] font-semibold">
            Học kỳ {semester % 2 || 2} · {2023 + Math.floor((semester - 1) / 2)} –{' '}
            {2024 + Math.floor((semester - 1) / 2)}
          </h3>
          {semester === 2 && <Badge tone="success">{shown.length} học phần đang hiển thị</Badge>}
        </div>
        {shown.length ? (
          <AcademicTable label="Học phần trong chương trình" minWidth={1060}>
            <thead>
              <tr>
                <th>Mã HP / Tên học phần</th>
                <th>TC</th>
                <th>Loại</th>
                <th>Điểm T4</th>
                <th>Tiến độ</th>
                <th>Điều kiện học phần</th>
                <th>Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((course) => (
                <tr key={course.code}>
                  <td>
                    <span className="block font-medium">{course.code}</span>
                    <span className="block text-xs text-muted">{course.name}</span>
                  </td>
                  <td>{course.credits}</td>
                  <td>Bắt buộc</td>
                  <td>{course.grade}</td>
                  <td>
                    <Badge tone="success">{course.status}</Badge>
                  </td>
                  <td>{course.condition}</td>
                  <td>
                    <Link
                      className="whitespace-nowrap text-brand hover:underline"
                      to={paths.course(course.code)}
                    >
                      Xem →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </AcademicTable>
        ) : (
          <EmptyState message="Không có học phần phù hợp trong học kỳ này." />
        )}
        <p className="mt-3 text-xs text-muted">
          Điểm và quan hệ học phần được đối chiếu theo chương trình cá nhân.
        </p>
        <div className="mt-4 flex items-center justify-between text-xs text-muted">
          <span>{shown.length} học phần / trang</span>
          <span className="flex items-center gap-2">
            <button disabled>Trước</button>
            <span className="rounded-md bg-action px-3 py-2 text-white">1</span>
            <button disabled>Tiếp</button>
          </span>
        </div>
      </AcademicPanel>
      <AcademicPanel>
        <AcademicSectionHeading>Điều kiện hoàn thành chương trình</AcademicSectionHeading>
        <div className="flex flex-wrap items-end gap-x-8 gap-y-4 text-[0.8125rem]">
          <div>
            <p className="text-xs text-muted">Tín chỉ bắt buộc</p>
            <p className="mt-1 font-medium">122 tín chỉ</p>
          </div>
          <div>
            <p className="text-xs text-muted">Tín chỉ tự chọn</p>
            <p className="mt-1 font-medium">8 tín chỉ</p>
          </div>
          <div>
            <p className="text-xs text-muted">Chứng chỉ & kết quả xét tốt nghiệp</p>
            <p className="mt-1 font-medium">Xem trong Kết quả học tập</p>
          </div>
          <Link className="font-medium text-brand hover:underline" to={paths.grades}>
            Xem kết quả →
          </Link>
        </div>
      </AcademicPanel>
      <Disclosure title="Thông tin chương trình">
        <dl className="flex flex-wrap gap-x-9 gap-y-3 text-[0.8125rem]">
          {[
            ['Mã chương trình', data.program.code],
            ['Mã ngành', data.program.majorCode],
            ['Thời gian', data.program.duration],
            ['Sinh viên', data.student],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs text-muted">{label}</dt>
              <dd className="mt-1 font-medium">{value}</dd>
            </div>
          ))}
        </dl>
      </Disclosure>
    </div>
  );
}
