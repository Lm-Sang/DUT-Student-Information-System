# Hướng dẫn áp dụng và bảo trì

Phiên nghiên cứu docs-only đã kết thúc. Redesign V1/V2 đã được triển khai theo yêu cầu tiếp theo, gồm code/Figma/QA; xem [báo cáo](../redesign-implementation-report.md). Tài liệu này hướng dẫn bảo trì trong phạm vi tác vụ mới. Đọc [UI_UX_RULES](../UI_UX_RULES.md), quyết định [V1](../v1-design-decisions.md)/[V2](../v2-design-decisions.md), [tokens](../02-design-system/design-tokens.md) và chương liên quan.

## Trình tự đề xuất

1. **Chốt phạm vi từ yêu cầu triển khai:** route, V1/V2, role, hành vi phải giữ, trạng thái dữ liệu và tiêu chí hoàn thành. Nếu chỉ được giao một trang, không đổi palette/shell của toàn app.
2. **Đọc hiện trạng mới nhất:** manifest/lock, AGENTS áp dụng, route, component, CSS, hook/service. Các dòng và version trong research là ảnh chụp khảo sát, không thay bước này.
3. **Lập bảng áp dụng:** mục tiêu người dùng → Rule ID → token → primitive/source tái dùng → gap → validation. Ghi rõ đề xuất chưa có code và hiện trạng cần migrate.
4. **Sắp thứ tự công việc trong phạm vi:** token/alias → primitive/state → shell/navigation → page composition → responsive/motion → kiểm tra. Một lần sửa component chung phải kiểm cả V1/V2 và trang dùng nó.
5. **Migrate có kiểm soát:** map tên logical sang CSS hiện có, duy trì generator và scope edition; loại dần giá trị trùng khi được phép sửa đúng vùng đó. Không đổi source data chỉ để khớp ảnh thiết kế.
6. **Xác minh hành vi:** tests phù hợp, keyboard/AT, browser, viewport, form lỗi, dữ liệu dài/rỗng/chậm. Kiểm đủ trước khi làm hiệu ứng tinh chỉnh.
7. **Bàn giao:** nêu thay đổi thực, kiểm tra đã chạy, kết quả, giới hạn và các Rule ID có ngoại lệ. Cập nhật đúng chương sở hữu nếu cần thay quy tắc; không chép token sang nhiều file.

## Quy tắc thực thi

| Rule ID | Category        | Priority | Description / behavior                                                                  | Rationale                                  | Scope                           | Exceptions                                                              | Validation                                                                     |
| ------- | --------------- | -------- | --------------------------------------------------------------------------------------- | ------------------------------------------ | ------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| IMP-001 | Scope           | MUST     | Đọc yêu cầu mới và giữ route/edition/nghiệp vụ ngoài phạm vi                            | Nghiên cứu không cấp quyền refactor tất cả | Mọi lần triển khai              | Yêu cầu rõ cho migration rộng                                           | Diff phù hợp phạm vi, không đổi backend/auth ngoài nhiệm vụ                    |
| IMP-002 | Architecture    | MUST     | Giữ app → features → shared; page → hook → service; tái dùng public API feature         | Không để style kéo theo logic trùng        | Web                             | Quyết định kiến trúc mới có nhiệm vụ riêng                              | check:architecture và review import đạt                                        |
| IMP-003 | Tokens          | MUST     | Dùng tokens.json/generator; không sửa tokens.css generated bằng tay; V1/V2 cùng palette | Tránh nguồn giá trị lệch nhau              | Tokens/CSS                      | Style cục bộ cũ cần có phạm vi và bằng chứng khi thay                   | check:tokens đạt; computed style hai edition đúng                              |
| IMP-004 | Reuse           | SHOULD   | Dùng primitive hiện tại/native trước; chỉ tạo wrapper khi có ý nghĩa và tái sử dụng     | Tránh dependency và abstraction không cần  | Components                      | Gap accessibility/chức năng được chứng minh                             | Tên/role/state contract rõ; không wrapper chỉ để thêm một class                |
| IMP-005 | Dependencies    | MUST NOT | Tự cài package được skill/catalog đề xuất mà chưa đánh giá nhu cầu trong tác vụ         | Giữ stack nhỏ, ổn định                     | Library selection               | Yêu cầu triển khai thật cần và cho phép dependency, có đánh giá chi phí | Manifest/lock diff giải thích được; không thêm hai bộ icon/motion cùng vai trò |
| IMP-006 | Behavior        | MUST     | Giữ state form, query, deep link, role và xử lý async; style không bịa tác dụng         | Tránh regression nghiệp vụ                 | Pages/hooks                     | Đổi behavior được yêu cầu rõ                                            | Test pending/error/retry, Back/Forward, mẫu/local có nhãn đúng                 |
| IMP-007 | Accessibility   | MUST     | Semantic HTML trước; mọi custom interaction có keyboard/focus/AT contract               | UI dùng được ngoài pointer                 | Components/overlays             | Không                                                                   | Đạt các rule A11Y áp dụng; không dùng scanner đơn lẻ để kết luận               |
| IMP-008 | Validation      | MUST     | Chỉ báo test đã chạy; ghi Pending/N/A có lý do cho phần chưa kiểm                       | Không tạo sự chắc chắn giả                 | Bàn giao                        | Không                                                                   | Báo cáo có command/browser/state và kết quả thực                               |
| IMP-009 | Maintainability | SHOULD   | Component chung nhận dữ liệu/callback; presentation không truy cập API/mock trực tiếp   | Tách nghiệp vụ và UI                       | Màn mới hoặc vùng được refactor | Hiện trạng cũ ghi gap, không tự mở rộng phạm vi sửa                     | Không copy dữ liệu học phần/điểm sang component để vẽ dashboard                |

