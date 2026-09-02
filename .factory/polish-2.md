# Perfection loop polish 2

Completed 2 September 2026 for work order `mirror-orchard-polish-2`. The repair implementation is commit `b88258c3a66a8bf70fe29e9569701c5505333265`, deployed at <https://mirror-orchard.sociobot.in>.

## Finding map

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-2-1 | Renamed the shared SPA and static-404 link to **Skip to main content**. Every `main#main` is programmatically focusable. The SPA explicitly transfers focus after keyboard activation; the static 404 uses native fragment focus. | Browser tests `every application route skips to its main content` and `the static 404 uses the shared route skeleton and complete metadata`; [live focused skip link](polish-2-assets/live-skip-link.png); cold checks on [/archive](https://mirror-orchard.sociobot.in/archive), [/seeds](https://mirror-orchard.sociobot.in/seeds), [/privacy](https://mirror-orchard.sociobot.in/privacy), [/terms](https://mirror-orchard.sociobot.in/terms), and the [designed 404](https://mirror-orchard.sociobot.in/missing-polish-2-route). |
| F-2-2 | Added `/play/archive/1` through `/play/archive/40` to `sitemap.xml` in the same order as the finite routes in `staticwebapp.config.json`. The regression test compares the complete lists. | Browser test `static response policy serves only archive boards 1–40 and reserves real 404s for invalid boundaries`; live [sitemap](https://mirror-orchard.sociobot.in/sitemap.xml) has 47 URLs, 40 archive URLs, and all 47 returned HTTP 200. |
| F-1-1 | Preserved route-heading focus and polite announcements for History API navigation and browser Back. | Browser test `browser Back focuses and announces the landing route`; live `/` → `/archive` → Back focused “Learn a symmetry puzzle at your pace” and announced “Learn a symmetry puzzle at your pace page.” |
| F-1-2 | Preserved accurate scope: “Every teaching board stays open.” The removed daily-expiration promise remains absent. | `@claim:archive-open`; live landing copy check; [live mobile landing](polish-2-assets/live-home/screenshot-mobile.png). |
| F-1-3 | Preserved the same allowed seed characters in landing copy, form help, validation, and recovery text. | `@claim:seed-reproducible`; browser test `seed input rejects punctuation with Chromium-v validation, no console errors, and reproducible valid URLs`; live [/seeds](https://mirror-orchard.sociobot.in/seeds). |
| F-1-4 | Preserved the declared demo starting-state claim and its one clean-sandbox test. | `@claim:demo-sample-state`; live direct demo showed board 3 with boards 1 and 2 complete; [live mobile demo](polish-2-assets/live-demo/screenshot-mobile.png). |
| F-1-5 | Preserved the descriptive section labels “Choose a puzzle” and “Privacy and storage.” | Live landing copy check and [live mobile landing](polish-2-assets/live-home/screenshot-mobile.png). |

## Cumulative acceptance checks

- The one-click action and `/?demo=1` both open teaching board 3. The persistent banner provides **Reset demo** and **Start for real**.
- A cold live isolation check began with both real and demo keys. Demo play used `demo:mirror-orchard:v1`; leaving removed only that key and preserved the real record byte-for-byte.
- The live demo request log contained only `https://mirror-orchard.sociobot.in`. Offline reload restored board 3 and displayed the saved-board notice.
- Titles, descriptions, canonical URLs, one-h1/one-main structure, focus, 390 px overflow, and serious/critical Axe checks passed on `/`, `/archive`, `/daily`, `/seeds`, `/privacy`, `/terms`, `/demo`, `/play/archive/1`, and a real 404.
- The current copy audit has no sentence over 22 words and no banned term. The catalog description starts with a verb and is 99 characters.
- Earlier repairs remain covered: dialog focus trapping, 44 px mobile controls, real boundary 404s, settings persistence, pointer-operable win controls, valid seed recovery, and the visible mobile game preview.

## Verification evidence

- Fresh clone `/tmp/mirror-orchard-clean.6VF21t`: `npm ci` found 0 vulnerabilities. Every one of the 19 exact commands in `.factory/claims.json` passed independently; each command rebuilt `dist/`.
- Full local suite: `npm test` passed 4 deterministic unit tests and 30 Chromium tests. This includes privacy request logging, offline service-worker reload, touch and keyboard input, mobile layout, Axe, route focus, metadata, and sitemap parity.
- Production build: `npm run build` passed. JavaScript is 33.84 KB raw / 11.84 KB gzip; CSS is 23.30 KB raw / 5.90 KB gzip; the mobile hero is 77,382 bytes.
- Supplied URL verifier: home, direct demo, archive, and static 404 passed locally and live with no console errors. Live reports and screenshots are under [`polish-2-assets`](polish-2-assets/).
- Live Lighthouse mobile: performance 98, accessibility 100, best practices 100, SEO 100; LCP 1.6 s, CLS 0.062, total blocking time 100 ms. Evidence: [lighthouse-live.json](polish-2-assets/lighthouse-live.json).
- Deployment: Azure Static Web Apps production deployment `803c78af-bc53-4eb2-9f00-122752e7e143` succeeded for the existing `sf-mirror-orchard` resource; the custom domain returned HTTP 200 over managed TLS.

Every finding from reviews 1 and 2 is resolved. No severity is deferred.
