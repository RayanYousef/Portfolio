---
name: uitoolkit-layout
description: >
  Unity UIToolkit layout system for runtime game UI. Use this skill for flexbox layout, positioning
  (absolute/relative), ScrollView, responsive design, and arranging UI elements. Trigger when: user
  mentions "layout", "flexbox", "flex-direction", "positioning", "ScrollView", "scroll", "wrap",
  "align", "justify", "responsive", "grid-like layout", or needs to arrange UI elements spatially.
  Consult uitoolkit-design-system for spacing variables.
---

# UIToolkit Layout System

UIToolkit uses a Yoga-based flexbox layout engine (similar to CSS Flexbox). There is no CSS Grid —
all layouts are achieved through nested flex containers.

## Flexbox Fundamentals

### Default Behavior
- Every `VisualElement` is a flex container by default
- Default `flex-direction` is `column` (top to bottom)
- Children don't grow by default — use `flex-grow: 1` to fill space

### Core Properties

```css
.container {
    /* Direction */
    flex-direction: column;      /* column (default), row, column-reverse, row-reverse */

    /* Main axis alignment (along flex-direction) */
    justify-content: flex-start; /* flex-start, flex-end, center, space-between, space-around */

    /* Cross axis alignment (perpendicular to flex-direction) */
    align-items: stretch;        /* stretch (default), flex-start, flex-end, center */

    /* Child sizing */
    flex-grow: 1;                /* How much this element grows to fill space (0 = don't grow) */
    flex-shrink: 0;              /* How much this element shrinks (0 = don't shrink) */
    flex-basis: auto;            /* Initial size before grow/shrink */

    /* Wrapping */
    flex-wrap: wrap;             /* nowrap (default), wrap, wrap-reverse */

    /* Self alignment (override parent's align-items for this child) */
    align-self: center;          /* auto, flex-start, flex-end, center, stretch */
}
```

## Common Layout Patterns

### Full-Screen Container
```css
.fullscreen {
    flex-grow: 1;         /* Fill all available space */
    position: absolute;   /* Optional: overlay on top of everything */
    left: 0; right: 0;
    top: 0; bottom: 0;
}
```

### Horizontal Row with Equal Children
```css
.row { flex-direction: row; }
.row > * { flex-grow: 1; }   /* Each child takes equal space */
```

### Centered Content
```css
.centered {
    flex-grow: 1;
    align-items: center;
    justify-content: center;
}
```

### Sidebar + Content Layout
```xml
<engine:VisualElement style="flex-direction: row; flex-grow: 1;">
    <engine:VisualElement name="sidebar" style="width: 230px;" />
    <engine:VisualElement name="content" style="flex-grow: 1;" />
</engine:VisualElement>
```

### Header / Content / Footer
```xml
<engine:VisualElement style="flex-grow: 1;">
    <engine:VisualElement name="header" style="height: 50px;" />
    <engine:VisualElement name="content" style="flex-grow: 1;" />
    <engine:VisualElement name="footer" style="height: 40px;" />
</engine:VisualElement>
```

### Grid-Like Layout with Wrap
```css
/* Simulates a grid using flex-wrap */
.grid-container {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
}

.grid-item {
    width: 80px;
    height: 80px;
    margin: 5px;
}
```

## Positioning

### Relative (Default)
Elements flow in the document order. `left`/`top` offset from normal position:

```css
#relative-element {
    position: relative;    /* Default — in normal flow */
    left: 25px;            /* Offset from normal position */
}
```

### Absolute
Element is removed from flow and positioned relative to its nearest positioned ancestor:

```css
#overlay {
    position: absolute;
    left: 25px;
    top: 25px;
    width: 70px;
    height: 70px;
}
```

Common use: overlays, tooltips, floating UI, HUD elements positioned over game view.

## ScrollView

### Basic ScrollView in UXML
```xml
<engine:ScrollView>
    <!-- Content goes here, scrolls vertically by default -->
    <engine:Label text="Item 1" />
    <engine:Label text="Item 2" />
    <!-- ... many items ... -->
</engine:ScrollView>
```

### Wrapping Content Inside ScrollView

To make items wrap horizontally inside a ScrollView (like a grid):

```css
/* Target the internal content container */
#my-scroll .unity-scroll-view__content-container {
    flex-direction: row;
    flex-wrap: wrap;
}
```

```xml
<engine:ScrollView name="my-scroll">
    <!-- Items will wrap into rows -->
    <engine:Button text="1" style="width: 50px; height: 50px;" />
    <engine:Button text="2" style="width: 50px; height: 50px;" />
    <!-- ... -->
</engine:ScrollView>
```

### ScrollView Properties
```xml
<engine:ScrollView
    mode="Vertical"                    <!-- Vertical, Horizontal, VerticalAndHorizontal -->
    horizontal-scroller-visibility="Hidden"
    vertical-scroller-visibility="Auto"  <!-- Auto, AlwaysVisible, Hidden -->
    touch-scroll-type="Elastic"
    scroll-deceleration-rate="0.135"
    elasticity="0.1"
/>
```

### Adding Items to ScrollView in C#
```csharp
var scrollView = root.Q<ScrollView>("my-scroll");
for (int i = 0; i < 15; i++)
{
    var button = new Button { text = $"Button {i}" };
    scrollView.Add(button);
}
```

## Size and Spacing

### Width/Height
```css
.panel {
    width: 200px;        /* Fixed width */
    height: 100px;       /* Fixed height */
    min-width: 100px;    /* Minimum size */
    max-width: 400px;    /* Maximum size */
    min-height: 50px;
    max-height: 300px;
}
```

### Margin and Padding
```css
.element {
    /* Shorthand */
    margin: 10px;                     /* All sides */
    padding: 8px;

    /* Individual sides */
    margin-left: 5px;
    margin-right: 5px;
    margin-top: 10px;
    margin-bottom: 10px;

    /* Note: USS does NOT support multi-value shorthand like CSS */
    /* margin: 10px 20px;  <-- NOT SUPPORTED */
}
```

**Important**: USS shorthand only accepts a single value. For different values per side, use individual properties.

## Performance Hint for Moving Elements

When elements move frequently at runtime (e.g., following game objects), set:

```csharp
element.usageHints = UsageHints.DynamicTransform;
```

This tells UIToolkit to optimize for frequent transform changes. Use `style.translate` instead of
`style.left`/`style.top` for moving elements:

```csharp
// Preferred for runtime movement
element.style.translate = new Translate(x, y);
element.style.scale = new Scale(new Vector2(scaleX, scaleY));
```

## Reference Examples

For complete working examples, see `references/examples.md` in this skill directory.
It contains positioning demos, ScrollView wrapping, master-detail layouts, and runtime element movement code.
