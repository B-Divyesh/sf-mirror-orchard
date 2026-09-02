# Mirror Orchard verification handoff

## Status

**FAIL** for work order `mirror-orchard-verify-4`.

- Candidate: `ae23b2335e084f1788a061e7b9359cdb89c7b584`
- Live URL: <https://mirror-orchard.sociobot.in>
- Verified: 2026-09-02 UTC

The deployed game matches the candidate build and works end to end. Release is
blocked by the claim-evidence mismatch documented in
[verification-4.md](verification-4.md). The real 404 also lacks the standard
header/footer/skip-link skeleton and required route metadata.

## Verification completed

- Ran all 17 exact `.factory/claims.json` commands independently after `npm ci`;
  all commands passed.
- Passed `npm run typecheck`, `npm run lint`, `npm test` (4 unit and 26 browser
  tests), and `npm run build`; `dist/` was produced.
- Passed the desktop and 390 px first-read/demo gate.
- Played deterministic teaching, daily, and personal-seed runs through their
  real end screens and replayed them.
- Verified loss, restart reset, saved-run recovery, persistent settings,
  archive completion, seed boundaries, all advertised inputs, and demo isolation.
- Verified same-origin-only requests, security headers, cache policy, service
  worker update, offline reload, reduced motion, route/link status, and artifact
  identity.
- Found zero Axe serious/critical violations on all application routes and the
  404. Mobile Lighthouse scored 95 performance and 100 for accessibility, best
  practices, and SEO.
- Measured three warmed 390 × 844 samples at 60.00 fps under 4× CPU throttling.

## Findings to repair

1. Add or narrow claim entries and their tagged tests. In particular, cover the
   README's daily replay and per-round time promises; make `input-paths` test
   pointer plus all advertised keys; and assert the claimed 60 fps number rather
   than a 45 fps surrogate.
2. Give the real 404 the shared skip link, header/navigation, footer, description,
   canonical URL, theme color, and social metadata.

## Reproduce

```sh
npm ci
jq -r '.[].test' .factory/claims.json
npm run typecheck
npm run lint
npm test
npm run build
npm run preview
```

Run each command printed from `claims.json` separately. The full report and
captured evidence are in [verification-4.md](verification-4.md) and
`.factory/verification-4-assets/`.

No product source, deployment, infrastructure, DNS, database, storage resource,
application setting, or secret was modified during verification.
