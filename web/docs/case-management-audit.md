# Rà soát và redesign hồ sơ trực tuyến

## Phase 1 — Kết quả rà soát (14/10/2026)

Đã đọc source, design system, Google Docs qua bản xuất văn bản và bốn ảnh trong hội thoại. Kho hiện có route/role, IndexedDB v1, Blob, revision checking và đồng bộ tab. Thiếu cấu hình kênh nộp/trả, chỉ có 6 hồ sơ seed, không có seed version/reset, phiếu chuyên viên hiện tất cả trường, bộ lọc ít và progress đánh dấu các bước trước trạng thái hiện tại như đã hoàn tất dù seed không có lịch sử. Storage đang nằm chung service. Các điểm này được xử lý trong đợt redesign.

Không sửa dữ liệu legacy hoặc các module học tập/thiết bị không liên quan. Chuyển schema chỉ thêm metadata; không suy diễn các trường mới cho hồ sơ cũ thành dữ liệu đã xác nhận.

## Ma trận nghiệp vụ dùng để triển khai

| Thủ tục                                               | Chủ trì                           | Nộp / minh chứng                                             | Quy trình                                                            | Trả kết quả / điều cần xác minh                                      |
| ----------------------------------------------------- | --------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Xác nhận SV, NVQS, vay vốn, rèn luyện                 | CTSV                              | Đăng ký online; bản gốc theo yêu cầu                         | Kiểm tra → trình ký → ghi nhận ký/đóng dấu                           | Giấy tại HC1C; file đính kèm chỉ là bản tham khảo/bản sao            |
| Bảng điểm học kỳ/năm/quá trình, tiếng Anh             | Đào tạo                           | Đăng ký online                                               | Kiểm tra → xác nhận/ký/đóng dấu                                      | Mặc định nhận giấy; điện tử cần cấu hình được đơn vị xác nhận        |
| Xác nhận hoàn thành, tốt nghiệp, học phần tương đương | Đào tạo                           | Đăng ký online theo danh mục ảnh                             | Giấy xác nhận                                                        | Nhận tại HC1C; đối tượng đã tốt nghiệp cần hệ thống xác thực phù hợp |
| Cấp lại thẻ                                           | CTSV                              | Khai báo trước và hồ sơ bổ sung                              | Kiểm tra → chuyển đơn vị làm thẻ → ghi nhận sẵn sàng                 | Nhận thẻ; không giả định chuyên viên trực tiếp sản xuất thẻ          |
| Hoãn học phí                                          | CTSV tiếp nhận                    | Khai báo trước; quy trình cần xác nhận                       | Kiểm tra → thẩm quyền → kết quả                                      | Không tự thay hạn học phí                                            |
| Chứng chỉ ngoại ngữ/CNTT                              | Đào tạo                           | Upload theo đề xuất demo; đối chiếu bản gốc nếu được yêu cầu | Kiểm tra → thẩm tra → đề xuất → quyết định ngoài hệ thống → cập nhật | Thông báo kết quả; không tự tính tương đương                         |
| Hoãn thi                                              | Đào tạo/Khảo thí                  | Hybrid: khai báo/upload trước, nộp bản gốc theo quy trình    | Kiểm tra → xét → quyết định → cập nhật                               | Quyết định/hướng dẫn theo đợt                                        |
| Thi bổ sung                                           | Đào tạo/Khảo thí                  | Online, đợt hợp lệ và hồ sơ hoãn thi                         | Kiểm tra điều kiện → xét → cập nhật                                  | Thông báo/lịch; chưa kiểm tra điều kiện thật                         |
| Phúc khảo                                             | Đào tạo tiếp nhận, Khảo thí xử lý | Theo đợt; có thể bổ sung trực tiếp                           | Chuyển Khảo thí → chấm → thẩm tra → công bố                          | Không cho chuyên viên tự quyết định điểm                             |
| Ngừng học, gia hạn, trở lại                           | Đào tạo                           | Hybrid theo tài liệu ISO/HC1C                                | Kiểm tra → phê duyệt ngoài hệ thống → quyết định → cập nhật          | Quyết định; gia hạn/trở lại tham chiếu quyết định cũ                 |
| Xét/hoãn tốt nghiệp, chương trình 2                   | Đào tạo                           | Khai báo theo đợt, hồ sơ trực tiếp khi được yêu cầu          | Đối chiếu/phản hồi/Hội đồng hoặc xét → quyết định                    | Công bố; không tự suy ra đủ điều kiện                                |
| Phản hồi học bổng                                     | CTSV                              | Phản hồi theo đợt do Trường mở                               | Đối chiếu → tổng hợp/phản hồi → Hội đồng → kết quả                   | Công bố phản hồi; không thay quy trình xét học bổng/chi tiền         |
| Thôi học tự nguyện                                    | Đào tạo                           | Trực tiếp; demo chỉ khai báo trước/upload để theo dõi        | Kiểm tra hồ sơ gốc → xét → quyết định → cập nhật                     | Nhận quyết định; khác buộc thôi học                                  |
| Office365/LMS/cổng SV                                 | Bộ phận CNTT tiếp nhận trong demo | Online; xác minh danh tính qua kênh riêng                    | Tiếp nhận → kiểm tra → ghi nhận xử lý → phản hồi                     | Hướng dẫn khôi phục; không lưu mật khẩu/OTP                          |

