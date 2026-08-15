# Architecture

Detail behind the summary in `CLAUDE.md`.

## Why this shape

The app started as a single ~200KB HTML file. That worked until it carried four
exams, at which point editing content meant scrolling through a monolith and the
navigation had no real state to hang off. The rewrite split it into modules with
three goals: content editable without touching UI, real URLs per exam, and
navigation that reflects reading position.

## Data flow

One direction, no store:

```
src/data/*.js
    │  static exam objects
    ▼
src/data/index.js  ──  registry + derived values
    │                  (questionCount, mockDurationMinutes)
    ▼
pages/ExamPage · pages/MockExamPage
    │  props
    ▼
components/*        presentational only
```

Persisted state is the exception and lives in hooks that wrap `localStorage`:

| Hook                 | Key                         | Holds                              |
| -------------------- | --------------------------- | ---------------------------------- |
| `useReviewProgress`  | `claude-cert-reviewed`      | `{ "arch-p:d1": true }`            |
| `useBestScores`      | `claude-cert-best-scores`   | `{ "arch-p": 86 }`                 |

Both keys are namespaced per exam, so switching tracks never mixes progress.
`useLocalStorage` is the shared primitive; it falls back to in-memory state if
storage throws (private browsing, quota).

## Routing

| Route                | Component       | Notes                              |
| -------------------- | --------------- | ---------------------------------- |
| `/`                  | redirect        | → first exam in `EXAMS`            |
| `/exam/:examId`      | `ExamPage`      | notes, objectives, self-tests      |
| `/exam/:examId/mock` | `MockExamPage`  | timed runner, then score report    |
| `*`                  | redirect        | → first exam                       |

Unknown `examId` renders a small "doesn't exist" view rather than crashing —
`getExam()` returns `undefined` and both pages guard for it.

`BrowserRouter` needs server cooperation: `vercel.json` rewrites every path to
`/index.html`, otherwise a refresh on `/exam/arch-p` 404s.

## Components

| Component      | Responsibility                                              |
| -------------- | ----------------------------------------------------------- |
| `TopBar`       | Sticky brand + exam-code switcher (`NavLink` active state)   |
| `PathwayNav`   | Track cards; levels as chips, arrow shows intended sequence  |
| `ExamSummary`  | Stat strip, optional format note, weight chart, mock CTA     |
| `DomainNav`    | Sticky side nav: progress, scroll-spy highlight, jump links  |
| `DomainCard`   | One domain: objectives, notes, high-yield callout, self-tests|
| `SelfTest`     | Single question, answer hidden until revealed                |
| `ScoreReport`  | Overall %, verdict, per-domain breakdown, retake             |
| `BackToTop`    | Appears past 600px of scroll                                 |

None of them read `localStorage` or the data registry directly — they take
props. That keeps them trivially reusable if a second view ever needs them.

## Scroll-spy

`useScrollSpy(sectionIds, { offset })` drives the side-nav highlight.

- `IntersectionObserver` with `rootMargin: -{offset}px 0px -55% 0px`. The
  bottom margin means a section only counts as "active" once it is meaningfully
  in view, not when its last pixel enters at the bottom of the screen.
- When several sections intersect, the **first in document order** wins, so the
  highlight moves predictably downward as you scroll.
- Fallback: if nothing intersects (a gap between cards), it picks the last
  section whose top has scrolled above the header line.
- `offset` must track the sticky header height. `.domain` also sets
  `scroll-margin-top` so jump targets do not hide under the header.

## Mock exam

`MockExamPage` holds the whole attempt in component state:

- `attempt` — a counter; incrementing it reshuffles and resets everything. This
  is why "Retake" needs no page reload.
- Questions are flattened from all domains and shuffled (Fisher-Yates), each
  carrying its `domainId` so the score report can group by domain.
- The countdown is `setTimeout` per tick rather than `setInterval`, so a slow
  frame cannot queue up overlapping ticks. Hitting zero auto-submits.
- `submittedRef` guards double submission (manual click racing the timer).
- Grading is a `useMemo` over answers; a separate effect records the best score
  once, after results exist.

Mock length is derived, never hardcoded: `mockDurationMinutes()` scales the
question count by the real exam's minutes-per-item so pacing practice stays
representative.

## Styling

Two files, deliberately:

- `index.css` — design tokens, reset, `@font-face`, global utilities. Both
  themes are defined here at token level.
- `app.css` — component styles, plain class names, no nesting or preprocessor.

The font (Big Shoulders Display, OFL) is a static asset in `public/fonts/`
rather than an inline base64 blob, so it caches independently of the JS bundle.

### Layout traps worth knowing

- Grid and flex children default to `min-width: auto` and will refuse to shrink
  below their content, pushing the page wide instead of scrolling internally.
  `.layout > * { min-width: 0 }` exists for exactly this reason.
- Horizontal scrollers (`.nav-list`, `.topbar-exams`) need both the overflow
  rule *and* a `min-width: 0` ancestor to be contained.
- After any layout change, confirm `documentElement.scrollWidth` equals
  `clientWidth` at mobile widths.

## Known gaps

- No test suite. Adding Vitest + Testing Library would be the natural first step;
  grading logic in `MockExamPage` and `useScrollSpy` are the highest-value targets.
- No content linting. A script asserting `answer < opts.length` and
  `weightNum` matching `weight` across all data files would catch the two
  easiest content mistakes.
- Exam weights are hand-entered in two forms (`weight`, `weightNum`).
- Progress is per-browser; there is no account or sync.
