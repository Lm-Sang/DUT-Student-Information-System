import { useState } from 'react';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { Dialog } from '@/shared/ui/Dialog';
import type { RequestController } from '../hooks/useRequests';
import { demoRecordCount, demoVersion } from '../data/demoScenarios';
import { requestTypes, staffMembers } from '../data/requestCatalog';
import { demoStudentAccounts } from '@/shared/config/demoAccounts';

export function DemoDataPanel({ controller: c }: { controller: RequestController }) {
  const [mode, setMode] = useState<'load' | 'reset' | undefined>();
  const demos = c.requests.filter((r) => r.demo?.version && r.demo?.batch).length;
  const loaded = c.requests.some((r) => r.demo?.version === demoVersion);
  return (
    <Card>
      <details>
        <summary className="min-h-11 cursor-pointer font-medium">
          Dữ liệu trải nghiệm · {demos} hồ sơ mẫu
        </summary>
        <p className="my-3 text-sm text-muted">
          Bộ mẫu v{demoVersion} gồm {demoRecordCount} hồ sơ cho {requestTypes.length} loại thủ tục,
          với minh chứng PDF/JPG/PNG. Mỗi loại có hồ sơ ở từng bước xử lý, chờ phân công, cần bổ
          sung, từ chối và hủy. Nạp thêm giữ nguyên mọi hồ sơ hiện có và lịch sử bạn đã thao tác.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            disabled={c.busy || c.loading || loaded}
            onClick={() => setMode('load')}
          >
            {loaded ? `Đã nạp bộ mẫu v${demoVersion}` : `Nạp thêm bộ mẫu v${demoVersion}`}
          </Button>
          <Button
            variant="secondary"
            disabled={c.busy || c.loading}
            onClick={() => setMode('reset')}
          >
            Đặt lại dữ liệu mẫu
          </Button>
        </div>
        <details className="mt-4">
          <summary className="min-h-11 cursor-pointer font-medium">
            Tài khoản thử nghiệm · {staffMembers.length} chuyên viên · {demoStudentAccounts.length}{' '}
            sinh viên
          </summary>
          <p className="my-3 text-sm text-muted">
            Chuyên viên dùng mật khẩu staff123; sinh viên dùng student123; admin01 / admin123. Mở
            các tab trên cùng địa chỉ web để thử đồng thời các vai trò. Trong hàng đợi, lọc Loại đề
            nghị và Trạng thái để chọn tình huống; danh sách phân công chỉ hiện người thuộc đơn vị
            phụ trách.
          </p>
          <div
            className="overflow-x-auto"
            tabIndex={0}
            role="region"
            aria-label="Bảng tài khoản thử nghiệm"
          >
            <table className="academic-table min-w-[480px]">
              <caption className="sr-only">Danh sách tài khoản chuyên viên thử nghiệm</caption>
              <thead>
                <tr>
                  <th>Tài khoản</th>
                  <th>Chuyên viên</th>
                  <th>Đơn vị</th>
                </tr>
              </thead>
              <tbody>
                {staffMembers.map((s) => (
                  <tr key={s.id}>
                    <td>{s.username}</td>
                    <td>{s.name}</td>
                    <td>{s.department}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="my-3 text-sm text-muted">
            Sinh viên student01–student12 đều có hồ sơ mẫu riêng. Tra MSSV ở bảng bên dưới để chọn
            tài khoản theo hồ sơ.
          </p>
          <div
            className="overflow-x-auto"
            tabIndex={0}
            role="region"
            aria-label="Bảng tài khoản thử nghiệm"
          >
            <table className="academic-table min-w-[480px]">
              <caption className="sr-only">Danh sách tài khoản sinh viên thử nghiệm</caption>
              <thead>
                <tr>
                  <th>Tài khoản</th>
                  <th>Sinh viên</th>
                  <th>MSSV</th>
                </tr>
              </thead>
              <tbody>
                {demoStudentAccounts.map((s) => (
                  <tr key={s.id}>
                    <td>{s.username}</td>
                    <td>{s.fullName}</td>
                    <td>{s.studentId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </details>
      {mode && (
        <Dialog
          title={mode === 'reset' ? 'Đặt lại dữ liệu mẫu?' : 'Nạp bộ dữ liệu mẫu?'}
          onClose={() => {
            if (!c.busy) setMode(undefined);
          }}
        >
          <p>
            {mode === 'reset'
              ? `Thay thế ${demos} hồ sơ có dấu nhận diện demo bằng bộ ${demoRecordCount} hồ sơ v${demoVersion} mới. Các thay đổi bạn đã thực hiện trên hồ sơ mẫu sẽ mất.`
              : `Thêm ${demoRecordCount} hồ sơ mẫu v${demoVersion}. Giữ nguyên toàn bộ ${c.requests.length} hồ sơ hiện có, kể cả hồ sơ mẫu cũ và lịch sử xử lý.`}
          </p>
          <p className="mt-3 font-medium">
            Giữ nguyên {c.requests.length - demos} hồ sơ không có dấu mẫu, gồm hồ sơ bạn tự nộp và
            dữ liệu phiên bản cũ.
          </p>
          {c.error && (
            <p role="alert" className="mt-3 text-danger">
              {c.error}
            </p>
          )}
          <div className="mt-5 flex justify-end gap-2">
            <Button variant="secondary" disabled={c.busy} onClick={() => setMode(undefined)}>
              Hủy thao tác
            </Button>
            <Button
              disabled={c.busy}
              onClick={async () => {
                if (await c.demo(mode === 'reset', true)) setMode(undefined);
              }}
            >
              Xác nhận {mode === 'reset' ? 'đặt lại' : 'nạp mẫu'}
            </Button>
          </div>
        </Dialog>
      )}
    </Card>
  );
}
