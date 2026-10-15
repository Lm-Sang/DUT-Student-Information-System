# Hồ sơ trực tuyến: sinh viên, chuyên viên và admin

Bộ dữ liệu đã mở rộng lên 428 hồ sơ và 16 chuyên viên. Xem [tài khoản, mã hồ sơ và kịch bản kiểm thử từng loại](demo-testing.md).

## Phạm vi triển khai

Bản redesign ngày 14/10/2026 có 32 thủ tục, 8 quy trình và 428 hồ sơ mẫu kèm minh chứng. Xem [ma trận cấu hình](procedure-matrix.md), [hướng dẫn thử và kết quả kiểm thử](case-management-delivery.md), [file thay đổi](case-management-files.md).

Luồng chạy trong web React hiện có, cho cả V1 và V2. Đây là frontend trải nghiệm: IndexedDB lưu hồ sơ, lịch sử và Blob của tệp; không gửi đơn đến DUT. Các tab cùng origin và cùng browser profile đọc chung hồ sơ. Đăng nhập vẫn ở bộ nhớ từng tab; tải lại trang phải đăng nhập lại, dữ liệu hồ sơ vẫn còn. Thiết bị/browser/origin khác không đồng bộ.

| Vai trò                 | Đường dẫn V1         | Tài khoản mẫu                               |
| ----------------------- | -------------------- | ------------------------------------------- |
| Sinh viên               | `/services/requests` | `student01`–`student12` / `student123`      |
| Chuyên viên Đào tạo     | `/staff/requests`    | `staff01`, `staff04`–`staff10` / `staff123` |
| Chuyên viên CTSV        | `/staff/requests`    | `staff02`, `staff11`–`staff14` / `staff123` |
| Chuyên viên hỗ trợ CNTT | `/staff/requests`    | `staff03`, `staff15`–`staff16` / `staff123` |
| Admin điều phối         | `/admin/requests`    | `admin01 / admin123`                        |

Thêm `/v2` trước đường dẫn để mở giao diện V2. Trang `/admin` giữ các module cũ và bổ sung lối vào điều phối. Mã hồ sơ lưu trong query `id`; sinh viên dùng `?view=history&id=…`. Tên chuyên viên, hồ sơ và phân công ban đầu đều là dữ liệu minh họa.

## Nguồn và cách áp dụng

Đối chiếu ngày 14/10/2026:

