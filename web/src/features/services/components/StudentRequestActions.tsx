import { useState } from 'react';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Dialog } from '@/shared/ui/Dialog';
import type { RequestController } from '../hooks/useRequests';
import type { StudentRequest } from '../types/requests';
import { FilePicker } from './RequestUi';

export function StudentRequestActions({
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
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [confirm, setConfirm] = useState(false);
  const supplement = r.status === 'supplement';
  if (!supplement && r.status !== 'submitted') return null;
  return (
    <Card>
      <h3 className="text-lg font-semibold">
        {supplement ? 'Bổ sung hồ sơ' : 'Hủy hồ sơ chưa tiếp nhận'}
      </h3>
      {supplement && (
        <p className="request-policy mt-3 whitespace-pre-wrap">
          {r.supplementMessage ?? 'Xem yêu cầu bổ sung trong lịch sử.'}
        </p>
      )}
      <form
        className="mt-4 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          setConfirm(true);
        }}
      >
        <label className="request-field">
          {supplement ? 'Nội dung bổ sung' : 'Lý do hủy'}
          <textarea
            required
            rows={3}
            maxLength={3000}
            value={message}
            onChange={(e) => {
              onDirty();
              setMessage(e.target.value);
            }}
          />
        </label>
        {supplement && (
          <FilePicker
            id="supplement-files"
            files={files}
            onChange={(files) => {
              onDirty();
              setFiles(files);
            }}
          />
        )}
        <p className="text-xs text-muted">
          {supplement
            ? 'Tệp bổ sung được lưu thêm; các minh chứng đã nộp được giữ lại.'
            : 'Có thể hủy khi chưa tiếp nhận. Hồ sơ và lịch sử vẫn được lưu để đối chiếu.'}
        </p>
        <Button type="submit" disabled={c.busy || stale}>
          {supplement ? 'Gửi bổ sung' : 'Hủy hồ sơ'}
        </Button>
      </form>
      {confirm && (
        <Dialog
          title={supplement ? 'Xác nhận gửi bổ sung' : 'Xác nhận hủy hồ sơ'}
          onClose={() => {
            if (!c.busy) setConfirm(false);
          }}
        >
          <p className="whitespace-pre-wrap">{message}</p>
          {supplement && (
            <p className="mt-3 text-muted">
              {files.length} tệp bổ sung: {files.map((f) => f.name).join(', ')}
            </p>
          )}
          {c.error && (
            <p role="alert" className="text-danger">
              {c.error}
            </p>
          )}
          <div className="mt-5 flex justify-end gap-2">
            <Button variant="secondary" disabled={c.busy} onClick={() => setConfirm(false)}>
              Quay lại
            </Button>
            <Button
              disabled={c.busy || stale}
              onClick={async () => {
                const ok = supplement
                  ? await c.supplement(r, message, files)
                  : await c.cancel(r, message);
                if (ok) {
                  setConfirm(false);
                  onSaved();
                }
              }}
            >
              {supplement ? 'Xác nhận gửi bổ sung' : 'Xác nhận hủy'}
            </Button>
          </div>
        </Dialog>
      )}
    </Card>
  );
}
