# Contract component

Đặc tả cho 32 loại component. Kích thước/màu/chữ/timing lấy từ [design-tokens](design-tokens.md); hành vi lớp nổi theo [navigation](../03-layout/layout-navigation.md), [motion](../04-interactions/animation-rules.md), [accessibility](../04-interactions/accessibility-rules.md).

## Contract chung — CMP-000

Category: Components. Priority: MUST. Scope: component đang được triển khai/sửa. Description: mọi component có mục đích, style, size, states, hover/focus/active, motion, responsive, accessibility và điều tránh như dưới. Rationale: không chỉ đặc tả trạng thái đẹp mặc định. Exceptions: state không có ý nghĩa phải ghi N/A, không tạo hover cho nội dung tĩnh. Validation: chạy scenario ở từng mục cùng checklist chung.

Quy tắc state chung: default → hover (chỉ thiết bị hỗ trợ) → pressed; selected là trạng thái bền độc lập; focus-visible luôn giữ khi hover/selected/invalid/pending. Disabled không kích hoạt; aria-disabled cần chặn cả click và keyboard. Loading không tự làm mất focus; giữ label/kích thước để tránh nhảy. Native disabled dùng khi đúng ngữ nghĩa, lý do khóa xuất hiện bằng text gần đó. Không dùng opacity chung làm chữ enabled mất contrast. Invalid có text liên kết field. Màu theo semantic, không auto-generate màu bằng filter.

Mỗi mục bên dưới là một Rule ID. Category theo nhóm; Priority mặc định **MUST khi component có mặt**, không có nghĩa phải thêm component chưa có. “Mục đích” đồng thời giải thích rationale; scope là component được đặt tên. Ngoại lệ mặc định: không có ngoài trường hợp nêu trực tiếp. “Kiểm tra” là validation bổ sung; phần primitive chỉ nêu source đã xác minh hoặc native HTML, không giả định thư viện đã cài.

## Navigation

### CMP-001 — Sidebar

- **Mục đích:** đi đến module và biết vị trí hiện tại. **Visual/size:** surface, nav label, selected có nền và dấu; sidebar-expanded/collapsed; drawer theo breakpoint.
- **States, hover/focus/active:** expanded/collapsed/drawer; current route và open group độc lập; hover không expand toàn sidebar; toggle có focus và pressed feedback.
- **Motion:** nhãn dùng motion.menu, shell đổi grid một lần; reduced motion tức thì. **Responsive:** rail desktop hẹp, drawer có đầy đủ nhãn; sở thích desktop không bị ghi đè.
- **Accessibility:** nav có tên, links aria-current, toggle aria-expanded/controls, Tab tới mọi đích; drawer theo Dialog. **Tránh:** menu chỉ hover, rail không tên, scrollbar bị vô hiệu hóa. **Primitive:** PortalV2Layout/V2Sidebar, SidebarRailItem, Sidebar. **Kiểm tra:** thu gọn, vào submenu, đổi route, reload, storage bị chặn.

### CMP-002 — Top App Bar

- **Mục đích:** tiện ích toàn cục. **Visual/size:** surface, min-height layout.toolbar, icon-target; không header khổng lồ.
- **States, hover/focus/active:** normal/search input/account open/notice open; từng control theo contract chung, không hover cả toolbar.
- **Motion:** chỉ control và overlay. **Responsive:** search xuống hàng hoặc lối mở rõ; giữ menu/account/notifications, không ép chiều cao cố định.
- **Accessibility:** header landmark, search có tên đúng phạm vi; nhãn từng icon. **Tránh:** semester selector toàn cục chưa có dữ liệu nối; breadcrumb giả. **Primitive:** PortalHeader và toolbar trong PortalV2Layout. **Kiểm tra:** search bằng Enter tới học phần; toolbar không che focus khi wrap.

### CMP-003 — Navigation Item

