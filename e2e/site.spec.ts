import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

const routes = ['/', '/events', '/events/afterlight-v', '/gallery', '/about', '/contact', '/experience'];

/** Collects console errors and uncaught exceptions for the page's lifetime. */
function watchErrors(page: Page) {
  const errors: string[] = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  return errors;
}

test.describe('every route', () => {
  for (const route of routes) {
    test(`${route} loads cleanly with one h1`, async ({ page }) => {
      const errors = watchErrors(page);
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await expect(page.locator('main h1, h1')).toHaveCount(1);
      await page.waitForTimeout(800);
      expect(errors).toEqual([]);
    });
  }

  test('unknown routes return 404', async ({ page }) => {
    const response = await page.goto('/no-such-page');
    expect(response?.status()).toBe(404);
  });
});

test.describe('layout', () => {
  for (const width of [320, 390, 768, 1440]) {
    test(`no horizontal overflow at ${width}px`, async ({ browser }) => {
      const context = await browser.newContext({ viewport: { width, height: 800 } });
      const page = await context.newPage();
      for (const route of routes) {
        await page.goto(route);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        expect(overflow, `${route} at ${width}px`).toBeLessThanOrEqual(1);
      }
      await context.close();
    });
  }

  test('page headings sit at the same height on every inner page', async ({ page }) => {
    const tops: Record<string, number> = {};
    for (const route of ['/events', '/gallery', '/about', '/contact']) {
      await page.goto(route);
      tops[route] = await page.locator('main h1').evaluate((h) => Math.round(h.getBoundingClientRect().top + scrollY));
    }
    expect(new Set(Object.values(tops)).size, JSON.stringify(tops)).toBe(1);
  });
});

test('internal links all resolve', async ({ page, request }) => {
  const hrefs = new Set<string>();
  for (const route of routes) {
    await page.goto(route);
    for (const href of await page.locator('a[href^="/"]').evaluateAll((as) => as.map((a) => a.getAttribute('href')!))) {
      hrefs.add(href.split('#')[0]);
    }
  }
  for (const href of hrefs) {
    const response = await request.get(href);
    expect(response.status(), href).toBeLessThan(400);
  }
});

test('menu opens, navigates and closes', async ({ page }) => {
  await page.goto('/');
  const burger = page.getByRole('button', { name: 'Open menu' });
  await burger.click();
  await expect(page.getByRole('button', { name: 'Close menu' })).toHaveAttribute('aria-expanded', 'true');
  await page.locator('#pc-nav-menu').getByRole('link', { name: 'Gallery' }).click();
  await expect(page).toHaveURL(/\/gallery$/);
  await expect(page.getByRole('button', { name: 'Open menu' })).toHaveAttribute('aria-expanded', 'false');
});

test.describe('gallery', () => {
  test('tiles carry media and clips have posters', async ({ page }) => {
    await page.goto('/gallery');
    const clips = page.locator('.rd-gallery-grid video');
    expect(await clips.count()).toBeGreaterThan(0);
    for (const poster of await clips.evaluateAll((vs) => vs.map((v) => v.getAttribute('poster')))) {
      expect(poster).toBeTruthy();
    }
    // The first tiles load their loop once on screen.
    await expect.poll(() => clips.first().getAttribute('src')).toBeTruthy();
    await expect(page.locator('.rd-gallery-grid img').first()).toHaveJSProperty('complete', true);
  });

  test('a photo opens, closes on Escape and returns focus to its tile', async ({ page }, info) => {
    await page.goto('/gallery');
    const tile = page.getByRole('button', { name: /^View / }).first();
    await tile.click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    // The phone feed and the desktop lightbox both move focus to Close.
    await expect(dialog.getByRole('button', { name: 'Close' })).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
    if (info.project.name === 'desktop') await expect(tile).toBeFocused();
  });

  test('a clip opens a player and releases it on close', async ({ page }) => {
    await page.goto('/gallery');
    await page.getByRole('button', { name: /^Play / }).first().click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.locator('video')).toHaveCount(1);
    await dialog.getByRole('button', { name: 'Close' }).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
  });

  test('reduced motion shows posters and never fetches the loops', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    const loops: string[] = [];
    page.on('request', (r) => { if (r.url().endsWith('.mp4')) loops.push(r.url()); });
    await page.goto('/gallery');
    await page.mouse.wheel(0, 3000);
    await page.waitForTimeout(1500);
    expect(loops).toEqual([]);
    await context.close();
  });
});

test.describe('home showreel', () => {
  test('hero shows its poster behind the footage and the lockup as the heading', async ({ page }) => {
    await page.goto('/');
    const media = page.locator('.rd-hero-media');
    await expect(media).toHaveCSS('background-image', /cloudflarestream\.com/);
    await expect(media.locator('video')).toHaveCount(2);
    await expect(page.getByRole('heading', { level: 1, name: 'Paracausal' })).toBeVisible();
  });
});

test.describe('events signup', () => {
  test('shows the success message (API mocked, nothing is subscribed)', async ({ page }) => {
    await page.route('**/api/subscribe', (route) => route.fulfill({ status: 200, json: { ok: true } }));
    await page.goto('/events');
    await page.getByLabel('Email address').fill('test@example.com');
    await page.getByRole('button', { name: 'Join the list' }).click();
    await expect(page.getByRole('status')).toHaveText(/on the list/i);
  });

  test('shows the server error message (API mocked)', async ({ page }) => {
    await page.route('**/api/subscribe', (route) => route.fulfill({ status: 502, json: { error: 'Could not add you to the list. Try again.' } }));
    await page.goto('/events');
    await page.getByLabel('Email address').fill('test@example.com');
    await page.getByRole('button', { name: 'Join the list' }).click();
    await expect(page.getByRole('status')).toHaveText(/could not add you/i);
  });
});

test.describe('API validation', () => {
  for (const endpoint of ['/api/subscribe', '/api/contact', '/api/enquiry']) {
    test(`${endpoint} rejects bad input with 4xx, never 5xx`, async ({ request }) => {
      for (const data of ['{bad', 'null', '[]', '{}', '{"email":123}', '{"email":"nope","name":"a","message":"b"}']) {
        const response = await request.post(endpoint, { data, headers: { 'Content-Type': 'application/json' } });
        expect(response.status(), `${endpoint} ${data}`).toBeGreaterThanOrEqual(400);
        expect(response.status(), `${endpoint} ${data}`).toBeLessThan(500);
      }
    });
  }
});

test('security headers are set', async ({ request }) => {
  const response = await request.get('/');
  const headers = response.headers();
  expect(headers['x-content-type-options']).toBe('nosniff');
  expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
  expect(headers['content-security-policy']).toContain("frame-ancestors 'self'");
});
