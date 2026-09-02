# Mirror Orchard handoff

## Independent verification status

**FAIL — do not promote candidate
`44e9c1bee8b3c617b903ccde5df8da92a066a239`.**

Independent verification ran on 2026-09-01–02 UTC against the exact candidate
and <https://mirror-orchard.sociobot.in>. The live HTML, hashed JS/CSS, and
service worker match the candidate build byte-for-byte.

## Release blockers

1. `npm test` exits 1. The required `completion-persist` claim test fails
   consistently because the win overlay's decorative center line intercepts
   the normal pointer click on “Plant board 4.” The same failure reproduces on
   the live game. Keyboard activation works and persistence itself is correct.
2. The deployed service worker cannot install. Its precache includes
   `/staticwebapp.config.json`, which returns 404 in Static Web Apps;
   `cache.addAll()` rejects, the worker becomes redundant, and offline reload
   fails with `ERR_INTERNET_DISCONNECTED`. The live offline promise is false.
3. At 390 × 844, the landing-page board preview starts at y=867.06 and is
   entirely below the first viewport. The captured first screen does not show
   the game itself.

A lower-severity routing defect remains: malformed seed deep links render the
designed not-found page but return HTTP 200.

Full evidence and the per-claim result table are in
[verification-2.md](verification-2.md).

## What passed

- `npm ci`, `npm run typecheck`, `npm run lint`, and `npm run build` pass.
- The build produces `dist/`; JS is 33.42 KB raw / 11.76 KB gzip and CSS is
  23.14 KB raw / 5.86 KB gzip.
- 4/4 unit tests and 21/22 browser tests pass. Individually, 15/16 declared
  claim commands pass.
- The live game reaches win and loss screens, resets, recovers runs, persists
  real and demo progress separately, and reproduces daily/personal seeds.
- Pointer, touch, and all documented keyboard controls work during play.
- Live `/` and `/demo` pass `verify-url.sh`; eight routes have zero Axe
  serious/critical findings, one h1, no 390 px overflow, visible focus, and
  reduced-motion behavior.
- All observed runtime requests were same-origin. No console or page errors
  occurred. Security and immutable-asset cache headers are present.
- Mobile board work measured 12.6 ms worst case and 60.00 fps under 4× CPU
  throttling. Three clean Lighthouse runs scored 94/90/95 (median 94),
  with 100 for accessibility, best practices, and SEO.

## Reproduce

```sh
npm ci
npm run test:e2e -- --grep @claim:completion-persist
npm test
npm run build
```

For the live offline failure, open `/demo`, inspect service-worker
registrations, then go offline and reload. The worker transitions from
`installing` to `redundant`; no controller is installed.

Product source was not modified during verification. Only this handoff and the
second verification report were added or updated.
