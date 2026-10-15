import type { CurrentCourse } from '../types';

export interface ProgramCourse {
  code: string;
  name: string;
  credits: number;
  grade: string;
  condition: string;
  status: 'Đã đạt' | 'Đang học' | 'Chưa học';
}

export interface SemesterResult {
  term: string;
  credits: number;
  gpa: string;
  average: string;
  conduct: string;
  accumulatedCredits: number;
  accumulatedGpa: string;
}

export const academicPortalMock = {
  student: 'Lê Minh Sang · 102230369 · 23T_DT4',
  program: {
    name: 'Công nghệ Thông tin K2023 Đặc thù – CNPM',
    code: '1024034',
    majorCode: '7480201',
    duration: '8 học kỳ',
    courses: [
      {
        code: '1022970',
        name: 'Cấu trúc máy tính và vi xử lý',
        credits: 2,
        grade: '4.0',
        condition: 'Không có',
        status: 'Đã đạt',
      },
      {
        code: '3050011',
        name: 'Vật lý 1',
        credits: 3,
        grade: '4.0',
        condition: 'Học trước: Giải tích 1',
        status: 'Đã đạt',
      },
      {
        code: '1023280',
        name: 'Cấu trúc dữ liệu',
        credits: 2,
        grade: '4.0',
        condition: 'Học trước: Kỹ thuật lập trình',
        status: 'Đã đạt',
      },
      {
        code: '1021263',
        name: 'Toán rời rạc',
        credits: 3,
        grade: '4.0',
        condition: 'Học trước: Kỹ thuật lập trình',
        status: 'Đã đạt',
      },
      {
        code: '1020072',
        name: 'Phương pháp tính',
        credits: 3,
        grade: '3.5',
        condition: 'Học trước: Kỹ thuật lập trình',
        status: 'Đã đạt',
      },
      {
        code: '1022933',
        name: 'PBL1: Dự án lập trình tính toán',
        credits: 2,
        grade: '4.0',
        condition: 'Song hành: Phương pháp tính',
        status: 'Đã đạt',
      },
      {
        code: '4130311',
        name: 'Anh văn A2.2',
        credits: 4,
        grade: '4.0',
        condition: 'Tiên quyết: Anh văn A2.1',
        status: 'Đã đạt',
      },
    ] satisfies ProgramCourse[],
  },
  results: [
    {
      term: 'HK1 · 2023 – 2024',
      credits: 18,
      gpa: '3.61',
      average: '8.29',
      conduct: '82',
      accumulatedCredits: 18,
      accumulatedGpa: '3.61',
    },
    {
      term: 'HK2 · 2023 – 2024',
      credits: 23,
      gpa: '3.59',
      average: '8.39',
      conduct: '84',
      accumulatedCredits: 41,
      accumulatedGpa: '3.60',
    },
    {
      term: 'HK1 · 2024 – 2025',
      credits: 18,
      gpa: '3.39',
      average: '7.88',
      conduct: '84',
      accumulatedCredits: 59,
      accumulatedGpa: '3.53',
    },
    {
      term: 'HK2 · 2024 – 2025',
      credits: 26,
      gpa: '3.83',
      average: '8.68',
      conduct: '84',
      accumulatedCredits: 85,
      accumulatedGpa: '3.62',
    },
    {
      term: 'HK1 · 2025 – 2026',
      credits: 15,
      gpa: '3.87',
      average: '9.14',
      conduct: '90',
      accumulatedCredits: 100,
      accumulatedGpa: '3.66',
    },
    {
      term: 'HK2 · 2025 – 2026',
      credits: 12,
      gpa: '3.92',
      average: '9.06',
      conduct: '—',
      accumulatedCredits: 112,
      accumulatedGpa: '3.69',
    },
  ] satisfies SemesterResult[],
  currentCourses: [
    {
      code: '1021883',
      classCode: '1021883.2610.23.10',
      classGroup: '23T_DT4',
      name: 'Chuyên đề CN CNPM',
      credits: 2,
      lecturer: 'ThS. Nguyễn Văn Liêm',
      day: 'Thứ Bảy',
      periods: 'Tiết 1 - 2',
      time: '07:00 - 08:50',
      room: 'E2.203',
      weeks: '01 - 16',
      formula: 'Bài tập 20% + Giữa kỳ 20% + Cuối kỳ 60%',
    },
    {
      code: '1020413',
      classCode: '1020413.2610.23.11',
      classGroup: '23T_DT4',
      name: 'Kiểm thử phần mềm',
      credits: 2,
      lecturer: 'TS. Võ Đức Hoàng',
      day: 'Thứ Tư',
      periods: 'Tiết 4 - 5',
      time: '09:50 - 11:40',
      room: 'P.204',
      weeks: '01 - 16',
      formula: 'Bài tập 20% + Giữa kỳ 20% + Cuối kỳ 60%',
    },
    {
      code: '1021893',
      classCode: '1021893.2610.23.11',
      classGroup: '23T_DT4',
      name: 'Kiến trúc hướng dịch vụ',
      credits: 2,
      lecturer: 'TS. Đồng Ngọc Nguyên Thịnh',
      day: 'Thứ Ba',
      periods: 'Tiết 2 - 3',
      time: '07:55 - 09:45',
      room: 'F307',
      weeks: '01 - 16',
      formula: 'Bài tập 20% + Giữa kỳ 20% + Cuối kỳ 60%',
      examGroup: 'B',
    },
    {
      code: '1023780',
      classCode: '1023780.2610.23.11A',
      classGroup: 'Đồ án',
      name: 'PBL 6: Dự án CN CNPM',
      credits: 4,
      lecturer: 'PGS.TS. Đặng Thiên Bình',
      day: 'Thứ Năm',
      periods: 'Tiết 6 - 9',
      time: '12:30 - 16:15',
      room: 'C1.201 Lab',
      weeks: '01 - 16',
      kind: 'project',
      formula: 'Đồ án 40% + Cuối kỳ 60%',
    },
    {
      code: '1021803',
      classCode: '1021803.2610.23.10',
      classGroup: 'Thực tập',
      name: 'Thực tập Tốt nghiệp (CNPM)',
      credits: 2,
      lecturer: 'TS. Nguyễn Thế Xuân Ly',
      day: 'On-site',
      periods: 'Phân công Doanh nghiệp',
      room: 'Doanh nghiệp',
      weeks: '22 - 25',
      kind: 'internship',
      formula: 'Chuyên cần 30% + Bảo vệ 70%',
      examGroup: 'B',
    },
  ] satisfies CurrentCourse[],
};
