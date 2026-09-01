# Mirror Orchard demo

- Demo URL: `https://mirror-orchard.sociobot.in/demo` (local: `http://localhost:4173/demo`)
- Direct query: `/?demo=1` also enters `/demo`.
- Sample: teaching boards 1 and 2 are complete, board 3 has one planted branch, and two personal seeds appear in Recents.
- Reset: choose **Reset demo** in the persistent mint banner.
- Leave: choose **Start for real**. This discards demo data before opening teaching board 1.
- Storage: demo data only uses `localStorage` key `demo:mirror-orchard:v1`. Real progress uses `mirror-orchard:v1` and is never read or written while the demo banner is present.
- Offline check: load `/demo` once, wait for the service worker, disconnect, and reload. The sample remains playable.
