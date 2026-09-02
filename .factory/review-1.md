# Adversarial first-read review 1 — FAIL

Reviewed 2026-09-02 UTC against `https://mirror-orchard.sociobot.in` and
commit `fc2ad4ab84de9e827afec6186e8f38a34cb29a50`. This was a read-only product
review; no product source was changed.

## Verdict

**FAIL.** Five findings remain, including a blocking route-change accessibility
failure. The first screen, demo, PWA, and declared claim tests are otherwise
substantially working. `PASS` is not possible while a browser Back navigation
can leave a keyboard or screen-reader visitor without a route focus target,
and while the landing copy makes promises the product does not make true or
does not test.

## Cold first read

Fresh Chromium contexts were opened at 390 x 844 (touch) and 1440 x 1000
(desktop), before scrolling.

| Question | Answer from the first screen |
| --- | --- |
| What does this do? | It is a symmetry puzzle: select a branch and plant its reflected pair. |
| Who is it for? | “Visual puzzle players who want practice boards before the daily challenge.” |
| What should I click first? | **Try it with sample data**; adjacent copy says it opens teaching board 3 with two boards complete. |

The headline is “Learn a symmetry puzzle at your pace” (7 words), the audience
sentence is 12 words, and the primary action is visible and names its result.
The live board preview begins within the initial mobile viewport. This first
read passes on both tested sizes.

## Findings

### F-1-1 — BLOCKING — Back navigation does not move focus to the landing route or announce it

- **Location / evidence:** From `/`, select the header **Archive** link, then
  use the browser Back button. On the live site the archive route focuses
  `H1: Learn with 40 teaching boards`, but the return to `/` leaves
  `document.activeElement` as `BODY`. The polite live region is empty after
  both route changes. Source confirms the cause in `src/main.ts`: `render()`
  focuses an `h1` only when `path !== '/'`, and it resets `announcement` to an
  empty string before rendering.
- **Why this fails:** A keyboard or screen-reader visitor using Back receives
  neither focus at the new page heading nor a spoken route change. This breaks
  the required deep-link/back/focus/announcement route contract.
- **Concrete fix:** Give the landing `h1` `tabindex="-1"`; after every
  `navigate()` and `popstate` render, focus the current `h1` (including `/`)
  and populate the `aria-live="polite"` region with the page heading or a
  concise “<heading> page” message. Add a browser test for header navigation
  followed by Back to `/`, asserting landing-h1 focus and non-empty live text.

### F-1-2 — HIGH — “Every board stays open” and “No puzzle expires” overstate what the daily route provides

- **Location / quote:** Landing play-options heading: “Every board stays
  open”; paragraph: “Start with a short lesson, replay today’s board, or enter
  a seed. **No puzzle expires.**”
- **Why this misleads:** The implementation creates only the current UTC daily
  board (`new Date().toISOString().slice(0, 10)`) and exposes no past-daily
  archive or date picker. The promise reasonably includes the daily board,
  while the actual always-open set is the 40 teaching boards. It is also an
  unlisted claim: `.factory/claims.json` has no test proving that no puzzle
  expires.
- **Concrete fix:** Either add an accessible daily-history/archive route and a
  claim test for past-date replay, or use the accurate copy: heading “Every
  teaching board stays open”; body “Start with a teaching board, play today’s
  puzzle, or enter a seed.” Remove “No puzzle expires.”

### F-1-3 — MEDIUM — Personal-seed copy contradicts the accepted input

- **Location / quote:** Landing route strip: “Replay any word or phrase.” The
  seed form says “Use 1–48 letters, numbers, spaces, or dashes.”
- **Why this misleads:** “Any” includes punctuation and emoji, but the form
  rejects them. A first-time player can follow the landing promise and receive
  an input error.
- **Concrete fix:** Replace the strip text with “Replay a seed using letters,
  numbers, spaces, or dashes.” Keep the existing validation test and add this
  exact copy expectation if copy is made part of the claim surface.

### F-1-4 — MEDIUM — The demo-start promise is not represented in the claims inventory

- **Location / quote:** Beside the first action: “Opens teaching board 3 with
  two boards complete.”
- **Why this matters:** This is a concrete, visitor-relevant demo promise.
  The declared `demo-isolated` test checks storage isolation, while
  `archive-open` checks that board 40 opens; neither asserts that the first
  demo view is board 3 with boards 1 and 2 complete. This repeats the earlier
  `verification.md` P1 finding that the claims inventory did not cover all
  published promises.
- **Concrete fix:** Add a `demo-sample-state` entry to `.factory/claims.json`
  and a clean `/demo` Playwright test asserting h1 “Try teaching board 3” and
  archive entries 1 and 2 marked complete. Alternatively, remove the
  untested “with two boards complete” phrase.

### F-1-5 — MINOR — Two landing labels are mood labels rather than section names

