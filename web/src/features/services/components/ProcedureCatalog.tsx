import { useState } from 'react';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { categories, requestTypes } from '../data/requestCatalog';
import { deliveryLabels, submissionLabels } from '../data/procedurePolicy';

export function ProcedureCatalog({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (id: string) => void;
}) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [department, setDepartment] = useState('');
  const [mode, setMode] = useState('');
  const [expanded, setExpanded] = useState(false);
  const matches = requestTypes.filter(
    (t) =>
      (!category || t.category === category) &&
      (!department || t.department === department) &&
      (!mode || t.submissionMode === mode) &&
      `${t.name} ${t.category}`.toLocaleLowerCase('vi').includes(query.toLocaleLowerCase('vi')),
  );
  const visible =
    expanded || query || category || department || mode ? matches : matches.slice(0, 6);
  return (
    <Card className="request-catalog">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs font-medium text-brand">01 · CHỌN THỦ TỤC</p>
          <h2 className="mt-1 text-lg font-semibold">Bạn cần giải quyết việc gì?</h2>
        </div>
        <span className="text-xs text-muted">{requestTypes.length} thủ tục · 5 nhóm dịch vụ</span>
      </div>
      <div className="request-filters">
        <label className="request-field">
          Tìm thủ tục
          <input
            type="search"
            placeholder="Ví dụ: chứng chỉ, bảng điểm…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <label className="request-field">
          Nhóm dịch vụ
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Tất cả nhóm</option>
            {categories.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <label className="request-field">
          Đơn vị tiếp nhận
          <select value={department} onChange={(e) => setDepartment(e.target.value)}>
            <option value="">Tất cả đơn vị</option>
            {['Đào tạo', 'Công tác sinh viên', 'Hỗ trợ CNTT'].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <label className="request-field">
          Kênh nộp
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="">Tất cả kênh</option>
            {Object.entries(submissionLabels).map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <ul className="request-catalog-list mt-4">
        {visible.map((t) => (
          <li key={t.id} data-selected={selected === t.id}>
            <div>
              <strong>{t.name}</strong>
              <p className="mt-1 text-xs text-muted">
                {t.department} · {submissionLabels[t.submissionMode]}
                {t.evidence ? ' · Cần minh chứng' : ''}
              </p>
              <p className="mt-1 text-xs text-muted">
                {deliveryLabels[t.resultDeliveryMode]}
                {t.requiresCampaign ? ' · Theo đợt đăng ký' : ''}
              </p>
            </div>
            <Button
              variant={selected === t.id ? 'primary' : 'secondary'}
              onClick={() => onSelect(t.id)}
              aria-label={`Chọn ${t.name}`}
            >
              {selected === t.id ? 'Đang chọn' : 'Chọn'}
            </Button>
          </li>
        ))}
      </ul>
      {!visible.length && (
        <p className="py-5 text-muted">Không tìm thấy thủ tục. Thử từ khóa hoặc nhóm khác.</p>
      )}
      {!query && !category && !department && !mode && (
        <Button variant="ghost" className="mt-3" onClick={() => setExpanded(!expanded)}>
          {expanded ? 'Thu gọn danh mục' : `Xem tất cả ${matches.length} thủ tục`}
        </Button>
      )}
    </Card>
  );
}
