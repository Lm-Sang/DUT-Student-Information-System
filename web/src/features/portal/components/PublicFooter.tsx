export function PublicFooter() {
  return (
    <footer className="border-t border-line/70 bg-surface">
      <div className="page-shell flex flex-col justify-between gap-5 py-6 text-xs lg:flex-row lg:items-center">
        <div className="leading-5 text-muted">
          <p className="font-semibold text-brand-deep">
            Trường Đại học Bách khoa - Đại học Đà Nẵng
          </p>
          <p>Địa chỉ: 54 Nguyễn Lương Bằng, Quận Liên Chiểu, TP. Đà Nẵng</p>
          <p>Điện thoại: (0236) 3842308 — Hòm thư điện tử: tchc@dut.udn.vn</p>
        </div>
        <nav
          aria-label="Liên kết hệ thống"
          className="flex flex-wrap items-center gap-x-4 gap-y-2 text-brand-secondary"
        >
          <a
            href="https://lms.dut.udn.vn"
            target="_blank"
            rel="noreferrer"
            className="hover:underline"
          >
            DUT-LMS E-learning
          </a>
          <span aria-hidden="true" className="hidden text-muted sm:inline">
            |
          </span>
          <a
            href="https://lib.dut.udn.vn"
            target="_blank"
            rel="noreferrer"
            className="hover:underline"
          >
            Thư viện Điện tử
          </a>
          <span aria-hidden="true" className="hidden text-muted sm:inline">
            |
          </span>
          <a href="#ho-tro" className="hover:underline">
            Bộ phận Một cửa &amp; Hỗ trợ
          </a>
        </nav>
      </div>
      <div className="bg-subtle">
        <div className="page-shell flex flex-col justify-between gap-1 py-2 text-xs font-medium tracking-[0.03em] text-muted sm:flex-row">
          <p>© 2025 Trung tâm Học liệu và Công nghệ Thông tin - DUT</p>
          <p>Phiên bản Cổng thông tin 4.2.0</p>
        </div>
      </div>
    </footer>
  );
}
