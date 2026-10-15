# Danh mục API DUT và ánh xạ với giao diện hiện tại

Nguồn: Postman Collection `C:\Users\Admin\Downloads\DUT_System` (đọc ngày 03/10/2026). Đối chiếu với các route trong `web/src/app/router/AppRoutes.tsx`, các service trong `web/src/features/*/services` và các màn hình `mobile/lib/screens`. Tài liệu này mô tả **những gì collection ghi nhận**; tên route chỉ cho biết mục đích dự kiến, chưa chứng minh API đang hoạt động hoặc cấu trúc dữ liệu trả về.

## Cách đọc và phạm vi

- `#UI_DATA`: endpoint **GET** nên khảo sát để lấy dữ liệu cho một màn hình đang có. Đây là tag ưu tiên tích hợp, không có nghĩa đã nối API thật.
- `#UI_ACTION`: endpoint ghi dữ liệu phục vụ thao tác đang có trên giao diện (đăng ký hoạt động, đăng ký/hủy học phần). Đặt riêng để không nhầm với API chỉ đọc.
- Không gắn tag: có trong collection nhưng chưa cần cho màn hình hiện tại, hoặc chỉ phục vụ quản trị/hệ thống phụ.
- `?`: tham số query xuất hiện trong ví dụ Postman; `{id}`: tham số trên đường dẫn. Giá trị mẫu như `STUDENT_ID`, `ACTIVITY_ID` phải thay bằng định danh thật.
- Các method `HTTPGET`, `HTTPPOST`, `HTTPPUT`, `HTTPPATCH`, `HTTPDELETE` trong collection được **chuẩn hóa để đọc** thành `GET`, `POST`, `PUT`, `PATCH`, `DELETE` trong tài liệu. Cần sửa method tương ứng trong Postman trước khi gửi request nếu công cụ không nhận dạng chúng.
- Danh mục đầy đủ ở cuối giữ cả những endpoint cùng đường dẫn nhưng thuộc host khác nhau. Mỗi nhóm ghi một lần mô tả chức năng và liệt kê **từng request** để có thể tra cứu hết collection.

| Hệ thống / biến host trong Postman | Số request | Phạm vi chính |
| --- | ---: | --- |
| `d_dut-main` — nhiều biến host theo tính năng | 40 | Mobile: thông báo, cộng đồng, lịch, học phí, hồ sơ, xếp hàng, SSO, chatbot |
| `course-registration-main` — `{{course_registration_main_baseUrl}}` | 247 | Chương trình, học phần, lớp học phần, đăng ký, sinh viên, điểm |
| `plo-clo-backend-main` — `{{plo_clo_backend_main_baseUrl}}` | 301 | CLO/PLO, kỳ thi, điểm, báo cáo, phúc khảo |
| `tkb-be-main` — `{{tkb_be_main_baseUrl}}` | 60 | Phòng, giảng viên, lập và quản lý lịch |
| `tuition-fee-main` — `{{tuition_fee_main_baseUrl}}` | 5 | Tổng hợp và chi tiết học phí |
| **Tổng** | **653** | 76 nhóm chức năng/controller |

Trong nhóm Mobile, host thay đổi theo tính năng: thông báo `{{notification_baseUrl}}`, chatbot `{{chatbot_baseUrl}}`, cộng đồng `{{community_baseUrl}}`, lịch `{{tkb_baseUrl}}`, học phí `{{tuition_baseUrl}}`, hồ sơ `{{profile_baseUrl}}`, xếp hàng `{{queue_baseUrl}}`, SSO `{{sso_baseUrl}}` và ký PDF `{{ca_dut_baseUrl}}`. Vì vậy, cùng một path ở hai nhóm không tự động là cùng một môi trường hoặc cùng quyền truy cập.

Collection không có response mẫu cho **653/653** request; chỉ **9** request có body mẫu. **613** request backend có mô tả chung kiểu “Protected API”, vì thế các diễn giải chi tiết bên dưới được suy ra từ tên endpoint. Các request backend này cũng đều được gắn header Bearer theo mẫu, kể cả route login; cần xác minh lại quy tắc xác thực với backend. Không đưa token hoặc API key mẫu của collection vào tài liệu/code phía client.

## API ưu tiên cho giao diện hiện tại

Các bảng dưới là ánh xạ đề xuất từ màn hình đang có sang endpoint. Những API ở nhiều hệ thống khác nhau cần kiểm tra token/SSO và schema thực tế trước khi kết hợp. Đường dẫn giữ nguyên chữ hoa, chữ thường và cả cách viết `tuation_fees` của nguồn.

### Đăng nhập, hồ sơ và trang chủ sinh viên

| Endpoint | Tag | Dữ liệu / cách dùng |
| --- | --- | --- |
| `POST {{sso_baseUrl}}/api/login` | — | Đăng nhập bằng `username`, `password` (body mẫu có trong collection); cần cho luồng đăng nhập, không phải API lấy dữ liệu. |
| `GET {{profile_baseUrl}}/api/profile` | `#UI_DATA` | Hồ sơ sinh viên cho dashboard web/mobile: tên, mã SV, lớp, ngành. Kiểm tra các trường GPA/trạng thái trước khi dùng. |
| `GET {{course_registration_main_baseUrl}}/api/Students/me` | `#UI_DATA` | Hồ sơ sinh viên từ hệ thống đăng ký; phương án đối chiếu/thay thế cho `/api/profile`, không mặc định gọi cả hai. |
| `GET {{plo_clo_backend_main_baseUrl}}/api/students/me/result-summary` | `#UI_DATA` | Ứng viên cho thẻ tổng quan kết quả học tập trên dashboard và trang Học vụ. Cần xem response để xác định GPA, tín chỉ, cảnh báo có thật hay không. |
| `GET {{plo_clo_backend_main_baseUrl}}/api/results/my-programme-completion` | `#UI_DATA` | Tiến độ hoàn thành chương trình; phù hợp phần tiến độ/chuẩn đầu ra trên dashboard. |
| `GET {{tkb_baseUrl}}/api/AcademicEvent/GetAcademicEventsForReminder` | `#UI_DATA` | Sự kiện học vụ nhắc việc trên trang chủ nếu giao diện dùng dữ liệu động. |

### Học phần, điểm, lịch và chuẩn đầu ra

