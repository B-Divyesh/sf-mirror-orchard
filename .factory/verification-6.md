# Mirror Orchard independent verification 6

## Result: FAIL — release blocked

- **Candidate:** `d3a9ac8495f840bed7a57103a3f6db048800936c`
- **Live URL:** <https://mirror-orchard.sociobot.in>
- **Verified:** 2026-09-02 UTC
- **Scope:** independent product QA only; no product code was changed

The game itself, deployment, performance claim, privacy behavior, accessibility baseline, and complete game loop passed. The candidate still fails the supplied claims contract because README copy makes a visitor-facing claim that is absent from `.factory/claims.json`. Invalid archive-level boundaries also return soft 404s.

## Release-blocking finding

### High — README makes an unlisted claim

README line 7 says **“Rounds have no timer.”** There is no corresponding entry in `.factory/claims.json` and no `@claim:no-timer` test. The claims contract says any claim-like sentence on the landing page or in the README without a claims entry fails review.

The implementation appears to honor the statement: a source search found no timer, countdown, interval, or timeout in `src/`. That does not satisfy the required claim inventory and tagged sandbox test. Add a claim and a public-UI test that demonstrates play does not expire, or remove the sentence.

## Other finding

### Medium — invalid archive boundaries are soft 404s

The live UI correctly renders its designed **Page not found** screen, but the wildcard `/play/archive/*` rewrite returns HTTP 200 for invalid board routes:

| URL | HTTP | Rendered h1 |
| --- | ---: | --- |
| `/play/archive/0` | 200 | Page not found |
| `/play/archive/41` | 200 | Page not found |
| `/play/archive/-1` | 200 | Page not found |
| `/play/archive/foo` | 200 | Page not found |

By comparison, `/play/seed/bad` and `/missing-page` return HTTP 404. The static response policy should reserve 200 responses for boards 1–40 and return a real 404 for the invalid boundary cases.

## Mandatory claims gate

`.factory/claims.json` exists with 18 unique entries. Each ID appears in exactly one tagged browser test, with no undeclared tags. After `npm ci`, every exact listed command passed independently:

`archive-open`, `complete-round`, `completion-persist`, `restart-reset`, `settings-persist`, `seed-reproducible`, `daily-seed`, `daily-replay`, `local-only`, `privacy-no-tracking`, `demo-isolated`, `demo-sample-state`, `free-no-account`, `offline-reload`, `run-recovery`, `three-error-loss`, `input-paths`, and `frame-rate`.

The independent frame-rate claim run measured 54.51, 55.78, 54.50, 46.37, and 55.78 fps, with a **54.51 fps median** against the 50 fps budget. The complete suite later measured a 53.69 fps median. The previous deployment-only frame-rate failure is not present in this candidate.

## First-read and demo result

Cold desktop and 390 × 844 loads pass the mandatory first-read test:

- **What:** “Learn a symmetry puzzle at your pace.”
- **For whom:** visual-puzzle players who want practice before the daily challenge.
- **First click:** **Try it with sample data**, followed by “Opens teaching board 3 with two boards complete.”

The first screen shows the board preview, including on mobile where its top begins at 722.6 px inside the 844 px viewport. The one-click action enters `/demo`, shows the persistent “Demo — sample data, nothing is saved” banner, and opens teaching board 3 with boards 1 and 2 complete.

## Local candidate verification

Executed from the clean candidate checkout:

```text
npm ci                 PASS — 61 packages, 0 vulnerabilities
npm test               PASS — 4 unit tests and 28 Chromium tests
npm run typecheck      PASS
npm run lint           PASS
npm run build          PASS — dist/ produced
```

The full test run includes all 40 boards' deterministic solutions, route/a11y checks, invalid seed recovery, focus containment, touch targets, offline reload, and all advertised input paths.

## Independent live game run

A fresh browser context followed the public UI from landing to demo play to the real end screen:

