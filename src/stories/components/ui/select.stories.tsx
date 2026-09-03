import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  expect,
  screen,
  userEvent,
  waitFor,
  within,
} from "storybook/test"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

/*
 * macOS: Pop-Up Button. The trigger is a fixed 100px
 * (--select-trigger-width) with a trailing up/down caret, and the menu
 * opens *over* the trigger with the selected row aligned to it
 * (alignItemWithTrigger) — so the open stories need vertical room around
 * the control.
 *
 * Base UI resolves the trigger label from the root's `items` map. Without
 * it `<SelectValue>` prints the raw value ("center" rather than "Center"),
 * because the popup isn't mounted while the menu is closed.
 */
const alignments = {
  left: "Left",
  center: "Center",
  right: "Right",
}

const locations = {
  documents: "Documents",
  downloads: "Downloads",
  desktop: "Desktop",
}

const typefaces = {
  helvetica: "Helvetica Neue",
  sf: "SF Pro",
  times: "Times New Roman",
  newyork: "New York",
}

const fontSizes = Object.fromEntries(
  Array.from({ length: 40 }, (_, i) => [String(i + 8), String(i + 8)])
)

/* Open stories need headroom for a menu that overlays its trigger. */
const roomy = (height: string) => [
  (Story: React.ComponentType) => (
    <div className={`flex ${height} items-center justify-center`}>
      <Story />
    </div>
  ),
]

const meta = {
  title: "Components/Select",
  component: Select,

  parameters: {
    layout: "centered",
  },

  tags: ["autodocs"],

  argTypes: {
    disabled: {
      control: "boolean",
    },

    defaultOpen: {
      control: "boolean",
    },

    modal: {
      control: "boolean",
    },

    items: {
      control: false,
      table: {
        disable: true,
      },
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
    items: alignments,
    disabled: false,
    defaultOpen: false,
    modal: true,
  },

  render: (args) => (
    <Select {...args}>
      <SelectTrigger aria-label="Alignment">
        <SelectValue placeholder="Select" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="left">Left</SelectItem>
        <SelectItem value="center">Center</SelectItem>
        <SelectItem value="right">Right</SelectItem>
      </SelectContent>
    </Select>
  ),
} satisfies Meta<typeof Select>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

/* Idle — nothing selected, so the trigger shows the placeholder. */
export const Idle: Story = {}

/* Idle with a selection. */
export const WithValue: Story = {
  args: {
    defaultValue: "center",
  },
}

/*
 * Open — the trigger holds --select-trigger-background-clicked via
 * data-[popup-open] for as long as the menu is up.
 */
export const Open: Story = {
  args: {
    defaultValue: "center",
    defaultOpen: true,
  },

  decorators: roomy("h-56"),
}

/*
 * The same open state, reached the way a user reaches it. Base UI portals the
 * positioner out of the story canvas, so the trigger comes from the canvas and
 * everything inside the menu comes from `screen`.
 *
 * The menu commits its open state in a rAF after the mousedown, so the trigger
 * still reads closed on the tick the click resolves — hence waitFor rather
 * than a bare assertion. Base UI also puts role="listbox" on the inner List,
 * not on the popup: the popup is role="presentation" while a List is mounted.
 */
export const OpenByClick: Story = {
  args: {
    defaultValue: "center",
  },

  decorators: roomy("h-56"),

  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("combobox", {
      name: "Alignment",
    })

    await userEvent.click(trigger)

    await waitFor(() => expect(trigger).toHaveAttribute("data-popup-open"))
    await screen.findByRole("listbox")
  },
}

/*
 * Picking a row — the pop-up button's whole point. The menu has to be fully
 * open before a row will take a click, so this waits on the trigger's open
 * state rather than on the popup being in the DOM, which happens a frame
 * earlier. The label the trigger keeps afterwards comes from the `items` map:
 * the popup is out of the tree by then and can no longer supply it.
 *
 * Base UI does not tear the menu down on close — it leaves the positioner in
 * place under a `hidden` attribute — so the close is watched through a role
 * query, which ignores hidden subtrees, rather than through an element handle
 * that would never go away. It is polled to null rather than passed to
 * waitForElementToBeRemoved, because the click closes the menu before the
 * assertion runs and that helper throws when the element is already gone.
 */
export const Selects: Story = {
  args: {
    defaultValue: "center",
  },

  decorators: roomy("h-56"),

  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("combobox", {
      name: "Alignment",
    })

    await userEvent.click(trigger)
    await waitFor(() => expect(trigger).toHaveAttribute("data-popup-open"))

    await userEvent.click(screen.getByRole("option", { name: "Right" }))

    await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull())
    await expect(trigger).toHaveTextContent("Right")
  },
}

