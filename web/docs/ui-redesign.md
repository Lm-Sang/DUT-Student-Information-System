# DUT Workspace — phân tích và hướng thiết kế

**Cập nhật theo yêu cầu mới:** giao diện hiện chỉ dùng light mode. Phần sau đăng nhập giảm mật độ nội dung; phần trước đăng nhập giữ bố cục đầy đủ trước đợt tinh gọn. Các mục light/dark bên dưới ghi lại đợt thiết kế đầu, không phải quy ước hiện hành. Xem [design system](design-system.md) cho quy ước mới.

Ngày khảo sát: 08/10/2026. Phạm vi: toàn bộ giao diện `web/` và các màn tương ứng trong file DUT Student Portal. Giữ route, phân quyền, hợp đồng service, dữ liệu và cách lưu bản nháp hiện có.

## Hiện trạng đã kiểm tra

- React 19, TypeScript strict, Tailwind 4, React Router 7, Vite; font Be Vietnam Pro đã có trong repo. Kiến trúc `app → features → shared`, page → hook → service. Service hiện dùng mock, cấu hình URL không tự chuyển sang API DUT.
- 23 route cụ thể và trang 404; có công khai, đăng nhập, sinh viên và quản trị. Đã chụp baseline ở 1440, 768 và 390px bằng Chromium; ảnh và số đo lưu tại `test-results/ui-audit/` (không commit).
- 49 file TSX, 57 mã màu hex khác nhau; các màn dùng nhiều cách đặt tiêu đề, nút, bảng và thông báo. Đã có focus-visible, skip link, một phần keyboard navigation và reduced motion để kế thừa.
- Navigation ngang phải cuộn trên mobile, một nút menu vừa mở danh sách vừa chuyển trang theo thiết bị. Header gợi ý Ctrl+K nhưng chưa có xử lý phím. Placeholder tìm kiếm rộng hơn chức năng tìm học phần thực tế.
- Nhiều chữ 9–11px; bảng lịch tối thiểu 1040px, bảng thiết bị 1280px. Thu nhỏ viewport vẫn cần cuộn ngang để tìm thông tin quan trọng.
- Trang chủ đặt hồ sơ và chuẩn đầu ra trước lịch; một số nút chỉ có hình thức, và lối tắt “Nộp đơn trực tuyến” trỏ tới đăng ký học phần.
- Modal học phí dùng `aria-modal` nhưng chưa có focus trap, Escape, trả focus hoặc khóa cuộn nền. Chưa có bộ Dialog chung.
- Trang dịch vụ hiển thị các loại thiết bị thành nhiều cột đánh dấu, dù mỗi bản ghi chỉ mô tả một sự cố. Biểu mẫu và lịch sử cạnh tranh không gian. Form rèn luyện dài cần tăng khả năng đọc và tiếp cận nút lưu.
- Dữ liệu mẫu có mốc tháng 9/2026, trạng thái chứng chỉ khác nhau giữa trang chủ và trang kết quả. Không tự suy diễn dữ liệu thật hoặc sửa quy tắc nghiệp vụ trong đợt thiết kế.

## Khảo sát Figma

File `hq4ifJ2w6AjspNHzSafral`. Node được gửi `9:4` là trang **02 · Ảnh tham chiếu gốc**, chứa 17 ảnh tham khảo, không phải trang giao diện đang triển khai.

| Trang thiết kế         | Node  | Màn tương ứng                                                            |
| ---------------------- | ----- | ------------------------------------------------------------------------ |
| Trang chủ & điều hướng | `0:1` | Public Home, HOME-01 `1:7383`, HOME-02 `1:8289`                          |
| Học tập & tốt nghiệp   | `9:5` | Chương trình, học phần, kết quả, học vụ, PLO, lịch, đồ án                |
| Học phí                | `9:6` | Chi tiết học phí, đợt thu, lịch sử và hóa đơn                            |
| Rèn luyện              | `9:7` | Tự đánh giá, cán bộ lớp, danh sách/chi tiết hoạt động, kết quả cộng đồng |
| Dịch vụ & phản ánh     | `9:8` | Đơn trực tuyến và báo thiết bị                                           |

