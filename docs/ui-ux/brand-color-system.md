# DUT — Brand Color System

Phiên bản 1.3 · 10/10/2026 · Áp dụng cho web V1/V2 và Figma.

**Đây là nguồn quy tắc màu chính thức.** Tài liệu này thay phần palette/phân bổ màu của các báo cáo redesign trước. Giá trị thực thi nằm trong [tokens.json](../../web/design-system/tokens.json), được sinh thành CSS và màu SVG qua [generator](../../web/scripts/build-design-tokens.mjs). Chữ, khoảng cách, kích thước, radius và motion tiếp tục theo [design-tokens](02-design-system/design-tokens.md).

## Phân tích và quyết định

Ảnh đầu vào có nền trang, header/sidebar, banner, metric và hàng lịch cùng xanh pastel khá rõ. Những vùng lớn liên tiếp ít khác biệt về màu; nhiều khối phụ cạnh tranh với mục điều hướng đang chọn. V2 dùng active trắng trên sidebar xanh, trong khi card cũng trắng nên vai trò của màu trắng không nhất quán. Việc tô xanh toàn bộ header bảng và metric làm trang dữ liệu nặng hơn cần thiết.

Lấy mẫu pixel opaque từ logo PNG 86×86: xanh `#1318F0` (381 pixel), xanh `#0000F0` (115), vàng nhạt `#F0F082` (210) / `#EAEA82` (208), đỏ `#DB0101` (33), trung tính `#F0F0F0` (710). Đây là màu của raster được cung cấp, **không phải mã thương hiệu được xác nhận từ brand manual**. Logo được giữ nguyên, không recolor/crop/filter. Xanh UI được điều chỉnh giảm bão hòa để dùng trên control và liên kết; không phủ xanh nguyên bản lên diện tích lớn.

Nghiên cứu trước triển khai:

