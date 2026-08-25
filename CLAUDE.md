# CLAUDE.md

## What this project is

A shadcn/ui component set restyled so it reads as **native macOS**, not as a
web app. The target is a near 1:1 match with Apple's controls: the same
heights, radii, type ramp, label opacities and state transitions.

Reference material is **Apple's Human Interface Guidelines and screenshots of
real macOS controls**. There is no design file to sync from — when a dimension
is unknown, it stays unknown (see "Never invent a number").

The work is done in Storybook. `src/App.tsx` is a scratch page, not the point.

## Non-negotiables

1. **No glass.** No `backdrop-filter`, no `blur()`, no vibrancy, no
   translucency-over-desktop. Liquid Glass is explicitly out of scope. Apple's
   materials are reproduced as *static* colors — see `--fill-vibrant-*` in
   `src/index.css`, which are flat hexes.
2. **Never invent a number.** If the real macOS value for a height, inset or
   radius hasn't been confirmed, do not guess one. Leave the variant empty and
   say so — `button.tsx` does exactly this: `size.xs`, `sm` and `lg` are `""`
   with a comment explaining they're compatibility aliases awaiting real specs.
3. **Tokens first.** Components never hardcode a color or a dimension. Every
   value comes from a CSS variable defined in `src/index.css`. A raw hex or a
   `px` literal inside a `.tsx` file is a bug.
4. **Base UI, not Radix.** Primitives come from `@base-ui/react/*`. Do not add
   `@radix-ui/*`, and do not paste stock shadcn source that imports it.
5. **Keep the shadcn API.** Variant and size names stay compatible even when
   macOS has no equivalent, so components remain drop-in. Neuter them (empty
   string, alias to the real size) rather than deleting them.

## Token architecture (`src/index.css`)

Five layers, each built from the one above. Add tokens at the lowest layer
that makes sense; never skip a layer.

| Layer | Example | Notes |
|---|---|---|
| 1. Raw accents | `--macos-blue`, `--macos-red` | Redefined per mode in `.dark` |
| 2. Labels & fills | `--label-primary`, `--fill-secondary` | Apple's opacity ladder: primary/secondary/tertiary/quaternary/quinary |
| 3. Surfaces | `--window-background`, `--alert-overlay` | |
| 4. shadcn aliases | `--primary`, `--muted`, `--border` | Maps layers 1–3 onto names shadcn expects |
| 5. Component tokens | `--button-height`, `--text-field-radius` | Namespaced per component |

Rules for this file:

- **Derive, don't duplicate.** Pressed and tinted states use
  `color-mix(in srgb, var(--macos-blue) 82%, black)` rather than a second hex,
  so they stay correct when the accent changes per mode.
- **`.dark` overrides only what actually differs.** Most component tokens
  resolve through the label/fill layer and need no dark entry at all. Compare
  the two blocks: `--button-*` geometry appears once, only its neutrals invert.
- The `@theme inline` block at the top is the bridge to Tailwind utilities.
  Add a `--color-*` entry there only when a utility needs to reach a token.
- `--radius-sm/md/lg/xl` are generic fallbacks. Components use their own
  radius token (`--button-radius`, `--text-field-radius`), not these.

## Adding a component

1. **Find the real control.** HIG page + a screenshot of the control in every
   state: idle, hover, pressed, focused, disabled, and invalid where it applies.
2. **Add its tokens** to `src/index.css`, namespaced `--<component>-*`, under a
   banner comment. Put them in `:root`; add a `.dark` entry only for values
   that genuinely change.
3. **Build the component** in `src/components/ui/<name>.tsx` following the
   conventions below.
4. **Write the story** at `src/stories/components/ui/<name>.stories.tsx` — one
   named export per macOS state, so the whole state matrix is visible at a
   glance. See `input.stories.tsx`.
5. **Check both themes** in Storybook (the toolbar theme switcher toggles the
   `.dark` class) and check the a11y panel.
6. **Update the roadmap table** in `README.md`.

## Component conventions

Copy these from `button.tsx`, `input.tsx` and `input-group.tsx` — they are the
reference implementations.

- **Data attributes on every root:** `data-slot="<name>"`, plus
  `data-variant` / `data-size` when the component has variants. CSS in
  `index.css` targets these (see the inactive-window block), and other
  components select on them (`[data-slot=input-group-control]`).
- **Class lists are arrays of strings, grouped by section comment** —
  geometry, typography, colors, then state. One class per line when the line
  carries meaning. `cva` and `cn` both accept arrays.
- **Comment the *why*, in macOS terms.** Name the control state ("macOS:
  Bordered — Tinted"), the percentage ("Idle 20%, Clicked 28%"), or the
  platform behavior ("macOS draws the outline as an inset stroke, so the 1px
  never adds to the 24px height"). Don't restate the class.
- **Tailwind v4 token syntax:**
  `h-(--button-height)`, `rounded-(--text-field-radius)`,
  `text-(length:--button-font-size)`, `font-(--button-font-weight)`.
  The `length:` hint is required for font sizes.
- **Field outlines are inset `shadow`, never `border`,** so a 1px stroke can't
  change the 24px box. Focus composes stroke + halo in one shadow.
- **`cursor-default` on buttons.** This is a desktop UI; a pointer cursor is a
  web tell. Text-entry surfaces get `cursor-text`.
- **Disabled uses explicit colors, not `opacity`.** macOS fades the fill and
  keeps the label legible — hence `disabled:opacity-100` alongside explicit
  `disabled:bg-*` and `disabled:text-*`.
- **Composite controls draw the chrome once,** on the wrapper, and strip it
  from the inner control (`InputGroup` vs `InputGroupInput`). Wrapper state
  comes from the control via `has-[[data-slot=...]:focus]`.
- `cn()` from `@/lib/utils` merges classes. `@/` maps to `src/`.

## Window activity state

Apple dims controls when the window loses focus. That's modeled as
`html[data-window-active="false"]` in the `@layer components` block at the
bottom of `index.css` — **not** as a component prop, and not to be confused
with the pressed state. A host shell (e.g. Tauri) toggles the attribute.

## Commands

```bash
pnpm storybook        # the actual workbench — port 6006
pnpm dev              # scratch page at src/App.tsx
pnpm build            # tsc -b && vite build
pnpm lint             # oxlint (not eslint)
pnpm build-storybook
```

Run `pnpm lint` and `pnpm build` before calling a component done.
