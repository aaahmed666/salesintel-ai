---
name: Synthesized Intelligence
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#464554'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#767586'
  outline-variant: '#c7c4d7'
  surface-tint: '#494bd6'
  primary: '#4648d4'
  on-primary: '#ffffff'
  primary-container: '#6063ee'
  on-primary-container: '#fffbff'
  inverse-primary: '#c0c1ff'
  secondary: '#6b38d4'
  on-secondary: '#ffffff'
  secondary-container: '#8455ef'
  on-secondary-container: '#fffbff'
  tertiary: '#00628d'
  on-tertiary: '#ffffff'
  tertiary-container: '#007cb1'
  on-tertiary-container: '#fcfcff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#d0bcff'
  on-secondary-fixed: '#23005c'
  on-secondary-fixed-variant: '#5516be'
  tertiary-fixed: '#c9e6ff'
  tertiary-fixed-dim: '#89ceff'
  on-tertiary-fixed: '#001e2f'
  on-tertiary-fixed-variant: '#004c6e'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-xl:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 20px
  margin-page: 40px
---

## Brand & Style
The design system is engineered for an AI-powered Sales Intelligence platform, prioritizing clarity, speed, and high-density information architecture. The style is **Corporate Modern with Minimalist influences**, drawing inspiration from industry leaders like Linear and Stripe. 

The aesthetic is characterized by expansive whitespace, precision-aligned typography, and a "glass-and-steel" feel. It balances the rigor of enterprise software with the fluidity of modern SaaS. The UI should evoke a sense of calm authority, making complex data sets feel manageable and actionable. Every element exists to support the user's focus on insights and decision-making, removing all non-functional decorative clutter.

## Colors
The palette is rooted in a sophisticated range of Slates and Grays to provide a neutral foundation that allows data visualizations to stand out. 

- **Primary Gradient:** A professional blend of Indigo (#6366F1) to Violet (#8B5CF6) is used for primary actions and brand moments.
- **Surface Strategy:** In Light Mode, use subtle gray tints (#F8FAFC) to differentiate sections. In Dark Mode, utilize deep charcoal layers (#0F172A) rather than pure black to maintain depth.
- **Sentiment Colors:** Use semantic colors sparingly for status indicators, health scores, and trend lines. Ensure high contrast against background surfaces for accessibility.

## Typography
The system employs a dual-font approach. **Geist** is used for headlines and functional labels to provide a technical, high-precision feel. **Inter** handles all body copy and data entry points to ensure maximum readability and familiar rhythm.

- **Scale:** Maintain a strict hierarchical scale. Use `headline-xl` only for dashboard overviews or empty states. 
- **Tracking:** Apply slight negative letter-spacing to headlines to keep the modern, tight aesthetic.
- **Data:** For numerical data in tables, use tabular figures (monospaced numbers) to ensure columns align perfectly for easy scanning.

## Layout & Spacing
This design system utilizes a **12-column fluid grid** for dashboard views and a **fixed-width container (1200px)** for settings and documentation pages.

- **Rhythm:** An 8pt spatial system is used for component-level spacing, while a 4pt system is reserved for fine-grained internal component padding (e.g., inside a button).
- **Responsive Behavior:** 
  - **Desktop (1280px+):** 12 columns, 40px margins.
  - **Tablet (768px - 1279px):** 8 columns, 24px margins. Content cards stack into 2-column or 1-column layouts depending on complexity.
  - **Mobile (Below 768px):** 4 columns, 16px margins. Navigation moves to a bottom bar or a condensed hamburger menu.

## Elevation & Depth
Hierarchy is established through **Tonal Layers** and **Ambient Shadows**. Instead of heavy shadows, the system uses "depth-by-border" combined with extremely soft blurs.

- **Level 0 (Background):** The base canvas color.
- **Level 1 (Cards/Sidebar):** A subtle 1px border (#E2E8F0 in light / #1E293B in dark) with a 2px blur shadow, 4% opacity.
- **Level 2 (Modals/Popovers):** Higher contrast borders and a multi-layered shadow (8px and 16px blurs) to create a clear physical lift from the page.
- **Glassmorphism:** Use backdrop-blur (12px) on sticky navigation headers and floating action panels to maintain context of the content underneath.

## Shapes
The shape language is refined and approachable. A standard `rounded-md` (8px) is the workhorse for buttons and inputs, while `rounded-lg` (12px) and `rounded-xl` (16px) define the container and card structures. 

This creates a "nested radius" effect: outer cards are softer, while inner elements are tighter, ensuring a harmonious visual flow. Avoid sharp 0px corners entirely to maintain the modern SaaS persona.

## Components

### Buttons
- **Primary:** Gradient background (Primary to Secondary), white text, subtle inner-glow border.
- **Secondary:** Ghost style with a subtle border and 500-weight text.
- **Tertiary:** Text-only with an underline effect on hover.

### Cards
Cards are the primary container for AI insights. They should feature:
- 1px neutral border.
- 16px corner radius.
- Padding of 24px (`lg`) for desktop, 16px (`md`) for mobile.
- Hover state: Subtle lift using a primary-colored 2px bottom border or a slightly deeper shadow.

### Input Fields
- **Default:** Transparent background with a light border.
- **Focus:** Border changes to Primary color with a 3px soft outer "halo" (shadow) in the primary tint.
- **Labels:** Always use `label-sm` positioned above the input.

### Data Visualization
- **Charts:** Use a custom palette derived from the Primary, Tertiary, and Semantic colors.
- **Lines:** 2px stroke width, rounded joins.
- **Grids:** Very faint dashed lines (#F1F5F9).

### Chips & Badges
- Used for status (e.g., "High Intent," "Closed-Won").
- Semi-transparent background of the semantic color (10% opacity) with 100% opacity text of the same color. 
- Fully rounded (pill) shape.