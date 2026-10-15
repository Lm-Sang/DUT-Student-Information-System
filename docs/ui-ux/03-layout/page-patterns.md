# Quy tắc theo trang và module

Khảo sát [AppRoutes](../../../web/src/app/router/AppRoutes.tsx), [routes](../../../web/src/shared/config/routes.ts) và các page trong web/src/features/. Có 23 mẫu route chức năng và fallback 404. V2 giữ cùng path dưới tiền tố /v2; edition không phải nghiệp vụ mới. Các pattern dưới không thêm filter, action, chart hay backend chưa tồn tại.

## Contract trang — PAGE-001

Category: Page patterns. Priority: MUST. Scope: mọi trang được giao triển khai. Description: giữ mục tiêu và hợp đồng nghiệp vụ; đủ loading/error/empty/data và trạng thái thao tác khi áp dụng. Rationale: visual thay đổi không được làm mất chức năng. Behavior: heading/context → primary content → supporting content; table/form/list phù hợp loại dữ liệu. Exceptions: trang static không có loading giả. Validation: kiểm tra cùng dữ liệu và quyền trước/sau, deep link, Back/Forward, desktop/mobile.

Mọi pattern từ PAGE-002 đến PAGE-020 là MUST trong phạm vi trang tương ứng. Mục tiêu là rationale; “Điều tránh/kiểm tra” là validation; ngoại lệ chung chỉ gồm khác biệt quyền và trạng thái dữ liệu thật. Kích thước/token/keyboard kế thừa các chương component/layout/accessibility, không tự đặt lại.

## Bản đồ route

| Route V1 (V2 thêm /v2)    | Source page                                          | Pattern  |
| ------------------------- | ---------------------------------------------------- | -------- |
| /dashboard                | student/StudentDashboardPage, StudentDashboardV2Page | PAGE-002 |
| /                         | portal/PublicHomePage                                | PAGE-003 |
| /login                    | auth/LoginPage                                       | PAGE-004 |
| /profile                  | student/StudentProfilePage                           | PAGE-005 |
| /academic/courses         | academics/CoursesPage                                | PAGE-006 |
| /academic/courses/:id     | academics/CourseDetailPage                           | PAGE-007 |
| /academic/grades          | academics/GradesPage                                 | PAGE-008 |
| /academic/grades/current  | academics/CurrentGradesPage                          | PAGE-009 |
| /academic/grades/standing | academics/AcademicStandingPage                       | PAGE-010 |
| /academic/grades/plo      | academics/PloPage                                    | PAGE-011 |
| /academic/schedule        | academics/SchedulePage                               | PAGE-012 |
| /academic/thesis          | academics/ThesisPage                                 | PAGE-013 |
| /academic/thesis/details  | academics/ThesisDetailPage                           | PAGE-013 |
| /registration             | registration/RegistrationPage                        | PAGE-014 |
| /tuition                  | tuition/TuitionPage                                  | PAGE-015 |
| /conduct/self-assessment  | conduct/SelfAssessmentPage                           | PAGE-016 |
| /conduct/class-assessment | conduct/ClassAssessmentPage                          | PAGE-016 |
| /community/activities     | community/ActivitiesPage trong CommunityPages.tsx    | PAGE-017 |
| /community/activities/:id | community/ActivityDetailPage cùng file               | PAGE-017 |
| /community/results        | community/CommunityResultsPage cùng file             | PAGE-017 |
| /services/requests        | services/ServiceRequestsPage                         | PAGE-018 |
| /notifications            | notifications/NotificationsPage                      | PAGE-019 |
| /admin                    | admin/AdminDashboardPage                             | PAGE-020 |
| *                         | app/pages/NotFoundPage                               | PAGE-021 |

Bảo hiểm và thi Anh văn có mục không route trong navigation V1; **chưa có màn chức năng**. Thông báo về kỳ thi không chứng minh tồn tại luồng đăng ký thi. Không tạo trang điểm danh từ ảnh mẫu.

## PAGE-002 — Dashboard sinh viên

