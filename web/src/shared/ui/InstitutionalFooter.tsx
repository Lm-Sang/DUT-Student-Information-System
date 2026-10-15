export function InstitutionalFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="page-shell flex flex-wrap items-center justify-between gap-4 py-5 text-xs text-muted">
        <p>Đại học Bách khoa Đà Nẵng</p>
        <nav aria-label="Liên kết hệ thống" className="flex flex-wrap items-center gap-5">
          <a
            href="https://lms.dut.udn.vn"
            target="_blank"
            rel="noreferrer"
            className="hover:text-brand"
          >
            DUT LMS
          </a>
          <a
            href="https://lib.dut.udn.vn"
            target="_blank"
            rel="noreferrer"
            className="hover:text-brand"
          >
            Thư viện
          </a>
          <details className="footer-contact">
            <summary>Liên hệ trường</summary>
            <div>
              <p>54 Nguyễn Lương Bằng, Liên Chiểu, Đà Nẵng</p>
              <a href="tel:02363842308">(0236) 3842308</a>
              <br />
              <a href="mailto:tchc@dut.udn.vn">tchc@dut.udn.vn</a>
            </div>
          </details>
        </nav>
      </div>
    </footer>
  );
}
