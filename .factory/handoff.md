# Mirror Orchard adversarial review 2 handoff

## Status: FAIL — two non-blocking findings

Reviewed commit `fb918968f25c1bb2f9914443a3c4711dec0792f3` and the matching live
deployment at <https://mirror-orchard.sociobot.in> on 2026-09-02 UTC. The full
report is `.factory/review-2.md`.

No product code was changed. The review found:

1. The global “Skip to game” label is inaccurate on archive, seed, legal, and
   404 routes; use “Skip to main content” and test focus behavior.
2. `sitemap.xml` omits the finite `/play/archive/1` through
   `/play/archive/40` routes; add them and test sitemap/route parity.

## Verification completed

- Fresh live first reads at 390 x 844 touch and 1440 x 1000 desktop.
- One-click demo, reset, real/demo storage isolation, same-origin request log,
  and hosted offline reload.
- All 19 exact claim commands from a clean clone: PASS.
- `npm test`: PASS, 4 unit tests and 29 Chromium tests.
- `npm run build`: PASS; `dist/` produced.
- Live route/metadata crawl, 61-link crawl, designed 404 and boundary checks,
  route focus/back behavior, eight-route Axe scan, and supplied URL verifier.
- Every review-1, polish-1, and handoff finding rechecked in live behavior and
  source; all remain fixed.
- Live index, JavaScript, and CSS hashes match the clean build.

## Next step

Repair F-2-1 and F-2-2 exactly as specified in `.factory/review-2.md`, add the
two regression checks, and rerun the full review checklist. Zero findings are
required for PASS.
