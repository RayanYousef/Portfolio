---
name: uitoolkit-design-system
description: >
  THE FOUNDATION for all Unity UIToolkit UI work. Use this skill whenever creating USS stylesheets,
  defining color themes, typography scales, spacing systems, or shared design tokens for Unity UI.
  Trigger when: user mentions "theme", "design system", "USS variables", "color palette", "typography",
  "spacing system", "shared styles", "style tokens", or when any other uitoolkit skill needs consistent
  styling guidance. This skill should be consulted FIRST before writing any USS code.
---

# UIToolkit Design System & Styling Foundation

This skill defines how to create consistent, maintainable USS (Unity Style Sheets) for runtime game UI.
All other uitoolkit skills reference this for styling conventions.

## Core Principle: Single Source of Truth

Every UI project should have ONE shared theme USS file that defines all design tokens. Individual component
USS files then consume these tokens via `var()`. This prevents style drift and makes theming trivial.

## USS Variable System

### Defining Design Tokens (Shared Theme File)

Create a file like `GameTheme.uss`:

```css
/* GameTheme.uss - The single source of truth for all UI styling */
:root {
    /* === Color Palette === */
    --color-primary: rgb(68, 138, 255);
    --color-primary-hover: rgb(100, 160, 255);
    --color-primary-active: rgb(40, 110, 220);
    --color-secondary: rgb(170, 89, 57);

    --color-bg-dark: rgb(30, 30, 30);
    --color-bg-medium: rgb(60, 60, 60);
    --color-bg-light: rgb(80, 80, 80);
    --color-bg-surface: rgb(110, 57, 37);

    --color-text-primary: rgb(255, 255, 255);
    --color-text-secondary: rgb(181, 210, 248);
    --color-text-muted: rgb(160, 160, 160);

    --color-border: rgb(49, 26, 17);
    --color-success: rgb(0, 156, 10);
    --color-danger: rgb(200, 50, 50);

    /* === Typography Scale === */
    --font-size-xs: 10px;
    --font-size-sm: 12px;
    --font-size-base: 14px;
    --font-size-md: 16px;
    --font-size-lg: 18px;
    --font-size-xl: 20px;
    --font-size-2xl: 24px;
    --font-size-3xl: 32px;
    --font-size-display: 48px;

    /* === Spacing Scale === */
    --spacing-xs: 2px;
    --spacing-sm: 4px;
    --spacing-md: 8px;
    --spacing-lg: 12px;
    --spacing-xl: 16px;
    --spacing-2xl: 24px;
    --spacing-3xl: 32px;

    /* === Border === */
    --border-width-sm: 1px;
    --border-width-md: 2px;
    --border-width-lg: 4px;
    --border-radius-sm: 4px;
    --border-radius-md: 8px;
    --border-radius-lg: 15px;
    --border-radius-round: 25px;
}
```

### Consuming Variables in Component USS

```css
/* InventoryPanel.uss */
.inventory-panel {
    background-color: var(--color-bg-surface);
    border-color: var(--color-border);
    border-width: var(--border-width-lg);
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-md);
}

.inventory-panel__title {
    font-size: var(--font-size-lg);
    -unity-font-style: bold;
    color: var(--color-text-primary);
    margin-bottom: var(--spacing-md);
}
```

### Linking Stylesheets in UXML

Always import the shared theme FIRST, then component-specific USS:

```xml
<engine:UXML xmlns:engine="UnityEngine.UIElements">
    <Style src="GameTheme.uss" />
    <Style src="InventoryPanel.uss" />
    <engine:VisualElement class="inventory-panel">
        <engine:Label text="Inventory" class="inventory-panel__title" />
    </engine:VisualElement>
</engine:UXML>
```

## Custom USS Properties for Custom Controls

When building custom VisualElements that need themeable colors, use `CustomStyleProperty<T>`:

```csharp
// In your custom control C# class
static readonly CustomStyleProperty<Color> s_TrackColor =
    new CustomStyleProperty<Color>("--track-color");
static readonly CustomStyleProperty<Color> s_ProgressColor =
    new CustomStyleProperty<Color>("--progress-color");

public MyControl()
{
    RegisterCallback<CustomStyleResolvedEvent>(evt =>
    {
        if (evt.customStyle.TryGetValue(s_TrackColor, out var trackColor))
            m_TrackColor = trackColor;
        if (evt.customStyle.TryGetValue(s_ProgressColor, out var progressColor))
            m_ProgressColor = progressColor;
        MarkDirtyRepaint();
    });
}
```

Then style them in USS just like built-in properties:
```css
.radial-progress {
    --track-color: rgb(130, 130, 130);
    --progress-color: rgb(46, 132, 24);
}
```

## Unity Built-in Theme Variables

Unity exposes built-in theme variables with the `--unity-colors-*` prefix. Use these for controls
that should respect the Unity theme (useful for editor-adjacent UI or controls that match platform look):

```css
.slide-toggle__input {
    background-color: var(--unity-colors-slider_groove-background);
    border-color: var(--unity-colors-slider_thumb-border);
}

.slide-toggle:focus .slide-toggle__input-knob {
    border-color: var(--unity-colors-input_field-border-focus);
}
```

For game UI, prefer your own custom variables over `--unity-colors-*`.

## Theme Style Sheets (TSS)

TSS files are the top-level theming mechanism in Unity 6. They're assigned to `PanelSettings`
and apply globally to all `UIDocument` components using that panel.

- The default runtime TSS is `UnityDefaultRuntimeTheme.tss`
- It contains `@import url("unity-theme://default")` to bootstrap Unity's built-in styles
- Create custom TSS files to override the default theme globally

## Selector Best Practices

| Selector Type | Syntax | Use For |
|---------------|--------|---------|
| Type selector | `Label { }` | Global defaults for built-in controls |
| Class selector | `.my-class { }` | Component styling (PREFERRED for most cases) |
| Name selector | `#my-name { }` | Unique page-level elements |
| Descendant | `.parent .child { }` | Contextual styling |
| Child combinator | `.parent > .child { }` | Direct child styling |
| Pseudo-class | `:hover`, `:active`, `:focus` | Interactive states |

### Naming Convention: BEM-like with kebab-case

```css
/* Block */
.slide-toggle { }

/* Element (block__element) */
.slide-toggle__input { }
.slide-toggle__input-knob { }

/* Modifier (block__element--modifier) */
.slide-toggle__input--checked { }
```

## Color Format

Unity USS supports:
- `rgb(r, g, b)` - values 0-255
- `rgba(r, g, b, a)` - alpha is 0-255 (NOT 0.0-1.0 like CSS)
- Hex: `#1e1e1e`
- Named colors: `white`, `black`, `red`, etc.

**Important**: `rgba()` alpha channel uses 0-255 range, not 0.0-1.0. This is different from web CSS.

## Unity-Specific Typography Properties

```css
.text-heading {
    font-size: 24px;
    -unity-font-style: bold;           /* normal, bold, italic, bold-and-italic */
    -unity-text-align: middle-center;  /* upper/middle/lower + left/center/right */
    letter-spacing: 2px;
    -unity-text-outline-width: 1px;
    -unity-text-outline-color: rgb(0, 0, 0);
    white-space: normal;               /* Enable text wrapping */
    color: var(--color-text-primary);
}
```

## Reference Examples

For complete USS examples from real Unity UIToolkit projects, see `references/uss-examples.md` in this skill directory.
It contains annotated USS files demonstrating BEM naming, custom variables, layout styling, transitions, and more.
