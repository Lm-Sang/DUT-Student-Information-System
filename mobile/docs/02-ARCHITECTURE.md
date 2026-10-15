# 02 — Kiến trúc ứng dụng Flutter

Tài liệu này là quy tắc mặc định cho **dự án Flutter mới** và phần code mới được tổ chức lại. `mobile/` của repository hiện là prototype nhỏ với `screens/`, `services/`, `models/` và dữ liệu giả; các lớp và thư mục dưới đây là **cấu trúc mục tiêu**, không phải mô tả hiện trạng. Khi sửa prototype, chỉ tách lớp ở phạm vi feature đang làm và giữ ứng dụng chạy được.

## 1. Ranh giới trách nhiệm

| Thành phần | Trách nhiệm | Không làm |
| --- | --- | --- |
| UI (screen, widget) | Hiển thị state, nhận thao tác, bố cục và điều hướng đơn giản | Gọi HTTP/DB, xử lý nghiệp vụ, ghi dữ liệu trong `build()` |
| UI logic (view model, controller, Cubit, v.v.) | Chuyển dữ liệu thành UI state, xử lý sự kiện và trạng thái tải/lỗi | Biết chi tiết HTTP, SQL, storage hoặc plugin |
| Repository | Nguồn dữ liệu đáng tin cậy cho một loại dữ liệu; phối hợp cache, lưu, đồng bộ và chuyển đổi dữ liệu | Chứa `BuildContext` hay widget |
| Service/data source | Giao tiếp với một nguồn bên ngoài như API, DB, file hoặc platform plugin | Quản lý UI state hoặc quyết định giao diện |
| Domain (khi cần) | Quy tắc nghiệp vụ dùng chung hoặc phức tạp, model và hợp đồng độc lập với hạ tầng | Phụ thuộc Flutter hoặc SDK của nguồn dữ liệu |

Luôn có **ranh giới UI và data**. Chỉ thêm domain/use case khi một quy tắc cần phối hợp nhiều repository, được dùng lại hoặc làm UI logic phình to. Không tạo một use case cho mỗi thao tác chỉ để đủ thư mục.

### Hướng phụ thuộc

```text
Hai lớp:  UI → Repository contract ← Repository implementation → Service

Có domain: UI → Domain contract ← Data implementation → Service
```

Đặt hợp đồng repository trong `data/repositories/` với thiết kế hai lớp; chuyển hợp đồng và model nghiệp vụ sang `domain/` nếu dự án chọn lớp domain. UI chỉ dùng hợp đồng, không dùng DTO, service hoặc implementation. Tạo implementation và truyền dependency ở điểm khởi tạo ứng dụng/feature; tránh tạo API client mới trong `build()` hoặc dùng đối tượng toàn cục có thể thay đổi.

## 2. Luồng dữ liệu và state

```text
Thao tác người dùng → UI logic → Repository → Service/data source
                                      ↓
UI render ← UI state mới ← dữ liệu/kết quả đã chuẩn hóa
```

- Repository giữ **single source of truth** cho dữ liệu có thể thay đổi; state đi lên UI, sự kiện đi xuống repository. Model/state phát ra cho UI nên bất biến.
- State chỉ dùng trong một widget, như tab đang chọn hay animation, có thể ở `StatefulWidget` với `setState`. State cần chia sẻ, lưu qua phiên làm việc hoặc chứa quy tắc nghiệp vụ thuộc UI logic/repository phù hợp.
- Chọn cách quản lý **state chia sẻ/app state** nhất quán trong mỗi dự án; state cục bộ vẫn có thể dùng `StatefulWidget`/`setState`. `ChangeNotifier`, Cubit/BLoC, Riverpod và các cách khác là lựa chọn triển khai, không phải quy tắc kiến trúc. Tránh trộn nhiều cơ chế cho cùng một loại state nếu không có lý do rõ ràng.
- UI phải thể hiện các trạng thái có ý nghĩa: tải, có dữ liệu, rỗng và lỗi. Không kích hoạt request trong `build()` vì rebuild có thể gọi lại request.

Ví dụ hợp đồng có thể thay bằng fake trong test, không phụ thuộc package state management:

```dart
class Student {
  const Student({required this.id, required this.name});

  final String id;
  final String name;
}

abstract interface class StudentRepository {
  Future<Student> getStudent(String id);
}

final class StudentViewModel {
  StudentViewModel(this._repository);

  final StudentRepository _repository;

  Future<Student> loadStudent(String id) => _repository.getStudent(id);
}
```

## 3. Lỗi và dữ liệu

- Service xử lý giao thức và trả dữ liệu thô/DTO. Repository kiểm tra dữ liệu, chuyển DTO sang model ứng dụng khi cần, và quyết định cache/retry. Không tạo cặp DTO và domain model nếu chúng giống nhau và không có lợi ích rõ ràng.
- Chặn lỗi ở **ranh giới có thể xử lý**: ví dụ repository chuyển lỗi mạng hoặc định dạng thành lỗi ứng dụng có kiểu; UI logic đổi lỗi đó thành state và thông báo dễ hiểu. Không bắt mọi lỗi rồi trả dữ liệu giả như thành công; giữ nguyên stack trace hoặc log có ngữ cảnh khi chuyển lỗi.
- Chọn một giao ước lỗi nhất quán cho dự án: exception có kiểu, sealed result hoặc `Either`. Không bắt buộc thêm thư viện chỉ để trả `Either`.
- Timeout, retry và offline/cache là quyết định theo yêu cầu sản phẩm. Không retry thao tác ghi có thể bị lặp khi chưa có chiến lược an toàn.

## 4. Kiểm chứng ranh giới

Test logic của repository bằng fake service và test UI logic bằng fake repository; widget test kiểm tra màn hình theo state. Thêm integration test cho luồng quan trọng qua nhiều lớp. Chi tiết thực hiện ở [04 — Quy trình làm feature](04-FEATURE-WORKFLOW.md).

## Nguồn chính thức

- [Flutter: Guide to app architecture](https://docs.flutter.dev/app-architecture/guide)
- [Flutter: Architecture recommendations](https://docs.flutter.dev/app-architecture/recommendations)
- [Flutter: Common architecture concepts](https://docs.flutter.dev/app-architecture/concepts)
- [Flutter: Ephemeral state and app state](https://docs.flutter.dev/data-and-backend/state-mgmt/ephemeral-vs-app)
