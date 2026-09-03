# ShadCN - Apple Design System

# Components

**Status**

- `Done` — restyled against a macOS reference, tokenised, has a Storybook story.
- `Imported` — builds, is tokenised and has a Storybook story, but the numbers
  came from another project's mockups rather than a macOS reference. See the
  confidence tiers in `CLAUDE.md`; the token banner in `index.css` says what to
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
  `.claude/research/macos-checkbox.md`.

[t]: https://developer.apple.com/videos/play/wwdc2025/310/
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
