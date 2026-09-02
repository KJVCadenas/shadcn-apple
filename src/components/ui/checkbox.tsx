import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"

import { cn } from "@/lib/utils"

/*
 * The kit's own checkmark, exported from Toggles - Checkboxes rather than
 * borrowed from an icon set. Its bounds are 9.31 x 8.93 inside this 16
 * viewBox, which is exactly what Checkboxes/Width - Checkmark and
 * /Height - Checkmark measure, so scaling the box scales the glyph with it.
 */
const CHECKMARK_PATH =
  "M7.02105 12.465C7.39065 12.465 7.67035 12.3248 7.86015 12.0345L12.4552 " +
  "4.99664C12.5951 4.77639 12.655 4.58618 12.655 4.39596C12.655 3.8954 " +
  "12.2754 3.535 11.756 3.535C11.4063 3.535 11.1966 3.66515 10.9768 " +
  "3.99552L6.99108 10.3126L4.95327 7.75973C4.75349 7.51946 4.54371 7.40934 " +
  "4.24403 7.40934C3.72459 7.40934 3.345 7.77975 3.345 8.29032C3.345 " +
  "8.51057 3.41492 8.7108 3.60472 8.93104L6.18195 12.0746C6.40172 12.3449 " +
  "6.66144 12.465 7.01106 12.465H7.02105Z"

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        [
          "group/checkbox peer relative shrink-0",
          "inline-flex items-center justify-center",
          "appearance-none border-0 outline-none",

          /* Measured geometry — see the CHECKBOX banner in index.css */
          "size-(--toggle-size)",
          "rounded-(--checkbox-radius)",

          /*
           * Idle. A flat fill and nothing else — the kit's box has an
           * empty Stroke and an empty Effects section, so there is no
           * outline to inset and none to drop when the box fills.
           */
          "bg-(--toggle-fill)",

          /*
           * Checked and mixed fill identically: macOS paints the same
           * accent box for both and swaps only the glyph. Base UI sets
           * neither data-checked nor data-unchecked while mixed, so the
           * two states have to be named separately throughout.
           */
          "data-checked:bg-(--macos-blue)",
          "data-indeterminate:bg-(--macos-blue)",
          "text-(--toggle-glyph)",

          /*
           * Clicked, in the kit's vocabulary. An unchecked box darkens
           * its own fill; a filled one darkens the accent.
           */
          "data-unchecked:active:bg-(--toggle-fill-pressed)",
          "data-checked:active:bg-(--toggle-accent-pressed)",
          "data-indeterminate:active:bg-(--toggle-accent-pressed)",

          /* Desktop cursor behavior */
          "cursor-default select-none",

          /* Accessibility */
          "focus-visible:ring-(length:--toggle-focus-ring-width)",
          "focus-visible:ring-(--toggle-focus-ring)",

          /*
           * Disabled. macOS keeps the control legible rather than fading
           * it as a unit: the box takes explicit colours and the glyph
           * drops to half, which is why opacity stays at 100.
           */
          "disabled:pointer-events-none",
          "disabled:opacity-100",
          "disabled:text-(--toggle-glyph-disabled)",
          "data-unchecked:disabled:bg-(--toggle-fill-disabled)",
          "data-checked:disabled:bg-(--toggle-accent-disabled)",
          "data-indeterminate:disabled:bg-(--toggle-accent-disabled)",
        ],
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="group/checkbox-indicator flex items-center justify-center text-current"
      >
        <svg
          data-slot="checkbox-check"
          viewBox="0 0 16 16"
          fill="currentColor"
          aria-hidden
          className={cn(
            "pointer-events-none shrink-0",
            "size-(--toggle-size)",
            "group-data-indeterminate/checkbox-indicator:hidden"
          )}
        >
          <path d={CHECKMARK_PATH} />
        </svg>

        {/* Mixed is a rounded bar the kit draws directly, not a glyph. */}
        <span
          data-slot="checkbox-dash"
          className={cn(
            "pointer-events-none hidden shrink-0",
            "rounded-full bg-current",
            "w-(--toggle-dash-width)",
            "h-(--toggle-dash-height)",
            "group-data-indeterminate/checkbox-indicator:block"
          )}
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
