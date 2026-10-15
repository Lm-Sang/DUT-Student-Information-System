# Thử nghiệm với bộ hồ sơ mẫu v3

Bộ mẫu gồm 428 hồ sơ, 32 loại thủ tục, 8 quy trình, 16 chuyên viên và 12 sinh viên. Đây là dữ liệu giả lập trên trình duyệt. Phiên bản dữ liệu v3 dùng được ở cả giao diện V1 và V2; không phải một giao diện mới.

## Nạp dữ liệu

- Trình duyệt mới tự nạp bộ v3 một lần.
- Nếu đang dùng bộ cũ, đăng nhập admin01, mở **Điều phối hồ sơ → Dữ liệu trải nghiệm → Nạp thêm bộ mẫu v3** và xác nhận. Mọi hồ sơ cũ, file, phân công và nhật ký đã thao tác được giữ nguyên. Nếu đã có 40 hồ sơ v2 thì tổng thành 468, cộng thêm hồ sơ bạn tự tạo.
- **Đặt lại dữ liệu mẫu** thay toàn bộ hồ sơ có dấu demo bằng bộ 428 hồ sơ mới. Chỉ dùng khi muốn thử lại từ đầu; thay đổi trên hồ sơ mẫu sẽ mất. Hồ sơ tự nộp không bị xóa. Nạp trùng v3 bị chặn, kể cả khi hai tab cùng nạp.
- Mở các vai trò trên cùng địa chỉ web và browser profile để dùng chung dữ liệu. Reload đăng nhập lại; dữ liệu đã lưu vẫn còn.

## Tài khoản

Admin: **admin01 / admin123**. Tất cả chuyên viên dùng mật khẩu **staff123**; tất cả sinh viên dùng **student123**. Danh sách này cũng có trong mục Dữ liệu trải nghiệm trên trang admin.

| Tài khoản | Chuyên viên      | Đơn vị             | Hồ sơ được giao ban đầu |
| --------- | ---------------- | ------------------ | ----------------------- |
| staff01   | Nguyễn Minh Anh  | Đào tạo            | 38                      |
| staff02   | Trần Thu Hà      | Công tác sinh viên | 22                      |
| staff03   | Lê Quốc Huy      | Hỗ trợ CNTT        | 12                      |
| staff04   | Phạm Ngọc Lan    | Đào tạo            | 45                      |
| staff05   | Đặng Hoài Nam    | Đào tạo            | 33                      |
| staff06   | Võ Thanh Trúc    | Đào tạo            | 25                      |
| staff07   | Bùi Quang Dũng   | Đào tạo            | 26                      |
| staff08   | Hồ Thảo Nguyên   | Đào tạo            | 32                      |
| staff09   | Nguyễn Đức Phúc  | Đào tạo            | 32                      |
| staff10   | Trần Mai Linh    | Đào tạo            | 23                      |
| staff11   | Lê Tuấn Kiệt     | Công tác sinh viên | 14                      |
| staff12   | Phan Ngọc Hân    | Công tác sinh viên | 14                      |
| staff13   | Đỗ Gia Bảo       | Công tác sinh viên | 13                      |
| staff14   | Nguyễn Bích Vân  | Công tác sinh viên | 15                      |
| staff15   | Trương Nhật Minh | Hỗ trợ CNTT        | 8                       |
| staff16   | Võ Khánh Vy      | Hỗ trợ CNTT        | 8                       |

| Tài khoản sinh viên | Họ tên                 | MSSV      | Lớp     |
| ------------------- | ---------------------- | --------- | ------- |
| student01           | Lê Minh Sang           | 102230369 | 23T_DT4 |
| student02           | Nguyễn An Minh (mẫu)   | DEMO002   | 23T_DT3 |
| student03           | Trần Khánh Hà (mẫu)    | DEMO003   | 23D1    |
| student04           | Phạm Bảo Ngọc (mẫu)    | DEMO004   | 22X1    |
| student05           | Đặng Quốc Bảo (mẫu)    | DEMO005   | 23T_DT1 |
| student06           | Võ Minh Châu (mẫu)     | DEMO006   | 22H1    |
| student07           | Lê Hoàng Phúc (mẫu)    | DEMO007   | 24D2    |
| student08           | Nguyễn Thanh Tâm (mẫu) | DEMO008   | 22K1    |
| student09           | Trần Anh Khoa (mẫu)    | DEMO009   | 23C1    |
| student10           | Hồ Ngọc Ánh (mẫu)      | DEMO010   | 24T_DT2 |
| student11           | Phan Gia Huy (mẫu)     | DEMO011   | 21X2    |
| student12           | Bùi Thảo My (mẫu)      | DEMO012   | 23MT1   |

