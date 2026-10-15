# 12 — Quy trình Git và thay đổi có kiểm soát

Quy tắc này áp dụng cho cả developer và Codex. Trước khi sửa hoặc dọn dẹp, xem trạng thái Git để nhận ra thay đổi đã có; chỉ chạm các file thuộc tác vụ.

## 1. Nhánh và phạm vi

- Xác nhận nhánh hiện tại bằng `git branch --show-current` và nhánh đích của repository/PR. Không mặc định mọi dự án có `develop`; checkout này đang dùng `main`.
- Nếu nhóm làm việc theo nhánh tính năng, tên gợi ý: `feat/login`, `fix/grade-overflow`, `docs/flutter-rules`. Theo quy ước của nhóm nếu đã có.
- Không reset, clean, checkout đè, xóa hoặc stage các thay đổi không thuộc tác vụ. Nếu working tree bẩn, phân biệt rõ phần của mình với phần đã có.

## 2. Trước khi commit hoặc gửi PR

```sh
git status --short
git diff --check
git diff -- <duong-dan-file>
```

Kiểm tra mã đã format, analyze và test phù hợp theo quy tắc chất lượng. Đọc diff để phát hiện file generated, lockfile, secret hoặc thay đổi ngoài phạm vi. Stage chính xác file/hunk liên quan:

```sh
git add -- <duong-dan-file>
# Hoặc: git add -p -- <duong-dan-file>
git diff --cached --check
git diff --cached
```

Tránh `git add .` khi repository có thay đổi song song. Nếu tác vụ không yêu cầu commit/push, để thay đổi ở working tree và báo các file đã sửa cùng kết quả kiểm tra.

## 3. Thông điệp commit

Một commit nên có một mục đích rõ ràng. Có thể dùng [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) nếu dự án chọn quy ước này:

```text
<type>(<scope>): <mô tả ngắn>
```

Ví dụ: `feat(auth): thêm kiểm tra phiên đăng nhập`, `fix(ui): sửa tràn chữ trên màn hình nhỏ`, `docs: cập nhật quy tắc Flutter`. `feat` và `fix` có nghĩa theo đặc tả Conventional Commits; các type khác như `docs`, `test`, `refactor` do nhóm thống nhất. Dùng body để giải thích lý do, tác động và breaking change khi cần. Không bắt buộc giới hạn cứng 50 ký tự nếu làm mất ý.

## 4. PR/review

Mô tả mục tiêu, cách kiểm tra, ảnh/video của UI nếu hữu ích và các giới hạn chưa kiểm chứng (ví dụ chưa có môi trường iOS). Review cách thay đổi ảnh hưởng Android, iOS, accessibility và dữ liệu. Chỉ merge theo quy trình của repository; cập nhật tài liệu khi quyết định kiến trúc hoặc quy tắc thay đổi.

## Tài liệu gốc

- [Git: status](https://git-scm.com/docs/git-status)
- [Git: add và stage từng phần](https://git-scm.com/docs/git-add)
- [Git: diff](https://git-scm.com/docs/git-diff)
- [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/)
