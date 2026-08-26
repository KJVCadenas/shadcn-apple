import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  [
    "group/button",
    "inline-flex w-fit shrink-0 items-center justify-center",
    "appearance-none border-0",
    "whitespace-nowrap select-none",
    "outline-none",

    /* macOS 27 Figma geometry */
    "h-(--button-height)",
    "px-(--button-padding-x)",
    "rounded-(--button-radius)",

    /* macOS 27 Figma typography */
    "font-sans",
    "text-(length:--button-font-size)",
    "leading-(--button-line-height)",
    "font-(--button-font-weight)",

    /* Desktop cursor behavior */
    "cursor-default",

    /* Accessibility */
    "focus-visible:ring-(length:--button-focus-ring-width)",
    "focus-visible:ring-(color:--button-focus-ring)",
    "focus-visible:ring-offset-1",

    /* Disabled */
    "disabled:pointer-events-none",

    /* Icons */
    "[&_svg]:pointer-events-none",
    "[&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        /* macOS: Bordered - Prominent (Default) */
        default: [
          "bg-(--macos-blue)",
          "text-white",

          "active:bg-(--macos-blue-pressed)",

          "disabled:bg-(--button-blue-fill-disabled)",
          "disabled:text-white/50",
        ],

        /*
         * macOS: Bordered
         *
         * Idle     = 8%
         * Clicked  = 16%
         * Disabled = 4%
         */
        secondary: [
          "bg-(--button-neutral-idle)",
          "text-(--label-primary)",

          "active:bg-(--button-neutral-pressed)",

          "disabled:bg-(--button-neutral-disabled)",
          "disabled:text-(--label-tertiary)",
        ],

        /* macOS: Bordered - Tinted */
        outline: [
          "bg-(--button-blue-tint-idle)",
          "text-(--macos-blue)",

          "active:bg-(--button-blue-tint-pressed)",

          "disabled:bg-(--button-blue-tint-disabled)",
          "disabled:text-(--button-blue-tint-label-disabled)",
        ],

        /* macOS: Borderless */
        ghost: [
          "bg-transparent",
          "text-(--macos-blue)",

          "active:text-(--macos-blue-pressed)",

          "disabled:text-(--button-blue-borderless-label-disabled)",
        ],

        /* macOS: Bordered - Prominent Destructive */
        destructive: [
          "bg-(--macos-red)",
          "text-white",

          "active:bg-(--macos-red-pressed)",

          "disabled:bg-(--button-red-fill-disabled)",
          "disabled:text-white/50",
        ],

        /* macOS: Bordered - Destructive */
        "destructive-outline": [
          "bg-(--button-red-tint-idle)",
          "text-(--macos-red)",

          "active:bg-(--button-red-tint-pressed)",

          "disabled:bg-(--button-red-tint-disabled)",
          "disabled:text-(--button-red-tint-label-disabled)",
        ],

        /*
         * Kept for shadcn API compatibility.
         * Apple-style text action.
         */
        link: [
          "h-auto px-0 rounded-none",
          "bg-transparent",
          "text-(--macos-blue)",

          "active:text-(--macos-blue-pressed)",

          "disabled:text-(--button-blue-borderless-label-disabled)",
        ],
      },

      size: {
        /*
         * Figma-authenticated regular Button:
         *
         * Height: 24
         * Padding X: 16
         * Radius: 6
         * Font: 13/16
         *
         * Geometry already comes from the base classes.
         */
        default: "",

        /*
         * Keep these aliases for compatibility for now.
         * Do not invent alternate Apple sizes until their
         * Figma components/tokens are reviewed.
         */
        xs: "",
        sm: "",
        lg: "",

        /*
         * Temporary icon compatibility.
         * Replace once Apple's icon/arrow button component
         * is reviewed separately.
         */
        icon: [
          "size-(--button-height)",
          "px-0",
        ],

        "icon-xs": [
          "size-(--button-height)",
          "px-0",
        ],

        "icon-sm": [
          "size-(--button-height)",
          "px-0",
        ],

        "icon-lg": [
          "size-(--button-height)",
          "px-0",
        ],
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(
        buttonVariants({
          variant,
          size,
          className,
        })
      )}
      {...props}
    />
  )
}

export { Button, buttonVariants }
