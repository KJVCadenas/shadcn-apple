import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, within } from "storybook/test"

import { Checkbox } from "@/components/ui/checkbox"

/*
 * macOS: Toggle, checkbox style. A 16px box that fills with the accent when
 * checked and drops its inset stroke at the same time.
 *
 * Everything here except the focus ring is MEASURED off the kit's
 * Toggles - Checkboxes component: the 16px box, the 5.5 radius, the flat fill
 * with no stroke, the 3px label gap, the 6.5 x 2 mixed bar and the checkmark
 * path itself. The kit has no Focused variant because macOS draws that ring,
 * so the ring is the one value still unverified.
 *
 * The label is typed with the body tokens rather than <Label>: that component
 * is still stock shadcn and its `text-xs` is rem-based, so the 13px root
 * renders it at 9.75px. See the rem corollary in index.css.
 */
const labelClass = [
  "flex items-center gap-(--toggle-label-gap) select-none",
  /* macOS dims a disabled label to tertiary rather than fading the row. */
  "has-[[data-slot=checkbox]:disabled]:text-(--label-tertiary)",
  "font-sans",
  "text-(length:--font-size-body)",
  "leading-(--line-height-body)",
  "text-(--label-primary)",
].join(" ")

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,

  parameters: {
    layout: "centered",
  },

  tags: ["autodocs"],

  argTypes: {
    checked: {
      control: false,
      table: {
        disable: true,
      },
    },

    onCheckedChange: {
      control: false,
      table: {
        disable: true,
      },
    },

    render: {
      control: false,
      table: {
        disable: true,
      },
    },

    defaultChecked: {
      control: "boolean",
    },

    indeterminate: {
      control: "boolean",
    },

    disabled: {
      control: "boolean",
    },

    required: {
      control: "boolean",
    },
  },

  args: {
    defaultChecked: false,
    indeterminate: false,
    disabled: false,
    required: false,
  },
} satisfies Meta<typeof Checkbox>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

/*
 * Idle — --text-field-fill under a --label-tertiary inset stroke.
 *
 * The pointer path, which is not the keyboard one: the box fills off
 * `data-checked` on the root, so the round trip is what proves the attribute
 * comes back off again. Ending unchecked leaves the story on its idle state.
 */
export const Unchecked: Story = {
  play: async ({ canvasElement }) => {
    const checkbox = within(canvasElement).getByRole("checkbox")

    await userEvent.click(checkbox)
    await expect(checkbox).toBeChecked()

    await userEvent.click(checkbox)
    await expect(checkbox).not.toBeChecked()
  },
}

/* Checked — the box fills with --macos-blue and the stroke goes with it. */
export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
}

/*
 * Mixed — a white dash on the same accent box checked uses. Only the glyph
 * differs; the fill and the dropped stroke are shared.
 *
 * Base UI reports mixed as aria-checked="mixed" and emits neither
 * data-checked nor data-unchecked, so the box keys off data-indeterminate
 * separately rather than riding the checked rule.
 */
export const Indeterminate: Story = {
  args: {
    indeterminate: true,
  },

  play: async ({ canvasElement }) => {
    const checkbox = within(canvasElement).getByRole("checkbox")

    await expect(checkbox).toHaveAttribute("aria-checked", "mixed")

    /* One glyph at a time: the bar paints, the checkmark stays down. */
    await expect(
      checkbox.querySelector("[data-slot=checkbox-check]")
    ).not.toBeVisible()
    await expect(
      checkbox.querySelector("[data-slot=checkbox-dash]")
    ).toBeVisible()
  },
}

/*
 * Focus is `focus-visible`, so it only paints for the keyboard — a
 * programmatic focus() would show nothing. Tab into it the way a user does.
 */
export const Focused: Story = {
  play: async ({ canvasElement }) => {
    const checkbox = within(canvasElement).getByRole("checkbox")
    await userEvent.tab()
    await expect(checkbox).toHaveFocus()
  },
}

export const FocusedChecked: Story = {
  args: {
    defaultChecked: true,
  },

  play: async ({ canvasElement }) => {
    const checkbox = within(canvasElement).getByRole("checkbox")
    await userEvent.tab()
    await expect(checkbox).toHaveFocus()
  },
}

/*
 * Disabled takes explicit colours rather than one opacity: the kit drops the
 * box to Fills - Opaque/Tertiary and the label to Labels/Tertiary, which is
 * NSColor.disabledControlTextColor behaviour.
 *
 * Colour is only half of it — a dead macOS control is dead to the pointer too.
 * user-event refuses to click through the disabled:pointer-events-none that
 * enforces it, so the check is waived here to let the click actually land and
 * show that nothing moves.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
  },

  play: async ({ canvasElement }) => {
    const checkbox = within(canvasElement).getByRole("checkbox")

    await userEvent.click(checkbox, { pointerEventsCheck: 0 })
    await expect(checkbox).not.toBeChecked()
  },
}

export const DisabledChecked: Story = {
  args: {
    defaultChecked: true,
    disabled: true,
  },
}

export const WithLabel: Story = {
  render: (args) => (
    <label className={labelClass}>
      <Checkbox {...args} />
      Show hidden files
    </label>
  ),
}

/* A checkbox list, the shape a macOS settings pane actually uses. */
export const Group: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <label className={labelClass}>
        <Checkbox defaultChecked />
        Show Recents
      </label>

      <label className={labelClass}>
        <Checkbox defaultChecked />
        Show Tags
      </label>

      <label className={labelClass}>
        <Checkbox />
        Show iCloud Drive
      </label>

      <label className={labelClass}>
        <Checkbox disabled />
        Show Network (unavailable)
      </label>
    </div>
  ),
}

/*
 * The fill rule lives here because it needs both boxes on screen: macOS
 * paints mixed exactly like checked and swaps only the glyph, so the two
 * have to be indistinguishable below the dash.
 */
export const AllStates: Story = {
  play: async ({ canvasElement }) => {
    const [, checked, mixed] = within(canvasElement).getAllByRole("checkbox")

    const box = (el: Element) => {
      const style = getComputedStyle(el)
      return { background: style.backgroundColor, shadow: style.boxShadow }
    }

    await expect(box(mixed)).toEqual(box(checked))
  },

  render: () => (
    <div className="flex flex-col gap-2">
      <label className={labelClass}>
        <Checkbox />
        Unchecked
      </label>

      <label className={labelClass}>
        <Checkbox defaultChecked />
        Checked
      </label>

      <label className={labelClass}>
        <Checkbox indeterminate />
        Mixed
      </label>

      <label className={labelClass}>
        <Checkbox disabled />
        Disabled
      </label>

      <label className={labelClass}>
        <Checkbox defaultChecked disabled />
        Disabled, checked
      </label>
    </div>
  ),
}
