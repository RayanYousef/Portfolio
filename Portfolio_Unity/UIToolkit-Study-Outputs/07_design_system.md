# Design System & Style Foundation Patterns (Unity 6)

## Shared Theme Foundation
- Unity 6 UI Toolkit treats Theme Style Sheets (TSS) as a mechanism to manage broad themes.
- A TSS file is just a USS file, usually containing `@import` rules to combine multiple USS files (e.g., `typography.uss`, `colors.uss`, `layout.uss`).
- For runtime UI, assign the TSS file to the `Panel Settings` asset in your project. This makes all defined variables globally available to any UI attached to that Panel Settings.

## USS Variable Fundamentals
- Variables are defined with a double-dash prefix (`--variable-name`) inside a style block (usually `:root` for global scope).
- Example global color palette in `theme.tss` or an imported `colors.uss`:
```css
:root {
    --color-primary: #2b5d8c;
    --color-secondary: #f4a261;
    --color-background: #1e1e1e;
    --color-text: #ffffff;
    --color-text-muted: rgba(255, 255, 255, 0.6);
}
```
- Access variables using the `var()` function. You can provide a fallback value: `var(--my-color, red)`.
```css
.my-button {
    background-color: var(--color-primary);
}
```

## Typography Best Practices
- Define a clear typography scale globally to maintain consistency.
- Use Unity's specific font properties (`-unity-font-definition`, `-unity-font-style`).
- Typography variables should live in `:root` and be applied to standard semantic classes.
```css
:root {
    --font-size-h1: 32px;
    --font-size-h2: 24px;
    --font-size-body: 16px;
    --font-size-caption: 12px;
}

.heading-1 {
    font-size: var(--font-size-h1);
    -unity-font-style: bold;
    color: var(--color-text);
}

.body-text {
    font-size: var(--font-size-body);
    color: var(--color-text);
}
```

## Spacing, Margin, and Padding Conventions
- Standardize layout using a spacing scale (e.g., multiples of 4px or 8px).
```css
:root {
    --spacing-xs: 4px;
    --spacing-sm: 8px;
    --spacing-md: 16px;
    --spacing-lg: 24px;
    --spacing-xl: 32px;
}

.card {
    padding: var(--spacing-md);
    margin-bottom: var(--spacing-sm);
    border-radius: var(--spacing-xs);
}
```

## Naming Conventions
- Variables: Prefix with intent/category, e.g., `--color-*`, `--font-size-*`, `--spacing-*`.
- Classes: Use kebab-case for CSS classes (`.my-custom-element`). Avoid camelCase or PascalCase to align with web CSS standards.
- Semantic Naming: Name variables after their *purpose* (`--color-success`, `--color-danger`) rather than their literal value (`--color-green`).

## Cascading and Overrides
- Because CSS cascades, you can override variables at a lower level in the hierarchy to theme specific sections.
```css
.dark-theme-panel {
    --color-background: #000000;
    --color-text: #aaaaaa;
}
/* Any element inside .dark-theme-panel using var(--color-background) will now get black. */
```

## Gotchas and Best Practices
- The Panel Settings asset is the central hub for your runtime design system. Map your master `.tss` or `.uss` file there instead of dropping `StyleSheet` references directly into every single `UIDocument`.
- Keep the number of imported stylesheets reasonable to prevent long load times.
- Remember `-unity-*` prefixed properties are specific to Unity's UI Toolkit and behave slightly differently than standard CSS.