/*
 * Disabled — the fill fades and the label drops to --label-tertiary.
 *
 * A dead macOS pop-up button is dead to the pointer too. user-event refuses to
 * click through the disabled:pointer-events-none that enforces it, so the
 * check is waived to let the click land and show that no menu follows.
 */
export const Disabled: Story = {
  args: {
    defaultValue: "center",
    disabled: true,
  },

  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("combobox", {
      name: "Alignment",
    })

    await userEvent.click(trigger, { pointerEventsCheck: 0 })
    await expect(screen.queryByRole("listbox")).toBeNull()
  },
}

export const DisabledPlaceholder: Story = {
  args: {
    disabled: true,
  },
}

/*
 * Invalid — reuses the focus-ring geometry in --destructive. Not a Figma
 * variant; carried over from the text field for form parity.
 */
export const Invalid: Story = {
  render: (args) => (
    <Select {...args}>
      <SelectTrigger aria-label="Alignment" aria-invalid>
        <SelectValue placeholder="Select" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="left">Left</SelectItem>
        <SelectItem value="center">Center</SelectItem>
        <SelectItem value="right">Right</SelectItem>
      </SelectContent>
    </Select>
  ),
}

/* A disabled row inside an otherwise live menu. */
export const WithDisabledItem: Story = {
  args: {
    defaultValue: "left",
    defaultOpen: true,
  },

  decorators: roomy("h-56"),

  render: (args) => (
    <Select {...args}>
      <SelectTrigger aria-label="Alignment">
        <SelectValue placeholder="Select" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="left">Left</SelectItem>
        <SelectItem value="center">Center</SelectItem>
        <SelectItem value="right" disabled>
          Right
        </SelectItem>
      </SelectContent>
    </Select>
  ),
}

/*
 * Grouped menu — section headers and a separator, the macOS pattern once a
 * pop-up button carries more than one category. The trigger is widened
 * past its 100px default so the labels aren't truncated.
 */
export const Grouped: Story = {
  args: {
    items: typefaces,
    defaultValue: "helvetica",
    defaultOpen: true,
  },

  decorators: roomy("h-72"),

  render: (args) => (
    <Select {...args}>
      <SelectTrigger aria-label="Typeface" className="w-48">
        <SelectValue placeholder="Select" />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          <SelectLabel>Sans-serif</SelectLabel>
          <SelectItem value="helvetica">Helvetica Neue</SelectItem>
          <SelectItem value="sf">SF Pro</SelectItem>
        </SelectGroup>

        <SelectSeparator />

        <SelectGroup>
          <SelectLabel>Serif</SelectLabel>
          <SelectItem value="times">Times New Roman</SelectItem>
          <SelectItem value="newyork">New York</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
}

/*
 * Long list — exercises the sticky scroll arrows and the popup's
 * max-h-(--available-height) clamp.
 */
export const Scrolling: Story = {
  args: {
    items: fontSizes,
    defaultValue: "12",
    defaultOpen: true,
  },

  decorators: roomy("h-72"),

  render: (args) => (
    <Select {...args}>
      <SelectTrigger aria-label="Font size">
        <SelectValue placeholder="Size" />
      </SelectTrigger>

      <SelectContent className="max-h-48">
        {Object.keys(fontSizes).map((size) => (
          <SelectItem key={size} value={size}>
            {size}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ),
}

/* Trigger widened past the 100px token; the menu tracks the anchor width. */
export const CustomWidth: Story = {
  args: {
    items: locations,
    defaultValue: "documents",
  },

  render: (args) => (
    <Select {...args}>
      <SelectTrigger aria-label="Location" className="w-64">
        <SelectValue placeholder="Choose a location" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="documents">Documents</SelectItem>
        <SelectItem value="downloads">Downloads</SelectItem>
        <SelectItem value="desktop">Desktop</SelectItem>
      </SelectContent>
    </Select>
  ),
}

/* Closed-state matrix — the whole trigger ladder at a glance. */
export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Select items={alignments}>
        <SelectTrigger aria-label="Idle">
          <SelectValue placeholder="Idle" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="left">Left</SelectItem>
          <SelectItem value="center">Center</SelectItem>
        </SelectContent>
      </Select>

      <Select items={alignments} defaultValue="center">
        <SelectTrigger aria-label="Selected">
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="left">Left</SelectItem>
          <SelectItem value="center">Center</SelectItem>
        </SelectContent>
      </Select>

      <Select items={alignments} disabled>
        <SelectTrigger aria-label="Disabled placeholder">
          <SelectValue placeholder="Disabled" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="left">Left</SelectItem>
        </SelectContent>
      </Select>

      <Select items={alignments} defaultValue="center" disabled>
        <SelectTrigger aria-label="Disabled with value">
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="center">Center</SelectItem>
        </SelectContent>
      </Select>

      <Select items={alignments}>
        <SelectTrigger aria-label="Invalid" aria-invalid>
          <SelectValue placeholder="Invalid" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="left">Left</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
}
