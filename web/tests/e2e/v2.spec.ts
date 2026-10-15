import { expect, test, type Page } from '@playwright/test';

async function signIn(page: Page) {
  await page.getByLabel('Tên đăng nhập', { exact: true }).fill('student01');
  await page.getByLabel('Mật khẩu', { exact: true }).fill('student123');
  await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
  await page.waitForURL((url) => !url.pathname.endsWith('/login'));
  await page.getByRole('heading', { level: 1 }).waitFor();
}

async function openProtected(page: Page, path: string) {
  await page.goto(path);
  await expect(page).toHaveURL(/\/v2\/login$/);
  await signIn(page);
  await expect(page).toHaveURL(new RegExp(path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$'));
}

test('opens both public editions in separate tabs with isolated styles', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Đại học Bách khoa Đà Nẵng');
  const v1Canvas = await page
    .locator('.min-h-dvh')
    .evaluate((element) => getComputedStyle(element).backgroundColor);
  const popupPromise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Xem giao diện V2' }).click();
  const v2 = await popupPromise;
  await expect(v2).toHaveURL(/\/v2\/$/);
  await expect(v2.getByRole('heading', { level: 1 })).toHaveText('Cổng thông tin sinh viên');
  await expect(v2.locator('.portal-v2')).toHaveCSS('background-color', 'rgb(247, 249, 252)');
  await expect(page.locator('.portal-v2')).toHaveCount(0);
  await expect(page.locator('.min-h-dvh')).toHaveCSS('background-color', v1Canvas);
  await expect(v2.getByRole('link', { name: 'Xem giao diện V1' })).toHaveAttribute('href', '/');
});

test('retains a protected detail path and query when comparing editions', async ({ page }) => {
  await openProtected(page, '/v2/academic/courses/1022933?q=PBL1');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('PBL1');
  const counterpart = page.getByRole('link', { name: 'Xem giao diện V1' });
  await expect(counterpart).toHaveAttribute('href', '/academic/courses/1022933?q=PBL1');
  const popupPromise = page.waitForEvent('popup');
  await counterpart.click();
  const v1 = await popupPromise;
  await expect(v1).toHaveURL(/\/login$/);
  await signIn(v1);
  await expect(v1).toHaveURL(/\/academic\/courses\/1022933\?q=PBL1$/);
  await expect(v1.getByRole('heading', { level: 1 })).toContainText('PBL1');
  await expect(v1.locator('.workspace')).toBeVisible();
  await expect(page.locator('.v2-workspace')).toBeVisible();
  await expect(page).toHaveURL(/\/v2\/academic\/courses\/1022933\?q=PBL1$/);
});

test('keeps curriculum search, details, result tabs and logout within v2', async ({ page }) => {
  await openProtected(page, '/v2/dashboard');
  await page.getByRole('link', { name: 'Khung CTĐT', exact: true }).click();
  await page.getByPlaceholder('Tìm tên hoặc mã học phần', { exact: true }).fill('PBL1');
  const row = page.getByRole('row').filter({ hasText: 'PBL1: Dự án lập trình tính toán' });
  await expect(row).toBeVisible();
  await expect(page.getByRole('cell', { name: /Vật lý 1/ })).toHaveCount(0);
  await row.getByRole('link', { name: 'Xem' }).click();
  await expect(page).toHaveURL(/\/v2\/academic\/courses\/1022933$/);
  await page
    .getByRole('navigation', { name: 'Điều hướng chính' })
    .getByRole('link', { name: 'Kết quả học tập' })
    .click();
  await expect(page.getByRole('heading', { name: 'GPA qua các học kỳ' })).toBeVisible();
  await page
    .getByRole('navigation', { name: 'Mục kết quả học tập' })
    .getByRole('link', { name: 'Điểm học kỳ hiện tại', exact: true })
    .click();
  await expect(page).toHaveURL(/\/v2\/academic\/grades\/current$/);
  await expect(page.getByRole('table', { name: 'Điểm học kỳ hiện tại' })).toBeVisible();
  await page.getByRole('button', { name: 'Menu tài khoản' }).click();
  await page.getByRole('button', { name: 'Đăng xuất', exact: true }).click();
  await expect(page).toHaveURL(/\/v2\/login$/);
});

test('opens notifications on the right and restores keyboard focus', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 1080 });
  await openProtected(page, '/v2/dashboard');
  const trigger = page.getByRole('button', { name: 'Thông báo', exact: true });
  await trigger.click();
  const drawer = page.getByRole('dialog', { name: 'Thông báo mới' });
  await expect(drawer).toBeVisible();
  const bounds = await drawer.boundingBox();
  expect(bounds?.x).toBeGreaterThan(800);
  await page.keyboard.press('Escape');
  await expect(drawer).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test('submits requests and prevents duplicate equipment reports in v2', async ({ page }) => {
  await openProtected(page, '/v2/services/requests');
  await page
    .locator('#request-file')
    .setInputFiles({ name: 'invalid.txt', mimeType: 'text/plain', buffer: Buffer.from('invalid') });
  await expect(page.getByRole('status')).toContainText('Chỉ hỗ trợ tệp PDF');
  await page.getByRole('button', { name: 'Làm lại' }).click();
  await page
    .getByLabel('Nội dung đề nghị:', { exact: false })
    .fill('Xác nhận sinh viên để thực tập');
  await page.getByRole('button', { name: 'Nộp đơn trực tuyến' }).click();
  await page.getByRole('button', { name: 'Xác nhận nộp', exact: true }).click();
  await expect(page).toHaveURL(/\/v2\/services\/requests\?view=history$/);
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

test('navigates v2 on mobile and scrolls wide tables without page overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openProtected(page, '/v2/dashboard');
  await page.getByRole('button', { name: 'Mở điều hướng' }).click();
  const drawer = page.getByRole('dialog', { name: 'Điều hướng' });
  await drawer.getByRole('link', { name: 'Chương trình đào tạo', exact: true }).click();
  await expect(page).toHaveURL(/\/v2\/academic\/courses$/);
  await expect(drawer).toHaveCount(0);
  const region = page.getByRole('region', { name: 'Học phần trong chương trình' });
  await expect(region).toBeVisible();
  const width = await region.evaluate((element) => ({
    full: element.scrollWidth,
    visible: element.clientWidth,
  }));
  expect(width.full).toBeGreaterThan(width.visible);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  await region.evaluate((element) => {
    element.scrollLeft = element.scrollWidth;
  });
  await page.getByRole('link', { name: 'Xem' }).first().scrollIntoViewIfNeeded();
  await expect(page.getByRole('link', { name: 'Xem' }).first()).toBeInViewport();
});

test('collapses v2 to icons, navigates groups with the keyboard and remembers the preference', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openProtected(page, '/v2/dashboard');
  const sidebar = page.locator('.v2-sidebar');
  await expect(sidebar).toHaveCSS('width', '256px');
  const bodyWidth = (await page.locator('.v2-workspace-body').boundingBox())!.width;
  await sidebar.getByRole('button', { name: 'Thu gọn menu', exact: true }).click();
  await expect(sidebar).toHaveCSS('width', '72px');
  expect((await page.locator('.v2-workspace-body').boundingBox())!.width).toBeGreaterThan(
    bodyWidth,
  );
  const tuition = sidebar.getByRole('link', { name: 'Học phí', exact: true });
  await tuition.focus();
  await expect(page.getByRole('tooltip')).toHaveText('Học phí');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('tooltip')).toHaveCount(0);
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/v2\/tuition$/);
  await expect(tuition).toHaveAttribute('aria-current', 'page');

  const conduct = sidebar.getByRole('button', { name: 'Rèn luyện & Đoàn hội', exact: true });
  const flyout = sidebar.getByRole('region', { name: 'Rèn luyện & Đoàn hội', exact: true });
  await conduct.focus();
  await page.keyboard.press('ArrowDown');
  await expect(flyout.getByRole('link', { name: 'Tự đánh giá', exact: true })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(flyout).toBeHidden();
  await expect(conduct).toBeFocused();
  await conduct.click();
  await page.keyboard.press('Tab');
  await expect(flyout.getByRole('link', { name: 'Tự đánh giá', exact: true })).toBeFocused();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/v2\/conduct\/class-assessment$/);
  await expect(conduct).toHaveClass(/is-current-group/);
  await expect(flyout).toBeHidden();
  await expect(sidebar).toHaveCSS('width', '72px');

  await page.reload();
  await signIn(page);
  await expect(sidebar).toHaveCSS('width', '72px');
  await sidebar.getByRole('button', { name: 'Mở rộng menu', exact: true }).click();
  await expect(sidebar).toHaveCSS('width', '256px');
  await expect(sidebar.getByText('Cổng thông tin sinh viên', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('dut-v2-sidebar-collapsed'))).toBe('false');
});

