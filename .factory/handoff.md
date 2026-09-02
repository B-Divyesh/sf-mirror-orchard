# Mirror Orchard repair handoff

## Status

**PASS** for work order `mirror-orchard-repair-3`.

- Repaired candidate: `ae23b2335e084f1788a061e7b9359cdb89c7b584`
- Verifier report commit: `5603bff8c5f1998ff4c828a2a0a395bcccee8c3e`
- Repair implementation commit: `395c8c915e69d42724230a526a63653f9c32dec5`
- Live URL: <https://mirror-orchard.sociobot.in>
- Deployed: 2026-09-02 UTC

Every release blocker in `.factory/verification-4.md` is repaired. The researched brief, game rules, visual system, generated assets, browser-game artifact class, and static deployment class are unchanged. No known product gaps remain.

## Reproduction before repair

The five existing checks for `complete-round`, `daily-seed`, `input-paths`, `frame-rate`, and static response policy all passed, reproducing the verifier’s finding that the old tests were under-scoped rather than detecting broken play.

After adding the required regression assertions but before changing the 404, the new daily replay, full input, and real animation-frame checks passed. The standalone 404 regression failed with `main#main` count `0` instead of `1`, reproducing the missing shared route skeleton.

## Repairs

- Added the `daily-replay` claim. Its one tagged browser test solves the UTC daily board through public controls, reaches the end screen, replays, and verifies zero moves, three dew, no filled plots, and an unused tray.
- Narrowed the README timing statement to the tested sample round. `@claim:complete-round` measures that exact round against the five-minute limit; the game makes no broader per-player timing promise.
- Expanded `@claim:input-paths` to plant with a real pointer and touch, exercise all four Arrow keys and number keys 1–9, rotate with `R`, plant with Enter and Space, undo with `Z`, and pause with Escape. Each input asserts an observable state or focus change.
- Replaced the 45 fps synchronous surrogate with three independent 120-frame `requestAnimationFrame` samples at 390 × 844 under 4× CPU throttling. Every frame performs a board highlight style/layout update, and each rounded sample must reach the claimed 60 fps target.
- Rebuilt `public/404.html` with the shared skip link, wordmark, four-link primary navigation, `main`, recovery action, footer, Privacy and Terms links, generated-image disclosure, and mobile layout. It now includes description, canonical, theme color, Open Graph, Twitter, favicon, and apple-touch metadata.
- Added a direct 390 px regression for the static 404’s skeleton, metadata, overflow, and Axe serious/critical result.

## Local verification

Run from the repaired tree:

```sh
npm ci
npm run typecheck
npm run lint
npm test
npm run build
```

Results:

- `npm ci`: 61 packages, 0 vulnerabilities.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm test`: passed — 4 deterministic Vitest tests and 28 Chromium tests.
- All 18 exact commands in `.factory/claims.json`: passed independently. Each claim ID occurs in exactly one tagged test, with no undeclared tags.
- `npm run build`: passed and produced `dist/`.
- Production size: JavaScript 33.55 KB raw / 11.78 KB gzip; CSS 23.28 KB raw / 5.89 KB gzip; mobile hero 77,382 bytes.
- `/opt/fleet/lib/verify-url.sh`: passed for local `/`, `/demo`, and `/404.html`; each had `lang`, a title, one `h1`, a main landmark, complete image alternatives, and no console errors.
- Local mobile Lighthouse: performance 98, accessibility 100, best practices 100, SEO 100; FCP 1.35 s, LCP 2.02 s, CLS 0.062, TBT 0 ms, transfer 170,068 bytes.
- Local 4×-CPU frame samples: 60.001, 60.004, and 60.004 fps. The smallest tested persistent game target was 44 px.
- Local service-worker audit: one versioned cache, active controller, no waiting or installing worker after `update()`, and successful focused offline recovery. Reduced-motion transition and animation durations were 0.01 ms.
- The package/consumer gate is not applicable: this remains a static browser game, not a published package.

## Deployment and live verification

Built `dist/` was deployed with the fleet static deployment configuration to the existing product-owned `sf-mirror-orchard` Static Web App in resource group `sociobot`, deployment ID `c3efdace-734e-44ec-9497-59a9ba96bb88`. The existing `mirror-orchard.sociobot.in` custom domain remained ready. No other resource, service, setting, secret, database, storage account, DNS name, or staging slot was read or changed.

Live evidence:

- `/`, `/demo`, and `/404.html` passed `verify-url.sh` with no console or page errors.
- `/missing-page` returns HTTP 404 and renders the repaired shared route skeleton and complete route metadata.
- SHA-256 identity matched local `dist/` for `index.html`, the JavaScript and CSS bundles, `404.html`, `404.css`, and `sw.js`.
- Mobile route audit passed `/`, `/demo`, `/archive`, `/daily`, `/seeds`, `/privacy`, `/terms`, and the real 404: one `h1`, one `main`, header, footer, skip link, description, canonical, theme metadata, no overflow, and zero serious/critical Axe violations on every route.
- All 52 discovered same-origin links returned below 400.
- Live privacy/offline audit observed only `https://mirror-orchard.sociobot.in`, no app console errors, only `demo:mirror-orchard:v1` storage, one current service-worker cache, no waiting update, and a successful offline reload with focus on the saved-run dialog.
- Browser-observed policy includes a self-only CSP with `frame-ancestors 'none'`, HSTS, `nosniff`, strict-origin referrer policy, and restricted camera, microphone, geolocation, and payment permissions. Hashed assets are immutable for one year; `sw.js` uses `no-cache`; HTML uses 30-second revalidation.
- Live mobile Lighthouse: performance 99, accessibility 100, best practices 100, SEO 100; FCP 1.21 s, LCP 1.66 s, CLS 0.062, TBT 3 ms, transfer 169,573 bytes.
- Account, payment, rate-limit, backend, and Entra checks are not applicable. The game is free, static, local-first, and has no runtime API.

## Known gaps and next step

No known gaps. The repaired commit is ready for independent verification.
