import React, { Suspense } from "react"
import ReactDOM from "react-dom/client"
import { Theme } from "@radix-ui/themes"
import "@radix-ui/themes/styles.css"
import "./index.css"
import { App } from "./App"
import "./i18n/config"

/**
 * Application entry point
 * Renders the main App component in strict mode with i18n support
 */
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Suspense fallback="Loading...">
      <Theme appearance="dark" accentColor="blue" grayColor="slate" radius="large">
    <App />
      </Theme>
    </Suspense>
  </React.StrictMode>
)