| Endpoint | Tag | Dữ liệu / cách dùng |
| --- | --- | --- |
| `GET {{course_registration_main_baseUrl}}/api/Courses/{studentId}` | `#UI_DATA` | Học phần gắn với sinh viên; ứng viên cho khung chương trình. Chưa rõ có trả cả học phần chưa học hay không. |
| `GET {{course_registration_main_baseUrl}}/api/Courses` | `#UI_DATA` | Danh mục học phần để tra cứu; cần ghép với chương trình và tình trạng học của sinh viên. |
| `GET {{plo_clo_backend_main_baseUrl}}/api/programmes/{id}/courses` | `#UI_DATA` | Học phần trong một chương trình đào tạo; kiểm tra chương trình này có khớp khung học phần của sinh viên hay không. |
| `GET {{course_registration_main_baseUrl}}/api/CourseSections/me` | `#UI_DATA` | Các lớp học phần sinh viên đã đăng ký; ứng viên cho học phần hiện tại/chi tiết lớp. |
| `GET {{course_registration_main_baseUrl}}/api/StudentGrades/me` | `#UI_DATA` | Điểm của sinh viên; dùng cho bảng điểm và điểm học kỳ hiện tại sau khi kiểm tra trường học kỳ/thành phần điểm. |
| `GET {{course_registration_main_baseUrl}}/api/StudentGrades/currentSemesterCode` | `#UI_DATA` | Mã học kỳ đang hiển thị trên trang điểm hiện tại. |
| `GET {{plo_clo_backend_main_baseUrl}}/api/students/external/{studentCode}/scores` | `#UI_DATA` | Điểm theo mã sinh viên từ hệ thống CLO/PLO; nguồn bổ sung nếu bảng điểm cần thành phần mà `/StudentGrades/me` thiếu. |
| `GET {{plo_clo_backend_main_baseUrl}}/api/classes/external/{classCode}/grade-composition` | `#UI_DATA` | Công thức/tỷ trọng điểm của lớp học phần, phù hợp trang Điểm học kỳ hiện tại. |
| `GET {{tkb_baseUrl}}/api/Timetable/GetListSemesters` | `#UI_DATA` | Danh sách học kỳ cho bộ chọn lịch học. |
| `GET {{tkb_baseUrl}}/api/Timetable/GetListStudentTimetablesBySemester?semester=2240` | `#UI_DATA` | Lịch học của sinh viên theo học kỳ; dùng cho trang Lịch học. |
| `GET {{tkb_baseUrl}}/api/Timetable/GetListStudentTimetablesByDate?date=2026-09-25` | `#UI_DATA` | Lịch học theo ngày, phù hợp lịch ngày/trang chủ. |
| `GET {{plo_clo_backend_main_baseUrl}}/api/results/my-plo-scores` | `#UI_DATA` | Điểm PLO cá nhân; trang Chuẩn đầu ra. Chỉ hiển thị như kết quả chính thức khi backend xác nhận trạng thái công bố. |

### Đăng ký học phần, học phí và thông báo

| Endpoint | Tag | Dữ liệu / cách dùng |
| --- | --- | --- |
| `GET {{course_registration_main_baseUrl}}/api/RegistrationPhase/current-semester` | `#UI_DATA` | Đợt đăng ký hiện tại; xác định có thể mở nút đăng ký hay không. |
| `GET {{course_registration_main_baseUrl}}/api/CourseSections/available` | `#UI_DATA` | Các lớp học phần có thể đăng ký. |
| `GET {{course_registration_main_baseUrl}}/api/CourseSections/me` | `#UI_DATA` | Danh sách đã đăng ký và số tín chỉ đang học. |
| `GET {{course_registration_main_baseUrl}}/api/CourseSections/me/pending` | `#UI_DATA` | Đăng ký đang chờ xử lý, nếu UI cần trạng thái chờ. |
| `POST {{course_registration_main_baseUrl}}/api/CourseSections/register` | `#UI_ACTION` | Ghi đăng ký; collection không có body mẫu nên cần xác nhận payload. |
| `POST {{course_registration_main_baseUrl}}/api/CourseSections/unregister` | `#UI_ACTION` | Hủy đăng ký; cần xác nhận payload và điều kiện được hủy. |
| `GET {{tuition_fee_main_baseUrl}}/api/tuation_fees` | `#UI_DATA` | Tổng học phí. |
| `GET {{tuition_fee_main_baseUrl}}/api/tuation_fees/pending` | `#UI_DATA` | Các khoản chưa thanh toán. |
| `GET {{tuition_fee_main_baseUrl}}/api/tuation_fees/paid` | `#UI_DATA` | Lịch sử đã thanh toán. |
| `GET {{tuition_fee_main_baseUrl}}/api/tuation_fees/by-subject` | `#UI_DATA` | Chi tiết học phí theo học phần. Bốn đường dẫn này cũng có trong nhóm Mobile qua `{{tuition_baseUrl}}`; chọn host theo môi trường triển khai. |
| `GET {{notification_baseUrl}}/api/notifications?limit=20` | `#UI_DATA` | Thông báo cá nhân, cần Bearer token. |
| `GET {{notification_baseUrl}}/api/notifications/general?limit=20` | `#UI_DATA` | Thông báo chung/công khai; có thể dùng ở trang thông báo và trang công khai nếu nội dung phù hợp. |

### Hoạt động cộng đồng

| Endpoint | Tag | Dữ liệu / cách dùng |
| --- | --- | --- |
| `GET {{community_baseUrl}}/api/activities` | `#UI_DATA` | Danh sách và chi tiết hoạt động; collection chưa có route lấy chi tiết bằng ID, cần kiểm tra liệu danh sách đủ trường cho trang chi tiết. |
| `GET {{community_baseUrl}}/api/categories` | `#UI_DATA` | Danh mục hoạt động cho bộ lọc. |
| `GET {{community_baseUrl}}/api/academic-year-activities` | `#UI_DATA` | Hoạt động theo năm học. |
| `GET {{community_baseUrl}}/api/users/me/info` | `#UI_DATA` | Hồ sơ cộng đồng của sinh viên. |
| `GET {{community_baseUrl}}/api/my-activities` | `#UI_DATA` | Hoạt động đã đăng ký và trạng thái tham gia. |
| `GET {{community_baseUrl}}/api/proofs/me` | `#UI_DATA` | Minh chứng của sinh viên; ứng viên cho kết quả hoạt động. |
| `POST {{community_baseUrl}}/api/activities/ACTIVITY_ID/register` | `#UI_ACTION` | Đăng ký hoạt động từ giao diện. |

## Những chỗ chưa đủ API để thay mock

| Khu vực giao diện | Tình trạng trong collection |
| --- | --- |
| Lịch thi cá nhân | Có API kỳ thi, ca thi và lớp thi trong `plo-clo-backend-main`, nhưng không thấy endpoint được mô tả rõ là **lịch thi của sinh viên hiện tại**. Cần xác nhận cách lọc theo sinh viên và dữ liệu giờ/phòng thi. |
| Điểm rèn luyện / tự đánh giá / lớp đánh giá | Không thấy API chuyên biệt cho phiếu rèn luyện. Điểm rèn luyện trong UI hiện là dữ liệu mẫu hoặc lưu localStorage. |
| Đề nghị trường và báo hỏng thiết bị | Không thấy endpoint tương ứng. Màn hình đang dùng dữ liệu tĩnh/local state. |
| Đồ án/khóa luận tốt nghiệp | Không thấy API riêng cho phân công, hướng dẫn, tiến độ. Có thể chỉ suy ra học phần đồ án từ lớp học phần, chưa đủ cho trang chi tiết. |
| Dashboard quản trị tổng hợp | `tkb-be-main` có `GET /api/Dashboard/stats` nhưng chỉ thuộc phân hệ thời khóa biểu, không đại diện chắc chắn cho bốn số liệu sinh viên/học phần/lớp/thông báo của trang quản trị hiện tại. |
| Trang công khai | Collection có thông báo chung, nhưng chưa có API rõ ràng cho toàn bộ nội dung tin tức, lịch đào tạo và dịch vụ trên trang. |

