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