## Bản đồ reuse thực tế

| Nhu cầu                       | Điểm bắt đầu đã có                                                                                | Điều phải kiểm / gap                                                                                              |
| ----------------------------- | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Shell/navigation              | app/layouts/PortalLayout, PortalV2Layout; navigation/SidebarRailItem, NavigationMenu, AccountMenu | Scope edition, role, focus khi breakpoint đổi, tooltip hover persistence                                          |
| Heading/surface/action/status | shared/ui/PageHeading, Card, Button, Badge, Icon, V2Icon                                          | Token role và state; Button chưa có mọi variant được mô tả trong đặc tả                                           |
| Table                         | shared/ui/Table; features/academics/components/AcademicUi                                         | Header association, min-width theo dữ liệu, keyboard region, column action name                                   |
| Form                          | Native input/select/textarea và field markup trong features                                       | Chưa có Field shared; chỉ tách khi lặp contract thực, không import component chưa tồn tại                         |
| Overlay/disclosure            | shared/ui/Dialog, Disclosure; native popover trong rail                                           | Focus, Escape, restore, browser compatibility; không dùng modal cho tác vụ dài                                    |
| Tabs                          | shared/ui/SectionNav; AcademicTabs; profile tabs                                                  | Query navigation khác ARIA tabs. Học phí/dịch vụ hiển thị đúng view, giữ view khác mounted và hidden để giữ state |
| Feedback                      | shared/ui/FeedbackStates và role=status inline                                                    | Skeleton/Toast chưa có shared primitive; dùng loading/inline feedback nếu đáp ứng                                 |
| Calendar/chart/timeline       | SchedulePage/ScheduleTable; SVG/progress/AcademicV2Summary; list lịch/review steps                | Chưa có thư viện calendar/chart; chỉ mô tả dữ liệu hiện có, không thêm feature                                    |
| Fonts/assets                  | globals.css Fontsource imports; shared/assets/dut-logo.png                                        | Logo đã tích hợp nguyên tệp; giữ tỷ lệ và giới hạn raster khi xuất lớn                                            |

## Mapping token và Tailwind

Nguồn runtime chung là JSON sinh tokens.css. V2 không còn palette override cạnh tranh; v2.css và redesign.css sở hữu composition/style của component. Ba tầng logical không buộc tạo ba file hoặc thay cấu trúc dự án. Mọi sửa primitive chung phải kiểm cả edition; không tạo V3 tokens.

Generator đã xuất font, màu, motion, layout, spacing/radius/type. Không phải mọi alias logic trong tài liệu là Tailwind utility hoặc đã thay toàn bộ giá trị cục bộ. Khi thêm token, sửa JSON/generator và kiểm computed output cùng check:tokens.

Tailwind của dự án là v4 với @tailwindcss/vite và CSS theme; hướng dẫn v3 tạo tailwind.config.js không áp dụng mặc định. Giá trị dùng để tạo utility cần mapping theme phù hợp; biến runtime scoped vẫn là CSS custom property theo nhu cầu. [Tài liệu Tailwind theme](https://tailwindcss.com/docs/theme). Breakpoint shell trong đặc tả phải được map rõ, không trộn tùy tiện với mặc định utility trong cùng một layout.

## Thứ tự trang khi có yêu cầu triển khai toàn diện

Sau token/primitive/shell: chọn một trang bảng (chương trình đào tạo), một form (dịch vụ) và dashboard để kiểm ba mật độ. Sau đó áp dụng sang điểm/học vụ/PLO, lịch/đồ án/đăng ký, học phí, rèn luyện/cộng đồng, hồ sơ/thông báo, public/login và admin/404. Đây là thứ tự kỹ thuật đề xuất; ưu tiên nghiệp vụ của yêu cầu mới có thể đổi thứ tự.

Mỗi nhóm cần state matrix trước khi đánh dấu xong. Không làm xong desktop tất cả trang rồi mới xử lý mobile; kiểm responsive/a11y của pattern đầu để các trang sau kế thừa đúng.

## Công cụ kiểm tra có sẵn, chỉ chạy khi triển khai

Trong web/: npm run check chạy tokens, architecture, lint, unit tests và build; npm run test:e2e chạy Chromium; npm run test:e2e:webkit chạy WebKit nếu môi trường hỗ trợ; npm run audit:ui tạo ảnh/báo cáo theo script đã đọc. Các lệnh có thể tạo artifact nên **không chạy trong phiên chỉ được ghi docs/ui-ux/** này.

Chọn test theo thay đổi, không chạy lặp toàn bộ nếu không có lý do. Chụp cùng viewport, dữ liệu, edition và state để so sánh; chạy test automation không thay keyboard/screen reader thật. Tránh npm run format toàn dự án cho một thay đổi nhỏ vì có thể đụng file ngoài phạm vi.

Hiệu năng kiểm bằng trace và so sánh trước/sau trên cùng môi trường: sidebar không reflow mỗi frame, search/form không bị chặn bởi render nặng, ảnh có kích thước đặt trước, không thêm network runtime không cần thiết. Virtualization chỉ xem xét khi profiling chứng minh bảng chậm; đánh giá ảnh hưởng semantics/print/find trước khi chọn.