## Kiểm tra trước khi nối API thật

1. Chốt host nào dùng cho từng tính năng và token nào được từng hệ thống chấp nhận. Các endpoint `/api/profile`, `/api/Students/me` và `/api/students/me/result-summary` thuộc ba nguồn khác nhau.
2. Lấy response thật hoặc OpenAPI từ backend cho các route gắn `#UI_DATA`; xác nhận trường dữ liệu, kiểu ngày/giờ, phân trang, mã học kỳ, trạng thái công bố điểm và lỗi 401/403/404.
3. Kiểm tra quyền của các route `/api/admin/...` trước khi dùng trong trang sinh viên; không suy luận quyền chỉ từ header trong collection.
4. Với thao tác `#UI_ACTION`, xin schema request và quy tắc nghiệp vụ trước khi thay logic mock/localStorage.

## Danh mục đầy đủ theo hệ thống

Trong danh mục dưới đây, dấu `#UI_DATA`/`#UI_ACTION` cạnh route dẫn trở lại các bảng ưu tiên. Mô tả đầu mỗi nhóm diễn giải phạm vi; từng dòng bên dưới là một request trong collection, giữ đúng đường dẫn và query mẫu. Host được lược bỏ; đối chiếu bảng hệ thống và danh sách biến host ở trên.

### d_dut-main (Mobile)

#### Notification Service (Dev & Prod) (6 API)

Gửi và đọc thông báo chung/cá nhân, đăng ký thiết bị nhận push, theo dõi hàng đợi gửi.

- `POST /api/notifications/register-token`
- `GET /api/notifications/general?limit=20` `#UI_DATA`
- `GET /api/notifications?limit=20` `#UI_DATA`
- `POST /api/notifications/send-notification`
- `GET /api/notifications/queue/remain-turn?userId=STUDENT_ID`
- `POST /api/notifications/send-multi-notifications`

#### AI Chatbot Service (5 API)

Tạo cuộc hội thoại, gửi câu hỏi, xem lịch sử và xóa cuộc hội thoại AI.

- `POST /api/conversations`
- `POST /ai/chat`
- `GET /api/conversations`
- `GET /api/conversations/CONVERSATION_ID`
- `DELETE /api/conversations/CONVERSATION_ID`

#### Community & Youth Activities (Đoàn Thanh Niên) (9 API)

Tra cứu hoạt động, danh mục, hồ sơ cộng đồng; đăng ký, hủy và nộp minh chứng.

- `GET /api/activities` `#UI_DATA`
- `GET /api/categories` `#UI_DATA`
- `GET /api/academic-year-activities` `#UI_DATA`
- `GET /api/users/me/info` `#UI_DATA`
- `POST /api/activities/ACTIVITY_ID/register` `#UI_ACTION`
- `GET /api/my-activities` `#UI_DATA`
- `POST /api/activities/ACTIVITY_ID/cancel`
- `POST /api/proofs/REGISTRATION_ID/submit`
- `GET /api/proofs/me` `#UI_DATA`

#### Timetable & Schedule (TKB System) (8 API)

Tra cứu học kỳ, lịch theo học kỳ/ngày, sự kiện nhắc việc, thông tin học phần và điểm danh.

- `GET /api/Timetable/GetListSemesters` `#UI_DATA`
- `GET /api/Timetable/GetListStudentTimetablesBySemester?semester=2240` `#UI_DATA`
- `GET /api/Timetable/GetListStudentTimetablesByDate?date=2026-09-25` `#UI_DATA`
- `GET /api/Timetable/GetListTeacherTimetablesBySemester?semester=2240`
- `GET /api/AcademicEvent/GetAcademicEventsForReminder` `#UI_DATA`
- `GET /api/UOS/GetStudentUosDetail?idUos=UOS_ID`
- `POST /api/Absence/TakeAttendance`
- `GET /api/ExportExcel/ExportAttendanceSummary?idUos=UOS_ID`

#### Tuition Fees (Học Phí) (4 API)

Tổng học phí, khoản còn nợ, lịch sử đã nộp và chi tiết theo học phần.

- `GET /api/tuation_fees` `#UI_DATA`
- `GET /api/tuation_fees/pending` `#UI_DATA`
- `GET /api/tuation_fees/paid` `#UI_DATA`
- `GET /api/tuation_fees/by-subject` `#UI_DATA`

#### Profile & Homeroom (Thông tin cá nhân & Lớp SH) (3 API)

Hồ sơ sinh viên/giảng viên và danh sách sinh viên lớp chủ nhiệm.

- `GET /api/profile` `#UI_DATA`
- `GET /api/profile/lecturer`
- `GET /api/students`

#### Queue Management (Xếp hàng) (2 API)

Quầy xếp hàng và vé của người dùng trong ngày.

- `GET /api/Ticket/GetAllQueueTicket`
- `GET /api/Ticket/TrackingMyTicketsToday`

#### SSO Authentication & Digital Signature (3 API)

Đăng nhập SSO, tra cứu hồ sơ Microsoft và ký PDF.

- `POST /api/login`
- `GET /api/microsoft/me`
- `POST /signature/sign-pdf`


### course-registration-main

#### AccountController (17 API)

Tài khoản, hồ sơ và thao tác quản trị tài khoản.

- `GET /api/admin/accounts`
- `POST /api/admin/accounts/{userId}/reset-password`
- `POST /api/admin/accounts/viewers`
- `GET /api/admin/accounts/viewers/{id}`
- `PUT /api/admin/accounts/viewers/{id}`
- `POST /api/admin/accounts/change-password`
- `POST /api/admin/accounts/lecturers/reset-password-all`
- `POST /api/admin/accounts/academic-affairs`
- `GET /api/admin/accounts/academic-affairs/{id}`
- `PUT /api/admin/accounts/academic-affairs/{id}`
- `GET /api/Account/profile`
- `POST /api/Account/login`
- `POST /api/Account/change-password`
- `POST /api/Account/set-password`
- `POST /api/Account/admin/reset-pass/{userId}`
- `GET /api/Account/temp-setup-lecturer-passwords`
- `POST /api/Account/logout`

#### AdminActionLogsController (1 API)

Nhật ký thao tác quản trị.

- `GET /api/admin/adminactionlogs`

#### AlternativeCoursesController (2 API)

Học phần thay thế và xóa hàng loạt.

- `GET /api/admin/alternative-courses`
- `POST /api/admin/alternative-courses/bulk-delete`

#### AuthController (6 API)

Đăng nhập/đăng xuất quản trị và Microsoft OAuth.

- `POST /api/admin/Auth/login`
- `GET /api/admin/Auth/microsoft/login`
- `GET /api/admin/Auth/microsoft/callback`
- `GET /api/admin/Auth/microsoft/logout`
- `POST /api/admin/Auth/logout`
- `GET /api/admin/Auth/profile`

