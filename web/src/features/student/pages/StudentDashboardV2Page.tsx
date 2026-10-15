import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStudentProfile } from '../hooks/useStudentProfile';
import { todayClasses } from '../data/dashboard.data';
import { EmptyState, ErrorState, LoadingState } from '@/shared/ui/FeedbackStates';
import { Dialog } from '@/shared/ui/Dialog';
import { V2Icon, type V2IconName } from '@/shared/ui/V2Icon';
import { paths } from '@/shared/config/routes';
import ringTrack from '@/shared/assets/figma-v2/67146.svg';
import ringProgress from '@/shared/assets/figma-v2/24c2f.svg';
import ringCenter from '@/shared/assets/figma-v2/e3198.svg';

const quickActions: { label: string; to: string; icon: V2IconName }[] = [
  { label: 'Bảng điểm kỳ', to: paths.gradesCurrent, icon: 'chart' },
  { label: 'Lịch thi cuối kỳ', to: paths.schedule, icon: 'calendar' },
  { label: 'Khung CTĐT', to: paths.courses, icon: 'book' },
  { label: 'Nộp đơn trực tuyến', to: paths.serviceRequests, icon: 'file' },
];

function downloadCalendar() {
  const events = todayClasses.map((lesson, index) => {
    const start = lesson.time.replace(':', '') + '00';
    const end = ['084000', '105500', '165000'][index];
    return [
      'BEGIN:VEVENT',
      `UID:dut-20260914-${index}@sv.dut.udn.vn`,
      'DTSTAMP:20260914T000000Z',
      `DTSTART;TZID=Asia/Ho_Chi_Minh:20260914T${start}`,
      `DTEND;TZID=Asia/Ho_Chi_Minh:20260914T${end}`,
      `SUMMARY:${lesson.title}`,
      `LOCATION:${lesson.room}`,
      'END:VEVENT',
    ].join('\r\n');
  });
  const blob = new Blob(
    [
      [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//DUT//Student Portal//VI',
        ...events,
        'END:VCALENDAR',
      ].join('\r\n'),
    ],
    { type: 'text/calendar;charset=utf-8' },
  );
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'dut-lich-hoc-2026-09-14.ics';
  anchor.click();
  URL.revokeObjectURL(url);
}

