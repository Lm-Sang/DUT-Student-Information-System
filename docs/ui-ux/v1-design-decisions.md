# Quyết định thiết kế V1 — App Bar

> Palette trong tài liệu này là lịch sử. Màu và state hiện hành theo [Brand Color System](brand-color-system.md); các quyết định layout/nghiệp vụ không bị thay đổi bởi đợt cập nhật màu.

> Báo cáo/quyết định của đợt trước. Bản cập nhật xanh hiện hành được ghi tại [V1 redesign](v1-redesign-report.md) và [V2 redesign](v2-redesign-report.md); các giá trị surface/radius mới ưu tiên theo design-tokens.

10/10/2026 · Đã triển khai trong code và đồng bộ Figma. Nguồn nghiên cứu và đánh đổi nằm trong [external-research](external-research.md); nền tảng chung nằm trong [design-tokens](02-design-system/design-tokens.md).

V1 giữ navigation ngang và vùng nội dung rộng. Việc nhóm chức năng theo nhiệm vụ giúp sinh viên tìm học phần, xem lịch hoặc gửi đề nghị mà vẫn đọc được bảng trên toàn chiều rộng bên dưới header. Đây là lựa chọn thiết kế từ nghiên cứu và cấu trúc sản phẩm hiện có; chưa có nghiên cứu người dùng DUT để khẳng định cải thiện thời gian thao tác.

| Quyết định               | Vấn đề và hành vi sau thay đổi                                                                                         | Cơ sở / đánh đổi                                                                          | Điểm triển khai                            |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------ |
| V1-01 · App Bar          | Giữ menu ngang, search học phần, thông báo và tài khoản trong header                                                   | Carbon shell phân biệt navigation và tiện ích; menu ngang dùng thêm chiều cao khi chữ lớn | PortalHeader, NavigationMenu, redesign.css |
| V1-02 · Click disclosure | Nhóm mở bằng click/Enter/Space, ArrowDown vào link, Escape đóng và trả focus; hover chỉ phản hồi màu                   | Pointer và bàn phím có cùng đích; giảm mở nhầm khi rê chuột                               | NavigationMenu và kiểm thử redesign        |
| V1-03 · Nhóm học vụ      | Đồ án cùng học phần và đăng ký trong Chương trình đào tạo; giữ nguyên URL và quyền                                     | Quan hệ nghiệp vụ rõ hơn; không thêm mục chưa có route                                    | navigation.ts                              |
| V1-04 · Dashboard        | Lịch là vùng chính; thông báo rồi truy cập nhanh ở cột phụ; chuẩn đầu ra/rèn luyện trong disclosure sau lịch           | Canvas dashboard gợi ý ưu tiên tác vụ theo ngày; điểm và học phí vẫn ở module riêng       | StudentDashboardPage                       |
| V1-05 · Bảng và summary  | Heading → nhóm số liệu → filter → bảng → phân trang; số liệu dùng card có khoảng cách, hàng có phản hồi hover          | Carbon table giữ quan hệ hàng/cột; tăng cỡ chữ cần nhiều diện tích hơn                    | AcademicUi, PageHeading, CSS chung         |
| V1-06 · Dịch vụ          | Lập đơn, lịch sử và thiết bị là các view theo query; view khác được ẩn nhưng vẫn mounted                               | Giảm tải thông tin và giữ nháp/file khi chuyển view hoặc Back                             | ServiceRequestsPage                        |
| V1-07 · Mobile           | Dưới 1100px dùng drawer đầy đủ; dashboard một cột ở dưới 768px; dưới 601px liên kết V2 nằm cuối trang                  | Navigation không ép chữ nhỏ; liên kết phiên bản không che radio hoặc CTA                  | redesign.css, Sidebar, VersionLink hiện có |
| V1-08 · Chữ lớn và focus | Menu ngang wrap khi không đủ chỗ; cột giờ học tăng theo nội dung; đổi pathname đưa focus vào main, đổi query giữ focus | Đáp ứng chữ lớn và cách đọc bằng bàn phím, không reset context khi chỉ đổi filter         | useRouteFocus, PortalLayout, .today-lesson |

Logo dùng nguyên tệp người dùng cung cấp, giữ tỷ lệ trong hộp 40px; tên trường/hệ thống vẫn là chữ HTML. Không phóng raster 86px thành hero hoặc tự vẽ lại thương hiệu. Be Vietnam Pro và các asset đang có được tái sử dụng.

Học phí cũng dùng view tập trung theo query; lịch thanh toán, bộ lọc, mở chi tiết và dữ liệu mẫu được giữ. Điểm, PLO, đăng ký, đồ án, rèn luyện, cộng đồng, hồ sơ, public/login, thông báo, admin và 404 dùng cùng foundation và primitive hiện có. Không thay service, hook dữ liệu, validation, phân quyền hoặc hợp đồng route để phục vụ bố cục.

Motion dùng CSS hiện có: phản hồi màu ngắn, disclosure/menu, dialog và tooltip; không animate toàn trang. Reduced motion đưa nội dung về trạng thái cuối. Kết quả kiểm tra và các giới hạn thiết bị/AT nằm trong [báo cáo triển khai](redesign-implementation-report.md).
