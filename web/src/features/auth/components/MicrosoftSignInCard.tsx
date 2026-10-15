import { useState } from 'react';
import { Link } from 'react-router-dom';
import { env } from '@/shared/config/env';
import { paths } from '@/shared/config/routes';
import { Dialog } from '@/shared/ui/Dialog';
import microsoftLogo from '@/shared/assets/figma/public-logo-extra-1.svg';
import microsoftButtonLogo from '@/shared/assets/figma/public-microsoft-button.svg';
import accountInfoIcon from '@/shared/assets/figma/public-account-info.svg';
import activateAccountIcon from '@/shared/assets/figma/public-activate-account.svg';
import resetPasswordIcon from '@/shared/assets/figma/public-reset-password.svg';
import { useAuth } from '../hooks/useAuth';
import { usePortalEdition } from '@/shared/config/portalEdition';

export function MicrosoftSignInCard() {
  const v2 = usePortalEdition() === 'v2';
  const { user } = useAuth();
  const [help, setHelp] = useState<'unavailable' | 'activate' | 'password' | null>(null);
  const actionClass =
    'flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-action px-4 py-3 text-center text-base font-semibold text-white shadow-sm hover:bg-brand-hover active:translate-y-px';
  const actionContent = (
    <>
      {!v2 && <img src={microsoftButtonLogo} alt="" className="shrink-0" />}
      <span className="min-w-0 break-words">Đăng nhập bằng Microsoft Office 365</span>
    </>
  );

  return (
    <section
      id="microsoft-sign-in"
      aria-labelledby="microsoft-sign-in-title"
      className="min-w-0 scroll-mt-36 rounded-xl border border-line/60 bg-surface p-6 shadow-[0_10px_24px_-12px_rgba(23,37,59,0.24)] sm:p-10"
    >
      <div className="flex flex-wrap items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-subtle">
          {v2 ? (
            <span className="v2-microsoft-symbol" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </span>
          ) : (
            <img src={microsoftLogo} alt="" />
          )}
        </span>
        <div className="min-w-0 flex-1 basis-44">
          <h2 id="microsoft-sign-in-title" className="text-base font-semibold">
            Đăng nhập Microsoft 365
          </h2>
          <p className="mt-1 text-sm leading-5 text-muted">
            Xác thực tập trung sinh viên &amp; giảng viên
          </p>
        </div>
      </div>

      <div className="my-4 rounded-lg bg-subtle p-4">
        <p className="flex items-start gap-2 font-semibold text-brand-deep">
          <img src={accountInfoIcon} alt="" className="mt-1 shrink-0" />
          <span>Tài khoản cấp bởi Nhà trường</span>
        </p>
        <p className="mt-2 text-sm leading-6 text-muted">
          Sinh viên sử dụng email định danh dạng{' '}
          <strong className="break-words font-semibold text-brand-deep">MSSV@sv.dut.udn.vn</strong>{' '}
          để truy cập lịch thi, đăng ký học phần và hồ sơ điện tử.
        </p>
      </div>

      {user ? (
        <Link
          to={
            user.role === 'admin'
              ? paths.admin
              : user.role === 'staff'
                ? paths.staffRequests
                : paths.dashboard
          }
          className={actionClass}
        >
          Vào cổng thông tin
        </Link>
      ) : env.microsoftSignInUrl ? (
        <a href={env.microsoftSignInUrl} className={actionClass}>
          {actionContent}
        </a>
      ) : (
        <button type="button" onClick={() => setHelp('unavailable')} className={actionClass}>
          {actionContent}
        </button>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-xs font-medium text-brand-secondary">
        <button
          type="button"
          className="flex min-h-10 items-center gap-2 text-left hover:text-brand hover:underline"
          onClick={() => setHelp('activate')}
        >
          <img src={activateAccountIcon} alt="" className="shrink-0" />
          <span>Hướng dẫn kích hoạt tài khoản</span>
        </button>
        <button
          type="button"
          className="flex min-h-10 items-center gap-2 text-left hover:text-brand hover:underline"
          onClick={() => setHelp('password')}
        >
          <img src={resetPasswordIcon} alt="" className="shrink-0" />
          <span>Quên mật khẩu?</span>
        </button>
      </div>

      {help && (
        <Dialog
          title={
            help === 'activate'
              ? 'Hướng dẫn kích hoạt tài khoản'
              : help === 'password'
                ? 'Khôi phục mật khẩu Microsoft 365'
                : 'Đăng nhập Microsoft 365'
          }
          onClose={() => setHelp(null)}
        >
          {help === 'unavailable' ? (
            <>
              <p role="status">Đăng nhập Microsoft hiện chưa khả dụng trên bản trải nghiệm này.</p>
              <p className="mt-3 text-muted">
                Bạn có thể dùng tài khoản trải nghiệm để xem cổng thông tin sinh viên.
              </p>
              <Link
                to={paths.login}
                className="mt-5 inline-flex min-h-11 items-center rounded-lg bg-action px-4 font-medium text-white hover:bg-brand-hover"
              >
                Đăng nhập bằng tài khoản trải nghiệm
              </Link>
            </>
          ) : (
            <>
              <p className="leading-relaxed">
                {help === 'activate'
                  ? 'Sử dụng email MSSV@sv.dut.udn.vn và thông tin tài khoản do Nhà trường cấp. Nếu chưa nhận được tài khoản hoặc không thể kích hoạt, hãy liên hệ Trung tâm Học liệu & CNTT để được hỗ trợ.'
                  : 'Sử dụng chức năng quên mật khẩu trên trang đăng nhập Microsoft. Nếu không thể tự khôi phục tài khoản Nhà trường, hãy liên hệ Trung tâm Học liệu & CNTT.'}
              </p>
              <a
                href="#ho-tro"
                onClick={() => setHelp(null)}
                className="mt-5 inline-flex min-h-11 items-center rounded-lg bg-action px-4 font-medium text-white hover:bg-brand-hover"
              >
                Xem thông tin hỗ trợ
              </a>
            </>
          )}
        </Dialog>
      )}
    </section>
  );
}