export function StudentDashboardV2Page() {
  const { data: profile, loading, error, reload } = useStudentProfile();
  const [dialog, setDialog] = useState<'student-card' | number | null>(null);
  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!profile) return <EmptyState />;
  return (
    <div className="v2-dashboard">
      <div className="v2-home-grid">
        <section className="v2-welcome">
          <p className="v2-caption">Thứ Hai, 14 tháng 9, 2026 · Lịch mẫu</p>
          <h1>Xin chào, {profile.fullName}!</h1>
          <p>{profile.major} · Khoa Công nghệ Thông tin</p>
          <div className="v2-welcome-bottom">
            <span>
              {profile.studentId} <i>/</i> {profile.className} <i>/</i> Năm 4
            </span>
            <a
              href="https://www.microsoft365.com"
              target="_blank"
              rel="noreferrer"
              className="v2-text-action"
            >
              OneDrive
            </a>
            <button
              type="button"
              className="v2-text-action"
              onClick={() => setDialog('student-card')}
            >
              Thẻ SV điện tử
            </button>
          </div>
        </section>
        <section className="v2-card v2-today">
          <div className="v2-section-heading">
            <h2>Lịch học hôm nay</h2>
            <Link to={paths.schedule} className="v2-text-action">
              Xem cả tuần
            </Link>
          </div>
          <p className="v2-caption">
            Tuần 3, học kỳ 1 <span>·</span> 3 học phần
          </p>
          <ol className="v2-lessons">
            {todayClasses.map((item, index) => (
              <li key={item.time} className={index === 0 ? 'is-current' : ''}>
                <time dateTime={`2026-09-14T${item.time}+07:00`}>
                  <strong>{item.time}</strong>
                  <small>{item.periods}</small>
                </time>
                <div className="v2-lesson-subject">
                  <div>
                    <h3>{item.title}</h3>
                    {index === 0 && <span className="v2-status">Ca học đầu ngày</span>}
                  </div>
                  <p className="v2-caption">
                    {item.room} <span>·</span> GV: {item.lecturer}
                  </p>
                </div>
                <button type="button" className="v2-text-action" onClick={() => setDialog(index)}>
                  Đề cương
                </button>
              </li>
            ))}
          </ol>
          <div className="v2-section-heading">
            <button type="button" className="v2-text-action" onClick={downloadCalendar}>
              Tải lịch (.ics)
            </button>
            <Link to={paths.schedule} className="v2-text-action">
              Thời khóa biểu đầy đủ
            </Link>
          </div>
        </section>
        <div className="v2-home-aside">
          <section className="v2-card v2-news">
            <div className="v2-section-heading">
              <h2>Thông báo mới</h2>
              <Link to={paths.notifications} className="v2-text-action">
                Tất cả
              </Link>
            </div>
            <Link to={paths.notifications}>
              <div>
                <span>Khoa CNTT</span>
                <time dateTime="2026-09-12">12/09</time>
              </div>
              <h3>Kế hoạch bảo vệ Đồ án tốt nghiệp &amp; PBL 6 đầu kỳ 1</h3>
              <p className="v2-caption">Đính kèm 2 tài liệu PDF</p>
            </Link>
            <Link to={paths.notifications}>
              <div>
                <span>Khảo thí</span>
                <time dateTime="2026-09-08">08/09</time>
              </div>
              <h3>Đăng ký thi VSTEP đợt 10/2026</h3>
              <p className="v2-caption">Hạn đăng ký: 28/09</p>
            </Link>
          </section>
          <section className="v2-card v2-quick-actions">
            <h2>Truy cập nhanh</h2>
            <div>
              {quickActions.map((item) => (
                <Link key={item.to} to={item.to}>
                  <V2Icon name={item.icon} tone="action" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </section>
        </div>
        <section className="v2-card v2-requirements">
          <h2>Chuẩn đầu ra &amp; rèn luyện</h2>
          <div className="v2-requirements-content">
            <div className="v2-ring" role="img" aria-label="Đã hoàn thành 3 trong 4 yêu cầu">
              <img src={ringTrack} alt="" width="104" height="104" />
              <img src={ringProgress} alt="" width="104" height="104" />
              <img src={ringCenter} alt="" width="84" height="84" />
              <span>
                <strong>3/4</strong>
                <small>đã hoàn thành</small>
              </span>
            </div>
            <div>
              <p>Còn đánh giá rèn luyện</p>
              <p className="v2-caption">Hạn trong dữ liệu mẫu: 25/09</p>
              <Link to={paths.conductSelf} className="v2-button v2-button--secondary">
                Thực hiện đánh giá
              </Link>
            </div>
          </div>
        </section>
      </div>
      <section className="v2-card v2-milestones">
        <div className="v2-section-heading">
          <h2>Tiến độ hoàn thành</h2>
          <p className="v2-caption">Khóa 2023 · Đợt tốt nghiệp 2027</p>
        </div>
        <div>
          {[
            ['Ngoại ngữ B2 (VSTEP)', 'Đã duyệt'],
            ['Chứng chỉ Tin học', 'Đã đạt chuẩn'],
            ['GDTC & GDQP-AN', 'Hoàn thành'],
            ['Đánh giá rèn luyện', 'Hạn 25/09'],
          ].map(([label, status], index) => (
            <Link
              key={label}
              to={index === 3 ? paths.conductSelf : paths.grades}
              className={index === 3 ? 'is-due' : ''}
            >
              <span className="v2-milestone-icon">
                <V2Icon name={index === 3 ? 'due' : 'completed'} />
              </span>
              <span>
                <strong>{label}</strong>
                <small>{status}</small>
              </span>
            </Link>
          ))}
        </div>
      </section>
      {dialog !== null && (
        <Dialog
          title={
            dialog === 'student-card'
              ? 'Thẻ sinh viên điện tử'
              : `Đề cương · ${todayClasses[dialog].title}`
          }
          onClose={() => setDialog(null)}
        >
          {dialog === 'student-card' ? (
            <dl className="space-y-3">
              <div>
                <dt>Họ tên</dt>
                <dd className="font-semibold">{profile.fullName}</dd>
              </div>
              <div>
                <dt>Mã sinh viên · Lớp</dt>
                <dd>
                  {profile.studentId} · {profile.className}
                </dd>
              </div>
              <div>
                <dt>Ngành</dt>
                <dd>{profile.major}</dd>
              </div>
              <Link to={paths.profile} className="v2-button">
                Xem hồ sơ sinh viên
              </Link>
            </dl>
          ) : (
            <>
              <p>Giảng viên: {todayClasses[dialog].lecturer}</p>
              <p className="mt-3 text-muted">
                Tệp đề cương chưa được cung cấp trong dữ liệu hiện tại.
              </p>
              <Link to={paths.schedule} className="v2-button mt-4">
                Xem thông tin lớp học phần
              </Link>
            </>
          )}
        </Dialog>
      )}
    </div>
  );
}
