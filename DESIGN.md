---
name: Vitality Core
colors:
  surface: '#f8f9fb'
  surface-dim: '#d9dadc'
  surface-bright: '#f8f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f6'
  surface-container: '#edeef0'
  surface-container-high: '#e7e8ea'
  surface-container-highest: '#e1e2e4'
  on-surface: '#191c1e'
  on-surface-variant: '#444934'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f3'
  outline: '#747962'
  outline-variant: '#c4c9ae'
  surface-tint: '#506600'
  primary: '#506600'
  on-primary: '#ffffff'
  primary-container: '#c6f432'
  on-primary-container: '#566d00'
  inverse-primary: '#aad600'
  secondary: '#5f5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e2dfde'
  on-secondary-container: '#636262'
  tertiary: '#494bd6'
  on-tertiary: '#ffffff'
  tertiary-container: '#e2e0ff'
  on-tertiary-container: '#5052dd'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c5f331'
  primary-fixed-dim: '#aad600'
  on-primary-fixed: '#161f00'
  on-primary-fixed-variant: '#3b4d00'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#e1e0ff'
  tertiary-fixed-dim: '#c0c1ff'
  on-tertiary-fixed: '#07006c'
  on-tertiary-fixed-variant: '#2f2ebe'
  background: '#f8f9fb'
  on-background: '#191c1e'
  surface-variant: '#e1e2e4'
typography:
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  stat-display:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin: 32px
  card-padding: 24px
---

## Brand & Style

This design system embodies a "High-Performance Minimalist" aesthetic. It is designed for the modern health enthusiast who values clarity, efficiency, and positive reinforcement. The brand personality is encouraging and energetic without being overwhelming, utilizing a spacious layout to reduce cognitive load during workout tracking.

The visual style leans heavily into **Modern Minimalism** with a focus on tonal layering. By using a sophisticated light-grey foundation, white surfaces appear to float, creating a clear hierarchy of information. The "pop" of lime green serves as a motivational trigger, guiding the user toward action items and success metrics.

## Colors

The palette is rooted in a high-key neutral range to ensure the interface feels airy and "clean." 

- **Primary (Lime Green):** Used exclusively for progress indicators, primary call-to-actions, and success states. It represents energy and growth.
- **Secondary (Deep Charcoal):** Reserved for high-contrast text, primary navigation icons, and small-scale "dark mode" components like the "Upgrade" button.
- **Surface & Background:** A tiered system of `#FFFFFF` for primary cards and `#F4F5F7` for the application background to create subtle depth without relying on heavy shadows.
- **Accents:** Muted versions of primary colors are used for secondary data visualizations (e.g., soft blues or greys for secondary charts) to keep the focus on the lime green "main" goals.

## Typography

This design system utilizes **Plus Jakarta Sans** as the primary typeface due to its modern, geometric construction and friendly, open counters. It provides an athletic yet approachable feel that suits a fitness environment.

- **Data Hierarchy:** Large numerical values (stats) use a tighter letter-spacing and bold weight to command attention.
- **Readability:** Functional labels and secondary data use **Inter** to provide a clear, neutral contrast against the more "stylized" headers of Plus Jakarta Sans.
- **Case Usage:** Sentence case is preferred for headings to maintain a conversational and welcoming tone ("Welcome back, Rachel!").

## Layout & Spacing

The system follows a **Fluid Grid** model that prioritizes logical grouping through containerization. 

- **The Sidebar:** A fixed-width (80px - 100px) vertical navigation bar provides a constant anchor on the left.
- **The Dashboard:** A multi-column masonry-style layout where cards span variable widths (typically 1/3, 1/2, or 2/3 of the container).
- **Rhythm:** A 4px baseline grid ensures vertical consistency. Card internal padding is generous (24px) to prevent data from feeling cramped, reinforcing the "clean" aesthetic.

## Elevation & Depth

This design system rejects heavy, traditional shadows in favor of **Tonal Layers** and **Soft Ambient Occlusion**.

- **Level 0 (Canvas):** The base background layer in light grey.
- **Level 1 (Cards):** Pure white surfaces. These use an extremely soft, low-opacity shadow (4% - 6% alpha) with a large blur radius (20px+) to create a "lifted" effect rather than a "dropped" shadow.
- **Level 2 (Interactive Elements):** Hover states for cards may slightly increase the shadow spread or use a 1px border in a slightly darker grey to indicate focus.
- **Glassmorphism:** Occasional use of background blurs on overlays (like mobile navigation or modal backdrops) to maintain context.

## Shapes

The shape language is defined by **High Circularity**. There are no sharp corners in this design system.

- **Primary Cards:** Use a 24px (1.5rem) corner radius to feel friendly and organic.
- **Buttons & Chips:** Are typically fully rounded (pill-shaped) to encourage interaction and touch-friendliness.
- **Progress Indicators:** Use thick, rounded strokes for rings and bars to maintain the "soft" visual theme.
- **Icon Enclosures:** Small utility icons are often housed in circular or soft-square containers with a 12px radius.

## Components

### Buttons & Interaction
- **Primary Button:** Pill-shaped, Lime Green background with black text.
- **Secondary/Icon Button:** Circular, white or light grey background with a subtle 1px border.
- **Toggle/Chips:** Pill-shaped with a "Selected" state using the Lime Green background or a high-contrast dark background.

### Data Visualization
- **Progress Rings:** Use a high-stroke width (e.g., 12px) with rounded caps. The "incomplete" track should be a very light grey (#E5E7EB).
- **Trend Lines:** Smooth, curved paths (Bézier) rather than jagged lines, often paired with a soft gradient fill below the line.

### Cards
- **Content Cards:** Must include a clear title in `headline-md` and use generous internal padding.
- **Action Cards:** (e.g., "Start your workout") utilize full-bleed photography with a dark overlay and white text to create visual variety against the data-heavy segments.

### Inputs
- **Search Bar:** Fully rounded ends (pill-shaped), white background, with an inset search icon. The placeholder text should be in a muted grey.