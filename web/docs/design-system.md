# DUT Workspace

Thiết kế Modern Minimalist / Clean SaaS cho cổng sinh viên DUT. Giữ xanh DUT, font tiếng Việt và các luồng nghiệp vụ hiện có; tổ chức lại điều hướng, thứ tự thông tin và mật độ giao diện.

## Nguồn thiết kế

[`design-system/tokens.json`](../design-system/tokens.json) là nguồn giá trị thiết kế. Giao diện **chỉ có light mode**; mỗi màu có một giá trị. Không đọc lựa chọn theme cũ và không đổi theo hệ điều hành. HTML/CSS đặt `color-scheme: only light`. Chạy `npm run tokens:build` để sinh `src/app/styles/tokens.css`; không chỉnh file CSS sinh tự động. `npm run check:tokens` nằm trong `npm run check`, phát hiện CSS lệch nguồn JSON.

CSS sinh màu semantic cho Tailwind, font, motion và kích thước khung chính. Spacing, radius và type trong JSON là thang giá trị dùng để đối chiếu component CSS và Figma. Không dùng màu hex riêng trong từng page. `action` là màu nền nút có chữ trắng; `brand` là màu chữ/link, không thay thế lẫn nhau.

| Vai trò                            | Token / quy ước                                            |
| ---------------------------------- | ---------------------------------------------------------- |
| Nền trang / bề mặt / vùng nhấn nhẹ | `canvas`, `surface`, `subtle`                              |
| Chữ chính / phụ                    | `ink`, `muted`                                             |
| Link / nút chính                   | `brand`, `action`, `brand-hover`                           |
| Viền trang trí / viền input        | `line`, `field-border`                                     |
| Trạng thái                         | `success`, `warning`, `danger`, kèm token `*-soft`         |
| Font                               | Be Vietnam Pro 400, 500, 600, 700, tải từ asset Fontsource |
| Cỡ chữ ở root 16px                 | Caption 12, body 14, input mobile 16, section 18, title 28 |
| Spacing                            | 4, 8, 12, 16, 20, 24, 32, 48, 64px                         |
| Bo góc                             | Control 8, panel 12, dialog 16px                           |
| Chuyển động                        | Feedback 120ms, menu 160ms, page/dialog 200ms              |

Cỡ chữ sử dụng `rem`, scale cùng thiết lập font của trình duyệt. Không dùng chữ nhỏ hơn 12px ở cỡ mặc định. Motion dùng opacity/transform và màu; `prefers-reduced-motion` bỏ animation, transition và smooth scroll.

## Khung và component

