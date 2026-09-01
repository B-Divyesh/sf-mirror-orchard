# Mirror Orchard handoff

## Shipped

Mirror Orchard is a complete static browser game built with Vite and TypeScript.

- A deterministic mirrored inventory-tiling rule with buds, twigs, corners, rotation, undo, three-dew loss, pause, restart, and end screens
- An always-open archive of 40 fixed teaching boards with an ordered difficulty curve
- A UTC-dated daily puzzle that remains replayable
- Personal seed puzzles that reproduce the same board and branch tray
- Local run recovery, completion history, best moves, recent seeds, sound, and calm-motion settings
- Pointer, touch, and full keyboard play at 390 px and wider
- A one-click `/demo` with two completed boards, one in-progress board, and two sample seeds
- A separate `demo:mirror-orchard:v1` namespace that is discarded by **Start for real**
- Offline shell and puzzle reload through a versioned service worker
- `/privacy`, `/terms`, SPA not-found handling, and a static `404.html`
- Route titles, canonical metadata, social art, manifest, sitemap, robots file, security headers, and reduced-motion behavior

The generated glass-orchard landscape was reviewed for text artifacts, brands, seams, and unintended subjects. The prompt and deployment are recorded beside the source and in `.factory/design.md`.

## Run and deploy

```sh
npm ci
npm test
npm run build
npm run preview
```

The deployment command is `npm run build`. Publish `dist/`; `dist/index.html` is at its root. No environment variables or backend resources are needed.

## Verification

Verified locally on 2026-09-01 against the production build.

- `npm test`: 3 deterministic core tests and 13 Chromium tests pass
- All 40 teaching boards reach `won` through their deterministic solutions
- Every claim in `.factory/claims.json` has one tagged browser test
- `/opt/fleet/lib/verify-url.sh`: `/` and `/demo` return 200, have one H1, `lang`, `main`, complete image alt text, and no console errors
- Playwright + axe: no serious or critical violations across `/`, `/demo`, `/archive`, `/daily`, `/seeds`, `/privacy`, `/terms`, and the client 404 route
- Mobile: tested at 390 × 844 with no horizontal overflow; touch and keyboard game paths pass
- Offline: a dedicated context loads `/demo`, gains service-worker control, goes offline, and reloads the playable board
- Privacy: the demo flow produces same-origin requests only
- `npm audit`: zero known vulnerabilities
- Measured animation cadence at 390 × 844: 59.5 fps over 120 frames

Lighthouse 12.2.1 mobile simulation on the local production preview:

| Category or metric | Result |
| --- | ---: |
| Performance | 99 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |
| Largest Contentful Paint | 2.0 s |
| First Contentful Paint | 1.4 s |
| Cumulative Layout Shift | 0.057 |
| Total Blocking Time | 0 ms |

Production budget evidence:

- JavaScript: 31.6 KB raw / 11.3 KB gzip
- CSS: 22.9 KB raw / 5.8 KB gzip
- Initially used Latin fonts: 61.5 KB total
- Mobile hero WebP: 77.4 KB; desktop hero WebP: 165.6 KB
- Full `dist/`: about 800 KB, including social art and source map

## Known boundaries

- Progress is local to one browser. Clearing site storage removes it; this is stated on the privacy and terms pages.
- Daily seeds use UTC, so the board changes at 00:00 UTC rather than local midnight.
- The game intentionally has no accounts, cloud sync, leaderboard, multiplayer, payments, analytics, or endless generator feed.
- The game is turn-based, so a fixed-timestep simulation is unnecessary. Visual feedback uses requestAnimationFrame through browser-native animation.

No blocking gaps remain for v1.
