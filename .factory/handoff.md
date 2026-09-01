# Mirror Orchard handoff

## Repair status

The release blockers from independent verification commit
`bcc2c4dfd7c64a8741ca2536e90cf388fe8849f3` are repaired. This remains a free,
static Vite browser game. No backend, account, payment, analytics, or
third-party runtime service was added.

## What changed

- Every `claims.json` command now starts from `npm run build` and previews that
  exact production output. The Playwright server refuses to reuse a stale
  process.
- Pause, win, and loss dialogs are fixed modal layers. Covered game/header/
  footer controls are inert and hidden from assistive technology; Tab and
  Shift+Tab cycle only within the dialog; focus moves to its heading.
- Persistent navigation, demo controls, footer links, and game controls meet
  the 44 × 44 CSS-pixel mobile target baseline at 390 px.
- Personal seeds accept only 1–48 ASCII letters, numbers, spaces, and dashes.
  The form exposes an announced error and invalid seed URLs render the designed
  not-found page.
- Unfinished runs recover in a paused state after reload. Completion
  persistence, the three-invalid-move loss rule, privacy/no-tracking behavior,
  both settings, and 390 px/4× CPU board-update performance now have complete
  listed claim coverage.
- Static Web Apps routing enumerates valid app paths and excludes all other
  paths from navigation fallback, allowing its 404 response override to retain
  a real HTTP 404 status.

## Verification

Performed after a clean `npm ci`:

- All 16 exact commands in `.factory/claims.json` passed individually with the
  previous `dist/` moved aside. Each command rebuilt and launched a production
  preview itself.
- `npm test` passed: 4 deterministic unit tests and 22 Chromium browser tests,
  including desktop, 390 × 844 touch, keyboard, dialog focus, offline reload,
  privacy requests, and Axe serious/critical checks on every public route.
- `npm run lint` and `npm run build` passed. Production output is in `dist/`.
  The main JS is 33.42 KB raw / 11.76 KB gzip; CSS is 23.14 KB raw / 5.86 KB
  gzip.
- `/opt/fleet/lib/verify-url.sh` passed locally for `/` and `/demo`: each had a
  title, `lang`, one h1, main landmark, no missing image alt text, no unlabeled
  buttons, and no console errors.
- The frame-rate claim runs at 390 × 844 with a 4× CPU throttle. It performs
  120 real board-highlight style/layout updates and requires every warmed-up
  update to fit a 45 fps frame budget. Raw headless Chromium rAF is capped at
  30 Hz by the runner even for an empty page, so it is not used as a product
  performance measurement.

## Deploy and live checks

Deployment and final live status/header checks are recorded after the repair
commit is pushed. The Static Web Apps response-policy regression test verifies
that known routes rewrite to the SPA and unknown routes use `/404.html` through
the platform's `404` response override (without an invalid rewrite/status pair).

## Known gaps

None for the repaired scope. Vite's local preview intentionally has SPA
fallback behavior and therefore cannot emulate the Static Web Apps HTTP status
policy; the deployed endpoint is the source of truth for that final check.

## Run locally

```sh
npm ci
npm test
npm run build
npm run preview
```
