# CCAR-P Field Notes

A self-contained study companion for the **Claude Certified Architect – Professional (CCAR-P)** exam.

Original condensed notes and self-test questions organized by the seven official exam blueprint domains, plus a timed mock-exam mode. Not an official Anthropic product — an independent study aid.

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

- Notes, blueprint objectives, and a "high-yield" callout per domain
- 4 original self-test questions per domain (28 total) with reveal-answer
- Per-domain "mark reviewed" progress tracking (saved in browser `localStorage`)
- Mock exam mode: 28 shuffled questions, a 53-minute countdown (scaled to the real 63-item / 120-minute ratio), scored results with a per-domain breakdown, and a persisted best score
