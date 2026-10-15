import { useMemo, useState } from 'react';
import { usePortalEdition } from '@/shared/config/portalEdition';
import { Link, useParams } from 'react-router-dom';
import { activities } from '../data/activities';
import type { Activity } from '../data/activities';
import { paths } from '@/shared/config/routes';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { PageHeading } from '@/shared/ui/PageHeading';

function Heading({ title, subtitle }: { title: string; subtitle: string }) {
  return <PageHeading title={title} description={subtitle} />;
}

function Status({ status }: { status: Activity['status'] }) {
  return (
    <Badge tone={status === 'open' ? 'success' : 'info'}>
      {status === 'open'
        ? 'Mở đăng ký'
        : status === 'closed'
          ? 'Hết hạn đăng ký'
          : 'Chưa có thông tin đăng ký'}
    </Badge>
  );
}

function useRegistration() {
  const [registered, setRegistered] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('dut-community-registrations') ?? '[]');
    } catch {
      return [];
    }
  });
  const register = (id: string) => {
    const next = [...new Set([...registered, id])];
    localStorage.setItem('dut-community-registrations', JSON.stringify(next));
    setRegistered(next);
  };
  return { registered, register };
}

export function ActivitiesPage() {
  const v2 = usePortalEdition() === 'v2';
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [organizer, setOrganizer] = useState('all');
  const [page, setPage] = useState(1);
  const { registered, register } = useRegistration();
  const filtered = useMemo(
    () =>
      activities.filter((item) => {
        const queryMatch = `${item.title} ${item.organizer}`
          .toLocaleLowerCase('vi')
          .includes(appliedQuery.toLocaleLowerCase('vi'));
        return (
          queryMatch &&
          (status === 'all' || item.status === status) &&
          (organizer === 'all' || item.organizer === organizer)
        );
      }),
    [appliedQuery, status, organizer],
  );
  const count = Math.max(1, Math.ceil(filtered.length / 4));
  const visible = filtered.slice((page - 1) * 4, page * 4);
  return (
    <div className="text-ink">
      <Heading
        title={v2 ? 'Hoạt động cộng đồng' : 'Các hoạt động cộng đồng'}
        subtitle="Tìm hoạt động, theo dõi thời gian tổ chức và đăng ký tham gia."
      />
      <Card className="!p-4">
        <form
          className="flex flex-wrap gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            setAppliedQuery(query.trim());
            setPage(1);
          }}
        >
          <label className="sr-only" htmlFor="activity-search">
            Tìm theo tên hoạt động, đơn vị tổ chức
          </label>
          <input
            id="activity-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="⌕ Tìm theo tên hoạt động, đơn vị tổ chức"
            className="min-w-0 flex-1 !bg-canvas sm:min-w-72"
          />
          <label className="sr-only" htmlFor="activity-status">
            Trạng thái
          </label>
          <select
            id="activity-status"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
            className="!bg-subtle !text-xs text-brand"
          >
            <option value="all">Trạng thái: Tất cả</option>
            <option value="open">Mở đăng ký</option>
            <option value="closed">Hết hạn đăng ký</option>
            <option value="unknown">Chưa có thông tin</option>
          </select>
          <label className="sr-only" htmlFor="activity-organizer">
            Đơn vị tổ chức
          </label>
          <select
            id="activity-organizer"
            value={organizer}
            onChange={(event) => {
              setOrganizer(event.target.value);
              setPage(1);
            }}
            className="!bg-subtle !text-xs text-brand"
          >
            <option value="all">Đơn vị tổ chức</option>
            {[...new Set(activities.map((item) => item.organizer))].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
          <Button type="submit" className="!text-xs">
            Lọc hoạt động
          </Button>
        </form>
      </Card>
      <h2 className="my-6 text-[1.0625rem] font-semibold">Danh sách hoạt động</h2>
      {visible.length ? (
        <div className="grid gap-5 md:grid-cols-2">
          {visible.map((item) => (
            <Card key={item.id} className="flex flex-col !p-5">
              {v2 && (
                <div className={`v2-event-head ${item.status === 'open' ? 'is-open' : ''}`}>
                  <div className="v2-event-date">
                    <strong>{item.date.match(/^(\d{2})\//)?.[1] ?? '—'}</strong>
                    <small>
                      {item.date.match(/^\d{2}\/(\d{2})/)
                        ? `Tháng ${Number(item.date.slice(3, 5))}`
                        : 'Chưa có lịch'}
                    </small>
                  </div>
                  <div>
                    <h3>{item.title}</h3>
                    <p className="v2-caption">{item.organizer}</p>
                  </div>
                  <Badge>{item.points} điểm</Badge>
                </div>
              )}
              {!v2 && (
                <>
                  <div className="flex flex-wrap gap-2">
                    <Status status={item.status} />
                    <Badge>{item.points} điểm</Badge>
                  </div>
                  <h3 className="mt-4 text-[1.0625rem] font-semibold">{item.title}</h3>
                  <p className="mt-3 text-sm text-muted">{item.organizer}</p>
                </>
              )}
              <p className="mt-3 text-sm text-muted">{item.summary}</p>
              <dl
                className={`mt-4 space-y-2 rounded-lg bg-canvas p-4 text-xs ${v2 ? 'v2-event-details' : ''}`}
              >
                <div>
                  <dt className="inline font-medium">Thời gian · </dt>
                  <dd className="inline">{item.date}</dd>
                </div>
                <div>
                  <dt className="inline font-medium">Số lượng · </dt>
                  <dd className="inline">
                    {item.registered + (registered.includes(item.id) ? 1 : 0)} / {item.capacity}{' '}
                    người
                  </dd>
                </div>
                <div>
                  <dt className="inline font-medium">Địa điểm · </dt>
                  <dd className="inline">{item.location}</dd>
                </div>
              </dl>
              {v2 && (
                <div className="mt-4">
                  <Status status={item.status} />
                </div>
              )}
              <div
                className={`mt-auto flex flex-wrap gap-2 pt-4 ${v2 ? 'v2-activity-actions' : ''}`}
              >
                <Link
                  to={paths.communityActivity(item.id)}
                  className="inline-flex min-h-9 items-center rounded-lg bg-subtle px-3 text-xs font-semibold text-brand hover:bg-line"
                >
                  Xem chi tiết
                </Link>
                {item.status === 'open' && (
                  <Button
                    className="!min-h-9 !px-3 !py-1 !text-xs"
                    disabled={registered.includes(item.id)}
                    onClick={() => register(item.id)}
                  >
                    {registered.includes(item.id) ? 'Đã đăng ký' : 'Đăng ký tham gia'}
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <p className="text-sm text-muted">Không tìm thấy hoạt động phù hợp.</p>
        </Card>
      )}
      <div className="mt-5 flex flex-wrap items-center gap-2 text-xs">
        <span className="mr-2 text-muted">{visible.length} hoạt động trên trang</span>
        {Array.from({ length: count }, (_, index) => index + 1).map((number) => (
          <button
            key={number}
            type="button"
            aria-current={page === number ? 'page' : undefined}
            onClick={() => setPage(number)}
            className={`size-9 rounded-lg font-semibold ${page === number ? 'bg-action text-white' : 'bg-subtle text-brand'}`}
          >
            {number}
          </button>
        ))}
        {page < count && (
          <button type="button" className="px-2 text-brand" onClick={() => setPage(page + 1)}>
            →
          </button>
        )}
      </div>
    </div>
  );
}

export function ActivityDetailPage() {
  const { id } = useParams();
  const item = activities.find((activity) => activity.id === id);
  const { registered, register } = useRegistration();
  if (!item)
    return (
      <Card>
        <h1 className="text-lg font-semibold">Không tìm thấy hoạt động</h1>
        <Link to={paths.communityActivities} className="mt-3 inline-block text-brand">
          ← Danh sách hoạt động
        </Link>
      </Card>
    );
  return (
    <div className="text-ink">
      <Heading title="Chi tiết hoạt động" subtitle={`Các hoạt động cộng đồng / ${item.title}`} />
      <Link
        to={paths.communityActivities}
        className="mb-7 inline-block text-sm font-medium text-brand hover:underline"
      >
        ← Danh sách hoạt động
      </Link>
      <Card className="mb-6 !p-5">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-[1.625rem] font-bold">{item.title}</h2>
          <Status status={item.status} />
        </div>
        <p className="mt-4 text-sm text-muted">{item.organizer}</p>
      </Card>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(280px,1fr)]">
        <Card className="!p-6">
          <h2 className="text-lg font-semibold">Nội dung hoạt động</h2>
          <p className="mt-5 text-sm leading-7">{item.content}</p>
          <h3 className="mt-5 font-semibold">Thời gian tổ chức</h3>
          <p className="mt-3 text-sm">{item.date}</p>
          <h3 className="mt-5 font-semibold">Địa điểm</h3>
          <p className="mt-3 text-sm">{item.location}</p>
        </Card>
        <Card className="h-fit !p-6">
          <h2 className="text-lg font-semibold">Thông tin đăng ký</h2>
          <dl className="mt-5 space-y-4 text-sm">
            <div>
              <dt>Thời gian đăng ký</dt>
              <dd className="mt-1 font-medium">{item.registration}</dd>
            </div>
            <div>
              <dt>Số người đăng ký</dt>
              <dd className="mt-1 font-medium">
                {item.registered + (registered.includes(item.id) ? 1 : 0)} / {item.capacity} người
              </dd>
            </div>
            <div>
              <dt>Điểm số hoạt động</dt>
              <dd className="mt-1 font-medium">{item.points} điểm</dd>
            </div>
            <div>
              <dt>Hoạt động bên ngoài</dt>
              <dd className="mt-1 font-medium">Không</dd>
            </div>
          </dl>
          <div className="mt-5">
            <Status status={item.status} />
          </div>
          {item.status === 'open' ? (
            <Button
              className="mt-4"
              disabled={registered.includes(item.id)}
              onClick={() => register(item.id)}
            >
              {registered.includes(item.id) ? 'Đã đăng ký tham gia' : 'Đăng ký tham gia'}
            </Button>
          ) : (
            <p className="mt-4 text-xs text-muted">
              {item.status === 'closed'
                ? 'Thời gian đăng ký đã kết thúc.'
                : 'Chưa có thông tin thời gian đăng ký.'}
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}

export function CommunityResultsPage() {
  const [year, setYear] = useState('2026–2027');
  const [status, setStatus] = useState('all');
  return (
    <div className="text-ink">
      <Heading
        title="Kết quả phục vụ cộng đồng"
        subtitle="Theo dõi hoạt động đã tham gia và kết quả được xác nhận."
      />
      <Card className="!p-4">
        <div className="mb-4 flex flex-wrap gap-2">
          <label className="sr-only" htmlFor="community-year">
            Năm học
          </label>
          <select
            id="community-year"
            value={year}
            onChange={(event) => setYear(event.target.value)}
            className="!bg-subtle !text-xs text-brand"
          >
            <option value="2026–2027">Năm học 2026–2027</option>
            <option value="2025–2026">Năm học 2025–2026</option>
          </select>
          <label className="sr-only" htmlFor="community-status">
            Trạng thái
          </label>
          <select
            id="community-status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="!bg-subtle !text-xs text-brand"
          >
            <option value="all">Trạng thái: Tất cả</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="pending">Chờ xác nhận</option>
          </select>
        </div>
        <div
          role="region"
          aria-label="Kết quả phục vụ cộng đồng"
          tabIndex={0}
          className="overflow-x-auto"
        >
          <div className="grid min-w-[650px] grid-cols-[1.4fr_1fr_1.5fr_1fr_1fr_1fr] gap-3 bg-subtle px-4 py-3 text-xs text-muted">
            <span>Hoạt động</span>
            <span>Thời gian</span>
            <span>Đơn vị xác nhận</span>
            <span>Điểm ghi nhận</span>
            <span>Trạng thái</span>
            <span>Minh chứng</span>
          </div>
        </div>
      </Card>
      <Card className="mt-5 !p-5">
        <h2 className="text-[1.0625rem] font-semibold">Chưa có kết quả được ghi nhận</h2>
        <p className="mt-3 text-sm text-muted">
          Các hoạt động đã được đơn vị tổ chức xác nhận sẽ hiển thị tại đây, kèm điểm và thông tin
          minh chứng.
        </p>
        <Link
          to={paths.communityActivities}
          className="mt-4 inline-flex min-h-10 items-center rounded-lg bg-action px-4 text-sm font-medium text-white hover:bg-brand-hover"
        >
          Khám phá hoạt động
        </Link>
      </Card>
    </div>
  );
}
