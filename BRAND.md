---
brand:
  name: "Kinetic Forms"
  tagline: "Intelligence in Motion."
  version: "1.0.0"
  schema: "brand.md/1.0"
  updated: "2026-04-05"
  confidential: true

concept:
  taglines:
    - "Dream Bigger."
    - "Move Faster."
    - "Let's Build."
    - "Tomorrow Together."
  description: "Kinetic Forms is an AI-native design system built for velocity. We blend relentless momentum with considered, human-centric details -- creating digital experiences that feel alive, intuitive, and relentlessly forward-leaning."
  pillars:
    - title: "Velocity"
      description: "Frictionless interactions and rapid visual feedback that propel users forward at the speed of thought."
      icon: "zap"
    - title: "Flow"
      description: "Seamless, intuitive pathways powered by AI, designed to adapt naturally to human behavior."
      icon: "layers"
    - title: "Precision"
      description: "An uncompromising attention to detail, ensuring every pixel, transition, and micro-interaction is perfectly resolved."
      icon: "maximize"

logo:
  description: "Our mark strips away the superfluous, leaving only pure, directed energy. The Kinetic Forms identity is designed to scale effortlessly, maintaining absolute clarity from a 16px favicon to a stadium display."
  clear_space: "1x height of the K. mark"
  minimum_size: "16px"
  mark_text: "K."
  mark_shape: "rounded-rectangle"
  variants:
    - name: "Primary Lockup"
      description: "Full brand name alongside the K. mark. Use as the default logo wherever space permits."
      assets:
        positive: "assets/logo/lockup-positive.svg"
        negative: "assets/logo/lockup-negative.svg"
    - name: "Standalone Mark"
      description: "The K. icon alone. Use for favicons, app icons, avatars, and constrained spaces."
      assets:
        positive: "assets/logo/mark-positive.svg"
        negative: "assets/logo/mark-negative.svg"

typography:
  description: "Our typography is the anchor to our motion. We utilize crisp, highly legible neo-grotesque sans-serifs to provide a stable, clean structure that allows our dynamic interactions to shine."
  typefaces:
    - name: "General Sans"
      role: "primary"
      source: "https://api.fontshare.com/v2/css?f[]=general-sans@300,400,500,600,700,800&display=swap"
      weights: [300, 400, 500, 600, 700, 800]
      fallback: "ui-sans-serif, system-ui, -apple-system, sans-serif"
      description: "General Sans acts as our universal voice. Unopinionated yet distinct, it ensures perfect clarity and focus, stripping away cognitive load to let the content breathe."
  hierarchy:
    - level: "Display / H1"
      typeface: "General Sans"
      weight: 500
      tracking: "tighter"
      leading: "none"
      sample: "Velocity by design"
    - level: "Heading / H2"
      typeface: "General Sans"
      weight: 500
      tracking: "tight"
      leading: "none"
      sample: "Intelligent forms for modern teams"
    - level: "Body / P"
      typeface: "General Sans"
      weight: 400
      tracking: "normal"
      leading: "relaxed"
      sample: "We craft digital spaces where momentum feels effortless. Every micro-interaction is deliberate, every layout meticulously considered. We believe that true technological sophistication shouldn't feel mechanical -- it should feel like an extension of your own thought process."

colors:
  description: "Our palette is unapologetically minimalist. By constraining our colors to high-contrast monochromes, we eliminate visual noise, direct focus, and establish a premium, modern aesthetic."
  palette:
    - name: "Kinetic Black"
      hex: "#000000"
      role: "primary"
      on_color: "#FFFFFF"
    - name: "Motion White"
      hex: "#FFFFFF"
      role: "primary"
      on_color: "#000000"
    - name: "Graphite"
      hex: "#18181B"
      role: "neutral"
      on_color: "#FFFFFF"
    - name: "Steel"
      hex: "#A1A1AA"
      role: "neutral"
      on_color: "#000000"
    - name: "Vapor"
      hex: "#F4F4F5"
      role: "neutral"
      on_color: "#000000"
  contrast:
    title: "Maximum Contrast."
    description: "Binary precision meets bold execution. Our core visual language relies on stark white against deep black, reflecting our AI-native foundation while creating striking, undeniable clarity."
  semantic:
    background: "#F4F4F5"
    surface: "#FFFFFF"
    text_primary: "#18181B"
    text_secondary: "#A1A1AA"
    border: "#E4E4E7"
    accent: "#000000"
  modes:
    light:
      background: "#F4F4F5"
      surface: "#FFFFFF"
      text_primary: "#18181B"
      text_secondary: "#A1A1AA"
    dark:
      background: "#000000"
      surface: "#18181B"
      text_primary: "#FFFFFF"
      text_secondary: "#A1A1AA"
