import { useState } from 'react';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { Dialog } from '@/shared/ui/Dialog';
import { categories, getRequestFields, getRequestType, requestTypes } from '../data/requestCatalog';
import { submissionLabels, evidenceLabels, deliveryLabels } from '../data/procedurePolicy';
import { useRequestDraft } from '../hooks/useRequestDraft';
import { submissionIssues } from '../services/requestRules';
import { ProcedureCatalog } from './ProcedureCatalog';
import type { RequestController } from '../hooks/useRequests';
import { FilePicker, RequestField } from './RequestUi';

export function CreateRequestForm({
  controller: c,
  onCreated,
}: {
  controller: RequestController;
  onCreated: () => void;
}) {
  const [category, setCategory] = useState(categories[0]);
  const [typeId, setTypeId] = useState('student-confirmation');
  const draft = useRequestDraft(c.user!.id, typeId);
  const { fields, files, note } = draft;
  const setFiles = (files: File[]) => draft.update({ files });
  const setNote = (note: string) => draft.update({ note });
  const [confirm, setConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fileKey, setFileKey] = useState(0);
  const type = getRequestType(typeId);
  const formFields = getRequestFields(typeId, fields);
  const changeType = (id: string) => {
    setTypeId(id);
    setCategory(getRequestType(id).category);
    setFileKey((key) => key + 1);
    setErrors({});
  };
  return (
    <div className="space-y-5">
      <ProcedureCatalog
        selected={typeId}
        onSelect={(id) => {
          changeType(id);
          document.getElementById('create-request')?.scrollIntoView({ block: 'start' });
        }}
      />
      <div className="request-create-grid">
        <Card id="create-request">
          <p className="mb-1 text-xs font-medium text-brand">02 · KHAI BÁO VÀ MINH CHỨNG</p>
          <h2 className="text-lg font-semibold">Lập đơn trực tuyến</h2>
          <p className="mt-2 text-muted">
            Chọn nhóm thủ tục và điền thông tin. Trường có dấu * là bắt buộc.
          </p>
          <form
            noValidate
            className="mt-5 space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              const found = submissionIssues({ typeId, fields, files, note });
              setErrors(found);
              if (Object.keys(found).length) {
                const first = Object.keys(found)[0];
                document.getElementById(first === 'files' ? 'request-file' : first)?.focus();
                return;
              }
              setConfirm(true);
            }}
          >
            <div className="rounded-lg bg-canvas p-3 text-sm">
              Người nộp: <strong>{c.user?.fullName}</strong>
              <p className="mt-1 text-xs text-muted">
                {c.user?.studentId} · {c.user?.className}
              </p>
            </div>
            <label className="request-field">
              Nhóm thủ tục
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  changeType(requestTypes.find((item) => item.category === e.target.value)!.id);
                }}
              >
                {categories.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="request-field">
              Loại đơn đề nghị:
              <select value={typeId} onChange={(e) => changeType(e.target.value)}>
                {requestTypes
                  .filter((item) => item.category === category)
                  .map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
              </select>
            </label>
            <div className="request-policy">
              <p className="font-medium">Chuẩn bị hồ sơ</p>
              <p className="mt-2">{type.guidance}</p>
              <p className="mt-2">{type.policyNote}</p>
              {type.requiresCampaign && (
                <p className="mt-2">
                  Đăng ký theo đợt. Chuyên viên phải xác nhận điều kiện và thời hạn áp dụng.
                </p>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {formFields.map((field) => (
                <RequestField
                  key={field.key}
                  field={field}
                  value={fields[field.key] ?? ''}
                  onChange={(value) => {
                    draft.update({ fields: { ...fields, [field.key]: value } });
                    setErrors((previous) => ({ ...previous, [field.key]: '' }));
                  }}
                  error={errors[field.key]}
                />
              ))}
            </div>
            <FilePicker key={fileKey} files={files} onChange={setFiles} required={type.evidence} />
            {errors.files && (
              <p role="alert" className="text-danger">
                {errors.files}
              </p>
            )}
            <label className="request-field">
              Ghi chú bổ sung:
              <textarea
                maxLength={3000}
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </label>
            {Object.values(errors).some(Boolean) && (
              <p role="alert" className="text-danger">
                Kiểm tra các trường được đánh dấu trước khi nộp.
              </p>
            )}
            <p className="text-xs text-muted">
              Bản nháp của từng thủ tục được giữ khi chuyển mục trong phiên làm việc. Tải lại trang
              sẽ xóa bản nháp chưa nộp.
            </p>
            <div className="flex flex-wrap justify-end gap-2 border-t border-line pt-4">
              <Button
                variant="ghost"
                onClick={() => {
                  draft.clear();
                  setFileKey((key) => key + 1);
                  setErrors({});
                }}
              >
                Làm lại
              </Button>
              <Button type="submit" disabled={c.busy}>
                {type.submissionMode === 'direct'
                  ? 'Đăng ký trước và theo dõi'
                  : 'Nộp đơn trực tuyến'}
              </Button>
            </div>
          </form>
        </Card>
        <aside className="space-y-5">
          <Card>
            <h2 className="text-lg font-semibold">Thông tin tiếp nhận</h2>
            <dl className="request-data mt-5">
              <div>
                <dt>Nơi tiếp nhận</dt>
                <dd>{type.department}</dd>
              </div>
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
              {type.requiresCampaign && (
                <div>
                  <dt>Điều kiện tiếp nhận</dt>
                  <dd>Theo đợt / thông báo. Chuyên viên xác nhận đợt áp dụng.</dd>
                </div>
              )}
              <div>
                <dt>Thời gian dự kiến</dt>
                <dd>{type.estimate ?? 'Theo thông báo và hạn do đơn vị xử lý xác nhận'}</dd>
              </div>
            </dl>
          </Card>
          <Card>
            <h2 className="text-lg font-semibold">Theo dõi sau khi nộp</h2>
            <ol className="mt-4 list-decimal space-y-3 pl-5 text-muted">
              <li>Nhận mã hồ sơ ngay sau khi xác nhận nộp.</li>
              <li>Xem chuyên viên phụ trách, hạn và từng bước xử lý.</li>
              <li>Bổ sung minh chứng khi được yêu cầu.</li>
              <li>Nhận thông báo kết quả và hướng dẫn nhận.</li>
            </ol>
            <p className="mt-5 border-t border-line pt-4 text-xs text-muted">
              Lệ phí và yêu cầu bản gốc được xác nhận theo từng loại thủ tục.
            </p>
          </Card>
        </aside>
        {confirm && (
          <Dialog
            title="Xác nhận nộp hồ sơ"
            onClose={() => {
              if (!c.busy) setConfirm(false);
            }}
          >
            <p className="font-semibold">{type.name}</p>
            <p className="mt-2">
              Hồ sơ của {c.user?.fullName} sẽ được chuyển đến {type.department}. Vui lòng kiểm tra
              thông tin trước khi xác nhận.
            </p>
            <dl className="request-data my-4">
              {formFields.map((field) => (
                <div key={field.key}>
                  <dt>{field.label}</dt>
                  <dd>{fields[field.key] || '—'}</dd>
                </div>
              ))}
            </dl>
            <p className="request-policy my-3">{type.policyNote}</p>
            <p className="my-3 text-muted">
              {files.length} tệp minh chứng: {files.map((f) => f.name).join(', ') || 'Không có'}
            </p>
            {c.error && (
              <p role="alert" className="mb-3 text-danger">
                {c.error}
              </p>
            )}
            <div className="flex flex-wrap justify-end gap-2">
              <Button variant="secondary" disabled={c.busy} onClick={() => setConfirm(false)}>
                Kiểm tra lại
              </Button>
              <Button
                disabled={c.busy}
                onClick={async () => {
                  if (await c.create({ typeId, fields, files, note })) {
                    setConfirm(false);
                    draft.clear();
                    setFileKey((key) => key + 1);
                    onCreated();
                  }
                }}
              >
                {c.busy ? 'Đang nộp…' : 'Xác nhận nộp'}
              </Button>
            </div>
          </Dialog>
        )}
      </div>
    </div>
  );
}
