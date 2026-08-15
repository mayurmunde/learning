# CLAUDE.md

Context for agents working in this repo. Read this before making changes.

## What this is

A study companion for the **Claude Certification Program** — an independent
study aid, **not an official Anthropic product**. It covers all four exams and
provides, per exam: blueprint domains with weights, condensed field notes,
self-test questions, and a timed mock exam with a per-domain score report.

Live at **https://learning.mmunde.in** · repo `mayurmunde/learning`.

## Content boundaries — read this first

This project sits next to proprietary material, so two rules are firm:

1. **Never transcribe or reproduce Anthropic's paid course content.** The
   Skilljar prep courses are access-gated, copyrighted material. Notes here are
   *original writing* derived from the **publicly available exam guide PDFs**
   (blueprint domains, weights, objectives, exam logistics — all published).
2. **Self-test questions must be original.** Real exam items are under NDA and
   are not available anyway. Questions here are written to match the *style and
   cognitive level* described in the public guides. Never present them as real
   exam items — the UI already says so, keep it that way.

Domain names, weights, objectives, and exam stats are factual blueprint data
from the public guides and are fine to state accurately.

## Stack

React 18 · Vite 5 · React Router 6 · plain CSS with custom properties.
No CSS framework, no state library, no test runner yet.

## Commands

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # -> dist/
npm run preview
```

**Node is not installed on the primary dev machine.** Local `npm` commands will
fail there. Builds are verified by deploying — Vercel's container runs the build
and reports success/failure. If you cannot run a build locally, say so rather
than claiming the code compiles.

## Architecture

```
src/
├── main.jsx              entry; BrowserRouter
├── App.jsx               shell: skip link, TopBar, routes, footer
├── data/                 ONE MODULE PER EXAM + registry (see below)
├── hooks/
│   ├── useLocalStorage.js   persistence: review progress, best scores
│   └── useScrollSpy.js      IntersectionObserver -> active domain
├── components/          presentational; no data fetching
├── pages/
│   ├── ExamPage.jsx        notes view
│   └── MockExamPage.jsx    timed runner + grading
└── styles/
    ├── index.css        tokens, reset, @font-face, utilities
    └── app.css          component styles
```

Routes: `/` redirects to the first exam · `/exam/:examId` ·
`/exam/:examId/mock`. Valid `examId`: `assoc-f`, `dev-f`, `arch-f`, `arch-p`.

Data flows one way: `data/` → page → components via props. There is no global
store; persisted state lives in the two localStorage hooks.

## Data schema

Each file in `src/data/` exports one exam object. `src/data/index.js` is the
registry and owns all derived values.

```js
{
  id, code, track, level, name,       // "arch-p", "CCAR-P", "Architect", ...
  fee, items, minutes, passScore, validity,
  examNote,                            // OPTIONAL html string, extra format note
  domains: [{
    id,            // "d1" — also the DOM id and scroll-spy target
    n,             // "01" — display number
    weight,        // "27%" — display string
    weightNum,     // 27 — drives bar widths; keep in sync with `weight`
    title,
    objectives: [string],
    notes: [string],   // may contain <b>/<i>; rendered via dangerouslySetInnerHTML
    highYield: string, // the one pattern most worth memorising
    qs: [{
      stem, opts: [string], answer, rationale
      //                    ^ INDEX into opts, not a letter
    }]
  }]
}
```

Gotchas:

- `answer` is a **zero-based index**. Off-by-one here silently mis-grades.
- `weight` and `weightNum` must agree; only `weightNum` affects the chart.
- `notes` entries are rendered as HTML. They are authored in this repo, never
  user input — do not extend that rendering to anything externally sourced.
- `examNote` is currently only set on `arch-f` (its scenario-based format).

Derived values live in `data/index.js` — `questionCount()` and
`mockDurationMinutes()` (scales mock length by the real item:minute ratio).
Do not hardcode question counts or durations in components.

## CSS conventions

- All colour goes through tokens in `index.css`. Never hardcode a hex in a
  component — light and dark are both defined at token level, so a literal
  breaks one theme.
- Dark mode: `@media (prefers-color-scheme: dark)` plus a `[data-theme]` hook.
  Every token needs a value in the base `:root` block.
- **Grid/flex children that contain scrollable rows need `min-width: 0`.** This
  caused a real bug: `.side-nav` expanded to 2227px and forced the whole page
  into horizontal scroll on phones. Verify `documentElement.scrollWidth ===
  clientWidth` after layout changes.
- Breakpoints in use: 900px (layout collapses to one column), 640px (phone
  padding/type/tap targets), plus 860/700 for specific grids.
- Touch targets on mobile: 44px minimum.

## Deployment

Vercel project `learning` (id `prj_W6SPgWLjd2Vxi4naogFQ9GVi7Dgv`), custom domain
`learning.mmunde.in` (CNAME → `bb627d67393b652c.vercel-dns-017.com`).

The repo is **not** connected to Vercel's Git integration; deploys go through
the API using a token in `.vercel-token` (gitignored — never commit or print
it). `vercel.json` rewrites all paths to `/index.html` so client-side routes
survive a refresh.

See `docs/DEPLOYMENT.md` for the runbook.

## Conventions

- Comments explain *why*, not what. The codebase is deliberately light on them.
- Components stay presentational; persistence and derived data stay in hooks
  and `data/index.js`.
- Accessibility is not optional here: skip link, `aria-pressed` on toggles,
  `role="progressbar"`, `prefers-reduced-motion`. Keep new UI consistent.
- After layout work, check for horizontal overflow at mobile widths.

## Further docs

- `docs/ARCHITECTURE.md` — component and data-flow detail
- `docs/CONTENT-GUIDE.md` — how to add or edit exam content
- `docs/DEPLOYMENT.md` — deploy and domain runbook