- **Mục tiêu:** biết hôm nay học gì, tin/hạn nào cần xem và đi đến tác vụ thường dùng.
- **Hierarchy/layout:** lời chào ngắn → lịch học → thông báo → công việc học vụ hiện có (rèn luyện/chuẩn đầu ra) → truy cập nhanh; hai vùng chính/phụ khi đủ rộng, không hero lớn đẩy lịch khỏi màn đầu.
- **Components/data:** danh sách buổi học có tên, thời gian, phòng; thông báo có tiêu đề/nguồn/ngày; status và quick links tới route có thật. Không đặt điểm/GPA/học phí thành KPI chính; liên kết tới bảng điểm trong quick links được phép ở mức thông thường.
- **Navigation/responsive:** link xem tuần/thông báo đầy đủ; mobile cùng thứ tự ưu tiên; không giấu lịch sau carousel/tab.
- **Điều tránh/kiểm tra:** không tạo tỷ lệ/tiến độ mới để lấp card. Ngày mẫu không gọi “hôm nay” trong dữ liệu production nếu không đúng. Download .ics không được gọi là đồng bộ hai chiều Google Calendar. Kiểm tra empty schedule, thông báo dài và quyền student.

## PAGE-003 — Cổng thông tin công khai

- **Mục tiêu:** hiểu cổng sinh viên, đăng nhập và đọc thông tin hỗ trợ/công khai.
- **Hierarchy/layout:** nhận diện và lối đăng nhập → dịch vụ/tra cứu có thật → thông báo → hỗ trợ/footer. Giữ cấu trúc public riêng, không đặt sidebar tác nghiệp cho khách chưa đăng nhập.
- **Components/data:** PublicHero/PublicV2Hero, MicrosoftSignInCard, public notifications, support; ảnh trường có nội dung, không ảnh mock thay thương hiệu.
- **Navigation/responsive:** link ngoài có tên rõ; hero hai vùng chuyển một cột, đăng nhập luôn dễ tìm.
- **Điều tránh/kiểm tra:** không hứa SSO khi URL chưa cấu hình; giữ thông báo chưa khả dụng và lối trải nghiệm như hợp đồng hiện có; không bịa thống kê/testimonial.

## PAGE-004 — Đăng nhập

- **Mục tiêu:** xác thực và quay lại đúng trang yêu cầu.
- **Hierarchy/layout:** tên hệ thống → form ngắn → trạng thái lỗi/hỗ trợ; vùng giới thiệu là phụ trên mobile.
- **Components/data:** native input, label, Button, error inline; cho password manager/autocomplete/paste.
- **Navigation/responsive:** giữ deep link và edition; form một cột, keyboard mobile không che submit.
- **Điều tránh/kiểm tra:** không tạo auth thật từ demo; không xóa tài khoản đã nhập sau lỗi; không chặn paste hoặc thêm CAPTCHA tự nghĩ; Enter submit và pending chống lặp.

## PAGE-005 — Hồ sơ sinh viên

- **Mục tiêu:** đọc và chỉnh trường được phép, xem thông tin cá nhân/gia đình.
- **Hierarchy/layout:** danh tính → nhóm thông tin → trường sửa được → action lưu; phân biệt read-only rõ bằng semantics.
- **Components/data:** tab nội bộ đã có, definition list cho dữ liệu đọc, form cho editable; thiếu dữ liệu không hiển thị 0.
- **Navigation/responsive:** tabs theo CMP-006; một cột trên hẹp; đổi nhóm giữ nháp theo hành vi đã có.
- **Điều tránh/kiểm tra:** không bật chỉnh sửa mọi trường chỉ để đồng nhất style, không lộ dữ liệu cá nhân dư trong tooltip; kiểm tra nhãn, focus tab, error và xác nhận lưu đúng tác dụng.

## PAGE-006 — Chương trình đào tạo

- **Mục tiêu:** hiểu học phần/tín chỉ theo chương trình và học kỳ, tìm môn.
- **Hierarchy/layout:** chương trình/context → search/filter có sẵn → nhóm học kỳ → bảng học phần; ưu tiên quét hàng/cột.
- **Components/data:** AcademicPageTitle, AcademicTable, disclosure phù hợp; mã/tên/tín chỉ/điều kiện theo source, nhóm có tổng không thay dữ liệu chi tiết.
- **Navigation/responsive:** search query khớp shell, link chi tiết theo id; bảng scroll riêng, tên môn wrap.
- **Điều tránh/kiểm tra:** không biến toàn bộ học phần thành card to, không nhầm danh mục với đăng ký; query không có kết quả có reset phù hợp.