---

# Kinetic Forms

## Concept

Kinetic Forms is an AI-native design system built for velocity. We blend relentless momentum with considered, human-centric details -- creating digital experiences that feel alive, intuitive, and relentlessly forward-leaning.

### Brand Pillars

**Velocity** -- Frictionless interactions and rapid visual feedback that propel users forward at the speed of thought.

**Flow** -- Seamless, intuitive pathways powered by AI, designed to adapt naturally to human behavior.

**Precision** -- An uncompromising attention to detail, ensuring every pixel, transition, and micro-interaction is perfectly resolved.

### Visual Language

Subtle geometric offset patterns help give a sense of intrigue, while maintaining structural integrity across all digital mediums. Our visual system pairs stark contrasts with fluid motion -- the interplay between rigid structure and organic movement is what makes the brand feel alive.

---

## Logo

Our mark strips away the superfluous, leaving only pure, directed energy. The Kinetic Forms identity is designed to scale effortlessly, maintaining absolute clarity from a 16px favicon to a stadium display.

### Primary Lockup

The full brand name alongside the K. mark. Use this as the default logo wherever horizontal space permits.

| Variant  | Asset                             |
|----------|-----------------------------------|
| Positive | `assets/logo/lockup-positive.svg` |
| Negative | `assets/logo/lockup-negative.svg` |

### Standalone Mark

The K. icon in a rounded-rectangle container. Use for favicons, app icons, social avatars, and any space-constrained context.

| Variant  | Asset                           |
|----------|---------------------------------|
| Positive | `assets/logo/mark-positive.svg` |
| Negative | `assets/logo/mark-negative.svg` |

### Clear Space

Always maintain a minimum clear space around the logo equivalent to the height of the "K." icon (1x). This ensures legibility and impact at every scale.

### Usage Rules

> **Do:** Use the provided logo files without modification.
> **Do:** Maintain the minimum clear space in all applications.
> **Do:** Use the positive variant on light backgrounds and negative on dark.
>
> **Don't:** Stretch, rotate, or distort the logo.
> **Don't:** Add drop shadows, outlines, or effects.
> **Don't:** Place the logo on busy or low-contrast backgrounds.

---

## Typography

Our typography is the anchor to our motion. We utilize crisp, highly legible neo-grotesque sans-serifs to provide a stable, clean structure that allows our dynamic interactions to shine.

### General Sans

General Sans acts as our universal voice. Unopinionated yet distinct, it ensures perfect clarity and focus, stripping away cognitive load to let the content breathe.

- **Source:** [Fontshare](https://api.fontshare.com/v2/css?f[]=general-sans@300,400,500,600,700,800&display=swap)
- **Weights:** Light (300), Regular (400), Medium (500), Semibold (600), Bold (700), Extrabold (800)
- **Fallback:** `ui-sans-serif, system-ui, -apple-system, sans-serif`

### Type Hierarchy

| Level        | Weight  | Tracking | Leading | Example                                  |
|--------------|---------|----------|---------|------------------------------------------|
| Display / H1 | Medium  | Tighter  | None    | *Velocity by design*                     |
| Heading / H2 | Medium  | Tight    | None    | *Intelligent forms for modern teams*     |
| Body / P     | Regular | Normal   | Relaxed | *We craft digital spaces where momentum...* |

---

## Colors

Our palette is unapologetically minimalist. By constraining our colors to high-contrast monochromes, we eliminate visual noise, direct focus, and establish a premium, modern aesthetic.

### Palette

| Name          | Hex       | Role    | Text On Color |
|---------------|-----------|---------|---------------|
| Kinetic Black | `#000000` | Primary | White         |
| Motion White  | `#FFFFFF` | Primary | Black         |
| Graphite      | `#18181B` | Neutral | White         |
| Steel         | `#A1A1AA` | Neutral | Black         |
| Vapor         | `#F4F4F5` | Neutral | Black         |

### Contrast

Binary precision meets bold execution. Our core visual language relies on stark white against deep black, reflecting our AI-native foundation while creating striking, undeniable clarity.

The primary expression of the brand is **Maximum Contrast** -- black on white, white on black. Intermediate grays (Graphite, Steel, Vapor) are used for supporting hierarchy, never as primary brand surfaces.

### Semantic Tokens

| Token          | Light Mode | Dark Mode |
|----------------|------------|-----------|
| Background     | `#F4F4F5`  | `#000000` |
| Surface        | `#FFFFFF`  | `#18181B` |
| Text Primary   | `#18181B`  | `#FFFFFF` |
| Text Secondary | `#A1A1AA`  | `#A1A1AA` |
