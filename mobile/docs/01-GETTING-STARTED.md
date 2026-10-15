# 01 — Bắt đầu với dự án Flutter

Tài liệu này là quy tắc dùng lại cho ứng dụng Flutter. Trước khi làm việc, hãy kiểm tra dự án thực tế; tên thư mục, nền tảng và package trong ví dụ không phải yêu cầu chung.

## 1. Khảo sát trước khi sửa

- Tìm thư mục chứa `pubspec.yaml`. Chạy lệnh Flutter và Dart **tại thư mục đó**, không mặc định chạy ở gốc repository.
- Đọc `pubspec.yaml`, `analysis_options.yaml`, `README.md` và các quy tắc của dự án trước khi chọn SDK, package hoặc cấu trúc thư mục.
- Kiểm tra `git status --short`; giữ nguyên thay đổi chưa commit của người khác.
- Kiểm tra các thư mục nền tảng (`android/`, `ios/`, v.v.) trước khi đề xuất chạy ứng dụng trên thiết bị.

Trong repository này, ứng dụng Flutter nằm ở `mobile/`. `mobile/pubspec.yaml` khai báo Dart `>=3.3.0 <4.0.0`; dependencies trực tiếp hiện có là Flutter và `cupertino_icons`, dev dependencies là `flutter_test` và `flutter_lints`. Không giả định các package như Bloc, auto_route, build_runner hay FlutterGen đã được cài.

## 2. Kiểm tra môi trường và lấy dependencies

```sh
flutter --version
flutter doctor -v
cd mobile
flutter pub get
```

Dùng phiên bản Flutter có Dart SDK thỏa `environment.sdk` của dự án. Xử lý lỗi toolchain do `flutter doctor -v` báo trước khi build cho nền tảng tương ứng. Với ứng dụng, giữ `pubspec.lock` trong version control để nhóm dùng cùng phiên bản package đã resolve.

## 3. Chạy và kiểm tra

```sh
flutter analyze
flutter test
flutter devices
```

Chỉ chạy `flutter run -d <device-id>` khi nền tảng đích đã có thư mục scaffold, toolchain hợp lệ và thiết bị xuất hiện trong `flutter devices`. iOS cần môi trường macOS/Xcode phù hợp.

**Tình trạng checkout hiện tại:** `mobile/` chưa có `android/` hoặc `ios/`, nên không hứa rằng `flutter run` trên Android/iOS sẽ hoạt động ngay. Nếu chủ dự án quyết định thêm nền tảng, thực hiện trong `mobile/` trên môi trường thích hợp:

```sh
flutter create --platforms=android,ios .
```

Sau đó xem kỹ `git diff` và cấu hình bundle ID, signing, quyền truy cập, min SDK theo yêu cầu dự án trước khi commit. Không chạy lệnh tạo scaffold như bước cài đặt mặc định.

## 4. Quy tắc khi bắt đầu tác vụ

1. Xác nhận mục tiêu, luồng người dùng, nền tảng hỗ trợ và tiêu chí hoàn thành.
2. Chọn giải pháp nhỏ nhất phù hợp với mã hiện có; chỉ thêm dependency khi có lợi ích rõ ràng và đã kiểm tra tương thích SDK.
3. Với giao diện, xem quy tắc theme, điều hướng và thiết kế thích ứng của bộ tài liệu này.
4. Chạy format, analyze và kiểm thử tương ứng với phần đã sửa; ghi lại giới hạn nếu không thể kiểm tra trên thiết bị.

## Tài liệu gốc

- [Flutter CLI: create, doctor, devices, analyze, test, run](https://docs.flutter.dev/reference/flutter-cli)
- [Quản lý dependencies và `pubspec.lock`](https://docs.flutter.dev/packages-and-plugins/dependency-management)
