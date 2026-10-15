import type { StudentRequest } from '../types/requests';
import { requestSteps, statusLabels } from '../data/requestCatalog';
import { requestState } from '../data/requestState';
import { dateTime } from '../data/requestFormatting';
import { reviewLabels } from '../data/reviewLabels';
import type { ReviewData } from '../types/requests';

export function RequestTracking({ request: r }: { request: StudentRequest }) {
  const state = requestState(r);
  const steps = requestSteps(r.typeId, r.status === 'supplement' ? r.resumeStatus : r.status);
  const current = r.status === 'supplement' ? r.resumeStatus : r.status;
  // A seeded current step says nothing about execution of earlier steps.
  const done = new Set(
    r.events
      .filter((e) => ['transition', 'submit', 'supplement'].includes(e.kind ?? ''))
      .flatMap((e) => (e.fromStatus ? [e.fromStatus] : [])),
  );
  return (
    <section aria-label="Tiến độ hồ sơ" className="request-tracking">
      <div className="request-next-action">
        <div>
          <span className="text-xs text-muted">Việc tiếp theo</span>
          <p className="mt-1 font-semibold">{state.action}</p>
        </div>
        <div>
          <span className="text-xs text-muted">Đang chờ</span>
          <p className="mt-1 font-medium">{state.waitingOn}</p>
        </div>
      </div>
      <details className="mt-4">
        <summary className="min-h-11 cursor-pointer font-medium text-brand">
          Các bước của quy trình · {state.lifecycle}
        </summary>
        <ol className="request-steps mt-3">
          {steps.map((step, i) => (
            <li
              key={step}
              aria-current={step === current ? 'step' : undefined}
              data-done={done.has(step) && step !== current}
            >
              <span aria-hidden="true">{done.has(step) && step !== current ? '✓' : i + 1}</span>
              {statusLabels[step]}
              {done.has(step) && <span className="sr-only"> · có ghi nhận thực hiện</span>}
            </li>
          ))}
        </ol>
        <p className="mt-3 text-xs text-muted">
          Chỉ đánh dấu những bước có sự kiện thực hiện. Hồ sơ nhập mẫu giữa quy trình không có lịch
          sử các bước trước.
        </p>
      </details>
    </section>
  );
}
export function RequestTimeline({ request }: { request: StudentRequest }) {
  return (
    <ol className="request-timeline">
      {[...request.events].reverse().map((event) => (
        <li key={event.id}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <strong>{event.actor}</strong>
            <span className="text-xs text-muted">{dateTime(event.at)}</span>
          </div>
          <p className="my-1 text-xs text-muted">
            {event.visibility === 'internal' ? 'Nội bộ · ' : 'Công khai · '}
            {event.fromStatus ? `${statusLabels[event.fromStatus]} → ` : ''}
            {statusLabels[event.status]}
            {event.kind === 'seed' ? ' · Sự kiện nhập mẫu' : ''}
          </p>
          <p className="whitespace-pre-wrap text-sm">{event.message}</p>
          {!!event.changes?.length && (
            <dl className="request-audit-diff mt-3">
              {event.changes.map((change) => (
                <div key={change.field}>
                  <dt>{reviewLabels[change.field as keyof ReviewData] ?? change.field}</dt>
                  <dd>
                    <span>{change.before}</span> → <strong>{change.after}</strong>
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </li>
      ))}
    </ol>
  );
}
