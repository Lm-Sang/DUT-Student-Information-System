# Quy tắc làm việc cho dự án Flutter

Bộ tài liệu này dành cho dev và Codex khi xây dựng hoặc mở rộng ứng dụng Flutter trên Android và iOS. Đọc **01 → 04** để nắm quy trình kỹ thuật; đọc **05 → 09** trước khi làm UI; dùng **10 → 13** khi thêm tài nguyên, kiểm thử, review và xử lý tình huống thường gặp.

## Phạm vi và cách áp dụng

1. **Quy tắc** trong tài liệu là chuẩn mặc định cho phần việc mới. Nếu dự án đã có quyết định kiến trúc hoặc thiết kế được ghi rõ, dùng quyết định đó và cập nhật tài liệu khi thay đổi.
2. **Ví dụ** chỉ minh họa cách làm, không hàm ý package hoặc file đã tồn tại. Trước khi code, kiểm tra `pubspec.yaml`, `analysis_options.yaml`, mã nguồn và cấu hình nền tảng.
3. Với repo này, ứng dụng Flutter ở `mobile/` hiện là bản mẫu nhỏ dùng `screens/`, `services/`, `models/`, `widgets/`; chưa dùng cấu trúc feature, thư viện quản lý state hay code generation được mô tả trong tài liệu cũ. Không tự đổi toàn bộ cấu trúc chỉ vì tài liệu mới; áp dụng dần theo phạm vi task.
4. Khi tạo dự án Flutter khác, ghi vào README của dự án: nền tảng hỗ trợ, cách chạy, lựa chọn state/routing/DI, nguồn token thiết kế, lệnh code generation nếu có và các quyết định khác với mặc định ở đây.

## Thứ tự đọc

| Số | Tài liệu | Khi cần đọc |
| --- | --- | --- |
| 01 | [Bắt đầu và kiểm tra dự án](01-GETTING-STARTED.md) | Setup, xác nhận trạng thái repo và công cụ |
| 02 | [Kiến trúc và luồng dữ liệu](02-ARCHITECTURE.md) | Ranh giới UI, data, domain và state |
| 03 | [Cấu trúc thư mục](03-PROJECT-STRUCTURE.md) | Đặt file, đặt tên và mở rộng cấu trúc |
| 04 | [Quy trình làm feature](04-FEATURE-WORKFLOW.md) | Đi từ yêu cầu đến triển khai và review |
| 05 | [Hệ thống thiết kế](05-DESIGN-SYSTEM.md) | Token, theme, trạng thái và thành phần UI |
| 06 | [Điều hướng](06-NAVIGATION.md) | Route, tab, back và cấu trúc thông tin |
| 07 | [Bố cục thích ứng](07-ADAPTIVE-LAYOUT.md) | Điện thoại, tablet, xoay màn hình, cửa sổ nhỏ |
| 08 | [Giao diện iOS và Android](08-IOS-ANDROID-UI.md) | Quy ước riêng từng nền tảng |
| 09 | [Accessibility và ngôn ngữ](09-ACCESSIBILITY-LOCALIZATION.md) | Chữ lớn, semantics, tương phản, bản địa hóa |
| 10 | [Assets và code generation](10-ASSETS-CODE-GENERATION.md) | Ảnh, font, icon, file sinh tự động |
| 11 | [Kiểm thử và chất lượng](11-TESTING-QUALITY.md) | Test, lint, review và tiêu chí hoàn thành |
| 12 | [Git workflow](12-GIT-WORKFLOW.md) | Branch, commit và pull request |
| 13 | [Câu hỏi thường gặp](13-FAQ.md) | Quyết định nhanh khi có ngoại lệ |

## Quy trình ngắn cho một task

1. Xác định yêu cầu, nền tảng mục tiêu và trạng thái code hiện tại.
2. Đọc các chương liên quan; chốt các lựa chọn còn mở bằng quy ước của dự án.
3. Triển khai theo ranh giới dữ liệu và UI; với UI, kiểm tra các trạng thái loading, empty, error, success.
4. Chạy format, analyze và test phù hợp; kiểm tra trực quan trên kích thước và nền tảng liên quan.
5. Cập nhật tài liệu khi thay đổi một quy tắc, cấu trúc hoặc workflow chung.

## Nguồn chuẩn

Các chương dẫn liên kết trực tiếp đến tài liệu chính thức của [Flutter](https://docs.flutter.dev/), [Dart](https://dart.dev/), [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/) và [Android Developers](https://developer.android.com/design/). Khi API hoặc hướng dẫn nền tảng thay đổi, kiểm tra nguồn trước khi nâng cấp SDK hoặc sửa quy tắc.
