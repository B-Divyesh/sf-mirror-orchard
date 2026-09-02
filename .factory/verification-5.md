# Mirror Orchard independent verification 5

## Result: FAIL — release blocked

- **Candidate tested:** `e02058594f467399a7befe18619e1848867fe1da`
- **Live URL:** <https://mirror-orchard.sociobot.in>
- **Date:** 2026-09-02 UTC
- **Verifier scope:** independent QA only. No product code was changed.

The candidate fails the mandatory claims gate. Its stated 60 fps rendering claim does not pass its own required fresh-demo test. This is a release blocker even though the rest of the exercised product is functional.

## First-read result

Cold-opening the live desktop page answered all required questions in plain words:

- It is a visual symmetry puzzle: “Learn a symmetry puzzle at your pace.”
- It is for visual-puzzle players who want practice before the daily challenge.
- The first action is **Try it with sample data**, with a clear note that it opens teaching board 3 with boards 1 and 2 complete.

The first desktop and 390 × 844 mobile screens show a playable teaching-board preview, rather than a menu wall. The one-click demo link is visible and usable. First-read and demo-entry requirements pass.

## Release blocker

### High — mandatory frame-rate claim fails

`@claim:frame-rate` promises “The board rendering loop targets 60 fps on a mid-range phone.” Its required command was run from the clean candidate through the production demo:

```sh
npm run test:e2e -- --grep @claim:frame-rate
```

It failed twice on fresh production builds. The latest failure measured **56 fps** under the test’s documented 390 × 844 viewport and 4× CPU throttle, below the required rounded 60 fps threshold:

```text
Expected: >= 60
Received:    56
tests/e2e/claims.spec.ts:277
```

Evidence retained locally by Playwright:

- `test-results/claims--claim-frame-rate-b-807b6-390px-under-4x-CPU-throttle-chromium/error-context.md`
- `test-results/claims--claim-frame-rate-b-807b6-390px-under-4x-CPU-throttle-chromium/test-failed-1.png`
- `test-results/claims--claim-frame-rate-b-807b6-390px-under-4x-CPU-throttle-chromium/trace.zip`

This also makes the full suite fail. `test-results/.last-run.json` reports exactly one failed test: the frame-rate claim.

## Claims gate

`.factory/claims.json` is present and has 18 entries, each with one tagged browser test. I ran every exact command in file order after `npm ci`, against Playwright’s production-build demo entry point. The first 17 claims passed; the final `frame-rate` command failed as above.

Passing claims: `archive-open`, `complete-round`, `completion-persist`, `restart-reset`, `settings-persist`, `seed-reproducible`, `daily-seed`, `daily-replay`, `local-only`, `privacy-no-tracking`, `demo-isolated`, `demo-sample-state`, `free-no-account`, `offline-reload`, `run-recovery`, `three-error-loss`, and `input-paths`.

## Local candidate checks

Executed from the clean checkout:

```sh
npm ci
npm run typecheck
npm run lint
npm run test:unit
npm run build
npm test
```

- `npm ci`: passed; 61 packages installed, 0 vulnerabilities.
- Typecheck and lint: passed.
- Unit tests: passed, 4/4.
- Exact production build: passed and produced `dist/`.
- `npm test`: failed only at `@claim:frame-rate`; all other 27 Playwright/unit tests passed.
- Built JS is 33,553 bytes raw / 11,761 bytes gzip; CSS is 23,281 bytes raw / 5,888 bytes gzip; the 165,592-byte hero is within the stated static budgets.

## Live deployment, game flow, and privacy

The live deployment matches the candidate byte-for-byte for `index.html`, the JS and CSS bundles, `sw.js`, `404.html`, and `404.css` (SHA-256 compared after the local production build).

An independent desktop scripted run through public UI completed both the prefilled teaching board and the current UTC daily board. It reached the “The orchard is mirrored” end screen in both runs. A three-invalid-placement run reached “This orchard withered.” Replay/restart returned the board to zero moves, three dew, and zero filled plots. No console or page errors occurred during those normal game runs.

Live request logging during landing, demo play, archive, and privacy navigation observed only `https://mirror-orchard.sociobot.in`; no third-party scripts, analytics, ads, account, payment, or API traffic was observed. The static game has no server-side/product-unlock endpoint, so rate-limit and Entra checks do not apply. Browser headers provide a self-only CSP (including `frame-ancestors 'none'`), HSTS, `nosniff`, strict-origin referrer policy, and disabled camera/microphone/geolocation/payment permissions. Hashed assets are immutable for one year; HTML uses 30-second revalidation and `sw.js` uses `no-cache`.

Service-worker audit passed: an active current controller and one versioned cache were present, `registration.update()` left no waiting/installing worker, and a focused offline reload of `/demo` reopened the saved board with the offline banner.

## Accessibility, responsive, and quality checks

At 390 × 844, `/`, `/demo`, `/archive`, `/daily`, `/seeds`, `/privacy`, `/terms`, and `/missing-page` all had one `h1`, one `main`, no horizontal overflow, and no Axe serious or critical violations. The real missing route returned HTTP 404 with the same semantic skeleton. Normal-route console/page errors were zero. The skipped 404 response naturally generated one expected resource-load console error in the combined route scan.

Keyboard focus is visibly designed: the live focused control had a 3 px solid amber outline. Under `prefers-reduced-motion: reduce`, measured transition and animation durations were `0.00001s` and scroll behavior was `auto`.

Live mobile Lighthouse produced: performance **97**, accessibility **100**, best practices **100**, SEO **100**; FCP 1.9 s, LCP 1.9 s, CLS 0.059, TBT 0 ms.

## Required disposition

Do not release this candidate until the 60 fps implementation/claim is corrected and **every exact command in `.factory/claims.json` passes on a fresh production build**, including repeated 4× CPU mobile frame-rate measurements. Re-run this verification after repair.
