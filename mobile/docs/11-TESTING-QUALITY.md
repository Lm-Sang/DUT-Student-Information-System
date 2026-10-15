# 11 — Kiểm thử và chất lượng

Chọn kiểm thử theo **rủi ro của thay đổi**: logic nghiệp vụ, tương tác, dữ liệu, điều hướng và hành vi nền tảng càng quan trọng thì cần kiểm chứng càng sát hành vi người dùng. Không thêm test chỉ để lặp lại từng dòng implementation.

## 1. Cổng kiểm tra cơ bản

Chạy tại thư mục có `pubspec.yaml` sau khi sửa Dart (thay đường dẫn format bằng các file Dart của tác vụ nếu working tree có thay đổi song song):

```sh
dart format lib test
flutter analyze
flutter test
```

Với CI, có thể kiểm tra format mà không ghi file bằng `dart format --output=none --set-exit-if-changed lib test`. Trước khi báo hoàn thành, ghi rõ lệnh đã chạy, kết quả và phần chưa kiểm tra được.

## 2. Chọn lớp kiểm thử

| Thay đổi | Kiểm thử phù hợp |
| --- | --- |
| Parse dữ liệu, validation, tính toán, mapping lỗi | Unit test với input bình thường, biên và lỗi. |
| Widget có nhập liệu, trạng thái loading/empty/error, nút hoặc navigation | Widget test kiểm tra nội dung, tương tác và kết quả hiển thị. |
| Luồng quan trọng đi qua nhiều màn hình, lưu trữ, API hoặc plugin | Integration test trên thiết bị/emulator phù hợp khi dự án có hạ tầng chạy. |
| Thay đổi thuần văn bản/tài liệu hoặc chỉnh sửa UI nhỏ, dễ kiểm tra | Kiểm tra trực tiếp phần bị ảnh hưởng; không tạo test mô phỏng implementation. |

Giữ test độc lập: thay API, đồng hồ, storage hoặc network bằng fake/mock ở ranh giới phù hợp. Đặt test trong `test/` với hậu tố `_test.dart`. Test hành vi quan sát được và bug đã sửa, tránh phụ thuộc vào chi tiết widget tree dễ thay đổi.

## 3. Kiểm tra giao diện Android và iOS

Với màn hình mới hoặc sửa bố cục, kiểm tra ít nhất:

- Điện thoại hẹp và rộng; tablet hoặc cửa sổ rộng nếu dự án hỗ trợ.
- Portrait/landscape khi được hỗ trợ; bàn phím hiện lên; SafeArea và vùng system UI.
- Chữ được phóng to, nhãn dài, tiếng Việt, trạng thái không có dữ liệu và lỗi.
- Theme sáng/tối nếu ứng dụng hỗ trợ; độ tương phản, focus, thứ tự đọc và nhãn của control.
- Hành vi back, tab và permission trên **cả Android và iOS** nếu tính năng dùng API nền tảng.

Widget test có thể kiểm tra layout/tương tác chung. Hành vi native như permission dialog, notification hoặc platform view cần kiểm chứng trên simulator/thiết bị hoặc công cụ hỗ trợ native; `integration_test` của Flutter không tự điều khiển mọi UI hệ điều hành.

## 4. Trước khi bàn giao

- [ ] Đã đọc diff và bỏ thay đổi ngoài phạm vi.
- [ ] Format/analyze/test phù hợp đã chạy và lỗi mới đã xử lý.
- [ ] Các trạng thái loading, empty, error và retry phù hợp với tính năng.
- [ ] Không lộ thông tin nhạy cảm trong log, dữ liệu test hoặc screenshot.
- [ ] Ghi rõ giới hạn nền tảng/thiết bị chưa kiểm chứng.

## Tài liệu gốc

- [Flutter: tổng quan unit, widget và integration tests](https://docs.flutter.dev/testing/overview)
- [Flutter: CLI analyze và test](https://docs.flutter.dev/reference/flutter-cli)
- [Dart: phân tích tĩnh và format](https://dart.dev/tools/analysis)
- [Flutter: plugin trong kiểm thử](https://docs.flutter.dev/testing/plugins-in-tests)