- `PortalLayout` V1 dùng app bar ở trên, nội dung bên dưới rộng toàn cửa sổ và tối đa 1440px, padding 16–32px. Dưới 1100px thay menu ngang bằng drawer đầy đủ có backdrop. `Sidebar` chỉ làm điều hướng bên trong drawer V1; mở sẵn nhóm chứa trang hiện tại.
- `PortalHeader` V1: thương hiệu, tìm **học phần** thực tế, Ctrl/Cmd+K, thông báo và tài khoản ở hàng trên; các nhóm điều hướng ngang ở hàng dưới. Dropdown mở bằng chuột hoặc bàn phím, ArrowDown vào liên kết đầu, Tab đi qua liên kết, Escape đóng và trả focus. Trên điện thoại ô tìm kiếm xuống hàng riêng. Không mô tả là tìm mọi dữ liệu.
- `PageHeading`, `Card`, `Button`, `Badge`: một hệ phân cấp tiêu đề, bề mặt, hành động và trạng thái. Dùng text đi kèm màu trạng thái. Nút có focus-visible, disabled và feedback khi nhấn.
- `AcademicUi`: tabs gạch chân, metrics theo hàng, bảng chữ số tabular. Bảng nhiều cột đặt trong region có tên và cuộn ngang; không làm cả trang tràn ngang. Lịch học chuyển sang danh sách thẻ trên mobile, giữ đủ dữ liệu và tác vụ.
- `Dialog`: native `dialog.showModal()`, khóa cuộn nền, focus trong dialog, Escape/backdrop/nút đóng, trả focus về điểm mở. Dùng chung cho học phí và mobile drawer.
- Form: label rõ, trạng thái lỗi có thông báo; login focus trường thiếu đầu tiên. Input mobile tối thiểu 16px, control nền sáng theo token. Minh chứng upload hiển thị focus ở label chứa input ẩn.
- `SectionNav`: điều hướng từng mục bằng query `view`, hỗ trợ Back/Forward và deep link. Học phí có Khoản phải nộp / Theo học phần / Lịch sử; dịch vụ có Lập đơn / Theo dõi đơn / Báo thiết bị. Các form giữ mounted khi đổi mục để bảo toàn bản nháp và file đã chọn.
- `Disclosure`: thông tin phụ chỉ mở khi cần; nút có `aria-expanded`, `aria-controls` và dùng được bằng bàn phím. Khi in, nội dung các nhóm tiêu chí vẫn hiển thị đầy đủ.
- Phiếu rèn luyện chỉ mở sẵn nhóm tiêu chí đầu tiên; hạn gửi, tổng điểm và nút lưu/gửi luôn nằm ngoài phần thu gọn. Phiếu đánh giá của lớp dùng bộ chọn nhóm, giữ điểm đã nhập khi chuyển nhóm.
- Dashboard tập trung lịch và thông báo; thông tin hồ sơ đã có trong menu tài khoản. Lịch mobile giữ tên học phần, giờ và phòng học, mở chi tiết để xem giảng viên/tuần/tác vụ.
- Trang công khai theo frame Figma `1:5910`, hero `1:6141`: giới thiệu/ảnh trường bên trái (7 phần), `MicrosoftSignInCard` bên phải (5 phần); mobile chuyển một cột. Giữ thẻ dịch vụ có mô tả/liên kết, thông báo hiển thị sẵn tóm tắt, thẻ tra cứu và danh bạ hỗ trợ. Logo Microsoft 24px ở tiêu đề và 20px trong CTA là hai asset riêng xuất từ Figma, giữ kích thước gốc. `PublicFooter` riêng hiển thị đầy đủ thông tin trường. Trang `/login` giữ bố cục hai vùng và cơ chế xác thực mẫu; cả hai chỉ dùng light mode.
- Giảm nhãn chữ hoa, đoạn hướng dẫn lặp lại và các thẻ lồng nhau. Bảng không bỏ dữ liệu nghiệp vụ; phần lặp (ví dụ hai cột cùng học kỳ trong đơn đề nghị) được gộp.

## Handoff Figma

