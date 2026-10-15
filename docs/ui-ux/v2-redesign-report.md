# V2 redesign — Modern Pastel Soft UI

> Palette trong tài liệu này là lịch sử. Màu và state hiện hành theo [Brand Color System](brand-color-system.md); các quyết định layout/nghiệp vụ không bị thay đổi bởi đợt cập nhật màu.

Bản cập nhật 10/10/2026, theo phản hồi giao diện quá trắng. Tiếp nối bản redesign trước; tham chiếu layout/function có sẵn, giữ dữ liệu và luồng nghiệp vụ.

## Nghiên cứu và định hướng

UI_sample2 cung cấp sidebar pastel và active pill trắng; UI_sample cung cấp card giáo dục mềm và nền xanh thoáng. Không mang khung trưng bày, biểu đồ tài chính hoặc số liệu attendance vào sản phẩm.

Sidebar #CEDFFF rộng 256px/rail 72px, nối với main #E8F0FF qua mép cong 32px. Logo gốc xuất hiện ở cả expanded và rail; tên truy cập đầy đủ. Welcome dùng hai sắc xanh, card trắng 24px/shadow 6%, control 12px. Ca đầu ngày có nhãn và cạnh xanh; truy cập nhanh xanh nhạt; vùng chuẩn đầu ra lavender nhẹ. Drawer mobile giữ menu đầy đủ, flyout rail và lựa chọn thu gọn vẫn hoạt động.

[Research bổ sung](external-research.md#bổ-sung-cho-yêu-cầu-tăng-sắc-xanh--10102026) ghi nguồn, phần học hỏi và phần loại bỏ. [Design tokens](02-design-system/design-tokens.md) sở hữu mã màu và kích thước; [Visual style](02-design-system/visual-style.md) sở hữu ngoại lệ gradient/chính sách surface.

## Phạm vi triển khai

Theme scope ở AppProviders áp dụng public/login, tổng quan, học phần/chi tiết, điểm/học vụ/PLO, lịch học/thi, đồ án, học phí, rèn luyện/cộng đồng, dịch vụ, hồ sơ/đăng ký và admin. Shared Card, input, table header, SectionNav và metric dùng cùng token theo edition. Không thêm dependency hoặc business feature.

Border control dùng field-border riêng; radio nhận kết quả hiển thị từng dòng. Loading/error/empty kế thừa theme và giữ hành vi retry/feedback. Reduced motion không đổi. Code auth/API/router/data/hook nghiệp vụ được đối chiếu hash với snapshot trước lần sửa này.

## Figma và kiểm chứng

Đã đồng bộ đủ **66 frame/state** của hai edition trong file đang dùng, giữ nguyên toàn bộ frame ID và **122 main component ID**. Có sáu frame mobile 390px, trạng thái menu thu gọn, notification drawer, lọc rỗng, view học phí/dịch vụ và 404. [Mở dashboard V2](https://www.figma.com/design/hq4ifJ2w6AjspNHzSafral/DUT-Student-Portal?node-id=222-1000); danh sách đầy đủ trong [Figma mapping](figma-code-mapping.md).

Bộ Button 247:2129 có 24 biến thể Edition × Style × State. Bảng màu mới nằm tại [Blue surfaces](https://www.figma.com/design/hq4ifJ2w6AjspNHzSafral/DUT-Student-Portal?node-id=349-2229). Screen gồm text/vector/Auto Layout/instance editable, logo/ảnh nội dung dùng asset gốc. Đã sửa fallback fill của mẫu nút và constraint textarea mobile; không dùng ảnh UI toàn màn thay layer.

- Build, TypeScript, token generation, architecture, lint và 6 unit test đạt.
- 41 ca Chromium đã được kiểm tra: lượt đầu 40 đạt, một ca còn kỳ vọng màu nền cũ; sau cập nhật kỳ vọng, 4 ca liên quan theme/form chạy lại đạt. Hai ca validation/focus chạy lại sau chỉnh biên trạng thái cũng đạt.
- 350 trường hợp responsive ở 1440, 1280, 1024, 768, 390, 360 và 320px đạt. 42 trường hợp dịch vụ đã kiểm tra lại sau sửa radio; một lần chụp quá sớm chưa có heading được kiểm lại bằng điều kiện chờ heading hiển thị.
- 36 trường hợp text resize/spacing/reflow đạt. 42 cặp màu chữ/surface đạt tối thiểu 4,564:1. Focus và biên lỗi vẫn dùng token riêng.
- Audit Figma: 66 frame tồn tại, mỗi frame có một body quản lý, không missing font/ảnh/placeholder, không chồng lấn frame trong tọa độ canvas tuyệt đối. Đã xem desktop dashboard, học phần, học phí, rèn luyện, mobile dashboard/dịch vụ và bộ nút.
- So với snapshot đầu phiên, phần source thay đổi nằm ở shell, edition wrapper và CSS/token generator; dữ liệu, hook, routing và xử lý nghiệp vụ giữ nguyên.

Bằng chứng: [checks](verification/blue-redesign/checks.json), [responsive](verification/blue-redesign/responsive-audit.json), [text](verification/blue-redesign/text-audit.json), [contrast](verification/blue-redesign/contrast.json), [native Figma](verification/blue-redesign/native-audit.json), [canvas](verification/blue-redesign/canvas-audit.json), [source](verification/blue-redesign/source-audit.json).

## Giới hạn

Kiểm thử trình duyệt tự động dùng Chromium; chưa kiểm chứng lại Safari hoặc thiết bị/trình đọc màn hình thực. Light mode là phạm vi hiện tại. Figma là các view để review, chưa mô phỏng toàn bộ nghiệp vụ; native select, glyph và một số chi tiết CSS giả phần tử có thể khác trình duyệt. Textarea xuống dòng, input/select một dòng giữ cách cắt nội dung tương ứng.
