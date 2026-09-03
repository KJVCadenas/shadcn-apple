import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, within } from "storybook/test"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

/*
 * macOS: Toggles - Radio Buttons. A 16px circle that fills with the accent
 * and carries a 4.8px white dot — the same control as the checkbox below the
 * glyph, which is why both draw from the shared TOGGLES block.
 *
 * This is NOT the segmented picker in toggle-group.stories.tsx. The kit ships
 * the two as separate components and so does this repo.
 *
 * Every number here except the focus ring is MEASURED off the kit.
 *
 * The label is typed with the body tokens rather than <Label>: that component
 * is still stock shadcn and its `text-xs` is rem-based, so the 13px root
 * renders it at 9.75px. See the rem corollary in index.css.
 */
const labelClass = [
  "flex items-center gap-(--toggle-label-gap) select-none",
  /* macOS dims a disabled label to tertiary rather than fading the row. */
  "has-[[data-slot=radio-group-item]:disabled]:text-(--label-tertiary)",
  "font-sans",
  "text-(length:--font-size-body)",
  "leading-(--line-height-body)",
  "text-(--label-primary)",
].join(" ")

const meta = {
  title: "Components/RadioGroup",
  component: RadioGroupItem,

  parameters: {
    layout: "centered",
  },

  tags: ["autodocs"],

  /*
   * A radio is meaningless alone — exclusivity lives on the group, so every
   * story is wrapped in one and selects by matching `value`.
   */
  decorators: [
    (Story) => (
      <RadioGroup defaultValue="selected">
        <Story />
      </RadioGroup>
    ),
  ],

  argTypes: {
    value: {
      control: "text",
    },

    disabled: {
      control: "boolean",
    },

    required: {
      control: "boolean",
    },

    render: {
      control: false,
      table: {
        disable: true,
      },
    },
  },

  args: {
    value: "selected",
    disabled: false,
    required: false,
  },
} satisfies Meta<typeof RadioGroupItem>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

/*
 * Idle — --toggle-fill, the same flat Fills - Opaque/Primary the checkbox
 * uses, with no stroke and no effect.
 *
 * A radio only latches: unlike a checkbox there is no second click that
 * clears it, so the round trip a checkbox story does would not apply here.
 */
export const Unselected: Story = {
  args: {
    value: "other",
  },

  play: async ({ canvasElement }) => {
    const radio = within(canvasElement).getByRole("radio")

    await expect(radio).not.toBeChecked()

    await userEvent.click(radio)
    await expect(radio).toBeChecked()
  },
}

/* Selected — the circle fills with --macos-blue and the dot paints on top. */
export const Selected: Story = {
  play: async ({ canvasElement }) => {
    const radio = within(canvasElement).getByRole("radio")

    await expect(radio).toBeChecked()
    await expect(
      radio.querySelector("[data-slot=radio-group-indicator]")
    ).toBeVisible()
  },
}

/*
 * The dot only exists while selected — Base UI does not render the indicator
 * otherwise, so an unselected ring is genuinely empty rather than hiding one.
 */
export const UnselectedHasNoDot: Story = {
  args: {
    value: "other",
  },

  play: async ({ canvasElement }) => {
    const radio = within(canvasElement).getByRole("radio")

    await expect(radio.querySelector("[data-slot=radio-group-indicator]")).toBeNull()
  },
}

/*
 * Focus is `focus-visible`, so it only paints for the keyboard — a
 * programmatic focus() would show nothing. Tab into it the way a user does.
 */
export const Focused: Story = {
  play: async ({ canvasElement }) => {
    const radio = within(canvasElement).getByRole("radio")

    await userEvent.tab()
    await expect(radio).toHaveFocus()
  },
}

/*
 * Disabled takes explicit colours rather than one opacity: the kit drops the
 * ring to Fills - Opaque/Tertiary and the label to Labels/Tertiary, which is
 * NSColor.disabledControlTextColor behaviour.
 *
 * Colour is only half of it — a dead macOS control is dead to the pointer too.
 * user-event refuses to click through the disabled:pointer-events-none that
 * enforces it, so the check is waived here to let the click actually land and
 * show that nothing moves.
 */
export const Disabled: Story = {
  args: {
    value: "other",
    disabled: true,
  },

  play: async ({ canvasElement }) => {
    const radio = within(canvasElement).getByRole("radio")

    await userEvent.click(radio, { pointerEventsCheck: 0 })
    await expect(radio).not.toBeChecked()
  },
}

export const DisabledSelected: Story = {
  args: {
    disabled: true,
  },
}

export const WithLabel: Story = {
  render: (args) => (
    <label className={labelClass}>
      <RadioGroupItem {...args} />
      Use the system accent colour
    </label>
  ),
}

/*
 * The shape a macOS settings pane actually uses — and the one place
 * exclusivity is observable, since selecting one has to clear the other.
 */
export const Group: Story = {
  decorators: [(Story) => <Story />],

  play: async ({ canvasElement }) => {
    const [small, medium] = within(canvasElement).getAllByRole("radio")

    await expect(small).toBeChecked()

    await userEvent.click(medium)
    await expect(medium).toBeChecked()
    await expect(small).not.toBeChecked()
  },

  render: () => (
    <RadioGroup defaultValue="small" className="gap-2">
      <label className={labelClass}>
        <RadioGroupItem value="small" />
        Small icons
      </label>

      <label className={labelClass}>
        <RadioGroupItem value="medium" />
        Medium icons
      </label>

      <label className={labelClass}>
        <RadioGroupItem value="large" />
        Large icons
      </label>

      <label className={labelClass}>
        <RadioGroupItem value="huge" disabled />
        Huge icons (unavailable)
      </label>
    </RadioGroup>
  ),
}

export const AllStates: Story = {
  decorators: [(Story) => <Story />],

  render: () => (
    <div className="flex flex-col gap-2">
      <RadioGroup defaultValue="on" className="gap-2">
        <label className={labelClass}>
          <RadioGroupItem value="on" />
          Selected
        </label>

        <label className={labelClass}>
          <RadioGroupItem value="off" />
          Unselected
        </label>
      </RadioGroup>

      <RadioGroup defaultValue="on" className="gap-2">
        <label className={labelClass}>
          <RadioGroupItem value="on" disabled />
          Disabled, selected
        </label>

        <label className={labelClass}>
          <RadioGroupItem value="off" disabled />
          Disabled
        </label>
      </RadioGroup>
    </div>
  ),
}