#### CacheController (1 API)

Làm mới hoặc xử lý bộ nhớ đệm.

- `POST /api/admin/cache/clear-all`

#### ClassesController (8 API)

Lớp sinh hoạt và danh sách sinh viên.

- `GET /api/admin/classes`
- `GET /api/admin/classes/{classId}/students`
- `GET /api/Classes`
- `GET /api/Classes/{id}`
- `POST /api/Classes`
- `POST /api/Classes/upload`
- `PUT /api/Classes/{id}`
- `DELETE /api/Classes/{id}`

#### ClassRoomsController (11 API)

Phòng học và dữ liệu liên quan.

- `GET /api/admin/classrooms`
- `GET /api/admin/classrooms/all`
- `GET /api/admin/classrooms/buildings`
- `GET /api/admin/classrooms/room-types`
- `GET /api/admin/classrooms/{id}`
- `POST /api/admin/classrooms`
- `POST /api/admin/classrooms/bulk`
- `PUT /api/admin/classrooms/{id}`
- `DELETE /api/admin/classrooms/{id}`
- `GET /api/admin/classrooms/export-template`
- `POST /api/admin/classrooms/import`

#### CourseRegistrationDemandsController (3 API)

Thống kê nhu cầu đăng ký phía quản trị.

- `GET /api/admin/course-registration-demands`
- `GET /api/admin/course-registration-demands/courses/{courseId}/students`
- `GET /api/admin/course-registration-demands/export`

#### CoursesController (16 API)

Danh mục học phần, học phần thay thế, chi tiết và nhập dữ liệu.

- `GET /api/admin/courses`
- `GET /api/admin/courses/all`
- `GET /api/admin/courses/{id}`
- `POST /api/admin/courses`
- `PUT /api/admin/courses/{id}`
- `DELETE /api/admin/courses/{id}`
- `GET /api/admin/courses/import-template`
- `POST /api/admin/courses/upload`
- `GET /api/Courses` `#UI_DATA`
- `GET /api/Courses/alternative-courses`
- `GET /api/Courses/{studentId}` `#UI_DATA`
- `GET /api/Courses/{studentId}/alternative-courses`
- `POST /api/Courses`
- `POST /api/Courses/upload`
- `PUT /api/Courses/{id}`
- `DELETE /api/Courses/{id}`

#### CourseSectionsController (52 API)

Lớp học phần, sinh viên trong lớp, trạng thái đăng ký, ghép/chuyển lớp và xuất dữ liệu.

- `GET /api/admin/course-sections`
- `GET /api/admin/course-sections/{id}`
- `PUT /api/admin/course-sections/{id}`
- `GET /api/admin/course-sections/{id}/students`
- `POST /api/admin/course-sections`
- `POST /api/admin/course-sections/{courseSectionId}/students/{studentId}`
- `GET /api/admin/course-sections/{id}/merge-options`
- `POST /api/admin/course-sections/{id}/merge/{desCourseSectionId}`
- `DELETE /api/admin/course-sections/{courseSectionId}/students/{studentId}`
- `POST /api/admin/course-sections/{id}/students/bulk`
- `GET /api/admin/course-sections/students/{studentId}/registered`
- `GET /api/admin/course-sections/{id}/students/export`
- `PATCH /api/admin/course-sections/quick-update-flags`
- `GET /api/admin/course-sections/export`
- `GET /api/admin/course-sections/registrations/export`
- `POST /api/admin/course-sections/students/move`
- `GET /api/admin/course-sections/students/{studentId}/schedule-conflict/{courseSectionId}`
- `GET /api/admin/course-sections/import-template`
- `POST /api/admin/course-sections/upload`
- `POST /api/admin/course-sections/transfer/check-conflicts`
- `GET /api/admin/course-sections/classes/{classId}/schedule-conflicts`
- `GET /api/admin/course-sections/integrated-requirements`
- `PATCH /api/admin/course-sections/quick-update-reserved`
- `GET /api/admin/course-sections/enrollment-years`
- `GET /api/admin/course-sections/group-codes`
- `GET /api/admin/course-sections/buildings`
- `GET /api/admin/course-sections/lecturers`
- `POST /api/admin/course-sections/remove-students-from-zero-capacity`
- `GET /api/admin/course-sections/{id}/registration-history/export`
- `GET /api/admin/course-sections/registrations/export-sql`
- `GET /api/admin/course-sections/registrations/export-student-summary`
- `GET /api/admin/course-sections/students/bulk-register/import-template`
- `POST /api/admin/course-sections/students/bulk-register/upload`
- `GET /api/CourseSections`
- `GET /api/CourseSections/available` `#UI_DATA`
- `GET /api/CourseSections/viewer/available/{studentId}`
- `GET /api/CourseSections/viewer/section-students/{courseSectionId}`
- `GET /api/CourseSections/me` `#UI_DATA`
- `GET /api/CourseSections/me/pending` `#UI_DATA`
- `GET /api/CourseSections/me/full`
- `GET /api/CourseSections/viewer/full/{studentId}`
- `POST /api/CourseSections/register` `#UI_ACTION`
- `POST /api/CourseSections/register-multiple`
- `POST /api/CourseSections/unregister` `#UI_ACTION`
- `POST /api/CourseSections/unregister-multiple`
- `POST /api/CourseSections/reserve`
- `POST /api/CourseSections/unreserve`
- `GET /api/CourseSections/{id}`
- `POST /api/CourseSections`
- `POST /api/CourseSections/upload`
- `PUT /api/CourseSections/{id}`
- `DELETE /api/CourseSections/{id}`

#### FacultiesController (11 API)

Khoa/đơn vị đào tạo.

- `GET /api/admin/faculties`
- `POST /api/admin/faculties/upload`
- `GET /api/admin/faculties/{id}`
- `PUT /api/admin/faculties/{id}`
- `DELETE /api/admin/faculties/{id}`
- `GET /api/Faculties`
- `GET /api/Faculties/{id}`
- `POST /api/Faculties`
- `POST /api/Faculties/upload`
- `PUT /api/Faculties/{id}`
- `DELETE /api/Faculties/{id}`

#### MajorsController (8 API)

Ngành học.

- `GET /api/admin/majors`
- `GET /api/admin/majors/all`
- `GET /api/Majors`
- `GET /api/Majors/{id}`
- `POST /api/Majors`
- `POST /api/Majors/upload`
- `PUT /api/Majors/{id}`
- `DELETE /api/Majors/{id}`

#### ProgramsController (15 API)

Chương trình đào tạo, học phần, điều kiện và học phần thay thế.

