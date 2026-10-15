# Xem đồng thời giao diện V1 và V2

V1 tiếp tục dùng các URL hiện tại. V2 có cùng các tác vụ dưới tiền tố `/v2`.

| Trang                              | V1                                                      | V2                            |
| ---------------------------------- | ------------------------------------------------------- | ----------------------------- |
| Cổng thông tin công khai           | `/`                                                     | `/v2/`                        |
| Đăng nhập                          | `/login`                                                | `/v2/login`                   |
| Không gian sinh viên               | `/dashboard`                                            | `/v2/dashboard`               |
| Chương trình đào tạo               | `/academic/courses`                                     | `/v2/academic/courses`        |
| Chi tiết học phần                  | `/academic/courses/:id`                                 | `/v2/academic/courses/:id`    |
| Kết quả học tập                    | `/academic/grades`                                      | `/v2/academic/grades`         |
| Điểm kỳ hiện tại                   | `/academic/grades/current`                              | `/v2/academic/grades/current` |
| Học vụ / PLO                       | `/academic/grades/standing`, `/academic/grades/plo`     | Cùng URL với tiền tố `/v2`    |
| Lịch học và lịch thi               | `/academic/schedule`                                    | `/v2/academic/schedule`       |
| Đồ án / biểu mẫu đề tài            | `/academic/thesis`, `/academic/thesis/details`          | Cùng URL với tiền tố `/v2`    |
| Học phí                            | `/tuition`                                              | `/v2/tuition`                 |
| Tự đánh giá / đánh giá lớp         | `/conduct/self-assessment`, `/conduct/class-assessment` | Cùng URL với tiền tố `/v2`    |
| Hoạt động / kết quả cộng đồng      | `/community/activities`, `/community/results`           | Cùng URL với tiền tố `/v2`    |
| Dịch vụ sinh viên                  | `/services/requests`                                    | `/v2/services/requests`       |
| Hồ sơ, đăng ký học phần, thông báo | `/profile`, `/registration`, `/notifications`           | Cùng URL với tiền tố `/v2`    |

Chạy `npm run dev` trong `web/`, rồi mở `/` và `/v2/` ở hai tab. Liên kết **Xem giao diện V1/V2 ↗** mở cùng trang của bản còn lại trong tab mới, giữ tham số tìm kiếm và hash. Có thể mở trực tiếp một URL V2 bất kỳ. Đường dẫn được bảo vệ sẽ chuyển qua `/v2/login` rồi trở về trang đã yêu cầu.

Tài khoản mẫu sinh viên: `student01 / student123`. Phiên đăng nhập hiện nằm trong bộ nhớ của từng tab, nên cần đăng nhập riêng ở mỗi tab; tải lại trang cũng cần đăng nhập lại. Các bản nháp và yêu cầu mẫu đã lưu trong localStorage dùng chung dữ liệu nghiệp vụ như trước.

## Cách triển khai

- `AppProviders` chọn `BrowserRouter.basename` khi tải tài liệu: `/` cho V1, `/v2` cho V2. Các `Link`, `NavLink`, `Navigate`, tìm kiếm và thao tác history hiện có tự giữ đúng tiền tố. Chuyển bản giao diện dùng liên kết HTML mở tab mới.
- `PortalEditionProvider` cung cấp bản đang dùng cho các khối trình bày. V2 có `PortalV2Layout`, dashboard và hero công khai riêng. Các màn học tập, học phí, rèn luyện, cộng đồng, dịch vụ giữ hook, service và các bộ xử lý hiện có, bổ sung phần trình bày V2.
- `src/app/styles/v2.css` giới hạn token và CSS trong `.portal-v2`. Token V1 trong `design-system/tokens.json` giữ nguyên. Các thành phần chung chỉ đổi cách hiển thị khi nằm trong V2.
- Sidebar desktop và toolbar bao quanh vùng nội dung cuộn; mobile dùng drawer điều hướng, một cột và vùng cuộn ngang cho bảng. Drawer thông báo mở từ bên phải, giữ quản lý focus và phím Escape của `Dialog`.
- Asset V2 tải từ design context Figma vào `src/shared/assets/figma-v2/`. Không dùng URL asset tạm thời khi chạy ứng dụng.

Nguồn thiết kế và các trạng thái được ghi trong [figma-v2-map.json](../design-system/figma-v2-map.json). Dữ liệu mẫu hiện có được ưu tiên khi nội dung giữa các trạng thái thiết kế khác nhau; không bổ sung backend hoặc SSO trong thay đổi giao diện này.

## Khi đưa lên máy chủ

Máy chủ phải trả `index.html` cho các đường dẫn SPA, bao gồm `/v2/*`, như các đường dẫn V1. Asset vẫn được phục vụ từ gốc ứng dụng. Vite dev/preview đã hỗ trợ việc này. Không cần tạo ứng dụng hoặc backend thứ hai.

## Kiểm tra

`npm run check` kiểm tra tokens, kiến trúc, lint, unit tests và production build. `npx playwright test tests/e2e/v2.spec.ts --project=chromium` kiểm tra hai tab, CSS độc lập, deep link qua đăng nhập, tra cứu học phần, trang chi tiết, tab kết quả, đăng xuất, drawer, biểu mẫu và bảng trên mobile. Các kiểm thử V1 vẫn nằm trong `tests/e2e/portal.spec.ts`.
