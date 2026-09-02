# Adversarial first-read review 3 — PASS

Reviewed 2026-09-02 UTC against <https://mirror-orchard.sociobot.in> and
source commit `f53afd5edd5f7fd7597b120528ae4963c6f72589`. This was a
read-only product review. No product source or deployment configuration was
changed.

## Verdict

**PASS.** There are zero findings. The cold first read, one-click demo,
isolated storage, declared claims, copy, routes, metadata, accessibility,
links, and earlier-review fixes all verify against the current live build.

## Cold first read

Fresh Chromium contexts opened `/` at 390 × 844 with touch and at 1440 × 1000,
before scrolling.

| Question | Answer available from the first screen |
| --- | --- |
| What does this do? | It teaches a symmetry puzzle: select a branch and planting it also plants its reflected pair. |
| Who is it for? | “For visual puzzle players who want practice boards before the daily challenge.” |
| What should I click first? | **Try it with sample data**; the adjacent text says it opens teaching board 3 with two boards complete. |

The mobile hero includes the headline, audience, primary action, outcome,
three facts, and the start of an actual playable-board preview in the first
viewport. Desktop shows the preview alongside the hero. The first-read check
passes: the job, audience, and next action are clear without scroll.

## Copy audit

Counts use whitespace-separated words, treating number ranges and hyphenated
terms as one word. Headings, labels, facts, and calls to action are included so
that scanability is checked as well as sentence length. No landing or README
item is over 22 words. No jargon, banned marketing language, unexplained mood
heading, inconsistent term, or non-result primary action was found.

### Landing page

| Copy | Words | Result |
| --- | ---: | --- |
| 40 teaching boards · one daily puzzle | 7 | Pass |
| Learn a symmetry puzzle at your pace | 7 | Pass |
| For visual puzzle players who want practice boards before the daily challenge. | 12 | Pass |
| Try it with sample data | 5 | Pass: result-naming action |
| Opens teaching board 3 with two boards complete. | 8 | Pass: `demo-sample-state` |
| 40 teaching boards | 3 | Pass: `archive-open` |
| Works offline after your first visit | 6 | Pass: `offline-reload` |
| Free. No account. | 3 | Pass: `free-no-account` |
| Teaching board 1 | 3 | Pass |
| 3 branches | 2 | Pass |
| Choose a branch. Plant its reflected pair. | 7 | Pass: describes the visible preview and game rule |
| Choose a puzzle | 3 | Pass: section name |
| Every teaching board stays open | 5 | Pass: `archive-open` |
| Start with a teaching board, play today’s puzzle, or enter a seed. | 12 | Pass |
| Teaching archive | 2 | Pass: destination label |
| 40 ordered boards | 3 | Pass: `archive-open` |
| Daily puzzle | 2 | Pass: destination label |
| The same seed for everyone today | 6 | Pass: `daily-seed` |
| Personal seeds | 2 | Pass: destination label |
| Replay a seed using letters, numbers, spaces, or dashes | 9 | Pass: matches input validation |
| How it works | 3 | Pass: section name |
| Fill the glowing soil in three steps | 7 | Pass |
| Choose a branch | 3 | Pass |
| The tray shows each branch you can use once. | 9 | Pass |
| Plant one side | 3 | Pass |
| Its reflected branch grows across the center channel. | 8 | Pass |
| Fill the pattern | 3 | Pass |
| Use every branch without crossing the glowing edge. | 8 | Pass |
| Privacy and storage | 3 | Pass: section name |
| Your play stays on this device | 6 | Pass: `local-only` |
| The game stores completed boards, open runs, settings, and recent seeds in your browser. | 14 | Pass: persistence and storage claims |
| There are no accounts, ads, leaderboards, payments, or third-party scripts. | 10 | Pass: `privacy-no-tracking`, `free-no-account` |
| Mirror Orchard. | 2 | Pass: footer identity |
| Plant reflected branch puzzles at your pace. | 7 | Pass: product one-liner |
| Version 1.0 · Landscape generated for this game with the factory image model. | 13 | Pass: provenance |

