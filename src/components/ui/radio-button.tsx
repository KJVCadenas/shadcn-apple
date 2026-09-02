import { Radio as RadioPrimitive } from "@base-ui/react/radio"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"

import { cn } from "@/lib/utils"

/*
 * macOS: Toggles - Radio Buttons — a column of dots, and a different
 * control from the segmented picker in radio-group.tsx. The kit ships
 * them as two components, so this repo does too.
 *
 * Everything but the round radius and the dot comes from the shared
 * TOGGLES block, which the checkbox draws from as well.
 */

function RadioButtonGroup({ className, ...props }: RadioGroupPrimitive.Props) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-button-group"
      className={cn(
        [
          /*
           * Semantics and stacking only. The kit's node is a single row,
           * so the space between rows is unmeasured and left to the
           * caller rather than guessed at.
           */
          "flex flex-col items-start",
          "outline-none",
        ],
        className
      )}
      {...props}
    />
  )
}

function RadioButton({ className, ...props }: RadioPrimitive.Root.Props) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-button"
      className={cn(
        [
          "group/radio-button peer relative shrink-0",
          "inline-flex items-center justify-center",
          "appearance-none border-0 outline-none",

          /*
           * The same 16px box as the checkbox; only the radius differs,
           * and at this size that is simply a circle.
           */
          "size-(--toggle-size)",
          "rounded-full",

          /* Idle. A flat fill, no stroke and no effect. */
          "bg-(--toggle-fill)",

          /* Selected fills with the accent and the dot rides on top. */
          "data-checked:bg-(--macos-blue)",
          "text-(--toggle-glyph)",

          /*
           * Clicked, in the kit's vocabulary. An empty ring darkens its
           * own fill; a filled one darkens the accent.
           */
          "data-unchecked:active:bg-(--toggle-fill-pressed)",
          "data-checked:active:bg-(--toggle-accent-pressed)",

          /* Desktop cursor behavior */
          "cursor-default select-none",

          /* Accessibility */
          "focus-visible:ring-(length:--toggle-focus-ring-width)",
          "focus-visible:ring-(--toggle-focus-ring)",

          /*
           * Disabled. macOS keeps the control legible rather than fading
           * it as a unit: the box takes explicit colours and the dot
           * drops to half, which is why opacity stays at 100.
           */
          "disabled:pointer-events-none",
          "disabled:opacity-100",
          "disabled:text-(--toggle-glyph-disabled)",
          "data-unchecked:disabled:bg-(--toggle-fill-disabled)",
          "data-checked:disabled:bg-(--toggle-accent-disabled)",
        ],
        className
      )}
      {...props}
    >
      <RadioPrimitive.Indicator
        data-slot="radio-button-dot"
        className={cn(
          "pointer-events-none shrink-0",
          "rounded-full bg-current",
          "size-(--radio-button-dot-size)"
        )}
      />
    </RadioPrimitive.Root>
  )
}

export { RadioButton, RadioButtonGroup }
