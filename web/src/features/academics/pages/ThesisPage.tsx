import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AcademicPageTitle, AcademicPanel } from '../components/AcademicUi';
import { Button } from '@/shared/ui/Button';
import { paths } from '@/shared/config/routes';
import thesisIcon from '@/shared/assets/figma/academic-thesis-empty.svg';

export function ThesisPage() {
  const [term, setTerm] = useState('HK1 · 2026 – 2027');
  const navigate = useNavigate();
  return (
    <div className="space-y-6 text-ink">
      <div>
        <AcademicPageTitle
          title="Đồ án / Khóa luận tốt nghiệp"
          subtitle="Lê Minh Sang · 102230369 · 23T_DT4"
        />
        <div className="flex flex-wrap gap-3">
          <select
            aria-label="Chọn học kỳ đồ án"
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            className="!min-h-9 !border-0 !bg-subtle !text-[0.8125rem] text-brand"
          >
            <option>HK1 · 2026 – 2027</option>
            <option>HK2 · 2025 – 2026</option>
          </select>
          <Button
            className="!min-h-9 !px-3 !py-1 !text-[0.8125rem]"
            onClick={() => navigate(`${paths.thesisDetails}?term=${encodeURIComponent(term)}`)}
          >
            Xem dữ liệu
          </Button>
        </div>
      </div>
      <AcademicPanel className="flex min-h-72 flex-col items-center justify-center !py-14 text-center">
        <img src={thesisIcon} alt="" width="48" height="48" />
        <h2 className="mt-4 text-[1.0625rem] font-semibold">
          Bạn không làm đồ án trong học kỳ này
        </h2>
        <p className="mt-3 text-sm text-muted">
          Chọn học kỳ khác để xem thông tin đồ án đã được phân công.
        </p>
        <Link
          to={paths.courses}
          className="mt-4 rounded-lg bg-subtle px-3 py-2 text-[0.8125rem] font-medium text-brand hover:bg-line"
        >
          Xem khung chương trình
        </Link>
      </AcademicPanel>
      <div className="rounded-lg bg-subtle p-5 text-[0.8125rem]">
        <p className="font-semibold">Thông tin đồ án chưa chính xác?</p>
        <p className="mt-1 text-muted">
          Liên hệ khoa hoặc Phòng Đào tạo để kiểm tra học phần được phân công.
        </p>
      </div>
    </div>
  );
}