Navigation labels—Mirror Orchard, Archive, Daily, Seeds, Demo, Privacy, and
Terms—name their destinations. The footer’s external Param Factory link is
marked as external.

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
| The daily puzzle can be replayed, and the same personal seed always makes the same board. | 16 | Pass: `daily-replay`, `seed-reproducible` |
| The tested sample round reaches its end screen in under five minutes. | 12 | Pass: `complete-round` |
| Rounds have no timer. | 4 | Pass: `no-timer` |
| What is included | 3 | Pass: heading |
| 40 ordered teaching boards with buds, twigs, corners, and glass stones | 11 | Pass |
| One stable UTC-dated daily board | 5 | Pass: `daily-seed` |
| Reproducible boards from any 1–48 character seed using letters, numbers, spaces, or dashes | 13 | Pass: `seed-reproducible` |
| Pointer, touch, and keyboard controls | 5 | Pass: `input-paths` |
| Persistent runs, completed boards, sound, and calm-motion settings | 8 | Pass: persistence claims |
| Offline reload after the first visit | 6 | Pass: `offline-reload` |
| A separate demo storage area that never reads or writes real progress | 12 | Pass: `demo-isolated` |
| Progress stays in browser `localStorage`. | 5 | Pass: `local-only` |
| The game has no accounts, payments, analytics, or third-party runtime requests. | 11 | Pass: privacy and account claims |
| Controls | 1 | Pass: heading |
| Pointer or touch: choose a branch, rotate it, then choose a plot. | 12 | Pass |
| Keyboard: arrows move between plots; 1–9 choose a branch; `R` rotates; Enter or Space plants; `Z` undoes; Escape pauses. | 19 | Pass: `input-paths` |
| A bad placement spends one dew drop. | 7 | Pass |
| Losing all three ends the run. | 6 | Pass: `three-error-loss` |
| Restarting restores the full tray. | 5 | Pass: `restart-reset` |
| Develop | 1 | Pass: heading |
| Requires Node.js 22 or a compatible current release. | 8 | Pass |
| Open `http://localhost:5173`. | 2 | Pass |
| Add `?demo=1` or open `/demo` for the isolated sample. | 9 | Pass |
| Test and build | 3 | Pass: heading |
| `npm test` runs deterministic core tests, creates the production build, and runs Chromium claim and accessibility tests. | 17 | Pass: developer instruction |
| The exact deployment command is `npm run build`. | 8 | Pass |
| Static output lands in `dist/`, with `dist/index.html` at its root. | 10 | Pass |
| The browser suite uses Playwright 1.58.2. | 6 | Pass |
| In the factory worker, it reads the preinstalled browsers from `PLAYWRIGHT_BROWSERS_PATH`. | 11 | Pass |
| Routes | 1 | Pass: heading |
| `/` — landing page and game preview | 7 | Pass |
| `/demo` — isolated, prefilled sample | 5 | Pass |
| `/archive` — all 40 teaching boards | 6 | Pass |
| `/daily` — today’s deterministic puzzle | 5 | Pass |
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

Terminology remains consistent: **teaching board**, **branch**,
**reflection**, **mirror channel**, **dew**, **seed**, **progress**, and
**demo** each retain one meaning.

## Demo and sandbox behaviour

- The first action enters `/demo` in one click and immediately shows **Try
  teaching board 3**, one planted branch, three dew, and four available
  branches. The demo archive marks boards 1 and 2 complete.
- The persistent mint banner reads “Demo — sample data, nothing is saved” and
  includes **Reset demo** and **Start for real**.
- With a pre-seeded real `mirror-orchard:v1` value, the demo used only
  `demo:mirror-orchard:v1`. Reset restored the sample. **Start for real**
  removed only the demo key and retained the real value byte-for-byte.
- The live Playwright request log for landing, demo, archive, privacy, and the
  offline flow contained only `https://mirror-orchard.sociobot.in`; no page or
  console errors occurred during those flows.
- After one online visit, the live service worker controlled `/demo`.
  Offline reload opened the saved-run dialog, resumed board 3, and showed
  “You are offline. Saved boards remain playable.”

