---
description: CSS and layout conventions, including the overflow trap that broke mobile
paths:
  - "src/styles/**/*.css"
  - "src/components/**/*.jsx"
  - "src/pages/**/*.jsx"
---

# Styling and layout

## Tokens, always

Every colour comes from a custom property defined in `src/styles/index.css`.
Never hardcode a hex value in a component or in `app.css`.

Light and dark are both defined at token level. A literal colour will look
correct in one theme and broken in the other, and that is easy to miss if you
only ever view one.

Any new token needs a value in the base `:root` block, not only inside the
`prefers-color-scheme: dark` block.

## The `min-width: 0` trap

Grid and flex children default to `min-width: auto`, meaning they refuse to
shrink below their content. A wide child then pushes its track wider instead of
scrolling inside it.

This caused a real bug: `.side-nav` expanded to ~2227px and forced the entire
page into horizontal scroll on phones. The fix is `.layout > * { min-width: 0 }`.

Any horizontal scroller (`.nav-list`, `.topbar-exams`) needs **both** its
`overflow-x` rule **and** a `min-width: 0` ancestor to be contained.

After any layout change, verify in the browser:

```js
document.documentElement.scrollWidth === document.documentElement.clientWidth
```

If those differ, something is overflowing horizontally.

## Breakpoints

| Width  | What changes                                        |
| ------ | --------------------------------------------------- |
| 900px  | Two-column layout collapses; side nav goes horizontal |
| 860px  | Stat strip drops to two columns                      |
| 700px  | Weight-chart label column narrows                    |
| 640px  | Phone padding, display type, 44px tap targets        |

Reuse these rather than introducing new ones.

## Accessibility

Not optional in this project — match the existing level:

- Interactive toggles carry `aria-pressed`.
- Progress bars carry `role="progressbar"` with min/max/now.
- Icon-only controls need an accessible name (`aria-label`).
- Decorative glyphs (checkmarks, arrows) get `aria-hidden="true"`.
- `prefers-reduced-motion` is respected globally; do not reintroduce
  unconditional animation.
- Tap targets on mobile: 44px minimum.

## Sticky header offsets

The sticky header height lives in the `--header-h` token. Anything that scrolls
into view needs `scroll-margin-top` accounting for it, and `useScrollSpy`'s
`offset` must stay in sync — otherwise jump targets hide behind the header and
the active-section highlight fires at the wrong point.
