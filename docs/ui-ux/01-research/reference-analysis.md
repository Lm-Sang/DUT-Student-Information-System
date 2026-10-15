# Phân tích ảnh tham khảo và logo

**Snapshot nghiên cứu trước triển khai.** Sau khảo sát này, logo nguyên bản được sao chép vào shared/assets và lưu trong Figma theo yêu cầu redesign; xem [báo cáo](../redesign-implementation-report.md). Quan sát ảnh và giới hạn dưới vẫn là bằng chứng lịch sử.

Khảo sát ngày 10/10/2026. Đầu vào trực tiếp: UI_sample.jfif, 1200 × 900 px RGB; logo.png, 86 × 86 px RGBA, đều nằm trong Downloads của người dùng. Kích thước là metadata tệp đã đọc; không phải kích thước CSS. Các tệp chỉ được đọc, không sao chép hoặc chỉnh sửa.

## Phương pháp và giới hạn

Ảnh tĩnh là một phối cảnh trình bày dashboard trong khung nổi, không phải đặc tả sản phẩm hoạt động. Không biết font gốc, DOM, auto-layout, breakpoint, hover, thứ tự Tab hoặc animation. Phân tích sau phân biệt **Q: quan sát trực tiếp**, **Ư: ước lượng theo raster**, **Đ: đề xuất mới**. Mọi giá trị chuẩn để triển khai nằm ở [design-tokens](../02-design-system/design-tokens.md), không lấy số đo ảnh làm thông số chính xác.

| Đặc điểm             | Bằng chứng và mức độ                                                                           | Nguyên tắc, ưu điểm                          | Hạn chế với DUT                                                | Quy tắc rút ra                                                                  |
| -------------------- | ---------------------------------------------------------------------------------------------- | -------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Primary/secondary    | Q: xanh lam trung bình ở icon/nút; xanh rất nhạt ở nền; trắng ở card                           | Màu bão hòa đánh dấu tương tác, nền yên tĩnh | Màu nhạt có thể không đủ tương phản                            | Đ: pastel dành cho nền; chữ/link dùng màu đậm đã đo                             |
| Nền và gradient      | Q: chuyển sắc trắng–xanh trong khung và nền ngoài                                              | Tạo chiều sâu, cảm giác thân thiện           | Lớp trang trí tăng nhiễu, không giúp đọc bảng                  | Đ: nền đặc trong workspace; không gradient ở bảng/form                          |
| Chữ                  | Q: sans-serif hình học, tiêu đề đen, mô tả xám nhạt; Ư: chữ thân nhỏ khoảng 10–13 px trong ảnh | Hệ phân cấp bằng cỡ/độ đậm                   | Không xác định được font; nhiều dòng mô tả khó đọc             | Đ: giữ Be Vietnam Pro đã có; kiểm tra dấu tiếng Việt và độ tương phản           |
| Line-height/tracking | Q: đoạn mô tả thoáng hơn nhãn; Ư: line-height khoảng 1,3–1,5                                   | Chia đoạn và phân biệt thông tin phụ         | Không suy ra chính xác từ ảnh đã nén                           | Đ: dùng vai trò type; tracking thông thường bằng 0, không ép chữ để vừa         |
| Layout               | Q: sidebar trái, header trên, ba cột nội dung bất đối xứng                                     | Tách nơi đi đến khỏi việc đang làm           | Ba cột không phù hợp màn hẹp hay bảng nhiều cột                | Đ: shell chung; dashboard tối đa hai vùng ưu tiên, bảng dùng toàn vùng nội dung |
| Sidebar              | Q: logo trên, 5 mục có icon/nhãn, nút đăng xuất dưới; Ư: rộng khoảng 150 px ảnh                | Dễ nhận biết điểm đến                        | Nhãn DUT dài hơn; số module nhiều hơn                          | Đ: expanded/rail/drawer theo token, không sao chép chiều rộng raster            |
| Khoảng cách          | Q: lề ngoài rộng, card có khoảng trống rõ; Ư: gap khoảng 12–24 px ảnh                          | Proximity giúp nhóm nội dung                 | Nhiều khoảng trống làm giảm số hàng học vụ nhìn thấy           | Đ: scale thống nhất; chế độ bảng gọn có giới hạn                                |
| Card                 | Q: lịch học trái, điểm danh giữa, lịch tháng dưới, tin phải                                    | Mỗi khối có mục đích và heading              | Điểm danh không có module tương ứng trong code                 | Đ: tái dùng nguyên tắc grouping, không bổ sung điểm danh                        |
| Radius               | Q: bo góc lớn, sidebar gần hình capsule; Ư: góc khoảng 20–40 px ảnh                            | Giảm cảm giác cứng                           | Bo quá lớn tiêu tốn diện tích và làm mọi khối giống nhau       | Đ: ba cấp control/card/dialog, pill chỉ cho badge phù hợp                       |
| Border/shadow        | Q: viền rất mờ, bóng khuếch tán; khó tách một số ô                                             | Thể hiện lớp và độ nổi                       | Neumorphism/viền nhạt làm control khó nhận diện                | Đ: border control riêng; card phẳng, overlay mới có bóng                        |
| Icon                 | Q: icon nét mảnh xanh, vùng click có vẻ nhỏ                                                    | Gợi nghĩa nhanh cùng nhãn                    | Không đo được vùng click thực; nhiều icon không rõ tác dụng    | Đ: thống nhất SVG hiện có, tên truy cập và target độc lập kích thước nét        |
| Trạng thái           | Q: Active xanh lá, ngày chọn xanh, nhãn New                                                    | Chữ cùng màu hỗ trợ nhận biết                | Không có đủ error/loading/disabled/focus trong ảnh             | Đ: đặc tả toàn bộ state, không suy diễn đây là trạng thái đã thiết kế           |
| Lịch tháng           | Q: lưới ngày rất nhỏ, nút tiến/lùi, ô ngày chọn                                                | Mẫu quen thuộc để định vị ngày               | Không thể đọc nhiều môn/giờ/phòng; target quá nhỏ nếu dùng 1:1 | Đ: ưu tiên lịch học/lịch thi thực tế và danh sách agenda trên mobile            |
| Tin tức/hình ảnh     | Q: ảnh xanh lớn, tóm tắt ngắn, Read more                                                       | Điểm nhấn nội dung                           | Ảnh trang trí chiếm diện tích tác vụ                           | Đ: chỉ dùng ảnh có nội dung; thông báo phải đọc được tiêu đề, nguồn, ngày, hạn  |
| Trang trí nền        | Q: vòng tròn, chấm bi, khối màu sau khung                                                      | Hợp ảnh giới thiệu                           | Gây nhiễu trong phần mềm dùng hằng ngày                        | Đ: loại khỏi workspace                                                          |

