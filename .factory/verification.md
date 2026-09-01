# Independent verification — FAIL

Verified on 2026-09-01 UTC.

- Candidate: `f9816da3a97c89d9823110e8fcda45989001c15a`
- Live URL: <https://mirror-orchard.sociobot.in>
- Work order: `mirror-orchard-verify-1`
- Verdict: **FAIL**

The live game is polished and its core loop works, but the candidate does not meet the acceptance contract. The exact claim commands fail from a clean clone, keyboard focus escapes modal dialogs, several persistent mobile controls are smaller than 44 px, and seed validation accepts characters the form says are invalid.

## Release-blocking findings

### P0 — the claims gate fails from a clean clone

After `npm ci`, but before any build, every command listed in `.factory/claims.json` exits 1. Playwright starts `npm run preview`, while `playwright.config.ts:15` only previews an existing `dist/`; the claim commands do not create that directory. `/demo` therefore never renders and the common assertion fails:

```text
Locator: getByText('Demo — sample data, nothing is saved')
Expected: visible
Error: element(s) not found
```

This was reproduced again in an isolated clone at the candidate commit. `@claim:offline-reload` instead times out waiting for `navigator.serviceWorker.ready`. The work order explicitly makes any failing claim test release-blocking.

After running the production build through `npm test`, the same browser suite passes. This proves the application behavior, but does not make the claim commands valid from a clean clone.

| Claim | Exact clean-clone command | Clean clone | After build |
| --- | --- | ---: | ---: |
| `archive-open` | `npm run test:e2e -- --grep @claim:archive-open` | FAIL | PASS |
| `complete-round` | `npm run test:e2e -- --grep @claim:complete-round` | FAIL | PASS |
| `restart-reset` | `npm run test:e2e -- --grep @claim:restart-reset` | FAIL | PASS |
| `settings-persist` | `npm run test:e2e -- --grep @claim:settings-persist` | FAIL | PASS |
| `seed-reproducible` | `npm run test:e2e -- --grep @claim:seed-reproducible` | FAIL | PASS |
| `daily-seed` | `npm run test:e2e -- --grep @claim:daily-seed` | FAIL | PASS |
| `local-only` | `npm run test:e2e -- --grep @claim:local-only` | FAIL | PASS |
| `demo-isolated` | `npm run test:e2e -- --grep @claim:demo-isolated` | FAIL | PASS |
| `free-no-account` | `npm run test:e2e -- --grep @claim:free-no-account` | FAIL | PASS |
| `offline-reload` | `npm run test:e2e -- --grep @claim:offline-reload` | FAIL | PASS |
| `input-paths` | `npm run test:e2e -- --grep @claim:input-paths` | FAIL | PASS |
| `frame-rate` | `npm run test:e2e -- --grep @claim:frame-rate` | FAIL | PASS |

### P1 — modal keyboard focus escapes into covered controls

Pressing Escape pauses the game and correctly focuses “Your planting is saved.” The next two Tab presses reach “Resume board” and “Restart board,” but the third reaches the covered, disabled Undo control behind the modal. Further Tab presses reach “Keyboard and rules” and “Sound off.” The modal has `aria-modal="true"`, but the background is not inert and focus is not contained. This fails the required dialog-focus behavior for keyboard and screen-reader users.

### P1 — mobile touch targets are below the 44 px baseline

At 390 × 844, the core board plots are exactly 44 × 44 px, but persistent controls are smaller:

- Header navigation: as small as 34 × 38.3 px.
- Demo “Reset demo”: 106 × 36.3 px.
- Demo “Start for real”: 90 × 22.3 px.
- Mobile home mark: 40 × 40 px.

The attached accessibility and design contracts require interactive targets to be at least 44 × 44 px.

### P1 — the claims inventory does not cover all published promises

The landing page, privacy page, game instructions, and README make observable promises that have no entry in `.factory/claims.json`, including mid-run recovery/completed-board persistence, the three-invalid-move loss rule, and the absence of ads, analytics, and leaderboards. Some behavior has an untagged unit test or passed this manual verification, but the claims contract requires each public promise to have its own listed `@claim:<id>` test.

## Other findings

### P2 — seed validation contradicts its instructions

The seed form says, “Use 1–48 letters, numbers, spaces, or dashes.” It accepts `🚫/bad_seed!` and opens `/play/seed/%F0%9F%9A%AB%2Fbad_seed!`. Empty input is correctly rejected, one- and 48-character values work, and keyboard entry is capped at 48 characters. The permitted-character rule needs enforcement or the help text needs to describe the real behavior.

### P2 — unknown application routes return HTTP 200

`/missing-page` renders the designed “Page not found” screen but returns HTTP 200. Missing excluded assets such as `/assets/nope.js` correctly return 404 with `404.html`. The application route is therefore a soft 404 rather than the real 404 required by the site contract.

### P2 — two listed claim tests are narrower than their claims

