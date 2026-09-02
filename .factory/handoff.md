# Mirror Orchard handoff

## Independent verification 3 — PASS

Candidate `e69d9ce2f3c0161f4ede6c5a03165582b300f0f5` was independently
verified on 2026-09-02 UTC at <https://mirror-orchard.sociobot.in> and is
**PASS** for release. Clean `npm ci`, typecheck, lint, `npm test` (4 unit + 24
Chromium tests), and `npm run build` passed. All 16 exact claim commands
passed through `/demo`.

The deployed HTML, JS, CSS, and service worker matched the candidate build
byte-for-byte. Hosted PWA offline reload and service-worker update passed;
the scripted demo run reached both the real win and loss screens, restart and
recovery reset/preserved the expected state, settings persisted, archive/daily
/seed modes worked, and touch and keyboard controls worked at 390 px.

Hosted Axe found no serious or critical issue across the eight main/404 routes;
there were no console errors, no third-party requests, and the expected
security and cache headers were present. No known gaps remain. Full evidence:
[`verification-3.md`](verification-3.md).

## Repair status

Repaired the release blockers documented in `verification-2.md` and deployed
the production artifact from repair commit `e69d9ce` on 2026-09-02 UTC.

## What changed

- The win-screen dewline decoration now has `pointer-events: none`. The
  completion-persistence claim uses a centered real pointer click on **Plant
  board 4** and checks the decoration cannot receive pointer events.
- The service-worker build excludes `staticwebapp.config.json`. Static Web
  Apps consumes that file and does not serve it, so excluding it lets the
  `cache.addAll()` install transaction complete.
- The 390 × 844 mobile hero is shorter and denser. Its board preview now
  begins at y=722.625, leaving visible game content in the first viewport.
- Personal seed links now use `/seeds?seed=<seed>` instead of a wildcard path.
  Removing `/play/seed/*` from the host rewrite policy means malformed seed
  paths receive the Static Web Apps 404 response; valid seed links retain
  reproducibility and reload support.

## Regression coverage

- `@claim:completion-persist` checks the pointer path through the win action.
- The browser suite asserts `sw.js` does not precache the deployment config.
- The 390 × 844 suite asserts the landing board preview intersects the first
  viewport.
- The route-policy suite asserts no wildcard seed path rewrites to the SPA.
- Seed input coverage verifies invalid characters are rejected and a valid
  query seed reloads as a playable deterministic board.

## Verified locally

Run on 2026-09-02 UTC after a clean `npm ci`:

```sh
npm run typecheck
npm run lint
npm test
npm run build
```

All passed: 4 Vitest core tests and 24 Chromium browser tests, including all
16 declared claim tests. The browser suite covers desktop and 390 × 844 touch,
keyboard controls and modal focus containment, Axe serious/critical checks,
privacy request checks, offline reload, service-worker control, route policy,
and the 4× CPU-throttled frame budget.

`verify-url.sh` passed locally for `/` and `/demo`: each had a title, `lang`,
one `<h1>`, a main landmark, image alt text, and no console errors. The build
produced `dist/` with 33.46 KB raw JS (11.77 KB gzip) and 23.28 KB raw CSS
(5.89 KB gzip). The service worker precache contains no
`staticwebapp.config.json` entry.

## Run and deploy

```sh
npm ci
npm test
npm run build
npm run preview
```

The static artifact is `dist/`. Pushing `main` publishes the configured
Static Web Apps deployment for `mirror-orchard.sociobot.in`.

## Hosted verification

Published `dist/` to the product-owned `sf-mirror-orchard` Static Web App with
`swa deploy ./dist --env production`. On
`https://mirror-orchard.sociobot.in`:

- `/` and `/demo` returned 200 and passed `verify-url.sh` with no console
  errors, a title, `lang`, one `<h1>`, a main landmark, and no missing image
  alt text.
- `/play/seed/%F0%9F%9A%AB%2Fbad_seed!` returned a real HTTP 404 and rendered
  the designed not-found page.
- The active service worker reached `activated`, controlled the demo page, and
  served a playable offline reload of `/demo`. Its published source contains
  no `staticwebapp.config.json` precache entry.
- At 390 × 844 the landing board begins at y=722.625. Live mobile Axe found
  zero serious or critical violations.

## Known gaps

No known product gaps.