- **Mục đích:** một đích đến hoặc toggle nhóm, không lẫn hai vai trò. **Visual/size:** type.nav, size.nav-item, icon-md; selected indicator được chừa chỗ.
- **States, hover/focus/active:** default/hover/pressed/current/unavailable; current vẫn có focus ring; mục chưa khả dụng có giải thích.
- **Motion:** feedback màu, không dịch ngang chữ. **Responsive:** wrap expanded, icon có tên ở rail, đầy đủ text trong drawer.
- **Accessibility:** link cho route; button cho disclosure; chỉ route hiện tại có aria-current page. **Tránh:** div click, link #, selected dựa riêng màu. **Primitive:** NavLink + cấu hình navigation. **Kiểm tra:** Enter mở đúng đích, mở tab mới với link, role guard đúng.

### CMP-004 — Submenu

- **Mục đích:** các đích con cùng nhóm. **Visual/size:** indent space.4 khi expanded; flyout-width khi rail; hàng target md/nav.
- **States, hover/focus/active:** closed/open/child current; click/Enter/Space toggle; ArrowDown MAY vào link đầu; Tab đi tự nhiên, Escape đóng và về trigger.
- **Motion:** motion.menu opacity/offset; không animate height danh sách dài. **Responsive:** drawer dùng disclosure inline, rail dùng flyout trong viewport.
- **Accessibility:** aria-expanded/controls, nav/list/link; không gán role menu nếu không thực hiện menu keyboard model. **Tránh:** mở khi vô tình rê ngang, mất popup giữa trigger và panel. **Primitive:** SidebarRailItem, NavigationMenu, Disclosure. **Kiểm tra:** tới mọi link không dùng chuột và không rơi focus ra nền khi ở drawer.

### CMP-005 — Breadcrumb

- **Mục đích:** diễn đạt phân cấp thật. **Visual/size:** type.secondary, gap inline; separator trang trí; link target có khoảng thở.
- **States, hover/focus/active:** ancestor link/current text; hover/focus chỉ link; current không là button.
- **Motion:** không. **Responsive:** wrap; giữ parent gần nhất và current, không cắt tên trang quan trọng.
- **Accessibility:** nav có tên Breadcrumb/Đường dẫn, ordered list, aria-current page; separator aria-hidden. **Tránh:** lặp dòng không dẫn đi đâu hoặc nhầm lịch sử duyệt. **Primitive:** native nav/ol/Link; v2-breadcrumb hiện là text, cần nâng semantics khi được sửa. **Kiểm tra:** mỗi link là tổ tiên hợp lệ, screen reader không đọc separator dư.

### CMP-006 — Tabs

- **Mục đích:** chuyển nội dung ngang cấp. **Visual/size:** gạch chân selected, type.label, target md; không pill mọi tab.
- **States, hover/focus/active:** selected/unselected/disabled; focus độc lập selected. Tab nội bộ dùng ArrowLeft/Right, Home/End, Enter/Space khi manual activation; route links dùng Tab/Enter thông thường.
- **Motion:** feedback màu, panel xuất hiện ngay; không slide trang dữ liệu. **Responsive:** wrap hoặc cuộn thanh tab có dấu cuộn, không tràn page.
- **Accessibility:** role tablist/tab/tabpanel chỉ cho panel tương ứng; roving tabindex và aria-labelledby/controls. **Tránh:** role tab cho link route chỉ để giống UI; mất bản nháp khi đổi mục. **Primitive:** SectionNav/AcademicTabs là navigation links; profile có tab nội bộ. **Kiểm tra:** phân biệt ba mẫu route links, anchor section, tabs; Back/Forward và keyboard đúng từng mẫu.

### CMP-007 — Tooltip

