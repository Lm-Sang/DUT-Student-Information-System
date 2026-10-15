# Responsive rules

Giá trị breakpoint/size ở [design-tokens](../02-design-system/design-tokens.md#dimensions-and-breakpoints) là chuẩn duy nhất. Tên thiết bị trong bảng là tình huống sử dụng, không phải phát hiện user agent. Content width, zoom, pointer và bàn phím có thể làm một desktop cần bố cục hẹp.

## Bố cục theo khoảng rộng

Bảng dưới mô tả **V2**. V1 dùng navigation ngang từ 1100px, drawer dưới mốc đó; dashboard stack dưới 768px. V2 dùng expanded/rail theo preference ở >900px, mặc định expanded nếu chưa lưu; không tự thu về rail ở 1024px. Xem [quyết định V1](../v1-design-decisions.md) và [V2](../v2-design-decisions.md).

| Khoảng token                   | Navigation                                       | Main/grid                                                            | Typography/spacing                                                         | Form, table và overlay                                                      |
| ------------------------------ | ------------------------------------------------ | -------------------------------------------------------------------- | -------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Đến mobile-max                 | Drawer full labels                               | Một cột theo mức ưu tiên; secondary sau primary                      | type.page mobile; page-padding/panel/grid mobile; body/input không thu nhỏ | Form một cột, control md trở lên; bảng cuộn riêng; dialog fit viewport động |
| Trên mobile-max đến drawer-max | Drawer                                           | Trang chính một cột; nhóm card ngắn MAY hai cột nếu đủ nội dung      | Padding thường; nhãn wrap                                                  | Field liên quan MAY hai cột; table vẫn nguyên quan hệ hàng/cột              |
| >900px, dưới 1200px            | Expanded/rail theo preference, mặc định expanded | Dashboard/service một cột; không ép vùng phụ                         | Type desktop; giữ cỡ chữ                                                   | Bảng dùng toàn vùng; flyout khi rail                                        |
| 1200px đến trước wide-min      | Expanded mặc định hoặc preference rail           | Dashboard chính/phụ nếu đủ chỗ                                       | Token desktop; không phóng chữ theo màn hình                               | Table full width; dialog theo nội dung                                      |
| Từ wide-min                    | Expanded/rail theo preference                    | Container giữa trang tối đa content-max; không thêm cột chỉ vì trống | Giữ scale chữ, prose-max                                                   | Bảng nhiều cột có thêm chỗ; form không kéo dài tới hết màn                  |

## Điều kiện kiểm tra

| Rule ID  | Category      | Priority | Description / behavior                                                                       | Rationale                            | Scope                          | Exceptions                                                 | Validation                                                                               |
| -------- | ------------- | -------- | -------------------------------------------------------------------------------------------- | ------------------------------------ | ------------------------------ | ---------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| RESP-001 | Reflow        | MUST     | Trang đọc theo một chiều ở 320 CSS px; child min-width không làm page tràn                   | Dùng được khi hẹp/zoom               | Toàn web                       | Bảng/lịch hai chiều cần thiết được cuộn trong region riêng | Viewport 320px và 1280px zoom 400% không có page horizontal scroll ngoài ngoại lệ ghi rõ |
| RESP-002 | Navigation    | MUST     | Drawer/rail/expanded giữ cùng đích và quyền                                                  | Không mất chức năng theo kích thước  | Shell                          | Mục chưa khả dụng vẫn chưa khả dụng                        | Cùng route tới được trên chuột, touch, keyboard                                          |
| RESP-003 | Data          | MUST     | Giữ mã/tên, số/đơn vị/trạng thái/hành động cần thiết; overflow ngang chỉ trong bảng          | Không đánh đổi dữ liệu để vừa ảnh    | Học vụ/phí/dịch vụ             | Agenda lịch là biểu diễn khác nhưng đủ trường              | So sánh desktop/mobile cùng record không thiếu trường quan trọng                         |
| RESP-004 | Forms         | MUST     | Wrap hàng, label/field/error theo một luồng; bàn phím ảo không che field đang focus          | Hoàn thành form trên mobile          | Login/profile/services/conduct | Field ngắn cùng nhóm được hai cột khi đủ chỗ               | Nhập, sửa lỗi, submit khi keyboard mở; value/nháp không mất khi xoay                     |
| RESP-005 | Overlay       | MUST     | Fit viewport động, safe area, collision và cuộn nội bộ; không ra ngoài cạnh                  | Overlay còn thao tác được            | Dialog/popover/drawer          | Nội dung quá dài nên dùng page có sẵn                      | 320px, ngang 844×390, viewport thấp 1280×500 vẫn đến Close/action                        |
| RESP-006 | Touch         | MUST     | Control coarse pointer có target md; không phụ thuộc hover; duy trì khoảng trống giữa target | Tránh nhấn nhầm                      | Web touch/hybrid               | Link inline theo ngoại lệ accessibility                    | Đo target; thử bằng touch kể cả laptop, không chỉ media width                            |
| RESP-007 | Text growth   | MUST     | 200% text, text-spacing overrides và font fallback không làm mất nội dung                    | Tôn trọng cách đọc khác nhau         | Toàn UI                        | Bảng có scroll riêng; không ngoại lệ cho lỗi/CTA           | Heading, nav, label, error không cắt; action wrap/tăng height                            |
| RESP-008 | Content order | MUST     | Giữ DOM order có ý nghĩa khi stack; không dùng CSS order để đảo mục tiêu                     | Keyboard và screen reader cùng luồng | Dashboard/form/detail          | Grid placement không đổi nghĩa/Tab order                   | Đọc tuyến tính đúng thứ tự; nội dung phụ không chen trước tác vụ chính                   |

Nguồn cho reflow và ngoại lệ nội dung hai chiều: [W3C Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html). Quy tắc dùng một scroll region cho bảng là phương án dự án, không cho phép toàn trang luôn rộng hơn viewport.

## Ma trận nghiệm thu sau triển khai

| Tình huống        | Kích thước / cách kiểm                                                                 | Kết quả cần đạt                                                               |
| ----------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Hẹp tối thiểu     | 320×568                                                                                | Một cột, không mất action, bảng scroll riêng                                  |
| Mobile phổ biến   | 390×844, 600×900                                                                       | Drawer, target đủ, search dùng được                                           |
| Biên drawer       | 601×900, 900×700, 901×700                                                              | Không đồng thời sidebar và drawer trigger sai trạng thái                      |
| Laptop            | 1024×768, 1199×800, 1200×800                                                           | V1 drawer/menu đúng biên; V2 expanded/rail giữ preference, content stack đúng |
| Desktop lớn       | 1440×900, 1920×1080                                                                    | Content max hợp lý, không kéo form dài                                        |
| Cửa sổ thấp/ngang | 1280×500, 844×390                                                                      | Sidebar/overlay cuộn được, Close không ra ngoài                               |
| Zoom              | 200% text; 400% browser zoom từ 1280px                                                 | Không cắt chữ, không vô hiệu hóa zoom                                         |
| Hệ thống          | OS dark, forced colors, reduced motion                                                 | Light theme vẫn đúng; border/focus nhìn thấy; không motion không cần thiết    |
| Thiết bị/AT       | Chrome Android + TalkBack; Safari iOS + VoiceOver khi có thiết bị; desktop keyboard/AT | Thao tác thực dùng được; chưa có môi trường ghi Pending, không giả Pass       |

Browser automation hỗ trợ phát hiện overflow và regression; viewport giả lập không thay chứng cứ browser/thiết bị thật. Dark mode web chưa được bổ sung bởi quy tắc này.
