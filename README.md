# Drug Mystery Desk

[中文说明](./README_CN.md)

Built in conversation with Minis — my ChatGPT — on the ChatGPT Apps platform. This repo is the public mirror of that project.

药研悬案局 — a detective game set inside clinical-trial fraud. Read the exhibits, connect the clues, break the testimony; only a complete evidence chain closes a case.

## The Cases

| | Case | Theme | Difficulty |
|---|---|---|---|
| 01 | 消失的第七码 (The Vanished Seventh Code) | Data tampering · permissions & timelines | Starter, 15–20 min |
| 02 | 零下七码 (Seven Codes Below Zero) | Sample swapping · physical evidence & chain of custody | Intermediate, 20–25 min |
| 03 | 盲区来客 (Visitor in the Blind Spot) | Identity substitution · blinding & visit routes | Hard, 25–30 min |

All cases are fictional. Nothing here is medical, investment, or compliance advice — the game says so on its own footer.

## Run Locally

```bash
npm install
npm run dev
npm run build
```

Open `http://localhost:3000`. Case progress is stored in the browser's local
storage; no account or database is required.

## Origins

The project started as a local-first evidence notebook for following unresolved
questions in drug research — predictions with confidence levels, snapshots from
ClinicalTrials.gov and openFDA, and a dated history of judgment changes. That
earlier form (the `InvestigationDesk` component and the evidence API route) is
still in the repo but not wired to any route; the mystery game grew out of it
and took over the front page.

## Verification

```bash
npm run lint
npm test
```
