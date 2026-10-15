# 05 - Design system và trạng thái giao diện

## Phạm vi

Áp dụng cho mọi màn hình Flutter của dự án mới. Trước khi dựng màn hình, xác định **vai trò của nội dung**, **hành động chính**, **trạng thái dữ liệu** và **quy ước iOS/Android**. Một component chỉ được dùng chung khi cùng ý nghĩa và hành vi trên các màn hình.

## Nguồn quy tắc trong mã

- Đặt màu, kiểu chữ, khoảng cách, bo góc, độ nổi, kích thước biểu tượng và thời lượng chuyển động trong một hệ token có tên theo **vai trò**. Ví dụ: `surface`, `onSurface`, `error`, `bodyMedium`, `space16`; tránh tên như `blue2` hoặc giá trị rải trong widget.
- Dùng `ThemeData`, `ColorScheme`, `TextTheme` và component theme cho giao diện Material. Nếu chọn Cupertino trên iOS, ánh xạ cùng vai trò thiết kế sang `CupertinoThemeData` hoặc cấu hình tương ứng. Màu tùy biến ngoài `ColorScheme` cần một extension/token có cặp màu chữ phù hợp.
- Định nghĩa light và dark theme; mặc định theo lựa chọn hệ thống trừ khi sản phẩm có yêu cầu khác được ghi rõ. Kiểm tra trường hợp hệ thống đổi theme khi app đang mở. Nếu dùng dynamic color trên Android, phải có bảng màu dự phòng và kiểm tra thương hiệu/độ tương phản.
- Text dùng `Theme.of(context).textTheme` hoặc token tương đương. Không tự đặt font size riêng trên từng màn hình để chữa layout; giữ việc phóng to chữ của hệ điều hành hoạt động.
- Spacing là khoảng cách giữa phần tử, không phải phép nhân theo kích thước thiết bị. Dùng `Padding`, `SizedBox`, `Flexible`, `Expanded` và constraints theo ngữ cảnh. Không áp dụng `.w`, `.h`, `.sp` cho mọi kích thước hoặc chữ.
- Asset được đặt tên theo nội dung/vai trò; có bản phù hợp cho light/dark khi cần. Biểu tượng hành động phải có nhãn hoặc tooltip dễ hiểu; ảnh mang thông tin cần mô tả ngữ nghĩa.

```dart
final colors = Theme.of(context).colorScheme;
final text = Theme.of(context).textTheme;

Text(
  title,
  style: text.titleLarge?.copyWith(color: colors.onSurface),
)
```

## Contract của component

Mỗi component dùng lại phải nêu rõ: dữ liệu đầu vào, callback, biến thể (`primary`, `secondary`, `destructive` nếu có), trạng thái enabled/disabled, hành vi khi loading, cách đọc bằng screen reader và cách hoạt động ở cỡ chữ lớn. Style mặc định lấy từ theme; màn hình chỉ ghi đè khi có lý do thiết kế được ghi trong mô tả thay đổi.

Không dùng màu làm tín hiệu duy nhất: trạng thái lỗi/thành công cần văn bản hoặc biểu tượng đi kèm. Nút phá hủy không dùng style của hành động chính. Animation chỉ dùng để giải thích thay đổi/trả phản hồi, phải ngắn và tôn trọng Reduce Motion.

## Trạng thái bắt buộc của màn hình dữ liệu

| Trạng thái | Quy tắc hiển thị |
| --- | --- |
| Loading | Cho biết vùng nào đang tải; giữ bố cục ổn định, tránh chặn toàn màn hình nếu phần còn lại vẫn dùng được. |
| Empty | Nói rõ vì sao chưa có dữ liệu và đưa hành động tiếp theo nếu người dùng có thể xử lý. |
| Error | Nêu lỗi bằng lời dễ hiểu, đặt gần nội dung liên quan và có Retry khi hợp lý. Không hiện lỗi kỹ thuật thô. |
| Success | Hiển thị nội dung thật, trạng thái chọn/không chọn và phản hồi sau hành động. |

Trường nhập liệu còn có trạng thái focus, invalid, disabled và submitting. Hiển thị lỗi cạnh trường tương ứng; không chỉ đổi màu viền. Không tạo màn hình thành công khi thao tác chưa hoàn tất.

## Khi review hoặc giao việc cho Codex

- [ ] Có nguồn token/theme duy nhất và cặp màu foreground/background đạt tương phản.
- [ ] Component được định nghĩa theo vai trò, có trạng thái và semantics; không sao chép style ở nhiều màn hình.
- [ ] Có thiết kế cho loading, empty, error, success và kiểm tra light/dark, chữ lớn.
- [ ] Giá trị kích thước cố định có lý do nội dung; không scale toàn giao diện theo một thiết bị mẫu.

## Nguồn chính thức

- [Flutter: dùng theme để chia sẻ màu và kiểu chữ](https://docs.flutter.dev/cookbook/design/themes)
- [Flutter: typography](https://docs.flutter.dev/ui/design/text/typography)
- [Apple HIG: Color](https://developer.apple.com/design/human-interface-guidelines/color), [Dark Mode](https://developer.apple.com/design/human-interface-guidelines/dark-mode), [Motion](https://developer.apple.com/design/human-interface-guidelines/motion)
- [Android: color](https://developer.android.com/design/ui/mobile/guides/styles/color), [themes](https://developer.android.com/design/ui/mobile/guides/styles/themes)
