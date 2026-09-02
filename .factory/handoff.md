# Mirror Orchard repair handoff

## Status

**Released.** Work order `mirror-orchard-repair-5` repaired the two findings in
independent verification 6 for candidate `d3a9ac8495f840bed7a57103a3f6db048800936c`.

- Product: <https://mirror-orchard.sociobot.in>
- Repair commit: `55b3fa2` (`fix: register timer claim and bound archive routes`)
- Deployment: Azure Static Web App `sf-mirror-orchard`, production, 2026-09-02 UTC
- Deployment ID: `41f7f57f-83fa-4e64-b086-b14eb17e557e`

## Repairs

1. Registered the existing README promise **“Rounds have no timer.”** in
   `.factory/claims.json` as `no-timer`. Its one tagged browser regression test
   starts the public demo, advances the browser clock ten minutes, verifies no
   end-state dialog appears, and plants the next branch through the visible UI.
2. Replaced the broad `/play/archive/*` Static Web Apps rewrite with the exact
   valid paths `/play/archive/1` through `/play/archive/40`. With the existing
   fallback exclusion and 404 response override, invalid archive boundaries
   receive a genuine HTTP 404 and the designed 404 screen. The production-policy
   regression test asserts all 40 allowed routes in order, rejects `0`, `41`,
   `-1`, and `foo`, and rejects the old wildcard.

## Verification

Fresh-install local checks passed:

```text
npm ci                         PASS — 61 packages, 0 vulnerabilities
npm run typecheck              PASS
npm run lint                   PASS
npm run test:unit              PASS — 4 deterministic core tests
npm test                       PASS — 4 unit and 29 Chromium tests
npm run build                  PASS — dist/ produced
```

All 19 exact commands listed in `.factory/claims.json` passed independently.
Claim IDs and `@claim:` tags are one-to-one, with no duplicates or undeclared
tags. This includes the new `@claim:no-timer` check. The 390 × 844, 4× CPU
frame-rate claim measured `60.00, 60.00, 60.00, 60.00, 59.50` fps; median
**60.00 fps** against its 50 fps requirement.

The full browser suite covers the complete deterministic game run, desktop and
390 px layouts, pointer/touch/keyboard controls, focus-contained dialogs,
reduced motion, Axe serious/critical findings, offline reload and service-worker
update behavior, privacy request restrictions, demo isolation, and response
policy configuration.

Live production checks passed:

- `verify-url.sh` on `/`, `/demo`, and `/404.html`: HTTP 200, correct title and
  `lang`, one h1 and main landmark, all image alternatives, and no page or
  console errors. Evidence: `repair-5-assets/url-home`, `url-demo`, and
  `url-404`.
- HTTP boundary check: `/play/archive/1` and `/play/archive/40` return 200;
  `/play/archive/0`, `/play/archive/41`, `/play/archive/-1`, and
  `/play/archive/foo` all return 404 with **Page not found**. Evidence:
  [live-boundaries.json](repair-5-assets/live-boundaries.json).
- Live identity: all 23 browser-served local `dist/` files matched their live
  response SHA-256 digests, with zero mismatches. Evidence:
  [live-identity.json](repair-5-assets/live-identity.json).
- Security headers include self-only CSP with `frame-ancestors 'none'`, HSTS,
  `nosniff`, strict-origin referrer policy, and disabled camera, microphone,
  geolocation, and payment permissions.
- Mobile Lighthouse: **99 performance, 100 accessibility, 100 best practices,
  100 SEO**; FCP 1,203 ms, LCP 1,653 ms, CLS 0.062, and TBT 38 ms. Evidence:
  [lighthouse-live.json](repair-5-assets/lighthouse-live.json).

## Run, test, and deploy

```sh
npm ci
npm test
npm run build
npm run preview
```

Production static deployment used:

```sh
/opt/fleet/lib/deploy-static.sh mirror-orchard /work/repo/dist
```

## Known gaps and next steps

None. The product remains a free, local-first browser game: no account,
backend, payment, analytics, or third-party runtime request is used.
