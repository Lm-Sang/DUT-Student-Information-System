import { useMemo, useState } from 'react';
import { usePortalEdition } from '@/shared/config/portalEdition';
import { useSearchParams } from 'react-router-dom';
import { SectionNav } from '@/shared/ui/SectionNav';
import { Disclosure } from '@/shared/ui/Disclosure';
import { PageHeading } from '@/shared/ui/PageHeading';
import { PaymentHistory } from '../components/PaymentHistory';
import { useTuition } from '../hooks/useTuition';
import { TuitionTable } from '../components/TuitionTable';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { Dialog } from '@/shared/ui/Dialog';
import { EmptyState, ErrorState, LoadingState } from '@/shared/ui/FeedbackStates';

const money = (amount: number) => `${new Intl.NumberFormat('vi-VN').format(amount)} đ`;

const courses = [
  { code: '1021883.2610.23.10', name: 'Chuyên đề CN CNPM', credits: 2 },
  { code: '1020413.2610.23.11', name: 'Kiểm thử phần mềm', credits: 2 },
  { code: '1021893.2610.23.11', name: 'Kiến trúc hướng dịch vụ (SOA)', credits: 2 },
  { code: '1023780.2610.23.11A', name: 'PBL 6: Dự án CN Công nghệ phần mềm', credits: 4 },
  { code: '1021803.2610.23.10', name: 'Thực tập Tốt nghiệp (CNPM)', credits: 2 },
];

function downloadCsv() {
  const rows = [
    ['Mã lớp HP', 'Tên lớp học phần', 'Số TC', 'Đơn giá/TC', 'Thành tiền'],
    ...courses.map((course) => [
      course.code,
      course.name,
      course.credits,
      900000,
      course.credits * 900000,
    ]),
  ];
  const blob = new Blob(['\uFEFF' + rows.map((row) => row.join(',')).join('\r\n')], {
    type: 'text/csv;charset=utf-8',
  });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'bang-ke-hoc-phi-2026-2027.csv';
  link.click();
  URL.revokeObjectURL(link.href);
}

