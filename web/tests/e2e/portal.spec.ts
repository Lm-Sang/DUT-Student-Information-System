import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

async function login(page: Page, role: 'student' | 'admin' = 'student', path = '/login') {
  await page.goto(path);
  await page
    .getByLabel('Tên đăng nhập', { exact: true })
    .fill(role === 'student' ? 'student01' : 'admin01');
  await page
    .getByLabel('Mật khẩu', { exact: true })
    .fill(role === 'student' ? 'student123' : 'admin123');
  await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
  await page.waitForURL((url) => url.pathname !== '/login');
  await page.getByRole('heading', { level: 1 }).waitFor();
}

test('redirects protected deep links through login and logs out', async ({ page }) => {
  await login(page, 'student', '/academic/courses/c2');
  await expect(page.getByRole('heading', { name: 'Database Systems', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Menu tài khoản' }).click();
  await page.getByRole('button', { name: 'Đăng xuất', exact: true }).click();
  await expect(page).toHaveURL(/\/login$/);
  await page.goto('/tuition');
  await expect(page).toHaveURL(/\/login$/);
});

test('opens the student account menu and follows its quick links', async ({ page }) => {
  await login(page);
  const trigger = page.getByRole('button', { name: 'Menu tài khoản' });
  await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  const menu = page.getByRole('navigation', { name: 'Menu tài khoản' });
  await expect(menu.getByRole('link')).toHaveCount(5);
  await expect(page.getByText('MSSV 102230369 · Lớp 23T_DT4')).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(trigger).toBeFocused();

  await trigger.click();
  await page.getByRole('main').click({ position: { x: 20, y: 20 } });
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');

  await trigger.click();
  await menu.getByRole('link', { name: 'Học phí' }).click();
  await expect(page).toHaveURL(/\/tuition$/);
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
});

test('opens the student profile and keeps contact drafts during the browser session', async ({
  page,
}) => {
  await login(page);
  await page.getByRole('button', { name: 'Menu tài khoản' }).click();
  await page.getByRole('link', { name: 'Xem hồ sơ sinh viên' }).click();
  await expect(page).toHaveURL(/\/profile$/);
  await expect(page.getByRole('heading', { name: 'Hồ sơ sinh viên', exact: true })).toBeVisible();
  await expect(page.getByText('MSSV 102230369')).toBeVisible();

  await page.getByLabel('Email cá nhân').fill('student@example.com');
  await page.getByLabel('Điện thoại', { exact: true }).fill('0901234567');
  await page.getByRole('button', { name: 'Lưu bản nháp' }).click();
  await expect(page.getByRole('status')).toContainText('Đã lưu bản nháp');

  await page.getByRole('tab', { name: 'Thông tin nhân thân' }).click();
  await page.keyboard.press('ArrowLeft');
  await expect(page.getByRole('tab', { name: 'Thông tin cá nhân' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await page.keyboard.press('ArrowRight');
  await page.getByLabel('Họ và tên mẹ').fill('Nguyễn Thị A');
  await page.getByRole('button', { name: 'Lưu bản nháp' }).click();
  await page.getByRole('button', { name: 'Menu tài khoản' }).click();
  await page
    .getByRole('navigation', { name: 'Menu tài khoản' })
    .getByRole('link', { name: 'Lịch học & lịch thi' })
    .click();
  await page.goBack();
  await expect(page).toHaveURL(/\/profile$/);
  await page.getByRole('tab', { name: 'Thông tin cá nhân' }).click();
  await expect(page.getByLabel('Email cá nhân')).toHaveValue('student@example.com');
  await page.getByRole('tab', { name: 'Thông tin nhân thân' }).click();
  await expect(page.getByLabel('Họ và tên mẹ')).toHaveValue('Nguyễn Thị A');
});

test('shows validation and rejects invalid credentials', async ({ page }) => {
  await page.goto('/login');
  await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
  await expect(page.getByText('Vui lòng nhập tên đăng nhập.')).toBeVisible();
  await page.getByLabel('Tên đăng nhập', { exact: true }).fill('student01');
  await page.getByLabel('Mật khẩu', { exact: true }).fill('invalid123');
  await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('không đúng');
});

test('registers and removes a course while keeping total credits consistent', async ({ page }) => {
  await login(page, 'student', '/registration');
  await expect(page.getByRole('status')).toHaveText('Tổng số tín chỉ: 6');
  await page.getByRole('button', { name: 'Đăng ký', exact: true }).click();
  await expect(page.getByRole('status')).toHaveText('Tổng số tín chỉ: 10');
  const registered = page
    .locator('section')
    .filter({ has: page.getByRole('heading', { name: 'Học phần đã đăng ký', exact: true }) });
  await registered
    .locator('li')
    .filter({ hasText: 'Web Development' })
    .getByRole('button', { name: 'Hủy đăng ký' })
    .click();
  await expect(page.getByRole('status')).toHaveText('Tổng số tín chỉ: 6');
});

test('filters tuition payments and expands a selected record', async ({ page }) => {
  await login(page, 'student', '/tuition');
  await page
    .getByRole('navigation', { name: 'Mục học phí' })
    .getByRole('link', { name: 'Lịch sử & hóa đơn' })
    .click();
  await page.getByLabel('Trạng thái', { exact: true }).selectOption('Paid');
  const history = page.getByRole('table', { name: 'Lịch sử thanh toán và hóa đơn' });
  await expect(history.getByRole('row')).toHaveCount(4);
  await page.getByLabel('Năm học', { exact: true }).selectOption('2026–2027');
  await expect(history.getByRole('row')).toHaveCount(2);
  await expect(history.getByText('DUT-PAY-20260910-0982')).toBeVisible();
  await history.getByRole('button', { name: 'Xem chi tiết' }).click();
  await expect(page.getByText('Mã khoản thu')).toBeVisible();
  await history.getByRole('button', { name: 'Thu gọn' }).click();
  await expect(page.getByText('Mã khoản thu')).toHaveCount(0);
  await page.getByLabel('Tìm kiếm', { exact: true }).fill('no matching transaction');
  await expect(page.getByText('Không tìm thấy khoản học phí phù hợp.')).toBeVisible();
});

test('edits and saves the self assessment, then opens class assessment', async ({ page }) => {
  await login(page, 'student', '/conduct/self-assessment');
  await expect(page.getByRole('heading', { name: 'Tự đánh giá rèn luyện' })).toBeVisible();
  await page.getByRole('spinbutton', { name: 'Điểm tự chấm tiêu chí 1', exact: true }).fill('4');
  await page.getByRole('button', { name: 'Lưu nháp' }).click();
  await expect(page.getByRole('status')).toContainText('Đã lưu bản nháp');
  await page.getByRole('button', { name: 'Rèn luyện & Đoàn hội', exact: true }).click();
  await page.getByRole('link', { name: 'Đánh giá của lớp' }).click();
  await expect(page.getByRole('heading', { name: 'Nội dung đánh giá' })).toBeVisible();
  await page.getByRole('spinbutton', { name: 'Điểm lớp tiêu chí 1', exact: true }).fill('6');
  await page.getByRole('button', { name: 'Lưu nháp' }).click();
  await expect(page.getByRole('status')).toContainText('Đã lưu bản nháp');
  await page.goBack();
  await expect(
    page.getByRole('spinbutton', { name: 'Điểm tự chấm tiêu chí 1', exact: true }),
  ).toHaveValue('4');
  await expect(page.getByText('Đã lưu bản nháp', { exact: true }).first()).toBeVisible();
  await page.goForward();
  await expect(
    page.getByRole('spinbutton', { name: 'Điểm lớp tiêu chí 1', exact: true }),
  ).toHaveValue('6');
  await page.getByLabel('Nhóm tiêu chí', { exact: true }).selectOption('1');
  await page.getByRole('spinbutton', { name: 'Điểm lớp tiêu chí 6', exact: true }).fill('1');
  await page.getByLabel('Nhóm tiêu chí', { exact: true }).selectOption('0');
  await expect(
    page.getByRole('spinbutton', { name: 'Điểm lớp tiêu chí 1', exact: true }),
  ).toHaveValue('6');
  await page.getByPlaceholder('Nhập số thẻ hoặc họ tên sinh viên').fill('102230333');
  await page.getByRole('button', { name: 'Tìm', exact: true }).click();
  await expect(page.getByRole('button', { name: /Nguyễn Ngọc Ánh/ })).toBeVisible();
});

test('filters community activities, opens detail and registration, and returns from results', async ({
  page,
}) => {
  await login(page, 'student', '/community/activities');
  await expect(page.getByRole('heading', { name: 'Các hoạt động cộng đồng' })).toBeVisible();
  await page.getByLabel('Trạng thái', { exact: true }).selectOption('open');
  await expect(page.getByRole('heading', { name: 'Ngày hội Chào đón TSV K26' })).toBeVisible();
  await page.getByRole('link', { name: 'Xem chi tiết' }).first().click();
  await expect(page.getByRole('heading', { name: 'Chi tiết hoạt động' })).toBeVisible();
  await page.getByRole('button', { name: 'Đăng ký tham gia' }).click();
  await expect(page.getByRole('button', { name: 'Đã đăng ký tham gia' })).toBeDisabled();
  await page.getByRole('button', { name: 'Rèn luyện & Đoàn hội', exact: true }).click();
  await page.getByRole('link', { name: 'Kết quả cộng đồng' }).click();
  await expect(page.getByRole('heading', { name: 'Chưa có kết quả được ghi nhận' })).toBeVisible();
  await page.getByRole('link', { name: 'Khám phá hoạt động' }).click();
  await expect(page.getByRole('heading', { name: 'Danh sách hoạt động' })).toBeVisible();
});

test('submits a service request and equipment report with duplicate prevention', async ({
  page,
}) => {
  await login(page, 'student', '/services/requests');
  await expect(page.getByRole('heading', { name: 'Dịch vụ sinh viên' })).toBeVisible();
  await page.locator('#request-file').setInputFiles({
    name: 'invalid.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('invalid'),
  });
  await expect(page.getByRole('status')).toContainText('Chỉ hỗ trợ tệp PDF');
  await page.locator('#request-file').setInputFiles({
    name: 'minh-chung.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.from('%PDF-1.4'),
  });
  await expect(page.getByText('minh-chung.pdf')).toBeVisible();
  await page.getByRole('button', { name: 'Làm lại' }).click();
  await expect(page.getByText('Chưa chọn tệp')).toBeVisible();
  await page
    .getByLabel('Nội dung đề nghị:', { exact: false })
    .fill('Xác nhận sinh viên để thực tập');
  await page.getByRole('button', { name: 'Nộp đơn trực tuyến' }).click();
  await page.getByRole('button', { name: 'Xác nhận nộp', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Đã lập đơn đề nghị');
  await expect(page.getByText('Tổng số:')).toContainText('12 đơn');
  await page
    .getByRole('navigation', { name: 'Mục dịch vụ' })
    .getByRole('link', { name: 'Báo thiết bị' })
    .click();
  await page.getByLabel('Phòng học:').selectOption('F108');
  await page.getByLabel('Sự cố thiết bị:').selectOption('Đèn');
  await page.getByLabel('Mô tả chi tiết sự cố').fill('Đèn dãy 3 không sáng');
  await page.getByRole('button', { name: 'Tạo lần báo mới' }).click();
  await expect(page.getByRole('status')).toContainText('Đã tạo lượt báo');
  await page.getByLabel('Mô tả chi tiết sự cố').fill('Đèn dãy 3 vẫn không sáng');
  await page.getByRole('button', { name: 'Tạo lần báo mới' }).click();
  await expect(page.getByRole('status')).toContainText('đang xử lý');
});

test('keeps admin and student routes separated', async ({ page }) => {
  await login(page, 'admin', '/tuition');
  await expect(page.getByRole('heading', { name: 'Tổng quan quản trị' })).toBeVisible();
  await expect(page).toHaveURL(/\/admin$/);
  await page.getByRole('button', { name: 'Menu tài khoản' }).click();
  await page.getByRole('button', { name: 'Đăng xuất' }).click();
  await login(page, 'student', '/admin');
  await expect(page.getByRole('heading', { name: 'Chào Lê Minh Sang!' })).toBeVisible();
  await expect(page).toHaveURL(/\/dashboard$/);
});

test('navigates the app bar by keyboard and searches the curriculum', async ({ page }) => {
  await login(page);
  const academic = page.getByRole('button', { name: 'Chương trình đào tạo', exact: true });
  await academic.focus();
  await expect(academic).toHaveAttribute('aria-expanded', 'false');
  await page.keyboard.press('Enter');
  await expect(academic).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Tab');
  await expect(
    page
      .getByRole('navigation', { name: 'Điều hướng chính' })
      .getByRole('link', { name: 'Học phần', exact: true }),
  ).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'Khung chương trình đào tạo' })).toBeVisible();
  await page.getByPlaceholder('Tìm tên hoặc mã học phần', { exact: true }).fill('PBL1');
  await expect(page.getByRole('cell', { name: /PBL1: Dự án lập trình tính toán/ })).toBeVisible();
  await expect(page.getByRole('cell', { name: /Vật lý 1/ })).toHaveCount(0);
});

test('shows the detailed class schedule and keeps its actions usable on mobile', async ({
  page,
}) => {
  await login(page, 'student', '/academic/schedule');
  const table = page.getByRole('table', { name: 'Lịch học', exact: true });
  await expect(table.getByRole('columnheader')).toHaveText([
    'Mã HP / Lớp HP',
    'Tên học phần & giảng viên',
    'Số TC',
    'Thời gian học',
    'Địa điểm',
    'Tuần',
    'Tác vụ',
  ]);
  const project = table.getByRole('row').filter({ hasText: '1023780.2610.23.11A' });
  await expect(project).toContainText('Trọng điểm');
  await expect(project).toContainText('12:30 - 16:15');
  await expect(project).toContainText('C1.201 Lab');
  await project.getByRole('button', { name: 'Công thức điểm PBL 6: Dự án CN CNPM' }).click();
  await expect(page.getByRole('status')).toContainText('Đồ án 40% + Cuối kỳ 60%');

  await page.setViewportSize({ width: 390, height: 844 });
  const region = page.getByRole('region', { name: 'Danh sách lịch học', exact: true });
  await expect(region).toBeVisible();
  await expect(region).toContainText('C1.201 Lab');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  await region
    .locator('article')
    .filter({ has: page.getByRole('heading', { name: 'PBL 6: Dự án CN CNPM', exact: true }) })
    .getByText('Chi tiết lớp', { exact: true })
    .click();
  await region.getByRole('button', { name: 'Đề cương PBL 6: Dự án CN CNPM' }).click();
  await expect(page.getByRole('status')).toContainText('Đề cương');
});

test('keeps navigation groups independent and follows their destinations', async ({ page }) => {
  await login(page);
  const services = page.getByRole('button', { name: 'Dịch vụ', exact: true });
  const conduct = page.getByRole('button', { name: 'Rèn luyện & Đoàn hội', exact: true });
  await services.click();
  await expect(services).toHaveAttribute('aria-expanded', 'true');
  await expect(conduct).toHaveAttribute('aria-expanded', 'false');
  await conduct.click();
  await page.getByRole('link', { name: 'Tự đánh giá rèn luyện', exact: true }).click();
  await expect(page).toHaveURL(/\/conduct\/self-assessment$/);
  await services.click();
  await page.getByRole('link', { name: 'Đề nghị trường', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Dịch vụ sinh viên' })).toBeVisible();
});

test('focuses course search with Ctrl K and preserves the query in the URL', async ({ page }) => {
  await login(page);
  await page.keyboard.press('Control+k');
  const input = page.getByRole('searchbox', { name: 'Tìm học phần' });
  await expect(input).toBeFocused();
  await input.fill('PBL1');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/courses\?q=PBL1$/);
  await expect(page.getByRole('cell', { name: /PBL1: Dự án lập trình tính toán/ })).toBeVisible();
});

test('keeps a tuition dialog focused, dismisses with Escape, and restores focus', async ({
  page,
}) => {
  await login(page, 'student', '/tuition');
  const trigger = page.getByRole('button', { name: /Nộp ngay đợt 1/ });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Hướng dẫn nộp học phí' });
  await expect(dialog).toBeVisible();
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press('Tab');
    expect(await dialog.evaluate((el) => el.contains(document.activeElement))).toBe(true);
  }
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe('');
});

test('navigates through the mobile drawer and restores focus on dismiss', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  await login(page);
  const trigger = page.getByRole('button', { name: 'Mở điều hướng' });
  await trigger.tap();
  const drawer = page.getByRole('dialog', { name: 'Điều hướng' });
  await expect(drawer).toBeVisible();
  const bounds = await drawer.boundingBox();
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(390);
  await page.keyboard.press('Escape');
  await expect(drawer).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await trigger.tap();
  await drawer.getByRole('button', { name: 'Dịch vụ', exact: true }).tap();
  await drawer.getByRole('link', { name: 'Đề nghị trường', exact: true }).tap();
  await expect(drawer).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Dịch vụ sinh viên' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  await context.close();
});

test('constrains wide layouts, contains mobile content, and resets route scroll', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1920, height: 700 });
  await login(page);
  const main = page.locator('#main-content');
  expect((await main.boundingBox())!.width).toBeLessThanOrEqual(1440);
  await page.evaluate(() =>
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }),
  );
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(100);
  await page
    .getByRole('navigation', { name: 'Điều hướng chính' })
    .getByRole('link', { name: 'Học phí', exact: true })
    .click();
  await expect(page).toHaveURL(/\/tuition$/);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await page.setViewportSize({ width: 390, height: 844 });
  expect((await main.boundingBox())!.width).toBe(390);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});

