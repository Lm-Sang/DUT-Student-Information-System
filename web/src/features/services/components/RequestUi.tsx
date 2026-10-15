import { useEffect, useId, useState } from 'react';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Dialog } from '@/shared/ui/Dialog';
import { getRequestType, isOverdue, staffMembers, statusLabels } from '../data/requestCatalog';
import { validateFiles } from '../services/requestRules';
import type { Attachment, FieldDefinition, RequestStatus, StudentRequest } from '../types/requests';
import { dateTime } from '../data/requestFormatting';
import { daysRemaining, elapsedDays, requestState } from '../data/requestState';
export function StatusBadge({ status }: { status: RequestStatus }) {
  return (
    <Badge
      tone={
        ['completed', 'ready', 'updated'].includes(status)
          ? 'success'
          : status === 'rejected' || status === 'cancelled'
            ? 'danger'
            : status === 'supplement'
              ? 'warning'
              : 'info'
      }
    >
      {statusLabels[status]}
    </Badge>
  );
}
export function RequestField({
  field,
  value,
  onChange,
  error,
}: {
  field: FieldDefinition;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  const id = useId();
  return (
    <label className="request-field">
      <span>
        {field.label}
        {field.required && (
          <span aria-hidden="true" className="text-danger">
            {' '}
            *
          </span>
        )}
      </span>
      {field.options ? (
        <select
          aria-label={field.label}
          id={field.key}
          aria-invalid={!!error}
          aria-describedby={error ? id : undefined}
          required={field.required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Chọn…</option>
          {field.options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      ) : (
        <input
          type={field.type ?? 'text'}
          id={field.key}
          aria-invalid={!!error}
          aria-describedby={error ? id : undefined}
          required={field.required}
          maxLength={500}
          min={field.key === 'copies' ? 1 : field.type === 'number' ? 0 : undefined}
          max={field.key === 'copies' ? 5 : undefined}
          step={field.key === 'copies' ? 1 : 'any'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {error && (
        <span id={id} className="text-xs text-danger">
          {error}
        </span>
      )}
    </label>
  );
}
export function FilePicker({
  files,
  onChange,
  id = 'request-file',
  required = false,
  label = 'Minh chứng đính kèm',
}: {
  files: File[];
  onChange: (files: File[]) => void;
  id?: string;
  required?: boolean;
  label?: string;
}) {
  const [error, setError] = useState('');
  const choose = (items: File[]) => {
    try {
      const combined = [...files, ...items];
      validateFiles(combined);
      onChange(combined);
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Tệp không hợp lệ.');
    }
  };
  return (
    <div className="request-upload">
      <label htmlFor={id} className="font-medium">
        {label}
        {required ? ' (bắt buộc)' : ' (nếu có)'}
      </label>
      <p id={`${id}-help`} className="mt-1 text-xs text-muted">
        PDF, JPG, PNG; tối đa 5 tệp/lần, 10MB/tệp. Bản quét cần rõ và đầy đủ các mặt.
      </p>
      <div
        className="mt-3 rounded-lg border border-dashed border-field-border bg-canvas p-4"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          choose(Array.from(e.dataTransfer.files));
        }}
      >
        <input
          id={id}
          aria-describedby={`${id}-help`}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => {
            const items = Array.from(e.target.files ?? []);
            if (items.length) choose(items);
            e.target.value = '';
          }}
        />
        {!files.length && <p className="mt-2 text-xs text-muted">Chưa chọn tệp</p>}
      </div>
      {!!files.length && (
        <ul className="mt-3 space-y-2">
          {files.map((file, i) => (
            <li key={`${file.name}-${i}`}>
              <AttachmentPreview file={file} />
              <div className="flex items-center justify-between gap-2 text-xs text-muted">
                <span>{Math.ceil(file.size / 1024)} KB · Chờ nộp</span>
                <Button
                  variant="ghost"
                  onClick={() => onChange(files.filter((_, index) => index !== i))}
                >
                  Bỏ tệp {i + 1}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {files.length > 0 && (
        <Button
          variant="ghost"
          onClick={() => {
            onChange([]);
            const input = document.getElementById(id) as HTMLInputElement | null;
            if (input) input.value = '';
          }}
        >
          Bỏ tệp đã chọn
        </Button>
      )}
      {error && (
        <p role="status" className="mt-2 text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
function AttachmentPreview({ file }: { file: File }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="ghost" className="break-all text-left" onClick={() => setOpen(true)}>
        Xem {file.name}
      </Button>
      {open && <FilePreview blob={file} name={file.name} onClose={() => setOpen(false)} />}
    </>
  );
}
function useBlobUrl(blob: Blob) {
  const [url, setUrl] = useState('');
  useEffect(() => {
    const next = URL.createObjectURL(blob);
    // oxlint-disable-next-line react/set-state-in-effect -- The URL is an external browser resource created and released with the Blob lifecycle.
    setUrl(next);
    return () => URL.revokeObjectURL(next);
  }, [blob]);
  return url;
}
function FilePreview({ blob, name, onClose }: { blob: Blob; name: string; onClose: () => void }) {
  const url = useBlobUrl(blob);
  return (
    <Dialog title={`Xem trước: ${name}`} onClose={onClose}>
      <p className="mb-3 text-xs text-muted">
        Bản đính kèm để tham khảo và đối chiếu; không thay thế bản gốc có giá trị pháp lý.
      </p>
      {blob.type.startsWith('image/') ? (
        <img className="request-preview-image" src={url} alt={`Minh chứng ${name}`} />
      ) : (
        <iframe className="request-preview-pdf" title={name} src={url} />
      )}
      <a className="mt-3 inline-block text-brand underline" href={url} download={name}>
        Tải tệp {name}
      </a>
    </Dialog>
  );
}
function AttachmentLink({ file }: { file: Attachment }) {
  const url = useBlobUrl(file.blob);
  const [open, setOpen] = useState(false);
  return (
    <li className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-line p-3">
      <div className="min-w-0">
        <a
          className="break-all font-medium text-brand underline"
          href={url || undefined}
          download={file.name}
        >
          Tải {file.name}
        </a>
        <p className="text-xs text-muted">
          {Math.ceil(file.size / 1024)} KB · {dateTime(file.addedAt)} ·{' '}
          {file.purpose === 'evidence' ? 'Minh chứng đã lưu' : 'Bản kết quả tham khảo'}
        </p>
      </div>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Xem trước
      </Button>
      {open && <FilePreview blob={file.blob} name={file.name} onClose={() => setOpen(false)} />}
    </li>
  );
}
export function AttachmentList({ files }: { files: Attachment[] }) {
  return files.length ? (
    <ul className="space-y-2">
      {files.map((file) => (
        <AttachmentLink key={file.id} file={file} />
      ))}
    </ul>
  ) : (
    <p className="text-muted">Chưa có tệp đính kèm.</p>
  );
}
export function RequestTable({
  requests,
  onOpen,
  student = false,
}: {
  requests: StudentRequest[];
  onOpen: (id: string) => void;
  student?: boolean;
}) {
  return (
    <div
      role="region"
      aria-label="Danh sách hồ sơ"
      tabIndex={0}
      className="overflow-x-auto rounded-lg border border-line"
    >
      <table className="academic-table min-w-[800px]">
        <caption className="sr-only">Danh sách hồ sơ đề nghị</caption>
        <thead>
          <tr>
            <th>Hồ sơ</th>
            {!student && <th>Sinh viên</th>}
            <th>Trạng thái</th>
            <th>Chuyên viên / hạn xử lý</th>
            <th>Cập nhật</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((r) => (
            <tr key={r.id}>
              <td>
                <button
                  className="min-h-11 text-left font-semibold text-brand hover:underline"
                  onClick={() => onOpen(r.id)}
                >
                  {r.id}
                </button>
                <p>{getRequestType(r.typeId).name}</p>
                <p className="text-xs text-muted">{getRequestType(r.typeId).department}</p>
                {r.demo && (
                  <span className="text-xs text-muted">Dữ liệu mẫu v{r.demo.version}</span>
                )}
              </td>
              {!student && (
                <td>
                  <strong>{r.student.fullName}</strong>
                  <p className="text-xs text-muted">
                    {r.student.studentId} · {r.student.className}
                  </p>
                </td>
              )}
              <td>
                <StatusBadge status={r.status} />
                <p className="mt-2 text-xs text-muted">Chờ: {requestState(r).waitingOn}</p>
                {r.priority === 'urgent' && <p className="mt-2 text-xs text-danger">Ưu tiên cao</p>}
              </td>
              <td>
                <p>{staffMembers.find((s) => s.id === r.assigneeId)?.name ?? 'Chưa phân công'}</p>
                <p className={`mt-1 text-xs ${isOverdue(r) ? 'text-danger' : 'text-muted'}`}>
                  {r.dueDate
                    ? `${isOverdue(r) ? 'Quá hạn · ' : 'Hạn: '}${r.dueDate.split('-').reverse().join('/')}`
                    : 'Chờ xác nhận hạn xử lý'}
                </p>
              </td>
              <td className="text-xs text-muted">
                <p>{dateTime(r.updatedAt)}</p>
                {!student && <p className="mt-2 line-clamp-2">{r.events.at(-1)?.message}</p>}
              </td>
              <td>
                <button className="request-table-action" onClick={() => onOpen(r.id)}>
                  {student
                    ? r.status === 'supplement'
                      ? 'Bổ sung hồ sơ'
                      : r.status === 'ready' || r.status === 'completed'
                        ? 'Xem kết quả'
                        : 'Theo dõi'
                    : 'Mở hồ sơ'}
                  <span className="sr-only"> {r.id}</span>
                </button>
                {!student && (
                  <p className="mt-2 text-xs text-muted">
                    Đã {elapsedDays(r)} ngày ·{' '}
                    {daysRemaining(r) === undefined
                      ? 'Chưa có hạn'
                      : daysRemaining(r)! < 0
                        ? `Trễ ${-daysRemaining(r)!} ngày`
                        : `Còn ${daysRemaining(r)} ngày`}
                  </p>
                )}
              </td>
            </tr>
          ))}
          {!requests.length && (
            <tr>
              <td colSpan={student ? 5 : 6} className="py-10 text-center text-muted">
                Không có hồ sơ phù hợp. Thử đổi bộ lọc hoặc lập đơn mới.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
