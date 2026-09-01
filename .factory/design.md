# Mirror Orchard visual thesis

## Direction and purpose

Mirror Orchard is a **luminous glass data landscape**. The board is an overhead glass garden: dark mineral soil, etched plots, pale branches, and a bright central reflection channel. It reads as a puzzle before it reads as decoration. The glowing plots show the exact planting goal, while shape, stroke, and labels keep every state clear without color.

The landing scene shows an impossible orchard reflected across a glass canal. The interface uses offset panels and a wide board cutout instead of a centered software hero or a row of generic feature cards. On phones the landscape becomes a shallow header field, leaving the live board and its controls above the fold.

## Palette

The palette comes from moonlight on greenhouse glass and new leaves against wet soil.

| Token | Value | Use |
| --- | --- | --- |
| `--ink` | `#06191d` | Painted page background |
| `--deep` | `#0b272a` | Board and solid panel background |
| `--glass` | `rgba(19, 57, 59, .78)` | Frosted raised surfaces |
| `--paper` | `#f4f1dc` | Primary text and open soil marks |
| `--mist` | `#b9cbc2` | Secondary text; 8.9:1 on ink |
| `--sprout` | `#a8ffc6` | Primary action, focus, live growth |
| `--sprout-ink` | `#082118` | Text on sprout; 14:1 |
| `--sun` | `#ffd37d` | Daily marker and earned fruit |
| `--danger` | `#ffb6ae` | Invalid planting and exhausted dew |

This is an intentionally dark, single-mode world. The page background is always painted, native controls declare `color-scheme: dark`, and no control depends on the browser theme.

## Type

- Display: **Fraunces Variable**, an OFL serif with soft organic terminals. Use it for the wordmark and large headings only.
- Body and controls: **Manrope Variable**, an OFL geometric sans with open counters and tabular numerals.
- Both fonts are self-hosted as WOFF2, use `font-display: swap`, and stay below the combined 120 KB font budget. System fallbacks remain readable before load.
- Scale: 16px body, 18px lead, 20px section intro, 28px card heading, and `clamp(2.4rem, 7vw, 5.8rem)` page heading. Text measure stays below 68 characters.

## Spacing, shape, and depth

- Base spacing unit: 8px. Common steps are 8, 16, 24, 32, 48, 72, and 104px.
- Small controls are never smaller than 44px. Board plots scale to the available width and remain at least 36px on a 390px screen.
- Glass panels use 22px corners with one clipped upper corner, like greenhouse panes cut for irrigation.
- Borders are pale one-pixel etch lines. The active board has a double central axis and inset light, not a floating dashboard shadow.
- A fine procedural star/dew texture is CSS, while the dominant orchard landscape is the only photographic-style raster asset.

## Game rule and interaction grammar

Each board shows a symmetric pattern of glowing soil. The player chooses a branch shape and plants it on the left half. The branch grows across the mirror channel at the same time. Center buds are planted once. Every supplied branch must fit inside unfilled glowing soil. A bad placement spends one of three dew drops; losing all dew ends the run. Undo removes the latest valid branch. Completing the shape ripens the orchard and opens the next teaching board.

The rule is independent: it is a mirrored inventory-tiling system, not a transformation or hidden-axis guessing rule. Pointer and touch select a branch then a plot. Keyboard uses arrow keys to move, number keys to select, `R` to rotate, Enter or Space to plant, `Z` to undo, and Escape to pause. Every plant is described in a polite live region.

### Difficulty curve

- Boards 1–5: single buds and vertical twigs, with an always-visible placement preview.
- Boards 6–12: horizontal twigs, rotation, and mixed inventories.
- Boards 13–20: L branches and narrower gaps.
- Boards 21–30: glass stones create negative space and demand order.
- Boards 31–40: all shapes, larger patterns, and lean inventories.
- The daily and personal seeds choose from the latter rule set. A seed always reconstructs the same board and inventory.

## Motion and feedback

The signature motion is a **dewline reflection**: a planted branch draws on the chosen side, then its reflection arrives 120ms later. UI transitions last 160–240ms. Completion sends one slow highlight up the central channel for 600ms. There is no flashing, looping animation, screen shake, or required timing.

With `prefers-reduced-motion: reduce`, reflection and route transitions become instant opacity changes, smooth scrolling is disabled, and the landscape is static. Audio is off by default; the player can enable short synthesized plant and completion tones after a gesture. The mute choice persists.

## Generated asset prompt sheet

**Use case:** stylized-concept  
**Asset:** wide landing landscape and source for the social preview  
**Subject/world:** a small impossible orchard of translucent glass trees on stepped dark mineral terraces, perfectly reflected across a narrow vertical canal  
**Materials:** hand-blown glass leaves, etched stone planting grid, dew, faint internal botanical light  
**Light/lens:** moonlit pre-dawn, soft volumetric haze, wide editorial landscape, elevated three-quarter view, crisp central reflection axis  
**Palette words:** deep teal-black, oxidized green glass, warm ivory, young-leaf mint, one restrained amber glow  
**Composition:** asymmetrical terraced foreground with quiet negative space in the upper left; central canal remains obvious; no interface mockup  
**Negative list:** no people, no animals, no buildings, no text, no letters, no logos, no watermark, no fruit brands, no fantasy castle, no neon cyberpunk city, no generic gradient blobs

The social image is composed locally from the same scene with product typography kept as real HTML everywhere else.

## Asset provenance

- `public/art/orchard-landscape.webp` and its source PNG: generated for this product with the factory image deployment on 2026-09-01 from the prompt sheet above. No people, brands, or copyrighted characters were requested.
- `public/social-card.jpg`: locally cropped from the generated scene for social previews.
- Game tiles, branch marks, favicon, and interface icons are authored in CSS/SVG/Canvas in this repository.
- Fraunces and Manrope are licensed under the SIL Open Font License through their npm font packages.

Generated imagery is disclosed in the site footer.