Route: sinh viên `/services/requests`, chuyên viên `/staff/requests`, admin `/admin/requests`. Thêm `/v2` phía trước để dùng V2.

## Chọn hồ sơ theo loại

Admin chọn bộ lọc **Loại đề nghị**, rồi hàng đợi **Chưa phân công** hoặc bộ lọc **Trạng thái**. Mỗi loại có ít nhất một hồ sơ ở từng bước, một ca chờ phân công, một ca đã phân công nhưng chưa tiếp nhận, cùng các nhánh cần bổ sung, từ chối và hủy. Bộ mới có 36 hồ sơ chưa phân công, hạn quá hạn/sắp hạn/còn hạn, ưu tiên thường/cao.

Bảng dưới chọn ca chưa phân công thuộc phần mở rộng. Tìm bằng tiền tố mã; phần cuối mã thay đổi sau mỗi lần đặt lại. Tài khoản sinh viên tương ứng dùng để theo dõi và gửi bổ sung.

| Loại thủ tục                               | Đơn vị             | Số hồ sơ | Tiền tố mã chờ phân công | Tài khoản sinh viên |
| ------------------------------------------ | ------------------ | -------- | ------------------------ | ------------------- |
| Đề nghị cấp văn bản xác nhận sinh viên     | Công tác sinh viên | 14       | YC-DEMO-041-             | student09           |
| Xác nhận hoãn NVQS                         | Công tác sinh viên | 13       | YC-DEMO-053-             | student10           |
| Xác nhận SV vay vốn                        | Công tác sinh viên | 13       | YC-DEMO-065-             | student11           |
| Kết quả rèn luyện                          | Công tác sinh viên | 12       | YC-DEMO-077-             | student12           |
| Bảng điểm học kỳ                           | Đào tạo            | 13       | YC-DEMO-089-             | student02           |
| Bảng điểm học kỳ (tiếng Anh)               | Đào tạo            | 13       | YC-DEMO-101-             | student03           |
| Bảng điểm năm học                          | Đào tạo            | 13       | YC-DEMO-113-             | student04           |
| Bảng điểm năm học (tiếng Anh)              | Đào tạo            | 13       | YC-DEMO-125-             | student05           |
| Bảng điểm quá trình                        | Đào tạo            | 13       | YC-DEMO-137-             | student06           |
| Bảng điểm quá trình (tiếng Anh)            | Đào tạo            | 13       | YC-DEMO-149-             | student07           |
| Xác nhận hoàn thành chương trình đào tạo   | Đào tạo            | 13       | YC-DEMO-161-             | student08           |
| Xác nhận tốt nghiệp (tiếng Việt)           | Đào tạo            | 13       | YC-DEMO-173-             | student09           |
| Xác nhận tốt nghiệp (tiếng Anh)            | Đào tạo            | 12       | YC-DEMO-185-             | student10           |
| Xác nhận học phần tương đương              | Đào tạo            | 12       | YC-DEMO-197-             | student11           |
| Đề nghị cấp lại thẻ SV & BIDV              | Công tác sinh viên | 13       | YC-DEMO-209-             | student12           |
| Đơn xin hoãn nộp học phí                   | Công tác sinh viên | 13       | YC-DEMO-220-             | student12           |
| Công nhận chứng chỉ ngoại ngữ              | Đào tạo            | 19       | YC-DEMO-232-             | student02           |
| Công nhận chứng chỉ CNTT                   | Đào tạo            | 19       | YC-DEMO-248-             | student07           |
| Xét hoãn thi                               | Đào tạo            | 13       | YC-DEMO-264-             | student12           |
| Đăng ký thi bổ sung                        | Đào tạo            | 13       | YC-DEMO-276-             | student02           |
| Đề nghị xét phúc khảo bài thi              | Đào tạo            | 15       | YC-DEMO-288-             | student03           |
| Xét ngừng học tạm thời                     | Đào tạo            | 13       | YC-DEMO-301-             | student05           |
| Gia hạn ngừng học                          | Đào tạo            | 13       | YC-DEMO-313-             | student06           |
| Xét trở lại học                            | Đào tạo            | 14       | YC-DEMO-325-             | student07           |
| Đăng ký xét công nhận tốt nghiệp           | Đào tạo            | 14       | YC-DEMO-337-             | student08           |
| Xét hoãn công nhận tốt nghiệp              | Đào tạo            | 13       | YC-DEMO-350-             | student10           |
| Xét học chương trình 2 tại Trường          | Đào tạo            | 13       | YC-DEMO-362-             | student11           |
| Phản hồi xét học bổng khuyến khích học tập | Công tác sinh viên | 15       | YC-DEMO-374-             | student12           |
| Đề nghị thôi học tự nguyện                 | Đào tạo            | 14       | YC-DEMO-387-             | student03           |
| Hỗ trợ tài khoản Office365                 | Hỗ trợ CNTT        | 12       | YC-DEMO-399-             | student04           |
| Hỗ trợ tài khoản LMS                       | Hỗ trợ CNTT        | 11       | YC-DEMO-409-             | student03           |
| Hỗ trợ tài khoản cổng sinh viên            | Hỗ trợ CNTT        | 11       | YC-DEMO-419-             | student02           |