- **Location / quotes:** “Choose your pace” above the play-options section;
  “Clear limits” above the privacy section.
- **Why this fails the copy contract:** Neither label names the content heard
  by a screen-reader user or helps a cold visitor scan the page. Both could
  appear unchanged on an unrelated game.
- **Concrete fix:** Change them to “Choose a puzzle” and “Privacy and
  storage,” respectively, or delete the eyebrow labels and retain the useful
  `h2` headings.

## Copy audit

Counts use whitespace-separated words; headings and short factual labels are
included because the plain-words review requires them to make sense while
scanning. Navigation labels, version number, and arrow-only decoration are
not sentences. No line exceeds 22 words. The flags below correspond to
F-1-2 through F-1-5; no banned marketing adjectives were found.

### Landing page

| Copy | Words | Result |
| --- | ---: | --- |
| 40 teaching boards · one daily puzzle | 7 | — |
| Learn a symmetry puzzle at your pace | 7 | — |
| For visual puzzle players who want practice boards before the daily challenge. | 12 | — |
| Try it with sample data | 6 | — |
| Opens teaching board 3 with two boards complete. | 8 | F-1-4 |
| 40 teaching boards | 3 | — |
| Works offline after your first visit | 6 | — |
| Free. No account. | 3 | — |
| Teaching board 1 | 3 | — |
| 3 branches | 2 | — |
| Choose a branch. Plant its reflected pair. | 7 | — |
| Choose your pace | 3 | F-1-5 |
| Every board stays open | 5 | F-1-2 |
| Start with a short lesson, replay today’s board, or enter a seed. | 12 | — |
| No puzzle expires. | 3 | F-1-2 |
| Teaching archive | 2 | — |
| 40 ordered boards | 3 | — |
| Daily puzzle | 2 | — |
| The same seed for everyone today | 6 | — |
| Personal seeds | 2 | — |
| Replay any word or phrase | 5 | F-1-3 |
| How it works | 3 | — |
| Fill the glowing soil in three steps | 7 | — |
| Choose a branch | 3 | — |
| The tray shows each branch you can use once. | 9 | — |
| Plant one side | 3 | — |
| Its reflected branch grows across the center channel. | 8 | — |
| Fill the pattern | 3 | — |
| Use every branch without crossing the glowing edge. | 8 | — |
| Clear limits | 2 | F-1-5 |
| Your play stays on this device | 6 | — |
| The game stores completed boards, open runs, settings, and recent seeds in your browser. | 14 | — |
| There are no accounts, ads, leaderboards, payments, or third-party scripts. | 10 | — |
| Mirror Orchard. Plant reflected branch puzzles at your pace. | 8 | — |
| Version 1.0 · Landscape generated for this game with the factory image model. | 11 | — |

Terminology is otherwise consistent: **teaching board**, **branch**,
**reflection**, **mirror channel**, **dew**, **seed**, **progress**, and
**demo** each retain one meaning.

### README

| Copy | Words | Result |
| --- | ---: | --- |
| Grow mirrored orchard patterns across 40 teaching boards, a daily puzzle, and replayable seeds. | 13 | — |
| Mirror Orchard is a free browser puzzle for players who want time to learn a visual rule. | 17 | — |
| Choose a branch and plant it on either side of the board. | 12 | — |
| Its reflection grows at the same time. | 6 | — |
| Fill every glowing plot before three invalid placements use your dew. | 10 | — |
| Every teaching board stays open. | 5 | — |
| The daily puzzle can be replayed, and the same personal seed always makes the same board. | 15 | — |
| Intended session length is under five minutes per round. | 9 | — |
| 40 ordered teaching boards with buds, twigs, corners, and glass stones | 10 | — |
| One stable UTC-dated daily board | 6 | — |
| Reproducible boards from any 1–48 character seed using letters, numbers, spaces, or dashes | 13 | — |
| Pointer, touch, and keyboard controls | 5 | — |
| Persistent runs, completed boards, sound, and calm-motion settings | 8 | — |
| Offline reload after the first visit | 5 | — |
| A separate demo storage area that never reads or writes real progress | 12 | — |
| Progress stays in browser `localStorage`. | 5 | — |
| The game has no accounts, payments, analytics, or third-party runtime requests. | 11 | — |
| Pointer or touch: choose a branch, rotate it, then choose a plot. | 11 | — |
| Keyboard: arrows move between plots; 1–9 choose a branch; R rotates; Enter or Space plants; Z undoes; Escape pauses. | 18 | — |
| A bad placement spends one dew drop. | 7 | — |
| Losing all three ends the run. | 6 | — |
| Restarting restores the full tray. | 5 | — |
| Requires Node.js 22 or a compatible current release. | 9 | — |
| Open `http://localhost:5173`. | 2 | — |
| Add `?demo=1` or open `/demo` for the isolated sample. | 9 | — |
| `npm test` runs deterministic core tests, creates the production build, and runs Chromium claim and accessibility tests. | 16 | — |
| The exact deployment command is `npm run build`. | 8 | — |
| Static output lands in `dist/`, with `dist/index.html` at its root. | 9 | — |
| The browser suite uses Playwright 1.58.2. | 6 | — |
| In the factory worker, it reads the preinstalled browsers from `PLAYWRIGHT_BROWSERS_PATH`. | 10 | — |

