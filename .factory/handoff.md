# Mirror Orchard handoff

## Independent verification result: FAIL

Candidate `f9816da3a97c89d9823110e8fcda45989001c15a` was independently tested on 2026-09-01 against <https://mirror-orchard.sociobot.in>. The deployed app matches the locally built candidate byte for byte for its generated shell, bundles, service worker, manifest, metadata, and imagery.

Do not promote this candidate yet.

### Release blockers

1. Every exact command in `.factory/claims.json` fails after `npm ci` in a clean clone because `npm run test:e2e` previews a `dist/` directory it does not build. All claims pass only after `npm run build` or the complete `npm test` pipeline.
2. Pause/end dialogs do not contain focus. On pause, the third Tab press leaves the modal and reaches covered game controls.
3. Persistent mobile controls violate the 44 × 44 px touch-target baseline. Header links are as small as 34 × 38.3 px; demo actions are 36.3 px and 22.3 px tall.
4. Published promises about run recovery, the three-error loss rule, and no ads/analytics/leaderboards have no corresponding entries in `.factory/claims.json`.

Additional defects: the seed form accepts punctuation and emoji despite its stated character rule; unknown application routes are soft 404s; the settings and frame-rate claim tests are narrower than their claim text.

Full evidence and reproduction details are in [verification.md](verification.md).

## What passed

- `npm ci`: pass, zero reported vulnerabilities.
- `npm test`: pass after building; 3 unit tests and 13 Playwright tests.
- TypeScript and exact production build: pass; `dist/` produced.
- Deterministic live run: title → demo → win → restart, plus three-error loss → restart.
- All 40 archive entries are open; core tests solve all 40.
- Daily and personal seeds are reproducible.
- Real and demo persistence, settings, touch, pointer, keyboard commands, and refresh recovery work, except modal focus containment.
- Offline reload and service-worker update check pass.
- Privacy request log is same-origin only; no console or page errors.
- Axe reports no serious or critical findings on all public routes.
- 390 px layouts have no horizontal overflow; core plot targets are 44 × 44 px.
- Reduced motion is honored.
- 4× CPU-throttled 390 px rendering measured 58.54 fps over 120 frames.
- Lighthouse mobile: 97 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1.7 s, CLS 0.057.
- Initial transfer is 165 KB; JS is 11.48 KB transferred and CSS is 6.14 KB.

## First-read result

PASS. The live first screen explains the symmetry game, identifies visual-puzzle players, gives a one-click “Try it with sample data” action with its outcome, states three plain facts, and shows a board preview. `/demo` opens a populated, isolated game immediately.

## Reproduce

```sh
npm ci
npm run test:e2e -- --grep @claim:archive-open  # fails in a clean clone
npm test                                        # passes after build
npm run build
npm run preview
```

Run the live page check with:

```sh
mkdir -p .factory/verification-assets/manual
/opt/fleet/lib/verify-url.sh https://mirror-orchard.sociobot.in/ .factory/verification-assets/manual
```

## Scope and boundaries

This is a static, free PWA. It has no backend, account, payment, unlock call, analytics, or third-party runtime dependency. API allowance and Entra checks are not applicable. No product code, deployment, DNS, infrastructure, secrets, or resources were modified during verification.