## Quy trình và điều kiện cần thử

| Quy trình   | Thứ tự xử lý                                                                                                                                                               |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| card        | Chờ tiếp nhận → Đã tiếp nhận → Đang kiểm tra → Chờ xét duyệt → Đã cập nhật kết quả → Sẵn sàng trả kết quả → Hoàn tất                                                       |
| document    | Chờ tiếp nhận → Đã tiếp nhận → Đang kiểm tra → Chờ xét duyệt → Đã ký → Đã đóng dấu → Sẵn sàng trả kết quả → Hoàn tất                                                       |
| academic    | Chờ tiếp nhận → Đã tiếp nhận → Đang kiểm tra → Chờ xét duyệt → Đã có quyết định → Đã cập nhật kết quả → Sẵn sàng trả kết quả → Hoàn tất                                    |
| certificate | Chờ tiếp nhận → Đã tiếp nhận → Đang kiểm tra → Đã thẩm tra → Chờ xét duyệt → Đã có quyết định → Đã cập nhật kết quả → Sẵn sàng trả kết quả → Hoàn tất                      |
| support     | Chờ tiếp nhận → Đã tiếp nhận → Đang kiểm tra → Đã cập nhật kết quả → Sẵn sàng trả kết quả → Hoàn tất                                                                       |
| regrade     | Chờ tiếp nhận → Đã tiếp nhận → Đang kiểm tra → Chờ xét duyệt → Đang chấm phúc khảo → Đã thẩm tra → Đã cập nhật kết quả → Sẵn sàng trả kết quả → Hoàn tất                   |
| evaluation  | Chờ tiếp nhận → Đã tiếp nhận → Đang kiểm tra → Đối chiếu và tiếp nhận phản hồi → Trình Hội đồng → Đã có quyết định → Đã cập nhật kết quả → Sẵn sàng trả kết quả → Hoàn tất |
| graduation  | Chờ tiếp nhận → Đã tiếp nhận → Đang kiểm tra → Đối chiếu và tiếp nhận phản hồi → Trình Hội đồng → Đã có quyết định → Đã cập nhật kết quả → Sẵn sàng trả kết quả → Hoàn tất |

