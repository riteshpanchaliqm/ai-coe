---
inclusion: auto
---

# IQM Design System — Key Rules

When building UI for this project, follow these rules:

## Typography
- Primary font: Avenir Next LT Pro (loaded via @applift/factor)
- Fallbacks: Inter, Plus Jakarta Sans
- Weights: Regular (400), Demi (600), Bold (700)
- Letter spacing: 0.2px globally
- Line height: 1.2x for single-line (headings), 1.4x for multi-line (body), 1.5x for buttons
- Use Title Case for headings and buttons
- Use Sentence Case for body/paragraph text

## Color Usage
- Primary-600 for interactive elements (default state)
- Primary-700 for hover state
- Primary-800 for pressed state
- Neutral-1000, 600, 500 for text
- Shade-50 for backgrounds
- Never use custom colors outside the defined palettes

## Spacing
- 4px base unit
- Scale: 0, 2, 4, 8, 12, 16, 24, 32, 40, 48, 56, 64
- 16px inside sections, 24px between sections, 40px for page margins

## Borders
- Default radius: 4px (borderRadius-4)
- Border width: 1px for most components
- Use borders sparingly

## Components
- Use @applift/factor components exclusively
- Icons only from @applift/icons
- No style={{}} — use sx prop only
- Button hierarchy: Filled (primary) → Outlined (secondary) → Text (tertiary)
- Max one primary filled button per page section

## Accessibility
- WCAG AA minimum: 4.5:1 contrast for regular text, 3:1 for large text
- 3:1 minimum for UI elements (icons, buttons)
