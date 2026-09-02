# Research: native macOS regular checkbox

**Date:** 2026-09-02
**Question:** can `--checkbox-*` be promoted out of `IMPORTED` from public Apple sources?
**Answer:** no. Apple publishes none of it. The numbers came from the Figma UI kit
instead — see the `CHECKBOX` banner in `src/index.css`.

Kept because a negative result is a result. Without this file the next person
spends the same hours rediscovering that the HIG does not carry these figures.

## Target control

```swift
let checkbox = NSButton()
checkbox.setButtonType(.switch)
checkbox.controlSize = .regular
```

Not iOS/iPadOS, not SwiftUI `Toggle(.switch)`, not radio buttons, not mini/small
control sizes.

## Version qualification — the finding with the widest reach

macOS Tahoe changed control appearance and layout. Apple says control sizing
changed and advises against hard-coding control heights.

- [WWDC25: Build an AppKit app with the new design](https://developer.apple.com/videos/play/wwdc2025/310/)
- [`NSView.prefersCompactControlSizeMetrics`](https://developer.apple.com/documentation/appkit/nsview/preferscompactcontrolsizemetrics) — restores macOS 15-and-earlier metrics

**Consequence for this repo:** pre-Tahoe screenshots and measurements are not
current specifications. No banner in `index.css` records which macOS version its
`MEASURED` values came from, which makes every geometry token in this file
half-provenanced. That is a project-wide gap, not a checkbox one.

## What Apple publishes — nothing numeric

| Value | Result |
|---|---|
| Box width/height | UNKNOWN |
| Corner radius | UNKNOWN |
| Border width | UNKNOWN |
| Stroke alignment (inside/centered/outside) | UNKNOWN |
| Checkmark dimensions | UNKNOWN |
| Checkmark stroke weight | UNKNOWN |
| Mixed-state dash dimensions | UNKNOWN |
| Focus ring width/spread/offset/blur | UNKNOWN |
| Focus ring colour and opacity | UNKNOWN |
| Unchecked fill and border colour | UNKNOWN |
| Disabled indicator colours | UNKNOWN |
| Box-to-label gap | UNKNOWN |
| Indicator-to-text baseline offset | UNKNOWN numerically |

Sources confirming the control exists but carrying no dimensions:
[`NSButton.ButtonType.switch`](https://developer.apple.com/documentation/appkit/nsbutton/buttontype/switch),
[`NSControl.ControlSize.regular`](https://developer.apple.com/documentation/appkit/nscontrol/controlsize-swift.enum/regular),
[`NSCell.focusRingType`](https://developer.apple.com/documentation/appkit/nscell/focusringtype),
[`NSCell.drawFocusRingMask(withFrame:in:)`](https://developer.apple.com/documentation/appkit/nscell/drawfocusringmask%28withframe%3Ain%3A%29).

## What Apple does document — behaviour, not geometry

- **Checked fill is the system accent.**
  [`NSColor.controlAccentColor`](https://developer.apple.com/documentation/appkit/nscolor/controlaccentcolor).
  The user can change it, so no fixed hex is "the" macOS checkbox blue. A runtime
  accent token is the defensible shape; the exact compositing formula is unknown.
  [HIG: Color](https://developer.apple.com/design/human-interface-guidelines/color)
- **Disabled labels use a separate semantic colour**, not a blanket control opacity.
  [`NSColor.disabledControlTextColor`](https://developer.apple.com/documentation/appkit/nscolor/disabledcontroltextcolor).
  The label dims while staying readable. This matches the CLAUDE.md convention
  ("disabled uses explicit colors, not `opacity`") and contradicts the current
  `disabled:opacity-(--selectable-control-disabled-opacity)` in `checkbox.tsx`.

## Historical contrasts — do not use as current spec

- Full-size checkbox described as `18 x 18` px **including shadow** in an
  archived HIG PDF. Control bounding box, not the visible square, and pre-Tahoe.
  [mirror](https://www.multimedialab.be/doc/tech/doc_osx_hi_guidelines.pdf)
- `8px` between an *introductory label ending in a colon* and the control — not
  the internal box-to-title gap.
  [archived HIG](https://leopard-adc.pepas.com/documentation/UserExperience/Conceptual/AppleHIGuidelines/XHIGControls/XHIGControls.html)

## Conclusion, and what actually closed it

Public Apple sources cannot support a 1:1 reproduction. The report named the
macOS UI kit's `Toggles - Checkboxes` component and `Checkboxes/*` variables as
the one remaining authoritative source — and that kit is the same private Figma
reference this project already used for Labels, Button, Text Field and Select.

Read from it on 2026-09-03: `Width` 16, `Radius` 5.5, `Width - Checkmark` 9.31,
`Height - Checkmark` 8.93, `Accents/Blue` `#0088FF`, row auto-layout gap 3,
idle fill bound to `Fills - Opaque/Primary`, and both Stroke and Effects empty
on the box. The `Fills` ladder reads 10 / 8 / 5 / 3 / 2 % in light and the same
percentages of white in dark, which matches `--fill-*` in `index.css`.

`State` is **Idle / Clicked / Disabled** — there is no `Focused` member, so the
focus ring is not obtainable from this kit at all and its exit condition is a
screenshot of a real focused control, not another Figma pass.

A second pass on 2026-09-03 read the node itself through the Figma MCP rather
than by eye, which settled the rest:

| Value | Reading |
|---|---|
| Idle fill (Off) | `Fills - Opaque/Primary` = `rgba(0,0,0,0.1)` |
| Clicked fill (Off) | `rgba(0,0,0,0.19)` — off the ladder |
| Disabled fill (Off) | `Fills - Opaque/Tertiary` = `rgba(0,0,0,0.05)` |
| Checked / Mixed fill | `Accents/Blue` = `#0088ff` |
| Clicked, checked | accent + `#e6e6e6` in `plus-darker` |
| Disabled, checked | the whole layer at 45% opacity |
| Label | `Labels/Primary`; `Labels/Tertiary` when disabled |
| Mixed glyph | a 6.5 x 2 bar at radius 100 — not an icon |
| Checkmark | a path 9.31 x 8.93 centred in a 16 viewBox |
| Gap | `--radio-button/spacing` = 3px, shared with the radio |

**Disabled does not fade the control as a unit.** The box drops to 45% and the
label switches to `Labels/Tertiary`. That is exactly the
`NSColor.disabledControlTextColor` behaviour the public docs implied, and it
contradicts a blanket `opacity` on the row.

`Toggles - Radio Buttons` (node `121:12141`) was read in the same pass and is
the identical control below the glyph: same 16px box, same fills, same
`plus-darker` Clicked overlay, same 45% Disabled, same label rules. It differs
only in being round and carrying a **4.8px** dot. That is why the shared half
of both lives in one `TOGGLES` block in `index.css`.

Still unsampled: nothing. The focus ring is the only `IMPORTED` value left and
it is not in this kit at all.
