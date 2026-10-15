# Kiến trúc web DUT Student Portal

## Phân lớp và chiều phụ thuộc

```text
app → features → shared
      page → hook → service → mock transport / HTTP client
```

- `app/` ghép ứng dụng: router, provider, layout, cấu hình điều hướng, stylesheet gốc.
- `features/` sở hữu nghiệp vụ, màn hình, thành phần, hook, service, types và dữ liệu mẫu của từng tính năng.
- `shared/` chứa thành phần dùng lại không phụ thuộc nghiệp vụ: UI, tải dữ liệu bất đồng bộ, HTTP client, format, config và assets.
- Mỗi feature cung cấp API công khai qua `index.ts`. Feature khác và `app/` chỉ import qua API này, không truy cập thư mục nội bộ.
- `registration` sử dụng API công khai của `academics` để tra cứu học phần. Không tạo bản sao `Course` hoặc danh mục học phần.
- Chỉ tạo thư mục khi có code thực tế. Feature nhỏ không cần có đủ tất cả các nhánh thư mục.

`npm run check:architecture` kiểm tra chiều phụ thuộc, public API, việc đọc mock và việc page truy cập service trực tiếp.

## Trách nhiệm từng thành phần

| Thành phần    | Trách nhiệm                                                        |
| ------------- | ------------------------------------------------------------------ |
| `pages/`      | Ghép giao diện, trạng thái loading/error/empty, tham số URL        |
| `components/` | Giao diện của feature, nhận dữ liệu và callback qua props          |
| `hooks/`      | Tải dữ liệu, trạng thái form/lọc, tính tổng, thao tác và xử lý lỗi |
| `services/`   | Hợp đồng dữ liệu và thao tác nghiệp vụ, độc lập React              |
| `types/`      | Kiểu dữ liệu của feature                                           |
| `mocks/`      | Fixtures chỉ được service sử dụng                                  |
| `index.ts`    | Những export cần được dùng bên ngoài feature                       |

Auth provider sở hữu phiên đăng nhập; `useAuth` là API đọc phiên. `ProtectedRoute` bảo vệ nhóm route và phân quyền student/admin/staff. Router giữ nguyên URL cũ và khôi phục deep link sau đăng nhập. Phiên đăng nhập ở bộ nhớ; refresh yêu cầu đăng nhập lại. Luồng hồ sơ trong feature `services` có service IndexedDB với Blob, revision và đồng bộ tab; xem [luồng hồ sơ](request-workflow.md).

`useAsyncData` nhận fetcher ổn định, truyền `AbortSignal`, hủy request khi unmount/đổi fetcher/reload và bỏ qua response cũ kể cả khi transport không hỗ trợ hủy. Hook của feature đóng gói fetcher và giá trị suy ra. Thao tác đăng ký học phần khóa nút trong lúc chờ và hiển thị lỗi tại trang.

## Ánh xạ Figma