- **Mục đích:** nhãn bổ trợ cho icon/giải thích ngắn. **Visual/size:** surface + border + elevation.overlay, secondary, tooltip-max.
- **States, hover/focus/active:** closed/open; pointer dùng tooltip-delay, focus hiện ngay; Escape đóng; giữ khi pointer trên trigger hoặc tooltip; không chứa nút.
- **Motion:** opacity motion.feedback; bridge theo timing.tooltip-bridge. **Responsive:** coarse pointer có tên hiển thị/accessible name, không bắt thao tác hover.
- **Accessibility:** role tooltip, aria-describedby khi bổ sung thông tin; icon vẫn có tên độc lập. **Tránh:** tooltip là nơi duy nhất chứa lỗi/hạn/hành động; chỉ title attribute. **Primitive:** tooltip hiện trong SidebarRailItem cần kiểm tra/cải thiện contract. **Kiểm tra:** chuyển pointer vào tooltip không mất, Tab/Escape được, zoom không ra ngoài viewport.

### CMP-008 — Popover

- **Mục đích:** vùng thông tin/tùy chọn ngắn theo ngữ cảnh. **Visual/size:** surface/radius.control/elevation.overlay, padding space.4, giới hạn overlay.
- **States, hover/focus/active:** closed/open; trigger pressed feedback, nội dung hover theo từng control; light-dismiss và Escape, không focus trap với nonmodal.
- **Motion:** motion.menu. **Responsive:** căn lại/collision theo viewport; nếu không đủ chỗ cho tác vụ mới chuyển Dialog có semantics modal rõ.
- **Accessibility:** trigger có tên/expanded/controls; role nội dung theo mục đích, focus không bị mất khi đóng. **Tránh:** coi popover auto là full accessible menu, overlay ra ngoài màn hình. **Primitive:** native popover trong rail. **Kiểm tra:** click ngoài, Escape, resize, scroll, Tab; fallback nếu browser thiếu API.

## Data display

### CMP-009 — Card

- **Mục đích:** nhóm nội dung độc lập. **Visual/size:** card aliases; compact dùng panel mobile, standard dùng panel; không fixed height.
- **States, hover/focus/active:** card tĩnh không hover/focus; card có link thể hiện focus đúng link; selected chỉ khi có nghiệp vụ chọn.
- **Motion:** mặc định không entrance; tương tác MAY elevation.raised không nâng vị trí. **Responsive:** full width vùng cha, wrap title/actions.
- **Accessibility:** section có heading nếu phù hợp; không làm cả card button khi bên trong có control. **Tránh:** card lồng card, mỗi ô bảng thành card. **Primitive:** Card, AcademicPanel; class v2-card là style hiện có. **Kiểm tra:** thứ tự đọc/nhấn không trùng, nội dung dài không bị cắt.

### CMP-010 — Table

- **Mục đích:** so sánh hàng/cột học vụ, phí, tiêu chí. **Visual/size:** type.table, header subtle, cell spacing, row dense/default/comfortable theo token; số căn phải.
- **States, hover/focus/active:** data/loading/empty/error; row hover MAY hỗ trợ quét nhưng không giả clickable; selected kèm checkbox/text; sorting chỉ khi thật sự có.
- **Motion:** không entrance từng hàng/sort animation. **Responsive:** scroll trong region, cột định danh ưu tiên, không page overflow; không tự mất cột nghiệp vụ.
- **Accessibility:** table/caption/th scope; named region, keyboard scroll khi cần; aria-sort khi sorting tồn tại. **Tránh:** div grid thay semantics tùy tiện, sticky che focus, virtualization chỉ theo ngưỡng hàng võ đoán. **Primitive:** Table/AcademicTable và table HTML hiện có. **Kiểm tra:** đọc header–cell đúng; người dùng bàn phím đến được cột cuối ở 320px.

### CMP-011 — Calendar

