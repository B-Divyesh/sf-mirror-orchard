# Mirror Orchard independent verification 8

## Result: PASS — candidate is releasable

- **Tested candidate:** `94d151700dd9366c467159991b962a78850a71ca`
- **Live URL:** <https://mirror-orchard.sociobot.in>
- **Verified:** 2026-09-02 UTC
- **Scope:** independent QA only; no product code was changed.

This supersedes the frame-rate failure in verification 7. The repair is present
in this candidate and its published assets are identical to the fresh
production build.

## Claims gate

`.factory/claims.json` exists and declares 19 claims. From a clean `npm ci`
checkout, I invoked every listed `npm run test:e2e -- --grep @claim:<id>`
command through the production `/demo` entry point. All passed:

`archive-open`, `complete-round`, `no-timer`, `completion-persist`,
`restart-reset`, `settings-persist`, `seed-reproducible`, `daily-seed`,
`daily-replay`, `local-only`, `privacy-no-tracking`, `demo-isolated`,
`demo-sample-state`, `free-no-account`, `offline-reload`, `run-recovery`,
`three-error-loss`, `input-paths`, and `frame-rate`.

The previously failing exact frame-rate command passed with five samples of
`59.88 FPS` and a `59.88 FPS` median against the 50 FPS requirement. The full
`npm test` run then passed: 4/4 Vitest tests and 29/29 Chromium tests, with
`test-results/.last-run.json` reporting `status: passed` and no failed tests.

## First read and game run

A cold live desktop load plainly says:

- **What:** “Learn a symmetry puzzle at your pace.”
- **For whom:** visual puzzle players who want practice before the daily
  challenge.
- **First action:** **Try it with sample data**, which says it opens teaching
  board 3 with two boards complete.

The first viewport includes the playable board preview, not a menu wall. The
one-click action opens the isolated `/demo` sample with its persistent
“Demo — sample data, nothing is saved” banner.

I played the deterministic live demo through the public UI from board 3 to its
real end screen: **The orchard is mirrored**, 5 moves, 3 of 3 dew, with a
replay action. Three invalid placements reached the real loss screen: **This
orchard withered**. The automated full run also covers restart reset, daily
replay, completion persistence, run recovery, sound/calm-motion persistence,
pointer/touch input, all advertised keyboard controls, and dialog focus
containment. At 390 × 844 the browser had no horizontal overflow; Tab showed a
solid focus outline on the Skip to game link; reduced motion was active.

Invalid seed input `bad!` produced native `patternMismatch`,
`aria-invalid="true"`, and the recovery message “Use 1–48 letters, numbers,
spaces, or dashes.” There were no console or page errors.

## Local quality and build

```text
npm ci             PASS — 61 packages, 0 vulnerabilities
npm run test:unit  PASS — 4/4
npm run typecheck  PASS
npm run lint       PASS
npm test           PASS — 4 unit + 29 Chromium tests
npm run build      PASS — dist/ produced
```

The fresh build contains 33,555 bytes of JavaScript (11.79 kB gzip) and 23,295
bytes of CSS (5.90 kB gzip), within the static-product budgets. The mobile
hero image is 77,382 bytes.

## Live deployment, privacy, accessibility, and PWA

- SHA-256 checks matched all 23 browser-served production files between
  `dist/` and live. `staticwebapp.config.json` is intentionally not publicly
  served (live 404), so it is excluded from that count. The JavaScript hash is
  `3bfef1808af09182cbccef488e73ce2a9fce85e2ed85e1bc33eae0c7406cbc45` and
  the service-worker hash is
  `f459e0fbe7d94cd3b38ce22b3a5505d7f69c5e8fce3c996b416f7dbc86fa5d88`.
- Cold-load request logging observed only same-origin first-party document,
  JavaScript, CSS, image, and self-hosted font requests. Demo play, archive
  navigation, and privacy/seed paths made no analytics, ads, payment, account,
  API, WebSocket, or third-party request.
- The HTML response has a self-only CSP (including response-header
  `frame-ancestors 'none'`), HSTS, `nosniff`, strict-origin referrer policy,
  and disabled camera/microphone/geolocation/payment permissions. Hashed
  assets are one-year immutable; HTML revalidates in 30 seconds; `sw.js` is
  `no-cache`; the missing route returns a designed HTTP 404.
- The live service worker was controlled and activated after `registration.update()`.
  After the first visit, offline `/demo` reload recovered the paused board and
  displayed the offline notice with no errors.
- Live Axe checks on `/`, `/demo`, `/archive`, `/daily`, `/seeds`, `/privacy`,
  `/terms`, and `/missing-page` found zero serious or critical violations.
  Each route has exactly one h1 and zero 390 px overflow.
- A direct live 390 × 844 / 4×-CPU measurement produced five 59.88 FPS median
  samples. There are no server-side product endpoints, authentication,
  payment, or unlock APIs, so rate-limit/429, concurrency, health, and Entra
  checks do not apply.

## Defects by severity

None found.

## Evidence

- `verification-8-assets/live-first-read-desktop.png`
- `verification-8-assets/live-first-screen-mobile.png`
- `verification-8-assets/live-demo-win-desktop.png`
- `verification-8-assets/live-demo-loss-desktop.png`
- `verification-8-assets/live-functional.json`
- `verification-8-assets/live-routes-axe.json`
- `verification-8-assets/live-offline.json`
- `verification-8-assets/live-frame-rate.json`
- `verification-8-assets/live-identity.json`
