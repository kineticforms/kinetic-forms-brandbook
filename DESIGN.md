# Kinetic Forms Design System

## Overview

A high-contrast, monochrome interface for an AI-native design platform. Minimal and forward-leaning with precise typography, generous whitespace, and stark black-on-white contrast. Every element prioritizes clarity and velocity -- no decorative noise, no ambiguous hierarchy.

Density is moderate: content-focused layouts with ample breathing room. The aesthetic is premium and technical without being cold -- geometric forms with subtle humanist warmth via the typeface.

## Colors

### Light Mode

- **Primary** (#000000): CTAs, active states, primary brand surfaces, logo mark background
- **Primary-on** (#FFFFFF): Text and icons on primary surfaces
- **Surface** (#FFFFFF): Cards, modals, content containers
- **Surface-variant** (#F4F4F5): Page backgrounds, secondary surfaces, alternating sections
- **On-surface** (#18181B): Primary text on light surfaces
- **On-surface-variant** (#A1A1AA): Secondary text, captions, placeholder text
- **Outline** (#E4E4E7): Borders, dividers, subtle separators

### Dark Mode

Dark mode inverts the surface/text relationship while preserving the brand's monochrome identity. The primary accent stays black in both modes — in dark mode it appears as outlined or inverted buttons rather than filled surfaces.

- **Primary (dark)** (#FFFFFF): CTAs, active states, primary interactive elements
- **Primary-on (dark)** (#000000): Text and icons on primary surfaces
- **Surface (dark)** (#18181B): Cards, modals, content containers
- **Surface-variant (dark)** (#000000): Page backgrounds, secondary surfaces
- **On-surface (dark)** (#FFFFFF): Primary text on dark surfaces
- **On-surface-variant (dark)** (#A1A1AA): Secondary text, captions, placeholder text
- **Outline (dark)** (#27272A): Borders, dividers, subtle separators

### Pairing Rules

Primary always pairs with Primary-on. Surface always pairs with On-surface. Never place On-surface text directly on Primary — use Primary-on instead. Outline is used for all structural borders in both modes. The palette is intentionally constrained to monochrome. No accent hues. Brand expression comes from contrast and typography, not color variety.

## Typography

- **Headline Font**: General Sans
- **Body Font**: General Sans
- **Label Font**: General Sans

Source: [Fontshare](https://api.fontshare.com/v2/css?f[]=general-sans@300,400,500,600,700,800&display=swap)
Fallback: `ui-sans-serif, system-ui, -apple-system, sans-serif`

Display headlines use medium weight (500) with tighter letter-spacing (-0.05em) for visual punch. Section headings use medium weight with tight letter-spacing (-0.025em). Body text uses regular weight (400) with relaxed line-height (1.625) for comfortable reading. Small uppercase labels use bold weight (700) with widest letter-spacing (0.1em) to create distinct hierarchy markers.

| Level        | Weight     | Size       | Tracking    | Leading     |
|--------------|------------|------------|-------------|-------------|
| Display / H1 | Medium 500 | 6xl / 8xl  | Tighter     | None        |
| Heading / H2 | Medium 500 | 4xl / 5xl  | Tight       | None        |
| Body / P     | Regular 400| lg         | Normal      | Relaxed     |
| Label        | Bold 700   | xs         | Widest      | Normal      |

## Elevation

This design uses no box shadows. Depth is conveyed entirely through border contrast and surface color variation (surface vs surface-variant). Cards and containers use 1px borders in the outline color. Interactive hover states add subtle border darkening rather than shadow addition.

## Components

- **Buttons**: Pill-shaped (fully rounded), primary uses black fill with white text, secondary uses white fill with 1px border. Hover lifts primary buttons slightly (-translate-y-0.5). Disabled states use zinc-200 background with zinc-500 text.
- **Cards**: 1px border (outline color), 16px corner radius (rounded-2xl), 32px padding. Hover state darkens border and adds subtle shadow-lg.
- **Navigation**: Fixed top bar with backdrop-blur, 1px bottom border. Active tab uses black text with 2px bottom border. Inactive tabs use zinc-500 text.
- **Color Swatches**: Square aspect ratio, 16px corner radius, hover lifts swatch upward (-translate-y-2). Hex value reveals on hover.
- **Logo Displays**: Rounded-3xl containers (24px radius), generous padding (48px). Positive variant on white with border, negative variant on black without border. Variant label positioned absolute top-left.
- **Section Headers**: Small uppercase labels use tracking-widest with zinc-400 color. Content headings use tracking-tight with zinc-900 color.

## Do's and Don'ts

- Do use the primary color (black) only for the single most important action or surface per context
- Do maintain the monochrome palette -- brand expression comes from contrast and type, not color
- Do use pill-shaped (fully rounded) buttons for all interactive actions
- Do preserve generous whitespace between sections (space-y-16 to space-y-24)
- Do use tracking-tighter on display headings and tracking-widest on small uppercase labels
- Don't introduce accent colors or hues outside the monochrome palette
- Don't use box shadows for elevation -- use border contrast and surface color instead
- Don't mix rounded corners: use rounded-2xl (16px) for cards, rounded-3xl (24px) for large containers, fully rounded for buttons
- Don't use more than two font weights on a single screen section
- Do maintain WCAG AA contrast ratios (4.5:1 minimum for text)
