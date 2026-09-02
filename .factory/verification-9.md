# Mirror Orchard independent verification 9

## Result: PASS — candidate is releasable

- **Tested candidate:** `02b2b5b302c40f8b63a0412296c82798ae23f55d`
- **Live URL:** <https://mirror-orchard.sociobot.in>
- **Verified:** 2026-09-02 UTC
- **Scope:** independent QA only. No product code was changed.

## Claims gate

`.factory/claims.json` is present with 19 declarations. After a clean `npm ci`,
I ran every declared command individually against the production demo entry
point. Every one passed:

`archive-open`, `complete-round`, `no-timer`, `completion-persist`,
`restart-reset`, `settings-persist`, `seed-reproducible`, `daily-seed`,
`daily-replay`, `local-only`, `privacy-no-tracking`, `demo-isolated`,
`demo-sample-state`, `free-no-account`, `offline-reload`, `run-recovery`,
`three-error-loss`, `input-paths`, and `frame-rate`.

The subsequent complete suite passed: 4/4 Vitest tests and 30/30 Chromium
tests. `test-results/.last-run.json` records `status: passed` and no failed
tests.

## Cold first read and game run

The cold production page answers the required questions in its first viewport:

- **What it does:** “Learn a symmetry puzzle at your pace.”
- **For whom:** visual puzzle players who want practice before the daily
  challenge.
- **First action:** **Try it with sample data**; its adjacent text says it
  opens teaching board 3 with two boards complete.

The captured first viewport includes a playable board preview, rather than a
menu wall. Clicking the action opened `/demo` and the persistent “Demo —
sample data, nothing is saved” sandbox banner.

I scripted the live demo through the public UI from active teaching board 3 to
the real win screen, **The orchard is mirrored**. Replay restored zero moves,
three dew, no filled plots, and a fully unused tray. Three invalid placements
reached the real loss screen, **This orchard withered**; Restart restored zero
moves, three dew, and no filled plots. Sound and calm-motion settings persisted
through reload. The full deterministic suite additionally covered all 40
archive boards, daily replay, seed reproducibility, completion/run recovery,
pointer/touch, arrows, keys 1–9, R, Enter, Space, Z, Escape, dialog focus, and
invalid-seed recovery.

At 390 × 844 there was no horizontal overflow and no interactive target below
44 px. Keyboard Tab exposed “Skip to main content” and activation moved focus
to `main`. Reduced-motion emulation changed scrolling to `auto` and game-board
transitions to `0.01ms`.

## Local quality and production identity

```text
npm ci             PASS — 61 packages, 0 vulnerabilities
npm run test:unit  PASS — 4/4
npm run typecheck  PASS
npm run lint       PASS
npm test           PASS — 4 unit + 30 Chromium tests
npm run build      PASS — dist/ produced
```

Fresh-build sizes: JavaScript 33,843 bytes raw / 11.84 kB gzip; CSS 23,295
bytes raw / 5.90 kB gzip; mobile hero 77,382 bytes. These are inside the
applicable budgets.

The freshly built candidate and live deployment had identical SHA-256 values
for `index.html`, hashed JS, hashed CSS, `sw.js`, and the hero image. In
particular, live JS is `a53aced58a6702ecd4e3c5496b814291a0f12b25dadf479b7a12f93fa445c4d8`
and live service worker is
`62195a46e150c78bc3257650b3f395c3c19e267b5a1faab6dfee6e8377d33894`.

## Live deployment, privacy, accessibility, PWA, and performance

- Cold load and demo-flow request logs contained only
  `https://mirror-orchard.sociobot.in`: document, first-party JS/CSS, image,
  and self-hosted fonts. No analytics, ads, account, payment, API, WebSocket,
  or third-party requests appeared. This confirms the local-only/no-tracking
  claims.
- Responses supply self-only CSP including header-delivered
  `frame-ancestors 'none'`, HSTS, `X-Content-Type-Options: nosniff`, strict
  referrer policy, and a restrictive permissions policy. Hashed JS/CSS are
  one-year immutable, HTML is a 30-second revalidation response, and `sw.js`
  is `no-cache`.
- The live service worker controlled `/demo`; `registration.update()` ran with
  `updateViaCache: none`. After first visit, an offline reload opened the saved
  demo and displayed “You are offline. Saved boards remain playable.”
- Axe on `/`, `/demo`, `/archive`, `/daily`, `/seeds`, `/privacy`, `/terms`,
  and `/missing-page` found zero serious or critical issues. Each route had one
  h1 and one main landmark. The deliberately missing route correctly returned
  HTTP 404; its expected browser network log was the only console message on
  that route. All normal routes had no page or console errors.
- All 47 sitemap URLs returned HTTP 200.
- Direct live 390 × 844 / 4× CPU-throttled measurements had five 120-frame
  samples at 59.88 FPS median cadence, exceeding the claimed 50 FPS minimum.
- Lighthouse mobile: Performance 99, Accessibility 100, Best Practices 100,
  SEO 100; LCP 1.6 s, CLS 0.059, TBT 0 ms.
- This is a static game with no server-side product/unlock endpoints,
  authentication, or payment. Rate-limit/429, concurrency, persistence-server,
  and Entra checks therefore do not apply.

## Defects by severity

None found.

## Evidence retained outside the repository

`/work/evidence/mirror-orchard-verify-9/` contains cold desktop and mobile
screenshots, `live-qa.json`, headers, and the completed Lighthouse report.
