# Quyết định thiết kế V2 — Sidebar

> Palette trong tài liệu này là lịch sử. Màu và state hiện hành theo [Brand Color System](brand-color-system.md); các quyết định layout/nghiệp vụ không bị thay đổi bởi đợt cập nhật màu.

> Báo cáo/quyết định của đợt trước. Bản cập nhật xanh hiện hành được ghi tại [V1 redesign](v1-redesign-report.md) và [V2 redesign](v2-redesign-report.md); các giá trị surface/radius mới ưu tiên theo design-tokens.

10/10/2026 · Đã triển khai trong code và đồng bộ Figma. V2 dùng cùng palette, font và primitive với V1, nhưng giữ sidebar và workspace riêng. Xem [nghiên cứu](external-research.md), [quyết định V1](v1-design-decisions.md) và [mapping](figma-code-mapping.md).

Sidebar phù hợp khi cần truy cập nhiều nhóm chức năng lặp lại mà vẫn giữ ngữ cảnh hiện tại. Nó chiếm chiều rộng của bảng; rail và drawer giải quyết giới hạn không gian. Lựa chọn này dựa trên nghiên cứu pattern và cấu trúc module thực tế, chưa phải kết quả thử nghiệm người dùng DUT.

| Quyết định                | Vấn đề và hành vi sau thay đổi                                                                                                        | Cơ sở / đánh đổi                                                                      | Điểm triển khai                   |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | --------------------------------- |
| V2-01 · Shared foundation | Bỏ palette riêng theo edition; action fill và chữ action có vai trò riêng                                                             | Giữ thương hiệu và tương phản trên selected tint; layout vẫn khác V1                  | tokens.json, generator, v2.css    |
| V2-02 · Sidebar           | Expanded 256px, rail 72px; collapse bằng nút và giữ lựa chọn localStorage; không mở rộng khi hover                                    | Nhãn tiếng Việt dài dễ đọc hơn; bảng có ít chiều rộng hơn                             | PortalV2Layout, redesign.css      |
| V2-03 · Nhóm chức năng    | Parent là link, nút riêng mở nhóm; học phần/đăng ký, bốn mục kết quả học tập và bốn mục rèn luyện tới được trong expanded/rail/drawer | Disclosure navigation giữ đúng ngữ nghĩa link và command                              | V2NavigationItem, SidebarRailItem |
| V2-04 · Tooltip           | Pointer đợi 400ms; focus hiện ngay; tooltip hover được, có khoảng chuyển pointer 150ms và Escape                                      | Tránh chớp khi rê qua nhưng không trì hoãn tên truy cập                               | SidebarRailItem                   |
| V2-05 · Toolbar           | Breadcrumbs, tìm học phần, chuyển phiên bản, thông báo và tài khoản; Ctrl/Cmd K focus search                                          | Carbon và Atlassian phân tách shell/action; phạm vi tìm kiếm phản ánh service hiện có | Breadcrumbs, PortalV2Layout       |
| V2-06 · Dashboard         | Welcome toàn hàng; lịch trái, thông báo/truy cập nhanh phải; chuẩn đầu ra sau lịch trong DOM                                          | Lịch có vai trò chính; giữ thẻ sinh viên, đề cương và tải ICS có thật                 | StudentDashboardV2Page            |
| V2-07 · Học phí/dịch vụ   | Đổi query hiển thị đúng view thay vì cuộn qua tất cả section; nội dung vẫn mounted để giữ draft/file                                  | Giảm chiều dài tác vụ và giữ Back/Forward; không đổi API hoặc khả năng thanh toán     | TuitionPage, ServiceRequestsPage  |
| V2-08 · Responsive        | ≤900px dùng drawer, không ghi đè lựa chọn collapse; dưới 1200px dashboard/service stack; toolbar mobile hai hàng                      | Nội dung quyết định số cột, không nhận diện thiết bị; link phiên bản vẫn hiện         | redesign.css                      |
| V2-09 · Điều hướng/focus  | Nhóm active tự mở khi pathname đổi; focus vào main sau chuyển trang; không lấy focus khỏi query tab hoặc filter                       | Keyboard và screen reader nhận biết trang mới, form giữ ngữ cảnh                      | useRouteFocus, V2NavigationItem   |

V2 mặc định expanded khi chưa có preference ở desktop >900px, kể cả 1024px. Đây là lựa chọn thực tế thay đề xuất rail mặc định dưới 1200px trong đặc tả cũ: giữ hành vi lưu preference đã có, cho người dùng chủ động thu gọn. Scrollbar sidebar tiếp tục ẩn theo quy ước dự án; wheel, bàn phím và truy cập các link thấp đã được kiểm thử. Nó chưa được thử với VoiceOver/TalkBack trên thiết bị thật.

Lịch và hạn trong dashboard được ghi rõ là dữ liệu mẫu. Nút lịch ghi “Tải lịch (.ics)” đúng thao tác tạo tệp; không hứa đồng bộ Google. Học phí ghi rõ phần ngân hàng chưa kết nối đối soát. Các con số và hợp đồng dữ liệu không được sửa để làm đẹp ảnh.

V2 giữ wordmark DUT và các SVG/ảnh đã có. Không thêm thư viện UI, motion, chart hoặc icon. Những cỡ metadata, radius và khoảng cách cục bộ cũ vẫn được ghi là ngoại lệ trình bày trong [báo cáo](redesign-implementation-report.md); không tuyên bố toàn bộ giá trị CSS đã chuyển thành semantic token.
