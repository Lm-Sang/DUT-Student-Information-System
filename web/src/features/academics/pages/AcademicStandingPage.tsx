import { Link } from 'react-router-dom';
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
import { paths } from '@/shared/config/routes';

export function AcademicStandingPage() {
  const { data, loading, error, reload } = useAcademicPortal();
  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!data) return <EmptyState message="Chưa có dữ liệu học vụ." />;
  return (
    <div className="text-ink">
      <AcademicPageTitle title="Học vụ" subtitle={`${data.student} · Khóa 2023`} />
      <AcademicTabs />
      <AcademicMetrics>
        <AcademicMetric label="Xếp loại học tập" value="Bình thường" hint="Kết quả kỳ gần nhất" />
        <AcademicMetric label="GPA tích lũy" value="3.69 / 4.0" hint="Đến HK2 · 2025 – 2026" />
        <AcademicMetric label="Tín chỉ tích lũy" value="112 / 130" hint="Còn 18 tín chỉ" />
        <AcademicMetric label="Cảnh báo học vụ" value="—" hint="Chưa có dữ liệu công bố" />
      </AcademicMetrics>
      <div className="mt-6 space-y-6">
        <AcademicPanel>
          <AcademicSectionHeading>Tình trạng học vụ hiện tại</AcademicSectionHeading>
          <p className="mb-4 text-sm text-muted">
            Kỳ xét gần nhất: HK2 · 2025 – 2026. Kết quả học tập đã được ghi nhận; quyết định học vụ
            hiển thị theo thông báo của nhà trường.
          </p>
          <AcademicTable label="Tình trạng học vụ" minWidth={850}>
            <thead>
              <tr>
                <th>Học kỳ</th>
                <th>GPA kỳ</th>
                <th>TC tích lũy</th>
                <th>Xếp loại học tập</th>
                <th>Cảnh báo học vụ</th>
                <th>Quyết định / Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {data.results
                .slice(-3)
                .reverse()
                .map((row, index) => (
                  <tr key={row.term}>
                    <td className="whitespace-nowrap font-medium">{row.term}</td>
                    <td>{row.gpa}</td>
                    <td>{row.accumulatedCredits}</td>
                    <td>{index === 0 ? 'Bình thường' : 'Chưa có dữ liệu'}</td>
                    <td>Chưa có dữ liệu</td>
                    <td>Chưa có quyết định</td>
                  </tr>
                ))}
            </tbody>
          </AcademicTable>
          <p className="mt-4 text-xs text-muted">
            Cảnh báo, bảo lưu, ngừng học và thời hạn học tập được cập nhật theo quyết định áp dụng
            cho khóa học.
          </p>
        </AcademicPanel>
        <AcademicPanel>
          <AcademicSectionHeading>Tiến độ & hỗ trợ học vụ</AcademicSectionHeading>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ['Tín chỉ còn lại', '18 tín chỉ'],
              ['Tín chỉ phải học lại', 'Chưa có dữ liệu'],
              ['Thời hạn học tập', 'Chưa công bố'],
            ].map(([label, value]) => (
              <div key={label} className="bg-canvas p-4 text-[0.8125rem]">
                <p className="text-xs text-muted">{label}</p>
                <p className="mt-2 font-medium">{value}</p>
              </div>
            ))}
          </div>
          <p className="my-4 text-sm text-muted">
            Kiểm tra tiến độ chương trình và liên hệ cố vấn học tập khi cần điều chỉnh kế hoạch học
            hoặc giải đáp kết quả xét học vụ.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              to={paths.courses}
              className="rounded-lg bg-subtle px-3 py-2 text-[0.8125rem] font-medium text-brand"
            >
              Xem khung chương trình
            </Link>
            <a
              href="mailto:daotao@dut.udn.vn"
              className="rounded-lg bg-action px-3 py-2 text-[0.8125rem] font-medium text-white"
            >
              Liên hệ phòng đào tạo
            </a>
          </div>
        </AcademicPanel>
      </div>
    </div>
  );
}
