---
name: uitoolkit-layout
description: Core skill for positioning and sizing elements in Unity 6 UI Toolkit. Make sure to use this skill when asked to align elements, create grids, adjust margins/padding, use Flexbox, handle ScrollViews, or absolute position elements relative to the screen. Works closely with 'uitoolkit-fundamentals' and 'uitoolkit-design-system'.
---

# Unity 6 UI Toolkit Layout & Positioning

This skill explains how to position, size, and flow elements using UI Toolkit's Yoga-based Flexbox implementation. It covers relative/absolute positioning, alignment, and wrapping content.

## Trigger Conditions
- Use when asked to center an element, align items, create a row/column, or build a grid.
- Use when asked to make a scrollable area (`ScrollView`).
- Use when positioning popups or overlays (`position: absolute`).

## Relative vs Absolute Positioning
Every `VisualElement` is positioned `relative` by default, flowing sequentially according to Flexbox rules.
- **Relative Layout Flow**: Elements push each other. `flex-direction: column` is the default.
- **Absolute Layout**: Elements are taken out of the layout flow and positioned explicitly using `top`, `bottom`, `left`, `right` relative to their first non-statically positioned parent (usually the `UIDocument` root if no other container is `relative`).

## Flexbox Mechanics

### 1. Flex Direction (`flex-direction`)
- `column`: Stack vertically (default).
- `row`: Arrange horizontally.

### 2. Alignment (`align-items`, `justify-content`)
- `align-items` (Cross Axis): `flex-start`, `center`, `flex-end`, `stretch` (default).
- `justify-content` (Main Axis): `flex-start`, `center`, `flex-end`, `space-between`, `space-around`.

### 3. Sizing (`flex-grow`, `flex-shrink`, `flex-basis`)
- `flex-grow: 1`: The element will expand to fill available space in its container.

## Wrapping Content (ScrollView & Grids)
A common pattern is a grid-like inventory or list of tags that wraps to the next line.
- Use `flex-wrap: wrap`.
- When using a `ScrollView`, you must apply `flex-wrap` to its internal content container, not the ScrollView itself.

### Example: Wrapping ScrollView (USS)
```css
/* Apply to the ScrollView itself if needed, but the key is targeting the content-container */
.wrap-scrollview {
    /* Define a fixed height or use flex-grow to fill a parent */
    height: 300px;
    background-color: var(--color-surface);
}

/* IMPORTANT: Target the built-in content container to enable wrapping */
.wrap-scrollview .unity-scroll-view__content-container {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    padding: var(--spacing-sm);
}

.item-box {
    width: 64px;
    height: 64px;
    background-color: var(--color-primary);
    margin: var(--spacing-xs);
}
```

### Example: Wrapping ScrollView (UXML)
```xml
<ui:UXML xmlns:ui="UnityEngine.UIElements" xmlns:uie="UnityEditor.UIElements">
    <ui:ScrollView class="wrap-scrollview">
        <ui:VisualElement class="item-box" />
        <ui:VisualElement class="item-box" />
        <ui:VisualElement class="item-box" />
        <!-- More items will wrap to the next row automatically -->
    </ui:ScrollView>
</ui:UXML>
```

## Absolute Positioning Patterns (Overlays/Popups)
To create a full-screen overlay (e.g., a modal or pause menu), position a container absolutely at the root level.
```css
.full-screen-overlay {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    /* Semi-transparent background */
    background-color: rgba(0, 0, 0, 0.5);
    /* Center the modal box inside the overlay */
    align-items: center;
    justify-content: center;
    /* Ensure it renders on top */
    z-index: 100; /* New in later Unity UI Toolkit versions, alternatively put at bottom of UXML */
}

.modal-box {
    width: 400px;
    background-color: var(--color-background);
    padding: var(--spacing-lg);
    border-radius: var(--radius-md);
    /* The modal itself is in relative flow, centered by the parent overlay */
}
```

## Best Practices & Gotchas
- **Default Flex Direction**: UI Toolkit defaults to `column`. In standard CSS, `flex-direction` defaults to `row`.
- **ScrollView Height**: A `ScrollView` needs a constrained height to scroll. Either set a fixed `height`/`max-height` or use `flex-grow: 1` if its parent has a defined height.
- **ScrollView Content Target**: Remember to target `.unity-scroll-view__content-container` in USS to change the layout behavior of items inside a ScrollView, otherwise you are styling the ScrollView wrapper itself.
- **Absolute Positioning Context**: `left: 0; top: 0;` on an absolute element positions it relative to the bounds of its parent `VisualElement`, not the screen, unless the parent is the root or spans the screen.

## File References
- Explore `Assets/UIToolkit-Manual-Examples/relative-and-absolute-position/`
- Explore `Assets/UIToolkit-Manual-Examples/wrap-content-inside-scrollview/`
