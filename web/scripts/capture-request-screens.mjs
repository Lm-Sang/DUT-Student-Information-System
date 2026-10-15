import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
const browser = await chromium.launch();
const base = process.env.REQUEST_PREVIEW_URL ?? 'http://127.0.0.1:4175';
const output = 'docs/screenshots/requests';
await mkdir(output, { recursive: true });
try {
  for (const edition of ['v1', 'v2']) {
    const prefix = edition === 'v2' ? '/v2' : '';
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1000 },
      reducedMotion: 'reduce',
    });
    for (const [role, account, route] of [
      ['student', 'student01', '/services/requests'],
      ['staff', 'staff01', '/staff/requests'],
      ['admin', 'admin01', '/admin/requests'],
    ]) {
      const page = await context.newPage();
      await page.goto(`${base}${prefix}${route}`);
      await page.getByLabel('Tên đăng nhập', { exact: true }).fill(account);
      await page.getByLabel('Mật khẩu', { exact: true }).fill(`${role}123`);
      await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
      await page.locator('.request-workspace').waitFor();
      await page.evaluate(() => document.fonts.ready);
      if (role === 'student') {
        await page.getByLabel('Tìm thủ tục', { exact: true }).fill('chứng chỉ');
        await page
          .getByRole('button', { name: 'Chọn Công nhận chứng chỉ ngoại ngữ', exact: true })
          .click();
        await page.getByLabel('Loại bài thi').selectOption('IELTS');
        await page.evaluate(() => scrollTo(0, 0));
      } else await page.locator('#work-queue tbody tr').first().waitFor();
      await page.screenshot({ path: `${output}/${edition}-${role}-desktop.png`, fullPage: true });
      if (role === 'admin') {
        await page.locator('#work-queue').scrollIntoViewIfNeeded();
        await page.screenshot({ path: `${output}/${edition}-admin-queue.png`, fullPage: true });
        await page
          .locator('#work-queue')
          .getByRole('button', { name: /^YC-DEMO-006-/ })
          .click();
        await page.getByLabel('Chuyên viên phụ trách').waitFor();
        await page.screenshot({
          path: `${output}/${edition}-admin-assignment.png`,
          fullPage: true,
        });
      }
      if (role === 'staff') {
        await page
          .locator('#work-queue')
          .getByRole('button', { name: /^YC-DEMO-007-/ })
          .click();
        await page.getByLabel('Kết quả xác minh', { exact: true }).waitFor();
        await page.screenshot({ path: `${output}/${edition}-staff-detail.png`, fullPage: true });
        await page.locator('#case-actions').scrollIntoViewIfNeeded();
        await page.screenshot({
          path: `${output}/${edition}-staff-processing.png`,
          fullPage: true,
        });
      }
      await page.setViewportSize({ width: 390, height: 844 });
      await page.screenshot({ path: `${output}/${edition}-${role}-mobile.png`, fullPage: true });
      if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth))
        throw new Error(`Overflow: ${edition}/${role}`);
      await page.close();
    }
    await context.close();
  }
  console.log(`Screenshots saved to ${output}. Isolated browser data only.`);
} finally {
  await browser.close();
}
