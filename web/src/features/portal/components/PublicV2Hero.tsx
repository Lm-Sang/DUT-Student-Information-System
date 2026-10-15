import { MicrosoftSignInCard } from '@/features/auth';
import campus from '@/shared/assets/figma-v2/campus.png';

export function PublicV2Hero() {
  return (
    <section id="trang-chu" className="v2-public-hero page-shell">
      <div className="v2-campus-intro">
        <h1>Cổng thông tin sinh viên</h1>
        <h2>Đại học Bách khoa Đà Nẵng</h2>
        <p>
          Trung tâm giáo dục đào tạo kỹ thuật, nghiên cứu khoa học công nghệ hàng đầu miền Trung -
          Tây Nguyên. Nền tảng học vụ số thống nhất cho hơn 18.000 kỹ sư và kiến trúc sư tương lai.
        </p>
        <figure>
          <div className="v2-campus-photo">
            <img
              src={campus}
              width="512"
              height="279"
              alt="Khu giảng đường Trường Đại học Bách khoa Đà Nẵng"
              fetchPriority="high"
            />
          </div>
          <figcaption>Khu Giảng đường Khu A &amp; Khu F</figcaption>
        </figure>
        <p className="v2-caption">54 Nguyễn Lương Bằng, Quận Liên Chiểu, TP. Đà Nẵng</p>
      </div>
      <MicrosoftSignInCard />
    </section>
  );
}
