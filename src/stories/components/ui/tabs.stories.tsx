import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, within } from "storybook/test"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

const meta = {
  title: "Components/Tabs",
  component: Tabs,

  parameters: {
    layout: "centered",
  },

  tags: ["autodocs"],

  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
    },

    disabled: {
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
    defaultValue: "general",
    orientation: "horizontal",
    disabled: false,
  },

  render: (args) => (
    <Tabs {...args} className="w-80">
      <TabsList aria-label="Settings sections">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="privacy">Privacy</TabsTrigger>
        <TabsTrigger value="advanced">Advanced</TabsTrigger>
      </TabsList>

      <TabsContent value="general" className="pt-3">
        General settings
      </TabsContent>

      <TabsContent value="privacy" className="pt-3">
        Privacy settings
      </TabsContent>

      <TabsContent value="advanced" className="pt-3">
        Advanced settings
      </TabsContent>
    </Tabs>
  ),
} satisfies Meta<typeof Tabs>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const TwoSegments: Story = {
  render: (args) => (
    <Tabs
      orientation={args.orientation}
      disabled={args.disabled}
      defaultValue="daily"
      className="w-64"
    >
      <TabsList aria-label="Report period">
        <TabsTrigger value="daily">Daily</TabsTrigger>
        <TabsTrigger value="monthly">Monthly</TabsTrigger>
      </TabsList>

      <TabsContent value="daily" className="pt-3">
        Daily report
      </TabsContent>

      <TabsContent value="monthly" className="pt-3">
        Monthly report
      </TabsContent>
    </Tabs>
  ),
}

export const ThreeSegments: Story = {
  render: (args) => (
    <Tabs
      orientation={args.orientation}
      disabled={args.disabled}
      defaultValue="general"
      className="w-80"
    >
      <TabsList aria-label="Settings sections">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="privacy">Privacy</TabsTrigger>
        <TabsTrigger value="advanced">Advanced</TabsTrigger>
      </TabsList>

      <TabsContent value="general" className="pt-3">
        General settings
      </TabsContent>

      <TabsContent value="privacy" className="pt-3">
        Privacy settings
      </TabsContent>

      <TabsContent value="advanced" className="pt-3">
        Advanced settings
      </TabsContent>
    </Tabs>
  ),

  /*
   * A click on a segment both moves the selection pill and swaps the view.
   * Base UI reports the selected segment as aria-selected plus data-active
   * (the attribute the pill styles off). The panel is named by its own tab,
   * so query it that way: the outgoing panel stays mounted and inert for the
   * length of its exit, and an unqualified tabpanel query catches both.
   */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole("tab", { name: "Privacy" }))

    const privacy = canvas.getByRole("tab", { name: "Privacy" })
    await expect(privacy).toHaveAttribute("aria-selected", "true")
    await expect(privacy).toHaveAttribute("data-active")
    await expect(
      canvas.getByRole("tabpanel", { name: "Privacy" })
    ).toBeVisible()
  },
}

/*
 * The focus ring belongs to the track, not the segment — the list draws it
 * via has-[[data-slot=tabs-trigger]:focus-visible], so it is keyboard only.
 * One tab stop reaches the control: the roving tabindex parks it on the
 * selected segment, and TabsList sets activateOnFocus, so an arrow moves the
 * selection with the focus rather than leaving it behind.
 */
export const Focused: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.tab()
    await expect(canvas.getByRole("tab", { name: "General" })).toHaveFocus()

    await userEvent.keyboard("{ArrowRight}")

    const privacy = canvas.getByRole("tab", { name: "Privacy" })
    await expect(privacy).toHaveFocus()
    await expect(privacy).toHaveAttribute("aria-selected", "true")
    await expect(
      canvas.getByRole("tabpanel", { name: "Privacy" })
    ).toBeVisible()
  },
}

/*
 * Keep w-[420px] literal. The IDE offers `w-105` as the canonical
 * form, but that is calc(--spacing * 105) = 26.25rem, and `html` is
 * 13px in this project, not 16px — so w-105 renders 341.25px, not
 * 420px. The suggestion is only correct at a 16px root.
 */
export const FiveSegments: Story = {
  render: (args) => (
    <Tabs
      orientation={args.orientation}
      disabled={args.disabled}
      defaultValue="day"
      className="w-[420px]"
    >
      <TabsList aria-label="Calendar view">
        <TabsTrigger value="day">Day</TabsTrigger>
        <TabsTrigger value="week">Week</TabsTrigger>
        <TabsTrigger value="month">Month</TabsTrigger>
        <TabsTrigger value="quarter">Quarter</TabsTrigger>
        <TabsTrigger value="year">Year</TabsTrigger>
      </TabsList>

      <TabsContent value="day" className="pt-3">
        Day view
      </TabsContent>

      <TabsContent value="week" className="pt-3">
        Week view
      </TabsContent>

      <TabsContent value="month" className="pt-3">
        Month view
      </TabsContent>

      <TabsContent value="quarter" className="pt-3">
        Quarter view
      </TabsContent>

      <TabsContent value="year" className="pt-3">
        Year view
      </TabsContent>
    </Tabs>
  ),
}

/*
 * Disabled applies to the complete control, never to one segment. The list
 * kills pointer events outright, so user-event's own guard would refuse the
 * click before it reached the trigger — disabling that check is what makes
 * this test about the component's inertness rather than the library's.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole("tab", { name: "Privacy" }), {
      pointerEventsCheck: 0,
    })

    await expect(canvas.getByRole("tab", { name: "General" })).toHaveAttribute(
      "aria-selected",
      "true"
    )
    await expect(canvas.getByRole("tab", { name: "Privacy" })).toHaveAttribute(
      "aria-selected",
      "false"
    )
  },
}

export const LineCompatibility: Story = {
  render: (args) => (
    <Tabs
      orientation={args.orientation}
      disabled={args.disabled}
      defaultValue="overview"
      className="w-80"
    >
      <TabsList variant="line" aria-label="Project sections">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="pt-3">
        Project overview
      </TabsContent>

      <TabsContent value="activity" className="pt-3">
        Project activity
      </TabsContent>

      <TabsContent value="settings" className="pt-3">
        Project settings
      </TabsContent>
    </Tabs>
  ),
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex w-[420px] flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="text-xs text-muted-foreground">
          Two segments
        </span>

        <Tabs defaultValue="list">
          <TabsList aria-label="Display mode">
            <TabsTrigger value="list">List</TabsTrigger>
            <TabsTrigger value="grid">Grid</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-muted-foreground">
          Three segments
        </span>

        <Tabs defaultValue="general">
          <TabsList aria-label="Settings sections">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-muted-foreground">
          Five segments
        </span>

        <Tabs defaultValue="day">
          <TabsList aria-label="Calendar view">
            <TabsTrigger value="day">Day</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="quarter">Quarter</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-muted-foreground">
          Disabled
        </span>

        <Tabs defaultValue="general" disabled>
          <TabsList aria-label="Disabled settings sections">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-muted-foreground">
          Line compatibility
        </span>

        <Tabs defaultValue="overview">
          <TabsList
            variant="line"
            aria-label="Project sections"
          >
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  ),
}
