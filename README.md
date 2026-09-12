# Drug Mystery Desk

[中文说明](./README_CN.md)

Started by Codex — OpenAI's cloud coding agent — and then handed to Minis, the open-source on-device AI agent app on my iPhone (you point it at Codex or Claude), which rebuilt it into the mystery game it is now. The project itself is hosted on the ChatGPT Apps platform, which is why the working copy's git lives there; this repo is the public mirror.

药研悬案局 — a detective game set inside clinical-trial fraud. Read the exhibits, connect the clues, break the testimony; only a complete evidence chain closes a case.

**Play online: https://aliceljy.github.io/drug-mystery-desk/** — opens in any phone or desktop browser, nothing to install.

## The Cases

| | Case | Theme | Difficulty |
|---|---|---|---|
| 01 | 消失的第七码 (The Vanished Seventh Code) | Data tampering · permissions & timelines | Starter, 15–20 min |
| 02 | 零下七码 (Seven Codes Below Zero) | Sample swapping · physical evidence & chain of custody | Intermediate, 20–25 min |
| 03 | 盲区来客 (Visitor in the Blind Spot) | Identity substitution · blinding & visit routes | Hard, 25–30 min |
| 04 | 沉默的七小时 (Seven Silent Hours) | AE under-reporting · reporting clock & causality | Hard, 25–30 min |

All cases are fictional. Nothing here is medical, investment, or compliance advice — the game says so on its own footer.

## Run Locally

```bash
npm install
npm run dev
npm run build
```

Open `http://localhost:3000`. Case progress is stored in the browser's local
storage; no account or database is required.

### Single-file build

`npm run build:standalone` bundles the case hub and all four cases into one
self-contained HTML file (`out/standalone/index.html`, about 700 KB, React
inlined, no network requests). That file is what GitHub Pages serves:
`.github/workflows/pages.yml` rebuilds and redeploys it on every push to `main`.
On a desktop you can also just double-click it to play offline.

## Origins

Codex first built this as a local-first evidence notebook for following
unresolved questions in drug research — predictions with confidence levels,
snapshots from ClinicalTrials.gov and openFDA, and a dated history of judgment
changes. When Minis took over, its verdict was that the product loop didn't
hold: a dashboard wearing a detective skin, waiting for databases to change.
So it kept the visual language and the data layer, and rebuilt the middle into
actual cases you can solve now. From that earlier form, the `InvestigationDesk`
component is no longer referenced by any page; the evidence API route
(`/api/evidence`) is still auto-mounted by Next.js's file convention, though
the page no longer calls it — it remains an unauthenticated, read-only proxy
to ClinicalTrials.gov / openFDA that can be disabled if you deploy this
publicly.

## Verification

```bash
npm run lint
npm test
```
