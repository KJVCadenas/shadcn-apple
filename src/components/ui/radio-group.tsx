import { Radio as RadioPrimitive } from "@base-ui/react/radio"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"

import { cn } from "@/lib/utils"

/*
 * The macOS Selectable Control — a segmented picker, not a column of
 * dots. It shares every token with Tabs, because on macOS the two are
 * the same control wearing different semantics: Tabs switches a view,
 * this one sets a form value, and only the latter belongs in a Field.
 *
 * The stock dot variant is not ported. Nothing in the app uses one;
 * add it here when something does.
 */

function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      data-variant="segmented"
      className={cn(
        [
          "group/radio-group",
          "relative isolate inline-flex shrink-0",
          "items-center justify-center",
          "outline-none",

          /* Track */
          "h-(--selectable-control-height)",
          "w-full",
          "gap-(--selectable-control-track-gap)",
          "rounded-(--selectable-control-track-radius)",
          "bg-(--selectable-control-track)",
          "p-(--selectable-control-track-padding)",

          /* Pressed track */
          "has-[[data-slot=radio-group-item]:active]:bg-(--selectable-control-track-pressed)",

          /* Focus ring belongs to the track, not the segment. */
          "has-[[data-slot=radio-group-item]:focus-visible]:ring-(length:--selectable-control-focus-ring-width)",
          "has-[[data-slot=radio-group-item]:focus-visible]:ring-(--selectable-control-focus-ring)",

          /* Disabled applies to the complete control, not each segment. */
          "data-disabled:pointer-events-none",
          "data-disabled:opacity-(--selectable-control-disabled-opacity)",
        ],
        className
      )}
      {...props}
    />
  )
}

function RadioGroupItem({ className, ...props }: RadioPrimitive.Root.Props) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-group-item"
      className={cn(
        [
          "relative z-10",
          "inline-flex min-w-0 flex-1",
          "items-center justify-center",
          "appearance-none border-0",

          /* Segment geometry */
          "h-(--selectable-control-segment-height)",
          "rounded-(--selectable-control-segment-radius)",
          "px-(--selectable-control-segment-padding-x)",
          "py-(--selectable-control-segment-padding-y)",

          /* Typography */
          "font-sans",
          "text-(length:--selectable-control-font-size)",
          "leading-(--selectable-control-line-height)",
          "font-(--selectable-control-font-weight)",
          "whitespace-nowrap",

          /* Unselected */
          "bg-transparent",
          "text-(--selectable-control-label)",

          /* Interaction */
          "cursor-default select-none outline-none",
          "hover:text-(--selectable-control-label-selected)",

          /* Selected — no weight shift and no decorative shadow */
          "data-checked:bg-(--selectable-control-segment-selected)",
          "data-checked:text-(--selectable-control-label-selected)",

          /* Disabled */
          "disabled:pointer-events-none",
          "disabled:opacity-(--selectable-control-disabled-opacity)",
        ],
        className
      )}
      {...props}
    />
  )
}

export { RadioGroup, RadioGroupItem }