- Teaching board 3 began with one move, three dew, and the documented sample state.
- The scripted public-control solution reached **The orchard is mirrored** in 1.398 seconds with 5 moves and 3/3 dew.
- **Replay this board** reset to zero moves, three dew, no filled plots, and a fully unused tray.
- Three invalid plot selections reached **This orchard withered** with zero dew.
- **Restart board** restored zero moves, three dew, no filled plots, and the full tray.
- The UTC daily board used `daily:2026-09-02:v1`, reached its win screen in nine moves, and replayed cleanly. Its fingerprint was unchanged after reload.
- A 48-character personal seed produced the same fingerprint after reload. `bad_seed!` was rejected with the documented recovery message.
- Completing a teaching board remains recorded in the archive; unfinished runs reopen paused.
- Sound and calm-motion settings survived reload. Demo storage remained isolated from a pre-seeded real-progress sentinel and was deleted by **Start for real** without changing real progress.

Pointer and touch planting worked. Keyboard-only checks covered all four arrows, number keys 1–9, `R`, Enter, Space, `Z`, and Escape. Pause, win, and loss dialogs move focus to their heading and contain focus. The visible focus indicator measured as a 3 px solid amber outline.

## Accessibility and responsive checks

At 390 × 844, `/`, `/demo`, `/archive`, `/daily`, `/seeds`, `/privacy`, `/terms`, and `/missing-page` each had one `h1`, one `main`, no horizontal overflow, and no Axe serious or critical findings. The minimum measured persistent interactive target was 44 × 44 CSS px. At 200% browser scaling, the h1 and demo action remained present and reachable.

`prefers-reduced-motion: reduce` was honored: animation and transition durations measured 0.01 ms and scroll behavior was `auto`. The factory `verify-url.sh` passed `/`, `/demo`, and `/404.html` with title, language, main landmark, image alternatives, and zero console/page errors.

## Privacy, security, and deployment identity

During live landing, demo play, archive, and privacy navigation, every observed request was a same-origin GET to `mirror-orchard.sociobot.in`. There were no third-party, analytics, ad, account, payment, leaderboard, XHR, WebSocket, or API requests, and no console/page errors.

The root response supplies a self-only CSP with `frame-ancestors 'none'`, HSTS, `nosniff`, strict-origin referrer policy, and disabled camera, microphone, geolocation, and payment permissions. The demo used only `demo:mirror-orchard:v1`; the real namespace was not read or changed.

All 23 browser-served files in the fresh local `dist/` matched the live files byte-for-byte by SHA-256, including HTML, hashed JS/CSS, service worker, manifest, images, fonts, 404 assets, robots, sitemap, and social card. This proves the live deployment matches the candidate build.

The product is a static local-first browser game with no server-side/product-unlock endpoint, so request allowances, `429`/`Retry-After`, persistence concurrency, health endpoints, and Entra sign-in checks do not apply. No account or sign-in exists.

## PWA, caching, and performance

The service worker controlled the live demo, used cache `mirror-orchard-51cdaada04c5`, and had no waiting or installing worker after `registration.update()`. Offline reload reopened the saved board, focused the recovery heading, and showed the offline notice. Chromium reported no manifest or installability errors.

Live cache policy was correct: HTML uses `public, must-revalidate, max-age=30`; hashed JS/CSS and art use one-year immutable caching; `sw.js` uses `no-cache`. `/staticwebapp.config.json` is not publicly served.

- JavaScript: 33,553 bytes raw / 11.78 kB gzip (Vite report)
- CSS: 23,281 bytes raw / 5.89 kB gzip (Vite report)
- Mobile hero: 77,382 bytes
- Initial font transfer: 61,590 bytes
- Full built `dist/`: 762,138 bytes
- Independent live 4×-CPU frame samples: 57.12, 60.00, 60.00, 60.00, 60.00 fps; median **60.00 fps**
- Lighthouse mobile: performance **96**, accessibility **100**, best practices **100**, SEO **100**
- Lighthouse metrics: FCP 1.2 s, LCP 1.7 s, CLS 0.062, TBT 180 ms, initial transfer 169,537 bytes

Evidence is under `.factory/verification-6-assets/`, including first-screen, win, loss, offline, factory URL-check, and Lighthouse artifacts.

## Required disposition

Do not release candidate `d3a9ac8495f840bed7a57103a3f6db048800936c`. Add or remove the unlisted no-timer claim, add its tagged test if retained, and correct invalid archive boundary status codes. Then rerun every exact claim command and the complete verification suite.
