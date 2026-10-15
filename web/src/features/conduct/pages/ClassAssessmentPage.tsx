import { useMemo, useState } from 'react';
import { classStudents, criterionGroups } from '../data/conduct.data';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { PageHeading } from '@/shared/ui/PageHeading';
import { Card } from '@/shared/ui/Card';

const allCriteria = criterionGroups.flatMap((group) => group.criteria);
const studentNumber = (name: string) =>
  `102230${String(332 + classStudents.indexOf(name)).padStart(3, '0')}`;

function readClassDrafts() {
  const grades: Record<string, Record<number, number>> = {};
  const notes: Record<string, Record<number, string>> = {};
  const saved: Record<string, 'draft' | 'confirmed'> = {};
  for (const name of classStudents) {
    try {
      const value = localStorage.getItem('dut-class-conduct-' + name);
      if (!value) continue;
      const draft = JSON.parse(value);
      grades[name] = draft.grades ?? {};
      notes[name] = draft.notes ?? {};
      saved[name] = draft.status === 'confirmed' ? 'confirmed' : 'draft';
    } catch {
      /* Ignore invalid local drafts. */
    }
  }
  return { grades, notes, saved };
}

function exportStudents() {
  const csv =
    '\uFEFFSTT,Họ tên,Lớp\r\n' +
    classStudents.map((name, index) => `${index + 1},${name},23T_DT4`).join('\r\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'danh-sach-danh-gia-ren-luyen.csv';
  link.click();
  URL.revokeObjectURL(url);
}

export function ClassAssessmentPage() {
  const [drafts] = useState(readClassDrafts);
  const [groupIndex, setGroupIndex] = useState(0);
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(classStudents[0]);
  const [grades, setGrades] = useState(drafts.grades);
  const [notes, setNotes] = useState(drafts.notes);
  const [saved, setSaved] = useState(drafts.saved);
  const filtered = useMemo(
    () =>
      classStudents.filter((name) =>
        `${name} ${studentNumber(name)}`
          .toLocaleLowerCase('vi')
          .includes(search.toLocaleLowerCase('vi')),
      ),
    [search],
  );
  const visible = filtered.slice((page - 1) * 10, page * 10);
  const currentGrades = grades[selected] ?? {};
  const count = Object.keys(currentGrades).length;
  const total = Object.values(currentGrades).reduce((sum, score) => sum + Number(score), 0);
  const save = (status: 'draft' | 'confirmed') => {
    localStorage.setItem(
      'dut-class-conduct-' + selected,
      JSON.stringify({ grades: currentGrades, notes: notes[selected] ?? {}, status }),
    );
    setSaved((current) => ({ ...current, [selected]: status }));
  };
  const choose = (name: string) => {
    setSelected(name);
    if (grades[name] || saved[name]) return;
    try {
      const draft = localStorage.getItem('dut-class-conduct-' + name);
      if (draft) {
        const value = JSON.parse(draft);
        setGrades((current) => ({ ...current, [name]: value.grades ?? {} }));
        setNotes((current) => ({ ...current, [name]: value.notes ?? {} }));
        setSaved((current) => ({ ...current, [name]: value.status ?? 'draft' }));
      }
    } catch {
      /* Ignore invalid local drafts. */
    }
  };
  const nextStudent = () => {
    const next = classStudents[(classStudents.indexOf(selected) + 1) % classStudents.length];
    choose(next);
  };

  return (
    <div className="space-y-5 text-ink">
      <PageHeading title="Đánh giá rèn luyện của lớp" />
      <Card className="!p-4">
        <div className="flex flex-wrap items-center gap-2">
          <label className="sr-only" htmlFor="class-term">
            Đợt đánh giá
          </label>
          <select id="class-term" className="!bg-subtle text-xs text-brand">
            <option>Đợt đánh giá: HK2 · 2025–2026</option>
          </select>
          <label className="sr-only" htmlFor="class-name">
            Lớp
          </label>
          <select id="class-name" className="!bg-subtle text-xs text-brand">
            <option>Lớp: 23T_DT4</option>
          </select>
          <Button
            variant="secondary"
            className="!text-xs"
            onClick={() =>
              document.getElementById('student-list')?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            Danh sách SV
          </Button>
          <Button variant="secondary" className="!text-xs" onClick={exportStudents}>
            Xuất danh sách
          </Button>
        </div>
        <form
          className="mt-3 flex flex-wrap gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            setSearch(query.trim());
            setPage(1);
          }}
        >
          <label className="sr-only" htmlFor="student-search">
            Nhập số thẻ hoặc họ tên sinh viên
          </label>
          <input
            id="student-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Nhập số thẻ hoặc họ tên sinh viên"
            className="w-full !bg-canvas sm:w-80"
          />
          <Button type="submit">Tìm</Button>
        </form>
      </Card>
      <div className="rounded-lg bg-warning-soft p-4 text-xs leading-5 text-warning">
        <strong>Thời gian cán bộ lớp đánh giá: 18/09/2026 – 29/09/2026</strong>
        <p>
          Không đánh giá sinh viên không học hoặc bị khóa website. Kiểm tra trạng thái trước khi
          chấm và xác nhận.
        </p>
      </div>

      <div className="v2-class-columns grid min-w-0 gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
        <Card id="student-list" className="h-fit !p-4">
          <h2 className="mb-3 font-semibold">Danh sách sinh viên</h2>
          <div className="space-y-1">
            {visible.length ? (
              visible.map((name) => {
                const number = classStudents.indexOf(name) + 1;
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => choose(name)}
                    className={`w-full rounded-lg p-3 text-left text-xs ${selected === name ? 'bg-subtle text-brand' : 'hover:bg-canvas'}`}
                  >
                    <strong className="block">
                      {number}. {name}
                    </strong>
                    <span className="mt-1 block text-xs text-muted">{studentNumber(name)}</span>
                    {saved[name] === 'confirmed' && (
                      <span className="text-xs text-success">Đã xác nhận</span>
                    )}
                  </button>
                );
              })
            ) : (
              <p className="p-3 text-xs text-muted">Không tìm thấy sinh viên.</p>
            )}
          </div>
          <div className="mt-4 flex gap-1" aria-label="Phân trang sinh viên">
            {Array.from(
              { length: Math.max(1, Math.ceil(filtered.length / 10)) },
              (_, index) => index + 1,
            ).map((number) => (
              <button
                type="button"
                key={number}
                aria-current={page === number ? 'page' : undefined}
                onClick={() => setPage(number)}
                className={`size-8 rounded-md text-xs ${page === number ? 'bg-action text-white' : 'bg-subtle text-brand'}`}
              >
                {number}
              </button>
            ))}
          </div>
        </Card>

        <Card className="min-w-0 !p-4">
          <h2 className="text-lg font-semibold">Nội dung đánh giá</h2>
          <p className="mt-1 font-semibold text-brand">
            {selected} · {studentNumber(selected)}
          </p>
          <p className="mt-1 text-xs text-muted">
            Đối chiếu điểm tự đánh giá và ghi chú trước khi nhập điểm lớp.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="secondary" className="!text-xs" onClick={() => save('draft')}>
              Lưu
            </Button>
            <Button
              className="!text-xs"
              onClick={() => save('confirmed')}
              disabled={count < allCriteria.length}
            >
              Xác nhận
            </Button>
            <Badge tone={saved[selected] === 'confirmed' ? 'success' : 'info'}>
              {saved[selected] === 'confirmed'
                ? 'Đã xác nhận'
                : count < allCriteria.length
                  ? 'Chưa hoàn tất'
                  : 'Sẵn sàng xác nhận'}
            </Badge>
          </div>
          <div className="mt-5">
            <label htmlFor="assessment-group" className="block text-sm font-medium">
              Nhóm tiêu chí
            </label>
            <select
              id="assessment-group"
              className="mt-2 w-full"
              value={groupIndex}
              onChange={(event) => setGroupIndex(Number(event.target.value))}
            >
              {criterionGroups.map((group, index) => (
                <option key={group.numeral} value={index}>
                  {group.numeral}. {group.title}
                </option>
              ))}
            </select>
          </div>
          <div
            className="mt-4 overflow-x-auto"
            role="region"
            aria-label="Phiếu chấm điểm lớp"
            tabIndex={0}
          >
            <table className="academic-table min-w-[700px]">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Nội dung tiêu chí</th>
                  <th>Tối đa</th>
                  <th>SV</th>
                  <th>Điểm lớp</th>
                  <th>Ghi chú</th>
                </tr>
              </thead>
              {criterionGroups.map((group, index) => (
                <tbody key={group.numeral} hidden={groupIndex !== index} data-criteria-group>
                  <tr>
                    <td colSpan={6} className="!bg-subtle !py-3 font-semibold text-brand-deep">
                      {group.numeral} · {group.title}{' '}
                      <span className="ml-2 text-xs font-normal text-muted">
                        0–{group.max} điểm · SV tự chấm:{' '}
                        {group.criteria.reduce((sum, item) => sum + item.score, 0)}
                      </span>
                    </td>
                  </tr>
                  {group.criteria.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>
                        <strong className="font-medium">{item.title}</strong>
                        <p className="mt-1 text-xs text-muted">{item.description}</p>
                      </td>
                      <td>{item.max}</td>
                      <td>{item.score}</td>
                      <td>
                        <input
                          aria-label={`Điểm lớp tiêu chí ${item.id}`}
                          type="number"
                          min="0"
                          max={item.max}
                          value={currentGrades[item.id] ?? ''}
                          disabled={saved[selected] === 'confirmed'}
                          onChange={(event) => {
                            const value = event.target.value;
                            setGrades((current) => {
                              const next = { ...(current[selected] ?? {}) };
                              if (value === '') delete next[item.id];
                              else next[item.id] = Math.max(0, Math.min(item.max, Number(value)));
                              return { ...current, [selected]: next };
                            });
                          }}
                          placeholder="—"
                          className="!w-16 !min-h-8 !bg-subtle !px-2 !py-1 text-center"
                        />
                      </td>
                      <td>
                        <input
                          aria-label={`Ghi chú tiêu chí ${item.id}`}
                          value={notes[selected]?.[item.id] ?? ''}
                          disabled={saved[selected] === 'confirmed'}
                          onChange={(event) =>
                            setNotes((current) => ({
                              ...current,
                              [selected]: {
                                ...(current[selected] ?? {}),
                                [item.id]: event.target.value,
                              },
                            }))
                          }
                          placeholder="Nhập ghi chú"
                          className="!w-28 !min-h-8 !px-2 !py-1 text-xs"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>
          </div>
          <div className="mt-5 rounded-lg bg-canvas p-4">
            <p className="font-semibold">
              Tổng điểm lớp: {count === allCriteria.length ? total : '--'} / 100 · Xếp loại:{' '}
              {count === allCriteria.length
                ? total >= 90
                  ? 'Xuất sắc'
                  : total >= 80
                    ? 'Tốt'
                    : total >= 65
                      ? 'Khá'
                      : 'Trung bình'
                : 'Chưa xác định'}
            </p>
            <p className="mt-1 text-xs text-muted">
              {count < allCriteria.length
                ? 'Phiếu chưa hoàn tất. Kiểm tra các tiêu chí còn thiếu trước khi xác nhận.'
                : 'Phiếu đã đủ điểm. Vui lòng xác nhận sau khi đối chiếu.'}
            </p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => save('draft')}>
              Lưu nháp
            </Button>
            <Button onClick={() => save('confirmed')} disabled={count < allCriteria.length}>
              Xác nhận đánh giá
            </Button>
            <Button variant="ghost" onClick={nextStudent}>
              Sinh viên tiếp theo →
            </Button>
          </div>
          {saved[selected] && (
            <p role="status" className="mt-3 text-xs text-success">
              {saved[selected] === 'confirmed'
                ? 'Đã xác nhận điểm rèn luyện của sinh viên.'
                : 'Đã lưu bản nháp trên trình duyệt.'}
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
