# Claude Certification Field Notes

A self-contained study companion for the **Claude Certification Program** — all four exams: Associate (Foundations), Developer (Foundations), and Architect (Foundations & Professional).

Original condensed notes and self-test questions organized by each exam's official blueprint domains, with a pathway view showing how the tracks and levels relate, plus a timed mock-exam mode per exam. Not an official Anthropic product — an independent study aid.

## What's inside

- `index.html` — the entire app (HTML/CSS/JS, embedded font, no external dependencies, no build step)

## Running it locally

Just open the file in a browser:

```
start index.html
```

Or, if you'd rather serve it over HTTP (not required, but avoids any `file://` quirks in some browsers):

```
python -m http.server 8000
```

then visit `http://localhost:8000`.

## Features

- **Certification pathway** panel: pick a level to load its notes — Associate (Foundations), Developer (Foundations), or Architect (Foundations → Professional)
- Per exam: blueprint stats, a domain-weight chart, blueprint objectives, condensed field notes, and a "high-yield" callout per domain
- 2–4 original self-test questions per domain, ~14–39 per exam, with reveal-answer
- Per-domain "mark reviewed" progress tracking, scoped per exam (saved in browser `localStorage`)
- Mock exam mode per exam: shuffled questions, a countdown scaled to that exam's real item/minute ratio, scored results with a per-domain breakdown, and a persisted best score per exam
