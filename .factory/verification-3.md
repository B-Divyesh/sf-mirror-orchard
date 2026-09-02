# Independent verification 3 — PASS

Verified 2026-09-02 UTC.

- Candidate: `e69d9ce2f3c0161f4ede6c5a03165582b300f0f5`
- Live URL: <https://mirror-orchard.sociobot.in>
- Work order: `mirror-orchard-verify-3`
- Verdict: **PASS**

The deployed static artifact is byte-for-byte the production build from this
candidate. No release-blocking, high, medium, or low severity defects remain.

## First read and demo

In a fresh 390 × 844 browser context, the first screen said: “Learn a symmetry
puzzle at your pace”; identified its audience as visual puzzle players who
want practice boards before the daily challenge; and provided **Try it with
sample data**, with the immediate result (“Opens teaching board 3 with two
boards complete.”) beside it. The game board was already visible at the bottom
of that initial viewport. The one-click action opened `/demo`, teaching board
3, and the persistent “Demo — sample data, nothing is saved” banner.

This satisfies the cold first-read, one-click sandbox, and browser-game
first-screen gates.

## Clean local gates

From the clean detached candidate checkout:

```text
npm ci                         PASS — 61 packages, 0 vulnerabilities
npm run typecheck              PASS
npm run lint                   PASS
npm test                       PASS — 4 Vitest tests and 24 Chromium tests
npm run build                  PASS — dist/ produced
```

The production build is 33.46 KB raw / 11.75 KB gzip JavaScript and 23.28 KB
raw / 5.89 KB gzip CSS, within the static-product budgets. The mobile hero is
77,382 bytes. `dist/sw.js` excludes `staticwebapp.config.json`.

Every exact command listed in `.factory/claims.json` was run individually
after `npm ci` against the production build and its `/demo` entry point. All
passed; the consolidated `npm test` result independently confirmed all 16
claim-tagged tests.

| Claim | Result |
| --- | --- |
| `archive-open` | PASS |
| `complete-round` | PASS |
| `completion-persist` | PASS |
| `restart-reset` | PASS |
| `settings-persist` | PASS |
| `seed-reproducible` | PASS |
| `daily-seed` | PASS |
| `local-only` | PASS |
| `privacy-no-tracking` | PASS |
| `demo-isolated` | PASS |
| `free-no-account` | PASS |
| `offline-reload` | PASS |
| `run-recovery` | PASS |
| `three-error-loss` | PASS |
| `input-paths` | PASS |
| `frame-rate` | PASS |

## Live product exercise

A public, deterministic pointer run was played from the landing page through
the demo board’s actual end screen. It began at 1 move, 2 filled plots, and 3
dew on seed `teaching-orchard-3-v1`. The supplied remaining branches reached
**The orchard is mirrored**; the real pointer click on **Plant board 4** worked,
and board 3 showed **Complete** in the archive.

Three invalid placements reached the actual **This orchard withered** loss
screen. Restart returned the game to playing with 0 moves, 3 dew, 0 filled
plots, and 0 used branches. A saved in-progress demo reloaded into the pause
recovery screen with its state retained. Sound and calm-motion settings
survived reload and restored as pressed settings. The demo namespace existed
as `demo:mirror-orchard:v1`; it did not create the real-progress key.

At 390 px with touch enabled, a branch and plot could be tapped, arrows moved
board focus, `3` focused its branch, and Escape opened the focused pause
dialog. The daily seed was `daily:2026-09-02:v1` and had the same fingerprint
after reload. One-character and 48-character personal seeds opened stable
query URLs; an empty seed produced the announced input error and a longer
value was capped at 48 characters.

The measured rendering check on the hosted 390 × 844 board under 4× CPU
throttling had a worst warmed-up highlight update of 0.90 ms, below the
22.22 ms (45 fps) acceptance budget that supports the advertised 60 fps
target.

## Hosted PWA, privacy, security, and accessibility

The hosted service worker installed and controlled `/demo`, reported an active
`sw.js` after `registration.update()`, had no waiting/installation state, and
used one `mirror-orchard-*` cache. After a normal online visit, setting the
browser offline and reloading still opened the recovery dialog, resumed
teaching board 3, and displayed the offline notice.

The request log over landing, demo, play, archive, and privacy navigation had
only `https://mirror-orchard.sociobot.in` origins. There were no page errors or
console errors, ads, analytics, leaderboards, third-party scripts, account,
or payment flows. The product is static with no server-side/unlock endpoint,
so a 429 allowance check is not applicable; it has no sign-in, so Entra
authority verification is not applicable.

Document headers included a self-only CSP with `frame-ancestors 'none'`, HSTS,
`X-Content-Type-Options: nosniff`, strict-origin referrer policy, and a
restricted permissions policy. HTML used 30-second revalidation; hashed JS,
CSS, fonts, and art used one-year immutable caching; `sw.js` used `no-cache`.

`verify-url.sh` passed for `/` and `/demo`: each had a title, `lang="en"`, one
`h1`, a main landmark, no missing image alt attributes, no unnamed buttons,
and no console errors. Hosted Axe runs at 390 × 844 found zero serious or
critical issues on `/`, `/demo`, `/archive`, `/daily`, `/seeds`, `/privacy`,
`/terms`, and `/missing-page`; each had one `h1` and zero horizontal overflow.
The unknown route returned a real HTTP 404. Keyboard skip-link, dialog focus
containment, visible game focus styling, and reduced motion were checked; the
reduced-motion animation and transition durations were 0.01 ms.

All 52 discovered internal links returned HTTP 200. The malformed seed route
and arbitrary unknown route returned HTTP 404 as intended.

## Deployment identity

The following candidate build files compare byte-for-byte with the hosted
files: `index.html`, `assets/index-_M11B2pC.js`,
`assets/index-BOCviY0X.css`, and `sw.js`. Their SHA-256 values were,
respectively:

```text
414b13a04200e0f079d2e9e4389eb88acaaea91f5a5b49c6df7e9bcde332a7df
ddd3a6ae03e38b485a1868bace6606c88076f5980b3aaf0ca3ea86cce765914d
841ac68af9af231c2c96466a0d354b0b8670ca168cdb10636c7b7b8261e53635
bfc5dc66ea10b361c00c6a4ef8d4e93eca3b2cf0d8fbf3e10f2899336a7b554c
```

## Defects by severity

None found. The three previously reported release blockers (win-screen
pointer interception, deployed service-worker precache failure, and absent
mobile game preview) are fixed and were independently retested on the hosted
candidate.
