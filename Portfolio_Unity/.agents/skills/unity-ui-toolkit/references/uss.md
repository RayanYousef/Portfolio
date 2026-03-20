# USS (Unity Style Sheets) Reference

## Table of Contents
1. [Selectors](#selectors)
2. [Layout (Flexbox)](#layout-flexbox)
3. [Sizing and Spacing](#sizing-and-spacing)
4. [Visual Styling](#visual-styling)
5. [Typography](#typography)
6. [Positioning and Transform](#positioning-and-transform)
7. [Display and Visibility](#display-and-visibility)
8. [CSS Variables](#css-variables)
9. [Transitions and Animations](#transitions-and-animations)
10. [What USS Does NOT Support](#what-uss-does-not-support)

---

## Selectors

```css
/* Type selector (lowest specificity) */
Button { }
Label { }

/* Class selector (medium) — use for styling */
.my-class { }
.card__header { }
.card__header--active { }

/* Name selector (highest) — reserve for overrides */
#btn-play { }

/* Pseudo-classes */
Button:hover { }
Button:active { }
Toggle:checked { }
TextField:focus { }
VisualElement:disabled { }

/* Child combinator (direct children only) */
.card > .card__title { }

/* Descendant selector (any depth) */
.panel Label { }

/* Combined */
.slide-toggle:focus .slide-toggle__input-knob { }
.slide-toggle__input--checked > .slide-toggle__input-knob { }
```

**BEM naming for classes:**
- `.block` — the component itself (`.card`, `.slide-toggle`, `.health-bar`)
- `.block__element` — a part of the component (`.card__title`, `.slide-toggle__input-knob`)
- `.block--modifier` — a variant/state (`.card--selected`, `.slide-toggle__input--checked`)

---

## Layout (Flexbox)

UI Toolkit uses Yoga Flexbox. **Default flex-direction is `column`** (items stack vertically).

```css
/* Vertical stack (default) */
.column { flex-direction: column; }

/* Horizontal row */
.row { flex-direction: row; }

/* Center everything */
.centered {
    justify-content: center;   /* main axis (vertical in column) */
    align-items: center;       /* cross axis (horizontal in column) */
}

/* Fill available space */
.fill { flex-grow: 1; }

/* Don't shrink below natural size */
.no-shrink { flex-shrink: 0; }

/* Wrap items to next line (grid-like) */
.grid {
    flex-direction: row;
    flex-wrap: wrap;
}

/* Space distribution */
.spaced-between { justify-content: space-between; }
.spaced-around { justify-content: space-around; }

/* Alignment */
.align-start { align-items: flex-start; }
.align-end { align-items: flex-end; }
.align-stretch { align-items: stretch; }  /* default */

/* Individual item override */
.self-center { align-self: center; }
```

### Common Layout Patterns

**Two-column layout:**
```css
.two-column { flex-direction: row; }
.two-column__sidebar { width: 250px; flex-shrink: 0; }
.two-column__content { flex-grow: 1; }
```

**Equal-width tabs:**
```css
.tabs { flex-direction: row; }
.tab { flex-grow: 1; }  /* all tabs share width equally */
```

**Centered overlay:**
```css
.overlay {
    position: absolute;
    left: 0; top: 0; right: 0; bottom: 0;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.6);
}
```

---

## Sizing and Spacing

```css
/* Fixed size */
width: 200px;
height: 100px;

/* Percentage */
width: 50%;

/* Constraints */
min-width: 100px;
max-width: 500px;
min-height: 50px;
max-height: 300px;

/* Flex sizing */
flex-grow: 1;       /* grow to fill */
flex-shrink: 0;     /* don't shrink */
flex-basis: auto;   /* initial size */

/* Margin (outside spacing) */
margin: 10px;
margin: 10px 20px;              /* vertical | horizontal */
margin-left: 5px;
margin-right: 5px;
margin-top: 5px;
margin-bottom: 5px;

/* Padding (inside spacing) */
padding: 10px;
padding: 5px 10px;              /* vertical | horizontal */
padding-left: 8px;
```

---

## Visual Styling

```css
/* Colors — use rgb(), rgba(), or named colors. Hex works in Unity 2022+ */
background-color: rgb(30, 30, 30);
background-color: rgba(0, 0, 0, 0.8);
background-color: #1e1e1e;

/* Background image */
background-image: url("project://database/Assets/Sprites/bg.png");
-unity-background-scale-mode: scale-to-fit;    /* scale-and-crop | stretch-to-fill */
-unity-background-image-tint-color: rgba(255, 255, 255, 0.5);

/* Borders */
border-width: 2px;
border-color: rgb(100, 100, 100);
border-radius: 8px;

/* Individual border sides */
border-left-width: 1px;
border-right-color: rgb(200, 200, 200);
border-top-left-radius: 10px;
border-bottom-right-radius: 10px;

/* 9-slice for scalable bordered backgrounds */
-unity-slice-left: 10;
-unity-slice-right: 10;
-unity-slice-top: 10;
-unity-slice-bottom: 10;

/* Opacity */
opacity: 0.8;
```

---

## Typography

```css
color: rgb(255, 255, 255);
font-size: 16px;

/* Unity-specific text properties */
-unity-font-style: bold;              /* normal | italic | bold | bold-and-italic */
-unity-text-align: middle-center;     /* upper-left | middle-left | middle-center | lower-right | etc. */
-unity-text-outline-width: 1px;
-unity-text-outline-color: rgb(0, 0, 0);

/* Text behavior */
white-space: normal;                   /* wraps text (default) */
white-space: nowrap;                   /* single line */
text-overflow: ellipsis;               /* truncate with ... */
overflow: hidden;                      /* required for ellipsis */
letter-spacing: 2px;
-unity-paragraph-spacing: 10px;

/* Font asset (requires Unity Font Asset, not raw .ttf) */
-unity-font-definition: url("project://database/Assets/Fonts/MyFont.asset");
```

---

## Positioning and Transform

```css
/* Relative (default) — stays in flow, offset from normal position */
position: relative;
left: 25px;

/* Absolute — removed from layout flow, relative to nearest positioned parent */
position: absolute;
left: 10px;
top: 10px;
right: 10px;
bottom: 10px;

/* Transform (can be transitioned) */
translate: 10px 20px;
translate: -50% -50%;    /* center an absolute element on its position */
scale: 1.2 1.2;
rotate: 45deg;
transform-origin: center;
```

**Center an absolute element:**
```css
.centered-absolute {
    position: absolute;
    left: 50%;
    top: 50%;
    translate: -50% -50%;
}
```

---

## Display and Visibility

```css
display: flex;           /* visible and participates in layout (default) */
display: none;           /* hidden AND removed from layout */

visibility: visible;     /* default */
visibility: hidden;      /* hidden but still occupies layout space */

overflow: visible;       /* children can overflow (default) */
overflow: hidden;        /* clip children to bounds */

cursor: link;            /* hand cursor for clickable elements */
```

---

## CSS Variables

Define theme variables on `:root` or any parent element:

```css
:root {
    --color-primary: rgb(52, 152, 219);
    --color-secondary: rgb(46, 204, 113);
    --color-danger: rgb(231, 76, 60);
    --color-bg: rgba(20, 20, 30, 0.95);
    --color-text: rgb(236, 240, 241);
    --color-text-muted: rgb(149, 165, 166);
    --font-sm: 12px;
    --font-md: 16px;
    --font-lg: 24px;
    --font-xl: 36px;
    --spacing-sm: 4px;
    --spacing-md: 8px;
    --spacing-lg: 16px;
    --radius: 4px;
    --radius-lg: 8px;
}

.button-primary {
    background-color: var(--color-primary);
    color: var(--color-text);
    border-radius: var(--radius);
    padding: var(--spacing-md) var(--spacing-lg);
}
```

**Component-scoped variables:**
```css
.radial-progress {
    --track-color: rgb(130, 130, 130);
    --progress-color: rgb(46, 132, 24);
}

.radial-progress__label {
    color: var(--progress-color);  /* inherits from parent scope */
}
```

**Unity built-in theme variables:**
```css
background-color: var(--unity-colors-slider_groove-background);
border-color: var(--unity-colors-slider_thumb-border);
border-color: var(--unity-colors-input_field-border-focus);
```

---

## Transitions and Animations

### Basic Transition
```css
.button {
    background-color: rgb(52, 152, 219);
    transition: background-color 0.2s ease-out, scale 0.15s ease-out;
}

.button:hover {
    background-color: rgb(93, 173, 226);
    scale: 1.05 1.05;
}

.button:active {
    scale: 0.98 0.98;
}
```

### Class-toggled Transitions (for show/hide animations)
```css
.panel {
    opacity: 0;
    translate: 0 30px;
    transition: opacity 0.3s ease-out, translate 0.4s ease-out-cubic;
}

.panel--visible {
    opacity: 1;
    translate: 0 0;
}
```
Toggle in C#: `panel.AddToClassList("panel--visible")` / `panel.RemoveFromClassList("panel--visible")`

### Multi-property Transitions (longhand)
```css
.slide-toggle__input-knob {
    transition-property: translate, background-color;
    transition-duration: 0.5s, 0.5s;
    translate: -1px 0;
}
```

### Available Timing Functions
`linear`, `ease`, `ease-in`, `ease-out`, `ease-in-out`,
`ease-in-cubic`, `ease-out-cubic`, `ease-in-out-cubic`,
`ease-in-back`, `ease-out-back`, `ease-in-out-back`,
`ease-in-elastic`, `ease-out-elastic`, `ease-in-out-elastic`,
`ease-in-bounce`, `ease-out-bounce`, `ease-in-out-bounce`

### Transitionable Properties
Most numeric and color properties: `opacity`, `translate`, `rotate`, `scale`, `width`, `height`, `margin-*`, `padding-*`, `background-color`, `border-color`, `color`, `border-width`, `border-radius`, `flex-grow`, `flex-shrink`.

Use `all` to transition everything (less performant).

### Important: First-frame Transitions
Transitions don't run on the first frame after adding an element. To animate an element appearing:
```csharp
root.Add(panel);
// Delay class addition by one frame
panel.schedule.Execute(() => panel.AddToClassList("panel--visible")).ExecuteLater(1);
```

---

## What USS Does NOT Support

These CSS features are **not available** — don't use them:

| Missing Feature | Workaround |
|----------------|------------|
| `calc()` | Compute values in C# and set via `style` property |
| `grid` layout | Use flexbox with `flex-wrap: wrap` for grid-like layouts |
| `@keyframes` / `animation` | Use transitions + class toggling, or C# `schedule.Execute()` |
| `::before` / `::after` | Add child elements manually in UXML or C# |
| `@media` queries | Use `GeometryChangedEvent` in C# for responsive layout |
| `box-shadow` | Use border or create a shadow overlay element |
| `em`, `rem`, `vw`, `vh` units | Only `px` and `%` are supported |
| `gradient()` | Use a gradient image or custom mesh drawing |
| Attribute selectors `[attr]` | Use class selectors instead |
| `*` universal selector | Style specific types or use a shared class |
| `!important` | Increase specificity instead |

**Other gotchas:**
- Default `flex-direction` is `column` (CSS defaults to `row`)
- Hex colors (`#RRGGBB`) work in Unity 2022+ but `rgb()`/`rgba()` is safer for all versions
- No `box-sizing` property — padding is always inside the element (like `border-box`)
