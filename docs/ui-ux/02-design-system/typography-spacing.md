# Typography, khoảng cách và mật độ

Nguồn giá trị duy nhất: [type tokens](design-tokens.md#typography-tokens), [spacing tokens](design-tokens.md#spacing-and-surfaces), [dimensions](design-tokens.md#dimensions-and-breakpoints). Không tạo một scale riêng theo trang.

| Rule ID   | Category    | Priority | Description / behavior                                                                | Rationale                               | Scope                        | Exceptions                                                              | Validation                                                                                  |
| --------- | ----------- | -------- | ------------------------------------------------------------------------------------- | --------------------------------------- | ---------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| TYPE-001  | Font        | MUST     | Dùng font.ui và weights đã tải; ưu tiên rem và line-height không cắt dấu              | Tiếng Việt và thiết lập font người dùng | Toàn web                     | Logo giữ raster/font gốc; ký hiệu chuyên ngành theo nội dung            | Kiểm tra “Đăng ký học phần”, “Nguyễn Thị Ánh”, “Điểm rèn luyện”, fallback khi font chưa tải |
| TYPE-002  | Roles       | MUST     | h1→type.page; h2→section; h3/card→card; body/label/table/nav đúng vai trò             | Semantic và visual thống nhất           | Nội dung trang               | Cấp heading phụ thuộc cây nội dung, không phụ thuộc cỡ font             | Một heading trang rõ; không nhảy cấp để đổi cỡ; không body dài bằng caption                 |
| TYPE-003  | Readability | SHOULD   | Đọc dài giới hạn prose-max; căn trái; tránh ALL CAPS; tracking bình thường            | Dễ đọc tiếng Việt có dấu                | Thông báo/hướng dẫn/form     | Mã học phần viết hoa theo dữ liệu                                       | Không kéo dài một dòng ngang toàn desktop; không justify                                    |
| TYPE-004  | Data        | MUST     | Table text và tabular numerals; căn phải số, trái text; không cắt số tiền/điểm/hạn    | Hỗ trợ so sánh                          | Bảng học vụ/học phí/tiêu chí | Mã định danh căn trái dù chỉ có chữ số                                  | Phân biệt thiếu dữ liệu, 0, không áp dụng; đơn vị và precision nhất quán                    |
| TYPE-005  | Truncation  | SHOULD   | Cho tên/hướng dẫn wrap; truncate chỉ metadata phụ có đường mở đầy đủ bằng click/focus | Tránh giấu thông tin cần hành động      | Nav/card/table               | Tiêu đề thông báo dạng preview có thể clamp nếu vào chi tiết đọc đầy đủ | Không cắt CTA, lỗi form, hạn, số tiền; không dựa chỉ tooltip hover                          |
| SPACE-001 | Rhythm      | MUST     | Dùng semantic section/grid/panel/field/label; một nơi chịu trách nhiệm lề page        | Tránh khoảng trống cộng dồn             | Shell và page                | Vị trí icon quang học có sai lệch nhỏ phải ghi lý do                    | Không padding shell + wrapper + card lồng ba lần cho một nội dung                           |
| SPACE-002 | Density     | SHOULD   | Form/đọc dùng comfortable; bảng dùng default, dense khi cần nhiều hàng                | Dày hợp tác vụ, không đồng loạt ép nhỏ  | Trang dữ liệu                | Compact control chỉ theo điều kiện size.control-sm                      | Dense vẫn giữ type.table và target; row tăng khi label wrap                                 |
| SPACE-003 | Grouping    | MUST     | Label gần field, error/helper cùng nhóm; section khác nhau có khoảng tách rõ          | Proximity truyền quan hệ                | Form và trang hỗn hợp        | Không                                                                   | Đọc từ trên xuống không gán nhầm label/error cho trường khác                                |
| SPACE-004 | Growth      | MUST     | Height nội dung tự tăng; wrap toolbar và action trước khi làm chữ nhỏ đi              | Hỗ trợ text zoom và nội dung dài        | Mọi component                | Grid lịch/bảng hai chiều có vùng cuộn riêng                             | 200% text và text-spacing không mất chữ/nút                                                 |

## Ánh xạ nội dung sang vai trò

| Nội dung                           | Vai trò                                   | Lưu ý                                                          |
| ---------------------------------- | ----------------------------------------- | -------------------------------------------------------------- |
| “Lịch học & lịch thi” đầu trang    | type.page                                 | Page description dùng body/secondary                           |
| “Lịch học hôm nay” trong dashboard | type.section hoặc card theo cấp ngữ nghĩa | Không tạo hai cỡ cho cùng cấp trong cùng trang                 |
| Tên học phần trong bảng            | type.table                                | Cho wrap, giữ mã học phần tách rõ                              |
| Tên giảng viên, phòng, đơn vị gửi  | type.secondary                            | Không thu nhỏ thông tin cần để đến lớp                         |
| Ngày phát hành ít quan trọng       | type.caption                              | Ngày hết hạn ảnh hưởng hành động dùng secondary/body           |
| Nhãn và nội dung input             | type.label / type.input                   | Placeholder không thay label                                   |
| Link sidebar                       | type.nav                                  | Nhãn dài có thể hai dòng, min-height không fixed-height        |
| Tổng tiền ở module học phí         | type.metric                               | Label/unit bằng label/secondary; không đưa lên dashboard chính |

## Trường hợp kiểm thử nội dung

Dùng tên người dài có dấu, tên môn nhiều từ, mã học phần dài, số tiền nhiều chữ số, đường dẫn/tên file dài, lỗi nhiều dòng, nội dung trống, một hàng và nhiều hàng. Với bảng, chỉ ngắt từ khi cần; không bẻ mã/số thành các ký tự dọc. Với form, field đơn không giãn quá form-max; chỉ ghép hai cột cho hai trường ngắn có liên hệ và còn đủ chỗ khi chữ lớn.

Trong lần triển khai, kiểm tra font tải chậm để đo layout shift; không thêm nhiều weight chỉ để trang trí. Những điều này là tiêu chí cần thực hiện, không phải kết quả render đã được kiểm chứng trong nghiên cứu.
