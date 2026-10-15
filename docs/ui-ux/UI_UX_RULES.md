# DUT Student Portal — UI/UX Rules

Phiên bản 1.3 · 10/10/2026 · Trạng thái: foundation và redesign V1/V2 đã triển khai; kiểm chứng và giới hạn ghi trong [báo cáo](redesign-implementation-report.md).

## Phạm vi và cách đọc

Đây là điểm vào duy nhất của bộ quy tắc UI/UX web. Phạm vi gồm frontend React trong web/, thiết kế Figma V1/V2, ảnh UI_sample.jfif và logo.png do người dùng cung cấp. Yêu cầu redesign tiếp theo đã cấp quyền triển khai code và Figma; các giá trị áp dụng thực tế và ngoại lệ nằm trong báo cáo, không mặc định mọi rule đều đã Pass. Tài liệu Flutter chỉ được tham khảo về nguyên tắc; không thay thế mobile/docs/.

Đọc tài liệu này trước; tiếp theo đọc design-tokens, component-rules và các chương liên quan đến tác vụ. Nguồn quy tắc màu nằm trong [brand-color-system](brand-color-system.md); các giá trị hình học/chữ/motion nằm trong design-tokens; các chương khác chỉ diễn giải cách dùng. Bằng chứng hiện trạng và các khác biệt nằm trong research, không phải một bộ token cạnh tranh.

## Triết lý

Chọn **Clean Educational Workspace — nền trung tính, xanh thương hiệu tiết chế, bề mặt trắng, phân cấp rõ, chiều sâu tiết chế**. Soft UI chỉ thể hiện qua màu nền, bo góc vừa phải và khoảng cách; không dùng neumorphism để phân biệt control. Thiết kế giúp sinh viên tìm lịch, đọc thông báo và hoàn thành tác vụ học vụ nhanh, kể cả khi dùng bàn phím, chữ lớn hoặc màn hình hẹp.

Giữ Be Vietnam Pro, React/Tailwind và primitive hiện có. Dùng bảng cho dữ liệu cần so sánh; card cho các nhóm thông tin độc lập. Giao diện web tiếp tục light mode theo ràng buộc sản phẩm hiện tại.

## Các quy tắc điều hành

Mỗi dòng là một quy tắc chuẩn. Cột “Hành vi” là Description và Recommended behavior; “Vì sao” là Rationale. Cùng cấu trúc này áp dụng ở các chương chi tiết.

| Rule ID | Category    | Priority | Hành vi                                                                                                                               | Vì sao                                 | Phạm vi                                   | Ngoại lệ                                                 | Validation                                                                         |
| ------- | ----------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- | ----------------------------------------- | -------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| GOV-001 | Scope       | MUST     | Làm đúng phạm vi được người dùng giao; giai đoạn docs-only trước đã kết thúc, yêu cầu tiếp theo cho phép redesign code và Figma V1/V2 | Quyền triển khai đến từ yêu cầu cụ thể | Mọi phiên                                 | Nhiệm vụ chỉ nghiên cứu vẫn giới hạn tài liệu            | Bảo toàn route/auth/nghiệp vụ và thay đổi có sẵn; diff và báo cáo phù hợp nhiệm vụ |
| GOV-002 | Sources     | MUST     | Áp dụng thứ tự ưu tiên ở dưới; ghi xung đột và quyết định                                                                             | Tránh chọn mẫu tùy hứng                | Mọi phiên áp dụng                         | Chỉ dẫn trực tiếp mới của người dùng có ưu tiên          | PR/tác vụ dẫn Rule ID; không lấy skill mặc định thay quyết định sản phẩm           |
| GOV-003 | Tokens      | MUST     | Dùng token semantic chuẩn; đọc mapping trước khi triển khai                                                                           | Một nguồn giá trị có thể bảo trì       | Màu, chữ, khoảng cách, kích thước, motion | Ngoại lệ có lý do, phạm vi và kiểm chứng                 | Không xuất hiện token riêng theo tên trang hoặc số tùy ý không giải thích          |
| GOV-004 | Product     | MUST     | Dashboard ưu tiên lịch học → thông báo → việc học vụ cần làm → truy cập nhanh                                                         | Đúng nhu cầu và yêu cầu người dùng     | Trang chủ sau đăng nhập                   | Luồng admin có mục tiêu khác                             | Không đặt GPA/điểm/học phí thành cụm KPI chính                                     |
| GOV-005 | Truthful UI | MUST NOT | Bịa dữ liệu, tiến độ, khả năng SSO, thanh toán hay trạng thái gửi thành công                                                          | Tránh gây hiểu nhầm                    | Toàn hệ thống                             | Dữ liệu mẫu có nhãn và đúng hợp đồng demo                | Nội dung khớp nguồn dữ liệu và tác dụng thật của thao tác                          |
| GOV-006 | Reuse       | SHOULD   | Mở rộng primitive nội bộ đúng ngữ nghĩa trước khi chọn thư viện                                                                       | Giảm xung đột CSS và hành vi           | Web                                       | Thiếu khả năng thiết yếu được chứng minh bằng thử nghiệm | Có bảng reuse/gap và chi phí trước khi thêm dependency                             |
| GOV-007 | Quality     | MUST     | Hoàn thành kiểm tra accessibility, responsive và đủ trạng thái trước khi kết luận đạt                                                 | Ảnh đẹp không chứng minh dùng được     | Giai đoạn triển khai                      | Mục không áp dụng phải nêu lý do                         | Checklist có bằng chứng, không đánh dấu Pass cho kiểm tra chưa chạy                |