## PAGE-007 — Chi tiết học phần

- **Mục tiêu:** đọc nội dung môn, tín chỉ và cách đánh giá hiện có.
- **Hierarchy/layout:** tên/mã → thông tin chính → nội dung/điều kiện → công thức đánh giá; nội dung dài giới hạn prose-max.
- **Components/data:** heading, definition list, table khi có thành phần đánh giá; giữ đơn vị/tỷ trọng theo dữ liệu.
- **Navigation/responsive:** về danh mục có context; một cột trên hẹp; không route giả khi id không tìm thấy.
- **Điều tránh/kiểm tra:** không thêm nút đăng ký nếu trang không có luồng đó; nguồn thiếu thể hiện missing/error rõ, không invent đề cương.

## PAGE-008 — Kết quả toàn khóa

- **Mục tiêu:** đọc tổng quan kết quả và so sánh học kỳ.
- **Hierarchy/layout:** context học tập → tổng hợp vừa đủ → bảng học kỳ/học phần → thông tin phụ. Chart chỉ bổ trợ dữ liệu đã có.
- **Components/data:** AcademicTabs là route navigation, metrics, AcademicTable, AcademicV2Summary; GPA kèm hệ/thang, thiếu điểm khác 0.
- **Navigation/responsive:** đi các màn current/standing/PLO bằng URL; bảng cuộn, không cắt cột điểm.
- **Điều tránh/kiểm tra:** không làm đỏ mọi điểm thấp theo ngưỡng tự đặt; không đưa chart/kết quả lên dashboard chính.

## PAGE-009 — Điểm học kỳ hiện tại

- **Mục tiêu:** tra kết quả từng môn và trạng thái công bố của kỳ.
- **Hierarchy/layout:** học kỳ → bảng điểm → chú thích công thức/trạng thái; table chiếm vùng chính.
- **Components/data:** AcademicTabs, Table, badge/text status; cột số căn phải, heading cột rõ.
- **Navigation/responsive:** giữ kỳ/query có sẵn, route tabs dùng link; bảng cuộn ngang giữ tên môn.
- **Điều tránh/kiểm tra:** không coi điểm chưa công bố là trượt/0; không giấu thành phần đánh giá chỉ để vừa mobile.

## PAGE-010 — Học vụ

- **Mục tiêu:** hiểu tình trạng học vụ theo dữ liệu và thông tin cần chú ý.
- **Hierarchy/layout:** tình trạng hiện tại → chi tiết/điều kiện hiển thị → dữ liệu giải thích; cảnh báo có text và nguồn.
- **Components/data:** status/badge, summary và bảng phù hợp source, không dashboard KPI mới.
- **Navigation/responsive:** cùng nhóm route kết quả, một cột khi hẹp.
- **Điều tránh/kiểm tra:** UI không tự suy ra quyết định cảnh báo/buộc thôi học hay ngưỡng pháp quy; chỉ trình bày dữ liệu được cung cấp.

## PAGE-011 — PLO

- **Mục tiêu:** xem chuẩn đầu ra và tính thử theo trọng số trong công cụ hiện có.
- **Hierarchy/layout:** giải thích tính thử → dữ liệu PLO → input trọng số/điểm → kết quả tính; tách kết quả thử khỏi chính thức.
- **Components/data:** table + native number fields, labels theo dòng, status result; không thêm chart bắt buộc.
- **Navigation/responsive:** link trong nhóm kết quả; form/bảng có vùng scroll, lỗi cạnh field.
- **Điều tránh/kiểm tra:** không ghi tính thử là điểm được duyệt; validation theo logic có sẵn, kết quả giữ đơn vị và precision.

## PAGE-012 — Lịch học & lịch thi

