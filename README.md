# shadcn/ui, restyled as macOS

A [shadcn/ui](https://ui.shadcn.com) component set restyled so it reads as
**native macOS**, not as a web app — the same heights, radii, type ramp, label
opacities and state transitions as Apple's real controls.

**[→ Browse the components in Storybook](https://kjvcadenas.github.io/shadcn-apple/)**

> **This is in progress and public on purpose.** Roughly a third of the roadmap
> below is built. Blank rows are not started, and the gaps are documented rather
> than papered over — see [Status](#status) and [Known gaps](#known-gaps).

## What makes it different

- **No glass.** No `backdrop-filter`, no vibrancy, no translucency-over-desktop.
  Liquid Glass is explicitly out of scope. Where Apple uses a material, it is
  reproduced as a *static* color.
- **No invented numbers.** If the real macOS value for a height, inset or radius
  hasn't been confirmed, it isn't guessed. `button.tsx` leaves `size.xs`, `sm`
  and `lg` as empty strings with a comment saying they're compatibility aliases
  awaiting real specs. Every number in `src/index.css` carries a
  [confidence tag](#confidence-tiers) saying where it came from.
- **Tokens only.** Components never hardcode a color or a dimension. A raw hex
  or a `px` literal inside a `.tsx` file is treated as a bug.
- **Base UI, not Radix.** Primitives come from `@base-ui/react/*`.
- **Drop-in shadcn API.** Variant and size names stay compatible even where
  macOS has no equivalent, so components remain swappable.

## Fonts and platform accuracy

**This is a 1:1 macOS match only when viewed on macOS.** The components ask for
the system font — SF — and get it on macOS. On Windows and Linux there is no SF
to resolve, so `system-ui` hands back Segoe UI or the distro's system font
instead. Geometry survives that swap intact, because every height, radius and
inset is a px token rather than something the type drives; what shifts is
x-height, advance width and optical weight, so labels read a little heavier and
wider and vertical centering inside a 24px control looks slightly off. Nothing
breaks — but a Windows viewer comparing a screenshot here against a real macOS
control is comparing two different typefaces.

SF Pro is deliberately not bundled. Apple licenses it for designing and
developing for Apple platforms, which does not extend to self-hosting it on a
public site, and substituting a lookalike such as Inter would make the Storybook
render consistently while quietly misrepresenting the design — the opposite of
what the [confidence tiers](#confidence-tiers) are for. The stack resolves SF
where it already exists and asks for nothing where it does not.

## Confidence tiers

Every token banner in `src/index.css` opens with one of four tags, and a
component inherits its banner's tag. A number only moves up this ladder when
someone does the work that earns the new tier.

| Tag | Means | Earned by |
|---|---|---|
| `MEASURED` | Read off a Figma reference or a screenshot of the real control | Someone measured it |
| `DOCUMENTED` | Apple published this exact number (AppKit API, HIG with a figure) | Citing the page or symbol |
| `DERIVED` | Reasoned from a `MEASURED` value already in the file, or from a stated macOS convention | Naming what it was derived *from* |
| `IMPORTED` | Carried in from another project or a generated mockup; never checked against macOS | Nothing — this is the "unverified" tier |

`IMPORTED` is not a resting place: a block carrying it must also name the values
to re-measure first. `DERIVED` blocks that can never be measured (macOS ships no
such control) state an exit condition instead — the `DATE PICKER` banner in
`src/index.css` is the worked example of both.

## Status

- `Done` — restyled against a macOS reference, tokenised, has a Storybook story.
- `Imported` — builds, is tokenised and has a Storybook story, but the numbers
  came from another project's mockups rather than a macOS reference. See the
  confidence tiers above; the token banner in `index.css` says what to
  re-measure first. A story is necessary for `Done`, not sufficient — `Done`
  also wants a macOS reference behind the numbers.
- `Stock` — the file exists and is wired to Base UI, but it is still stock
  shadcn styling and does *not* match macOS yet.
- Blank — not started.

| Priority | shadcn                       | SwiftUI / macOS equivalent               | Status |
| -------- | ---------------------------- | ---------------------------------------- | ------ |
| **P0**   | `Button`                     | `Button`                                 | Done   |
| **P0**   | `Input`, `InputGroup`        | `TextField`, `SecureField`               | Done   |
| **P0**   | `Textarea`, `Field`, `Label` | `TextEditor` / form layout               | Stock  |
| **P0**   | `Select`                     | Picker / Pop-up Button                   | Done   |
| **P0**   | `Combobox`                   | Combo Box                                |        |
| **P0**   | `Checkbox`                   | `Toggle` checkbox style                  | Done   |
| **P0**   | `RadioGroup`                 | `Picker(.radioGroup)` / radio buttons    | Done   |
| **P0**   | `ToggleGroup`                | Selectable Control (segmented)           | Done   |
| **P0**   | `Switch`                     | `Toggle(.switch)`                        |        |
| **P0**   | `Tabs`                       | Tab View                                 | Done   |
| **P0**   | `DropdownMenu`               | Menu / Pull-down Button                  |        |
| **P0**   | `ContextMenu`                | Contextual Menu                          |        |
| **P0**   | `Dialog`, `AlertDialog`      | Sheet / Alert                            |        |
| **P0**   | `Popover`                    | `Popover`                                | Done   |
| **P0**   | `Tooltip`                    | Help Tag / Tooltip                       |        |
| **P1**   | `DatePicker`, `Calendar`     | `NSDatePicker` (.textField + overlay)    | Done   |
| **P0**   | `Sidebar`                    | NavigationSplitView / Sidebar            |        |
| **P1**   | `Menubar`                    | macOS Menu Bar                           |        |
| **P1**   | `Slider`                     | Slider                                   |        |
| **P1**   | `Progress`                   | ProgressView                             |        |
| **P1**   | `Table` / `DataTable`        | Table / List                             |        |
| **P1**   | `ScrollArea`                 | ScrollView                               |        |
| **P1**   | `Separator`                  | Divider                                  | Stock  |
| **P1**   | `Toggle`                     | Toolbar toggle/button                    |        |
| **P2**   | `Card`                       | GroupBox/custom container                |        |
| **P2**   | `Badge`                      | Label/status treatment                   |        |
| **P2**   | `Accordion` / `Collapsible`  | DisclosureGroup                          |        |

## Running it locally

```bash
pnpm install
pnpm storybook        # the actual workbench — port 6006
```

Storybook is where the work happens: one named story per macOS state, so the
whole state matrix is visible at a glance. The toolbar theme switcher toggles
the `.dark` class, and the a11y panel runs on every story.

```bash
pnpm dev              # scratch page at src/App.tsx — not the point
pnpm lint             # oxlint (not eslint)
pnpm build            # tsc -b && vite build
pnpm test             # vitest, runs the stories
```

## How it's put together

`src/index.css` holds five token layers, each built from the one above — raw
accents, Apple's label/fill opacity ladder, surfaces, shadcn aliases, then
per-component tokens. Components pull from layer 5 and never hardcode.

```
src/
  components/ui/    the components — button.tsx and input.tsx are the references
  stories/          one story file per component, one export per macOS state
  index.css         every token, every confidence banner
```

`CLAUDE.md` carries the full conventions: how to add a component, how to import
one from another project, and the rules the token architecture has to hold to.

## Known gaps

- **The checkbox focus ring cannot come from Figma.** The kit's `State` enum is
  Idle/Clicked/Disabled with no `Focused` member, because macOS draws that ring
  itself. `--checkbox-focus-ring*` is the component's only remaining `IMPORTED`
  value, and it closes with a screenshot of a real focused control rather than
  another trip to the UI kit.
- **`RadioGroup` does not implement the kit's Mixed state.** The kit gives the
  radio the same 6.5 x 2 bar the checkbox uses for mixed. Base UI's radio has
  no indeterminate state and a mixed radio button has no meaning in a form, so
  it is deliberately absent rather than missed.
- **No banner records which macOS version it was measured against.** Apple
  changed control metrics in Tahoe ([WWDC25 session 310][t], and
  `NSView.prefersCompactControlSizeMetrics` exists to restore the old ones), so
  a `MEASURED` tag without an OS version is half a provenance. This affects
  every geometry token in `src/index.css`, not just the checkbox. See
  [`docs/macos-checkbox.md`](docs/macos-checkbox.md).
- **`PopoverContent` carries no padding by design.** The surface draws chrome
  only, so content owns its inset — `Calendar` brings
  `--date-picker-popup-padding`, and plain content must bring its own. Add a
  `--popover-padding` token if that turns out to be the wrong call.
- **`DatePicker` derives its calendar geometry.** macOS ships no complete Date
  Picker in the UI kit, so the 216px width, 24px cells and popover shadow are
  reasoned, not measured. The exit condition is in the `DATE PICKER` banner in
  `src/index.css`.
- **The dark menu shadow is unmeasured.** `--select-popup-shadow` inherits its
  light value in `.dark` — a known gap, not a decision.

## License

MIT — see [LICENSE](LICENSE).

[t]: https://developer.apple.com/videos/play/wwdc2025/310/
