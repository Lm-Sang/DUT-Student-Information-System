# Design tokens — nguồn giá trị chuẩn

Phiên bản 1.3 · Foundation đã áp dụng trong redesign V1/V2 ngày 10/10/2026. Các giá trị là lựa chọn thiết kế chuẩn hóa, **không phải số đo chính xác từ ảnh**. Nguồn runtime là web/design-system/tokens.json và generator; phần chưa migrate toàn bộ được nêu trong [báo cáo](../redesign-implementation-report.md). Bảng mapping lịch sử cuối tài liệu ghi trạng thái trước redesign.

## TOK-001 — Kiến trúc token

- Category: Design system. Priority: MUST.
- Description: tổ chức primitive → semantic → component; component sử dụng alias theo ý nghĩa.
- Rationale: đổi theme/state có kiểm soát, không phân mảnh từng trang.
- Scope: mọi giá trị UI web mới hoặc được sửa trong phạm vi triển khai.
- Behavior: primitive lưu giá trị thô; semantic xác định vai trò; component alias chỉ cần khi có khác biệt thật. Ví dụ quan hệ: blue.600 → color.action → button.primary.background. Tên dấu chấm trong tài liệu là tên logic, chưa phải API CSS đã tồn tại.
- Exceptions: nội dung động như tỷ lệ progress/chiều rộng cột theo dữ liệu được tính toán; không tạo token cho từng giá trị dữ liệu.
- Validation: truy ngược được alias đến một giá trị; không có bản sao palette riêng theo route. Sinh CSS qua pipeline thực tế, không sửa file generated bằng tay.

Đơn vị kích thước là CSS px ở root 16px trừ nơi ghi khác. Typography và kích thước cần scale dùng rem khi triển khai; số px là giá trị đối chiếu, không khóa font trình duyệt. Min-height cho phép tăng khi wrap. Không áp dụng đơn vị web cho pt/dp native.

<a id="color-tokens"></a>

## Màu semantic

Palette và cách phân bổ màu được sở hữu duy nhất bởi [Brand Color System](../brand-color-system.md). Runtime: `web/design-system/tokens.json` → generator → `tokens.css` và SVG UI. Không dùng palette trong báo cáo lịch sử để ghi đè màu hiện tại.

### TOK-002 — Cặp màu được phép và contrast

MUST dùng đúng cặp foreground/background và đo computed colors khi đổi nền/opacity/gradient. Ngưỡng, mapping và bằng chứng màu hiện tại nằm tại [COL-004 và bảng state](../brand-color-system.md). Yêu cầu accessibility chi tiết tiếp tục theo [accessibility-rules](../04-interactions/accessibility-rules.md).

<a id="typography-tokens"></a>

## Typography tokens

| Token          | Size / line-height ở root 16px        |                 Weight | Tracking | Áp dụng / không áp dụng                                         |
| -------------- | ------------------------------------- | ---------------------: | -------- | --------------------------------------------------------------- |
| font.ui        | Be Vietnam Pro, system-ui, sans-serif | 400/500/600/700 đã tải | —        | Một family toàn web; không thêm display font cho dashboard      |
| type.page      | 28/38; mobile 24/34                   |                    600 | 0        | Một h1; không dùng làm card title                               |
| type.section   | 20/30                                 |                    600 | 0        | h2 section chính                                                |
| type.card      | 18/28                                 |                    600 | 0        | Heading trong card/khối con                                     |
| type.body      | 16/24                                 |                    400 | 0        | Đọc dài, hướng dẫn, nội dung thông báo                          |
| type.secondary | 14/22                                 |                    400 | 0        | Mô tả ngắn/helper; không thay toàn bộ body dài                  |
| type.caption   | 12/18                                 |                    400 | 0        | Metadata ít quan trọng; không dùng số tiền, hạn hoặc điểm chính |
| type.label     | 14/22                                 |                    500 | 0        | Label form/button                                               |
| type.input     | 16/24                                 |                    400 | 0        | Value mọi ô nhập, cả desktop để nhất quán mobile                |
| type.table     | 14/22                                 |                    400 | 0        | Cell; header 600, số tabular                                    |
| type.nav       | 14/22                                 |      500; selected 600 | 0        | Navigation tiếng Việt, cho wrap                                 |
| type.metric    | 32/42                                 |                    600 | 0        | Số tổng hợp trong module liên quan; không tạo KPI dashboard mới |

