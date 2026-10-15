# Ngôn ngữ thị giác và nhận diện

Định hướng: Clean Educational Workspace, nền trung tính, điểm nhấn xanh tiết chế theo edition, surface đọc trắng, chữ navy, nét SVG nhất quán và shadow nhẹ cho card chính. [Brand Color System](../brand-color-system.md) sở hữu màu; [Token chuẩn](design-tokens.md) sở hữu chữ/kích thước/motion; chương này sở hữu cách sử dụng và nội dung thương hiệu.

| Rule ID | Category   | Priority | Description / behavior                                                                            | Rationale                               | Scope                            | Exceptions                                                   | Validation                                                                          |
| ------- | ---------- | -------- | ------------------------------------------------------------------------------------------------- | --------------------------------------- | -------------------------------- | ------------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| VIS-001 | Hierarchy  | MUST     | Nhấn tác vụ/nội dung trước; heading, khoảng cách và alignment tạo phân cấp                        | Đọc và thao tác nhanh                   | Mọi trang                        | Hero công khai có thể nổi bật hơn workspace                  | Bỏ màu vẫn nhận ra heading, CTA và nhóm nội dung                                    |
| VIS-002 | Surface    | SHOULD   | Canvas trung tính, header/card trắng; welcome xanh nhẹ; card chính dùng elevation theo edition    | Giữ cảm giác nhẹ mà không giảm contrast | Workspace                        | Card lồng dùng flat; overlay dùng elevation riêng            | Không có card lồng card nếu chỉ để trang trí                                        |
| VIS-003 | Decoration | MUST NOT | Dùng neumorphism, glass blur, gradient/glow hoặc blobs để phân biệt control                       | Ranh giới không rõ và tăng nhiễu        | Form, bảng, navigation           | Ảnh nội dung có màu/ánh sáng tự nhiên không bị cấm           | Biên input/focus vẫn rõ khi tắt shadow/background image                             |
| VIS-004 | Brand      | MUST     | Giữ tỷ lệ/màu logo; dùng size.logo-box, logo-clear; nền trắng; tên trường/hệ thống bằng text sống | Raster nhỏ không thay thế tên truy cập  | BrandLockup/sidebar/login/public | Asset/brand manual được xác minh sau có ưu tiên              | Không crop/recolor/filter; kiểm tra DPR 1/2; accessible name không đọc lặp          |
| VIS-005 | Icon       | SHOULD   | Tái dùng Icon/V2Icon và asset local, chọn một kiểu nét trong cùng vùng; màu theo semantic         | Nhất quán và không tải package mới      | Icon UI                          | Logo thương hiệu giữ asset nguyên bản                        | Cùng một hành động dùng cùng icon và accessible name; không emoji làm icon hệ thống |
| VIS-006 | Imagery    | MAY      | Dùng ảnh trường/hoạt động thật đã có khi giúp hiểu nội dung                                       | Ảnh có nhiệm vụ cụ thể                  | Public/hoạt động                 | Thiếu ảnh thì dùng bố cục text                               | Ảnh có alt phù hợp, giữ tỷ lệ, không thêm ảnh stock lấp khoảng trống                |
| VIS-007 | State      | MUST     | Selected/error/success có chữ, dấu hoặc icon ngoài màu; focus là lớp độc lập                      | Không phụ thuộc thị giác màu            | Control và dữ liệu               | Decorative color không mang nghĩa                            | Đọc được trạng thái ở grayscale và bằng screen reader                               |
| VIS-008 | Copy       | MUST     | Tiếng Việt rõ, nhất quán thuật ngữ học phần/lớp học phần/học kỳ/tín chỉ; CTA động từ cụ thể       | Giảm hiểu nhầm nghiệp vụ                | Mọi chuỗi UI                     | Tên tài liệu/hệ thống ngoài giữ nguyên                       | “Lưu bản nháp” khác “Gửi”; lỗi có cách xử lý; không hiển thị exception kỹ thuật thô |
| VIS-009 | Theme      | MUST     | Thiết kế light đầy đủ; giữ focus/high contrast của hệ điều hành                                   | Phù hợp code hiện tại                   | Web                              | Dark mode là yêu cầu sản phẩm mới, cần full palette và state | OS dark không tạo input tối trên surface sáng; forced colors vẫn nhận diện control  |

## Nhận diện có giới hạn rõ

Logo người dùng là tham chiếu được phép dùng để nghiên cứu. Không chứng minh đây là bộ tài sản đầy đủ hay phiên bản vector chính thức. Không tự tạo bản trắng, đơn sắc, favicon mới hoặc đổi bố cục crest. Sidebar rail có thể chỉ hiện crest nếu tên truy cập đầy đủ và hiển thị đủ rõ; nếu asset chưa đạt chất lượng, giữ lockup text hiện tại cho đến khi có asset phù hợp. Đây là quyết định chất lượng asset, không chặn việc hoàn thành đặc tả.

Nét riêng của DUT trong quy tắc này đến từ ngôn ngữ học vụ, lịch học có giờ/phòng rõ, navigation gọn và logo được giữ đúng. Không lấy màu vàng/đỏ của logo phủ lên mọi nút/trạng thái.

## Nội dung và mật độ

Thông báo phải có tiêu đề cụ thể, nguồn và ngày; hạn quan trọng không bị hạ xuống caption. Số tiền giữ đơn vị VND/₫ theo formatter hiện có, điểm có hệ/thang và giá trị thiếu khác số 0. Ngày/giờ dùng định dạng nhất quán tiếng Việt; múi giờ sự kiện thuộc dữ liệu, không lấy timezone máy tùy tiện. Bản nháp local không được mô tả là đã gửi nhà trường. Nhãn sample/demo phải giải thích tác dụng thật, không đưa kỹ thuật lưu trữ vào mọi dòng giao diện nếu người dùng không cần biết.

Link trong đoạn văn có gạch chân; link navigation có pattern selected riêng. Mỗi nhóm tác vụ chỉ có một primary action nổi bật; không bắt buộc trang chỉ được có một nút primary khi có các tác vụ độc lập ở những section khác nhau.

## Phân bổ màu hiện hành

Theo [Brand Color System](../brand-color-system.md): gradient nhẹ chỉ trong banner chào, control dùng nền đặc và focus độc lập. V1 header trắng với active xanh; V2 sidebar neutral với active selected xanh nhẹ. Giữ hình học và bố cục của hai edition. Vàng/đỏ chỉ dùng cho accent hoặc status có mục đích.
