import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { archiveBoard } from '../../src/game/core';

async function enterDemo(page: Page): Promise<void> {
  await page.goto('/demo');
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Try teaching board 3');
}

async function solveDemoBoard(page: Page): Promise<void> {
  const board = archiveBoard(3);
  for (const placement of board.solution.slice(1)) {
    await page.locator(`button[data-piece-kind="${placement.kind}"]:not(:disabled)`).first().click();
    for (let turn = 0; turn < placement.rotation; turn += 1) {
      await page.getByRole('button', { name: /Rotate/ }).click();
    }
    await page.locator(`[data-cell="${placement.anchor.col},${placement.anchor.row}"]`).click();
  }
}

async function expectDialogFocusTrap(page: Page, firstControl: string, lastControl: string): Promise<void> {
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('heading', { level: 2 })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(dialog.getByRole('button', { name: firstControl }).or(dialog.getByRole('link', { name: firstControl }))).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(dialog.getByRole('button', { name: lastControl }).or(dialog.getByRole('link', { name: lastControl }))).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(dialog.getByRole('button', { name: firstControl }).or(dialog.getByRole('link', { name: firstControl }))).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(dialog.getByRole('button', { name: lastControl }).or(dialog.getByRole('link', { name: lastControl }))).toBeFocused();
}