test('removes page and control motion when reduced motion is requested', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('/login');
  await expect(page.getByRole('main')).toHaveCSS('animation-name', 'none');
  await expect(page.getByRole('button', { name: 'Đăng nhập', exact: true })).toHaveCSS(
    'transition-duration',
    '0s',
  );
  await context.close();
});

test('calculates PLO scores from the editable weights and scores', async ({ page }) => {
  await login(page, 'student', '/academic/grades/plo');
  await expect(page.getByRole('heading', { name: 'Chuẩn đầu ra & điểm PLO' })).toBeVisible();
  await page.getByRole('spinbutton', { name: 'Điểm PI 1.1 · Chỉ số minh họa 1' }).fill('9');
  await page.getByRole('button', { name: 'Tính điểm' }).click();
  await expect(page.getByText('8.05 / 10')).toBeVisible();
  await page.getByRole('button', { name: 'Ẩn kết quả' }).click();
  await expect(page.getByText('8.05 / 10')).toHaveCount(0);
  await page.getByRole('button', { name: 'Hiện kết quả' }).click();
  await expect(page.getByText('8.05 / 10')).toBeVisible();
});

test('opens and saves thesis information locally', async ({ page }) => {
  await login(page, 'student', '/academic/thesis');
  await expect(page.getByRole('heading', { name: 'Đồ án / Khóa luận tốt nghiệp' })).toBeVisible();
  await page.getByRole('button', { name: 'Xem dữ liệu' }).click();
  await expect(page.getByRole('heading', { name: 'Thông tin đề tài tốt nghiệp' })).toBeVisible();
  await page.getByPlaceholder('Nhập tên đề tài').fill('Cổng thông tin sinh viên DUT');
  await page.getByPlaceholder('Nhập họ tên giảng viên').fill('Nguyễn Văn A');
  await page.getByRole('button', { name: 'Lưu thông tin' }).click();
  await expect(page.getByRole('status')).toContainText('Đã lưu thông tin');
  await page.getByPlaceholder('Nhập tên đề tài').fill('Bản sửa chưa lưu');
  await page.getByRole('button', { name: 'Hủy thay đổi' }).click();
  await expect(page.getByPlaceholder('Nhập tên đề tài')).toHaveValue(
    'Cổng thông tin sinh viên DUT',
  );
  await page.getByLabel('Chọn học kỳ đề tài').selectOption('HK2 · 2025 – 2026');
  await expect(page.getByPlaceholder('Nhập tên đề tài')).toBeEmpty();
  await page.getByLabel('Chọn học kỳ đề tài').selectOption('HK1 · 2026 – 2027');
  await expect(page.getByPlaceholder('Nhập tên đề tài')).toHaveValue(
    'Cổng thông tin sinh viên DUT',
  );
});

