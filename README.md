# Claude Certification Field Notes

A React study companion for the **Claude Certification Program** — all four exams: Associate (Foundations), Developer (Foundations), and Architect (Foundations & Professional).

Original condensed notes and self-test questions organized by each exam's official blueprint domains, with a pathway view showing how tracks and levels relate, plus a timed mock-exam mode per exam. Not an official Anthropic product — an independent study aid.

## Stack

- **React 18** + **Vite** (fast dev server, no config to speak of)
- **React Router** for per-exam routes and a dedicated mock-exam route
- Plain CSS with design tokens — light/dark via `prefers-color-scheme`, no CSS framework

## Getting started

Requires [Node.js](https://nodejs.org) 18+.

```bash
npm install
npm run dev        # dev server, usually http://localhost:5173
```

Other scripts:

```bash
npm run build      # production build into dist/
npm run preview    # serve the built output locally
```

## Project structure

```
src/
├── main.jsx                  # entry point, router provider
├── App.jsx                   # app shell, routes, skip link, footer
├── data/
│   ├── index.js              # exam registry, track list, derived helpers
│   ├── associate-foundations.js
│   ├── developer-foundations.js
│   ├── architect-foundations.js
│   └── architect-professional.js
├── hooks/
│   ├── useLocalStorage.js    # persisted review progress + best scores
│   └── useScrollSpy.js       # highlights the domain currently in view
├── components/
│   ├── TopBar.jsx            # sticky exam switcher
│   ├── PathwayNav.jsx        # track/level pathway cards
│   ├── ExamSummary.jsx       # stat strip, weight chart, mock-exam CTA
│   ├── DomainNav.jsx         # sticky side nav with progress + scroll-spy
│   ├── DomainCard.jsx        # one domain: objectives, notes, self-test
│   ├── SelfTest.jsx          # single question with reveal-answer
│   ├── ScoreReport.jsx       # per-domain score breakdown
│   └── BackToTop.jsx
├── pages/
│   ├── ExamPage.jsx          # notes view for one exam
│   └── MockExamPage.jsx      # timed exam runner + grading
└── styles/
    ├── index.css             # tokens, resets, font, utilities
    └── app.css               # component styles
```

## Routes

| Route                   | View                                     |
| ----------------------- | ---------------------------------------- |
| `/`                     | redirects to the first exam              |
| `/exam/:examId`         | notes, objectives, and self-tests        |
| `/exam/:examId/mock`    | timed mock exam and score report         |

`examId` is one of `assoc-f`, `dev-f`, `arch-f`, `arch-p`.

## Features

- **Certification pathway** — cards per track, levels as chips, with the Architect sequence (Foundations → Professional) shown explicitly
- **Scroll-spy side nav** — the domain you're reading stays highlighted; clicking smooth-scrolls to it
- Per exam: blueprint stats, a domain-weight chart, objectives, condensed field notes, and a high-yield callout per domain
- 2–4 original self-test questions per domain with reveal-answer and rationale
- **Progress tracking** — mark domains reviewed; persisted per exam in `localStorage`
- **Mock exam mode** — shuffled questions, countdown scaled to that exam's real item/minute ratio, auto-submit on timeout, per-domain score breakdown, retake, and a persisted best score per exam
- Keyboard-accessible: skip link, focus-visible outlines, ARIA on progress bars and toggles; honours `prefers-reduced-motion`

## Deployment

Deployed on Vercel as a Vite static build. `vercel.json` rewrites all paths to `index.html` so client-side routes resolve on direct navigation and refresh.

Note: the repo is **not** connected to Vercel's Git integration — pushing to GitHub does not deploy. See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for the publish step.

## Documentation

| Doc | Covers |
| --- | --- |
| [`CLAUDE.md`](CLAUDE.md) | Agent context: content boundaries, schema, conventions, gotchas |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Data flow, routing, scroll-spy, mock-exam internals |
| [`docs/CONTENT-GUIDE.md`](docs/CONTENT-GUIDE.md) | Adding or editing exam content and questions |
| [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) | Deploy runbook, custom domain, troubleshooting |

`.claude/rules/` holds path-scoped conventions that load automatically when editing matching files.

## Scope and sourcing

An independent study aid, not an official Anthropic product. Notes are original writing derived from the publicly available exam guide PDFs; self-test questions are original and are not real exam items. Nothing here reproduces Anthropic's paid course content.
