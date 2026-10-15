import { MicrosoftSignInCard } from '@/features/auth';
import campusImage from '@/shared/assets/figma/public-campus.png';
import campusBadge from '@/shared/assets/figma/public-campus-badge.svg';

export function PublicHero() {
  return (
    <section id="trang-chu" className="scroll-mt-28 bg-subtle/75">
      <div className="page-shell grid min-w-0 items-center gap-6 py-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <div className="min-w-0">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-brand-deep sm:text-4xl">
            Đại học Bách khoa Đà Nẵng
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-6 text-muted">
            Trung tâm giáo dục đào tạo kỹ thuật, nghiên cứu khoa học công nghệ hàng đầu miền Trung -
            Tây Nguyên. Nền tảng học vụ số thống nhất cho hơn 18.000 kỹ sư và kiến trúc sư tương
            lai.
          </p>
          <figure className="relative mt-6 overflow-hidden rounded-xl bg-canvas shadow-sm">
            <img
              src={campusImage}
              alt="Khu giảng đường Trường Đại học Bách khoa Đà Nẵng"
              width="704"
              height="320"
              className="h-72 w-full object-cover sm:h-80"
              fetchPriority="high"
            />
            <figcaption className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-3 bg-gradient-to-t from-slate-950/85 to-transparent p-5 pt-16 text-white sm:p-6 sm:pt-16">
              <div className="min-w-0">
                <p className="text-base font-semibold">Khu Giảng đường Khu A &amp; Khu F</p>
                <p className="mt-1 text-xs text-white/90">
                  54 Nguyễn Lương Bằng, Quận Liên Chiểu, TP. Đà Nẵng
                </p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                <img src={campusBadge} alt="" className="shrink-0" />
                DUT Campus
              </span>
            </figcaption>
          </figure>
        </div>
        <MicrosoftSignInCard />
      </div>
    </section>
  );
}