Metadata toàn file có 177 instance, collection `DUT / Học tập`, các primitive/semantic color, spacing 0–32 và text style DUT/Title, Section, Body, Label, Caption, Metric. Đây là tài nguyên cần đối chiếu và kế thừa; metadata không đủ xác nhận toàn bộ binding hoặc thư viện được publish. Screenshot HOME-01 cho thấy code hiện bám khá sát bản Figma cũ.

MCP desktop tại `127.0.0.1:3845/mcp` trả 6 công cụ đọc: get_design_context, get_variable_defs, get_screenshot, get_motion_context, get_metadata, get_figjam. Không có use_figma hoặc công cụ ghi. Đọc metadata và screenshot đã thành công sau khi xử lý phản hồi SSE có header chunked không hợp lệ. get_design_context toàn HOME-01 bị timeout; get_variable_defs tại HOME-01 trả object rỗng, không đủ kết luận file không có variables. Chưa sửa file Figma, chưa thể xác nhận đồng bộ native layers.

## Hướng thiết kế: DUT Workspace

Một không gian học tập có cấu trúc rõ, mật độ vừa phải, thân thiện tiếng Việt. Giữ xanh DUT và Be Vietnam Pro; chuyển nền tím nhạt sang neutral lạnh, tăng tương phản văn bản, giảm bề mặt màu trang trí. Điểm nhận diện là sidebar có nhóm tác vụ học tập và lịch học dễ đọc.

- Màu nền `#F6F8FB`, surface `#FFFFFF`, nội dung `#17253B`, nội dung phụ `#526178`, viền `#DDE3EB`, brand `#0052CC`. Màu trạng thái luôn có văn bản đi kèm. Light/dark cùng semantic token.
- Chữ 14px cho dữ liệu desktop, 16px cho input mobile; chú thích tối thiểu 12px. Tiêu đề 24–28px, đề mục 16–18px; số dùng tabular figures. Không ép chữ nhỏ để giữ bảng vừa màn hình.
- Spacing theo 4/8px; khoảng khối 24–32px, nội dung khối 20–24px. Radius control 8px, panel 12px, dialog 16px. Shadow nhẹ cho lớp nổi, đường viền cho dữ liệu.
- Desktop: sidebar khoảng 240px, header 64–72px, vùng nội dung có giới hạn chiều rộng. Mobile/tablet hẹp: drawer, một cột, filter xuống dòng, bảng có vùng cuộn được đặt tên; lịch học có bản trình bày dạng danh sách.
- Hover 120ms, dropdown/phản hồi 160ms, route/dialog 200ms. Chỉ chuyển động nhỏ bằng opacity/transform; reduced motion bỏ chuyển động. Tránh cả trang đầy các card nhảy lên khi hover.

```text
Desktop
┌──────────────┬────────────────────────────────────────────┐
│ DUT Portal   │ Tìm học phần             Theme · Tài khoản │
│ Tổng quan    ├────────────────────────────────────────────┤
│ Học tập      │ Đường dẫn / Tiêu đề / Hành động             │
│ Tài chính    │                                            │
│ Rèn luyện    │ Nội dung chính         Ngữ cảnh / tóm tắt   │
│ Dịch vụ      │ Lịch / bảng / form     (khi có ích)         │
└──────────────┴────────────────────────────────────────────┘

Mobile
┌────────────────────────┐
│ Menu   DUT    Tài khoản │
├────────────────────────┤
│ Tiêu đề + thao tác      │
│ Filter xuống dòng      │
│ Nội dung một cột        │
│ Bảng / danh sách        │
└────────────────────────┘
```

## Cải thiện theo nhóm màn

