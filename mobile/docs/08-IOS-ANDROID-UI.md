# 08 - Quy ước giao diện iOS và Android

## Chọn mức thích ứng của sản phẩm

Trước khi tạo UI, ghi trong brief của feature phần nào dùng nhận diện chung (màu, nội dung, cấu trúc) và phần nào theo nền tảng (điều hướng, control, dialog, transition). Flutter tự thích ứng một số hành vi hệ điều hành nhưng **không tự quyết định** mọi mẫu giao diện. Một màn hình có thể dùng Material trên cả hai nền tảng nếu đó là quyết định sản phẩm; khi chọn giao diện theo nền tảng, giữ cùng dữ liệu và tác vụ nhưng thay control đúng quy ước. Không trộn widget Material/Cupertino tùy tiện làm lệch Back, semantics hoặc trạng thái.

| Tình huống | iOS | Android |
| --- | --- | --- |
| Điều hướng cấp cao | Tab bar có nhãn, dùng cho khu vực nội dung; cân nhắc sidebar trên không gian lớn. | Material 3 navigation bar cho ít điểm đến ngang cấp; rail/drawer khi không gian hoặc số mục cần. |
| Màn hình con | Navigation toolbar có Back; modal có Close/Cancel; giữ cạnh vuốt Back như lối tắt khi phù hợp. | Top app bar thể hiện cấp hiện tại; hệ thống Back/gesture đóng đúng lớp và tương thích predictive back. |
| Hành động | Đặt hành động trong toolbar hoặc cạnh nội dung liên quan; tab không chứa lệnh. | Hành động chính có thể dùng một FAB nếu phù hợp; hành động phụ nằm trong top bar, nội dung hoặc overflow. |
| Chọn lựa/xác nhận | Action sheet cho các lựa chọn của một hành động; alert ngắn cho thông tin cần phản hồi ngay hoặc xác nhận mất dữ liệu khó hoàn tác. | Dùng menu, bottom sheet hoặc dialog Material 3 theo mức độ gián đoạn; không dùng dialog cho mọi thông báo. |

Các widget Flutter có thể cân nhắc: `CupertinoNavigationBar`, `CupertinoTabScaffold`, `CupertinoActionSheet` cho luồng iOS; `AppBar`, `NavigationBar`, `NavigationRail`, `FloatingActionButton` cho luồng Material. Chọn API theo version Flutter của dự án; không ngầm coi các widget/package này đã được cấu hình trong app hiện tại.

## Quy tắc chung trên hai hệ điều hành

- Tôn trọng safe area/system insets, các vùng cử chỉ và bàn phím. Trên Android, nền/nội dung cuộn có thể vẽ edge-to-edge nhưng control cần insets; kiểm thử cả gesture navigation và 3-button navigation.
- Theo light/dark mode hệ thống, dùng màu theo vai trò và kiểm tra trạng thái tăng tương phản. iOS ưu tiên màu/ngữ nghĩa quen thuộc của hệ thống khi dùng giao diện Cupertino; Android Material 3 dùng color roles, có thể dùng dynamic color nếu sản phẩm cho phép và có fallback.
- Dùng gesture chuẩn; lệnh quan trọng luôn có nút/menu thay thế. Không chiếm cạnh vuốt của hệ thống hoặc đổi nghĩa tap/swipe. Animation phải có phản hồi rõ và giảm khi hệ thống yêu cầu Reduce Motion.
- Không ẩn status bar hay tự tạo control hệ thống chỉ để đạt ảnh thiết kế. Nếu thiết kế yêu cầu khác chuẩn, ghi lý do, kiểm tra accessibility và thử trên thiết bị thật.

## Checklist review hai nền tảng

- [ ] Back/Close, tab, sheet/dialog và thanh hệ thống theo đúng kỳ vọng của từng OS.
- [ ] Màn hình hoạt động khi đổi light/dark, cỡ chữ, gesture/3-button navigation và keyboard.
- [ ] Nút và menu có nhãn; thao tác quan trọng không chỉ tồn tại dưới dạng gesture.
- [ ] Phần dùng chung giữ tính nhất quán của sản phẩm; phần khác biệt nền tảng được quyết định có chủ ý.

## Nguồn chính thức

- [Flutter: automatic platform adaptations](https://docs.flutter.dev/ui/adaptive-responsive/platform-adaptations), [platform idioms](https://docs.flutter.dev/ui/adaptive-responsive/idioms)
- [Apple HIG: Layout](https://developer.apple.com/design/human-interface-guidelines/layout), [Tab bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars), [Toolbars](https://developer.apple.com/design/human-interface-guidelines/toolbars), [Alerts](https://developer.apple.com/design/human-interface-guidelines/alerts), [Gestures](https://developer.apple.com/design/human-interface-guidelines/gestures)
- [Android: navigation patterns](https://developer.android.com/design/ui/mobile/guides/layout-and-content/layout-and-nav-patterns), [system bars](https://developer.android.com/design/ui/mobile/guides/foundations/system-bars), [predictive back](https://developer.android.com/design/ui/mobile/guides/patterns/predictive-back)
