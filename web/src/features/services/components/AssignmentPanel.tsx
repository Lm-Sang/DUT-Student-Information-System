import { useState } from 'react';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { Dialog } from '@/shared/ui/Dialog';
import { closedStatuses, getRequestType, isOverdue, staffMembers } from '../data/requestCatalog';
import type { RequestController } from '../hooks/useRequests';
import type { StudentRequest } from '../types/requests';

export function AssignmentPanel({
  request: r,
  controller: c,
  onDirty,
  onSaved,
  stale,
}: {
  request: StudentRequest;
  controller: RequestController;
  onDirty: () => void;
  onSaved: () => void;
  stale: boolean;
}) {
  const [assignee, setAssignee] = useState(r.assigneeId ?? '');
  const [due, setDue] = useState(r.dueDate ?? '');
  const [priority, setPriority] = useState(r.priority);
  const [note, setNote] = useState('');
  const [confirm, setConfirm] = useState(false);
  const eligible = staffMembers.filter((s) => s.department === getRequestType(r.typeId).department);
  const selected = eligible.find((s) => s.id === assignee);
  const current = staffMembers.find((s) => s.id === r.assigneeId);
  return (
    <Card className="request-action-panel">
      <p className="text-xs font-medium text-brand">ĐIỀU PHỐI HỒ SƠ</p>
      <h3 className="mt-1 text-lg font-semibold">
        {r.assigneeId ? 'Điều chỉnh phân công' : 'Phân công chuyên viên'}
      </h3>
      <p className="mt-2 text-xs text-muted">
        Chọn chuyên viên của {getRequestType(r.typeId).department}. Admin theo dõi và điều phối;
        chuyên viên thực hiện các bước nghiệp vụ.
      </p>
      <form
        className="mt-4 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          setConfirm(true);
        }}
      >
        <label className="request-field">
          Chuyên viên phụ trách
          <select
            required
            value={assignee}
            onChange={(e) => {
              onDirty();
              setAssignee(e.target.value);
            }}
          >
            <option value="">Chọn chuyên viên</option>
            {eligible.map((s) => {
              const active = c.requests.filter(
                (r) => r.assigneeId === s.id && !closedStatuses.includes(r.status),
              );
              return (
                <option value={s.id} key={s.id}>
                  {s.username} · {s.name} · {active.length} đang xử lý ·{' '}
                  {active.filter((r) => isOverdue(r)).length} quá hạn
                </option>
              );
            })}
          </select>
        </label>
        <label className="request-field">
          Hạn xử lý
          <input
            required
            type="date"
            min={new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' })}
            value={due}
            onChange={(e) => {
              onDirty();
              setDue(e.target.value);
            }}
          />
        </label>
        <label className="request-field">
          Mức ưu tiên
          <select
            value={priority}
            onChange={(e) => {
              onDirty();
              setPriority(e.target.value as StudentRequest['priority']);
            }}
          >
            <option value="normal">Bình thường</option>
            <option value="urgent">Ưu tiên cao</option>
          </select>
        </label>
        <label className="request-field">
          Nội dung phân công
          <textarea
            required
            rows={3}
            maxLength={2000}
            value={note}
            onChange={(e) => {
              onDirty();
              setNote(e.target.value);
            }}
          />
          <span className="text-xs text-muted">
            Lý do điều phối chỉ xuất hiện trong nhật ký nội bộ.
          </span>
        </label>
        <Button type="submit" className="w-full" disabled={c.busy || stale}>
          Lưu phân công
        </Button>
      </form>
      {confirm && (
        <Dialog
          title="Xác nhận phân công"
          onClose={() => {
            if (!c.busy) setConfirm(false);
          }}
        >
          <dl className="request-data">
            <div>
              <dt>Chuyên viên</dt>
              <dd>
                {current?.name ?? 'Chưa phân công'} → {selected?.name}
              </dd>
            </div>
            <div>
              <dt>Hạn xử lý</dt>
              <dd>
                {r.dueDate ?? 'Chưa có'} → {due}
              </dd>
            </div>
            <div>
              <dt>Ưu tiên</dt>
              <dd>{priority === 'urgent' ? 'Ưu tiên cao' : 'Bình thường'}</dd>
            </div>
          </dl>
          <p className="my-4 whitespace-pre-wrap">{note}</p>
          {c.error && (
            <p role="alert" className="text-danger">
              {c.error}
            </p>
          )}
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="secondary" disabled={c.busy} onClick={() => setConfirm(false)}>
              Kiểm tra lại
            </Button>
            <Button
              disabled={c.busy || stale}
              onClick={async () => {
                if (await c.assign(r, assignee, due, priority, note)) {
                  setConfirm(false);
                  onSaved();
                }
              }}
            >
              Xác nhận phân công
            </Button>
          </div>
        </Dialog>
      )}
    </Card>
  );
}
