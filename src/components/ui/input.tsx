import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        [
          "w-full min-w-0",
          "appearance-none border-0",
          "outline-none",

          /* macOS text field geometry */
          "h-(--text-field-height)",
          "pl-(--text-field-inset-left)",
          "pr-(--text-field-inset-right)",
          "py-0",
          "rounded-(--text-field-radius)",

          /* macOS text field typography */
          "font-sans",
          "text-(length:--text-field-font-size)",
          "leading-(--text-field-line-height)",
          "font-(--text-field-font-weight)",

          /* Idle fill, label and caret */
          "bg-(--text-field-fill)",
          "text-(--label-primary)",
          "placeholder:text-muted-foreground",
          "caret-(--macos-blue)",

          /*
           * macOS draws the field outline as an inset stroke rather
           * than a border, so the 1px never adds to the 24px height.
           */
          "shadow-[inset_0_0_0_var(--text-field-stroke-width)_var(--text-field-stroke)]",

          /*
           * Focus: the inset stroke turns blue and a 3.5px halo sits
           * outside it. Both live in one shadow so they compose.
           */
          "focus:shadow-[inset_0_0_0_var(--text-field-stroke-width)_var(--macos-blue),0_0_0_var(--text-field-focus-ring-width)_var(--text-field-focus-ring)]",

          /* Invalid: same stroke + halo treatment, in red */
          "aria-invalid:shadow-[inset_0_0_0_var(--text-field-stroke-width)_var(--macos-red)]",
          "aria-invalid:focus:shadow-[inset_0_0_0_var(--text-field-stroke-width)_var(--macos-red),0_0_0_var(--text-field-focus-ring-width)_var(--text-field-focus-ring-invalid)]",

          /* File control inherits the field's own metrics */
          "file:inline-flex",
          "file:h-(--text-field-height)",
          "file:border-0",
          "file:bg-transparent",
          "file:font-sans",
          "file:text-(length:--text-field-font-size)",
          "file:leading-(--text-field-line-height)",
          "file:font-(--text-field-font-weight)",
          "file:text-foreground",

          /*
           * Disabled: macOS fades the fill and the stroke but keeps
           * the label at full strength, so opacity is pinned to 100%
           * and the disabled colors are set explicitly.
           */
          "disabled:pointer-events-none",
          "disabled:opacity-100",
          "disabled:bg-(--text-field-fill-disabled)",
          "disabled:text-(--label-primary)",
          "disabled:shadow-[inset_0_0_0_var(--text-field-stroke-width)_var(--text-field-stroke-disabled)]",
        ],
        className
      )}
      {...props}
    />
  )
}

export { Input }
