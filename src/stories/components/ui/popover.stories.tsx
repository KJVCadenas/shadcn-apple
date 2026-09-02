import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, screen, userEvent, waitFor, within } from "storybook/test"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

/*
 * macOS: Popover. An opaque floating surface — hairline ring, layered shadow,
 * a short scale-and-fade on enter — sharing the Select menu's stroke width,
 * enter scale and duration so the two read as one family.
 *
 * The radius and the shadow are DERIVED: eyeballed against a macOS popover,
 * not measured. See the POPOVER SURFACE banner in index.css.
 *
 * PopoverContent deliberately carries NO padding. The surface draws chrome and
 * nothing else, so content owns its own inset — Calendar brings
 * --date-picker-popup-padding, and plain content has to bring its own the way
 * these stories do. Everything below is one family of tokens, no glass:
 * a static ring and shadow, never a backdrop-filter.
 */
const bodyClass = [
  "font-sans",
  "text-(length:--font-size-body)",
  "leading-(--line-height-body)",
  "text-(--label-primary)",
].join(" ")

/* Open stories need room around the trigger for the surface to land in. */
const roomy = (height: string) => [
  (Story: React.ComponentType) => (
    <div className={`flex ${height} items-center justify-center`}>
      <Story />
    </div>
  ),
]

const meta = {
  title: "Components/Popover",
  component: Popover,

  parameters: {
    layout: "centered",
  },

  tags: ["autodocs"],

  argTypes: {
    defaultOpen: {
      control: "boolean",
    },

    modal: {
      control: "boolean",
    },

    open: {
      control: false,
      table: {
        disable: true,
      },
    },

    onOpenChange: {
      control: false,
      table: {
        disable: true,
      },
    },

    children: {
      control: false,
      table: {
        disable: true,
      },
    },
  },

  args: {
    defaultOpen: false,
    modal: false,
  },

  render: (args) => (
    <Popover {...args}>
      <PopoverTrigger render={<Button variant="outline">Open</Button>} />

      <PopoverContent>
        <div className={`w-64 p-3 ${bodyClass}`}>
          A popover draws the surface and nothing else, so its content brings
          its own padding.
        </div>
      </PopoverContent>
    </Popover>
  ),
} satisfies Meta<typeof Popover>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

/* Closed — the trigger alone; click it to watch the enter transition. */
export const Closed: Story = {}

export const Open: Story = {
  args: {
    defaultOpen: true,
  },

  decorators: roomy("h-64"),
}

/*
 * The same surface, reached by clicking. Base UI portals the positioner out of
 * the story canvas, so the trigger comes from the canvas and the surface from
 * `screen`; it exists only once the enter transition has started, hence findBy.
 *
 * Base UI puts role="dialog" on the popup — a macOS popover is a small
 * detached window, and that is what it announces as.
 */
export const OpenByClick: Story = {
  decorators: roomy("h-64"),

  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("button", { name: "Open" })

    await userEvent.click(trigger)

    await expect(trigger).toHaveAttribute("data-popup-open")
    await screen.findByRole("dialog")
  },
}

/*
 * Escape dismisses, the way it dismisses any macOS popover. Base UI does not
 * tear the surface down on close — it leaves the positioner in place under a
 * `hidden` attribute — so gone means gone from the role query, which skips
 * hidden subtrees, and the wait absorbs the exit transition.
 */
export const ClosesOnEscape: Story = {
  decorators: roomy("h-64"),

  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole("button", { name: "Open" })
    )

    await screen.findByRole("dialog")
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
  },
}

/*
 * Modal takes the focus trap and blocks the page behind it. macOS popovers are
 * usually non-modal (click-outside dismisses), which is the default here.
 */
export const Modal: Story = {
  args: {
    defaultOpen: true,
    modal: true,
  },

  decorators: roomy("h-64"),
}

/* Each side, at the 4px default sideOffset. */
export const Sides: Story = {
  decorators: roomy("h-96"),

  render: () => (
    <div className="grid grid-cols-2 gap-16">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <Popover key={side} defaultOpen>
          <PopoverTrigger render={<Button variant="outline">{side}</Button>} />

          <PopoverContent side={side}>
            <div className={`p-2 ${bodyClass}`}>side=&quot;{side}&quot;</div>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  ),
}

/* Alignment along the trigger's edge. */
export const Aligned: Story = {
  decorators: roomy("h-72"),

  render: () => (
    <div className="flex gap-16">
      {(["start", "center", "end"] as const).map((align) => (
        <Popover key={align} defaultOpen>
          <PopoverTrigger render={<Button variant="outline">{align}</Button>} />

          <PopoverContent align={align}>
            <div className={`w-40 p-2 ${bodyClass}`}>
              align=&quot;{align}&quot;
            </div>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  ),
}

/* A form inside the surface — the shape a macOS inspector popover takes. */
export const WithRichContent: Story = {
  args: {
    defaultOpen: true,
  },

  decorators: roomy("h-80"),

  render: (args) => (
    <Popover {...args}>
      <PopoverTrigger render={<Button variant="outline">Inspector</Button>} />

      <PopoverContent align="start">
        <div className="flex w-72 flex-col gap-3 p-3">
          <div
            className={`font-(--date-picker-caption-font-weight) ${bodyClass}`}
          >
            Sharing options
          </div>

          <p
            className={`text-(--label-secondary) leading-(--line-height-body-relaxed) ${bodyClass}`}
          >
            Anyone with the link can view this item. Change who has access from
            the sharing menu.
          </p>

          <Button variant="outline" className="self-start">
            Copy link
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  ),
}
