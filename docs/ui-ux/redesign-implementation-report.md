# Báo cáo triển khai redesign V1 và V2

> Palette trong tài liệu này là lịch sử. Màu và state hiện hành theo [Brand Color System](brand-color-system.md); các quyết định layout/nghiệp vụ không bị thay đổi bởi đợt cập nhật màu.

> Báo cáo/quyết định của đợt trước. Bản cập nhật xanh hiện hành được ghi tại [V1 redesign](v1-redesign-report.md) và [V2 redesign](v2-redesign-report.md); các giá trị surface/radius mới ưu tiên theo design-tokens.

10/10/2026 · Hoàn tất triển khai UI và đồng bộ các view Figma trong phạm vi. V1 giữ App Bar, V2 giữ Sidebar; cả hai dùng chung foundation. Công việc bắt đầu từ workspace đã có nhiều thay đổi; các thay đổi có sẵn được bảo toàn, không reset hoặc viết lại dự án.

## Kết quả thực tế

Palette dùng canvas pastel, surface trắng, chữ và biên field có tương phản rõ hơn. Generator hiện xuất màu, font, motion, layout cùng spacing/radius/type; CSS generated được kiểm tra đồng bộ. PageHeading, metric/table, breadcrumb, focus và nhịp bố cục được chuẩn hóa; logo người dùng được tích hợp nguyên bản.

Dashboard ưu tiên lịch → thông báo → việc học vụ → truy cập nhanh theo vai trò thị giác, với thứ tự DOM có ý nghĩa khi stack. V1 dùng không gian dưới menu ngang; V2 dùng sidebar expanded/rail, nhóm chức năng và toolbar. Học phí/dịch vụ chuyển view theo query, giữ nội dung mounted để không mất nháp/file. Các module còn lại kế thừa foundation và shell mới, vẫn dùng component/hook/service hiện có.

Navigation V1 dùng click disclosure; V2 có nút nhóm riêng, tooltip pointer/focus và Ctrl/Cmd K. Main nhận focus khi pathname đổi, query tab giữ focus; nếu người dùng đã focus ô tìm kiếm tiện ích trong lúc router chuyển trang thì giữ focus đó. Mobile không bị liên kết đổi phiên bản che form. Menu V1 và cột giờ học tăng theo chữ lớn. Kiểm thử lặp đã giúp phát hiện và xử lý tranh chấp focus giữa chuyển route và Ctrl K.

## Bảo toàn nghiệp vụ

Đối chiếu SHA-256 của 40 tệp với snapshot trước phiên redesign xác nhận các source service dữ liệu, hook dữ liệu, fixture/mock, auth, router, config và VersionLink không đổi. Các page dịch vụ/học phí/dashboard có thay đổi composition/copy và hiển thị view; không sửa handler gửi/lưu, validation, quy tắc chống trùng hoặc dữ liệu mẫu. Manifest/dependency không được thay trong phiên redesign.

Kiểm thử có đăng nhập qua deep link, đăng xuất, phân quyền admin/student, đăng ký/xóa học phần, bộ lọc/chi tiết học phí, tự đánh giá/lớp, đăng ký cộng đồng, gửi đơn/báo thiết bị, lưu đồ án/PLO, hồ sơ và draft/file qua Back. URL V1/V2, query/hash và cách mở phiên bản khác trong tab riêng được giữ.

## Figma

