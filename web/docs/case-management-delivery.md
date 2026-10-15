# Bàn giao hệ thống hồ sơ trực tuyến DUT

Bộ dữ liệu đã mở rộng lên 428 hồ sơ và 16 chuyên viên. Xem [tài khoản, mã hồ sơ và kịch bản kiểm thử từng loại](demo-testing.md).

Hoàn thiện ngày 14/10/2026. Luồng Student → Admin → Staff → Student hoạt động trên cả V1/V2, dùng chung service và IndexedDB. Có 32 thủ tục thuộc 5 nhóm, 8 quy trình và 428 hồ sơ mẫu tương tác. Không tạo backend mới hoặc thay đổi ứng dụng Flutter.

## Chạy và đăng nhập

Trong thư mục `web`, chạy `npm ci` nếu chưa cài dependencies, sau đó `npm run dev`. Dùng địa chỉ do Vite in ra. Mở các vai trò ở các tab cùng địa chỉ và cùng browser profile để dùng chung dữ liệu. Đăng nhập độc lập từng tab.

| Vai trò     | Tài khoản / mật khẩu                        | V1                   | V2                      |
| ----------- | ------------------------------------------- | -------------------- | ----------------------- |
| Sinh viên   | `student01`–`student12` / `student123`      | `/services/requests` | `/v2/services/requests` |
| Đào tạo     | `staff01`, `staff04`–`staff10` / `staff123` | `/staff/requests`    | `/v2/staff/requests`    |
| CTSV        | `staff02`, `staff11`–`staff14` / `staff123` | `/staff/requests`    | `/v2/staff/requests`    |
| Hỗ trợ CNTT | `staff03`, `staff15`–`staff16` / `staff123` | `/staff/requests`    | `/v2/staff/requests`    |
| Admin       | `admin01 / admin123`                        | `/admin/requests`    | `/v2/admin/requests`    |

Reload yêu cầu đăng nhập lại nhưng giữ hồ sơ và tệp đã lưu. Biểu mẫu sinh viên chưa nộp giữ bản nháp theo từng thủ tục khi chuyển mục/quay lại trong phiên, chưa lưu qua reload. Phiếu xử lý có nút lưu nháp nội bộ vào IndexedDB, gồm phản hồi đang soạn, kết quả và tệp nháp; chưa công khai trước phát hành.

## Những gì đã triển khai

- Sinh viên: tìm/lọc danh mục, hướng dẫn kênh nộp, biểu mẫu động, lỗi cạnh trường, xem trước và tải minh chứng, kiểm tra trước khi nộp, tracking theo sự kiện thực tế, bổ sung và hủy trước tiếp nhận.
- Chuyên viên: KPI tính từ dữ liệu, hàng đợi cần xử lý/chờ sinh viên/chờ đơn vị khác/sắp hạn/quá hạn/hoàn tất; tìm/lọc/sắp xếp, hồ sơ và minh chứng bên cạnh panel theo bước. Điều kiện còn thiếu được giải thích trước nút chuyển bước.
- Admin: hàng đợi can thiệp, tổng hợp theo đơn vị/chuyên viên, phân công/tái phân công đúng đơn vị với hạn và ưu tiên; lưu lý do nội bộ cùng giá trị trước/sau. Admin không chuyển bước nghiệp vụ.
- Chứng chỉ: trường ngoại ngữ theo bài thi; chương trình, đơn vị thi, cấp độ/module, mã tra cứu CNTT; checklist, đối chiếu bản gốc khi cần, xác minh, kiến nghị, căn cứ quy đổi, quyết định và cập nhật học vụ ngoài hệ thống.
- Tệp: PDF/JPG/PNG, tối đa 5 tệp mỗi lần và 10MB/tệp, kiểm tra extension/MIME/kích thước; Blob được lưu cùng hồ sơ, bổ sung nối thêm và download giữ bytes. Bộ mẫu có PDF đọc được và ảnh PNG/JPG tổng hợp, không có chữ ký/con dấu giả.
- Dữ liệu: transaction nguyên tử, revision chống ghi đè, BroadcastChannel/focus đồng bộ tab; biểu mẫu đang sửa giữ nguyên khi nhận phiên bản mới và yêu cầu tải lại rõ ràng. Service loại phiếu xử lý nội bộ, lý do điều phối và tệp kết quả nháp khỏi dữ liệu trả cho sinh viên.

