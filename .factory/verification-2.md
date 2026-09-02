# Independent verification 2 — FAIL

Verified 2026-09-01–02 UTC.

- Candidate: `44e9c1bee8b3c617b903ccde5df8da92a066a239`
- Live URL: <https://mirror-orchard.sociobot.in>
- Work order: `mirror-orchard-verify-2`
- Verdict: **FAIL**

The candidate is not releasable. One required claim test fails consistently,
the same obstruction affects the live win screen, and the deployed service
worker cannot install. The published offline promise is therefore false in
production. The 390 px landing viewport also puts the game preview below the
first screen.

## Release-blocking findings

### P0 — a required claim test fails and win actions are obstructed

After a clean `npm ci`, 15 of the 16 exact commands in
`.factory/claims.json` passed. This command failed on its initial run and a
dedicated rerun:

```text
npm run test:e2e -- --grep @claim:completion-persist
Test timeout of 30000ms exceeded.
locator.click: ... <div ... class="game-overlay win-overlay"> intercepts pointer events
```

`npm test` also exited 1 with the same failure (4 unit tests passed; 21 of 22
browser tests passed). The failing control is the visible “Plant board 4” link
on the win screen. Independent live Playwright testing reproduced the timeout
even when the link was scoped to the dialog.

The visual center line is `.win-overlay::before`. It runs over the center of
both full-width win controls and accepts pointer events. A keyboard workaround
(focus the link, then press Enter) works and confirms that board 3 is recorded
as complete, but the primary end-screen action is not reliably clickable or
tappable where users normally press it. This violates both the claims gate and
the required end-screen replay/next-board flow.

### P0 — the deployed offline claim is false

The local `@claim:offline-reload` test passes against Vite preview, but the live
service worker never installs:

```text
navigator.serviceWorker.getRegistrations() -> []
navigator.serviceWorker.controller -> null
worker states -> installing, redundant
offline reload -> net::ERR_INTERNET_DISCONNECTED
```

`dist/sw.js` precaches `/staticwebapp.config.json`. Azure Static Web Apps
consumes that deployment file and the live URL returns HTTP 404. The worker's
single `cache.addAll()` therefore rejects with `TypeError: ... Request failed`,
leaving only a partial cache and no active registration. The landing page and
README both promise offline reload, so this is a production claim failure.

### P1 — the 390 px first screen does not show the game

At 390 × 844 the headline, audience sentence, demo action, and three facts are
clear, but the actual board preview begins at CSS y=867.06 and does not
intersect the first viewport. The captured phone screen contains only the
header, hero copy, action, and facts. This fails the browser-game requirement
that the captured first screen show the game itself.

## Other finding

### P2 — malformed seed deep links are soft 404s

`/play/seed/%F0%9F%9A%AB%2Fbad_seed!` renders the designed “Page not found”
screen but responds HTTP 200 because `/play/seed/*` is a valid SPA rewrite.
An ordinary unknown route correctly responds 404. Invalid seed URLs should
also have a real 404 response or redirect to a valid input-recovery route.

## Mandatory claim sweep

Every listed command was run individually from the candidate after `npm ci`.

| Claim | Result |
| --- | --- |
| `archive-open` | PASS |
| `complete-round` | PASS |
| `completion-persist` | **FAIL** — win overlay intercepts “Plant board 4” |
| `restart-reset` | PASS |
| `settings-persist` | PASS |
| `seed-reproducible` | PASS |
| `daily-seed` | PASS |
| `local-only` | PASS |
| `privacy-no-tracking` | PASS |
| `demo-isolated` | PASS |
| `free-no-account` | PASS |
| `offline-reload` | PASS locally; **fails on the deployed product** |
| `run-recovery` | PASS |
| `three-error-loss` | PASS |
| `input-paths` | PASS |
| `frame-rate` | PASS |

## First-read and demo checks

The desktop first-read content gate passes:

- What it does: “Learn a symmetry puzzle at your pace.”
- Who it is for: visual puzzle players who want practice before the daily
  challenge.
- What to click: “Try it with sample data,” followed by a plain description of
  what opens.
- The action opens `/demo` in one click with teaching board 3 already active,
  one branch planted, and the persistent disposable-data banner.
- The desktop first screen includes the live board preview. The 390 px failure
  is recorded separately above.

Demo storage used `demo:mirror-orchard:v1`. “Start for real” removed that key,
kept `mirror-orchard:v1`, and opened the real board. No account or setup was
required.