File: [DUT Student Portal](https://www.figma.com/design/hq4ifJ2w6AjspNHzSafral/DUT-Student-Portal). [`figma-map.json`](../design-system/figma-map.json) lưu route, frame gốc và trạng thái đồng bộ; các frame là **bản thiết kế cũ đã khảo sát**, không phải kết quả cập nhật mới.

Bản V2 đã được dựng bằng native layers trong Figma. [figma-v2-map.json](../design-system/figma-v2-map.json) lưu riêng các frame V2; `figma-map.json` tiếp tục lưu tham chiếu V1.

## Giao diện V2

V2 dùng nền `#F3F6FC`, surface trắng, chữ `#1D3051`, màu hành động `#2F6EDB` và nền nhấn `#E9F1FF`. Be Vietnam Pro: tiêu đề 28/38 semibold, tiêu đề khối 18/26 semibold, nội dung 14/22, control 13/20 và metadata 12/18. Card bo 18px, control bo 12px; bóng đổ chỉ dùng cho overlay.

Token V2 khai báo một lần trong `.portal-v2` ở `src/app/styles/v2.css`. Không thay token V1 hoặc tạo token riêng theo từng trang. Các khối mới dùng lớp V2; phần trình bày dùng chung chỉ được ghi đè dưới `.portal-v2`.

Desktop 1600×1080: padding và khoảng cách 24px, sidebar 224px, toolbar 56px, vùng nội dung cuộn. Trang chủ chia hai cột 812/468; khối tiến độ học tập, biểu đồ GPA và học phí có phân cấp riêng. Biểu mẫu dịch vụ dùng cột nhập liệu và cột hướng dẫn. Màn hình nhỏ chuyển một cột, dùng drawer điều hướng và giữ bảng đầy đủ trong vùng cuộn ngang. Chi tiết routing và so sánh hai bản ở [Giao diện V1 và V2](interface-versions.md).

Sidebar V2 có nút `<` ở phần thương hiệu, thu gọn thành dải icon 72px và đổi thành `>` để mở rộng. Lưu lựa chọn riêng trong `dut-v2-sidebar-collapsed`, có fallback khi storage bị chặn. Thanh cuộn được ẩn nhưng vẫn cuộn bằng chuột, trackpad và focus bàn phím. Icon có tên truy cập và tooltip; nhóm Rèn luyện & Đoàn hội mở danh sách nổi bằng native popover, hỗ trợ Enter, ArrowDown, Tab và Escape. Popup căn trong viewport và đóng khi chuyển sang mobile. Dưới hoặc bằng 900px dùng drawer đầy đủ, độc lập với trạng thái thu gọn trên desktop.

Khi có kết nối ghi, sử dụng JSON làm nguồn đối chiếu với collection `DUT / Học tập` hiện có:

1. Kiểm tra variables/styles/components và binding đang dùng; giữ ID có thể tái sử dụng. Ánh xạ màu sang semantic variables với một mode Light, cập nhật DUT/Title, Section, Body, Label, Caption và Metric.
2. Xây dựng hoặc cập nhật component native: Button (primary/secondary/ghost, default/hover/pressed/focus/disabled), Input, Select, Badge, Card, Tabs, Table, Dialog, Sidebar và Header. Bind màu, spacing/radius tương ứng; dùng auto-layout, text layer và instance.
3. Cập nhật các frame trong manifest theo cấu trúc web mới. Bổ sung frame riêng cho các route chưa có đối tượng độc lập được xác nhận và biến thể mobile 390px. Không thay màn bằng ảnh chụp phẳng.
4. So sánh screenshot cùng viewport và dữ liệu; kiểm tra bố cục, typography, trạng thái component, overflow và prototype trước khi đánh dấu `synced`.

## Kiểm tra

`npm run check` kiểm tra token, kiến trúc, lint, unit test và production build. `npm run test:e2e` chạy Chromium, kiểm tra luồng nghiệp vụ cùng app bar V1, sidebar thu gọn V2, search, modal focus, drawer, light cố định và reduced motion.

E2E khởi chạy bản production preview ở port 4174, tách khỏi Vite dev và HMR. `npm run test:e2e:webkit` chạy cùng bộ kiểm thử bằng WebKit khi môi trường hỗ trợ. Trong phiên kiểm tra này, WebKit Windows đóng tiến trình ngay khi tạo page, trước khi tải ứng dụng; chưa thể xác nhận Safari/iOS.

Để chụp toàn bộ 23 route cụ thể, 404 và 4 mục có query `view`, chạy Vite ở port 4173 rồi:

```sh
npm run audit:ui -- simplified --system-dark
npm run audit:ui -- simplified-large --large-text --system-dark
npm run audit:ui -- webkit-touch --webkit --touch
```

Ảnh và báo cáo nằm trong `test-results/ui-audit-<tên>/` (gitignored). Báo cáo ghi URL thực tế sau đăng nhập, lỗi JavaScript, tràn trang, chữ quá nhỏ và các vùng bảng cuộn. Kiểm tra chữ lớn tăng root font từ 16 lên 32px; đây không phải kiểm thử trên thiết bị Android/iOS vật lý.

Có thể đặt biến môi trường `PORTAL_URL` để audit bản production đang chạy ở port 4174 thay cho dev mặc định 4173. Lượt nghiệm thu cuối sử dụng bản production; xem [kết quả chi tiết](ui-redesign.md#kết-quả-triển-khai-và-kiểm-tra).

`--system-dark` chỉ giả lập hệ điều hành tối để xác nhận ứng dụng vẫn sáng; không bật dark mode trong ứng dụng.
