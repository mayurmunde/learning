# Content guide

How to add or edit study content. Read the content boundaries in `CLAUDE.md`
first — they are the constraint everything here operates under.

## Where content lives

One module per exam in `src/data/`, registered in `src/data/index.js`:

| File                          | Exam                      | Code     |
| ----------------------------- | ------------------------- | -------- |
| `associate-foundations.js`    | Associate — Foundations   | `CCAO-F` |
| `developer-foundations.js`    | Developer — Foundations   | `CCDV-F` |
| `architect-foundations.js`    | Architect — Foundations   | `CCAR-F` |
| `architect-professional.js`   | Architect — Professional  | `CCAR-P` |

No UI change is needed to edit content. Adding a whole new exam needs one import
line in `data/index.js`; everything else is derived.

## Sourcing rules

**Allowed** — factual blueprint data from the public exam guide PDFs:
domain names, weights, listed objectives, item counts, time limits, fees, pass
scores, validity, and documented exam structure.

**Not allowed** — anything from the paid Skilljar prep courses: no transcribed
slides, no copied explanations, no reproduced diagrams. Notes must be written
fresh, in your own words, explaining the concept the objective names.

**Questions must be original.** Never copy a real exam item, and never present
a question as though it came from the live exam. Write scenario-judgment items
in the style the public guides describe.

## Writing field notes

`notes` is the substance of the app. What makes a good entry:

- **Teach the judgment, not the vocabulary.** The exams test which option is
  correct in a scenario, so notes should say when something applies and what it
  beats — not just define it.
- **Name the trap.** Most exam items have a plausible-but-wrong option. If a
  pattern has a recurring distractor, say so explicitly.
- **Keep entries to one idea**, roughly 1–3 sentences. They render as a list;
  long paragraphs read badly there.
- `<b>` and `<i>` are supported for emphasis. Use `<b>` for the term being
  defined, sparingly.

Example of the intended register:

> **Least privilege on tools** — an agent should only hold the tools its role
> actually requires. The fix for a risky, unused, or overbroad tool is removing
> it, not logging or confirming it.

That names the principle, states the rule, and pre-empts the two common wrong
answers in one entry.

### `highYield`

One string per domain: the single pattern most worth memorising. Reserve it for
something that genuinely recurs — if every domain's callout is generic advice,
the callout stops carrying signal.

## Writing self-test questions

Shape:

```js
{
  stem: "A team needs X under constraint Y. Best approach?",
  opts: [
    "A plausible but wrong option",
    "The correct option",
    "A wrong option testing a common confusion",
    "An obviously weak option",
  ],
  answer: 1,          // INDEX into opts — zero-based
  rationale: "Why the right answer is right, and why the tempting ones fail.",
}
```

Rules:

- **`answer` is an index, not a letter.** `answer: 1` means `opts[1]`. This is
  the single easiest thing to get wrong and it silently mis-grades.
- **Four options** keeps it consistent with the real format.
- **Distractors must be plausible.** An item where three options are obviously
  absurd tests nothing. Aim for at least one option that a half-prepared
  candidate would seriously consider.
- **The rationale earns its place by explaining the distractors**, not just
  restating the answer. That is where the learning happens.
- **Scenario over recall.** Prefer "here is a situation, what do you do" to
  "what does X stand for" — that is what the guides describe.
- Aim for 2–4 questions per domain, weighted toward heavier domains.

## Adding a new exam

1. Create `src/data/<track>-<level>.js` exporting one exam object matching the
   schema in `CLAUDE.md`.
2. Import it in `src/data/index.js` and add it to `EXAMS` in pathway order.
3. If the track is new, add it to `TRACKS` with a one-line blurb.
4. Nothing else. Routes, the pathway UI, the weight chart, progress keys, and
   the mock exam all derive from the registry.

## Checks before committing

- [ ] Every `answer` indexes a real element of its `opts` array
- [ ] `weight` (display string) and `weightNum` (number) agree
- [ ] Domain `weightNum` values sum to ~100
- [ ] `id` values are unique within the exam (`d1`, `d2`, …) — they double as
      DOM ids and scroll-spy targets
- [ ] No content copied from the paid prep courses
- [ ] Notes read as explanation, not as a restated objective

A quick way to sanity-check answer indices across a file:

```bash
grep -oE 'answer:[0-9]+' src/data/architect-professional.js | sort | uniq -c
```

Anything above `answer:3` in a four-option bank is a bug.
