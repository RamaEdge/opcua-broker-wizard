// src/components/ui/toggle-group-context.ts
import * as React from "react"

export const ToggleGroupContext = React.createContext<{
  variant?: string
  size?: string
}>({})