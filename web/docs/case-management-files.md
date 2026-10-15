# File thay đổi trong đợt redesign hồ sơ

Danh sách giới hạn ở công việc hồ sơ của master prompt, không phải toàn bộ `git status`. Workspace đã có nhiều thay đổi cấu trúc trước đợt này; không reset, ghi đè hoặc gom các thay đổi không liên quan. Đường dẫn dưới đây tính từ thư mục `web`.

## Model, nghiệp vụ và lưu trữ

| File                                                 | Nội dung                                                            |
| ---------------------------------------------------- | ------------------------------------------------------------------- |
| `src/features/services/types/requests.ts`            | Policy, audit, phiếu theo bước, marker demo, trạng thái chờ         |
| `src/features/services/data/requestCatalog.ts`       | 32 thủ tục, form chứng chỉ động, 8 quy trình và tên hành động       |
| `src/features/services/data/procedurePolicy.ts`      | Kênh nộp/minh chứng/xử lý/trả, yêu cầu gốc/ký/dấu/đợt               |
| `src/features/services/data/requestState.ts`         | Lifecycle, chờ ai, trả kết quả, deadline và hàng đợi                |
| `src/features/services/data/reviewLabels.ts`         | Nhãn tiếng Việt cho phiếu và audit                                  |
| `src/features/services/services/requestRules.ts`     | Validation biểu mẫu/tệp và điều kiện chuyển bước                    |
| `src/features/services/services/requests.service.ts` | Quyền, DTO công khai, mutation, audit, draft và reset demo          |
| `src/features/services/storage/requestStore.ts`      | IndexedDB adapter, migration v2, transaction/revision/seed metadata |
| `src/features/services/mocks/requests.mock.ts`       | 40 hồ sơ giả lập có marker, phân công, tệp và sự kiện import        |
| `src/features/services/mocks/evidence.mock.ts`       | Tạo PDF mẫu đọc được, không mô phỏng giấy chính thức                |
| `src/features/services/mocks/imageEvidence.mock.ts`  | Bytes PNG/JPG tổng hợp để xem trước/tải xuống                       |

## Hooks và UI dùng chung V1/V2

| File                                                         | Nội dung                                                         |
| ------------------------------------------------------------ | ---------------------------------------------------------------- |
| `src/features/services/hooks/useRequests.ts`                 | Đọc/ghi service, đồng bộ, thông báo, thao tác demo               |
| `src/features/services/hooks/useRequestDraft.ts`             | Bản nháp sinh viên trong bộ nhớ tab theo thủ tục                 |
| `src/features/services/hooks/useRequestWorkspace.ts`         | Lọc/sắp xếp, việc cần chú ý, hoạt động gần đây                   |
| `src/features/services/pages/ServiceRequestsPage.tsx`        | Trang sinh viên, tìm đơn, giữ chi tiết khi có revision mới       |
| `src/features/services/pages/StaffRequestsPage.tsx`          | Workspace chuyên viên/admin, KPI, hàng đợi, khối lượng           |
| `src/features/services/components/ProcedureCatalog.tsx`      | Danh mục gọn, tìm/lọc và chọn thủ tục                            |
| `src/features/services/components/CreateRequestForm.tsx`     | Form động, hướng dẫn trước nhập, lỗi inline, xác nhận nộp        |
| `src/features/services/components/RequestUi.tsx`             | Trường nhập, chọn/xem trước/tải tệp, bảng hồ sơ                  |
| `src/features/services/components/RequestDetail.tsx`         | Tóm tắt, ba tab chi tiết, giữ draft và giải quyết xung đột       |
| `src/features/services/components/RequestTracking.tsx`       | Bước có sự kiện thật, chờ ai, timeline và audit trước/sau        |
| `src/features/services/components/ProcessingPanel.tsx`       | Checklist/phiếu theo bước, điều kiện thiếu, lưu nháp/chuyển bước |
| `src/features/services/components/AssignmentPanel.tsx`       | Phân công đúng đơn vị, khối lượng, xác nhận thay đổi             |
| `src/features/services/components/StudentRequestActions.tsx` | Bổ sung/hủy có lý do và xác nhận                                 |
| `src/features/services/components/DemoDataPanel.tsx`         | Nạp/reset có phạm vi và xác nhận cụ thể                          |
| `src/app/styles/requests.css`                                | Layout, bảng, panel, responsive và tinh chỉnh V1/V2              |
| `src/app/router/AppRoutes.tsx`                               | Lazy-load feature hồ sơ qua public index để giảm bundle ban đầu  |

