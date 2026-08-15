---
description: Conventions for exam data modules (blueprint data, notes, questions)
paths:
  - "src/data/**/*.js"
---

# Editing exam content

Full guidance: `docs/CONTENT-GUIDE.md`. The rules that matter most here:

## Sourcing

- Notes must be **original writing** derived from the **public exam guide PDFs**.
- Never transcribe the paid Skilljar prep courses.
- Self-test questions must be original and never presented as real exam items.
- Blueprint facts (domain names, weights, objectives, item counts, fees) are
  public and should be stated accurately.

## Schema traps

- `answer` is a **zero-based index into `opts`**, not a letter. Getting this
  wrong silently mis-grades the mock exam.
- `weight` (display string, e.g. `"27%"`) and `weightNum` (number, `27`) must
  agree. Only `weightNum` drives the chart.
- Domain `id` values (`d1`, `d2`, …) double as DOM ids and scroll-spy targets —
  keep them unique within an exam and stable.
- `notes` entries render as HTML (`<b>`, `<i>` only). They are repo-authored;
  never route externally sourced text through that path.

## Quality bar

- Notes teach *judgment* — when something applies and what it beats — not
  vocabulary. Name the common wrong answer where one exists.
- One idea per note, roughly 1–3 sentences.
- Question distractors must be plausible; the rationale should explain why the
  tempting options fail, not just restate the answer.

## Before committing

```bash
# no index should exceed the option count (4-option bank -> max answer:3)
grep -oE 'answer:[0-9]+' src/data/<file>.js | sort | uniq -c
```

Also confirm `weightNum` values sum to roughly 100 across the exam's domains.
