---
name: uitoolkit-styling-animation
description: >
  Unity UIToolkit transitions, animations, and visual effects for runtime game UI. Use this skill for
  USS transitions, hover effects, animated UI, looping animations, text effects, link tags, and custom
  shader filters. Trigger when: user mentions "transition", "animation", "animate", "hover effect",
  "fade in", "fade out", "scale animation", "pulse", "loop", "text animation", "rich text", "link tag",
  "visual effect", "filter", "easing", or needs to add motion/effects to UI elements.
  Consult uitoolkit-design-system for color/style variables.
---

# UIToolkit Styling & Animation

USS transitions, animation patterns, and visual effects for runtime game UI.

## USS Transitions

UIToolkit supports CSS-like transitions on animatable properties. Transitions interpolate between
values when a property changes (via class toggle, pseudo-class, or C# style change).

### Transition Syntax

```css
/* Shorthand */
.element {
    transition: background-color 3s ease-in-out 1s;
    /*          property       duration timing  delay */
}

/* Longhand */
.element {
    transition-property: background-color, scale, rotate;
    transition-duration: 0.5s, 0.3s, 0.3s;
    transition-timing-function: ease-in-out, ease, ease;
    transition-delay: 0s, 0s, 0s;
}

/* All properties */
.element {
    transition-duration: 3s;  /* Applies to all changed properties */
}
```

### Timing Functions
- `ease` — Default, slow start and end
- `ease-in` — Slow start
- `ease-out` — Slow end
- `ease-in-out` — Slow start and end
- `linear` — Constant speed

### Animatable Properties

| Property | Example |
|----------|---------|
| `background-color` | Color transitions |
| `color` | Text color |
| `opacity` | Fade in/out |
| `scale` | `scale: 1.5 1.5` |
| `rotate` | `rotate: 10deg` |
| `translate` | `translate: 50px 0` |
| `width`, `height` | Size changes |
| `border-color` | Border highlights |
| `margin-*`, `padding-*` | Spacing changes |

## Triggering Transitions

### Via Pseudo-Classes (USS Only)

```css
Label {
    transition-duration: 0.3s;
    scale: 1 1;
    rotate: 0;
}

Label:hover {
    scale: 1.1 1;
    rotate: 10deg;
}
```

**Note**: `:hover` works at runtime but only with mouse input. For touch/gamepad, use C# class toggling.

### Via Class Toggling (C# — Preferred for Runtime)

```css
.button-normal {
    background-color: rgb(60, 60, 60);
    scale: 1 1;
    transition: background-color 0.3s ease, scale 0.2s ease;
}

.button-highlighted {
    background-color: rgb(100, 160, 255);
    scale: 1.05 1.05;
}
```

```csharp
// Toggle the highlighted class
button.RegisterCallback<PointerOverEvent>(evt =>
    button.AddToClassList("button-highlighted"));
button.RegisterCallback<PointerOutEvent>(evt =>
    button.RemoveFromClassList("button-highlighted"));
```

### Via C# Inline Styles

```csharp
// Set transition duration in C#
label.style.transitionDuration = new List<TimeValue> { new TimeValue(3f) };

// Then change properties to trigger transition
label.style.rotate = new Rotate(Angle.Degrees(10));
label.style.scale = new Scale(new Vector2(1.1f, 1f));

// Reset
label.style.rotate = StyleKeyword.Null;  // Back to USS default
label.style.scale = StyleKeyword.Null;
```

## Transition Events

Listen for transition lifecycle events:

```csharp
element.RegisterCallback<TransitionRunEvent>(evt =>
    Debug.Log("Transition started running"));

element.RegisterCallback<TransitionStartEvent>(evt =>
    Debug.Log("Transition visibly started (after delay)"));

element.RegisterCallback<TransitionEndEvent>(evt =>
    Debug.Log("Transition completed"));

element.RegisterCallback<TransitionCancelEvent>(evt =>
    Debug.Log("Transition was cancelled (property changed mid-transition)"));
```

## Looping Animations

UIToolkit has no built-in animation loop. Use TransitionEndEvent to create loops:

### Yo-Yo Loop (A → B → A → B...)

```css
#pulse-element {
    transition-duration: 1s;
    scale: 1 1;
}

.enlarged {
    scale: 1.3 1.3;
}
```

```csharp
var element = root.Q("pulse-element");

// When transition ends, toggle class to reverse direction
element.RegisterCallback<TransitionEndEvent>(evt =>
    element.ToggleInClassList("enlarged"));

// Kick off the first transition
root.schedule.Execute(() =>
    element.ToggleInClassList("enlarged")).StartingIn(100);
```

### A-to-B Loop (always plays forward, resets instantly)

```css
.grow-animation {
    scale: 1.5 1.5;
    transition-duration: 1s;
}
```

```csharp
var element = root.Q("a2b-element");

element.RegisterCallback<TransitionEndEvent>(evt =>
{
    // Remove class (instant reset, no transition on removal)
    element.RemoveFromClassList("grow-animation");
    // Re-add after a tiny delay to trigger new transition
    element.schedule.Execute(() =>
        element.AddToClassList("grow-animation")).StartingIn(10);
});

// Start
element.schedule.Execute(() =>
    element.AddToClassList("grow-animation")).StartingIn(100);
```

### Scheduling

```csharp
// Execute once after delay
element.schedule.Execute(() => { /* action */ }).StartingIn(500);  // 500ms delay

// Execute repeatedly
element.schedule.Execute(() => { /* action */ }).Every(1000);  // Every 1 second
```

## Common Animation Recipes

### Fade In
```css
.fade-target {
    opacity: 0;
    transition: opacity 0.5s ease-in;
}
.fade-target.visible {
    opacity: 1;
}
```

### Slide In from Side
```css
.slide-panel {
    translate: -100% 0;
    transition: translate 0.3s ease-out;
}
.slide-panel.open {
    translate: 0 0;
}
```

### Button Press Effect
```css
.game-button {
    scale: 1 1;
    transition: scale 0.1s ease;
}
.game-button:active {
    scale: 0.95 0.95;
}
```

### Color Pulse
```css
.notification {
    background-color: rgb(60, 60, 60);
    transition: background-color 0.5s ease-in-out;
}
.notification.alert {
    background-color: rgb(200, 50, 50);
}
```

## Text Effects

### Rich Text Tags
Enable rich text on Labels to use inline formatting:

```xml
<engine:Label enable-rich-text="true"
    text="&lt;b&gt;Bold&lt;/b&gt; and &lt;i&gt;italic&lt;/i&gt; and &lt;color=#ff0000&gt;red&lt;/color&gt;" />
```

Supported tags: `<b>`, `<i>`, `<color=#hex>`, `<size=20>`, `<u>`, `<s>`, `<mark>`, `<link>`, etc.

### Link Tags (Clickable Text)

```xml
<engine:Label enable-rich-text="true" selectable="true" class="link-label"
    text="Click &lt;link=&quot;1&quot;&gt;&lt;color=#40a0ff&gt;&lt;u&gt;here&lt;/u&gt;&lt;/color&gt;&lt;/link&gt;" />
```

```csharp
label.RegisterCallback<PointerUpLinkTagEvent>(evt =>
{
    var linkID = int.Parse(evt.linkID);
    // Handle link click based on ID
    Application.OpenURL(urls[linkID]);
});

// Optional: change cursor on hover
label.RegisterCallback<PointerOverLinkTagEvent>(_ =>
    label.AddToClassList("link-cursor"));
label.RegisterCallback<PointerOutLinkTagEvent>(_ =>
    label.RemoveFromClassList("link-cursor"));
```

### Text Vertex Animation (Advanced)

Animate individual text glyphs using `PostProcessTextVertices`:

```csharp
label.PostProcessTextVertices += glyphs =>
{
    int count = 0;
    foreach (var glyph in glyphs)
    {
        if (count++ >= animatedGlyphCount) break;
        var verts = glyph.vertices;
        for (int i = 0; i < verts.Length; i++)
        {
            var v = verts[i];
            var tint = v.tint;
            tint.a = (byte)(isRevealing ? 255 : 0);
            v.tint = tint;
            verts[i] = v;
        }
    }
};
```

## Custom Filters (Shader Effects)

Unity 6 supports custom USS filters via FilterFunctionDefinition assets:

```css
.swirl-effect {
    filter: filter("SwirlFilter/SwirlFilterFunction.asset" 58.9 2.3);
}
```

This requires creating a shader, material, and FilterFunctionDefinition asset — an advanced topic
for custom visual effects applied to UI elements.

## Performance Tips

- Use `transition-property` to specify exactly which properties transition (avoid animating all)
- Prefer `translate`, `scale`, `rotate` over `left`/`top`/`width`/`height` for movement
- Set `UsageHints.DynamicTransform` on frequently moving elements
- Avoid transitioning `width`/`height` on complex layouts (causes expensive relayout)
- Use `opacity` for fade effects (GPU-accelerated)

## Reference Examples

For complete working examples, see `references/examples.md` in this skill directory.
It contains:
- Basic CSS transitions with hover pseudo-class
- Transition event lifecycle (Run, Start, End, Cancel)
- Looping animations (yo-yo and A-to-B patterns)
- Per-glyph text animation with PostProcessTextVertices
- Link tags with clickable rich text
- Custom USS filter (swirl shader effect)
