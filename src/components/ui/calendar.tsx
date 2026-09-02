import * as React from "react"
import { DayPicker, type ChevronProps } from "react-day-picker"
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"

/* DayPicker marks a nav button that has nowhere to go with aria-disabled, not
   disabled — it stays focusable so the grid keeps its tab order. */
const navButton = cn([
  "inline-flex items-center justify-center p-0 appearance-none",
  "size-(--date-picker-cell-size)",
  "rounded-(--date-picker-nav-radius) border-0 bg-transparent",
  "text-(--label-secondary)",
  "cursor-default select-none outline-none",

  "transition-[background-color,color]",
  "duration-(--date-picker-transition-duration)",
  "motion-reduce:transition-none",

  "not-aria-disabled:hover:bg-(--date-picker-hover-fill)",
  "not-aria-disabled:hover:text-(--label-primary)",
  "not-aria-disabled:active:bg-(--date-picker-pressed-fill)",

  "focus-visible:shadow-[0_0_0_var(--date-picker-focus-ring-width)_var(--date-picker-focus-ring)]",
  "contrast-more:focus-visible:shadow-[0_0_0_var(--date-picker-focus-ring-width)_var(--popover),0_0_0_var(--date-picker-focus-ring-width-contrast)_var(--macos-blue)]",

  "aria-disabled:text-(--label-tertiary)",
])

/**
 * The month grid inside DatePicker's popover.
 *
 * Single-date selection only. Range selection, week numbers and the dropdown
 * caption are left unstyled rather than removed — DayPicker still supports all
 * three, and each needs its own macOS reference before it earns tokens.
 *
 * `DayButton` stays DayPicker's own component. Its focus effect is what moves
 * focus as the keyboard walks the grid, and every day state this styles is read
 * from the `data-*` attributes DayPicker already writes on the gridcell — so
 * there is nothing left for a wrapper to add.
 */
function Calendar({
  className,
  classNames,
  showOutsideDays = false,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      data-slot="calendar"
      showOutsideDays={showOutsideDays}
      className={cn(
        [
          /* The positioning context for the absolutely placed nav */
          "relative block",

          "w-(--date-picker-width)",
          "p-(--date-picker-popup-padding)",

          "font-sans",
          "text-(length:--font-size-body)",
          "leading-(--line-height-body)",
          "text-(--label-primary)",
        ],
        className
      )}
      formatters={{
        /* Month and year in the viewer's locale — "September 2026" */
        formatCaption: (date: Date) =>
          date.toLocaleDateString(undefined, {
            month: "long",
            year: "numeric",
          }),

        /* macOS writes the short weekday without the trailing period */
        formatWeekdayName: (date: Date) =>
          date
            .toLocaleDateString(undefined, { weekday: "short" })
            .replace(/\.$/, ""),
      }}
      classNames={{
        months: "relative block w-full",
        month: "flex w-full flex-col gap-(--date-picker-caption-gap)",

        /*
         * DayPicker renders Nav as a sibling of the months, so it is pulled
         * onto the caption's row and the caption reserves the width back.
         */
        nav: cn([
          "absolute top-0 end-0 z-10",
          "flex items-center gap-(--date-picker-nav-gap)",
        ]),

        button_previous: navButton,
        button_next: navButton,

        month_caption: cn([
          "flex w-full items-center justify-start",
          "h-(--date-picker-caption-height)",
          "pe-(--date-picker-caption-inset-end)",
        ]),

        caption_label: cn([
          "whitespace-nowrap select-none",
          "text-(length:--font-size-body)",
          "leading-(--line-height-body)",
          "font-(--date-picker-caption-font-weight)",
          "tracking-(--date-picker-caption-tracking)",
        ]),

        month_grid: "block w-full",

        weekdays: cn([
          "grid w-full items-center",
          "grid-cols-[repeat(7,var(--date-picker-cell-size))]",
          "gap-x-(--date-picker-column-gap)",
          "mb-(--date-picker-weekday-gap)",
        ]),

        weekday: cn([
          "flex items-center justify-center p-0 select-none",
          "h-(--date-picker-weekday-height)",
          "w-(--date-picker-cell-size)",
          "text-(length:--date-picker-weekday-font-size)",
          "leading-(--date-picker-weekday-line-height)",
          "font-(--date-picker-weekday-font-weight)",
          "tracking-(--date-picker-weekday-tracking)",
          "text-(--label-secondary) uppercase",
        ]),

        weeks: "flex w-full flex-col gap-(--date-picker-row-gap)",

        week: cn([
          "grid w-full",
          "grid-cols-[repeat(7,var(--date-picker-cell-size))]",
          "gap-x-(--date-picker-column-gap)",
        ]),

        /*
         * The gridcell is the group every day-button state hangs off, and the
         * one element DayPicker marks up with today / selected / outside /
         * disabled / hidden.
         */
        day: cn([
          "group relative p-0 text-center",
          "size-(--date-picker-cell-size)",
          "data-hidden:invisible",
        ]),

        day_button: cn([
          "relative flex items-center justify-center appearance-none",
          "size-(--date-picker-cell-size)",
          "rounded-(--date-picker-day-radius) border-0 bg-transparent",

          "font-sans",
          "text-(length:--font-size-body)",
          "font-(--date-picker-day-font-weight)",
          "tabular-nums text-(--label-primary)",

          "cursor-default select-none outline-none",

          /*
           * Narrower than a field's focus ring: the cells sit 4px apart across
           * and 3px down, so a field-width halo would overlap its neighbours.
           */
          "focus-visible:shadow-[0_0_0_var(--date-picker-focus-ring-width)_var(--date-picker-focus-ring)]",
          "contrast-more:focus-visible:shadow-[0_0_0_var(--date-picker-focus-ring-width)_var(--popover),0_0_0_var(--date-picker-focus-ring-width-contrast)_var(--macos-blue)]",

          "transition-[background-color,box-shadow,color]",
          "duration-(--date-picker-transition-duration)",
          "motion-reduce:transition-none",

          /*
           * Selection wins over today and over hover, so each of those is
           * guarded rather than left to Tailwind's variant sort order — the
           * unguarded version paints blue-on-blue the day you select today.
           */
          "not-group-data-selected:hover:bg-(--date-picker-hover-fill)",
          "not-group-data-selected:active:bg-(--date-picker-pressed-fill)",
          "not-group-data-selected:group-data-today:text-(--macos-blue)",
          "not-group-data-selected:group-data-today:font-(--date-picker-day-font-weight-today)",
          "not-group-data-selected:group-data-outside:text-(--label-tertiary)",

          "group-data-selected:bg-(--date-picker-selection-fill)",
          "group-data-selected:text-(--date-picker-selection-label)",
          "group-data-selected:font-(--date-picker-day-font-weight-selected)",

          "group-data-disabled:pointer-events-none",
          "group-data-disabled:text-(--label-tertiary)",
        ]),

        ...classNames,
      }}
      components={{
        Chevron: ({ className, orientation }: ChevronProps) => {
          const Caret = orientation === "left" ? CaretLeftIcon : CaretRightIcon
          return (
            <Caret
              weight="bold"
              className={cn(
                "size-(--date-picker-chevron-size) shrink-0 rtl:-scale-x-100",
                className
              )}
            />
          )
        },
      }}
      {...props}
    />
  )
}

export { Calendar }
