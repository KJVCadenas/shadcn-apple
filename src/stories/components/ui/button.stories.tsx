import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, fn, userEvent, within } from "storybook/test"

import { Button } from "@/components/ui/button"

const meta = {
  title: "Components/Button",
  component: Button,

  parameters: {
    layout: "centered",
  },

  tags: ["autodocs"],

  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "secondary",
        "outline",
        "ghost",
        "destructive",
        "destructive-outline",
        "link",
      ],
    },

    /*
     * xs / sm / lg render identically to default: macOS has one
     * regular Button and no confirmed specs for alternate sizes, so
     * they are compatibility aliases only (see button.tsx size).
     * Listed here so the no-op is visible in autodocs.
     */
    size: {
      control: "select",
      options: [
        "default",
        "xs",
        "sm",
        "lg",
        "icon",
        "icon-xs",
        "icon-sm",
        "icon-lg",
      ],
      description:
        "xs / sm / lg are aliases for default — no confirmed macOS specs yet.",
    },

    disabled: {
      control: "boolean",
    },

    children: {
      control: "text",
    },

    /* Test scaffolding for the click assertions, not a knob — keep it out of autodocs. */
    onClick: {
      control: false,
      table: {
        disable: true,
      },
    },
  },

  args: {
    children: "Label",
    variant: "default",
    disabled: false,
    onClick: fn(),
  },
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

/*
 * A live Prominent button passes the click through to its handler. This is the
 * baseline the Disabled story is measured against — same gesture, no handler.
 */
export const Playground: Story = {
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole("button", { name: "Label" })

    await userEvent.click(button)
    await expect(args.onClick).toHaveBeenCalledTimes(1)
  },
}

export const Prominent: Story = {
  args: {
    variant: "default",
  },
}

export const Bordered: Story = {
  args: {
    variant: "secondary",
  },
}

export const Tinted: Story = {
  args: {
    variant: "outline",
  },
}

export const Borderless: Story = {
  args: {
    variant: "ghost",
  },
}

export const DestructiveProminent: Story = {
  args: {
    variant: "destructive",
  },
}

export const DestructiveBordered: Story = {
  args: {
    variant: "destructive-outline",
  },
}

/*
 * Focus is `focus-visible`, so the ring only paints for the keyboard — a
 * programmatic focus() would show nothing. Tab into it the way a user does.
 */
export const Focused: Story = {
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole("button", { name: "Label" })

    await userEvent.tab()
    await expect(button).toHaveFocus()
  },
}

/*
 * macOS leaves a disabled button in place but inert. Two things make it so —
 * Base UI sets the native disabled attribute, and the variant adds
 * pointer-events-none — and the second is why the pointer-events check has to
 * be switched off: without it user-event declines to click at all, and the
 * story would pass without ever reaching the guard it means to test.
 */
export const Disabled: Story = {
  args: {
    variant: "default",
    disabled: true,
  },

  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole("button", { name: "Label" })

    await userEvent.click(button, { pointerEventsCheck: 0 })
    await expect(args.onClick).not.toHaveBeenCalled()
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Button variant="secondary">Bordered</Button>
        <Button variant="outline">Tinted</Button>
        <Button variant="destructive-outline">
          Destructive
        </Button>
        <Button>Prominent</Button>
        <Button variant="destructive">
          Delete
        </Button>
        <Button variant="ghost">
          Borderless
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="secondary" disabled>
          Bordered
        </Button>

        <Button variant="outline" disabled>
          Tinted
        </Button>

        <Button variant="destructive-outline" disabled>
          Destructive
        </Button>

        <Button disabled>
          Prominent
        </Button>

        <Button variant="destructive" disabled>
          Delete
        </Button>

        <Button variant="ghost" disabled>
          Borderless
        </Button>
      </div>
    </div>
  ),
}