- [Tài liệu quy trình do người dùng cung cấp](https://docs.google.com/document/d/1hzIuSYmbcTqtUXx1x7lgxujBtR2HD56YbLq4m8wgfT8/edit): đọc qua bản export văn bản. Đây là nguồn phân loại đơn, đơn vị phụ trách, trình ký/đóng dấu, phân biệt quyết định với cập nhật hồ sơ và các nghiệp vụ theo đợt.
- Ảnh “Phụ lục 1: Danh mục hồ sơ – Phòng Đào tạo” và ảnh menu người dùng cung cấp: đối chiếu loại hồ sơ, minh chứng, thời gian tham khảo. Không dùng thời hạn trên ảnh làm SLA cố định vì có khác biệt với quy trình trong tài liệu.
- [DUT – Quy trình nghiệp vụ CTSV](https://dut.udn.vn/Phong/CTSV/Gioithieu/id/9738): nguồn chính thức để tra cứu nhóm xác nhận.
- [Cổng thông tin sinh viên DUT](https://sv.dut.udn.vn/Default.aspx): thông báo theo đợt về học vụ, chứng chỉ và công nhận tốt nghiệp; ngày nhận hồ sơ phải theo thông báo áp dụng.
- [Thông báo Phòng Quản lý chất lượng](https://dut.udn.vn/Phong/QML/Thongbao/id/11489): tham khảo việc tiếp nhận chứng chỉ và đề nghị miễn/công nhận điểm ngoại ngữ. Không suy rộng quy đổi điểm giữa các khóa hoặc loại chứng chỉ.

Các căn cứ/quyết định được nhắc trong tài liệu không được mã hóa thành điều kiện pháp lý tự động. Cần đơn vị nghiệp vụ xác nhận toàn văn áp dụng theo khóa trước khi vận hành thật.

## Danh mục phía sinh viên

Danh mục và trường nhập nằm tại `src/features/services/data/requestCatalog.ts`:

1. **Lập đơn xác nhận**: sinh viên, hoãn NVQS, vay vốn, kết quả rèn luyện; bảng điểm học kỳ/năm/quá trình và tiếng Anh; hoàn thành chương trình, tốt nghiệp và học phần tương đương. Xác nhận CTSV và bảng điểm Đào tạo có đơn vị xử lý riêng. Số lượng 1–5 bản; năm học/học kỳ theo loại.
2. **Lập đơn đề nghị**: cấp lại thẻ, hoãn học phí, công nhận chứng chỉ ngoại ngữ và CNTT.
3. **Xét duyệt học vụ**: tên thay cho “Lập đơn xét”; gồm hoãn thi, thi bổ sung, phúc khảo, ngừng/gia hạn ngừng học, trở lại học, công nhận/hoãn tốt nghiệp, chương trình 2 và phản hồi xét học bổng.
4. **Giải quyết thủ tục thôi học**: hồ sơ thôi học tự nguyện; không dùng thay quy trình buộc thôi học do học vụ.
5. **Hỗ trợ tài khoản**: Office365, LMS và cổng sinh viên riêng biệt; không thu thập mật khẩu/OTP hoặc công khai mật khẩu trong lịch sử.

Sinh viên kiểm tra thông tin trong hộp xác nhận rồi nộp. Hồ sơ được cấp mã duy nhất, đưa vào hàng đợi admin và hiển thị ngay ở mục Theo dõi đơn. Lưu file/form đang nhập khi đổi tab chức năng hoặc Back; chưa có bản nháp bền vững cho form chưa nộp. Hủy chỉ được thực hiện trước tiếp nhận, cần lý do và giữ lịch sử.

## Xử lý và phân công

- Admin xem tất cả hồ sơ, lọc theo nhóm/trạng thái/chuyên viên và tìm mã hồ sơ, MSSV, tên sinh viên. Thống kê chờ phân công, đang xử lý, hoàn tất, quá hạn được tính từ dữ liệu thực trong browser.
- Phân công/tái phân công chỉ cho chuyên viên cùng đơn vị của loại đơn; có hạn xử lý, mức ưu tiên và nội dung phân công. Sinh viên thấy chuyên viên và hạn xử lý; lý do điều phối và đối chiếu trước/sau chỉ nằm trong nhật ký nội bộ. Hồ sơ kết thúc không phân công lại.
- Chuyên viên chỉ đọc/xử lý hồ sơ được giao. Admin điều phối, không thay chuyên viên chuyển trạng thái.
- Mọi chuyển bước cần phản hồi. Từ chối/yêu cầu bổ sung cần lý do. Sinh viên bổ sung giải trình/tệp và hồ sơ quay lại đúng bước trước đó; chuyên viên không được bỏ qua lúc đang chờ bổ sung.
- Giấy xác nhận có bước ký, đóng dấu, trả kết quả. Chứng chỉ có thẩm tra, quyết định và cập nhật kết quả riêng. Phúc khảo có chuyển xét/chấm phúc khảo/thẩm tra. Xét tốt nghiệp và phản hồi học bổng có bước đối chiếu/phản hồi, trình Hội đồng rồi ghi nhận quyết định.
- Số văn bản bắt buộc khi ghi nhận ký hoặc quyết định. Trước “Sẵn sàng trả kết quả” phải có kết quả/hướng dẫn nhận. Tệp kết quả có thể đính kèm. Những tác vụ đã thực hiện ngoài hệ thống cần xác nhận của chuyên viên; frontend không tự ký số hoặc thay đổi dữ liệu học vụ.
- Nhật ký ghi người thực hiện, thời điểm, trạng thái và phản hồi. Lịch sử chỉ được thêm, không sửa/xóa qua UI. Hồ sơ mẫu ban đầu nói rõ được nhập ở bước hiện tại, không dựng lịch sử giả.
- Hạn xử lý do admin nhập; quá hạn tính theo ngày Việt Nam, loại hồ sơ đã hoàn tất/từ chối/hủy. Thời hạn tham khảo chứng chỉ 3 tuần lấy từ ảnh, không tự tính thành hạn cam kết; chưa có lịch nghỉ lễ, tạm dừng SLA hoặc nhắc hạn tự động.

## Minh chứng chứng chỉ

Sinh viên nhập tên chứng chỉ, số hiệu/số vào sổ, đơn vị cấp, ngày thi/cấp, ngày hết hạn nếu có, điểm/xếp loại và mục đích công nhận. Ngoại ngữ có loại bài thi và kỹ năng tương ứng: TOEIC Listening & Reading chỉ hỏi nghe/đọc; IELTS, VSTEP, TOEFL iBT và TOEIC 4 kỹ năng hỏi nghe/nói/đọc/viết. CNTT có chương trình, đơn vị tổ chức, cấp độ/module và mã tra cứu nếu có. Chuyên viên nhập theo bước: checklist → xác minh qua kênh/ngày/tham chiếu → đề xuất và căn cứ quy đổi → quyết định/ngày/kết luận/bản tham khảo → ghi nhận cập nhật học vụ → trả kết quả.

Tệp PDF/JPG/PNG: tối đa 5 tệp mỗi lần, 10MB mỗi tệp; kiểm tra phần mở rộng, MIME khớp định dạng, kích thước khác 0. Hồ sơ chứng chỉ bắt buộc có minh chứng. Bản bổ sung được thêm vào hồ sơ, không ghi đè bản đã nộp; tải xuống giữ đúng bytes. Chưa có OCR, quét virus, xác thực chữ ký hoặc kết nối đơn vị cấp. Kiểm tra trên browser không phải kiểm tra an toàn file trên server.

Phiếu kiểm tra, ghi chú, phản hồi nháp, lý do điều phối và nhật ký nội bộ được loại khỏi kết quả service trả cho sinh viên. Tệp/nội dung kết quả chỉ được công khai ở bước sẵn sàng trả hoặc hoàn tất; thông tin nhận kết quả được chọn riêng để công khai. Do mọi dữ liệu demo nằm trên cùng máy, đây không phải biện pháp bảo mật có thể dùng trong production.

## Lưu trữ và đồng bộ

`requests.service.ts` gọi storage adapter `storage/requestStore.ts` quản lý IndexedDB `dut-request-workflow` phiên bản 2, object store `requests` và `meta`. Ghi hồ sơ và Blob trong cùng transaction; quota/lỗi giao dịch trả lỗi và không báo thành công giả. `revision` được so sánh trong transaction để từ chối ghi đè dữ liệu đã thay đổi. BroadcastChannel và sự kiện cùng tab cập nhật danh sách; focus cửa sổ cũng tải lại. Service kiểm tra chủ hồ sơ, người được phân công và quyền của từng thao tác. Hủy hồ sơ không xóa tệp/lịch sử. Nâng database cũ chỉ thêm metadata; không tự nạp lại mẫu. Xem hướng dẫn nạp/reset bộ mẫu có marker tại [tài liệu bàn giao](case-management-delivery.md#nạp-và-đặt-lại-dữ-liệu-mẫu).

Dữ liệu cũ trong `localStorage.dut-service-requests` không bị xóa nhưng không tự nhập vào kho mới: cấu trúc cũ thiếu chủ sở hữu, Blob và lịch sử xác thực. Nếu cần chuyển dữ liệu thật phải có bộ chuyển đổi được đối chiếu. Báo hỏng thiết bị giữ luồng cũ, tách thành component riêng.

## Hợp đồng backend cần nối

Giữ chiều phụ thuộc page → hook → service → storage adapter. Có thể thay IndexedDB adapter bằng REST trong service, với các hợp đồng đề xuất:

| Tác vụ             | Endpoint đề xuất                                              | Kiểm soát phía server                                                        |
| ------------------ | ------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Danh sách/chi tiết | `GET /requests`, `GET /requests/:id`                          | Lọc theo phiên/đơn vị/phân công; loại trường nội bộ                          |
| Nộp hồ sơ          | `POST /requests`                                              | Kiểm tra loại, dữ liệu, điều kiện học vụ và idempotency key                  |
| Upload/download    | `POST /requests/:id/attachments`, `GET /attachments/:id`      | File signature, giới hạn, quét malware, private object storage, quyền sở hữu |
| Phân công          | `PATCH /requests/:id/assignment`                              | Admin, đúng đơn vị, revision/ETag                                            |
| Chuyển bước        | `POST /requests/:id/transitions`                              | Máy trạng thái theo loại, quyền từng bước, audit append-only                 |
| Bổ sung/hủy        | `POST /requests/:id/supplements`, `POST /requests/:id/cancel` | Chủ hồ sơ, trạng thái hiện tại, transaction                                  |
| Phiếu kiểm tra     | `PATCH /requests/:id/review`                                  | Chuyên viên được giao, trường nội bộ                                         |

Cần tích hợp SSO/phiên thật, lưu trữ tệp riêng tư, ký duyệt theo thẩm quyền, thông báo realtime/email, lịch SLA, lưu trữ/xóa theo chính sách và cập nhật cb.dut.udn.vn. Đợt thi bổ sung, phúc khảo, tốt nghiệp, chương trình 2 và học bổng hiện thu thập thông tin để chuyên viên đối chiếu; chưa tự xác minh eligibility, mở/khóa đợt hoặc tính kết quả xét. Không đặt ngưỡng GPA, chứng chỉ hay hạn đăng ký cố định để thay backend.

## Kiểm tra

- `npm run check`: token, ranh giới kiến trúc, lint, unit test nghiệp vụ và build.
- `npm run test:e2e`: hồi quy V1/V2 và `requests.spec.ts` kiểm tra ba vai trò trên cùng browser context, Blob tải xuống, vòng bổ sung, trả kết quả, lưu qua reload, bảo vệ route và hủy giữ lịch sử.
- Giao diện responsive kế thừa token, focus và reduced motion hiện có. Light mode cố định theo [design system](design-system.md), kể cả khi hệ điều hành chọn dark. Không có thay đổi Flutter/mobile app.

Thử thủ công: mở ba tab đăng nhập student01, admin01 và staff01; nộp chứng chỉ → phân công staff01 → tiếp nhận/kiểm tra → yêu cầu bổ sung → sinh viên gửi lại → thẩm tra/trình/ghi nhận quyết định/cập nhật → trả kết quả. Chỉ dùng tệp mẫu trong demo.
