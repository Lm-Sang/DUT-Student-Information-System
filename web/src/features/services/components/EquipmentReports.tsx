import { useEffect, useState } from 'react';
import { Disclosure } from '@/shared/ui/Disclosure';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
interface EquipmentRecord {
  id: string;
  room: string;
  received: string;
  confirmed: string;
  response: string;
  device: string;
  status: string;
  time: string;
}

const initialReports: EquipmentRecord[] = [
  {
    id: 'E2.202',
    room: 'E2.202',
    received: '08:06:45 05/09',
    confirmed: '08:30:10 05/09',
    response: 'Đội CSVC khu E đã nhận, đang chờ vật tư thay máng nước',
    device: 'Đ.hòa chảy kèm',
    status: 'Đang sửa',
    time: '08:06:45 05/09/2026',
  },
  {
    id: 'A141',
    room: 'A141',
    received: '10:15:25 04/09',
    confirmed: '10:45:00 04/09',
    response: 'Đã thay dây cáp tín hiệu HDMI 5m mới',
    device: 'M.chiếu hỏng',
    status: 'Đã xong',
    time: '10:15:25 04/09/2026',
  },
];

const otherReports: EquipmentRecord[] = [
  {
    id: 'A135',
    room: 'A135',
    received: '14:18:00',
    confirmed: '14:30:10',
    response: 'Đã xếp bổ sung 03 ghế liền bàn',
    device: 'Bàn/ghế',
    status: 'Đã xong',
    time: '14:17:05 11/09/2026',
  },
  {
    id: 'H306',
    room: 'H306',
    received: '07:15:00',
    confirmed: '—',
    response: 'Đã chuyển kỹ thuật viên điện lạnh kiểm tra CB nguồn',
    device: 'Đ.hòa ko chạy',
    status: 'Đang sửa',
    time: '07:09:30 11/09/2026',
  },
  {
    id: 'F108',
    room: 'F108',
    received: '13:58:10',
    confirmed: '14:10:00',
    response: 'Đã thay bóng LED tube 1.2m dãy 1',
    device: 'Đèn',
    status: 'Đã xong',
    time: '13:53:33 07/09/2026',
  },
  {
    id: 'E2.202-2',
    room: 'E2.202',
    received: '08:10:00',
    confirmed: '08:30:10',
    response: 'Đang sửa chữa rò rỉ nước cục lạnh',
    device: 'Đ.hòa chảy kèm',
    status: 'Đang sửa',
    time: '08:06:45 05/09/2026',
  },
  {
    id: 'E2.202-3',
    room: 'E2.202',
    received: '08:12:00',
    confirmed: '08:30:10',
    response: 'Xử lý chung với lượt báo 4',
    device: 'Đ.hòa ko chạy',
    status: 'Đang sửa',
    time: '08:06:18 05/09/2026',
  },
  {
    id: 'E2.102-1',
    room: 'E2.102',
    received: '01:45:00',
    confirmed: '07:20:00',
    response: 'Đã tra dầu bảo dưỡng và thay tụ quạt trần số 3',
    device: 'Quạt ko chạy',
    status: 'Đã xong',
    time: '01:33:47 05/09/2026',
  },
  {
    id: 'E2.102-2',
    room: 'E2.102',
    received: '01:45:00',
    confirmed: '07:20:00',
    response: 'Đã vệ sinh lưới lọc bụi điều hòa 2 khối',
    device: 'Đ.hòa chảy kèm',
    status: 'Đã xong',
    time: '01:33:29 05/09/2026',
  },
  {
    id: 'A141-2',
    room: 'A141',
    received: '10:20:00',
    confirmed: '10:45:00',
    response: 'Đã xử lý xong cáp HDMI',
    device: 'Quạt chảy kèm',
    status: 'Đã xong',
    time: '10:15:25 04/09/2026',
  },
  {
    id: 'A133',
    room: 'A133',
    received: '09:25:00',
    confirmed: '10:00:00',
    response: 'Đã nạp bổ sung gas lạnh R32',
    device: 'Đ.hòa ko chạy',
    status: 'Đã xong',
    time: '09:14:36 04/09/2026',
  },
];

