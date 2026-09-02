import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, within } from "storybook/test"

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

/*
 * Typing is the whole job of a text field, and the restyle rewrites every
 * class on it — this is the smoke test that the Base UI primitive is still
 * carrying keystrokes through to the DOM value.
 */
export const Playground: Story = {
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole("textbox")

    await userEvent.type(input, "Documents")
    await expect(input).toHaveValue("Documents")
  },
}

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

/*
 * The field's ring is plain `focus`, not `focus-visible` — macOS shows the blue
 * stroke and halo however the caret got there. autoFocus has already put it
 * there on mount, so this asserts the state the story arrives in; tabbing would
 * only re-stage what is already true.
 */
export const Focused: Story = {
  args: {
    placeholder: "Placeholder",
    autoFocus: true,
  },

  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("textbox")).toHaveFocus()
  },
}

export const FocusedWithValue: Story = {
  args: {
    defaultValue: "Value",
    autoFocus: true,
  },

  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("textbox")).toHaveFocus()
  },
}

/*
 * macOS keeps a disabled field legible but dead: the native disabled attribute
 * refuses the caret, so the keystrokes never land. The pointer-events check is
 * off only because the component sets pointer-events-none, which user-event
 * would otherwise treat as a reason not to try at all.
 */
export const Disabled: Story = {
  args: {
    placeholder: "Placeholder",
    disabled: true,
  },

  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole("textbox")

    await userEvent.type(input, "Documents", { pointerEventsCheck: 0 })
    await expect(input).toHaveValue("")
  },
}

export const DisabledWithValue: Story = {
  args: {
    defaultValue: "Value",
    disabled: true,
  },
}

/*
 * There is no invalid prop and no invalid state — the red stroke is keyed
 * entirely off aria-invalid: — so the attribute landing on the element is the
 * whole styling contract.
 */
export const Invalid: Story = {
  args: {
    placeholder: "Placeholder",
    "aria-invalid": true,
  },

  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole("textbox")

    await expect(input).toHaveAttribute("aria-invalid", "true")
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
