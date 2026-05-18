# IQM Design System

This document is a comprehensive reference for the IQM UI design system. It covers all foundation tokens and component specifications as provided in the official design documentation. Rules and guidelines are stated in full for every section, even when they overlap with other sections.

**Primary Typeface:** Avenir Next LT Pro  
**Fallback Typefaces:** Inter · Plus Jakarta Sans  
**Full Font Stack:**
```css
font-family: 'Avenir Next LT Pro', Inter, 'Plus Jakarta Sans', system-ui, apple-system, 'Segoe UI', sans-serif;
```
The renderer picks the first available font in the stack and uses it consistently — no mixing between fallbacks within the same render.

**Google Fonts import (for fallback fonts):**
```
https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap
```
Load only the weights needed: **400, 600, 700**.

---

## Table of Contents

1. [Color](#1-color)
2. [Typography](#2-typography)
3. [Spacemetrics](#3-spacemetrics)
4. [Border](#4-border)
5. [Elevation](#5-elevation)
6. [Opacity](#6-opacity)
7. [Animation](#7-animation)
8. [Grids](#8-grids)
9. [Filters](#9-filters)
10. [Components](#10-components)
    - [Buttons](#buttons)
    - [Icon-Toggle Button](#icon-toggle-button)
    - [Slider](#slider)
    - [Toasts / Snackbar](#toasts--snackbar)
    - [Alerts](#alerts)
    - [Horizontal Tabs](#horizontal-tabs)
    - [Vertical Tabs](#vertical-tabs)
    - [Capsule Tabs](#capsule-tabs)
    - [Stepper](#stepper)
    - [Progressors](#progressors)
    - [Modal](#modal)
    - [Input](#input)
    - [Input-Select](#input-select)
    - [Breadcrumbs](#breadcrumbs)
    - [Accordions](#accordions)

---

## 1. Color

### Token Nomenclature

Color tokens follow the format `<ColorName>-<Number>`, where:
- `<ColorName>` is the hue (e.g. Primary, Danger, Success)
- `<Number>` indicates the depth of the shade

Lower numbers (e.g. 50) represent lighter tints (hue + white), while higher numbers (e.g. 800) represent darker shades (hue + black). `ColorName-1000` is the darkest shade, and `ColorName-0` is the lightest tint. This system ensures users can easily identify a color's position within its palette, promoting consistency throughout the design.

### Color Swatch Contrast Ratings

In the color swatch, the pill displays the contrast ratio level (AAA/AA) along with a white or black circle, indicating the contrast between the pill's text color and the swatch background color.

- **WCAG AA** for regular text (text smaller than 18px or 24px when bold): minimum contrast ratio of **4.5:1**
- **WCAG AA** for large text (18px bold or 24px regular): minimum contrast ratio of **3:1**
- **WCAG AAA**: minimum contrast ratio of **7:1** for regular text and **4.5:1** for large text

### Theme Palette : Blue

| Color | Token | Hex Code |
|-------|-------|----------|
| | Primary-800 | `#0C275E` |
| | Primary-700 | `#123787` |
| | Primary-600 | `#134AC1` |
| | Primary-500 | `#346EEC` |
| | Primary-400 | `#4F84F7` |
| | Primary-300 | `#78A1FC` |
| | Primary-200 | `#B1CAFE` |
| | Primary-100 | `#D2E0FE` |
| | Primary-75  | `#E2EBFF` |
| | Primary-50  | `#F2F6FF` |

### Theme Palette : Green

| Color | Token | Hex Code |
|-------|-------|----------|
| | Primary-800 | `#062A2E` |
| | Primary-700 | `#0A3F45` |
| | Primary-600 | `#066363` |
| | Primary-500 | `#147E7E` |
| | Primary-400 | `#2B9E9B` |
| | Primary-300 | `#54BEB3` |
| | Primary-200 | `#97DFD5` |
| | Primary-100 | `#C2EFE6` |
| | Primary-75  | `#DAF7F0` |
| | Primary-50  | `#F2F6FF` |

### Theme Palette : Purple

| Color | Token | Hex Code |
|-------|-------|----------|
| | Primary-800 | `#301145` |
| | Primary-700 | `#491B6A` |
| | Primary-600 | `#6D289F` |
| | Primary-500 | `#933FCF` |
| | Primary-400 | `#AB5FE3` |
| | Primary-300 | `#C588F2` |
| | Primary-200 | `#DEB6FC` |
| | Primary-100 | `#ECD2FE` |
| | Primary-75  | `#F4E7FE` |
| | Primary-50  | `#FBF5FF` |

**Platform vertical mapping:**
- Blue → Specialty
- Green → Political
- Purple → Healthcare

### Neutral Palette

| Color | Token | Hex Code |
|-------|-------|----------|
| | Neutral-1000 | `#121212` |
| | Neutral-600  | `#4D4D4D` |
| | Neutral-500  | `#666666` |
| | Neutral-400  | `#999999` |
| | Neutral-300  | `#CCCCCC` |
| | Neutral-200  | `#E6E6E6` |
| | Neutral-100  | `#F2F2F2` |
| | Neutral-75   | `#FAFAFA` |
| | Neutral-0    | `#FFFFFF` |

### Semantic Palette : Danger

| Color | Token | Hex Code |
|-------|-------|----------|
| | Danger-700 | `#8C0000` |
| | Danger-600 | `#B30000` |
| | Danger-500 | `#CC0909` |
| | Danger-400 | `#E53E3E` |
| | Danger-300 | `#EE6969` |
| | Danger-200 | `#F29696` |
| | Danger-100 | `#F9C5C5` |
| | Danger-75  | `#FCDEDE` |

### Semantic Palette : Success

| Color | Token | Hex Code |
|-------|-------|----------|
| | Success-700 | `#003B27` |
| | Success-600 | `#00593B` |
| | Success-500 | `#007B51` |
| | Success-400 | `#15B881` |
| | Success-300 | `#3DCB9C` |
| | Success-200 | `#69D8B3` |
| | Success-100 | `#BEE6C9` |
| | Success-75  | `#B0EFDA` |
| | Success-50  | `#ECFFFD` |

### Semantic Palette : Warning

| Color | Token | Hex Code |
|-------|-------|----------|
| | Warning-600 | `#643F00` |
| | Warning-500 | `#A36701` |
| | Warning-400 | `#CC870E` |
| | Warning-300 | `#DEA542` |
| | Warning-200 | `#E7B765` |
| | Warning-100 | `#F0CB89` |
| | Warning-75  | `#F7D8A3` |
| | Warning-50  | `#FFF3DE` |

### Semantic Palette : Information

| Color | Token | Hex Code |
|-------|-------|----------|
| | Info-700 | `#003B59` |
| | Info-600 | `#005580` |
| | Info-500 | `#0874AA` |
| | Info-400 | `#39A1D5` |
| | Info-300 | `#63B4DD` |
| | Info-200 | `#91CCEA` |
| | Info-100 | `#B0D9EE` |
| | Info-75  | `#D7EBF5` |
| | Info-50  | `#F2FAFF` |

### Accent Palette : Orange

| Color | Token | Hex Code |
|-------|-------|----------|
| | Orange-700 | `#C04D07` |
| | Orange-600 | `#F0640F` |
| | Orange-500 | `#FF7D2E` |
| | Orange-400 | `#FF9757` |
| | Orange-300 | `#FFB080` |
| | Orange-200 | `#FFC6A3` |
| | Orange-100 | `#FFDCC7` |
| | Orange-75  | `#FFE9DB` |
| | Orange-50  | `#FFF6F0` |

### Accent Palette : Purple

| Color | Token | Hex Code |
|-------|-------|----------|
| | Purple-700 | `#5D396B` |
| | Purple-600 | `#7A4A8C` |
| | Purple-500 | `#905CA3` |
| | Purple-400 | `#A479B4` |
| | Purple-300 | `#B897C4` |
| | Purple-200 | `#CCB4D5` |
| | Purple-100 | `#DECDE5` |
| | Purple-75  | `#E9DEED` |
| | Purple-50  | `#F6F2F8` |

### Color Usage Guidelines

#### Using Theme Colors
Apply theme colors to establish core visual identity across the interface, dominating key UI elements like headers, buttons, and navigation. Each IQM platform vertical has a unique theme color, reinforcing product identity and aligning with specific business categories:
- Green for Political
- Purple for Healthcare
- Blue for Specialty

#### Interactive Colors
Use shade-600 for the primary palette and shade-500 for the tertiary and semantic palettes to highlight components and key elements.

#### Background Colors
Use the shade-50 color from theme, tertiary and semantic palettes for background elements to subtly highlight content without overwhelming the design.

#### Text Colors
Use the shade-1000, 600 or 500 from the Neutral palette, shade-600 from Theme palettes or shade-500 from Accent and Semantic palettes for text elements to highlight content for different use cases in the design.

#### Color Transition With States
Background colors of all components must transition smoothly from light to dark shades during interactions such as hover, selection, and pressing. This progression provides visual feedback and enhances the user experience by clearly indicating state changes.

| State | Token |
|-------|-------|
| Default | Primary-600 |
| Hover | Primary-700 |
| Pressed | Primary-800 |

#### Using Accent Colors
Use accent colors to highlight key elements and important notifications. Apply these colors strategically to create emphasis and guide user actions while maintaining a cohesive and accessible design. Ensure that accent colors are used consistently and do not overwhelm the primary color scheme.

#### Using Semantic Colors
Use semantic colors to indicate specific events such as information, danger, success and warning. These colors should be paired with appropriate icons or descriptive text to enhance clarity and ensure that users can easily understand the context and urgency of the information being conveyed.

#### Accessibility Compliance
Accessibility ensures digital content is usable by everyone, including those with disabilities. WCAG guidelines, structured around the principles of Perceivable, Operable, Understandable, and Robust (POUR), establish the standard for accessibility.

- Regular text is defined as body text under 24px or 19px bold, requiring a minimum contrast ratio of 4.5:1 (AA) and 7:1 (AAA).
- Large text is 24px or 19px bold and needs a contrast ratio of 3:1 (AA) and 4.5:1 (AAA).
- Additionally, graphics and UI elements such as icons and buttons must maintain a minimum contrast ratio of 3:1 against their backgrounds to ensure readability for all users and legibility without sacrificing aesthetic quality.

#### Do's and Don'ts

**Custom Colors**
- ✅ Stick to established palettes or standard schemes
- ❌ Use custom colors outside the defined palettes

**Opacity**
- ✅ Use predefined colors for consistency (use `opacityDisabled` token for disabled states)
- ❌ Use opacity to mimic colors

---

## 2. Typography

### Introduction
Typography refers to the style, arrangement, and appearance of text. It encompasses properties like font type, font size, and font weights which collectively enhance readability and ensure effective communication across various interfaces.

### Typeface

**Primary:** Avenir Next LT Pro  
Avenir Next LT Pro is the designated typeface, providing a cohesive and recognizable visual identity across all text elements.

**Fallback Fonts**  
Fallback fonts ensure a consistent and legible user experience when the primary font is unavailable or fails to load properly. The prioritized fallback font sequence is:

1. Design System Fonts: `'Avenir Next LT Pro'`
2. Open Source / Google Fonts: `Inter`, `'Plus Jakarta Sans'`
3. OS Built-In Fonts: `system-ui`, `apple-system`, `'Segoe UI'`, `Roboto`, `'Helvetica Neue'`
4. Web Safe Fonts: `Arial`, `'Noto Sans'`, `'Liberation Sans'`, `sans-serif`
5. Emoji Fonts: `'Apple Color Emoji'`, `'Segoe UI Emoji'`, `'Segoe UI Symbol'`, `'Noto Color Emoji'`

**Full CSS font-family declaration:**
```css
font-family: 'Avenir Next LT Pro', Inter, 'Plus Jakarta Sans', system-ui, apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Liberation Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
```

The renderer picks the first available font in the stack and uses it consistently — no mixing between fallbacks within the same render.

### Weight Mapping

Avenir Next LT Pro uses named weights. The table below maps each to its numeric equivalent for use with Inter or Plus Jakarta Sans when Avenir is unavailable.

| Avenir Weight Name | Numeric (Inter / Plus Jakarta Sans) | Usage |
|--------------------|--------------------------------------|-------|
| Regular | 400 | Body text, descriptions, paragraphs |
| Demi | 600 | Inline highlights, labels, key terms, button text |
| Bold | 700 | Headings, app/section names, highest emphasis |

> Inter and Plus Jakarta Sans are both available as variable fonts. Load only the weights needed: **400, 600, 700**.  
> Google Fonts import: `https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap`

### Type System

Type System refers to the specific styling and formatting applied to text based on its purpose and context within a design. Properties such as line height and letter spacing are tailored within each category to enhance the text's visual appearance and readability.

### Line Height

Line height, also called leading, controls the spacing between lines of text. It is usually adjusted based on the font size. Two line-height tokens are used:
- **Single-line** (1.2× of font size) — for sentences of 1 line
- **Multi-line** (1.4× of font size) — for paragraphs to ensure readability in long multi-line text

| Type | Multiplier | Usage |
|------|------------|-------|
| Single-line | 1.2× font size | H1, H2, H3, H4, H5 |
| Multi-line | 1.4× font size | H6, Body-18, Body-16, Body-14, Label-12 |
| For Button Text | 1.5× font size | Button-16, Button-14, Button-12 |

### Letter Spacing

Letter-spacing, also known as tracking, refers to the consistent adjustment of space between letters in text. A value of **0.2px** of letter-spacing is applied to enhance readability.

### Headings

Headings define the content hierarchy of sections within a page. Different heading types help users understand the content hierarchy and easily navigate the information.

| Type | Font Weight | Font Size |
|------|-------------|-----------|
| Display X-Large | Regular, Demi, Bold | 80px |
| Display Large | Regular, Demi, Bold | 64px |
| Display Small | Regular, Demi, Bold | 48px |
| Heading 1 | Demi, Bold | 40px |
| Heading 2 | Demi, Bold | 36px |
| Heading 3 | Demi, Bold | 32px |
| Heading 4 | Demi, Bold | 26px |
| Heading 5 | Demi, Bold | 24px |
| Heading 6 | Demi, Bold | 20px |

### Body and Labels Text

Body text is used for the main content, like paragraphs, numbers and detailed explanations. It provides the bulk information and is designed to be easy to read, ensuring that users can comfortably engage and understand.

Label text is used for secondary information or less important content. It appears in places like form labels, chips, or badges, and supports the main content without being the focus.

| Type | Font Weight | Font Size |
|------|-------------|-----------|
| Body-18 | Regular, Demi, Bold | 18px |
| Body-16 | Regular, Demi, Bold | 16px |
| Body-14 | Regular, Demi, Bold | 14px |
| Label-12 | Regular, Demi, Bold | 12px |

### Button Text

Button text is used in interactive elements like buttons, form inputs, chips, and tabs. It is crafted to be clear and readable, to ensure users quickly grasp the content and intended actions.

| Type | Font Weight | Font Size |
|------|-------------|-----------|
| Button-16 | Regular, Demi | 16px |
| Button-14 | Regular, Demi | 14px |
| Button-12 | Regular, Demi | 12px |

### Typography Styles

Typography styles refer to the various weights applied to text to emphasize content, enhance clarity, and adjust the tone of the visible message.

| Style | When to use |
|-------|------------|
| **Bold** (700) | Highlights key information in the UI and differentiates primary content within the design. For example, to highlight the application name in the App Bar. |
| **Demi** (600) | Used to emphasize or highlight important information within a sentence. Also helps distinguish UI elements within running text. For example, to highlight the name of Insights in a toast message. |
| **Regular** (400) | Used for standard content, like paragraphs and descriptions, to keep information clear and easy to read. |
| **Underline** | Used only for text links, including hover states. Never use underline to emphasize non-clickable words or phrases. |

### Hierarchy and Harmony

Typography is essential for establishing visual hierarchy and harmony in a product. Styles like Bold, Demi, and Regular, combined with typography types such as Headings, Body text, and Labels, help differentiate levels of importance. Strategically placing the right font ensures that key information stands out, creating a visual harmony.

**Important — SaaS/Product UI Hierarchy:**

In SaaS and product UI contexts, **do not rely on semantic heading levels (H1–H6) alone to establish hierarchy.** The heading number does not determine visual dominance — visual weight difference does. Instead, maintain visual hierarchy using the three-role system:

- **H (Heading)** — section titles, card headers, page titles. Can be any heading size, even H6 at 20px, as long as it is the most visually prominent text in its context.
- **B (Body)** — main content, descriptions, supporting detail.
- **L (Label)** — secondary/meta info, chips, badges, tab counts, form labels.

The correct pairing order is always **H → B → L** within any container or section.

**Example:** A card using `H6 / 20px / Demi` as its title, `Body-14 / Regular` as its description, and `Label-12 / Regular` as metadata is perfectly valid. The visual weight difference between Demi at 20px and Regular at 14px and Regular at 12px creates the hierarchy — the semantic heading number is irrelevant.

> Use the lowest heading size that still reads clearly as the dominant text in its container. Never mix heading sizes within the body or label roles in the same container — the rhythm must be consistent.

### Typography Usage Guidelines

#### Pre-defined Sizes
Stick to the font sizes defined in the system. Using new or custom sizes can disrupt the intended typography hierarchy and balance of the content.

#### Typography Pairing
Always use headings, body text, and labels in the right order to create a balanced layout and clear content hierarchy. Headings introduce sections, body text provides details, and labels offer extra information, making the design easy to navigate.

#### Alignment
Align text to the left with other text, even within containers. This improves vertical alignment, enhancing legibility, organization, and clarity for users.

#### Avoid Rags, Orphans and Widows
Ensure right margins are clean and even to maintain a tidy appearance. Watch out for orphans (single words at the end of a paragraph) and widows (single lines at the beginning of a new page) to prevent awkward breaks. Adjust line lengths as needed to eliminate these issues and enhance the flow of text.

#### Do's and Don'ts

**Readability**
- ✅ Use high contrast between text and background colors to ensure that content is easily readable
- ❌ Avoid using low-contrast combinations where the text blends into the background

**Body Content Casing**
- ✅ Use Sentence Case for all paragraph and body content
- ❌ Don't use uppercase (all caps), Title Case, or lowercase in paragraphs or body content

**Title and Button Casing**
- ✅ Use Title Case for all heading and button content
- ❌ Avoid using Sentence Case, Lowercase, or Uppercase (all caps) for headings or button text

**Alignments**
- ✅ Center-align icons when they're next to text
- ❌ Don't baseline-align icons to the text

**Underlines**
- ✅ Use underlines exclusively for text links to clearly indicate that the text is clickable
- ❌ Do not use underlines to emphasize non-clickable words or phrases

---

## 3. Spacemetrics

### Introduction
Space Metrics are standardized measurements that define the spacing between UI elements, such as paddings and margins. These metrics establish a consistent framework, ensuring uniform spacing throughout the interface.

### Spacing Methods

#### Padding (Internal Spacing)
Padding, or internal spacing, is used within components to manage the distance between the component's boundary and its content. This spacing ensures elements within a component are well-organized and visually comfortable.

#### Margin (External Spacing)
External spacing, or margins, is used between components to create visual separation and define the relationship between different elements on the page. This spacing ensures components are distinct and properly aligned within the overall layout.

### Spacing Scale
The spacing system is anchored by a 4-pixel base unit, ensuring uniform spacing across all design elements. This scale, ranging from 0px to 64px, provides both flexibility and consistency. Use this scale when designing components to establish clear, harmonious spatial relationships and to maintain a cohesive layout throughout the interface.

### Spacing Tokens
Space tokens are predefined values used to standardize the spacing between UI elements, providing a reliable foundation for creating cohesive and well-structured designs. By utilizing these tokens, designers can maintain a cohesive layout, enhancing the overall user experience.

### Value Table

| Spacing | Token Name | Value | Usage |
|---------|------------|-------|-------|
| | gutter-0 | 0px | — |
| | gutter-0 | 2px | Icon and Text (X-Small Components) |
| | gutter-4 | 4px | Icon and Text (Medium and Small Components) |
| | gutter-8 | 8px | Icon and Text (Large Components), Repetitive Elements (e.g. Table bulk Actions) |
| | gutter-12 | 12px | — |
| | gutter-16 | 16px | Page Content and Left Panel, Inside Section |
| | gutter-24 | 24px | Sections in Page Content |
| | gutter-32 | 32px | — |
| | gutter-40 | 40px | Global Navigation, Page Content, Margin when left panel is missing |
| | gutter-48 | 48px | — |
| | gutter-56 | 56px | — |
| | gutter-64 | 64px | — |

---

## 4. Border

### Introduction
A border is a customizable visual element that outlines the edges of a UI component, creating separation, defining boundaries, and guiding user attention. It enhances usability by reinforcing structure and aligning with the overall design aesthetic.

### Border Color
Border color defines the visual boundary of an element, helping to create contrast and emphasize structure. Any color token can be used as a border color to meet specific design requirements or to highlight important elements within the interface.

Common border color usage:
- `Info/Info-300` — informational alerts and toasts
- `Neutral/Neutral-600` — default/standard borders
- `Theme/Primary-600` — active, focused, or selected elements

### Border Style
Border style determines the appearance of a border's edge, such as solid, dashed, or dotted. This attribute conveys different design intents and should be used consistently for clarity and aesthetic harmony.

#### Solid
Solid borders are commonly used to create clear, continuous outlines around UI elements, effectively defining their boundaries. They are ideal for components like buttons, input fields, cards, and other containers.

Additionally, solid borders can be applied to indicate frozen elements in tables or grids, such as fixed headers or side panels that remain visible while scrolling through other content.

#### Dashed
Dashed borders are used to indicate both editable areas and drag-and-drop zones. They highlight fields or sections where users can enter or modify content, such as text fields or table cells, and also designate regions where users can move and position elements. This visual cue ensures clarity and enhances user interaction with these components.

### Border Width
Border Width token determines the precise measurement of a border's thickness. It standardizes the visual weight of borders across the interface for consistency and clarity.

#### 1px Border
A 1px border is typically used for subtle outlines, making it ideal for fields, cards, and other lightweight UI components. It provides a clear yet unobtrusive boundary, ensuring the element is defined without overpowering the design.

#### 2px Border
A 2px border adds more emphasis and is often combined with border styles to indicate the freezed columns in tables. This width is useful for highlighting fixed elements that remain visible during scrolling.

#### 4px Border
A 4px border is used for more prominent elements, such as toasts, where strong visual emphasis is needed. It ensures the component stands out, effectively grabbing the user's attention.

### Border Width Value Table

| Border Width | Token Name | Value | Usage |
|--------------|------------|-------|-------|
| | border-width-1 | 1px | Button, Chips, Alert, Tabs |
| | border-width-2 | 2px | Freezed columns |
| | border-width-4 | 4px | Toast |

### Border Radius
Border Radius token determines the curvature of an element's corners. It standardizes the rounding of edges, adding softness or emphasis to the design.

### Border Radius Value Table

| Border Radius | Token Name | Value | Usage |
|---------------|------------|-------|-------|
| | borderRadius-0 | 0px | — |
| | borderRadius-2 | 2px | — |
| | borderRadius-4 | 4px | All Components |
| | borderRadius-8 | 8px | — |
| | borderRadius-16 | 16px | — |
| | borderRadius-circle | 50% | — |
| | borderRadius-pill | 50rem | Circular variant of Badge |

### Border Usage Guidelines

#### Minimalistic Approach
Use borders sparingly to maintain a clean and minimalistic design. Apply them only when necessary to define boundaries or highlight key elements, avoiding excessive use that could clutter the interface.

#### Do's and Don'ts

**Uniform Border Radius**
- ✅ Ensure nested elements adopt the parent's border style and have smaller sizes for a balanced, offset look
- ❌ Avoid combining rounded and sharp-cornered elements within the same hierarchy, as it disrupts visual consistency

**Predefined Metrics**
- ✅ Use only the predefined border tokens to ensure consistency and alignment with the interface
- ❌ Avoid custom border radius or widths that deviate from the established tokens, as they disrupt visual harmony across the interface

---

## 5. Elevation

### Introduction
Elevation uses box shadows to communicate the depth and hierarchy of UI layers. All shadows use a consistent opacity of **5%** across both layers.

### Elevation Token Table

| Token | Layer | (X, Y) | Blur | Opacity | Usage |
|-------|-------|---------|------|---------|-------|
| boxShadow-0 | 1 | (0, 0) | 0 | 5% | — |
| boxShadow-0 | 2 | (0, 0) | 0 | 5% | |
| boxShadow-100 | 1 | (0, 0) | 2 | 5% | Switch |
| boxShadow-100 | 2 | (0, 0) | 4 | 5% | |
| boxShadow-200 | 1 | (0, 4) | 8 | 5% | Dropdown, Table, Tooltips, Toast, Cards |
| boxShadow-200 | 2 | (0, 0) | 8 | 5% | |
| boxShadow-300 | 1 | (0, 8) | 16 | 5% | Global Navigation |
| boxShadow-300 | 2 | (0, 0) | 8 | 5% | |
| boxShadow-400 | 1 | (0, 12) | 24 | 5% | Modal |
| boxShadow-400 | 2 | (0, 0) | 8 | 5% | |
| boxShadow-500 | 1 | (0, 16) | 32 | 5% | — |
| boxShadow-500 | 2 | (0, 0) | 8 | 5% | |

---

## 6. Opacity

### Opacity Token Table

| Sample | Token Name | Opacity | Usage |
|--------|------------|---------|-------|
| | opacityDisabled | 40% | Disabled State, Modal Backdrop, Hover ring in Chips, Radio button, Checkbox |

---

## 7. Animation

### Introduction
Animation tokens define the easing curves and durations used for all transitions and motion in the interface. Consistent motion creates a cohesive feel and communicates state changes clearly to the user.

### Transition Type (Easing)

| Transition Token | Value | Usage |
|------------------|-------|-------|
| transitionEasingEaseInOut | `cubic-bezier(0.4, 0, 0.2, 1)` | Accordion - Open/Close; Badge - Hide/Show; Button/Icon Button - On hover/Focus/Pressed: Background, Border Color change; Ripple Effect - On hover/Focus/Pressed; Chip (Clickable) - On hover/Focus/Pressed: Background, Border Color change; CircularProgress - for variant: determinate/indeterminate show progress; ListItemButton - On hover/Focus/Pressed: Background, Border Color change; LoadingButton - button disable/enable: Background, Border Color change; Paper - adding initial box shadow; Select - Placeholder opacity; Stepper - on step change: icon & label color change; SvgIcon - adding initial fill color; Switch - Switch transitions - On/Off; Tabs - Tab switching indicator |
| transitionEasingEaseOut | `cubic-bezier(0, 0, 0.2, 1)` | Radio Button Icon - Check/Unchecked: icon transform |
| transitionEasingEaseIn | `cubic-bezier(0.4, 0, 1, 1)` | — |
| transitionEasingSharp | `cubic-bezier(0.4, 0, 0.6, 1)` | — |

### Animation Duration

| Transition Token | Duration | Usage |
|------------------|----------|-------|
| transitionDurationShortest | 150ms | Accordion - Expand Icon Rotate; IconButton - on hover/focus/pressed: Background color change; ListItemButton - on hover/focus/pressed: Background color change; RadioButtonIcon - Transform icon: checked/unchecked; Stepper - on step change: icon & label color change; Switch - on switching on/off: color change |
| transitionDurationShorter | 200ms | Ripple Effect - on hover/focus/pressed: ripple; Select - Placeholder - opacity; SvgIcon - adding initial color |
| transitionDurationShort | 250ms | Accordion - Background color/opacity change; Button - on hover/focus/pressed: Background color/Color/Border color change; LoadingButton - Loading progress: Background color/color/opacity change |
| transitionDurationStandard | 300ms | Accordion - Expand/Collapse: change margin/height/background-color; Chip (clickable) - on hover/focus/pressed: Background color/box-shadow change; CircularProgress (variant-determinate) - transition for stroke-dashoffset; Collapse - Expand/Collapse: change height; LinearProgress - variant-determinate/buffer: transform progressbar; Paper - adding initial box-shadow; Tabs - on change tab: indicator change |
| transitionDurationComplex | 375ms | — |
| transitionDurationEnteringScreen | 225ms | Badge - Show; Dialog - Open; Fade - Element fade in effect |
| transitionDurationLeavingScreen | 195ms | Badge - Hide; Dialog - Close; Fade - Element fade out effect |

---

## 8. Grids

### Introduction
Grids provide a structured layout system for arranging UI elements consistently across the interface. They ensure visual alignment, balance, and harmony across all pages and containers.

### Standard 12 Column Grid
The 12-column grid is the standard grid followed across the IQM design system. If the necessity arises to use a 5-column grid or other custom configuration, one can define such a grid as well.

### Grids with Equal Division

| Layout | Column Split |
|--------|-------------|
| Two equal columns | 6 + 6 |
| Three equal columns | 4 + 4 + 4 |
| Four equal columns | 3 + 3 + 3 + 3 |

### Grids with Unequal Division

| Layout | Column Split | Margin/Gutter Notes |
|--------|-------------|---------------------|
| Sidebar + Main | 3 col + 9 col | 40px outer margin, 12px gutter, 24px inner gutter |
| Narrow sidebar + Main + Aside | 3 col + 8 col + 1 col | 12px gutter, 24px inner |
| Main + Sidebar | 7 col + 5 col | — |
| Content + Multi | 3 col + 7 col + 2 col | — |
| Reversed | 5 col + 7 col | — |

### Custom Column Grids

| Grid Type | Gutter | Margin |
|-----------|--------|--------|
| Custom 5 column Grid | 24px | 12px |
| Custom 20 column Grid | 24px | 12px |

### Custom Gutter Spaces

**Non uniform horizontal gutter:**
- Mix of 24px and 40px gutters applied horizontally across different sections

**Non uniform vertical and horizontal gutter:**
- Vertical: 40px / 48px / 40px / 56px
- Horizontal: 40px consistently

### Nested Grids
Nested Grids are grids inside a nested container, used to arrange blocks inside containers. These grids are not rigid — they depend upon user requirement.

- 12 Column Grid is the standard followed, but if the necessity arises to use a 5-column grid, one can define such a grid
- Grids also consist of gutter space — gutter space can be customised
- Grids help in making layout better, easy and clean, so it is advised to use the necessary grid in every container

**Nested grid spacing values:**

| Measurement | Value |
|-------------|-------|
| Inner column gutter | 20px |
| Outer section gutter | 28px |
| Inner margin | 20px |
| Outer container padding | 38px |

---

## 9. Filters

### Introduction
Filters allow users to narrow down data sets and column visibility in table and page-level contexts. Filters appear in two surfaces: an **inline panel** (table-level) and a **side drawer** (page-level).

### Inline Filter Panel (Table-level)

Triggered from a filter icon (funnel icon) in the table toolbar. Displays a dropdown checklist panel attached to the trigger.

**Structure:**
- Trigger icon: funnel icon — badge shows active filter count (e.g. `1`, `6`)
- Header: "Filter" label
- Actions: Select All / Clear All
- Groups: labelled category sections (e.g. Status, Measurement Partner)
- Items: checkbox + label (+ icon where applicable)

**States flow:**
1. Closed (no badge) → trigger icon only
2. Open with no selection → dropdown visible, no items checked
3. 1 item selected → badge shows `1`, item checked
4. Multiple items selected → badge shows count (e.g. `6`), items checked
5. All cleared → badge removed, all items unchecked

### Columns Panel (Table-level)

Same structure as the Filter panel but for toggling column visibility.

**Structure:**
- Trigger icon: columns/grid icon — badge shows selected column count (e.g. `30`)
- Header: "Columns"
- Actions: Select All / Clear All
- Groups: labelled sections (e.g. Date and Time, Budget)
- Items: checkbox + label

**States flow:**
1. Closed → trigger icon only
2. Open → dropdown visible
3. 1 item selected → badge shows count
4. Multiple selected → badge updates
5. All selected → full count shown in badge

### Side Drawer Filter (Page-level)

Full-height side drawer panel used for page-level filtering (e.g. audience filtering by Vertical, Source, Price, Reach).

**Structure:**
- Trigger: "Filters" button with dropdown chevron in the page toolbar
- Left navigation panel: list of filter categories (e.g. Vertical, Source, Price, Reach) — active category is highlighted with a left border indicator
- Right content panel: search field ("search partner or provider") + Select All / Clear All + scrollable checkbox item list
- Footer: Cancel + Apply (Primary) buttons
- Active selection badge shown on the category label in the left nav (e.g. `Source (2)`)

**Item list behaviours:**
- Search field filters the list in real time
- Empty state: "No results found" when search returns nothing
- Selected items persist across category switches within the same session
- The badge count on the category reflects committed (Applied) selections, not in-progress ones
- On Apply: selections are committed and drawer closes
- On Cancel: in-progress selections are discarded and drawer closes

**Filter category content:**

| Category | Item Type | Example Values |
|----------|-----------|----------------|
| Vertical | Checkbox list | Political, Healthcare, Specialty |
| Source | Searchable checkbox list with provider logos | IQM Political, IQM Healthcare, Liveramp, Semcasting, Arc Initiatives, i360, Aristotle, TargetSmart, L2 Political |
| Price | Predefined range checkboxes | $0–$1, $1.01–$2, $2.01–$5, $5.01–$10, $10.01+ |
| Reach | Predefined range checkboxes | Unknown, <10K, 10K to 100K, 100K to 1M, 1M+ |

---

## 10. Components

### Global Component States
All interactive components support the following states unless noted otherwise:
- Normal
- Hover
- Pressed / Active
- Focused
- Disabled

### Global Component Sizes
All components that have sizing support the following sizes unless noted otherwise:
- Large
- Medium
- Small

---

### Buttons

#### Introduction
Buttons enable users to take action and are available in various styles to suit different needs. They effectively highlight key tasks and guide users through processes.

#### Global Properties

| Property | Options |
|----------|---------|
| Styles | Theme Blue · Neutral · Error · Success · Warning · Information |
| State | Normal · Hover · Pressed · Disabled · Icon Loading · Loading · Focused · Selected |
| Size | Large · Medium · Small |
| Types | Filled · Outline · Text · Icon |

#### Anatomy
A button consists of:
- **Label** — the text label is the most important element on a button, as it communicates the action that will be performed when the user interacts with it
- **Left Icon** — an icon can be paired with a label to provide a visual cue for the action
- **Right Icon** — an icon alone can represent less prominent actions or those requiring minimal effort, such as deleting items or downloading files

#### Button Types

**Filled**  
A filled button, with its solid background, is designed to be more eye-catching and noticeable. It highlights key actions or choices in an interface, drawing user focus where it's most needed.

**Outlined**  
Outlined buttons feature a border with no solid background, offering a more subtle visual cue. They are used for secondary actions or options, providing a less prominent emphasis compared to filled buttons.

**Text**  
Text buttons are designed for actions that need less emphasis. Their minimal styling makes them perfect for secondary interactions or additional options where strong prominence isn't necessary.

#### Button Styles

**Primary**  
The primary button highlights the most important action on a page. To maintain a clear visual hierarchy and avoid overwhelming users, it's recommended to use only one primary button per page, with a maximum of two when absolutely necessary. This ensures clarity and keeps the focus on the key actions.

**Neutral**  
The Neutral button is designed for actions with lower emphasis. It complements other button types to highlight less prominent options and should not be used as the sole button in a group.

**Error**  
The Error button should be used to highlight actions that may lead to undesirable outcomes or have potential negative consequences. Use it with caution and only when necessary.

#### Button Sizes — Filled Buttons

| Size | Height | Padding H (outer / inner) | Padding V | Corner Radius |
|------|--------|--------------------------|-----------|---------------|
| Large | 42px | 16px / 8px | 9px | 2px |
| Medium | 34px | 12px / 4px | 6.5px | 2px |
| Small | 26px | 8px / 4px | 4px | 2px |

#### Button Sizes — Icon Buttons

| Size | Height | Gap | Border | Corner Radius |
|------|--------|-----|--------|---------------|
| Large | 42px | 9px | 1px | — |
| Medium | 34px | 6px / 6.5px | 1px | — |
| Small | 26px | 4px | 1px | — |

#### Button Variants Matrix

**Filled Buttons — States:**

| Style | Normal | Hover | Pressed | Disabled | Focused | Icon-Loading | Loading |
|-------|--------|-------|---------|----------|---------|-------------|---------|
| Primary | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Neutral | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Error | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

**Outline Buttons — States:**

| Style | Normal | Hover | Pressed | Disabled | Focused | Icon-Loading | Loading |
|-------|--------|-------|---------|----------|---------|-------------|---------|
| Primary | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Neutral | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Error | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

**Text Buttons — States:**

| Style | Normal | Hover | Pressed | Disabled | Focused | Icon-Loading |
|-------|--------|-------|---------|----------|---------|-------------|
| Primary | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Neutral | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Error | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

**Icon Buttons — States:**

| Style | Normal | Hover | Pressed | Disabled |
|-------|--------|-------|---------|----------|
| Primary | ✓ | ✓ | ✓ | ✓ |
| Neutral | ✓ | ✓ | ✓ | ✓ |
| Error | ✓ | ✓ | ✓ | ✓ |

#### Button Usage Guidelines

**Single Primary Button**  
The layout should have at most one Primary button that stands out as the most important action, with other buttons being visually less prominent.

**Hierarchy and Order**  
Button hierarchy uses visual cues like styles and sizes to show the importance of buttons. There are three types: filled for main actions, outline for secondary actions, and text for less important tasks. Buttons should be ordered by importance: primary first, then secondary, and tertiary last.

**Placements**  
Buttons can be positioned on the left or right side of the screen, with the right alignment preferred based on the content. Avoid placing buttons at the center of the screen or stacking them vertically.

**Using Icons**  
Icons can be used on buttons to make their purpose clearer if the icon is directly related to the action. Avoid using icons just for decoration.

#### Button Do's and Don'ts

**Custom Buttons**
- ✅ Use pre-defined buttons to maintain consistency
- ❌ Avoid using custom color or size for the buttons

**Label Casing**
- ✅ Always use Title Case for the button labels
- ❌ Avoid using sentence case or full capitalization

**Concise Labels**
- ✅ Use 1 or 2 words to describe the actions
- ❌ Avoid using sentences, periods or exclamation points

**Truncation and Wrapping**
- ✅ Adjust the button position to fit the layout
- ❌ Avoid truncation or wrapping of button labels

---

### Icon-Toggle Button

#### Introduction
Icon-Toggle Buttons are square icon-only buttons used in groups for toggling between views or actions (e.g. layout switchers, toolbar actions).

#### Global Properties

| Property | Options |
|----------|---------|
| State | Normal · Hover · Active · Pressed · Disabled · Focused |
| Size | Large · Medium · Small |

#### Sizes

| Size | Height | Padding H | Icon Gap | Border | Corner Radius | Min-width |
|------|--------|-----------|----------|--------|---------------|-----------|
| Large | 86px | 16px | 4px | 1px | 4px | 86px |
| Medium | 70px | 12px | 2px | 1px | 4px | 70px |
| Small | 54px | 8px | 2px | 1px | 4px | 54px |

#### Button Group Usage
When used in a group, the gap between each Icon-Toggle Button is **24px**.

---

### Slider

#### Introduction
Sliders allow users to select a value or range of values along a track.

#### Global Properties

| Property | Options |
|----------|---------|
| Types | Continuous · Range |
| Size | Large · Medium · Small |
| State | Normal · Hover · Selected · Focused · Disabled |
| Boolean | Show Values · Show Marks |

#### Slider Specs

| Size | Track Height | Thumb Diameter | Tooltip |
|------|-------------|----------------|---------|
| Large | 8px | 20px | ✓ |
| Medium | 6px | 20px | ✓ |
| Small | 2px | 20px | ✓ |

#### Slider Types

**Continuous** — Single thumb; user selects a single value along the track.  
**Range** — Two thumbs; user selects a range between a minimum and maximum value.

#### Slider States
- **Normal** — default resting state
- **Hover** — thumb and track respond on cursor proximity; tooltip appears
- **Selected** — value is actively selected; tooltip persists
- **Focused** — keyboard focus ring applied to thumb
- **Disabled** — track and thumb are muted; interaction is blocked

---

### Toasts / Snackbar

#### Introduction
Toasts (also called Snackbars) are brief, non-blocking notifications that appear to provide feedback about an operation or to display a short message. They appear temporarily and do not require user action unless they contain a dismissible action.

#### Global Properties

| Property | Options |
|----------|---------|
| Styles | Error · Success · Warning · Information |
| Types | Filled · Outlined |
| Alterations | Dismissible · Title · Description · Action-right |

#### Toast Structure

| Property | Value |
|----------|-------|
| Width | 314px |
| Min-height | 114px |
| Left stroke | 4px (inside) |
| Left icon size | 24 × 24px |
| Right dismiss icon button | Small — 26 × 26px |
| Padding top (outer) | 16px |
| Padding bottom (outer) | 16px |
| Padding top (inner — between title and message) | 8px |
| Padding bottom (inner) | 8px |
| Padding left (outer) | 16px |
| Padding right (outer) | 16px |
| Padding left (inner — between icon and text) | 8px |
| Padding right (inner — between text and action) | 8px |

#### Variant Usage

| Variant | Elements present |
|---------|-----------------|
| Title + Message + Action | Title label, message text, action link, dismiss button |
| Message + Action | Message text, action link, dismiss button (no title) |
| Message | Message text, dismiss button only |

#### Types of Toasts

| Type | Left stroke color | Icon |
|------|------------------|------|
| Success | Success palette | ✓ checkmark |
| Warning | Warning palette | ⚠ warning |
| Error | Danger palette | ⚠ error |
| Information | Info palette | ℹ info |

---

### Alerts

#### Introduction
Alerts are inline notification components used to communicate important information, warnings, errors, or confirmations directly within the page content.

#### Global Properties

| Property | Options |
|----------|---------|
| Styles | Neutral · Error · Success · Warning · Information |
| Types | Filled · Outlined |
| Alterations | Title · Action · Dismissible |

#### Alert Structure

| Property | Value |
|----------|-------|
| Height | 42px |
| Width | 394px |
| Corner radius | 4px |
| Border | 1px (inside stroke) |
| Padding top | 8px |
| Padding bottom | 8px |
| Padding between title and message | 4px |
| Padding left (icon gap) | 8px |
| Padding right | 8px |
| Action link gap | 12px |

#### Variant Usage

| Variant | Elements present |
|---------|-----------------|
| Title + Message + Action | Title label, message text, action link, dismiss button |
| Message + Action | Message text, action link, dismiss button (no title) |
| Message | Message text only |

#### Types of Alerts

| Type | Usage context |
|------|--------------|
| Neutral | General information with no semantic urgency |
| Error | System errors, validation failures, destructive consequences |
| Success | Successful operations or positive confirmation |
| Warning | Cautionary messages requiring user awareness |
| Info | Informational messages providing context or guidance |

---

### Horizontal Tabs

#### Introduction
Horizontal tabs allow users to switch between different views or sections arranged side by side along a horizontal axis. The active tab is indicated by a 2px bottom border.

#### Global Properties

| Property | Options |
|----------|---------|
| State | Normal · Hover · Active · Pressed · Focused · Disabled |
| Size | Large · Medium · Small |

#### Tab Sizes

| Size | Height | Padding H (outer / inner) | Icon gap | Indicator thickness |
|------|--------|--------------------------|----------|---------------------|
| Large | 42px | 16px / 8px | 8px | 2px bottom border |
| Medium | 34px | 12px / 4px | 4px | 2px bottom border |
| Small | 26px | 8px / 4px | 4px | 2px bottom border |

#### Content Variants
- Icon + Label + Count
- Label + Count
- Icon + Label
- Label only

#### Multiple Tab Usage
Tabs are displayed in a single horizontal row. Each tab item uses the same size spec. The active tab displays the 2px bottom border indicator in the primary theme color.

---

### Vertical Tabs

#### Introduction
Vertical tabs allow users to switch between different views or sections arranged in a vertical stack on the left side of the content area. The active tab is indicated by a 2px left border.

#### Global Properties

| Property | Options |
|----------|---------|
| State | Normal · Hover · Pressed · Active · Disabled · Focused |
| Size | Large · Medium · Small |

#### Tab Sizes

| Size | Height | Padding H (outer / inner) | Icon gap | Indicator thickness |
|------|--------|--------------------------|----------|---------------------|
| Large | 42px | 16px / 8px | 8px | 2px left border |
| Medium | 34px | 12px / 4px | 4px | 2px left border |
| Small | 26px | 8px / 4px | 4px | 2px left border |

#### Content Variants
- Icon + Label + Count
- Label + Count
- Icon + Label
- Label only

#### Active State
The active tab in Vertical Tabs displays:
- 2px left border indicator in the primary theme color
- Background surface color: **Primary-50** of the active theme (e.g. `#F2F6FF` for Blue, `#F2F6FF` for Green, `#FBF5FF` for Purple)

This Primary-50 background fill makes the active tab visually distinct from the rest of the list without being too heavy.

#### Multiple Tab Usage
Tabs are stacked vertically. Each tab item is full-width within its container. The active tab displays the 2px left border indicator + Primary-50 background in the active theme color.

---

### Capsule Tabs

#### Introduction
Capsule Tabs are a contained tab component used as an alternative to standard underlined or vertical tabs. They work in both horizontal and vertical orientations. The container and individual tab items use **4px rounded corners** (borderRadius-4), not a full pill/circle shape despite the "capsule" name.

#### Global Properties

| Property | Options |
|----------|---------|
| State | Normal · Hover · Active · Pressed · Focused · Disabled |
| Size | Large · Medium · Small |

#### Visual Style
- Container: 4px border radius (borderRadius-4)
- Individual tab items: 4px border radius (borderRadius-4)
- Active tab background: **Primary-50** of the active theme color
- Active tab has no underline or left border indicator — the filled Primary-50 background is the sole active indicator

#### Tab Sizes

| Size | Height | Padding H (outer / inner) | Icon gap | Corner radius | Active indicator |
|------|--------|--------------------------|----------|---------------|-----------------|
| Large | 42px | 16px / 8px | 8px | 4px | Primary-50 background fill |
| Medium | 34px | 12px / 4px | 4px | 4px | Primary-50 background fill |
| Small | 26px | 8px / 4px | 4px | 4px | Primary-50 background fill |

#### Content Variants
- Icon + Label + Count
- Label + Count
- Icon + Label
- Label only

#### Multiple Tab Usage

**Horizontal orientation** — tabs are displayed in a single horizontal row inside a 4px-rounded container group. Active tab shows Primary-50 background fill.

**Vertical orientation** — tabs are stacked vertically inside a 4px-rounded container group. Active tab shows Primary-50 background fill.

---

### Stepper

#### Introduction
Steppers communicate progress through a numbered or icon-based sequence of steps in a flow.

#### Global Properties

| Property | Options |
|----------|---------|
| Types | Horizontal-number · Horizontal-icon · Vertical-number · Vertical-icon · Dashed |
| State | Active · Inactive · Error |
| Count | 2 · 3 · 4 · 5 · 6 |
| Layer properties | has text · has sub-text · has sub-block · has action |

#### Stepper Variants

**Dashed Steppers**  
A linear progress bar style stepper. Shows the current step out of total steps (e.g. "1 out of 6 Steps"). The filled portion of the bar grows as the user progresses.

**Horizontal Steppers**  
Steps are laid out left to right. Each step has a number badge (or icon) and a label. Available layout options:
- With Info Text (step label only)
- With Sub Text (step label + optional sub-label below)
- With Label (step number displayed above, step label and sub-label below)

States per step:
- **Active** — step is currently in progress (highlighted, filled indicator)
- **In Active** — step has not yet been reached (muted indicator)
- **Error** — step has an error (red indicator + red label text)

Number variant uses numbered circles. Icon variant uses icon-filled circles.

**Vertical Steppers**  
Steps are stacked top to bottom. Each step has a number badge (or icon) and a label.

Simple vertical — shows step indicator + label only.

Vertical with sub-block — active step expands to reveal optional descriptive text below the step label, plus Back / Continue action buttons.

**Direction Stepper**  
A linear track with color-coded fill indicating progress status:
- Red track = danger / error state
- Amber/yellow track = warning state
- Green track = success / completion state

---

### Progressors

#### Introduction
Progressors communicate the loading or processing state of an operation. They are used when a task has an indeterminate or determinate duration.

#### Global Properties

| Property | Options |
|----------|---------|
| Styles | Theme Blue · Neutral · Error · Success · Warning · Information |
| State | Loading |
| Types | Linear · Spinners · Buffer Linear |
| Sizes | 16px · 18px · 20px · 24px · 26px · 32px · 36px · 40px · 48px · 56px · 64px · 80px · 120px · 180px · 240px |

#### Variants

**Linear Progressbar**  
A horizontal bar that fills left to right to indicate progress. Transition: `transitionDurationStandard: 300ms`.

**Spinners**  
A circular ring that animates to indicate loading. Transition: `transitionDurationStandard: 300ms`.

**Buffer Linear**  
A linear bar with a secondary buffer indicator, used when data is being buffered ahead of the current progress point.

---

### Modal

#### Introduction
Modals are overlay dialogs that appear above the main page content to capture user focus for important tasks, confirmations, or forms.

#### Global Properties

| Property | Options |
|----------|---------|
| Size | XXL · XL · LG · MD · SM · XS |

#### Modal Structure
- **Header** — contains the modal title (icon + text) and optional close (×) button
- **Body** — swappable content area (form, image, text, etc.)
- **Footer** — contains stepper indicator (left) and action buttons (right): Secondary · Tertiary · Primary

#### Modal Sizes

| Size | Width Range |
|------|------------|
| XXL | 1201px – 1400px |
| XL | 993px – 1200px |
| LG | 769px – 992px |
| MD | 577px – 768px |
| SM | 445px – 576px |
| XS | Screen size − 64px (up to 444px) |

#### Modal Specs

| Property | Value |
|----------|-------|
| Header height | 48px |
| Footer height | 48px |
| Body min-height | flexible / content-driven |
| Body padding horizontal | 24px |
| Body padding vertical | 24px |
| Outer margin (from screen edge) | 32px |

#### Modal Variants

| Variant | Description |
|---------|-------------|
| Standard Modal | Header + Body + Footer with actions |
| Modal with info message | Footer contains an info message (ℹ) on the left before the actions |
| Modal with Stepper | Footer left side shows stepper indicator ("1 out of 3 Steps") |
| Modal without Header | No header bar — body starts at the top |
| Modal with Header without close action | Header visible but no × dismiss button |

---

### Input

#### Introduction
Input components allow users to enter and edit text. They come in multiple visual styles and support a wide range of states and content types.

#### Global Properties

| Property | Options |
|----------|---------|
| Size | Large · Medium · Small |
| Type | Input-Single Line-Dashed · Input-Single Line-Filled (Neutral) · Input-Single Line-Filled (Theme Blue) · Input-Single Line-Outline · Input-Single Line-Tag · Text-area · XL Input |
| State | Normal · Hover · Active · Filled · Error · Error-Active · Normal-Disabled · Filled-Disabled · Read Only · Warning · Success · Info |

#### Anatomy
Every input variant shares the same anatomy structure:
- **Left icon** (optional) — appears inside the field on the left; used for search, context, or type indicators
- **Placeholder text** — visible when field is empty; disappears on active/filled
- **Input text** — user-entered value; replaces placeholder when filled
- **Right icon** (optional) — appears on the right inside the field; used for clear (×), visibility toggle, or info (ⓘ)
- **Assistive text** — appears below the field; provides guidance, error messages, or validation feedback
- **Label** — appears above the field (Text Area and Tag types); not floated, always above

#### Input Type Descriptions

**Dashed Input**
Bottom border only, rendered as a dashed line. No full rectangular box. Used for inline editing or lightweight data entry where a full border box would feel too heavy visually. Left icon + placeholder text visible in normal state.

**Filled Input — Neutral**
Filled background using neutral surface color. Full box border appears on active/focus. The fill communicates the field is interactive without the weight of a full outline at rest.

**Filled Input — Theme Blue**
Filled background using the primary theme blue tint. Visually stronger than neutral fill — used to draw more attention to a key input field within a form.

**Outline Input — Neutral**
Full rectangular border at rest. Standard outlined input for form contexts. Clearest visual boundary of all single-line types.

**Single Line Input — Tag**
Allows multiple selected values to appear as removable chip tokens inside the input field. Tags appear left-aligned inside the field with a label on each chip and an × to dismiss. A percentage symbol (%) or unit can appear on the right side of the field. Chips stack horizontally and wrap if multiple values are present.

**Text Area**
Multi-line text input. Always has a Label above and Assistive text below. Height grows with content or is fixed with internal scroll. Left icon present; right icon (ⓘ) visible in normal and hover states.

**XL Input**
Oversized single-line input for prominent, high-priority data entry. Used for campaign names or other values that are the primary input on a screen.

#### Input States

All six input types (Dashed, Filled-Neutral, Filled-Theme Blue, Outline-Neutral, Tag, Text Area) respond to the same set of states. Each state is applied consistently across all types.

| State | Visual behaviour |
|-------|-----------------|
| Normal | Placeholder text visible · Left icon visible · Right icon (ⓘ) visible · Assistive text below · No active border |
| Hover | Subtle background or border shift to indicate interactivity · Placeholder still visible |
| Active | Cursor (pipe) visible inside field · Border highlighted in theme primary color · Assistive text below |
| Filled | User value replaces placeholder · Label visible above (Tag/Text Area) · Right icon (×) may appear for clearing |
| Error | Red border on the field · Assistive text turns red · Error message shown below · Right icon visible |
| Error-Active | Active cursor inside an error-state field · Red border persists · Red assistive text visible |
| Normal-Disabled | Placeholder visible · Full field at 40% opacity (opacityDisabled token) · No interaction possible |
| Filled-Disabled | User value visible · Full field at 40% opacity (opacityDisabled token) · No interaction possible |
| Read Only | Value displayed · Field not editable · Visually distinct from disabled — styled as locked, not faded |
| Warning | Amber/warning color border · Warning assistive text below in Warning palette color |
| Success | Green border · Success assistive text below in Success palette color |
| Info | Blue/info border · Info assistive text below in Info palette color |

#### State × Type Variant Matrix

Every state applies across all input types:

| State | Dashed | Filled-Neutral | Filled-Blue | Outline | Tag | Text Area |
|-------|--------|----------------|-------------|---------|-----|-----------|
| Normal | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Hover | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Active | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Filled | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Error | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Error-Active | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Normal-Disabled | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Filled-Disabled | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Read Only | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Warning | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Success | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Info | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

---

### Callout Field

#### Introduction
The Callout Field is a specialised large-format input component used exclusively for high-priority numeric data entry — primarily **campaign and insertion order budgets**. In AdTech, the campaign budget is the most critical value a user sets; the Callout Field gives it visual prominence and weight that a standard input cannot. It is not a general-purpose input — it is purpose-built to communicate importance.

#### Use Cases
- Insertion Order Budget (primary use case)
- Campaign Total Budget
- Any single high-stakes numeric value that must be immediately visible, clearly editable, and hard to overlook in a form or settings panel

#### Why It Exists
Standard input fields in a form blend together visually. For budget entry in a programmatic advertising platform, the financial value must stand apart from all other fields. The Callout Field achieves this through:
- A larger display size for the numeric value
- A distinct filled or bordered container that creates a card-like prominence
- A prefix symbol (e.g. `$`) always visible, reinforcing that this is a monetary field
- A field label and info icon (ⓘ) above the value to identify the field clearly
- A visibility toggle icon (eye icon) on the right for showing/hiding the value when needed

#### Global Properties

| Property | Options |
|----------|---------|
| Size | Large · Medium · Small |
| Type | Theme-Blue · Neutral |
| State | Normal · Normal-Hover · Filled-Hover · Active · Filled · Error · Error-Active · Normal-Disabled · Filled-Disabled · Read Only · Warning · Success · Info |

#### Anatomy
- **Field label** — appears above the value area (e.g. "Insertion Order Budget"); includes an info icon (ⓘ) and required asterisk (*) when applicable
- **Currency prefix** — `$` symbol displayed at the left of the value area; always visible regardless of state
- **Value** — the numeric amount displayed in large, bold type (e.g. `00,000.00` as placeholder or `10,000.00` when filled)
- **Right icon** — eye/visibility toggle icon on the right side of the field
- **Assistive text** — appears below the entire field container; provides validation or guidance

#### Type Descriptions

**Theme Blue**
The field container uses the primary blue tint as its background fill (similar to Filled Input — Theme Blue). Creates the strongest visual prominence. Recommended for the primary budget field on a page.

**Neutral**
The field container uses a neutral/light surface color or a simple outlined box. Less visually dominant than Theme Blue but still larger and more prominent than a standard input. Used when multiple budget fields appear on the same screen and only one should be dominant.

#### States

| State | Visual behaviour |
|-------|-----------------|
| Normal | Placeholder value visible (e.g. `$ 00,000.00`) · Label + ⓘ above · Eye icon right · Assistive text below · Container at rest |
| Normal-Hover | Container border or background subtly intensifies on cursor hover · Placeholder still visible |
| Filled-Hover | User value visible (e.g. `$ 10,000.00`) · Container intensifies on hover · Eye icon visible |
| Active | Cursor visible after `$` prefix · Value being edited · Border highlights in primary color |
| Filled | User value displayed in large bold type · Container styled at rest with value |
| Error | Red border on container · Assistive text turns red · Value still visible |
| Error-Active | Cursor active inside error-state field · Red border persists · Red assistive text |
| Normal-Disabled | Placeholder visible · Full field at 40% opacity (opacityDisabled) · No interaction |
| Filled-Disabled | Value visible · Full field at 40% opacity (opacityDisabled) · No interaction |
| Read Only | Value visible · Diagonal stripe or lock pattern on field · Not editable |
| Warning | Amber border · Warning assistive text in Warning palette color |
| Success | Green border · Success assistive text in Success palette color |
| Info | Blue border · Info assistive text in Info palette color |

---

### Input-Select

#### Introduction
Input-Select is a dropdown selection component that allows users to choose one or multiple options from a list. It combines an input trigger with a dropdown menu panel.

#### Global Properties

| Property | Options |
|----------|---------|
| State | Normal · Hover · Pressed · Disabled · Icon Loading · Loading · Focused · Selected |
| Size | Large · Medium · Small |
| Types | Input-Single Line-Dashed · Input-Single Line-Outline · Input-Single Line-Filled · Input-Single Line-Tag |

#### Select Component Structure

| Zone | Description |
|------|-------------|
| Input Area | The trigger field the user clicks to open the dropdown |
| Header | "Select Header" — contains a Select All checkbox |
| Search | Search field for filtering menu items |
| Actions | Select All and Clear All action links |
| Menu Items | Scrollable list of checkboxes with labels |

#### Select Component States

| State | Description |
|-------|-------------|
| Normal | Trigger field visible, dropdown closed |
| Hover | Trigger field highlighted on cursor hover |
| Active / Open | Dropdown panel is open; items visible |
| Empty | Dropdown open but no results found — displays "No results found / We can't find any items matching your search" |

#### UX Note
Show only 5–7 menu items upfront. For menu items beyond that count, a scrollbar should be present inside the dropdown menu panel.

---

### Breadcrumbs

#### Introduction
Breadcrumbs show the user's current location within a page hierarchy and provide navigation links back to parent pages.

#### Structure
Breadcrumb items are separated by a separator character. There is 8px of horizontal spacing on each side of the separator.

#### Variants

**Basic Breadcrumb** — plain text links separated by a separator.  
**Breadcrumb with Dropdown** — one or more breadcrumb items replaced with a dropdown select component.

#### Separators
- `/` (slash) — default separator
- `>` (chevron) — alternative separator

#### Behaviour — Trail Truncation
When the breadcrumb trail exceeds the available space or maximum steps, the middle items are collapsed into a `...` (ellipsis) element. Clicking the ellipsis expands the full trail to show all steps.

**Example:**
- Collapsed: `Page 1 / ... / Page 5`
- Expanded: `Page 1 / Page 2 / Page 3 / Page 4 / Page 5`

#### UX Notes
- User must use at max **5 steps** for the Breadcrumbs
- Instead of a text link, any small component can be used as a breadcrumb item (Dropdown, Chip, Button, etc.)

---

### Accordions

#### Introduction
Accordions are expandable/collapsible content containers used to progressively disclose information. They reduce visual clutter by hiding content until the user requests it.

#### Global Properties

| Property | Options |
|----------|---------|
| States | Close · Open |

#### Structure
- **Header** — contains: icon (optional) · Title · Swap slot (for custom content) · Link · Edit action · Chevron (expand/collapse indicator)
- **Body** — swappable content slot; accepts any content type

Height is fully content-driven — there is no fixed height for the accordion body.

#### Accordion States

**Closed** — only the header is visible; chevron points downward.  
**Open** — header remains visible; body content is revealed below; chevron rotates to point upward.

#### Animation
- Expand/collapse (height and margin change): `transitionEasingEaseInOut` · `transitionDurationStandard` (300ms)
- Background color/opacity change: `transitionEasingEaseInOut` · `transitionDurationShort` (250ms)
- Expand icon rotation: `transitionEasingEaseInOut` · `transitionDurationShortest` (150ms)

---

*IQM Design System · source: design.stage.iqm.com*
