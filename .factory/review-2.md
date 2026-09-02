# Adversarial first-read review 2 — FAIL

Reviewed 2026-09-02 UTC against <https://mirror-orchard.sociobot.in> and
commit `fb918968f25c1bb2f9914443a3c4711dec0792f3`. This was a read-only product
review. No product code was changed.

## Verdict

**FAIL.** Two findings remain. Neither blocks play, but this work order permits
`PASS` only with zero findings. The one-click demo, all 19 declared claims,
the core game loop, mobile layout, privacy behavior, offline reload, routing,
and every finding from review 1 otherwise pass.

## Cold first read

Fresh Chromium contexts opened the live `/` route at 390 x 844 with touch and
at 1440 x 1000. These notes were recorded at scroll position zero.

| Question | Answer from the first screen |
| --- | --- |
| What does this do? | It teaches a symmetry puzzle in which planting a branch also plants its reflection. |
| Who is it for? | “Visual puzzle players who want practice boards before the daily challenge.” |
| What should I click first? | **Try it with sample data**. The adjacent sentence says it opens teaching board 3 with two boards complete. |

The headline is “Learn a symmetry puzzle at your pace.” The mobile first
screen contains the audience sentence, primary action, outcome sentence,
three plain facts, and the start of the board preview at y=723 px. Desktop
shows the complete board preview beside the copy. The first screen passes.

## Findings

### F-2-1 — MEDIUM — The skip link names the wrong destination on non-game routes

- **Exact quote / location:** “Skip to game” is the first focusable link on
  `/archive`, `/seeds`, `/privacy`, `/terms`, and the designed 404. Source:
  `src/main.ts` in `shell()` and `public/404.html`.
- **Why this fails:** The link targets `#main`, but those routes contain an
  archive, a form, legal information, or an error message rather than a game.
  A keyboard or screen-reader visitor is told that the link goes somewhere it
  does not. The same label is currently asserted in the 404 browser test, so
  the test preserves the defect.
- **Concrete fix:** Change the shared and static-404 labels to **Skip to main
  content**. Update the 404 assertion and add a route-wide check that every
  skip link has this label and moves focus to `main#main`.

### F-2-2 — MINOR — The sitemap omits every playable teaching-board route

- **Exact location:** Live `/sitemap.xml` and `public/sitemap.xml` list the
  seven top-level routes but omit `/play/archive/1` through
  `/play/archive/40`. Those 40 routes are separately declared as real routes
  in `public/staticwebapp.config.json` and each returns HTTP 200.
- **Why this fails:** The site-structure contract requires the sitemap to list
  every finite route. Search and route-discovery tooling cannot discover any
  individual teaching board from the sitemap.
- **Concrete fix:** Add all 40 canonical archive-board URLs to
  `public/sitemap.xml`. Add a test that compares sitemap locations with the
  finite app routes in `staticwebapp.config.json`, excluding only the 404 and
  unbounded personal-seed query URLs.

## Copy audit

Counts use whitespace-separated words. Hyphenated terms and number ranges
count as one word. Headings, controls, facts, and fragments are included so
their usefulness can be checked; code blocks and aria-hidden arrows are not
sentences. No item exceeds 22 words. No banned marketing adjective, empty
slogan, inconsistent term, or non-result primary action was found.

### Landing page

| Copy | Words | Result |
| --- | ---: | --- |
| 40 teaching boards · one daily puzzle | 7 | Pass |
| Learn a symmetry puzzle at your pace | 7 | Pass |
| For visual puzzle players who want practice boards before the daily challenge. | 12 | Pass |
| Try it with sample data | 5 | Pass: result-naming action |
| Opens teaching board 3 with two boards complete. | 8 | Pass: `demo-sample-state` |
| 40 teaching boards | 3 | Pass |
| Works offline after your first visit | 6 | Pass: `offline-reload` |
| Free. | 1 | Pass: `free-no-account` |
| No account. | 2 | Pass: `free-no-account` |
| Teaching board 1 | 3 | Pass |
| 3 branches | 2 | Pass |
| Choose a branch. | 3 | Pass |
| Plant its reflected pair. | 4 | Pass |
| Choose a puzzle | 3 | Pass |
| Every teaching board stays open | 5 | Pass: `archive-open` |
| Start with a teaching board, play today’s puzzle, or enter a seed. | 12 | Pass |
| Teaching archive | 2 | Pass |
| 40 ordered boards | 3 | Pass: `archive-open` |
| Daily puzzle | 2 | Pass |
| The same seed for everyone today | 6 | Pass: `daily-seed` |
| Personal seeds | 2 | Pass |
| Replay a seed using letters, numbers, spaces, or dashes | 9 | Pass |
| How it works | 3 | Pass |
| Fill the glowing soil in three steps | 7 | Pass |
| Choose a branch | 3 | Pass |
| The tray shows each branch you can use once. | 9 | Pass |
| Plant one side | 3 | Pass |
| Its reflected branch grows across the center channel. | 8 | Pass |
| Fill the pattern | 3 | Pass |
| Use every branch without crossing the glowing edge. | 8 | Pass |
| Privacy and storage | 3 | Pass |
| Your play stays on this device | 6 | Pass: `local-only` |
| The game stores completed boards, open runs, settings, and recent seeds in your browser. | 14 | Pass: persistence claims |
| There are no accounts, ads, leaderboards, payments, or third-party scripts. | 10 | Pass: privacy and account claims |
| Mirror Orchard. | 2 | Pass |
| Plant reflected branch puzzles at your pace. | 7 | Pass |
| Version 1.0 · Landscape generated for this game with the factory image model. | 13 | Pass |

