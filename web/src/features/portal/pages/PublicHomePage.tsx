import { Dialog } from '@/shared/ui/Dialog';
import { usePortalEdition } from '@/shared/config/portalEdition';
import { PublicV2Header } from '../components/PublicV2Header';
import { PublicV2Hero } from '../components/PublicV2Hero';
import { V2Icon, type V2IconName } from '@/shared/ui/V2Icon';
import arrowIcon from '@/shared/assets/figma/public-arrow.svg';
import externalIcon from '@/shared/assets/figma/public-external.svg';
import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { paths } from '@/shared/config/routes';
import { BrandLockup } from '@/shared/ui/BrandLockup';
import { PublicFooter } from '../components/PublicFooter';
import { PublicHero } from '../components/PublicHero';
import { PublicSupport } from '../components/PublicSupport';
import programIcon from '@/shared/assets/figma/public-program.svg';
import coursesIcon from '@/shared/assets/figma/public-courses.svg';
import calendarIcon from '@/shared/assets/figma/public-calendar.svg';
import libraryIcon from '@/shared/assets/figma/public-library.svg';
import lmsIcon from '@/shared/assets/figma/public-lms.svg';
import oneStopIcon from '@/shared/assets/figma/public-one-stop.svg';
import searchIcon from '@/shared/assets/figma/public-search.svg';
import announcementSearchIcon from '@/shared/assets/figma/public-announcement-search.svg';

const services = [
  {
    title: 'Chương trình đào tạo',
    description: 'Tra cứu khung chương trình các ngành Kỹ sư, Cử nhân và Kiến trúc sư.',
    action: 'Tra cứu khung CTĐT',
    icon: programIcon,
    to: paths.courses,
  },
  {
    title: 'Danh mục học phần & Đề cương',
    description: 'Tìm mã học phần, số tín chỉ, học phần tiên quyết và song hành.',
    action: 'Xem đề cương chi tiết',
    icon: coursesIcon,
    to: paths.courses,
  },
  {
    title: 'Kế hoạch đào tạo năm học',
    description: 'Lịch tuần học vụ, đăng ký tín chỉ, thi giữa kỳ và các kỳ nghỉ.',
    action: 'Tải lịch đào tạo 2026–2027',
    icon: calendarIcon,
    to: paths.schedule,
  },
  {
    title: 'Thư viện số DUT',
    description: 'Giáo trình chuyên ngành, luận văn và các cơ sở dữ liệu học thuật.',
    action: 'lib.dut.udn.vn',
    icon: libraryIcon,
    href: 'https://lib.dut.udn.vn',
  },
  {
    title: 'Hệ thống học trực tuyến (LMS)',
    description: 'Nộp bài tập, thảo luận nhóm và truy cập tài nguyên lớp tín chỉ.',
    action: 'lms.dut.udn.vn',
    icon: lmsIcon,
    href: 'https://lms.dut.udn.vn',
  },
  {
    title: 'Cổng dịch vụ một cửa',
    description: 'Đăng ký giấy xác nhận, bảng điểm tạm thời và gửi yêu cầu hỗ trợ.',
    action: 'Truy cập dịch vụ công',
    icon: oneStopIcon,
    to: paths.login,
  },
] as const;

