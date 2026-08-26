import {
  createContext,
  useContext,
  type ReactNode,
} from "react"
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const TabsDisabledContext = createContext(false)

type TabsProps = TabsPrimitive.Root.Props & {
  disabled?: boolean
  children?: ReactNode
}

function Tabs({
  className,
  orientation = "horizontal",
  disabled = false,
  children,
  ...props
}: TabsProps) {
  return (
    <TabsDisabledContext.Provider value={disabled}>
      <TabsPrimitive.Root
        data-slot="tabs"
        data-orientation={orientation}
        data-disabled={disabled || undefined}
        aria-disabled={disabled || undefined}
        orientation={orientation}
        className={cn(
          "group/tabs flex gap-2",
          "data-horizontal:flex-col",
          className
        )}
        {...props}
      >
        {children}
      </TabsPrimitive.Root>
    </TabsDisabledContext.Provider>
  )
}

const tabsListVariants = cva(
  [
    "group/tabs-list",
    "relative isolate inline-flex shrink-0",
    "items-center justify-center",
    "outline-none",

    /* Disabled applies to the complete control, not each segment. */
    "data-disabled:pointer-events-none",
    "data-disabled:opacity-[]",
  ],
  {
    variants: {
      variant: {
        default: [
          /* Track */
          "h-[]",
          "w-full",
          "gap-[]",
          "rounded-[]",
          "bg-[]",
          "p-[]",

          /* Pressed track */
          "has-[[data-slot=tabs-trigger]:active]:bg-[]",

          /* Focus ring belongs to the track. */
          "has-[[data-slot=tabs-trigger]:focus-visible]:ring-[length:]",
          "has-[[data-slot=tabs-trigger]:focus-visible]:ring-[color:]",

          /* Preserve the existing vertical API. */
          "group-data-vertical/tabs:h-fit",
          "group-data-vertical/tabs:w-fit",
          "group-data-vertical/tabs:flex-col",
        ],

        /*
         * Retained for ShadCN API compatibility.
         * The default variant is the macOS Selectable Control.
         */
        line: [
          "w-fit gap-1 bg-transparent p-0",
          "group-data-horizontal/tabs:h-8",
          "group-data-vertical/tabs:h-fit",
          "group-data-vertical/tabs:flex-col",
        ],
      },
    },

    defaultVariants: {
      variant: "default",
    },
  }
)

function TabsList({
  className,
  variant = "default",
  activateOnFocus = true,
  ...props
}: TabsPrimitive.List.Props &
  VariantProps<typeof tabsListVariants>) {
  const disabled = useContext(TabsDisabledContext)

  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      data-disabled={disabled || undefined}
      aria-disabled={disabled || undefined}
      activateOnFocus={activateOnFocus}
      className={cn(
        tabsListVariants({
          variant,
          className,
        })
      )}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  disabled,
  ...props
}: TabsPrimitive.Tab.Props) {
  const controlDisabled = useContext(TabsDisabledContext)
  const isDisabled = controlDisabled || disabled

  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      data-control-disabled={controlDisabled || undefined}
      disabled={isDisabled}
      className={cn(
        [
          "relative z-10",
          "inline-flex min-w-0 flex-1",
          "items-center justify-center",

          /* Segment geometry */
          "h-[]",
          "rounded-[]",
          "px-[]",
          "py-[]",

          /* Typography */
          "font-sans",
          "text-[length:]",
          "leading-[]",
          "font-[]",
          "whitespace-nowrap",

          /* Unselected */
          "bg-transparent",
          "text-[]",

          /* Interaction */
          "cursor-default select-none outline-none",
          "hover:text-[]",

          /* Selected — no bold shift and no decorative shadow */
          "data-active:text-[]",
          "group-data-[variant=default]/tabs-list:data-active:bg-[]",

          /* Disabled */
          "disabled:pointer-events-none",
          "disabled:opacity-[]",

          /*
           * The list already applies 40% opacity when the whole
           * control is disabled. Prevent compounded opacity.
           */
          "data-control-disabled:opacity-100",

          /* Vertical compatibility */
          "group-data-vertical/tabs:w-full",

          /* Legacy line variant */
          "group-data-[variant=line]/tabs-list:rounded-none",
          "group-data-[variant=line]/tabs-list:bg-transparent",

          "after:absolute",
          "after:bg-[]",
          "after:opacity-0",

          "group-data-horizontal/tabs:after:inset-x-0",
          "group-data-horizontal/tabs:after:-bottom-1",
          "group-data-horizontal/tabs:after:h-0.5",

          "group-data-vertical/tabs:after:inset-y-0",
          "group-data-vertical/tabs:after:-right-1",
          "group-data-vertical/tabs:after:w-0.5",

          "group-data-[variant=line]/tabs-list:data-active:after:opacity-100",
        ],
        className
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn(
        "flex-1 text-xs/relaxed outline-none",
        className
      )}
      {...props}
    />
  )
}

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  tabsListVariants,
}
