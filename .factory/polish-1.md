# Perfection loop polish 1

Completed 2026-09-02 for work order `mirror-orchard-polish-1`. The repaired product commit is `b77730df128cbb90a687e0fff952239d6f4d26a0` and is deployed at <https://mirror-orchard.sociobot.in>.

## Review 1 finding map

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | The landing `h1` is programmatically focusable. Every History API navigation and `popstate` now focuses the current `h1` and writes “<heading> page” to the polite live region. | Browser test `browser Back focuses and announces the landing route`; live cold check from `/` → `/archive` → Back; [focused live landing](polish-assets/live-back-focus.png); <https://mirror-orchard.sociobot.in/> |
| F-1-2 | Replaced the overbroad heading and expiration promise with “Every teaching board stays open” and “Start with a teaching board, play today’s puzzle, or enter a seed.” | `@claim:archive-open`; full copy audit in [copy-audit.md](copy-audit.md); [live mobile landing](polish-assets/live-home/screenshot-mobile.png); <https://mirror-orchard.sociobot.in/> |
| F-1-3 | Replaced “Replay any word or phrase” with “Replay a seed using letters, numbers, spaces, or dashes,” matching the accepted input. | Browser test `seed input rejects punctuation and valid seed URLs stay reproducible`; `@claim:seed-reproducible`; live cold copy assertion; <https://mirror-orchard.sociobot.in/seeds> |
| F-1-4 | Added `demo-sample-state` to `.factory/claims.json`. Its clean-context test enters through `/?demo=1`, checks board 3, completed boards 1 and 2, the persistent banner, one saved sample move, and reset behavior. | `@claim:demo-sample-state`; [live mobile demo](polish-assets/live-demo/screenshot-mobile.png); <https://mirror-orchard.sociobot.in/?demo=1> |
| F-1-5 | Replaced the mood labels with the descriptive labels “Choose a puzzle” and “Privacy and storage.” | Live cold copy assertions; [live mobile landing](polish-assets/live-home/screenshot-mobile.png); <https://mirror-orchard.sociobot.in/> |

## Cumulative earlier-finding audit

Review 1 carried forward the earlier verification history, so those repairs were rechecked too:

| Earlier finding | Current evidence |
| --- | --- |
| Claim commands failed before a build | All 17 exact claim commands passed independently after `npm ci` in clone `/tmp/mirror-orchard-clean.vGUpOc`. Each Playwright command built a new `dist/`. |
| Dialog focus escaped | `pause and end dialogs contain focus and inert the covered game` and `loss dialog contains focus` pass. |
| Persistent mobile targets were under 44 px | `persistent mobile controls meet the 44px touch-target baseline` passes at 390 × 844. |
| Published promises were absent from the claims inventory | `.factory/claims.json` now has 17 entries and a source audit confirmed exactly one `@claim:<id>` test per entry. The demo-state promise is now included. |
| Seed validation contradicted its help | The landing copy and form now name the same allowed character set; the punctuation rejection browser test passes. |
| Unknown and malformed-seed routes were soft 404s | `static response policy reserves real 404s for unknown application paths` passes; live `/missing-polish-route` returned HTTP 404 with the designed page. |
| Settings and frame-rate tests were too narrow | `@claim:settings-persist` checks both sound and calm motion; `@claim:frame-rate` runs at 390 × 844 under 4× CPU throttling. |
| Win controls were pointer-obstructed | `@claim:completion-persist` activates the centered pointer target and confirms the overlay decoration has `pointer-events: none`. |
| Hosted service worker could not install | `@claim:offline-reload` passes locally; the cold live audit installed the worker, switched offline, reloaded `/demo`, and found the offline notice and playable state. |
| The mobile first screen hid the game | The 390 × 844 check passes. The cold live board begins at y=722.625; see [live mobile landing](polish-assets/live-home/screenshot-mobile.png). |

## Verification evidence

- Fresh clone: `npm ci` found 0 vulnerabilities. All 17 claim commands passed individually. `npm test` then passed 4 unit and 26 Chromium tests. `npm run build` produced `dist/`.
- Production bundle: JavaScript 33.55 KB raw / 11.78 KB gzip; CSS 23.28 KB raw / 5.89 KB gzip; mobile hero 77.38 KB.
- Local URL checks: `/` and `/demo` each had a title, `lang=en`, one `h1`, a main landmark, image alt text, and zero console errors. Evidence: [home report](polish-assets/local-home/verify.json) and [demo report](polish-assets/local-demo/verify.json).
- Standalone Axe 4.10.3: zero violations on `/`, `/demo`, `/archive`, `/daily`, `/seeds`, `/privacy`, and `/terms`, locally and live.
- Live URL checks: `/` and `/?demo=1` returned 200 with zero console errors and complete semantic basics. Evidence: [home report](polish-assets/live-home/verify.json) and [demo report](polish-assets/live-demo/verify.json).
- Live route/metadata crawl: eight app routes and 52 internal links passed; route-specific titles, canonical URLs, descriptions, Open Graph titles, legal links, metadata assets, and HTTP statuses were correct.
- Live security/privacy: CSP, HSTS, `nosniff`, referrer policy, and permissions policy are present. The cold flow requested only `https://mirror-orchard.sociobot.in`.
- Live Lighthouse mobile: performance 99, accessibility 100, best practices 100, SEO 100. Machine-readable evidence: [lighthouse-live.json](polish-assets/lighthouse-live.json).

No review finding remains open.
