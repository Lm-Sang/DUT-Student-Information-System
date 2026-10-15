import { Link } from 'react-router-dom';
import { paths } from '@/shared/config/routes';
export function NotFoundPage() {
  return (
    <main className="page-enter grid min-h-dvh w-full place-content-center justify-items-center gap-4 px-6 py-12 text-center">
      <p className="font-bold text-brand">404</p>
      <h1 className="text-2xl font-bold">Không tìm thấy trang</h1>
      <p className="text-muted">Đường dẫn không tồn tại hoặc đã được thay đổi.</p>
      <Link
        to={paths.home}
        className="inline-block rounded-lg bg-action px-4 py-2 text-white  hover:bg-brand-hover hover:shadow-md motion-reduce:hover:translate-y-0"
      >
        Về trang chủ
      </Link>
    </main>
  );
}
