---
name: uitoolkit-styling-animation
description: Core skill for animating and adding visual effects to Unity 6 UI Toolkit. Make sure to use this skill when asked to add CSS transitions, animate properties like color/scale, loop animations, or create typewriter text effects. DO NOT animate GameObjects or transform.position for UI Toolkit elements. Use USS transitions or experimental.animation.
---

# Unity 6 UI Toolkit Styling & Animation

This skill covers how to add motion and visual flair to your UI Toolkit runtime interfaces using CSS transitions, C# transition events, and the `experimental.animation` API.

## Trigger Conditions
- Use when requested to make an element "fade in", "slide out", "bounce", or "pulse".
- Use when asked to create a "typewriter" effect on text.
- Use when dealing with hover states, active states, and focus states.
- Use when the prompt mentions "Transition", `experimental.animation`, or "USS Animation".

## 1. USS Transitions (CSS Patterns)
The most performant and common way to animate UI Toolkit elements is using standard CSS `transition` properties.

### Define the Base State and the Transition rules
In your base USS class, specify which properties to animate (`transition-property`), how long they take (`transition-duration`), and the easing curve (`transition-timing-function`).
```css
.animated-button {
    background-color: var(--color-surface);
    color: var(--color-text);
    scale: 1;
    /* Define the transition on the base class, NOT the hover state */
    transition-property: background-color, scale;
    transition-duration: 0.2s, 0.3s;
    transition-timing-function: ease-in-out, ease-out-back;
}
```

### Define the Target State
When the element enters a new state (e.g., `:hover`, `:active`, or a class added via C#), UI Toolkit automatically interpolates between the base state and the target state.
```css
/* Pseudo-classes for interactions */
.animated-button:hover {
    background-color: var(--color-primary);
    scale: 1.1; /* Scale is much better for performance than animating width/height */
}

.animated-button:active {
    background-color: var(--color-secondary);
    scale: 0.95;
    transition-duration: 0.1s; /* Faster response on click */
}

/* C# controlled state */
.animated-button.is-disabled {
    opacity: 0.5;
}
```

## 2. Transition Events in C#
You can listen for transition completion in C# to chain animations or trigger logic.

```csharp
using UnityEngine.UIElements;

public class AnimationController : MonoBehaviour
{
    private Button _myButton;

    void OnEnable()
    {
        var root = GetComponent<UIDocument>().rootVisualElement;
        _myButton = root.Q<Button>("animated-button");

        // Listen for the end of any transition on this element
        _myButton.RegisterCallback<TransitionEndEvent>(OnTransitionEnd);
    }

    private void OnTransitionEnd(TransitionEndEvent evt)
    {
        // Check which specific CSS property finished animating
        if (evt.stylePropertyNames.Contains("background-color"))
        {
            Debug.Log("Background color transition completed!");
        }
    }
}
```

## 3. Looping Animations (`experimental.animation`)
For complex sequencing or infinite loops (like a pulsing loading spinner), use the C# `experimental.animation` API.

```csharp
using UnityEngine.UIElements;

// Example: Pulse an element's scale infinitely
public void StartPulsing(VisualElement element)
{
    // Animate scale from 1 to 1.2 over 500ms, linear easing
    element.experimental.animation.Scale(1.2f, 500)
        .Ease(Easing.Linear)
        .OnCompleted(() =>
        {
            // Reverse animation
            element.experimental.animation.Scale(1f, 500)
                .Ease(Easing.Linear)
                .OnCompleted(() => StartPulsing(element)); // Loop
        });
}
```

## 4. Text Typewriter Effect (Scheduling)
To animate text appearing character by character, use `schedule.Execute`.

```csharp
using UnityEngine.UIElements;

public class TypewriterEffect : MonoBehaviour
{
    private Label _dialogueLabel;
    private string _fullText = "Hello, adventurer. Welcome to the kingdom!";
    private int _currentIndex = 0;
    private IVisualElementScheduledItem _typewriterTask;

    public void StartTyping(Label label)
    {
        _dialogueLabel = label;
        _dialogueLabel.text = "";
        _currentIndex = 0;

        // Execute every 50ms
        _typewriterTask = _dialogueLabel.schedule.Execute(TypeNextCharacter).Every(50);
    }

    private void TypeNextCharacter()
    {
        if (_currentIndex < _fullText.Length)
        {
            _dialogueLabel.text += _fullText[_currentIndex];
            _currentIndex++;
        }
        else
        {
            // Stop the task when finished
            _typewriterTask?.Pause();
        }
    }
}
```

## Best Practices & Gotchas
- **Performance**: Avoid animating layout properties like `width`, `height`, `margin`, or `padding` if possible, as they force layout recalculation for the entire tree. Prefer animating `scale`, `translate`, `rotate`, `opacity`, and `background-color`.
- **`translate` vs `top/left`**: Use `translate` for smooth positional animations. Only use `top`/`left` (absolute positioning) for static layout placement, as `translate` is GPU-accelerated.
- **Never `transform.position`**: Never attempt to animate `Transform` components of GameObjects to move UI Toolkit elements. They are completely separate rendering systems.
- **Transitions on Base**: Define `transition-property` and `transition-duration` on the *base* class, not the `:hover` class. If defined on the hover class, the transition only applies when entering hover, but snaps back instantly when leaving.

## File References
- Explore `Assets/UIToolkit-Manual-Examples/create-a-transition/`
- Explore `Assets/UIToolkit-Manual-Examples/transition-events-example/`
- Explore `Assets/UIToolkit-Manual-Examples/text-animation-example/`
