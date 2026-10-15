import { chromium, webkit } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
const baseURL = process.env.PORTAL_URL ?? 'http://127.0.0.1:4173';
const out = path.resolve('test-results/ui-audit-' + (process.argv[2] ?? 'current'));
await fs.mkdir(out, { recursive: true });
const engine = process.argv.includes('--webkit') ? webkit : chromium;
const browser = await engine.launch();
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  ...(process.argv.includes('--touch') ? { isMobile: true, hasTouch: true } : {}),
});
const systemDark = process.argv.includes('--system-dark');
const largeText = process.argv.includes('--large-text');
await page.emulateMedia({ colorScheme: systemDark ? 'dark' : 'light', reducedMotion: 'reduce' });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
const routes = [
  '/',
  '/login',
  '/dashboard',
  '/profile',
  '/academic/courses',
  '/academic/courses/c2',
  '/academic/grades',
  '/academic/grades/current',
  '/academic/grades/standing',
  '/academic/grades/plo',
  '/academic/schedule',
  '/academic/thesis',
  '/academic/thesis/details',
  '/registration',
  '/tuition',
  '/conduct/self-assessment',
  '/conduct/class-assessment',
  '/community/activities',
  '/community/activities/chao-don-tsv-k26',
  '/community/results',
  '/services/requests',
  '/notifications',
  '/admin',
  '/not-a-real-route',
  '/tuition?view=courses',
  '/tuition?view=history',
  '/services/requests?view=history',
  '/services/requests?view=equipment',
];
const report = [];
for (const [index, route] of routes.entries()) {
  await page.goto(baseURL + route, { waitUntil: 'domcontentloaded' });
  await page.getByRole('heading').first().waitFor();
  if (route !== '/login' && page.url().includes('/login')) {
    const role = route === '/admin' ? 'admin' : 'student';
    await page.getByLabel('Tên đăng nhập', { exact: true }).fill(role + '01');
    await page.getByLabel('Mật khẩu', { exact: true }).fill(role + '123');
    await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
    await page.waitForURL(baseURL + route);
  }
  await page.getByRole('heading').first().waitFor();
  await page.evaluate(() => document.fonts.ready);
  if (largeText)
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '32px';
    });
  for (const width of largeText
    ? [1440, 390]
    : process.argv.includes('--touch')
      ? [390]
      : [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.mouse.move(0, 0);
    const metrics = await page.evaluate(() => ({
      headings: [...document.querySelectorAll('h1,h2')].map((e) => e.textContent),
      visibleTextLength: document.querySelector('main')?.innerText.length ?? 0,
      pageHeight: document.documentElement.scrollHeight,
      overflow: document.documentElement.scrollWidth > innerWidth,
      scrollRegions: [...document.querySelectorAll('[role=region]')].map((e) => ({
        label: e.getAttribute('aria-label'),
        width: e.clientWidth,
        content: e.scrollWidth,
      })),
      smallTextCount: [
        ...document.querySelectorAll('main p, main td, main label, main button'),
      ].filter((e) => parseFloat(getComputedStyle(e).fontSize) < 12).length,
      tables: document.querySelectorAll('table').length,
      inputs: document.querySelectorAll('input,select,textarea').length,
    }));
    const file = `${String(index).padStart(2, '0')}-${width}.png`;
    await page.screenshot({ path: path.join(out, file), animations: 'disabled', fullPage: true });
    report.push({ route, actualUrl: page.url(), width, systemDark, largeText, file, ...metrics });
  }
  console.log(`${index + 1}/${routes.length} ${route}`);
}
await fs.writeFile(path.join(out, 'report.json'), JSON.stringify({ report, errors }, null, 2));
await browser.close();