Navigation labels are “Mirror Orchard” (2), “Archive” (1), “Daily” (1),
“Seeds” (1), and “Demo” (1). Footer links are “Privacy” (1), “Terms” (1),
and “Built by Param Factory” (4). They name destinations rather than actions
and are appropriate for navigation. The global skip label is the separate
F-2-1 finding.

### README

| Copy | Words | Result |
| --- | ---: | --- |
| Mirror Orchard | 2 | Pass: title |
| Grow mirrored orchard patterns across 40 teaching boards, a daily puzzle, and replayable seeds. | 14 | Pass |
| Mirror Orchard is a free browser puzzle for players who want time to learn a visual rule. | 17 | Pass |
| Choose a branch and plant it on either side of the board. | 12 | Pass |
| Its reflection grows at the same time. | 7 | Pass |
| Fill every glowing plot before three invalid placements use your dew. | 11 | Pass |
| Every teaching board stays open. | 5 | Pass: `archive-open` |
| The daily puzzle can be replayed, and the same personal seed always makes the same board. | 16 | Pass: daily and seed claims |
| The tested sample round reaches its end screen in under five minutes. | 12 | Pass: `complete-round` |
| Rounds have no timer. | 4 | Pass: `no-timer` |
| What is included | 3 | Pass: heading |
| 40 ordered teaching boards with buds, twigs, corners, and glass stones | 11 | Pass |
| One stable UTC-dated daily board | 5 | Pass |
| Reproducible boards from any 1–48 character seed using letters, numbers, spaces, or dashes | 13 | Pass |
| Pointer, touch, and keyboard controls | 5 | Pass: `input-paths` |
| Persistent runs, completed boards, sound, and calm-motion settings | 8 | Pass: persistence claims |
| Offline reload after the first visit | 6 | Pass: `offline-reload` |
| A separate demo storage area that never reads or writes real progress | 12 | Pass: `demo-isolated` |
| Progress stays in browser `localStorage`. | 5 | Pass: `local-only` |
| The game has no accounts, payments, analytics, or third-party runtime requests. | 11 | Pass: privacy and account claims |
| Controls | 1 | Pass: heading |
| Pointer or touch: choose a branch, rotate it, then choose a plot. | 12 | Pass |
| Keyboard: arrows move between plots; 1–9 choose a branch; `R` rotates; Enter or Space plants; `Z` undoes; Escape pauses. | 19 | Pass |
| A bad placement spends one dew drop. | 7 | Pass |
| Losing all three ends the run. | 6 | Pass: `three-error-loss` |
| Restarting restores the full tray. | 5 | Pass: `restart-reset` |
| Develop | 1 | Pass: heading |
| Requires Node.js 22 or a compatible current release. | 8 | Pass |
| Open `http://localhost:5173`. | 2 | Pass |
| Add `?demo=1` or open `/demo` for the isolated sample. | 9 | Pass |
| Test and build | 3 | Pass: heading |
| `npm test` runs deterministic core tests, creates the production build, and runs Chromium claim and accessibility tests. | 17 | Pass: developer context |
| The exact deployment command is `npm run build`. | 8 | Pass |
| Static output lands in `dist/`, with `dist/index.html` at its root. | 10 | Pass |
| The browser suite uses Playwright 1.58.2. | 6 | Pass |
| In the factory worker, it reads the preinstalled browsers from `PLAYWRIGHT_BROWSERS_PATH`. | 11 | Pass: developer context |
| Routes | 1 | Pass: heading |
| `/` — landing page and game preview | 7 | Pass |
| `/demo` — isolated, prefilled sample | 5 | Pass |
| `/archive` — all 40 teaching boards | 6 | Pass |
| `/daily` — today’s deterministic puzzle | 5 | Pass: developer route description |
| `/seeds` — personal seed entry and recent seeds | 8 | Pass |
| `/seeds?seed=mint-window` — a reproducible personal-seed link | 6 | Pass |
| `/privacy` and `/terms` — storage and use terms | 8 | Pass |
| Product records | 2 | Pass: heading |
| Brief | 1 | Pass: link label |
| Visual system and asset provenance | 5 | Pass: link label |
| Demo contract | 2 | Pass: link label |
| Tested claims | 2 | Pass: link label |
| Copy audit | 2 | Pass: link label |
| Build handoff | 2 | Pass: link label |
| License | 1 | Pass: heading |
| MIT. | 1 | Pass |
| See LICENSE. | 2 | Pass |

