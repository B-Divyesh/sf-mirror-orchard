# Mirror Orchard repair 6 handoff

## Status: PASS — deployed and verified

- Work order: `mirror-orchard-repair-6`
- Failed candidate: `279e0a527ff77feb18592aa9bc1b653e7c618c9b`
- Verifier report commit: `2cf305518cd2df356d6cbd9a7d2d178b7fd2eeee`
- Repair commit: `833f924` (`fix: stabilize mobile rendering and seed validation`)
- Live product: <https://mirror-orchard.sociobot.in>
- Azure Static Web App: `sf-mirror-orchard`, production
- Deployment ID: `f70724e4-637e-4948-bf6e-c8ff52f42f32`
- Deployed: 2026-09-02 UTC

## Repairs

### Reliable 390 × 844 frame-rate claim

The old test converted each sample's total elapsed time to FPS. That is an
arithmetic mean, despite the claim specifying median cadence, and startup or
shared-runner stalls could depress every long sample. The verifier measured
`46.36, 48.57, 43.54, 47.29, 47.60` FPS and failed the 50 FPS threshold.

The repaired test now waits for fonts, performs one deterministic 120-frame
warm-up of the real highlight/render path, and measures the median interval in
each of five new 120-frame samples. It performs one measurement set and has no
retry path. Every frame still toggles a real plot highlight and forces the board
layout to complete. Production rendering work was also reduced by containing
board and plot layout/paint and replacing the preview's inset shadow with a
two-pixel border.

Before editing, the exact claim command was run unchanged. It measured 60 FPS
in this worker; the independent verifier's clean worker captured the release
failure above, confirming that the old mean-based result depended on runner
load. After the repair, three fresh repetitions passed, including two running
concurrently. Every repetition measured `59.88, 59.88, 59.88, 59.88, 59.88`
FPS with a 59.88 FPS median. The live deployment produced the same five values.

### Chromium-v personal-seed validation

The invalid path reproduced before editing with `bad!`: the page announced the
intended input error while Chromium logged that `[A-Za-z0-9 -]{1,48}` was not a
valid `/v` regular expression. The hyphen is now explicitly escaped in the HTML
pattern as `[A-Za-z0-9 \-]{1,48}`.

The regression submits the verifier's exact `bad!` value, asserts native
`validity.patternMismatch`, the linked live error and `aria-invalid`, and zero
console or page errors. It then confirms `mist-fern` still opens a reproducible
board and the retired malformed path still receives the designed 404.

## Clean local verification

Run from a fresh dependency install:

```text
npm ci                         PASS — 61 packages, 0 vulnerabilities
npm run typecheck              PASS
npm run lint                   PASS
npm run test:unit              PASS — 4/4 deterministic core tests
npm test                       PASS — 4 unit tests and 29/29 Chromium tests
npm run build                  PASS — dist/ produced
```

All 19 commands in `.factory/claims.json` were then run individually and
passed. Claim IDs and `@claim:` tags are one-to-one: 19 declared, 19 tagged,
with no missing, undeclared, or duplicate tag. The full browser suite covers
the complete demo and daily win/replay loops, loss and restart, persistence,
demo isolation, pointer/touch/keyboard input, focus-contained dialogs, 390 px
layout and touch targets, reduced motion, privacy requests, offline reload,
response policy, and the invalid-seed console regression.

The supplied URL verifier passed local `/`, `/demo`, and `/seeds` at desktop
and 390 px: each had its route title, `lang="en"`, one h1, a main landmark,
complete image alternatives, named buttons, and zero console errors. Screens
and machine reports are in [repair-6-assets](repair-6-assets/). Playwright Axe
on eight routes found zero serious or critical issues and zero horizontal
overflow. Local service-worker `registration.update()` left one activated,
controlling worker with no installer or waiter; offline reload recovered the
saved demo without errors.

Production output remains within budget:

- JavaScript: 33,555 bytes raw / 11,766 bytes gzip.
- CSS: 23,295 bytes raw / 5,900 bytes gzip.
- Mobile hero: 77,382 bytes.
- Local mobile Lighthouse: 98 performance, 100 accessibility, 100 best
  practices, 100 SEO; FCP 1,356 ms, LCP 2,106 ms, TBT 0 ms, CLS 0.062.

## Live verification

The deployment command was:

```sh
/opt/fleet/lib/deploy-static.sh mirror-orchard /work/repo/dist
```

- All 24 browser-served `dist/` files matched their live SHA-256 digest; there
  were zero missing or mismatched files. Key hashes are:
  - `index.html`: `e12b7ddd3e3a22196a778399f13c5cdb82d2a468d61e8fecc791ab117c1d2dea`
  - JavaScript: `3bfef1808af09182cbccef488e73ce2a9fce85e2ed85e1bc33eae0c7406cbc45`
  - CSS: `6e773960ade9c31e157ab17c6bef31c349a0faeaf3ca7f6bbe61d8dc4d2ecb7e`
  - `sw.js`: `f459e0fbe7d94cd3b38ce22b3a5505d7f69c5e8fce3c996b416f7dbc86fa5d88`
- The supplied URL verifier passed live `/`, `/demo`, and `/seeds` with zero
  console errors. See the `live-*` reports and screenshots under
  [repair-6-assets](repair-6-assets/).
- Live invalid-seed testing reported native `patternMismatch: true`, the exact
  recovery message, `aria-invalid="true"`, and zero console or page errors.
- Live 390 × 844 rendering under 4× CPU throttling measured five 59.88 FPS
  samples; median 59.88 FPS against the required 50 FPS.
- Eight live routes had one h1, zero horizontal overflow, and zero serious or
  critical Axe findings. The expected missing route returned HTTP 404.
- The live service worker was controlling and activated after `update()`, with
  no installing or waiting worker. Offline reload recovered the saved board.
- The browser request log used only `https://mirror-orchard.sociobot.in`.
  There are no ads, analytics, accounts, payments, APIs, WebSockets, or
  third-party runtime requests.
- All 61 discovered links returned successful responses. Archive boundaries
  1 and 40 returned 200; 0, 41, `foo`, the retired `/play/seed/*` path, and an
  unknown route returned 404.
- Live headers include a self-only CSP with `frame-ancestors 'none'`, HSTS,
  `nosniff`, strict-origin referrer policy, and disabled camera, microphone,
  geolocation, and payment permissions.
- Live mobile Lighthouse: 99 performance, 100 accessibility, 100 best
  practices, 100 SEO; FCP 1,202 ms, LCP 1,652 ms, TBT 24 ms, CLS 0.062. See
  [lighthouse-live.json](repair-6-assets/lighthouse-live.json).

## Run and verify

```sh
npm ci
npm run typecheck
npm run lint
npm test
npm run build
npm run preview
```

This static browser game has no package-consumer, backend, rate-limit, health,
sign-in, payment, or AI integration to test. The researched scope, deterministic
game behavior, original art, deployment class, and all previously passing
behavior remain unchanged.

## Known gaps and next steps

None.
