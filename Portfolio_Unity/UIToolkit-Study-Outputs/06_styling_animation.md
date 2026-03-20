# Styling & Animation Patterns

## USS Transitions
- Transitions animate CSS properties when they change state (e.g., hover, active, or class toggle via C#).
- Apply transitions in USS directly:
```css
.animated-button {
    background-color: #333;
    transition-property: background-color, scale;
    transition-duration: 0.2s, 0.3s;
    transition-timing-function: ease-in-out;
}
.animated-button:hover {
    background-color: #666;
    scale: 1.1;
}
```

## Transition Events
- When transitions complete or start, you can capture events in C# using `TransitionStartEvent`, `TransitionEndEvent`, and `TransitionCancelEvent`.
- Example:
```csharp
var button = root.Q<Button>("animated-button");
button.RegisterCallback<TransitionEndEvent>(evt => {
    // Check which property finished transitioning
    if (evt.stylePropertyNames.Contains("background-color")) {
        Debug.Log("Background color transition finished.");
    }
});
```

## Looping Animations
- Use Unity's `experimental.animation` API or manually trigger transitions with a `schedule.Execute` loop.
- A basic method is toggling a CSS class on `TransitionEndEvent` to restart it or using keyframes (if supported) via experimental animation.
- A robust C# approach:
```csharp
var element = root.Q<VisualElement>("bouncing-box");
element.experimental.animation.Position(new Vector3(100, 0, 0), 1000).Ease(Easing.Linear);
```

## Text Effects & Animation
- To animate text, typically use `schedule.Execute` to change the text content frame-by-frame (e.g., a typewriter effect).
- Use `element.schedule.Execute(Action).Every(milliseconds)` to control timing.
```csharp
var textLabel = root.Q<Label>("typewriter");
string fullText = "Hello, world!";
int currentIndex = 0;
textLabel.schedule.Execute(() => {
    if (currentIndex <= fullText.Length) {
        textLabel.text = fullText.Substring(0, currentIndex);
        currentIndex++;
    }
}).Every(50);
```

## Advanced Visual Effects (Custom Style)
- Custom visual effects often require a custom control overriding `GenerateVisualContent` to draw complex shapes with the `MeshGenerationContext`.
- For simpler effects like drop shadows, use `text-shadow` or pseudo-elements (`::before`/`::after` equivalents in USS, if supported, though generally, create extra nested UXML elements).
- `translate`, `rotate`, and `scale` are the primary transform properties for visual manipulation without affecting layout.

## Gotchas and Best Practices
- Never use `transform.position` or Unity `Transform` components to animate UI Toolkit elements. Use `translate` or `style.left`/`style.top` depending on if layout flow should be respected.
- Avoid animating layout properties (`width`, `height`, `margin`) if possible, as it forces layout recalculation. Prefer `scale` or `translate` for performance.
- Use `experimental.animation` API for complex sequencing in C#.
- Keep animations lightweight, especially on mobile.