- `GET /api/admin/programs/{id}/courses`
- `POST /api/admin/programs/{id}/sync-courses`
- `GET /api/admin/programs/bulk-alternative-courses/preview`
- `POST /api/admin/programs/bulk-alternative-courses/apply`
- `GET /api/admin/programs/{programId}/courses/{courseId}/alternative`
- `POST /api/admin/programs/{programId}/courses/{courseId}/alternative`
- `PUT /api/admin/programs/{programId}/alternative-courses/{alternativeId:int}`
- `DELETE /api/admin/programs/{programId}/alternative-courses/{alternativeId:int}`
- `POST /api/admin/programs/{programId}/courses`
- `POST /api/admin/programs/{programId}/courses/{courseId}/requirements`
- `PUT /api/admin/programs/{programId}/requirements/{requirementId:int}`
- `DELETE /api/admin/programs/{programId}/requirements/{requirementId:int}`
- `GET /api/admin/programs`
- `GET /api/admin/programs/{id}`
- `GET /api/admin/programs/{programId}/alternative-courses`

#### RegistrationPhasesController (5 API)

Tạo/sửa/xóa các đợt đăng ký phía quản trị.

- `GET /api/admin/registration-phases`
- `GET /api/admin/registration-phases/{id}`
- `POST /api/admin/registration-phases`
- `PUT /api/admin/registration-phases/{id}`
- `DELETE /api/admin/registration-phases/{id}`

#### ReserveManagementController (4 API)

Quản lý chỗ dành trước.

- `GET /api/admin/reserve-management`
- `POST /api/admin/reserve-management/approve`
- `POST /api/admin/reserve-management/reject`
- `POST /api/admin/reserve-management/reject-all`

#### SemestersController (11 API)

Học kỳ, học kỳ hiện tại và nhập dữ liệu.

- `GET /api/admin/semesters`
- `GET /api/admin/semesters/all`
- `GET /api/admin/semesters/current`
- `POST /api/admin/semesters`
- `PUT /api/admin/semesters/set-current/{id}`
- `GET /api/Semesters`
- `GET /api/Semesters/{id}`
- `POST /api/Semesters`
- `POST /api/Semesters/upload`
- `PUT /api/Semesters/{id}`
- `DELETE /api/Semesters/{id}`

#### StudentsController (21 API)

Danh sách/hồ sơ sinh viên, điểm, lịch sử, khóa tài khoản và xuất dữ liệu.

- `GET /api/admin/students`
- `GET /api/admin/students/{studentId}`
- `PUT /api/admin/students/{studentId}`
- `GET /api/admin/students/{studentId}/grades`
- `GET /api/admin/students/{studentId}/history`
- `POST /api/admin/students/{studentId}/reset-password`
- `GET /api/admin/students/unlock-website/template`
- `POST /api/admin/students/unlock-website/import`
- `GET /api/admin/students/export-no-password`
- `PUT /api/admin/students/{studentId}/academic-program`
- `GET /api/admin/students/locked-website/export`
- `POST /api/admin/students/sync-lock-web`
- `GET /api/admin/students/export-all`
- `GET /api/Students`
- `GET /api/Students/me` `#UI_DATA`
- `POST /api/Students`
- `POST /api/Students/upload`
- `PUT /api/Students/{id}`
- `DELETE /api/Students/{id}`
- `GET /api/Students/{studentId}`
- `GET /api/Students/paging`

#### TrackingController (5 API)

Theo dõi đăng ký, log và thống kê.

- `GET /api/admin/tracking`
- `GET /api/admin/tracking/registration-requests/statistics`
- `GET /api/admin/tracking/registration-requests/logs`
- `GET /api/admin/tracking/registration-requests/group-statistics`
- `GET /api/admin/tracking/student-registration-ratio`

#### CourseRegistrationDemandController (8 API)

Nhu cầu đăng ký của sinh viên và xác nhận.

- `GET /api/CourseRegistrationDemand/me/status`
- `GET /api/CourseRegistrationDemand/me`
- `GET /api/CourseRegistrationDemand/me/course-summary`
- `POST /api/CourseRegistrationDemand/me`
- `PUT /api/CourseRegistrationDemand/me/{id}/schedule`
- `DELETE /api/CourseRegistrationDemand/me/{id}`
- `PUT /api/CourseRegistrationDemand/{id}/confirmation`
- `PUT /api/CourseRegistrationDemand/me/confirmations`

#### LecturersController (6 API)

Danh sách và quản lý giảng viên.

- `GET /api/Lecturers`
- `GET /api/Lecturers/{id}`
- `POST /api/Lecturers`
- `POST /api/Lecturers/upload`
- `PUT /api/Lecturers/{id}`
- `DELETE /api/Lecturers/{id}`

#### LogsController (3 API)

Nhật ký hệ thống.

- `GET /api/Logs`
- `GET /api/Logs/viewer/{studentId}`
- `POST /api/Logs`

#### MicrosoftController (5 API)

Tích hợp Microsoft OAuth.

- `GET /api/microsoft/signin`
- `GET /api/microsoft/callback`
- `POST /api/microsoft/course-registration-token`
- `GET /api/microsoft/logout`
- `GET /api/microsoft/logout-confirm`

#### AcademicProgramsController (10 API)

Danh mục chương trình đào tạo và nhập học phần/điều kiện.

- `GET /api/AcademicPrograms`
- `GET /api/AcademicPrograms/{id}`
- `GET /api/AcademicPrograms/paged`
- `POST /api/AcademicPrograms`
- `POST /api/AcademicPrograms/upload`
- `POST /api/AcademicPrograms/courses/upload`
- `POST /api/AcademicPrograms/courses/requirement/upload`
- `PUT /api/AcademicPrograms/{id}`
- `DELETE /api/AcademicPrograms/{id}`
- `POST /api/AcademicPrograms/alternative/upload`

#### RegistrationPhaseController (4 API)

Đợt đăng ký của học kỳ hiện tại.

- `GET /api/RegistrationPhase/current-semester` `#UI_DATA`
- `POST /api/RegistrationPhase`
- `PUT /api/RegistrationPhase/{id}`
- `DELETE /api/RegistrationPhase/{id}`

#### SettingsController (5 API)

Cấu hình hệ thống đăng ký.

- `POST /api/Settings/yearCode`
- `GET /api/Settings/courseRegistrationPhase`
- `POST /api/Settings/courseRegistrationPhase`
- `GET /api/Settings/title`
- `GET /api/Settings/demand-notes`

#### StudentGradesController (7 API)

Điểm sinh viên và học kỳ hiện tại.

- `GET /api/StudentGrades/me` `#UI_DATA`
- `GET /api/StudentGrades/currentSemesterCode` `#UI_DATA`
- `GET /api/StudentGrades/{studentId}`
- `POST /api/StudentGrades`
- `POST /api/StudentGrades/upload`
- `PUT /api/StudentGrades/{id}`
- `DELETE /api/StudentGrades/{id}`

#### TestingCourseSectionsController (2 API)

Endpoint kiểm thử đăng ký lớp học phần.

- `POST /api/TestingCourseSections/simulate-group-registration`
- `POST /api/TestingCourseSections/bulk-register-test`


### plo-clo-backend-main

#### AccountController (14 API)

Tài khoản và quyền của hệ thống CLO/PLO.

