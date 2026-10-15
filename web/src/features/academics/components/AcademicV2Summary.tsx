import { Card } from '@/shared/ui/Card';

export function ProgramV2Summary({
  code,
  majorCode,
  student,
}: {
  code: string;
  majorCode: string;
  student: string;
}) {
  return (
    <Card className="v2-program-summary">
      <div className="v2-program-progress">
        <p className="v2-caption">Tiến độ tích lũy</p>
        <p>
          <strong>112</strong>
          <span> / 130 tín chỉ</span>
        </p>
        <progress value={112} max={130} aria-label="Tiến độ tích lũy tín chỉ" />
        <p className="v2-caption">Hoàn thành 86,2% chương trình</p>
      </div>
      <div className="v2-program-details">
        <div>
          {[
            ['Bắt buộc', '104 / 122', 'Còn 18 tín chỉ'],
            ['Tự chọn', '8 / 8', 'Đã hoàn thành'],
            ['GPA tích lũy', '3.69 / 4.0', 'Theo điểm công bố'],
          ].map(([label, value, hint]) => (
            <div key={label}>
              <p className="v2-caption">{label}</p>
              <strong>{value}</strong>
              <p className="v2-caption">{hint}</p>
            </div>
          ))}
        </div>
        <p className="v2-caption">
          Chương trình {code} <span>/</span> Ngành {majorCode} <span>/</span> 8 học kỳ
        </p>
        <p className="v2-caption">{student}</p>
      </div>
    </Card>
  );
}

export function GradesV2Summary({ results }: { results: { term: string; gpa: string }[] }) {
  return (
    <div className="v2-grades-summary">
      <section className="v2-gpa-summary">
        <p className="v2-caption">GPA tích lũy</p>
        <strong className="v2-gpa-value">3.69</strong>
        <p className="v2-caption">Thang 4.0 · Đến HK2, 2025 – 2026</p>
        <progress value={112} max={130} aria-label="Tín chỉ tích lũy" />
        <div>
          <p>
            <strong>112 / 130</strong>
            <small>Tín chỉ · Còn 18 tín chỉ</small>
          </p>
          <p>
            <strong>90 / 100</strong>
            <small>ĐRL · HK1, 2025 – 2026</small>
          </p>
        </div>
      </section>
      <figure className="v2-card v2-gpa-chart">
        <figcaption className="v2-section-heading">
          <h2>GPA qua các học kỳ</h2>
          <span>Kỳ gần nhất: {results.at(-1)?.gpa} / 4.0</span>
        </figcaption>
        <div className="v2-chart-bars">
          {results.map((item, index) => (
            <div key={item.term} className={index === results.length - 1 ? 'is-latest' : ''}>
              <span>{item.gpa}</span>
              <div
                className="v2-chart-bar"
                style={{ height: `${(Number(item.gpa) / 4) * 120}px` }}
              />
              <small>{item.term.split(' – ')[0]}</small>
            </div>
          ))}
        </div>
      </figure>
    </div>
  );
}