The live and demo URL labels are descriptive, and the shell commands are
executable instructions rather than prose claims. Technical names occur only
where they identify the reset standard, storage API, tools, files, or routes.

### Terminology

| Concept | Term used |
| --- | --- |
| Ordered learning puzzle | teaching board |
| Placeable inventory item | branch |
| Symmetric opposite | reflection |
| Center vertical line | mirror channel |
| Mistake allowance | dew |
| Deterministic input | seed |
| Stored play state | progress |
| Isolated sample state | demo |

## Demo and sandbox behavior

- The landing action enters `/demo` in one click and immediately shows **Try
  teaching board 3**, one realistic planted move, 3 dew, and 4 remaining
  branches. Boards 1 and 2 are marked complete in the demo archive.
- The persistent banner reads “Demo — sample data, nothing is saved” and
  exposes **Reset demo** and **Start for real**.
- With a real `mirror-orchard:v1` record pre-seeded, demo play only changed
  `demo:mirror-orchard:v1`. Reset restored the sample. **Start for real**
  removed the demo key and left the real record byte-for-byte unchanged.
- The live request log contained only
  `https://mirror-orchard.sociobot.in`. No ads, analytics, API calls, or
  third-party runtime requests appeared.
- After one online visit, the live service worker controlled `/demo`.
  Offline reload displayed the saved-run dialog and “You are offline. Saved
  boards remain playable,” then resumed board 3.

The demo and sandbox requirements pass.

## Claims audit

`.factory/claims.json` contains 19 entries and the browser suite contains
exactly one `@claim:<id>` tag for each. Every exact command was run separately
from a clean clone at the reviewed commit.

| Claim | Result | Observable evidence |
| --- | --- | --- |
| `archive-open` | PASS | 40 entries rendered and board 40 opened in demo. |
| `complete-round` | PASS | Board 3 reached its win screen through public controls in under five minutes. |
| `no-timer` | PASS | Play continued after ten simulated minutes. |
| `completion-persist` | PASS | Completed board 3 appeared complete in the archive. |
| `restart-reset` | PASS | Restart cleared moves and filled plots. |
| `settings-persist` | PASS | Sound and calm-motion settings survived reload. |
| `seed-reproducible` | PASS | `mist-fern` produced the same board fingerprint after reload. |
| `daily-seed` | PASS | Reload preserved the board fingerprint and UTC date seed. |
| `daily-replay` | PASS | The daily board reached its win screen and replayed with a clean state. |
| `local-only` | PASS | Demo play emitted only same-origin requests. |
| `privacy-no-tracking` | PASS | Play and privacy navigation emitted no ad, analytics, or leaderboard request. |
| `demo-isolated` | PASS | Only the demo key was used, then discarded on **Start for real**. |
| `demo-sample-state` | PASS | Direct demo showed board 3, boards 1–2 complete, and reset the sample. |
| `free-no-account` | PASS | Demo play required no login, password, checkout, or payment. |
| `offline-reload` | PASS | A dedicated context reloaded and resumed `/demo` offline. |
| `run-recovery` | PASS | An unfinished run reopened paused with its move preserved. |
| `three-error-loss` | PASS | Three invalid placements reached the loss screen. |
| `input-paths` | PASS | Pointer, touch, arrows, 1–9, R, Enter, Space, Z, and Escape changed observable state. |
| `frame-rate` | PASS | Five 4x-throttled mobile samples were 59.88 FPS; median 59.88 FPS against 50 FPS. |

No failing or untested declared claim was found. The landing, README, game,
privacy, and demo claim-like copy maps to the declared behavior above; no
unlisted product claim was found.

## History verification

`review-1.md`, `polish-1.md`, and the complete pre-review handoff were read. The
live index, JS, and CSS byte-match the clean build, so live and source checks
refer to the same product code.