test('@claim:archive-open all 40 teaching boards stay open', async ({ page }) => {
  await enterDemo(page);
  await page.getByRole('link', { name: 'Archive', exact: true }).click();
  await expect(page).toHaveURL(/\/archive\?demo=1$/);
  await expect(page.locator('.archive-list > li')).toHaveCount(40);
  await page.getByRole('link', { name: /40 Finish the teaching orchard/ }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Try teaching board 40');
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
});

test('@claim:complete-round a demo puzzle reaches its end screen', async ({ page }) => {
  const started = Date.now();
  await enterDemo(page);
  await expect(page.getByText('1', { exact: true }).first()).toBeVisible();
  await solveDemoBoard(page);
  await expect(page.getByRole('heading', { name: 'The orchard is mirrored' })).toBeVisible();
  await expect(page.getByText('3 of 3')).toBeVisible();
  expect(Date.now() - started).toBeLessThan(300_000);
});

test('@claim:completion-persist completing a teaching board stays recorded in the archive', async ({ page }) => {
  await enterDemo(page);
  await solveDemoBoard(page);
  const nextBoard = page.getByRole('link', { name: 'Plant board 4' });
  await expect(nextBoard).toBeVisible();
  const centerLinePointerEvents = await page.locator('.win-overlay').evaluate((overlay) => getComputedStyle(overlay, '::before').pointerEvents);
  expect(centerLinePointerEvents).toBe('none');
  const box = await nextBoard.boundingBox();
  if (!box) throw new Error('The next-board action has no pointer target.');
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await expect(page).toHaveURL(/\/demo\?board=4$/);
  await page.getByRole('link', { name: 'Archive' }).click();
  await expect(page.getByRole('link', { name: /03 Build both halves Complete/ })).toBeVisible();
});

test('@claim:restart-reset restarting clears the current run', async ({ page }) => {
  await enterDemo(page);
  const placement = archiveBoard(3).solution[1];
  await page.locator(`button[data-piece-kind="${placement.kind}"]:not(:disabled)`).first().click();
  await page.locator(`[data-cell="${placement.anchor.col},${placement.anchor.row}"]`).click();
  await expect(page.locator('.game-readout span').nth(1).locator('b')).toHaveText('2');
  await page.getByRole('button', { name: /Pause/ }).click();
  await page.getByRole('button', { name: 'Restart board' }).click();
  await expect(page.locator('.game-readout span').nth(1).locator('b')).toHaveText('0');
  await expect(page.locator('.filled-plot')).toHaveCount(0);
});

test('@claim:settings-persist sound and calm-motion settings survive reload', async ({ page }) => {
  await enterDemo(page);
  await page.getByRole('button', { name: 'Sound off' }).click();
  await page.getByRole('button', { name: 'Calm motion off' }).click();
  await page.reload();
  await page.getByRole('button', { name: 'Resume board' }).click();
  await expect(page.getByRole('button', { name: 'Sound on' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('button', { name: 'Calm motion on' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('html')).toHaveClass(/calm-motion/);
});

test('@claim:seed-reproducible the same personal seed makes the same board', async ({ page }) => {
  await enterDemo(page);
  await page.getByRole('link', { name: 'Seeds' }).click();
  await page.getByLabel('Seed word or phrase').fill('mist-fern');
  await page.getByRole('button', { name: 'Plant this seed' }).click();
  const first = await page.locator('.game-board').getAttribute('data-fingerprint');
  await page.reload();
  await expect(page.locator('.game-board')).toHaveAttribute('data-fingerprint', first ?? '');
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
});

test('@claim:daily-seed today\'s board remains stable on reload', async ({ page }) => {
  await enterDemo(page);
  await page.getByRole('link', { name: 'Daily' }).click();
  const first = await page.locator('.game-board').getAttribute('data-fingerprint');
  const activeSeed = await page.evaluate(() => window.__mirrorOrchard?.getActiveGame()?.board.seed);
  expect(activeSeed).toBe(`daily:${new Date().toISOString().slice(0, 10)}:v1`);
  await page.reload();
  await expect(page.locator('.game-board')).toHaveAttribute('data-fingerprint', first ?? '');
});

test('@claim:local-only demo play sends only same-origin requests', async ({ page }) => {
  const origins = new Set<string>();
  page.on('request', (request) => origins.add(new URL(request.url()).origin));
  await enterDemo(page);
  await page.getByRole('button', { name: /Rotate/ }).click();
  await page.getByRole('link', { name: 'Archive' }).click();
  expect([...origins]).toEqual(['http://127.0.0.1:4173']);
});

test('@claim:privacy-no-tracking play has no ads, analytics, or leaderboard requests', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await enterDemo(page);
  await page.getByRole('link', { name: 'Archive' }).click();
  await page.getByRole('link', { name: 'Privacy' }).click();
  await expect(page.getByText('It uses no accounts, advertising, analytics, or third-party scripts.')).toBeVisible();
  expect(requests.every((url) => new URL(url).origin === 'http://127.0.0.1:4173')).toBe(true);
  expect(requests.join(' ')).not.toMatch(/ads?|analytics|leaderboard/i);
});

test('@claim:demo-isolated demo data uses its own disposable storage', async ({ page }) => {
  await enterDemo(page);
  const keys = await page.evaluate(() => Object.keys(localStorage));
  expect(keys).toContain('demo:mirror-orchard:v1');
  expect(keys).not.toContain('mirror-orchard:v1');
  await page.getByRole('link', { name: 'Archive' }).click();
  await page.getByRole('link', { name: 'Start for real' }).click();
  await expect(page).toHaveURL(/\/play\/archive\/1$/);
  expect(await page.evaluate(() => localStorage.getItem('demo:mirror-orchard:v1'))).toBeNull();
});

test('@claim:demo-sample-state the direct demo opens board 3 with two boards complete and resets', async ({ page }) => {
  await page.goto('/?demo=1');
  await expect(page).toHaveURL(/\/demo$/);
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Try teaching board 3');
  await page.getByRole('link', { name: 'Archive' }).click();
  await expect(page.getByRole('link', { name: /01 Single reflections Complete/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /02 Plant the center Complete/ })).toBeVisible();
  await page.getByRole('link', { name: /03 Build both halves/ }).click();
  await expect(page.locator('.game-readout span').nth(1).locator('b')).toHaveText('1');
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Try teaching board 3');
  await expect(page.locator('.game-readout span').nth(1).locator('b')).toHaveText('1');
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
});

test('@claim:free-no-account game offers play without login or payment', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Free. No account.')).toBeVisible();
  await expect(page.locator('input[type="password"], [href*="checkout"], [href*="login"]')).toHaveCount(0);
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page.locator('.game-board')).toBeVisible();
});

test('@claim:offline-reload demo reloads offline after the first visit', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('/demo');
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await page.reload({ waitUntil: 'networkidle' });
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
  await expect(page.getByRole('heading', { name: 'Your planting is saved' })).toBeFocused();
  await page.getByRole('button', { name: 'Resume board' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Try teaching board 3');
  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { name: 'Your planting is saved' })).toBeFocused();
  await page.getByRole('button', { name: 'Resume board' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Try teaching board 3');
  await expect(page.getByText('You are offline. Saved boards remain playable.')).toBeVisible();
  await context.close();
});

test('service worker precache omits deployment-only configuration', async ({ page }) => {
  const source = await page.request.get('/sw.js').then((response) => response.text());
  expect(source).not.toContain('/staticwebapp.config.json');
  expect(source).toContain('cache.addAll(PRECACHE');
});

test('@claim:run-recovery an unfinished run returns safely paused after reload', async ({ page }) => {
  await enterDemo(page);
  const placement = archiveBoard(3).solution[1];
  await page.locator(`button[data-piece-kind="${placement.kind}"]:not(:disabled)`).first().click();
  await page.locator(`[data-cell="${placement.anchor.col},${placement.anchor.row}"]`).click();
  await expect(page.locator('.game-readout span').nth(1).locator('b')).toHaveText('2');
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Your planting is saved' })).toBeFocused();
  await expect(page.locator('.game-readout span').nth(1).locator('b')).toHaveText('2');
  await expect(page.locator('.filled-plot')).toHaveCount(4);
});

test('@claim:three-error-loss three invalid placements end the run', async ({ page }) => {
  await enterDemo(page);
  for (let attempt = 0; attempt < 3; attempt += 1) await page.locator('[data-cell="0,0"]').click();
  await expect(page.getByRole('heading', { name: 'This orchard withered' })).toBeVisible();
  await expect(page.getByText('Restart with a full tray and three dew drops.')).toBeVisible();
  await expect(page.locator('.game-readout span').first().locator('b')).toHaveText('0');
});

test('@claim:frame-rate board updates fit a 45fps frame budget at 390px under 4x CPU throttle', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await enterDemo(page);
  const slowestFrameMs = await page.evaluate(() => {
    const board = document.querySelector<HTMLElement>('.game-board');
    const plot = document.querySelector<HTMLElement>('[data-cell="0,0"]');
    if (!board || !plot) throw new Error('The demo board is not available for measurement.');
    const samples: number[] = [];
    for (let frame = 0; frame < 120; frame += 1) {
      const start = performance.now();
      plot.classList.toggle('preview');
      // Force the same style and layout work a board highlight performs.
      void board.getBoundingClientRect();
      samples.push(performance.now() - start);
    }
    return Math.max(...samples.slice(5));
  });
  expect(slowestFrameMs).toBeLessThanOrEqual(1_000 / 45);
  await context.close();
});

test('routes have one h1, no serious axe issues, and fit 390px', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  for (const path of ['/', '/demo', '/archive', '/daily', '/seeds', '/privacy', '/terms', '/missing-page']) {
    await page.goto(path);
    await expect(page.locator('h1')).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
    const results = await new AxeBuilder({ page: page as never }).analyze();
    expect(results.violations.filter((violation) => ['critical', 'serious'].includes(violation.impact ?? ''))).toEqual([]);
  }
  await context.close();
});

test('the landing board preview is visible in the 390 by 844 first viewport', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('/');
  const board = await page.locator('.hero-board').boundingBox();
  expect(board).not.toBeNull();
  expect(board!.y).toBeLessThan(844);
  expect(board!.y + Math.min(board!.height, 44)).toBeGreaterThan(0);
  await context.close();
});

