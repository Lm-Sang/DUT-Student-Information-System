import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  const assets = await page.evaluate(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 360;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(0, 0, 640, 360);
    ctx.fillStyle = '#174478';
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText('DUT - DEMO EVIDENCE', 40, 80);
    ctx.font = '20px sans-serif';
    ctx.fillStyle = '#334155';
    ctx.fillText('Synthetic fixture for preview and download.', 40, 150);
    ctx.fillText('Not an official certificate or personal record.', 40, 190);
    return {
      png: canvas.toDataURL('image/png').split(',')[1],
      jpg: canvas.toDataURL('image/jpeg', 0.8).split(',')[1],
    };
  });
  await writeFile(
    'src/features/services/mocks/imageEvidence.mock.ts',
    `// Synthetic test evidence. Regenerate with node scripts/create-evidence-fixtures.mjs\nexport const evidenceImages = ${JSON.stringify(assets)};\n`,
  );
} finally {
  await browser.close();
}
