# Drug Mystery Desk

[中文说明](./README_CN.md)

Built in conversation with Minis — my ChatGPT — on the ChatGPT Apps platform. This repo is the public mirror of that project.

A local-first evidence notebook for following unresolved questions in drug
research. Each case keeps a prediction, its confidence level, snapshots from
ClinicalTrials.gov and openFDA, and a dated history of judgment changes.

## Prerequisites

- Node.js `>=22.13.0`

## Run Locally

```bash
npm install
npm run dev
npm run build
```

Open `http://localhost:3000`. Case data is stored in the browser's local
storage; no account or database is required for this version.

## Current Scope

- create and switch between research cases
- save a prediction, confidence level, review date, and revision criteria
- fetch current trial records from ClinicalTrials.gov
- fetch current drug-label records from openFDA
- compare successive snapshots and record an up, down, or unchanged judgment
- keep all personal notes and case history on the current device

## Safety Boundary

The app organizes public evidence. It does not diagnose, recommend treatment,
verify efficacy, estimate approval probability, or replace the original source
records and professional review.

## Verification

```bash
npm run lint
npm test
```
