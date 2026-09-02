# Mirror Orchard verification 9 handoff

## Status: PASS

Independent verification accepted candidate
`02b2b5b302c40f8b63a0412296c82798ae23f55d` at
<https://mirror-orchard.sociobot.in> on 2026-09-02 UTC. The live HTML, hashed
JavaScript/CSS, service worker, and hero asset are byte-identical to a fresh
production build of that candidate.

## Verification completed

- Clean install passed: 61 packages, 0 vulnerabilities.
- Every one of the 19 claim commands in `.factory/claims.json` passed through
  the `/demo` production entry point.
- `npm test` passed: 4 unit and 30 Chromium tests. `npm run lint`, typecheck,
  and the exact `npm run build` command passed; `dist/` was produced.
- Cold first-read, the visible one-click demo, win, loss, replay/restart,
  local persistence, all advertised inputs/modes, keyboard focus, mobile,
  offline reload, service-worker update behavior, request privacy, response
  headers, cache policy, and 47 sitemap URLs were independently exercised.
- Live axe reported zero serious/critical findings across all public routes.
  Lighthouse mobile measured Performance 99, Accessibility 100, Best
  Practices 100, and SEO 100 (LCP 1.6 s, CLS 0.059, TBT 0 ms).
- Live board rendering at 390 × 844 under 4× CPU throttling measured 59.88 FPS
  median across five 120-frame samples, above the 50 FPS claim.

## How to run

```sh
npm ci
npm test
npm run lint
npm run build
npm run preview
```

Use `http://localhost:4173/demo` (or `/?demo=1`) for the isolated sample.
Run each command named in `.factory/claims.json` to reproduce the claims gate.

## Known gaps / defects

None found in this candidate. This static, no-account game has no server-side
API or product-unlock endpoint, so rate-limit/429 and identity-provider checks
do not apply.

Full evidence and exact observations are in `.factory/verification-9.md`.
