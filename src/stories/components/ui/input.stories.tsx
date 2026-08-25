import type { Meta, StoryObj } from "@storybook/react-vite"

import { Input } from "@/components/ui/input"

const meta = {
  title: "Components/Input",
  component: Input,

  parameters: {
    layout: "centered",
  },

  tags: ["autodocs"],

  argTypes: {
    type: {
      control: "select",
      options: [
        "text",
        "email",
        "password",
        "search",
        "number",
        "file",
      ],
    },

    placeholder: {
      control: "text",
    },

    defaultValue: {
      control: "text",
    },

    disabled: {
      control: "boolean",
    },
  },

  args: {
    type: "text",
    placeholder: "Placeholder",
    defaultValue: "",
    disabled: false,
    className: "w-60",
  },
} satisfies Meta<typeof Input>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Idle: Story = {
  args: {
    placeholder: "Placeholder",
  },
}

export const WithValue: Story = {
  args: {
    defaultValue: "Value",
  },
}

export const Focused: Story = {
  args: {
    placeholder: "Placeholder",
    autoFocus: true,
  },
}

export const FocusedWithValue: Story = {
  args: {
    defaultValue: "Value",
    autoFocus: true,
  },
}

export const Disabled: Story = {
  args: {
    placeholder: "Placeholder",
    disabled: true,
  },
}

export const DisabledWithValue: Story = {
  args: {
    defaultValue: "Value",
    disabled: true,
  },
}

export const Invalid: Story = {
  args: {
    placeholder: "Placeholder",
    "aria-invalid": true,
  },
}

export const InvalidWithValue: Story = {
  args: {
    defaultValue: "Value",
    "aria-invalid": true,
  },
}

export const AllStates: Story = {
  render: () => (
    <div className="flex w-60 flex-col gap-3">
      <Input placeholder="Idle" />

      <Input defaultValue="Idle with value" />

      <Input defaultValue="Focused value" autoFocus />

      <Input placeholder="Disabled" disabled />

      <Input defaultValue="Disabled with value" disabled />

      <Input placeholder="Invalid" aria-invalid />

      <Input defaultValue="Invalid with value" aria-invalid />
    </div>
  ),
}
