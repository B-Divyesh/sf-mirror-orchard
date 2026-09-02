# Independent verification 4 — FAIL

Verified 2026-09-02 UTC.

- Candidate: `ae23b2335e084f1788a061e7b9359cdb89c7b584`
- Live URL: <https://mirror-orchard.sociobot.in>
- Work order: `mirror-orchard-verify-4`
- Verdict: **FAIL**

The deployed game works end to end and matches the candidate build. Every exact
command in `.factory/claims.json` passes. The candidate nevertheless fails the
acceptance contract because published promises are absent from, or broader than,
their tagged claim tests. The real 404 response also omits the required common
site skeleton and route metadata.

## Release-blocking finding

### P1 — published claims are not fully represented and proved by their tagged tests

The claims contract requires each promise in the landing page, product UI, and
README to have a matching claim entry whose single tagged test proves the whole
observable statement. The current inventory and tests do not meet that rule:

- `README.md:7` says the daily puzzle can be replayed and that every round takes
  under five minutes. There is no daily-replay claim. `complete-round` is narrower:
  it covers only one teaching board, while `daily-seed` checks only seed stability.
- `README.md:17,26-27` and the in-game help advertise pointer selection plus
  Arrow, number, `R`, Enter, Space, `Z`, and Escape keyboard behavior. The sole
  `@claim:input-paths` test at `tests/e2e/claims.spec.ts:275` uses touch, Arrow,
  a number key, and Escape. It does not use pointer input, `R`, Enter, Space, or
  `Z`, so it does not prove its own pointer/touch/keyboard claim or the advertised
  control list.
- `frame-rate` claims a 60 fps target, but its tagged test accepts a 45 fps
  highlight-update budget (`1000 / 45`) and does not measure animation-frame
  cadence. This does not assert the number in the claim as required.

Independent live checks confirmed that daily replay, personal-seed replay,
pointer controls, all advertised keys, undo, and 60 fps currently work. That
does not replace the required claim inventory and clean-sandbox assertions.
The attached claims contract explicitly makes an unlisted or under-proved public
promise a failed review.

## Other finding

### P2 — the real 404 omits the standard skeleton and required metadata

`/missing-page` correctly returns HTTP 404 and has a designed recovery link, but
the static `public/404.html` has no skip link, site header/navigation, or footer.
It also omits the route description, canonical URL, theme color, Open Graph, and
Twitter metadata required for every route. The page still has `lang="en"`, one
`h1`, one `main`, good contrast, and no Axe serious/critical finding.

Evidence: [live 404 at 390 px](verification-4-assets/live-404-mobile.png).

## Mandatory first-read test

The live first screen passes at desktop and 390 × 844:

- What it does: “Learn a symmetry puzzle at your pace.”
- Who it is for: visual puzzle players who want practice before the daily
  challenge.
- First action: “Try it with sample data,” followed by “Opens teaching board 3
  with two boards complete.”
- The one-click action opens the isolated `/demo` board with a persistent sample
  banner.
- The game itself is visible in the first phone viewport: the board starts at
  y=722.625 within the 844 px viewport. There is no horizontal overflow.

Evidence: [live mobile first screen](verification-4-assets/live-first-screen-mobile.png).

## Claims gate

From the clean candidate checkout, after `npm ci`, every exact command in
`.factory/claims.json` was run separately before the broader test suite.

| Claim | Exact command result |
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
| `demo-sample-state` | PASS |
| `free-no-account` | PASS |
| `offline-reload` | PASS |
| `run-recovery` | PASS |
| `three-error-loss` | PASS |
| `input-paths` | PASS, but under-scoped as described above |
| `frame-rate` | PASS, but its assertion is 45 fps rather than the claimed 60 fps |

Each manifest ID occurs exactly once as an `@claim:<id>` tag. The failure is the
gap between published wording and what those tagged tests actually assert.

## Clean local gates

