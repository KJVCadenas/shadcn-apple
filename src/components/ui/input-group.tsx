import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

/*
 * The group draws the text field chrome — fill, inset stroke, focus
 * halo — and the control inside it renders bare. That way an addon
 * (search glyph, clear button, unit label) sits inside the same
 * rounded rect, the way macOS composes a search or token field.
 */
function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={cn(
        [
          "group/input-group relative flex w-full min-w-0 items-center",
          "outline-none",

          /* macOS text field geometry, matched to Input */
          "h-(--text-field-height)",
          "rounded-(--text-field-radius)",
          "pl-(--text-field-inset-left)",
          "pr-(--text-field-inset-right)",

          /* macOS text field typography */
          "font-sans",
          "text-(length:--text-field-font-size)",
          "leading-(--text-field-line-height)",
          "font-(--text-field-font-weight)",

          /* Idle fill and label */
          "bg-(--text-field-fill)",
          "text-(--label-primary)",

          /* Inset stroke, as on Input */
          "shadow-[inset_0_0_0_var(--text-field-stroke-width)_var(--text-field-stroke)]",

          /*
           * Focus and disabled are driven by the control's own state,
           * since the wrapper is never focused itself.
           */
          "has-[[data-slot=input-group-control]:focus]:shadow-[inset_0_0_0_var(--text-field-stroke-width)_var(--macos-blue),0_0_0_var(--text-field-focus-ring-width)_var(--text-field-focus-ring)]",
          "has-[[data-slot=input-group-control]:disabled]:bg-(--text-field-fill-disabled)",
          "has-[[data-slot=input-group-control]:disabled]:text-(--label-primary)",
          "has-[[data-slot=input-group-control]:disabled]:shadow-[inset_0_0_0_var(--text-field-stroke-width)_var(--text-field-stroke-disabled)]",
          "has-disabled:cursor-not-allowed",

          /* Combobox popovers own their chrome, so drop ours */
          "in-data-[slot=combobox-content]:focus-within:shadow-none",

          /*
           * Stacked addons turn the row into a column: the fixed 24px
           * height and the horizontal insets move onto the children.
           */
          "has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-end]]:px-0",
          "has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-start]]:px-0",
          "has-[>textarea]:h-auto",
          "has-[>[data-align=block-end]]:[&>input]:px-(--text-field-inset-left) has-[>[data-align=block-end]]:[&>input]:pt-(--text-field-inset-left)",
          "has-[>[data-align=block-start]]:[&>input]:px-(--text-field-inset-left) has-[>[data-align=block-start]]:[&>input]:pb-(--text-field-inset-right)",
        ],
        className
      )}
      {...props}
    />
  )
}

const inputGroupAddonVariants = cva(
  [
    "flex h-auto items-center justify-center",
    "gap-(--text-field-inset-left)",
    "py-0",

    /* An addon is part of the field, so it takes the text cursor */
    "cursor-text",
    "select-none",

    /* Field typography, at secondary label strength */
    "font-sans",
    "text-(length:--text-field-font-size)",
    "leading-(--text-field-line-height)",
    "font-(--text-field-font-weight)",
    "text-muted-foreground",

    /* Fades with the control it belongs to */
    "group-has-[[data-slot=input-group-control]:disabled]/input-group:opacity-50",

    "[&>kbd]:rounded-none",
    "[&>svg:not([class*='size-'])]:size-4",
  ],
  {
    variants: {
      /*
       * inline-* sits beside the control on the same row; block-* sits
       * above or below it. The negative margins pull nested buttons and
       * keys back to the field's optical edge.
       */
      align: {
        "inline-start":
          "order-first pr-(--text-field-inset-left) has-[>button]:ml-[-0.3rem] has-[>kbd]:ml-[-0.15rem]",
        "inline-end":
          "order-last pl-(--text-field-inset-right) has-[>button]:mr-[-0.3rem] has-[>kbd]:mr-[-0.15rem]",
        "block-start":
          "order-first w-full justify-start px-(--text-field-inset-left) pt-(--text-field-inset-left) group-has-[>input]/input-group:pt-(--text-field-inset-left) [.border-b]:pb-(--text-field-inset-right)",
        "block-end":
          "order-last w-full justify-start px-(--text-field-inset-left) pb-(--text-field-inset-right) group-has-[>input]/input-group:pb-(--text-field-inset-right) [.border-t]:pt-(--text-field-inset-left)",
      },
    },
    defaultVariants: {
      align: "inline-start",
    },
  }
)

function InputGroupAddon({
  className,
  align = "inline-start",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      /*
       * Clicking the field's padding focuses the control, as it does
       * on macOS — except over a button, which handles its own click.
       */
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button")) {
          return
        }
        e.currentTarget.parentElement?.querySelector("input")?.focus()
      }}
      {...props}
    />
  )
}

/*
 * Buttons inside a field are borderless and shorter than a standalone
 * Button, so they read as part of the field rather than on top of it.
 */
const inputGroupButtonVariants = cva(
  "flex items-center gap-2 text-xs shadow-none",
  {
    variants: {
      size: {
        xs: "h-6 gap-1 rounded-none px-1.5 [&>svg:not([class*='size-'])]:size-3.5",
        sm: "gap-1",
        "icon-xs": "size-6 rounded-none p-0 has-[>svg]:p-0",
        "icon-sm": "size-7 p-0 has-[>svg]:p-0",
      },
    },
    defaultVariants: {
      size: "xs",
    },
  }
)

function InputGroupButton({
  className,
  type = "button",
  variant = "ghost",
  size = "xs",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "size" | "type"> &
  VariantProps<typeof inputGroupButtonVariants> & {
    type?: "button" | "submit" | "reset"
  }) {
  return (
    <Button
      type={type}
      data-size={size}
      variant={variant}
      className={cn(inputGroupButtonVariants({ size }), className)}
      {...props}
    />
  )
}

/* Static text inside the field: units, prefixes, counters */
function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        [
          "flex items-center gap-(--text-field-inset-left)",
          "font-sans text-(length:--text-field-font-size) leading-(--text-field-line-height) font-(--text-field-font-weight)",
          "text-muted-foreground",
          "[&_svg]:pointer-events-none",
          "[&_svg:not([class*='size-'])]:size-4",
        ],
        className
      )}
      {...props}
    />
  )
}

/*
 * Inside a group the control is stripped back to bare text: the
 * wrapper already paints the fill, stroke, focus halo and disabled
 * state, so re-drawing them here would double the chrome.
 */
function InputGroupInput({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <Input
      data-slot="input-group-control"
      className={cn(
        [
          "h-full flex-1 rounded-none border-0 px-0 py-0",
          "bg-transparent dark:bg-transparent",
          "outline-none ring-0 shadow-none",
          "focus:shadow-none focus-visible:ring-0",
          "aria-invalid:shadow-none aria-invalid:focus:shadow-none aria-invalid:ring-0",
          "disabled:bg-transparent dark:disabled:bg-transparent",
          "disabled:text-(--label-primary) disabled:opacity-100 disabled:shadow-none",
        ],
        className
      )}
      {...props}
    />
  )
}

/* Same stripping as InputGroupInput, for the multiline control */
function InputGroupTextarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <Textarea
      data-slot="input-group-control"
      className={cn(
        [
          "flex-1 resize-none rounded-none border-0 py-2",
          "bg-transparent dark:bg-transparent",
          "ring-0 shadow-none focus-visible:ring-0",
          "aria-invalid:ring-0",
          "disabled:bg-transparent dark:disabled:bg-transparent",
        ],
        className
      )}
      {...props}
    />
  )
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
}