- `settings-persist` claims all game settings persist but asserts only calm motion. Independent QA confirmed sound also persists.
- `frame-rate` describes a mid-range phone sandbox but runs in the desktop Playwright project without CPU throttling. Independent QA measured 58.54 fps at 390 × 844 with 4× CPU throttling, so the live behavior passes even though the claim test is under-scoped.

## First-read test

The live first screen passes. A cold visitor sees:

- What it does: “Learn a symmetry puzzle at your pace.”
- Who it is for: visual puzzle players wanting practice before the daily challenge.
- What to click: “Try it with sample data,” with a note that it opens teaching board 3 with two boards complete.
- Three plain facts: 40 boards, offline after the first visit, and free with no account.
- A visible board preview, not a menu wall.

The one-click action opens `/demo` with the persistent sandbox banner, one move already planted, and a playable board. Evidence: [desktop first read](verification-assets/live-first-read-desktop.png), [mobile first read](verification-assets/live-first-read-mobile.png), and [mobile demo](verification-assets/live-demo-mobile.png).

## Independent game run

The deterministic live run succeeded from the title screen through both outcomes:

- Title → “Try it with sample data” → active teaching board 3.
- Demo began with 1 move and 2 filled plots.
- Remaining supplied solution placements produced the real win dialog: 5 moves, 3 of 3 dew, seed `teaching-orchard-3-v1`.
- Replay reset phase, moves, dew, filled plots, and used branches.
- Three invalid placements at `0,0` produced the real loss dialog with zero dew.
- Restart after loss restored playing state, 0 moves, 3 dew, and no filled plots.
- A real board 1 completion persisted under `mirror-orchard:v1` and appeared as complete in the archive.
- A mid-run reload retained 2 moves and 4 filled plots, reopening safely in the paused state.

Evidence: [win screen](verification-assets/live-demo-win-desktop.png) and [loss screen](verification-assets/live-demo-loss-desktop.png).

Archive, daily, and personal-seed modes were exercised. The archive contains all 40 entries; the UTC daily seed was `daily:2026-09-01:v1` and retained its fingerprint after reload; repeated personal seeds retained their fingerprint. Pointer, touch, arrows, number keys, rotation, planting, pause/resume, undo, and restart were exercised. The only keyboard failure was modal focus containment described above.

## Build and automated checks

From the candidate checkout:

| Check | Result |
| --- | --- |
| `npm ci` | PASS; 0 vulnerabilities |
| `npm run test:unit` through `npm test` | PASS; 3 tests |
| TypeScript (`tsc --noEmit`) | PASS |
| Production build (`vite build` + service-worker build) | PASS; `dist/` produced |
| Full Playwright suite after build | PASS; 13 tests |
| Lint | Not present in `package.json` |
| `/opt/fleet/lib/verify-url.sh` on `/` and `/demo` | PASS |
| Axe serious/critical on `/`, `/demo`, `/archive`, `/daily`, `/seeds`, `/privacy`, `/terms`, and client 404 | 0 findings |

## Live deployment, privacy, and headers

- The locally built candidate matches the live `index.html`, hashed JS, hashed CSS, `sw.js`, manifest, metadata files, and raster assets byte for byte. The live JS SHA-256 is `9f8525de995f70fe7feb90140cf386627e4adf02bd4b6b19f783489c028773c4`.
- A complete landing/demo/play/archive flow made 11 requests, all to `https://mirror-orchard.sociobot.in`. No analytics, third-party scripts, console errors, or page errors appeared.
- The document sends CSP with `frame-ancestors 'none'`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, and HSTS.
- HTML is cached for 30 seconds with revalidation. Hashed JS/CSS use one-year immutable caching. `sw.js` uses `no-cache`.
- This is a static product with no server-side product or unlock endpoints, so API rate-limit and 429 checks do not apply. It requires no sign-in, so identity-provider checks do not apply.

## PWA and performance

- Service worker active at `/sw.js`; an explicit registration update completed with no waiting worker.
- One versioned cache was present: `mirror-orchard-bbc0bd41c8b8`.
- Offline reload of `/demo` preserved the playable board and displayed the offline notice.
- Reduced-motion media emulation reduced animation and transition durations to `0.01ms`.
- Measured board cadence: 58.54 fps over 120 frames at 390 × 844 with 4× CPU throttling.
- Initial JavaScript: 31.56 KB raw / 11.48 KB transferred.
- Initial CSS: 22.88 KB raw / 6.14 KB transferred.
- Mobile hero: 77.48 KB transferred; initial total: 165 KB.
- Lighthouse mobile: Performance 97, Accessibility 100, Best Practices 100, SEO 100; FCP 1.2 s, LCP 1.7 s, CLS 0.057, TBT 180 ms.

Machine-readable Lighthouse evidence: [lighthouse-live.json](verification-assets/lighthouse-live.json).

## Release decision

**FAIL.** Do not promote this candidate until the exact claim commands work from a clean clone and the P1 accessibility defects are fixed and retested. Product source was not modified during verification.
