import { useMemo, useState } from 'react';
import { usePortalEdition } from '@/shared/config/portalEdition';
import { criterionGroups } from '../data/conduct.data';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { PageHeading } from '@/shared/ui/PageHeading';
import { Disclosure } from '@/shared/ui/Disclosure';

const defaultScores = Object.fromEntries(
  criterionGroups.flatMap((group) => group.criteria.map((item) => [item.id, item.score])),
);

function readSavedScores(): Record<number, number> {
  try {
    const saved = localStorage.getItem('dut-conduct-self-draft');
    return saved ? { ...defaultScores, ...JSON.parse(saved) } : defaultScores;
  } catch {
    return defaultScores;
  }
}

export function SelfAssessmentPage() {
  const v2 = usePortalEdition() === 'v2';
  const [scores, setScores] = useState<Record<number, number>>(readSavedScores);
  const [term, setTerm] = useState('Học kỳ 2 (2025 - 2026)');
  const [status, setStatus] = useState<'draft' | 'saved' | 'submitted'>(() => {
    const value = localStorage.getItem('dut-conduct-self-status');
    return value === 'submitted' || value === 'saved' ? value : 'draft';
  });
  const [files, setFiles] = useState<Record<number, string>>({});
  const total = useMemo(
    () => Object.values(scores).reduce((sum, score) => sum + Number(score || 0), 0),
    [scores],
  );
  const grade = total >= 90 ? 'XUẤT SẮC' : total >= 80 ? 'TỐT' : total >= 65 ? 'KHÁ' : 'TRUNG BÌNH';
  const save = () => {
    localStorage.setItem('dut-conduct-self-draft', JSON.stringify(scores));
    localStorage.setItem('dut-conduct-self-status', 'saved');
    setStatus('saved');
  };

  return (
    <div className="space-y-5 text-ink">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeading title="Tự đánh giá rèn luyện" />
        <div className="flex min-w-0 max-w-full flex-wrap items-center gap-2">
          <label className="text-xs font-semibold text-muted" htmlFor="conduct-term">
            Học kỳ
          </label>
          <select
            id="conduct-term"
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            className="text-xs text-brand"
          >
            <option>Học kỳ 2 (2025 - 2026)</option>
            <option>Học kỳ 1 (2025 - 2026)</option>
          </select>
          <Button
            variant="secondary"
            className="!text-xs"
            onClick={() => {
              setScores(defaultScores);
              setStatus('draft');
              localStorage.removeItem('dut-conduct-self-draft');
              localStorage.removeItem('dut-conduct-self-status');
            }}
          >
            Nạp dữ liệu
          </Button>
        </div>
      </div>

      {v2 && (
        <ol className="v2-review-steps" aria-label="Quy trình đánh giá rèn luyện">
          {[
            ['Cá nhân tự chấm', `${total} / 100 điểm · ${grade}`],
            [
              'Ban cán sự lớp',
              status === 'submitted' ? 'Chờ cán bộ lớp duyệt' : 'Chờ cá nhân gửi xác nhận',
            ],
            ['GVCN phê duyệt', 'Xét duyệt sau buổi họp lớp'],
          ].map(([label, hint], index) => (
            <li key={label} className={index === 0 ? 'is-current' : ''}>
              <span>{index + 1}</span>
              <div>
                <strong>{label}</strong>
                <small>{hint}</small>
              </div>
            </li>
          ))}
        </ol>
      )}
      <div className={`assessment-summary ${v2 ? 'v2-review-deadline' : ''}`}>
        <div>
          <p className="text-sm text-muted">Điểm tự đánh giá</p>
          <strong>
            {total}
            <span className="text-sm font-normal text-muted"> / 100</span>
          </strong>
          <p className="text-xs text-muted">Xếp loại dự kiến: {grade}</p>
        </div>
        <div>
          <p className="mb-2 text-sm">
            Hạn gửi: <strong className="!text-sm !font-medium">23:59, 25/09/2026</strong>
          </p>
          <Badge>
            {status === 'submitted'
              ? 'Đã gửi xác nhận'
              : status === 'saved'
                ? 'Đã lưu bản nháp'
                : 'Bản nháp'}
          </Badge>
        </div>
      </div>
      <Disclosure title="Hướng dẫn & quy trình duyệt">
        <p className="text-sm text-muted">
          Chấm điểm từng nhóm tiêu chí và thêm minh chứng nếu có. Sau hạn gửi, hệ thống khóa phiếu
          và lấy điểm chấm hiện tại.
        </p>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2 text-sm">
          <div>
            <dt className="font-medium">Ban cán sự lớp</dt>
            <dd className="text-muted">Chờ cá nhân gửi xác nhận; duyệt tại buổi họp chi đoàn.</dd>
          </div>
          <div>
            <dt className="font-medium">Giáo viên chủ nhiệm</dt>
            <dd className="text-muted">Phê duyệt chính thức sau buổi họp lớp.</dd>
          </div>
        </dl>
        <p className="mt-4 text-xs text-muted">
          Quy chế: Thông tư 16/2015/TT-BGDĐT và quy định ĐHBK.
        </p>
      </Disclosure>

      {criterionGroups.map((group, index) => {
        const groupScore = group.criteria.reduce(
          (sum, item) => sum + Number(scores[item.id] ?? 0),
          0,
        );
        return (
          <Disclosure
            key={group.numeral}
            title={`${group.numeral}. ${group.title}`}
            meta={`${groupScore} / ${group.max} điểm`}
            defaultOpen={index === 0}
            flush
          >
            <div
              role="region"
              aria-label={`Tiêu chí ${group.numeral}`}
              tabIndex={0}
              className="overflow-x-auto"
            >
              <table className="academic-table min-w-[760px]">
                <thead>
                  <tr>
                    <th className="w-12">STT</th>
                    <th>Nội dung tiêu chí chi tiết</th>
                    <th className="w-20">Tối đa</th>
                    <th className="w-28">SV tự chấm</th>
                    <th className="w-[260px]">Minh chứng &amp; ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  {group.criteria.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>
                        <strong className="font-semibold">{item.title}</strong>
                        <p className="mt-1 text-xs leading-5 text-muted">{item.description}</p>
                      </td>
                      <td>{item.max}</td>
                      <td>
                        <input
                          aria-label={`Điểm tự chấm tiêu chí ${item.id}`}
                          type="number"
                          min="0"
                          max={item.max}
                          value={scores[item.id] ?? 0}
                          disabled={status === 'submitted'}
                          onChange={(event) => {
                            setScores((current) => ({
                              ...current,
                              [item.id]: Math.max(
                                0,
                                Math.min(item.max, Number(event.target.value)),
                              ),
                            }));
                            setStatus('draft');
                          }}
                          className="!min-h-8 !w-16 !bg-subtle !px-2 !py-1 text-center font-semibold text-brand"
                        />
                      </td>
                      <td className="text-xs text-muted">
                        <span>{files[item.id] || item.evidence}</span>
                        {[4, 9, 13].includes(item.id) && status !== 'submitted' && (
                          <label className="mt-1 block cursor-pointer font-medium text-brand hover:underline">
                            Tải minh chứng
                            <input
                              type="file"
                              className="sr-only"
                              onChange={(event) =>
                                setFiles((current) => ({
                                  ...current,
                                  [item.id]: event.target.files?.[0]?.name ?? '',
                                }))
                              }
                            />
                          </label>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Disclosure>
        );
      })}

      <Card className="v2-assessment-actions flex flex-wrap items-center justify-between gap-4 !p-5">
        <div>
          <p className="text-xs font-semibold text-muted">Tổng điểm</p>
          <p className="text-2xl font-bold text-brand">{total} / 100 điểm</p>
          <p className="mt-1 text-xs">
            Xếp loại: <strong>{grade}</strong>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => window.print()}>
            In phiếu (PDF)
          </Button>
          <Button variant="secondary" onClick={save} disabled={status === 'submitted'}>
            Lưu nháp
          </Button>
          <Button
            onClick={() => {
              save();
              localStorage.setItem('dut-conduct-self-status', 'submitted');
              setStatus('submitted');
            }}
            disabled={status === 'submitted'}
          >
            Gửi đánh giá
          </Button>
        </div>
      </Card>
      {status === 'saved' && (
        <p role="status" className="text-sm text-success">
          Đã lưu bản nháp đánh giá trên trình duyệt.
        </p>
      )}
      {status === 'submitted' && (
        <p role="status" className="text-sm text-success">
          Phiếu tự đánh giá đã được xác nhận và chuyển đến cán bộ lớp.
        </p>
      )}
    </div>
  );
}
