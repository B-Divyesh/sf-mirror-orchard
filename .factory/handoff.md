# Mirror Orchard verification handoff

## Status

**FAIL — release blocked** for work order `mirror-orchard-verify-6`.

- Candidate: `d3a9ac8495f840bed7a57103a3f6db048800936c`
- Live URL: <https://mirror-orchard.sociobot.in>
- Verified: 2026-09-02 UTC
- Full report: [verification-6.md](verification-6.md)

No product code was changed. This verification updated only factory QA records and evidence.

## Blocking defect

README says **“Rounds have no timer.”**, but `.factory/claims.json` has no matching claim entry or tagged sandbox test. The supplied claims contract explicitly makes an unlisted visitor-facing README claim a failed review. The feature appears true in the implementation; its mandatory claim registration and proof are missing.

## Additional defect

Invalid archive boundaries are soft 404s. `/play/archive/0`, `/play/archive/41`, `/play/archive/-1`, and `/play/archive/foo` render **Page not found** but return HTTP 200. `/missing-page` and `/play/seed/bad` correctly return HTTP 404.

## What passed

- All 18 exact commands in `.factory/claims.json` passed independently.
- `npm test` passed: 4 unit and 28 Chromium tests.
- `npm run typecheck`, `npm run lint`, and `npm run build` passed; `dist/` was produced.
- The first-read screen and one-click isolated demo passed on desktop and 390 px mobile.
- Public UI scripts reached teaching-board and daily win screens, the three-error loss screen, and clean replay/restart states.
- Archive, daily, personal seed, saved-run recovery, settings persistence, pointer, touch, and all advertised keys worked.
- Eight live routes had zero Axe serious/critical findings, one h1/main, and no mobile overflow.
- Requests remained same-origin; security headers, caching, service-worker update, and offline reload passed.
- All 23 deployed browser files matched the fresh candidate build by SHA-256.
- Live 4×-CPU frame-rate median was 60.00 fps against the stated 50 fps budget.
- Lighthouse mobile: 96 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1.7 s, CLS 0.062, TBT 180 ms.

The static game has no backend, product-unlock endpoint, account, payment, or sign-in. Rate-limit, persistence-concurrency, health/build-identity endpoint, and Entra checks are therefore not applicable.

## Reproduce

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
```

Then run each exact test command in `.factory/claims.json`, open `/demo` in a fresh browser context, and follow the evidence matrix in `.factory/verification-6.md`.

## Next steps

1. Remove “Rounds have no timer” or register it in `.factory/claims.json` with exactly one `@claim:no-timer` browser test.
2. Replace the broad archive wildcard with routing that returns a real 404 outside boards 1–40, and add boundary tests for 0, 41, negative, and non-numeric values.
3. Rerun the claims gate and independent verification before release.