test('keeps the mobile drawer expanded and closes collapsed flyouts when resizing', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1024, height: 900 });
  await openProtected(page, '/v2/dashboard');
  const sidebar = page.locator('.v2-sidebar');
  await sidebar.getByRole('button', { name: 'Thu gọn menu' }).click();
  await sidebar.getByRole('button', { name: 'Rèn luyện & Đoàn hội', exact: true }).click();
  await expect(
    sidebar.getByRole('region', { name: 'Rèn luyện & Đoàn hội', exact: true }),
  ).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(sidebar).toBeHidden();
  await expect(page.locator('.sidebar-flyout:popover-open')).toHaveCount(0);
  await page.getByRole('button', { name: 'Mở điều hướng', exact: true }).click();
  const drawer = page.getByRole('dialog', { name: 'Điều hướng', exact: true });
  await expect(drawer.getByText('Cổng thông tin sinh viên', { exact: true })).toBeVisible();
  await expect(drawer.getByRole('button', { name: 'Thu gọn menu' })).toHaveCount(0);
  await drawer.getByRole('link', { name: 'Dịch vụ sinh viên', exact: true }).click();
  await expect(page).toHaveURL(/\/v2\/services\/requests$/);
  await expect(drawer).toHaveCount(0);
  await page.setViewportSize({ width: 1024, height: 900 });
  await expect(sidebar).toHaveCSS('width', '72px');
  await expect(
    sidebar.getByRole('link', { name: 'Dịch vụ sinh viên', exact: true }),
  ).toHaveAttribute('aria-current', 'page');
});

test('hides the v2 sidebar scrollbar while keeping wheel and keyboard access to lower links', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 500 });
  await openProtected(page, '/v2/dashboard');
  const sidebar = page.locator('.v2-sidebar');
  await expect(sidebar).toHaveCSS('scrollbar-width', 'none');
  await sidebar.hover();
  await page.mouse.wheel(0, 500);
  await expect.poll(() => sidebar.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
  await sidebar.evaluate((element) => element.scrollTo({ top: 0, behavior: 'instant' }));
  const registration = sidebar.getByRole('link', { name: 'Đăng ký học phần', exact: true });
  await registration.focus();
  await expect(registration).toBeInViewport();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/v2\/registration$/);
});
