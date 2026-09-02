import { Popover as PopoverPrimitive } from "@base-ui/react/popover"

import { cn } from "@/lib/utils"

function Popover({ ...props }: PopoverPrimitive.Root.Props) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

function PopoverTrigger({ ...props }: PopoverPrimitive.Trigger.Props) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

function PopoverContent({
  className,
  align = "center",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  ...props
}: PopoverPrimitive.Popup.Props &
  Pick<
    PopoverPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-50 outline-none"
      >
        <PopoverPrimitive.Popup
          data-slot="popover-content"
          className={cn(
            [
              "relative isolate z-50",

              /* Sized by its content — what it holds owns its own width */
              "w-max",
              "max-h-(--available-height) max-w-(--available-width)",
              "origin-(--transform-origin) overflow-hidden",

              /* The macOS floating surface, one family with the select menu */
              "rounded-(--popover-radius)",
              "bg-popover text-popover-foreground",
              "ring-(length:--popover-stroke-width) ring-(--popover-stroke)",
              "contrast-more:ring-(--label-secondary)",
              "shadow-(--popover-shadow)",

              "font-sans",
              "text-(length:--font-size-body)",
              "leading-(--line-height-body)",

              "outline-none",

              /* The same short native-feeling transition the menu uses */
              "transition-[opacity,transform]",
              "duration-(--popover-transition-duration)",
              "data-starting-style:scale-(--popover-enter-scale)",
              "data-starting-style:opacity-0",
              "data-ending-style:scale-(--popover-enter-scale)",
              "data-ending-style:opacity-0",
              "motion-reduce:transition-none",
            ],
            className
          )}
          {...props}
        />
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  )
}

export { Popover, PopoverContent, PopoverTrigger }