- **Mục tiêu:** biết lớp, ngày/giờ, phòng và thông tin thi cần đến.
- **Hierarchy/layout:** context kỳ/tuần có sẵn → lịch/bảng lớp → chi tiết và tác vụ liên quan. Ngày/giờ/phòng luôn thấy.
- **Components/data:** ScheduleTable, list agenda, status task; phân biệt học và thi bằng nhãn ngoài màu.
- **Navigation/responsive:** desktop bảng/lịch đủ cột, mobile agenda tương đương; chi tiết không phụ thuộc hover.
- **Điều tránh/kiểm tra:** không dùng calendar tháng tí hon thay lịch học thực; không thêm điểm danh hoặc drag-drop sự kiện. Tác vụ chưa có dữ liệu phải phản hồi trung thực.

## PAGE-013 — Đồ án và thông tin đề tài

- **Mục tiêu:** biết trạng thái đồ án kỳ này, nhập/xem thông tin đề tài khi được phép.
- **Hierarchy/layout:** kỳ/trạng thái đủ điều kiện → action hiện có → form đề tài nhóm theo ý nghĩa; hướng dẫn nằm cạnh hoặc sau form.
- **Components/data:** Empty/Status cho “không làm đồ án kỳ này”; form có label, nội dung đề tài textarea, nháp được mô tả đúng.
- **Navigation/responsive:** overview và details có URL riêng; form một cột khi hẹp, không modal nhiều bước.
- **Điều tránh/kiểm tra:** không gọi lưu local là nộp chính thức; giữ bản nháp theo học kỳ đúng logic, validation không mất text dài.

## PAGE-014 — Đăng ký học phần

- **Mục tiêu:** chọn học phần mở và kiểm tra danh sách/tổng tín chỉ đã đăng ký.
- **Hierarchy/layout:** danh sách mở → trạng thái chọn → danh sách đã đăng ký/tổng; action gắn đúng hàng/môn.
- **Components/data:** RegistrationCourseList, Button, status/error; dữ liệu dùng service/hook hiện có, không copy catalog khác.
- **Navigation/responsive:** link chi tiết môn hợp lệ; vùng phụ stack sau vùng chính; giữ tổng và feedback rõ.
- **Điều tránh/kiểm tra:** không báo hoàn tất trước response; pending khóa lặp, lỗi giữ lựa chọn; không thêm ưu tiên/xếp lớp mới bằng UI.

## PAGE-015 — Học phí

- **Mục tiêu:** đọc khoản phải nộp, theo học phần, đợt thu và lịch sử giao dịch/hóa đơn.
- **Hierarchy/layout:** kỳ → tổng/khoản đến hạn trong chính module → bảng chi tiết → lịch sử; không giấu tổng tiền trong tooltip.
- **Components/data:** TuitionTable/PaymentHistory, SectionNav, Dialog chi tiết; số tiền căn phải, đơn vị nhất quán.
- **Navigation/responsive:** giữ query view và context lọc hiện có; V1 chuyển mục hiển thị, V2 giữ các section và cuộn tới section theo query view; không gán role tab chỉ vì hình thức giống tab; bảng scroll riêng.
- **Điều tránh/kiểm tra:** không hứa thanh toán thật nếu demo; không làm tròn mất ý nghĩa, không đưa tiền/GPA lên dashboard chính; lỗi tra hóa đơn khác “chưa có giao dịch”.

## PAGE-016 — Rèn luyện: tự đánh giá và đánh giá lớp

- **Mục tiêu:** đọc tiêu chí, nhập điểm/minh chứng, lưu/gửi theo hành vi hiện có; cán bộ lớp xử lý đúng sinh viên.
- **Hierarchy/layout:** kỳ/hạn/tình trạng → nhóm tiêu chí → tổng → action. Trang lớp có danh sách sinh viên và phiếu hiện tại, hai vùng khi đủ rộng.
- **Components/data:** Disclosure, bảng tiêu chí, input điểm/ghi chú/file, status; nhãn field chứa mã tiêu chí/đối tượng để không lẫn.
- **Navigation/responsive:** giữ điểm khi đổi nhóm/sinh viên theo contract; mobile danh sách chọn trước phiếu, bảng scroll; hạn và tổng ở ngoài disclosure.
- **Điều tránh/kiểm tra:** không giấu lỗi trong nhóm đóng; không hiển thị nút có quyền mới; lưu/gửi mẫu không đồng nghĩa đã nhận bởi trường; bản in cần đủ tiêu chí.

## PAGE-017 — Hoạt động, chi tiết và kết quả cộng đồng