- **Mục đích:** đọc lịch học/thi; không mặc định thêm điểm danh hoặc date picker. **Visual/size:** lịch theo tuần/agenda, thời gian rõ; event dùng card/list tối giản, control md.
- **States, hover/focus/active:** ngày hôm nay/chọn, có lịch/rỗng/loading/error; event tương tác có focus và pressed; không chỉ tô ngày để nói “có thi”.
- **Motion:** đổi khoảng thời gian ngay, giữ feedback loading vùng lịch. **Responsive:** agenda đủ tên, giờ, phòng, mã lớp; calendar tháng chỉ nếu tác vụ sau thật sự cần.
- **Accessibility:** ngày có tên đầy đủ, event text, next/previous có nhãn; nếu tạo grid tương tác sau phải có keyboard model riêng. **Tránh:** lưới ảnh nhỏ, giấu giờ/phòng sau hover. **Primitive:** SchedulePage/ScheduleTable hiện có, không có thư viện calendar tháng. **Kiểm tra:** cùng một sự kiện đầy đủ dữ liệu ở desktop/mobile; không tạo lịch giả.

### CMP-012 — Badge

- **Mục đích:** nhãn trạng thái ngắn. **Visual/size:** status fg/bg, radius.badge; badge-sm/md và caption/secondary tương ứng.
- **States, hover/focus/active:** tĩnh; không hover/focus/pressed. Filter tương tác phải dùng button/chip contract khác.
- **Motion:** không. **Responsive:** wrap hoặc chuyển dòng, không cắt trạng thái.
- **Accessibility:** chữ mang ý nghĩa; icon trang trí aria-hidden. **Tránh:** “Mới” không có điều kiện dữ liệu, dùng badge như nút nhỏ. **Primitive:** Badge hiện có. **Kiểm tra:** grayscale vẫn hiểu, label dài không overflow.

### CMP-013 — Status indicator

- **Mục đích:** truyền trạng thái/tình trạng tiến độ thật. **Visual/size:** chấm/icon-sm + secondary; progress có label/value; không chỉ dot.
- **States, hover/focus/active:** pending/success/warning/error theo domain; static không hover/focus; link xem chi tiết là control riêng.
- **Motion:** trạng thái đổi bằng text/icon ngay; không pulse liên tục. **Responsive:** label wrap.
- **Accessibility:** live region khi kết quả thay đổi do hành động cần thông báo; progress native khi có tỷ lệ thật. **Tránh:** dùng “Đã duyệt” cho nháp local, giả phần trăm tải. **Primitive:** Badge, native progress và text hiện có. **Kiểm tra:** đọc được state mà không thấy màu, không announce lặp khi rerender.

### CMP-014 — Notification

- **Mục đích:** thông báo học vụ bền vững hoặc cảnh báo vùng trang. **Visual/size:** list với title/body/source/date, status tone khi thực sự cần; body/prose width.
- **States, hover/focus/active:** data/loading/empty/error; unread/read chỉ nếu có dữ liệu; link có hover/focus, nội dung không giả click.
- **Motion:** không entrance từng tin; drawer theo Dialog. **Responsive:** một cột, metadata wrap; tóm tắt có lối đọc đầy đủ.
- **Accessibility:** heading/list, time, link mô tả; không aria-live toàn danh sách lúc tải đầu. **Tránh:** thay thông báo lâu dài bằng toast tự mất, chỉ badge đếm không có tên. **Primitive:** NotificationsPage, Dialog, FeedbackStates. **Kiểm tra:** đi từ chuông đến danh sách/chi tiết phù hợp, ngày và hạn đọc được.

### CMP-015 — Timeline

- **Mục đích:** chuỗi mốc có thứ tự từ dữ liệu hiện có, ví dụ lịch trong ngày/quy trình đánh giá. **Visual/size:** list, icon-sm, gap field; đường nối chỉ trang trí.
- **States, hover/focus/active:** completed/current/upcoming/unknown bằng nhãn; static không hover/focus, link mốc có focus.
- **Motion:** không animate đường chạy hoặc từng mốc. **Responsive:** dọc trên hẹp, giữ thứ tự DOM.
- **Accessibility:** ol, time và text status. **Tránh:** tạo lịch sử phê duyệt giả từ vài trạng thái tĩnh. **Primitive:** ol trong dashboard/review steps; chưa có Timeline shared. **Kiểm tra:** bỏ đường/màu vẫn hiểu trình tự; unknown không biến thành completed.