| Nhóm                            | Hướng thay đổi                                                                                                                |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Công khai, đăng nhập            | Giữ thông tin trường, tra cứu và thông báo; bố cục thoáng có CTA rõ, form đăng nhập tập trung và điều hướng về cổng thông tin |
| Tổng quan sinh viên             | Lời chào gọn, lịch học nổi bật, lối tắt đúng đích, thông báo và chuẩn đầu ra ở cấp phụ                                        |
| Hồ sơ                           | Tách thông tin đọc và thông tin sửa; đồng nhất trường nhập, tabs, nút lưu và phản hồi                                         |
| Chương trình, chi tiết học phần | Bộ lọc gọn, tên học phần rõ, metrics thống nhất và quan hệ tiên quyết dễ tìm                                                  |
| Kết quả, điểm kỳ, học vụ, PLO   | Tabs cùng mẫu; thống nhất số, đơn vị, bảng và trạng thái chưa công bố; giữ công thức tính hiện có                             |
| Lịch học/thi                    | Danh sách lịch dễ đọc trên điện thoại; desktop giữ bảng đủ dữ liệu và hành động                                               |
| Đồ án, đăng ký học phần         | Giữ chọn kỳ và lưu nháp; form theo nhóm, làm nổi nội dung/chi phí quyết định và tổng tín chỉ                                  |
| Học phí                         | Phân cấp hạn đóng, khoản tiền, chi tiết và lịch sử; modal dùng chung có đầy đủ hành vi bàn phím                               |
| Rèn luyện                       | Tiêu chí, điểm và minh chứng dễ quét; nhóm đề mục rõ, trạng thái nháp/gửi rõ ràng                                             |
| Cộng đồng                       | Filter, trạng thái đăng ký, ngày giờ và điểm hoạt động thống nhất; empty state có đường tiếp tục                              |
| Dịch vụ                         | Tách rõ tạo đơn/lịch sử/phản ánh; gộp cột thiết bị thành tên sự cố; giữ lịch sử và nút xử lý                                  |
| Thông báo, quản trị, 404        | Dùng cùng typography, surface, feedback; không thêm nghiệp vụ quản trị chưa có                                                |

## Triển khai và nghiệm thu

Thứ tự: semantic tokens → component nền → shell/navigation → từng nhóm màn → hồi quy luồng → so sánh screenshot. CSS và tài liệu dùng một bộ token; Figma cần cùng tên semantic và component state để đối chiếu khi có kết nối ghi.

Kiểm tra `npm run check`, Playwright luồng hiện có và các hành vi thay đổi: drawer, search shortcut, theme, modal focus/Escape; kiểm tra desktop/tablet/mobile, zoom/chữ lớn, reduced motion, light/dark. Chụp lại toàn bộ route; phân biệt giả lập viewport với kiểm thử trên thiết bị iOS/Android thực tế. Không tuyên bố native Figma đã cập nhật khi MCP chưa hỗ trợ ghi.

Nguồn rà soát: các skill ui-ux-pro-max, frontend-design, web-design-guidelines; [Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md); figma-use, figma-generate-design, figma-generate-library, figma-design-to-code. Kết quả tìm design-system tự động gợi ý portfolio/marketing và glassmorphism không phù hợp; hướng cuối dựa trên yêu cầu Modern Minimalist, Clean SaaS và cấu trúc DUT thực tế.

## Kết quả triển khai và kiểm tra

Đã triển khai DUT Workspace trong web: token light/dark sinh từ JSON; sidebar/drawer; tìm học phần Ctrl/Cmd+K; trang chủ ưu tiên lịch và lối tắt; bố cục công khai/đăng nhập; chuẩn hóa tiêu đề, tabs, metrics, form và bảng; lịch học dạng danh sách trên mobile; Dialog học phí có focus/Escape; dịch vụ chia khu vực và bảng sự cố gọn hơn. Giữ route, phân quyền, service/API và cách lưu dữ liệu mẫu. Quy ước duy trì tại [design system](design-system.md).

