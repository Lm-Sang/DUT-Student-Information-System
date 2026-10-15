import { useState } from 'react';
import {
  AcademicPageTitle,
  AcademicPanel,
  AcademicSectionHeading,
  AcademicTable,
  AcademicTabs,
} from '../components/AcademicUi';
import { Button } from '@/shared/ui/Button';

const defaults = [
  { label: 'PI 1.1 · Chỉ số minh họa 1', score: '8.00', weight: '40' },
  { label: 'PI 1.2 · Chỉ số minh họa 2', score: '7.00', weight: '35' },
  { label: 'PI 1.3 · Chỉ số minh họa 3', score: '8.00', weight: '25' },
];

export function PloPage() {
  const [items, setItems] = useState(defaults);
  const [result, setResult] = useState<number | null>(7.65);
  const [message, setMessage] = useState('');
  const totalWeight = items.reduce((sum, item) => sum + (Number(item.weight) || 0), 0);
  function update(index: number, key: 'score' | 'weight', value: string) {
    setItems((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item)),
    );
    setMessage('');
  }
  function calculate() {
    if (
      items.some(
        (item) =>
          item.score === '' ||
          item.weight === '' ||
          Number(item.score) < 0 ||
          Number(item.score) > 10 ||
          Number(item.weight) < 0,
      ) ||
      totalWeight !== 100
    ) {
      setMessage('Nhập điểm PI từ 0 đến 10 và bảo đảm tổng trọng số bằng 100%.');
      return;
    }
    setResult(items.reduce((sum, item) => sum + Number(item.score) * Number(item.weight), 0) / 100);
    setMessage('Đã tính lại điểm minh họa.');
  }
  return (
    <div className="text-ink">
      <AcademicPageTitle
        title="Chuẩn đầu ra & điểm PLO"
        subtitle="Theo dõi mức độ đạt chuẩn đầu ra và tính thử theo trọng số đánh giá."
      />
      <AcademicTabs />
      <div className="space-y-6">
        <AcademicPanel>
          <AcademicSectionHeading>Kết quả đánh giá chuẩn đầu ra</AcademicSectionHeading>
          <span className="inline-block rounded bg-subtle px-2 py-1 text-xs text-muted">
            Chưa công bố
          </span>
          <p className="mt-4 text-[0.8125rem] text-muted">
            Kết quả PLO được tổng hợp từ dữ liệu CLO/PI của các học phần cốt lõi theo chương trình
            đào tạo. Bạn có thể tính thử bên dưới trong khi chờ kết quả chính thức.
          </p>
        </AcademicPanel>
        <AcademicPanel>
          <AcademicSectionHeading>Tính thử điểm PLO</AcademicSectionHeading>
          <p className="text-[0.8125rem] font-medium text-brand">
            Ví dụ minh họa · PLO 1 · Thang điểm 10 · Ba chỉ số PI
          </p>
          <p className="mt-4 text-[0.8125rem]">PLO = Σ(Điểm PI × Trọng số PI) / Σ Trọng số PI</p>
          <p className="my-4 text-xs text-muted">
            Trọng số, ngưỡng đạt và danh mục PI thực tế được xác định theo chương trình đào tạo của
            bạn.
          </p>
          <AcademicTable label="Tính thử điểm PLO" minWidth={650}>
            <thead>
              <tr>
                <th>Chỉ số đánh giá</th>
                <th>Điểm PI (0–10)</th>
                <th>Trọng số (%)</th>
                <th>Điểm đóng góp</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.label}>
                  <td className="font-medium">{item.label}</td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.01"
                      aria-label={`Điểm ${item.label}`}
                      className="!min-h-9 !w-28"
                      value={item.score}
                      onChange={(event) => update(index, 'score', event.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      aria-label={`Trọng số ${item.label}`}
                      className="!min-h-9 !w-28"
                      value={item.weight}
                      onChange={(event) => update(index, 'weight', event.target.value)}
                    />
                  </td>
                  <td>{((Number(item.score) * Number(item.weight)) / 100).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </AcademicTable>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs">
            <span className={totalWeight === 100 ? 'text-success' : 'text-danger'}>
              Tổng trọng số: {totalWeight}%
            </span>
            <span className="text-muted">Ngưỡng mục tiêu minh họa: 5.00 / 10</span>
          </div>
          <div className="my-4 flex gap-2">
            <Button className="!min-h-9 !px-3 !py-1 !text-[0.8125rem]" onClick={calculate}>
              Tính điểm
            </Button>
            <Button
              variant="secondary"
              className="!min-h-9 !border-0 !bg-subtle !px-3 !py-1 !text-[0.8125rem]"
              onClick={() => (result === null ? calculate() : setResult(null))}
            >
              {result === null ? 'Hiện kết quả' : 'Ẩn kết quả'}
            </Button>
          </div>
          {message && (
            <p
              role="status"
              className={`mb-3 text-xs ${message.startsWith('Nhập') ? 'text-danger' : 'text-success'}`}
            >
              {message}
            </p>
          )}
          {result !== null && (
            <div className="flex flex-wrap items-center justify-between gap-4 bg-subtle p-4">
              <div>
                <p className="font-semibold">Kết quả tính thử · PLO 1</p>
                <p className="mt-1 text-[0.8125rem]">
                  (
                  {items
                    .map((item) => `${Number(item.score).toFixed(2)} × ${item.weight}`)
                    .join(' + ')}
                  ) / 100 = {result.toFixed(2)}
                </p>
                <p className="mt-1 text-xs text-muted">
                  {result >= 5 ? 'Đạt mục tiêu minh họa' : 'Chưa đạt mục tiêu minh họa'} · Đây không
                  phải kết quả xét chuẩn đầu ra chính thức.
                </p>
              </div>
              <strong className="text-[1.75rem] text-brand">{result.toFixed(2)} / 10</strong>
            </div>
          )}
        </AcademicPanel>
        <AcademicPanel>
          <AcademicSectionHeading>Cách đọc kết quả</AcademicSectionHeading>
          <ol className="list-inside list-decimal space-y-1 text-[0.8125rem] text-muted">
            <li>Điểm PI được tổng hợp từ minh chứng đánh giá của các học phần được phân nhiệm.</li>
            <li>
              Kiểm tra đủ dữ liệu và tổng trọng số trước khi tính; điểm thiếu không được tự quy về
              0.
            </li>
            <li>
              Đối chiếu điểm PLO với ngưỡng đạt của chương trình và kết quả đã được nhà trường công
              bố.
            </li>
          </ol>
          <div className="mt-5 flex flex-wrap gap-6 text-[0.8125rem] text-brand">
            <span>Đánh giá CLO/PLO tại DUT</span>
            <span>Tham khảo cách tính PLO · UTE</span>
          </div>
        </AcademicPanel>
      </div>
    </div>
  );
}