test('browser Back focuses and announces the landing route', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Archive', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await expect(page.locator('[aria-live="polite"]')).toHaveText('Learn with 40 teaching boards page');
  await page.goBack();
  await expect(page).toHaveURL('/');
  await expect(page.getByRole('heading', { level: 1, name: 'Learn a symmetry puzzle at your pace' })).toBeFocused();
  await expect(page.locator('[aria-live="polite"]')).toHaveText('Learn a symmetry puzzle at your pace page');
});

test('@claim:input-paths pointer, touch, and keyboard controls work', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
  const page = await context.newPage();
  await enterDemo(page);
  const placement = archiveBoard(3).solution[1];
  await page.locator(`button[data-piece-kind="${placement.kind}"]:not(:disabled)`).first().tap();
  await page.locator(`[data-cell="${placement.anchor.col},${placement.anchor.row}"]`).tap();
  await expect(page.locator('.game-readout span').nth(1).locator('b')).toHaveText('2');
  await page.locator('[data-cell="0,0"]').focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('[data-cell="1,0"]')).toBeFocused();
  await page.keyboard.press('3');
  await expect(page.locator('[data-piece-id="piece-2"]')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('heading', { name: 'Your planting is saved' })).toBeFocused();
  await context.close();
});

test('pause and end dialogs contain focus and inert the covered game', async ({ page }) => {
  await enterDemo(page);
  await page.getByRole('button', { name: /Pause/ }).click();
  await expect(page.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  await expect(page.locator('.game-stage')).toHaveAttribute('aria-hidden', 'true');
  await expectDialogFocusTrap(page, 'Resume board', 'Restart board');
  await page.getByRole('button', { name: 'Resume board' }).click();
  await solveDemoBoard(page);
  await expectDialogFocusTrap(page, 'Plant board 4', 'Replay this board');
});

test('loss dialog contains focus', async ({ page }) => {
  await enterDemo(page);
  for (let attempt = 0; attempt < 3; attempt += 1) await page.locator('[data-cell="0,0"]').click();
  await expectDialogFocusTrap(page, 'Restart board', 'Restart board');
});

test('persistent mobile controls meet the 44px touch-target baseline', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
  const page = await context.newPage();
  await enterDemo(page);
  const dimensions = await page.locator('.wordmark, .site-header nav a, .demo-banner button, .demo-banner a, .tool-actions button, .setting-row button').evaluateAll((elements) => elements.map((element) => {
    const rect = element.getBoundingClientRect();
    return { width: rect.width, height: rect.height, label: element.textContent?.trim() };
  }));
  expect(dimensions).not.toEqual([]);
  for (const target of dimensions) {
    expect(target.width, `${target.label} width`).toBeGreaterThanOrEqual(44);
    expect(target.height, `${target.label} height`).toBeGreaterThanOrEqual(44);
  }
  await context.close();
});

