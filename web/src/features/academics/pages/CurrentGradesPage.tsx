import { useAcademicPortal } from '../hooks/useAcademics';
import {
  AcademicPageTitle,
  AcademicPanel,
  AcademicSectionHeading,
  AcademicTable,
  AcademicTabs,
} from '../components/AcademicUi';
import { EmptyState, ErrorState, LoadingState } from '@/shared/ui/FeedbackStates';
import { Badge } from '@/shared/ui/Badge';

export function CurrentGradesPage() {
  const { data, loading, error, reload } = useAcademicPortal();
  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!data) return <EmptyState message="Chưa có dữ liệu học kỳ." />;
  return (
    <div className="text-ink">
      <AcademicPageTitle title="Điểm học kỳ hiện tại" subtitle={data.student} />
      <AcademicTabs />
      <div className="space-y-6">
        <AcademicPanel>
          <div className="mb-4 flex flex-wrap items-center gap-3 text-[0.8125rem]">
            <span className="rounded-lg bg-subtle px-3 py-2 font-medium text-brand">
              HK1 · 2026 – 2027⌄
            </span>
            <span className="text-muted">5 học phần · 12 tín chỉ</span>
            <span className="ml-auto">
              <Badge tone="warning">Chưa có điểm tổng kết</Badge>
            </span>
          </div>
          <AcademicTable label="Điểm học kỳ hiện tại" minWidth={1050}>
            <thead>
              <tr>
                <th>Học phần / Mã lớp</th>
                <th>TC</th>
                <th>Bài tập</th>
                <th>Giữa kỳ</th>
                <th>Chuyên cần</th>
                <th>ĐG / ĐA</th>
                <th>Thi / BV</th>
                <th>Thang 10</th>
                <th>Thang 4</th>
                <th>Chữ</th>
              </tr>
            </thead>
            <tbody>
              {data.currentCourses.map((course) => (
                <tr key={course.classCode}>
                  <td>
                    <span className="block font-medium">{course.name}</span>
                    <span className="text-xs text-muted">{course.classCode}</span>
                  </td>
                  <td>{course.credits}</td>
                  {Array.from({ length: 8 }, (_, index) => (
                    <td key={index}>—</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </AcademicTable>
          <p className="mt-4 text-xs text-muted">
            “—”: chưa công bố điểm. ĐG / ĐA: đánh giá / đồ án · BV: bảo vệ.
          </p>
        </AcademicPanel>
        <AcademicPanel>
          <AcademicSectionHeading detail="Theo từng học phần">
            Công thức tính điểm
          </AcademicSectionHeading>
          <AcademicTable label="Công thức tính điểm" minWidth={650}>
            <thead>
              <tr>
                <th>Học phần</th>
                <th>Công thức đánh giá</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <span className="block font-medium">Kiểm thử phần mềm · Chuyên đề CN CNPM</span>
                  <span className="text-xs text-muted">Kiến trúc hướng dịch vụ</span>
                </td>
                <td>{data.currentCourses[0].formula}</td>
              </tr>
              {data.currentCourses.slice(3).map((course) => (
                <tr key={course.code}>
                  <td>{course.name}</td>
                  <td>{course.formula}</td>
                </tr>
              ))}
            </tbody>
          </AcademicTable>
          <p className="mt-4 text-xs text-muted">
            Điểm tổng kết được hiển thị sau khi các thành phần được công bố.
          </p>
        </AcademicPanel>
      </div>
    </div>
  );
}
