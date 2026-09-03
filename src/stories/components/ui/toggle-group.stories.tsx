import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, within } from "storybook/test"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

/*
 * macOS: Selectable Control — a segmented picker, not a column of dots.
 *
 * This shares every --selectable-control-* token with Tabs, so the two render
 * identically and differ only in semantics: Tabs switches a view, this sets a
 * form value. Compare against Components/Tabs — they should be pixel-identical,
 * and if they ever drift, one of them has grown a token the other needs.
 *
 * The column of dots is a different control — see Components/RadioGroup.
 * The kit ships the two separately and so does this repo.
 */
const meta = {
  title: "Components/ToggleGroup",
  component: ToggleGroup,

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
    <ToggleGroup {...args} aria-label="View as" className="w-80">
      <ToggleGroupItem value="icons">Icons</ToggleGroupItem>
      <ToggleGroupItem value="list">List</ToggleGroupItem>
      <ToggleGroupItem value="columns">Columns</ToggleGroupItem>
    </ToggleGroup>
  ),
} satisfies Meta<typeof ToggleGroup>

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
 * via has-[[data-slot=toggle-group-item]:focus-visible]. Keyboard only.
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
    <ToggleGroup {...args} aria-label="View as" className="w-80">
      <ToggleGroupItem value="icons">Icons</ToggleGroupItem>
      <ToggleGroupItem value="list">List</ToggleGroupItem>
      <ToggleGroupItem value="columns" disabled>
        Columns
      </ToggleGroupItem>
    </ToggleGroup>
  ),
}

/* Two segments — each takes half the track, since items are flex-1. */
export const TwoUp: Story = {
  args: {
    defaultValue: "light",
  },

  render: (args) => (
    <ToggleGroup {...args} aria-label="Appearance" className="w-56">
      <ToggleGroupItem value="light">Light</ToggleGroupItem>
      <ToggleGroupItem value="dark">Dark</ToggleGroupItem>
    </ToggleGroup>
  ),
}

/* Five segments — the point at which labels start fighting for width. */
export const FiveUp: Story = {
  args: {
    defaultValue: "week",
  },

  render: (args) => (
    <ToggleGroup {...args} aria-label="Range" className="w-96">
      <ToggleGroupItem value="day">Day</ToggleGroupItem>
      <ToggleGroupItem value="week">Week</ToggleGroupItem>
      <ToggleGroupItem value="month">Month</ToggleGroupItem>
      <ToggleGroupItem value="quarter">Quarter</ToggleGroupItem>
      <ToggleGroupItem value="year">Year</ToggleGroupItem>
    </ToggleGroup>
  ),
}

export const AllStates: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-3">
      <ToggleGroup defaultValue="icons" aria-label="Idle">
        <ToggleGroupItem value="icons">Icons</ToggleGroupItem>
        <ToggleGroupItem value="list">List</ToggleGroupItem>
        <ToggleGroupItem value="columns">Columns</ToggleGroupItem>
      </ToggleGroup>

      <ToggleGroup defaultValue="columns" aria-label="Selected last">
        <ToggleGroupItem value="icons">Icons</ToggleGroupItem>
        <ToggleGroupItem value="list">List</ToggleGroupItem>
        <ToggleGroupItem value="columns">Columns</ToggleGroupItem>
      </ToggleGroup>

      <ToggleGroup defaultValue="icons" aria-label="One item disabled">
        <ToggleGroupItem value="icons">Icons</ToggleGroupItem>
        <ToggleGroupItem value="list">List</ToggleGroupItem>
        <ToggleGroupItem value="columns" disabled>
          Columns
        </ToggleGroupItem>
      </ToggleGroup>

      <ToggleGroup defaultValue="icons" aria-label="Disabled" disabled>
        <ToggleGroupItem value="icons">Icons</ToggleGroupItem>
        <ToggleGroupItem value="list">List</ToggleGroupItem>
        <ToggleGroupItem value="columns">Columns</ToggleGroupItem>
      </ToggleGroup>
    </div>
  ),
}