### CMP-016 — Data visualization

- **Mục đích:** giải thích xu hướng/tỷ lệ có giá trị hơn bảng đơn thuần. **Visual/size:** chart tokens, label/legend, chiều cao theo nội dung; bảng số liệu tương đương.
- **States, hover/focus/active:** data/no-data/error/loading; điểm được chọn có text; hover thông tin phải có focus/click tương đương.
- **Motion:** mặc định không đếm số/animate series. **Responsive:** đơn giản hóa trục/legend, giữ số liệu qua bảng; không thu chữ tới khó đọc.
- **Accessibility:** tên, tóm tắt, đơn vị, dữ liệu text; phân biệt series bằng marker/pattern. **Tránh:** 3D, axis gây hiểu sai, biểu đồ GPA trên dashboard chính. **Primitive:** SVG/progress và AcademicV2Summary hiện có; chưa chọn chart library. **Kiểm tra:** kiểm nguồn/tổng/đơn vị và nội dung tương đương không cần nhìn chart.

## Interaction

### CMP-017 — Button

- **Mục đích:** thực hiện một lệnh. **Visual/size:** primary/secondary/ghost; destructive chỉ khi nghiệp vụ cần; control-sm/md/lg theo điều kiện token, label rõ.
- **States, hover/focus/active:** default/hover/pressed/focus/disabled/pending; focus không mất khi pending; khóa submit lặp, label vẫn ổn định.
- **Motion:** feedback màu; không bounce/scale chữ. **Responsive:** action wrap hoặc full width khi hẹp, thứ tự hành động nhất quán.
- **Accessibility:** button với type đúng, tên cụ thể; link nếu đổi route. **Tránh:** chỉ “OK”, disabled không lý do, dùng button cho URL. **Primitive:** Button; hiện mới có primary/secondary/ghost, các variant khác là gap tương lai. **Kiểm tra:** Space/Enter một hành động, submit chậm không tạo hai request.

### CMP-018 — IconButton

- **Mục đích:** lệnh quen thuộc trong không gian hạn chế. **Visual/size:** icon-sm/md/lg bên trong icon-target; secondary/ghost, focus rõ.
- **States, hover/focus/active:** như Button; toggle dùng pressed state bền qua aria-pressed nếu thích hợp.
- **Motion:** feedback; icon không xoay nếu không có ý nghĩa. **Responsive:** target giữ nguyên, MAY thêm text trên mobile nếu icon mơ hồ.
- **Accessibility:** aria-label đúng lệnh, tooltip bổ trợ; icon decorative. **Tránh:** SVG click trần, tên “icon”/“button”. **Primitive:** button.icon-button + Icon/V2Icon, chưa có wrapper IconButton riêng. **Kiểm tra:** screen reader phân biệt các nút cùng icon theo ngữ cảnh.

### CMP-019 — Input

- **Mục đích:** nhận một giá trị; textarea cho dài. **Visual/size:** input aliases, type.input, min control-md/lg; textarea cao theo nội dung.
- **States, hover/focus/active:** empty/filled/focus/read-only/disabled/invalid/pending; hover chỉ đổi border nhẹ; focus ring tồn tại cùng error.
- **Motion:** feedback border; không label nhảy vị trí che placeholder. **Responsive:** full column, bàn phím không che field/error/action.
- **Accessibility:** label/description/error kết nối id, type/autocomplete/inputmode đúng; required rõ, không placeholder-only. **Tránh:** chặn paste, format cưỡng ép khi đang nhập, validate đỏ ngay trước tương tác. **Primitive:** native input/textarea hiện có, chưa có wrapper field shared. **Kiểm tra:** submit lỗi focus field đầu, giữ dữ liệu khi lỗi mạng, read-only vẫn copy được.