MUST = bắt buộc; SHOULD = mặc định phải làm, ngoại lệ cần lý do; MAY = tùy nhu cầu thật; MUST NOT = cấm trong phạm vi quy tắc. Quy tắc MAY về component không cấp phép tạo tính năng mới.

## Thứ tự ưu tiên khi mâu thuẫn

1. Yêu cầu nghiệp vụ và accessibility bắt buộc.
2. Ràng buộc kỹ thuật thực tế của dự án.
3. Bộ quy tắc đã chuẩn hóa trong docs/ui-ux/.
4. Tài liệu UI/UX được chọn trong library-audit.
5. Ảnh tham khảo.
6. Sở thích thiết kế hoặc suy luận mới.

Ràng buộc kỹ thuật không miễn trừ accessibility. Nếu một API không đáp ứng, chọn hành vi tương đương dùng được. Giá trị CSS cũ là bằng chứng hiện trạng, không tự động là ràng buộc bất biến. Giữ route, hợp đồng dữ liệu và phạm vi thay đổi đã được giao. Bộ tài liệu này không tự cho phép sửa toàn bộ V1/V2 trong một yêu cầu cục bộ.

## Bản đồ token và quy tắc cốt lõi

| Nhóm                     | Token/vai trò cần tra                                                                | Nguồn chuẩn                                                                  |
| ------------------------ | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| Màu                      | color.canvas, surface, text, text-muted, action, action-text, field-border, status.* | [Brand Color System](brand-color-system.md)                                  |
| Chữ                      | type.page, section, card, body, secondary, caption, label, table, nav                | [Typography tokens](02-design-system/design-tokens.md#typography-tokens)     |
| Khoảng cách và hình dạng | space._, radius._, elevation._, border._                                             | [Spacing và surface](02-design-system/design-tokens.md#spacing-and-surfaces) |
| Kích thước và responsive | size._, layout._, breakpoint.*                                                       | [Dimensions](02-design-system/design-tokens.md#dimensions-and-breakpoints)   |
| Chuyển động và lớp       | motion._, easing._, layer.*                                                          | [Motion và layers](02-design-system/design-tokens.md#motion-and-layers)      |

V1 giữ App Bar/navigation ngang và drawer khi hẹp; V2 giữ sidebar thu gọn chủ động, toolbar và main. Hover không tự mở rộng sidebar hoặc là điều kiện mở menu V1. Điều hướng bằng link; lệnh bằng button. Search phản ánh đúng phạm vi học phần. Học kỳ thuộc nội dung trang đến khi có hợp đồng toàn cục. Focus vẫn rõ ở selected/error/loading; đổi pathname focus main, query tab giữ focus. Reduced motion đưa nội dung về trạng thái cuối. Chi tiết và ngoại lệ thuộc các chương dưới.

## Danh mục tài liệu

| Tệp                                                                         | Nội dung sở hữu                                                          |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| [brand-color-system](brand-color-system.md)                                 | Nguồn quy tắc màu chính thức, palette, surface, states và bằng chứng mới |
| [external-research](external-research.md)                                   | Nghiên cứu web trước triển khai, chọn/loại và pattern áp dụng            |
| [v1-design-decisions](v1-design-decisions.md)                               | Quyết định App Bar và bố cục V1 đã triển khai                            |
| [v2-design-decisions](v2-design-decisions.md)                               | Quyết định Sidebar và bố cục V2 đã triển khai                            |
| [figma-code-mapping](figma-code-mapping.md)                                 | Frame/component/token tương ứng source và edition                        |
| [redesign-implementation-report](redesign-implementation-report.md)         | Kết quả code/Figma, kiểm thử, ngoại lệ và phần chưa xác minh             |
| [reference-analysis](01-research/reference-analysis.md)                     | Quan sát ảnh/logo, ước lượng, suy luận và giới hạn                       |
| [library-audit](01-research/library-audit.md)                               | Stack, dependency thực tế, tài nguyên, bằng chứng và chọn/loại           |
| [design-decisions](01-research/design-decisions.md)                         | Quyết định, đánh đổi, xung đột, giả định cần kiểm chứng                  |
| [visual-style](02-design-system/visual-style.md)                            | Ngôn ngữ thị giác, thương hiệu, nội dung và icon                         |
| [design-tokens](02-design-system/design-tokens.md)                          | Giá trị chuẩn và mapping từ hiện trạng                                   |
| [typography-spacing](02-design-system/typography-spacing.md)                | Cách áp dụng chữ tiếng Việt, mật độ và nhịp khoảng cách                  |
| [component-rules](02-design-system/component-rules.md)                      | Contract cho 32 loại component và trạng thái                             |
| [layout-navigation](03-layout/layout-navigation.md)                         | Shell, sidebar, app bar, focus, lưu lựa chọn                             |
| [responsive-rules](03-layout/responsive-rules.md)                           | Chuyển bố cục, bảng, form, overlay và ma trận kích thước                 |
| [page-patterns](03-layout/page-patterns.md)                                 | Quy tắc theo toàn bộ route/module đã phát hiện                           |
| [animation-rules](04-interactions/animation-rules.md)                       | Trigger, thuộc tính, thời lượng, reduced motion, hiệu năng               |
| [accessibility-rules](04-interactions/accessibility-rules.md)               | Điều kiện Pass/Fail và nguồn WCAG/APG                                    |
| [implementation-guidelines](05-implementation/implementation-guidelines.md) | Trình tự áp dụng sau này và giới hạn kiến trúc                           |
| [ui-review-checklist](05-implementation/ui-review-checklist.md)             | Cổng nghiệm thu, ma trận kiểm tra và kết quả kiểm tra tài liệu           |

## Bắt đầu một lần triển khai

Đọc hiện trạng mới nhất → xác định route/edition và hành vi phải giữ → chọn Rule ID và token → kiểm kê primitive → thiết kế đầy đủ trạng thái → triển khai trong phạm vi được giao → kiểm tra theo checklist. Khi đổi quy tắc, sửa chương sở hữu và liên kết tại đây; không sao chép cả bộ sang AGENTS.md, CSS hay README khác. Các tài liệu web/docs/ hiện hữu được giữ nguyên; nội dung mô tả cũ cần đối chiếu với source trước khi dùng.

Bản cập nhật màu hiện hành: [Brand Color System](brand-color-system.md). [V1 redesign report](v1-redesign-report.md) và [V2 redesign report](v2-redesign-report.md) ghi giai đoạn trước; giữ giá trị về layout nhưng không dùng palette lịch sử để triển khai mới.