Chi tiết cấu hình nằm trong [ma trận thủ tục](procedure-matrix.md). [Rà soát nghiệp vụ](case-management-audit.md) ghi nguồn và khác biệt với tài liệu. Các trường hợp còn nộp trực tiếp được ghi rõ đăng ký trước/tracking; bản quét không thay thế giấy gốc.

## Kịch bản thử xuyên suốt ba vai trò

1. Tab sinh viên: tìm “chứng chỉ”, chọn công nhận CNTT; nhập đủ thông tin, tải PDF/JPG/PNG mẫu, mở xem trước, kiểm tra và xác nhận nộp. Ghi lại mã hồ sơ.
2. Tab admin: tìm mã tại danh sách, mở hồ sơ; chọn `staff01` hoặc `staff04` thuộc Đào tạo, hạn từ hôm nay, ưu tiên và lý do. Kiểm tra hộp xác nhận rồi lưu. CTSV/CNTT không xuất hiện trong danh sách chuyên viên hợp lệ của hồ sơ này.
3. Tab chuyên viên đã được giao: mở hồ sơ; tải minh chứng để đối chiếu. Tiếp nhận → kiểm tra. Chọn yêu cầu bổ sung, viết nội dung công khai và xác nhận. Khi chờ bổ sung chỉ có thể lưu ghi chú, không bỏ qua bước.
4. Tab sinh viên: thấy yêu cầu bổ sung; nhập giải trình, thêm minh chứng và xác nhận gửi. Tệp cũ được giữ. Hồ sơ quay về bước đã tạm dừng.
5. Tab chuyên viên: đánh dấu checklist; ghi trạng thái xác minh hợp lệ, kênh, ngày, mã tham chiếu và kết quả. Xác nhận thao tác đã có căn cứ để ghi nhận thẩm tra.
6. Điền mức công nhận đề xuất, kiến nghị, người/đơn vị thẩm định; nếu nhập điểm quy đổi phải có căn cứ. Trình xét duyệt. Ghi số/ngày/kết luận quyết định đã ban hành và đính kèm bản tham khảo.
7. Ghi tham chiếu kết quả thực hiện và việc cập nhật hệ thống đào tạo bên ngoài. Chọn kênh trả, nội dung kết quả; nếu nhận trực tiếp phải có địa điểm, thời gian, giấy tờ cần mang theo. Nếu qua thông báo phải có URL HTTPS hợp lệ. Phát hành kết quả, rồi xác nhận đã trả/gửi thông báo để hoàn tất.
8. Tab sinh viên: mở mục Kết quả, xem hướng dẫn và tải tệp; nhật ký chỉ có nội dung công khai. Reload, đăng nhập lại và kiểm tra tệp vẫn tải được.

Với giấy xác nhận, thử thêm nhánh ký → đóng dấu → chờ nhận → hoàn tất: cần tham chiếu ký và đóng dấu bên ngoài, kênh nhận trực tiếp và xác nhận bàn giao. Với hồ sơ chưa tiếp nhận, thử hủy có lý do. Với hồ sơ đang kiểm tra không hợp lệ, thử từ chối có lý do.

## Kiểm tra phân quyền và nhiều tab

Mở `staff01` ở hai tab cùng hồ sơ. Nhập ghi chú chưa lưu ở tab A; chuyển bước ở tab B. Tab A giữ bản đang nhập, báo phiên bản mới và khóa lưu đến khi người dùng chọn tải lại. Không ghi đè âm thầm.

Admin tái phân công từ `staff01` sang `staff04`. Hồ sơ biến mất khỏi hàng đợi của người cũ và xuất hiện ở người mới; nhật ký nội bộ ghi chuyên viên/hạn/ưu tiên trước và sau. Sinh viên chỉ thấy người phụ trách, hạn và sự kiện công khai. Truy cập trực tiếp URL của hồ sơ không được giao bị từ chối.

## Nạp và đặt lại dữ liệu mẫu