## Tương tác có thể đề xuất, không thể quan sát

Hover chỉ đổi màu nhẹ; selected có dấu hiệu ngoài màu; focus có outline; nhấn trả phản hồi ngay. Sidebar thay đổi khi người dùng kích hoạt toggle. Flyout có click/bàn phím và Escape; tooltip là thông tin bổ trợ. Popover giữ trong viewport. Không khẳng định ảnh gốc có các hành vi này. Các contract thuộc [component-rules](../02-design-system/component-rules.md), [navigation](../03-layout/layout-navigation.md) và [motion](../04-interactions/animation-rules.md).

## Logo DUT được cung cấp

Quan sát: biểu trưng xanh–vàng, chữ đỏ “BÁCH KHOA”, chữ xanh theo chiều dọc, viền tối. Đây là một raster nhỏ có alpha; không đủ để suy ra quy chuẩn thương hiệu chính thức, mã màu gốc, font hoặc các phiên bản logo được phê duyệt. Không tự lấy màu vàng/đỏ trong logo làm màu cảnh báo/lỗi của hệ thống.

Đề xuất: giữ nguyên hình, tỷ lệ và màu; nền trắng; không crop, kéo giãn, thêm bóng, đổi màu bằng filter hoặc vẽ lại bằng AI. Logo đi kèm tên trường/hệ thống bằng text sống để vẫn đọc được khi chữ trong crest quá nhỏ. Dùng asset vector hoặc raster độ phân giải cao đã được xác nhận ở giai đoạn tích hợp; logo 86 px chỉ đủ tham khảo, không hứa chất lượng ở mọi mật độ màn hình. Kích thước/clear space trong token là quy ước UI đề xuất, **không phải brand manual DUT**.

## Kết luận thiết kế

Giữ nền xanh nhạt, surface trắng, nhóm nội dung rõ và nét icon nhất quán. Điều chỉnh mật độ, typography, target và contrast cho tác vụ học vụ. Loại bỏ card điểm danh, vòng tròn trang trí và bảng lịch nhỏ thiếu dữ liệu. Không cần thêm thư viện hay dựng mockup để xác lập các quy tắc này.
