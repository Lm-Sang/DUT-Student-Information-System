# DUT Student Portal — Web

React 19 + TypeScript strict + Tailwind CSS 4 + Vite. Giao diện DUT Workspace theo hướng Modern Minimalist / Clean SaaS; code tổ chức theo feature và luồng page → custom hook → service.

## Cấu trúc

```text
src/
├── app/
│   ├── layouts/          # Khung portal dùng chung
│   ├── navigation/       # Header, menu, cấu hình điều hướng
│   ├── pages/            # Trang cấp ứng dụng (404)
│   ├── providers/        # Router, AuthProvider
│   ├── router/           # Route và nhóm phân quyền
│   ├── styles/           # Tailwind và CSS sinh từ design tokens
│   └── App.tsx
├── features/
│   ├── auth/
│   ├── student/
│   ├── academics/
│   ├── registration/
│   ├── tuition/
│   ├── conduct/         # Tự chấm và cán bộ lớp đánh giá rèn luyện
│   ├── community/       # Hoạt động và kết quả phục vụ cộng đồng
│   ├── services/        # Đề nghị trực tuyến, báo thiết bị hỏng
│   ├── notifications/
│   └── admin/
│       # Mỗi feature có các nhánh cần thiết:
│       # pages/, components/, hooks/, services/, types/, mocks/, index.ts
├── shared/
│   ├── assets/           # Icon xuất từ Figma
│   ├── config/           # Đường dẫn, môi trường
│   ├── hooks/            # Hook độc lập nghiệp vụ
│   ├── lib/              # HTTP/mock transport, format
│   └── ui/               # Button, Card, Table, trạng thái dữ liệu…
└── main.tsx
tests/e2e/                # Kiểm thử luồng người dùng
scripts/                  # Kiểm tra kiến trúc, sinh token và chụp UI
design-system/            # Token light và manifest Figma
docs/README.md            # Mục lục kiến trúc, design system, khảo sát UI
```

Import bằng alias `@/`. Ví dụ: `@/shared/ui/Button`, `@/features/auth`. Chi tiết tại [mục lục tài liệu](docs/README.md). Giao diện V2 triển khai theo các frame V2 đã chỉnh trong Figma, dùng các đường dẫn `/v2` song song với V1.

## Chạy ứng dụng

Yêu cầu Node.js 22.12+ hoặc 24 LTS và npm.

```bash
npm ci
npm run dev
```

Demo: `student01`–`student12` / `student123`, `admin01 / admin123`. Phiên đăng nhập ở bộ nhớ; refresh sẽ yêu cầu đăng nhập lại. Các service học tập sử dụng mock; `VITE_API_BASE_URL` trong `.env.example` dành cho việc nối HTTP adapter sau này.

Luồng hồ sơ mới: sinh viên tại `/services/requests`, chuyên viên tại `/staff/requests`, admin điều phối tại `/admin/requests`; thêm `/v2` để dùng bản V2. Chuyên viên dùng `staff01`–`staff16` / `staff123` (01, 04–10: Đào tạo; 02, 11–14: CTSV; 03, 15–16: CNTT). Hồ sơ và file minh chứng lưu bền vững trong IndexedDB, đồng bộ giữa các tab cùng trình duyệt; chưa gửi đến DUT. Bộ mẫu v3 có 428 hồ sơ / 32 loại; admin dùng **Dữ liệu trải nghiệm → Nạp thêm bộ mẫu v3** để thêm vào dữ liệu cũ. Xem [tài khoản và kịch bản thử từng loại](docs/demo-testing.md), [hướng dẫn luồng hồ sơ và nguồn nghiệp vụ](docs/request-workflow.md).

### So sánh V1 và V2

Mở `/` cho V1 và `/v2/` cho V2. Sau đăng nhập, trang sinh viên tương ứng là `/dashboard` và `/v2/dashboard`. Mỗi bản có liên kết mở cùng trang của bản còn lại ở tab mới. Tất cả route hiện có đều truy cập được với tiền tố `/v2`, bao gồm trang chi tiết và tham số tìm kiếm. Đăng nhập riêng ở mỗi tab theo cơ chế phiên hiện tại. Xem [hướng dẫn V1/V2](docs/interface-versions.md).

Trang chủ có khối Microsoft 365 theo Figma. `VITE_MICROSOFT_SIGN_IN_URL` để trống trong demo; khi có URL SSO do backend cung cấp, có thể cấu hình điểm chuyển hướng này. Cơ chế callback/phiên Microsoft thật chưa được tích hợp; xem [kết nối backend](docs/architecture.md#kết-nối-backend).

## Kiểm tra

```bash
npm run check             # Tokens, architecture, lint, unit tests, TypeScript và production build
npx playwright install chromium
npm run test:e2e          # Luồng đăng nhập, học phí, rèn luyện, cộng đồng, dịch vụ, mobile…
npm run format:check
# Tùy chọn: npx playwright install webkit && npm run test:e2e:webkit
```

Các lệnh riêng: `npm run build`, `npm run lint`, `npm test`, `npm run test:watch`, `npm run format`, `npm run preview`.

Các route cũ được giữ nguyên: `/login`, `/dashboard`, `/academic/courses`, `/academic/courses/:id`, `/academic/grades`, `/academic/schedule`, `/registration`, `/tuition`, `/notifications`, `/admin`.

Trang Figma `9:5` có thêm các route `/academic/grades/current`, `/academic/grades/standing`, `/academic/grades/plo`, `/academic/thesis` và `/academic/thesis/details`. Dữ liệu học tập hiện là dữ liệu mẫu từ thiết kế; bản nháp đề tài tốt nghiệp được lưu riêng theo học kỳ trong trình duyệt.

Trang Figma `9:6`, `9:7`, `9:8` có thêm `/conduct/self-assessment`, `/conduct/class-assessment`, `/community/activities`, `/community/activities/:id`, `/community/results` và `/services/requests`; `/tuition` được cập nhật theo thiết kế mới. Phiếu rèn luyện lưu bản nháp trong trình duyệt. Đăng ký hoạt động, đơn đề nghị và báo thiết bị là thao tác mẫu ở frontend, chưa gửi đến hệ thống của Trường. Các mục bảo hiểm và thi Anh văn vẫn được đánh dấu chưa khả dụng do chưa có thiết kế màn hình tương ứng.

Giao diện chỉ dùng light mode. Các màn nhiều dữ liệu chia theo tác vụ và dùng phần mở rộng cho hướng dẫn/chi tiết phụ; xem [design system](docs/design-system.md).
