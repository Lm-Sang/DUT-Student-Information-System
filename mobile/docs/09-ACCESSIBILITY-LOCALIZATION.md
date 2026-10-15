# 09 - Accessibility và localization

Accessibility là điều kiện hoàn thành của mọi UI, không phải bước trang trí cuối. Mỗi màn hình phải dùng được khi người dùng tăng cỡ chữ, dùng VoiceOver/TalkBack và bàn phím/thiết bị hỗ trợ. Localization áp dụng theo các ngôn ngữ sản phẩm cam kết hỗ trợ; prototype một ngôn ngữ vẫn cần câu chữ nhất quán và dễ tách ra khi mở rộng.

## Khả năng tiếp cận

- Vùng chạm tối thiểu theo nền tảng: **44 × 44 pt trên iOS** và **48 × 48 dp trên Android**. Vùng chạm có thể lớn hơn biểu tượng vẽ ra; chừa khoảng cách để tránh chạm nhầm.
- Chữ thường cần tỷ lệ tương phản ít nhất **4,5:1**, chữ lớn ít nhất **3:1**; biểu tượng/control mang thông tin phải đủ tương phản với nền. Kiểm tra cả light, dark và high contrast. Trạng thái không truyền đạt bằng màu duy nhất.
- Cho phép cỡ chữ hệ thống hoạt động. Text được xuống dòng, hàng có thể cao thêm, nút có thể rộng/cao hơn; không cố định chiều cao gây cắt chữ, không vô hiệu hóa text scaling để giữ ảnh thiết kế.
- Ưu tiên widget Flutter chuẩn vì có semantics/focus sẵn. Với icon-only button, custom control, ảnh có ý nghĩa hoặc trạng thái động, cung cấp label, hint/value/role thích hợp bằng `tooltip`, `Semantics` hoặc API tương ứng. Ẩn đồ trang trí khỏi cây semantics. Kiểm tra thứ tự đọc và focus khi bố cục đổi.
- Hành động quan trọng không chỉ có swipe/long press; thêm nút hoặc menu tương đương. Hỗ trợ focus rõ ràng cho bàn phím, Switch Access và thao tác không chạm khi có thể. Không dùng animation làm nguồn thông tin duy nhất; giảm chuyển động theo cài đặt hệ thống.
- Lỗi trường nhập phải có thông điệp cụ thể và cách sửa. Hành động mất dữ liệu khó hoàn tác cần xác nhận hoặc cơ chế hoàn tác phù hợp.

```dart
IconButton(
  tooltip: localizedDeleteLabel,
  onPressed: onDelete,
  icon: const Icon(Icons.delete_outline),
)
```

## Đa ngôn ngữ và định dạng vùng

- Ghi rõ locale sản phẩm hỗ trợ. Nếu có từ hai locale hoặc có yêu cầu đa ngôn ngữ, chọn một cơ chế localization thống nhất; Flutter có luồng ARB/`gen-l10n` chính thức. Prototype một ngôn ngữ chưa cần thêm package/cấu hình i18n, nhưng câu chữ hiển thị phải nhất quán và dễ tách khỏi widget khi mở rộng.
- Với nội dung cần dịch, dùng key có ngữ cảnh, tham số, số nhiều và giống ngữ pháp khi cần; không ghép câu từ nhiều mảnh. Bao gồm nhãn, lỗi, empty state, tooltip, semantics, thông báo và dialog. Không đưa key chưa dịch hoặc lỗi kỹ thuật ra UI; xác định fallback cho locale được hỗ trợ.
- Định dạng ngày, giờ, số và tiền theo locale được hỗ trợ; không tự nối chuỗi định dạng. Kiểm tra tiếng Việt có dấu, bản dịch dài và chữ có thể xuống dòng.
- Nếu hỗ trợ RTL, dùng `EdgeInsetsDirectional`, `AlignmentDirectional`, hướng icon phù hợp; không giả định nút Back luôn ở một tọa độ cố định. Kiểm tra đổi locale khi app đang chạy và screen reader đọc đúng ngôn ngữ.

## Gate trước khi hoàn thành UI

- [ ] VoiceOver trên iOS và TalkBack trên Android đọc đúng tên, vai trò, giá trị và thứ tự control.
- [ ] Toàn bộ luồng chính dùng được bằng phóng to chữ, keyboard/focus và không phụ thuộc gesture ẩn.
- [ ] Kiểm tra vùng chạm và tương phản trên cả light/dark; lỗi có văn bản và cách xử lý.
- [ ] Câu chữ của locale được hỗ trợ nhất quán. Nếu sản phẩm đa ngôn ngữ: không còn chuỗi cần dịch bị hard-code; bản dịch/định dạng đúng, không overflow hoặc lệch RTL nếu có hỗ trợ RTL.

## Nguồn chính thức

- [Flutter: accessibility](https://docs.flutter.dev/ui/accessibility), [UI design and styling](https://docs.flutter.dev/ui/accessibility/ui-design-and-styling), [assistive technologies](https://docs.flutter.dev/ui/accessibility/assistive-technologies), [user input and accessibility](https://docs.flutter.dev/ui/adaptive-responsive/input)
- [Flutter: internationalizing apps](https://docs.flutter.dev/ui/internationalization)
- [Apple HIG: Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility), [Gestures](https://developer.apple.com/design/human-interface-guidelines/gestures), [Motion](https://developer.apple.com/design/human-interface-guidelines/motion)
- [Android: accessibility](https://developer.android.com/design/ui/mobile/guides/foundations/accessibility)