Lưu line-height dưới dạng tỷ lệ hoặc rem không cắt dấu. Trọng lượng 650 không có trong bộ tải hiện tại, không dùng synthetic weight tùy ý. Body không justify; số tiền/điểm dùng tabular-nums, không đổi font monospace toàn bảng.

<a id="spacing-and-surfaces"></a>

## Spacing và surface

| Nhóm/token                     | Giá trị                          | Khi dùng                                 | Tránh / lý do                                                               |
| ------------------------------ | -------------------------------- | ---------------------------------------- | --------------------------------------------------------------------------- |
| space.0/1/2/3/4/5/6/8/10/12/16 | 0/4/8/12/16/20/24/32/40/48/64 px | Primitive khoảng cách                    | Không nhân theo tỷ lệ màn hình                                              |
| space.section                  | space.8; mobile space.6          | Giữa section độc lập                     | Không dùng giữa label và field                                              |
| space.grid                     | space.6; mobile space.4          | Gap card/grid chính                      | Không ép mọi grid thành card bằng nhau                                      |
| space.panel                    | space.6; mobile space.4          | Padding card/dialog                      | Dense table dùng padding cell riêng                                         |
| space.field                    | space.4                          | Giữa hai field                           | Helper vẫn ở gần field                                                      |
| space.label                    | space.2                          | Label → input, input → helper            | Không kéo label xa field                                                    |
| space.inline                   | space.2                          | Icon–label, nút cạnh nhau                | Target vẫn riêng biệt, không chồng hit area                                 |
| space.cell-x / cell-y          | space.4 / space.3                | Padding cell bảng thường                 | Dense: cell-y = space.2; không giảm chữ để nén                              |
| radius.control / card / dialog | 8 / 16 / 20 px                   | Control/card/overlay tương ứng           | Không dùng bo lớn cho bảng dữ liệu từng ô                                   |
| radius.badge / pill            | 6 / 9999 px                      | Badge chữ; pill MAY dùng trạng thái ngắn | Không áp pill lên toàn bộ input/sidebar                                     |
| radius.none                    | 0                                | Cell/divider/section phẳng               | Không tạo bo ngẫu nhiên                                                     |
| border.width / style           | 1px / solid                      | Border mặc định                          | Dashed chỉ vùng trống/upload thật, không mọi panel                          |
| border.selected                | 3px solid color.action-text      | Dấu selected nav/tab                     | Kết hợp aria-current/selected; không gây thay đổi box size                  |
| focus.width / offset           | 2px / 2px                        | Outline color.focus                      | Trên nền tối dùng outline trắng tương phản; giữ outline trong forced colors |
| elevation.flat                 | none                             | Card thường, bảng, form                  | Không shadow mọi section                                                    |
| elevation.raised               | 0 2px 8px rgba(29,48,81,0.06)    | MAY card tương tác cần phân lớp          | Không animate shadow lớn liên tục                                           |
| elevation.overlay              | 0 8px 24px rgba(29,48,81,0.12)   | Tooltip/popover/dropdown                 | Không dùng để thay border hoặc focus                                        |
| elevation.modal                | 0 16px 48px rgba(29,48,81,0.18)  | Dialog/drawer                            | Không lồng nhiều lớp bóng                                                   |

Lý do: hierarchy đến từ proximity và contrast trước độ nổi. Card phẳng là mặc định có chủ ý; không bắt buộc elevation cấp 1 chỉ vì ví dụ trong một skill.

<a id="dimensions-and-breakpoints"></a>

## Kích thước và breakpoint