### CMP-020 — Search

- **Mục đích:** tìm trong phạm vi công bố. **Visual/size:** Input + icon/submit, control-md, label “Tìm học phần” ở shell hiện tại.
- **States, hover/focus/active:** empty/typing/submitting/results/no-results/error; clear có tên; focus không nhảy khi kết quả cập nhật.
- **Motion:** feedback, không animate danh sách mỗi ký tự. **Responsive:** search xuống hàng/open có tên khi thiếu chỗ, không biến mất không lối vào.
- **Accessibility:** form role search/name, Enter submit, announce số kết quả nếu async; shortcut không là đường duy nhất. **Tránh:** hứa tìm thời khóa biểu/tất cả dữ liệu khi chỉ courses?q. **Primitive:** form search trong PortalHeader/PortalV2Layout. **Kiểm tra:** query encode đúng, clear/reset và Back/Forward không mất ngữ cảnh cần giữ.

### CMP-021 — Select

- **Mục đích:** chọn một giá trị trong danh sách hữu hạn. **Visual/size:** native select, input typography/field-border, control-md.
- **States, hover/focus/active:** default/open/selected/disabled/invalid; không tự navigate khi chỉ focus; dropdown OS có ngoại hình riêng chấp nhận được.
- **Motion:** không tự animate popup native. **Responsive:** full width nếu label dài, dùng picker chuẩn browser.
- **Accessibility:** label, option name đầy đủ, error liên kết; keyboard native. **Tránh:** custom listbox chỉ để bo góc, select giả không tác động dữ liệu. **Primitive:** select HTML hiện có ở học kỳ/form/lọc. **Kiểm tra:** thay giá trị chỉ cập nhật vùng đúng, lựa chọn dài đọc đủ.

### CMP-022 — Dropdown

- **Mục đích:** gom lệnh hoặc link phụ; không thay Select cho field. **Visual/size:** overlay surface, item control-md, flyout-width có giới hạn.
- **States, hover/focus/active:** open/closed/current/disabled item; click/keyboard, Escape, outside dismiss.
- **Motion:** motion.menu. **Responsive:** collision, max-height scroll; giữ thứ tự và nhãn khi hẹp.
- **Accessibility:** link list dùng nav/disclosure; action menu role menu chỉ khi có arrows/Home/End/roving focus đúng model. **Tránh:** trộn hai keyboard model; mục điều hướng giả button. **Primitive:** NavigationMenu/AccountMenu và native popover khi phù hợp. **Kiểm tra:** mở, thao tác, đóng, focus về trigger; Tab không kẹt.

### CMP-023 — Checkbox

- **Mục đích:** boolean hoặc chọn nhiều. **Visual/size:** choice-mark trong label target-md; checked có check mark, border đủ contrast.
- **States, hover/focus/active:** unchecked/checked/indeterminate/disabled/invalid; hover label nhẹ, Space toggle, focus quanh control rõ.
- **Motion:** feedback màu, không scale. **Responsive:** label wrap, hit area không chồng checkbox khác.
- **Accessibility:** input checkbox + label; nhóm fieldset/legend khi cần; mixed chỉ dùng khi thật sự chọn một phần. **Tránh:** tự vẽ div không semantics, “chọn tất cả” không giải thích phạm vi. **Primitive:** native input type checkbox. **Kiểm tra:** click label/Space đúng một lần, chọn một phần không báo tất cả.

### CMP-024 — Radio