| Earlier finding | Independent result |
| --- | --- |
| F-1-1: Back did not focus or announce `/` | Fixed. `/` → `/archive` → Back focused the landing h1 and announced “Learn a symmetry puzzle at your pace page.” Source focuses every route h1. |
| F-1-2: “Every board” / “No puzzle expires” overclaimed | Fixed. Live copy now says “Every teaching board stays open”; the expiration sentence is absent. |
| F-1-3: “any word or phrase” contradicted validation | Fixed. Landing and form both name letters, numbers, spaces, or dashes. Live `bad!` produced `patternMismatch` and the matching recovery message without console errors. |
| F-1-4: demo starting state was unlisted | Fixed. `demo-sample-state` exists exactly once and passed. |
| F-1-5: mood labels did not name sections | Fixed. Live labels are “Choose a puzzle” and “Privacy and storage.” |
| Claim commands did not build first | Fixed. All 19 exact commands built and ran independently from the clean clone. |
| Dialog focus escaped | Fixed. Live pause and win dialogs focused their headings, declared modal state, hid covered game content, and local focus-trap tests passed. |
| Mobile controls were smaller than 44 px | Fixed. Live persistent controls measured at least 44 x 44 px. |
| Published promises were missing from the inventory | Fixed for current copy. There are 19 declarations and 19 unique tags; no current unlisted claim was found. |
| Invalid seed validation logged a Chromium error | Fixed. Live `bad!` produced the intended validation state and zero console/page errors; valid seed navigation remains covered locally. |
| Unknown or malformed routes returned soft 404s | Fixed. Missing, out-of-range archive, and retired seed paths returned HTTP 404 with the designed page. |
| Settings and frame-rate tests were too narrow | Fixed. Both settings persist; live 390 x 844 rendering under 4x CPU throttling measured 59.88 FPS median. |
| The win action was pointer-obstructed | Fixed. A center-coordinate live pointer click on **Plant board 4** opened `/demo?board=4`. |
| Hosted offline reload failed | Fixed. The current live service worker controlled the page and restored board 3 offline. |
| The mobile first screen hid the product | Fixed. The live board preview begins at y=723 in the 844 px viewport. |

No earlier finding regressed. F-2-1 and F-2-2 are newly identified.

## Structure, accessibility, and visual identity

- `/`, `/demo`, `/archive`, `/daily`, `/seeds`, `/privacy`, `/terms`, and
  `/play/archive/1` each return 200 with one h1, one main landmark,
  route-specific title, description, canonical, OG data, favicon, and the
  shared header/footer. Titles are at most 40 characters and descriptions at
  most 103 characters in this sample.
- A 390 px Playwright Axe scan found zero violations on those eight routes;
  the designed 404 also had zero violations and returned HTTP 404. The
  supplied `verify-url.sh` passed the live home page with no console errors,
  missing alt text, or unnamed buttons.
- All 61 discovered links returned 200, including the marked external factory
  link. Archive boundaries 0 and 41, a malformed archive path, the retired
  seed path, and an unknown path returned 404 as intended.
- Security headers include a self-only CSP with `frame-ancestors 'none'`,
  HSTS, `nosniff`, strict-origin referrer policy, and disabled camera,
  microphone, geolocation, and payment permissions.
- The live first screen and game use the documented glass-orchard palette,
  asymmetric landscape, serif/sans pairing, etched board, and reflection
  motion. This is distinct from a generic SaaS template. Reduced-motion,
  focus, touch-target, contrast, and overflow checks pass.
- F-2-1 is the remaining route-shell copy defect. F-2-2 is the remaining
  metadata-discovery defect.

## Local quality gates

From the clean clone:

- `npm ci`: PASS, 61 packages, 0 vulnerabilities.
- All 19 exact claim commands: PASS independently.
- `npm test`: PASS, 4 unit tests and 29 Chromium tests.
- `npm run build`: PASS; `dist/` produced.
- JavaScript: 33.56 KB raw / 11.79 KB gzip.
- CSS: 23.30 KB raw / 5.90 KB gzip.

The live `index.html`, JavaScript, and CSS SHA-256 hashes match the clean
build.

## Missed leverage

No missing AI, import/export, or sync feature is implied by the brief. This is
an account-free, local-first symmetry game with an archive, daily board, and
replayable personal seeds. AI would be decorative, and sync would conflict
with the stated local-only scope unless the product changed its account and
privacy model.

## What would make this perfect

Rename the shared and static-404 skip links to **Skip to main content**, test
their label and focus behavior on every route, and add the 40 finite archive
board URLs to the sitemap with a route-to-sitemap parity test. Then rerun the
copy, structure, link, Axe, claim, offline, and clean-build checks. No other
product gap was found in this round.
