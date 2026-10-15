import { useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AcademicPageTitle, AcademicPanel, AcademicSectionHeading } from '../components/AcademicUi';
import { Button } from '@/shared/ui/Button';

interface ThesisForm {
  titleVi: string;
  advisor: string;
  advisorTwo: string;
  team: boolean;
  copyright: boolean;
  summaryVi: string;
  titleEn: string;
  summaryEn: string;
}

const emptyForm: ThesisForm = {
  titleVi: '',
  advisor: '',
  advisorTwo: '',
  team: false,
  copyright: false,
  summaryVi: '',
  titleEn: '',
  summaryEn: '',
};
const storageKey = (term: string) => `dut-portal-thesis-draft:${term}`;

function readSaved(term: string): ThesisForm {
  try {
    const value = localStorage.getItem(storageKey(term));
    return value ? { ...emptyForm, ...(JSON.parse(value) as Partial<ThesisForm>) } : emptyForm;
  } catch {
    return emptyForm;
  }
}

export function ThesisDetailPage() {
  const [params, setParams] = useSearchParams();
  const [term, setTerm] = useState(() => params.get('term') ?? 'HK1 · 2026 – 2027');
  const [saved, setSaved] = useState(() => readSaved(term));
  const [form, setForm] = useState(saved);
  const [message, setMessage] = useState('');
  function changeTerm(next: string) {
    setTerm(next);
    setParams({ term: next }, { replace: true });
    const nextSaved = readSaved(next);
    setSaved(nextSaved);
    setForm(nextSaved);
    setMessage('');
  }
  function update<K extends keyof ThesisForm>(key: K, value: ThesisForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setMessage('');
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.titleVi.trim() || !form.advisor.trim()) {
      setMessage('Nhập tên đề tài và giảng viên hướng dẫn trước khi lưu.');
      return;
    }
    try {
      localStorage.setItem(storageKey(term), JSON.stringify(form));
      setSaved(form);
      setMessage('Đã lưu thông tin trên trình duyệt này.');
    } catch {
      setMessage('Không thể lưu thông tin trên trình duyệt này.');
    }
  }
  return (
    <div className="text-ink">
      <AcademicPageTitle
        title="Thông tin đề tài tốt nghiệp"
        subtitle="Lê Minh Sang · 102230369 · 23T_DT4"
      />
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <select
          aria-label="Chọn học kỳ đề tài"
          value={term}
          onChange={(event) => changeTerm(event.target.value)}
          className="!min-h-9 !border-0 !bg-subtle !text-[0.8125rem] text-brand"
        >
          <option>HK1 · 2026 – 2027</option>
          <option>HK2 · 2025 – 2026</option>
        </select>
        <span className="text-xs text-muted">
          {saved.titleVi ? 'Đã nhập thông tin' : 'Chưa nhập thông tin'}
        </span>
      </div>
      <form onSubmit={submit}>
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <AcademicPanel>
              <AcademicSectionHeading>Thông tin chung</AcademicSectionHeading>
              <label className="block text-[0.8125rem] font-medium">
                Tên đề tài (tiếng Việt)
                <textarea
                  value={form.titleVi}
                  onChange={(event) => update('titleVi', event.target.value)}
                  placeholder="Nhập tên đề tài"
                  className="mt-2 block min-h-20 w-full rounded-lg border border-line p-3 font-normal"
                />
              </label>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="text-[0.8125rem] font-medium">
                  Giảng viên hướng dẫn
                  <input
                    value={form.advisor}
                    onChange={(event) => update('advisor', event.target.value)}
                    placeholder="Nhập họ tên giảng viên"
                    className="mt-2 block w-full font-normal"
                  />
                </label>
                <label className="text-[0.8125rem] font-medium">
                  Giảng viên hướng dẫn thứ 2
                  <input
                    value={form.advisorTwo}
                    onChange={(event) => update('advisorTwo', event.target.value)}
                    placeholder="Nếu có"
                    className="mt-2 block w-full font-normal"
                  />
                </label>
              </div>
              <div className="mt-4 space-y-2 text-[0.8125rem]">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="!min-h-0"
                    checked={form.team}
                    onChange={(event) => update('team', event.target.checked)}
                  />
                  Đề tài được giao cho nhóm sinh viên
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="!min-h-0"
                    checked={form.copyright}
                    onChange={(event) => update('copyright', event.target.checked)}
                  />
                  Đề tài có ký kết thỏa thuận bản quyền
                </label>
              </div>
            </AcademicPanel>
            <AcademicPanel>
              <AcademicSectionHeading>Tóm tắt & nội dung tiếng Anh</AcademicSectionHeading>
              <div className="space-y-4 text-[0.8125rem]">
                <label className="block font-medium">
                  Tóm tắt đề tài
                  <textarea
                    value={form.summaryVi}
                    onChange={(event) => update('summaryVi', event.target.value)}
                    placeholder="Mô tả ngắn mục tiêu và nội dung thực hiện"
                    className="mt-2 block min-h-24 w-full rounded-lg border border-line p-3 font-normal"
                  />
                </label>
                <label className="block font-medium">
                  Tên đề tài (tiếng Anh)
                  <input
                    value={form.titleEn}
                    onChange={(event) => update('titleEn', event.target.value)}
                    placeholder="Enter the English title"
                    className="mt-2 block w-full font-normal"
                  />
                </label>
                <label className="block font-medium">
                  Tóm tắt đề tài (tiếng Anh)
                  <textarea
                    value={form.summaryEn}
                    onChange={(event) => update('summaryEn', event.target.value)}
                    placeholder="Enter the English abstract"
                    className="mt-2 block min-h-24 w-full rounded-lg border border-line p-3 font-normal"
                  />
                </label>
              </div>
            </AcademicPanel>
          </div>
          <aside className="space-y-6">
            <AcademicPanel>
              <AcademicSectionHeading>Học phần đồ án</AcademicSectionHeading>
              <dl className="divide-y divide-line text-[0.8125rem]">
                {[
                  ['Mã lớp / Tên học phần', '—'],
                  ['Tuần làm đồ án', '—'],
                  ['Học lại', '—'],
                  ['Học phí', '—'],
                  ['Giảng viên phản biện', 'Chưa có thông tin'],
                  ['Hội đồng chấm bảo vệ', 'Chưa có thông tin'],
                  ['Tình trạng bảo vệ', 'Chưa có thông tin'],
                  ['Kết quả', 'Chưa công bố'],
                ].map(([label, value]) => (
                  <div key={label} className="py-3">
                    <dt className="text-xs text-muted">{label}</dt>
                    <dd className="mt-1 font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
            </AcademicPanel>
            <AcademicPanel>
              <AcademicSectionHeading>Hướng dẫn nhập thông tin</AcademicSectionHeading>
              <p className="text-[0.8125rem] text-muted">
                Kiểm tra tên đề tài và giảng viên hướng dẫn trước khi lưu.
              </p>
              <a
                href="#thesis-actions"
                className="mt-4 inline-block text-[0.8125rem] font-medium text-brand"
              >
                Xem hướng dẫn & lưu ý
              </a>
            </AcademicPanel>
          </aside>
        </div>
        <div id="thesis-actions" className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs text-muted">Kiểm tra thông tin trước khi lưu.</p>
            {message && (
              <p
                role="status"
                className={`mt-1 text-xs ${message.startsWith('Đã') ? 'text-success' : 'text-danger'}`}
              >
                {message}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              className="!min-h-9 !border-0 !bg-subtle !text-[0.8125rem]"
              onClick={() => {
                setForm(saved);
                setMessage('Đã hủy thay đổi chưa lưu.');
              }}
            >
              Hủy thay đổi
            </Button>
            <Button type="submit" className="!min-h-9 !text-[0.8125rem]">
              Lưu thông tin
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
