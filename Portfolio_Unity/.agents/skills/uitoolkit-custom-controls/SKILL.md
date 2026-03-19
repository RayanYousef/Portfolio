---
name: uitoolkit-custom-controls
description: Core skill for creating custom VisualElements in Unity 6 UI Toolkit. Make sure to use this skill when asked to create a new control type (e.g., a slider, a custom button), expose UXML attributes, handle custom drawing using the Vector API (MeshGenerationContext), or load custom USS dynamically. Relies on 'uitoolkit-binding' if the control needs to support data binding.
---

# Unity 6 UI Toolkit Custom Controls

This skill explains how to build reusable UI components by subclassing `VisualElement` or `BaseField<T>`, exposing them to UXML, and implementing custom rendering using the Vector API.

## Trigger Conditions
- Use when asked to create a new UI element that doesn't exist built-in (e.g., a pie chart, a radial progress bar, a complex custom toggle).
- Use when requested to make a custom control bindable.
- Use when the prompt mentions `[UxmlElement]`, `[UxmlAttribute]`, `BaseField`, or `MeshGenerationContext`.

## 1. Subclassing VisualElement (Unity 6 Pattern)
In Unity 6, `UxmlTraits` is giving way to direct attribute generation via `[UxmlElement]` and `[UxmlAttribute]` on C# 9+ properties. This drastically simplifies custom control creation.

```csharp
using UnityEngine.UIElements;

// The [UxmlElement] attribute makes it available in the UI Builder and UXML
[UxmlElement]
public partial class CustomBadge : VisualElement
{
    // The [UxmlAttribute] exposes this property to UXML
    [UxmlAttribute("badge-text")]
    public string BadgeText { get; set; }

    [UxmlAttribute("is-active")]
    public bool IsActive { get; set; }

    public CustomBadge()
    {
        // Add a standard class for styling via 'uitoolkit-design-system'
        AddToClassList("custom-badge");

        // Add a default label
        var label = new Label("Badge");
        label.name = "badge-label";
        Add(label);

        // Load custom styles dynamically (optional, usually preferred to use TSS)
        // var styleSheet = Resources.Load<StyleSheet>("CustomBadgeStyle");
        // styleSheets.Add(styleSheet);
    }
}
```

### Usage in UXML
```xml
<ui:UXML xmlns:ui="UnityEngine.UIElements" xmlns:my="MyProjectNamespace">
    <my:CustomBadge badge-text="New!" is-active="true" />
</ui:UXML>
```

## 2. Bindable Custom Controls (`BaseField<T>`)
If your control represents a value that should interact with the Runtime Data Binding system, inherit from `BaseField<T>` and implement `INotifyValueChanged<T>`.

```csharp
using UnityEngine.UIElements;

[UxmlElement]
public partial class CustomToggle : BaseField<bool>
{
    // The constructor must call the base constructor with a label string and a visual input element (optional)
    public CustomToggle() : base("Custom Toggle", null)
    {
        AddToClassList("custom-toggle");
    }

    // Override SetValueWithoutNotify to update the visual state when the value changes
    public override void SetValueWithoutNotify(bool newValue)
    {
        base.SetValueWithoutNotify(newValue);

        // Update visual state based on newValue (e.g., toggle a USS class)
        if (newValue)
        {
            AddToClassList("custom-toggle--on");
            RemoveFromClassList("custom-toggle--off");
        }
        else
        {
            AddToClassList("custom-toggle--off");
            RemoveFromClassList("custom-toggle--on");
        }
    }
}
```

## 3. Custom Rendering via Vector API (`MeshGenerationContext`)
For shapes that cannot be built with standard Flexbox layout and USS (e.g., pie charts, arcs, polygons), override `generateVisualContent` to draw geometry directly.

```csharp
using UnityEngine;
using UnityEngine.UIElements;

[UxmlElement]
public partial class RadialProgress : VisualElement
{
    [UxmlAttribute("progress")]
    public float Progress { get; set; } = 0.5f;

    public RadialProgress()
    {
        // Tell UI Toolkit to call GenerateVisualContent when this element needs rendering
        generateVisualContent += GenerateVisualContent;
    }

    private void GenerateVisualContent(MeshGenerationContext context)
    {
        float width = contentRect.width;
        float height = contentRect.height;
        float radius = Mathf.Min(width, height) / 2f - 5f; // -5f for stroke padding
        Vector2 center = new Vector2(width / 2f, height / 2f);

        var painter = context.painter2D;

        // Draw background track
        painter.strokeColor = new Color(0.2f, 0.2f, 0.2f); // Ideally use USS variables via style properties
        painter.lineWidth = 10f;
        painter.BeginPath();
        painter.Arc(center, radius, 0, 360);
        painter.Stroke();

        // Draw progress arc
        painter.strokeColor = Color.green; // Ideally use var(--color-success)
        painter.BeginPath();
        painter.Arc(center, radius, -90, -90 + (Progress * 360));
        painter.Stroke();
    }
}
```

## Best Practices & Gotchas
- **Partial Classes**: Unity 6's source generators require `partial` on the class definition for `[UxmlElement]` to work.
- **Never `OnGUI`**: Never use legacy `IMGUI` methods for drawing inside UI Toolkit. Always use `MeshGenerationContext`.
- **Styling**: Even if the control draws itself, it should respect CSS variables. You can read current style values (e.g., `resolvedStyle.color`) inside `GenerateVisualContent` to ensure it matches the `uitoolkit-design-system`.
- **Value Synchronization**: Always call `base.SetValueWithoutNotify(newValue)` inside custom implementations to ensure binding systems stay synchronized.

## File References
- Explore `Assets/UIToolkit-Manual-Examples/create-bindable-custom-control/`
- Explore `Assets/UIToolkit-Manual-Examples/radial-progress-vector-api/`