const deviceColumns = [
  'Đèn',
  'Bàn/ghế',
  'M.chiếu Quá mờ',
  'M.chiếu Hỏng',
  'Quạt chạy kèm',
  'Quạt ko chạy',
  'Đ.hòa chảy kèm',
  'Đ.hòa ko chạy',
  'Cửa đi/sổ',
];
const rooms = ['E2.202', 'A141', 'A135', 'H306', 'F108', 'E2.102', 'A133'];
function readRecords<T>(key: string, fallback: T[]): T[] {
  try {
    const stored = localStorage.getItem(key);
    const value = stored ? JSON.parse(stored) : fallback;
    return Array.isArray(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

function DeviceTable({
  label,
  records,
  onRemove,
}: {
  label: string;
  records: EquipmentRecord[];
  onRemove?: (id: string) => void;
}) {
  return (
    <div
      role="region"
      aria-label={label}
      tabIndex={0}
      className="max-w-full overflow-x-auto rounded-lg border border-line"
    >
      <table className="academic-table min-w-[760px]">
        <caption className="sr-only">{label}</caption>
        <thead>
          <tr>
            <th>Phòng / thời gian</th>
            <th>Sự cố thiết bị</th>
            <th>Tiếp nhận & xử lý</th>
            <th>Trạng thái</th>
            {onRemove && <th>Thao tác</th>}
          </tr>
        </thead>
        <tbody>
          {records.map((item) => (
            <tr key={item.id}>
              <td>
                <strong className="block text-brand">{item.room}</strong>
                <span className="mt-1 block text-xs text-muted">{item.time}</span>
              </td>
              <td className="font-medium">{item.device}</td>
              <td>
                <p>{item.response}</p>
                <p className="mt-2 text-xs text-muted">
                  Nhận: {item.received} · Xác nhận: {item.confirmed}
                </p>
              </td>
              <td>
                <Badge tone={item.status === 'Đã xong' ? 'success' : 'warning'}>
                  {item.status}
                </Badge>
              </td>
              {onRemove && (
                <td>
                  <button
                    type="button"
                    aria-label={`Hủy lượt báo ${item.room}`}
                    disabled={item.status === 'Đã xong'}
                    onClick={() => onRemove(item.id)}
                    className="min-h-11 rounded-lg px-3 text-danger hover:bg-danger-soft"
                  >
                    Hủy
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function EquipmentReports() {
  const [room, setRoom] = useState('');
  const [device, setDevice] = useState('');
  const [description, setDescription] = useState('');
  const [reports, setReports] = useState(() =>
    readRecords('dut-equipment-reports', initialReports),
  );
  const [unresolvedOnly, setUnresolvedOnly] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    localStorage.setItem('dut-equipment-reports', JSON.stringify(reports));
  }, [reports]);

  const submitReport = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!room || !device || !description.trim()) {
      setFeedback('Vui lòng chọn phòng, sự cố và nhập mô tả.');
      return;
    }
    if (
      [...reports, ...otherReports].some(
        (item) => item.room === room && item.device === device && item.status !== 'Đã xong',
      )
    ) {
      setFeedback('Sự cố này đã được báo và đang xử lý. Vui lòng theo dõi danh sách bên dưới.');
      return;
    }
    const time = new Date().toLocaleString('vi-VN');
    setReports((current) => [
      {
        id: `${room}-${Date.now()}`,
        room,
        received: time,
        confirmed: '—',
        response: description.trim(),
        device,
        status: 'Đang sửa',
        time,
      },
      ...current,
    ]);
    setDescription('');
    setFeedback('Đã tạo lượt báo thiết bị trên trình duyệt.');
  };

  return (
    <div>
      {feedback && (
        <p role="status" className="mb-3 text-brand">
          {feedback}
        </p>
      )}
      <Card id="equipment" className="!p-5">
        <h2 className="text-lg font-semibold">Báo hỏng thiết bị</h2>
        <p className="mt-2 text-sm text-muted">
          Kiểm tra sự cố đã được báo trước khi gửi. Nếu khẩn cấp, liên hệ cán bộ trực giảng đường.
        </p>
        <form className="mt-4 rounded-lg bg-canvas p-4" onSubmit={submitReport}>
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <label htmlFor="equipment-room" className="font-semibold">
              Phòng học:
            </label>
            <select
              id="equipment-room"
              value={room}
              onChange={(event) => setRoom(event.target.value)}
              className="min-w-0 basis-44 flex-1"
            >
              <option value="">Chọn phòng học...</option>
              {rooms.map((name) => (
                <option key={name}>{name}</option>
              ))}
            </select>
            <label htmlFor="equipment-device" className="font-semibold">
              Sự cố thiết bị:
            </label>
            <select
              id="equipment-device"
              value={device}
              onChange={(event) => setDevice(event.target.value)}
              className="min-w-0 basis-44 flex-1"
            >
              <option value="">Có đèn không sáng</option>
              {deviceColumns.map((name) => (
                <option key={name}>{name}</option>
              ))}
            </select>
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={unresolvedOnly}
                onChange={(event) => setUnresolvedOnly(event.target.checked)}
              />{' '}
              Chỉ hiện các lượt báo chưa xử lý
            </label>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <label className="sr-only" htmlFor="equipment-description">
              Mô tả chi tiết sự cố
            </label>
            <input
              id="equipment-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Mô tả chi tiết (ví dụ: máy số 2 chảy nước, đèn hàng 3...)"
              className="min-w-0 flex-1"
            />
            <Button type="submit" className="!text-xs">
              Tạo lần báo mới
            </Button>
            <Button
              variant="secondary"
              className="!text-xs"
              onClick={() =>
                document.getElementById('equipment-reports')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Dữ liệu
            </Button>
          </div>
        </form>
        <div id="equipment-reports" className="mt-6">
          <div className="mb-2 flex flex-wrap justify-between gap-2 text-xs">
            <h3 className="font-semibold">Lượt báo của bạn</h3>
          </div>
          <DeviceTable
            label="Các lần bạn báo"
            records={reports.filter((item) => !unresolvedOnly || item.status !== 'Đã xong')}
            onRemove={(id) => setReports((current) => current.filter((item) => item.id !== id))}
          />
        </div>
        <div className="mt-6">
          <Disclosure
            title="Sự cố sinh viên khác đã báo"
            meta={`${otherReports.filter((item) => !unresolvedOnly || item.status !== 'Đã xong').length} lượt`}
          >
            <DeviceTable
              label="Các lần sinh viên khác đã báo"
              records={otherReports.filter((item) => !unresolvedOnly || item.status !== 'Đã xong')}
            />
          </Disclosure>
        </div>
      </Card>
    </div>
  );
}