- `GET /api/accounts`
- `GET /api/accounts/paged`
- `GET /api/accounts/{id}`
- `POST /api/accounts`
- `PUT /api/accounts/{id}`
- `POST /api/accounts/login`
- `DELETE /api/accounts/{id}`
- `PATCH /api/accounts/password`
- `PATCH /api/accounts/{id}/resetPassword`
- `POST /api/accounts/login/microsoft`
- `POST /api/accounts/session`
- `POST /api/accounts/refresh`
- `POST /api/accounts/logout`
- `GET /api/accounts/sessions`

#### ChildExamSessionController (9 API)

Ca thi con và danh sách sinh viên dự thi.

- `GET /api/child-exam-sessions`
- `GET /api/child-exam-sessions/{id}`
- `POST /api/child-exam-sessions`
- `PUT /api/child-exam-sessions/{id}`
- `DELETE /api/child-exam-sessions/{id}`
- `GET /api/child-exam-sessions/{id}/students`
- `GET /api/child-exam-sessions/{id}/unassigned-students`
- `POST /api/child-exam-sessions/{id}/students`
- `DELETE /api/child-exam-sessions/{id}/students`

#### ClassController (23 API)

Lớp học phần, danh sách sinh viên và cấu trúc điểm.

- `GET /api/classes`
- `GET /api/classes/paged`
- `GET /api/classes/ids`
- `GET /api/classes/groups`
- `GET /api/classes/enrollment-years`
- `GET /api/classes/{id}`
- `GET /api/classes/code/{code}/id`
- `POST /api/classes`
- `POST /api/classes/external`
- `PUT /api/classes/external/{classCode}/students`
- `PUT /api/classes/{id}`
- `DELETE /api/classes/{id}`
- `GET /api/classes/{id}/students`
- `POST /api/classes/{id}/students`
- `DELETE /api/classes/{id}/students`
- `PUT /api/classes/{id}/grade-composition`
- `GET /api/classes/external/{classCode}/grade-composition` `#UI_DATA`
- `GET /api/classes/external/{classCode}/scores`
- `PUT /api/classes/external/{classCode}/grade-composition`
- `POST /api/classes/{targetClassId}/copy-structure`
- `PATCH /api/classes/is-core`
- `PATCH /api/classes/set-core-old-classes`
- `POST /api/classes/{id}/create-initial-questions`

#### CLOController (6 API)

Chuẩn đầu ra học phần (CLO).

- `GET /api/clos`
- `GET /api/clos/{id}`
- `POST /api/clos`
- `PUT /api/clos/{id}`
- `PUT /api/clos/{id}/plos`
- `DELETE /api/clos/{id}`

#### CorrectedResultController (14 API)

Điểm điều chỉnh, đối chiếu và xác nhận.

- `GET /api/corrected-results`
- `GET /api/corrected-results/grouped`
- `GET /api/corrected-results/{id}`
- `GET /api/corrected-results/final-grade-comparison/{classId}`
- `GET /api/corrected-results/exam-score-comparison/{classId}`
- `GET /api/corrected-results/exam-score-comparison/child-exam-session/{childExamSessionId}`
- `POST /api/corrected-results`
- `PUT /api/corrected-results/{id}`
- `PUT /api/corrected-results/upsert`
- `PUT /api/corrected-results/bulk`
- `DELETE /api/corrected-results/{id}`
- `POST /api/corrected-results/confirm`
- `POST /api/corrected-results/{id}/accept`
- `POST /api/corrected-results/{id}/revert-accept`

#### CourseController (8 API)

Danh mục học phần của hệ thống CLO/PLO.

- `GET /api/courses`
- `GET /api/courses/paged`
- `GET /api/courses/{id}`
- `POST /api/courses`
- `POST /api/courses/external`
- `PUT /api/courses/external/{courseCode}`
- `PUT /api/courses/{id}`
- `DELETE /api/courses/{id}`

#### CoursePLOController (3 API)

Liên kết học phần với PLO.

- `GET /api/course-plos`
- `PUT /api/course-plos`
- `PUT /api/course-plos/bulk`

#### DataTransferController (48 API)

Đồng bộ và chuyển dữ liệu giữa các hệ thống.

- `GET /api/data-transfer/majors/preview`
- `POST /api/data-transfer/majors/transfer`
- `POST /api/data-transfer/majors/update-programme-majorid`
- `GET /api/data-transfer/programmes/preview`
- `POST /api/data-transfer/programmes/transfer`
- `GET /api/data-transfer/courses/preview`
- `POST /api/data-transfer/courses/transfer`
- `GET /api/data-transfer/course-dependencies/preview`
- `POST /api/data-transfer/course-dependencies/transfer`
- `GET /api/data-transfer/lock-dependent-course-exams/preview`
- `POST /api/data-transfer/lock-dependent-course-exams/lock`
- `GET /api/data-transfer/unlock-all-exams/preview`
- `POST /api/data-transfer/unlock-all-exams/unlock`
- `GET /api/data-transfer/curriculums/preview`
- `POST /api/data-transfer/curriculums/transfer`
- `GET /api/data-transfer/cohorts/preview`
- `POST /api/data-transfer/cohorts/transfer`
- `GET /api/data-transfer/students/preview`
- `POST /api/data-transfer/students/transfer`
- `GET /api/data-transfer/semesters/preview`
- `POST /api/data-transfer/semesters/transfer`
- `GET /api/data-transfer/classes/preview`
- `POST /api/data-transfer/classes/transfer`
- `GET /api/data-transfer/class-student/preview`
- `POST /api/data-transfer/class-student/transfer`
- `GET /api/data-transfer/exams/preview`
- `POST /api/data-transfer/exams/transfer`
- `GET /api/data-transfer/exam-deadlines/preview`
- `POST /api/data-transfer/exam-deadlines/transfer`
- `GET /api/data-transfer/teachers/preview`
- `POST /api/data-transfer/teachers/transfer`
- `GET /api/data-transfer/course-plos/preview-orphaned`
- `DELETE /api/data-transfer/course-plos/remove-orphaned`
- `GET /api/data-transfer/parent-exam-sessions/preview`
- `POST /api/data-transfer/parent-exam-sessions/transfer`
- `GET /api/data-transfer/child-exam-sessions/preview`
- `POST /api/data-transfer/child-exam-sessions/transfer`
- `GET /api/data-transfer/class-parent-exam-sessions/preview`
- `POST /api/data-transfer/class-parent-exam-sessions/transfer`
- `GET /api/data-transfer/exam-session-related-exams/preview`
- `POST /api/data-transfer/exam-session-related-exams/update`
- `GET /api/data-transfer/student-child-exam-sessions/preview`
- `POST /api/data-transfer/student-child-exam-sessions/transfer`
- `POST /api/data-transfer/student-exams/populate-confirmed-scores`
- `GET /api/data-transfer/activate-all-students/preview`
- `POST /api/data-transfer/activate-all-students/activate`
- `GET /api/data-transfer/classes/core-sync/preview`
- `POST /api/data-transfer/classes/core-sync`

#### ExamController (16 API)

Bài thi, loại thi, hạn chấm và cấu trúc câu hỏi.

