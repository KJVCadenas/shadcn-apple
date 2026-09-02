import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, within } from "storybook/test"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

/*
 * macOS: Selectable Control — a segmented picker, not a column of dots.
 *
 * This shares every --selectable-control-* token with Tabs, so the two render
 * identically and differ only in semantics: Tabs switches a view, this sets a
 * form value. Compare against Components/Tabs — they should be pixel-identical,
 * and if they ever drift, one of them has grown a token the other needs.
 *
 * The stock dot variant is not ported. macOS radio buttons ARE dots, so this
 * mapping is an open question — see "Known gaps" in README.md.
 */
const meta = {
  title: "Components/RadioGroup",
  component: RadioGroup,

  parameters: {
    layout: "centered",
  },

  tags: ["autodocs"],

  argTypes: {
    disabled: {
      control: "boolean",
    },

    readOnly: {
      control: "boolean",
    },

    required: {
      control: "boolean",
    },

    defaultValue: {
      control: false,
      table: {
        disable: true,
      },
    },

    value: {
      control: false,
      table: {
        disable: true,
      },
    },

    onValueChange: {
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
    defaultValue: "icons",
    disabled: false,
    readOnly: false,
    required: false,
  },

  render: (args) => (
    <RadioGroup {...args} aria-label="View as" className="w-80">
      <RadioGroupItem value="icons">Icons</RadioGroupItem>
      <RadioGroupItem value="list">List</RadioGroupItem>
      <RadioGroupItem value="columns">Columns</RadioGroupItem>
    </RadioGroup>
  ),
} satisfies Meta<typeof RadioGroup>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

/*
 * Idle — the first segment carries --selectable-control-segment-selected.
 *
 * The fill is one segment's own data-checked, not an indicator that slides
 * along the track, so what has to hold is that the old segment gives it up as
 * the new one takes it. Clicking back to Icons leaves the story on the state
 * it documents.
 */
export const Idle: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const icons = canvas.getByRole("radio", { name: "Icons" })
    const list = canvas.getByRole("radio", { name: "List" })

    await userEvent.click(list)
    await expect(list).toBeChecked()
    await expect(icons).not.toBeChecked()

    await userEvent.click(icons)
    await expect(icons).toBeChecked()
    await expect(list).not.toBeChecked()
  },
}

/* A selection further along the track. */
export const SelectedLast: Story = {
  args: {
    defaultValue: "columns",
  },
}

/*
 * The focus ring belongs to the track, not the segment — the group draws it
 * via has-[[data-slot=radio-group-item]:focus-visible]. Keyboard only.
 */
export const Focused: Story = {
  play: async ({ canvasElement }) => {
    const selected = within(canvasElement).getByRole("radio", {
      checked: true,
    })

    await userEvent.tab()
    await expect(selected).toHaveFocus()
  },
}

/* Disabled applies to the complete control, never to one segment. */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
}

/*
 * A single dead segment inside a live track. Base UI keeps the disabled radio
 * in the roving tabindex, so the arrow keys still pass over it.
 */
export const DisabledItem: Story = {
  render: (args) => (
    <RadioGroup {...args} aria-label="View as" className="w-80">
      <RadioGroupItem value="icons">Icons</RadioGroupItem>
      <RadioGroupItem value="list">List</RadioGroupItem>
      <RadioGroupItem value="columns" disabled>
        Columns
      </RadioGroupItem>
    </RadioGroup>
  ),
}

/* Two segments — each takes half the track, since items are flex-1. */
export const TwoUp: Story = {
  args: {
    defaultValue: "light",
  },

  render: (args) => (
    <RadioGroup {...args} aria-label="Appearance" className="w-56">
      <RadioGroupItem value="light">Light</RadioGroupItem>
      <RadioGroupItem value="dark">Dark</RadioGroupItem>
    </RadioGroup>
  ),
}

/* Five segments — the point at which labels start fighting for width. */
export const FiveUp: Story = {
  args: {
    defaultValue: "week",
  },

  render: (args) => (
    <RadioGroup {...args} aria-label="Range" className="w-96">
      <RadioGroupItem value="day">Day</RadioGroupItem>
      <RadioGroupItem value="week">Week</RadioGroupItem>
      <RadioGroupItem value="month">Month</RadioGroupItem>
      <RadioGroupItem value="quarter">Quarter</RadioGroupItem>
      <RadioGroupItem value="year">Year</RadioGroupItem>
    </RadioGroup>
  ),
}

export const AllStates: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-3">
      <RadioGroup defaultValue="icons" aria-label="Idle">
        <RadioGroupItem value="icons">Icons</RadioGroupItem>
        <RadioGroupItem value="list">List</RadioGroupItem>
        <RadioGroupItem value="columns">Columns</RadioGroupItem>
      </RadioGroup>

      <RadioGroup defaultValue="columns" aria-label="Selected last">
        <RadioGroupItem value="icons">Icons</RadioGroupItem>
        <RadioGroupItem value="list">List</RadioGroupItem>
        <RadioGroupItem value="columns">Columns</RadioGroupItem>
      </RadioGroup>

      <RadioGroup defaultValue="icons" aria-label="One item disabled">
        <RadioGroupItem value="icons">Icons</RadioGroupItem>
        <RadioGroupItem value="list">List</RadioGroupItem>
        <RadioGroupItem value="columns" disabled>
          Columns
        </RadioGroupItem>
      </RadioGroup>

      <RadioGroup defaultValue="icons" aria-label="Disabled" disabled>
        <RadioGroupItem value="icons">Icons</RadioGroupItem>
        <RadioGroupItem value="list">List</RadioGroupItem>
        <RadioGroupItem value="columns">Columns</RadioGroupItem>
      </RadioGroup>
    </div>
  ),
}
