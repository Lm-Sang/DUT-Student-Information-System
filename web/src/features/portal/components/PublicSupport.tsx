import { Link } from 'react-router-dom';
import { paths } from '@/shared/config/routes';
import shieldIcon from '@/shared/assets/figma/public-lookup-shield.svg';
import languageIcon from '@/shared/assets/figma/public-language.svg';
import diplomaIcon from '@/shared/assets/figma/public-diploma.svg';
import directoryIcon from '@/shared/assets/figma/public-support-directory.svg';
import trainingIcon from '@/shared/assets/figma/public-training-office.svg';
import studentIcon from '@/shared/assets/figma/public-student-office.svg';
import financeIcon from '@/shared/assets/figma/public-finance-office.svg';
import itIcon from '@/shared/assets/figma/public-it-office.svg';
import lookupArrow from '@/shared/assets/figma/home-icon-05.svg';

const lookups = [
  {
    title: 'Chuẩn Ngoại Ngữ & CNTT',
    description:
      'Tra cứu danh sách sinh viên đã nộp chứng chỉ quốc tế hợp lệ (TOEIC, IELTS, TOEFL, MOS, UD-IC) được hậu kiểm.',
    action: 'Tra cứu chứng chỉ',
    icon: languageIcon,
    tone: 'bg-subtle',
  },
  {
    title: 'Văn Bằng Tốt Nghiệp',
    description:
      'Xác thực số hiệu bằng Kỹ sư, Cử nhân, quyết định công nhận tốt nghiệp các đợt trong năm dành cho nhà tuyển dụng.',
    action: 'Xác minh bằng cấp',
    icon: diplomaIcon,
    tone: 'bg-warning-soft',
  },
];
const contacts = [
  {
    title: 'Phòng Đào tạo (P. 107)',
    phone: '(0236) 3842 308',
    href: 'tel:02363842308',
    icon: trainingIcon,
  },
  {
    title: 'Phòng Công tác Sinh viên',
    phone: '(0236) 3738 690',
    href: 'tel:02363738690',
    icon: studentIcon,
  },
  {
    title: 'Phòng Kế hoạch Tài chính',
    phone: '(0236) 3842 112',
    href: 'tel:02363842112',
    icon: financeIcon,
  },
  {
    title: 'Trung tâm Học liệu & CNTT',
    phone: '(0236) 3842 455',
    href: 'tel:02363842455',
    icon: itIcon,
  },
];

export function PublicSupport() {
  return (
    <section id="tra-cuu" className="scroll-mt-28 py-10">
      <div className="page-shell grid min-w-0 gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <section className="min-w-0" aria-labelledby="public-lookups-title">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-brand-secondary">
                Tra cứu văn bằng &amp; chuẩn đầu ra
              </p>
              <h2 id="public-lookups-title" className="mt-1 text-xl font-semibold text-brand-deep">
                Cơ Sở Dữ Liệu Công Khai
              </h2>
            </div>
            <img src={shieldIcon} alt="" className="shrink-0" />
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {lookups.map((item) => (
              <Link
                key={item.title}
                to={paths.login}
                className="interactive-card flex min-w-0 flex-col rounded-xl border border-line bg-surface p-6"
              >
                <span className={`mb-3 grid size-10 place-items-center rounded-lg ${item.tone}`}>
                  <img src={item.icon} alt="" />
                </span>
                <h3 className="text-base font-semibold">{item.title}</h3>
                <p className="mb-5 mt-2 text-sm leading-6 text-muted">{item.description}</p>
                <span className="mt-auto flex min-h-10 items-center justify-between gap-3 rounded-lg bg-subtle px-4 py-2 text-sm font-semibold text-brand-deep">
                  {item.action}
                  <img src={lookupArrow} alt="" className="shrink-0" />
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-action-deep px-5 py-4 text-white">
            <div className="min-w-0 flex-1 basis-60">
              <p className="text-sm font-semibold">Cảnh báo đánh mất thông tin đăng nhập</p>
              <p className="mt-1 text-xs text-white/90">
                Học viên chỉ đăng nhập tại tên miền chính thức của Nhà trường.
              </p>
            </div>
            <a
              href="#ho-tro"
              className="inline-flex min-h-10 items-center rounded-lg bg-surface px-4 py-2 text-xs font-semibold text-brand-deep hover:bg-subtle"
            >
              Liên hệ hỗ trợ
            </a>
          </div>
        </section>
        <section
          id="ho-tro"
          className="min-w-0 scroll-mt-28"
          aria-labelledby="public-support-title"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-brand-secondary">Đường dây nóng hỗ trợ</p>
              <h2 id="public-support-title" className="mt-1 text-xl font-semibold text-brand-deep">
                Bộ Phận Nghiệp Vụ
              </h2>
            </div>
            <img src={directoryIcon} alt="" className="shrink-0" />
          </div>
          <dl className="mt-4 space-y-3 rounded-xl border border-line bg-surface p-4">
            {contacts.map((contact) => (
              <div
                key={contact.title}
                className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-lg bg-subtle/75 p-3"
              >
                <dt className="flex min-w-0 flex-1 basis-44 items-center gap-3 text-sm font-medium">
                  <img src={contact.icon} alt="" className="shrink-0" />
                  {contact.title}
                </dt>
                <dd>
                  <a
                    href={contact.href}
                    className="inline-flex min-h-10 items-center text-xs font-semibold text-brand-deep hover:underline"
                  >
                    {contact.phone}
                  </a>
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </section>
  );
}