test('seed input rejects punctuation and valid seed URLs stay reproducible', async ({ page }) => {
  await page.goto('/seeds');
  await page.getByLabel('Seed word or phrase').fill('🚫/bad_seed!');
  await page.getByRole('button', { name: 'Plant this seed' }).click();
  await expect(page.locator('#seed-error')).toHaveText('Use 1–48 letters, numbers, spaces, or dashes.');
  await expect(page.getByLabel('Seed word or phrase')).toHaveAttribute('aria-invalid', 'true');
  await page.getByLabel('Seed word or phrase').fill('mist-fern');
  await page.getByRole('button', { name: 'Plant this seed' }).click();
  await expect(page).toHaveURL(/\/seeds\?seed=mist-fern$/);
  await expect(page.locator('.game-board')).toBeVisible();
  await page.goto(`/play/seed/${encodeURIComponent('🚫/bad_seed!')}`);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found');
});

test('static response policy reserves real 404s for unknown application paths', async ({ request }) => {
  const response = await request.get('/staticwebapp.config.json');
  expect(response.ok()).toBe(true);
  const config = await response.json() as {
    navigationFallback: { exclude: string[] };
    responseOverrides: Record<string, { rewrite: string }>;
    routes: Array<{ route: string; rewrite?: string; statusCode?: number }>;
  };
  expect(config.navigationFallback.exclude).toContain('/*');
  expect(config.responseOverrides['404']).toEqual({ rewrite: '/404.html' });
  const appRoutes = config.routes.filter((route) => route.rewrite === '/index.html').map((route) => route.route);
  expect(appRoutes).toEqual(expect.arrayContaining(['/demo', '/archive', '/play/archive/*']));
  expect(appRoutes).not.toContain('/play/seed/*');
  expect(config.routes.some((route) => route.rewrite && route.statusCode)).toBe(false);
});