Mỗi loại có policy riêng trong catalog; ma trận chi tiết theo từng ID sẽ được xuất từ cấu hình. Kênh trực tuyến trong demo là đề xuất giao diện, không là xác nhận thủ tục đã số hóa chính thức. Ảnh nêu 5 ngày cho một số hồ sơ ngừng/trở lại học; tài liệu ISO chia nhiều bước và tổng thời gian khác. Không chọn một con số làm SLA cố định. Thời hạn chứng chỉ 3 tuần trên ảnh chỉ là tham khảo. Deadline, phí, quy đổi và điều kiện khóa/đợt đều cần xác minh.

## Phân quyền

| Hành động                               | Sinh viên            | Chuyên viên     | Admin                               |
| --------------------------------------- | -------------------- | --------------- | ----------------------------------- |
| Nộp, xem, bổ sung, hủy trước tiếp nhận  | Hồ sơ của mình       | —               | —                                   |
| Xem, kiểm tra, chuyển bước, trả kết quả | —                    | Hồ sơ được giao | Chỉ xem                             |
| Phân công, tái phân công, hạn, ưu tiên  | —                    | —               | Đúng đơn vị, hồ sơ chưa kết thúc    |
| Ghi chú nội bộ                          | Không trả từ service | Hồ sơ được giao | Xem                                 |
| Nạp/reset demo                          | —                    | —               | Xác nhận; chỉ bản ghi đánh dấu demo |

## Hướng thiết kế

Giữ palette/token DUT và Be Vietnam Pro. V1 dùng bảng và summary list gọn; V2 dùng cùng cấu trúc nghiệp vụ nhưng thêm các vùng hành động rõ ràng, không nhân đôi logic. Dashboard có KPI nhỏ, hàng đợi cần hành động ở đầu, bảng phía dưới; chi tiết đặt dữ liệu/minh chứng bên trái, panel xử lý bên phải, lịch sử ở mục riêng. Màu chỉ giúp nhận diện trạng thái, luôn có chữ. Không dùng badge làm nút, không giả lập phần trăm xử lý.

Nguồn UX: [GOV.UK summary list](https://design-system.service.gov.uk/components/summary-list/) cho dữ liệu nhãn–giá trị, [task list](https://design-system.service.gov.uk/components/task-list/) cho tác vụ có hành động, [tag](https://design-system.service.gov.uk/components/tag/) cho trạng thái; [USWDS step indicator](https://designsystem.digital.gov/components/step-indicator/) và [table](https://designsystem.digital.gov/components/table/) để phân biệt điều hướng nhập liệu với tracking và bảng có sắp xếp. Không sao chép phong cách thị giác của các hệ thống này.

Nguồn nghiệp vụ: [Google Docs của người dùng](https://docs.google.com/document/d/1hzIuSYmbcTqtUXx1x7lgxujBtR2HD56YbLq4m8wgfT8/edit), [CTSV](https://dut.udn.vn/Phong/CTSV/Gioithieu/id/9738), [cổng SV](https://sv.dut.udn.vn/Default.aspx), [thông báo chứng chỉ](https://dut.udn.vn/Phong/QML/Thongbao/id/11489). Link [Đào tạo 9731](https://dut.udn.vn/Phong/Daotao/Gioithieu/id/9731) bị lỗi truy cập qua web tool trong phiên này; không suy diễn thêm nội dung từ trang đó.