- `GET /api/exams`
- `POST /api/exams/types/distinct-by-classes`
- `GET /api/exams/{id}`
- `POST /api/exams`
- `PUT /api/exams/{id}`
- `DELETE /api/exams/{id}`
- `PUT /api/exams/{id}/can-students-view-unconfirmed-results`
- `PUT /api/exams/{id}/deadline-extension`
- `PUT /api/exams/{id}/questions`
- `PUT /api/exams/deadlines/batch`
- `PUT /api/exams/deadlines/batch-by-category`
- `GET /api/exams/categories`
- `GET /api/exams/types/distinct`
- `GET /api/exams/types/distinct-by-semester/{semesterId}`
- `GET /api/exams/by-semester-and-types`
- `PUT /api/exams/deadlines/batch-by-class-code`

#### ReportController (32 API)

Xuất/import báo cáo, danh sách, bảng điểm và điểm PLO.

- `GET /api/export/faculties`
- `GET /api/export/teachers`
- `GET /api/export/teachers/workunit/{workUnitId}`
- `GET /api/export/students/faculty/{facultyId}`
- `GET /api/export/students/programme/{programmeId}`
- `GET /api/export/courses`
- `GET /api/export/courses/faculty/{facultyId}`
- `GET /api/export/courses/programme/{programmeId}`
- `GET /api/export/classes`
- `GET /api/export/classes/course/{courseId}`
- `GET /api/export/classes/semester/{semesterId}`
- `GET /api/export/classes/teacher/{teacherId}`
- `GET /api/export/classes/extreme-filters`
- `GET /api/export/score/clo/{classId}`
- `GET /api/export/score/component`
- `POST /api/export/grades/import`
- `POST /api/export/grades/preview-import`
- `GET /api/export/grades/all/{classId}`
- `GET /api/export/courses/confirmed/{programId}`
- `GET /api/export/status-update-template`
- `POST /api/export/import-status-updates`
- `GET /api/export/classes/teacher-assignment-template`
- `POST /api/export/classes/import-teacher-assignments`
- `GET /api/export/parent-exam-sessions/teacher-assignment-template`
- `POST /api/export/parent-exam-sessions/import-teacher-assignments`
- `GET /api/export/classes/core-list`
- `GET /api/export/grades/exam-sessions/{childExamSessionId}`
- `POST /api/export/grades/exam-sessions/preview-import`
- `GET /api/export/grades/student/{studentId}`
- `GET /api/export/plo-scores/programme/{programmeId}`
- `GET /api/export/plo-scores/graduation`
- `GET /api/export/max-pk-score/student/{studentId}`

#### ExportPdfController (17 API)

Xuất tài liệu, bảng biểu dạng PDF.

- `GET /api/pdf-export/score-sheet/{classId}`
- `GET /api/pdf-export/score-sheet/{classId}/category/{category}`
- `GET /api/pdf-export/score-sheet/child-exam-session/{childExamSessionId}`
- `GET /api/pdf-export/corrected-results/class/{classId}`
- `GET /api/pdf-export/corrected-results/child-exam-session/{childExamSessionId}`
- `POST /api/pdf-export/score-sheet/{classId}/draft`
- `GET /api/pdf-export/drafts/{draftId:guid}/file`
- `POST /api/pdf-export/drafts/{draftId:guid}/sign`
- `POST /api/pdf-export/score-sheet/{classId}/sign`
- `GET /api/pdf-export/score-sheet/{classId}/signed`
- `GET /api/pdf-export/score-sheet/{classId}/signed/file`
- `GET /api/pdf-export/score-sheets/paged`
- `DELETE /api/pdf-export/score-sheet/{classId}/signed`
- `GET /api/pdf-export/faculty-score-sheets`
- `GET /api/pdf-export/certificate-status`
- `POST /api/pdf-export/certificate-request`
- `GET /api/pdf-export/signature-templates`

#### ExportWordController (2 API)

Xuất tài liệu dạng Word.

- `GET /api/word-export/plo-list/{programmeId}`
- `GET /api/word-export/clo-score/{classId}`

#### FacultyController (5 API)

Khoa.

- `GET /api/faculties`
- `GET /api/faculties/{id}`
- `POST /api/faculties`
- `PUT /api/faculties/{id}`
- `DELETE /api/faculties/{id}`

#### MajorController (5 API)

Ngành.

- `GET /api/majors`
- `GET /api/majors/{id}`
- `POST /api/majors`
- `PUT /api/majors/{id}`
- `DELETE /api/majors/{id}`

#### ParentExamSessionController (8 API)

Đợt thi cha và lớp tham gia.

- `GET /api/parent-exam-sessions`
- `GET /api/parent-exam-sessions/paged`
- `GET /api/parent-exam-sessions/{id}`
- `POST /api/parent-exam-sessions`
- `PUT /api/parent-exam-sessions/{id}`
- `DELETE /api/parent-exam-sessions/{id}`
- `POST /api/parent-exam-sessions/{id}/classes`
- `DELETE /api/parent-exam-sessions/{id}/classes`

#### PLOController (9 API)

Chuẩn đầu ra chương trình (PLO) và liên kết CLO/học phần.

- `GET /api/plos`
- `GET /api/plos/{id}`
- `GET /api/plos/max-count`
- `POST /api/plos`
- `PUT /api/plos/{id}`
- `DELETE /api/plos/{id}`
- `GET /api/plos/{id}/clos`
- `GET /api/plos/{id}/courses`
- `PUT /api/plos/{id}/clos`

#### ProgrammeController (11 API)

Chương trình đào tạo và học phần thuộc chương trình.

- `GET /api/programmes`
- `GET /api/programmes/{id}`
- `POST /api/programmes`
- `PUT /api/programmes/{id}`
- `POST /api/programmes/{id}/confirm`
- `DELETE /api/programmes/{id}`
- `GET /api/programmes/{id}/courses` `#UI_DATA`
- `POST /api/programmes/{id}/courses`
- `DELETE /api/programmes/{id}/courses`
- `PATCH /api/programmes/{id}/courses/is-core`
- `POST /api/programmes/{id}/copy-structure`

#### QuestionController (7 API)

Câu hỏi/tiêu chí đánh giá.

- `GET /api/questions`
- `GET /api/questions/{id}`
- `POST /api/questions`
- `PUT /api/questions/{id}`
- `DELETE /api/questions/{id}`
- `GET /api/questions/{id}/clo`
- `PUT /api/questions/{id}/clo`

#### ResultController (25 API)

Kết quả học tập, CLO/PLO, mức hoàn thành và tính toán điểm.

- `GET /api/results`
- `GET /api/results/{id}`
- `POST /api/results`
- `PUT /api/results/{id}`
- `PUT /api/results/upsert`
- `PUT /api/results/bulk`
- `DELETE /api/results/{id}`
- `POST /api/results/confirm`
- `GET /api/results/calculate-clo-score`
- `GET /api/results/student-clo-scores-for-class`
- `GET /api/results/calculate-clo-score-max`
- `GET /api/results/calculate-pk-score`
- `GET /api/results/student-pk-scores-for-class`
- `GET /api/results/calculate-max-pk-score-for-course`
- `GET /api/results/calculate-plo-score`
- `GET /api/results/student-plo-scores-for-programme`
- `GET /api/results/clo-passed-percentages`
- `GET /api/results/plo-passed-percentages`
- `GET /api/results/student-programme-completion-status`
- `GET /api/results/plo-scores`
- `POST /api/results/recalculate`
- `GET /api/results/graduation-review`
- `GET /api/results/student-plo-scores-by-code`
- `GET /api/results/my-plo-scores` `#UI_DATA`
- `GET /api/results/my-programme-completion` `#UI_DATA`

