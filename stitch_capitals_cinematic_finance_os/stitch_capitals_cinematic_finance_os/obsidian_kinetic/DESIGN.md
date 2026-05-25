---
name: Obsidian Kinetic
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#b9caca'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#849495'
  outline-variant: '#3a494a'
  surface-tint: '#00dce5'
  primary: '#e9feff'
  on-primary: '#003739'
  primary-container: '#00f5ff'
  on-primary-container: '#006c71'
  inverse-primary: '#00696e'
  secondary: '#dcb8ff'
  on-secondary: '#480081'
  secondary-container: '#7701d0'
  on-secondary-container: '#dcb7ff'
  tertiary: '#eeffe6'
  on-tertiary: '#003907'
  tertiary-container: '#2bff49'
  on-tertiary-container: '#007117'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#63f7ff'
  primary-fixed-dim: '#00dce5'
  on-primary-fixed: '#002021'
  on-primary-fixed-variant: '#004f53'
  secondary-fixed: '#efdbff'
  secondary-fixed-dim: '#dcb8ff'
  on-secondary-fixed: '#2c0051'
  on-secondary-fixed-variant: '#6700b5'
  tertiary-fixed: '#72ff70'
  tertiary-fixed-dim: '#00e639'
  on-tertiary-fixed: '#002203'
  on-tertiary-fixed-variant: '#00530e'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  display-lg-mobile:
    fontFamily: Geist
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: 0em
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.1em
  numeric-data:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: -0.01em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
---

## Brand & Style

The design system is engineered for a high-stakes, student-first financial ecosystem. It balances the institutional authority of a global investment bank with the kinetic energy of a next-generation tech launch. The personality is "Quiet Luxury meets Cyber-Performance"—it is expensive, immersive, and intentionally futuristic.

The visual style is **Kinetic Glassmorphism**. This approach moves beyond static frosted panels to a system of layered, translucent surfaces that react to user interaction with depth and light. Elements should feel like they are floating in a vacuum, illuminated by internal glow sources rather than external light.

**Key Stylistic Pillars:**
- **Depth and Obsidian Space:** A true black background (#000000) serves as the infinite canvas, making glass panels and neon accents appear to vibrate.
- **Micro-Luminescence:** Borders are not just solid lines; they are treated as light-traps—thin, 1px strokes with varying opacity to simulate light catching the edge of glass.
- **Holographic Motion:** Gradients should feel liquid and non-linear, using mesh gradients that shift subtly to indicate "active" states or financial growth.

## Colors

The palette is optimized for OLED displays, utilizing a "Deepest Black" foundation to maximize the contrast of the electric accent colors.

- **Primary (Electric Neon Cyan):** Used for primary actions, current balances, and "Hero" moments. It represents liquidity and clarity.
- **Secondary (Pulsing Violet):** Used for luxury features, premium tiers, and secondary interactive elements. It represents the "Capital" and sophistication.
- **Tertiary (Glowing Emerald):** Reserved strictly for positive financial growth, "Success" states, and money-in transactions.
- **Neutrals:**
  - `Base`: #000000 (The void)
  - `Surface`: #0A0A0A (Primary container background)
  - `Elevated`: #141414 (Floating card background)
  - `Stroke`: #FFFFFF with 10% - 15% opacity (Glass edges)

## Typography

The typography system uses a tri-font hierarchy to communicate technical precision and modern editorial style.

- **Geist (Headlines & Numbers):** Chosen for its technical, developer-centric precision. Use this for all financial figures and major headings to evoke a "Fintech Terminal" feel.
- **Inter (Body):** The workhorse for readability. Used for all long-form text and descriptions.
- **JetBrains Mono (Labels):** Used sparingly for metadata, transaction IDs, and micro-labels to reinforce the "Finance OS" narrative.

**Formatting Rules:**
- All large displays should use tight letter-spacing (`-0.04em`) to create a "locked-in" professional look.
- Labels should always be uppercase with generous letter-spacing to distinguish them from body content.

## Layout & Spacing

This design system employs a **Fluid Glass Grid**. The layout is built on an 8px base unit, but elements are often positioned with wide margins to create a sense of "Air" and "Exclusivity."

- **Desktop:** 12-column grid with wide 64px outer margins. Content is centered with a max-width of 1280px to prevent information density fatigue.
- **Mobile:** 4-column grid. Components should stretch to the margins but use internal padding of 24px to maintain the "floating" aesthetic.
- **Visual Rhythm:** Use "Super-padding" (48px+) between major sections to emphasize the premium nature of the interface. Avoid cluttering the viewport; every element must have a functional "reason to exist."

## Elevation & Depth

Depth is not created with traditional shadows, but through **Luminous Stacking**.

- **Layer 0 (Canvas):** #000000.
- **Layer 1 (Glass Panels):** Background blur (20px to 40px) with a semi-transparent hex fill (#FFFFFF at 3-5%).
- **Edge Illumination:** Use a 1px inner stroke. Top and left edges should have higher opacity (20%) to simulate a "rim light" from a virtual top-left source.
- **Glow-shadows:** For active elements, use a drop shadow that matches the accent color (Cyan or Violet) with a very high blur (30px+) and very low opacity (15%) to create a "Holographic Aura" rather than a physical shadow.

## Shapes

The shape language is "Squircle-heavy," inspired by modern hardware design.

- **Cards & Containers:** Use `rounded-lg` (1rem/16px) as the standard. This provides a friendly but architectural feel.
- **Interactive Elements:** Buttons and Input fields follow the `rounded-lg` standard.
- **Feature Highlights:** Use "Pill" shapes for tags, status indicators, and the main CTA button to create a distinct visual "target" compared to the rectangular glass panels.

## Components

- **Magnetic Buttons:** Primary buttons use a solid Electric Cyan fill with black text. On hover, they should exhibit a subtle "magnetic" pull towards the cursor and a cyan outer glow.
- **Glass Cards:** High-blur backgrounds. Header sections of cards should have a subtle 1px horizontal separator with a 10% white opacity.
- **Liquid Progress Bars:** Progress indicators should not be flat. They use a linear gradient (Cyan to Violet) with a "shimmer" animation that moves across the bar periodically.
- **Interactive Charts:** Lines should be 2px thick with a "Neon-Tube" effect (a glow of the same color behind the line). Data points should only appear on hover as small white rings.
- **Holographic Chips:** Used for categories. These have no background fill, only a 1px neon border and a matching color text. On hover, the background fills with a 10% opacity version of the border color.
- **Input Fields:** Bottom-border only or very subtle glass panels. The "Active" state should trigger a glow on the bottom border that pulses slightly like a heartbeat.