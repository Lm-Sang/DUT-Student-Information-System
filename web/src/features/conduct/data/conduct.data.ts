export interface Criterion {
  id: number;
  title: string;
  description: string;
  max: number;
  score: number;
  evidence: string;
}

export interface CriterionGroup {
  numeral: string;
  title: string;
  max: number;
  criteria: Criterion[];
}

export const criterionGroups: CriterionGroup[] = [
  {
    numeral: 'I',
    title: 'Ý thức tham gia học tập',
    max: 20,
    criteria: [
      {
        id: 1,
        title: 'Đi học đầy đủ, đúng giờ, nghiêm túc trong giờ học',
        description: 'Không vắng quá thời hạn quy định, không bị cấm thi bất kỳ học phần nào.',
        max: 6,
        score: 6,
        evidence: 'Dữ liệu điểm danh phòng đào tạo: Chuyên cần 100%',
      },
      {
        id: 2,
        title: 'Ý thức trách nhiệm, tích cực tham gia đồ án PBL, làm việc nhóm',
        description:
          'Hoàn thành nhiệm vụ được nhóm phân công đúng hạn; hỗ trợ các thành viên trong nhóm.',
        max: 3,
        score: 3,
        evidence: 'Trưởng nhóm Đồ án Thiết kế Vi mạch PBL4',
      },
      {
        id: 3,
        title: 'Kết quả học tập đạt loại Khá/Giỏi/Xuất sắc hoặc tiến bộ vượt bậc',
        description: 'GPA Học kỳ 2: 3.92 (Loại Xuất sắc) · Tự động tính 5/5đ',
        max: 5,
        score: 5,
        evidence: 'Đồng bộ tự động từ Bảng điểm SIS',
      },
      {
        id: 4,
        title: 'Tham gia Nghiên cứu Khoa học, CLB học thuật, Hội thi Olympic SV',
        description:
          'Có quyết định thành lập nhóm NCKH cấp Khoa/Trường hoặc chứng nhận thành viên.',
        max: 3,
        score: 3,
        evidence: 'QĐ_NCKH_2026.pdf',
      },
      {
        id: 5,
        title: 'Ý thức tham gia các kỳ thi nghiêm túc, đúng quy chế đào tạo',
        description:
          'Không vi phạm quy chế thi kết thúc học phần, thi giữa kỳ, kiểm tra đánh giá thường xuyên.',
        max: 3,
        score: 3,
        evidence: 'Không ghi nhận biên bản vi phạm thi',
      },
    ],
  },
  {
    numeral: 'II',
    title: 'Ý thức chấp hành quy chế, quy định trong nhà trường',
    max: 25,
    criteria: [
      {
        id: 6,
        title: 'Chấp hành các văn bản chỉ đạo của Bộ, Đại học Đà Nẵng & Trường',
        description:
          'Đeo thẻ sinh viên, trang phục lịch sự văn minh trường học, thực hiện nếp sống sinh viên Bách khoa.',
        max: 15,
        score: 15,
        evidence: 'Đoàn trường ghi nhận chuẩn mực',
      },
      {
        id: 7,
        title: 'Hoàn thành đầy đủ nghĩa vụ học phí và các khoản nộp theo quy định',
        description:
          'Nộp học phí đúng hạn đợt 1 và đợt 2 theo thông báo của Phòng Kế hoạch - Tài chính.',
        max: 10,
        score: 10,
        evidence: 'Đã thanh toán đủ HK2 (Hóa đơn e-Invoice #DUT2502)',
      },
    ],
  },
  {
    numeral: 'III',
    title: 'Ý thức tham gia hoạt động chính trị, xã hội, văn hóa, thể thao',
    max: 20,
    criteria: [
      {
        id: 8,
        title: 'Tham gia hoạt động tình nguyện vì cộng đồng, hiến máu cứu người',
        description:
          'Tham gia Chiến dịch Tiếp sức mùa thi 2026, Hiến máu nhân đạo Ngày Chủ nhật Đỏ.',
        max: 10,
        score: 10,
        evidence: 'Ghi nhận từ App DDUT: 02 hoạt động xã hội',
      },
      {
        id: 9,
        title: 'Tham gia hoạt động văn nghệ, thể dục thể thao, ngày hội việc làm',
        description: 'Hội thao Sinh viên Bách khoa Đà Nẵng BK-Games 2026, Job Fair DUT.',
        max: 10,
        score: 8,
        evidence: 'Tải ảnh thẻ VĐV bóng đá',
      },
    ],
  },
  {
    numeral: 'IV',
    title: 'Phẩm chất công dân và quan hệ với cộng đồng',
    max: 25,
    criteria: [
      {
        id: 10,
        title: 'Chấp hành nghiêm chỉnh chủ trương đường lối của Đảng, pháp luật Nhà nước',
        description:
          'Không vi phạm Luật An ninh mạng, luật giao thông đường bộ và quy định trật tự an toàn công cộng.',
        max: 15,
        score: 15,
        evidence: 'Tốt, không vi phạm',
      },
      {
        id: 11,
        title: 'Có lối sống lành mạnh, quan hệ tốt với thầy cô, bạn bè và nhân dân địa phương',
        description:
          'Thực hiện tốt đăng ký tạm trú, giữ gìn đoàn kết tương trợ trong học tập và sinh hoạt.',
        max: 10,
        score: 10,
        evidence: 'Đã khai báo cư trú VNeID đầy đủ',
      },
    ],
  },
  {
    numeral: 'V',
    title: 'Ý thức và kết quả tham gia phụ trách lớp, đoàn thể hoặc thành tích đặc biệt',
    max: 10,
    criteria: [
      {
        id: 12,
        title: 'Giữ nhiệm vụ trong Ban cán sự lớp, Ban chấp hành Chi đoàn, Đội nhóm trực thuộc',
        description: 'Hoàn thành tốt nhiệm vụ được giao, tổ chức sinh hoạt lớp định kỳ đầy đủ.',
        max: 5,
        score: 5,
        evidence: 'Bí thư Chi đoàn 23T_DT4',
      },
      {
        id: 13,
        title: 'Được khen thưởng các cấp hoặc đạt giải thưởng trong các kỳ thi kỹ thuật, đồ án',
        description:
          'Đạt giải Ba Robocar Khoa Điện tử Viễn thông hoặc khen thưởng cấp Trường trở lên.',
        max: 5,
        score: 2,
        evidence: 'Giấy khen Robocar 2026',
      },
    ],
  },
];

export const classStudents = [
  'Nguyễn Phan Tuấn Anh',
  'Nguyễn Ngọc Ánh',
  'Dương Văn Chí Bảo',
  'Võ Hoàng Thái Bảo',
  'Lê Văn Ngọc Châu',
  'Nguyễn Minh Công',
  'Châu Văn Thành Đạt',
  'Phan Phước Đạt',
  'Nguyễn Đình Đức',
  'Nguyễn Văn Dương',
  'Võ Văn Phương Duy',
  'Nguyễn Hoàng Hải',
  'Lâm Trung Hiếu',
  'Phan Minh Hiếu',
  'Nguyễn Thị Thanh Hoa',
  'Nguyễn Duy Hoàng',
  'Lê Trần Tuấn Hùng',
  'Đặng Hoàng Huy',
  'Nguyễn Hoàng Huy',
  'Đặng Đăng Khoa',
];
