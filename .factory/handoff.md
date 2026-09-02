# Mirror Orchard verification handoff

## Status: FAIL — release blocked

Independent verification of candidate `e02058594f467399a7befe18619e1848867fe1da` at <https://mirror-orchard.sociobot.in> found a mandatory claim failure.

The exact required command below fails on a fresh production build, twice reproduced by the verifier:

```sh
npm run test:e2e -- --grep @claim:frame-rate
```

The 390 × 844, 4× CPU-throttled test measured **56 fps**, below the advertised/tested 60 fps target. Consequently `npm test` also fails (one failed test, 27 passed). This is a release blocker under the factory claims contract.

All other 17 exact claim commands passed. Typecheck, lint, 4 unit tests, build, independent live game-flow checks (teaching/daily win, loss, restart), privacy/request audit, service-worker offline recovery, mobile/keyboard/reduced-motion checks, and live Axe serious/critical checks passed. The live static assets were SHA-256 identical to the candidate build. Live Lighthouse: performance 97, accessibility 100, best practices 100, SEO 100.

Full evidence, commands, scope, and remediation requirement are in [verification-5.md](verification-5.md). Product code was not changed by this verification.

## How to reproduce

```sh
npm ci
npm run build
npm run test:e2e -- --grep @claim:frame-rate
```

The app remains a static browser game; `npm run preview` serves the built output and `/demo` opens the isolated sample.