#### RoleController (1 API)

Vai trò người dùng.

- `GET /api/roles`

#### ScoreAppealController (9 API)

Yêu cầu phúc khảo và kết quả xử lý.

- `GET /api/score-appeals`
- `GET /api/score-appeals/{id}`
- `POST /api/score-appeals`
- `PUT /api/score-appeals/{id}/assign`
- `PUT /api/score-appeals/{id}/results`
- `POST /api/score-appeals/{id}/apply`
- `POST /api/score-appeals/{id}/revert-apply`
- `POST /api/score-appeals/{id}/reject`
- `DELETE /api/score-appeals/{id}`

#### SemesterController (6 API)

Học kỳ.

- `GET /api/semesters`
- `GET /api/semesters/{id}`
- `POST /api/semesters`
- `PUT /api/semesters/{id}`
- `DELETE /api/semesters/{id}`
- `PUT /api/semesters/{id}/status`

#### SettingController (2 API)

Cấu hình hệ thống CLO/PLO.

- `GET /api/settings`
- `PUT /api/settings`

#### StudentController (9 API)

Sinh viên, tóm tắt kết quả và điểm ngoài hệ thống.

- `GET /api/students`
- `GET /api/students/paged`
- `GET /api/students/{id}`
- `GET /api/students/me/result-summary` `#UI_DATA`
- `GET /api/students/external/{studentCode}/scores` `#UI_DATA`
- `POST /api/students`
- `PUT /api/students/{id}`
- `PUT /api/students/programme`
- `DELETE /api/students/{id}`

#### StudentExamController (2 API)

Liên kết sinh viên với kỳ thi.

- `GET /api/student-exams`
- `PUT /api/student-exams`

#### StudentPLOController (1 API)

Liên kết/kết quả PLO của sinh viên.

- `DELETE /api/student-plos`

#### TeacherController (6 API)

Giảng viên.

- `GET /api/teachers`
- `GET /api/teachers/{id}`
- `POST /api/teachers`
- `POST /api/teachers/external`
- `PUT /api/teachers/{id}`
- `DELETE /api/teachers/{id}`

#### UserActivityLogController (2 API)

Nhật ký hoạt động người dùng.

- `GET /api/user-activity-logs`
- `GET /api/user-activity-logs/test-ip`

#### WorkUnitController (1 API)

Đơn vị công tác.

- `GET /api/work-units`


### tkb-be-main

#### AccountController (5 API)

Tài khoản hệ thống xếp lịch.

- `GET /api/Account`
- `GET /api/Account/roles`
- `POST /api/Account`
- `PUT /api/Account/{accountId:int}`
- `DELETE /api/Account/{accountId:int}`

#### AuthController (5 API)

Đăng nhập và cập nhật xác thực.

- `POST /api/Auth/login`
- `POST /api/Auth/login-sso`
- `GET /api/Auth/profile`
- `PUT /api/Auth/change-password`
- `POST /api/Auth/select-role`

#### ClassroomController (6 API)

Phòng học.

- `GET /api/Classroom`
- `GET /api/Classroom/building`
- `GET /api/Classroom/suggest`
- `POST /api/Classroom`
- `PUT /api/Classroom/{classroomId}`
- `DELETE /api/Classroom/{classroomId}`

#### CourseSectionController (5 API)

Lớp học phần phục vụ xếp lịch.

- `GET /api/CourseSection`
- `GET /api/CourseSection/{courseId}`
- `POST /api/CourseSection`
- `PUT /api/CourseSection/{courseId}`
- `DELETE /api/CourseSection/{courseId}`

#### DashboardController (5 API)

Thống kê riêng cho phòng, lớp và xung đột lịch.

- `GET /api/Dashboard/stats`
- `GET /api/Dashboard/rooms-by-building`
- `GET /api/Dashboard/course-sections-by-building`
- `GET /api/Dashboard/room-usage-by-day`
- `GET /api/Dashboard/schedule-conflicts`

#### FacultyController (5 API)

Khoa.

- `GET /api/Faculty`
- `GET /api/Faculty/{facultyId:int}`
- `POST /api/Faculty`
- `PUT /api/Faculty/{facultyId:int}`
- `DELETE /api/Faculty/{facultyId:int}`

#### LecturerController (4 API)

Giảng viên.

- `GET /api/Lecturer`
- `POST /api/Lecturer`
- `PUT /api/Lecturer/{lecturerId:int}`
- `DELETE /api/Lecturer/{lecturerId:int}`

#### LookupController (1 API)

Dữ liệu tra cứu hỗ trợ xếp lịch.

- `GET /api/Lookup/course-section-form`

#### ScheduleController (22 API)

Sinh/lưu/khóa lịch, gán phòng, xem lịch sử và tác vụ nền.

- `POST /api/Schedule/generate`
- `POST /api/Schedule/save`
- `GET /api/Schedule/{id:int}`
- `GET /api/Schedule/lecturer/{lecturerId:int}`
- `GET /api/Schedule`
- `GET /api/Schedule/semester-stats`
- `POST /api/Schedule/lock-semester`
- `POST /api/Schedule/reset-semester`
- `POST /api/Schedule/dedupe-semester`
- `POST /api/Schedule/generate-semester`
- `POST /api/Schedule/generate-semester/start`
- `POST /api/Schedule/jobs/{jobId:guid}/cancel`
- `GET /api/Schedule/jobs`
- `GET /api/Schedule/jobs/{jobId:guid}`
- `GET /api/Schedule/pending-room-assignments`
- `GET /api/Schedule/{timetableId:int}/room-candidates`
- `POST /api/Schedule/assign-room`
- `GET /api/Schedule/batch/{batchId:guid}`
- `GET /api/Schedule/history`
- `POST /api/Schedule/lock/{batchId:guid}`
- `POST /api/Schedule/unlock/{batchId:guid}`
- `DELETE /api/Schedule/batch/{batchId:guid}`

#### SystemConfigController (2 API)

Cấu hình hệ thống thời khóa biểu.

- `GET /api/SystemConfig`
- `PUT /api/SystemConfig`


### tuition-fee-main

#### RootController (1 API)

Kiểm tra đường dẫn gốc của dịch vụ.

- `GET /`

#### TuationFeesController (4 API)

Tổng hợp học phí, khoản chưa nộp, khoản đã nộp và chi tiết theo môn.

- `GET /api/tuation_fees` `#UI_DATA`
- `GET /api/tuation_fees/by-subject` `#UI_DATA`
- `GET /api/tuation_fees/pending` `#UI_DATA`
- `GET /api/tuation_fees/paid` `#UI_DATA`
