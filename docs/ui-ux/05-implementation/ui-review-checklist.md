# Checklist nghiệm thu UI và tài liệu

Kết quả phiên redesign 10/10/2026 nằm trong [báo cáo triển khai](../redesign-implementation-report.md) và thư mục verification. Những kết quả khảo sát tài liệu cũ bên dưới không chứng minh toàn bộ UI đã đạt; WebKit/thiết bị/AT vẫn chưa xác minh.

Đây là checklist tham chiếu quy tắc đã định nghĩa, không tạo bảng token hay luật mới. Trạng thái: **Pass** có bằng chứng, **Fail** có bước tái hiện, **Pending** chưa chạy, **N/A** có lý do không áp dụng. Không suy ra UI đạt từ việc tài liệu đã hoàn thành.

## Mẫu ghi kết quả cho một lần triển khai

Ghi commit/phạm vi, route + edition + role, browser/OS/AT, viewport/zoom/pointer, dữ liệu/state, ngày kiểm tra, Rule ID, bước thực hiện, kết quả và bằng chứng. Ngoại lệ SHOULD cần lý do và người chịu trách nhiệm xử lý; yêu cầu accessibility bắt buộc không được miễn chỉ vì ảnh mẫu.

| Nhóm                 | Kiểm tra Pass/Fail cụ thể                                                                                  | Quy tắc                           | Kết quả UI hiện tại                              |
| -------------------- | ---------------------------------------------------------------------------------------------------------- | --------------------------------- | ------------------------------------------------ |
| Visual consistency   | Cùng vai trò dùng cùng màu/type/radius; primary action nhận ra; không card lồng/gradient trang trí         | VIS-001–003, TYPE-002             | Pending: chưa render trong nghiên cứu            |
| Brand                | Logo không kéo giãn/crop/đổi màu; text lockup đọc được; asset đủ chất lượng ở mật độ đích                  | VIS-004                           | Pending: raster tham chiếu đã xem, chưa tích hợp |
| Tokens               | Giá trị sửa đều map token; alias truy được nguồn; V1/V2 không rò màu; generator không lệch                 | GOV-003, TOK-001/002, IMP-003     | Pending                                          |
| Typography           | Tiếng Việt không cắt dấu; trường số/đơn vị không truncate; font fallback không phá cấu trúc                | TYPE-001–005                      | Pending                                          |
| Spacing              | Một nơi sở hữu page padding; field/error được nhóm đúng; dense row không ép nhỏ chữ/target                 | SPACE-001–004                     | Pending                                          |
| Component states     | Có đủ default/hover/focus/pressed/selected/disabled/pending/invalid khi có nghĩa; focus không bị state che | CMP-000 và component tương ứng    | Pending                                          |
| Feedback             | Slow/empty/error/retry/success phân biệt; dữ liệu thiếu khác 0; không success giả                          | CMP-027–032, GOV-005              | Pending                                          |
| Sidebar              | Toggle bằng keyboard; rail vẫn đến mọi đích; không auto-expand hover; reload/storage blocked đúng          | NAV-001–004, CMP-001/004/007      | Pending                                          |
| App bar              | Search học phần đúng scope; icon có tên; account/notice đúng quyền; kỳ thuộc dữ liệu trang                 | NAV-005/006/011                   | Pending                                          |
| Routing              | Deep link qua login giữ edition/query; Back/Forward không mất context; 404 có lối ra                       | NAV-007/008, PAGE-021             | Pending                                          |
| Dashboard            | Lịch/thông báo/việc học vụ/quick links theo ưu tiên; không KPI điểm/phí chính                              | GOV-004, PAGE-002                 | Pending                                          |
| Tables               | Header–cell đúng; số căn phải; scroll bằng keyboard trong vùng; không mất cột thiết yếu                    | CMP-010, RESP-003                 | Pending                                          |
| Forms                | Label/error có liên kết; giá trị giữ sau lỗi/đổi nhóm; pending chặn submit lặp                             | CMP-017/019/021/023/024, A11Y-006 | Pending                                          |
| Overlay              | Focus vào/ra đúng, Escape/Close, không tab nền modal, popup không vượt viewport                            | CMP-008/025, A11Y-009             | Pending                                          |
| Responsive           | Chạy đủ ma trận viewport, biên breakpoint, xoay/bàn phím; không page overflow ngoài ngoại lệ               | RESP-001–008                      | Pending                                          |
| Contrast             | Đo tất cả cặp enabled/status/placeholder/focus thực; không opacity làm tụt tỷ lệ                           | TOK-002, A11Y-001/002             | Pending runtime; màu đặc đề xuất đã tính riêng   |
| Keyboard/AT          | Luồng chính không chuột, tên/role/value đúng; status đọc một lần; không keyboard trap                      | A11Y-004–011                      | Pending                                          |
| Zoom/targets         | 200% text, 400% browser zoom, text spacing overrides, target đo theo CSS px                                | A11Y-003/012/013                  | Pending                                          |
| Motion               | Bật reduced motion: không translate/loop/stagger; mở–đóng nhanh không kẹt; focus hiện ngay                 | MOT-001–006                       | Pending                                          |
| Performance          | Trace không reflow theo frame sidebar, thao tác không bị render nặng chặn; so sánh cùng dữ liệu/máy        | MOT-004, IMP-008 và guidelines    | Pending                                          |
| Usability            | Tìm lịch, tra môn, đọc phí, hoàn thành form không cần đoán icon/thuật ngữ; lỗi có đường sửa                | PAGE patterns, VIS-008            | Pending: cần thử nghiệm người dùng/thao tác thật |
| Technical regression | Check/tests đúng phạm vi đạt; source data/API/role không đổi ngoài yêu cầu                                 | IMP-001/002/006/008               | Pending: không chạy build/test trong nghiên cứu  |