File: [DUT Student Portal](https://www.figma.com/design/hq4ifJ2w6AjspNHzSafral/DUT-Student-Portal).

| Thiết kế                                                  | Code                                                                      |
| --------------------------------------------------------- | ------------------------------------------------------------------------- |
| Header HOME-01 `25:287`, navigation `25:325`              | `app/navigation`, `app/layouts/PortalLayout.tsx`                          |
| DUT / Học tập tokens, Be Vietnam Pro                      | `design-system/tokens.json`, CSS sinh tự động, font tự lưu qua Fontsource |
| Trang chủ sinh viên                                       | `features/student`                                                        |
| Chương trình/học phần, kết quả học tập, lịch học/lịch thi | `features/academics`                                                      |
| Đăng ký học phần                                          | `features/registration`                                                   |
| Lịch sử thanh toán `1:1506`                               | `features/tuition/components/PaymentHistory.tsx`                          |
| Học phí `9:6`                                             | `features/tuition`                                                        |
| Rèn luyện và hoạt động cộng đồng `9:7`                    | `features/conduct`, `features/community`                                  |
| Đề nghị và báo thiết bị `9:8`                             | `features/services`                                                       |
| Thông báo, quản trị                                       | `features/notifications`, `features/admin`                                |

Khung DUT Workspace dùng sidebar desktop, drawer mobile, tìm học phần Ctrl/Cmd+K và giao diện light cố định. Nhóm **Dịch vụ** có lối vào Đồ án / Khóa luận tốt nghiệp; **Rèn luyện & Đoàn hội** có 4 mục. Quy ước giao diện và nguồn token nằm trong [design system](design-system.md). Các ID Figma dưới đây là bản gốc đã khảo sát; MCP hiện chỉ đọc nên chưa đồng bộ native layers với giao diện mới. Manifest chi tiết: [figma-map.json](../design-system/figma-map.json).

Các màn rèn luyện, hoạt động cộng đồng và đề nghị trường đã có route từ menu. Bảo hiểm và thi Anh văn vẫn chưa có màn hình trong Figma nên menu đánh dấu chưa khả dụng.

Trang Figma `9:5` đã được ánh xạ thành 9 màn học tập: khung chương trình, chi tiết học phần, tổng quan kết quả, điểm kỳ hiện tại, học vụ, điểm PLO, lịch học/thi, trạng thái đồ án và thông tin đề tài. Dữ liệu của các màn này nằm trong `features/academics/mocks/academicPortal.mock.ts` và được đọc qua service/hook; dữ liệu đăng ký học phần cũ vẫn được giữ riêng. Công cụ PLO chỉ tính thử theo trọng số người dùng nhập, không phải kết quả chính thức. Form đề tài lưu bản nháp theo học kỳ trong `localStorage`, chưa gửi đến backend.

Trang `9:6` có bảng học phí lớp học phần, hai đợt thu, lịch sử giao dịch và tra cứu hóa đơn. Trang `9:7` có phiếu tự đánh giá, phiếu cán bộ lớp, danh sách và chi tiết hoạt động, kết quả phục vụ cộng đồng. Trang `9:8` gộp đơn đề nghị trực tuyến và báo thiết bị hỏng. Dữ liệu của ba trang này là mẫu để trình diễn giao diện; thao tác lưu/chấm/đăng ký/đề nghị/báo thiết bị không đồng bộ với API DUT. Các form có dữ liệu bền vững được lưu trong `localStorage` khi được nêu rõ trên giao diện; phiên đăng nhập vẫn ở bộ nhớ.

Icon tìm kiếm, thông báo, xác minh và trạng thái đồ án trong `shared/assets/figma` là asset xuất trực tiếp từ Figma, được lưu trong repo để không phụ thuộc URL cục bộ của Figma.

## Kết nối backend

Service học tập hiện dùng `mockRequest`; service hồ sơ dùng IndexedDB trên browser. `VITE_API_BASE_URL` cấu hình `httpClient`, không tự chuyển service sang API thật. Khi hợp đồng API có sẵn:

1. Thay nội dung service của feature bằng `httpClient`, giữ kiểu trả về/hook hiện có.
2. Truyền `signal` từ hook đến request đọc; ánh xạ và kiểm tra DTO tại service.
3. Bổ sung cơ chế phiên/token theo hợp đồng backend. Frontend role guard không thay thế phân quyền server.
4. Thay fixtures bằng dữ liệu được API xác nhận và thêm kiểm thử hành vi tương ứng.

Trang công khai có `MicrosoftSignInCard` (feature `auth`, xuất qua public index). `VITE_MICROSOFT_SIGN_IN_URL` là URL bắt đầu SSO do backend cung cấp, dùng cho chuyển trang bằng anchor. Để trống trong bản demo: nút hiển thị thông báo Microsoft chưa khả dụng và lối sang đăng nhập trải nghiệm, không tạo phiên đăng nhập giả. Đặt URL này chỉ nối điểm bắt đầu chuyển hướng; backend vẫn cần hợp đồng callback, phiên và profile để đăng nhập thật vào app. Không tự suy ra endpoint Microsoft từ `VITE_API_BASE_URL` hoặc chọn một host chưa được xác nhận trong `api-catalog.md`.

Hướng dẫn Tailwind/Vite: [Tailwind Vite integration](https://tailwindcss.com/docs/installation/using-vite). Cấu hình dùng `@tailwindcss/vite` và `@import 'tailwindcss'`, không cần `tailwind.config.js` của Tailwind 3.
