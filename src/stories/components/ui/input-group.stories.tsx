import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, within } from "storybook/test"
import {
  CopyIcon,
  EnvelopeSimpleIcon,
  EyeIcon,
  EyeSlashIcon,
  LockKeyIcon,
  MagnifyingGlassIcon,
} from "@phosphor-icons/react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"

function PasswordInputGroup() {
  const [visible, setVisible] = useState(false)

  return (
    <InputGroup>
      <InputGroupAddon>
        <LockKeyIcon aria-hidden="true" />
      </InputGroupAddon>

      <InputGroupInput
        type={visible ? "text" : "password"}
        defaultValue="knightwolf"
        aria-label="Password"
      />

      <InputGroupAddon align="inline-end">
        <InputGroupButton
          size="icon-xs"
          variant="ghost"
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? (
            <EyeSlashIcon aria-hidden="true" />
          ) : (
            <EyeIcon aria-hidden="true" />
          )}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}

const meta = {
  title: "Components/InputGroup",
  component: InputGroup,

  parameters: {
    layout: "centered",
  },

  tags: ["autodocs"],

  argTypes: {
    children: {
      control: false,
    },
  },

  args: {
    children: <InputGroupInput placeholder="Placeholder" />,
    className: "w-80",
  },
} satisfies Meta<typeof InputGroup>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Search: Story = {
  args: {
    children: (
      <>
        <InputGroupAddon>
          <MagnifyingGlassIcon aria-hidden="true" />
        </InputGroupAddon>

        <InputGroupInput
          type="search"
          placeholder="Search findings"
          aria-label="Search findings"
        />
      </>
    ),
  },
}

export const Email: Story = {
  args: {
    children: (
      <>
        <InputGroupAddon>
          <EnvelopeSimpleIcon aria-hidden="true" />
        </InputGroupAddon>

        <InputGroupInput
          type="email"
          placeholder="name@example.com"
          aria-label="Email address"
        />
      </>
    ),
  },
}

export const PrefixAndSuffix: Story = {
  args: {
    children: (
      <>
        <InputGroupAddon>
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>

        <InputGroupInput
          defaultValue="knightwolf"
          aria-label="Domain name"
        />

        <InputGroupAddon align="inline-end">
          <InputGroupText>.com</InputGroupText>
        </InputGroupAddon>
      </>
    ),
  },
}

export const WithAction: Story = {
  args: {
    children: (
      <>
        <InputGroupInput
          readOnly
          defaultValue="KW-2026-001"
          aria-label="Finding identifier"
        />

        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-xs"
            variant="ghost"
            aria-label="Copy finding identifier"
          >
            <CopyIcon aria-hidden="true" />
          </InputGroupButton>
        </InputGroupAddon>
      </>
    ),
  },
}

/*
 * The reveal button is the one addon here that owns state. macOS swaps the
 * eye glyph and the control's obscuring together, so the button's accessible
 * name and the field's `type` have to move as one.
 */
export const Password: Story = {
  render: () => <PasswordInputGroup />,

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const field = canvas.getByLabelText("Password")

    await expect(field).toHaveAttribute("type", "password")

    await userEvent.click(canvas.getByRole("button", { name: "Show password" }))
    await expect(field).toHaveAttribute("type", "text")

    await userEvent.click(canvas.getByRole("button", { name: "Hide password" }))
    await expect(field).toHaveAttribute("type", "password")
  },
}

/*
 * autoFocus, so focus is already placed — no tab needed. The assertion is on
 * the control rather than the group because the wrapper keys its blue stroke
 * and halo off has-[[data-slot=input-group-control]:focus]; focus anywhere
 * else in the field would paint nothing.
 */
export const Focused: Story = {
  args: {
    children: (
      <InputGroupInput
        defaultValue="Focused value"
        aria-label="Focused value"
        autoFocus
      />
    ),
  },

  play: async ({ canvasElement }) => {
    const control = within(canvasElement).getByRole("textbox", {
      name: "Focused value",
    })

    await expect(control).toHaveAttribute("data-slot", "input-group-control")
    await expect(control).toHaveFocus()
  },
}

/*
 * Disabled lives on the control, not the wrapper — the group only reacts to
 * it, fading its fill and stroke through has-[...:disabled].
 */
export const Disabled: Story = {
  args: {
    children: (
      <>
        <InputGroupAddon>
          <LockKeyIcon aria-hidden="true" />
        </InputGroupAddon>

        <InputGroupInput
          defaultValue="Disabled value"
          aria-label="Disabled value"
          disabled
        />
      </>
    ),
  },

  play: async ({ canvasElement }) => {
    const control = within(canvasElement).getByRole("textbox", {
      name: "Disabled value",
    })

    await expect(control).toBeDisabled()
  },
}

export const Textarea: Story = {
  args: {
    children: (
      <>
        <InputGroupTextarea
          placeholder="Add an observation"
          aria-label="Observation"
        />

        <InputGroupAddon align="block-end">
          <InputGroupText>Markdown supported</InputGroupText>
        </InputGroupAddon>
      </>
    ),
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-3">
      <InputGroup>
        <InputGroupInput placeholder="Default" />
      </InputGroup>

      <InputGroup>
        <InputGroupAddon>
          <MagnifyingGlassIcon aria-hidden="true" />
        </InputGroupAddon>

        <InputGroupInput
          type="search"
          placeholder="Search findings"
          aria-label="Search findings"
        />
      </InputGroup>

      <InputGroup>
        <InputGroupAddon>
          <EnvelopeSimpleIcon aria-hidden="true" />
        </InputGroupAddon>

        <InputGroupInput
          type="email"
          defaultValue="security@knightwolf.dev"
          aria-label="Email address"
        />
      </InputGroup>

      <PasswordInputGroup />

      <InputGroup>
        <InputGroupAddon>
          <LockKeyIcon aria-hidden="true" />
        </InputGroupAddon>

        <InputGroupInput
          defaultValue="Disabled value"
          aria-label="Disabled value"
          disabled
        />
      </InputGroup>
    </div>
  ),
}
