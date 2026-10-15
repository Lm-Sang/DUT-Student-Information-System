import { paths } from '@/shared/config/routes';

export interface NavigationItem {
  label: string;
  to?: string;
  children?: readonly NavigationItem[];
}

// Items without a route represent flows that do not exist in the app yet.
export const studentNavigation: readonly NavigationItem[] = [
  { label: 'Trang chủ', to: paths.dashboard },
  {
    label: 'Chương trình đào tạo',
    children: [
      { label: 'Học phần', to: paths.courses },
      { label: 'Đăng ký học phần', to: paths.registration },
      { label: 'Đồ án & tốt nghiệp', to: paths.thesis },
    ],
  },
  { label: 'Lịch học & Lịch thi', to: paths.schedule },
  { label: 'Kết quả học tập', to: paths.grades },
  { label: 'Học phí', to: paths.tuition },
  {
    label: 'Rèn luyện & Đoàn hội',
    children: [
      { label: 'Tự đánh giá rèn luyện', to: paths.conductSelf },
      { label: 'Đánh giá của lớp', to: paths.conductClass },
      { label: 'Kết quả cộng đồng', to: paths.communityResults },
      { label: 'Hoạt động cộng đồng', to: paths.communityActivities },
    ],
  },
  {
    label: 'Dịch vụ',
    children: [
      { label: 'Đề nghị trường', to: paths.serviceRequests },
      { label: 'Đăng ký BHYT, BHTT' },
      { label: 'Đăng ký thi Anh văn chuẩn đầu ra' },
    ],
  },
];

export const adminNavigation: readonly NavigationItem[] = [
  { label: 'Quản trị hệ thống', to: paths.admin },
  { label: 'Điều phối hồ sơ', to: paths.adminRequests },
];
export const staffNavigation: readonly NavigationItem[] = [
  { label: 'Hồ sơ được phân công', to: paths.staffRequests },
];