| Token                                     | Giá trị chuẩn                | Áp dụng / giới hạn                                                                                                                   |
| ----------------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| size.control-sm / md / lg                 | min-height 36 / 44 / 48 px   | sm chỉ toolbar/bảng mật độ cao, pointer fine; md mặc định; coarse pointer tối thiểu md                                               |
| size.icon-sm / md / lg                    | 16 / 20 / 24 px              | Nét SVG; không phải kích thước vùng nhấn                                                                                             |
| size.icon-target                          | min 44×44 px                 | IconButton trên mọi màn; icon không phóng tới 44                                                                                     |
| size.nav-item                             | min-height 48px              | Nav cho nhãn dài; height auto khi wrap                                                                                               |
| size.badge-sm / md                        | min-height 24 / 28 px        | Nội dung không tương tác; filter chip phải theo control target                                                                       |
| size.row-dense / default / comfortable    | min-height 40 / 48 / 56 px   | Bảng dữ liệu; row có target 44px phải tăng đủ chỗ                                                                                    |
| size.choice-mark                          | 20×20 px                     | Hình checkbox/radio; cả label tạo target min 44px                                                                                    |
| size.logo-box / logo-clear                | 40×40 / 8 px                 | Bounding box và clear space đề xuất; giữ tỷ lệ asset, box không ép crop                                                              |
| layout.sidebar-expanded / collapsed       | 256 / 72 px                  | Desktop; scale rem nếu chữ lớn cần không gian                                                                                        |
| layout.toolbar                            | min-height 64px              | Cho phép tăng chiều cao; không che main khi wrap                                                                                     |
| layout.page-padding                       | 24px; mobile 16px            | Lề nội dung; không cộng đôi padding shell + page                                                                                     |
| layout.content-max / prose-max / form-max | 1440px / 70ch / 640px        | Nội dung/bài đọc/form chính; bảng dùng toàn content, không bị prose max                                                              |
| layout.aside-min / main-min               | 280 / 480 px                 | Dashboard hai vùng chỉ khi đủ cả hai và gap                                                                                          |
| layout.dialog-sm / md / lg                | max-width 400 / 560 / 800 px | Xác nhận/form ngắn/bảng chi tiết; dài chuyển page theo tính năng có thật                                                             |
| layout.overlay-margin                     | 16px                         | Khoảng cách overlay với cạnh viewport                                                                                                |
| layout.flyout-width / tooltip-max         | 280px / 240px                | Co lại theo available width; nhãn dài wrap                                                                                           |
| layout.toast-max                          | 400px                        | Toast ngắn, co lại theo viewport trừ hai overlay-margin; nội dung quan trọng vẫn có nơi đọc lại                                      |
| layout.drawer-width                       | min(320px, viewport − 32px)  | Mobile/tablet navigation; nội dung cuộn bên trong                                                                                    |
| layout.overlay-max-height                 | viewport động − 32px         | Dùng dvh và safe-area phù hợp, không vượt bàn phím                                                                                   |
| breakpoint.mobile-max                     | 600px                        | Mobile: 0–600, kiểm tra tối thiểu 320                                                                                                |
| breakpoint.drawer-max                     | V1: dưới 1100px; V2: ≤900px  | V1 thay menu ngang bằng drawer; V2 thay sidebar bằng drawer                                                                          |
| breakpoint.expanded-min                   | V2: >900px                   | Desktop tôn trọng preference expanded/rail; khi chưa lưu thì expanded. 1200px là mốc đổi bố cục nội dung, không tự ghi đè preference |
| breakpoint.wide-min                       | 1440px                       | Desktop lớn; vẫn giới hạn content-max                                                                                                |

Shell V1 và V2 có mốc riêng để giữ hai phương án điều hướng. Lựa chọn collapse V2 đã lưu được ưu tiên ở desktop; drawer không ghi đè sở thích. V1 dashboard stack dưới 768px, V2 dashboard/service stack dưới 1200px. Dùng không gian nội dung để quyết định số cột; breakpoint không chứng minh thiết bị có chuột. Các utility breakpoints cục bộ vẫn theo component hiện có và phải kiểm tại biên.

<a id="motion-and-layers"></a>

## Motion, timing và lớp hiển thị

| Token                            | Giá trị                                           | Dùng / không dùng                                                                                    |
| -------------------------------- | ------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| motion.none                      | 0ms                                               | Focus, reduced motion, route mặc định, bảng tải lại                                                  |
| motion.feedback                  | 120ms                                             | Hover/press màu; không trì hoãn hành động                                                            |
| motion.menu                      | 160ms                                             | Popover/dropdown/nhãn sidebar                                                                        |
| motion.dialog                    | 200ms                                             | Overlay mở/đóng nếu giữ đúng focus/lifecycle                                                         |
| motion.reveal                    | 160ms                                             | MAY phần phụ nhỏ; không animate toàn bộ bảng                                                         |
| motion.spinner-cycle             | 1000ms linear                                     | Spinner tải không xác định; reduced motion thay bằng text tĩnh                                       |
| timing.tooltip-delay             | 400ms pointer, 0ms focus                          | Tránh chớp khi rê qua; không delay accessible name                                                   |
| timing.tooltip-bridge            | 150ms                                             | Khoảng chuyển pointer trigger → tooltip; không auto-hide khi đang hover/focus                        |
| timing.toast-dismiss             | 6000ms                                            | Chỉ success không có action; pause hover/focus, đóng tay; nội dung có action/error giữ đến khi xử lý |
| easing.standard                  | cubic-bezier(0.2,0.8,0.2,1)                       | Feedback/reveal; không spring/bounce                                                                 |
| easing.enter / exit              | cubic-bezier(0,0,0.2,1) / cubic-bezier(0.4,0,1,1) | Overlay vào/ra                                                                                       |
| motion.offset                    | 4px                                               | Popover/content nhẹ; drawer dùng transform theo bề rộng của chính nó                                 |
| layer.base / sticky / navigation | 0 / 10 / 20                                       | Nội dung/header/sidebar trong document                                                               |
| layer.overlay / tooltip / toast  | 40 / 50 / 60                                      | Fallback overlay thường; không dùng số 99999 để chữa stacking                                        |

