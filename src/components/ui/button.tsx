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
    "h-[var(--button-height)]",
    "px-[var(--button-padding-x)]",
    "rounded-[var(--button-radius)]",

    /* macOS 27 Figma typography */
    "font-sans",
    "text-[var(--button-font-size)]",
    "leading-[var(--button-line-height)]",
    "font-[var(--button-font-weight)]",

    /* Desktop cursor behavior */
    "cursor-default",

    /* Accessibility */
    "focus-visible:ring-[3px]",
    "focus-visible:ring-[color-mix(in_srgb,var(--macos-blue)_35%,transparent)]",
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
          "bg-[var(--macos-blue)]",
          "text-white",

          "active:bg-[var(--macos-blue-pressed)]",

          "disabled:bg-[color-mix(in_srgb,var(--macos-blue)_40%,transparent)]",
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
          "bg-[var(--button-neutral-idle)]",
          "text-[var(--label-primary)]",

          "active:bg-[var(--button-neutral-pressed)]",

          "disabled:bg-[var(--button-neutral-disabled)]",
          "disabled:text-[var(--label-tertiary)]",
        ],

        /* macOS: Bordered - Tinted */
        outline: [
          "bg-[var(--button-blue-tint-idle)]",
          "text-[var(--macos-blue)]",

          "active:bg-[var(--button-blue-tint-pressed)]",

          "disabled:bg-[var(--button-blue-tint-disabled)]",
          "disabled:text-[color-mix(in_srgb,var(--macos-blue)_40%,transparent)]",
        ],

        /* macOS: Borderless */
        ghost: [
          "bg-transparent",
          "text-[var(--macos-blue)]",

          "active:text-[var(--macos-blue-pressed)]",

          "disabled:text-[color-mix(in_srgb,var(--macos-blue)_50%,transparent)]",
        ],

        /* macOS: Bordered - Prominent Destructive */
        destructive: [
          "bg-[var(--macos-red)]",
          "text-white",

          "active:bg-[var(--macos-red-pressed)]",

          "disabled:bg-[color-mix(in_srgb,var(--macos-red)_40%,transparent)]",
          "disabled:text-white/50",
        ],

        /* macOS: Bordered - Destructive */
        "destructive-outline": [
          "bg-[var(--button-red-tint-idle)]",
          "text-[var(--macos-red)]",

          "active:bg-[var(--button-red-tint-pressed)]",

          "disabled:bg-[var(--button-red-tint-disabled)]",
          "disabled:text-[color-mix(in_srgb,var(--macos-red)_40%,transparent)]",
        ],

        /*
         * Kept for shadcn API compatibility.
         * Apple-style text action.
         */
        link: [
          "h-auto px-0 rounded-none",
          "bg-transparent",
          "text-[var(--macos-blue)]",

          "active:text-[var(--macos-blue-pressed)]",

          "disabled:text-[color-mix(in_srgb,var(--macos-blue)_50%,transparent)]",
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
          "size-[var(--button-height)]",
          "px-0",
        ],

        "icon-xs": [
          "size-[var(--button-height)]",
          "px-0",
        ],

        "icon-sm": [
          "size-[var(--button-height)]",
          "px-0",
        ],

        "icon-lg": [
          "size-[var(--button-height)]",
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
