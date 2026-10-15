import { useState } from 'react';
import { usePortalEdition } from '@/shared/config/portalEdition';
import { GradesV2Summary } from '../components/AcademicV2Summary';
import { useAcademicPortal } from '../hooks/useAcademics';
import {
  AcademicMetric,
  AcademicMetrics,
  AcademicPageTitle,
  AcademicPanel,
  AcademicSectionHeading,
  AcademicTable,
  AcademicTabs,
} from '../components/AcademicUi';
import { EmptyState, ErrorState, LoadingState } from '@/shared/ui/FeedbackStates';
import { Disclosure } from '@/shared/ui/Disclosure';
import { Badge } from '@/shared/ui/Badge';

export function GradesPage() {
  const v2 = usePortalEdition() === 'v2';
  const { data, loading, error, reload } = useAcademicPortal();
  const [expanded, setExpanded] = useState('');
  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!data) return <EmptyState message="Chưa có kết quả học tập." />;
  const selected = data.results.find((result) => result.term === expanded);
  return (
    <div className="text-ink">
      <AcademicPageTitle
        title="Kết quả học tập & rèn luyện"
        subtitle={`${data.student} · Khóa 2023`}
      />
      {v2 && <AcademicTabs />}
      {v2 ? (
        <GradesV2Summary results={data.results} />
      ) : (
        <AcademicMetrics>
          <AcademicMetric label="GPA tích lũy" value="3.69 / 4.0" hint="Đến HK2 · 2025 – 2026" />
          <AcademicMetric label="Tín chỉ tích lũy" value="112 / 130" hint="Còn 18 tín chỉ" />
          <AcademicMetric label="GPA kỳ gần nhất" value="3.92 / 4.0" hint="HK2 · 2025 – 2026" />
          <AcademicMetric label="Rèn luyện đã công bố" value="90 / 100" hint="HK1 · 2025 – 2026" />
        </AcademicMetrics>
      )}
      {!v2 && <AcademicTabs />}
      <div className="space-y-6">
        <AcademicPanel>
          <AcademicSectionHeading detail="6 học kỳ đã có điểm">
            Kết quả theo học kỳ
          </AcademicSectionHeading>
          <AcademicTable label="Kết quả theo học kỳ" minWidth={900}>
            <thead>
              <tr>
                <th>Học kỳ / Năm học</th>
                <th>TC đăng ký</th>
                <th>GPA kỳ (T4)</th>
                <th>TBC kỳ (T10)</th>
                <th>Rèn luyện</th>
                <th>TC tích lũy</th>
                <th>GPA tích lũy</th>
                <th>Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {data.results.map((row) => (
                <tr key={row.term} className={expanded === row.term ? '!bg-canvas' : ''}>
                  <td className="whitespace-nowrap">{row.term}</td>
                  <td>{row.credits}</td>
                  <td>{row.gpa}</td>
                  <td>{row.average}</td>
                  <td>{row.conduct}</td>
                  <td>{row.accumulatedCredits}</td>
                  <td>{row.accumulatedGpa}</td>
                  <td>
                    <button
                      type="button"
                      className="whitespace-nowrap text-brand hover:underline"
                      onClick={() => setExpanded(expanded === row.term ? '' : row.term)}
                    >
                      {expanded === row.term ? 'Thu gọn ↑' : 'Xem chi tiết'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </AcademicTable>
          {selected && (
            <div className="mt-4 rounded-lg bg-subtle p-4 text-[0.8125rem]">
              <p className="mb-3 font-medium text-brand">{selected.term}</p>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                {[
                  ['TBC học bổng (T10)', selected.average],
                  ['Tín chỉ học lại', '—'],
                  ['Xếp loại học tập', 'Bình thường'],
                  ['Cảnh báo học vụ', '—'],
                  ['TB rèn luyện tích lũy', '71'],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-xs text-muted">{label}</p>
                    <p className="mt-1 font-medium">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          <p className="mt-4 text-xs text-muted">
            “—”: chưa có dữ liệu. Kết quả kỳ gần nhất có thể tiếp tục được cập nhật.
          </p>
        </AcademicPanel>
        <Disclosure title="Chứng chỉ & điều kiện tốt nghiệp">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ['Ngoại ngữ', 'Chưa có hồ sơ'],
              ['Tin học', 'Chưa xác nhận'],
              ['Giáo dục thể chất', 'Chưa xác nhận'],
              ['GDQP – An ninh', 'Đã có chứng chỉ'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg bg-canvas p-4 text-[0.8125rem]">
                <p className="font-medium">{label}</p>
                <div className="mt-2">
                  {label === 'GDQP – An ninh' ? (
                    <Badge tone="success">{value}</Badge>
                  ) : (
                    <span className="text-xs text-muted">{value}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="my-4 flex flex-wrap items-center justify-between gap-2 border-b border-line pb-4 text-[0.8125rem]">
            <span>Chứng chỉ ngoại ngữ đã nộp</span>
            <span className="text-muted">Chưa có chứng chỉ được ghi nhận</span>
          </div>
          <div className="flex flex-wrap gap-8 text-[0.8125rem]">
            {[
              ['Khen thưởng / Kỷ luật', 'Chưa có thông tin'],
              ['Xét nhận đồ án tốt nghiệp', 'Chưa công bố'],
              ['Xét công nhận tốt nghiệp', 'Chưa công bố'],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-xs text-muted">{label}</p>
                <p className="mt-1 font-medium">{value}</p>
              </div>
            ))}
          </div>
        </Disclosure>
      </div>
    </div>
  );
}