1. **Phân công và tái phân công:** admin mở ca chưa phân công, chọn người cùng đơn vị, hạn từ hôm nay và lý do. Đăng nhập người được giao để thấy hồ sơ. Chuyển cho đồng nghiệp cùng đơn vị; người cũ mất quyền xử lý, người mới thấy đầy đủ lịch sử. Có 8 chuyên viên Đào tạo, 5 CTSV, 3 CNTT.
2. **Bổ sung:** chuyên viên tiếp nhận → kiểm tra → yêu cầu bổ sung và ghi rõ thiếu gì. Sinh viên tương ứng gửi giải trình cùng file mới. Hồ sơ trở về bước đã tạm dừng; file cũ còn nguyên. Bộ mẫu chứng chỉ có cả trường hợp bổ sung ở bước kiểm tra và sau thẩm tra.
3. **Giấy xác nhận/bảng điểm:** đối chiếu hồ sơ, ghi tham chiếu ký và đóng dấu, nhập địa điểm/thời gian/giấy tờ nhận trực tiếp. Các mẫu sẵn sàng trả đã có dữ liệu bước trước; vẫn phải xác nhận đã bàn giao khi hoàn tất.
4. **Chứng chỉ:** có IELTS, TOEIC Listening & Reading, TOEIC 4 kỹ năng, VSTEP, TOEFL iBT và loại khác; CNTT có chương trình/module/số hiệu/mã tra cứu. Thử trạng thái xác minh chờ phản hồi, hợp lệ và không hợp lệ. Không được tiến đến thẩm tra khi chưa xác minh hợp lệ. Nhập kiến nghị, người thẩm định, quyết định và đính kèm bản tham khảo; ghi kết quả cập nhật học vụ trước trả kết quả. Không cài sẵn điểm quy đổi giả định.
5. **Học vụ/thôi học:** kiểm tra bản gốc và đợt áp dụng theo hướng dẫn từng loại, ghi số/ngày/kết luận quyết định cùng tham chiếu cập nhật.
6. **Phúc khảo:** kiểm tra → trình → chấm phúc khảo → thẩm tra → cập nhật → trả kết quả. Ghi tham chiếu bàn giao/kết quả ở bước yêu cầu.
7. **Học bổng/tốt nghiệp:** có ca đối chiếu phản hồi, Hội đồng, quyết định và cập nhật để thử từng điểm bàn giao.
8. **Thẻ sinh viên/tài khoản:** cấp lại thẻ đi qua xét duyệt và cập nhật, không có ký/đóng dấu; hỗ trợ tài khoản đi qua xác minh, cập nhật và phản hồi. Không nhập mật khẩu/OTP thật vào hồ sơ.
9. **Nhánh kết thúc:** thử từ chối có phản hồi công khai; sinh viên chỉ hủy trước tiếp nhận. Mẫu đã hoàn tất/từ chối/hủy không được phân công lại hay chuyển bước.

File PDF/JPG/PNG là dữ liệu tổng hợp để tải, xem trước và bổ sung. Các giá trị kiểm tra/quyết định ở hồ sơ giữa hoặc cuối quy trình được nhập cùng bộ mẫu; nhật ký ghi một sự kiện nhập mẫu, không dựng lịch sử thao tác trước đó. Trạng thái mới do bạn thực hiện sẽ có nhật ký thật trong demo.

## Kiểm tra kỹ thuật

Ngày 14/10/2026: 66 unit/integration tests và 55 ca Chromium đã đạt, gồm hồi quy và các lượt chạy bổ sung cho bộ mẫu v3. TypeScript, build, lint, token và ranh giới kiến trúc đã được kiểm tra.

- Bộ kiểm thử xác nhận đủ từng loại/từng bước, đăng nhập tất cả 28 tài khoản sinh viên/chuyên viên, phân công đúng đơn vị và đủ dữ liệu để trả kết quả.
- Mỗi loại trong 32 thủ tục được thử từ nộp hồ sơ đến hoàn tất qua service với tài khoản chuyên viên mới.
- Migration v2 → nạp thêm v3 giữ nguyên revision, file và audit; kiểm tra nạp đồng thời, chặn trùng và đặt lại có chọn lọc.
- Playwright thử tài khoản mới ở cả ba đơn vị: admin phân công → chuyên viên tiếp nhận/kiểm tra/yêu cầu bổ sung → sinh viên nộp thêm file → chuyên viên nhận cập nhật.

Xem [bàn giao](case-management-delivery.md) và [ma trận thủ tục](procedure-matrix.md) để đối chiếu kênh nộp, trả kết quả và phạm vi mô phỏng.
