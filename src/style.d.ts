// src/styled.d.ts
// This file augments styled-components DefaultTheme so TS knows the theme shape.
// Make sure this file is in src/ and tsconfig.json includes "src" (default in the template).

import 'styled-components'

declare module 'styled-components' {
  export interface DefaultTheme {
    bg: string
    panel: string
    text: string
    muted: string
    accent: string
    success: string
    danger: string
  }
}