## Claims and quality gates

From a fresh clone in `/tmp/mirror-orchard-review3.Tk8BTA`, `npm ci` passed
with 0 vulnerabilities. Every exact command listed in `.factory/claims.json`
was run separately and passed. There are 19 declarations and exactly one
matching `@claim:<id>` tag for each.

| Claim ids | Result / observed outcome |
| --- | --- |
| `archive-open`, `complete-round`, `no-timer`, `completion-persist`, `restart-reset` | PASS: archive 40, complete end screen under five minutes, no timer, completion, and restart reset all observed. |
| `settings-persist`, `seed-reproducible`, `daily-seed`, `daily-replay` | PASS: settings and deterministic boards survived reload; daily replay returned a clean board. |
| `local-only`, `privacy-no-tracking`, `demo-isolated`, `demo-sample-state`, `free-no-account` | PASS: same-origin requests only; no tracking paths; isolated resettable demo; no sign-in or payment. |
| `offline-reload`, `run-recovery`, `three-error-loss`, `input-paths`, `frame-rate` | PASS: offline resume, paused recovery, three-error loss, every advertised input, and 59.88 FPS median at 390 px/4× CPU. |

`npm run build` passed and produced `dist/`. `npm test` passed: 4 unit tests
and 30 Chromium tests. The live HTML and hashed JavaScript/CSS SHA-256 values
match the fresh production build, so the local claim results apply to the
reviewed deployment.

Every claim-like landing statement maps to the declared inventory or merely
describes the visible interaction. No unlisted claim was found.

## History, structure, and accessibility

Every earlier finding was rechecked live and in the current source:

| Earlier finding | Current result |
| --- | --- |
| F-1-1: route change and Back did not focus/announce the landing heading | Fixed: `/` → Archive → Back focuses the landing h1 and announces “Learn a symmetry puzzle at your pace page.” |
| F-1-2: board-expiry overclaim | Fixed: scope is “Every teaching board stays open”; the expiry promise is absent. |
| F-1-3: unsupported seed characters | Fixed: landing and form both state letters, numbers, spaces, or dashes. |
| F-1-4: unlisted demo state | Fixed: declared `demo-sample-state` test passed. |
| F-1-5: mood-only labels | Fixed: the sections are named “Choose a puzzle” and “Privacy and storage.” |
| F-2-1: misleading skip-link label | Fixed: every route and static 404 uses “Skip to main content” and moves focus to `main`. |
| F-2-2: sitemap omission | Fixed: live sitemap contains 47 URLs, including all 40 finite archive-board routes. |
| Earlier claim-command, modal-focus, touch-target, route-404, recovery, win-action, offline, and mobile-preview issues | Fixed: all corresponding browser checks pass; direct invalid paths return the designed HTTP 404. |

The live `/`, `/demo`, `/archive`, `/daily`, `/seeds`, `/privacy`, `/terms`,
`/play/archive/1`, `/play/archive/40`, and a real missing URL were checked.
They have one h1, one main landmark, route-specific titles, descriptions,
canonical URLs, OG/Twitter data, favicon, shared header/footer, no mobile
overflow, and valid Back/focus behaviour. The designed missing URL returns
HTTP 404. All 47 same-origin discovered destinations plus the marked external
factory link returned 200 where expected.

Live Axe scans at 390 px reported zero violations on all of those routes.
Headers provide self-only CSP, HSTS, `nosniff`, referrer policy, and a
restrictive permissions policy. The glass-orchard art, dark mineral palette,
etched board, serif/sans pairing, and reflection treatment follow the
documented design direction and are visibly distinct from a generic SaaS
template.

## Missed leverage

No missing AI, import/export, or sync feature is implied by the brief. This is
an account-free, local-first game whose intended value is an open teaching
archive, a daily puzzle, and reproducible personal seeds. AI would be
decorative, and sync would require an account/privacy model outside this
brief.

## What would make this perfect

Maintain the current standard: rerun the clean demo claim suite, live offline
check, route/link crawl, mobile Axe scan, and first-read copy audit whenever
game rules or copy change. No additional product change is indicated by this
review.
