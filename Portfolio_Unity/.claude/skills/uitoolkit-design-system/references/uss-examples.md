# USS Examples Reference

Real-world USS examples from Unity UIToolkit manual examples, organized by design pattern category.

## Table of Contents

1. [BEM Naming & Built-in Unity Variables](#1-bem-naming--built-in-unity-variables)
2. [Custom USS Variables](#2-custom-uss-variables)
3. [Complex Layout Styling](#3-complex-layout-styling)
4. [Tab & Selection Styling](#4-tab--selection-styling)
5. [Transitions](#5-transitions)
6. [Custom Style Properties for Custom Controls](#6-custom-style-properties-for-custom-controls)
7. [Item & List Entry Styling](#7-item--list-entry-styling)
8. [Drag and Drop Patterns](#8-drag-and-drop-patterns)
9. [Absolute Positioning & Text Effects](#9-absolute-positioning--text-effects)
10. [Class Toggle Animations](#10-class-toggle-animations)

---

## 1. BEM Naming & Built-in Unity Variables

**Source:** `SlideToggle.uss`

Demonstrates the BEM (Block-Element-Modifier) naming convention, use of Unity's built-in `--unity-colors-*` theme variables, and CSS transitions for animated state changes. This is the gold standard for naming custom controls in USS.

```css
.slide-toggle__input {
    background-color: var(--unity-colors-slider_groove-background);
    max-width: 25px;
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
    overflow: visible;
    border-left-width: 1px;
    border-right-width: 1px;
    border-top-width: 1px;
    border-bottom-width: 1px;
    border-right-color: var(--unity-colors-slider_thumb-border);
    border-top-color: var(--unity-colors-slider_thumb-border);
    border-bottom-color: var(--unity-colors-slider_thumb-border);
    max-height: 16px;
    margin-top: 10px;
    border-left-color: var(--unity-colors-slider_thumb-border);
    transition-property: background-color;
    transition-duration: 0.5s;
}

.slide-toggle__input-knob {
    height: 16px;
    width: 16px;
    background-color: var(--unity-colors-slider_thumb-background);
    position: absolute;
    border-top-left-radius: 25px;
    border-bottom-left-radius: 25px;
    border-top-right-radius: 25px;
    border-bottom-right-radius: 25px;
    top: -1px;
    transition-property: translate, background-color;
    transition-duration: 0.5s, 0.5s;
    translate: -1px 0;
    border-left-width: 1px;
    border-right-width: 1px;
    border-top-width: 1px;
    border-bottom-width: 1px;
    border-left-color: var(--unity-colors-slider_thumb-border);
    border-right-color: var(--unity-colors-slider_thumb-border);
    border-top-color: var(--unity-colors-slider_thumb-border);
    border-bottom-color: var(--unity-colors-slider_thumb-border);
}

.slide-toggle__input--checked {
    background-color: rgb(0, 156, 10);
}

.slide-toggle__input--checked > .slide-toggle__input-knob {
    translate: 8px 0;
}

.slide-toggle:focus .slide-toggle__input-knob {
    border-left-width: 1px;
    border-right-width: 1px;
    border-top-width: 1px;
    border-bottom-width: 1px;
    border-left-color: var(--unity-colors-input_field-border-focus);
    border-right-color: var(--unity-colors-input_field-border-focus);
    border-top-color: var(--unity-colors-input_field-border-focus);
    border-bottom-color: var(--unity-colors-input_field-border-focus);
}
```

**Key patterns:**
- Block: `.slide-toggle`, Element: `__input`, `__input-knob`, Modifier: `--checked`
- Built-in vars: `--unity-colors-slider_groove-background`, `--unity-colors-slider_thumb-border`
- Focus pseudo-class combined with BEM: `.slide-toggle:focus .slide-toggle__input-knob`
- Multi-property transitions: `transition-property: translate, background-color`
- Note: USS requires setting each border side individually (no shorthand for mixed values)

---

## 2. Custom USS Variables

**Source:** `RadialProgress.uss`

Demonstrates defining custom USS variables (design tokens) directly on a component using `--` prefix, then consuming them with `var()`. This pattern is essential for themeable custom controls.

```css
.radial-progress {
    min-width: 26px;
    min-height: 20px;
    --track-color: rgb(130, 130, 130);
    --progress-color: rgb(46, 132, 24);
    --percentage-color: white;
    margin-left: 5px;
    margin-right: 5px;
    margin-top: 5px;
    margin-bottom: 5px;
    flex-direction: row;
    justify-content: center;
    width: 100px;
    height: 100px;
}

.radial-progress__label {
    -unity-text-align: middle-left;
    color: var(--percentage-color);
}
```

**Key patterns:**
- Custom variables defined on the component root: `--track-color`, `--progress-color`, `--percentage-color`
- Child elements consume parent-defined variables via `var(--percentage-color)`
- These custom vars are read in C# via `CustomStyleProperty<Color>` and `CustomStyleResolvedEvent`

---

## 3. Complex Layout Styling

**Source:** `MainView.uss`

Demonstrates a full page layout using name selectors (`#id`) for unique page elements, flexbox layout patterns, and Unity-specific image scaling. This is a good example of structuring a multi-panel game UI.

```css
#background {
    flex-grow: 1;
    align-items: center;
    justify-content: center;
    background-color: rgb(115, 37, 38);
}

#main-container {
    flex-direction: row;
    height: 350px;
}

#character-list {
    width: 230px;
    border-color: rgb(49, 26, 17);
    border-width: 4px;
    background-color: rgb(110, 57, 37);
    border-radius: 15px;
    margin-right: 6px;
}

#character-name {
    -unity-font-style: bold;
    font-size: 18px;
}

#character-class {
    margin-top: 2px;
    margin-bottom: 8px;
    padding-top: 0;
    padding-bottom: 0;
}

#right-container {
    justify-content: space-between;
    align-items: flex-end;
}

#details-container {
    align-items: center;
    background-color: rgb(170, 89, 57);
    border-width: 4px;
    border-color: rgb(49, 26, 17);
    border-radius: 15px;
    width: 252px;
    justify-content: center;
    padding: 8px;
    height: 163px;
}

#details {
    border-color: rgb(49, 26, 17);
    border-width: 2px;
    height: 120px;
    width: 120px;
    border-radius: 13px;
    padding: 4px;
    background-color: rgb(255, 133, 84);
}

#character-portrait {
    flex-grow: 1;
    -unity-background-scale-mode: scale-to-fit;
}

.unity-collection-view__item {
    justify-content: center;
}
```

**Key patterns:**
- Name selectors (`#id`) for unique layout elements
- Flexbox: `flex-direction: row`, `flex-grow: 1`, `justify-content: space-between`
- Unity-specific: `-unity-background-scale-mode: scale-to-fit` for images
- Overriding built-in Unity class: `.unity-collection-view__item`
- Nested containers for complex row/column layouts

---

## 4. Tab & Selection Styling

**Source:** `TabbedMenu-style.uss`

Demonstrates styling a tabbed interface using class toggles to show/hide content panels and highlight the active tab.

```css
#tabs {
    flex-direction: row;
    background-color: rgb(229, 223, 223);
    -unity-font-style: bold;
    font-size: 14px;
}

.tab {
    flex-grow: 1;
}

.currentlySelectedTab {
    background-color: rgb(173, 166, 166);
}

#tabContent {
    background-color: rgb(255, 255, 255);
    font-size: 20px;
}

.unselectedContent {
    display: none;
}
```

**Key patterns:**
- `display: none` to hide inactive tab content panels
- State class `.currentlySelectedTab` toggled via C# to highlight active tab
- `flex-grow: 1` to distribute tabs equally across the tab bar
- Mix of name selectors for layout and class selectors for state

---

## 5. Transitions

**Source:** `TransitionExample.uss`

Demonstrates the shorthand transition syntax in USS. This is the cleanest way to define transitions when all properties share the same timing.

```css
.color-changer {
    margin: 10px;
    width: 150px;
    height: 150px;
    border-width: 10px;
    border-radius: 75px;
    background-color: rgb(0, 31, 138);
    transition: background-color 3s ease-in-out 1s;
}

.color-transition {
    background-color: rgb(177, 221, 111);
}
```

**Key patterns:**
- Shorthand: `transition: <property> <duration> <easing> <delay>`
- Transition triggered by adding/removing `.color-transition` class in C#
- Supported easing functions: `ease`, `ease-in`, `ease-out`, `ease-in-out`, `linear`

---

## 6. Custom Style Properties for Custom Controls

**Source:** `ExampleElementCustomStyle.uss`

Demonstrates using a type selector to set custom USS properties on a custom VisualElement type. These are read in C# via `CustomStyleProperty<T>`.

```css
ExampleElementCustomStyle {
    --gradient-from: red;
    --gradient-to: yellow;
}
```

**Key patterns:**
- Type selector matches the C# class name directly (no `.` or `#` prefix)
- Custom properties `--gradient-from` and `--gradient-to` are consumed by `CustomStyleResolvedEvent`
- Named colors (`red`, `yellow`) are valid USS color values

---

## 7. Item & List Entry Styling

**Source:** `ListEntry.uss`

Demonstrates styling individual list items for use in a `ListView`. Each entry is a self-contained visual unit.

```css
#list-entry {
    height: 41px;
    align-items: flex-start;
    justify-content: center;
    padding-left: 10px;
    background-color: rgb(170, 89, 57);
    border-color: rgb(49, 26, 17);
    border-width: 2px;
    border-radius: 15px;
}

#character-name {
    -unity-font-style: bold;
    font-size: 18px;
    color: rgb(49, 26, 17);
}
```

**Key patterns:**
- Fixed height items for consistent `ListView` row sizing
- `align-items: flex-start` with `justify-content: center` for vertically centered, left-aligned text
- Rounded borders for card-style list items

---

## 8. Drag and Drop Patterns

### Slot-based Drag and Drop

**Source:** `DragAndDropWindow.uss`

Demonstrates styling for a grid of drop slots with absolutely positioned draggable objects.

```css
.slot {
    width: 80px;
    height: 80px;
    margin: 5px;
    background-color: rgb(255, 255, 255);
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
}

.slot_row {
    flex-direction: row;
}

.object {
    width: 50px;
    height: 50px;
    position: absolute;
    left: 20px;
    top: 20px;
    border-radius: 30px;
    background-color: rgb(0, 0, 0);
}
```

### Drop Area with State Modifier

**Source:** `DragAndDrop.uss`

Demonstrates a BEM-style modifier class for visual feedback during drag-over state.

```css
.drop-area {
    flex-grow: 1;
    align-items: center;
    justify-content: center;
    margin: 10px;
    padding: 5px;
    background-color: rgba(112, 128, 144, 255);
    border-color: rgba(211, 211, 211, 255);
    border-width: 2px;
    border-radius: 20px;
}

.drop-area--dropping {
    opacity: 0.4;
    background-color: rgba(0, 100, 0, 255);
}
```

**Key patterns:**
- `position: absolute` for draggable objects positioned within slots
- BEM modifier `.drop-area--dropping` toggled during drag-over events
- `opacity` change for visual drop feedback
- Note: `rgba()` alpha uses 0-255 range in USS, not 0.0-1.0

---

## 9. Absolute Positioning & Text Effects

**Source:** `NameTag.uss`

Demonstrates absolute positioning with translate-based centering and Unity-specific text outline properties. Useful for floating labels, name tags, or HUD overlays.

```css
#NameTag {
    position: absolute;
    translate: -50% -50%;
    -unity-font-style: bold;
    color: rgb(181, 210, 248);
    -unity-text-outline-width: 1px;
    -unity-text-outline-color: rgb(11, 60, 123);
}
```

**Key patterns:**
- `translate: -50% -50%` centers the element on its anchor point (similar to CSS transform trick)
- `-unity-text-outline-width` and `-unity-text-outline-color` for text outlines (Unity-specific)
- `position: absolute` for overlay/floating elements

---

## 10. Class Toggle Animations

**Source:** `LoopingExample.uss`

Demonstrates transitions triggered by toggling classes at runtime. Shows how to animate scale and use transition-duration on both the base state and toggled state for yoyo effects.

```css
#yoyo-label {
    transition-duration: 3s;
}
.text-style {
    font-size: 20px;
    flex-grow: 0;
    margin: 20px;
}
.enlarge-scale-a2b {
    scale: 1.5 1.5;
    transition-duration: 3s;
}
.enlarge-scale-yoyo {
    scale: 1.5 1.5;
}
#container {
    flex-grow: 1;
    justify-content: space-around;
    align-items: center;
}
```

**Key patterns:**
- `transition-duration` on both base and modifier classes for bidirectional animation
- `scale: 1.5 1.5` for uniform scale transforms
- Class toggle approach: add class to animate forward, remove to animate back
- `justify-content: space-around` for evenly distributed children
