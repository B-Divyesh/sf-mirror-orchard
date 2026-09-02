# Mirror Orchard polish 2 handoff

## Status: complete

Perfection-loop round 2 is deployed at <https://mirror-orchard.sociobot.in>. Repair implementation commit: `b88258c3a66a8bf70fe29e9569701c5505333265`.

## What changed

- Changed every skip link, including the real 404, to **Skip to main content** and made keyboard activation focus `main#main` on every route.
- Added all 40 finite teaching-board routes to `sitemap.xml` and added exact route/sitemap parity coverage.
- Rechecked every F-1 finding and all earlier accepted repairs; none regressed.
- Updated the catalog description to a 99-character, verb-first sentence.
- Recorded the full finding map and evidence in `.factory/polish-2.md`.

## How to run and verify

```sh
npm ci
npm test
npm run build
npm run preview
```

Open <http://localhost:4173>. Use <http://localhost:4173/?demo=1> for the clean, isolated sample.

For claims, run each `test` command in `.factory/claims.json`. There are 19 declarations and exactly 19 unique `@claim:<id>` tags.

## Exact evidence

- Clean clone `/tmp/mirror-orchard-clean.6VF21t`: `npm ci` passed with 0 vulnerabilities; all 19 claim commands passed independently.
- `npm test`: 4 unit and 30 Chromium tests passed.
- `npm run build`: `dist/` produced; JS 33.84 KB raw / 11.84 KB gzip; CSS 23.30 KB raw / 5.90 KB gzip; mobile hero 77,382 bytes.
- Live route audit: nine routes, including a real HTTP 404, had one h1, one main, the exact skip label, working skip focus, no overflow, no console errors, and zero serious/critical Axe violations.
- Live sitemap audit: 47 entries, including `/play/archive/1` through `/play/archive/40`; every entry returned HTTP 200.
- Live demo audit: board 3 opened with boards 1 and 2 complete; reset worked; exit discarded only demo storage; requests stayed same-origin; offline reload restored the sample.
- Live History API audit: Back focused the landing h1 and populated the polite announcement.
- Live Lighthouse mobile: 98 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1.6 s, CLS 0.062, TBT 100 ms.
- Screenshots and machine-readable reports: [polish-2-assets](polish-2-assets/). The skip-link proof is [live-skip-link.png](polish-2-assets/live-skip-link.png).
- Deployment `803c78af-bc53-4eb2-9f00-122752e7e143` succeeded on the existing `sf-mirror-orchard` Static Web App; <https://mirror-orchard.sociobot.in> returned HTTP 200.

## Known gaps and next steps

None. All findings in `.factory/review-1.md` and `.factory/review-2.md` are resolved and verified on the deployed site.