- **Mục đích:** chọn một lựa chọn loại trừ nhau. **Visual/size:** choice-mark tròn + text, target-md, selected dot rõ.
- **States, hover/focus/active:** selected/unselected/disabled/invalid; hover nhẹ, focus độc lập; arrow keys theo nhóm native.
- **Motion:** feedback màu. **Responsive:** nhóm xếp dọc khi hẹp, mô tả không ép một dòng.
- **Accessibility:** cùng name, fieldset/legend, label cho từng option. **Tránh:** checkbox giả radio hoặc mỗi option là một Tab stop tùy biến. **Primitive:** native input type radio. **Kiểm tra:** chỉ một value được chọn, bàn phím đổi trong nhóm.

### CMP-025 — Modal/Dialog

- **Mục đích:** tác vụ ngắn cần tập trung, xác nhận có hậu quả; drawer là biến thể. **Visual/size:** overlay aliases; dialog-sm/md/lg theo nội dung, max-height/viewport margin theo token.
- **States, hover/focus/active:** closed/open/pending/error; focus ban đầu có chủ ý; Tab trong modal, Escape/Close; nút theo contract chung.
- **Motion:** motion.dialog; semantics/focus mở ngay; reduced motion cuối ngay. **Responsive:** fit viewport động, body scroll; nút đóng và action luôn tới được.
- **Accessibility:** native dialog.showModal, title, focus return; mô tả chỉ gắn khi ngắn phù hợp. **Tránh:** modal lồng modal, form dài nhiều bước, backdrop làm mất nháp không báo. **Primitive:** Dialog đã có. **Kiểm tra:** mở từ keyboard, focus không ra nền, đóng về trigger còn tồn tại hoặc đích hợp lý; dữ liệu nháp được giữ/xử lý rõ.

### CMP-026 — Toast

- **Mục đích:** phản hồi không chặn, ngắn sau thao tác. **Visual/size:** surface/status icon + text + close; giới hạn layout.toast-max và viewport; không che primary action.
- **States, hover/focus/active:** entering/visible/paused/dismissed; nút close/action theo Button; focus người dùng không bị toast lấy đi.
- **Motion:** opacity/offset motion.menu, auto-dismiss theo timing.toast-dismiss chỉ success không action. **Responsive:** đặt nơi không che input/bàn phím; queue tránh chồng nhiều.
- **Accessibility:** role status mặc định; error cấp thiết mới alert, không announce trùng inline; action/error không tự mất. **Tránh:** toast là nơi duy nhất của lỗi field hoặc biên nhận quan trọng. **Primitive:** chưa có Toast shared; ưu tiên feedback inline hiện có trước khi tạo. **Kiểm tra:** hover/focus pause, close có tên, toast không làm mất nội dung cần đọc lại.

## System feedback

### CMP-027 — Loading

- **Mục đích:** xác nhận vùng đang chờ dữ liệu. **Visual/size:** secondary text + MAY spinner icon-md; giữ vùng layout hợp lý, inline/section/page theo request scope.
- **States, hover/focus/active:** idle/pending/complete/error; text không tương tác, retry/cancel chỉ nếu có chức năng thật; control pending không mất focus.
- **Motion:** spinner-cycle nếu cần, reduced motion text tĩnh. **Responsive:** không overlay toàn page khi chỉ một section tải.
- **Accessibility:** role status ngắn, aria-busy vùng liên quan; không announce mỗi vòng spinner. **Tránh:** progress giả, loading vô hạn không đường xử lý. **Primitive:** LoadingState, hooks async. **Kiểm tra:** mạng chậm vẫn biết vùng chờ, hoàn tất chuyển đúng data/empty/error.

### CMP-028 — Skeleton

- **Mục đích:** giữ cấu trúc khi lần tải đầu chưa có dữ liệu; MAY dùng khi biết layout. **Visual/size:** surface-subtle/line, radius tương ứng, khớp số vùng quan trọng.
- **States, hover/focus/active:** visible/removed; không hover/focus/click. **Motion:** mặc định tĩnh, không shimmer bắt buộc.
- **Responsive:** skeleton theo layout thật của breakpoint. **Accessibility:** aria-hidden từng khối, một status text duy nhất cho vùng tải.
- **Tránh:** skeleton chứa số giả/che dữ liệu cũ mỗi refetch hoặc xuất hiện vài frame gây chớp. **Primitive:** chưa có shared Skeleton; LoadingState là fallback. **Kiểm tra:** khi data đến không lệch cấu trúc lớn, không có phần tử skeleton trong Tab order.

