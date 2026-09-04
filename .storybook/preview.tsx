import { useEffect, useState, type ComponentProps } from "react"
import type { Preview } from "@storybook/react-vite"
import { DocsContainer } from "@storybook/addon-docs/blocks"
import { withThemeByClassName } from "@storybook/addon-themes"
import { create } from "storybook/theming"

import "../src/index.css"

/*
 * addon-themes decorators wrap the story only, so the Docs page keeps
 * Storybook's light chrome and a dark-mode control renders invisible on
 * it. The docs surface is controlled solely by parameters.docs.theme, so
 * mirror the `.dark` class the decorator already sets and feed the theme
 * through parameters.docs.container.
 *
 * The preview surface reads --window-background rather than Storybook's
 * own grey, so a control is judged against the real macOS window color.
 */
function docsTheme(dark: boolean) {
  const surface = getComputedStyle(document.documentElement)
    .getPropertyValue("--window-background")
    .trim()

  return create({
    base: dark ? "dark" : "light",
    appContentBg: surface,
    appPreviewBg: surface,
  })
}

/*
 * The type ramp resolves to SF only on macOS; everywhere else `system-ui`
 * hands back Segoe UI or the distro's system font. Token-driven geometry
 * survives that swap, the typeface does not — so a non-macOS viewer is told
 * once, here, rather than left to read the docs as a 1:1 match. macOS
 * viewers, the primary audience, never see it.
 */
function FontNotice() {
  const nonApple =
    typeof navigator !== "undefined" && !/Mac/i.test(navigator.userAgent)

  if (!nonApple) return null

  return (
    <div
      style={{
        margin: "0 0 24px",
        padding: "12px 14px",
        borderRadius: "var(--radius-md)",
        background: "var(--fill-secondary)",
        color: "var(--label-secondary)",
        font: "var(--font-size-body) / var(--line-height-body) var(--font-system)",
      }}
    >
      <strong style={{ color: "var(--label-primary)", fontWeight: 590 }}>
        You are not on macOS, so the type below is not SF.
      </strong>{" "}
      Heights, radii and insets are px tokens and render exactly as specified
      here, but your system font is standing in for SF — labels sit a little
      wider and heavier than the real control. SF Pro is not bundled because
      Apple&rsquo;s license does not cover self-hosting it.
    </div>
  )
}

function ThemedDocsContainer({
  children,
  ...props
}: ComponentProps<typeof DocsContainer>) {
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  )

  useEffect(() => {
    const root = document.documentElement
    const observer = new MutationObserver(() =>
      setDark(root.classList.contains("dark"))
    )

    observer.observe(root, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])

  return (
    <DocsContainer {...props} theme={docsTheme(dark)}>
      <FontNotice />
      {children}
    </DocsContainer>
  )
}

const preview: Preview = {
  decorators: [
    withThemeByClassName({
      themes: {
        light: "",
        dark: "dark",
      },

      defaultTheme: "light",
    }),
  ],

  parameters: {
    layout: "centered",

    docs: {
      container: ThemedDocsContainer,
    },
  },
}

export default preview