Kết quả cuối ngày 08/10/2026 trên bản production tại `http://127.0.0.1:4174`:

| Kiểm tra                                             | Kết quả                                                                                                                                          |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Token, kiến trúc, lint, TypeScript, production build | Đạt `npm run check`                                                                                                                              |
| Unit test                                            | 6/6 đạt                                                                                                                                          |
| E2E Chromium trên production                         | 21/21 đạt, gồm nghiệp vụ, tìm kiếm, keyboard, drawer, modal focus, theme, reduced motion và reset cuộn                                           |
| Format                                               | Đạt `npm run format:check`                                                                                                                       |
| Light/dark                                           | 24 trang × 4 viewport (320, 390, 768, 1440px) × 2 theme = 192 ảnh; không tràn ngang toàn trang, không lỗi JS                                     |
| Root font 200%                                       | 24 trang × 2 viewport (390, 1440px), dark mode = 48 ảnh; không tràn ngang toàn trang                                                             |
| Chromium mobile/touch                                | 24 trang ở 390px = 24 ảnh; không tràn ngang toàn trang, không lỗi JS                                                                             |
| Tương phản token                                     | Các cặp ink/muted/brand trên surface, trạng thái trên nền soft và chữ trắng trên action đều trên 4,5:1; mức thấp nhất trong các cặp đo là 5,39:1 |
| Safari / iOS / Android vật lý                        | Chưa xác nhận; WebKit Windows đóng tiến trình khi tạo page trước khi tải app. Mobile/touch ở trên là giả lập Chromium                            |
| Native Figma                                         | Chưa cập nhật: MCP hiện chỉ cung cấp công cụ đọc                                                                                                 |

Bộ ảnh và `report.json` nằm trong `test-results/ui-audit-final`, `ui-audit-dark`, `ui-audit-large-text`, `ui-audit-chromium-touch` (gitignored). Đã xem trực quan các màn đại diện: công khai, đăng nhập, dashboard, chương trình, lịch và dịch vụ, cùng dark mode/chữ lớn. Các bảng dữ liệu rộng vẫn có cuộn ngang trong region được đặt tên; không giấu dữ liệu để đạt chỉ số không tràn trang.

Đã sửa lỗi tràn chi tiết học phần, input minh chứng rèn luyện và bộ lọc ở màn hình hẹp/chữ lớn. Lượt E2E chạy trên dev từng bị file HTML trace kích hoạt Vite reload và mất phiên mock; watcher hiện bỏ qua thư mục kết quả, E2E dùng production preview riêng để tránh nhiễu HMR.

**Phần còn lại:** cập nhật native Figma theo [manifest](../design-system/figma-map.json) và nghiệm thu code–Figma khi có kết nối ghi. Bộ token và ánh xạ đã chuẩn bị; không coi ảnh chụp hoặc manifest là native layers đã đồng bộ.

## Đợt tinh gọn nội dung — chỉ light mode

Yêu cầu điều chỉnh: bớt chữ, bớt yếu tố cạnh tranh thị giác, một giao diện sáng duy nhất.

