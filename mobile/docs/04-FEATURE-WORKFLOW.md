# 04 — Quy trình triển khai một feature Flutter

Áp dụng cho dự án Flutter mới và phần code mới của prototype `mobile/`. Hãy xem [02 — Kiến trúc](02-ARCHITECTURE.md) và [03 — Cấu trúc](03-PROJECT-STRUCTURE.md) trước khi tạo file. Ví dụ `mobile/` hiện chưa dùng Cubit, `injectable`, `auto_route` hay thư mục `features/`; không giả định các package đó đã có.

## 1. Xác định phạm vi trước khi code

Ghi ngắn gọn: người dùng làm gì, dữ liệu từ đâu, màn hình/route nào thay đổi, trạng thái tải/rỗng/lỗi, quyền truy cập, hành vi iOS/Android và tiêu chí hoàn thành. Kiểm tra code và component đang có để dùng lại đúng chỗ; không tạo thêm abstraction khi một hàm hoặc widget nhỏ đã đủ.

## 2. Chọn cấu trúc nhỏ nhất đáp ứng nhu cầu

1. **Chỉ UI tĩnh hoặc state cục bộ:** với cấu trúc mới, tạo screen/widget trong `presentation/`; với prototype hiện tại, đặt trong thư mục UI đang dùng. `StatefulWidget` đủ cho state như tab, animation, ô nhập tạm.
2. **Đọc/ghi dữ liệu:** thêm repository contract và implementation; service/data source chỉ bọc API, DB, storage hoặc plugin. Truyền repository qua constructor hoặc cơ chế DI đã chọn.
3. **Nghiệp vụ phức tạp:** thêm `domain/` và use case khi logic được dùng lại, phối hợp nhiều repository hoặc làm UI logic khó kiểm thử. Không tạo một use case cho từng nút bấm theo thói quen.
4. **State chia sẻ:** chọn cơ chế quản lý state thống nhất của dự án; UI chỉ render state và gửi event, không gọi service trực tiếp.

Ví dụ hợp đồng và fake có thể dùng để phát triển/test UI trước khi API hoàn tất:

```dart
abstract interface class StudentRepository {
  Future<String> getStudentName(String id);
}

final class FakeStudentRepository implements StudentRepository {
  @override
  Future<String> getStudentName(String id) async => 'Nguyễn An';
}
```

## 3. Triển khai theo lát dọc

- Định nghĩa model/hợp đồng dữ liệu tối thiểu, cách biểu diễn lỗi và hành vi khi không có dữ liệu.
- Nối service → repository → UI logic → screen; lắp implementation ở điểm khởi tạo feature/app. Không tạo API client trong `build()`.
- UI hiển thị trạng thái tải, dữ liệu, rỗng và lỗi; hành động lỗi có đường thử lại nếu hữu ích. Lỗi kỹ thuật đi vào log phù hợp, thông báo cho người dùng phải dễ hiểu và không lộ dữ liệu nhạy cảm.
- Dùng theme/token và component sẵn có. Kiểm tra vùng an toàn, text scaling, vùng chạm, nhãn ngữ nghĩa, bàn phím và hành vi điều hướng của iOS/Android. Chọn layout theo **không gian hiện có**, không theo tên thiết bị.
- Thêm route, bản dịch, asset và code generation **chỉ khi feature cần**, theo công cụ dự án đã chọn. Không hard-code chuỗi giao diện nếu dự án hỗ trợ đa ngôn ngữ.

## 4. Kiểm chứng theo rủi ro

| Phần thay đổi | Kiểm chứng phù hợp |
| --- | --- |
| Quy tắc dữ liệu, mapping hoặc lỗi | Unit test repository/UI logic với fake dependency |
| Màn hình có tương tác hoặc nhiều state | Widget test cho tải, rỗng, lỗi, dữ liệu và thao tác chính |
| Luồng quan trọng qua nhiều màn hình/lớp | Integration test trên thiết bị hoặc emulator |
| Giao diện Android và iOS | Xem trên từng nền tảng mục tiêu khi có môi trường; thử text lớn, TalkBack/VoiceOver và thao tác back; ghi rõ nền tảng chưa kiểm tra |

Chạy tối thiểu trong thư mục ứng dụng Flutter:

```bash
flutter pub get
dart format --output=none --set-exit-if-changed lib test
flutter analyze
flutter test
```

Nếu dự án có `integration_test/`, chạy các bài liên quan theo cấu hình CI/thiết bị của dự án. Không tự động đòi mọi feature có integration test; chọn những hành trình mà unit/widget test không chứng minh được.

## Checklist trước khi hoàn tất

- [ ] Feature đáp ứng tiêu chí chấp nhận, gồm tải/rỗng/lỗi và quyền truy cập nếu có.
- [ ] UI không gọi trực tiếp HTTP/DB; dependency direction đúng với [02](02-ARCHITECTURE.md).
- [ ] State cục bộ và state chia sẻ đặt đúng nơi; không phát sinh request khi widget rebuild.
- [ ] Dùng theme, kiểm tra kích thước màn hình và accessibility ở luồng chính; kiểm tra trên nền tảng mục tiêu khi có môi trường và ghi rõ phần chưa kiểm tra.
- [ ] Có test cho logic/rủi ro thực tế; format, analyze và test chạy đạt.
- [ ] Cập nhật tài liệu/README nếu thêm convention, package, route hoặc bước sinh mã mới.

## Nguồn chính thức

- [Flutter: Architecture recommendations](https://docs.flutter.dev/app-architecture/recommendations)
- [Flutter: Ephemeral state and app state](https://docs.flutter.dev/data-and-backend/state-mgmt/ephemeral-vs-app)
- [Flutter: Testing overview](https://docs.flutter.dev/testing/overview)
- [Flutter: Adaptive design best practices](https://docs.flutter.dev/ui/adaptive-responsive/best-practices)
- [Flutter: Accessibility testing](https://docs.flutter.dev/ui/accessibility/accessibility-testing)
