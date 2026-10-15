# 13 — FAQ cho dự án Flutter

Các câu trả lời dưới đây giúp tránh áp dụng máy móc một template. Nếu quy tắc riêng của repository khác với ví dụ ở đây, ưu tiên quy tắc đã được nhóm ghi lại trong dự án.

### Có phải mọi feature đều cần ba layer, use case, Cubit và `Either`?

Không. Giữ ranh giới giữa UI, trạng thái và truy cập dữ liệu; thêm abstraction khi có logic phức tạp, nhiều nguồn dữ liệu, nhu cầu thay thế hoặc kiểm thử. Chọn state management và kiểu trả lỗi theo stack đã được dự án thống nhất. Không thêm package chỉ để khớp sơ đồ ví dụ.

### Tại sao không import service/API trực tiếp trong widget?

Widget khó kiểm thử và dễ trộn hiển thị với I/O. Đưa truy cập dữ liệu qua đối tượng hoặc callback được truyền vào, rồi để UI xử lý các trạng thái loading, thành công, rỗng và lỗi. Với màn hình rất nhỏ, vẫn có thể dùng cấu trúc đơn giản mà không cần đủ ba layer.

### Có phải chạy `build_runner` sau khi thêm ảnh, route hoặc class?

Chỉ khi dự án đã cài builder theo dõi input đó. Asset thông thường được khai báo trong `pubspec.yaml`; Flutter không cần `build_runner` để dùng `Image.asset`. Xem [10 — Assets và code generation](10-ASSETS-CODE-GENERATION.md).

### Vì sao `flutter run` chưa chạy được ở `mobile/`?

Checkout hiện tại chưa có `mobile/android/` và `mobile/ios/`. Kiểm tra `flutter doctor -v`, `flutter devices` và nền tảng mà dự án hỗ trợ. Việc tạo scaffold cần quyết định của chủ dự án; iOS cần môi trường macOS/Xcode. Xem [01 — Bắt đầu](01-GETTING-STARTED.md).

### Có nên dùng cùng một giao diện cho Android và iOS?

Dùng chung luồng nghiệp vụ và design system, nhưng kiểm tra quy ước điều hướng, system bars, bàn phím, permission, cảm ứng và thành phần nền tảng trên từng hệ. Thử text scaling, SafeArea, màn hình hẹp/rộng và trạng thái sáng/tối. Chọn widget thích ứng khi khác biệt thực sự ảnh hưởng trải nghiệm.

### Màu nên đặt trong XML hay viết trực tiếp trong widget?

Flutter không yêu cầu `colors.xml`. Định nghĩa màu theo vai trò trong theme (`ColorScheme`/theme extension hoặc token của dự án) để hỗ trợ light/dark và tránh lệch màu giữa màn hình. Màu cố định chỉ dùng khi mục đích thiết kế thật sự cố định.

### Test nào là đủ cho một thay đổi?

Chọn theo rủi ro: unit test cho tính toán/validation, widget test cho tương tác/trạng thái, integration test cho luồng quan trọng khi hạ tầng thiết bị có sẵn. Không viết test chỉ so khớp implementation. Chạy `flutter analyze` và test liên quan; báo rõ môi trường chưa kiểm tra. Xem [11 — Kiểm thử và chất lượng](11-TESTING-QUALITY.md).

### Có phải tạo nhánh `develop`, stage toàn bộ rồi commit?

Không. Kiểm tra nhánh và quy trình của repository; stage đúng file/hunk thuộc tác vụ, giữ thay đổi sẵn có. Chỉ commit/push theo yêu cầu tác vụ hoặc quy trình nhóm. Xem [12 — Quy trình Git](12-GIT-WORKFLOW.md).

### Codex nên bắt đầu từ đâu khi nhận prompt mới?

Đọc `AGENTS.md` và mục lục `docs/README.md` nếu repository có, sau đó kiểm tra mã, `pubspec.yaml`, Git status và tài liệu tương ứng với phần sẽ sửa. Nêu giả định còn thiếu, kiểm tra thay đổi và báo kết quả/giới hạn. Quy tắc tài liệu phải được đối chiếu với cấu hình thực tế, không giả định ví dụ là code đang tồn tại.

## Tài liệu gốc

- [Flutter: hướng dẫn kiến trúc ứng dụng](https://docs.flutter.dev/app-architecture/guide)
- [Flutter: thích ứng theo Android và iOS](https://docs.flutter.dev/ui/adaptive-responsive/platform-adaptations)
- [Flutter: dùng theme cho màu và chữ](https://docs.flutter.dev/cookbook/design/themes)