const announcements = [
  {
    day: '15',
    month: 'THÁNG 9',
    category: 'Phòng Đào tạo',
    tag: 'Đại học',
    title:
      'THÔNG BÁO THU HỌC PHÍ HỌC KỲ I NĂM HỌC 2026–2027 (ÁP DỤNG ĐỐI VỚI SINH VIÊN CÁC KHÓA TUYỂN SINH 2023 TRỞ VỀ TRƯỚC)',
    summary:
      'Thông báo thời gian và hình thức nộp học phí học kỳ I năm học 2026–2027, áp dụng cho các khóa tuyển sinh 2023 trở về trước.',
  },
  {
    day: '12',
    month: 'THÁNG 9',
    category: 'Phòng Đào tạo',
    tag: 'Học vụ',
    title: 'Kế hoạch xử lý và hoàn tất quá trình học kỳ 2 năm học 2025–2026',
    summary:
      'Sinh viên kiểm tra kết quả học tập, phản hồi sai sót và hoàn thành các thủ tục học vụ đúng hạn.',
  },
  {
    day: '10',
    month: 'THÁNG 9',
    category: 'Trung tâm Học liệu & CNTT',
    tag: 'Hệ thống',
    title: 'Thông báo kiểm tra trình độ tiếng Anh đầu vào cho sinh viên khóa 2026',
    summary:
      'Danh sách phòng thi, thời gian làm bài và hướng dẫn kiểm tra thiết bị đã được cập nhật.',
  },
  {
    day: '07',
    month: 'THÁNG 9',
    category: 'Phòng Đào tạo',
    tag: 'Đăng ký môn học',
    title: 'Thông báo về việc đăng ký học ghép lớp học phần với khóa 2026',
    summary: 'Sinh viên xem điều kiện đăng ký, thời hạn xử lý và biểu mẫu đề nghị học ghép.',
  },
] as const;

function PublicHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/95 shadow-[0_1px_4px_rgba(15,23,42,0.04)] backdrop-blur">
      <div className="page-shell flex min-h-20 items-center justify-between gap-4">
        <BrandLockup to={paths.home} />
        <nav aria-label="Điều hướng cổng thông tin" className="hidden items-center gap-1 lg:flex">
          <a
            href="#trang-chu"
            className="rounded-lg bg-action px-3 py-2 text-xs font-medium text-white"
          >
            Trang chủ
          </a>
          <a
            href="#dich-vu"
            className="rounded-lg px-3 py-2 text-xs text-ink hover:bg-subtle hover:text-brand"
          >
            Chương trình
          </a>
          <a
            href="#thong-bao"
            className="rounded-lg px-3 py-2 text-xs text-ink hover:bg-subtle hover:text-brand"
          >
            Kế hoạch
          </a>
          <a
            href="#tra-cuu"
            className="rounded-lg px-3 py-2 text-xs text-ink hover:bg-subtle hover:text-brand"
          >
            Danh sách
          </a>
          <a
            href="#ho-tro"
            className="rounded-lg px-3 py-2 text-xs text-ink hover:bg-subtle hover:text-brand"
          >
            Hỗ trợ
          </a>
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <a
            href="#thong-bao"
            className="hidden min-h-9 items-center gap-2 rounded-full bg-subtle px-3 text-xs text-muted md:flex"
          >
            <img src={searchIcon} alt="" className="shrink-0" />
            <span>Tìm kiếm…</span>
          </a>
          <a
            href="#microsoft-sign-in"
            className="inline-flex min-h-9 items-center rounded-lg border border-brand bg-action px-4 text-xs font-semibold text-white hover:bg-brand-hover"
          >
            Đăng nhập
          </a>
        </div>
      </div>
      <nav
        aria-label="Điều hướng nhanh trên di động"
        className="flex gap-1 overflow-x-auto border-t border-line/60 px-4 py-2 lg:hidden"
      >
        {[
          ['Trang chủ', '#trang-chu'],
          ['Dịch vụ', '#dich-vu'],
          ['Thông báo', '#thong-bao'],
          ['Tra cứu', '#tra-cuu'],
          ['Hỗ trợ', '#ho-tro'],
        ].map(([label, href]) => (
          <a
            key={href}
            href={href}
            className="shrink-0 rounded-full px-3 py-1.5 text-xs text-muted hover:bg-subtle hover:text-brand"
          >
            {label}
          </a>
        ))}
      </nav>
    </header>
  );
}