### CMP-029 — Empty state

- **Mục đích:** giải thích không có dữ liệu/kết quả/đăng ký. **Visual/size:** text rõ, icon MAY nhỏ, inline trong vùng dữ liệu hoặc section padding panel.
- **States, hover/focus/active:** chưa có dữ liệu / không khớp bộ lọc / chưa có quyền là ba thông điệp khác nhau; CTA riêng có hover/focus/pressed.
- **Motion:** không. **Responsive:** text wrap, CTA accessible. **Accessibility:** heading/text rõ, không chỉ illustration.
- **Tránh:** “Chưa có dữ liệu” cho lỗi mạng hoặc tổng số 0 chưa tải; thêm action không tồn tại. **Primitive:** EmptyState, mở rộng message/action khi được giao. **Kiểm tra:** reset bộ lọc hoặc đường tiếp theo đúng nguyên nhân.

### CMP-030 — Error state

- **Mục đích:** nói điều gì chưa hoàn tất và cách khôi phục. **Visual/size:** danger fg/bg + text/icon; field inline hoặc section, không đỏ toàn page vô cớ.
- **States, hover/focus/active:** field error/request error/session/permission; retry pending và disabled hợp lý; focus field đầu sau submit lỗi.
- **Motion:** hiện ngay, không shake. **Responsive:** lỗi dài wrap, không đè field. **Accessibility:** liên kết error/field; alert chỉ cho lỗi mới cần announce, không đọc liên tục.
- **Tránh:** xóa dữ liệu nhập, raw stack trace, lỗi chỉ toast tự tắt. **Primitive:** ErrorState, native form + hook hiện có. **Kiểm tra:** retry giữ filter/nháp, phân biệt fail với empty và quyền truy cập.

### CMP-031 — Success state

- **Mục đích:** xác nhận tác dụng thật của hành động. **Visual/size:** success text/icon gần vùng thao tác, inline mặc định; toast chỉ theo CMP-026.
- **States, hover/focus/active:** acknowledged/result; link tiếp theo có đủ state; feedback tĩnh không focus.
- **Motion:** opacity ngắn MAY, không confetti. **Responsive:** đặt trong luồng đọc, không che action.
- **Accessibility:** role status khi phản hồi bất đồng bộ; nội dung quan trọng có thể đọc lại. **Tránh:** “Đã gửi nhà trường” khi chỉ lưu mẫu/local; mọi render đều báo thành công. **Primitive:** role status text đang dùng trong form. **Kiểm tra:** thông điệp đúng response và chỉ announce khi hành động hoàn tất.

### CMP-032 — Disabled state

- **Mục đích:** cho biết điều kiện chưa đủ hoặc tác vụ đang khóa. **Visual/size:** disabled tokens, kích thước không đổi, không opacity cả nhóm.
- **States, hover/focus/active:** disabled/read-only/pending phân biệt; disabled không hover tương tác hoặc pressed; aria-disabled có thể vẫn focus khi cần khám phá lý do.
- **Motion:** không. **Responsive:** lý do khóa là text hiện hữu, không chỉ tooltip. **Accessibility:** native disabled cho form khi phù hợp; aria-disabled phải tự chặn lệnh; read-only vẫn đọc/copy được.
- **Tránh:** cursor-only/pointer-events-only làm “disabled”, giấu lý do ở control không thể focus. **Primitive:** thuộc tính native của Button/form. **Kiểm tra:** click/Enter/Space không thực hiện lệnh; giải thích đọc được bằng AT.