- Gỡ ThemeToggle, khởi tạo theme và bảng màu dark. Token JSON chỉ có một giá trị/màu. Giao diện không phụ thuộc theme hệ điều hành hoặc `dut-theme` lưu trước đây.
- Sidebar mặc định chỉ mở nhóm của trang hiện tại; bỏ mục chưa có chức năng. Dropdown tài khoản, footer và hồ sơ giảm khung lồng nhau và thông tin lặp.
- Dashboard giữ lịch và thông báo làm nội dung chính; chuẩn đầu ra/rèn luyện mở theo nhu cầu. Trang công khai dùng các liên kết dịch vụ gọn và thông báo có nội dung mở rộng; bỏ phân trang không có dữ liệu và nút lọc không có tác dụng.
- Dịch vụ chia Lập đơn / Theo dõi / Báo thiết bị. Học phí chia Khoản phải nộp / Theo học phần / Lịch sử. Query `view` giữ deep link và Back/Forward. Không xóa form khi đổi mục; giữ ghi chú và file đính kèm. Nộp đơn xong mở danh sách đơn.
- Phiếu rèn luyện chỉ mở sẵn nhóm đầu; hướng dẫn và quy trình duyệt thu gọn. Phiếu của lớp chọn từng nhóm tiêu chí, giữ điểm/ghi chú đã nhập. Các nhóm vẫn đầy đủ khi in.
- Bảng điểm, thông tin chương trình và lịch thi dùng phần mở rộng cho chi tiết phụ. Lịch học mobile ưu tiên giờ/phòng/tên học phần, mở chi tiết cho các trường còn lại và tác vụ.

Bộ token và manifest Figma đã cập nhật hướng light-only; native Figma vẫn chờ MCP hỗ trợ ghi.

### Kiểm chứng đợt tinh gọn

- `npm run check`: token, kiến trúc, lint, 6 unit test, TypeScript và build đạt. 24/24 E2E Chromium trên production đạt, gồm đổi mục/Back giữ ghi chú và file, mở nhóm bằng bàn phím, giữ điểm khi đổi nhóm, in đủ tiêu chí, thông báo mở rộng và light cố định khi hệ điều hành + lựa chọn đã lưu đều là dark.
- Audit 28 trạng thái (24 trang + 4 mục query) × 4 viewport 320/390/768/1440 = 112 ảnh; thêm 56 ảnh với root font 200% ở 390/1440. Không lỗi JavaScript hoặc tràn ngang toàn trang. Hai màn form được kiểm tra thêm ở 320/390 với chữ 100%/200%; đã sửa xuống dòng nhóm nút của form dịch vụ.
- So sánh ảnh desktop 1440px, cùng viewport cao 1000px: dashboard 1467 → 1000px; học phí 2312 → 1001px; dịch vụ 3224 → 1001px; tự đánh giá 2481 → 1546px; đánh giá lớp 2682 → 1636px. Chiều cao này là trạng thái mặc định; dữ liệu phụ vẫn truy cập qua mục điều hướng/phần mở rộng.
- Ảnh và số đo: `test-results/ui-audit-simplified-final/`, `test-results/ui-audit-simplified-large/`; spot-check mobile tại `spot-check.json`. Báo cáo và ảnh không commit.

## Khôi phục phần trước đăng nhập

Theo phản hồi tiếp theo, trang công khai được khôi phục dựa trên mã nguồn và ảnh trước đợt tinh gọn: hero hai cột với ảnh 4:3, nội dung giới thiệu đầy đủ, sáu thẻ dịch vụ có mô tả/hành động, thông báo có ngày/nhóm/tóm tắt hiển thị sẵn, tra cứu, khối cảnh báo tài khoản và thông tin liên hệ. Footer đầy đủ được tách thành `PublicFooter` để chỉ áp dụng cho trang công khai. Trang đăng nhập giữ bố cục hai vùng trước đó; cả hai tiếp tục chỉ có light mode.

Bộ lọc trực tiếp vẫn hoạt động; nút Lọc tin đưa focus đến kết quả, nút Chi tiết mở Dialog dùng được bằng bàn phím. Số lượng thông báo lấy từ dữ liệu hiện có, không khôi phục phân trang giả 184 bản ghi. Không thay đổi các trang sau đăng nhập, route, phân quyền hoặc API.