- **Mục tiêu:** tìm hoạt động, đọc điều kiện, đăng ký theo luồng hiện có, xem kết quả được ghi nhận.
- **Hierarchy/layout:** danh sách có filter hiện hữu → item tiêu đề/ngày/địa điểm → trang chi tiết và hành động; kết quả là bảng/list riêng.
- **Components/data:** card MAY cho hoạt động có ảnh, form/select, status, table kết quả; ngày, số giờ/điểm theo nguồn.
- **Navigation/responsive:** detail có id/URL, Back giữ context khi có; cards stack, chi tiết prose-max, bảng kết quả scroll.
- **Điều tránh/kiểm tra:** đăng ký không tự thành “đã hoàn thành”; chưa có kết quả là empty state; không bịa số lượng tham gia, lịch sử hay chứng nhận.

## PAGE-018 — Dịch vụ sinh viên

- **Mục tiêu:** lập đơn, theo dõi đơn và báo hỏng thiết bị.
- **Hierarchy/layout:** các mục hiện có → form chính + hướng dẫn → danh sách trạng thái; báo thiết bị có ngữ cảnh phòng/thiết bị rõ.
- **Components/data:** SectionNav, native form/select/file, table, inline feedback. Giữ trường/hồ sơ theo source, không tự quy định nghiệp vụ hồ sơ mới.
- **Navigation/responsive:** giữ query view; V1 chuyển mục hiển thị, V2 cuộn tới section tương ứng; đổi mục không làm mất nháp/file ngoài ý muốn; cột hướng dẫn xuống dưới form khi hẹp.
- **Điều tránh/kiểm tra:** bản mẫu/local không là biên nhận chính thức; không xóa dữ liệu nhập khi lỗi; action hủy theo hợp đồng thật, xác nhận nếu mất dữ liệu khó phục hồi.

## PAGE-019 — Thông báo

- **Mục tiêu:** đọc thông tin nhà trường và đi đến nội dung liên quan.
- **Hierarchy/layout:** page title → danh sách theo thứ tự dữ liệu → nội dung/tóm tắt rõ; source/ngày/hạn không trộn vào một đoạn mơ hồ.
- **Components/data:** notification list, heading, time, Loading/Error/Empty. Không thêm unread/filter/bulk action nếu nguồn không có.
- **Navigation/responsive:** trang đầy đủ có URL; drawer chỉ xem nhanh, liên kết xem tất cả; một cột trên hẹp.
- **Điều tránh/kiểm tra:** không toast thay lịch sử thông báo; link tài liệu chỉ tồn tại khi có tệp/URL thật.

## PAGE-020 — Tổng quan quản trị

- **Mục tiêu:** đọc thống kê và danh sách phân hệ đang có của admin.
- **Hierarchy/layout:** heading → metrics nguồn mock/service → danh sách module; thông tin quản trị không lẫn dashboard sinh viên.
- **Components/data:** StatCard/Card/list hiện có; không chuyển tên module tĩnh thành link CRUD giả.
- **Navigation/responsive:** role admin, shell tiện ích đúng quyền; metrics stack/wrap trên hẹp.
- **Điều tránh/kiểm tra:** không tự tạo CRUD sinh viên/lớp/phân quyền; test user student không mở được trang admin và admin không bị dẫn đến student-only page.

## PAGE-021 — Không tìm thấy và đối tượng không tồn tại

Category: Recovery. Priority: MUST. Mục tiêu/rationale: có đường tiếp tục khi URL/id sai. Hierarchy/layout: thông điệp cụ thể → hành động về trang phù hợp role/edition; một cột gọn. Components/data: heading, text, Link, không số liệu mẫu. Navigation/responsive: Back hoặc về trang hợp lệ; link đủ target, không cần hero. Ngoại lệ: không dùng 404 thay lỗi quyền/mạng. Validation: URL sai và id không tồn tại không trắng trang/redirect vòng; giữ edition và accessible name.

## Mở rộng khi có module mới

Ghi route và quyền đã xác nhận → mục tiêu → dữ liệu/action có thật → chọn list/table/form/detail pattern → ánh xạ primitive → đủ state/responsive/a11y. Chỉ thêm token/component khi không có vai trò tương đương; không tạo module mới từ ảnh mẫu hoặc catalog skill.
