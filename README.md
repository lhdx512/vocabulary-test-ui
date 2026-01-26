# Vocabulary Test UI

[English](/README.md) | [简体中文](/README.zh-CN.md)

A Next.js (App Router) web UI for a sentence-based English vocabulary estimation test.  
Goal: ship a demo that is both **product-driven** (clear measurement/iteration plan) and **engineering-ready** (clean data/model boundaries).

## Demo
- Local: http://localhost:3000/test

## What this project does
- Presents a sentence-based test flow
- Allows word-level assistance (e.g., clickable words / quick hints) without blocking progression
- Generates a result summary page (current version: demo-level scoring + UX foundation)

## Why (product framing)
Traditional word lists are easy to game and provide weak signal. Sentence-based interaction allows:
- Better coverage of usage/meaning recognition
- More reliable uncertainty capture (what users *almost* know vs totally unknown)
- A path toward adaptive testing (fewer questions for same confidence)

## Current scope (v0)
- Fixed small sentence bank (demo)
- UX improvements:
  - No forced “understanding check” modal interruptions
  - Hint bubble placement avoids covering content
  - “Next” remains usable even during transient translation / hint states
- Results page uses an **error-oriented** summary (instead of “confidence” phrasing)

## Next steps (Cursor phase roadmap)
### 1) Data & structure
- Define a sentence item schema:
  - id, sentence, target words, lemmas/word family id, frequency band, difficulty, metadata
- Split banks by frequency tiers (e.g., high → mid → low frequency), allow dynamic sampling

### 2) Adaptive selection (MVP)
- Maintain a running estimate of vocabulary level and uncertainty
- Select next sentence to maximize information gain:
  - prefer items near current estimate (too easy/too hard give low signal)
- Stop early when uncertainty is below threshold or max questions reached

### 3) Output (MVP)
- Report estimated vocabulary size by word family (with error band)
- Recommend “test +N more sentences” when uncertainty remains high

### 4) Engineering hardening
- Separate concerns:
  - /data (banks, tiers, word family mapping)
  - /lib (selection logic, scoring, stopping rule)
  - /app (UI state machine, pages)
- Add basic telemetry hooks (local-only first): question count, errors, time, skip/hint usage

## Repo structure (suggested)
- app/            Next.js routes (test flow, result)
- components/     UI components
- lib/            scoring + selection logic
- data/           sentence banks + word-family resources (to be added)

## Getting started
### Install
\\\ash
npm install
\\\

### Run
\\\ash
npm run dev
\\\

Open: http://localhost:3000/test

## Version control notes
This repo excludes:
- node_modules/
- .next/
- .env*

## License
MIT (can be added later)
