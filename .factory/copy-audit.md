# Landing page copy audit

Checked 2026-09-02. Counts treat hyphenated terms and numerals as one word. No line exceeds 22 words. No line uses a banned term.

| Landing copy | Words | Flag |
| --- | ---: | --- |
| 40 teaching boards · one daily puzzle | 7 | — |
| Learn a symmetry puzzle at your pace | 7 | — |
| For visual puzzle players who want practice boards before the daily challenge. | 12 | — |
| Try it with sample data | 5 | — |
| Opens teaching board 3 with two boards complete. | 8 | Tested by `@claim:demo-sample-state` |
| 40 teaching boards | 3 | — |
| Works offline after your first visit | 6 | Tested by `@claim:offline-reload` |
| Free. No account. | 3 | Tested by `@claim:free-no-account` |
| Teaching board 1 | 3 | — |
| 3 branches | 2 | — |
| Choose a branch. Plant its reflected pair. | 7 | — |
| Choose a puzzle | 3 | — |
| Every teaching board stays open | 5 | Tested by `@claim:archive-open` |
| Start with a teaching board, play today’s puzzle, or enter a seed. | 12 | — |
| Teaching archive | 2 | — |
| 40 ordered boards | 3 | Tested by `@claim:archive-open` |
| Daily puzzle | 2 | — |
| The same seed for everyone today | 6 | Tested by `@claim:daily-seed` |
| Personal seeds | 2 | — |
| Replay a seed using letters, numbers, spaces, or dashes | 9 | Tested by `@claim:seed-reproducible` and input validation |
| How it works | 3 | — |
| Fill the glowing soil in three steps | 7 | — |
| Choose a branch | 3 | — |
| The tray shows each branch you can use once. | 9 | — |
| Plant one side | 3 | — |
| Its reflected branch grows across the center channel. | 8 | — |
| Fill the pattern | 3 | — |
| Use every branch without crossing the glowing edge. | 8 | — |
| Privacy and storage | 3 | — |
| Your play stays on this device | 6 | Tested by `@claim:local-only` |
| The game stores completed boards, open runs, settings, and recent seeds in your browser. | 14 | Tested by persistence claims |
| There are no accounts, ads, leaderboards, payments, or third-party scripts. | 10 | Tested by `@claim:privacy-no-tracking` and `@claim:free-no-account` |
| Mirror Orchard. | 2 | — |
| Plant reflected branch puzzles at your pace. | 7 | — |
| Version 1.0 · Landscape generated for this game with the factory image model. | 13 | — |

## Terminology

| Concept | One term used |
| --- | --- |
| Ordered learning puzzle | teaching board |
| Placeable inventory item | branch |
| Symmetric opposite | reflection |
| Center vertical line | mirror channel |
| Mistake allowance | dew |
| Deterministic input | seed |
| Stored play state | progress |
| Isolated sample state | demo |

Catalog description: “Learn a mirrored planting puzzle through 40 teaching boards, one daily board, and replayable seeds.” It starts with a verb and is 99 characters.
