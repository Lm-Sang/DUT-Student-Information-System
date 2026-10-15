import { expect, test, type Page } from '@playwright/test';
for (const prefix of ['', '/v2']) {
  test(`${prefix || 'v1'} announces a new page and preserves focus on query tabs`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await login(page, prefix + '/dashboard');
    const nav = page.getByRole('navigation', { name: 'Điều hướng chính' });
    if (prefix) await nav.getByRole('link', { name: 'Dịch vụ sinh viên', exact: true }).click();
    else {
      await nav.getByRole('button', { name: 'Dịch vụ', exact: true }).click();
      await nav.getByRole('link', { name: 'Đề nghị trường', exact: true }).click();
    }
    await expect(page).toHaveURL(new RegExp(prefix + '/services/requests$'));
    await expect(page.locator('#main-content')).toBeFocused();
    const history = page
      .getByRole('navigation', { name: 'Mục dịch vụ' })
      .getByRole('link', { name: 'Theo dõi đơn', exact: true });
    await history.click();
    await expect(page).toHaveURL(/view=history$/);
    await expect(history).toBeFocused();
  });
}
async function login(page: Page, route: string) {
  await page.goto(route);
  await page.getByLabel('Tên đăng nhập', { exact: true }).fill('student01');
  await page.getByLabel('Mật khẩu', { exact: true }).fill('student123');
  await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
  await page.waitForURL('**/dashboard');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
}
test('v1 dropdown opens on click, toggles closed, and never requires hovering', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await login(page, '/dashboard');
  const trigger = page.getByRole('button', { name: 'Chương trình đào tạo', exact: true });
  await trigger.hover();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('link', { name: 'Đồ án & tốt nghiệp', exact: true })).toBeVisible();
  await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await trigger.focus();
  await page.keyboard.press('ArrowDown');
  await expect(
    page
      .getByRole('navigation', { name: 'Điều hướng chính' })
      .getByRole('link', { name: 'Học phần', exact: true }),
  ).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
});
test('v2 opens nested study links and focuses truthful course search with Ctrl K', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await login(page, '/v2/dashboard');
  const nav = page.getByRole('navigation', { name: 'Điều hướng chính' });
  await nav.getByRole('button', { name: 'Mục con Kết quả học tập', exact: true }).click();
  await nav.getByRole('link', { name: 'Điểm PLO', exact: true }).click();
  await expect(page).toHaveURL(/\/v2\/academic\/grades\/plo$/);
  await page.keyboard.press('Control+k');
  await expect(page.getByRole('searchbox', { name: 'Tìm học phần', exact: true })).toBeFocused();
  await page.getByRole('searchbox', { name: 'Tìm học phần', exact: true }).fill('PBL1');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/v2\/academic\/courses\?q=PBL1$/);
  await expect(page.getByRole('cell', { name: /PBL1: Dự án/ })).toBeVisible();
});
test('v2 keeps a form draft and selected file when changing tasks and using Back', async ({
  page,
}) => {
  await page.goto('/v2/services/requests');
  await page.getByLabel('Tên đăng nhập', { exact: true }).fill('student01');
  await page.getByLabel('Mật khẩu', { exact: true }).fill('student123');
  await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
  await expect(page.locator('#create-request')).toBeVisible();
  await page.locator('#request-file').setInputFiles({
    name: 'evidence.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.from('sample'),
  });
  const note = page.getByLabel('Ghi chú bổ sung:');
  await note.fill('Bản nháp kiểm tra');
  await page
    .getByRole('navigation', { name: 'Mục dịch vụ' })
    .getByRole('link', { name: 'Theo dõi đơn', exact: true })
    .click();
  await expect(page.locator('#create-request')).toBeHidden();
  await expect(page.locator('#request-history')).toBeVisible();
  await page.goBack();
  await expect(note).toHaveValue('Bản nháp kiểm tra');
  await expect(page.getByRole('button', { name: 'Xem evidence.pdf' })).toBeVisible();
  await expect(page.getByText('1 KB · Chờ nộp')).toBeVisible();
});
