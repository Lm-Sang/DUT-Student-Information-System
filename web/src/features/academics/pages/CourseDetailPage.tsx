import { Link, useParams } from 'react-router-dom';
import { useAcademicPortal, useCourse } from '../hooks/useAcademics';
import {
  AcademicMetric,
  AcademicMetrics,
  AcademicPageTitle,
  AcademicPanel,
  AcademicSectionHeading,
  AcademicTable,
} from '../components/AcademicUi';
import { EmptyState, ErrorState, LoadingState } from '@/shared/ui/FeedbackStates';
import { Badge } from '@/shared/ui/Badge';
import { paths } from '@/shared/config/routes';

export function CourseDetailPage() {
  const { id = '' } = useParams();
  const portal = useAcademicPortal();
  const legacy = useCourse(id);
  if (portal.loading || legacy.loading) return <LoadingState />;
  if (portal.error) return <ErrorState message={portal.error} onRetry={portal.reload} />;
  const selected = portal.data?.program.courses.find((course) => course.code === id);
  const old = legacy.data;
  if (!selected && !old) return <EmptyState message="Không tìm thấy học phần." />;
  const name = selected?.name ?? old?.name ?? '';
  const code = selected?.code ?? old?.code ?? '';
  const credits = selected?.credits ?? old?.credits ?? 0;
  const isPbl = code === '1022933';
  return (
    <div className="space-y-6 text-ink">
      <Link
        to={paths.courses}
        className="inline-block text-[0.8125rem] font-medium text-brand hover:underline"
      >
        ← Khung chương trình
      </Link>
      <AcademicPageTitle title={name} subtitle={`${code} · Chương trình 1024034 · Học kỳ 2`} />
      <AcademicMetrics>
        <AcademicMetric label="Khối lượng" value={`${credits} tín chỉ`} hint="Học phần bắt buộc" />
        <AcademicMetric
          label="Kết quả học"
          value={selected ? `${selected.grade} / 4.0` : '—'}
          hint={selected ? 'Đã đạt' : 'Chưa có dữ liệu'}
        />
        <AcademicMetric label="Học kỳ đề xuất" value="Học kỳ 2" hint="Năm học 2023 – 2024" />
        <AcademicMetric label="Điểm chuyển" value="—" hint="Chưa có điểm chuyển" />
      </AcademicMetrics>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="min-w-0 space-y-6">
          <AcademicPanel>
            <AcademicSectionHeading>Điều kiện học phần</AcademicSectionHeading>
            <div className="mb-4 rounded-lg bg-subtle p-4 text-[0.8125rem] font-medium text-brand">
              {isPbl
                ? 'Có thể đăng ký khi đủ điều kiện học phần song hành'
                : (selected?.condition ??
                  'Kiểm tra chương trình đào tạo để xem điều kiện học phần.')}
            </div>
            <AcademicTable label="Điều kiện học phần" minWidth={500}>
              <thead>
                <tr>
                  <th>Quan hệ</th>
                  <th>Học phần liên quan</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Học trước</td>
                  <td>
                    {selected?.condition.startsWith('Học trước:')
                      ? selected.condition.slice(10)
                      : 'Không có'}
                  </td>
                </tr>
                <tr>
                  <td>Song hành</td>
                  <td>
                    {isPbl ? (
                      <>
                        <span className="block">1020072 · Phương pháp tính</span>
                        <span className="text-xs text-muted">
                          Đăng ký cùng kỳ hoặc đã hoàn thành
                        </span>
                      </>
                    ) : (
                      'Không có'
                    )}
                  </td>
                </tr>
                <tr>
                  <td>Tiên quyết</td>
                  <td>
                    {selected?.condition.startsWith('Tiên quyết:')
                      ? selected.condition.slice(11)
                      : 'Không có'}
                  </td>
                </tr>
              </tbody>
            </AcademicTable>
          </AcademicPanel>
          <AcademicPanel>
            <AcademicSectionHeading>Đánh giá & điểm số</AcademicSectionHeading>
            <div className="flex flex-wrap items-center gap-8 border-b border-line pb-4 text-[0.8125rem]">
              <div>
                <p className="text-xs text-muted">Điểm học (thang 4)</p>
                <p className="mt-1 font-medium">{selected?.grade ?? '—'}</p>
              </div>
              <div>
                <p className="text-xs text-muted">Điểm chuyển</p>
                <p className="mt-1 font-medium">—</p>
              </div>
              {selected && <Badge tone="success">Đã đạt</Badge>}
            </div>
            <h3 className="mt-4 text-[0.8125rem] font-semibold">Công thức đánh giá</h3>
            <p className="mt-3 text-sm text-muted">
              Chưa có công thức điểm được công bố cho học phần này.
            </p>
          </AcademicPanel>
        </div>
        <AcademicPanel className="self-start">
          <AcademicSectionHeading>Thông tin bổ sung</AcademicSectionHeading>
          <dl className="divide-y divide-line text-[0.8125rem]">
            {[
              ['Loại học phần', 'Bắt buộc'],
              ['Ký hiệu', '—'],
              ['HT ĐA', isPbl ? 'Có' : '—'],
              ['TQ ĐA', '—'],
              ['Ghi chú', 'Chưa có ghi chú'],
            ].map(([label, value]) => (
              <div key={label} className="py-3">
                <dt className="text-xs text-muted">{label}</dt>
                <dd className="mt-1 font-medium">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="border-t border-line pt-4 text-xs text-muted">
            Thông tin theo khung chương trình cá nhân.
          </p>
        </AcademicPanel>
      </div>
    </div>
  );
}
