import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, within } from "storybook/test"

import { Calendar } from "@/components/ui/calendar"

/*
 * The month grid inside DatePicker's popover. macOS ships no complete Date
 * Picker in its UI kit, so every dimension here — the 216px width, 24px cells,
 * 4px column gap, 3px row gap, 12px padding — is DERIVED, not measured. The
 * DATE PICKER banner in index.css carries the full confidence breakdown and
 * the exit condition (screenshot a real NSDatePicker and compare).
 *
 * `today` is pinned rather than left to the clock: without it this page and
 * any snapshot taken from it change every midnight.
 */
const TODAY = new Date(2026, 8, 2)
const SELECTED = new Date(2026, 8, 15)
const SEPTEMBER = new Date(2026, 8, 1)

const meta = {
  title: "Components/Calendar",
  component: Calendar,

  parameters: {
    layout: "centered",
  },

  tags: ["autodocs"],

  argTypes: {
    showOutsideDays: {
      control: "boolean",
    },

    autoFocus: {
      control: "boolean",
    },

    disabled: {
      control: false,
      table: {
        disable: true,
      },
    },

    selected: {
      control: false,
      table: {
        disable: true,
      },
    },

    onSelect: {
      control: false,
      table: {
        disable: true,
      },
    },

    formatters: {
      control: false,
      table: {
        disable: true,
      },
    },

    components: {
      control: false,
      table: {
        disable: true,
      },
    },

    classNames: {
      control: false,
      table: {
        disable: true,
      },
    },
  },

  args: {
    mode: "single",
    today: TODAY,
    defaultMonth: SEPTEMBER,
    showOutsideDays: false,
    autoFocus: false,
  },
} satisfies Meta<typeof Calendar>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

/*
 * Nothing selected — every day sits at --label-primary on a bare surface.
 *
 * Calendar hands selection to DayPicker rather than holding it, so a click is
 * the only way the accent fill ever lands. DayPicker marks the gridcell, not
 * the button: `data-selected` on the <td> is what day_button reads through its
 * group-data-selected classes. September 2026 is pinned in the meta, so the
 * day's accessible name is the same one on any day of the year.
 *
 * Clicking the same day again clears it — mode="single" without `required` —
 * which leaves the story showing the empty grid it documents.
 */
export const Idle: Story = {
  play: async ({ canvasElement }) => {
    const day = within(canvasElement).getByRole("button", {
      name: "Tuesday, September 15th, 2026",
    })

    const cell = day.closest("[role=gridcell]")

    await userEvent.click(day)
    await expect(cell).toHaveAttribute("data-selected", "true")

    await userEvent.click(day)
    await expect(cell).not.toHaveAttribute("data-selected")
  },
}

/*
 * A selection away from today, so both treatments are visible at once: the
 * 15th takes the accent fill, the 2nd stays accent-colored text.
 */
export const WithSelection: Story = {
  args: {
    selected: SELECTED,
  },
}

/* Today, unselected — accent text at --date-picker-day-font-weight-today. */
export const TodayNotSelected: Story = {}

/*
 * Selecting today is the case the guards in calendar.tsx exist for: selection
 * has to win over the today treatment, or the day paints blue text on a blue
 * fill and disappears. This story is that regression, visible.
 */
export const TodaySelected: Story = {
  args: {
    selected: TODAY,
  },
}

/* Outside days — the leading/trailing month at --label-tertiary. */
export const OutsideDays: Story = {
  args: {
    selected: SELECTED,
    showOutsideDays: true,
  },
}

/*
 * Disabled days use an explicit --label-tertiary rather than an opacity, the
 * way every other control in this set fades a dead element.
 */
export const WithDisabledDays: Story = {
  args: {
    selected: SELECTED,
    disabled: { dayOfWeek: [0, 6] },
  },
}

/*
 * A bounded range. Past the edge, DayPicker marks the nav button aria-disabled
 * rather than disabled, so it keeps its place in the tab order — hence the
 * not-aria-disabled: guards on the hover and pressed fills.
 */
export const BoundedRange: Story = {
  args: {
    selected: SELECTED,
    startMonth: SEPTEMBER,
    endMonth: new Date(2026, 10, 1),
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const previous = canvas.getByRole("button", {
      name: "Go to the Previous Month",
    })

    /* Sitting on startMonth, so back is where the edge treatment shows. */
    await expect(previous).toHaveAttribute("aria-disabled", "true")

    await userEvent.click(
      canvas.getByRole("button", { name: "Go to the Next Month" })
    )

    /*
     * The grid announces the month it displays. That name is DayPicker's own
     * label rather than the caption Calendar formats through Intl, so it reads
     * the same whatever locale the runner boots in.
     */
    await expect(canvas.getByRole("grid")).toHaveAccessibleName("October 2026")

    /* Back to September, so the story still opens on the edge it documents. */
    await userEvent.click(previous)
    await expect(canvas.getByRole("grid")).toHaveAccessibleName(
      "September 2026"
    )
  },
}

/*
 * Keyboard focus lives on DayPicker's own DayButton, and its ring is narrower
 * than a field's on purpose — cells sit 4px apart across and 3px down, so a
 * field-width halo would overlap its neighbours.
 */
export const Focused: Story = {
  args: {
    selected: SELECTED,
    autoFocus: true,
  },
}

/*
 * A locale that changes the first day of the week and the weekday labels,
 * proving both come from Intl rather than a hardcoded list. macOS drops the
 * trailing period the short weekday format carries in several locales.
 */
export const Localized: Story = {
  args: {
    selected: SELECTED,
    weekStartsOn: 1,
  },
}

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-6">
      <Calendar mode="single" today={TODAY} defaultMonth={SEPTEMBER} />

      <Calendar
        mode="single"
        today={TODAY}
        defaultMonth={SEPTEMBER}
        selected={SELECTED}
      />

      <Calendar
        mode="single"
        today={TODAY}
        defaultMonth={SEPTEMBER}
        selected={TODAY}
      />

      <Calendar
        mode="single"
        today={TODAY}
        defaultMonth={SEPTEMBER}
        selected={SELECTED}
        showOutsideDays
        disabled={{ dayOfWeek: [0, 6] }}
      />
    </div>
  ),
}
