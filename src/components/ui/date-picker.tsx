import { useState } from "react"

import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

/*
 * The trigger is a text field that opens a calendar rather than taking
 * keystrokes, so it carries the field's fill, inset stroke and focus ring
 * rather than a button's — see input.tsx, which draws the same treatment.
 */
const trigger = cn([
  "inline-flex w-full min-w-0 items-center justify-start appearance-none",
  "h-(--date-picker-trigger-height)",
  "px-(--date-picker-trigger-padding-x)",
  "rounded-(--date-picker-trigger-radius) border-0 overflow-hidden",

  "bg-(--text-field-fill) text-(--label-primary)",
  "shadow-[inset_0_0_0_var(--text-field-stroke-width)_var(--text-field-stroke)]",

  "font-sans",
  "text-(length:--text-field-font-size)",
  "leading-(--text-field-line-height)",
  "font-(--text-field-font-weight)",
  "tabular-nums text-start whitespace-nowrap",

  "cursor-default select-none outline-none",

  "transition-[background-color,box-shadow,color]",
  "duration-(--date-picker-trigger-transition-duration)",
  "motion-reduce:transition-none",

  /* An empty field reads as a placeholder, not as a value */
  "data-empty:text-(--label-secondary)",

  "not-disabled:hover:shadow-[inset_0_0_0_var(--text-field-stroke-width)_color-mix(in_srgb,var(--label-primary)_16%,transparent)]",

  /* Open and focused draw the same blue stroke and halo the field does */
  "focus-visible:shadow-[inset_0_0_0_var(--text-field-stroke-width)_var(--macos-blue),0_0_0_var(--text-field-focus-ring-width)_var(--text-field-focus-ring)]",
  "data-popup-open:text-(--macos-blue)",
  "data-popup-open:shadow-[inset_0_0_0_var(--text-field-stroke-width)_var(--macos-blue),0_0_0_var(--text-field-focus-ring-width)_var(--text-field-focus-ring)]",

  /* Disabled fades the fill and stroke; the label stays at full strength */
  "disabled:pointer-events-none",
  "disabled:bg-(--text-field-fill-disabled)",
  "disabled:text-(--label-primary)",
  "disabled:shadow-[inset_0_0_0_var(--text-field-stroke-width)_var(--text-field-stroke-disabled)]",

  /* Forced contrast trades the hairline for a label-strength stroke */
  "contrast-more:shadow-[inset_0_0_0_var(--text-field-stroke-width)_var(--label-secondary)]",
])

/**
 * Controlled on a plain `Date`, the shape DayPicker and every consumer already
 * speak. Formatting is `Intl` via `toLocaleDateString`, so the trigger reads in
 * the viewer's locale with no date library behind it.
 */
function DatePicker({
  id,
  value,
  onValueChange,
  disabled,
  placeholder = "Pick a date",
}: {
  id?: string
  value?: Date
  onValueChange?: (date: Date) => void
  disabled?: boolean
  placeholder?: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <button
            id={id}
            type="button"
            disabled={disabled}
            data-empty={value ? undefined : true}
            data-slot="date-picker-trigger"
            className={trigger}
          />
        }
      >
        {/*
         * No aria-label: the visible text already announces the date, and one
         * here would replace the Field's own <label> rather than add to it.
         */}
        {value
          ? value.toLocaleDateString(undefined, { dateStyle: "long" })
          : placeholder}
      </PopoverTrigger>

      <PopoverContent align="start" side="bottom" sideOffset={4}>
        <Calendar
          autoFocus
          mode="single"
          defaultMonth={value}
          selected={value}
          onSelect={(date?: Date) => {
            if (!date) return
            onValueChange?.(date)
            setOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

export { DatePicker }