Database mới tự nạp một lần 428 hồ sơ demo v3. Database v1 chỉ nâng schema thêm metadata; không tự nạp lại, không xóa hoặc đánh dấu lại hồ sơ cũ. Sáu hồ sơ mẫu của bản cũ không có marker cũng được giữ nguyên như dữ liệu chưa xác minh nguồn gốc.

Trên trang admin, ngay trước hàng đợi, mở **Dữ liệu trải nghiệm**:

1. Chọn **Nạp thêm bộ mẫu v3** khi database cũ chưa có bộ mẫu mới. Xem phạm vi rồi xác nhận. Bộ v3 được thêm vào, giữ nguyên mọi hồ sơ v2 và lịch sử cũ.
2. Chọn **Đặt lại dữ liệu mẫu** để thay thế các bản ghi có `demo.version` và `demo.batch` bằng 428 hồ sơ mới. Hộp thoại hiển thị số hồ sơ mẫu bị thay và số hồ sơ không có dấu mẫu được giữ.
3. Các thay đổi đã thực hiện trên hồ sơ mẫu sẽ mất khi xác nhận đặt lại. Hồ sơ sinh viên tự nộp và bản ghi cũ không có marker được giữ, kể cả khi mã bắt đầu bằng `YC-DEMO`.

Nạp trùng bị chặn ở transaction; reset có mã batch mới nên bản đang mở từ bộ mẫu cũ không ghi đè được bộ mới. Lỗi quota khi thêm mẫu hoàn tác cả thao tác xóa và metadata. Không cần xóa IndexedDB/localStorage bằng DevTools để thử. Kiểm thử tự động dùng browser context và database riêng, không đụng dữ liệu trình duyệt của người dùng.

## Kết quả kiểm thử