function ServiceCard({ service }: { service: (typeof services)[number] }) {
  const v2 = usePortalEdition() === 'v2';
  const v2Icons: Record<string, V2IconName> = {
    'Chương trình đào tạo': 'book',
    'Danh mục học phần & Đề cương': 'file',
    'Kế hoạch đào tạo năm học': 'calendar',
    'Thư viện số DUT': 'book',
    'Hệ thống học trực tuyến (LMS)': 'chart',
    'Cổng dịch vụ một cửa': 'users',
  };
  const body = v2 ? (
    <>
      <div className="v2-public-service-title">
        <V2Icon name={v2Icons[service.title]} tone="action" />
        <h3>{service.title}</h3>
        {'href' in service && <img src={externalIcon} alt="" />}
      </div>
      <p className="mt-3 text-muted">{service.description}</p>
      <span className="mt-auto pt-5 text-brand text-[13px] font-medium">{service.action}</span>
    </>
  ) : (
    <>
      <div className="flex flex-wrap items-start gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-subtle">
          {v2 ? (
            <V2Icon name={v2Icons[service.title]} tone="action" />
          ) : (
            <img src={service.icon} alt="" />
          )}
        </span>
        <div className="min-w-0 flex-1 basis-40">
          <h3 className="flex items-start justify-between gap-2 text-base font-semibold">
            {service.title}
            {'href' in service && <img src={externalIcon} alt="" className="mt-1 shrink-0" />}
          </h3>
          <p className="mt-2 text-sm leading-5 text-muted">{service.description}</p>
        </div>
      </div>
      <span className="mt-5 flex items-center justify-between gap-3 pt-3 text-sm font-medium text-brand-secondary">
        <span className="min-w-0 break-words">{service.action}</span>
        <img src={arrowIcon} alt="" className="shrink-0" />
      </span>
    </>
  );
  const className =
    'interactive-card flex min-h-40 min-w-0 flex-col justify-between rounded-xl border border-line bg-surface p-6 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand';
  return 'href' in service ? (
    <a href={service.href} target="_blank" rel="noreferrer" className={className}>
      {body}
    </a>
  ) : (
    <Link to={service.to} className={className}>
      {body}
    </Link>
  );
}