Kiểm tra: `npm run check` đạt, gồm 6 unit test và build. Bốn E2E liên quan đến đăng nhập/chuyển hướng, lỗi xác thực, thông báo và light mode đạt. Audit hai trang ở 320/390/768/1440px với chữ 100%/200% (16 trạng thái), giả lập hệ điều hành dark: giao diện vẫn light, không lỗi JavaScript hoặc tràn ngang. Ảnh và báo cáo: `test-results/ui-audit-public-restored/`. Manifest Figma ghi nhận hướng khôi phục; native layers vẫn chưa cập nhật do MCP chỉ hỗ trợ đọc.

## Đối chiếu lại Figma và khôi phục Microsoft 365

Lần khôi phục trước dựa trên ảnh sau đợt thiết kế đầu nên vẫn bỏ sót khối Microsoft. Đã đọc lại trực tiếp frame PUB-01 `1:5910` bằng `get_design_context` và screenshot; lần này công cụ trả context đầy đủ. Hero `1:6141` gồm giới thiệu/ảnh trường ở trái và thẻ Microsoft `1:6168` ở phải. Code hiện theo cấu trúc này, thay thế hero lời chào/CTA chung.

Đã khôi phục logo Microsoft ở hai vị trí, hướng dẫn email MSSV, CTA Office 365, kích hoạt tài khoản và quên mật khẩu. Dùng đúng SVG cục bộ từ Figma; giữ root geometry, không vẽ lại logo. Thẻ dịch vụ, tra cứu và danh bạ hỗ trợ được đối chiếu lại với context. Giữ light token hiện hành, dữ liệu thông báo/liên hệ đang dùng và route hiện có; không thêm tên người dùng đã đăng nhập hoặc số trang giả từ prototype vào màn công khai.

Các hướng dẫn mở Dialog có bàn phím/Escape/trả focus. Nút Microsoft hiện thông báo chưa khả dụng và cho vào đăng nhập trải nghiệm khi chưa cấu hình SSO. Điểm bắt đầu SSO có thể cấu hình riêng; callback/phiên Microsoft thật chưa tích hợp. Chi tiết tại [kiến trúc](architecture.md#kết-nối-backend).

Kiểm tra: token, kiến trúc, lint, 6 unit test, TypeScript và production build đạt; 5 E2E liên quan đến trang công khai, Microsoft/help, đăng nhập và light mode đạt. Audit 320/390/768/1280/1440px với chữ 100%/200% (10 trạng thái): không lỗi JS, không tràn ngang toàn trang, các ảnh đều tải thành công, logo Microsoft giữ 24px/20px. Đã xem lại hero desktop và thẻ Microsoft mobile cạnh ảnh Figma. Ảnh/báo cáo: `test-results/ui-audit-public-microsoft/`.

Figma vẫn chỉ đọc: không sửa native layers, không đánh dấu đồng bộ toàn bộ file.

## Sidebar thu gọn thành icon

Bổ sung chevron góc trên phải để chuyển giữa sidebar 256px và thanh icon 72px. Nội dung trang giãn theo không gian còn lại; lưu lựa chọn trong localStorage. Icon có nhãn cho screen reader và tooltip khi hover/focus. Nhóm mở danh sách bên cạnh bằng native popover, hỗ trợ click/Enter, ArrowDown, Tab, Escape, click ngoài và trạng thái trang đang xem. Drawer trên mobile vẫn hiển thị đầy đủ tên mục.

Kiểm tra token, kiến trúc, lint, 6 unit test và build đạt. 7 E2E điều hướng/layout đạt, gồm thu gọn/mở rộng, lưu lựa chọn qua reload, nhóm bằng bàn phím, đóng popup khi chuyển mobile, drawer và reduced motion. Đã kiểm tra 3 kích thước desktop (1440×900, 1100×600, 1280×500) với chữ 100%/200%, mỗi cấu hình có ảnh sidebar mở/thu gọn/menu con; không lỗi JavaScript, không tràn trang, popup nằm trong viewport. Ảnh/báo cáo lưu ở `test-results/ui-audit-sidebar/`. Manifest Figma ghi nhận hai biến thể, native layers chưa đổi.
