import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, within } from "storybook/test"

import { DatePicker } from "@/components/ui/date-picker"

/*
 * macOS: NSDatePicker in .textField + .yearMonthDay mode with
 * presentsCalendarOverlay — a text field that opens a calendar instead of
 * taking keystrokes, which is why the trigger wears --text-field-* rather
 * than a button's fill.
 *
 * Confidence is mixed and the split matters: the trigger's height, radius and
 * type are MEASURED (they are the Text Field's own tokens), the behavior is
 * DOCUMENTED from AppKit, and everything about the calendar's size is DERIVED.
 * The DATE PICKER banner in index.css spells this out.
 *
 * Controlled on a plain `Date`, so the demo below owns the state — a bare
 * `render` cannot hold a hook.
 */
const SEPTEMBER_15 = new Date(2026, 8, 15)

/* Open stories need room below the trigger for the popover to land in. */
const roomy = (height: string) => [
  (Story: React.ComponentType) => (
    <div className={`flex ${height} items-start justify-center pt-6`}>
      <Story />
    </div>
  ),
]

function DatePickerDemo({
  value: initial,
  onValueChange,
  ...props
}: React.ComponentProps<typeof DatePicker>) {
  const [value, setValue] = useState<Date | undefined>(initial)

  return (
    <DatePicker
      {...props}
      value={value}
      onValueChange={(date) => {
        setValue(date)
        onValueChange?.(date)
      }}
    />
  )
}

const meta = {
  title: "Components/DatePicker",
  component: DatePicker,

  parameters: {
    layout: "centered",
  },

  tags: ["autodocs"],

  argTypes: {
    placeholder: {
      control: "text",
    },

    disabled: {
      control: "boolean",
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
  },

  args: {
    placeholder: "Pick a date",
    disabled: false,
  },

  render: (args) => (
    <div className="w-56">
      <DatePickerDemo {...args} />
    </div>
  ),
} satisfies Meta<typeof DatePicker>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

/*
 * Empty — the placeholder drops to --label-secondary via data-empty, so an
 * unset field reads as a prompt rather than as a value.
 */
export const Empty: Story = {}

/* With a value — Intl's `dateStyle: "long"` in the viewer's locale. */
export const WithValue: Story = {
  args: {
    value: SEPTEMBER_15,
  },
}

/*
 * Open — data-popup-open paints the same blue stroke and halo the text field
 * draws on focus, and tints the label, for as long as the calendar is up.
 */
export const Open: Story = {
  args: {
    value: SEPTEMBER_15,
  },

  decorators: roomy("h-96"),

  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("button")
    await userEvent.click(trigger)
    await expect(trigger).toHaveAttribute("data-popup-open")
  },
}

export const OpenEmpty: Story = {
  decorators: roomy("h-96"),

  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button"))
  },
}

/*
 * Disabled fades the fill and the stroke but keeps the label at full strength
 * — macOS does not dim the text, and the component sets disabled:opacity-100
 * with explicit colors rather than fading the whole control.
 */
export const Disabled: Story = {
  args: {
    value: SEPTEMBER_15,
    disabled: true,
  },
}

export const DisabledEmpty: Story = {
  args: {
    disabled: true,
  },
}

/* A custom placeholder, for a field whose purpose is not "a date". */
export const CustomPlaceholder: Story = {
  args: {
    placeholder: "Due date",
  },
}

/* Focus is keyboard-only, the same focus-visible rule the text field uses. */
export const Focused: Story = {
  args: {
    value: SEPTEMBER_15,
  },

  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("button")
    await userEvent.tab()
    await expect(trigger).toHaveFocus()
  },
}

/* The closed-state ladder at a glance. */
export const AllStates: Story = {
  render: () => (
    <div className="flex w-56 flex-col gap-3">
      <DatePickerDemo />
      <DatePickerDemo value={SEPTEMBER_15} />
      <DatePickerDemo placeholder="Due date" />
      <DatePickerDemo disabled />
      <DatePickerDemo value={SEPTEMBER_15} disabled />
    </div>
  ),
}
