# 10 — Assets và code generation

Quản lý tài nguyên tại **thư mục chứa `pubspec.yaml`**. Không giả định mọi dự án có FlutterGen, `build.yaml` hay `colors.xml`. Các quyết định về màu và typography thuộc quy tắc theme/giao diện của dự án.

## 1. Thêm ảnh, icon và dữ liệu tĩnh

1. Đặt tên file dễ tìm, ví dụ `student_avatar_placeholder.png`; tối ưu kích thước và xác nhận quyền sử dụng.
2. Đặt file trong thư mục tài nguyên của package, ví dụ `assets/images/logo.png`.
3. Khai báo đường dẫn tương đối trong `pubspec.yaml`:

```yaml
flutter:
  assets:
    - assets/images/logo.png
```

4. Chạy `flutter pub get`, rồi dùng `Image.asset('assets/images/logo.png')`. Với ảnh có ý nghĩa, cung cấp `semanticLabel`; với ảnh trang trí, tránh mô tả thừa.
5. Kiểm tra trên thiết bị hoặc widget test nếu thay đổi ảnh ảnh hưởng bố cục.

Nếu khai báo cả thư mục bằng `assets/images/`, Flutter chỉ tự lấy các file trực tiếp trong thư mục đó (ngoại trừ biến thể độ phân giải). Khai báo riêng từng thư mục con. SVG cần package và widget hỗ trợ SVG do dự án chọn; `Image.asset` không tự render SVG.

## 2. Thêm font

Khai báo mỗi weight/style thật sự có file tương ứng; không ép cỡ chữ cố định làm mất khả năng phóng to văn bản.

```yaml
flutter:
  fonts:
    - family: AppFont
      fonts:
        - asset: assets/fonts/AppFont-Regular.ttf
        - asset: assets/fonts/AppFont-Bold.ttf
          weight: 700
```

Dùng tên family qua theme của ứng dụng. Thử dấu tiếng Việt, font weight và text scaling trên cả Android/iOS.

## 3. Khi nào chạy code generation?

| Trường hợp | Việc cần làm |
| --- | --- |
| Chỉ thêm/sửa Dart, widget, PNG hoặc font mà không có builder theo dõi input đó | Không chạy `build_runner`. |
| Dự án đã cài một builder và vừa sửa input của builder | Chạy lệnh được dự án/builder hướng dẫn; kiểm tra output. |
| Dự án dùng localization từ ARB | Cấu hình `flutter: generate: true` và `flutter_localizations` theo tài liệu Flutter, rồi chạy `flutter gen-l10n` khi cần. |

Nếu dự án **đã có** `build_runner` trong `dev_dependencies` và builder tương ứng, lệnh thường dùng là:

```sh
dart run build_runner build
```

Chỉ dùng `--delete-conflicting-outputs` sau khi hiểu file nào sẽ bị thay thế. Không sửa tay file generated; thay input/config rồi generate lại. Quyết định commit generated files theo quy ước của dự án và nhu cầu build tái lập trong CI.

**Repository hiện tại:** `mobile/pubspec.yaml` chưa khai báo asset, font hoặc `build_runner`; không có `assets/` hay `build.yaml` trong `mobile/`. Quy trình trên chỉ áp dụng khi bổ sung chúng.

## Tài liệu gốc

- [Flutter: thêm assets và images](https://docs.flutter.dev/ui/assets/assets-and-images)
- [Flutter: cấu hình font trong pubspec](https://docs.flutter.dev/cookbook/design/fonts)
- [Dart: `build_runner`](https://dart.dev/tools/build_runner)
- [Flutter: internationalization và `gen-l10n`](https://docs.flutter.dev/ui/internationalization)
