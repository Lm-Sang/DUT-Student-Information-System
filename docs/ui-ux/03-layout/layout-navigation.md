# Layout và điều hướng

V1 dùng App Bar/navigation ngang, drawer dưới 1100px; V2 dùng collapsible sidebar + toolbar + main, drawer ở ≤900px. Hai shell được giữ riêng trong redesign, dùng chung foundation. Kích thước lấy từ [tokens](../02-design-system/design-tokens.md#dimensions-and-breakpoints); bằng chứng trong [báo cáo](../redesign-implementation-report.md).

## Quy tắc cấu trúc

| Rule ID | Category    | Priority | Description / behavior                                                                                          | Rationale                                    | Scope                           | Exceptions                                                      | Validation                                                                  |
| ------- | ----------- | -------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------------- | ------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------- |
| NAV-001 | Sidebar     | MUST     | Có expanded/collapsed trên desktop, chuyển bằng toggle rõ; hover không tự expand                                | Tránh layout nhảy và mở ngoài ý muốn         | Sidebar đích                    | Drawer dùng full label                                          | Chuột và keyboard đổi trạng thái; focus ở toggle còn nguyên                 |
| NAV-002 | State       | MUST     | Lưu lựa chọn collapse desktop có fallback khi storage lỗi; mobile không ghi đè                                  | Tôn trọng lựa chọn người dùng                | Shell                           | Không cần đồng bộ server                                        | Reload giữ lựa chọn; chặn storage vẫn dùng được                             |
| NAV-003 | Submenu     | MUST     | Expanded dùng disclosure/link theo nghĩa; rail dùng flyout; nhóm active và child current khác nhau              | Đến đủ module trong mọi trạng thái           | Navigation có nhóm              | Không tạo nhóm chưa có                                          | Mọi child route đến được bằng Tab/Enter, Escape đóng; không hover-only      |
| NAV-004 | Stability   | MUST     | Sidebar/main thay đổi layout một lần theo thao tác; không tween width toàn main; nội dung không phủ lên nhau    | Giảm reflow lặp, giữ điểm đọc                | Collapse/expand                 | Nhãn MAY fade theo motion.menu                                  | Không cắt label, không mất focus, bảng vẫn scroll trong vùng                |
| NAV-005 | App bar     | MUST     | Search đúng phạm vi học phần; notifications/account ở header; module links ở menu ngang V1 hoặc sidebar V2      | Rõ trách nhiệm, giữ hai phương án navigation | Student shell                   | Admin chỉ có action phù hợp quyền                               | Kiểm tra search, quyền link và menu tài khoản ở từng edition                |
| NAV-006 | Semester    | MUST     | Học kỳ nằm cạnh heading/filter của trang sở hữu dữ liệu                                                         | Code chưa có kỳ toàn cục chia sẻ             | Học vụ, phí, rèn luyện, dịch vụ | Chỉ chuyển global khi có hợp đồng state/API được giao           | Không xuất hiện selector giả; thay kỳ không làm dữ liệu vùng khác mâu thuẫn |
| NAV-007 | Routes      | MUST     | Giữ deep link, query/hash, Back/Forward và edition; dùng link cho navigation                                    | Khôi phục ngữ cảnh                           | Tất cả route                    | Đăng xuất đưa về luồng auth hiện có                             | Mở URL trực tiếp qua login trở lại đúng đích trong V1/V2                    |
| NAV-008 | Focus       | MUST     | Skip link tới main; route navigation đưa focus tới heading/main hợp lý; query filter không lấy focus khỏi input | Tránh người dùng bàn phím lạc ngữ cảnh       | SPA                             | POP/history giữ focus/scroll phù hợp thay vì reset vô điều kiện | Sau chuyển trang đọc được tên trang; Back quay lại vùng đã dùng             |
| NAV-009 | Scroll      | SHOULD   | Một vùng cuộn chính cho nội dung, sidebar riêng khi dài; bảng có vùng cuộn ngang có tên                         | Tránh cuộn lồng khó điều khiển               | V2 workspace                    | Dialog có body scroll riêng                                     | Wheel/Tab/keyboard đều đến cuối; không ẩn dấu cuộn khi khiến khó phát hiện  |
| NAV-010 | Main layout | MUST     | Heading/context/actions → nội dung chính → phần phụ; bảng dùng toàn vùng; prose/form có max riêng               | Hierarchy phục vụ tác vụ                     | Page shell                      | Dashboard có grid đa vùng                                       | DOM order đúng ý nghĩa; không ép bảng trong prose-max hoặc card lồng        |
| NAV-011 | Permission  | MUST     | Chỉ hiển thị đích phù hợp quyền, mục chưa khả dụng có lý do hoặc không là link                                  | Không tạo ngõ cụt                            | Student/admin                   | Role guard vẫn là lớp chặn chính phía UI                        | Admin không được link tới profile/service student-only không có quyền       |

## Mô hình trạng thái sidebar

Khi không có lựa chọn lưu: desktop lớn mặc định expanded, laptop mặc định rail, màn hẹp dùng drawer. Khi đã lưu: desktop dùng lựa chọn đó nếu vẫn đáp ứng reflow; drawer luôn có đầy đủ nhãn. Nếu chữ lớn khiến expanded không đủ chỗ, chuyển trình bày sang drawer mà giữ sở thích đã lưu. Không lưu trạng thái drawer-open qua reload. Storage chỉ lưu sở thích UI, không dùng để kết luận quyền.

Expanded hiển thị logo/lockup, các đích module và nhãn. Nhóm đang chứa route hiện tại có dấu riêng, mục con có aria-current page. Nếu vừa vào deep link, mở nhóm chứa mục hiện tại để người dùng thấy mình đang ở đâu; sau đó cho phép đóng chủ động.

Rail giữ icon cùng accessible name, tooltip cho tên và dấu nhóm. Link trực tiếp không trở thành nút mở menu. Nhóm có button với expanded/controls; flyout không đẩy main. Tooltip không che flyout, đóng khi flyout mở. Escape đóng lớp trên cùng, không điều hướng bất ngờ. Focus không tự chạy sang popup chỉ vì pointer hover.

Drawer là Dialog modal, có title, close, backdrop, focus trap và restore focus. Sau chọn route đóng drawer. Khi đổi breakpoint, đóng popup không còn anchor hợp lệ; focus sang toggle điều hướng mới hoặc main nếu route vừa thay đổi, không về node đã hidden.

## Phân công thông tin

| Vùng         | Sở hữu                                                                   | Không tự thêm                                     |
| ------------ | ------------------------------------------------------------------------ | ------------------------------------------------- |
| Sidebar      | Điểm đến module, trạng thái current, collapse; hỗ trợ nếu route có quyền | Bộ lọc dữ liệu trang, điểm/học phí làm badge KPI  |
| App bar      | Tìm học phần, thông báo, tài khoản, menu trigger khi hẹp                 | Tìm kiếm tất cả dữ liệu hoặc kỳ toàn cục chưa nối |
| Page heading | Tên trang, mô tả ngắn, học kỳ/filter theo trang, action liên quan        | Hero quảng cáo trong màn tác nghiệp               |
| Nội dung     | Lịch/bảng/form/list theo tác vụ                                          | Card chỉ để chia màu nền                          |
| Footer       | Thông tin trường/hỗ trợ có thật, không chắn action                       | CTA nổi lặp lại mọi trang                         |

Dashboard hai vùng dùng tỷ lệ nội dung chính/phụ khoảng 2:1 khi cả main-min, aside-min và gap đều vừa. Thứ tự DOM luôn lịch, thông báo, việc học vụ, quick links; CSS không đảo vị trí đọc để đạt ảnh mẫu. Trang bảng không giữ một cột phụ trống khiến bảng chật. Form dài tách nhóm có heading và dùng disclosure cho phụ trợ, không che hạn/nút gửi/summary lỗi.

Native disclosure navigation thường không cần role menu; APG phân biệt menu ứng dụng với danh sách link thông thường. [WAI disclosure navigation](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/). Mở bằng nút, Tab đi qua link và Escape đóng là contract được chọn ở đây.
