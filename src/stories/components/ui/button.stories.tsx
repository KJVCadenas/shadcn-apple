import type { Meta, StoryObj } from "@storybook/react-vite"

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

    disabled: {
      control: "boolean",
    },

    children: {
      control: "text",
    },
  },

  args: {
    children: "Label",
    variant: "default",
    disabled: false,
  },
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

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

export const Disabled: Story = {
  args: {
    variant: "default",
    disabled: true,
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
