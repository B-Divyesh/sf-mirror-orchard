# Mirror Orchard

Grow mirrored orchard patterns across 40 teaching boards, a daily puzzle, and replayable seeds.

Mirror Orchard is a free browser puzzle for players who want time to learn a visual rule. Choose a branch and plant it on either side of the board. Its reflection grows at the same time. Fill every glowing plot before three invalid placements use your dew.

Every teaching board stays open. The daily puzzle can be replayed, and the same personal seed always makes the same board. Intended session length is under five minutes per round.

Live: <https://mirror-orchard.sociobot.in>  
One-click demo: <https://mirror-orchard.sociobot.in/demo>

## What is included

- 40 ordered teaching boards with buds, twigs, corners, and glass stones
- One stable UTC-dated daily board
- Reproducible boards from any 1–48 character seed using letters, numbers, spaces, or dashes
- Pointer, touch, and keyboard controls
- Persistent runs, completed boards, sound, and calm-motion settings
- Offline reload after the first visit
- A separate demo storage area that never reads or writes real progress

Progress stays in browser `localStorage`. The game has no accounts, payments, analytics, or third-party runtime requests.

## Controls

- Pointer or touch: choose a branch, rotate it, then choose a plot.
- Keyboard: arrows move between plots; 1–9 choose a branch; `R` rotates; Enter or Space plants; `Z` undoes; Escape pauses.
- A bad placement spends one dew drop. Losing all three ends the run. Restarting restores the full tray.

## Develop

Requires Node.js 22 or a compatible current release.

```sh
npm ci
npm run dev
```

Open <http://localhost:5173>. Add `?demo=1` or open `/demo` for the isolated sample.

## Test and build

```sh
npm test
npm run build
npm run preview
```

`npm test` runs deterministic core tests, creates the production build, and runs Chromium claim and accessibility tests. The exact deployment command is `npm run build`. Static output lands in `dist/`, with `dist/index.html` at its root.

The browser suite uses Playwright 1.58.2. In the factory worker, it reads the preinstalled browsers from `PLAYWRIGHT_BROWSERS_PATH`.

## Routes

- `/` — landing page and game preview
- `/demo` — isolated, prefilled sample
- `/archive` — all 40 teaching boards
- `/daily` — today’s deterministic puzzle
- `/seeds` — personal seed entry and recent seeds
- `/seeds?seed=mint-window` — a reproducible personal-seed link
- `/privacy` and `/terms` — storage and use terms

## Product records

- [Brief](.factory/brief.json)
- [Visual system and asset provenance](.factory/design.md)
- [Demo contract](.factory/demo.md)
- [Tested claims](.factory/claims.json)
- [Copy audit](.factory/copy-audit.md)
- [Build handoff](.factory/handoff.md)

## License

MIT. See [LICENSE](LICENSE).