## Ma trận trạng thái tối thiểu theo pattern

| Pattern                 | State/scenario phải có bằng chứng                                                                                    |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Trang dữ liệu           | Loading chậm; data ít/nhiều; empty thật; no results do filter; error và retry                                        |
| Form                    | Chưa nhập; hợp lệ; nhiều lỗi; nội dung dài; pending; response lỗi; success đúng tác dụng; nháp được giữ              |
| Navigation              | Student/admin; expanded/rail/drawer; child active; tooltip/flyout; URL trực tiếp; Back/Forward; storage bị chặn      |
| Overlay                 | Trigger keyboard/pointer; Escape/backdrop/close; tab cycle; anchor ra khỏi viewport; resize/breakpoint; focus return |
| Dữ liệu dày             | Cột cuối; tên môn/người dài; số tiền lớn; chưa có điểm; nhiều hàng; chữ lớn và in nếu luồng hỗ trợ                   |
| Nội dung công khai/auth | SSO configured/unconfigured theo contract; login lỗi; manager/paste; nội dung hỗ trợ có link đúng                    |

Kích thước/browser và cách đo nằm ở [responsive-rules](../03-layout/responsive-rules.md), không chép lại ngưỡng ở đây. Component chưa hiện diện như Toast/Skeleton/Calendar tháng: đánh dấu N/A có lý do; không tạo thêm để đủ checklist.

## Kiểm tra bộ tài liệu nghiên cứu

| Hạng mục            | Điều kiện                                                                                               | Kết quả                                                                                                                            |
| ------------------- | ------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Phạm vi             | Chỉ thêm/cập nhật Markdown trong docs/ui-ux/                                                            | Pass: thao tác ghi chỉ thuộc thư mục này; git status đối chiếu đầu/cuối có thêm docs/ui-ux/, các mục thay đổi sẵn được giữ nguyên  |
| Đủ cấu trúc         | Đủ 15 tệp theo yêu cầu, central document dẫn đến các chương                                             | Pass: kiểm kê 15 Markdown; không thêm artifact code/mockup                                                                         |
| Coverage            | 32 component, route/module đã phát hiện, token/layout/motion/a11y/implementation                        | Pass: 32 contract đủ 9 nhóm thuộc tính + primitive/validation; 23 mẫu route chức năng và fallback 404 có mapping                   |
| Links và Rule ID    | Link local tồn tại; ID định nghĩa không trùng; reference có định nghĩa                                  | Pass: 70 link nội bộ hợp lệ, 133 Rule ID định nghĩa không trùng; không có reference ID thiếu định nghĩa; bảng Markdown đúng số cột |
| Token consistency   | Màu/typography/spacing/radius/motion chỉ định nghĩa giá trị ở design-tokens; research ghi rõ hiện trạng | Pass: review màu/type/spacing/radius/elevation/timing, sidebar và breakpoint; các số đo test/WCAG không bị coi là token cạnh tranh |
| Contrast            | Tính lại các cặp màu đặc trong TOK-002; không suy ra runtime Pass                                       | Pass: 10/10 cặp đạt ngưỡng tương ứng bằng tính relative luminance sRGB; chưa xét opacity/ảnh/gradient của runtime                  |
| Source verification | Tách source đã đọc, ước lượng ảnh, đề xuất và điều chưa kiểm                                            | Pass: có evidence path/version, Q/Ư/Đ cho ảnh; nguồn W3C/APG/MDN/Tailwind/Fontsource đã đối chiếu; không khẳng định test UI mới    |
| Practicality        | Stack/primitive đã có; không yêu cầu package mới để thực hiện mặc định                                  | Pass: reuse/mapping/gap rõ; Skeleton/Toast/Calendar tháng không bị biến thành yêu cầu thêm tính năng                               |

Review tài liệu hoàn thành ngày 10/10/2026. Kiểm tra dùng script chỉ đọc chạy trong bộ nhớ để duyệt link/anchor/Rule ID, số cột bảng, coverage và tính contrast; không thêm script hoặc artifact ngoài phạm vi. Không chạy build, unit/E2E hoặc kiểm thử UI runtime trong phiên này.

## Những phần vẫn cần xác minh khi triển khai

Browser/thiết bị hỗ trợ chính thức và kiểm thử AT; chất lượng logo/brand asset gốc; dữ liệu/backend/SSO và quyền nghiệp vụ thực; người dùng có tìm/hoàn thành tác vụ thuận lợi trong thực tế hay không. Các khoảng trống này đã được nêu trong [design-decisions](../01-research/design-decisions.md), không được điền bằng dữ liệu hoặc kết quả test giả.

Nếu tất cả mục liên quan có Pass hoặc N/A hợp lệ và không còn Fail ở quy tắc MUST/MUST NOT thì thay đổi UI mới có thể được nghiệm thu trong phạm vi đã kiểm. Hoàn thành nghiên cứu chỉ xác nhận nền tảng đặc tả sẵn sàng, không cấp chứng nhận accessibility cho code hiện tại.
