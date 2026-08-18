import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const artifactDir = 'C:/Users/Chetna/.gemini/antigravity-cli/brain/ed036a11-3357-4751-8c47-cf14b8bb57e3';

async function capture() {
  console.log('Connecting to browser...');
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
  } catch (e) {
    console.log('Fallback to chrome channel...');
    browser = await chromium.launch({ headless: true, channel: 'chrome' });
  }
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  try {
    console.log('Navigating to http://localhost:5174...');
    await page.goto('http://localhost:5174', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(2000);

    // 1. Dashboard Main View
    await page.screenshot({ path: path.join(artifactDir, 'main_dashboard.png') });
    console.log('Saved main_dashboard.png');

    // 2. Shuttle Modal
    const shuttleBtn = page.locator('button:has-text("E-Rickshaw Tracker")').first();
    if (await shuttleBtn.count() > 0) {
      await shuttleBtn.click({ force: true });
      await page.waitForTimeout(800);
      await page.screenshot({ path: path.join(artifactDir, 'shuttle_modal.png') });
      console.log('Saved shuttle_modal.png');
      const closeBtn = page.locator('button[title*="Close"]').first();
      if (await closeBtn.count() > 0) await closeBtn.click({ force: true });
      await page.waitForTimeout(400);
    }

    // 3. Campus Life Status Modal
    const lifeBtn = page.locator('button:has-text("Canteen & Library Meter")').first();
    if (await lifeBtn.count() > 0) {
      await lifeBtn.click({ force: true });
      await page.waitForTimeout(800);
      await page.screenshot({ path: path.join(artifactDir, 'campus_life_modal.png') });
      console.log('Saved campus_life_modal.png');
      const closeBtn = page.locator('button[title*="Close"]').first();
      if (await closeBtn.count() > 0) await closeBtn.click({ force: true });
      await page.waitForTimeout(400);
    }

    // 4. Parking Finder Modal
    const parkingBtn = page.locator('button:has-text("Parking Availability")').first();
    if (await parkingBtn.count() > 0) {
      await parkingBtn.click({ force: true });
      await page.waitForTimeout(800);
      await page.screenshot({ path: path.join(artifactDir, 'parking_modal.png') });
      console.log('Saved parking_modal.png');
      const closeBtn = page.locator('button[title*="Close"]').first();
      if (await closeBtn.count() > 0) await closeBtn.click({ force: true });
      await page.waitForTimeout(400);
    }

  } catch (err) {
    console.error('Screenshot capture error:', err);
  } finally {
    await browser.close();
    console.log('Done capturing screenshots!');
  }
}

capture();
