import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeading } from '@/shared/ui/PageHeading';
import { SectionNav } from '@/shared/ui/SectionNav';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { CreateRequestForm } from '../components/CreateRequestForm';
import { EquipmentReports } from '../components/EquipmentReports';
import { RequestDetail } from '../components/RequestDetail';
import { RequestTable } from '../components/RequestUi';
import { useRequests } from '../hooks/useRequests';
import { getRequestType, statusLabels } from '../data/requestCatalog';

export function ServiceRequestsPage() {
  const c = useRequests();
  const [params, setParams] = useSearchParams();
  const view = ['history', 'equipment'].includes(params.get('view') ?? '')
    ? params.get('view')!
    : 'create';
  const [status, setStatus] = useState('');
  const [query, setQuery] = useState('');
  const selected = c.requests.find((r) => r.id === params.get('id'));
  return (
    <div className="request-workspace space-y-5">
      <PageHeading
        title="Dịch vụ sinh viên"
        description="Nộp hồ sơ và theo dõi tiến độ giải quyết tại một nơi."
      />
      <p className="request-demo">
        Bản trải nghiệm: hồ sơ và tệp được lưu trong trình duyệt này, chưa gửi đến hệ thống của
        Trường.
      </p>
      {view !== 'equipment' && c.feedback && (
        <p role="status" className="rounded-lg bg-success-soft p-3 text-success">
          {c.feedback}
        </p>
      )}
      {c.error && (
        <div role="alert" className="rounded-lg bg-danger-soft p-3 text-danger">
          {c.error}{' '}
          <Button variant="ghost" onClick={() => c.reload()}>
            Tải lại
          </Button>
        </div>
      )}
      <SectionNav
        label="Mục dịch vụ"
        value={view}
        items={[
          { value: 'create', label: 'Lập đơn' },
          { value: 'history', label: 'Theo dõi đơn' },
          { value: 'equipment', label: 'Báo thiết bị' },
        ]}
      />
      <div hidden={view !== 'create'}>
        <CreateRequestForm controller={c} onCreated={() => setParams({ view: 'history' })} />
      </div>
      <div hidden={view !== 'history'} id="request-history">
        {selected ? (
          <RequestDetail
            key={selected.id}
            request={selected}
            controller={c}
            onClose={() => setParams({ view: 'history' })}
          />
        ) : (
          <Card>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">Đơn đã lập</h2>
                <p className="mt-1 text-muted">
                  Tổng số: <strong>{String(c.requests.length).padStart(2, '0')} đơn</strong>
                </p>
              </div>
              <label className="request-field">
                Tìm đơn đã nộp
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Mã hồ sơ hoặc tên thủ tục…"
                />
              </label>
              <label className="request-field">
                Lọc trạng thái
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="">Tất cả trạng thái</option>
                  {Object.entries(statusLabels).map(([key, name]) => (
                    <option key={key} value={key}>
                      {name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            {params.get('id') && !c.loading && (
              <p role="alert" className="mb-4 text-danger">
                Không tìm thấy hồ sơ hoặc bạn không có quyền truy cập.
              </p>
            )}
            {c.loading ? (
              <p role="status">Đang tải hồ sơ…</p>
            ) : (
              <RequestTable
                student
                requests={c.requests.filter(
                  (r) =>
                    (!status || r.status === status) &&
                    `${r.id} ${getRequestType(r.typeId).name}`
                      .toLocaleLowerCase('vi')
                      .includes(query.toLocaleLowerCase('vi')),
                )}
                onOpen={(id) => setParams({ view: 'history', id })}
              />
            )}
          </Card>
        )}
      </div>
      <div hidden={view !== 'equipment'}>
        <EquipmentReports />
      </div>
    </div>
  );
}
