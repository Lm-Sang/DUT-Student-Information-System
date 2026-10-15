import { useSearchParams } from 'react-router-dom';
import { PageHeading } from '@/shared/ui/PageHeading';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import {
  categories,
  closedStatuses,
  getRequestType,
  isOverdue,
  staffMembers,
  statusLabels,
  requestTypes,
} from '../data/requestCatalog';
import { inQueue, queueLabels, requestState, type RequestQueue } from '../data/requestState';
import { dateTime } from '../data/requestFormatting';
import { useRequests } from '../hooks/useRequests';
import { useRequestWorkspace } from '../hooks/useRequestWorkspace';
import { RequestDetail } from '../components/RequestDetail';
import { RequestTable } from '../components/RequestUi';
import { DemoDataPanel } from '../components/DemoDataPanel';

export function StaffRequestsPage() {
  const c = useRequests();
  const w = useRequestWorkspace(c.requests);
  const [params, setParams] = useSearchParams();
  const admin = c.user?.role === 'admin';
  const selected = c.requests.find((r) => r.id === params.get('id'));
  const metrics: [RequestQueue, string][] = admin
    ? [
        ['all', 'Tổng hồ sơ'],
        ['unassigned', 'Chưa phân công'],
        ['active', 'Đang giải quyết'],
        ['supplement', 'Chờ bổ sung'],
        ['overdue', 'Quá hạn'],
        ['completed', 'Hoàn tất'],
      ]
    : [
        ['all', 'Được phân công'],
        ['actionable', 'Cần xử lý'],
        ['supplement', 'Chờ bổ sung'],
        ['near', 'Sắp đến hạn'],
        ['overdue', 'Quá hạn'],
        ['completed', 'Hoàn tất'],
      ];
  const open = (id: string) => {
    setParams({ id });
    window.scrollTo({ top: 0 });
  };
  const count = (queue: RequestQueue) => c.requests.filter((r) => inQueue(r, queue)).length;
  return (
    <div className="request-workspace space-y-5">
      {!selected && (
        <PageHeading
          title={admin ? 'Điều phối hồ sơ sinh viên' : 'Bàn làm việc chuyên viên'}
          description={
            admin
              ? 'Phân công đúng đơn vị, theo dõi khối lượng và xử lý các hồ sơ cần can thiệp.'
              : 'Ưu tiên công việc đến hạn, kiểm tra hồ sơ và phản hồi cho sinh viên.'
          }
        />
      )}
      <p className="request-demo">
        Bản trải nghiệm · Dữ liệu lưu trong trình duyệt, chưa kết nối hệ thống nghiệp vụ của Trường.
      </p>
      {c.feedback && (
        <p role="status" className="rounded-lg bg-success-soft p-3 text-success">
          {c.feedback}
        </p>
      )}
      {c.error && (
        <div role="alert" className="rounded-lg bg-danger-soft p-3 text-danger">
          {c.error}
          <Button variant="ghost" onClick={() => c.reload()}>
            Tải lại danh sách
          </Button>
        </div>
      )}
      {selected ? (
        <RequestDetail
          key={selected.id}
          request={selected}
          controller={c}
          onClose={() => setParams({})}
        />
      ) : (
        <>
          {params.get('id') && !c.loading && (
            <p role="alert" className="text-danger">
              Không tìm thấy hồ sơ hoặc bạn không có quyền truy cập.
            </p>
          )}
          <section aria-label="Tổng quan hồ sơ" className="request-kpis">
            {metrics.map(([key, label]) => (
              <button
                key={key}
                aria-pressed={w.queue === key}
                onClick={() => {
                  w.setQueue(key);
                  document.getElementById('work-queue')?.scrollIntoView({ block: 'start' });
                }}
              >
                <span>{label}</span>
                <strong>{c.loading ? '—' : count(key)}</strong>
                <small>Xem danh sách →</small>
              </button>
            ))}
          </section>
          <div className="request-dashboard-grid">
            <Card>
              <div className="mb-4 flex items-center justify-between gap-2">
                <h2 className="font-semibold">
                  {admin ? 'Hồ sơ cần can thiệp' : 'Ưu tiên hôm nay'}
                </h2>
                <span className="text-xs text-muted">Quá hạn · ưu tiên cao</span>
              </div>
              <ul className="request-attention-list">
                {w.attention.map((r) => (
                  <li key={r.id}>
                    <div>
                      <button
                        className="text-left font-medium text-brand hover:underline"
                        onClick={() => open(r.id)}
                      >
                        {r.id}
                      </button>
                      <p className="mt-1 text-xs">{getRequestType(r.typeId).name}</p>
                      <p className="mt-1 text-xs text-muted">
                        {r.student.fullName} · {requestState(r).waitingOn}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs ${isOverdue(r) ? 'text-danger' : 'text-muted'}`}>
                        {isOverdue(r)
                          ? 'Quá hạn'
                          : !r.assigneeId
                            ? 'Chưa phân công'
                            : 'Ưu tiên cao'}
                      </span>
                      <Button className="mt-2" variant="secondary" onClick={() => open(r.id)}>
                        {admin && !r.assigneeId ? 'Phân công' : 'Mở hồ sơ'}
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
              {!w.attention.length && (
                <p className="py-6 text-sm text-muted">
                  Chưa có hồ sơ cần can thiệp. Xem hàng đợi để tiếp tục công việc.
                </p>
              )}
            </Card>
            <Card>
              <h2 className="mb-4 font-semibold">
                {admin ? 'Khối lượng theo đơn vị' : 'Hoạt động gần đây'}
              </h2>
              {admin ? (
                <div className="space-y-5">
                  {['Đào tạo', 'Công tác sinh viên', 'Hỗ trợ CNTT'].map((department) => {
                    const all = c.requests.filter(
                      (r) => getRequestType(r.typeId).department === department,
                    );
                    const active = all.filter((r) => !closedStatuses.includes(r.status));
                    return (
                      <div key={department}>
                        <button
                          className="text-left font-medium text-brand hover:underline"
                          onClick={() => {
                            w.setDepartment(department);
                            w.setQueue('all');
                          }}
                        >
                          {department}
                        </button>
                        <div className="mt-2 flex flex-wrap justify-between gap-2 text-xs text-muted">
                          <span>
                            {active.length} đang mở / {all.length} tổng
                          </span>
                          <span>{active.filter((r) => isOverdue(r)).length} quá hạn</span>
                        </div>
                        <meter
                          className="request-workload-meter mt-2"
                          min={0}
                          max={Math.max(c.requests.length, 1)}
                          value={active.length}
                          aria-label={`Số hồ sơ đang mở của ${department}`}
                        >
                          {active.length}
                        </meter>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <ul className="request-recent-list">
                  {w.recent.map(({ event, request }) => (
                    <li key={event.id}>
                      <button
                        className="font-medium text-brand hover:underline"
                        onClick={() => open(request.id)}
                      >
                        {request.id}
                      </button>
                      <p className="mt-1 line-clamp-2 text-sm">{event.message}</p>
                      <p className="mt-1 text-xs text-muted">
                        {event.actor} · {dateTime(event.at)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
              {!admin && !w.recent.length && (
                <p className="text-sm text-muted">
                  Chưa có thao tác mới. Lịch sử sẽ xuất hiện sau lần xử lý đầu tiên; dữ liệu nhập
                  mẫu không được tính là công việc đã thực hiện.
                </p>
              )}
            </Card>
          </div>
          {admin && (
            <Card>
              <div className="mb-4 flex flex-wrap justify-between gap-2">
                <h2 className="font-semibold">Công việc của chuyên viên</h2>
                <p className="text-xs text-muted">
                  Số lượng hồ sơ thực tế · không phải điểm đánh giá hiệu suất
                </p>
              </div>
              <div
                className="overflow-x-auto"
                tabIndex={0}
                role="region"
                aria-label="Khối lượng chuyên viên"
              >
                <table className="academic-table min-w-[660px]">
                  <thead>
                    <tr>
                      <th>Chuyên viên / đơn vị</th>
                      <th>Đang mở</th>
                      <th>Chờ sinh viên</th>
                      <th>Quá hạn</th>
                      <th>Hoàn tất</th>
                      <th>Danh sách</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffMembers.map((s) => {
                      const own = c.requests.filter((r) => r.assigneeId === s.id);
                      return (
                        <tr key={s.id}>
                          <td>
                            <strong>{s.name}</strong>
                            <p className="text-xs text-muted">
                              {s.username} · {s.department}
                            </p>
                          </td>
                          <td>{own.filter((r) => !closedStatuses.includes(r.status)).length}</td>
                          <td>{own.filter((r) => r.status === 'supplement').length}</td>
                          <td className={own.some((r) => isOverdue(r)) ? 'text-danger' : ''}>
                            {own.filter((r) => isOverdue(r)).length}
                          </td>
                          <td>{own.filter((r) => r.status === 'completed').length}</td>
                          <td>
                            <Button
                              variant="ghost"
                              aria-pressed={w.owner === s.id}
                              onClick={() => {
                                w.setOwner(s.id);
                                w.setQueue('all');
                                document
                                  .getElementById('work-queue')
                                  ?.scrollIntoView({ block: 'start' });
                              }}
                            >
                              Xem công việc<span className="sr-only"> {s.name}</span>
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
          {admin && <DemoDataPanel controller={c} />}
          <Card id="work-queue">
            <div className="mb-4 flex flex-wrap justify-between gap-2">
              <h2 className="text-lg font-semibold">
                {admin ? 'Danh sách hồ sơ' : 'Hàng đợi công việc'}
              </h2>
              <span className="text-sm text-muted">
                {w.filtered.length} / {c.requests.length} hồ sơ
              </span>
            </div>
            <div className="request-queues mb-4" role="group" aria-label="Hàng đợi nhanh">
              {(Object.entries(queueLabels) as [RequestQueue, string][])
                .filter(([id]) => admin || id !== 'unassigned')
                .map(([id, label]) => (
                  <button key={id} aria-pressed={w.queue === id} onClick={() => w.setQueue(id)}>
                    {label}
                    <span>{count(id)}</span>
                  </button>
                ))}
            </div>
            <div className="request-filters mb-4">
              <label className="request-field">
                Tìm hồ sơ
                <input
                  type="search"
                  placeholder="Mã hồ sơ, MSSV, tên, thủ tục…"
                  value={w.query}
                  onChange={(e) => w.setQuery(e.target.value)}
                />
              </label>
              <label className="request-field">
                Nhóm thủ tục
                <select
                  value={w.category}
                  onChange={(e) => {
                    w.setCategory(e.target.value);
                    w.setTypeId('');
                  }}
                >
                  <option value="">Tất cả nhóm</option>
                  {categories.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label className="request-field">
                Loại đề nghị
                <select value={w.typeId} onChange={(e) => w.setTypeId(e.target.value)}>
                  <option value="">Tất cả loại đề nghị</option>
                  {requestTypes
                    .filter((t) => !w.category || t.category === w.category)
                    .map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                </select>
              </label>
              <label className="request-field">
                Trạng thái
                <select value={w.status} onChange={(e) => w.setStatus(e.target.value)}>
                  <option value="">Tất cả trạng thái</option>
                  {Object.entries(statusLabels).map(([id, label]) => (
                    <option key={id} value={id}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              {admin && (
                <>
                  <label className="request-field">
                    Đơn vị
                    <select value={w.department} onChange={(e) => w.setDepartment(e.target.value)}>
                      <option value="">Tất cả đơn vị</option>
                      {['Đào tạo', 'Công tác sinh viên', 'Hỗ trợ CNTT'].map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </label>
                  <label className="request-field">
                    Chuyên viên
                    <select value={w.owner} onChange={(e) => w.setOwner(e.target.value)}>
                      <option value="">Tất cả chuyên viên</option>
                      {staffMembers.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.username} · {s.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </>
              )}
              <label className="request-field">
                Sắp xếp
                <select value={w.sort} onChange={(e) => w.setSort(e.target.value)}>
                  <option value="due">Hạn xử lý gần nhất</option>
                  <option value="priority">Ưu tiên cao trước</option>
                  <option value="newest">Mới nộp trước</option>
                  <option value="updated">Cập nhật gần nhất</option>
                </select>
              </label>
            </div>
            <Button variant="ghost" className="mb-3" onClick={w.reset}>
              Xóa bộ lọc
            </Button>
            {c.loading ? (
              <p role="status">Đang tải hồ sơ…</p>
            ) : (
              <RequestTable requests={w.filtered} onOpen={open} />
            )}
          </Card>
        </>
      )}
    </div>
  );
}
