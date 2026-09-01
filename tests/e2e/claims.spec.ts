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

test('@claim:archive-open all 40 teaching boards stay open', async ({ page }) => {
  await enterDemo(page);
  await page.getByRole('link', { name: 'Archive' }).click();
  await expect(page).toHaveURL(/\/archive\?demo=1$/);
  await expect(page.locator('.archive-list > li')).toHaveCount(40);
  await page.getByRole('link', { name: /40 Finish the teaching orchard/ }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Try teaching board 40');
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
});

test('@claim:complete-round a demo puzzle reaches its end screen', async ({ page }) => {
  await enterDemo(page);
  await expect(page.getByText('1', { exact: true }).first()).toBeVisible();
  await solveDemoBoard(page);
  await expect(page.getByRole('heading', { name: 'The orchard is mirrored' })).toBeVisible();
  await expect(page.getByText('3 of 3')).toBeVisible();
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

test('@claim:settings-persist calm motion setting survives reload', async ({ page }) => {
  await enterDemo(page);
  await page.getByRole('button', { name: 'Calm motion off' }).click();
  await page.reload();
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
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Try teaching board 3');
  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Try teaching board 3');
  await expect(page.getByText('You are offline. Saved boards remain playable.')).toBeVisible();
  await context.close();
});

test('@claim:frame-rate board rendering stays near 60 fps', async ({ page }) => {
  await enterDemo(page);
  const fps = await page.evaluate(() => new Promise<number>((resolve) => {
    const samples: number[] = [];
    const sample = (time: number) => {
      samples.push(time);
      if (samples.length < 61) requestAnimationFrame(sample);
      else resolve(60_000 / (samples.at(-1)! - samples[0]));
    };
    requestAnimationFrame(sample);
  }));
  expect(fps).toBeGreaterThanOrEqual(45);
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

test('keyboard controls select, rotate, move, and pause', async ({ page }) => {
  await enterDemo(page);
  await page.locator('[data-cell="0,0"]').focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('[data-cell="1,0"]')).toBeFocused();
  await page.keyboard.press('2');
  await expect(page.locator('[data-piece-id="piece-1"]')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('heading', { name: 'Your planting is saved' })).toBeFocused();
});
