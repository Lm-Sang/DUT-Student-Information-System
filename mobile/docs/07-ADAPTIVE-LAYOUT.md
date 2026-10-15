# 07 - Bố cục thích ứng theo cửa sổ

## Nguyên tắc quyết định

Responsive là làm nội dung vừa không gian; adaptive là chọn cách bố trí và điều hướng dùng được trong không gian đó. Đo **cửa sổ app hiện tại** bằng `MediaQuery.sizeOf(context)` khi quyết định toàn màn hình; dùng `LayoutBuilder` khi một component cần biết constraints của vùng cha. Không suy luận từ model iPhone/iPad, `Platform`, chiều xoay hoặc kích thước màn hình vật lý. Breakpoint phải xuất phát từ chiều rộng tối thiểu mà **nội dung thực tế** cần; ghi lý do khi tạo breakpoint dùng chung.

```dart
LayoutBuilder(
  builder: (context, constraints) {
    final canShowTwoPanes = constraints.maxWidth >= minListWidth + gap + minDetailWidth;
    return canShowTwoPanes
        ? Row(
            children: [
              SizedBox(width: minListWidth, child: listPane),
              SizedBox(width: gap),
              Expanded(child: detailPane),
            ],
          )
        : listPane;
  },
)
```

Trong ví dụ, `minListWidth`, `minDetailWidth` và `gap` là token/giới hạn rút ra từ nội dung của màn hình, không phải tên thiết bị hay kích thước iPhone cụ thể.

## Quy tắc bố cục

- Dùng `SafeArea`/insets để giữ chữ và control khỏi status bar, camera cutout, góc màn hình, home indicator và bàn phím. Có thể cho nền hoặc nội dung cuộn vẽ edge-to-edge; không đặt mục tiêu chạm hay kéo tại vùng cử chỉ hệ thống. Tránh cộng insets hai lần.
- Trên vùng hẹp, nội dung ưu tiên một cột, scroll khi cần; không cắt chữ/nút để ép vừa. Trên vùng rộng, đặt `maxWidth` cho văn bản/form/card và cân nhắc nhiều pane, grid hoặc rail nếu tăng khả năng sử dụng.
- Dùng `Flexible`, `Expanded`, `Wrap`, constraints và kích thước nội tại theo chức năng. Grid tính số cột từ chiều rộng ô tối thiểu và khoảng cách; không đặt số cột theo “điện thoại/tablet”. Ảnh giữ tỷ lệ hoặc crop có chủ ý.
- Không khóa hướng màn hình cho tác vụ thông thường. Khi xoay, chia đôi cửa sổ, mở bàn phím hoặc gập máy, giữ dữ liệu nhập, vị trí đọc và trạng thái điều hướng hợp lý.
- Font hệ thống lớn có thể làm hàng ngang thành cột, hàng danh sách cao hơn và nhãn nhiều dòng. Không ép text scale về 1.0, không dùng `.w/.sp` hàng loạt để che lỗi layout.

## Ma trận kiểm tra cho mỗi màn hình

| Tình huống | Điều cần quan sát |
| --- | --- |
| Cửa sổ hẹp, thường, rộng | Không overflow; thứ tự đọc và hành động chính vẫn rõ; bố cục chuyển đúng lúc nội dung không còn đủ chỗ. |
| Dọc, ngang, split screen | State không mất, form không bị kéo giãn; điều hướng đổi dạng khi cần. |
| Font lớn, nội dung dài, RTL | Chữ không cắt/đè; control vẫn chạm được; thứ tự và căn lề đúng. |
| Notch/cutout, thanh hệ thống, bàn phím | Nội dung quan trọng và hành động không bị che; scroll đến trường đang nhập được. |

## Nguồn chính thức

- [Flutter: adaptive and responsive design](https://docs.flutter.dev/ui/adaptive-responsive), [general approach](https://docs.flutter.dev/ui/adaptive-responsive/general), [best practices](https://docs.flutter.dev/ui/adaptive-responsive/best-practices), [SafeArea and MediaQuery](https://docs.flutter.dev/ui/adaptive-responsive/safearea-mediaquery)
- [Apple HIG: Layout](https://developer.apple.com/design/human-interface-guidelines/layout)
- [Android: adapt layouts](https://developer.android.com/design/ui/mobile/guides/layout-and-content/adapt-layout), [edge-to-edge](https://developer.android.com/design/ui/mobile/guides/layout-and-content/edge-to-edge)