Đã cập nhật **66 frame/view** trong [DUT Student Portal](https://www.figma.com/design/hq4ifJ2w6AjspNHzSafral/DUT-Student-Portal?node-id=9-5): 43 frame/state hiện có giữ ID và 23 view bổ sung trên các page chức năng đã có. Bao gồm public/login, dashboard, hồ sơ, học vụ/đồ án/đăng ký, học phí, rèn luyện/cộng đồng, dịch vụ, thông báo, admin, 404; sáu bản mobile 390px, lọc rỗng, query view, rail và notification drawer.

Nội dung là Text/Vector/Auto Layout/Component/Instance editable. 122 main component phục vụ capture được tái sử dụng/cập nhật hoặc bổ sung theo source; 98 ID có sẵn được tái sử dụng, 24 component được thêm. Bộ Button có sẵn 247:2129 được cập nhật thành 12 biến thể Primary/Secondary/Quiet × Default/Hover/Focus/Disabled; Quiet ánh xạ ghost trong code. Collection/styles sẵn có được cập nhật, gồm shared typography và alias variable. Logo/ảnh được lưu thành asset trong file; không dùng ảnh toàn màn để thay giao diện.

Audit 66 frame không có frame thiếu, không có missing font; các image hash sử dụng đều đọc được byte dữ liệu. Đã xem ảnh native dashboard V1/V2, bảng học phần, form mobile và Button states; sửa logo, Ctrl K, vị trí specimen và label field một dòng. Figma là các view/trạng thái để review; chưa tái dựng toàn bộ prototype nghiệp vụ thành ứng dụng tương tác. Bảng/lịch dài ở desktop V2 nằm trong viewport workspace, đúng vùng cuộn của code; không mất layer vì bị clip. Native select/input được minh họa bằng component chữ/vector, giá trị dài được clip; popup và glyph của control do trình duyệt vẽ không có bản tương đương tuyệt đối trong Figma.

Xem [mapping đầy đủ](figma-code-mapping.md) và [manifest](../../web/design-system/figma-redesign-map.json).

## Kiểm chứng

| Kiểm tra                       | Kết quả và phạm vi                                                                                                                                                                                            |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run check`                | Pass: token sync, architecture app → features → shared, oxlint, 6 unit tests, TypeScript và Vite production build                                                                                             |
| `npm run test:e2e`             | **41/41 Chromium pass**, bao gồm 5 case redesign cho disclosure, focus, query/search và draft/file                                                                                                            |
| Responsive                     | **350 case** = 25 route/state × 7 widths × 2 editions; 1440/1280/1024/768/390/360/320; không tràn ngang page, một h1 hiển thị, không có JS page error                                                         |
| Text/reflow bổ sung            | **36 case** = 6 page × 3 chế độ × 2 editions; mô phỏng chữ 200% bằng CSS computed size, text-spacing overrides, reflow 320px; không phát hiện overflow page hoặc clipping ở heading/button/label theo phép đo |
| Dark preference/reduced motion | Chromium đã kiểm light theme vẫn đúng khi OS dark; reduced motion không animate page/control; text audit cũng bật dark preference và reduced motion                                                           |
| Figma structure/assets         | 66 frame tồn tại, font đầy đủ, các asset dùng đọc được bytes; native screenshot được review ở các pattern đại diện                                                                                            |
| WebKit                         | **Chưa xác minh**: runtime đóng ngay tại `browserContext.newPage`; full run và một lần retry đều không khởi tạo được trang                                                                                    |
| Thiết bị và AT                 | **Pending**: Safari iOS/VoiceOver, Chrome Android/TalkBack, browser zoom thật 400%, bàn phím ảo, forced colors và đo performance thực tế chưa có môi trường/bằng chứng                                        |

[Responsive evidence](verification/responsive-audit.json), [text evidence](verification/text-audit.json), [native Figma evidence](verification/native-audit.json). Đây là các phép kiểm tự động có giới hạn và review thị giác đại diện, không phải chứng nhận WCAG toàn sản phẩm hoặc kiểm tra pixel của mọi screen.

## Giới hạn và ngoại lệ có chủ ý

Hệ thống vẫn dùng mock/local data và auth theo session hiện có. Microsoft SSO, đối soát ngân hàng và gửi tới hệ thống ngoài chỉ khả dụng khi có cấu hình/backend thực; redesign không tạo các tích hợp đó. Ngày/học kỳ và số liệu mẫu ở module khác có thể chưa thống nhất vì fixture được bảo toàn.

Foundation đã áp dụng nhưng chưa chuyển mọi metadata, khoảng cách/radius cục bộ hoặc helper CSS cũ thành semantic variable. Native Button disabled vẫn theo opacity .55 hiện có; các alias disabled-bg/text, scrim và một số alias component là mục tiêu chưa migrate đầy đủ. Các phần đó giữ quy ước dữ liệu và mật độ của trang; component capture Figma giữ style cụ thể từ code. V1/V2 light-only theo sản phẩm. Raster logo 86×86 có giới hạn khi xuất kích thước lớn. Responsive được kiểm trong Chromium trên Windows; không suy ra browser/thiết bị khác đã đạt.
