# Mirror Orchard handoff

## Status

Perfection-loop round 1 is complete. All five findings in `.factory/review-1.md` and every earlier finding carried into that review are fixed and verified. The implementation commit `b77730df128cbb90a687e0fff952239d6f4d26a0` is pushed to `main` and deployed at <https://mirror-orchard.sociobot.in>.

No known gaps remain.

## What changed

- Browser Back and every in-app route change now focus the current page heading and announce the route in a polite live region, including the landing page.
- Landing copy now limits the always-open promise to teaching boards, describes accepted seed characters accurately, and uses descriptive section labels.
- `.factory/claims.json` now includes the promised demo sample state. The matching test enters through `/?demo=1`, verifies board 3 plus completed boards 1 and 2, and exercises Reset demo.
- The branch tray no longer creates an invalid nested complementary landmark.
- `.factory/copy-audit.md` and the new verb-first `.factory/catalog-description.txt` reflect the released wording.
- `.factory/polish-1.md` maps each finding to its code change and local/live evidence.

## Verification

From a fresh clone of `b77730d`:

- `npm ci`: passed; 61 packages, 0 vulnerabilities.
- Every one of the 17 commands in `.factory/claims.json`: passed independently.
- `npm test`: passed; 4 deterministic unit tests and 26 Chromium browser tests.
- `npm run build`: passed and produced `dist/`.
- Build size: JS 33.55 KB raw / 11.78 KB gzip; CSS 23.28 KB raw / 5.89 KB gzip; mobile hero 77.38 KB.

Additional checks:

- `npm run typecheck` and `npm run lint`: passed.
- Standalone Axe 4.10.3: zero violations on all seven public app routes, locally and live.
- `verify-url.sh`: `/`, `/demo`, live `/`, and live `/?demo=1` passed with zero console errors.
- Live Lighthouse mobile: performance 99, accessibility 100, best practices 100, SEO 100.
- Live 390 × 844 cold check: no horizontal overflow and the game board begins at y=722.625 within the first viewport.
- Live route/metadata crawl: eight routes and 52 internal links passed, including unique titles, canonical URLs, legal links, and a real HTTP 404.
- Live privacy/offline check: only the product origin was requested; the hosted service worker reloaded the isolated demo offline.
- Live review replay: all five review findings passed in a fresh browser context.

Detailed evidence and screenshots are in [.factory/polish-1.md](polish-1.md).

## Run and verify

```sh
npm ci
npm run typecheck
npm run lint
npm test
npm run build
npm run preview
```

The static artifact is `dist/`. The one-click isolated sample is available locally at <http://localhost:4173/?demo=1> and live at <https://mirror-orchard.sociobot.in/?demo=1>.

## Deployment

The production `dist/` was deployed on 2026-09-02 to the product-owned `sf-mirror-orchard` Static Web App in resource group `sociobot`. The custom domain served the new `index-Bwed6F4F.js` bundle immediately after deployment. No other service, application setting, database, storage account, DNS record, or resource was read or changed.
