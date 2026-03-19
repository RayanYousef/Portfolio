# Custom Controls Patterns

## Custom VisualElement Creation
- Subclass `VisualElement` or a specific control like `BaseField<T>` to create custom controls.
- To expose custom attributes in UXML, use `UxmlTraits`.
- For Unity 6, `UxmlTraits` is giving way to direct attribute generation in some cases, but the standard way remains:

```csharp
[UxmlElement]
public partial class SlideToggle : VisualElement
{
    // Define a public property
    [UxmlAttribute("value")]
    public bool value { get; set; }
}
```

## Bindable Custom Controls
- To make a control bindable, implement `INotifyValueChanged<T>` and expose `value`.
- Inheriting from `BaseField<T>` automatically provides binding capabilities and layout features (like a label).
- Example:
```csharp
[UxmlElement]
public partial class SlideToggle : BaseField<bool>
{
    public SlideToggle() : base("Slide Toggle", null) { }

    public override void SetValueWithoutNotify(bool newValue)
    {
        base.SetValueWithoutNotify(newValue);
        // Update visual state here based on newValue
    }
}
```

## Custom Style Integration
- Load custom USS dynamically in the constructor to ensure styling is applied when the element is instantiated in C# or UXML.
```csharp
var styleSheet = Resources.Load<StyleSheet>("SlideToggleStyle");
styleSheets.Add(styleSheet);
AddToClassList("slide-toggle");
```

## Vector API Rendering
- To render custom shapes (like a Pie Chart or Radial Progress), override `generateVisualContent`.
- Use the `MeshGenerationContext` to draw complex geometry.

```csharp
protected void GenerateVisualContent(MeshGenerationContext context)
{
    float width = contentRect.width;
    float height = contentRect.height;

    var painter = context.painter2D;
    painter.strokeColor = Color.red;
    painter.lineWidth = 5.0f;
    painter.BeginPath();
    painter.Arc(new Vector2(width/2, height/2), width/2, 0, 360);
    painter.Stroke();
}
```

## Advanced Interactions
- Use `RegisterCallback` in the constructor for interactions:
```csharp
RegisterCallback<ClickEvent>(evt => value = !value);
```
- Implement states (e.g., hover, active) with USS pseudo-classes like `:hover`, `:active`.

## Gotchas and Best Practices
- Always clean up visual state and callbacks when modifying properties.
- Don't hardcode sizes; use `style.width` and `style.height` mapped to variables.
- Ensure `UxmlTraits` initialization matches expected types (e.g., parsing strings to floats for attributes).
- Avoid `OnGUI` style rendering; exclusively use `MeshGenerationContext` for custom drawing.