| Lệnh / phạm vi                                                  | Kết quả ngày 14/10/2026                                                                                                                                                                                                       |
| --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run check`                                                 | Đạt token, kiến trúc, lint, TypeScript, production build và 66 unit/integration tests                                                                                                                                         |
| `npm run test:e2e`                                              | 55 ca Chromium đã đạt (51 ca hồi quy và 4 ca mới; đã chạy lại các ca mở rộng sau khi chỉnh bộ chọn kiểm thử), gồm hồi quy các module hiện có                                                                                  |
| Các ca hồ sơ trong `requests.spec.ts`                           | 14 ca: bốn ca mới cho ba đơn vị và nạp thêm v3; chứng chỉ đầy đủ V1/V2, phân quyền, giấy ký/dấu/nhận trực tiếp và từ chối, hủy/tracking mẫu, form động/xem trước, tái phân công, xung đột hai tab, reset, responsive/keyboard |
| Storage/service                                                 | Bytes Blob qua reopen, quyền ở service, audit, seed 428/nondup, reset bảo toàn hồ sơ tự tạo, migration v1 và nạp thêm từ v2, revision đồng thời, lỗi quota hoàn tác, lọc trường/tệp nội bộ                                    |
| Responsive/accessibility                                        | Desktop 1440, tablet 768, mobile 375/390, ngang 812; chữ gốc 24px, dark preference vẫn light theo thiết kế, reduced motion, bàn phím tab/dialog và trả focus; không tràn ngang trang trong ca kiểm thử                        |
| `npm audit` sau cập nhật dependency chuyển tiếp `source-map-js` | Không có lỗ hổng được báo ở lần kiểm tra này                                                                                                                                                                                  |

Chưa xác nhận Safari/WebKit hoặc thiết bị iOS/Android thật. Các kiểm tra responsive dùng Chromium; không coi đây là kiểm chứng mọi trình duyệt. Kiểm tra MIME chưa đọc chữ ký nhị phân hoặc quét virus. Không có kiểm thử tích hợp với hệ thống DUT thật.

## Ảnh giao diện

Ảnh bên dưới được chụp từ bộ mẫu v2 trước khi mở rộng dữ liệu, trong browser context riêng. Số hồ sơ và tài khoản hiện tại xem trong hướng dẫn bộ mẫu v3. V2 có vùng cuộn riêng, nên ảnh toàn trang có thể chỉ chụp vùng nhìn thấy; đã chụp thêm vị trí hàng đợi và panel xử lý.

| Màn hình                 | V1                                                  | V2                                                  |
| ------------------------ | --------------------------------------------------- | --------------------------------------------------- |
| Sinh viên desktop        | [Ảnh](screenshots/requests/v1-student-desktop.png)  | [Ảnh](screenshots/requests/v2-student-desktop.png)  |
| Sinh viên mobile         | [Ảnh](screenshots/requests/v1-student-mobile.png)   | [Ảnh](screenshots/requests/v2-student-mobile.png)   |
| Bàn làm việc chuyên viên | [Ảnh](screenshots/requests/v1-staff-desktop.png)    | [Ảnh](screenshots/requests/v2-staff-desktop.png)    |
| Chi tiết hồ sơ           | [Ảnh](screenshots/requests/v1-staff-detail.png)     | [Ảnh](screenshots/requests/v2-staff-detail.png)     |
| Panel xử lý chứng chỉ    | [Ảnh](screenshots/requests/v1-staff-processing.png) | [Ảnh](screenshots/requests/v2-staff-processing.png) |
| Chuyên viên mobile       | [Ảnh](screenshots/requests/v1-staff-mobile.png)     | [Ảnh](screenshots/requests/v2-staff-mobile.png)     |
| Admin dashboard          | [Ảnh](screenshots/requests/v1-admin-desktop.png)    | [Ảnh](screenshots/requests/v2-admin-desktop.png)    |
| Admin hàng đợi           | [Ảnh](screenshots/requests/v1-admin-queue.png)      | [Ảnh](screenshots/requests/v2-admin-queue.png)      |
| Admin phân công          | [Ảnh](screenshots/requests/v1-admin-assignment.png) | [Ảnh](screenshots/requests/v2-admin-assignment.png) |
| Admin mobile             | [Ảnh](screenshots/requests/v1-admin-mobile.png)     | [Ảnh](screenshots/requests/v2-admin-mobile.png)     |

Tái tạo: chạy `npm run build`, chạy preview tại cổng 4175, rồi `node scripts/capture-request-screens.mjs`. Có thể đổi địa chỉ bằng biến `REQUEST_PREVIEW_URL`. Xuất ma trận bằng `node scripts/export-procedure-matrix.mjs`; tạo lại ảnh minh chứng bằng `node scripts/create-evidence-fixtures.mjs`.

## Cần xác minh với DUT trước vận hành

- Đơn vị tiếp nhận/chủ trì/phối hợp cho từng thủ tục, nhất là học phí, tài khoản, chứng chỉ và làm thẻ; danh sách chuyên viên thật và quyền từng bước.
- Quy trình ISO hiện hành, thủ tục đã được duyệt số hóa, trường hợp bắt buộc nộp/đối chiếu bản gốc, thẩm quyền ký/đóng dấu và giá trị pháp lý của tệp điện tử. Mặc định giấy xác nhận nhận trực tiếp; không cho sinh viên tự in bản scan thay giấy gốc.
- SLA theo lịch làm việc/ngày nghỉ, dừng tính hạn khi chờ bổ sung, phí và phương thức thu, lịch nhận tại HC1C. Ảnh và tài liệu có thời gian khác nhau nên chưa mã hóa hạn cam kết tự động.
- Đợt nhận đăng ký, điều kiện theo khóa, chứng chỉ chấp nhận, thời hạn hiệu lực, bảng quy đổi và mục đích công nhận. Demo ghi đề xuất để người có thẩm quyền xét, không tự kết luận đủ điều kiện.
- Nguồn quyết định và kênh công bố chính thức, quyền chia sẻ bản tham khảo, tích hợp cập nhật học vụ/Khảo thí/tài chính và khôi phục tài khoản.
- Trang Đào tạo `9731` không truy cập được qua web tool lúc rà soát; cần lấy tài liệu chính thức từ đơn vị để đối chiếu bổ sung.

Đây là frontend demo lưu trong cùng browser. Phân quyền service/route phục vụ mô phỏng luồng, không tạo ranh giới bảo mật production đối với người có quyền đọc bộ nhớ trình duyệt. Chưa có SSO thật, server kiểm soát quyền, kho tệp riêng tư, email/realtime từ backend, quét virus hoặc ký số; chưa gửi hồ sơ tới DUT.