- [Carbon — Color overview](https://www.carbondesignsystem.com/building-blocks/foundations/color/overview): tổ chức màu theo vai trò và token, tách trạng thái disabled. Áp dụng phân biệt canvas, layer đọc, interaction và semantic feedback.
- [shadcn/ui — Theming](https://ui.shadcn.com/docs/theming): ghép background với foreground, tách muted/accent/ring. Áp dụng các cặp chữ–nền và focus riêng, không nhập thư viện hoặc sao chép palette.

Quyết định DUT: neutral làm nền, xanh trung bình làm nhận diện/tương tác, pastel chỉ nhấn vùng có nhiệm vụ. Tỷ lệ 70–80% neutral / 15–25% blue / khoảng 5% accent là định hướng thị giác, không phải chỉ tiêu diện tích hoặc kết quả đo. Không thêm vàng/đỏ chỉ để đạt tỷ lệ. Đây là quyết định thiết kế dựa trên ảnh/source, chưa phải nghiên cứu người dùng.

## Palette và vai trò

Tên bên dưới là hậu tố của `--color-*`. Các vai trò khác nhau có thể dùng chung giá trị; không tạo thêm sắc độ chỉ để mỗi token có mã màu riêng.

| Token                                 | Giá trị               | Vai trò                                                   |
| ------------------------------------- | --------------------- | --------------------------------------------------------- |
| brand, action, focus, info            | `#2E63B8`             | Logo text, link, primary button, focus ring, thông tin    |
| brand-hover                           | `#24549F`             | Hover primary                                             |
| brand-deep, action-deep               | `#1E4788`             | Pressed primary, chữ nhấn trên tint                       |
| ink                                   | `#1E2F45`             | Heading, body, dữ liệu                                    |
| muted, brand-secondary, disabled-text | `#59697F`             | Metadata/helper/placeholder, nét lịch phụ, nhãn disabled  |
| canvas, nested                        | `#F7F9FC`             | Nền trang và khối phụ trong card trắng                    |
| surface, header                       | `#FFFFFF`             | Card, form, bảng, header, dropdown/popover/dialog         |
| sidebar                               | `#F4F7FB`             | Sidebar V2, dịu hơn banner                                |
| subtle                                | `#F3F5F8`             | Nhóm tab, vùng hỗ trợ, nền login story                    |
| table-header                          | `#F0F3F7`             | Header bảng; body bảng trắng                              |
| selected                              | `#E8F0FC`             | Điều hướng đang chọn, buổi học hiện tại, lựa chọn bền     |
| hover, info-soft                      | `#EDF3FC`             | Hover tương tác và nền thông tin                          |
| line                                  | `#E5EBF2`             | Divider, biên card trang trí; không thay biên field       |
| field-border                          | `#7B8798`             | Biên input/select/textarea và secondary button            |
| disabled-bg                           | `#E9EDF2`             | Control disabled, đi với disabled-text                    |
| success / success-soft                | `#24734D` / `#EDF7F0` | Thành công/đã hoàn thành có dữ liệu xác nhận              |
| warning / warning-soft                | `#805C18` / `#FFF7E4` | Hạn/cảnh báo có ý nghĩa                                   |
| danger / danger-soft                  | `#B44848` / `#FCEEEE` | Lỗi, trường bắt buộc, từ chối                             |
| accent-yellow                         | `#E2B84D`             | Điểm nhấn vàng có mục đích; không dùng làm chữ trên trắng |

Chữ phụ gợi ý `#607086` chỉ đạt 4,40:1 trên selected, nên dùng `#59697F`. Màu vàng của logo gợi nhận diện, nhưng warning cần nâu đậm để đọc được. Đỏ UI được giảm độ rực. Success giữ xanh lá; brand và semantic không đồng nghĩa.

### Phân bổ theo phiên bản

| Bề mặt                              | V1                        | V2                                                 |
| ----------------------------------- | ------------------------- | -------------------------------------------------- |
| Canvas / nội dung                   | canvas chung              | canvas chung, giữ cạnh bo và bố cục cũ             |
| Header / toolbar                    | header trắng              | header trắng                                       |
| Shell compatibility token           | trắng                     | sidebar `#F4F7FB`                                  |
| Active navigation                   | brand + chữ trắng         | selected + chữ brand; giữ font-weight/aria-current |
| Banner chào                         | `#EDF3FC` → `#F7F9FC`     | `#E8F0FC` → `#F4F7FB`                              |
| Card / metric / tin / quick actions | surface trắng             | surface trắng                                      |
| Hàng lịch thường / shortcut         | nested                    | nested; ca hiện tại selected                       |
| Bảng                                | table-header + body trắng | giống V1                                           |
| Form và popup                       | trắng; biên field riêng   | giống V1                                           |

`welcome` / `welcome-end` chỉ dùng gradient 110° ở banner chào. `accent-soft` là alias tương thích về nền nested, không còn là lớp lavender trang trí. Shadow card giữ nguyên offset/blur/opacity và chỉ đổi màu sang RGB(30,47,69): V1 `0 4px 20px … / 5%`, V2 `0 6px 24px … / 6%`. Không đổi radius/kích thước/spacing.

## Quy tắc bắt buộc cho phiên sau

- **COL-001 — Surface:** canvas neutral, card trắng, nested neutral. Không dùng selected/welcome làm nền chung cho mọi section. Không thêm card để có chỗ tô màu.
- **COL-002 — Brand:** dùng brand cho tương tác/nhận diện, ink cho nội dung. Giữ logo và logo Microsoft nguyên bản. SVG UI một màu trong `figma-v2` lấy màu theo mapping của generator; không sửa mã màu riêng ở từng file.
- **COL-003 — Semantic:** success/warning/danger/info phản ánh ý nghĩa dữ liệu. Luôn giữ text/icon/nhãn ngoài màu. Vàng accent không thay màu warning foreground.
- **COL-004 — Contrast:** chữ thường ≥4,5:1, chữ lớn ≥3:1; biên control/focus thiết yếu ≥3:1 với nền kề. Đo computed colors, opacity và gradient thực; line trang trí không phải field-border. Theo [Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) và [Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html).
- **COL-005 — Ownership:** sửa `tokens.json`, chạy `npm run tokens:build` và `npm run check:tokens`; CSS composition chỉ tham chiếu vai trò. Không tạo palette riêng theo route. Cập nhật file này khi thay quy tắc màu và đồng bộ Figma theo phạm vi được giao.
- **COL-006 — Scope:** theme hiện tại light-only. Không thêm dark palette từ màu đảo ngược. Đổi màu không cấp phép đổi routing, auth, API, copy, dữ liệu, layout, spacing hay typography.

### Trạng thái component

| State                            | Cặp màu / hành vi màu                                                                   |
| -------------------------------- | --------------------------------------------------------------------------------------- |
| Default primary                  | action + trắng; border brand                                                            |
| Hover primary                    | brand-hover + trắng                                                                     |
| Pressed primary                  | action-deep + trắng; border action-deep                                                 |
| Secondary default                | surface + brand; field-border                                                           |
| Secondary hover                  | hover + brand; border brand                                                             |
| Ghost default / hover            | transparent / hover; chữ brand                                                          |
| Secondary/ghost pressed          | selected + brand-deep                                                                   |
| Selected                         | selected + brand/brand-deep; V1 top nav là brand + trắng                                |
| Focus                            | outline focus giữ nguyên width/offset; không bị invalid hoặc selected che               |
| Disabled                         | disabled-bg + disabled-text, line; opacity 1, giữ native disabled                       |
| Loading                          | giữ palette loại nút và label/feedback hiện có; disabled dùng cặp trên khi thực sự khóa |
| Field hover / focus              | border brand / focus                                                                    |
| Invalid                          | border danger + thông báo lỗi; focus outline vẫn độc lập                                |
| Success / warning / error / info | foreground/background semantic tương ứng; không tô cả trang                             |

Card tĩnh không có hover giả. Row hover dùng subtle; row selected phải gắn với nghiệp vụ thật. Không đổi logic pending/validation chỉ để trình diễn state.

## Triển khai và đồng bộ

Code đã cập nhật:

- `web/design-system/tokens.json` và `web/src/app/styles/tokens.css`: palette chung, các surface/state token mới, edition welcome/shell, màu shadow.
- `web/scripts/build-design-tokens.mjs`: đồng bộ thêm 17 SVG UI một màu theo semantic token; không tác động logo.
- `web/src/app/styles/redesign.css`: phân bổ lại bề mặt, state secondary/pressed/disabled/field; giữ các khai báo hình học.
- `web/src/app/styles/v2.css`: bỏ tint hardcode, chuyển GPA/học phí/sign-in card về trắng, login về neutral.
- `web/src/app/styles/globals.css`, `web/src/features/auth/pages/LoginPage.tsx`: màu login story và nhãn/biên phù hợp nền sáng.
- `web/src/shared/assets/figma-v2/*.svg`: 17 vector chỉ đổi màu.
- `web/tests/e2e/{portal,v2}.spec.ts`: cập nhật màu nền kỳ vọng, giữ nguyên kiểm thử isolation/light mode.

[Figma DUT Student Portal](https://www.figma.com/design/hq4ifJ2w6AjspNHzSafral/DUT-Student-Portal): cập nhật trực tiếp 66 màn và 122 component được map, giữ ID và cấu trúc. Hai collection `61:2` / `221:898` giữ Light mode; cập nhật 96 color variable hiện có, thêm 46 primitive/semantic variable còn thiếu, cập nhật 29 effect style. Không có paint style local trước tác vụ; màu được bind qua variables. Bảng palette `349:2229` và 24 biến thể Button `247:2129` đã cập nhật tại chỗ, không thêm frame. Ledger và kết quả nằm trong `verification/brand-colors/`.

## Kiểm chứng và giới hạn

`npm run check`: Pass (token/icon sync, architecture, lint, 6 unit tests, TypeScript, Vite build). E2E Chromium: lần chạy đầy đủ có 40 Pass và 1 kỳ vọng màu nền cũ; đã cập nhật kỳ vọng và ca đó Pass khi chạy lại. Sau sửa login, 2 ca validation/light mode được chạy lại và Pass. Kiểm tra computed states 18 trường hợp cho hai edition: default/hover/pressed/disabled/focus/invalid/secondary/forced colors keyboard focus đều đúng palette. Mẫu disabled được kích hoạt tạm trong trình duyệt để đo visual, không thay đổi logic sản phẩm.

Quét 66 capture có 5.459 text run trên nền có thể tính, 48 cặp computed color riêng biệt không dưới ngưỡng; 8 caption text trên ảnh được loại khỏi phép đo nền đặc và review thị giác riêng. Gradient banner được kiểm thêm ở cả hai màu đầu/cuối trong ma trận token.

Kết quả chi tiết: [verification](verification/brand-colors/summary.json). Ảnh mới của các màn đại diện nằm cùng thư mục. Bảng contrast token gồm 118 cặp: chữ nhỏ thấp nhất 4,696:1; biên/focus thấp nhất 3,337:1. Không suy ra toàn sản phẩm đạt WCAG từ các cặp này.

Đã so sánh geometry và nội dung DOM của 8 màn trước/sau (V1/V2 home, grades, services desktop và services mobile): không thay đổi. Kiểm tra đồng bộ 66 frame Figma giữ geometry/nội dung trong thao tác đổi màu. Bốn button specimen có nét border mới làm Figma tính thêm 1px vào layout; đã loại nét stroke khỏi phép tính layout để khôi phục đúng vị trí label, không đổi kích thước.

Giới hạn: chưa kiểm thử screen reader/thiết bị thật hoặc Safari/WebKit trong đợt đổi màu này. Logo raster vẫn 86×86. Chữ trên ảnh campus cần đánh giá riêng với ảnh/gradient, không dùng phép đo nền đặc để kết luận. Figma tiếp tục có khác biệt renderer đối với glyph/pseudo-element đã ghi ở các báo cáo trước; không tuyên bố pixel-perfect hoặc chứng nhận WCAG toàn hệ thống.