export function PublicHomePage() {
  const v2 = usePortalEdition() === 'v2';
  const [query, setQuery] = useState('');
  const [announcement, setAnnouncement] = useState<(typeof announcements)[number] | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [category, setCategory] = useState('Tất cả thông báo');
  const filteredAnnouncements = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('vi');
    return announcements.filter((item) => {
      const matchesCategory = category === 'Tất cả thông báo' || item.category === category;
      const matchesQuery =
        !normalized || `${item.title} ${item.summary}`.toLocaleLowerCase('vi').includes(normalized);
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  return (
    <div className="page-enter min-h-dvh bg-canvas text-ink">
      {v2 ? <PublicV2Header /> : <PublicHeader />}
      <main>
        {v2 ? <PublicV2Hero /> : <PublicHero />}

        <section id="dich-vu" className="scroll-mt-28 py-10">
          <div className="page-shell">
            <p className="text-xs font-semibold  text-brand-secondary">Cổng dịch vụ nhanh</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-brand-deep">
              Tra cứu &amp; Hệ thống Trực tuyến
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <ServiceCard key={service.title} service={service} />
              ))}
            </div>
          </div>
        </section>

        <section id="thong-bao" className="scroll-mt-28 bg-subtle/75 py-10">
          <div className="page-shell">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-semibold  text-brand-secondary">Bản tin học vụ</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-brand-deep">
                  Thông Báo Học Vụ &amp; Công Tác Sinh Viên
                </h2>
              </div>
              <div className="flex flex-wrap gap-1 text-xs text-muted" aria-label="Nhóm thông báo">
                {['Lịch học', 'Thi cử', 'Học bổng', 'Khác'].map((label) => (
                  <span key={label} className="rounded-md bg-surface px-2 py-1">
                    {label}
                  </span>
                ))}
              </div>
            </div>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                resultsRef.current?.focus();
              }}
              className="mt-5 flex flex-col gap-3 rounded-xl border border-line/70 bg-surface p-4 shadow-[0_1px_2px_rgba(15,23,42,0.05)] md:flex-row"
            >
              <label className="flex min-h-10 flex-1 items-center gap-2 rounded-lg border border-line bg-canvas px-3">
                <img src={announcementSearchIcon} alt="" className="shrink-0" />
                <span className="sr-only">Tìm thông báo</span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Tìm kiếm thông báo theo tiêu đề, từ khóa…"
                  className="!min-h-0 w-full !border-0 !bg-transparent !p-0 text-xs"
                />
              </label>
              <label className="flex min-w-0 flex-wrap items-center gap-2 text-xs text-muted">
                <span>Danh mục:</span>
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="min-w-0 flex-1 text-xs"
                >
                  <option>Tất cả thông báo</option>
                  <option>Phòng Đào tạo</option>
                  <option>Trung tâm Học liệu &amp; CNTT</option>
                </select>
              </label>
              <button
                type="submit"
                className="min-h-10 rounded-lg bg-action px-5 text-xs font-semibold text-white hover:bg-brand-hover"
              >
                Lọc tin
              </button>
            </form>
            <div
              ref={resultsRef}
              tabIndex={-1}
              aria-label="Kết quả thông báo"
              className="mt-4 scroll-mt-36 space-y-3 rounded-xl"
            >
              {filteredAnnouncements.length ? (
                filteredAnnouncements.map((item, index) => (
                  <article
                    key={item.title}
                    className="grid gap-4 rounded-xl border border-line/60 bg-surface p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:grid-cols-[4rem_minmax(0,1fr)_auto] sm:items-start"
                  >
                    <time className="grid min-h-16 w-16 place-items-center rounded-lg bg-subtle text-center text-brand">
                      <span className="block text-lg font-bold leading-5">{item.day}</span>
                      <span className="block text-xs font-semibold leading-3">{item.month}</span>
                    </time>
                    <div className="min-w-0">
                      <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wide text-muted">
                        <span>{item.category}</span>
                        <span aria-hidden="true">•</span>
                        <span className="text-brand-secondary">{item.tag}</span>
                        {index === 0 && (
                          <span className="rounded bg-danger-soft px-1.5 text-danger">Mới</span>
                        )}
                      </div>
                      <h3 className="mt-2 text-sm font-semibold leading-5 text-ink">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-xs leading-5 text-muted">{item.summary}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAnnouncement(item)}
                      className="justify-self-start rounded-lg bg-subtle px-3 py-2 text-xs font-semibold text-brand sm:justify-self-end"
                    >
                      {index === 0 ? 'Xem chi tiết' : 'Chi tiết'}
                    </button>
                  </article>
                ))
              ) : (
                <p className="rounded-xl border border-dashed border-line bg-surface p-8 text-center text-sm text-muted">
                  Không tìm thấy thông báo phù hợp. Hãy thử từ khóa hoặc danh mục khác.
                </p>
              )}
            </div>
            <div className="mt-4 flex flex-col justify-between gap-3 rounded-xl border border-line/70 bg-surface p-4 text-xs text-muted sm:flex-row sm:items-center">
              <p role="status">
                Hiển thị {filteredAnnouncements.length} trên tổng số {announcements.length} thông
                báo
              </p>
            </div>
          </div>
        </section>

        <PublicSupport />
      </main>
      <PublicFooter />
      {announcement && (
        <Dialog title={announcement.title} onClose={() => setAnnouncement(null)}>
          <p className="mb-4 text-xs text-muted">
            {announcement.category} · {announcement.day}/09/2026 · {announcement.tag}
          </p>
          <p className="leading-relaxed">{announcement.summary}</p>
        </Dialog>
      )}
    </div>
  );
}
