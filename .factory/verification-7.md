# Mirror Orchard independent verification 7

## Result: FAIL — release blocked

- **Candidate:** `279e0a527ff77feb18592aa9bc1b653e7c618c9b`
- **Live URL:** <https://mirror-orchard.sociobot.in>
- **Verified:** 2026-09-02 UTC
- **Scope:** independent QA only. No product code was changed.

The live deployment is byte-identical to this candidate’s production build, so
the failed claim applies to production as well as the clean checkout.

## Release-blocking defect

### High — declared frame-rate claim fails

`.factory/claims.json` promises: **“Board rendering keeps a median cadence of
at least 50 fps at 390 × 844 under 4× CPU throttling.”** Its required exact
command failed from the clean checkout:

```text
npm run test:e2e -- --grep @claim:frame-rate
Frame-rate samples: 46.36, 48.57, 43.54, 47.29, 47.60 fps
median 47.29 fps; requirement >= 50 fps
```

This is a reproducible claims-contract failure, not a deployment-only issue.
Any failing claim test blocks release. The current published handoff’s 60 fps
measurement is therefore not valid evidence for this candidate in this worker.

## Additional defect

### Medium — invalid personal-seed entry writes a browser console error

On live `/seeds`, entering `bad!` and submitting displays the intended recovery
text, but Chromium logs:

```text
Pattern attribute value [A-Za-z0-9 -]{1,48} is not a valid regular expression:
Invalid character in character class
```

The `pattern` attribute at `src/main.ts:204` is invalid under Chromium’s `v`
regular-expression mode. Escape or reposition the literal hyphen and rerun
invalid-input/browser-console QA.

## Mandatory claims gate

`.factory/claims.json` exists and has 19 declared claims. Before broader QA, I
ran every listed command independently through the production demo entry point
from this clean `npm ci` checkout. Eighteen passed:

`archive-open`, `complete-round`, `no-timer`, `completion-persist`,
`restart-reset`, `settings-persist`, `seed-reproducible`, `daily-seed`,
`daily-replay`, `local-only`, `privacy-no-tracking`, `demo-isolated`,
`demo-sample-state`, `free-no-account`, `offline-reload`, `run-recovery`,
`three-error-loss`, and `input-paths`.

`frame-rate` failed as shown above. A later full `npm test` also failed only
that test. `npm run test:e2e -- --grep-invert @claim:frame-rate` passed all
remaining 28 browser tests.

## First read, game loop, and product QA

Cold live desktop load answers the required questions in plain words:

- **What:** “Learn a symmetry puzzle at your pace.”
- **For whom:** visual puzzle players who want practice before the daily
  challenge.
- **First click:** **Try it with sample data**; it says it opens teaching board
  3 with two boards complete.

The first viewport contains the real board preview rather than a menu wall. The
one-click action opens `/demo`, showing the persistent “Demo — sample data,
nothing is saved” banner and board 3. At 390 × 844 there was no horizontal
overflow and the board remained in the first viewport.

Normal, loss, restart, and invalid-input paths were exercised live. Three bad
placements reached **This orchard withered**; **Restart board** restored zero
moves and no filled plots. The seeded-input recovery message appeared for
`bad!` (with the console defect noted above). The deterministic Playwright
suite covers the full public-UI title/demo-to-win run, daily replay, archive
completion, saved-run recovery, settings persistence, pointer/touch and all
advertised keyboard inputs, dialog focus containment, and reset behavior.

## Local quality checks

```text
npm ci                         PASS — 61 packages; 0 vulnerabilities
npm run test:unit              PASS — 4 deterministic core tests
npm test                       FAIL — only @claim:frame-rate
npm run typecheck              PASS
npm run lint                   PASS
npm run build                  PASS — dist/ produced
```

The production build is compact: JS 33,553 bytes raw / 11.78 kB gzip and CSS
23,281 bytes raw / 5.89 kB gzip. The hashed JS, CSS, and service worker from
the fresh `dist/` SHA-256-match their live counterparts exactly.

## Live privacy, security, PWA, and accessibility evidence

- Live request logging during landing, demo play, archive navigation, and the
  invalid seed path observed only `https://mirror-orchard.sociobot.in` assets;
  no analytics, advertising, account, payment, API, WebSocket, or third-party
  request was made.
- Responses provide HSTS, `nosniff`, strict-origin referrer policy, disabled
  camera/microphone/geolocation/payment permissions, and a self-only CSP with
  `frame-ancestors 'none'`. HTML has a short revalidation cache; hashed assets
  are one-year immutable; `sw.js` is `no-cache`.
- Live `/demo` was controlled by its service worker. After first load, an
  offline reload recovered the paused demo board and showed the offline notice,
  without console/page errors.
- At 390 × 844 with reduced motion, live `/seeds` had no Axe serious/critical
  violations and no overflow. The 28 passing browser tests also cover every
  required route’s single h1/no-overflow/Axe serious-critical baseline,
  focus handling, and reduced-motion behavior.

This static, local-first game has no server-side endpoint, sign-in, payment, or
product-unlock endpoint; rate-limit/429, concurrency, health, and Entra checks
do not apply.

## Required disposition

Do not release candidate `279e0a527ff77feb18592aa9bc1b653e7c618c9b`. Restore
the claimed 50 fps minimum under the exact 390 × 844/4× CPU test (or remove and
appropriately revise the claim), repair the invalid seed `pattern`, then run
every exact claims command and the full suite again.
