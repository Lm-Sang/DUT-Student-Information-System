import { useState } from 'react';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { Dialog } from '@/shared/ui/Dialog';
import { getRequestFields, getRequestType, staffMembers } from '../data/requestCatalog';
import { deliveryLabels, evidenceLabels, submissionLabels } from '../data/procedurePolicy';
import { dateTime } from '../data/requestFormatting';
import { requestState } from '../data/requestState';
import type { RequestController } from '../hooks/useRequests';
import type { ReviewData, StudentRequest } from '../types/requests';
import { AttachmentList, StatusBadge } from './RequestUi';
import { RequestTimeline, RequestTracking } from './RequestTracking';
import { ProcessingPanel } from './ProcessingPanel';
import { reviewLabels } from '../data/reviewLabels';
import { AssignmentPanel } from './AssignmentPanel';
import { StudentRequestActions } from './StudentRequestActions';

export function RequestDetail({
  request,
  controller: c,
  onClose,
}: {
  request: StudentRequest;
  controller: RequestController;
  onClose: () => void;
}) {
  const [snapshot, setSnapshot] = useState(request);
  const [editing, setEditing] = useState(false);
  const [discard, setDiscard] = useState<'reload' | 'close' | undefined>();
  const [tab, setTab] = useState('details');
  const r = editing ? snapshot : request;
  const stale = editing && request.revision !== snapshot.revision;
  const type = getRequestType(r.typeId);
  const state = requestState(r);
  const student = c.user?.role === 'student';
  const admin = c.user?.role === 'admin';
  const onDirty = () => {
    if (!editing) {
      setSnapshot(request);
      setEditing(true);
    }
  };
  const onSaved = () => setEditing(false);
  const actionProps = { request: r, controller: c, onDirty, onSaved, stale };
  return (
    <div className="space-y-5">
      <Button
        variant="ghost"
        onClick={() => {
          if (editing) setDiscard('close');
          else onClose();
        }}
      >
        ← Quay lại danh sách
      </Button>
      {!state.closed && (!student || ['submitted', 'supplement'].includes(r.status)) && (
        <Button
          variant="secondary"
          className="request-jump-action"
          onClick={() => {
            const panel = document.getElementById('case-actions');
            panel?.scrollIntoView({ block: 'start' });
            panel?.focus({ preventScroll: true });
          }}
        >
          {student
            ? r.status === 'supplement'
              ? 'Đi tới bổ sung hồ sơ'
              : 'Thao tác với hồ sơ'
            : admin
              ? 'Đi tới phân công'
              : 'Đi tới xử lý hồ sơ'}
        </Button>
      )}
      {stale && (
        <div role="alert" className="request-conflict">
          <strong>Hồ sơ đã được cập nhật ở tab khác.</strong>
          <p className="mt-1">
            Bản đang nhập được giữ lại. Tải phiên bản mới trước khi lưu tiếp để tránh ghi đè.
          </p>
          <Button variant="secondary" className="mt-3" onClick={() => setDiscard('reload')}>
            Tải phiên bản mới
          </Button>
        </div>
      )}
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="mb-1 text-sm font-medium text-brand">
              {r.id}
              {r.demo ? ' · Dữ liệu mẫu' : ''}
            </p>
            {student ? (
              <h2 className="text-xl font-semibold">{type.name}</h2>
            ) : (
              <h1 className="text-xl font-semibold">{type.name}</h1>
            )}
            <p className="mt-2 text-muted">
              {r.student.fullName} · {r.student.studentId} · {r.student.className}
            </p>
          </div>
          <StatusBadge status={r.status} />
        </div>
        <div className="request-summary mt-5">
          <p>
            <span>Đơn vị / chuyên viên</span>
            <strong>{type.department}</strong>
            <strong>
              {staffMembers.find((s) => s.id === r.assigneeId)?.name ?? 'Chờ phân công'}
            </strong>
          </p>
          <p>
            <span>Hạn xử lý</span>
            <strong>{r.dueDate?.split('-').reverse().join('/') ?? 'Chờ đơn vị xác nhận'}</strong>
          </p>
          <p>
            <span>Ngày nộp</span>
            <strong>{dateTime(r.createdAt)}</strong>
          </p>
          <p>
            <span>Trả kết quả</span>
            <strong>{state.delivery}</strong>
          </p>
        </div>
        <RequestTracking request={r} />
      </Card>
      <div className={`request-detail-grid ${student ? 'request-detail-student' : ''}`}>
        <div className="min-w-0 space-y-5">
          <Card>
            <div className="request-local-tabs" role="tablist" aria-label="Nội dung hồ sơ">
              {[
                ['details', 'Hồ sơ & minh chứng'],
                ['result', 'Kết quả'],
                ['history', 'Nhật ký xử lý'],
              ].map(([id, label]) => (
                <button
                  key={id}
                  id={`case-tab-${id}`}
                  role="tab"
                  aria-selected={tab === id}
                  aria-controls={`case-panel-${id}`}
                  tabIndex={tab === id ? 0 : -1}
                  onKeyDown={(e) => {
                    const ids = ['details', 'result', 'history'];
                    if (['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) {
                      e.preventDefault();
                      const next =
                        e.key === 'Home'
                          ? 'details'
                          : e.key === 'End'
                            ? 'history'
                            : ids[(ids.indexOf(tab) + (e.key === 'ArrowRight' ? 1 : 2)) % 3];
                      setTab(next);
                      document.getElementById(`case-tab-${next}`)?.focus();
                    }
                  }}
                  onClick={() => setTab(id)}
                >
                  {label}
                </button>
              ))}
            </div>
            <section
              id="case-panel-details"
              role="tabpanel"
              aria-labelledby="case-tab-details"
              hidden={tab !== 'details'}
              className="mt-5 space-y-5"
            >
              <h3 className="font-semibold">Thông tin đề nghị</h3>
              <dl className="request-data">
                {getRequestFields(r.typeId, r.fields).map((f) => (
                  <div key={f.key}>
                    <dt>{f.label}</dt>
                    <dd>{r.fields[f.key] || 'Chưa cung cấp'}</dd>
                  </div>
                ))}
                {r.note && (
                  <div>
                    <dt>Ghi chú sinh viên</dt>
                    <dd>{r.note}</dd>
                  </div>
                )}
              </dl>
              <h3 className="font-semibold">Minh chứng đã nộp</h3>
              <AttachmentList files={r.attachments.filter((f) => f.purpose === 'evidence')} />
              <details>
                <summary className="min-h-11 cursor-pointer font-medium text-brand">
                  Hướng dẫn và kênh thực hiện
                </summary>
                <p className="request-policy my-3">{type.policyNote}</p>
                <dl className="request-data">
                  <div>
                    <dt>Kênh nộp</dt>
                    <dd>{submissionLabels[type.submissionMode]}</dd>
                  </div>
                  <div>
                    <dt>Minh chứng</dt>
                    <dd>{evidenceLabels[type.evidenceMode]}</dd>
                  </div>
                  <div>
                    <dt>Trả kết quả</dt>
                    <dd>{deliveryLabels[type.resultDeliveryMode]}</dd>
                  </div>
                </dl>
                <p className="mt-3 text-xs text-muted">{type.source}</p>
              </details>
              {!student && (
                <details>
                  <summary className="min-h-11 cursor-pointer font-medium text-brand">
                    Phiếu xử lý đã lưu · nội bộ
                  </summary>
                  <dl className="request-data mt-3">
                    {Object.entries(r.review)
                      .filter(([, v]) => v !== undefined && v !== '')
                      .map(([key, value]) => (
                        <div key={key}>
                          <dt>{reviewLabels[key as keyof ReviewData] ?? key}</dt>
                          <dd>
                            {typeof value === 'boolean'
                              ? value
                                ? 'Đã xác nhận'
                                : 'Chưa xác nhận'
                              : value}
                          </dd>
                        </div>
                      ))}
                  </dl>
                </details>
              )}
            </section>
            <section
              id="case-panel-result"
              role="tabpanel"
              aria-labelledby="case-tab-result"
              hidden={tab !== 'result'}
              className="mt-5 space-y-4"
            >
              <h3 className="font-semibold">Kết quả giải quyết</h3>
              <p className="whitespace-pre-wrap">
                {r.result ||
                  'Chưa có kết quả phát hành. Theo dõi phản hồi của chuyên viên trong nhật ký.'}
              </p>
              {!student && !['ready', 'completed'].includes(r.status) && (
                <p className="request-policy">
                  Các tệp và nội dung dưới đây đang ở bản nháp, chưa hiển thị cho sinh viên.
                </p>
              )}
              {r.review.deliveryMode === 'pickup' && (
                <dl className="request-data">
                  <div>
                    <dt>Địa điểm nhận</dt>
                    <dd>{r.review.pickupLocation}</dd>
                  </div>
                  <div>
                    <dt>Thời gian nhận</dt>
                    <dd>{r.review.pickupTime}</dd>
                  </div>
                  <div>
                    <dt>Cần mang theo</dt>
                    <dd>{r.review.pickupInstructions}</dd>
                  </div>
                </dl>
              )}
              {r.review.announcementUrl && /^https:\/\//.test(r.review.announcementUrl) && (
                <a
                  className="text-brand underline"
                  href={r.review.announcementUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Xem thông báo kết quả
                </a>
              )}
              <AttachmentList files={r.attachments.filter((f) => f.purpose === 'result')} />
              <p className="text-xs text-muted">
                Bản scan / tệp tham khảo không thay thế bản gốc đã ký, đóng dấu. Thực hiện theo
                hướng dẫn nhận kết quả của đơn vị.
              </p>
            </section>
            <section
              id="case-panel-history"
              role="tabpanel"
              aria-labelledby="case-tab-history"
              hidden={tab !== 'history'}
              className="mt-5"
            >
              <h3 className="mb-5 font-semibold">Lịch sử thực hiện</h3>
              <RequestTimeline request={r} />
            </section>
          </Card>
        </div>
        <aside
          id="case-actions"
          tabIndex={-1}
          className="min-w-0 space-y-5"
          aria-label={student ? 'Thao tác sinh viên' : admin ? 'Phân công hồ sơ' : 'Xử lý hồ sơ'}
        >
          {student ? (
            <StudentRequestActions key={r.revision} {...actionProps} />
          ) : !state.closed ? (
            admin ? (
              <AssignmentPanel key={r.revision} {...actionProps} />
            ) : (
              <ProcessingPanel key={r.revision} {...actionProps} />
            )
          ) : (
            <Card>
              <h3 className="font-semibold">Hồ sơ đã kết thúc</h3>
              <p className="mt-3 text-sm text-muted">
                Xem kết quả và nhật ký để đối chiếu. Không thể tiếp tục chuyển bước hoặc phân công.
              </p>
            </Card>
          )}
          {student && (
            <Card>
              <h3 className="font-semibold">Hướng dẫn theo dõi</h3>
              <p className="mt-3 text-sm">
                {r.status === 'supplement'
                  ? 'Bổ sung đúng nội dung được yêu cầu để chuyên viên tiếp tục kiểm tra.'
                  : r.status === 'ready'
                    ? 'Mở mục Kết quả để xem địa điểm, thời gian và giấy tờ cần mang theo.'
                    : state.action}
              </p>
              <p className="mt-3 text-xs text-muted">{type.guidance}</p>
            </Card>
          )}
        </aside>
      </div>
      {discard && (
        <Dialog title="Bỏ nội dung chưa lưu?" onClose={() => setDiscard(undefined)}>
          <p>
            Nội dung đang nhập chưa được lưu.{' '}
            {discard === 'reload'
              ? 'Tải phiên bản mới sẽ thay thế bản đang xem.'
              : 'Quay lại danh sách sẽ bỏ bản nháp xử lý này.'}
          </p>
          <div className="mt-5 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setDiscard(undefined)}>
              Tiếp tục nhập
            </Button>
            <Button
              onClick={() => {
                setEditing(false);
                if (discard === 'close') onClose();
                setDiscard(undefined);
              }}
            >
              Bỏ nháp và tiếp tục
            </Button>
          </div>
        </Dialog>
      )}
    </div>
  );
}