export function TuitionPage() {
  const v2 = usePortalEdition() === 'v2';
  const [params] = useSearchParams();
  const view = ['courses', 'history'].includes(params.get('view') ?? '')
    ? params.get('view')!
    : 'overview';
  const state = useTuition();
  const [year, setYear] = useState('all');
  const [notice, setNotice] = useState<'payment' | 'defer' | null>(null);
  const [deferReason, setDeferReason] = useState('');
  const [deferSubmitted, setDeferSubmitted] = useState(false);
  const payments = useMemo(
    () => state.payments.filter((payment) => year === 'all' || payment.semester.includes(year)),
    [state.payments, year],
  );
  if (state.loading) return <LoadingState />;
  if (state.error) return <ErrorState message={state.error} onRetry={state.reload} />;
  if (!state.data) return <EmptyState message="Chưa có thông tin học phí." />;

  return (
    <div className="space-y-6 text-ink">
      <PageHeading title="Học phí" description="Học kỳ I, 2026–2027" />
      {v2 && (
        <div className="v2-fee-summary">
          <section className="v2-fee-balance">
            <p className="v2-caption">Học phí còn lại</p>
            <strong>{money(4320000)}</strong>
            <p className="v2-caption">Đợt 2 (40%) · Hạn nộp 15/11/2026</p>
            <Badge tone="warning">Chờ đóng đợt 2</Badge>
          </section>
          <Card>
            <div className="v2-fee-totals">
              <p>
                <span className="v2-caption">Tổng học phí</span>
                <strong>{money(10800000)}</strong>
              </p>
              <p>
                <span className="v2-caption">Đã nộp</span>
                <strong className="text-success">{money(6480000)}</strong>
              </p>
            </div>
            <progress value={60} max={100} aria-label="Đã thanh toán 60% học phí" />
            <p className="v2-caption text-success">Đã hoàn tất đợt 1 · 60% tổng học phí</p>
            <p className="v2-caption mt-3">
              Minh họa lịch thu qua VietinBank · Chưa kết nối đối soát ngân hàng
            </p>
          </Card>
        </div>
      )}
      <SectionNav
        label="Mục học phí"
        value={view}
        items={[
          { value: 'overview', label: 'Khoản phải nộp' },
          { value: 'courses', label: 'Theo học phần' },
          { value: 'history', label: 'Lịch sử & hóa đơn' },
        ]}
      />
      <div
        hidden={view !== 'overview'}
        className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-warning-soft p-5 text-sm"
      >
        <div className="flex items-start gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-md bg-warning-soft text-lg text-warning">
            ⚠
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2 font-semibold text-warning">
              <span>Hạn nộp đợt 1: 18/09/2026</span>
            </div>
            <p className="mt-1 text-xs leading-5">
              Quá hạn sẽ khóa bổ sung học phần và ảnh hưởng điều kiện xét thi.
            </p>
          </div>
        </div>
        <button
          type="button"
          className="shrink-0 font-semibold text-warning hover:underline"
          onClick={() => setNotice('payment')}
        >
          Nộp ngay đợt 1 →
        </button>
      </div>

      <Card id="tuition-courses" hidden={view !== 'courses'} className="!p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-5">
          <div>
            <h2 className="text-[1.0625rem] font-semibold">Học phí theo học phần</h2>
            <p className="mt-1 text-xs text-muted">
              Dữ liệu tính theo số tín chỉ chính thức đợt 1 HK1 (2026 - 2027)
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              className="!min-h-8 !bg-subtle !px-3 !py-1 !text-xs"
              onClick={() => window.print()}
            >
              ⊙ In bảng kê
            </Button>
            <Button
              variant="secondary"
              className="!min-h-8 !bg-subtle !px-3 !py-1 !text-xs"
              onClick={downloadCsv}
            >
              ↧ Xuất Excel
            </Button>
          </div>
        </div>
        <TuitionTable label="Chi tiết học phí học phần đăng ký" minWidth={1000}>
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã lớp HP</th>
              <th>Tên lớp học phần</th>
              <th>Số TC</th>
              <th>Đơn giá/TC</th>
              <th>Thành tiền</th>
              <th>Miễn giảm</th>
              <th>Phải nộp</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course, index) => (
              <tr key={course.code}>
                <td>{index + 1}</td>
                <td className="whitespace-nowrap font-medium text-brand">{course.code}</td>
                <td className="font-medium">{course.name}</td>
                <td className="text-center">{course.credits}</td>
                <td className="whitespace-nowrap">{money(900000)}</td>
                <td className="whitespace-nowrap font-medium">{money(course.credits * 900000)}</td>
                <td>–</td>
                <td className="whitespace-nowrap font-semibold">
                  {money(course.credits * 900000)}
                </td>
                <td>
                  <Badge>Đã nộp Đợt 1</Badge>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-subtle font-bold">
              <td colSpan={3} className="px-4 py-4 text-right">
                TỔNG CỘNG ĐĂNG KÝ:
              </td>
              <td className="px-4">12 TC</td>
              <td className="px-4" />
              <td className="px-4">{money(10800000)}</td>
              <td className="px-4">0 đ</td>
              <td className="px-4 text-brand-deep">{money(10800000)}</td>
              <td className="px-4 text-xs font-normal">Quy đổi 100%</td>
            </tr>
          </tfoot>
        </TuitionTable>
      </Card>

      <Card id="tuition-overview" hidden={view !== 'overview'} className="!p-0">
        <div className="flex flex-wrap items-start justify-between gap-3 px-5 py-5">
          <div>
            <h2 className="text-[1.0625rem] font-semibold">Các đợt thu</h2>
          </div>
        </div>
        <TuitionTable label="Bảng học phí sinh viên cần nộp" minWidth={950}>
          <thead>
            <tr>
              <th>STT</th>
              <th>Học kỳ</th>
              <th>Số tiền cần nộp</th>
              <th>Số tiền đã nộp qua NH</th>
              <th>Thời gian nộp</th>
              <th>Mã giao dịch</th>
              <th>Ghi chú / Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td className="font-medium">
                Học kỳ 1 năm học 2026 - 2027{' '}
                <span className="block text-xs font-normal text-muted">Đợt 1 (Tỷ lệ 60%)</span>
              </td>
              <td className="font-semibold">{money(6480000)}</td>
              <td className="font-semibold text-brand-deep">{money(6480000)}</td>
              <td>
                10/09/2026 <span className="block text-xs">09:42:15</span>
              </td>
              <td className="text-brand-deep">
                DUT-PAY-20260910-0982{' '}
                <span className="block text-xs text-muted">VietinBank iPay</span>
              </td>
              <td>
                <Badge>Đã hoàn tất đợt 1</Badge>
                <span className="block pt-1 text-xs">Có hóa đơn e-Invoice</span>
              </td>
            </tr>
            <tr>
              <td>2</td>
              <td className="font-medium">
                Học kỳ 1 năm học 2026 - 2027{' '}
                <span className="block text-xs font-normal text-muted">Đợt 2 (Tỷ lệ 40%)</span>
              </td>
              <td className="font-semibold">{money(4320000)}</td>
              <td className="text-muted">—</td>
              <td className="text-danger">
                Chưa thanh toán{' '}
                <span className="block text-xs text-muted">Hạn chót: 15/11/2026</span>
              </td>
              <td>—</td>
              <td>
                <Badge tone="warning">Chờ đóng đợt 2</Badge>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="bg-subtle font-bold">
              <td colSpan={2} className="px-4 py-4 text-right">
                TỔNG CỘNG:
              </td>
              <td className="px-4">{money(10800000)}</td>
              <td className="px-4 text-brand-deep">{money(6480000)}</td>
              <td colSpan={3} />
            </tr>
          </tfoot>
        </TuitionTable>
      </Card>

      <Card id="tuition-history" hidden={view !== 'history'}>
        <h2 className="text-[1.0625rem] font-semibold">Lịch sử thanh toán</h2>

        <div className="my-5 flex flex-wrap gap-3">
          <label className="sr-only" htmlFor="tuition-year">
            Năm học
          </label>
          <select
            id="tuition-year"
            value={year}
            onChange={(event) => setYear(event.target.value)}
            className="!bg-subtle text-brand"
          >
            <option value="all">Tất cả năm học</option>
            <option value="2026–2027">2026–2027</option>
            <option value="2025–2026">2025–2026</option>
          </select>
          <label className="sr-only" htmlFor="tuition-status">
            Trạng thái
          </label>
          <select
            id="tuition-status"
            value={state.status}
            onChange={(event) =>
              state.setStatus(event.target.value as 'all' | 'Paid' | 'Pending' | 'Overdue')
            }
            className="!bg-subtle text-brand"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="Paid">Đã thanh toán</option>
            <option value="Pending">Chưa thanh toán</option>
            <option value="Overdue">Quá hạn</option>
          </select>
          <label className="sr-only" htmlFor="tuition-search">
            Tìm kiếm
          </label>
          <input
            id="tuition-search"
            type="search"
            value={state.query}
            onChange={(event) => state.setQuery(event.target.value)}
            placeholder="Tìm theo mã giao dịch hoặc hóa đơn"
            className="min-w-0 flex-1 !bg-canvas sm:max-w-[400px]"
          />
        </div>
        <PaymentHistory payments={payments} />
        <p className="mt-3 text-xs text-muted">
          Hiển thị {payments.length} giao dịch • Đơn vị: VND
        </p>
      </Card>

      <Disclosure title="Quy định & hỗ trợ học phí">
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted">
          <li>
            Sinh viên chưa hoàn tất học phí đợt 1 sẽ bị tạm dừng quyền đăng ký tín chỉ bổ sung.
          </li>
          <li>
            Nợ học phí quá hạn đợt 2 sẽ không có tên trong danh sách thi kết thúc học phần chính
            thức.
          </li>
          <li>
            Hóa đơn VAT điện tử sẽ được cấp trong vòng 7 ngày làm việc sau khi giao dịch đối soát
            thành công.
          </li>
          <li>
            Sinh viên có hoàn cảnh khó khăn có thể nộp đơn đề nghị hoãn nộp học phí trực tuyến trước
            ngày 18/09/2026.
          </li>
        </ul>
        <Button
          variant="secondary"
          className="mt-4 w-full !bg-subtle !text-xs"
          onClick={() => setNotice('defer')}
        >
          Đề nghị hoãn nộp học phí
        </Button>
      </Disclosure>

      {notice && (
        <Dialog
          title={notice === 'payment' ? 'Hướng dẫn nộp học phí' : 'Đơn hoãn nộp học phí'}
          onClose={() => setNotice(null)}
        >
          {notice === 'payment' ? (
            <p className="mt-3 text-sm leading-6 text-muted">
              Số tiền đợt 1: <strong className="text-ink">{money(6480000)}</strong>. Vui lòng sử
              dụng kênh thanh toán được nhà trường công bố và đối chiếu mã giao dịch tại bảng lịch
              sử sau khi hoàn tất.
            </p>
          ) : (
            <form
              className="mt-4 space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                setDeferSubmitted(true);
              }}
            >
              <label className="block text-sm font-medium">
                Lý do đề nghị
                <textarea
                  required
                  value={deferReason}
                  onChange={(event) => setDeferReason(event.target.value)}
                  className="mt-2 min-h-28 w-full rounded-lg border border-line p-3"
                  placeholder="Trình bày hoàn cảnh và thời gian dự kiến nộp"
                />
              </label>
              {deferSubmitted && (
                <p role="status" className="text-sm text-success">
                  Đã lưu bản nháp đơn đề nghị trên trình duyệt.
                </p>
              )}
              <Button type="submit">Lưu bản nháp</Button>
            </form>
          )}
          <Button variant="secondary" className="mt-4" onClick={() => setNotice(null)}>
            Đóng
          </Button>
        </Dialog>
      )}
    </div>
  );
}
