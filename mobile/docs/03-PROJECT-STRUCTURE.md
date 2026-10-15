# 03 — Cấu trúc và quy ước đặt tên

Cấu trúc dưới đây là **mẫu cho dự án Flutter mới**, không phải cây thư mục hiện có. `mobile/lib/` hiện là prototype với `screens/`, `services/`, `models/` và `data/`; khi phát triển tiếp, chuyển dần feature đang sửa, không đổi tên toàn bộ ứng dụng chỉ để khớp tài liệu.

## 1. Cây thư mục mục tiêu

```text
<flutter_app>/                       # thư mục chứa pubspec.yaml; repo này dùng mobile/
├── lib/
│   ├── main.dart                     # entry point, khởi tạo app
│   ├── app/                          # app widget, route, ghép dependency
│   ├── core/                         # hạ tầng dùng toàn ứng dụng: config, error, theme
│   ├── features/
│   │   └── student/
│   │       ├── data/
│   │       │   ├── repositories/     # hợp đồng + implementation khi dùng hai lớp
│   │       │   ├── services/         # API, database, storage, platform plugin
│   │       │   └── models/           # DTO nếu khác model ứng dụng
│   │       ├── presentation/
│   │       │   ├── student_screen.dart
│   │       │   ├── student_view_model.dart
│   │       │   └── widgets/          # widget riêng của feature
│   │       └── domain/               # tùy chọn: model, hợp đồng, logic phức tạp
│   └── shared/
│       └── widgets/                  # component UI ổn định, dùng chung
├── test/                             # unit/widget tests, phản chiếu code được test
├── integration_test/                 # các luồng xuyên ứng dụng khi cần
└── assets/                           # ảnh, font, icon; khai báo trong pubspec.yaml
```

Chỉ tạo thư mục khi có file thật. Một màn hình tĩnh không cần tự động có `domain/`, repository, service hoặc code generation. Nếu dự án chọn domain layer, đặt repository contract và model nghiệp vụ ở `domain/`; data implementation phụ thuộc vào contract đó. Giữ các file phụ thuộc trực tiếp vào một feature **bên trong feature**.

## 2. Đặt file ở đâu

| Thay đổi | Vị trí mặc định |
| --- | --- |
| Screen và UI state của một feature | `features/<feature>/presentation/` |
| Component chỉ dùng trong feature | `features/<feature>/presentation/widgets/` |
| API/DB/storage và chuyển đổi dữ liệu | `features/<feature>/data/` |
| Quy tắc nghiệp vụ dùng lại hoặc phối hợp nhiều nguồn dữ liệu | `features/<feature>/domain/` nếu cần |
| Route và lắp dependency ở cấp ứng dụng | `app/` |
| Theme, cấu hình và hạ tầng có phạm vi toàn ứng dụng | `core/` |
| Component UI dùng thực sự ở nhiều feature, có API ổn định | `shared/widgets/` |

Không biến `core/` hay `shared/` thành nơi chứa file chưa biết đặt ở đâu. Khi hai feature cần cùng dữ liệu, chia sẻ qua repository có phạm vi phù hợp thay vì import file presentation của nhau. Không import implementation của feature khác qua đường dẫn nội bộ; nếu cần, trích xuất hợp đồng dùng chung rõ ràng.

## 3. Quy ước tên và import

| Đối tượng | Quy tắc Dart | Ví dụ |
| --- | --- | --- |
| Thư mục, package, file | `lowercase_with_underscores` | `student_profile/`, `student_repository.dart` |
| Class, enum, typedef, extension | `UpperCamelCase` | `StudentProfileScreen` |
| Biến, hàm, tham số, hằng số | `lowerCamelCase` | `loadStudent`, `studentId` |
| Thành viên riêng của library | tiền tố `_` | `_repository` |

Tên file phản ánh vai trò: `student_screen.dart`, `student_repository.dart`, `api_student_repository.dart`. Dùng tên feature theo nghiệp vụ người dùng, không dùng `common`, `helper`, `manager` như tên tổng quát nếu có thể đặt rõ hơn. Sắp xếp `dart:` imports trước `package:` rồi relative imports; dùng `dart format` và `analysis_options.yaml` thay vì căn chỉnh thủ công.

Ví dụ file `features/student/data/models/student_summary.dart` (chỉ tạo model riêng nếu dữ liệu cần kiểu này):

```dart
class StudentSummary {
  const StudentSummary({required this.id, required this.fullName});

  final String id;
  final String fullName;
}
```

## 4. Quy tắc mở rộng

- `main.dart` chỉ khởi tạo ứng dụng và dependency cấp cao; cấu hình route/theme nằm ở `app/` hoặc `core/` theo trách nhiệm.
- Không thêm package, generator hoặc tầng trừu tượng vì mẫu thư mục gợi ý. Khi package cần sinh mã, ghi rõ lệnh sinh, file đầu vào và file đầu ra trong hướng dẫn dự án đó.
- Test nên nằm gần tên feature tương ứng dưới `test/features/<feature>/`; test xuyên luồng ở `integration_test/`.
- Nếu cấu trúc dự án khác mẫu, ghi quyết định vào README/ADR và dùng nhất quán; ưu tiên ranh giới rõ ràng hơn tên thư mục chính xác.

Xem [02 — Kiến trúc](02-ARCHITECTURE.md) để hiểu hướng phụ thuộc và [04 — Quy trình làm feature](04-FEATURE-WORKFLOW.md) để áp dụng cây thư mục này.

## Nguồn chính thức

- [Flutter: Architecture case study và cấu trúc thư mục](https://docs.flutter.dev/app-architecture/case-study)
- [Flutter: Architecture recommendations](https://docs.flutter.dev/app-architecture/recommendations)
- [Dart: Effective Dart — Style](https://dart.dev/effective-dart/style)
- [Dart: Customizing static analysis](https://dart.dev/tools/analysis)
- [Dart: dart format](https://dart.dev/tools/dart-format)
