### 1.Core Principles

- ** Minimalist ** Use generous white space and avoid unnecesary visual elements to "fill up" space.
- ** Consistency ** All components and pages should use the same colors, typography, and styles.
- ** Simplicity ** Prioritize icons, short labels, and intuitive interactions.
- ** Warmth ** Use the soft pastel color pallette with rounded shapes.
- ** Accessibility ** Maintain readable text, suffcient contrast and accessible markup.
- ** Responsiveness ** Support desktop, tablet and mobile browsers.

### 2.Color Palette

### Primary Brand Colors

| Color      | Hex Value | Use                               |
| ---------- | --------- | --------------------------------- |
| Sage Green | `#87A98C` | Branding, Home navigation         |
| Soft Peach | `#F2B69D` | Memories navigation, memory cards |
| Lavender   | `#B9A7D0` | Insights navigation, statistics   |
| Muted Gold | `#E8C66A` | Settings navigation, highlights   |

The application should remain predominantly white, using the four brand colors as accents.

### Neutral and supporting colors

| Color                 | Hex Value | Use                                    |
| --------------------- | --------- | -------------------------------------- |
| White                 | `#FFFFFF` | Primary background                     |
| Soft Surface          | `#F8FAF8` | Secondary backgrounds                  |
| Dark Charcoal         | `#29332D` | Main text                              |
| Secondary Gray        | `#6B756E` | Supporting text                        |
| Light Border          | `#E6EBE6` | Cards, inputs, dividers                |
| Dark Sage             | `#55765C` | Primary buttons, active text links     |
| Light Sage            | `#E9F1EA` | Selected states and subtle backgrounds |
| Soft Peach Surface    | `#FBEFEA` | Memories cards                         |
| Soft Lavender Surface | `#F3EFF8` | Insights cards                         |

### Color Rules

1. Use white for the main page background.
2. Use Dark Charcoal for the main text.
3. Use dark sage for primary action buttons.
4. Use pastel colors for navigation icons and cards.

### 3. Typography

### Font Family

- **Primary Font** Geist Sans

Fallback Arial, Helvetica, sans-serif.

### Typography Scale

| Element              | Font Size | Weight |
| -------------------- | --------- | ------ |
| Main Heading (H1)    | 32–36px   | 600    |
| Section Heading (H2) | 24px      | 600    |
| Card Heading (H3)    | 20px      | 600    |
| Body Text            | 16px      | 400    |
| Secondary Text       | 14px      | 400    |
| Small Labels         | 12px      | 500    |
| Button Text          | 14–16px   | 600    |
| Navigation Labels    | 12px      | 500    |

### Typography Rules

- Use sentence case for headings and buttons.
- Avoid excessive bold text.
- Prefer short, friendly messages.
- Use dark charcoal for headings and body text.
- Keep secondary text readable against white backgrounds.
- Use a line height of approximately 1.5 for body text.

## 4. Logo & Branding

### Primary Logo

The Gratitude Jar logo consists of:

- A minimalist jar outline.
- A heart-shaped spiral inside the jar.
- Sage green linework.
- The lowercase text "gratitude jar" in black.

### 5. Buttons

All buttons should have rounded corners, consistent heights, and clear hover/focus states.

### Primary Button

Used for the main action on each screen.

Example: **Add Gratitude**

| Property           | Value                            |
| ------------------ | -------------------------------- |
| Background         | `#55765C`                        |
| Text               | `#FFFFFF`                        |
| Border             | None                             |
| Border Radius      | 9999px (pill)                    |
| Height             | 48px                             |
| Horizontal Padding | 24px                             |
| Font Size          | 16px                             |
| Font Weight        | 600                              |
| Hover              | Darker sage `#416249`            |
| Disabled           | Muted gray with reduced emphasis |

Use only one prominent primary action per major screen section.

### Secondary Button

Used for supporting actions.

Example: **Open a memory**

| Property           | Value                      |
| ------------------ | -------------------------- |
| Background         | `#E9F1EA`                  |
| Text               | `#416249`                  |
| Border Radius      | 9999px                     |
| Height             | 44px                       |
| Horizontal Padding | 20px                       |
| Hover              | Slightly darker light sage |

### Ghost / Text Button

Used for low-priority actions such as Cancel or Back.

- Transparent background.
- Dark sage or charcoal text.
- No visible border by default.
- Subtle background on hover.

### Destructive Button

Used for deleting gratitude entries.

- Use a restrained red color.
- Always provide confirmation before permanent deletion.
- Never use the primary sage color for destructive actions.

## 6. Icons

**Icon Library:** Lucide React

Recommended icon size: 20–24px.

### Navigation Icons

| Page         | Icon                | Accent Color |
| ------------ | ------------------- | ------------ |
| Home         | `House`             | Sage Green   |
| Memories     | `BookOpen`          | Soft Peach   |
| Insights     | `ChartNoAxesColumn` | Lavender     |
| Settings     | `Settings`          | Muted Gold   |
| User Account | `CircleUserRound`   | Charcoal     |
