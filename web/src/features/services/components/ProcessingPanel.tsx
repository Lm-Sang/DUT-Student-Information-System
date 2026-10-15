import { useState } from 'react';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { Dialog } from '@/shared/ui/Dialog';
import { actionLabels, getRequestType, nextStatus, statusLabels } from '../data/requestCatalog';
import { needsExternalAcknowledgment, transitionIssues } from '../services/requestRules';
import type { RequestController } from '../hooks/useRequests';
import type { RequestStatus, ReviewData, StudentRequest } from '../types/requests';
import { FilePicker } from './RequestUi';

import { reviewLabels } from '../data/reviewLabels';
export function ProcessingPanel({
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
  const type = getRequestType(r.typeId);
  const [review, setReview] = useState<ReviewData>({ ...r.review });
  const next = nextStatus(r.typeId, r.status);
  const [target, setTarget] = useState<RequestStatus>(next ?? 'completed');
  const [message, setMessage] = useState(r.review.responseDraft ?? '');
  const [result, setResult] = useState(r.result);
  const [files, setFiles] = useState<File[]>([]);
  const [acknowledged, setAcknowledged] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const stopped = r.status === 'supplement';
  const exceptional = ['supplement', 'rejected'].includes(target);
  const allowException = [
    'received',
    'validating',
    'review',
    'verified',
    'feedback',
    'council',
  ].includes(r.status);
  const update = (key: keyof ReviewData, value: string | boolean) => {
    onDirty();
    setReview((current) => ({ ...current, [key]: value }));
  };
  const check = (key: keyof ReviewData) => (
    <label className="request-check" key={key}>
      <input
        type="checkbox"
        checked={!!review[key]}
        onChange={(e) => update(key, e.target.checked)}
      />
      <span>{reviewLabels[key]}</span>
    </label>
  );
  const text = (key: keyof ReviewData, inputType = 'text') => (
    <label className="request-field" key={key}>
      {reviewLabels[key]}
      <input
        type={inputType}
        aria-label={reviewLabels[key]}
        value={String(review[key] ?? '')}
        onChange={(e) => update(key, e.target.value)}
        maxLength={1000}
      />
    </label>
  );
  const area = (key: keyof ReviewData) => (
    <label className="request-field" key={key}>
      {reviewLabels[key]}
      <textarea
        aria-label={reviewLabels[key]}
        value={String(review[key] ?? '')}
        onChange={(e) => update(key, e.target.value)}
        rows={3}
        maxLength={3000}
      />
    </label>
  );
  const issues = transitionIssues(r, target, message, review, result, files, acknowledged);
  return (
    <Card className="request-action-panel">
      <p className="text-xs font-medium text-brand">BÀN XỬ LÝ</p>
      <h3 className="mt-1 text-lg font-semibold">{statusLabels[r.status]}</h3>
      <p className="mt-2 text-xs text-muted">
        Thông tin kiểm tra và ghi chú chỉ hiển thị cho chuyên viên được phân công và admin.
      </p>
      {stopped && (
        <p className="request-policy mt-4">
          Đang chờ sinh viên bổ sung. Có thể lưu ghi chú nội bộ; chưa thể chuyển bước.
        </p>
      )}
      <div className="mt-4 space-y-4">
        {!stopped && (
          <label className="request-field">
            Bước xử lý tiếp theo
            <select
              value={target}
              onChange={(e) => {
                onDirty();
                setTarget(e.target.value as RequestStatus);
                setAcknowledged(false);
              }}
            >
              {next && <option value={next}>{actionLabels[next] ?? statusLabels[next]}</option>}
              {allowException && (
                <>
                  <option value="supplement">Yêu cầu bổ sung</option>
                  <option value="rejected">Từ chối hồ sơ</option>
                </>
              )}
            </select>
          </label>
        )}
        {!stopped && !exceptional && (
          <>
            {r.status === 'validating' && (
              <fieldset className="request-checklist">
                <legend>Kiểm tra điều kiện hồ sơ</legend>
                {check('identityChecked')}
                {check('evidenceChecked')}
                {!type.requiresOriginalVerification && check('originalRequired')}
                {(type.requiresOriginalVerification || review.originalRequired) &&
                  check('originalChecked')}
                {type.requiresCampaign && check('campaignChecked')}
              </fieldset>
            )}
            {type.workflow === 'certificate' && target === 'verified' && (
              <fieldset className="space-y-3">
                <legend className="mb-3 font-semibold">Thẩm tra chứng chỉ</legend>
                <label className="request-field">
                  Tình trạng xác minh
                  <select
                    value={review.verificationStatus ?? ''}
                    onChange={(e) => update('verificationStatus', e.target.value)}
                  >
                    <option value="">Chọn kết quả</option>
                    <option value="pending">Chờ đơn vị cấp phản hồi</option>
                    <option value="valid">Hợp lệ</option>
                    <option value="invalid">Không hợp lệ</option>
                  </select>
                </label>
                {text('verificationChannel')}
                {text('verificationDate', 'date')}
                {text('verificationRef')}
                {area('verification')}
              </fieldset>
            )}
            {type.workflow === 'certificate' && target === 'review' && (
              <fieldset className="space-y-3">
                <legend className="mb-3 font-semibold">Đề xuất công nhận</legend>
                {text('recognizedLevel')}
                {text('convertedScore')}
                {text('conversionBasis')}
                {area('recommendation')}
                {text('reviewer')}
                <p className="text-xs text-muted">
                  Đây là đề xuất; quyết định thuộc cấp có thẩm quyền. Không tự quy đổi khi chưa có
                  căn cứ áp dụng cho khóa.
                </p>
              </fieldset>
            )}
            {target === 'decision' && (
              <fieldset className="space-y-3">
                <legend className="mb-3 font-semibold">Ghi nhận quyết định đã ban hành</legend>
                {text('reference')}
                {text('decisionDate', 'date')}
                {area('decisionOutcome')}
              </fieldset>
            )}
            {target === 'signed' && text('signatureRef')}
            {target === 'sealed' && text('sealRef')}
            {['council', 'regrading', 'updated'].includes(target) && text('externalReference')}
            {target === 'updated' && type.workflow === 'certificate' && area('academicUpdate')}
            {['ready', 'completed'].includes(target) && (
              <fieldset className="space-y-3">
                <legend className="mb-3 font-semibold">Trả kết quả</legend>
                {type.requiresSignatureRecord && !r.review.signatureRef && text('signatureRef')}
                {type.requiresSealRecord && !r.review.sealRef && text('sealRef')}
                {(type.requiresOriginalVerification || review.originalRequired) &&
                  !r.review.originalChecked &&
                  check('originalChecked')}
                {['academic', 'certificate', 'evaluation', 'graduation'].includes(
                  type.workflow,
                ) && (
                  <>
                    {!r.review.reference && text('reference')}
                    {!r.review.decisionDate && text('decisionDate', 'date')}
                    {!r.review.decisionOutcome && area('decisionOutcome')}
                  </>
                )}
                {type.workflow === 'certificate' &&
                  !r.review.academicUpdate &&
                  area('academicUpdate')}
                <label className="request-field">
                  Kênh trả kết quả
                  <select
                    aria-label="Kênh trả kết quả"
                    value={review.deliveryMode ?? ''}
                    onChange={(e) => update('deliveryMode', e.target.value)}
                  >
                    <option value="">Chọn kênh</option>
                    <option value="pickup">Nhận trực tiếp</option>
                    {!type.requiresPickup && (
                      <>
                        <option value="digital">Trên hệ thống</option>
                        <option value="announcement">Theo thông báo</option>
                      </>
                    )}
                  </select>
                </label>
                {review.deliveryMode === 'pickup' && (
                  <>
                    {text('pickupLocation')}
                    {text('pickupTime')}
                    {area('pickupInstructions')}
                  </>
                )}
                {review.deliveryMode === 'announcement' && text('announcementUrl', 'url')}
                <label className="request-field">
                  Kết quả và hướng dẫn nhận
                  <textarea
                    aria-label="Kết quả và hướng dẫn nhận"
                    rows={4}
                    value={result}
                    onChange={(e) => {
                      onDirty();
                      setResult(e.target.value);
                    }}
                    maxLength={3000}
                  />
                </label>
                {target === 'completed' && check('deliveryAcknowledged')}
              </fieldset>
            )}
            {['decision', 'ready'].includes(target) && (
              <FilePicker
                id="result-files"
                label="Bản kết quả tham khảo"
                files={files}
                onChange={(files) => {
                  onDirty();
                  setFiles(files);
                }}
              />
            )}
          </>
        )}
        {area('internalNote')}
        <Button
          variant="secondary"
          disabled={c.busy || stale}
          onClick={async () => {
            if (await c.saveReview(r, { ...review, responseDraft: message }, result, files))
              onSaved();
          }}
        >
          Lưu phiếu kiểm tra
        </Button>
        {!stopped && (
          <>
            <label className="request-field">
              Phản hồi cho sinh viên
              <textarea
                aria-label="Phản hồi cho sinh viên"
                rows={3}
                value={message}
                onChange={(e) => {
                  onDirty();
                  setMessage(e.target.value);
                }}
                maxLength={3000}
              />
              <span className="text-xs text-muted">
                Nội dung này xuất hiện trong lịch sử công khai.
              </span>
            </label>
            {!exceptional && needsExternalAcknowledgment(target) && (
              <label className="request-check">
                <input
                  type="checkbox"
                  checked={acknowledged}
                  onChange={(e) => {
                    onDirty();
                    setAcknowledged(e.target.checked);
                  }}
                />
                <span>
                  Xác nhận thao tác bên ngoài đã thực hiện và có căn cứ; đây là ghi nhận, không phải
                  ký / đóng dấu điện tử.
                </span>
              </label>
            )}
            {!!issues.length && (
              <div className="request-conditions">
                <strong className="text-sm">Cần hoàn thành trước khi chuyển bước</strong>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
                  {issues.map((issue) => (
                    <li key={issue}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}
            <Button
              className="w-full"
              disabled={c.busy || stale || issues.length > 0}
              onClick={() => setConfirm(true)}
            >
              Cập nhật trạng thái
            </Button>
          </>
        )}
      </div>
      {confirm && (
        <Dialog
          title="Xác nhận cập nhật hồ sơ"
          onClose={() => {
            if (!c.busy) setConfirm(false);
          }}
        >
          <p className="font-semibold">
            {statusLabels[r.status]} → {statusLabels[target]}
          </p>
          <p className="my-4 whitespace-pre-wrap">{message}</p>
          {c.error && (
            <p role="alert" className="mb-3 text-danger">
              {c.error}
            </p>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="secondary" disabled={c.busy} onClick={() => setConfirm(false)}>
              Kiểm tra lại
            </Button>
            <Button
              disabled={c.busy || stale}
              onClick={async () => {
                if (await c.transition(r, target, message, review, result, files, acknowledged)) {
                  setConfirm(false);
                  onSaved();
                }
              }}
            >
              Xác nhận cập nhật
            </Button>
          </div>
        </Dialog>
      )}
    </Card>
  );
}
