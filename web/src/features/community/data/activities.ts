export interface Activity {
  id: string;
  title: string;
  organizer: string;
  summary: string;
  date: string;
  registration: string;
  registered: number;
  capacity: number;
  location: string;
  points: number;
  status: 'closed' | 'open' | 'unknown';
  content: string;
}

export const activities: Activity[] = [
  {
    id: 'it-esport-2026',
    title: 'IT Esport 2026',
    organizer: 'Liên chi đoàn Khoa Công nghệ Thông tin',
    summary: 'Các hoạt động Đền ơn - Đáp nghĩa và hoạt động cộng đồng.',
    date: '30/09/2026 – 01/10/2026',
    registration: '14/09/2026 – 20/09/2026',
    registered: 5,
    capacity: 50,
    location: 'Trường Đại học Bách khoa, Đại học Đà Nẵng',
    points: 20,
    status: 'closed',
    content:
      'Các hoạt động Đền ơn - Đáp nghĩa (dọn dẹp, vệ sinh, tân tạo nghĩa trang liệt sĩ, thăm hương tri ân các anh hùng liệt sĩ; thăm hỏi, phụng dưỡng Bà mẹ Việt Nam anh hùng, thương binh, bệnh binh, gia đình có công với cách mạng...), giúp đỡ các đối tượng khó khăn (trẻ em mồ côi, người khuyết tật, người già neo đơn...); hoạt động trực tiếp hiến máu nhân đạo; các hoạt động khác có tính chất tương tự mà thời gian diễn ra dưới 01 ngày.',
  },
  {
    id: 'chao-don-tsv-k26',
    title: 'Ngày hội Chào đón TSV K26',
    organizer: 'Liên chi đoàn Khoa Công nghệ Thông tin',
    summary: 'Lễ kỷ niệm và hoạt động chào đón tân sinh viên.',
    date: '27/09/2026',
    registration: '14/09/2026 – 27/09/2026',
    registered: 24,
    capacity: 150,
    location: 'Trường Đại học Bách khoa, Đại học Đà Nẵng',
    points: 20,
    status: 'open',
    content:
      'Lễ kỷ niệm và chuỗi hoạt động chào đón tân sinh viên khóa 2026 của Khoa Công nghệ Thông tin.',
  },
  {
    id: 'tft-back-to-school',
    title: 'Giải đấu TFT - Back to school',
    organizer: 'CLB Thể thao điện tử DUT ESPORTS',
    summary: 'Các hoạt động khác do Khoa / Liên chi đoàn tổ chức.',
    date: '20/05/2026 – 12/05/2031',
    registration: 'Đã kết thúc',
    registered: 37,
    capacity: 40,
    location: 'Robot City Gaming 2',
    points: 10,
    status: 'closed',
    content:
      'Giải đấu TFT - Back to school dành cho sinh viên, do CLB Thể thao điện tử DUT ESPORTS tổ chức.',
  },
  {
    id: 'cam-nang-tuyen-sinh-2026',
    title: 'Cẩm nang Tuyển sinh 2026 - Đội Tư vấn Sinh viên',
    organizer: 'Đội Tư vấn Sinh viên',
    summary: 'Các hoạt động khác do Khoa / Liên chi đoàn tổ chức.',
    date: 'Chưa có thông tin',
    registration: 'Chưa có thông tin',
    registered: 48,
    capacity: 50,
    location: 'Chưa có thông tin',
    points: 10,
    status: 'unknown',
    content:
      'Tham gia hỗ trợ thông tin tuyển sinh và tư vấn cho tân sinh viên tại Trường Đại học Bách khoa.',
  },
  {
    id: 'tiep-suc-mua-thi',
    title: 'Tiếp sức mùa thi 2026',
    organizer: 'Đoàn Trường Đại học Bách khoa',
    summary: 'Hỗ trợ thí sinh trong kỳ thi tuyển sinh năm 2026.',
    date: '25/06/2026 – 28/06/2026',
    registration: 'Đã kết thúc',
    registered: 80,
    capacity: 100,
    location: 'Đà Nẵng',
    points: 20,
    status: 'closed',
    content: 'Sinh viên tham gia hỗ trợ thí sinh và phụ huynh trong kỳ thi tuyển sinh.',
  },
  {
    id: 'hien-mau-nhan-dao',
    title: 'Ngày hội hiến máu nhân đạo',
    organizer: 'Hội Sinh viên Trường Đại học Bách khoa',
    summary: 'Chung tay hiến máu cứu người và phục vụ cộng đồng.',
    date: '15/10/2026',
    registration: '01/10/2026 – 14/10/2026',
    registered: 42,
    capacity: 100,
    location: 'Trường Đại học Bách khoa, Đại học Đà Nẵng',
    points: 20,
    status: 'open',
    content: 'Ngày hội hiến máu nhân đạo do Hội Sinh viên phối hợp tổ chức.',
  },
  {
    id: 'chuyen-doi-xanh',
    title: 'Chiến dịch Chuyển đổi xanh',
    organizer: 'Đoàn Trường Đại học Bách khoa',
    summary: 'Dọn vệ sinh và trồng cây tại khuôn viên trường.',
    date: '18/10/2026',
    registration: '01/10/2026 – 17/10/2026',
    registered: 30,
    capacity: 60,
    location: 'Khuôn viên Trường Đại học Bách khoa',
    points: 10,
    status: 'open',
    content: 'Tham gia dọn vệ sinh và trồng cây tạo không gian học tập xanh.',
  },
  {
    id: 'tu-van-hoc-tap',
    title: 'Hỗ trợ học tập tân sinh viên',
    organizer: 'Liên chi đoàn Khoa Công nghệ Thông tin',
    summary: 'Hướng dẫn tân sinh viên sử dụng các hệ thống học tập.',
    date: '20/10/2026',
    registration: '05/10/2026 – 19/10/2026',
    registered: 18,
    capacity: 40,
    location: 'Trường Đại học Bách khoa, Đại học Đà Nẵng',
    points: 10,
    status: 'open',
    content: 'Hỗ trợ sinh viên khóa mới tìm hiểu các hệ thống học tập và hoạt động của khoa.',
  },
];