README headings are descriptive. Technical terms such as `localStorage`,
Chromium, and Playwright occur in the developer-operation sections where they
name concrete commands or storage, rather than serving as marketing jargon.

## Demo, privacy, and sandbox checks

- The first action opened `/demo` in one click to **Try teaching board 3**.
  The persistent “Demo — sample data, nothing is saved” banner, **Reset demo**,
  and **Start for real** were visible.
- In a fresh context with pre-seeded real progress, demo used only
  `demo:mirror-orchard:v1`; resetting restored the sample state (3 dew, 1
  move, 4 branches); leaving for `/play/archive/1` removed the demo key and
  retained the real key and its completed-board data.
- After a normal hosted `/demo` visit, the service worker controlled the page.
  With the context offline, reload reopened teaching board 3 and showed “You
  are offline. Saved boards remain playable.”
- The browser request log across cold landing, demo, offline flow, and
  navigation contained only `https://mirror-orchard.sociobot.in`; no console
  errors were observed. This supports the listed local-only and no-tracking
  claims.

## Claims and local verification

`.factory/claims.json` contains 16 declared claims. From a detached clean
worktree at the reviewed commit, after `npm ci`, each exact listed command was
run independently. All 16 passed: `archive-open`, `complete-round`,
`completion-persist`, `restart-reset`, `settings-persist`,
`seed-reproducible`, `daily-seed`, `local-only`, `privacy-no-tracking`,
`demo-isolated`, `free-no-account`, `offline-reload`, `run-recovery`,
`three-error-loss`, `input-paths`, and `frame-rate`.

`npm run build` also passed and produced `dist/` (33.46 KB raw / 11.77 KB gzip
JS, 23.28 KB raw / 5.89 KB gzip CSS). The reviewed claim suite includes the
browser-game demo flow, touch/keyboard input, PWA offline reload, request-log
privacy checks, and 390 px rendering check. F-1-2 and F-1-4 remain unlisted
published promises despite the passing declared inventory.

## History check

No earlier `.factory/review-*.md` or `.factory/polish-*.md` files exist. I
read `verification.md`, `verification-2.md`, `verification-3.md`, and the
handoff. The earlier findings were checked live and in code:

| Earlier finding | Current result |
| --- | --- |
| Clean-clone claim commands did not build first | Fixed: Playwright now runs `npm run build && npm run preview`; all exact commands passed. |
| Dialog focus escaped; mobile targets were too small | Fixed: current dialog-focus and 44 px tests pass. |
| Seed validation contradicted its instructions; unknown routes were soft 404s | Fixed: punctuation seed validation is tested; `/missing-page` and `/play/seed/bad` return HTTP 404. |
| Claim inventory omitted published promises | Not fully fixed: F-1-4 repeats this finding for the demo-start promise; F-1-2 is another unlisted landing promise. |
| Win action was pointer-obstructed | Fixed: `completion-persist` passed using a pointer click. |
| Hosted offline reload failed | Fixed: hosted service-worker offline reload passed in this review. |
| 390 px landing did not show the game | Fixed: the board preview intersects the initial 390 x 844 viewport. |
| Malformed seed deep links were soft 404s | Fixed: the live malformed seed URL returns HTTP 404. |

The prior PASS statement that back/forward focus was restored is not confirmed
for the landing page; F-1-1 is a regression or incomplete fix.

## Structure and missed leverage

The live app has a distinct glass-orchard identity consistent with
`.factory/design.md`, not a generic SaaS template. It has the expected
header/footer, skip link, Privacy and Terms links, real designed 404, favicon,
canonical/OG metadata, sitemap, self-only CSP, and same-origin assets. Rendered
route titles update to the required pattern; an unknown route returns a real
404. The only structure failure found is F-1-1.

The brief does not imply a missing AI step, import/export, or sync feature.
The local-first, low-pressure browser-game scope is served by the current
archive, daily, and personal-seed paths; adding AI would be decorative.

## What would make this perfect

Fix F-1-1 through F-1-5, then retest from a fresh browser context: header
navigation and Back must focus and announce every route, all copy must match
the daily and seed capabilities, and each demo promise must have a declared
observable claim test. At that point the currently strong first-screen demo,
offline behavior, privacy posture, and visual system would support a PASS.
