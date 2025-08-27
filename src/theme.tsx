// src/theme.tsx
import { createGlobalStyle } from 'styled-components'

/**
 * Theme interface used across the app.
 * Add new fields here if you want more theme tokens (e.g. shadows, gradients).
 */
export interface Theme {
  bg: string
  panel: string
  text: string
  muted: string
  accent: string
  success: string
  danger: string
}

/**
 * Persona-specific themes. Keys match the personas used in the app.
 * You can tweak these colors to taste.
 */
export const personaThemes: Record<
  'diabetic-male' | 'diabetic-female' | 'normal-male' | 'normal-female',
  Theme
> = {
  'diabetic-male': {
    bg: '#071122',
    panel: '#0f1724',
    text: '#e6eef6',
    muted: '#94a3b8',
    accent: '#60a5fa',
    success: '#10b981',
    danger: '#ef4444',
  },
  'diabetic-female': {
    bg: '#120a14',
    panel: '#231427',
    text: '#ffeef6',
    muted: '#d6c7d9',
    accent: '#f472b6',
    success: '#34d399',
    danger: '#fb7185',
  },
  'normal-male': {
    bg: '#08121a',
    panel: '#0b1726',
    text: '#e8f3ff',
    muted: '#9fb7d6',
    accent: '#60a5fa',
    success: '#16a34a',
    danger: '#ef4444',
  },
  'normal-female': {
    bg: '#0b1a14',
    panel: '#14201a',
    text: '#f0fff4',
    muted: '#bfe4c8',
    accent: '#34d399',
    success: '#10b981',
    danger: '#ef4444',
  },
}

/**
 * GlobalStyle — maps the current theme to CSS variables that plain CSS can use.
 * This ensures both styled-components and plain CSS files read the same tokens.
 */
export const GlobalStyle = createGlobalStyle`
  *{box-sizing:border-box}
  html,body,#root{height:100%}
  body{
    margin:0;
    font-family:Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
    background: ${({ theme }) => `linear-gradient(180deg, ${theme.bg}, rgba(11,18,32,0.9))`};
      /* 1. This is the key property to stop the tiling effect. */
  background-repeat: no-repeat;

  /* 2. This ensures your element is at least as tall as the screen. */
  min-height: 100vh;

  /* 3. (Optional but recommended) This keeps the gradient's center fixed
     when you scroll, which usually looks better. */
  background-attachment: fixed;
    color: ${({ theme }) => theme.text};
    -webkit-font-smoothing:antialiased;
    -moz-osx-font-smoothing:grayscale;
  }

  /* expose theme tokens as CSS variables so styles.css can use var(--accent) etc. */
  :root {
    --bg: ${({ theme }) => theme.bg};
    --panel: ${({ theme }) => theme.panel};
    --text: ${({ theme }) => theme.text};
    --muted: ${({ theme }) => theme.muted};
    --accent: ${({ theme }) => theme.accent};
    --success: ${({ theme }) => theme.success};
    --danger: ${({ theme }) => theme.danger};
  }

  a{color:inherit}
  button{font-family:inherit}
`
