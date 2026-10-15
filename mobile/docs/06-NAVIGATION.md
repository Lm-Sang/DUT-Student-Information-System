# 06 - Điều hướng và cấu trúc màn hình

## Thiết kế cây điều hướng trước khi code

Vẽ danh sách **điểm đến cấp cao**, màn hình con, dialog/sheet và đường vào từ deep link/thông báo. Mỗi route có tên/đường dẫn, tham số bắt buộc, quy tắc truy cập và kết quả Back. Đặt khai báo route và metadata điểm đến tại một nơi để nhãn, biểu tượng, thứ tự và nội dung không lệch nhau. Không giả định dự án đã dùng một package định tuyến cụ thể.

Flutter `Navigator` phù hợp luồng đơn giản. Khi có deep link, nested navigation, nhiều tab giữ stack riêng hoặc yêu cầu khôi phục URL, chọn `Router`/giải pháp định tuyến phù hợp và ghi rõ quyết định trong tài liệu kiến trúc. Không dùng named routes như mặc định cho ứng dụng phức tạp vì Flutter không khuyến nghị chúng cho phần lớn trường hợp.

## Chọn đúng cấp điều hướng

| Nhu cầu | Quy tắc |
| --- | --- |
| Điểm đến ngang cấp | Dùng tab/bottom navigation trên cửa sổ hẹp; mục là **điểm đến**, không phải lệnh như Save/Add. Mỗi mục có biểu tượng và nhãn ngắn, rõ. |
| Nhiều không gian ngang | Cân nhắc `NavigationRail` hoặc sidebar khi nội dung đủ chỗ; quyết định dựa trên **độ rộng cửa sổ**, không dựa trên tên thiết bị. |
| Màn hình con | Push lên stack của điểm đến hiện tại; giữ ngữ cảnh khi quay lại. |
| Chọn một hành động phụ | Dùng menu/sheet phù hợp nền tảng; dialog chỉ cho quyết định cần người dùng trả lời ngay. |

Trên Android, navigation bar thích hợp cho khoảng 3–5 điểm đến chính; mục nhiều hơn cần cân nhắc drawer/rail hoặc gom lại theo cấu trúc thông tin. Trên iOS, tab bar chỉ dành cho các khu vực cấp cao và nên giữ hiện diện ổn định khi chuyển tab. Khi đổi tab, giữ state/scroll/stack của tab nếu người dùng kỳ vọng quay lại công việc trước đó.

## Back, Close và deep link

- Android: nút/gesture Back của hệ thống đi về màn hình trước đúng thứ tự, đóng modal trước khi rời màn hình; kiểm tra predictive back nếu có tùy biến transition. Không chặn Back vô cớ.
- iOS: màn hình con có Back dễ thấy; modal có Close/Cancel theo ngữ cảnh. Swipe cạnh có thể hỗ trợ thêm, không thay nút Back. Dùng transition/gesture quen thuộc của nền tảng.
- Deep link phải mở đúng nội dung với tham số hợp lệ. Nếu cần đăng nhập, lưu đích đến và tiếp tục sau khi xác thực; nếu nội dung không còn, hiện trạng thái lỗi có đường quay về. Không đưa người dùng vào stack không có lối thoát.
- Điều hướng sau `await` chỉ dùng `BuildContext` khi widget còn mounted. Tránh gọi navigation trực tiếp từ data layer; presentation quyết định chuyển màn hình theo kết quả nghiệp vụ.

## Checklist

- [ ] Có sơ đồ điểm đến, tab, màn hình con, modal và deep link cho luồng chính.
- [ ] Back/Close hoạt động đúng trên cả hai nền tảng, kể cả sau đăng nhập hoặc mở deep link.
- [ ] Tab có nhãn, thứ tự cố định; đổi tab không mất dữ liệu nhập/scroll ngoài ý muốn.
- [ ] Bottom navigation chỉ dùng khi cửa sổ đủ hẹp; màn hình rộng có bố cục điều hướng phù hợp.

## Nguồn chính thức

- [Flutter: Navigation and routing](https://docs.flutter.dev/ui/navigation), [Deep linking](https://docs.flutter.dev/ui/navigation/deep-linking)
- [Apple HIG: Tab bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars), [Toolbars](https://developer.apple.com/design/human-interface-guidelines/toolbars), [Gestures](https://developer.apple.com/design/human-interface-guidelines/gestures)
- [Android: layout and navigation patterns](https://developer.android.com/design/ui/mobile/guides/layout-and-content/layout-and-nav-patterns), [predictive back](https://developer.android.com/design/ui/mobile/guides/patterns/predictive-back)
