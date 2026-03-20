---
name: uitoolkit-design-system
description: Foundation skill for Unity 6 UI Toolkit styling. Make sure to use this skill BEFORE writing any USS or UXML. It defines how to use Theme Style Sheets (TSS), USS variables (--color-*, --font-size-*), typography, spacing conventions, and shared stylesheets. Use this when the user asks for "themes", "consistent styling", "design system", "colors", "fonts", or any UI creation to ensure consistent styling.
---

# Unity 6 UI Toolkit Design System & Style Foundation

This is the foundational skill for all UI Toolkit styling. **You must adhere to these patterns** to ensure a consistent, scalable, and maintainable design system across the game's UI.

## Trigger Conditions
- Actively apply these patterns whenever generating USS files.
- Use when asked to setup a theme, manage colors, or define typography.
- Reference this structure when other skills (like layout or components) need styling.

## Shared Theme Foundation (TSS)
Unity 6 UI Toolkit uses Theme Style Sheets (TSS) or master USS files to manage global variables.
- A TSS/master USS file contains `:root` definitions and `@import` rules for modular stylesheets (e.g., `colors.uss`, `typography.uss`).
- This file is assigned to the **Panel Settings** asset in the project, making variables globally available to all UI attached to it.

## USS Variable Naming Conventions
Always use semantic, kebab-case naming for variables (defined with `--`). Do not hardcode colors or sizes in individual component stylesheets.

- **Colors**: Prefix with `--color-`. Name by purpose, not literal color.
  - Good: `--color-primary`, `--color-background`, `--color-text-muted`
  - Bad: `--color-blue`, `--dark-grey`
- **Typography**: Prefix with `--font-size-` or `--font-`.
  - Good: `--font-size-h1`, `--font-size-body`, `--font-regular`
- **Spacing/Layout**: Prefix with `--spacing-` or `--radius-`.
  - Good: `--spacing-sm`, `--spacing-md`, `--radius-lg`

## Inline Examples

### 1. The Master Theme File (`theme.tss` or `global.uss`)
```css
/* Define global variables at the root level */
:root {
    /* Color Palette */
    --color-primary: #2b5d8c;
    --color-secondary: #f4a261;
    --color-background: #1e1e1e;
    --color-surface: #2d2d30;
    --color-text: #ffffff;
    --color-text-muted: rgba(255, 255, 255, 0.6);
    --color-error: #cf6679;

    /* Typography Scale */
    --font-size-h1: 32px;
    --font-size-h2: 24px;
    --font-size-body: 16px;
    --font-size-caption: 12px;

    /* Spacing System (multiples of 4px or 8px) */
    --spacing-xs: 4px;
    --spacing-sm: 8px;
    --spacing-md: 16px;
    --spacing-lg: 24px;
    --spacing-xl: 32px;

    /* Border Radii */
    --radius-sm: 4px;
    --radius-md: 8px;
    --radius-round: 50%;
}
```

### 2. Applying Variables in Component USS (`button.uss`)
Always use the `var()` function. Provide a fallback if necessary.
```css
.custom-button {
    background-color: var(--color-primary);
    color: var(--color-text);
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--radius-sm);
    font-size: var(--font-size-body);
    -unity-font-style: bold;
    transition: background-color 0.2s ease;
}

.custom-button:hover {
    background-color: var(--color-secondary);
}
```

### 3. Typography Utility Classes (`typography.uss`)
Use specific `-unity-*` properties for Unity-specific font rendering.
```css
.heading-1 {
    font-size: var(--font-size-h1);
    -unity-font-style: bold;
    color: var(--color-text);
    margin-bottom: var(--spacing-md);
}

.body-text {
    font-size: var(--font-size-body);
    color: var(--color-text);
    white-space: normal; /* Enable text wrapping */
}
```

## The Cascade & Overrides
CSS cascades. You can override variables on specific containers to create localized themes (e.g., a dark mode panel within a light mode app).
```css
.danger-zone {
    /* Override primary color specifically for this section */
    --color-primary: var(--color-error);
}
/* Any child of .danger-zone using var(--color-primary) will now be red. */
```

## Best Practices & Gotchas
- **Do not hardcode styles** in UXML attributes (e.g., `<ui:Label style="color: red;" />`). Always use classes.
- **Kebab-case classes**: Use `.my-custom-element`, NEVER `.MyCustomElement` or `.myCustomElement`.
- **Panel Settings**: Remember that the best place to link the master stylesheet is the project's Panel Settings, not the individual `UIDocument` in the scene, to ensure single-source-of-truth styling.
- **Unity-Specific Properties**: Remember properties like `-unity-font-definition`, `-unity-font-style`, and `-unity-text-align`.

## File References
For deeper exploration, look for USS files across the manual examples in `Assets/UIToolkit-Manual-Examples/`.