test('keeps light mode despite the system preference and a saved dark preference', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.addInitScript(() => localStorage.setItem('dut-theme', 'dark'));
  for (const route of ['/', '/login']) {
    await page.goto(route);
    await expect(page.locator('html')).toHaveCSS('color-scheme', 'light only');
    await expect(page.getByRole('button', { name: /Chuyển sang giao diện/ })).toHaveCount(0);
  }
  await login(page);
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(247, 249, 252)');
  await page
    .getByRole('navigation', { name: 'Điều hướng chính' })
    .getByRole('link', { name: 'Học phí', exact: true })
    .click();
  await expect(page.locator('html')).toHaveCSS('color-scheme', 'light only');
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Đăng nhập', exact: true })).toBeVisible();
  await expect(page.locator('html')).toHaveCSS('color-scheme', 'light only');
});

test('keeps service drafts and file selection when switching sections and using Back', async ({
  page,
}) => {
  await login(page, 'student', '/services/requests');
  const nav = page.getByRole('navigation', { name: 'Mục dịch vụ' });
  await page.getByLabel('Ghi chú bổ sung:').fill('Nhận bản giấy vào thứ sáu');
  await page.locator('#request-file').setInputFiles({
    name: 'giay-xac-nhan.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.from('%PDF-1.4'),
  });
  await nav.getByRole('link', { name: 'Theo dõi đơn', exact: true }).click();
  await expect(page).toHaveURL(/view=history$/);
  await expect(page.getByRole('heading', { name: 'Đơn đã lập', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Nộp đơn trực tuyến' })).toBeHidden();
  await page.goBack();
  await expect(page.getByLabel('Ghi chú bổ sung:')).toHaveValue('Nhận bản giấy vào thứ sáu');
  await expect(
    page.getByRole('button', { name: 'Xem giay-xac-nhan.pdf', exact: true }),
  ).toBeVisible();
  await nav.getByRole('link', { name: 'Báo thiết bị', exact: true }).click();
  await expect(
    page.getByRole('region', { name: 'Các lần sinh viên khác đã báo', exact: true }),
  ).toBeHidden();
  await page.getByRole('button', { name: /Sự cố sinh viên khác đã báo/ }).click();
  await expect(
    page.getByRole('region', { name: 'Các lần sinh viên khác đã báo', exact: true }),
  ).toBeVisible();
});

test('opens secondary assessment criteria with the keyboard and retains edited scores', async ({
  page,
}) => {
  await login(page, 'student', '/conduct/self-assessment');
  const groups = page
    .locator('.disclosure')
    .filter({ has: page.getByRole('region', { name: /^Tiêu chí /, includeHidden: true }) });
  const second = groups.nth(1);
  const trigger = second.getByRole('button');
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await trigger.focus();
  await page.keyboard.press('Enter');
  const input = second.getByRole('spinbutton').first();
  await input.fill('1');
  await trigger.click();
  await expect(input).toBeHidden();
  await page.emulateMedia({ media: 'print' });
  await expect(second.locator('.disclosure-content')).toHaveCSS('display', 'block');
  await page.emulateMedia({ media: 'screen' });
  await trigger.click();
  await expect(input).toHaveValue('1');
  await page.getByRole('button', { name: 'Lưu nháp', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Đã lưu bản nháp');
});

test('filters public announcements while keeping summaries visible', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('textbox', { name: 'Tìm thông báo' }).fill('Học phí');
  await expect(page.getByRole('status')).toHaveText('Hiển thị 1 trên tổng số 4 thông báo');
  await expect(
    page.getByText('Thông báo thời gian và hình thức nộp học phí', { exact: false }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Lọc tin', exact: true }).click();
  await expect(page.getByLabel('Kết quả thông báo')).toBeFocused();
  await page.getByRole('button', { name: 'Xem chi tiết', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await expect(
    dialog.getByText('Thông báo thời gian và hình thức nộp học phí', { exact: false }),
  ).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Xem chi tiết', exact: true })).toBeFocused();
});

test('shows Microsoft sign-in and account help on the public home page', async ({ page }) => {
  await page.goto('/');
  const card = page.getByRole('region', { name: 'Đăng nhập Microsoft 365', exact: true });
  await expect(card.getByText('MSSV@sv.dut.udn.vn', { exact: true })).toBeVisible();
  const microsoftButton = card.getByRole('button', { name: 'Đăng nhập bằng Microsoft Office 365' });
  await microsoftButton.focus();
  await page.keyboard.press('Enter');
  const unavailable = page.getByRole('dialog', { name: 'Đăng nhập Microsoft 365', exact: true });
  await expect(unavailable.getByRole('status')).toContainText('chưa khả dụng');
  await page.keyboard.press('Escape');
  await expect(microsoftButton).toBeFocused();

  await card.getByRole('button', { name: 'Hướng dẫn kích hoạt tài khoản' }).click();
  await expect(page.getByRole('dialog')).toContainText('MSSV@sv.dut.udn.vn');
  await page.getByRole('button', { name: 'Đóng', exact: true }).click();
  await card.getByRole('button', { name: 'Quên mật khẩu?' }).click();
  await expect(page.getByRole('dialog')).toContainText('khôi phục');
  await page.getByRole('link', { name: 'Xem thông tin hỗ trợ', exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page).toHaveURL(/#ho-tro$/);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('link', { name: 'Đăng nhập', exact: true }).click();
  await expect(page).toHaveURL(/#microsoft-sign-in$/);
  await expect(card.getByRole('heading')).toBeInViewport();
  await microsoftButton.click();
  await unavailable.getByRole('link', { name: 'Đăng nhập bằng tài khoản trải nghiệm' }).click();
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByLabel('Tên đăng nhập', { exact: true })).toBeVisible();
});

test('uses the full width beneath the app bar regardless of saved sidebar preferences', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.addInitScript(() => {
    localStorage.setItem('dut-sidebar-collapsed', 'true');
    localStorage.setItem('dut-v2-sidebar-collapsed', 'true');
  });
  await login(page);
  const header = page.locator('.workspace-header');
  const nav = header.getByRole('navigation', { name: 'Điều hướng chính' });
  await expect(nav).toBeVisible();
  await expect(page.locator('.workspace-sidebar')).toHaveCount(0);
  await expect(page.locator('.workspace-body')).toHaveCSS('width', '1440px');
  expect((await nav.boundingBox())!.y).toBeLessThan((await page.locator('main').boundingBox())!.y);
  const tuition = nav.getByRole('link', { name: 'Học phí', exact: true });
  await tuition.click();
  await expect(page).toHaveURL(/\/tuition$/);
  await expect(tuition).toHaveAttribute('aria-current', 'page');
  const academic = nav.getByRole('button', { name: 'Chương trình đào tạo', exact: true });
  await academic.focus();
  await page.keyboard.press('ArrowDown');
  await expect(nav.getByRole('link', { name: 'Học phần', exact: true })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(academic).toHaveAttribute('aria-expanded', 'false');
  await expect(academic).toBeFocused();
  await expect(page.getByRole('button', { name: 'Thu gọn menu' })).toHaveCount(0);
});

test('replaces the desktop app bar menus with a complete mobile drawer', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await login(page);
  const nav = page.locator('.workspace-header-nav');
  await nav.getByRole('button', { name: 'Dịch vụ', exact: true }).click();
  await expect(nav.getByRole('link', { name: 'Đề nghị trường', exact: true })).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(nav).toBeHidden();
  await page.getByRole('button', { name: 'Mở điều hướng', exact: true }).click();
  const drawer = page.getByRole('dialog', { name: 'Điều hướng', exact: true });
  await expect(drawer.getByText('Student Portal', { exact: true })).toBeVisible();
  await expect(drawer.getByRole('button', { name: 'Thu gọn menu' })).toHaveCount(0);
  await drawer.getByRole('button', { name: 'Dịch vụ', exact: true }).click();
  await drawer.getByRole('link', { name: 'Đề nghị trường', exact: true }).click();
  await expect(page).toHaveURL(/\/services\/requests$/);
  await expect(drawer).toHaveCount(0);
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(nav).toBeVisible();
  await expect(nav.getByRole('button', { name: 'Dịch vụ', exact: true })).toHaveAttribute(
    'aria-expanded',
    'false',
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(1440);
});