## Independent game run

A deterministic run was played on the live deployment through public controls:

- Landing → one-click demo → active teaching board 3.
- The sample began at 1 move, 2 filled plots, and 3 dew.
- The remaining supplied placements reached the real win dialog at 5 moves,
  3 of 3 dew, seed `teaching-orchard-3-v1`.
- The next-board pointer action failed as described above. Enter activated it,
  after which archive board 3 displayed `Complete`.
- Three invalid placements reached the real loss dialog with 0 dew.
- Restart after loss restored playing state, 0 moves, 3 dew, an empty board,
  and an unused tray.
- A one-move run survived reload and reopened paused with the same state.
- A real (non-demo) board 1 win persisted under `mirror-orchard:v1` and appeared
  complete in the archive.

All advertised input paths were exercised. Pointer and touch selected and
planted branches. Arrows moved board focus; number keys selected a branch; `R`
rotated; Enter and Space planted; `Z` undid; Escape paused. The pause dialog
focused its heading and cycled only between Resume and Restart. The visible
focus ring was a 3 px amber outline.

Archive, daily, and personal-seed modes opened successfully. The archive had
40 entries and board 40 opened. At the time of testing, daily seed
`daily:2026-09-01:v1` retained the same fingerprint after reload. Personal seed
`mist-fern` also retained its fingerprint. Empty and punctuation-bearing seeds
showed an announced error; 1- and 48-character boundaries worked; input longer
than 48 characters was capped at 48.

## Build and static quality gates

| Check | Result |
| --- | --- |
| `npm ci` | PASS; 61 packages, 0 vulnerabilities |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS (delegates to typecheck) |
| `npm test` | **FAIL**; 4/4 unit and 21/22 browser tests passed |
| `npm run build` | PASS; `dist/` produced |
| `/opt/fleet/lib/verify-url.sh` on live `/` and `/demo` | PASS |
| Axe on 8 public routes at 390 × 844 | 0 serious/critical findings |
| Route overflow at 390 × 844 | 0 px on all tested routes |
| Internal/external link crawl | PASS; all discovered links returned 200 |

Every tested route had its own title, one h1, and a main landmark. The designed
unknown-route page returned HTTP 404. Reduced-motion emulation reduced maximum
animation and transition durations to 0.01 ms. Visible persistent controls at
390 px all met 44 × 44 CSS pixels.

## Deployment identity, privacy, and headers

The deployment matches the candidate production build: `index.html`, the
hashed JavaScript, the hashed CSS, and `sw.js` compare byte-for-byte. The JS
SHA-256 is
`0610c5abe2469e1dd68ac8c9c71d62db623e876fe706174f4842476173300507`;
the CSS SHA-256 is
`8105c7dd91023b131996f6da90b265b7b846bdb235bb14fa717560daf64e0dfc`.

A full landing/demo/play/archive run made 16 observed page requests, all to
`https://mirror-orchard.sociobot.in`. There were no console errors, page
errors, analytics, advertising, or third-party scripts.

Browser-observed document headers included a self-only CSP with
`frame-ancestors 'none'`, HSTS, `nosniff`, strict-origin referrer policy, and a
restricted permissions policy. HTML uses 30-second revalidation, hashed JS/CSS
use one-year immutable caching, and `sw.js` uses `no-cache`.

This is a static product with no server-side or unlock endpoints, so request
allowance/429 testing does not apply. It has no sign-in, so Entra authority
testing does not apply.

## Performance

- Production JS: 33.42 KB raw / 11.76 KB gzip.
- Production CSS: 23.14 KB raw / 5.86 KB gzip.
- Mobile hero: 77.38 KB transferred; initially used Latin fonts total 61.46 KB.
- At 390 × 844 with 4× CPU throttling, 120 board updates had a 12.6 ms worst
  warmed-up cost and `requestAnimationFrame` measured 60.00 fps.
- Three clean Lighthouse mobile runs scored 94, 90, and 95 performance
  (median 94); accessibility, best practices, and SEO were 100. The 94 run
  measured FCP 1.2 s, LCP 1.7 s, CLS 0.057, and TBT 270 ms.

## Release decision

**FAIL.** Do not promote this candidate. Fix the win overlay hit-testing,
remove deployment-only files from the service-worker precache (and test the
actual live host offline), and bring the game preview into the 390 px first
viewport. Retest every claim command and the deployed PWA afterward. Product
source was not modified during this verification.