Native dialog và popover nằm trong **top layer**; z-index document không thắng top layer. Backdrop thuộc dialog; tooltip/toast liên quan modal phải đặt trong ngữ cảnh overlay tương ứng, không vượt hoặc bị chôn bằng mẹo z-index. Lý do: phân lớp đúng ownership và focus, không chỉ đúng hình ảnh.

## Alias component tiêu biểu

| Alias                                  | Tham chiếu semantic                                              |
| -------------------------------------- | ---------------------------------------------------------------- |
| button.primary.bg / fg / hover         | color.action / color.on-action / color.action-hover              |
| button.secondary.bg / fg               | color.surface / color.action-text                                |
| input.bg / border / text / radius      | color.surface / color.field-border / color.text / radius.control |
| card.bg / padding / radius / elevation | color.surface / space.panel / radius.card / elevation.flat       |
| nav.selected.bg / fg / indicator       | color.surface / color.action-text / border.selected              |
| overlay.bg / radius / elevation        | color.surface / radius.dialog / elevation.modal                  |

## Mapping và migration từ snapshot trước redesign

| Vai trò                            | Hiện tại                                               | Đích chuẩn                                                 | Phân loại                                 |
| ---------------------------------- | ------------------------------------------------------ | ---------------------------------------------------------- | ----------------------------------------- |
| Canvas, surface, text, action fill | V2 đã dùng cùng màu ở bảng trên                        | Giữ vai trò                                                | Kế thừa                                   |
| Muted                              | V2 #64748B; V1 #526178                                 | color.text-muted                                           | Sửa contrast, tái dùng màu V1             |
| Field border                       | V2 #A7B7CF                                             | color.field-border                                         | Sửa contrast                              |
| Action trên tint                   | Thường dùng --color-action                             | color.action-text                                          | Alias mới                                 |
| Font/body                          | V1/V2 Be Vietnam Pro, body chủ yếu 14px                | Giữ family; body và table tách vai trò                     | Chuẩn hóa                                 |
| Radius                             | V1 control/panel/dialog 8/12/16; V2 control/card 12/18 | radius theo vai trò                                        | Đề xuất mới, không mô tả code đã đổi      |
| Sidebar                            | V1 token 256; V2 224/72                                | layout.sidebar-*                                           | Mở rộng V2 có chủ ý                       |
| Breakpoints                        | V1 1099/767; V2 1390/1150/900/600                      | breakpoint.*                                               | Hợp nhất trong edition được triển khai    |
| Pipeline                           | V1 JSON → generated CSS; V2 scoped overrides           | Giữ generator, bổ sung alias/mode có phạm vi khi được giao | Không tạo stylesheet token cạnh tranh mới |

Giai đoạn nghiên cứu trước không sửa JSON/CSS. Yêu cầu tiếp theo đã cho phép triển khai cả V1/V2: palette chung thay các override màu V2, sidebar V2 256/72, generator xuất spacing/radius/type, PageHeading và table/metric dùng scale mới. Quy tắc source of truth vẫn là tokens.json → generator → tokens.css, có lớp composition redesign.css. Một số radius/metadata/spacing cục bộ cũ được giữ và ghi trong báo cáo; không suy ra mọi alias logic ở tài liệu đã có utility runtime.

## Theme surface theo edition

Màu shell/welcome và shadow ink theo [Brand Color System](../brand-color-system.md). Giữ geometry đã triển khai: V1 radius control/panel 10/20px, V2 12/24px; dialog theo token chung. Phần màu ở mapping lịch sử trên chỉ là snapshot trước migration, không phải palette hiện hành. Không thêm dark mode.