## Kiểm thử, công cụ và tài liệu

- `src/features/services/services/requestRules.test.ts`: form động, điều kiện quy trình, bản gốc/đợt/ký/dấu/trả kết quả.
- `src/features/services/services/requests.service.test.ts`: service + fake IndexedDB; quyền, bytes, migration, audit, quota, revision, reset và private DTO.
- `tests/e2e/requests.spec.ts`: 10 ca hồ sơ xuyên vai trò, V1/V2 và nhiều tab.
- `tests/e2e/portal.spec.ts`, `tests/e2e/v2.spec.ts`, `tests/e2e/redesign.spec.ts`: cập nhật kỳ vọng dữ liệu mẫu, biểu mẫu và nút xem trước; giữ kiểm thử các module cũ.
- `scripts/check-architecture.mjs`: cho phép fixture đọc fixture trong cùng lớp mocks, giữ ranh giới page/hook/service và public feature index.
- `scripts/create-evidence-fixtures.mjs`: tạo ảnh minh chứng tổng hợp bằng canvas trong Chromium.
- `scripts/export-procedure-matrix.mjs`: xuất ma trận từ cấu hình hiện hành.
- `scripts/capture-request-screens.mjs`: chụp V1/V2 ba vai trò trong context riêng.
- `package.json`, `package-lock.json`: thêm dev dependency `fake-indexeddb`; cập nhật dependency chuyển tiếp `source-map-js` qua npm.
- `docs/README.md`, `docs/request-workflow.md`: cập nhật chỉ mục và tài liệu gốc theo triển khai mới.
- `docs/case-management-audit.md`: rà soát nguồn, nghiệp vụ và kế hoạch thiết kế.
- `docs/procedure-matrix.md`: ma trận 32 thủ tục / 8 quy trình sinh từ code.
- `docs/case-management-delivery.md`: tài khoản, kịch bản thủ công, reset, kết quả kiểm thử và giới hạn.
- `docs/case-management-files.md`: danh sách này.
- `docs/screenshots/requests/*.png`: 20 ảnh Student/Staff/Admin V1/V2 desktop/mobile và các vị trí panel/hàng đợi.

`EquipmentReports.tsx`, public `index.ts` và `requestFormatting.ts` đã được kiểm tra định dạng nhưng không thay đổi nội dung trong đợt redesign. Không chỉnh các module học tập, học phí, rèn luyện, hoạt động hoặc Flutter để thực hiện yêu cầu hồ sơ.

## Mở rộng dữ liệu mẫu v3

- `src/shared/config/demoAccounts.ts`: danh mục thống nhất 16 chuyên viên / 12 sinh viên; auth mock và danh sách phân công dùng chung ID.
- `src/features/services/data/demoScenarios.ts`, `mocks/requests.mock.ts`, `mocks/review.mock.ts`: 428 hồ sơ, mọi bước của 32 loại; thông tin kiểm tra và kết quả phù hợp với bước mẫu.
- `storage/requestStore.ts`: nạp thêm theo phiên bản, tương thích metadata v2, chống nạp đồng thời; chỉ đặt lại mới xóa các hồ sơ có marker.
- `components/DemoDataPanel.tsx`: nạp bộ mới, bảng tài khoản; `AssignmentPanel.tsx` và trang chuyên viên hiện username.
- `hooks/useRequestWorkspace.ts`, `pages/StaffRequestsPage.tsx`: lọc chính xác loại đề nghị, đưa quản lý bộ mẫu lên trước hàng đợi.
- `auth/pages/LoginPage.tsx`, `services/hooks/useRequests.ts`: cập nhật thông tin bộ mẫu và tài khoản.
- `auth/services/auth.service.test.ts`, `services/services/demoData.test.ts`, `services/services/requests.service.test.ts`, `tests/e2e/requests.spec.ts`: đăng nhập, độ phủ bộ mẫu, 32 quy trình từ đầu đến cuối, nạp thêm an toàn và thao tác tài khoản mới qua ba vai trò.
- `docs/demo-testing.md`, README và tài liệu luồng/bàn giao: hướng dẫn và bảng tra hồ sơ từng loại.