| Check | Result |
| --- | --- |
| Candidate identity | PASS — clean checkout at `ae23b23` |
| `npm ci` | PASS — 61 packages, 0 vulnerabilities |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm test` | PASS — 4 Vitest tests and 26 Chromium tests |
| `npm run build` | PASS — `dist/` produced |
| `/opt/fleet/lib/verify-url.sh` on local `/` and `/demo` | PASS; no console errors |
| `/opt/fleet/lib/verify-url.sh` on live `/` and `/?demo=1` | PASS; no console errors |

The production build contains 33.55 KB JavaScript (11.78 KB gzip) and 23.28 KB
CSS (5.89 KB gzip). The mobile hero is 77,382 bytes.

## Independent game exercise

A fresh public browser context was played through the actual UI:

- Landing → one-click demo → active teaching board 3.
- The sample began with 1 move, 2 filled plots, and 3 dew.
- The remaining deterministic placements reached **The orchard is mirrored** at
  5 moves and 3 of 3 dew for `teaching-orchard-3-v1`.
- The centered pointer action **Plant board 4** worked, and board 3 appeared as
  complete in the archive.
- Replay reset the phase, moves, dew, filled plots, and used branch inventory.
- Three invalid placements reached **This orchard withered** with zero dew.
- Restart after loss restored playing state, 0 moves, 3 dew, no filled plots,
  and no used branches.
- A one-move run survived reload and reopened paused with its heading focused.
  Sound and calm-motion settings survived the same reload.
- Demo storage used only `demo:mirror-orchard:v1`. **Start for real** discarded
  it before opening teaching board 1.

Evidence: [win screen](verification-4-assets/live-demo-win-desktop.png),
[loss screen](verification-4-assets/live-demo-loss-desktop.png), and
[loss/recovery measurements](verification-4-assets/live-loss-recovery.json).

All advertised modes were exercised. The archive listed 40 boards and board 40
opened. The UTC daily board and `mist-fern` personal seed each reached a real win
screen through public controls, then replayed to 0 moves, 3 dew, and an empty
board. Daily and personal fingerprints remained stable after reload.

Seed recovery passed for invalid punctuation, with an announced error and focus
returned to the input. One-character and 48-character seeds worked; longer input
was capped at 48 characters. Evidence:
[boundary checks](verification-4-assets/live-boundaries.json).

Pointer and touch planting worked. Keyboard Arrow navigation, number selection,
`R` rotation, Enter and Space planting, `Z` undo, and Escape pause all worked.
At 390 px, pause-dialog focus wrapped in both directions and the focused action
had a 3 px amber outline. Every persistent target and board plot measured at
least 44 × 44 CSS px. Evidence:
[mobile input measurements](verification-4-assets/live-mobile-input.json).

## Accessibility and routes

Fresh live Axe scans found zero serious or critical violations on `/`, `/demo`,
`/archive`, `/daily`, `/seeds`, `/privacy`, `/terms`, and the real 404. The seven
application routes each had `lang="en"`, one `h1`, `main`, header navigation,
footer, skip link, route title, description, canonical URL, and no horizontal
overflow at 390 px. The 404 exception is the P2 finding above.

All 59 discovered same-origin links returned below 400, and the external Param
Factory link returned 200. Reduced-motion emulation changed active animation and
transition durations to 0.01 ms.

Machine evidence: [route and Axe audit](verification-4-assets/live-routes-axe.json).

## Deployment identity, privacy, and headers

The candidate production build and hosted artifact matched byte-for-byte:

| File | SHA-256 |
| --- | --- |
| `index.html` | `87e83c87191452454a123139c3d888b344b0394204d8f467a88469c9936a7384` |
| `assets/index-Bwed6F4F.js` | `d9378f14faab3e755b03f36d38853429b8ffd11979f142edf9c67258ad3a793e` |
| `assets/index-BOCviY0X.css` | `841ac68af9af231c2c96466a0d354b0b8670ca168cdb10636c7b7b8261e53635` |
| `sw.js` | `6112740e25cc90c7ae50540f7ad349f0c5a1efd2079d596a5fab1a991d61c12c` |

The manifest, hero, social image, robots file, sitemap, and 404 also matched.
Candidate `ae23b23` changes only verification documentation relative to deployed
implementation commit `b77730d`; the rebuilt application is the hosted one.

The observed landing/demo/play/archive/privacy flow made only same-origin
requests. No console error, page error, account, payment, analytics, advertising,
leaderboard, third-party script, or runtime AI request appeared. The application
is static and has no server-side or product-unlock endpoint, so a 429 allowance
test is not applicable. It has no sign-in, so Entra authority verification is
not applicable.

Browser-observed headers include a self-only CSP with `frame-ancestors 'none'`,
HSTS, `nosniff`, strict-origin referrer policy, and a restrictive permissions
policy. HTML and 404 responses use 30-second revalidation; hashed JS/CSS/fonts
and art use one-year immutable caching; `sw.js` uses `no-cache`.

## PWA and performance

The live service worker installed, controlled `/demo`, and completed an explicit
update with no waiting or installing worker. A fresh context held one versioned
`mirror-orchard-*` cache. Offline reload restored the paused sample, resumed the
playable board, and showed “You are offline. Saved boards remain playable.”
Evidence: [offline audit](verification-4-assets/live-offline.json).

At 390 × 844 under 4× CPU throttling, three warmed 170-frame samples each
measured 60.00 fps with no frame above 22.22 ms. The slowest independent board
highlight update was 3.10 ms.

Fresh mobile Lighthouse results were:

- Performance 95
- Accessibility 100
- Best Practices 100
- SEO 100
- FCP 1.2 s, LCP 1.6 s, CLS 0.062, TBT 230 ms
- Initial transfer 155 KiB

Machine evidence: [Lighthouse JSON](verification-4-assets/lighthouse-live.json).

## Defects by severity

| Severity | Count | Defect |
| --- | ---: | --- |
| P0 | 0 | — |
| P1 | 1 | Published claims exceed the inventory/tagged-test evidence |
| P2 | 1 | Real 404 lacks the common skeleton and required route metadata |
| P3 | 0 | — |

## Release decision

**FAIL.** Do not accept candidate `ae23b23`. Add or narrow claim entries and
tagged sandbox tests so every published promise is proved at its stated scope,
including the 60 fps number and advertised inputs. Bring the real 404 into the
required shared skeleton and metadata contract. Then rerun all 17 exact claim
commands and the live verification. Product source was not modified during this
verification.
