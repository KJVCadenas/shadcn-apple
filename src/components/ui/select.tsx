import * as React from "react"
import { Select as SelectPrimitive } from "@base-ui/react/select"
import {
  CaretDownIcon,
  CaretUpDownIcon,
  CaretUpIcon,
  CheckIcon,
} from "@phosphor-icons/react"

import { cn } from "@/lib/utils"

const Select = SelectPrimitive.Root

function SelectGroup({
  className,
  ...props
}: SelectPrimitive.Group.Props) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn("scroll-my-(--select-popup-padding)", className)}
      {...props}
    />
  )
}

function SelectValue({
  className,
  ...props
}: SelectPrimitive.Value.Props) {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      className={cn(
        "flex min-w-0 flex-1 items-center truncate text-start",
        className
      )}
      {...props}
    />
  )
}

function SelectTrigger({
  className,
  children,
  ...props
}: SelectPrimitive.Trigger.Props) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn(
        // Figma-authenticated geometry
        "flex h-(--select-trigger-height)",
        "w-(--select-trigger-width) max-w-full",
        "items-center justify-between",
        "gap-(--select-trigger-gap)",
        "ps-(--select-trigger-padding-inline-start) pe-0",
        "rounded-(--select-trigger-radius)",

        // Typography
        "font-sans text-(length:--select-trigger-font-size)",
        "leading-(--select-trigger-line-height)",
        "font-(--select-trigger-font-weight)",
        "whitespace-nowrap",
        "text-(--label-primary)",

        // Idle appearance
        "border-0 bg-(--select-trigger-background-idle)",
        "shadow-none appearance-none",

        // Clicked/open appearance
        "active:bg-(--select-trigger-background-clicked)",
        "data-[pressed]:bg-(--select-trigger-background-clicked)",
        "data-[popup-open]:bg-(--select-trigger-background-clicked)",

        // Focus fallback — not present in the supplied Figma variants
        "outline-none ring-offset-0",
        "focus-visible:ring-(length:--select-focus-ring-width)",
        "focus-visible:ring-ring/35",

        // Invalid state
        "aria-invalid:ring-(length:--select-focus-ring-width)",
        "aria-invalid:ring-destructive/35",
        "data-[invalid]:ring-(length:--select-focus-ring-width)",
        "data-[invalid]:ring-destructive/35",

        // Placeholder
        "data-placeholder:text-muted-foreground",

        // Disabled state
        "disabled:pointer-events-none",
        "disabled:bg-(--select-trigger-background-disabled)",
        "disabled:text-(--label-tertiary)",
        "data-[disabled]:pointer-events-none",
        "data-[disabled]:bg-(--select-trigger-background-disabled)",
        "data-[disabled]:text-(--label-tertiary)",

        // Interaction transition
        "select-none",
        "transition-[background-color,box-shadow,color]",
        "duration-(--select-transition-duration)",

        className
      )}
      {...props}
    >
      {children}

      <SelectPrimitive.Icon className="flex size-(--select-trigger-indicator-container-size) shrink-0 items-center justify-center">
        <CaretUpDownIcon
          aria-hidden="true"
          weight="bold"
          className="size-(--select-trigger-indicator-size)"
        />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  side = "bottom",
  sideOffset = 4,
  align = "start",
  alignOffset = 0,
  alignItemWithTrigger = true,
  ...props
}: SelectPrimitive.Popup.Props &
  Pick<
    SelectPrimitive.Positioner.Props,
    | "align"
    | "alignOffset"
    | "side"
    | "sideOffset"
    | "alignItemWithTrigger"
  >) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        alignItemWithTrigger={alignItemWithTrigger}
        className="isolate z-50 outline-none"
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          data-align-trigger={alignItemWithTrigger}
          className={cn(
            "relative isolate z-50",

            // Popup sizing
            "max-h-(--available-height)",
            "max-w-(--available-width)",
            "w-max min-w-(--anchor-width)",
            "origin-(--transform-origin)",
            "overflow-x-hidden overflow-y-auto",

            // Conservative macOS menu treatment
            "rounded-(--select-popup-radius) bg-popover p-(--select-popup-padding)",
            "text-popover-foreground",
            "ring-(length:--select-popup-stroke-width) ring-border",
            "shadow-(--select-popup-shadow)",

            // Short native-feeling transition
            "transition-[opacity,transform] duration-(--select-transition-duration)",
            "data-[starting-style]:scale-(--select-popup-enter-scale)",
            "data-[starting-style]:opacity-0",
            "data-[ending-style]:scale-(--select-popup-enter-scale)",
            "data-[ending-style]:opacity-0",
            "motion-reduce:transition-none",

            className
          )}
          {...props}
        >
          <SelectScrollUpButton />

          <SelectPrimitive.List className="outline-none">
            {children}
          </SelectPrimitive.List>

          <SelectScrollDownButton />
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: SelectPrimitive.GroupLabel.Props) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      className={cn(
        "px-(--select-label-padding-x) py-(--select-label-padding-y)",
        "ps-(--select-label-padding-inline-start)",
        "text-(length:--select-label-font-size)",
        "leading-(--select-label-line-height)",
        "font-(--select-label-font-weight)",
        "text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: SelectPrimitive.Item.Props) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        // Menu-row geometry
        "relative flex min-h-(--select-item-min-height) w-full cursor-default",
        "items-center rounded-(--select-item-radius)",
        "py-(--select-item-padding-block)",
        "pe-(--select-item-padding-inline-end)",
        "ps-(--select-item-padding-inline-start)",

        // Typography
        "text-(length:--select-item-font-size)",
        "leading-(--select-item-line-height)",
        "outline-none select-none",

        // Base UI highlighted state
        "data-[highlighted]:bg-primary",
        "data-[highlighted]:text-primary-foreground",
        "data-[highlighted]:[&_svg]:text-primary-foreground",

        // Disabled state
        "data-[disabled]:pointer-events-none",
        "data-[disabled]:text-(--label-tertiary)",

        // Nested content
        "[&_svg]:pointer-events-none",
        "[&_svg]:shrink-0",
        "*:[span]:last:flex",
        "*:[span]:last:min-w-0",
        "*:[span]:last:items-center",
        "*:[span]:last:gap-(--select-item-gap)",

        className
      )}
      {...props}
    >
      <SelectPrimitive.ItemIndicator className="pointer-events-none absolute start-(--select-item-indicator-inset) flex size-(--select-item-indicator-size) items-center justify-center">
        <CheckIcon
          aria-hidden="true"
          weight="bold"
          className="size-(--select-item-indicator-glyph-size)"
        />
      </SelectPrimitive.ItemIndicator>

      <SelectPrimitive.ItemText className="flex min-w-0 flex-1 items-center gap-(--select-item-gap) whitespace-nowrap">
        {children}
      </SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: SelectPrimitive.Separator.Props) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn(
        "pointer-events-none mx-(--select-separator-inset) my-(--select-separator-spacing)",
        "h-(--select-separator-thickness) bg-border",
        className
      )}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpArrow>) {
  return (
    <SelectPrimitive.ScrollUpArrow
      data-slot="select-scroll-up-button"
      className={cn(
        "sticky top-0 z-10",
        "flex h-(--select-scroll-arrow-height) w-full cursor-default",
        "items-center justify-center",
        "rounded-(--select-scroll-arrow-radius) bg-popover",
        "text-muted-foreground",
        className
      )}
      {...props}
    >
      <CaretUpIcon
        aria-hidden="true"
        weight="bold"
        className="size-(--select-scroll-arrow-glyph-size)"
      />
    </SelectPrimitive.ScrollUpArrow>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownArrow>) {
  return (
    <SelectPrimitive.ScrollDownArrow
      data-slot="select-scroll-down-button"
      className={cn(
        "sticky bottom-0 z-10",
        "flex h-(--select-scroll-arrow-height) w-full cursor-default",
        "items-center justify-center",
        "rounded-(--select-scroll-arrow-radius) bg-popover",
        "text-muted-foreground",
        className
      )}
      {...props}
    >
      <CaretDownIcon
        aria-hidden="true"
        weight="bold"
        className="size-(--select-scroll-arrow-glyph-size)"
      />
    </SelectPrimitive.ScrollDownArrow>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
